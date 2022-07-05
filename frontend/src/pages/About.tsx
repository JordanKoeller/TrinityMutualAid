import React from 'react';
import { TopSpacer } from '../components/TopSpacer';
import { ArticleViewerOrEditor } from '../components/Wyswig/WyswigArticleViewer';
import { pageIds } from './PageIds';

const AboutPage: React.FC = () => {

    return <div>
        <TopSpacer />
        <ArticleViewerOrEditor defaultArticleId={pageIds[process.env.NODE_ENV]?.About}/>
    </div>
}

export default AboutPage;