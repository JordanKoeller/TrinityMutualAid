import React from 'react';
import { Language } from '../../i18n';
import { useArticleState } from '../../utilities/hooks';
import { WyswigArticle } from './WyswigBlockEditorComponent';
import { WyswigEditorComponent } from './WyswigEditorComponent';
interface ArticleViewerProps {
    articleId: number,
    language: Language,
}

export const WyswigArticleEditor: React.FC<ArticleViewerProps> = ({articleId, language}) => {
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