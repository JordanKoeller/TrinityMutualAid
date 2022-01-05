import React from 'react';
import { WyswigEditorComponent } from '../components/Wyswig/WyswigEditorComponent';
// import { WyswigArticleEditor } from '../components/Wyswig/WyswigArticleEditor';
// import { WyswigEditor } from '../components/Wyswig/WyswigBlockEditorComponent';
import { Language } from '../i18n';
const ResourcesPage: React.FC = () => {
    return <>
        <h1>
            This is the Resources page.
        </h1>
        <WyswigEditorComponent language={Language.English} />
        {/* <WyswigArticleEditor articleId={21941694} /> */}
        {/* <WyswigEditor defaultLanguage={Language.English}  /> */}
    </>
}

export default ResourcesPage;