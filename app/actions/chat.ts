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
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  
  if (!apiKey) {
    return { error: "Configuración de IA incompleta (Falta GEMINI_API_KEY).", success: false };
  }

  // Regresamos a v1beta que tiene soporte completo para system_instruction
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  // Preparar los contenidos
  const contents = history.map(h => ({
    role: h.role === "model" ? "model" : "user",
    parts: h.parts
  }));

  // Añadir la pregunta actual si el historial no la incluye
  contents.push({ role: "user", parts: [{ text: message }] });

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        system_instruction: { // Snake_case es obligatorio en REST v1beta
          parts: [{ text: SYSTEM_PROMPT }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error en API Rest:", data);
      throw new Error(data.error?.message || "Error desconocido en la API");
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error("La IA respondió pero no generó texto.");
    }

    return { text, success: true };

  } catch (error: any) {
    console.error("Fallo definitivo en ChatAgent:", error);
    return { 
      error: `Error de conexión: ${error.message}. Asegúrate de que la API KEY de Google AI Studio sea válida.`, 
      success: false 
    };
  }
}
