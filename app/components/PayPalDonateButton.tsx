// Botón de pago único de PayPal: un formulario HTML simple que envía
// directo a la página de pago alojada por PayPal (se abre en pestaña
// nueva). No depende del SDK/widget embebido de PayPal, así que evita
// por completo los errores del componente de tarjeta en línea (Smart
// Card Fields) que causaban TRANSACTION_REFUSED en la integración anterior.
const PAYPAL_BUTTON_ID = 'CYJXX6R6Y673W';

export default function PayPalDonateButton() {
  return (
    <form
      action={`https://www.paypal.com/ncp/payment/${PAYPAL_BUTTON_ID}`}
      method="post"
      target="_blank"
      style={{ display: 'inline-grid', justifyItems: 'center', alignContent: 'start', gap: '0.5rem', width: '100%' }}
    >
      <input
        type="submit"
        value="Donar"
        style={{
          textAlign: 'center',
          border: 'none',
          borderRadius: '0.25rem',
          minWidth: '11.625rem',
          width: '100%',
          padding: '0 2rem',
          height: '2.625rem',
          fontWeight: 'bold',
          backgroundColor: '#FFD140',
          color: '#000000',
          fontFamily: '"Helvetica Neue", Arial, sans-serif',
          fontSize: '1rem',
          lineHeight: '1.25rem',
          cursor: 'pointer',
        }}
      />
      <img src="https://www.paypalobjects.com/images/Debit_Credit_APM.svg" alt="Tarjetas aceptadas" />
      <section style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
        Con la tecnología de{' '}
        <img
          src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-wordmark-color.svg"
          alt="PayPal"
          style={{ height: '0.875rem', verticalAlign: 'middle' }}
        />
      </section>
    </form>
  );
}
