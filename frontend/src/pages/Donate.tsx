import React from 'react';
import { CardGroup, Card, Container } from 'react-bootstrap';
import TmaCard from '../components/TmaCard';

const DonatePage: React.FC = () => {
  return <Container fluid="md">
    <CardGroup bsPrefix="tma-card-group">
      <TmaCard image="group-1.jpg" />
      <TmaCard image="group-1.jpg" />
      <TmaCard image="group-1.jpg" />
    </CardGroup>
  </Container>
}

export default DonatePage;