// api/save-order.js
// Endpoint para guardar órdenes en Firestore

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { reference, cart, customer, shipping, amount, promo } = req.body;
    const projectId = 'weyourfeed';

    if (!reference || !cart || !customer || !shipping || !amount) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    // Construir documento para Firestore (formato REST API)
    const orderDoc = {
      fields: {
        reference: { stringValue: reference },
        customer: {
          mapValue: {
            fields: {
              name: { stringValue: customer.name || '' },
              email: { stringValue: customer.email || '' },
              phone: { stringValue: customer.phone || '' }
            }
          }
        },
        shipping: {
          mapValue: {
            fields: {
              city: { stringValue: shipping.city || '' },
              address: { stringValue: shipping.address || '' },
              barrio: { stringValue: shipping.barrio || '' },
              numero: { stringValue: shipping.numero || '' }
            }
          }
        },
        items: {
          arrayValue: {
            values: (cart || []).map(item => ({
              mapValue: {
                fields: {
                  id: { stringValue: item.id || '' },
                  nombre: { stringValue: item.nombre || '' },
                  precio: { integerValue: Math.floor(item.precio || 0).toString() },
                  cantidad: { integerValue: Math.floor(item.cantidad || 1).toString() }
                }
              }
            }))
          }
        },
        amount: { integerValue: Math.floor(amount || 0).toString() },
        status: { stringValue: 'PENDING' },
        promo: { booleanValue: !!promo },
        created: { timestampValue: new Date().toISOString() }
      }
    };

    // Hacer POST a Firestore REST API
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/ordenes?documentId=${reference}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderDoc)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Firestore error:', result);
      return res.status(response.status).json({ error: 'Error guardando orden', details: result });
    }

    console.log(`✅ Orden ${reference} guardada en Firestore`);

    return res.status(200).json({
      success: true,
      orderId: reference,
      message: 'Orden guardada correctamente'
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
