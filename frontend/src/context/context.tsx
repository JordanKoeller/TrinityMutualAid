import { createContext } from 'react';
import EditorClient from './client';

export const LoginContext = createContext(null);

export const EditorClientContext = createContext<EditorClient>(new EditorClient(process.env.REACT_APP_REST_API as string, ""));