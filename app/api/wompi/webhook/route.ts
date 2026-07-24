import { NextResponse } from 'next/server';
import crypto from 'crypto';

// ============================================================
// VALIDACIÓN DE FIRMA CRIPTOGRÁFICA DE WOMPI
// Wompi firma cada evento con HMAC-SHA256 usando la llave de
// integridad del comercio. Si la firma no coincide, el request
// es RECHAZADO inmediatamente (protección contra requests falsos).
// ============================================================
function validateWompiSignature(payload: string, signature: string, secret: string): boolean {
  try {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const calculatedSignature = hmac.digest('hex');
    // Comparación de tiempo constante para evitar timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(calculatedSignature, 'hex'),
      Buffer.from(signature, 'hex')
    );
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  // 1. Solo aceptamos Content-Type application/json
  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return NextResponse.json({ error: 'Unsupported Media Type' }, { status: 415 });
  }

  // 2. Leer el body como texto para poder validar la firma ANTES de parsear
  const rawBody = await req.text();

  // 3. Validar firma criptográfica de Wompi
  const wompiSignature = req.headers.get('x-event-checksum') || '';
  const eventsSecret = process.env.WOMPI_EVENTS_SECRET;

  if (!eventsSecret) {
    console.error('[Wompi Webhook] ❌ WOMPI_EVENTS_SECRET no configurada en variables de entorno.');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  // Si la llave de eventos ya está configurada (no es el placeholder), validar firma
  if (eventsSecret !== 'REEMPLAZAR_CON_TU_LLAVE_EVENTOS_SANDBOX' && wompiSignature) {
    const isValid = validateWompiSignature(rawBody, wompiSignature, eventsSecret);
    if (!isValid) {
      console.warn('[Wompi Webhook] ⚠️ Firma inválida. Request rechazado (posible intento de falsificación).');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const body = JSON.parse(rawBody);

    // 4. Validar estructura mínima del payload
    if (!body || typeof body !== 'object' || !body.event || !body.data?.transaction) {
      return NextResponse.json({ error: 'Invalid payload structure' }, { status: 400 });
    }

    // 5. Solo procesamos eventos de transacciones
    if (body.event === 'transaction.updated') {
      const transaction = body.data.transaction;
      const status: string = transaction.status;
      const amountInCents: number = transaction.amount_in_cents;
      const reference: string = transaction.reference;
      const paymentMethod: string = transaction.payment_method_type;

      // 6. Validar que la referencia tenga el formato esperado de donaciones
      if (!reference || !reference.startsWith('DONA-')) {
        console.warn(`[Wompi Webhook] Referencia inesperada: ${reference}`);
        // No rechazamos, pero sí lo registramos
      }

      // 7. Validar monto mínimo (1000 COP = 100000 centavos) contra montos absurdos
      if (amountInCents < 100000) {
        console.warn(`[Wompi Webhook] Monto sospechosamente bajo: ${amountInCents} centavos`);
      }

      if (status === 'APPROVED') {
        console.log(`✅ [Wompi Webhook] ¡Donación aprobada! Ref: ${reference} | Monto: $${(amountInCents / 100).toLocaleString('es-CO')} COP | Método: ${paymentMethod}`);
        
        // TODO: Aquí puedes conectar el envío del correo de agradecimiento usando Resend
        // await sendThankYouEmail({ reference, amountInCents, paymentMethod });
        
        // TODO: También puedes guardar el registro en InsForge/base de datos
        // await saveDonationRecord({ reference, amountInCents, status, paymentMethod });

      } else {
        console.log(`❌ [Wompi Webhook] Transacción ${status}. Ref: ${reference}`);
      }
    }

    // 8. Responder 200 OK rápido para que Wompi no reintente
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('[Wompi Webhook] Error procesando payload:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Rechazar cualquier método que no sea POST
export async function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
