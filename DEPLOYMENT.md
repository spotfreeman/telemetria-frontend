# Deployment en Render.com

## Configuración para Render.com

### 1. Crear un nuevo servicio en Render.com

1. Ve a [render.com](https://render.com) y haz login
2. Haz clic en "New +" → "Static Site"
3. Conecta tu repositorio GitHub: `spotfreeman/telemetria-frontend`

### 2. Configuración del servicio

**Configuración básica:**
- **Name:** `telemetria-frontend`
- **Branch:** `main`
- **Root Directory:** (dejar vacío)
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `build`

**Variables de entorno:**
- `NODE_ENV` = `production`

### 3. Configuración de rutas (SPA)

Para que React Router funcione correctamente, agrega esta configuración en "Advanced":

**Redirects/Rewrites:**
```
/*    /index.html   200
```

### 4. Deployment automático

Render.com hará deployment automático cada vez que hagas push a la rama `main`.

## URLs del proyecto

- **Frontend:** `https://telemetria-frontend.onrender.com`
- **Backend:** `https://telemetria-backend.onrender.com`

## Credenciales de prueba

- **Usuario:** `testuser`
- **Contraseña:** `testpass123`

## Verificación

1. El frontend debe cargar correctamente
2. El login debe funcionar con las credenciales de prueba
3. El registro debe crear nuevos usuarios
4. La navegación debe funcionar sin problemas

