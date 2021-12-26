import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Jumbotron } from '../components/Jumbotron';

const FAQsPage: React.FC = () => {
    const { t } = useTranslation(undefined, { useSuspense: false });
    return <div>
        <Jumbotron title={t('pages.FAQs.0.title')} justify="left">
            <p>
                {(t('pages.FAQs.0.body1'))}
                <Link to="/RequestAid" >{(t('pages.FAQs.0.link'))}</Link>
            </p>
        </Jumbotron>
        <br />
        <Jumbotron title={t('pages.FAQs.1.title')} variant="dark" justify="left">
            <p>
                {t('pages.FAQs.1.body1')}
                <Link to="/Donate" >{t('pages.FAQs.1.link')}</Link> is
                {t('pages.FAQs.1.body2')}
            </p>
        </Jumbotron>
        <br />
        <Jumbotron title={t('pages.FAQs.2.title')} variant="light" justify="left">
            <p>
                {t('pages.FAQs.2.body1')}
                <Link to="/Donate" >{t('pages.FAQs.2.link')}</Link> is
                {t('pages.FAQs.2.body2')}
            </p>
        </Jumbotron>
        <br />
        <Jumbotron title={t('pages.FAQs.3.title')} variant="dark" justify="left">
            {t('pages.FAQs.3.body')}
        </Jumbotron>
        <br />
        <Jumbotron title={t('pages.FAQs.4.title')} variant="light" justify="left">
            <p>
                {t('pages.FAQs.4.body1')}
                <Link to="/Events" >{t('pages.FAQs.2.link')}</Link>!
            </p>
        </Jumbotron>
    </div>
}

export default FAQsPage;