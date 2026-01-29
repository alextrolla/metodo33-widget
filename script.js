// =========================
// M33 Widget — v2 (impoluto)
// =========================

function qp(name, fallback = null) {
  const u = new URL(window.location.href);
  const v = u.searchParams.get(name);
  return (v === null || v === "") ? fallback : v;
}

function safeName(s) {
  // Limpio: letras, espacios, guiones; limita longitud
  return (s || "")
    .toString()
    .replace(/[^\p{L}\p{N}\s\-_.]/gu, "")
    .trim()
    .slice(0, 22) || "Alex";
}

function greetingForHour(h) {
  if (h >= 6 && h < 12) return "Buenos días";
  if (h >= 12 && h < 20) return "Buenas tardes";
  return "Buenas noches";
}

// Hash estable para "frase del día"
function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0);
}

const PHRASES = [
  "Hoy toca hacerlo fácil.",
  "Hazlo imperfecto, pero hazlo.",
  "Cero drama: solo cumple lo de hoy.",
  "No necesitas motivación: necesitas un sistema.",
  "Constancia > intensidad.",
  "Empieza por el primer set. Lo demás viene solo.",
  "Una sesión cuenta. Aunque sea la mínima.",
  "Pequeño hoy. Enorme en 12 semanas.",
  "Lo que se repite, se convierte en resultado.",
  "Ganas por presentarte.",
  "Si tu semana es un caos, tu plan debe adaptarse.",
  "1% mejor que ayer.",
  "Hoy es un buen día para sumar.",
  "Enfócate en lo controlable: la siguiente serie.",
  "Disciplina tranquila. Progreso real.",
  // mete aquí tus 200 frases cuando quieras
];

function pickPhrase(name, mode) {
  if (!PHRASES.length) return "";
  if (mode === "daily") {
    const d = new Date();
    const key = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}-${name}`;
    const idx = hashString(key) % PHRASES.length;
    return PHRASES[idx];
  }
  // random
  return PHRASES[Math.floor(Math.random() * PHRASES.length)];
}

function applyTheme(theme) {
  if (theme === "dark") document.body.classList.add("force-dark");
  if (theme === "light") document.body.classList.add("force-light");
}

function applyTransparent(flag) {
  if (flag) document.body.classList.add("transparent");
}

// Permite cambiar el granate por URL: ?accent=8a1f3d (hex sin #)
function applyAccent(hex) {
  if (!hex) return;
  const clean = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return;

  const r = parseInt(clean.slice(0,2), 16);
  const g = parseInt(clean.slice(2,4), 16);
  const b = parseInt(clean.slice(4,6), 16);

  document.documentElement.style.setProperty("--accent", `${r} ${g} ${b}`);
}

// Permite ajustar altura del widget: ?h=120
function applyHeight(h) {
  if (!h) return;
  const n = parseInt(h, 10);
  if (Number.isFinite(n) && n >= 90 && n <= 180) {
    document.documentElement.style.setProperty("--h", `${n}px`);
  }
}

(function init() {
  const name = safeName(qp("name", "Alex"));
  const mode = (qp("mode", "daily") || "daily").toLowerCase(); // daily | random
  const badge = (qp("badge", "M33") || "M33").toUpperCase().slice(0, 8);

  const transparent = qp("transparent", "0") === "1";
  const theme = (qp("theme", "auto") || "auto").toLowerCase(); // auto | dark | light
  const accent = qp("accent", null); // hex
  const h = qp("h", null);

  applyTransparent(transparent);
  applyTheme(theme);
  applyAccent(accent);
  applyHeight(h);

  const now = new Date();
  const greet = greetingForHour(now.getHours());

  document.getElementById("kicker").textContent = "MÉTODO 33";
  document.getElementById("title").textContent = `${greet}, ${name}.`;
  document.getElementById("subtitle").textContent = pickPhrase(name, mode);
  document.getElementById("pill").textContent = badge;
})();
