import React from 'react';
import { SquareSingleDonoButton, SquareRecurringDonoButton, PaypalDonoButton } from '../components/DonoButtons';
import { CardDeck, InfoCard } from '../components/InfoCard';
import { TextJumbotron } from '../components/Jumbotron';
import { TopSpacer } from '../components/TopSpacer';

const DonatePage: React.FC = () => {
    return <div>
        <TopSpacer />
        <TextJumbotron variant="light" i18nKey="pages.Donate.0" />
        <br />
        <CardDeck>
            <InfoCard title="Set up Recurring Square Donations" imageUrl="square-recurring-qr.png">
                <SquareRecurringDonoButton />
            </InfoCard>
            <InfoCard title="Zelle" imageUrl="zell-qr-cropped.jpeg">
                $TrinityMutualAid2021
            </InfoCard>
            <InfoCard title="PayPal" imageUrl="paypal-qr.jpg">
                <PaypalDonoButton />
            </InfoCard>
            <InfoCard title="Donate with Square Once" imageUrl="square-onetime-qr.png">
                <SquareSingleDonoButton />
            </InfoCard>
            <InfoCard title="CashApp" imageUrl="cash-app-qr.png">
                trinitymutualaidchrp26
            </InfoCard>
        </CardDeck>

    </div>;
}



export default DonatePage;