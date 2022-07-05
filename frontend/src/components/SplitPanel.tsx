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

type PanelProps = {
    variant: JumboVariant,
    swapPanels?: boolean,
    splitPercent?: number,
    Left: React.ReactElement,
    Right: React.ReactElement
}

export const EmptySplitPanel: React.FC<PanelProps> = ({ variant, swapPanels, splitPercent, Left, Right }) => {
    const screenSize = useMediaQuery();
    const vertical = screenSize <= MediaQuery.SM;
    const orders = swapPanels ? [2, 1] : [1, 2];
    const leftPanelPercent = `${splitPercent || 50}%`;
    const righPanelPercent = `${100 - (splitPercent || 50)}%`;
    return <Container fluid bsPrefix={`jumbotron-${variant}`}>
        <Container fluid="lg" style={{
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'left',
            justifyItems: 'center',
            gap: '2em',
            flexDirection: vertical ? 'column' : 'row'
        }}>
            <div style={{ order: orders[0], width: vertical ? undefined : leftPanelPercent }}>
                {Left}
            </div>
            <div style={{ order: orders[1], maxWidth: vertical ? undefined : righPanelPercent }}>
                {Right}
            </div>
        </Container>
    </Container>
}