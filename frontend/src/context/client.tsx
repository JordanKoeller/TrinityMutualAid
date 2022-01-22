import { useState, useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify';
import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import { convertToRaw, RawDraftContentState } from 'draft-js';
import { dataUrlToFile, resizeImage } from '../utilities/funcs';
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
        console.log('EditorAuthenticationInterceptor: Not logged in', e);
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
        console.log(body);
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

    private async uploadImageFile(rawImg: File): Promise<{ data: { link: string } }> {
        const img = await resizeImage(rawImg, 800);
        const extension = img.name.split('.').pop();
        const blobData = new Blob([new Uint8Array(await img.arrayBuffer())], { type: 'image/' + extension });
        const response = await this.client.get(
            `${this.domain}/file-upload?extension=${extension}`);
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

    private async serializeArticle(description: ArticleDescription): Promise<any> {
        const imageUploadUrls: string[] = [];
        // First I grab all the images from my custom block editors.
        await Promise.all(description.blocks.map(async block => {
            const blockEditor = getBlockEditor(block.blockType);
            if (blockEditor.scrubAndReplaceImages) {
                const imgs = await blockEditor.scrubAndReplaceImages(block, this);
                imgs.forEach(imgString => imageUploadUrls.push(imgString));
            }
        }));
        // Then I grab convert to raw data, and grab all the images from the draft-js RawEditorStates.
        const rawified = {
            ...description,
            blocks: description.blocks.map(block => ({...block, editorState: convertToRaw(block.editorState.getCurrentContent())}))
        };
        await Promise.all(rawified.blocks.map(block => this.extractAndUploadImages(block.editorState, imageUploadUrls)));
        return {
            serialized: rawified,
            imageUploadUrls,
        }
    }

    private async extractAndUploadImages(state: RawDraftContentState, imageUrlsArray: string[]): Promise<void> {
        state.entityMap = Object.fromEntries(await Promise.all(
            Object.entries(state.entityMap).map(async ([k, v]) => {
                if (v.type === 'IMAGE') {
                    const dataLink = await this.uploadImageFile(dataUrlToFile(v.data.src));
                    v.data.src = dataLink.data.link;
                    imageUrlsArray.push(dataLink.data.link);
                }
                return [k, v];
            })
        ));

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
            console.log("Setting token", token);
            setClient(new EditorClient(process.env.REACT_APP_REST_API as string, token));
        }).catch(err => {
            console.log("Unauthenticated");
            setClient(new EditorClient(process.env.REACT_APP_REST_API as string, ''));
        })
    }, []);
    return client;
}