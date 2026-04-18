# 🌎 La Unión Americana — Plataforma Web Institucional

> "Promover la unidad, el desarrollo integral y la dignidad de los pueblos de América Latina y el Caribe... convirtiendo a América Latina en el destino donde sus habitantes elijan construir su futuro."

La Unión Americana es una organización panregional fundamentada en la acción humanitaria directa, el empoderamiento económico/social y la defensa de los derechos humanos. Esta aplicación web sirve como el epicentro digital (Landing Page e interfaz interactiva) de la Visión 2040, facilitando el reclutamiento de talento (voluntarios) y aportes de donantes y aliados estratégicos.

---

## 🚀 Arquitectura Tecnológica y Stack

Esta aplicación es una Single-Page/Multi-Page App híbrida construida con los más altos estándares modernos:
- **Framework Frontend**: [Next.js 14+](https://nextjs.org/) (App Router).
- **Lenguaje**: TypeScript y React Server Components (`'use server'`, `'use client'`).
- **Estilos**: Vainilla CSS Avanzado (`globals.css`) con metodologías Glassmorphism, diseños fluidos y diseño completamente *Mobile Responsive*.
- **Backend / DBaaS**: [Insforge](https://insforge.com/) (basado en Supabase / PostgreSQL).
- **Despliegue Recomendado**: Vercel.

---

## 📂 Árbol de Código y Estructura

El repositorio sigue un patrón atómico y limpio orientado al enrutado moderno de Next.js:

```text
unionamericana/
├── app/
│   ├── layout.tsx         # Root Layout: Configura lang, estilos y metadata SEO global.
│   ├── page.tsx           # Landing Page principal (Inicio, Misión, Pilares, Proyecciones, etc).
│   ├── globals.css        # Reset CSS, variables maestras de color, tipografía y utilidad.
│   ├── actions/
│   │   └── contact.ts     # Controlador Backend (Server Action) que se comunica vía REST con Insforge.
│   ├── components/        # Componentes Atómicos de UI (Reutilizables).
│   │   ├── Navbar.tsx     # Navegación principal, anclajes ("#inicio") y ruteo a subpáginas.
│   │   ├── Hero.tsx       # Sección heroica visual (Banner de primer impacto).
│   │   ├── Mission.tsx    # Declaración de la Misión y Visión 2040 (con estilo Dropcap).
│   │   ├── Pillars.tsx    # Los 4 Pilares Fundamentales (Tarjetas interactivas con imágenes).
│   │   ├── Impact.tsx     # Proyecciones KPI (Talentos, Asistencia, Biofactorías, etc.).
│   │   ├── Contact.tsx    # Componente de Contacto web estándar.
│   │   └── Footer.tsx     # Pie de página (Mapas del sitio, legalidad).
│   ├── donaciones/
│   │   └── page.tsx       # Ruta /donaciones: Info. bancaria SWIFT y formulario de recursos tangibles.
│   └── unete/
│       └── page.tsx       # Ruta /unete: Reclutamiento de Voluntariado y Aliados.
├── public/
│   ├── images/            # Assets optimizados (Imágenes usadas en componentes).
│   ├── Unionamreicana.jpeg# Logotipo oficial circular.
│   ├── Document.MD        # Documento estatutario con la filosofía y pilares.
│   └── insforge_schema.sql# Script oficial de SQL para montar las tablas de contactos en Insforge.
└── package.json           # Dependencias de npm e instrumentación de desarrollo.
```

---

## ✨ Características y Funcionalidad Básica

1. **Diseño Premium UI/UX:** Interfaz *Dark Mode* por defecto, integrando fondos de simulación mesh en base a neones cian, magentas y violetas, transmitiendo una estética técnica y vanguardista, a la vez que humanitaria.
2. **Sistema de Acciones de React 19 (`useActionState`):** Todos los formularios (`/unete`, `/donaciones` y la sección de contacto interior) validan y transmiten datos asincrónicamente mediante *Server Actions*, blindando la seguridad del lado del servidor.
3. **Plena Adaptabilidad (Responsive):** Grillas CCS fluidas, fuentes que escalan vía parámetros de *clamp()* y resets universales implementados desde la raíz. La plataforma es funcional y estética tanto en resoluciones 4K como en compactos navegadores de smartphones.

---

## 🔗 Configuración de la Base de Datos (Insforge)

Toda la captura de prospectos y voluntarios requiere un conector de base de datos en su backend de Insforge (que utiliza tecnología Supabase bajo el velo). 

1. **Creación de Tablas Aisladas:** 
   Dentro de la carpeta `public/` encontrarás el archivo **`insforge_schema.sql`**. Cópialo y ejecútalo en el panel SQL del *Dashboard* de tu proyecto en Insforge. Esto creará tres tablas especializadas: `contactos` (para dudas generales), `voluntarios` (ruta /unete), y `donaciones` (ruta /donaciones) con sus respectivos permisos de seguridad.
2. **Variables de Entorno Local (`.env.local`):**
   Asegúrate de tener un archivo `.env.local` en la raíz de tu proyecto e introducir tus claves públicas desde tu panel API de Insforge:

   ```bash
   INSFORGE_URL="https://tu-proyecto.insforge.io"
   INSFORGE_ANON_KEY="tu-json-web-token-publico"

   # Alternativamente para VITE o exposición cliente, aunque los Server Actions ocultan las llaves.
   VITE_INSFORGE_URL="https://tu-proyecto.insforge.io"
   VITE_INSFORGE_ANON_KEY="tu-json-web-token-publico"
   ```

---

## 🏃 Instalación y Desarrollo Local

1. Instalar dependencias puras en local:
   ```bash
   npm install
   ```

2. Arrancar el servidor de desarrollo del lado del cliente:
   ```bash
   npm run dev
   ```

3. Visitar `http://localhost:3000` en tu navegador. Tus cambios se refrescarán en vivo.

## 📦 Compilación para Producción

En Vercel el despliegue es en gran parte automático, garantizando precompilaciones de assets. Localmente para probar la carga compilada:
```bash
npm run build
npm run start
```
