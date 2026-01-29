/* =========================
   M33 Widget v3 (impoluto)
   - Fondo transparente
   - Tipografía Apple (system font)
   - Saludo según hora
   - DÍA X desde start (día 0 real)
   - Frase estable por día (no cambia cada refresh)
   - Modo prueba: ?forceDay=0
   ========================= */

const DEFAULT_NAME = "Alex";

/**
 * Si no pasas start, por defecto es HOY (día 0).
 * Formato: YYYY-MM-DD
 */
function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

function safeParseStartDate(iso) {
  // iso esperado YYYY-MM-DD
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d, 0, 0, 0, 0);
  return isNaN(dt.getTime()) ? null : dt;
}

function diffDaysFromStart(startDate) {
  // Día 0 real: si hoy es el start => 0
  const now = new Date();
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0,0,0,0);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0,0);
  const ms = today.getTime() - start.getTime();
  const days = Math.floor(ms / 86400000);
  return Math.max(0, days);
}

function greetingByHour() {
  const h = new Date().getHours();
  if (h >= 6 && h < 13) return "Buenos días";
  if (h >= 13 && h < 20) return "Buenas tardes";
  return "Buenas noches";
}

/* Frases: mete aquí tus 200 cuando quieras */
const QUOTES = [
  "Empieza por el primer set. Lo demás viene solo.",
  "Hoy cuenta. Mañana se nota.",
  "Una repetición más que ayer.",
  "Constancia > motivación.",
  "Poco perfecto, pero diario.",
  "Hazlo simple. Hazlo hoy.",
  "Tu cuerpo sigue a tus hábitos.",
  "No negocies con el descanso: ejecútalo.",
  "Si puedes hacerlo fácil, puedes hacerlo siempre.",
  "Hoy es una inversión en tu yo de mañana.",
  "Cero excusas, solo ejecución.",
  "Suma kilos o suma calidad. Suma algo.",
  "No busques ganas: busca ritmo.",
  "Respira. Entra. Empuja.",
  "Todo progreso empieza con presencia."
];

/* Quote estable por día (no cambia al refrescar) */
function seededIndex(seed, modulo) {
  // hash simple
  let x = seed + 0x9e3779b9;
  x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
  x = Math.abs(x);
  return x % modulo;
}

function pickQuoteByDay(day) {
  const idx = seededIndex(day * 9973, QUOTES.length);
  return QUOTES[idx];
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

(function init() {
  const name = (getParam("name") || DEFAULT_NAME).trim();

  // start: si no viene, HOY => día 0
  const startRaw = getParam("start") || todayISO();
  const startDate = safeParseStartDate(startRaw) || safeParseStartDate(todayISO());

  // modo prueba: fuerza el día desde URL (para testear)
  // ejemplo: ?forceDay=0
  const forced = getParam("forceDay");
  let day = diffDaysFromStart(startDate);
  if (forced !== null && forced !== undefined && forced !== "" && !isNaN(Number(forced))) {
    day = Math.max(0, Math.floor(Number(forced)));
  }

  const greet = greetingByHour();
  const quote = pickQuoteByDay(day);

  // UI
  setText("miniLabel", "PROGRESO");
  setText("pillDay", `DÍA ${day}`);
  setText("greeting", `${greet}, ${name} 👋`);
  setText("quote", quote);

  // Loader -> Card
  const loader = document.getElementById("loader");
  const card = document.getElementById("card");

  setTimeout(() => {
    if (loader) loader.classList.add("hidden");
    if (card) card.classList.remove("hidden");
  }, 250);
})();
