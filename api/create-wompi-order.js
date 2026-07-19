// api/create-wompi-order.js
// Endpoint para crear órdenes con Wompi

import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cart, customer } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: 'Carrito vacío' });
    }

    if (!customer || !customer.email || !customer.name || !customer.phone) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    // Configuración de Wompi
    const WOMPI_PUBLIC_KEY = process.env.WOMPI_PUBLIC_KEY;
    const WOMPI_INTEGRITY_SECRET = process.env.WOMPI_INTEGRITY_SECRET;

    if (!WOMPI_PUBLIC_KEY || !WOMPI_INTEGRITY_SECRET) {
      return res.status(500).json({ error: 'Wompi no configurado' });
    }

    // Generar referencia única
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    const reference = `WYF-${timestamp}-${random}`.toUpperCase();

    // Calcular monto en centavos
    let totalCents = 0;
    cart.forEach(item => {
      const price = parseInt(item.precio) * 100;
      totalCents += price * item.cantidad;
    });

    // Generar firma SHA256
    const integrityString = `${reference}${totalCents}COP${WOMPI_INTEGRITY_SECRET}`;
    const signature = crypto
      .createHash('sha256')
      .update(integrityString)
      .digest('hex');

    // URL de retorno
    const redirectUrl = `https://weyourfeed.com/orden-confirmada?reference=${reference}`;

    // Crear URL de pago Wompi
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

    return res.status(200).json({
      success: true,
      reference,
      checkout_url: wompiCheckoutUrl,
      amount: totalCents / 100
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
