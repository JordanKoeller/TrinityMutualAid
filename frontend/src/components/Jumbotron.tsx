import React from 'react';

import {
    Container,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export type JumboVariant = 'light' | 'dark';
export type JumboJustify = 'left' | 'center' | 'right';

type JumbotronProps = {
    variant: JumboVariant,
    justify: JumboJustify,
};

export const Jumbotron: React.FC<{
    variant?: JumboVariant,
    title?: string,
    justify?: JumboJustify
}> = ({ children, variant = 'light', title, justify = 'center' }) => {
    return <Container fluid bsPrefix={`jumbotron-${variant}`} style={{ textAlign: justify }}>
        <Container fluid="lg">
            {title ? <h1 className="jumbotron-title">{title}</h1> : null}
            {children}
        </Container>
    </Container>
}

export const TextJumbotron: React.FC<{ i18nKey: string } & Partial<JumbotronProps>> = ({ i18nKey, ...extraProps }) => {
    const { t } = useTranslation(undefined, { useSuspense: false });

    return <Jumbotron {...extraProps} title={t(`${i18nKey}.title`)}>
        <p>
            {t(`${i18nKey}.body`)}
        </p>
    </Jumbotron>
}