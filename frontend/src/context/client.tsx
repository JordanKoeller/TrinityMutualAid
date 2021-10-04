import { Auth } from 'aws-amplify';
import axios, { AxiosRequestConfig, AxiosInstance} from 'axios';

const handleError = (e: any) => console.error(JSON.stringify(e, null, 2));

const editorAuthenticationInterceptor = async (config: AxiosRequestConfig ) => {
  const newConfig = { ...config };
  try {
    const session = await Auth.currentSession();
    const token = session.getIdToken().getJwtToken();

    if (token) {
      console.log("I have a token");
      newConfig.headers.Authorization = token;
    }
  } catch (e) {
    console.log('EditorAutneitcationInterceptor: Not logged in', e);
  }

  return newConfig;
};

export default class EditorClient {

  client: AxiosInstance;
  constructor(baseURL: string) {
    const client = axios.create({baseURL});
    client.interceptors.request.use(editorAuthenticationInterceptor, e => Promise.reject(e));
    this.client = client;
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
}