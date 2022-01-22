import React, { useCallback, useContext, } from 'react';
import { EditorClientContext } from '../../context/context';
import { Language } from '../../i18n';
import { RawDraftContentState } from 'draft-js';
import { useArticleState } from '../../utilities/hooks';
interface ArticleEditorProps {
    articleId: number,
}

export const WyswigArticleEditor: React.FC<ArticleEditorProps> = ({articleId}) => {
    const client = useContext(EditorClientContext);

    const articleContent = useArticleState(articleId, Language.English);

    const handleSave = useCallback(async (editorState: RawDraftContentState, title: string, language: Language) => {
        console.log(editorState);
        return true;
        // try {
        //     await client.uploadArticle(title, editorState, language);
        //     return true;
        // } catch {
        //     return false;
        // }
    }, [client]);

    return <h1>Loading</h1>

    // return <>{articleContent ? <WyswigBlockEditor 
    //   defaultLanguage={Language.English}
    //   onSave={handleSave}
    // //   content={articleContent?.content}
    // /> : <h1>Loading</h1>}</>
}