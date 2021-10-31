import React from 'react';
import { Container } from 'react-bootstrap';
import { Wyswyg } from '../components/WyswigEditor';

const AboutPage: React.FC = () => {
  return <Container fluid="md">
    <Wyswyg />
  </Container>
}

export default AboutPage;