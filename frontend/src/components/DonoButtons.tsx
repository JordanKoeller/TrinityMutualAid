import React, { useEffect } from 'react';

import "./Donobuttons.css";

export const SquareSingleDonoButton: React.FC = () => {

    useEffect(() => {
        function showCheckoutWindow(e: Event) {
            e.preventDefault();

            const url: string = document.getElementById('embedded-checkout-modal-checkout-button')?.getAttribute('data-url') as string;
            const title = 'Square Online Checkout';

            // Some platforms embed in an iframe, so we want to top window to calculate sizes correctly
            const topWindow = window.top ? window.top : window;

            // Fixes dual-screen position                                Most browsers          Firefox
            const dualScreenLeft = topWindow.screenLeft !== undefined ? topWindow.screenLeft : topWindow.screenX;
            const dualScreenTop = topWindow.screenTop !== undefined ? topWindow.screenTop : topWindow.screenY;

            // eslint-disable-next-line no-restricted-globals
            const width = topWindow.innerWidth ? topWindow.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            // eslint-disable-next-line no-restricted-globals
            const height = topWindow.innerHeight ? topWindow.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

            const h = height * .75;
            const w = 500;

            const systemZoom = width / topWindow.screen.availWidth;
            const left = (width - w) / 2 / systemZoom + dualScreenLeft;
            const top = (height - h) / 2 / systemZoom + dualScreenTop;
            const newWindow = window.open(url, title, `scrollbars=yes, width=${w / systemZoom}, height=${h / systemZoom}, top=${top}, left=${left}`);

            if ((window as any).focus) newWindow?.focus();
        }

        // This overrides the default checkout button click handler to show the embed modal
        // instead of opening a new tab with the given link url
        document.getElementById('embedded-checkout-modal-checkout-button')?.addEventListener('click', function (e) {
            showCheckoutWindow(e);
        });
    })
    return (
        <div style={{ margin: 'auto' }}>
            <div >
                <div id="renderedCheckoutButtonHTML" >
                    <div style={{ padding: '20px' }}>
                        <p style={{ fontSize: '18px', lineHeight: '20px' }}>
                            Donate to Trinity Mutual Aid today!
                        </p>
                        <a
                            id="embedded-checkout-modal-checkout-button"
                            target="_blank"
                            rel="noreferrer"
                            data-url="https://square.link/u/mw60KHhD?src=embd"
                            href="https://square.link/u/mw60KHhD?src=embed"
                            style={{
                                display: 'inline-block',
                                fontSize: '18px',
                                lineHeight: '48px',
                                height: '48px',
                                color: '#ffffff',
                                minWidth: '212px',
                                backgroundColor: '#e24e03',
                                textAlign: 'center',
                                boxShadow: '0 0 0 1px rgba(0,0,0,.1) inset',
                                borderRadius: '50px'
                            }}
                        >
                            Donate
                        </a>
                    </div>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Domine" />
                </div>
                <textarea className="checkout-button-html-hidden-textarea embedded-checkout-link"></textarea></div>
        </div>
    )
}

export const SquareRecurringDonoButton: React.FC = () => {

    useEffect(() => {
        function showCheckoutWindow(e: Event) {
            e.preventDefault();

            const url = document.getElementById('embedded-checkout-modal-checkout-button')?.getAttribute('data-url');
            const title = 'Square Online Checkout';

            // Some platforms embed in an iframe, so we want to top window to calculate sizes correctly
            const topWindow = window.top ? window.top : window;

            // Fixes dual-screen position                                Most browsers          Firefox
            const dualScreenLeft = topWindow.screenLeft !== undefined ? topWindow.screenLeft : topWindow.screenX;
            const dualScreenTop = topWindow.screenTop !== undefined ? topWindow.screenTop : topWindow.screenY;

            // eslint-disable-next-line no-restricted-globals
            const width = topWindow.innerWidth ? topWindow.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            // eslint-disable-next-line no-restricted-globals
            const height = topWindow.innerHeight ? topWindow.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

            const h = height * .75;
            const w = 500;

            const systemZoom = width / topWindow.screen.availWidth;
            const left = (width - w) / 2 / systemZoom + dualScreenLeft;
            const top = (height - h) / 2 / systemZoom + dualScreenTop;
            const newWindow = window.open(url as string, title, `scrollbars=yes, width=${w / systemZoom}, height=${h / systemZoom}, top=${top}, left=${left}`);

            if ((window as any).focus) (newWindow as any).focus();
        }

        // This overrides the default checkout button click handler to show the embed modal
        // instead of opening a new tab with the given link url
        document.getElementById('embedded-checkout-modal-checkout-button')?.addEventListener('click', function (e) {
            showCheckoutWindow(e);
        });
    });
    return (
        <div style={{ margin: 'auto' }}>
            <div ><div id="renderedCheckoutButtonHTML">
                <div style={{ padding: '20px' }}>
                    <p style={{ fontSize: '18px', lineHeight: '20px' }}>
                        Become a Reccurring Donor Today!
                    </p>
                    <a id="embedded-checkout-modal-checkout-button" rel="noreferrer" target="_blank" data-url="https://square.link/u/rOj4d4oI?src=embd" href="https://square.link/u/rOj4d4oI?src=embed"
                        style={{
                            display: 'inline-block',
                            fontSize: '18px',
                            lineHeight: '48px',
                            height: '48px',
                            color: '#ffffff',
                            minWidth: '212px',
                            backgroundColor: '#e24e03',
                            textAlign: 'center',
                            boxShadow: '0 0 0 1px rgba(0,0,0,.1) inset',
                            borderRadius: '50px'
                        }}
                    >Donate</a>
                </div>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Domine" />

            </div>
                <textarea className="checkout-button-html-hidden-textarea embedded-checkout-link"></textarea></div>

        </div>
    )
}

export const PaypalDonoButton: React.FC = () => {
    return (
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
    );
}