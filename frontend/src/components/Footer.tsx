import React from 'react';

import {
    Container,
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

import { MediaQuery, useMediaQuery } from '../utilities/hooks';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
    const mq = useMediaQuery();
    const { t } = useTranslation(undefined, { useSuspense: false });
    return <Container fluid bsPrefix="footer" >
        <div id="socials-bar">
            <span>
                <a href="https://www.instagram.com/trinitymutualaid" target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={faInstagram as any} size={mq > MediaQuery.MD ? "3x" : "2x"} className="socials-link" />
                </a>
            </span>
        </div>
        <div>
            &copy; <em id="date"></em>{new Date().getFullYear()} | Trinity Mutual Aid
            <br />
            {t('footer.affiliation')}
        </div>
        <div>
            <a href="https://www.mutualaidhub.org" target="_blank" rel="noreferrer">
                {t('footer.mutualhub')}
            </a>
        </div>
    </Container>;
}