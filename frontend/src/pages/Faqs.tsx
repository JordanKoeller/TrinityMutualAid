import React from 'react';
import { useTranslation } from 'react-i18next';
import { TopSpacer } from '../components/TopSpacer';
import { ArticleViewerOrEditor } from '../components/Wyswig/WyswigArticleViewer';

const FAQsPage: React.FC = () => {
    const { t } = useTranslation(undefined, { useSuspense: false });
    return <div>
        <TopSpacer />
        <h1 className="jumbotron-title">{t('navbar.FAQs')}</h1>
        <ArticleViewerOrEditor defaultArticleId={84206117} />
        
    </div>
}

export default FAQsPage;