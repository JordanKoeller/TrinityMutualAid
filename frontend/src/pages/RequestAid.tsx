import React from 'react';

import { useTranslation } from 'react-i18next';
import { ExtLink } from '../components/ExtLink';
import { TextJumbotron } from '../components/Jumbotron';
import { TopSpacer } from '../components/TopSpacer';

const RequestAidPage: React.FC = () => {
    const { t } = useTranslation(undefined, { useSuspense: false });
    return <div>
        <TopSpacer />
        <TextJumbotron variant="light" i18nKey="pages.RequestAid.0" />
        <TextJumbotron variant="light" i18nKey="pages.RequestAid.1" />
        <h2>
            {t('pages.RequestAid.linkLabel')} <ExtLink href="https://forms.gle/8iQgdBFAVeHNRRP66">
                https://forms.gle/8iQgdBFAVeHNRRP66
            </ExtLink>
        </h2>
        <TopSpacer />
    </div>
}

export default RequestAidPage;