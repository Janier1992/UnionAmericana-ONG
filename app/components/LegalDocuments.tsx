'use client';

import { useEffect, useRef, useState } from 'react';
import { listarDocumentosLegales, type DocumentoLegal } from '../actions/documentos';

// Enlace pequeño para insertar junto a los demás enlaces legales (ej. en el Footer).
export default function LegalDocuments() {
  const [listOpen, setListOpen] = useState(false);
  const [documentos, setDocumentos] = useState<DocumentoLegal[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [viewerDoc, setViewerDoc] = useState<DocumentoLegal | null>(null);

  const openList = async () => {
    setListOpen(true);
    setLoadingList(true);
    try {
      const docs = await listarDocumentosLegales();
      setDocumentos(docs);
    } finally {
      setLoadingList(false);
    }
  };

  return (
    <>
      <button
        onClick={openList}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          margin: 0,
          font: 'inherit',
          color: 'var(--color-text-muted)',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'all var(--duration-fast)',
        }}
        onMouseOver={(e) => { e.currentTarget.style.color = 'var(--color-cyan)'; }}
        onMouseOut={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; }}
      >
        Documentación Legal y Normativa
      </button>

      {listOpen && (
        <DocumentListModal
          documentos={documentos}
          loading={loadingList}
          onClose={() => setListOpen(false)}
          onSelect={(doc) => setViewerDoc(doc)}
        />
      )}

      {viewerDoc && (
        <SecurePdfViewer documento={viewerDoc} onClose={() => setViewerDoc(null)} />
      )}
    </>
  );
}

function DocumentListModal({
  documentos,
  loading,
  onClose,
  onSelect,
}: {
  documentos: DocumentoLegal[];
  loading: boolean;
  onClose: () => void;
  onSelect: (doc: DocumentoLegal) => void;
}) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{ maxWidth: '560px', width: '100%', maxHeight: '80vh', overflowY: 'auto', padding: '2rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, color: '#fff', fontFamily: 'var(--font-heading)', fontSize: '1.3rem' }}>
            Documentos Legales
          </h3>
          <button onClick={onClose} aria-label="Cerrar" style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%', width: '32px', height: '32px', color: '#fff', cursor: 'pointer',
          }}>✕</button>
        </div>

        {loading && (
          <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '2rem 0' }}>Cargando documentos...</p>
        )}

        {!loading && documentos.length === 0 && (
          <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '2rem 0' }}>
            Aún no hay documentos publicados.
          </p>
        )}

        {!loading && documentos.map((doc) => (
          <button
            key={doc.id}
            onClick={() => onSelect(doc)}
            style={{
              width: '100%',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              marginBottom: '0.75rem',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--color-violet)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
          >
            <span style={{ fontSize: '1.4rem' }}>📄</span>
            <span style={{ flex: 1 }}>
              <span style={{ display: 'block', fontWeight: 600 }}>{doc.titulo}</span>
              {doc.categoria && (
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-violet)' }}>{doc.categoria}</span>
              )}
              {doc.descripcion && (
                <span style={{ display: 'block', fontSize: '0.85rem', color: '#aaa', marginTop: '0.25rem' }}>{doc.descripcion}</span>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function SecurePdfViewer({ documento, onClose }: { documento: DocumentoLegal; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let cancelled = false;
    let renderedTask: any = null;

    const blockKeys = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const combo = (e.ctrlKey || e.metaKey);
      if (combo && ['s', 'p', 'u'].includes(key)) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (key === 'printscreen') {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', blockKeys, true);

    (async () => {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/api/pdfjs-assets/pdf.worker.min.mjs';

        const res = await fetch(`/api/documentos-legales/${documento.id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('No se pudo cargar el documento.');
        const buffer = await res.arrayBuffer();
        if (cancelled) return;

        const pdf = await pdfjsLib.getDocument({
          data: buffer,
          cMapUrl: '/api/pdfjs-assets/pdfjs/cmaps/',
          cMapPacked: true,
          standardFontDataUrl: '/api/pdfjs-assets/pdfjs/standard_fonts/',
          wasmUrl: '/api/pdfjs-assets/pdfjs/wasm/',
        }).promise;
        if (cancelled) return;

        const container = containerRef.current;
        if (!container) return;
        container.innerHTML = '';

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          if (cancelled) return;
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.4 });

          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.display = 'block';
          canvas.style.margin = '0 auto 12px auto';
          canvas.style.maxWidth = '100%';
          canvas.style.height = 'auto';
          canvas.draggable = false;
          canvas.oncontextmenu = (ev) => { ev.preventDefault(); return false; };
          canvas.ondragstart = (ev) => { ev.preventDefault(); return false; };

          container.appendChild(canvas);

          const ctx = canvas.getContext('2d');
          if (!ctx) continue;
          renderedTask = page.render({ canvasContext: ctx, viewport, canvas });
          await renderedTask.promise;
        }

        if (!cancelled) setStatus('ready');
      } catch (err: any) {
        console.error('Error renderizando PDF:', err);
        if (!cancelled) {
          setErrorMsg(err.message || 'Error al cargar el documento.');
          setStatus('error');
        }
      }
    })();

    return () => {
      cancelled = true;
      document.removeEventListener('keydown', blockKeys, true);
      if (renderedTask?.cancel) renderedTask.cancel();
    };
  }, [documento.id]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 2100,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex', flexDirection: 'column',
      }}
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
    >
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(10,10,15,0.9)',
      }}>
        <span style={{ color: '#fff', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
          {documento.titulo}
        </span>
        <button onClick={onClose} aria-label="Cerrar" style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '8px', padding: '0.5rem 1rem', color: '#fff', cursor: 'pointer', fontSize: '0.85rem',
        }}>
          ✕ Cerrar
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem 1rem',
          position: 'relative',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        {status === 'loading' && (
          <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>Cargando documento de forma segura...</p>
        )}
        {status === 'error' && (
          <p style={{ color: 'var(--color-magenta)', textAlign: 'center' }}>{errorMsg}</p>
        )}
        <div ref={containerRef} style={{ maxWidth: '900px', margin: '0 auto' }} />

        {/* Marca de agua disuasoria */}
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', zIndex: 1,
        }}>
          <span style={{
            transform: 'rotate(-30deg)',
            color: 'rgba(255,255,255,0.05)',
            fontSize: '2.5rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}>
            LA UNIÓN AMERICANA — SOLO VISUALIZACIÓN
          </span>
        </div>
      </div>
    </div>
  );
}
