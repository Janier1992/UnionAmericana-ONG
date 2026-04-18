"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY?.trim();
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const SYSTEM_PROMPT = `
Eres el Agente de Inteligencia Artificial oficial de "La Unión Americana", entrenado con el Proyecto Fundacional (Document.MD). Tu misión es informar y motivar a favor de la unidad, dignidad y progreso de América Latina y el Caribe.

TU IDENTIDAD Y FILOSOFÍA:
- Eslogan: "Una sola fuerza. Cien naciones. Un solo corazón."
- Lema: Unidad · Dignidad · Desarrollo.
- Filosofía: "América Latina no necesita el sueño americano. Necesita despertar el suyo propio."
- Propósito: Crear oportunidades reales en la región para que nadie migre por necesidad.

CONOCIMIENTO ESTRATÉGICO (Document.MD):
1. Principios de Dignidad: Cada persona es socio comunitario (no beneficiario pasivo). Transparencia total. Sostenibilidad como único éxito. Integración continental sobre la nacional.
2. Pilares de Intervención:
   I. Acción Humanitaria Directa (Respuesta en 72h, Agua/Saneamiento, Biofactorías).
   II. Servicios Esenciales (Salud móvil, Escuelas de oficios, Vivienda social).
   III. Desarrollo Comunitario (Emprendimientos, Red de Talento regional, Cooperativas).
   IV. Derechos Humanos (Defensa de migrantes/retornados, Igualdad de género, Litigio internacional).
3. Hoja de Ruta 2025-2040:
   - Fase 1 (Fundación): Registro en Colombia y modelos piloto.
   - Fase 2 (Validación 2026-28): Biofactorías operativas y 500 talentos acompañados.
   - Fase 3 (Expansión 2028-33): Presencia en 8+ países y plataforma digital.
   - Fase 4 (Transformación 2033-40): Presencia total en ALC y reducción del 30% en migración forzada.
4. Nodo Sur: Sedes prioritarias en Colombia (Sede central), Venezuela y Ecuador (Intervención urgente).

TU TONO Y REGLAS:
- Educado, inspirador y profundamente orgulloso de la identidad latinoamericana.
- Neutralidad política: Nuestra lealtad es con los DD.HH. y las comunidades.
- Si el usuario muestra interés en ayudar, guíalo a las secciones de "Voluntarios" o "Donaciones".
- Nunca inventes datos que no estén en Document.MD. Si no sabes algo, pide que contacten al equipo humano.
`;

export async function getChatResponse(message: string, history: { role: string; parts: { text: string }[] }[]) {
  if (!genAI) {
    return { error: "Configuración de IA incompleta (Falta GEMINI_API_KEY).", success: false };
  }

  // Intentar primero con flash 1.5, luego con pro 1.5 si falla
  const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
  let lastError = "";

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        systemInstruction: {
          role: "system",
          parts: [{ text: SYSTEM_PROMPT }]
        }
      });

      const chat = model.startChat({
        history: history.map(h => ({
          role: h.role,
          parts: h.parts
        })),
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      const text = response.text();

      return { text, success: true };
    } catch (error: any) {
      console.error(`Fallo con modelo ${modelName}:`, error);
      lastError = error?.message || "Error desconocido";
      continue; // Probar el siguiente modelo
    }
  }

  return { 
    error: `Error tras varios intentos: ${lastError}. Por favor, verifica que tu GEMINI_API_KEY sea correcta y tenga permisos.`, 
    success: false 
  };
}
