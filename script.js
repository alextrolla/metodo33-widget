/* =========================================================
   M33 Widget
   - Saludo por hora (mañana/tarde/noche)
   - Frase random según franja
   - Nombre por URL (?name=Alex)
   - Theme por URL (?theme=auto|dark|light)
   - Fondo del iframe TRANSPARENTE (el recuadro siempre se ve bien)
========================================================= */

function getParam(key, fallback = "") {
  const v = new URLSearchParams(window.location.search).get(key);
  return v ? v.trim() : fallback;
}

function setTheme() {
  const theme = (getParam("theme", "auto") || "auto").toLowerCase();
  const root = document.documentElement;

  if (theme === "dark" || theme === "light") {
    root.setAttribute("data-theme", theme);
    return;
  }

  // auto: respeta el sistema (normalmente Notion se alinea con esto,
  // y si no, puedes forzarlo con ?theme=dark)
  const isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", isDark ? "dark" : "light");
}

function getDayPart(now = new Date()) {
  const h = now.getHours();
  if (h >= 6 && h < 14) return "mañana";
  if (h >= 14 && h < 21) return "tarde";
  return "noche";
}

function greetingFor(dayPart) {
  if (dayPart === "mañana") return "Buenos días";
  if (dayPart === "tarde") return "Buenas tardes";
  return "Buenas noches";
}

/* ====== FRASES (random por franja) ======
   Te pongo un pack grande y bueno.
   Si quieres más, añades líneas dentro del array y ya.
*/

const QUOTES = {
  mañana: [
    "Hoy empiezas con ventaja: estás aquí.",
    "Hazlo simple: una acción y ya estás dentro.",
    "Primero cumples. Luego te motivas.",
    "Hoy no se negocia: toca avanzar.",
    "Empieza por el primer set. Lo demás viene solo.",
    "No busques ganas. Busca el siguiente paso.",
    "Si lo haces temprano, el día se rinde.",
    "Disciplina: el superpoder silencioso.",
    "Tu futuro yo te está mirando. No le falles.",
    "Hoy se construye la versión que quieres ser.",
    "No necesitas perfecto. Necesitas hecho.",
    "La mañana marca el ritmo. Mándas tú.",
    "Si dudas, actúa. Si actúas, ganas.",
    "Un entrenamiento decente vale más que mil planes.",
    "Entra, calienta, cumple.",
    "Tú no necesitas motivación. Necesitas método.",
    "Hoy suma. Mañana lo notas.",
    "Pequeño inicio, gran efecto.",
    "Hazlo por orgullo propio.",
    "Hoy entrenas para ser libre.",
    "La rutina no te limita: te libera.",
    "Si te cuesta, es porque funciona.",
    "Energía no se espera: se fabrica.",
    "Tu cuerpo aprende lo que repites.",
    "Los resultados respetan la constancia.",
    "Un set más. Y otro. Y listo.",
    "Tu progreso no se pide: se cobra.",
    "Hoy haces lo que otros posponen.",
    "La mañana es para los que mandan.",
    "Hazlo con calma, pero hazlo.",
    "La excusa pesa más que la barra.",
    "Empieza sin pensarlo tanto.",
    "Hoy toca enfoque: una cosa bien.",
    "No es un día. Es un voto por tu identidad.",
    "Si lo cumples, te respetas."
  ],
  tarde: [
    "Lo que haces hoy se nota mañana.",
    "Si hoy no fallas, mañana subes.",
    "No necesitas ganas: necesitas el siguiente paso.",
    "Cumple hoy y duerme tranquilo.",
    "Entrena aunque sea a media máquina: pero entrena.",
    "La tarde es para rematar el día con orgullo.",
    "No es motivación. Es compromiso.",
    "Ahora es cuando la mayoría se cae. Tú no.",
    "Un entrenamiento te cambia el humor y la vida.",
    "Hazlo por la versión que no se rinde.",
    "Si hoy cumples, hoy ganas.",
    "Menos charla. Más acción.",
    "No busques cómodo. Busca avance.",
    "Hoy toca picar piedra. Ahí está el cambio.",
    "Constancia > intensidad ocasional.",
    "El cuerpo paga intereses por cada sesión.",
    "Lo difícil no es entrenar: es empezar.",
    "Hazlo aunque no apetezca: eso es disciplina.",
    "Entrena como si fueras tu propio proyecto serio.",
    "El progreso ama los días normales.",
    "Hoy no hay drama: hay trabajo.",
    "Un paso más y ya estás dentro.",
    "No estás cansado: estás negociando. Corta eso.",
    "Hoy te haces respetar.",
    "La excusa te roba el futuro.",
    "Te prometiste algo. Cúmplelo.",
    "Apretar hoy es relajarte mañana.",
    "Si fallas hoy, lo repites mañana. Mejor hoy.",
    "La tarde es perfecta para cerrar con victoria.",
    "Hazlo simple: entra y cumple.",
    "No necesitas inspiración. Necesitas estándares.",
    "Hoy entrenas: punto.",
    "Tu forma física no entiende de excusas.",
    "Eres más fuerte que tu comodidad.",
    "Suma hoy. Suma siempre."
  ],
  noche: [
    "Cumple antes de que el día se apague.",
    "No te vayas a la cama debiéndote algo.",
    "La noche no es para rendirse: es para cerrar fuerte.",
    "Lo importante es hacerlo, aunque sea corto.",
    "Entrenar hoy te da paz mañana.",
    "Si lo haces cansado, eres peligroso.",
    "La disciplina también entrena en silencio.",
    "No busques perfecto. Busca completado.",
    "La noche premia al que no negocia.",
    "Hoy no termina hasta que tú lo decidas.",
    "Hazlo por respeto propio.",
    "No te falles a última hora.",
    "Un set más y cambias el día.",
    "El cansancio miente: tú mandas.",
    "Hazlo por el orgullo de cumplir.",
    "La constancia se ve cuando nadie mira.",
    "Aunque sea mínimo, que sea real.",
    "Hoy cerramos con victoria.",
    "No te castigues: demuéstrate.",
    "Mañana agradecerás no haberlo dejado pasar.",
    "El cuerpo se construye en días así.",
    "Si hoy cumples, mañana subes.",
    "No era falta de tiempo: era falta de decisión.",
    "La noche es tu prueba final.",
    "Hazlo y punto. Luego descansas.",
    "La meta no se discute: se ejecuta.",
    "Entrena para dormir con calma.",
    "Hoy no se tira la toalla.",
    "La fuerza también es mental.",
    "No te vas a rendir por inercia.",
    "Si llegaste hasta aquí, termínalo bien.",
    "La disciplina no tiene horario.",
    "Hazlo por el tú de dentro de 30 días.",
    "Hoy se cierra el círculo.",
    "Cumple y apaga la mente."
  ]
};

function pickQuote(dayPart) {
  const arr = QUOTES[dayPart] || QUOTES.tarde;
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

function main() {
  setTheme();

  const nameRaw = getParam("name", "");
  const name = nameRaw ? nameRaw : ""; // si no hay nombre, no lo ponemos
  const now = new Date();
  const dayPart = getDayPart(now);

  // Saludo + emoji ANTES
  const greet = greetingFor(dayPart);
  const greetingEl = document.getElementById("greeting");
  greetingEl.textContent = name ? `👋 ${greet}, ${name}` : `👋 ${greet}`;

  // Frase random por franja
  const quoteEl = document.getElementById("quote");
  quoteEl.textContent = pickQuote(dayPart);
}

document.addEventListener("DOMContentLoaded", main);

// Si cambia el tema del sistema (auto), recalcula
if (window.matchMedia) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener?.("change", () => {
    if ((getParam("theme", "auto") || "auto").toLowerCase() === "auto") {
      setTheme();
    }
  });
}
