import { useState, useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify';
import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import { convertToRaw, } from 'draft-js';
import { getHashFromBlob, resizeImage } from '../utilities/funcs';
import { ArticleDescription } from '../utilities/types';
import { getBlockEditor } from '../components/Wyswig/Blocks/EditorBlockRegistry';

const handleError = (e: any) => console.error(JSON.stringify(e, null, 2));

const editorAuthenticationInterceptor = async (config: AxiosRequestConfig) => {
    const newConfig = { ...config };
    try {
        const session = await Auth.currentSession();
        const token = session.getIdToken().getJwtToken();

        if (token) {
            newConfig.headers.Authorization = token;
        }
    } catch (e) {
    }

    return newConfig;
};

export default class EditorClient {

    client: AxiosInstance;
    token: string;
    domain: string;

    constructor(baseURL: string, token: string) {
        const client = axios.create({ baseURL });
        client.interceptors.request.use(editorAuthenticationInterceptor, e => Promise.reject(e));
        this.client = client;
        this.token = token;
        this.domain = process.env.REACT_APP_REST_API as string;
    }

    loggedIn(): boolean {
        return this.token !== "";
    }

    async Hello() {
        try {
            const response = await this.client.get(
                `/hello`,
            );
            return response.data.recipeRequest;
        } catch (e: any) {
            handleError(e.response);
            return null;
        }
    }

    async uploadArticle(article: ArticleDescription[], articleId?: number): Promise<number> {
        const serial = await Promise.all(article.map(descriptor => this.serializeArticle(descriptor)));
        const uploadUrls: string[] = Array.from(new Set([...serial[0].imageUploadUrls, ...serial[1].imageUploadUrls]));
        const body = {
            serialized: {article: serial.map(article => article.serialized), articleType: 'news'},
            imageUploadUrls: uploadUrls
        };
        if (articleId) {
            const url = `${this.domain}/article/${articleId}`;
            const response = await this.client.patch(
                url,
                body
            );
            if (response.status !== 200) {
                alert(`Upload Failed!\n${response.data}`);
            }
            return response.data.id as number;
        } else {
            const url = `${this.domain}/article`;
            const response = await this.client.put(
                url,
                body
            );
            if (response.status !== 200) {
                alert(`Upload Failed!\n${response.data}`);
            }
            return response.data.id as number;
        }
    }

    private async uploadImageFile(rawImg: File): Promise<{ data: { link: string } }> { // TODO: Confirm interface with file-upload.ts is unified. Also filter out to only distinct filenames/hashes.
        const img = await resizeImage(rawImg, 800);
        const extension = img.name.split('.').pop();
        const blobData = new Blob([new Uint8Array(await img.arrayBuffer())], { type: 'image/' + extension });
        const fileHash = await getHashFromBlob(blobData);
        const filename = `${fileHash}.${extension}`;
        const response = await this.client.get(
            `${this.domain}/file-upload?filename=${filename}`);
        if (response.status === 200) {
            const { uploadURL, imagePath }: { uploadURL: string, imagePath: string } = response.data;
            await fetch(uploadURL, { method: 'PUT', body: blobData });
            return { data: { link: imagePath } };
        }
        return { data: { link: 'image' } };
    }
    async uploadImageString(dataUrl: string): Promise<{ data: { link: string } }> {
        const blob = await (await fetch(dataUrl)).blob();
        const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
        const file = new File([blob], mimeString, {type:"image/jpeg", lastModified: Date.now()});
        return await this.uploadImageFile(file);
    }

    private async uploadAllImages(imageRecord: Record<string, File>): Promise<Record<string, string>> {
        const uploadPromises = Object.keys(imageRecord).map(async key => {
            const uploadReceipt = await this.uploadImageFile(imageRecord[key]);
            return [key, uploadReceipt.data.link];
        });
        return Object.fromEntries((await Promise.all(uploadPromises)));
    }

    /*
    1. For-loop through, create record of filename -> File from the articles.
    2. Send them all off for upload, constructing a hashmap of filename -> url
    3. For-loop through, replacing previous files with the new urls.
    */

    private async serializeArticle(description: ArticleDescription): Promise<any> {
        const imageMap: Record<string, File> = {};
        // First I generate my imageMap
        description.blocks.forEach(block => {
            const blockEditor = getBlockEditor(block.blockType);
            if (blockEditor.scrubImages) {
                blockEditor.scrubImages(block, imageMap);
            }
        });
        const filenameToUrls = await this.uploadAllImages(imageMap);
        description.blocks.forEach(block => {
            const blockEditor = getBlockEditor(block.blockType);
            if (blockEditor.replaceImages) {
                blockEditor.replaceImages(block, filenameToUrls);
            }
        });
        const imageUploadUrls = [...Object.values(filenameToUrls)];
        // Then I grab convert to raw data, and grab all the images from the draft-js RawEditorStates.
        const rawified = {
            ...description,
            blocks: description.blocks.map(block => ({...block, editorState: convertToRaw(block.editorState.getCurrentContent())}))
        };
        return {
            serialized: rawified,
            imageUploadUrls,
        }
    }
}

export const useEditorClient = () => {
    const [client, setClient] = useState<EditorClient>(new EditorClient(process.env.REACT_APP_REST_API as string, ""));
    useEffect(() => {
        Hub.listen('auth', ({ payload: { event, data } }) => {
            switch (event) {
                case 'signIn':
                case 'cognitoHostedUI':
                    Auth.currentUserInfo().then(info => {
                        setClient(
                            new EditorClient(process.env.REACT_APP_REST_API as string, info)
                        );
                    }).catch(err => {
                        console.error(err);
                        setClient(
                            new EditorClient(process.env.REACT_APP_REST_API as string, "")
                        )
                    });
                    break;
                case 'signOut':
                    setClient(
                        new EditorClient(process.env.REACT_APP_REST_API as string, "")
                    )
            }
        })
        Auth.currentSession().then(session => {
            const token = session.getIdToken().getJwtToken();
            setClient(new EditorClient(process.env.REACT_APP_REST_API as string, token));
        }).catch(err => {
            setClient(new EditorClient(process.env.REACT_APP_REST_API as string, ''));
        })
    }, []);
    return client;
}