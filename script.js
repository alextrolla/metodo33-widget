// ================================
// CONFIG (lo único que tocarás tú)
// ================================

// 1) Nombre por defecto (si no pasas ?name=...)
const DEFAULT_NAME = "Gabriel";

// 2) Fecha de inicio para el contador (DÍA 0).
// Formato: "YYYY-MM-DD"
const DEFAULT_START_DATE = "2026-01-29";

// 3) Frases (mete aquí tus 200 sin problema)
const QUOTES = [
  "Empieza por el primer set. Lo demás viene solo.",
  "Hoy cuenta. Hazlo simple y hazlo bien.",
  "Un paso más que ayer.",
  "Constancia > motivación.",
  "Hazlo por el tú de mañana.",
  "Cuando dudes, repite: una más.",
  "Pequeñas acciones. Grandes cambios."
];

// ================================
// HELPERS
// ================================
function getParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function daysSince(startDateStr) {
  // Devuelve días enteros desde startDate (día 0 ese mismo día)
  const start = new Date(startDateStr + "T00:00:00");
  const now = new Date();
  // Normalizamos "hoy" a medianoche
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = today - start;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return clamp(diffDays, 0, 9999);
}

function pickDailyQuote(quotes, startDateStr) {
  // Frase "1 por día" estable: misma frase durante todo el día
  const dayIndex = daysSince(startDateStr);
  return quotes[dayIndex % quotes.length];
}

function greetingByHour() {
  const h = new Date().getHours();
  if (h >= 6 && h < 14) return "Buenos días";
  if (h >= 14 && h < 21) return "Buenas tardes";
  return "Buenas noches";
}

// ================================
// MAIN
// ================================
(function init() {
  const loader = document.getElementById("loader");
  const greetingEl = document.getElementById("greeting");
  const quoteEl = document.getElementById("quote");
  const pillEl = document.getElementById("pillDay");
  const miniEl = document.getElementById("miniLabel");

  // Params para personalizar por link:
  // ?name=Gabriel&start=2026-01-29
  const name = (getParam("name") || DEFAULT_NAME).trim() || DEFAULT_NAME;
  const start = (getParam("start") || DEFAULT_START_DATE).trim() || DEFAULT_START_DATE;

  // Calculamos día
  const d = daysSince(start);

  // Pintamos UI
  if (miniEl) miniEl.textContent = "MÉTODO 33";
  if (pillEl) pillEl.textContent = `DÍA ${d}`;

  const greet = `${greetingByHour()}, ${name} 👋`;
  if (greetingEl) greetingEl.textContent = greet;

  const q = pickDailyQuote(QUOTES, start);
  if (quoteEl) quoteEl.textContent = q;

  // Loader fuera (sin riesgo de blanco)
  setTimeout(() => {
    if (loader) loader.classList.add("hidden");
  }, 250);
})();
    if (card) card.classList.remove("hidden");
  }, 250);
})();
