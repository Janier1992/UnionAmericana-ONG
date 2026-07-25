import { NextResponse } from 'next/server';

const BUCKET = 'documentos-legales';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getInsforgeConfig() {
  const url = process.env.NEXT_PUBLIC_INSFORGE_URL || process.env.VITE_INSFORGE_URL || process.env.INSFORGE_URL;
  const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || process.env.VITE_INSFORGE_ANON_KEY || process.env.INSFORGE_ANON_KEY;
  const adminKey = process.env.INSFORGE_API_KEY;
  if (!url) return null;
  return { base: url.replace(/\/+$/, ''), anonKey, adminKey };
}

// Sirve el PDF en línea para el visor seguro. Nunca expone el objeto de Storage
// directamente al navegador: siempre pasa por este endpoint server-side.
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: 'Identificador inválido' }, { status: 400 });
  }

  const cfg = getInsforgeConfig();
  if (!cfg || !cfg.anonKey || !cfg.adminKey) {
    return NextResponse.json({ error: 'Configuración de servidor incompleta' }, { status: 500 });
  }

  try {
    // 1) Confirmar que el documento existe y está activo (RLS: público solo ve activo = true)
    const rowRes = await fetch(`${cfg.base}/api/database/records/documentos_legales?id=eq.${id}`, {
      headers: { apikey: cfg.anonKey, Authorization: `Bearer ${cfg.anonKey}` },
      cache: 'no-store',
    });

    if (!rowRes.ok) {
      return NextResponse.json({ error: 'No se pudo verificar el documento' }, { status: 502 });
    }

    const rows = await rowRes.json();
    const doc = Array.isArray(rows) ? rows[0] : null;
    if (!doc || !doc.storage_key) {
      return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 });
    }

    // 2) Descargar el archivo del bucket privado con la clave administrativa (solo servidor)
    const objRes = await fetch(`${cfg.base}/api/storage/buckets/${BUCKET}/objects/${doc.storage_key}`, {
      headers: { Authorization: `Bearer ${cfg.adminKey}` },
      cache: 'no-store',
    });

    if (!objRes.ok) {
      return NextResponse.json({ error: 'Archivo no disponible' }, { status: 404 });
    }

    const buffer = await objRes.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error sirviendo documento legal:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
