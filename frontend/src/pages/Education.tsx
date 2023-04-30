import React from 'react';
import { TopSpacer } from '../components/TopSpacer';
import { ArticleViewerOrEditor } from '../components/Wyswig/WyswigArticleViewer';
import { pageIds } from './PageIds';
const EducationPage: React.FC = () => {
  return <>
    <TopSpacer />
    <ArticleViewerOrEditor defaultArticleId={pageIds[process.env.NODE_ENV]?.Education} />
  </>
}

export default EducationPage;