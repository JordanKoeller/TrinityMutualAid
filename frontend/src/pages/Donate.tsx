import React from 'react';
import { SquareSingleDonoButton, SquareRecurringDonoButton, PaypalDonoButton } from '../components/DonoButtons';
import { CardDeck, InfoCard } from '../components/InfoCard';
import { TopSpacer } from '../components/TopSpacer';
import { ArticleViewerOrEditor } from '../components/Wyswig/WyswigArticleViewer';
import { pageIds } from './PageIds';
import { useTranslation } from 'react-i18next';

const DonatePage: React.FC = () => {
    const { t } = useTranslation(undefined, { useSuspense: false });
    return <div>
        <TopSpacer />
        <ArticleViewerOrEditor defaultArticleId={pageIds[process.env.NODE_ENV]?.Donate}/>
        <br />
        <CardDeck>
            <InfoCard title={t('pages.Donate.SquareRecurring')} imageUrl="square-recurring-qr.png">
                <SquareRecurringDonoButton />
            </InfoCard>
            <InfoCard title="Zelle" imageUrl="zell-qr-cropped.jpeg">
                $TrinityMutualAid2021
            </InfoCard>
            <InfoCard title="PayPal" imageUrl="paypal-qr.jpg">
                <PaypalDonoButton />
            </InfoCard>
            <InfoCard title={t('pages.Donate.SquareSingle')} imageUrl="square-onetime-qr.png">
                <SquareSingleDonoButton />
            </InfoCard>
            <InfoCard title="CashApp" imageUrl="cash-app-qr.png">
                trinitymutualaidchrp26
            </InfoCard>
        </CardDeck>

    </div>;
}



export default DonatePage;