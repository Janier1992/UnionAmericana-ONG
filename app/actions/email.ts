"use server";

import { Resend } from 'resend';

// ─── RESEND CLIENT ─────────────────────────────────────────────────────
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export interface EmailLog {
  id: string;
  to: string;
  from: string;
  subject: string;
  body: string;
  date: string;
  type: string;
}

// Additional data for richer email templates
export interface EmailContactData {
  nombre: string;
  email: string;
  pais?: string;
  tipo?: string;
  mensaje?: string;
  monto?: string;
}

// ─── IN-MEMORY LOG (compatible con entornos serverless como Hostinger) ────────
// Nota: En serverless el sistema de archivos es de solo lectura, por lo que
// los logs se mantienen en memoria durante la sesión del proceso y NO persisten
// entre reinicios. Para persistencia real, usa una base de datos (InsForge/Supabase).
let inMemoryLogs: EmailLog[] = [];

// ─── BRANDING CONSTANTS ────────────────────────────────────────────────
const LOGO_URL = 'https://launionamericana.org/logo_oficial_ua.jpg';
const BRAND = {
  darkBlue: '#1B4F72',
  mediumBlue: '#2471A3',
  lightBlue: '#5DADE2',
  accentGreen: '#27AE60',
  darkGreen: '#1E8449',
  bgDark: '#0A1628',
  bgCard: '#0F2137',
  bgLight: '#F8FAFE',
  textDark: '#2C3E50',
  textMuted: '#7F8C8D',
  textLight: '#FFFFFF',
  borderLight: '#D5E8F0',
  senderEmail: 'gerencia@launionamericana.org',
};

// ─── HELPER: READ/WRITE LOG (IN-MEMORY) ───────────────────────────────
export async function getEmailLogs(): Promise<EmailLog[]> {
  return inMemoryLogs;
}

export async function logEmail(email: Omit<EmailLog, 'id' | 'date' | 'from'>): Promise<boolean> {
  try {
    const newLog: EmailLog = {
      ...email,
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      from: BRAND.senderEmail,
      date: new Date().toISOString()
    };
    
    inMemoryLogs.unshift(newLog);
    // Limitar a los últimos 100 logs para no consumir memoria indefinidamente
    if (inMemoryLogs.length > 100) {
      inMemoryLogs = inMemoryLogs.slice(0, 100);
    }
    
    console.log(`📋 [Log] Registrado correo para: ${newLog.to} | Asunto: ${newLog.subject}`);
    return true;
  } catch (error) {
    console.error('Error logging email:', error);
    return false;
  }
}

// ─── SEND REAL EMAIL VIA RESEND ────────────────────────────────────────
async function sendRealEmail(to: string, subject: string, htmlBody: string): Promise<boolean> {
  if (!resend) {
    console.warn('⚠️ RESEND_API_KEY no configurada. El correo se registró en el log local pero NO fue enviado al destinatario real.');
    return false;
  }

  try {
    // Nota: Hasta verificar el dominio launionamericana.org en Resend,
    // se usa 'onboarding@resend.dev' como remitente de pruebas.
    // Una vez verificado el dominio, cambiar a BRAND.senderEmail.
    const fromAddress = process.env.RESEND_VERIFIED_DOMAIN === 'true'
      ? `La Unión Americana <${BRAND.senderEmail}>`
      : 'La Unión Americana <onboarding@resend.dev>';

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [to],
      subject: subject,
      html: htmlBody,
    });

    if (error) {
      console.error(`❌ Error de Resend al enviar a ${to}:`, error);
      return false;
    }

    console.log(`✅ [Resend] Correo ENVIADO exitosamente a: ${to} | ID: ${data?.id}`);
    return true;
  } catch (error: any) {
    console.error(`❌ Error de conexión con Resend:`, error.message);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════
//  SHARED HTML BUILDING BLOCKS
// ═══════════════════════════════════════════════════════════════════════

function emailHeader(): string {
  return `
    <tr>
      <td style="padding: 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, ${BRAND.darkBlue} 0%, ${BRAND.bgDark} 100%); border-bottom: 3px solid ${BRAND.accentGreen};">
          <tr>
            <td style="padding: 30px 30px 20px 30px; text-align: center;">
              <img src="${LOGO_URL}" alt="La Unión Americana" width="200" style="display: block; margin: 0 auto; max-width: 200px; height: auto;" />
              <p style="color: ${BRAND.accentGreen}; font-family: 'Segoe UI', sans-serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; font-weight: 700; margin: 15px 0 0 0;">
                Una Sola Fuerza · Cien Naciones
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

function emailFooter(): string {
  const year = new Date().getFullYear();
  return `
    <tr>
      <td style="padding: 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${BRAND.bgDark}; border-top: 2px solid ${BRAND.accentGreen};">
          <tr>
            <td style="padding: 25px 30px; text-align: center;">
              <p style="font-family: 'Segoe UI', sans-serif; font-size: 12px; color: ${BRAND.lightBlue}; margin: 0 0 6px 0; font-weight: 600;">
                Contacto oficial: ${BRAND.senderEmail}
              </p>
              <p style="font-family: 'Segoe UI', sans-serif; font-size: 11px; color: #8899AA; margin: 0 0 4px 0;">
                ONG La Unión Americana — Organización Panregional Sin Ánimo de Lucro
              </p>
              <p style="font-family: 'Segoe UI', sans-serif; font-size: 11px; color: #667788; margin: 0;">
                © ${year} La Unión Americana. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

function quoteBlock(text: string): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 25px 0;">
      <tr>
        <td style="border-left: 4px solid ${BRAND.accentGreen}; padding: 16px 20px; background-color: #F0FAF3; border-radius: 0 8px 8px 0;">
          <p style="font-family: Georgia, 'Times New Roman', serif; font-size: 14px; color: ${BRAND.darkGreen}; font-style: italic; margin: 0; line-height: 1.6;">
            "${text}"
          </p>
        </td>
      </tr>
    </table>`;
}

function dataRow(label: string, value: string, color?: string): string {
  return `
    <tr>
      <td style="padding: 10px 15px; font-family: 'Segoe UI', sans-serif; font-size: 13px; color: ${BRAND.textMuted}; border-bottom: 1px solid #EDF2F7; width: 140px; font-weight: 600;">
        ${label}
      </td>
      <td style="padding: 10px 15px; font-family: 'Segoe UI', sans-serif; font-size: 14px; color: ${color || BRAND.textDark}; border-bottom: 1px solid #EDF2F7; font-weight: 500;">
        ${value}
      </td>
    </tr>`;
}

function wrapEmail(content: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>La Unión Americana</title>
</head>
<body style="margin: 0; padding: 0; background-color: #EDF2F7; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #EDF2F7; padding: 30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(27, 79, 114, 0.12);">
          ${content}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}


// ═══════════════════════════════════════════════════════════════════════
//  TEMPLATE 1: BIENVENIDA AL VOLUNTARIO
// ═══════════════════════════════════════════════════════════════════════

function getVolunteerWelcomeHTML(data: EmailContactData): string {
  const content = `
    ${emailHeader()}
    <tr>
      <td style="padding: 35px 30px;">
        <!-- Badge -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 25px;">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color: #E8F8F0; color: ${BRAND.darkGreen}; font-family: 'Segoe UI', sans-serif; font-size: 12px; font-weight: 700; padding: 6px 18px; border-radius: 20px; letter-spacing: 1px; text-transform: uppercase;">
                    ✅ Registro Recibido Exitosamente
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <p style="font-family: 'Segoe UI', sans-serif; font-size: 15px; color: ${BRAND.textDark}; line-height: 1.7; margin: 0 0 15px 0;">
          Estimado/a <strong style="color: ${BRAND.darkBlue};">${data.nombre}</strong>,
        </p>

        <p style="font-family: 'Segoe UI', sans-serif; font-size: 15px; color: ${BRAND.textDark}; line-height: 1.7; margin: 0 0 15px 0;">
          Te damos la más cordial bienvenida a nuestro <strong>registro continental de talento</strong>. Hemos recibido tu postulación de interés en pertenecer a <strong style="color: ${BRAND.darkBlue};">La Unión Americana</strong>, una organización panregional sin ánimo de lucro dedicada a la dignidad y desarrollo integral de los pueblos de América Latina y el Caribe.
        </p>

        <p style="font-family: 'Segoe UI', sans-serif; font-size: 15px; color: ${BRAND.textDark}; line-height: 1.7; margin: 0 0 15px 0;">
          Tu solicitud ha sido ingresada en nuestro sistema CRM y se encuentra en estado <strong style="color: ${BRAND.accentGreen};">Pendiente de Inducción</strong>. Un coordinador del Nodo Nacional revisará tus habilidades registradas y se pondrá en contacto contigo en breve.
        </p>

        <!-- Status Card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 25px 0; border: 1px solid ${BRAND.borderLight}; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="background-color: ${BRAND.darkBlue}; padding: 12px 20px;">
              <p style="font-family: 'Segoe UI', sans-serif; font-size: 13px; color: ${BRAND.textLight}; margin: 0; font-weight: 700; letter-spacing: 0.5px;">
                📋 Resumen de tu Solicitud
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${dataRow('Nombre', data.nombre)}
                ${dataRow('Correo', data.email, BRAND.mediumBlue)}
                ${data.pais ? dataRow('País', data.pais) : ''}
                ${data.tipo ? dataRow('Participación', data.tipo) : ''}
                ${dataRow('Estado', '🟡 Pendiente de Inducción', BRAND.accentGreen)}
              </table>
            </td>
          </tr>
        </table>

        <p style="font-family: 'Segoe UI', sans-serif; font-size: 15px; color: ${BRAND.textDark}; line-height: 1.7; margin: 0 0 10px 0;">
          Agradecemos profundamente tu disposición para unir fuerzas en este proceso de transformación continental. Juntos construimos la América Latina que merecemos.
        </p>

        ${quoteBlock('América Latina debe convertirse en el destino donde sus habitantes elijan construir su futuro.')}

        <p style="font-family: 'Segoe UI', sans-serif; font-size: 14px; color: ${BRAND.textMuted}; line-height: 1.6; margin: 0;">
          Con aprecio,<br/>
          <strong style="color: ${BRAND.darkBlue};">Equipo de Coordinación Continental</strong><br/>
          La Unión Americana ONG
        </p>
      </td>
    </tr>
    ${emailFooter()}`;

  return wrapEmail(content);
}


// ═══════════════════════════════════════════════════════════════════════
//  TEMPLATE 2: ALERTA ADMIN — NUEVO VOLUNTARIO
// ═══════════════════════════════════════════════════════════════════════

function getAdminVolunteerAlertHTML(data: EmailContactData): string {
  const timestamp = new Date().toLocaleString('es-CO', { 
    dateStyle: 'full', 
    timeStyle: 'short',
    timeZone: 'America/Bogota'
  });

  const content = `
    ${emailHeader()}
    <tr>
      <td style="padding: 35px 30px;">
        <!-- Alert Badge -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 25px;">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color: #FFF3E0; color: #E65100; font-family: 'Segoe UI', sans-serif; font-size: 12px; font-weight: 700; padding: 6px 18px; border-radius: 20px; letter-spacing: 1px; text-transform: uppercase;">
                    🚨 Nueva Solicitud de Voluntariado
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <p style="font-family: 'Segoe UI', sans-serif; font-size: 15px; color: ${BRAND.textDark}; line-height: 1.7; margin: 0 0 15px 0;">
          Estimada Gerencia,
        </p>

        <p style="font-family: 'Segoe UI', sans-serif; font-size: 15px; color: ${BRAND.textDark}; line-height: 1.7; margin: 0 0 20px 0;">
          Se ha recibido una nueva solicitud de voluntariado a través del portal web de La Unión Americana. A continuación se detallan los datos del aspirante:
        </p>

        <!-- Data Card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0; border: 1px solid ${BRAND.borderLight}; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, ${BRAND.darkBlue}, ${BRAND.mediumBlue}); padding: 14px 20px;">
              <p style="font-family: 'Segoe UI', sans-serif; font-size: 14px; color: ${BRAND.textLight}; margin: 0; font-weight: 700;">
                🤝 Datos del Aspirante a Voluntario
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${dataRow('Nombre Completo', data.nombre)}
                ${dataRow('Correo Electrónico', data.email, BRAND.mediumBlue)}
                ${dataRow('País de Residencia', data.pais || 'No especificado')}
                ${dataRow('Tipo de Participación', data.tipo || 'Voluntario')}
                ${data.mensaje ? dataRow('Habilidades / Mensaje', data.mensaje) : ''}
                ${dataRow('Fecha de Registro', timestamp, BRAND.textMuted)}
                ${dataRow('Estado Inicial', '🟡 Nuevo — Pendiente de Revisión', '#E65100')}
              </table>
            </td>
          </tr>
        </table>

        <!-- Action Box -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 25px 0; border-radius: 10px; overflow: hidden; border: 1px solid ${BRAND.borderLight};">
          <tr>
            <td style="background-color: #F0FAF3; padding: 20px 25px;">
              <p style="font-family: 'Segoe UI', sans-serif; font-size: 14px; color: ${BRAND.darkGreen}; margin: 0 0 8px 0; font-weight: 700;">
                📌 Acción Requerida
              </p>
              <p style="font-family: 'Segoe UI', sans-serif; font-size: 14px; color: ${BRAND.textDark}; margin: 0; line-height: 1.6;">
                Por favor, ingrese al <strong>Portal Administrativo CRM</strong> para revisar la solicitud, verificar los datos del aspirante y actualizar su estado (Aprobar, Contactar o Rechazar).
              </p>
            </td>
          </tr>
        </table>

        <p style="font-family: 'Segoe UI', sans-serif; font-size: 13px; color: ${BRAND.textMuted}; margin: 0;">
          — Sistema de Notificaciones Automáticas · La Unión Americana
        </p>
      </td>
    </tr>
    ${emailFooter()}`;

  return wrapEmail(content);
}


// ═══════════════════════════════════════════════════════════════════════
//  TEMPLATE 3: CONFIRMACIÓN AL DONANTE
// ═══════════════════════════════════════════════════════════════════════

function getDonorWelcomeHTML(data: EmailContactData): string {
  const content = `
    ${emailHeader()}
    <tr>
      <td style="padding: 35px 30px;">
        <!-- Badge -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 25px;">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color: #E3F2FD; color: ${BRAND.darkBlue}; font-family: 'Segoe UI', sans-serif; font-size: 12px; font-weight: 700; padding: 6px 18px; border-radius: 20px; letter-spacing: 1px; text-transform: uppercase;">
                    💙 Contribución Registrada
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <p style="font-family: 'Segoe UI', sans-serif; font-size: 15px; color: ${BRAND.textDark}; line-height: 1.7; margin: 0 0 15px 0;">
          Estimado/a <strong style="color: ${BRAND.darkBlue};">${data.nombre}</strong>,
        </p>

        <p style="font-family: 'Segoe UI', sans-serif; font-size: 15px; color: ${BRAND.textDark}; line-height: 1.7; margin: 0 0 15px 0;">
          Agradecemos profundamente su intención de contribución y patrocinio para el desarrollo de los pilares continentales de <strong style="color: ${BRAND.darkBlue};">La Unión Americana</strong>.
        </p>

        <p style="font-family: 'Segoe UI', sans-serif; font-size: 15px; color: ${BRAND.textDark}; line-height: 1.7; margin: 0 0 15px 0;">
          Su apoyo económico o tangible es el motor que financia proyectos vitales como la instalación de <strong>Biofactorías ecológicas</strong>, el despliegue de <strong>escuelas de talento</strong> locales en territorios vulnerabilizados y programas de <strong>asistencia humanitaria directa</strong> en toda América Latina y el Caribe.
        </p>

        <!-- Data Card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 25px 0; border: 1px solid ${BRAND.borderLight}; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, ${BRAND.accentGreen}, ${BRAND.darkGreen}); padding: 12px 20px;">
              <p style="font-family: 'Segoe UI', sans-serif; font-size: 13px; color: ${BRAND.textLight}; margin: 0; font-weight: 700; letter-spacing: 0.5px;">
                💰 Datos de su Contribución
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${dataRow('Donante / Entidad', data.nombre)}
                ${dataRow('Correo', data.email, BRAND.mediumBlue)}
                ${data.pais ? dataRow('País', data.pais) : ''}
                ${data.tipo ? dataRow('Tipo de Aporte', data.tipo) : ''}
                ${data.monto ? dataRow('Monto Donado', data.monto) : ''}
                ${data.mensaje ? dataRow('Detalles', data.mensaje) : ''}
                ${dataRow('Estado', '🔵 En proceso de verificación', BRAND.mediumBlue)}
              </table>
            </td>
          </tr>
        </table>

        <!-- Next Steps -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 25px 0; border-radius: 10px; overflow: hidden; border: 1px solid #E3F2FD;">
          <tr>
            <td style="background-color: #F0F7FF; padding: 20px 25px;">
              <p style="font-family: 'Segoe UI', sans-serif; font-size: 14px; color: ${BRAND.darkBlue}; margin: 0 0 8px 0; font-weight: 700;">
                📋 Próximos Pasos
              </p>
              <p style="font-family: 'Segoe UI', sans-serif; font-size: 14px; color: ${BRAND.textDark}; margin: 0; line-height: 1.7;">
                Un gestor de filantropía y alianzas corporativas verificará los datos de su aporte y se pondrá en contacto con usted en las próximas <strong>24 horas</strong> para coordinar la recepción y formalización del patrocinio.
              </p>
            </td>
          </tr>
        </table>

        ${quoteBlock('El desarrollo continental no es un acto de caridad, es un acto de justicia. Cada aporte transforma vidas y construye el futuro que América Latina merece.')}

        <p style="font-family: 'Segoe UI', sans-serif; font-size: 14px; color: ${BRAND.textMuted}; line-height: 1.6; margin: 0;">
          Con gratitud,<br/>
          <strong style="color: ${BRAND.darkBlue};">Dirección de Filantropía y Alianzas Estratégicas</strong><br/>
          La Unión Americana ONG
        </p>
      </td>
    </tr>
    ${emailFooter()}`;

  return wrapEmail(content);
}


// ═══════════════════════════════════════════════════════════════════════
//  TEMPLATE 4: ALERTA ADMIN — NUEVA DONACIÓN
// ═══════════════════════════════════════════════════════════════════════

function getAdminDonationAlertHTML(data: EmailContactData): string {
  const timestamp = new Date().toLocaleString('es-CO', { 
    dateStyle: 'full', 
    timeStyle: 'short',
    timeZone: 'America/Bogota'
  });

  const content = `
    ${emailHeader()}
    <tr>
      <td style="padding: 35px 30px;">
        <!-- Alert Badge -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 25px;">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color: #E8F5E9; color: ${BRAND.darkGreen}; font-family: 'Segoe UI', sans-serif; font-size: 12px; font-weight: 700; padding: 6px 18px; border-radius: 20px; letter-spacing: 1px; text-transform: uppercase;">
                    💰 Nueva Donación Registrada
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <p style="font-family: 'Segoe UI', sans-serif; font-size: 15px; color: ${BRAND.textDark}; line-height: 1.7; margin: 0 0 15px 0;">
          Estimada Gerencia,
        </p>

        <p style="font-family: 'Segoe UI', sans-serif; font-size: 15px; color: ${BRAND.textDark}; line-height: 1.7; margin: 0 0 20px 0;">
          Se ha registrado una nueva intención de donación o patrocinio a través del portal web. A continuación, los datos completos del aportante:
        </p>

        <!-- Data Card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0; border: 1px solid ${BRAND.borderLight}; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, ${BRAND.accentGreen}, ${BRAND.darkGreen}); padding: 14px 20px;">
              <p style="font-family: 'Segoe UI', sans-serif; font-size: 14px; color: ${BRAND.textLight}; margin: 0; font-weight: 700;">
                💎 Datos del Donante / Patrocinador
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${dataRow('Donante / Entidad', data.nombre)}
                ${dataRow('Correo Electrónico', data.email, BRAND.mediumBlue)}
                ${dataRow('País de Origen', data.pais || 'No especificado')}
                ${dataRow('Tipo de Aporte', data.tipo || 'Donación general')}
                ${data.monto ? dataRow('Monto / Valor', data.monto) : ''}
                ${data.mensaje ? dataRow('Detalles del Aporte', data.mensaje) : ''}
                ${dataRow('Fecha de Registro', timestamp, BRAND.textMuted)}
                ${dataRow('Estado', '🔵 Pendiente de Verificación', BRAND.mediumBlue)}
              </table>
            </td>
          </tr>
        </table>

        <!-- Action Box -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 25px 0; border-radius: 10px; overflow: hidden; border: 1px solid #C8E6C9;">
          <tr>
            <td style="background-color: #F0FAF3; padding: 20px 25px;">
              <p style="font-family: 'Segoe UI', sans-serif; font-size: 14px; color: ${BRAND.darkGreen}; margin: 0 0 8px 0; font-weight: 700;">
                📌 Acción Requerida
              </p>
              <p style="font-family: 'Segoe UI', sans-serif; font-size: 14px; color: ${BRAND.textDark}; margin: 0; line-height: 1.6;">
                Verifique los datos de la contribución en el <strong>Portal Administrativo CRM</strong> y contacte al donante dentro de las próximas <strong>24 horas</strong> para coordinar la recepción, facturación y formalización del patrocinio.
              </p>
            </td>
          </tr>
        </table>

        <p style="font-family: 'Segoe UI', sans-serif; font-size: 13px; color: ${BRAND.textMuted}; margin: 0;">
          — Sistema de Notificaciones Automáticas · La Unión Americana
        </p>
      </td>
    </tr>
    ${emailFooter()}`;

  return wrapEmail(content);
}


// ═══════════════════════════════════════════════════════════════════════
//  TEMPLATE 5: CONFIRMACIÓN DE CONTACTO GENERAL
// ═══════════════════════════════════════════════════════════════════════

function getContactWelcomeHTML(data: EmailContactData): string {
  const content = `
    ${emailHeader()}
    <tr>
      <td style="padding: 35px 30px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 25px;">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color: #E3F2FD; color: ${BRAND.darkBlue}; font-family: 'Segoe UI', sans-serif; font-size: 12px; font-weight: 700; padding: 6px 18px; border-radius: 20px; letter-spacing: 1px; text-transform: uppercase;">
                    ✉️ Mensaje Recibido
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <p style="font-family: 'Segoe UI', sans-serif; font-size: 15px; color: ${BRAND.textDark}; line-height: 1.7; margin: 0 0 15px 0;">
          Estimado/a <strong style="color: ${BRAND.darkBlue};">${data.nombre}</strong>,
        </p>

        <p style="font-family: 'Segoe UI', sans-serif; font-size: 15px; color: ${BRAND.textDark}; line-height: 1.7; margin: 0 0 15px 0;">
          Gracias por escribirnos. Su consulta o mensaje ha sido ingresado exitosamente en nuestra mesa de atención de <strong style="color: ${BRAND.darkBlue};">La Unión Americana</strong>.
        </p>

        <p style="font-family: 'Segoe UI', sans-serif; font-size: 15px; color: ${BRAND.textDark}; line-height: 1.7; margin: 0 0 20px 0;">
          Un miembro del equipo de relaciones comunitarias analizará el detalle y responderá a su mensaje a la brevedad posible.
        </p>

        ${quoteBlock('La unidad continental comienza con una conversación. Gracias por dar el primer paso.')}

        <p style="font-family: 'Segoe UI', sans-serif; font-size: 14px; color: ${BRAND.textMuted}; line-height: 1.6; margin: 0;">
          Cordialmente,<br/>
          <strong style="color: ${BRAND.darkBlue};">Equipo de Relaciones Comunitarias</strong><br/>
          La Unión Americana ONG
        </p>
      </td>
    </tr>
    ${emailFooter()}`;

  return wrapEmail(content);
}


// ═══════════════════════════════════════════════════════════════════════
//  PUBLIC API: SEND AUTOMATED EMAILS
// ═══════════════════════════════════════════════════════════════════════

export async function sendAutomatedEmail(
  to: string, 
  name: string, 
  type: 'voluntario' | 'donante' | 'contacto',
  extraData?: Partial<EmailContactData>
): Promise<boolean> {

  const contactData: EmailContactData = {
    nombre: name,
    email: to,
    pais: extraData?.pais || undefined,
    tipo: extraData?.tipo || undefined,
    mensaje: extraData?.mensaje || undefined,
  };

  // ── 1. Correo de bienvenida/confirmación al usuario ──────────────
  const welcomeSubject = type === 'voluntario' 
    ? '¡Bienvenido/a a La Unión Americana — Tu participación continental!' 
    : type === 'donante' 
    ? '¡Gracias por financiar la Dignidad y el Desarrollo Continental!' 
    : 'La Unión Americana — Hemos recibido tu mensaje';
  
  const welcomeBody = type === 'voluntario' 
    ? getVolunteerWelcomeHTML(contactData)
    : type === 'donante' 
    ? getDonorWelcomeHTML(contactData)
    : getContactWelcomeHTML(contactData);
  
  // Log local (auditoría) + Envío real via Resend
  const logSuccess = await logEmail({
    to,
    subject: welcomeSubject,
    body: welcomeBody,
    type: `${type}_welcome`
  });

  const sendSuccess = await sendRealEmail(to, welcomeSubject, welcomeBody);

  // ── 2. Correo de alerta al administrador ─────────────────────────
  let adminSubject = '';
  let adminBody = '';

  if (type === 'voluntario') {
    adminSubject = `🚨 Nueva Solicitud de Voluntariado: ${name}`;
    adminBody = getAdminVolunteerAlertHTML(contactData);
  } else if (type === 'donante') {
    adminSubject = `💰 Nueva Donación Registrada: ${name}`;
    adminBody = getAdminDonationAlertHTML(contactData);
  }

  if (adminSubject && adminBody) {
    // Log local (auditoría)
    await logEmail({
      to: BRAND.senderEmail,
      subject: adminSubject,
      body: adminBody,
      type: `${type}_admin_alert`
    });

    // Envío real al correo de gerencia
    await sendRealEmail(BRAND.senderEmail, adminSubject, adminBody);
  }

  return logSuccess || sendSuccess;
}

// ═══════════════════════════════════════════════════════════════════════
//  TEMPLATES: VOLUNTEER STATUS UPDATES (APPROVED / REJECTED)
// ═══════════════════════════════════════════════════════════════════════

function getVolunteerApprovedHTML(name: string): string {
  const content = `
    ${emailHeader()}
    <tr>
      <td style="padding: 35px 30px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 25px;">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color: #E8F8F0; color: ${BRAND.darkGreen}; font-family: 'Segoe UI', sans-serif; font-size: 12px; font-weight: 700; padding: 6px 18px; border-radius: 20px; letter-spacing: 1px; text-transform: uppercase;">
                    🎉 ¡Postulación Aprobada!
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <p style="font-family: 'Segoe UI', sans-serif; font-size: 15px; color: ${BRAND.textDark}; line-height: 1.7; margin: 0 0 15px 0;">
          Estimado/a <strong style="color: ${BRAND.darkBlue};">${name}</strong>,
        </p>

        <p style="font-family: 'Segoe UI', sans-serif; font-size: 15px; color: ${BRAND.textDark}; line-height: 1.7; margin: 0 0 15px 0;">
          Nos complace enormemente informarte que tu postulación para formar parte de <strong style="color: ${BRAND.darkBlue};">La Unión Americana</strong> como voluntario ha sido **APROBADA**. ¡Felicidades!
        </p>

        <p style="font-family: 'Segoe UI', sans-serif; font-size: 15px; color: ${BRAND.textDark}; line-height: 1.7; margin: 0 0 15px 0;">
          A partir de la fecha, iniciamos formalmente el trámite de inducción e incorporación para asignarte al Nodo correspondiente y coordinar tus actividades de impacto en el territorio.
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 25px 0; border-radius: 10px; overflow: hidden; border: 1px solid ${BRAND.borderLight};">
          <tr>
            <td style="background-color: #F0FAF3; padding: 20px 25px;">
              <p style="font-family: 'Segoe UI', sans-serif; font-size: 14px; color: ${BRAND.darkGreen}; margin: 0 0 8px 0; font-weight: 700;">
                📢 ¿Qué sigue ahora?
              </p>
              <p style="font-family: 'Segoe UI', sans-serif; font-size: 14px; color: ${BRAND.textDark}; margin: 0; line-height: 1.6;">
                Uno de nuestros coordinadores locales se pondrá en contacto contigo en las próximas horas para agendar tu primera sesión de bienvenida e inducción virtual.
              </p>
            </td>
          </tr>
        </table>

        ${quoteBlock('La fuerza de nuestro continente reside en la voluntad de su gente. Gracias por ser parte de este despertar latinoamericano.')}

        <p style="font-family: 'Segoe UI', sans-serif; font-size: 14px; color: ${BRAND.textMuted}; line-height: 1.6; margin: 0;">
          Bienvenido/a a bordo,<br/>
          <strong style="color: ${BRAND.darkBlue};">Dirección de Voluntariado Continental</strong><br/>
          La Unión Americana ONG
        </p>
      </td>
    </tr>
    ${emailFooter()}`;

  return wrapEmail(content);
}

function getVolunteerRejectedHTML(name: string): string {
  const content = `
    ${emailHeader()}
    <tr>
      <td style="padding: 35px 30px;">
        <p style="font-family: 'Segoe UI', sans-serif; font-size: 15px; color: ${BRAND.textDark}; line-height: 1.7; margin: 0 0 15px 0;">
          Estimado/a <strong style="color: ${BRAND.darkBlue};">${name}</strong>,
        </p>

        <p style="font-family: 'Segoe UI', sans-serif; font-size: 15px; color: ${BRAND.textDark}; line-height: 1.7; margin: 0 0 15px 0;">
          Queremos agradecerte sinceramente el tiempo y el gran interés que has mostrado al postularte para colaborar con <strong style="color: ${BRAND.darkBlue};">La Unión Americana</strong>.
        </p>

        <p style="font-family: 'Segoe UI', sans-serif; font-size: 15px; color: ${BRAND.textDark}; line-height: 1.7; margin: 0 0 15px 0;">
          Lamentablemente, en esta oportunidad no podemos contar con tu participación para los proyectos activos actuales en tu región. Sin embargo, mantendremos tu perfil en nuestra base continental de talento para futuras convocatorias acordes a tus habilidades.
        </p>

        <p style="font-family: 'Segoe UI', sans-serif; font-size: 15px; color: ${BRAND.textDark}; line-height: 1.7; margin: 0 0 25px 0;">
          Te invitamos cordialmente a seguir de cerca nuestras actividades, redes y a postularte de nuevo en futuros procesos de reclutamiento. Tu iniciativa de transformación continental sigue sumando.
        </p>

        ${quoteBlock('Cada paso cuenta, y cada intención de ayudar es una semilla para el desarrollo de nuestra América.')}

        <p style="font-family: 'Segoe UI', sans-serif; font-size: 14px; color: ${BRAND.textMuted}; line-height: 1.6; margin: 0;">
          Atentamente,<br/>
          <strong style="color: ${BRAND.darkBlue};">Equipo de Selección de Voluntariado</strong><br/>
          La Unión Americana ONG
        </p>
      </td>
    </tr>
    ${emailFooter()}`;

  return wrapEmail(content);
}

export async function sendVolunteerStatusEmail(
  to: string,
  name: string,
  status: 'Aprobado' | 'Rechazado'
): Promise<boolean> {
  const subject = status === 'Aprobado'
    ? '🎉 ¡Tu postulación ha sido Aprobada en La Unión Americana!'
    : 'La Unión Americana — Actualización sobre tu postulación';

  const body = status === 'Aprobado'
    ? getVolunteerApprovedHTML(name)
    : getVolunteerRejectedHTML(name);

  // Guardar log
  await logEmail({
    to,
    subject,
    body,
    type: `voluntario_${status.toLowerCase()}`
  });

  // Enviar real
  return await sendRealEmail(to, subject, body);
}
