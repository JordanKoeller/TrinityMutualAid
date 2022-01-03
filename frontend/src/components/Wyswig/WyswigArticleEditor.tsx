import React, { useCallback, useContext, useEffect, useState } from 'react';
import { EditorClientContext } from '../../context/context';
import { WyswigEditor } from './WyswigEditorComponent';
import { Language } from '../../i18n';
import { EditorState, RawDraftContentState } from 'draft-js';
import { ArticleDescription } from '../../utilities/types';
interface ArticleEditorProps {
    articleId: number,
}
export const WyswigArticleEditor: React.FC<ArticleEditorProps> = ({articleId}) => {
    const client = useContext(EditorClientContext);

    const [articleContent, setArticleContent] = useState<ArticleDescription | null>(null);

    const handleSave = useCallback(async (editorState: RawDraftContentState, title: string, language: Language) => {
        try {
            await client.uploadArticle(title, editorState, language);
            return true;
        } catch {
            return false;
        }
    }, [client]);

    useEffect(() => {
        client.getArticle(articleId, Language.English).then(article => {
            setArticleContent(article);
        });
    }, []);

    return <>{articleContent ? <WyswigEditor 
      defaultLanguage={Language.English}
      onSave={handleSave}
      content={articleContent?.content}
      readonly
    /> : <h1>Loading</h1>}</>



}