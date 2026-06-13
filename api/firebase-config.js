// Vercel Function - Endpoint seguro para devolver Firebase config
// Las variables de entorno se inyectan en tiempo de runtime (NUNCA en el código)

export default function handler(req, res) {
  // CORS - Solo aceptar desde el dominio propio
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || 'https://weyourfeed.vercel.app');
  res.setHeader('Content-Type', 'application/json');

  // Solo GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verificar que las variables de entorno existan
  if (!process.env.FIREBASE_API_KEY) {
    console.error('❌ FIREBASE_API_KEY no está configurada en Vercel');
    return res.status(500).json({ error: 'Firebase config not available' });
  }

  // Devolver config desde variables de entorno (SEGURO)
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "weyourfeed.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "weyourfeed",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "weyourfeed.firebasestorage.app",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "108057920918",
    appId: process.env.FIREBASE_APP_ID || "1:108057920918:web:b2434484b00c4c6f0bc9b7",
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-79ZNK0SZHE"
  };

  // Devolver config
  res.status(200).json(firebaseConfig);
}
