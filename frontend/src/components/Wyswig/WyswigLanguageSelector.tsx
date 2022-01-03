import React, { useState, ChangeEvent} from 'react';
import { Button, ButtonGroup, ToggleButton } from 'react-bootstrap';
import { Language } from '../../i18n';

interface WyswigControlProps {
    style?: any,
    defaultLanguage?: Language,
    onLanguageChange: (lang: Language) => void,
    onSave: () => void,
    onCancel: () =>void,
}

export const WyswigControlButtons: React.FC<WyswigControlProps> = ({style, defaultLanguage, onLanguageChange, onSave, onCancel}) => {
    const [language, setLanguage] = useState(defaultLanguage || Language.English);
    const onChange = (evt: ChangeEvent<HTMLInputElement>) => {
        setLanguage(evt.target.value as Language);
        onLanguageChange(evt.target.value as Language);
    }

    const handleCancel = () => {
        const response = window.confirm("Are you sure you want to cancel? This will discard any entered changes!");
        if (response) {
            onCancel();
        }
    }


    return <ButtonGroup style={style}>
        <ToggleButton key="en" id="wyswig-en" type="radio" value={Language.English} onChange={onChange} checked={language === Language.English}>En</ToggleButton>
        <ToggleButton key="es" id="wyswig-es" type="radio" value={Language.Spanish} onChange={onChange} checked={language === Language.Spanish}>Es</ToggleButton>
        <Button key="submit" variant="danger" onClick={onSave}>Save</Button> 
        <Button key="cancel" variant="danger" onClick={handleCancel}>Cancel</Button> 
    </ButtonGroup>
}