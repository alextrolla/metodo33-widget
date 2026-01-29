// ====== CONFIG ======
const DEFAULT_NAME = "Alex";
const DEFAULT_START_DATE = "2026-01-29"; // cambia esto para cada cliente si quieres

const QUOTES = [
  "Empieza por el primer set. Lo demás viene solo.",
  "Un paso más que ayer.",
  "Constancia > motivación.",
  "Hazlo simple. Hazlo bien.",
  "Hoy cuenta. Hazlo.",
];

// ====== HELPERS ======
function getParam(key){
  const u = new URL(location.href);
  return u.searchParams.get(key);
}

function greetingByHour(){
  const h = new Date().getHours();
  if (h >= 6 && h < 14) return "Buenos días";
  if (h >= 14 && h < 21) return "Buenas tardes";
  return "Buenas noches";
}

function daysSince(startStr){
  const start = new Date(startStr + "T00:00:00");
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.floor((today - start) / (1000*60*60*24));
  return Math.max(0, diff); // día 0 mínimo
}

function pickDailyQuote(arr, startStr){
  const d = daysSince(startStr);
  return arr[d % arr.length];
}

// ====== INIT ======
(function(){
  const name = (getParam("name") || DEFAULT_NAME).trim() || DEFAULT_NAME;
  const start = (getParam("start") || DEFAULT_START_DATE).trim() || DEFAULT_START_DATE;

  const day = daysSince(start);

  const greetingEl = document.getElementById("greeting");
  const pillEl = document.getElementById("pillDay");
  const quoteEl = document.getElementById("quote");

  // Emoji ANTES
  const greet = `👋 ${greetingByHour()}, ${name}`;
  if (greetingEl) greetingEl.textContent = greet;

  if (pillEl) pillEl.textContent = `DÍA ${day}`;
  if (quoteEl) quoteEl.textContent = pickDailyQuote(QUOTES, start);
})();
    if (card) card.classList.remove("hidden");
  }, 250);
})();
