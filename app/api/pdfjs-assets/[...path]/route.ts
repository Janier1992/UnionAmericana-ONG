import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Algunos hostings (ej. Hostinger) no reconocen extensiones nuevas como .mjs/.wasm
// y las sirven como text/plain, lo que el navegador rechaza al cargar el worker de
// pdf.js como módulo. Servimos estos assets estáticos nosotros mismos para
// garantizar el Content-Type correcto sin depender del servidor estático del host.
const MIME_TYPES: Record<string, string> = {
  '.mjs': 'text/javascript; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.wasm': 'application/wasm',
  '.bcmap': 'application/octet-stream',
  '.ttf': 'font/ttf',
  '.pfb': 'application/octet-stream',
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;

  if (!segments || segments.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Sanitizar: solo el worker suelto o cualquier cosa bajo /pdfjs/
  const safeSegments = segments.map((s) => path.basename(s));
  const isWorker = safeSegments.length === 1 && safeSegments[0] === 'pdf.worker.min.mjs';
  const isPdfjsAsset = safeSegments[0] === 'pdfjs' && safeSegments.length > 1;

  if (!isWorker && !isPdfjsAsset) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), 'public', ...safeSegments);

  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    return new NextResponse(new Uint8Array(data), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
