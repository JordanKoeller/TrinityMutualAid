import React from 'react';
import { Container } from 'react-bootstrap';
import { MediaQuery, useMediaQuery } from '../utilities/hooks';
import { JumboJustify, JumboVariant } from './Jumbotron';

export interface SplitPanelProps {
    src: string,
    imgSize?: { height: number, width: number } | {},
    imageFirst?: boolean,
    imageFraction?: number,
    variant?: JumboVariant,
    justify?: JumboJustify,
}

export const SplitPanel: React.FC<SplitPanelProps> = ({ src, imgSize = {}, children, imageFirst, imageFraction = 0.5, variant = 'light', justify = 'center' }) => {
    const imageIndex = imageFirst ? 1 : 2;
    const childrenIndex = imageFirst ? 2 : 1;
    const imgPcnt = `${imageFraction * 100}%`;
    const contentsPcnt = `${(1 - imageFraction) * 100}%`;
    const screenSize = useMediaQuery();
    const vertical = screenSize <= MediaQuery.SM;

    return <Container fluid bsPrefix={`jumbotron-${variant}`}>
        <Container fluid="lg" style={{
            display: 'flex',
            justifyContent: 'center',
            textAlign: justify,
            justifyItems: 'center',
            gap: '2em',
            flexDirection: vertical ? 'column' : 'row'
        }}>
            <div style={{ order: imageIndex, width: vertical ? undefined : imgPcnt }}>
                <img src={src} alt="" style={{
                    width: vertical ? '90%' : '100%',
                    height: vertical ? '90%' : '100%',
                    objectFit: 'contain',
                }} />
            </div>
            <div style={{ order: childrenIndex, maxWidth: vertical ? undefined : contentsPcnt }}>
                {children}
            </div>
        </Container>
    </Container>
}