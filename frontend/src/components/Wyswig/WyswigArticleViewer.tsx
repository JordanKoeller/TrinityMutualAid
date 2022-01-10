import React, { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import { EditorClientContext } from '../../context/context';
import { Language } from '../../i18n';
import { useArticleState, useCurrentLanguage } from '../../utilities/hooks';
import { WyswigArticle } from './WyswigBlockEditorComponent';
import { WyswigEditorComponent } from './WyswigEditorComponent';
interface ArticleViewerProps {
    articleId: number,
    language: Language,
}

export const WyswigArticleViewer: React.FC<ArticleViewerProps> = ({ articleId, language }) => {
    const article = useArticleState(articleId, language);

    return <>
        {
            article ?
                <WyswigArticle state={article} readOnly />
                :
                <h1>Loading</h1>
        }
    </>

    // return <>{article ? <WyswigBlockEditor
    //   defaultLanguage={language}
    //   content={article?.content}
    //   readonly
    // /> : <h1>Loading</h1>}</>
}

export const ArticleViewerOrEditor: React.FC<{ defaultArticleId?: number }> = ({ defaultArticleId }) => {
    const editorClient = useContext(EditorClientContext);
    const language = useCurrentLanguage();
    const [editing, setIsEditing] = useState(false);
    const [articleId, setArticleId ] = useState(defaultArticleId);
    const handleClickedEditButton = () => {
        console.log("Clicked the button!");
        setIsEditing(!editing);
    }

    if (editorClient.loggedIn()) {
        return <>
            {editing ?
                <WyswigEditorComponent language={language} articleId={articleId} onSave={setArticleId}/>
                :
                <>
                    <Button onClick={handleClickedEditButton}>Edit</Button>
                    <WyswigArticleViewer articleId={articleId as number} language={language} />
                </>
            }
        </>
    } else {
        return <>
            <WyswigArticleViewer language={language} articleId={articleId as number} />
        </>
    }
}