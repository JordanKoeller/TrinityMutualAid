import React, { useReducer, useCallback, useEffect } from 'react';
import { Language } from '../../../i18n';
import { ArticleDescription } from '../../../utilities/types';
import { fetchArticle } from '../../../utilities/hooks';
import { createNewBlock } from './EditorBlockRegistry';
import { mapEntries } from '../../../utilities/funcs';
import { EditorBlock } from './EditorBlock';



export enum EditorActionType {
    MutateEditorState,
    AddBlock,
    RemoveBlock,
    InsertBlockAfter,
    MutateBlockType,
    ChangeLanguage,
    ClearState,
    InjectArticle,
    DoTemplateCopy
}


export interface EditorComponentAction {
    type: EditorActionType,
    payload?: any,
}

interface EditorReducerState {
    chosenLanguage: Language,
    editorStates: Record<Language, EditorBlock[]>,
}

type EditorStateReturnType =
    [ArticleDescription, (state: EditorBlock, index: number) => void, React.Dispatch<EditorComponentAction>, () => ArticleDescription[]];

export const useEditorComponentState = (language: Language, articleId?: number): EditorStateReturnType => {
    const [state, dispatch] = useReducer(editorComponentStateReducer, initialState(language));
    const blockChangeDispatch = useCallback((state: EditorBlock, index: number) =>
        dispatch({ type: EditorActionType.MutateEditorState, payload: { index, state, } }),
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
            editorStates: mapEntries(state.editorStates, ([lang, blocks]) => [lang, [...blocks, createNewBlock(action.payload as string, lang)]])
        }
        case EditorActionType.MutateEditorState: return {
                ...state,
                editorStates: mapEntries(
                    state.editorStates,
                    ([lang, blocks]) => {
                        const newBlocks = [...blocks];
                        if (lang === state.chosenLanguage) {
                            newBlocks[action.payload.index] = action.payload.state;
                        } else {
                            newBlocks[action.payload.index].data = action.payload.state.data;
                        }
                        return [lang, newBlocks];
                    }
                )
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
        };
        case EditorActionType.InsertBlockAfter: {
            const {blockType, index}: {blockType: string, index: number} = action.payload;
            return {
                ...state,
                editorStates: mapEntries(
                    state.editorStates,
                    ([lang, blocks]) => {
                        const newBlocks = [...blocks];
                        newBlocks.splice(index+1, 0, createNewBlock(blockType, lang));
                        return [lang, newBlocks]
                    }
                )
            }
        }
        case EditorActionType.RemoveBlock: {
            const index: number = action.payload;
            return {
                ...state,
                editorStates: mapEntries(
                    state.editorStates,
                    ([lang, blocks]) => {
                        const newBlocks = [...blocks];
                        newBlocks.splice(index, 1);
                        return [lang, newBlocks]
                    }
                )
            }
        }
        case EditorActionType.MutateBlockType: {
            const {blockType, index}: {blockType: string, index: number} = action.payload;
            return {
                ...state,
                editorStates: mapEntries(
                    state.editorStates,
                    ([lang, blocks]) => {
                        const newBlocks = [...blocks];
                        const editorState = newBlocks[index].editorState;
                        newBlocks[index] = createNewBlock(blockType, lang);
                        newBlocks[index].editorState = editorState;
                        return [lang, newBlocks];
                    }
                )
            }
        }
        default:
            return state;
    }
}

const initialState = (language: Language): EditorReducerState => {
    return {
        chosenLanguage: language,
        editorStates: {
            [Language.English]: [createNewBlock('Paragraph', Language.English)],
            [Language.Spanish]: [createNewBlock('Paragraph', Language.Spanish)],
        }
    }
}
