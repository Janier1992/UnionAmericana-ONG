import { NextResponse } from 'next/server';

const BUCKET = 'hojas-de-vida';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getInsforgeConfig() {
  const url = process.env.NEXT_PUBLIC_INSFORGE_URL || process.env.VITE_INSFORGE_URL || process.env.INSFORGE_URL;
  const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || process.env.VITE_INSFORGE_ANON_KEY || process.env.INSFORGE_ANON_KEY;
  const adminKey = process.env.INSFORGE_API_KEY;
  if (!url) return null;
  return { base: url.replace(/\/+$/, ''), anonKey, adminKey };
}

// Descarga la hoja de vida de un voluntario. Requiere una sesión de admin
// válida (el mismo token que usa el panel /admin) — la fila de voluntarios
// solo es legible por el rol "authenticated" según la política RLS, así que
// este fetch actúa como el gate de autenticación real.
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: 'Identificador inválido' }, { status: 400 });
  }
  if (!token) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const cfg = getInsforgeConfig();
  if (!cfg || !cfg.anonKey || !cfg.adminKey) {
    return NextResponse.json({ error: 'Configuración de servidor incompleta' }, { status: 500 });
  }

  try {
    const rowRes = await fetch(`${cfg.base}/api/database/records/voluntarios?id=eq.${id}`, {
      headers: { apikey: cfg.anonKey, Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (rowRes.status === 401 || rowRes.status === 403) {
      return NextResponse.json({ error: 'Sesión inválida o expirada' }, { status: 401 });
    }
    if (!rowRes.ok) {
      return NextResponse.json({ error: 'No se pudo verificar el registro' }, { status: 502 });
    }

    const rows = await rowRes.json();
    const voluntario = Array.isArray(rows) ? rows[0] : null;
    if (!voluntario || !voluntario.hoja_vida_key) {
      return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 });
    }

    const objRes = await fetch(`${cfg.base}/api/storage/buckets/${BUCKET}/objects/${voluntario.hoja_vida_key}`, {
      headers: { Authorization: `Bearer ${cfg.adminKey}` },
      cache: 'no-store',
    });

    if (!objRes.ok) {
      return NextResponse.json({ error: 'Archivo no disponible' }, { status: 404 });
    }

    const buffer = await objRes.arrayBuffer();
    const filename = (voluntario.hoja_vida_nombre || voluntario.hoja_vida_key).replace(/"/g, '');
    const contentType = objRes.headers.get('content-type') || 'application/octet-stream';

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error sirviendo hoja de vida:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
