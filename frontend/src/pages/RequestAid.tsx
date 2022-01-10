import React from 'react';
import { ArticleViewerOrEditor } from '../components/Wyswig/WyswigArticleViewer';

const RequestAidPage: React.FC = () => {
    return <>
        <h1>
            This is the Request aid page.
        </h1>
        <ArticleViewerOrEditor articleId={84206117} />
    </>
}

export default RequestAidPage;