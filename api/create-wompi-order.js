// api/create-wompi-order.js
// Endpoint para crear órdenes con Wompi

const crypto = require('crypto');
const admin = require('firebase-admin');

export default async function handler(req, res) {
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cart, customer } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: 'Carrito vacío' });
    }

    if (!customer || !customer.email || !customer.name || !customer.phone) {
      return res.status(400).json({ error: 'Datos del cliente incompletos' });
    }

    // Configuración de Wompi
    const WOMPI_PUBLIC_KEY = process.env.WOMPI_PUBLIC_KEY;
    const WOMPI_INTEGRITY_SECRET = process.env.WOMPI_INTEGRITY_SECRET;
    const WOMPI_ENV = WOMPI_PUBLIC_KEY.includes('test') ? 'test' : 'prod';
    const WOMPI_BASE_URL = WOMPI_ENV === 'test'
      ? 'https://sandbox.wompi.co/v1'
      : 'https://production.wompi.co/v1';

    // Generar referencia única (timestamp + random)
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    const reference = `WYF-${timestamp}-${random}`.toUpperCase();

    // Calcular monto en centavos
    let totalCents = 0;
    const items = cart.map(item => {
      const price = parseInt(item.precio) * 100; // convertir a centavos
      totalCents += price * item.cantidad;
      return {
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad
      };
    });

    // Generar firma de integridad SHA256
    // Formato: <reference><amount><currency><secret>
    const integrityString = `${reference}${totalCents}COP${WOMPI_INTEGRITY_SECRET}`;
    const signature = crypto
      .createHash('sha256')
      .update(integrityString)
      .digest('hex');

    // URL de retorno
    const redirectUrl = `${process.env.VERCEL_URL || 'https://weyourfeed.com'}/orden-confirmada?reference=${reference}`;

    // Crear URL de pago Wompi (Web Checkout)
    const wompiParams = new URLSearchParams({
      'public-key': WOMPI_PUBLIC_KEY,
      'currency': 'COP',
      'amount-in-cents': totalCents.toString(),
      'reference': reference,
      'signature:integrity': signature,
      'redirect-url': redirectUrl,
      'customer-data:email': customer.email,
      'customer-data:full-name': customer.name,
      'customer-data:phone-number': customer.phone,
      'customer-data:phone-number-prefix': '+57'
    });

    const wompiCheckoutUrl = `https://checkout.wompi.co/p/?${wompiParams.toString()}`;

    // Guardar orden PENDIENTE en Firestore
    const db = admin.firestore();
    const orderRef = db.collection('ordenes').doc(reference);

    await orderRef.set({
      reference,
      estado: 'PENDING',
      cliente: customer,
      productos: items,
      monto_centavos: totalCents,
      monto_pesos: totalCents / 100,
      moneda: 'COP',
      metodo_pago: 'WOMPI',
      fecha_creacion: new Date(),
      fecha_pago: null,
      wompi_transaction_id: null,
      url_pago: wompiCheckoutUrl
    });

    return res.status(200).json({
      success: true,
      reference,
      checkout_url: wompiCheckoutUrl,
      amount: totalCents / 100
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Error creando orden',
      details: error.message
    });
  }
}
