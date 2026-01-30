/* =========================
   CONFIG RÁPIDA
   =========================
   URL params:
   ?name=Alex
   ?tz=Europe/Madrid  (opcional, si la hora te sale mal)
*/

function getParam(name, fallback = "") {
  const url = new URL(window.location.href);
  return url.searchParams.get(name) ?? fallback;
}

function safeName(raw) {
  const cleaned = String(raw || "").trim();
  if (!cleaned) return "Alex";
  // evita cosas raras
  return cleaned.slice(0, 24);
}

/* Hora local (o forzada por tz) */
function getHourInTZ(timeZone) {
  const now = new Date();
  if (!timeZone) return now.getHours(); // hora local del dispositivo

  // Convertimos a hora en zona horaria usando Intl
  const parts = new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    hour12: false,
    timeZone,
  }).formatToParts(now);

  const hourPart = parts.find((p) => p.type === "hour");
  return hourPart ? parseInt(hourPart.value, 10) : now.getHours();
}

function getGreetingByHour(h) {
  // 05-11 mañana, 12-19 tarde, 20-04 noche
  if (h >= 5 && h <= 11) return { saludo: "Buenos días", tema: "mañana" };
  if (h >= 12 && h <= 19) return { saludo: "Buenas tardes", tema: "tarde" };
  return { saludo: "Buenas noches", tema: "noche" };
}

/* =========================
   200+ FRASES TEMATIZADAS
   - Generación por combinaciones
   - Se elige 1 al día (estable)
   ========================= */

function hashString(str) {
  // hash simple y estable
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function dayKey(timeZone) {
  const now = new Date();
  // clave YYYY-MM-DD en tz si se aporta
  if (!timeZone) return now.toISOString().slice(0, 10);

  const parts = new Intl.DateTimeFormat("es-ES", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const y = parts.find((p) => p.type === "year")?.value ?? "0000";
  const m = parts.find((p) => p.type === "month")?.value ?? "00";
  const d = parts.find((p) => p.type === "day")?.value ?? "00";
  return `${y}-${m}-${d}`;
}

function buildPhrases(theme) {
  // Listas por tema (combinables). Esto te da MUCHÍSIMAS combinaciones.
  const openings = {
    mañana: [
      "Arranca suave y acaba fuerte.",
      "Hoy toca sumar una pequeña victoria.",
      "Empieza con intención, sin prisa.",
      "Un paso limpio vale más que mil dudas.",
      "Respira, enfoca y ejecuta.",
      "Hoy se construye el cuerpo que quieres.",
      "Hoy ganas si cumples lo básico.",
    ],
    tarde: [
      "Aún queda día para ganar.",
      "Lo importante es volver al plan.",
      "Hazlo simple y hazlo bien.",
      "La tarde es para cumplir.",
      "Sigue aunque sea con lo mínimo.",
      "La disciplina no entiende de excusas.",
      "Hoy se demuestra constancia.",
    ],
    noche: [
      "Cierra el día con orgullo.",
      "Termina fuerte, sin ruido.",
      "Hoy valió la pena por intentarlo.",
      "Descansar también es parte del plan.",
      "Has llegado hasta aquí: remata.",
      "Mañana te lo agradecerás.",
      "La noche es para consolidar.",
    ],
  };

  const verbs = {
    mañana: ["empieza", "activa", "construye", "prioriza", "ejecuta", "enfoca", "ordena"],
    tarde: ["continúa", "cumple", "ajusta", "aprieta", "mantén", "resuelve", "acaba"],
    noche: ["cierra", "protege", "descansa", "recupera", "agradece", "suaviza", "alineA"],
  };

  const nouns = {
    mañana: ["el hábito", "la técnica", "tu energía", "tu postura", "tu ritmo", "tu mente", "tu base"],
    tarde: ["la constancia", "el plan", "tu progreso", "tu paciencia", "tu compromiso", "tu foco", "tu nivel"],
    noche: ["la recuperación", "el descanso", "la calma", "tu sueño", "tu disciplina", "tu cuerpo", "tu mañana"],
  };

  const closers = {
    mañana: [
      "Lo demás viene solo.",
      "Hoy cuenta.",
      "Hazlo por ti.",
      "Una cosa bien hecha.",
      "Sin drama: a trabajar.",
      "Consistencia > perfección.",
      "Empieza ya.",
    ],
    tarde: [
      "No hace falta perfecto.",
      "Hace falta hecho.",
      "Aún estás a tiempo.",
      "Suma otra repetición.",
      "Otra sesión ganada.",
      "Un bloque más.",
      "Confía en el proceso.",
    ],
    noche: [
      "Mañana más.",
      "Cuerpo y mente te lo devuelven.",
      "Hoy ya sumaste.",
      "Baja revoluciones y recupera.",
      "Respira y suelta.",
      "Cierra con calma.",
      "A dormir mejor.",
    ],
  };

  // Generamos combinaciones “premium” (te salen muchas más de 200)
  const list = [];
  for (const o of openings[theme]) {
    for (const v of verbs[theme]) {
      for (const n of nouns[theme]) {
        for (const c of closers[theme]) {
          // Frase en 2 partes (como pediste)
          list.push(`${o} ${capitalize(v)} ${n}. ${c}`);
          if (list.length >= 260) return list; // nos sobra, queremos >200 total entre temas
        }
      }
    }
  }
  return list;
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function pickDailyPhrase(theme, name, timeZone) {
  const key = `${dayKey(timeZone)}|${name}|${theme}`;
  const phrases = buildPhrases(theme);
  const idx = hashString(key) % phrases.length;
  return phrases[idx];
}

/* =========================
   Render
   ========================= */
(function init() {
  const name = safeName(getParam("name", "Alex"));
  const tz = getParam("tz", ""); // opcional

  const hour = getHourInTZ(tz);
  const { saludo, tema } = getGreetingByHour(hour);

  // Saludo con emoji antes (como pediste)
  const title = `👋 ${saludo}, ${name}.`;
  const phrase = pickDailyPhrase(tema, name, tz);

  document.getElementById("title").textContent = title;
  document.getElementById("subtitle").textContent = phrase;

  // Opcional: cambia el kicker según tema
  const kicker = document.getElementById("kicker");
  if (tema === "mañana") kicker.textContent = "MAÑANA";
  if (tema === "tarde") kicker.textContent = "TARDE";
  if (tema === "noche") kicker.textContent = "NOCHE";
})();
