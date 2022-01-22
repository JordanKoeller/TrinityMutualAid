import React, { useReducer, useCallback, useEffect } from 'react';
import { EditorState } from 'draft-js';
import { Language } from '../../../i18n';
import { ArticleDescription, EditorBlock } from '../../../utilities/types';
import { fetchArticle } from '../../../utilities/hooks';
import { createNewBlock } from './EditorBlockRegistry';
import EditorClient from '../../../context/client';

/**
 * 
 * I kind of hate Facebook's interfaces/apis for Draft.js. So I'm just going to wrap it in one that makes sense to me.
 * 
 * I get it's flexible and extensible, and maybe for extremely advanced editors that flexibility is good. But I don't need it.
 * 
 * To make a Block editor, you just make a subclass of the class below. A "Block" is a section of vertical space on the screen,
 * or an otherwise discrete section of a document. The ones that exist right now are for a paragraph, a Splitpanel with an image
 *   on one side and text on the other, and then finally, a news card.
 * 
 */

export interface SerializedBlockEditor {
    blockType: string,
    content: EditorState,
}

interface BlockEditorComponentProps {
    state: EditorBlock,
    blockIndex: number,
    readOnly?: boolean,
    onChange?: (state: EditorBlock, index: number) => void,
}

export type BlockEditorComponent = React.FC<BlockEditorComponentProps>;

export interface BlockEditor {
    blockType: string,
    Component: BlockEditorComponent,
    create: () => EditorBlock,
    // Grab any images, upload them, inject their URLs into the block, and return the urls in an array of strings.
    scrubAndReplaceImages?: (block: EditorBlock, client: EditorClient) => Promise<string[]> 
}

export enum EditorActionType {
    MutateEditorState,
    AddBlock,
    RemoveBlock,
    ChangeLanguage,
    ClearState,
    InjectArticle,
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
            editorStates: {
                ...state.editorStates,
                [state.chosenLanguage]: [
                    ...state.editorStates[state.chosenLanguage],
                    createNewBlock(action.payload),
                ]
            }
        }
        case EditorActionType.MutateEditorState: {
            const nextState = {
                ...state,
            }
            nextState.editorStates[state.chosenLanguage][action.payload.index] = action.payload.state;
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

const initialState = (language: Language): EditorReducerState => {
    return {
        chosenLanguage: language,
        editorStates: {
            [Language.English]: [createNewBlock('Paragraph')],
            [Language.Spanish]: [createNewBlock('Paragraph')],
        }
    }
}