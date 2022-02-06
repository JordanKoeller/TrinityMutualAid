import React from 'react';
import { TextJumbotron, } from '../components/Jumbotron';
import { TopSpacer } from '../components/TopSpacer';
import { ExtLink } from '../components/ExtLink';
import { SplitPanel } from '../components/SplitPanel';
import { ArticleViewerOrEditor } from '../components/Wyswig/WyswigArticleViewer';
import { pageIds } from './PageIds';

const ContactPage: React.FC = () => {
    return <>
        <TopSpacer />
        <ArticleViewerOrEditor defaultArticleId={pageIds[process.env.NODE_ENV]?.Contact}/>
    </>
}

export default ContactPage;