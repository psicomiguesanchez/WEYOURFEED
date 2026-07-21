// Endpoint seguro para actualizar productos
// Usa credenciales de servidor (sin restricciones de cliente)

import admin from 'firebase-admin';

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { productId, nombre, categoriaId, precio, costo, ganancia, descripcion } = req.body;

    if (!productId || !nombre) {
      return res.status(400).json({ error: 'productId y nombre requeridos' });
    }

    // Actualizar en Firestore (sin restricciones de cliente)
    await db.collection('productos').doc(productId).update({
      nombre,
      categoriaId: categoriaId || 'sin-categoria',
      precio: parseInt(precio) || 0,
      costo: parseInt(costo) || 0,
      ganancia: parseInt(ganancia) || 0,
      descripcion: descripcion || '',
      updatedAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: '✅ Producto actualizado',
      productId
    });

  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({
      error: error.message || 'Error actualizando producto'
    });
  }
}
