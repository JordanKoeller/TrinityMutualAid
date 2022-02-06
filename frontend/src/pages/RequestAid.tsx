import React from 'react';
import { TopSpacer } from '../components/TopSpacer';
import { ArticleViewerOrEditor } from '../components/Wyswig/WyswigArticleViewer';
import { pageIds } from './PageIds';

const RequestAidPage: React.FC = () => {
    return <>
    <TopSpacer />
        <ArticleViewerOrEditor defaultArticleId={pageIds[process.env.NODE_ENV]?.RequestAid}/>
    </>
}

export default RequestAidPage;