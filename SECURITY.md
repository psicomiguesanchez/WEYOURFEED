# 🔒 GUÍA DE SEGURIDAD - WEYOURFEED

## **NUNCA HAGAS ESTO:**
```
❌ Hardcodear API Keys en archivos .html o .js
❌ Subir .env.local a Git
❌ Poner credenciales en el código fuente
❌ Compartir Firebase credentials por email/chat
```

---

## **DESARROLLO LOCAL SEGURO**

### 1. **Crear `.env.local` (solo local)**
```bash
cp .env.example .env.local
```

### 2. **Llenar `.env.local` con valores reales**
```
FIREBASE_API_KEY=tu_nueva_api_key_aqui
ADMIN_PASSWORD=tu_contraseña_fuerte
```

### 3. **Verificar `.gitignore`**
```bash
cat .gitignore
# Debe contener: .env.local, .env, .DS_Store, *.log
```

### 4. **ANTES de hacer push**
```bash
git status
# Verificar que NO hay .env.local en los cambios
```

---

## **PRODUCCIÓN (VERCEL) SEGURO**

### 1. **Ir a Vercel Dashboard**
- Proyecto: `weyourfeed-catalogo`
- Settings → Environment Variables

### 2. **Agregar variables (NO en Git)**
```
FIREBASE_API_KEY = tu_nueva_key
FIREBASE_AUTH_DOMAIN = weyourfeed.firebaseapp.com
FIREBASE_PROJECT_ID = weyourfeed
... (rest del config)
```

### 3. **Vercel inyecta automáticamente**
```javascript
// En producción, el HTML accede:
const apiKey = window.FIREBASE_API_KEY || process.env.FIREBASE_API_KEY
```

---

## **SI SE EXPONE UNA CLAVE:**

1. **INMEDIATAMENTE**
   - Google Cloud Console → APIs & Services → Credentials
   - Eliminar la key comprometida
   - Crear nueva key

2. **En el código**
   - Reemplazar hardcoded value por placeholder
   - Usar variable de entorno

3. **En Git**
   - NO intentar hacer git revert (historial sigue siendo visible)
   - Eliminar y recrear el repo

---

## **CHECKLIST DE SEGURIDAD**

- [ ] `.env.local` NO está en Git
- [ ] `.env.local` NO está en Vercel deployment
- [ ] API Key NO aparece en WEYOURFEED_CMS_SEGURO.html
- [ ] HTML usa `window.FIREBASE_API_KEY` (variable de entorno)
- [ ] Vercel tiene Environment Variables configuradas
- [ ] `.gitignore` incluye: `.env*`, `*.log`, `.DS_Store`
- [ ] GitHub repo NO tiene historiales con secretos expuestos

---

## **CONTACTO DE SEGURIDAD**

Si encuentras una vulnerabilidad: psicomiguesanchez@gmail.com
