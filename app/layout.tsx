import type { Metadata } from "next";
import "./globals.css";
import "./components/Sections.css";

// Evita que CDNs sin invalidación atada al deploy (ej. Hostinger hCDN, a diferencia
// de Vercel) sirvan una versión vieja del sitio durante horas/días tras cada redespliegue.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "La Unión Americana — Una sola fuerza. Cien naciones.",
  description: "Organización fundada en 2026 dedicada a la dignidad, unidad y progreso de los pueblos latinoamericanos.",
  keywords: ["latinoamérica", "unidad", "progreso", "educación", "cultura", "sostenibilidad"],
  authors: [{ name: "La Unión Americana" }],
  openGraph: {
    title: "La Unión Americana — Una sola fuerza. Cien naciones.",
    description: "Organización dedicada a la dignidad, unidad y progreso de los pueblos latinoamericanos.",
    type: "website",
    locale: "es_ES",
  },
};

import LayoutWrapper from "./components/LayoutWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
