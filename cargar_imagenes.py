#!/usr/bin/env python3
"""
Script para cargar imágenes desde catalogo_procesado.json a Firestore
Uso: python3 cargar_imagenes.py
"""

import json
import firebase_admin
from firebase_admin import credentials, firestore

print("📸 Iniciando carga de imágenes...")
print("⚠️  IMPORTANTE: Configura las credenciales de Firebase primero")
print("\n1. Descarga firebase-key.json desde Firebase Console")
print("2. Colócalo en la carpeta del proyecto")
print("3. Ejecuta este script\n")

# Leer JSON con imágenes
print("📖 Leyendo catalogo_procesado.json...")
with open('catalogo_procesado.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

productos_con_imagen = data['productos']
total = len(productos_con_imagen)

print(f"✅ Leídos {total} productos")
print(f"\n🔄 Cuando estés listo:")
print(f"1. En Firestore, ve a Productos")
print(f"2. Haz match por NOMBRE")
print(f"3. Actualiza el campo 'imagenBase64'")
print(f"\nAlternativa: Copia este JSON a un archivo para procesar después:")

# Crear archivo temporal
with open('imagenes_para_firestore.json', 'w', encoding='utf-8') as f:
    json.dump(
        {
            'nota': 'Archivo con imágenes para actualizar en Firestore',
            'instrucciones': 'Hacer match por nombre de producto',
            'productos': [
                {
                    'nombre': p['nombre'],
                    'imagenBase64': p['imagenBase64']
                }
                for p in productos_con_imagen
            ]
        },
        f,
        ensure_ascii=False
    )

print(f"✅ Archivo creado: imagenes_para_firestore.json")
print(f"\n📋 Resumen:")
print(f"   Total productos: {total}")
print(f"   Productos con imagen: {len([p for p in productos_con_imagen if p.get('imagenBase64')])}")

