import React from 'react';
import { CardDeck, InfoCard } from '../components/InfoCard';
import { Jumbotron } from '../components/Jumbotron';

const DonatePage: React.FC = () => {
  return <div>
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
    <CardDeck>
      <InfoCard title="Zelle">
        $TrinityMutualAid2021
      </InfoCard>
      <InfoCard title="PayPal">
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
            style={{ width: '6em' }}
          />
          <img alt="" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
        </form>

      </InfoCard>
      <InfoCard title="CashApp" >
        trinitymutualaidchrp26
      </InfoCard>
    </CardDeck>

  </div>;
}



export default DonatePage;