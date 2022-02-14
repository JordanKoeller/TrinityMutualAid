import React from 'react';
import { useTranslation } from 'react-i18next';
import { TopSpacer } from '../components/TopSpacer';
import { ArticleViewerOrEditor } from '../components/Wyswig/WyswigArticleViewer';
import { pageIds } from './PageIds';

const FAQsPage: React.FC = () => {
    const { t } = useTranslation(undefined, { useSuspense: false });
    return <div>
        <TopSpacer />
        <h1 className="jumbotron-title">{t('navbar.FAQs')}</h1>
        <ArticleViewerOrEditor defaultArticleId={pageIds[process.env.NODE_ENV]?.FAQs}/>
        
    </div>
}

export default FAQsPage;