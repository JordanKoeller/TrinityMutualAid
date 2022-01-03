import React from 'react';
import { WyswigArticleEditor } from '../components/Wyswig/WyswigArticleEditor';
import { WyswigEditor } from '../components/Wyswig/WyswigEditorComponent';
import { Language } from '../i18n';
const ResourcesPage: React.FC = () => {
    return <>
        <h1>
            This is the Resources page.
        </h1>
        <WyswigArticleEditor articleId={21941694} />
        {/* <WyswigEditor defaultLanguage={Language.English}  /> */}
    </>
}

export default ResourcesPage;