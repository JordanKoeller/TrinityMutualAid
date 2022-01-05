import { useState, useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify';
import axios, { AxiosRequestConfig, AxiosInstance} from 'axios';
import { convertToRaw, RawDraftContentState } from 'draft-js';
import { dataUrlToFile } from '../utilities/funcs';
import { Language } from '../i18n';
import { ArticleDescription } from '../utilities/types';

const handleError = (e: any) => console.error(JSON.stringify(e, null, 2));

const editorAuthenticationInterceptor = async (config: AxiosRequestConfig ) => {
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
    const client = axios.create({baseURL});
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

  async uploadImage(img: File): Promise<{ data: { link: string}}> {
    const extension = img.name.split('.').pop();
    const blobData = new Blob([new Uint8Array(await img.arrayBuffer())], {type: 'image/'+extension})
    const response = await this.client.get(
      `${this.domain}/file-upload?extension=${extension}`);
    if (response.status === 200) {
      const {uploadURL, imagePath}: {uploadURL: string, imagePath: string} = response.data;
      await fetch(uploadURL, {method: 'PUT', body: blobData});
      return {data: {link: imagePath}};
    }
    return {data: {link: 'image'}};
  }

  async uploadArticle(editorState: ArticleDescription) {
      const rawElements = editorState.blocks.map(block => convertToRaw(block.editorState.getCurrentContent()));
      await Promise.all(rawElements.map(elem => this.extractAndUploadImages(elem)));
    const body = {
        content: rawElements,
        title: "My cool new page",
        articleType: "news",
        language: editorState.language,
    };
    const response = await this.client.put(
        `${this.domain}/article`,
        body
    );
    if (response.status !== 200) {
        alert(`Upload Failed!\n${response.data}`);
    }
  }

  private async extractAndUploadImages(state: RawDraftContentState): Promise<void> {
      state.entityMap = Object.fromEntries(await Promise.all(
        Object.entries(state.entityMap).map(async ([k, v]) => {
            if (v.type === 'IMAGE') {
                const dataLink = await this.uploadImage(dataUrlToFile(v.data.src));
                v.data.src = dataLink.data.link;
            }
            return [k, v];
        })
      ));

  }

}

export const useEditorClient = () => {
  const [client, setClient] = useState<EditorClient>(new EditorClient(process.env.REACT_APP_REST_API as string, ""));
  useEffect(() => {
    Hub.listen('auth', ({payload: {event, data}}) => {
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