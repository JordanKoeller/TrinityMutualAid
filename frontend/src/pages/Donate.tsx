import React from 'react';
import { Card, Container, Row } from 'react-bootstrap';
import { Jumbotron } from '../components/Jumbotron';

const DonatePage: React.FC = () => {
  return <div>
    {/* <h1>
      Donate
    </h1> */}
    <Jumbotron variant="light" title="Donate!">
      <p>
        Make a financial contribution to Trinity Mutual Aid to continue supporting the San
        Antonio community! Help keep food pantries and fridges stocked and provide
        assistance for folks who need funds with medical expenses, housing, and utility
        expenses. Keep up with our news page to check out how contributions have

        helped us redistribute aid throughout the area!

        We are able to process donations through online platforms. Make a one-time contribution or become a recurring donor!
      </p>
    </Jumbotron>
    <br />
    <Container fluid="md">
      <Row style={{ justifyContent: 'space-around' }} md={1} lg={3}>
        <DonoCard title="Zelle">
          $TrinityMutualAid2021
        </DonoCard>
        <DonoCard title="PayPal">
          <form action="https://www.paypal.com/donate" method="post" target="_top">
            <input type="hidden" name="business" value="P5Y4NKNV99F6C" />
            <input type="hidden" name="no_recurring" value="0" />
            <input type="hidden" name="item_name" value="Make a financial contribution to Trinity Mutual Aid to continue supporting the San Antonio community!" />
            <input type="hidden" name="currency_code" value="USD" />
            <input
              type="image"
              src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"
              name="submit"
              title="PayPal - The safer, easier way to pay online!"
              alt="Donate with PayPal button"
              style={{width: '6em'}}
            />
            <img alt="" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
          </form>

        </DonoCard>
        <DonoCard title="CashApp" >
          trinitymutualaidchrp26
        </DonoCard>
      </Row>
    </Container>

  </div>;
}

const DonoCard: React.FC<{
  title: string,
  imageUrl?: string,
  link?: string,
}> = ({ title, imageUrl, link, children }) => {
  const cardStyle = {
    // maxWidth: '22em',
    backgroundColor: "#3e5b47",
    fontSize: '5mm',

  }
  return <Card style={cardStyle}>
    <Card.Body>
      <Card.Title><h1>{title}</h1></Card.Title>
      {
        imageUrl ? <Card.Img variant="top" src={imageUrl} /> : null
      }
      <Card.Text>
        {children}
      </Card.Text>
      <Card.Link href="#">{link}</Card.Link>
    </Card.Body>
  </Card>
}

export default DonatePage;