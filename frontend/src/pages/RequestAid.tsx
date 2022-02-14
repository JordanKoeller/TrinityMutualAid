import React from 'react';
import { ArticleViewerOrEditor } from '../components/Wyswig/WyswigArticleViewer';
import { pageIds } from './PageIds';
import { TopSpacer } from '../components/TopSpacer';

const RequestAidPage: React.FC = () => {
    return <>
    <TopSpacer />
        <ArticleViewerOrEditor defaultArticleId={pageIds[process.env.NODE_ENV]?.RequestAid}/>
    </>
}

export default RequestAidPage;