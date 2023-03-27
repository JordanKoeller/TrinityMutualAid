import React from 'react';
import { useTranslation } from 'react-i18next';
import { TopSpacer } from '../components/TopSpacer';
import { ArticleViewerOrEditor } from '../components/Wyswig/WyswigArticleViewer';
import { pageIds } from './PageIds';

const ResourcesPage: React.FC = () => {
    const { t } = useTranslation(undefined, { useSuspense: false });
    return <div>
        <TopSpacer />
        <h1 className="jumbotron-title">{t('navbar.Resources')}</h1>
        <ArticleViewerOrEditor defaultArticleId={pageIds[process.env.NODE_ENV]?.Resources}/>
        
    </div>
}

export default ResourcesPage;