# 🌎 La Unión Americana — Plataforma Web Institucional

> "Promover la unidad, el desarrollo integral y la dignidad de los pueblos de América Latina y el Caribe... convirtiendo a América Latina en el destino donde sus habitantes elijan construir su futuro."

Sitio web de **La Unión Americana**, ONG panlatinoamericana fundada en 2026 (lema: *"Una sola fuerza. Cien naciones. Un solo corazón."*). Es la landing institucional de la Visión 2040 y el canal para captar voluntarios, donaciones y aliados, con un panel de administración para gestionarlos.

- **Producción:** https://www.launionamericana.org (dominio canónico con `www`; el dominio sin `www` redirige con 301).
- **Hosting:** Hostinger (Node/serverless). El código evita `fs`/`path` y usa logs en memoria por compatibilidad.

---

## 🚀 Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Estilos | CSS propio (`app/globals.css`, `app/components/Sections.css`) + Tailwind 4 |
| Animación | framer-motion y hooks de reveal/parallax propios |
| Backend / BD / Storage | [InsForge](https://insforge.dev) (Postgres + Storage vía API REST) |
| Correo | Resend |
| Chat con IA | Google Gemini (`@google/generative-ai`) |
| Visor de PDF | `pdfjs-dist` (assets servidos vía API, ver más abajo) |
| Pagos | Transferencia bancaria (Bancolombia) y botón alojado de PayPal |

---

## 📂 Estructura

```text
app/
├── layout.tsx                 # Layout raíz, metadata SEO global, revalidate=60
├── page.tsx                   # Landing: Hero → Misión → Pilares → Proyecciones → Banner 2040 → Contacto
├── robots.ts                  # Permite todo salvo /admin
├── components/
│   ├── LayoutWrapper.tsx      # Navbar + Footer + ChatAgent (el /admin va sin ellos)
│   ├── Navbar.tsx · Footer.tsx · Hero.tsx · Mission.tsx
│   ├── Pillars.tsx · Impact.tsx · Contact.tsx
│   ├── ChatAgent.tsx          # Widget de chat con IA
│   ├── PayPalDonateButton.tsx # Botón alojado de PayPal (form POST)
│   ├── LegalDocuments.tsx     # Listado/visor de documentos legales
│   └── RevealOnScroll.tsx     # Hooks de scroll (reveal, parallax, smooth scroll)
├── donaciones/                # /donaciones — datos bancarios + PayPal + formulario
├── unete/                     # /unete — formulario de voluntariado con hoja de vida
├── proyectos/                 # /proyectos/{tecnologia,cultura,educacion,sostenibilidad}
├── legal/                     # /legal/{privacidad,terminos,transparencia}
├── admin/                     # /admin — portal de gestión (noindex)
├── actions/
│   ├── contact.ts             # Alta/lectura/edición/borrado de registros en InsForge
│   ├── documentos.ts          # Gestión de documentos legales (Storage)
│   ├── email.ts               # Envío de correos con Resend + log en memoria
│   └── chat.ts                # Conexión con Gemini
└── api/
    ├── voluntarios-cv/[id]    # Descarga/visor de hoja de vida (bucket privado)
    ├── documentos-legales/[id]# Descarga de documentos legales (bucket privado)
    └── pdfjs-assets/[...path] # Sirve cmaps/worker de pdf.js con MIME correcto
public/
├── images/                    # Imágenes de las secciones
├── insforge_schema.sql        # Tablas contactos, voluntarios, donaciones
└── insforge_hoja_vida_migration.sql # Columnas de hoja de vida (ya aplicada)
```

> En la raíz quedan archivos de una versión estática anterior (`index.html`, `index2.html`, `styles.css`, `script.js`, `css/`, `js/`, `copy-images.mjs`). No forman parte de la app Next.js.

---

## ✨ Funcionalidades

### Landing (`/`)
Secciones ancladas: `#inicio` (Hero), `#mision`, `#pilares` (los 4 pilares), `#proyecciones` (KPIs y hoja de ruta), banner cinematográfico "Juntos somos imparables" y `#unete` (formulario de contacto, oculto hasta un clic).

### Donaciones (`/donaciones`)
- Información de cuenta bancaria (Bancolombia).
- Botón único de PayPal que envía por formulario POST a la página de pago alojada por PayPal (sin SDK embebido).
- Formulario para registrar aportes en especie.
- La integración anterior con Wompi fue **eliminada**.

### Voluntariado (`/unete`)
Formulario con carga de **hoja de vida**, que se guarda en el bucket privado `hojas-de-vida` de InsForge Storage.

### Documentos legales (`/legal/*`)
Políticas de privacidad, términos y transparencia, gestionados desde el admin y almacenados en el bucket privado `documentos-legales`.

### Panel de administración (`/admin`)
Pestañas: Dashboard, Voluntarios, Donaciones, Contactos/Aliados, Correos y Documentos. Permite aprobar o rechazar voluntarios (con correo automático), ver hojas de vida en un visor integrado, editar y eliminar registros, y subir documentos legales.

### Chat con IA
Asistente con conocimiento de la organización, flotante en todas las páginas públicas.

---

## 🔍 SEO y seguridad

- **Indexación:** solo la home se indexa; las subpáginas tienen `noindex, follow` para que Google muestre un único resultado. `/admin` es `noindex` y está bloqueado en `robots.txt`.
- **Search Console:** propiedad verificada con `www`.
- **Cabeceras** (en `next.config.ts`): CSP estricta (con excepciones para InsForge, Resend y PayPal), HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` y `Permissions-Policy`.
- Los secretos solo se usan del lado del servidor (Server Actions y rutas API).

---

## 🔗 Configuración de InsForge

1. **Tablas:** ejecuta `public/insforge_schema.sql` en el panel SQL de InsForge (crea `contactos`, `voluntarios` y `donaciones` con sus políticas). Después, si tu base es nueva, aplica `public/insforge_hoja_vida_migration.sql`.
2. **Buckets privados de Storage:** `hojas-de-vida` y `documentos-legales`.
3. **Variables de entorno** (`.env.local` en local; panel de variables en el hosting):

   ```bash
   # InsForge (URL base y clave pública)
   NEXT_PUBLIC_INSFORGE_URL="https://<tu-proyecto>.insforge.app"
   NEXT_PUBLIC_INSFORGE_ANON_KEY="<clave-anon>"
   # (también se aceptan INSFORGE_URL / INSFORGE_ANON_KEY y las variantes VITE_*)

   # Clave de administración (solo servidor): admin, Storage y escrituras privilegiadas
   INSFORGE_API_KEY="<clave-admin>"

   # Correo (Resend)
   RESEND_API_KEY="<clave>"
   RESEND_VERIFIED_DOMAIN="true"   # solo si el dominio de envío está verificado

   # Chat con IA (Gemini)
   GEMINI_API_KEY="<clave>"
   ```

> No subas claves al repositorio. Las credenciales viven en `.env.local` (ignorado por git).

---

## 🏃 Desarrollo local

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
```

## 📦 Producción

```bash
npm run build
npm run start
```

El layout usa `revalidate = 60` para que los CDN sin invalidación atada al deploy no sirvan versiones antiguas durante días.

---

## 🗺️ Pendientes conocidos

- Sin pruebas automatizadas.
- Falta `sitemap.xml`.
- Mucho estilo en línea en `page.tsx` y `Contact.tsx`; el banner usa `<img>` en lugar de `next/image`.
- Retirar los archivos estáticos heredados de la raíz.
- Revisar que `public/email_logs.json` no exponga datos personales.
