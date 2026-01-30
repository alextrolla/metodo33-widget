/* =========================
   CONFIG
========================= */
const DEFAULT_NAME = "campeón";
const ACCENT = "#7A0E1A"; // tu granate (ajústalo si quieres)

/* Si quieres forzar timezone por URL:
   ?tz=Europe/Madrid
*/
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

function getQuery() {
  const u = new URL(window.location.href);
  return {
    name: (u.searchParams.get("name") || "").trim(),
    tz: (u.searchParams.get("tz") || "").trim(),
  };
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* =========================
   FRASES (100 mañana / 100 tarde / 100 noche)
   - Naturales
   - Cortas
   - Nada “IA cringe”
========================= */
const MORNING = [
  "Hoy no necesitas motivación: necesitas empezar.",
  "Un día bien hecho cambia una semana entera.",
  "Hazlo simple: una cosa bien, hoy.",
  "Arranca con lo importante. Lo demás se adapta.",
  "Hoy ganas si cumples lo mínimo.",
  "Primero el movimiento. Luego el resto.",
  "Tu yo de esta noche te lo va a agradecer.",
  "No busques perfecto: busca consistente.",
  "Empieza pequeño. Acaba fuerte.",
  "Hoy es un buen día para no negociar contigo.",
  "Tu agenda manda, pero tú decides el estándar.",
  "Un paso hoy vale más que mil planes.",
  "Si dudas, haz 10 minutos. El cuerpo sigue.",
  "Hoy toca claridad, no intensidad.",
  "El progreso empieza cuando dejas de posponer.",
  "Lo que hagas hoy te da forma mañana.",
  "Menos ruido. Más acción.",
  "Hoy: lo que toca. Sin drama.",
  "Tu rutina se construye con mañanas como esta.",
  "La disciplina se nota antes que el resultado.",
  "Hazlo por tu energía de todo el día.",
  "No necesitas ganas, necesitas una estructura.",
  "Hoy no compites con nadie. Solo con ayer.",
  "Crea inercia. Luego ya mejoras.",
  "Lo difícil es empezar. Después fluye.",
  "Si tu semana es caótica, tu plan debe ser claro.",
  "Pocas cosas. Bien hechas.",
  "Hoy toca sumar, aunque sea poco.",
  "Un entrenamiento decente es mejor que ninguno.",
  "Empieza con lo que tienes, donde estás.",
  "El cuerpo responde a la repetición, no a la inspiración.",
  "Hoy es una oportunidad de hacerlo fácil.",
  "Hazlo rápido, pero hazlo.",
  "Si hoy cumples, mañana es más fácil.",
  "Gana la mañana y ganas el día.",
  "Hoy toca lo básico: constancia.",
  "No lo pienses tanto. Hazlo.",
  "Tu energía se construye, no aparece.",
  "Hoy es para avanzar, no para demostrar.",
  "Cambia el ritmo, cambia el resultado.",
  "Tu futuro físico se entrena hoy.",
  "No te la juegues a la suerte: sigue el plan.",
  "Hazlo aunque sea imperfecto.",
  "Cada repetición cuenta.",
  "Un buen día se fabrica.",
  "Arranca con intención. Termina con orgullo.",
  "Hoy toca cumplir, no impresionar.",
  "Hazlo por tu cabeza, no solo por tu cuerpo.",
  "La mejor rutina es la que encaja contigo.",
  "Hoy, 1% mejor.",
  "Tu plan está hecho para tu vida real.",
  "Si hoy aprietas, mañana respiras.",
  "No busques el momento perfecto.",
  "Hoy es el momento.",
  "Tienes más control del que crees.",
  "Empieza. Ajustamos sobre la marcha.",
  "Hazlo antes de que el día te coma.",
  "Hoy toca respetarte.",
  "Lo simple gana siempre.",
  "Firme, no rápido.",
  "Constancia > intensidad.",
  "Menos promesas. Más hechos.",
  "Que hoy cuente.",
  "No te falles a primera hora.",
  "Tu cuerpo recuerda lo que repites.",
  "Hoy se gana con rutina, no con emoción.",
  "Lo que haces hoy decide tu semana.",
  "Empieza con una serie. Luego otra.",
  "Hoy toca construir.",
  "Hoy toca orden.",
  "Respira, enfócate, ejecuta.",
  "Haz lo que toca, aunque no apetezca.",
  "La disciplina no se siente, se hace.",
  "Un inicio fuerte no gana; gana lo sostenible.",
  "Hoy: cero excusas, muchas soluciones.",
  "Más control, menos caos.",
  "La clave no es entrenar más: es entrenar bien.",
  "Hoy toca eficiencia.",
  "Hazlo y vuelve a tu vida.",
  "Empieza por lo mínimo viable.",
  "Hoy es un buen día para cumplir contigo.",
  "Lo importante: no romper la cadena.",
  "Si fallas en algo, que sea en pequeño, no en todo.",
  "La agenda no es el problema: el plan fijo sí.",
  "Hoy toca plan flexible.",
  "Hazlo como puedas, pero hazlo.",
  "A veces ganar es no abandonar.",
  "Un día sólido vale oro.",
  "Tu cuerpo te sigue si tú te sigues.",
  "No esperes energía: créala.",
  "Hoy es para hacer lo correcto.",
  "Si lo haces hoy, te liberas mañana.",
  "Hoy no te complicas: ejecutas.",
  "Más acción, menos teoría.",
  "Un buen hábito empieza con una decisión.",
  "Corta la negociación interna: empieza.",
  "Hoy suma. Mañana se nota.",
  "Empieza con calma, termina con confianza.",
  "Tu yo de 3 meses se está construyendo hoy.",
  "Toca ser constante, no perfecto.",
];

const AFTERNOON = [
  "Aún estás a tiempo de salvar el día.",
  "No hace falta hacerlo grande: hace falta hacerlo.",
  "Si la mañana se fue, la tarde decide.",
  "Reajusta y sigue. Así se progresa.",
  "Una sesión hoy evita una semana mala.",
  "Hazlo corto, hazlo bien.",
  "La constancia se demuestra cuando estás ocupado.",
  "No necesitas más tiempo, necesitas prioridades claras.",
  "Si estás cansado, hazlo más simple, no lo canceles.",
  "Entrena para tener energía, no para gastarla.",
  "Hoy toca adaptar, no abandonar.",
  "El plan flexible gana aquí.",
  "La tarde es donde la mayoría se rinde. Tú no.",
  "Cambia el ‘no puedo’ por ‘qué sí puedo hoy’.",
  "Una decisión buena ahora lo cambia todo.",
  "Ajusta el plan a tu día, no tu día al plan.",
  "Hazlo aunque sea a medias. Eso ya es victoria.",
  "Hoy cuenta igual aunque no sea perfecto.",
  "Suma una pequeña victoria y sigue con tu vida.",
  "El progreso es acumulación, no épica.",
  "Si tu agenda aprieta, tu entrenamiento se optimiza.",
  "No estás tarde: estás a tiempo.",
  "Haz lo que toca, y vuelve al trabajo con la cabeza limpia.",
  "Cero drama: plan, ejecución, listo.",
  "Una sesión hoy reduce el estrés de mañana.",
  "Tu cuerpo no necesita más horas: necesita estímulo.",
  "Hazlo eficiente y ya.",
  "Hoy toca ganar al caos.",
  "La disciplina también es saber simplificar.",
  "No te castigues por ir tarde: actúa.",
  "Hazlo por tu foco, tu energía y tu autoestima.",
  "Una tarde bien resuelta cambia tu semana.",
  "Si hoy cumples, el fin de semana descansas mejor.",
  "No pierdas la cadena por un día raro.",
  "Hazlo aunque el día haya salido mal.",
  "Hoy entrenas para estar bien, no para sufrir.",
  "No busques intensidad; busca consistencia.",
  "Más control, menos culpa.",
  "Cuando tu vida se complica, el sistema te sostiene.",
  "Hazlo en 30–60 min y listo.",
  "No necesitas ‘ganas’. Necesitas el siguiente paso.",
  "La tarde es para cerrar pendientes. Incluido tú.",
  "Un entrenamiento hoy te devuelve el control.",
  "Tu físico no se construye en días perfectos.",
  "La mayoría falla por rigidez. Tú tienes flexibilidad.",
  "Hoy toca adaptarse con cabeza.",
  "No es tarde. Es ahora.",
  "Si hoy cumples, mañana es más ligero.",
  "Que el trabajo no te quite el cuerpo también.",
  "Tu semana real es el entrenamiento real.",
  "No tires el día por no hacerlo perfecto.",
  "Hazlo simple: una cosa bien y fin.",
  "No estás sin tiempo: estás sin plan adaptable.",
  "Hoy toca lo mínimo que mantenga el progreso.",
  "Si el día cambia, el plan cambia contigo.",
  "Constancia cuando estás ocupado: eso es nivel.",
  "No negocies contigo: ejecuta una versión corta.",
  "Hoy toca sumar sin ruido.",
  "Tu energía del trabajo mejora con movimiento.",
  "Un entrenamiento hoy te baja el estrés mañana.",
  "No esperes a estar libre. No va a pasar.",
  "Ajusta, cumple, repite.",
  "Esto es lo que hace que funcione.",
  "Entrenar no es un evento: es un sistema.",
  "Hoy no compites: mantienes.",
  "Un día caótico no rompe el progreso si tú no rompes la cadena.",
  "La clave es no perder el hilo.",
  "Hoy toca continuidad.",
  "Si te cuesta, baja la ambición, no la constancia.",
  "Cumplir hoy es ganar libertad mañana.",
  "Hazlo por tu versión de la noche.",
  "Una sesión hoy te deja la cabeza limpia.",
  "No lo hagas heroico. Hazlo viable.",
  "El sistema funciona cuando el día no ayuda.",
  "La tarde es perfecta para un ‘check’ contigo.",
  "Hoy toca entrenar como alguien ocupado: eficiente.",
  "Cumple y sigue.",
  "Hazlo por tu salud, no por el espejo (el espejo llega).",
  "Menos presión. Más coherencia.",
  "Un plan flexible es un plan que se cumple.",
  "La disciplina no es dura: es práctica.",
  "No abandones por un día raro.",
  "Hazlo bien, aunque sea poco.",
  "Tu cuerpo agradece lo constante.",
  "Una decisión pequeña, impacto grande.",
  "No es ‘hoy o nunca’. Es ‘hoy también’.",
  "Aún puedes hacer que el día cuente.",
  "Tu progreso no se pausa por reuniones.",
  "Hoy toca entrenamiento adaptado.",
  "Hazlo, y vuelve al mundo con otra energía.",
  "Cuando hay caos, manda el sistema.",
  "Lo mejor que puedes hacer hoy es cumplir.",
  "No lo pienses: empieza con la primera serie.",
  "Un día flexible no es un día perdido.",
  "Hoy toca mantener el ritmo.",
  "Consistencia = resultados.",
  "Tu semana real merece un plan real.",
  "Cumple y descansa.",
];

const NIGHT = [
  "Cierra el día con orgullo, aunque sea en pequeño.",
  "Hoy no se trata de perfecto: se trata de no abandonar.",
  "Si hoy te costó, mañana lo hacemos más simple.",
  "La noche es para cerrar el ciclo: tú también cuentas.",
  "No te castigues: ajusta y sigue.",
  "Lo importante es que sigues.",
  "El progreso se construye con noches como esta.",
  "Mañana será más fácil porque hoy no soltaste.",
  "Si hoy cumpliste, ya ganaste.",
  "Cierra el día con una victoria pequeña.",
  "Tu cuerpo mejora mientras duermes si hoy hiciste lo tuyo.",
  "Hoy fue real. Y lo real es lo que cuenta.",
  "No necesitas hacerlo grande: necesitas hacerlo repetible.",
  "Si hoy fue un caos, que tu plan sea tu calma.",
  "Respira: estás construyendo algo.",
  "Hoy toca cuidarte, no exigirte de más.",
  "Lo que haces de noche también suma.",
  "Mañana se agradece lo que hoy sostienes.",
  "No rompas la cadena por cansancio.",
  "La disciplina también es saber parar a tiempo.",
  "Si hoy no salió perfecto, no pasa nada: seguimos.",
  "La noche no es para culpas, es para ajustes.",
  "Haz lo mínimo para mantener el hilo.",
  "Un día imperfecto no arruina tu progreso.",
  "La constancia se ve cuando estás cansado.",
  "Hoy cumpliste con tu versión real, no ideal.",
  "Tu cuerpo cambia cuando tú no te rindes.",
  "Mañana no empieza de cero: empieza con lo de hoy.",
  "Cierra el día con estructura, no con estrés.",
  "Tu energía se fabrica con hábitos, no con ganas.",
  "Hoy toca respeto propio.",
  "Descansa sin culpa: te lo ganaste.",
  "La noche es para recuperar, no para reproches.",
  "Si hoy no entrenaste, mañana lo simplificamos.",
  "Lo importante es seguir en el juego.",
  "Hoy fue una inversión en ti.",
  "La disciplina tranquila es la que dura.",
  "Si hoy cumpliste, no lo minimices.",
  "Mañana seguimos, con cabeza.",
  "No busques castigo: busca sistema.",
  "La calma también es progreso.",
  "Hoy toca cerrar bien.",
  "Tu cuerpo agradece la coherencia.",
  "Mañana se construye con lo que hoy sostienes.",
  "La noche te devuelve lo que el día te quitó.",
  "Lo simple y constante siempre gana.",
  "Un plan flexible te salva en semanas duras.",
  "Hoy no se mide en perfección, se mide en continuidad.",
  "Lo importante: no abandonar.",
  "Tu progreso no depende de un día perfecto.",
  "Mañana te levantas con ventaja si hoy no rompiste la cadena.",
  "Hoy cuenta, aunque haya sido poco.",
  "Tu salud no se negocia: se prioriza.",
  "Si hoy fue duro, eso también es entrenamiento.",
  "Mañana ajustamos. Hoy descansas.",
  "Tu constancia vale más que tu intensidad.",
  "No te compares: sigue.",
  "Cierra el día con una decisión: seguir.",
  "Hoy toca orgullo, no culpa.",
  "Tu cuerpo cambia en la repetición.",
  "Mañana vuelve a ser tuyo.",
  "La noche es para recuperar el control.",
  "El sistema te sostiene cuando estás cansado.",
  "No te exijas más de lo que puedes sostener.",
  "Hoy fue suficiente para seguir avanzando.",
  "Si hoy cumpliste, te lo has ganado.",
  "No lo hiciste perfecto, lo hiciste real.",
  "La disciplina también es descansar bien.",
  "Mañana, un paso más.",
  "La constancia gana cuando nadie mira.",
  "Cierra el día sin ruido.",
  "Hoy hiciste lo que toca.",
  "No te fallaste. Eso importa.",
  "Lo que mantienes hoy, te transforma mañana.",
  "Si hoy fue poco, que sea continuo.",
  "La noche: calma, recuperación, foco.",
  "Tu rutina se mantiene en días difíciles.",
  "Mañana será más fácil si hoy no te rindes.",
  "No te castigues: aprende y ajusta.",
  "Un día imperfecto no es excusa para parar.",
  "Cierra con gratitud: sigues.",
  "El progreso no grita, se acumula.",
  "Tu mejor versión se construye despacio.",
  "Hoy fue un ladrillo más.",
  "Mañana sigues, con un plan que encaja.",
  "No es motivación: es sistema.",
  "Tu disciplina es tu libertad.",
  "Cierra el día con intención.",
  "Hoy ya está. Mañana seguimos.",
  "Si hoy no salió, mañana se adapta.",
  "Lo importante es volver.",
  "Mañana te lo pones fácil.",
  "No abandones por cansancio.",
  "Cierra el día con coherencia.",
  "Lo real funciona.",
  "Hoy toca descanso de calidad.",
  "Sigues en el juego. Eso es ganar.",
  "Mañana construimos otra vez.",
  "Tu cuerpo cambia cuando tu sistema no se rompe.",
  "Hoy fue progreso.",
];

/* =========================
   SALUDO + FRASE
========================= */
function getTimeSegment(hour) {
  if (hour >= 6 && hour < 14) return "morning";
  if (hour >= 14 && hour < 21) return "afternoon";
  return "night";
}

function buildGreeting(segment) {
  if (segment === "morning") return "Buenos días";
  if (segment === "afternoon") return "Buenas tardes";
  return "Buenas noches";
}

function getPhrase(segment) {
  if (segment === "morning") return pick(MORNING);
  if (segment === "afternoon") return pick(AFTERNOON);
  return pick(NIGHT);
}

function capitalizeName(name) {
  if (!name) return DEFAULT_NAME;
  const s = name.trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* =========================
   INIT
========================= */
(function init() {
  const { name, tz } = getQuery();
  const hour = getHourInTimezone(tz);
  const segment = getTimeSegment(hour);

  const greeting = buildGreeting(segment);
  const who = capitalizeName(name);

  // UI
  document.getElementById("title").textContent = `${greeting}, ${who}`;
  document.getElementById("subtitle").textContent =
    (segment === "morning")
      ? "Hoy toca ganar el día sin complicarte."
      : (segment === "afternoon")
        ? "Reajusta, cumple lo mínimo y sigue."
        : "Cierra el día con coherencia y descansa bien.";

  document.getElementById("quote").textContent = getPhrase(segment);

  const meta = [];
  if (tz) meta.push(`TZ: ${tz}`);
  meta.push(`Modo: ${segment === "morning" ? "mañana" : segment === "afternoon" ? "tarde" : "noche"}`);
  document.getElementById("meta").textContent = meta.join(" • ");

  // Loader (intro premium)
  const loader = document.getElementById("loader");
  // pequeña demora para que la animación se perciba premium
  setTimeout(() => {
    loader.classList.add("hidden");
    setTimeout(() => loader.remove(), 360);
  }, 520);
})();
