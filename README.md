# Delicateses Doña Rosa

Tienda virtual de galletas, tortas y postres (Venezuela) hecha con **Astro** y **Keystatic**. El checkout arma un mensaje y lo envía por **WhatsApp**.

## Requisitos

- Node.js 22.12+
- Cuenta de GitHub (para editar contenido en producción)
- Proyecto desplegado en **Vercel** (recomendado)

## Empezar en local

```bash
npm install
cp .env.example .env
npm run dev
```

- Tienda: http://localhost:4321
- Admin Keystatic: http://localhost:4321/keystatic

Sin configurar el repo de GitHub, Keystatic corre en **modo local** (edita archivos en tu máquina, sin login).

En `.env`, configura `PUBLIC_WHATSAPP_NUMBER` con el número real (ej. `584121234567`). También puedes editarlo en Keystatic → Configuración del sitio.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo (incluye admin Keystatic) |
| `npm run build` | Build para Vercel |
| `npm run preview` | Vista previa del build |
| `npm run astro` | CLI de Astro |

## Contenido

Los productos viven en `src/content/products/` y la configuración del sitio en `src/content/site.yaml`. Se editan desde `/keystatic`.

## Pedidos

El carrito se guarda en `localStorage`. Al confirmar, se abre WhatsApp con el pedido, total y campos para nombre, zona y notas.

## Keystatic con login de GitHub (producción)

En producción **no hay usuario/contraseña propios**. El acceso a `/keystatic` es con **GitHub**: solo quien tenga permiso **write** en el repositorio puede entrar.

### 1. Variables en `.env` / Vercel

```env
PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER=tu-usuario
PUBLIC_KEYSTATIC_GITHUB_REPO_NAME=delicateses
```

Cuando estas dos existen, Keystatic usa almacenamiento `github`.

### 2. Subir y desplegar

1. Sube el proyecto a un repositorio de GitHub.
2. Conecta ese repo en [Vercel](https://vercel.com) e inicia el deploy.
3. En Vercel → Settings → Environment Variables, agrega al menos:
   - `PUBLIC_WHATSAPP_NUMBER`
   - `PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER`
   - `PUBLIC_KEYSTATIC_GITHUB_REPO_NAME`

### 3. Crear la GitHub App (una sola vez)

1. Abre `https://tu-dominio.vercel.app/keystatic`.
2. Pulsa **Login with GitHub** y sigue el asistente para **Create GitHub App**.
3. Otorga acceso al repositorio del proyecto.
4. Keystatic generará (o pedirá) estas variables; cópialas a Vercel:
   - `KEYSTATIC_GITHUB_CLIENT_ID`
   - `KEYSTATIC_GITHUB_CLIENT_SECRET`
   - `KEYSTATIC_SECRET`
   - `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`
5. Redesplega el proyecto en Vercel.
6. Si GitHub muestra error de `redirect_uri`, en la GitHub App agrega Callback URL:
   `https://tu-dominio.vercel.app/api/keystatic/github/oauth/callback`

### 4. Quién puede editar

Cualquier cuenta de GitHub con permiso **write** (o superior) en el repo. Al guardar en Keystatic se crea un commit y Vercel vuelve a desplegar la tienda.
