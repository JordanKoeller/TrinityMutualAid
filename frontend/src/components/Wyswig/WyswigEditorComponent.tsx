import React, { useContext, useState } from 'react';
import { Toast } from 'react-bootstrap';
import { EditorClientContext } from '../../context/context';
import { Language } from '../../i18n';
import { AddBlockButtons } from './Blocks/EditorBlockRegistry';
import { EditorActionType, useEditorComponentState } from './Blocks/useEditorBlocks';
import { WyswigArticle, } from './WyswigBlockEditor';
import { WyswigControlButtons } from './WyswigLanguageSelector';

interface EditorProps {
    language?: Language,
    articleId?: number,
    onSave?: (articleId: number) => void,

}


export const WyswigEditorComponent: React.FC<EditorProps> = ({ language = Language.English, articleId, onSave }) => {
    const client = useContext(EditorClientContext);
    const [editorState, blockChangeDispatch, dispatch, getDescriptions] = useEditorComponentState(language, articleId);
    const [isPreview, setIsPreview] = useState(false);
    const [saveToast, setSaveToast] = useState<string | null>(null);

    const requestSave = async () => {
        try {
            if (articleId) {
                await client.uploadArticle(getDescriptions(), articleId as number);
                if (onSave) onSave(articleId as number);
            } else {
                const aid = await client.uploadArticle(getDescriptions());
                if (onSave) onSave(aid);
            }
            setSaveToast("Article Saved!");
        } catch {
            setSaveToast("An unexpected error occurred. Please try again or report a bug");
        }
    }

    return <>
        {
            saveToast ? <Toast onClose={() => setSaveToast(null)} show={saveToast !== null}>
                <Toast.Header >{saveToast}</Toast.Header>
            </Toast> : null
        }
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
            Suffix={<AddBlockButtons dispatch={dispatch} />}
        />
    </>
}


