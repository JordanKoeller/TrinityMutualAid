import { convertFromRaw, EditorState, RawDraftContentState } from "draft-js";
import { useEffect, useState, useCallback, useReducer } from "react";
import { useTranslation } from "react-i18next";
import { Language } from "../i18n";
import { ArticleDescription, EditorBlock } from "./types";


export enum MediaQuery {
    XS = 0,
    SM = 1,
    MD = 2,
    LG = 3,
    XL = 4,
    XXL = 5,
}

const BREAKPOINTS: [MediaQuery, number][] = [
    [MediaQuery.XS, 576],
    [MediaQuery.SM, 768],
    [MediaQuery.MD, 992],
    [MediaQuery.LG, 1200],
    [MediaQuery.XL, 1400],
    [MediaQuery.XXL, 1000000000], // Infinty.
]

const getSz = (w: number): MediaQuery => {
    for (let i = 0; i < BREAKPOINTS.length; i++) {
        if (w < BREAKPOINTS[i][1]) return BREAKPOINTS[i][0];
    }
    return BREAKPOINTS[BREAKPOINTS.length - 1][0];
}

export const useWindowWidth = (): number => {
    const [state, setState] = useState<number>(window.innerWidth);
    useEffect(() => {
        const updater = () => {
            const sz = window.innerWidth;
            if (sz !== state) {
                setState(sz);
            }
        }
        window.addEventListener('resize', updater);
        return () => window.removeEventListener('resize', updater);
    });
    return state;
}



export const useMediaQuery = (): MediaQuery => {
    const [state, setState] = useState<MediaQuery>(getSz(window.innerWidth));
    useEffect(() => {
        const updater = () => {
            const sz = getSz(window.innerWidth);
            if (sz !== state) {
                setState(sz);
            }
        }
        window.addEventListener('resize', updater);
        return () => window.removeEventListener('resize', updater);
    });
    return state;
}

export enum BreakpointLocation {
    GTE = 0,
    LT = 1,
    Unknown
}

const getBreaking = (refpoint: number) => {
    if (window.innerWidth < refpoint) return BreakpointLocation.LT;
    return BreakpointLocation.GTE;
}
// Returns the window's current relative position to the specified breakpoint,
// as well as a method to change the value of the breakpoint to use.
export const useWindowBreakpoint = (initialBreakpoint: number | null): [BreakpointLocation, (v: number | null) => void] => {
    const [breakpoint, setBreakpoint] = useState(initialBreakpoint);
    const [breakState, setBreakState] = useState(BreakpointLocation.Unknown);
    useEffect(() => {
        const listener = () => {
            if (breakpoint !== null) {
                setBreakState(getBreaking(breakpoint));
            } else {
                setBreakState(BreakpointLocation.Unknown);
            }
        }
        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    }, [breakpoint, setBreakState]);
    return [breakState, setBreakpoint];
}

export const useCurrentLanguage = (): string => {
    const {i18n} = useTranslation(undefined, {useSuspense: false});
    return i18n.language ? i18n.language.slice(0, 2) : 'en';
}



type BilingualOutput<T> = [
    T,
    Language,
    (value: T) => void,
    (lang: Language) => void,
    (lang: Language, value: T) => void,
];

type BilingualState<T> = {selectedLanguage: Language, values: Record<Language, T>};
type ReducerAction<T> = {
    type: 'Language' | 'State' | 'LangAndState',
    payload: Language | T | {language: Language, value: T}
}
type ReducerType<T> = (state: BilingualState<T>, action: ReducerAction<T>) => BilingualState<T>;
const bilingualReducer = <T>(state: BilingualState<T>, action: ReducerAction<T>): BilingualState<T> => {
    switch (action.type) {
        case 'Language': return {
            selectedLanguage: action.payload as Language,
            values: {
                ...state.values,
            }
        };
        case 'State': return {
            selectedLanguage: state.selectedLanguage,
            values: {
                ...state.values,
                [state.selectedLanguage]: action.payload as T
            }
        }
        case 'LangAndState': return {
            selectedLanguage: (action.payload as {language: Language, value: T}).language,
            values: {
                ...state.values,
                [(action.payload as {language: Language, value: T}).language]: (action.payload as {language: Language, value: T}).value
            }
        }
        default: return state;
    }
}

/**
 * 
 * @param initialLanguage - Initial language to use for rendering.
 * @param defaults - Default value
 * @returns 
 */
export const useBilingual = <T>(initialLanguage: Language, defaults: Record<Language, T>): BilingualOutput<T> => {
    const initialState: BilingualState<T> = {
        selectedLanguage: initialLanguage,
        values: defaults,
    }
    const [state, dispatch] = useReducer(bilingualReducer as ReducerType<T>, initialState);

    const setLanguage = useCallback((lang: Language) => dispatch({type: 'Language', payload: lang}), [dispatch]);
    const setValue = useCallback((value: T) => dispatch({type: 'State', payload: value}), [dispatch]);
    const setBoth = useCallback((lang: Language, value: T) => dispatch({type: 'LangAndState', payload: value}), [dispatch]);

    return [state.values[state.selectedLanguage], state.selectedLanguage, setValue, setLanguage, setBoth];
}

const fetchArticle = async (articleId: number, language: Language): Promise<ArticleDescription> => {
     const domain = process.env.REACT_APP_REST_API as string
     const req = await fetch(`${domain}/${language}/article/${articleId}`, {method: 'GET'});
     const response = await req.json();
     const { url, author, timestamp }: { title: string, url: string, author: string, timestamp: number } = response;
     const s3Fetch = await fetch(url, {method: 'GET'});
     const content: RawDraftContentState[] = await s3Fetch.json();
     const editorBlocks = content.map(block => ({editorState: EditorState.createWithContent(convertFromRaw(block))}));
     return { blocks: editorBlocks, language, articleId, author, publicationDate: new Date(timestamp) }
 }
export const useArticleState = (articleId: number, language: Language): ArticleDescription | null => {

    const [state, setState] = useState<ArticleDescription | null>(null);

    useEffect(() => {
        fetchArticle(articleId, language).then(description => setState(description));
    }, [articleId, language]);

    return state;
}