#!/usr/bin/env node
/**
 * Script local para cargar imágenes a Firestore
 * Uso: node load-images-local.js
 */

const fs = require('fs');
const path = require('path');

console.log('📸 PRECARGA DE IMÁGENES - WEYOURFEED');
console.log('====================================\n');

// Leer imagenes_68.json
const imagenPath = path.join(__dirname, 'imagenes_68.json');

if (!fs.existsSync(imagenPath)) {
    console.error('❌ No encontrado: imagenes_68.json');
    process.exit(1);
}

try {
    const data = JSON.parse(fs.readFileSync(imagenPath, 'utf-8'));
    console.log(`✅ Leídas ${data.length} imágenes`);
    console.log(`📊 Tamaño total: ${(JSON.stringify(data).length / 1024 / 1024).toFixed(2)} MB\n`);

    // Mostrar primeras 3
    console.log('📋 Primeros 3 productos:\n');
    data.slice(0, 3).forEach((img, idx) => {
        const preview = img.imagen.substring(0, 50) + '...';
        console.log(`${idx + 1}. ${img.nombre}`);
        console.log(`   Imagen: ${preview}\n`);
    });

    console.log('✅ Datos listos para carga');
    console.log('\n📝 INSTRUCCIONES:');
    console.log('1. Abre https://weyourfeed.vercel.app');
    console.log('2. Inicia sesión como admin');
    console.log('3. Ejecuta en consola del navegador:');
    console.log(`
    fetch('/api/load-images?adminToken=ADMIN_TOKEN', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: IMAGEN_DATA })
    })
    .then(r => r.json())
    .then(d => console.log(d))
    `);
    console.log('\n💡 O copia imagenes_68.json al servidor manualmente');

} catch (error) {
    console.error('❌ Error leyendo archivo:', error.message);
    process.exit(1);
}
