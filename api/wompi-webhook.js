// api/wompi-webhook.js
// Webhook para recibir eventos de Wompi

const crypto = require('crypto');
const admin = require('firebase-admin');

export default async function handler(req, res) {
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const event = req.body;
    const wompiEventSecret = process.env.WOMPI_TEST_EVENT_SECRET || process.env.WOMPI_EVENT_SECRET;

    // 1. VALIDAR FIRMA DEL EVENTO (Seguridad)
    const { properties, checksum } = event.signature;
    const timestamp = event.timestamp;

    // Construir cadena a validar
    let concatenated = '';
    for (const prop of properties) {
      const keys = prop.split('.');
      let value = event.data;
      for (const key of keys) {
        value = value[key];
      }
      concatenated += value;
    }
    concatenated += timestamp + wompiEventSecret;

    // Calcular SHA256
    const calculatedChecksum = crypto
      .createHash('sha256')
      .update(concatenated)
      .digest('hex')
      .toUpperCase();

    // Validar que la firma sea correcta
    if (calculatedChecksum !== checksum.toUpperCase()) {
      console.error('❌ Firma inválida. Evento rechazado.');
      return res.status(403).json({ error: 'Invalid signature' });
    }

    console.log('✅ Firma validada');

    // 2. PROCESAR SEGÚN TIPO DE EVENTO
    if (event.event === 'transaction.updated') {
      const transaction = event.data.transaction;
      const reference = transaction.reference;
      const status = transaction.status;

      console.log(`📝 Transacción ${reference}: ${status}`);

      // Actualizar orden en Firestore
      const db = admin.firestore();
      const orderRef = db.collection('ordenes').doc(reference);

      if (status === 'APPROVED') {
        // ✅ PAGO APROBADO
        await orderRef.update({
          estado: 'APPROVED',
          fecha_pago: new Date(),
          wompi_transaction_id: transaction.id
        });

        console.log(`✅ Orden ${reference} APROBADA`);

        // TODO: Enviar email de confirmación
        // sendConfirmationEmail(order.cliente.email, order)

      } else if (status === 'DECLINED') {
        // ❌ PAGO RECHAZADO
        await orderRef.update({
          estado: 'DECLINED',
          wompi_transaction_id: transaction.id
        });

        console.log(`❌ Orden ${reference} RECHAZADA`);

      } else if (status === 'ERROR') {
        // ⚠️ ERROR EN EL PAGO
        await orderRef.update({
          estado: 'ERROR',
          wompi_transaction_id: transaction.id
        });

        console.log(`⚠️ Orden ${reference} ERROR`);
      }
    }

    // Responder con 200 para que Wompi no reintente
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('❌ Error en webhook:', error);
    // Devolver 200 de todas formas para que Wompi no reintente
    return res.status(200).json({ error: error.message });
  }
}
