# 🌎 PROMPT PARA AGENTE DE CODIFICACIÓN — SITIO WEB LA UNIÓN AMERICANA

> **Instrucción de uso:** Este documento es el briefing completo para un agente de desarrollo web. Entrégalo íntegro al agente. Contiene la identidad del proyecto, arquitectura de páginas, sistema de diseño, contenidos, y directrices técnicas. No requiere contexto adicional.

---

## 1. CONTEXTO DEL PROYECTO

**Nombre de la organización:** La Unión Americana  
**Tipo:** ONG panlatinamericana de cooperación e integración regional  
**Sede fundacional:** Colombia (con presencia en múltiples países de ALC)  
**Año de fundación:** 2026  
**Eslogan principal:** *"Una sola fuerza. Cien naciones. Un solo corazón."*  
**Frase filosófica central:** *"América Latina no necesita el sueño americano. América Latina necesita despertar su propio sueño."*

### Misión
Crear oportunidades reales dentro de América Latina para que sus pueblos no se vean obligados a buscar una vida mejor en otro continente — combatiendo la desigualdad, descubriendo el talento local y posicionando la región como hub global, no como exportadora de capital humano.

### Los 4 Pilares de Intervención
1. **Asistencia humanitaria directa** — Respuesta a crisis, emergencias y necesidades básicas inmediatas.
2. **Servicios donde el Estado está ausente** — Salud (clínicas móviles), educación (alfabetización, becas, escuelas de oficios), vivienda y deporte.
3. **Desarrollo comunitario y social** — Identificación de talento local, ecosistemas económicos regionales, cooperativas, Biofactorías (conversión de aguas residuales en agua tratada, biogás y nutrientes).
4. **Defensa de derechos humanos** — Protección de migrantes en el exterior, incidencia política, integración regional latinoamericana.

### Hoja de Ruta (4 Fases hasta 2040)
| Fase | Período | Hito Principal |
|------|---------|---------------|
| Fase 1: Fundación | Meses 1–12 | Registro legal en 3+ países, equipo fundador, primer financiamiento |
| Fase 2: Piloto | Meses 13–36 | Primera Biofactoría operativa, 500 jóvenes talentos acompañados |
| Fase 3: Expansión | Meses 37–72 | Presencia en 8+ países, plataforma de talentos con 10,000+ usuarios |
| Fase 4: Transformación | Años 7–15 | 20+ comunidades autosostenibles, reducción del 30% en intención de migrar |

### ODS Alineados
ODS 1, 2, 3, 4, 5, 6, 10 y 17.

---

## 2. IDENTIDAD VISUAL Y SISTEMA DE DISEÑO

### 2.1 Dirección Estética
**Concepto:** *"Tierra viva y unidad continental"* — la web debe evocar la riqueza cultural de América Latina (calor, fuerza, identidad) combinada con la seriedad institucional de una ONG internacional de primer nivel. No es folclórica ni turística: es poderosa, digna y contemporánea.

**Tono visual:** Editorial latinoamericano de lujo. Piensa en la paleta de Diego Rivera encontrándose con el diseño institucional de la ONU. Majestuoso pero cercano. Sofisticado pero humano.

**NO usar:** Diseño genérico de ONG (fondos blancos, fotografía de stock de niños sonriendo, botones azules genéricos, tipografías Inter o Roboto, degradados morados). Nada que se vea como una plantilla de Wix o Squarespace.

### 2.2 Paleta de Colores
```css
:root {
  /* Primarios */
  --color-tierra:       #8B2500;   /* Rojo tierra — pasión, urgencia, identidad */
  --color-selva:        #1A3D2B;   /* Verde selva — esperanza, naturaleza, vida */
  --color-oro:          #C8860A;   /* Oro andino — riqueza, talento, dignidad */

  /* Secundarios */
  --color-arena:        #F2E8D5;   /* Arena cálida — fondo principal, calidez */
  --color-carbon:       #1C1C1C;   /* Carbón — textos principales */
  --color-niebla:       #EDF0EC;   /* Niebla — secciones alternativas */

  /* Acento */
  --color-turquesa:     #006D77;   /* Turquesa caribeño — acento llamativo */

  /* Utilidades */
  --color-blanco:       #FAFAF8;
  --color-sombra:       rgba(28, 28, 28, 0.08);
}
```

### 2.3 Tipografía
```css
/* Display / Títulos principales */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap');
--font-display: 'Playfair Display', Georgia, serif;

/* Subtítulos y navegación */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&display=swap');
--font-secondary: 'Cormorant Garamond', serif;

/* Cuerpo de texto */
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@300;400;600&display=swap');
--font-body: 'Source Serif 4', Georgia, serif;

/* UI / Etiquetas / Botones */
@import url('https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;500;600&display=swap');
--font-ui: 'Libre Franklin', sans-serif;
```

### 2.4 Elementos Visuales Signature
- **Textura de fondo:** Sutil grain/noise CSS en secciones oscuras para dar profundidad.
- **Separadores:** Líneas finas doradas (`--color-oro`) o patrones geométricos inspirados en arte precolombino (grecas aztecas / patrones andinos) — implementar en SVG inline.
- **Formas de corte:** Las secciones no tienen bordes rectos horizontales; usar `clip-path` diagonal o curvo para transiciones entre secciones.
- **Mapa decorativo:** En la sección de cobertura, mostrar un mapa SVG minimalista de América Latina con puntos de presencia animados.
- **Animaciones de entrada:** `Intersection Observer` + clases CSS para revelar elementos con `opacity` y `translateY` al hacer scroll. Suaves, no exageradas.
- **Hover en cards:** Elevación sutil con `box-shadow` + pequeño desplazamiento `translateY(-4px)` + borde izquierdo de color.

---

## 3. ARQUITECTURA DEL SITIO

El sitio es una **Single Page Application (SPA) o sitio estático multi-sección** con navegación suave entre anclas. Puede ser HTML/CSS/JS puro o Next.js / React. El agente elige la tecnología más adecuada para producción.

### Secciones (en orden de aparición):

```
1. [HERO]           — Landing principal
2. [MANIFIESTO]     — La filosofía y la visión
3. [PILARES]        — Los 4 ejes de intervención
4. [IMPACTO]        — Métricas y alcance proyectado
5. [HOJA DE RUTA]   — Las 4 fases (timeline visual)
6. [TALENTO]        — Plataforma de talento latinoamericano
7. [ODS]            — Alineación con objetivos globales
8. [ÚNETE]          — Cómo participar (voluntarios, aliados, donantes)
9. [CONTACTO]       — Formulario y redes
10. [FOOTER]        — Legal y navegación secundaria
```

---

## 4. ESPECIFICACIONES POR SECCIÓN

### 4.1 NAVBAR
- **Fijo** en la parte superior con fondo transparente que se vuelve `--color-selva` sólido al hacer scroll (efecto `scrolled`).
- **Logo:** Texto "La Unión Americana" en `--font-display` + ícono SVG de un mapa de ALC estilizado o una estrella de múltiples puntas representando la unión.
- **Links:** Inicio · Manifiesto · Pilares · Impacto · Únete · Contacto
- **CTA Navbar:** Botón "Súmate" en `--color-oro` con texto oscuro.
- **Responsive:** Menú hamburguesa en móvil con animación deslizante desde la derecha.

---

### 4.2 SECCIÓN HERO
**Objetivo:** Impacto emocional inmediato. El visitante debe sentir la grandeza de América Latina en 3 segundos.

**Estructura:**
- Fondo: gradiente diagonal de `--color-selva` a `--color-carbon` con noise texture sutil.
- Capa decorativa: mapa SVG de América Latina semitransparente en el lado derecho, con efecto parallax suave.
- **Título H1** (animado letra a letra o línea a línea):  
  ```
  Una sola fuerza.
  Cien naciones.
  Un solo corazón.
  ```
  Tipografía: `--font-display`, tamaño enorme (clamp de 52px a 96px), color blanco con la palabra "Corazón" en `--color-oro`.
- **Subtítulo:** "La Unión Americana es la ONG panlatinamericana que construye oportunidades para que nuestra gente no tenga que irse."
- **CTAs:**
  - Botón primario: "Conoce nuestra misión" → scroll a #manifiesto (fondo `--color-oro`, texto oscuro)
  - Botón secundario: "Quiero participar" → scroll a #unete (borde blanco, texto blanco)
- **Scroll indicator:** Flecha o línea animada apuntando hacia abajo.
- **Dato estadístico flotante:** Badge o chip con "650+ millones de latinoamericanos. Un destino compartido."

---

### 4.3 SECCIÓN MANIFIESTO
**Objetivo:** Transmitir la filosofía profunda del proyecto.

**Fondo:** `--color-arena` con patrón geométrico precolombino muy sutil (SVG, opacidad 5%).

**Contenido:**
- **Label de sección:** "NUESTRA VISIÓN" (en `--font-ui`, tamaño pequeño, `--color-oro`, letra espaciada)
- **Cita central** (gran tipografía, `--font-display` en itálica):
  > *"América Latina no necesita el sueño americano. América Latina necesita despertar su propio sueño. Y ese sueño se llama unidad, dignidad y oportunidad para todos."*
- **Texto de diagnóstico** (2 columnas en desktop, 1 en móvil):
  - Columna 1: "América Latina concentra el 8% de la población mundial pero el 33% de los homicidios del planeta. La región más desigual del mundo. 40 millones de personas en pobreza extrema. 26 millones de migrantes forzados."
  - Columna 2: "Pero también tiene el mayor pulmón verde del planeta, la segunda mayor reserva de agua dulce, la mayor biodiversidad del mundo, y una generación joven que ya no acepta el statu quo."
- **Frase de cierre:** "Lo que ha faltado no es el talento ni los recursos: ha faltado la unidad. La Unión Americana es la respuesta."
- **Compromisos fundacionales:** Lista de 6 compromisos en cards pequeñas con ícono SVG minimalista cada una.

---

### 4.4 SECCIÓN PILARES
**Objetivo:** Explicar los 4 ejes de intervención de forma visual y memorable.

**Layout:** Grid 2x2 en desktop, stack en móvil. Cards grandes con fondo de color distinto por pilar.

**Pilares y colores:**
| # | Pilar | Color de Card | Ícono Temático |
|---|-------|--------------|----------------|
| 1 | Asistencia Humanitaria Directa | `--color-tierra` | Cruz / mano extendida |
| 2 | Servicios Esenciales | `--color-selva` | Corazón + libro |
| 3 | Desarrollo Comunitario | `--color-oro` | Planta creciendo / engranaje |
| 4 | Derechos Humanos | `--color-turquesa` | Escudo / balanza |

**Cada card contiene:**
- Número grande decorativo (01, 02, 03, 04) semitransparente de fondo
- Ícono SVG (40px)
- Título del pilar
- Descripción breve (2-3 líneas)
- Lista de 3-4 acciones concretas
- Link "Saber más" con flecha

**Interacción:** Al hacer hover, la card se expande ligeramente mostrando más detalle. En móvil, tap para expandir.

---

### 4.5 SECCIÓN IMPACTO
**Objetivo:** Mostrar la escala y ambición del proyecto con datos proyectados.

**Fondo:** `--color-carbon` con noise texture. Texto blanco.

**Elementos:**
- **Label:** "NUESTRO ALCANCE PROYECTADO"
- **Contadores animados** (se activan al entrar en viewport con `countUp`):
  - `650M+` — Latinoamericanos que podemos alcanzar
  - `20` — Países objetivo en ALC
  - `500` — Jóvenes talentos en fase piloto
  - `10,000+` — Usuarios en plataforma de talentos (año 3)
  - `30%` — Reducción proyectada de intención de migrar en territorios de intervención
- **Mapa interactivo SVG de América Latina:**
  - Mostrar los países del continente.
  - Puntos pulsantes en los primeros 3 países piloto (Colombia, y 2 más por definir — usar Venezuela y Ecuador como referencia).
  - Tooltip al hover mostrando "Fase 1 — Comunidades piloto".
- **Sección ODS mini:** 8 badges con número de ODS alineado + ícono y color oficial de la ONU.

---

### 4.6 SECCIÓN HOJA DE RUTA
**Objetivo:** Timeline visual de las 4 fases de implementación hasta 2040.

**Layout:** Timeline horizontal en desktop (con scroll snap o línea de tiempo centrada), vertical en móvil.

**Diseño del timeline:**
- Línea central de `--color-oro`.
- 4 nodos circulares grandes numerados (I, II, III, IV).
- Cada nodo abre una card con:
  - Nombre de la fase
  - Período (ej: "Meses 1–12")
  - 3-4 actividades clave
  - Condición de éxito destacada
- Estado visual: Fase 1 = activa/iluminada. Fases 2-4 = proyectadas/semitransparentes.
- Animación: al hacer scroll, el nodo siguiente se "activa" con efecto de pulso.

---

### 4.7 SECCIÓN TALENTO
**Objetivo:** Presentar la plataforma de talento latinoamericano como diferenciador estratégico.

**Concepto visual:** Esta sección debe sentirse como el inicio de una plataforma digital — un destello de lo que viene.

**Contenido:**
- **Título:** "América Latina tiene el talento. Nosotros construimos el puente."
- **Subtítulo:** "Plataforma digital de identificación, conexión y desarrollo del talento latinoamericano — para que el cerebro de la región se quede en la región."
- **Mock UI:** Mostrar una maqueta visual simplificada (no funcional) de tarjetas de perfil de talento: nombre, país (con bandera emoji), habilidad, área. Datos ficticios representativos: música, ingeniería, arte, agronomía, tecnología.
- **3 propuestas de valor:**
  1. Descubrimos talentos en territorios invisibles
  2. Los conectamos con oportunidades dentro de ALC
  3. Los acompañamos con mentorías y financiamiento
- **CTA:** "Registra tu talento" / "Soy una organización aliada"

---

### 4.8 SECCIÓN ÚNETE
**Objetivo:** Convertir visitantes en participantes activos.

**Fondo:** Gradiente cálido de `--color-arena` a blanco.

**3 vías de participación en cards:**

| Vía | Ícono | Descripción | CTA |
|-----|-------|-------------|-----|
| **Voluntario** | Persona con corazón | Aporta tu tiempo y habilidades desde donde estás | "Quiero ser voluntario" |
| **Organización Aliada** | Apretón de manos | Construimos juntos. Tu organización puede ser parte de la red. | "Explorar alianza" |
| **Donante** | Planta con moneda | Tu apoyo financia comunidades enteras. Transparencia total. | "Apoyar el proyecto" |

- **Formulario de contacto rápido** (nombre, email, tipo de participación, mensaje).
- **Confianza:** "La Unión Americana opera con estándares internacionales de transparencia y rendición de cuentas."

---

### 4.9 SECCIÓN CONTACTO
- Dirección: Colombia — ALC (dirección institucional por definir)
- Email: contacto@launionamericana.org *(placeholder)*
- Redes sociales: Instagram, LinkedIn, X/Twitter, YouTube — íconos SVG
- **Mapa:** Si se desea, un mapa estático SVG centrado en América del Sur.

---

### 4.10 FOOTER
- Logo + eslogan
- Links de navegación agrupados por categoría
- ODS badges (pequeños)
- Línea legal: "© 2026 La Unión Americana — Todos los derechos reservados | Unidad, Dignidad y Desarrollo"
- Nota: "Una ONG panlatinamericana. No estamos afiliados a ningún partido político ni gobierno."

---

## 5. ESPECIFICACIONES TÉCNICAS

### 5.1 Stack Recomendado
**Opción A (preferida para agentes):** HTML5 + CSS3 + Vanilla JS  
**Opción B:** Next.js 14 + Tailwind CSS  
**Opción C:** React + Vite + CSS Modules  

El agente puede elegir según su criterio. Priorizar: rendimiento, mantenibilidad, facilidad de despliegue en Vercel o Netlify.

### 5.2 Requisitos de Calidad
- **Responsive:** Mobile-first. Breakpoints: 375px / 768px / 1024px / 1440px.
- **Accesibilidad:** WCAG AA. Contrastes correctos, `alt` en imágenes, roles ARIA en elementos interactivos, navegación por teclado.
- **Performance:** Lazy loading en imágenes, fuentes con `font-display: swap`, animaciones con `will-change` controlado.
- **SEO básico:** Meta tags, Open Graph, título descriptivo, descripción, favicon.
- **Sin dependencias de imágenes externas:** Todos los elementos visuales deben ser generables con CSS o SVG inline. No depender de imágenes de stock que no estén disponibles.

### 5.3 Animaciones
- Todas las animaciones de scroll: `Intersection Observer API`.
- Duración: 0.4s a 0.8s. Easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`.
- Contadores animados: `requestAnimationFrame` con duración de 2 segundos al entrar en viewport.
- Mapa SVG: puntos con animación `pulse` en CSS (keyframes de `scale` y `opacity`).
- Hero title: animación de entrada línea a línea con `animation-delay` escalonado.
- Respetar `prefers-reduced-motion`.

### 5.4 Estructura de Archivos Sugerida (HTML puro)
```
/
├── index.html
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── components.css
│   └── sections.css
├── js/
│   ├── main.js
│   ├── animations.js
│   └── map.js
├── assets/
│   ├── icons/        (SVGs inline o archivos .svg)
│   └── map/          (SVG del mapa de ALC)
└── README.md
```

### 5.5 Íconos
Usar **Lucide Icons** (CDN) o íconos SVG inline personalizados. No usar Font Awesome.  
CDN Lucide: `https://unpkg.com/lucide@latest`

### 5.6 Fuentes
Google Fonts con preconnect:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Cormorant+Garamond:wght@400;600&family=Source+Serif+4:wght@300;400;600&family=Libre+Franklin:wght@400;500;600&display=swap" rel="stylesheet">
```

---

## 6. CONTENIDO TEXTUAL CLAVE

### Taglines disponibles
- *"Una sola fuerza. Cien naciones. Un solo corazón."* — Eslogan institucional principal
- *"Unidad, Dignidad y Desarrollo — América Latina y el Caribe"* — Subtítulo institucional
- *"América Latina no necesita el sueño americano. Necesita despertar el suyo propio."* — Frase filosófica
- *"No medimos el éxito por la ayuda que damos, sino por la cantidad de personas que ya no la necesitan."* — Compromisos

### Compromisos Fundacionales (para cards en sección Manifiesto)
1. Nunca olvidar que detrás de cada estadística hay una persona con nombre, historia y sueños.
2. Actuar con transparencia, integridad y rendición de cuentas.
3. Escuchar a las comunidades antes de decidir — ellas son las expertas en su propia realidad.
4. Construir desde la identidad y el orgullo latinoamericano, no desde la vergüenza o la dependencia.
5. Conectar a los latinoamericanos entre sí, porque nuestra mayor fortaleza es la red que formamos juntos.
6. Medir el éxito no por la ayuda dada, sino por las personas que ya no la necesitan.

---

## 7. CRITERIOS DE ENTREGA

El agente debe entregar:
- [ ] Código completo y funcional del sitio web.
- [ ] Todos los archivos necesarios para despliegue inmediato.
- [ ] README con instrucciones de ejecución local y despliegue.
- [ ] El sitio debe funcionar sin conexión a internet (excepto fuentes de Google — opcional cachear).
- [ ] El mapa SVG de América Latina debe ser funcional con los puntos de presencia.
- [ ] Todos los contadores animados funcionales.
- [ ] Formulario con validación básica (sin backend requerido — puede ser mailto o solo frontend).
- [ ] Favicon creado en SVG (símbolo de la unión — sugerencia: círculos entrelazados o estrella).

---

## 8. NOTAS FINALES PARA EL AGENTE

> **Prioridades si el tiempo es limitado:**
> 1. Hero (impacto inmediato)
> 2. Manifiesto (filosofía)
> 3. Pilares (propuesta de valor)
> 4. Hoja de ruta (credibilidad)
> 5. Sección Únete (conversión)
> 
> **Lo que NUNCA debe aparecer:**
> - Banderas nacionales de un solo país (somos panlatinamericanos)
> - Colores de partidos políticos de ningún país
> - Imágenes de personas reales sin consentimiento
> - Lenguaje asistencialista o paternalista ("ayudamos a los pobres")
> - Diseño que se vea como una plantilla genérica
>
> **Lo que SIEMPRE debe transmitir:**
> - Dignidad y orgullo latinoamericano
> - Ambición continental, no local
> - Seriedad institucional + calor humano
> - Esperanza y urgencia al mismo tiempo

---

*Documento preparado por el equipo fundador de La Unión Americana — 2026*  
*Versión 1.0 — Briefing Web | Uso interno para desarrollo*
