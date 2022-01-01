import React, { useState, ChangeEvent} from 'react';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';

interface WysywigLanguageSelector {
    style?: any,
    onLanguageChange: (lang: string) => void,
}

export const WyswigLanguageSelector: React.FC<WysywigLanguageSelector> = ({style, onLanguageChange}) => {
    const [language, setLanguage] = useState('en');
    const onChange = (evt: ChangeEvent<HTMLInputElement>) => {
        setLanguage(evt.target.value);
        onLanguageChange(evt.target.value);
    }


    return <ButtonGroup style={style}>
        <ToggleButton key="en" id="wyswig-en" type="radio" value={'en'} onChange={onChange} checked={language === 'en'}>En</ToggleButton>
        <ToggleButton key="es" id="wyswig-es" type="radio" value={'es'} onChange={onChange} checked={language === 'es'}>Es</ToggleButton>
    </ButtonGroup>
}