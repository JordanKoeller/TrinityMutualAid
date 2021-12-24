import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

export interface SplitPanelProps {

}

export const SplitPanel: React.FC<SplitPanelProps> = ({ children }) => {

  const childrenArray = React.Children.toArray(children);

  return <Container fluid >
    <Row sm={2}>
      <Col>
        {childrenArray[0]}
      </Col>
      <Col>
        {childrenArray[1]}
      </Col>
    </Row>
  </Container>

}