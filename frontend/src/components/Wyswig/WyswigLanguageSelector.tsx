import React, { useState, ChangeEvent } from 'react';
import { Button, ButtonGroup, Container, ToggleButton } from 'react-bootstrap';
import { Language } from '../../i18n';

interface WyswigControlProps {
    style?: any,
    defaultLanguage?: Language,
    onLanguageChange: (lang: Language) => void,
    onSave: () => void,
    onCancel: () => void,
    onTogglePreview: (isPreview: boolean) => void,
}

export const WyswigControlButtons: React.FC<WyswigControlProps> = ({ style, defaultLanguage, onLanguageChange, onSave, onCancel, onTogglePreview }) => {
    const [language, setLanguage] = useState(defaultLanguage || Language.English);
    const [isPreview, setIsPreview] = useState(false);
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

    const handlePreview = () => {
        setIsPreview(!isPreview);
        onTogglePreview(!isPreview);
    }

    return <Container fluid="lg"><ButtonGroup style={style}>
        <ToggleButton key="en" id="wyswig-en" type="radio" value={Language.English} onChange={onChange} checked={language === Language.English}>En</ToggleButton>
        <ToggleButton key="es" id="wyswig-es" type="radio" value={Language.Spanish} onChange={onChange} checked={language === Language.Spanish}>Es</ToggleButton>
        <Button key="submit" variant="danger" onClick={onSave}>Save</Button>
        <Button key="cancel" variant="danger" onClick={handleCancel}>Cancel</Button>
        <Button key="preview" variant="danger" onClick={handlePreview}>{!isPreview ? "See Preview Mode" : "Back to Editor Mode"}</Button>
    </ButtonGroup></Container>
}