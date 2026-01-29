/* ===========================
   CONFIG (A: manual fácil)
   ===========================

   Puedes personalizar por URL:
   - name: nombre del cliente
   - start: fecha inicio del plan (YYYY-MM-DD)
   - tz: opcional, no hace falta normalmente

   Ejemplo:
   https://TU-VERCEL.vercel.app/?name=Gabriel&start=2026-01-14
*/

const DEFAULT_NAME = "Alex";
const DEFAULT_START = "2026-01-14"; // cambia si quieres un default

// 200 frases si quieres: pega aquí
const QUOTES = [
  "Empieza por el primer set. Lo demás viene solo.",
  "Hoy cuenta. Mañana se nota.",
  "Más simple: hazlo. Luego lo mejoras.",
  "Un buen día no se espera: se entrena.",
  "Constancia > motivación.",
  // ...mete aquí las tuyas (hasta 200)
];

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function getGreetingByHour(date = new Date()) {
  const h = date.getHours();
  if (h >= 6 && h < 12) return "Buenos días";
  if (h >= 12 && h < 20) return "Buenas tardes";
  return "Buenas noches";
}

// DÍA 0 si es el mismo día de inicio
function calcDayNumber(startDateStr) {
  // Interpretamos start como fecha local (00:00 local)
  const [y, m, d] = startDateStr.split("-").map(Number);
  const start = new Date(y, m - 1, d, 0, 0, 0, 0);
  const now = new Date();

  const ms = now.getTime() - start.getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
}

function pickQuote(seedDay) {
  // una por día (estable) → seedDay
  // si prefieres random cada refresh: usa Math.random()
  const idx = seedDay % QUOTES.length;
  return QUOTES[idx];
}

(function init() {
  const name = getParam("name") || DEFAULT_NAME;
  const start = getParam("start") || DEFAULT_START;

  const day = calcDayNumber(start);
  const greeting = getGreetingByHour();

  const badge = document.getElementById("badgeDay");
  const h1 = document.getElementById("greeting");
  const quote = document.getElementById("quote");

  badge.textContent = `DÍA ${day}`;
  h1.textContent = `${greeting}, ${name} 👋`;
  quote.textContent = pickQuote(day);
})();
