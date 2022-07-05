import React from 'react';
import { useTranslation } from 'react-i18next';

interface TextProps {
    i18nKey: string,
}

export const TextBox: React.FC<TextProps> = ({ i18nKey }) => {
    const { t } = useTranslation(undefined, { useSuspense: false });
    return <>
        <h1 className="jumbotron-title">{t(`${i18nKey}.title`)}</h1>
        <p>{t(`${i18nKey}.body`)}</p>
    </>
}