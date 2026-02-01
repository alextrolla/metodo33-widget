/* =========================
   CONFIG
   ========================= */

// Pega aquí tus frases (100 mañana, 100 tarde, 100 noche)
// Te dejo una base buena y estructura limpia para que luego metas 300.
const QUOTES = {
  morning: [
    "Hoy se entrena sin negociar.",
    "Empieza pequeño. Termina enorme.",
    "Una buena mañana = un día ganado.",
    "Disciplina primero, motivación después.",
    "Hazlo fácil: primer set y ya estás dentro."
  ],
  afternoon: [
    "La tarde decide si el día cuenta.",
    "No necesitas ganas: necesitas el siguiente paso.",
    "Lo que haces hoy se nota mañana.",
    "Sigue: el cuerpo aprende rápido.",
    "Constancia > intensidad ocasional."
  ],
  night: [
    "Cierra el día con orgullo, no con excusas.",
    "Aunque sea poco: que sea.",
    "Hoy no se repite. Hazlo valer.",
    "Último empujón. Luego descansas.",
    "Hazlo por tu yo de mañana."
  ],
};

// Rangos (España): mañana 5-12, tarde 12-20, noche 20-5
function getTimeBucket(date, tz) {
  const hour = getHourInTimeZone(date, tz);
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 20) return "afternoon";
  return "night";
}

function getGreeting(bucket) {
  if (bucket === "morning") return "Buenos días";
  if (bucket === "afternoon") return "Buenas tardes";
  return "Buenas noches";
}

/* =========================
   TIMEZONE (fiable)
   ========================= */
function getHourInTimeZone(date, tz) {
  try {
    const parts = new Intl.DateTimeFormat("es-ES", {
      hour: "2-digit",
      hour12: false,
      timeZone: tz,
    }).formatToParts(date);
    const hourPart = parts.find(p => p.type === "hour");
    return hourPart ? Number(hourPart.value) : date.getHours();
  } catch {
    // si algo falla, fallback local
    return date.getHours();
  }
}

/* =========================
   UTILIDADES
   ========================= */
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function cleanName(raw) {
  if (!raw) return "";
  return raw
    .toString()
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 40);
}

/* =========================
   MAIN
   ========================= */
(function init() {
  const loader = document.getElementById("loader");
  const titleEl = document.getElementById("title");
  const subtitleEl = document.getElementById("subtitle");

  // Loader on (queda pro y no molesta)
  loader.classList.add("is-on");

  // Lee params: ?name=Gabriel&tz=Europe/Madrid
  const url = new URL(window.location.href);
  const name = cleanName(url.searchParams.get("name") || "");
  const tz = url.searchParams.get("tz") || "Europe/Madrid";

  // Calcula saludo + frase
  try {
    const now = new Date();
    const bucket = getTimeBucket(now, tz);
    const greeting = getGreeting(bucket);

    // Emoji antes del saludo, como pediste
    const line1 = `👋 ${greeting}${name ? `, ${name}` : ""}`;

    const pool = QUOTES[bucket] || QUOTES.afternoon;
    const quote = pickRandom(pool);

    titleEl.textContent = line1;
    subtitleEl.textContent = quote;
  } catch (e) {
    // fallback seguro
    titleEl.textContent = "👋 Hola";
    subtitleEl.textContent = "Empieza por el primer set. Lo demás viene solo.";
  } finally {
    // pequeñísimo delay para que el loader se note “premium”
    setTimeout(() => loader.classList.remove("is-on"), 220);
  }
})();
