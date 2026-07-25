'use server';

export interface DocumentoLegal {
  id: string;
  titulo: string;
  descripcion: string | null;
  categoria: string | null;
  storage_key: string;
  orden: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

const BUCKET = 'documentos-legales';

function getInsforgeConfig() {
  const url = process.env.NEXT_PUBLIC_INSFORGE_URL || process.env.VITE_INSFORGE_URL || process.env.INSFORGE_URL;
  const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || process.env.VITE_INSFORGE_ANON_KEY || process.env.INSFORGE_ANON_KEY;
  const adminKey = process.env.INSFORGE_API_KEY;
  if (!url) return null;
  return { base: url.replace(/\/+$/, ''), anonKey, adminKey };
}

// Lista los documentos activos para el módulo público (RLS ya filtra activo = true)
export async function listarDocumentosLegales(): Promise<DocumentoLegal[]> {
  const cfg = getInsforgeConfig();
  if (!cfg || !cfg.anonKey) return [];

  try {
    const res = await fetch(`${cfg.base}/api/database/records/documentos_legales?order=orden.asc`, {
      headers: {
        apikey: cfg.anonKey,
        Authorization: `Bearer ${cfg.anonKey}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.filter((d: DocumentoLegal) => d.activo) : [];
  } catch (error) {
    console.error('Error listando documentos legales:', error);
    return [];
  }
}

// Lista TODOS los documentos (incl. inactivos) para el panel admin
export async function listarDocumentosLegalesAdmin(token: string): Promise<DocumentoLegal[]> {
  const cfg = getInsforgeConfig();
  if (!cfg || !cfg.anonKey) return [];

  try {
    const res = await fetch(`${cfg.base}/api/database/records/documentos_legales?order=orden.asc`, {
      headers: {
        apikey: cfg.anonKey,
        Authorization: `Bearer ${token || cfg.anonKey}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error listando documentos legales (admin):', error);
    return [];
  }
}

export interface SubirDocumentoResult {
  success: boolean;
  error?: string;
  documento?: DocumentoLegal;
}

// Sube un PDF a Storage (privado) y crea el registro en documentos_legales.
// El INSERT viaja con el token del admin autenticado: si el token no es válido,
// InsForge lo rechaza (la política RLS de INSERT exige rol authenticated),
// y nunca llegamos a tocar Storage con la clave administrativa.
export async function subirDocumentoLegal(formData: FormData, token: string): Promise<SubirDocumentoResult> {
  const cfg = getInsforgeConfig();
  if (!cfg || !cfg.anonKey) {
    return { success: false, error: 'Configuración de InsForge no disponible.' };
  }
  if (!cfg.adminKey) {
    return { success: false, error: 'Falta configurar INSFORGE_API_KEY en el servidor para subir a Storage.' };
  }
  if (!token) {
    return { success: false, error: 'Sesión administrativa requerida.' };
  }

  const file = formData.get('file') as File | null;
  const titulo = (formData.get('titulo') as string || '').trim();
  const descripcion = (formData.get('descripcion') as string || '').trim();
  const categoria = (formData.get('categoria') as string || '').trim();
  const ordenRaw = formData.get('orden') as string;
  const orden = ordenRaw ? parseInt(ordenRaw, 10) || 0 : 0;

  if (!file || file.size === 0) {
    return { success: false, error: 'Debes seleccionar un archivo PDF.' };
  }
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return { success: false, error: 'Solo se permiten archivos PDF.' };
  }
  if (!titulo) {
    return { success: false, error: 'El título es obligatorio.' };
  }

  const insertEndpoint = `${cfg.base}/api/database/records/documentos_legales`;
  let newId: string | null = null;

  try {
    // 1) Crear la fila (gate de autenticación real contra InsForge)
    const insertRes = await fetch(insertEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: cfg.anonKey,
        Authorization: `Bearer ${token}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify([{
        titulo,
        descripcion: descripcion || null,
        categoria: categoria || null,
        storage_key: 'pending',
        orden,
        activo: true,
      }]),
    });

    if (!insertRes.ok) {
      const txt = await insertRes.text();
      if (insertRes.status === 401 || insertRes.status === 403) {
        return { success: false, error: 'Tu sesión administrativa no es válida o expiró. Vuelve a iniciar sesión.' };
      }
      return { success: false, error: `Error al crear el registro: ${txt}` };
    }

    const inserted = await insertRes.json();
    const row = Array.isArray(inserted) ? inserted[0] : inserted;
    newId = row?.id;
    if (!newId) {
      return { success: false, error: 'No se pudo obtener el ID del documento creado.' };
    }

    // 2) Subir el archivo a Storage (bucket privado) usando la clave admin, server-side
    const storageKey = `${newId}.pdf`;
    const uploadFd = new FormData();
    uploadFd.append('file', file, storageKey);

    const uploadRes = await fetch(`${cfg.base}/api/storage/buckets/${BUCKET}/objects/${storageKey}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${cfg.adminKey}` },
      body: uploadFd,
    });

    if (!uploadRes.ok) {
      const txt = await uploadRes.text();
      // rollback: eliminar la fila huérfana
      await fetch(`${insertEndpoint}?id=eq.${newId}`, {
        method: 'DELETE',
        headers: { apikey: cfg.anonKey, Authorization: `Bearer ${token}` },
      }).catch(() => {});
      return { success: false, error: `Error al subir el archivo: ${txt}` };
    }

    // 3) Actualizar la fila con el storage_key definitivo
    const updateRes = await fetch(`${insertEndpoint}?id=eq.${newId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: cfg.anonKey,
        Authorization: `Bearer ${token}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ storage_key: storageKey }),
    });

    if (!updateRes.ok) {
      const txt = await updateRes.text();
      return { success: false, error: `Archivo subido pero no se pudo enlazar al registro: ${txt}` };
    }

    const updated = await updateRes.json();
    const finalRow = Array.isArray(updated) ? updated[0] : updated;

    return { success: true, documento: finalRow };
  } catch (error: any) {
    console.error('Error subiendo documento legal:', error);
    if (newId) {
      await fetch(`${insertEndpoint}?id=eq.${newId}`, {
        method: 'DELETE',
        headers: { apikey: cfg.anonKey!, Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    return { success: false, error: `Error inesperado: ${error.message}` };
  }
}

export interface EliminarDocumentoResult {
  success: boolean;
  error?: string;
}

// Elimina la fila (gate de autenticación) y, si eso funcionó, el objeto en Storage.
export async function eliminarDocumentoLegal(id: string, storageKey: string, token: string): Promise<EliminarDocumentoResult> {
  const cfg = getInsforgeConfig();
  if (!cfg || !cfg.anonKey) {
    return { success: false, error: 'Configuración de InsForge no disponible.' };
  }
  if (!token) {
    return { success: false, error: 'Sesión administrativa requerida.' };
  }

  try {
    const deleteRes = await fetch(`${cfg.base}/api/database/records/documentos_legales?id=eq.${id}`, {
      method: 'DELETE',
      headers: { apikey: cfg.anonKey, Authorization: `Bearer ${token}` },
    });

    if (!deleteRes.ok) {
      const txt = await deleteRes.text();
      if (deleteRes.status === 401 || deleteRes.status === 403) {
        return { success: false, error: 'Tu sesión administrativa no es válida o expiró.' };
      }
      return { success: false, error: `Error al eliminar el registro: ${txt}` };
    }

    if (cfg.adminKey && storageKey) {
      await fetch(`${cfg.base}/api/storage/buckets/${BUCKET}/objects/${storageKey}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${cfg.adminKey}` },
      }).catch((e) => console.error('Error eliminando objeto de Storage:', e));
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error eliminando documento legal:', error);
    return { success: false, error: `Error inesperado: ${error.message}` };
  }
}
