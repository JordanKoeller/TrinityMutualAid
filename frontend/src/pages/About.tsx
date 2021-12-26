import React from 'react';
import { TextJumbotron } from '../components/Jumbotron';

const AboutPage: React.FC = () => {

    return <div>
        <TextJumbotron variant="light" i18nKey="pages.About.0" />
        <TextJumbotron variant="dark" i18nKey="pages.About.1" />
        <TextJumbotron variant="light" i18nKey="pages.About.2" />
    </div>
}

export default AboutPage;