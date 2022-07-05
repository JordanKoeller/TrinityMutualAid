import React from 'react';
import { useTranslation } from 'react-i18next';
import { TopSpacer } from '../components/TopSpacer';
import { ArticleViewerOrEditor } from '../components/Wyswig/WyswigArticleViewer';
import { pageIds } from './PageIds';

const NewsPage: React.FC = () => {
    const { t } = useTranslation(undefined, { useSuspense: false });
    return <>
        <TopSpacer />
        <h1 className="jumbotron-title">{t('tmaInNews')}</h1>
        <ArticleViewerOrEditor defaultArticleId={pageIds[process.env.NODE_ENV]?.News}/>

    </>
}

export default NewsPage;