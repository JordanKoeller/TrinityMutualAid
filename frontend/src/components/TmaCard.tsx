import React from 'react';
import { CardGroup, Card, Container } from 'react-bootstrap';

type TmaCardProps = {
  image: string,
}

const TmaCard: React.FC<TmaCardProps> = ({image}) => {
  return   <Card bsPrefix="tma-card">
  <Card.Img variant="top" src={image} />
  <Card.Body>
    <Card.Title>Squad</Card.Title>
    <Card.Text>
      Look at us go. Giving thumbs-up. Aren't we cute?
    </Card.Text>
  </Card.Body>
</Card>
}

export default TmaCard;