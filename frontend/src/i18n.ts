import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

export enum Language {
    English = 'en',
    Spanish = 'es'
}

i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
        escapeValue: false
    },
    backend: {
      requestOptions: {
        cache: 'no-cache',
      }
    }
});

export const LANGUAGE_MAP: Record<string, string> = {
    'en': 'English',
    'en-US': 'English',
    'en-UK': 'English',
    'es': 'Español',
    'es-MX': 'Español',
    'es-SP': 'Español',
}

export default i18n;