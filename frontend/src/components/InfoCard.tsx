import React, { useMemo } from 'react';

import { Card, Container, Row } from 'react-bootstrap';
import { groupBy } from '../utilities/funcs';
import { MediaQuery, useMediaQuery } from '../utilities/hooks';
import { ExtLink } from './ExtLink';

export const InfoCard: React.FC<{
    title: string,
    imageUrl?: string,
    link?: string,
    href?: string
}> = ({ title, imageUrl, link, children, href }) => {
    const sz = useMediaQuery();
    const cardStyle = {
        backgroundColor: "#3e5b47",
        fontSize: '5mm',
        // flexBasis: '30%',
        maxWidth: sz <= MediaQuery.MD ? undefined : '30%',
        marginTop: '5mm',
        marginBottom: '5mm'
        // marginLeft: '3mm',
        // marginRight: '3mm'
    };
    return <Card style={cardStyle}>
        <ExtLink href={href}>
            <Card.Body>
                <Card.Title><h2>{title}</h2></Card.Title>
                {
                    imageUrl ? <Card.Img variant="top" src={imageUrl} /> : null
                }
                <Card.Text>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-evenly',
                        alignItems: 'baseline',
                        alignContent: 'space-evenly',
                        flexWrap: 'wrap',
                    }}>
                        {children}
                    </div>
                </Card.Text>
                <Card.Link href="#">{link}</Card.Link>
            </Card.Body>
        </ExtLink>
    </Card>
};

export const CardDeck: React.FC<{ fluid?: 'sm' | 'md' | 'lg' | true | false }> = ({ children, fluid = 'md' }) => {
    const grouped = useMemo(() => groupBy(React.Children.toArray(children), 3), [children]);
    return <Container fluid={fluid}>
        {
            grouped.map(rowChildren =>
                <Row style={{ justifyContent: 'space-around', columnGap: '5mm' }} md={1} lg={3}>
                    {rowChildren}
                </Row>)
        }
    </Container>
}