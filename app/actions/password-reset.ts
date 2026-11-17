'use server';

/**
 * Recuperación de contraseña del portal admin usando InsForge Auth.
 *
 * Flujo (InsForge decide por configuración si el correo trae un CÓDIGO o un ENLACE):
 *   1) POST /api/auth/email/send-reset-password           { email, redirectTo }
 *   2a) Modo código:  POST /api/auth/email/exchange-reset-password-token { email, code } -> { token }
 *   2b) Modo enlace:  el enlace redirige a `redirectTo` con el token en la URL
 *   3) POST /api/auth/email/reset-password                { newPassword, otp: token }
 *
 * Seguridad:
 *  - `redirectTo` NUNCA se toma del cliente (evita enviar tokens a un sitio ajeno).
 *  - La respuesta de "olvidé mi contraseña" es siempre genérica (no revela si el correo existe).
 */

type Result = { success: boolean; error?: string };

const CANONICAL_SITE = 'https://www.launionamericana.org';

function getConfig() {
  const url = process.env.NEXT_PUBLIC_INSFORGE_URL || process.env.VITE_INSFORGE_URL || process.env.INSFORGE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || process.env.VITE_INSFORGE_ANON_KEY || process.env.INSFORGE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { base: url.replace(/\/$/, ''), anonKey };
}

function redirectUrl() {
  const site = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || CANONICAL_SITE).replace(/\/$/, '');
  return `${site}/admin`;
}

async function post(path: string, body: Record<string, unknown>) {
  const cfg = getConfig();
  if (!cfg) throw new Error('config');
  const res = await fetch(`${cfg.base}${path}`, {
    method: 'POST',
    headers: {
      apikey: cfg.anonKey,
      Authorization: `Bearer ${cfg.anonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
    cache: 'no-store',
  });
  let data: { token?: string; message?: string } | null = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { ok: res.ok, status: res.status, data };
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// Paso 1: enviar el correo de recuperación
export async function requestPasswordReset(email: string): Promise<Result> {
  const clean = (email || '').trim().toLowerCase();
  if (!isEmail(clean)) return { success: false, error: 'Ingresa un correo electrónico válido.' };
  if (!getConfig()) {
    return { success: false, error: 'La recuperación de contraseña no está disponible en este entorno.' };
  }
  try {
    const r = await post('/api/auth/email/send-reset-password', { email: clean, redirectTo: redirectUrl() });
    if (r.status === 429) {
      return { success: false, error: 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.' };
    }
    if (!r.ok && r.status >= 500) {
      console.error('send-reset-password falló:', r.status, r.data);
      return { success: false, error: 'No pudimos enviar el correo en este momento. Inténtalo más tarde.' };
    }
    // Respuesta genérica: no revelamos si el correo existe o no.
    return { success: true };
  } catch (e) {
    console.error('requestPasswordReset error:', e);
    return { success: false, error: 'No pudimos conectar con el servidor. Inténtalo más tarde.' };
  }
}

async function applyNewPassword(token: string, newPassword: string): Promise<Result> {
  const r = await post('/api/auth/email/reset-password', { newPassword, otp: token });
  if (r.ok) return { success: true };
  console.error('reset-password falló:', r.status, r.data);
  return {
    success: false,
    error:
      r.data?.message && r.status < 500
        ? String(r.data.message)
        : 'No se pudo cambiar la contraseña. El código o enlace puede haber vencido.',
  };
}

function validatePassword(p: string): string | null {
  if (!p || p.length < 8) return 'La nueva contraseña debe tener al menos 8 caracteres.';
  return null;
}

// Paso 2 (modo código): canjear el código de 6 dígitos y fijar la nueva contraseña
export async function resetPasswordWithCode(email: string, code: string, newPassword: string): Promise<Result> {
  const clean = (email || '').trim().toLowerCase();
  const otp = (code || '').replace(/\s/g, '');
  const pwdError = validatePassword(newPassword);
  if (!isEmail(clean)) return { success: false, error: 'Correo electrónico inválido.' };
  if (!/^\d{6}$/.test(otp)) return { success: false, error: 'El código debe tener 6 dígitos.' };
  if (pwdError) return { success: false, error: pwdError };
  try {
    const ex = await post('/api/auth/email/exchange-reset-password-token', { email: clean, code: otp });
    const token = ex.data?.token;
    if (!ex.ok || !token) {
      return { success: false, error: 'Código inválido o vencido. Solicita uno nuevo.' };
    }
    return await applyNewPassword(token, newPassword);
  } catch (e) {
    console.error('resetPasswordWithCode error:', e);
    return { success: false, error: 'No pudimos conectar con el servidor. Inténtalo más tarde.' };
  }
}

// Paso 2 (modo enlace): el token llega en la URL tras abrir el enlace del correo
export async function resetPasswordWithToken(token: string, newPassword: string): Promise<Result> {
  const pwdError = validatePassword(newPassword);
  if (!token) return { success: false, error: 'Enlace inválido. Solicita uno nuevo.' };
  if (pwdError) return { success: false, error: pwdError };
  try {
    return await applyNewPassword(token, newPassword);
  } catch (e) {
    console.error('resetPasswordWithToken error:', e);
    return { success: false, error: 'No pudimos conectar con el servidor. Inténtalo más tarde.' };
  }
}
