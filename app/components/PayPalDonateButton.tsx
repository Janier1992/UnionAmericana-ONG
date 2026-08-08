'use client';

import Script from 'next/script';

// Botón alojado (Hosted Button) de PayPal para donaciones en línea.
const PAYPAL_CLIENT_ID = 'BAAz1ZpWBBZX8-8omajEPCj477Pgt1GFuuuU8YHBAADCrR6iZQOO-RDqTEmQNj9hFfcsXkuB10-DwVFr_w';
const PAYPAL_HOSTED_BUTTON_ID = 'CYJXX6R6Y673W';
const PAYPAL_CONTAINER_ID = `paypal-container-${PAYPAL_HOSTED_BUTTON_ID}`;

declare global {
  interface Window {
    paypal?: {
      HostedButtons: (config: { hostedButtonId: string }) => { render: (selector: string) => void };
    };
  }
}

export default function PayPalDonateButton() {
  const renderButton = () => {
    if (window.paypal?.HostedButtons) {
      window.paypal.HostedButtons({ hostedButtonId: PAYPAL_HOSTED_BUTTON_ID }).render(`#${PAYPAL_CONTAINER_ID}`);
    }
  };

  return (
    <>
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&components=hosted-buttons&disable-funding=venmo&currency=USD`}
        strategy="afterInteractive"
        onReady={renderButton}
      />
      <div id={PAYPAL_CONTAINER_ID} />
    </>
  );
}
