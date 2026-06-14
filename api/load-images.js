// Vercel Function - Cargar imágenes a Firestore
// POST /api/load-images?adminToken=TOKEN

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';

// Variables de entorno (inyectadas por Vercel)
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "weyourfeed.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "weyourfeed",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "weyourfeed.firebasestorage.app",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "108057920918",
    appId: process.env.FIREBASE_APP_ID || "1:108057920918:web:b2434484b00c4c6f0bc9b7"
};

// Datos de imágenes (importar desde JSON)
const imagenes = [
    // Las imágenes se cargarán dinámicamente desde imagenes_68.json
];

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || 'https://weyourfeed.vercel.app');
    res.setHeader('Content-Type', 'application/json');

    // Solo POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Verificar token (simple protection)
    const token = req.query.adminToken;
    const expectedToken = process.env.ADMIN_TOKEN || 'secret123';

    if (token !== expectedToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Inicializar Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // Datos de imágenes (NOTA: En producción, estos vendrían de una base de datos o archivo)
        const imageData = req.body.images || [];

        if (imageData.length === 0) {
            return res.status(400).json({ error: 'No images provided' });
        }

        console.log(`📸 Iniciando carga de ${imageData.length} imágenes...`);

        // Obtener todos los productos
        const productsRef = collection(db, 'productos');
        const productsSnap = await getDocs(productsRef);

        let updated = 0;
        let errors = 0;

        // Para cada imagen, encontrar el producto y actualizar
        for (const img of imageData) {
            try {
                // Buscar producto por nombre
                const productDocs = await getDocs(
                    query(productsRef, where('nombre', '==', img.nombre))
                );

                if (productDocs.empty) {
                    console.warn(`⚠️ Producto no encontrado: ${img.nombre}`);
                    errors++;
                    continue;
                }

                // Actualizar primer documento encontrado
                const docId = productDocs.docs[0].id;
                const docRef = doc(db, 'productos', docId);

                await updateDoc(docRef, {
                    imagenBase64: img.imagen
                });

                updated++;
                console.log(`✅ Actualizado: ${img.nombre}`);

            } catch (error) {
                console.error(`❌ Error en ${img.nombre}:`, error.message);
                errors++;
            }
        }

        // Respuesta
        res.status(200).json({
            success: true,
            message: `Imágenes cargadas: ${updated}/${imageData.length}`,
            updated: updated,
            errors: errors,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'Error loading images',
            details: error.message
        });
    }
}
