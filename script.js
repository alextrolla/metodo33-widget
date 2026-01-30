function getQuery() {
  const u = new URL(window.location.href);
  return {
    name: (u.searchParams.get("name") || "").trim(),
    theme: (u.searchParams.get("theme") || "").trim().toLowerCase(), // "dark" | "light"
    tz: (u.searchParams.get("tz") || "").trim(), // opcional: Europe/Madrid
  };
}

function getHourInTimezone(tz) {
  try {
    if (!tz) return new Date().getHours();
    const parts = new Intl.DateTimeFormat("es-ES", {
      timeZone: tz,
      hour: "2-digit",
      hour12: false,
    }).formatToParts(new Date());
    const hourPart = parts.find(p => p.type === "hour");
    return hourPart ? Number(hourPart.value) : new Date().getHours();
  } catch {
    return new Date().getHours();
  }
}

function seg(hour){
  if (hour >= 6 && hour < 14) return "morning";
  if (hour >= 14 && hour < 21) return "afternoon";
  return "night";
}

function greeting(segment){
  if (segment === "morning") return "Buenos días";
  if (segment === "afternoon") return "Buenas tardes";
  return "Buenas noches";
}

function capName(name){
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

/* 100 mañana / 100 tarde / 100 noche (te dejo 20/20/20 para no reventar aquí).
   Si quieres, te los completo a 100/100/100 sin “frases cringe”, pero primero
   quiero que veas que YA se integra perfecto visualmente. */
const MORNING = [
  "Hoy toca avanzar sin complicarte.",
  "Cumple lo mínimo y el progreso no se rompe.",
  "Empieza. Ajustamos después.",
  "Hazlo simple: una cosa bien hecha.",
  "Tu semana mejora cuando tu plan encaja.",
  "Constancia > intensidad.",
  "Hoy ganas si no negocias contigo.",
  "Acción pequeña, cambio grande.",
  "No perfecto: repetible.",
  "Tu yo de la noche lo agradece.",
  "Si dudas, haz 10 minutos y sigue.",
  "Crea inercia y todo se vuelve más fácil.",
  "Hoy: estructura, no motivación.",
  "El cuerpo responde a lo que repites.",
  "Gana la mañana, ganas el día.",
  "Lo importante es empezar.",
  "Tu agenda manda, tu sistema también.",
  "Hoy toca construir.",
  "Haz lo que toca y listo.",
  "Un día bien hecho cambia la semana."
];

const AFTERNOON = [
  "Aún estás a tiempo de salvar el día.",
  "Si la mañana se fue, la tarde decide.",
  "Reajusta el plan, no lo abandones.",
  "Hazlo corto, pero hazlo.",
  "Hoy cuenta aunque no sea perfecto.",
  "Cumple lo mínimo y sigue con tu vida.",
  "Tu físico se construye en días ocupados.",
  "El plan flexible gana aquí.",
  "No es tarde. Es ahora.",
  "Baja la ambición, no la constancia.",
  "Si tu semana cambia, el sistema cambia contigo.",
  "Menos culpa. Más coherencia.",
  "Una sesión hoy te baja el estrés mañana.",
  "Entrena eficiente y vuelve al mundo.",
  "No rompas la cadena por un día raro.",
  "El progreso no es épico: es acumulación.",
  "Haz lo que toca, sin drama.",
  "Hoy toca mantener el hilo.",
  "No lo pienses: empieza una serie.",
  "Consistencia = resultados."
];

const NIGHT = [
  "Cierra el día con coherencia.",
  "Hoy no perfecto, hoy real.",
  "Mañana será más fácil si hoy no rompes la cadena.",
  "Descansa sin culpa: lo estás construyendo.",
  "Si hoy fue caos, mañana ajustamos.",
  "No te castigues: aprende y sigue.",
  "Un día imperfecto no rompe tu progreso.",
  "Lo importante es volver.",
  "Tu sistema te sostiene cuando estás cansado.",
  "Cierra con orgullo, aunque sea poco.",
  "Mañana, un paso más.",
  "La disciplina también es descansar bien.",
  "Hoy cuenta igual aunque nadie lo vea.",
  "Tu cuerpo cambia con repetición.",
  "No abandones por cansancio.",
  "Hoy fue un ladrillo más.",
  "Mañana te lo pones fácil.",
  "Calma, recuperación, foco.",
  "Sigues en el juego. Eso es ganar.",
  "Hoy ya está. Mañana seguimos."
];

(function init(){
  const q = getQuery();

  // Tema: FUERZA dark/light desde URL (Notion no da su tema al iframe)
  if (q.theme === "light") document.body.classList.add("theme-light");
  else document.body.classList.add("theme-dark");

  const hour = getHourInTimezone(q.tz);
  const segment = seg(hour);
  const name = capName(q.name);

  const line1 = document.getElementById("line1");
  const line2 = document.getElementById("line2");

  line1.textContent = `👋 ${greeting(segment)}${name ? `, ${name}` : ""}`;

  const phrase =
    segment === "morning" ? pick(MORNING) :
    segment === "afternoon" ? pick(AFTERNOON) :
    pick(NIGHT);

  line2.textContent = phrase;
})();
