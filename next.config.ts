import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 100],
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
              // Scripts: solo del propio dominio, Wompi, y scripts inline de Next.js
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.wompi.co",
              // Estilos: propios e inline
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fuentes: propias y Google Fonts
              "font-src 'self' https://fonts.gstatic.com",
              // Imágenes: propias, datos base64, y dominios externos usados
              "img-src 'self' data: https://wompi.com https://*.wompi.co",
              // Conexiones de red: propias, Wompi, InsForge, Resend
              "connect-src 'self' https://*.wompi.co https://*.insforge.app https://api.resend.com",
              // Frames: solo Wompi (para el widget de pago)
              "frame-src 'self' https://checkout.wompi.co",
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
      {
        // Headers específicos para el webhook de Wompi
        source: '/api/wompi/webhook',
        headers: [
          // Solo permite POST desde Wompi
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://wompi.co',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'POST',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
