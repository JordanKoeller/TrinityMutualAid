import React from 'react';
import { WyswigEditorComponent } from '../components/Wyswig/WyswigEditorComponent';

import { Language } from '../i18n';
const ResourcesPage: React.FC = () => {
    return <>
        <h1>
            This is the Resources page.
        </h1>
        <WyswigEditorComponent language={Language.English} />
    </>
}

export default ResourcesPage;