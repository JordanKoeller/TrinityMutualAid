import React from 'react';
import { CardDeck, InfoCard } from '../components/InfoCard';
import { TextJumbotron } from '../components/Jumbotron';

const DonatePage: React.FC = () => {
    return <div>
        <TextJumbotron variant="light" i18nKey="pages.Donate.0" />
        <br />
        <CardDeck>
            <InfoCard title="Zelle">
                $TrinityMutualAid2021
            </InfoCard>
            <InfoCard title="PayPal" imageUrl="paypal-qr.jpg">
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
            <InfoCard title="CashApp" imageUrl="cash-app-qr.png">
                trinitymutualaidchrp26
            </InfoCard>
        </CardDeck>

    </div>;
}



export default DonatePage;