import { createEditorStateWithText } from '@draft-js-plugins/editor';
import { EditorState } from 'draft-js';
import React, { useReducer, useCallback, useContext } from 'react';
import { Container, ListGroup, Button } from 'react-bootstrap';
import { EditorClientContext } from '../../context/context';
import { Language } from '../../i18n';
import { ArticleDescription } from '../../utilities/types';
import { WyswigArticle, WyswigBlockEditor } from './WyswigBlockEditorComponent';
import { WyswigControlButtons } from './WyswigLanguageSelector';


enum EditorActionType {
    MutateEditorState,
    AddBlock,
    RemoveBlock,
    ChangeLanguage,
    ClearState,

}

interface EditorProps {
    readOnly?: boolean,
    language?: Language
}

export const WyswigEditorComponent: React.FC<EditorProps> = ({ readOnly = false, language = Language.English }) => {
    const [editorState, blockChangeDispatch, dispatch] = useEditorComponentState(language);
    const client = useContext(EditorClientContext);

    const requestSave = async () => {
        await client.uploadArticle(editorState);
    }

    return <Container fluid>
        {
            readOnly ? null :
                <WyswigControlButtons
                    defaultLanguage={language}
                    onLanguageChange={(lang) => dispatch({ type: EditorActionType.ChangeLanguage, payload: lang })}
                    onSave={requestSave}
                    onCancel={() => dispatch({ type: EditorActionType.ClearState })}
                />
        }
        <WyswigArticle
            state={editorState}
            readOnly={readOnly}
            onChange={blockChangeDispatch}
            Suffix={readOnly ? undefined :
                <Button variant="primary" size="lg" onClick={() => dispatch({ type: EditorActionType.AddBlock })}>
                    Add Block
                </Button>}
        />
    </Container>
}


//////////////////////////////////////////////
//    Editor Component Statefulness management
//////////////////////////////////////////////









interface EditorComponentAction {
    type: EditorActionType,
    payload?: any,

}

const useEditorComponentState = (language: Language): [ArticleDescription, (state: EditorState, index: number) => void, React.Dispatch<EditorComponentAction>] => {
    const [state, dispatch] = useReducer(editorComponentStateReducer, initialState(language));
    const blockChangeDispatch = useCallback((state: EditorState, index: number) =>
        dispatch({ type: EditorActionType.MutateEditorState, payload: { index, editorState: state } }),
        [dispatch]
    );
    return [state, blockChangeDispatch, dispatch];
}


const editorComponentStateReducer = (state: ArticleDescription, action: EditorComponentAction): ArticleDescription => {
    switch (action.type) {
        case EditorActionType.AddBlock: return {
            ...state,
            blocks: [
                ...state.blocks,
                { editorState: initializeNewEditorState(state.language) },
            ]
        }
        case EditorActionType.MutateEditorState: {
            const nextState = {
                ...state,
                blocks: [...state.blocks],
            }
            nextState.blocks[action.payload.index].editorState = action.payload.editorState;
            return nextState;
        }
        default:
            return state;
    }
}

const initializeNewEditorState = (lang: Language): EditorState => {
    const defaultStates = {
        [Language.English]: 'Enter text here',
        [Language.Spanish]: 'Introducir texto aquí',
    };
    return createEditorStateWithText(defaultStates[lang]);
}

const initialState = (language: Language): ArticleDescription => {
    return {
        language,
        blocks: [
            {
                editorState: initializeNewEditorState(language)
            }
        ]
    };
}