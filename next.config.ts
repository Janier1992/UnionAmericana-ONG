import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    qualities: [75, 100],
  },
  // Consolida www + non-www en un solo dominio canónico (evita contenido
  // duplicado ante Google). www es el canónico porque es la propiedad
  // que quedó verificada en Google Search Console.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'launionamericana.org' }],
        destination: 'https://www.launionamericana.org/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Aplicar a todas las rutas
        source: '/(.*)',
        headers: [
          // Evita que la página sea embebida en iframes (clickjacking)
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // Evita que el navegador adivine el tipo de contenido (MIME sniffing)
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Fuerza HTTPS en el navegador por 1 año (HSTS)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // Evita revelar el referrer a sitios externos
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Restringe las APIs del navegador que puede usar la página
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Content Security Policy: controla qué recursos puede cargar la página
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Scripts: solo del propio dominio y scripts inline de Next.js
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              // Estilos: propios e inline
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fuentes: propias y Google Fonts
              "font-src 'self' https://fonts.gstatic.com",
              // Imágenes: propias y datos base64
              "img-src 'self' data:",
              // Conexiones de red: propias, InsForge, Resend
              "connect-src 'self' https://*.insforge.app https://api.resend.com",
              // Frames: solo el propio dominio (visor de hoja de vida en el admin)
              "frame-src 'self'",
              // Objetos embebidos: ninguno
              "object-src 'none'",
              // Formularios: solo al propio dominio
              "form-action 'self'",
              // Bloquea contenido mixto HTTP/HTTPS
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
