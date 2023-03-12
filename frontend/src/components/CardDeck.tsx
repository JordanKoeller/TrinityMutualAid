import React from 'react';

import { Card, Container, Row } from 'react-bootstrap';
import { MediaQuery, useMediaQuery } from '../utilities/hooks';
import { ExtLink } from './ExtLink';

export const InfoCard: React.FC<{
    title: string,
    imageUrl?: string,
    href?: string
}> = ({ title, imageUrl, children, href }) => {
    const sz = useMediaQuery();
    const w = sz <= MediaQuery.SM ? '100%' : sz <= MediaQuery.MD ? '48%' : '30%';
    const cardStyle = {
        backgroundColor: "#3e5b47",
        fontSize: '5mm',
        marginTop: '5mm',
        marginBottom: '5mm',
        maxWidth: w,

    };
    return <Card style={cardStyle}>
            <ExtLink href={href}>
                <Card.Body>
                    <Card.Title><h2>{title}</h2></Card.Title>
                    <Card.Text>
                            {children}
                    </Card.Text>
                    {
                        imageUrl ? <Card.Img variant="top" src={imageUrl} width="100%" /> : null
                    }
                </Card.Body>
            </ExtLink>
        </Card>

};

export const CardDeck: React.FC<{ fluid?: 'sm' | 'md' | 'lg' | true | false }> = ({ children, fluid = 'md' }) => {
    return <Container fluid={fluid}>
        <Row style={{ justifyContent: 'space-around', rowGap: '10mm'}} sm={1} md={2} lg={3}>
            {children}
        </Row>
    </Container>
}