import { createContext } from 'react';
import EditorClient from './client';

export const LoginContext = createContext(null);

export const EditorClientContext = createContext<EditorClient | null>(null);