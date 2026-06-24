# 🔐 SETUP: Admin Whitelist en Firestore

## ¿QUÉ ES?
Una colección de Firestore que contiene la lista de UIDs de usuarios que tienen permiso de ADMIN.

## PASOS:

### 1️⃣ Obtén tu UID de Google

Cuando inicies sesión en la app, abre **Consola del Navegador** (F12) y ejecuta:

```javascript
firebase.auth().currentUser.uid
```

Copia el resultado (ej: `EzW3x5qK9mL2pN8tVbJ7c4`)

### 2️⃣ Ve a Firebase Console

1. Abre: https://console.firebase.google.com
2. Selecciona proyecto: **weyourfeed**
3. Ve a **Firestore Database**
4. Click en **+ Crear documento**

### 3️⃣ Crea la colección `admins`

- **ID de colección:** `admins`
- Click **Siguiente**

### 4️⃣ Crea el documento `allowedUids`

- **ID del documento:** `allowedUids`
- Click **Guardar**

### 5️⃣ Agrega el campo `uids`

En el documento `allowedUids`, click en **+ Agregar campo**

- **Nombre del campo:** `uids`
- **Tipo:** `Array`
- **Valor:** Agrega tu UID
  - Click en **Agregar elemento**
  - Pega tu UID (tipo: String)
  - Click **Guardar**

### Resultado esperado:
```
/admins/allowedUids
{
  uids: ["EzW3x5qK9mL2pN8tVbJ7c4"]
}
```

---

## ✅ VERIFICAR

Después de guardar:

1. Recarga la página
2. Intenta iniciar sesión
3. Deberías ver: `✅ Admin verificado - Acceso autorizado` en consola
4. Si ves error rojo = UID no está en lista

---

## 📝 AGREGAR MÁS ADMINS

Para agregar otro usuario:

1. Que inicie sesión y copie su UID desde consola
2. Ve a Firebase Console → `/admins/allowedUids`
3. Click en el array `uids`
4. Click en **+ Agregar elemento**
5. Pega el nuevo UID
6. **Guardar**

**Ejemplo con 2 admins:**
```
uids: [
  "EzW3x5qK9mL2pN8tVbJ7c4",
  "aB1cD2eF3gH4iJ5kL6mN7o"
]
```

---

## ⚠️ IMPORTANTE

- Sin este documento, **NADIE PUEDE ACCEDER AL ADMIN**
- Si cometes error en el UID, ese usuario será rechazado
- Los UIDs son sensibles a mayúsculas/minúsculas
- Verifica 2 veces antes de guardar

---

## 🚀 SIGUIENTE

Después de crear el whitelist:

1. **Deploy Firestore Rules**
   - Firebase Console → Firestore → Rules
   - Reemplaza el contenido con: `/firestore.rules`
   - Publish

2. **Deploy a Vercel**
   - `git add .`
   - `git commit -m "Add admin whitelist and security rules"`
   - `git push`

---

## 🆘 PROBLEMAS

**Error: "Admin list no existe"**
- El documento `/admins/allowedUids` no existe
- Sigue los pasos arriba

**Error: "No tienes permisos de ADMIN"**
- Tu UID no está en la lista
- Verifica que copiaste correctamente
- Agrega tu UID al array

**No puedo iniciar sesión**
- Verifica que Firebase esté inicializado
- Abre Consola (F12) y busca errores
- Verifica que la config de Firebase sea correcta
