import React from 'react';
import { useTranslation } from 'react-i18next';
import { TopSpacer } from '../components/TopSpacer';
import { ArticleViewerOrEditor, WyswigArticleViewer } from '../components/Wyswig/WyswigArticleViewer';
import { useCurrentLanguage } from '../utilities/hooks';
import { pageIds } from './PageIds';
const Home: React.FC = () => {
    const { t } = useTranslation(undefined, { useSuspense: false });
    const language = useCurrentLanguage();
    return <div>
        <TopSpacer />
        <ArticleViewerOrEditor defaultArticleId={pageIds[process.env.NODE_ENV]?.Home}/>

        <h1 className="jumbotron-title">{t('tmaInNews')}</h1>
        <WyswigArticleViewer articleId={pageIds[process.env.NODE_ENV]?.News as number} language={language} />
    </div>
}

export default Home;