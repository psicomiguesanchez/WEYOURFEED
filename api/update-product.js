// Endpoint para actualizar productos usando Firestore REST API
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { productId, nombre, categoriaId, precio, costo, ganancia, descripcion } = req.body;

    if (!productId || !nombre) {
      return res.status(400).json({ error: 'productId y nombre requeridos' });
    }

    const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'weyourfeed-app';
    const DATABASE = '(default)';

    // Construir documento de actualización
    const updateData = {
      fields: {
        nombre: { stringValue: nombre },
        categoriaId: { stringValue: categoriaId || 'sin-categoria' },
        precio: { integerValue: String(parseInt(precio) || 0) },
        costo: { integerValue: String(parseInt(costo) || 0) },
        ganancia: { integerValue: String(parseInt(ganancia) || 0) },
        descripcion: { stringValue: descripcion || '' },
        updatedAt: { timestampValue: new Date().toISOString() }
      }
    };

    // Usar Firestore REST API
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${DATABASE}/documents/productos/${productId}?updateMask.fieldPaths=nombre&updateMask.fieldPaths=categoriaId&updateMask.fieldPaths=precio&updateMask.fieldPaths=costo&updateMask.fieldPaths=ganancia&updateMask.fieldPaths=descripcion&updateMask.fieldPaths=updatedAt`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Firestore error: ${error}`);
    }

    res.status(200).json({
      success: true,
      message: '✅ Producto actualizado',
      productId
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: error.message || 'Error actualizando producto'
    });
  }
}
