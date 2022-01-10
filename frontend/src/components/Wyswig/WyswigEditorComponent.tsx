import { createEditorStateWithText } from '@draft-js-plugins/editor';
import { EditorState } from 'draft-js';
import React, { useReducer, useCallback, useContext, useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { EditorClientContext } from '../../context/context';
import { Language } from '../../i18n';
import { fetchArticle } from '../../utilities/hooks';
import { ArticleDescription, EditorBlock } from '../../utilities/types';
import { WyswigArticle, } from './WyswigBlockEditorComponent';
import { WyswigControlButtons } from './WyswigLanguageSelector';


enum EditorActionType {
    MutateEditorState,
    AddBlock,
    RemoveBlock,
    ChangeLanguage,
    ClearState,
    InjectArticle,
}

interface EditorProps {
    language?: Language,
    articleId?: number,
    onSave?: (articleId: number) => void,

}

export const WyswigEditorComponent: React.FC<EditorProps> = ({ language = Language.English, articleId, onSave }) => {
    const client = useContext(EditorClientContext);
    const [editorState, blockChangeDispatch, dispatch, getDescriptions] = useEditorComponentState(language, articleId);
    const [isPreview, setIsPreview] = useState(false);

    const requestSave = async () => {
        if (articleId) {
            await client.uploadArticle(getDescriptions(), articleId as number);
            if (onSave) onSave(articleId as number);
        } else {
            const aid = await client.uploadArticle(getDescriptions());
            if (onSave) onSave(aid);
        }
    }

    return <>
        <WyswigControlButtons
            onTogglePreview={setIsPreview}
            defaultLanguage={language}
            onLanguageChange={(lang) => dispatch({ type: EditorActionType.ChangeLanguage, payload: lang })}
            onSave={requestSave}
            onCancel={() => dispatch({ type: EditorActionType.ClearState })}
        />
        <WyswigArticle
            state={editorState}
            readOnly={isPreview}
            onChange={blockChangeDispatch}
            Suffix={<Button variant="primary" size="lg" onClick={() => dispatch({ type: EditorActionType.AddBlock })}>
                Add Block
            </Button>}
        />
    </>
}


//////////////////////////////////////////////
//    Editor Component Statefulness management
//////////////////////////////////////////////









interface EditorComponentAction {
    type: EditorActionType,
    payload?: any,
}

interface EditorReducerState {
    chosenLanguage: Language,
    editorStates: Record<Language, EditorBlock[]>,
}

type EditorStateReturnType =
[ArticleDescription, (state: EditorState, index: number) => void, React.Dispatch<EditorComponentAction>, () => ArticleDescription[]];

const useEditorComponentState = (language: Language, articleId?: number): EditorStateReturnType => {
    const [state, dispatch] = useReducer(editorComponentStateReducer, initialState(language));
    const blockChangeDispatch = useCallback((state: EditorState, index: number) =>
        dispatch({ type: EditorActionType.MutateEditorState, payload: { index, editorState: state } }),
        [dispatch]);

    useEffect(() => {
        if (articleId) {
            Promise.all([
                fetchArticle(articleId, Language.English),
                fetchArticle(articleId, Language.Spanish),
            ]).then(descriptors => {
                dispatch({
                    type: EditorActionType.InjectArticle,
                    payload: descriptors
                });
            });
            // fetchArticle(articleId, language).then(description => {
            //     dispatch({
            //         type: EditorActionType.InjectArticle,
            //         payload: description
            //     });
            // });
        }
    }, [articleId, language]);

    const currentDescription: ArticleDescription = {
        blocks: state.editorStates[state.chosenLanguage],
        language: state.chosenLanguage,
    }
    const getDescriptions = (): ArticleDescription[] => Object.keys(state.editorStates)
        .map(lang => ({
            language: lang as Language,
            blocks: state.editorStates[lang as Language]
        }));
    return [currentDescription, blockChangeDispatch, dispatch, getDescriptions];
}


const editorComponentStateReducer = (state: EditorReducerState, action: EditorComponentAction): EditorReducerState => {
    switch (action.type) {
        case EditorActionType.AddBlock: return {
            ...state,
            editorStates: {
                ...state.editorStates,
                [state.chosenLanguage]: [
                    ...state.editorStates[state.chosenLanguage],
                    initializeNewEditorState(state.chosenLanguage),
                ]
            }
        }
        case EditorActionType.MutateEditorState: {
            const nextState = {
                ...state,
            }
            nextState.editorStates[state.chosenLanguage][action.payload.index].editorState = action.payload.editorState;
            return nextState;
        }
        case EditorActionType.ChangeLanguage: return {
            ...state,
            chosenLanguage: action.payload,
        };
        case EditorActionType.InjectArticle: {
            const payload = action.payload as ArticleDescription[];
            return {
                ...state,
                editorStates: Object.fromEntries(payload.map(descriptor => [
                    descriptor.language,
                    descriptor.blocks
                ])) as Record<Language, EditorBlock[]>
            }
        }
        default:
            return state;
    }
}

const initializeNewEditorState = (lang: Language): EditorBlock => {
    const defaultStates = {
        [Language.English]: 'Enter text here',
        [Language.Spanish]: 'Introducir texto aquí',
    };
    return { editorState: createEditorStateWithText(defaultStates[lang]) };
}

const initialState = (language: Language): EditorReducerState => {
    return {
        chosenLanguage: language,
        editorStates: {
            [Language.English]: [initializeNewEditorState(Language.English)],
            [Language.Spanish]: [initializeNewEditorState(Language.Spanish)],
        }
    }
}