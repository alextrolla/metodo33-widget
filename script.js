/**
 * URL params:
 * ?name=Alex
 * ?tz=Europe/Madrid      (opcional si la hora te falla)
 * ?intro=900             (ms de intro, por defecto 900)
 */

function getParam(name, fallback = "") {
  const url = new URL(window.location.href);
  return url.searchParams.get(name) ?? fallback;
}

function safeName(raw) {
  const cleaned = String(raw || "").trim();
  if (!cleaned) return "Alex";
  return cleaned.slice(0, 24);
}

function getHourInTZ(timeZone) {
  const now = new Date();
  if (!timeZone) return now.getHours();

  const parts = new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    hour12: false,
    timeZone,
  }).formatToParts(now);

  const hourPart = parts.find((p) => p.type === "hour");
  return hourPart ? parseInt(hourPart.value, 10) : now.getHours();
}

function getGreetingByHour(h) {
  if (h >= 5 && h <= 11) return { saludo: "Buenos días", tema: "mañana" };
  if (h >= 12 && h <= 19) return { saludo: "Buenas tardes", tema: "tarde" };
  return { saludo: "Buenas noches", tema: "noche" };
}

/* estable por día (no random loco): cambia una vez al día */
function dayKey(timeZone) {
  const now = new Date();
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

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/* =========================
   100 FRASES BUENAS x FRANJA
   (1 frase, sin “tres unidades”)
   ========================= */

const FRASES = {
  mañana: [
    "Empieza fácil, pero empieza.",
    "Hoy se gana con lo básico bien hecho.",
    "Tu mejor versión se entrena en silencio.",
    "Energía arriba: una cosa bien, ya.",
    "Hoy no negocias contigo: cumples.",
    "Entra en modo acción, sin drama.",
    "Hazlo simple: técnica y constancia.",
    "El primer paso decide el resto del día.",
    "Arranca con intención, termina con orgullo.",
    "Hoy construyes el hábito que te cambia.",
    "Si te presentas, ya vas ganando.",
    "Lo que haces hoy te lo devuelve mañana.",
    "Una sesión limpia vale por dos medias.",
    "Empieza con calma, aprieta con cabeza.",
    "Activa el cuerpo, despeja la mente.",
    "Constancia primero, motivación después.",
    "Hazlo aunque sea al 80%.",
    "Tu futuro yo te está mirando.",
    "Hoy toca sumar, aunque sea poco.",
    "El ritmo lo marcas tú, no el día.",
    "A primera hora se forja la disciplina.",
    "Cero excusas, una acción.",
    "El plan es el plan: ejecútalo.",
    "Tu cuerpo entiende hechos, no promesas.",
    "Saca una victoria temprana.",
    "Hoy toca cumplir: punto.",
    "Empieza con técnica y confianza.",
    "Entrena como si ya fueras quien quieres ser.",
    "No busques ganas: busca el primer set.",
    "Un buen inicio lo cambia todo.",
    "Haz que hoy cuente.",
    "La mañana es para avanzar sin ruido.",
    "Lo difícil es empezar; luego fluye.",
    "Tu estándar sube cuando cumples.",
    "Hoy entrenas, mañana lo notas.",
    "Menos pensar, más hacer.",
    "Que tu día empiece con una victoria.",
    "Hoy es un buen día para ser constante.",
    "No perfección: consistencia.",
    "Tu progreso empieza en el primer movimiento.",
    "Pon el foco: una serie, y ya.",
    "Hoy se entrena el carácter.",
    "Empieza suave, termina fuerte.",
    "Hoy sumas: y eso vale.",
    "No esperes el momento, créalo.",
    "La disciplina se entrena igual que el músculo.",
    "Hoy te ganas el respeto.",
    "La mañana es tu ventaja.",
    "Una sesión más, un paso más.",
    "Hoy no fallas: te presentas.",
    "Entra, cumple, sal mejor.",
    "Tu rutina es tu superpoder.",
    "La consistencia te hace inevitable.",
    "Haz lo que dijiste que harías.",
    "Tu energía se fabrica moviéndote.",
    "Arranca con decisión.",
    "No hay secreto: hay repetición.",
    "Empieza por el primer set.",
    "Hoy eres el tipo de persona que cumple.",
    "Que el primer esfuerzo sea el más fácil.",
    "Sin excusas, con intención.",
    "El progreso se construye temprano.",
    "Un día más de ventaja.",
    "Hoy te haces más fuerte, literal.",
    "Tu cuerpo aprende lo que repites.",
    "No te lo pienses: ejecútalo.",
    "Hoy toca trabajo limpio.",
    "Tu día empieza cuando tú decides.",
    "Empieza con orgullo: cumple.",
    "Hoy es un paso hacia tu meta.",
    "La mañana es para ganar terreno.",
    "Hazlo por el Alex de dentro de 3 meses.",
    "Una sesión consistente vale oro.",
    "Entrena, y que el día se adapte.",
    "La constancia no tiene rival.",
    "Hoy toca ser serio con tu plan.",
    "Un buen día se construye, no aparece.",
    "Empieza fuerte mentalmente.",
    "Que tu primera decisión sea buena.",
    "Saca el entrenamiento y ya estás por delante.",
    "Hazlo aunque no apetezca.",
    "No necesitas motivación, necesitas rutina.",
    "Un set te mete en el flow.",
    "Hoy no improvisas: ejecutas.",
    "Súmale calidad a lo simple.",
    "Técnica primero, ego después.",
    "Hoy se gana por acumulación.",
    "Cumple lo pactado contigo.",
    "La mañana es para construir disciplina.",
    "Entra con foco, sal con orgullo.",
    "Una sesión más: eso es el plan.",
    "Hoy eres constante, mañana eres imparable.",
    "El primer set rompe la pereza.",
    "Una rutina hecha cambia el día.",
    "Hoy es entrenamiento, no negociación.",
    "Tu progreso vive en lo repetido.",
    "Arranca, y deja que el cuerpo haga lo suyo.",
    "Hoy es un buen día para cumplir.",
    "Cumple lo básico y gana el día."
  ],

  tarde: [
    "Aún estás a tiempo de ganar el día.",
    "No hace falta perfecto: hace falta hecho.",
    "Vuelve al plan, aunque sea en pequeño.",
    "Cumple una cosa y todo mejora.",
    "La tarde es para sumar constancia.",
    "Hazlo simple y ejecútalo.",
    "La disciplina no depende de cómo te sientes.",
    "Hoy se gana por insistencia.",
    "Una sesión a medias es mejor que cero.",
    "Ajusta, cumple y sigue.",
    "No esperes ganas: crea movimiento.",
    "Tu progreso es lo que repites.",
    "Hoy toca cumplir, sin drama.",
    "Un bloque más y ya.",
    "La tarde también construye campeones.",
    "Sigue: el cuerpo responde.",
    "Tu mejor versión se entrena cuando cuesta.",
    "Hazlo ahora y libérate después.",
    "No negocies con la pereza.",
    "Lo importante es volver al plan.",
    "Una sesión más te separa del resto.",
    "Hoy sumas otra prueba de constancia.",
    "Saca el entrenamiento y el día cambia.",
    "El progreso no espera al momento perfecto.",
    "Hoy toca empujar un poco más.",
    "Constancia: la única magia real.",
    "Cumple lo mínimo y ya ganaste.",
    "Hazlo aunque sea al 70%.",
    "Lo que haces hoy cuenta mañana.",
    "Hoy se entrena el compromiso.",
    "Tu cuerpo entiende consistencia.",
    "Entra en modo ejecución.",
    "Cierra la tarde con una victoria.",
    "No te líes: una serie y ya estás dentro.",
    "Si vuelves al plan, vuelves a ganar.",
    "Aún puedes sumar un buen día.",
    "No falles al hábito.",
    "Haz lo que dijiste que harías.",
    "Una sesión limpia vale muchísimo.",
    "Tu progreso vive en la repetición.",
    "Hoy toca avanzar, no pensar.",
    "Hazlo por tu objetivo, no por tu ánimo.",
    "Lo importante es presentarte.",
    "Constancia > intensidad puntual.",
    "Un paso más y ya.",
    "Hazlo simple: técnica y control.",
    "Hoy no improvisas: cumples.",
    "La tarde es tu segunda oportunidad.",
    "Otra sesión ganada.",
    "La disciplina te está esperando.",
    "Súmale calidad a lo básico.",
    "Hoy sumas confianza.",
    "No busques excusas, busca acción.",
    "Hoy se entrena la mente también.",
    "Cumple y a otra cosa.",
    "Tu futuro yo te lo agradece.",
    "No necesitas más tiempo: necesitas empezar.",
    "Una sesión más te hace inevitable.",
    "Hazlo ahora y descansa con paz.",
    "El plan se respeta.",
    "Vuelve a la rutina: es tu base.",
    "Hazlo con calma, pero hazlo.",
    "La tarde se gana con disciplina.",
    "Una victoria pequeña cambia el día.",
    "Hoy te haces más fuerte por dentro.",
    "Cumple lo básico: ya es mucho.",
    "Tu progreso no se discute: se entrena.",
    "Ajusta el ritmo, no el objetivo.",
    "Una sesión hoy vale por dos mañana.",
    "Hoy toca sumar en silencio.",
    "No pares: sigue el proceso.",
    "La constancia no tiene rival.",
    "Hoy es trabajo limpio.",
    "No te traiciones hoy.",
    "Sigue: estás construyendo algo serio.",
    "Un bloque más, y listo.",
    "Hazlo aunque no sea perfecto.",
    "La tarde también cuenta.",
    "No pierdas el hábito.",
    "Hoy te ganas respeto a ti mismo.",
    "Entra, cumple, sal mejor.",
    "No esperes motivación: ejecuta.",
    "Hoy el objetivo es cumplir.",
    "Tu disciplina es tu ventaja.",
    "Aún puedes cerrar el día fuerte.",
    "Hazlo por tu compromiso.",
    "Una sesión más te separa del resto.",
    "Hoy es consistencia.",
    "Cumple y vuelve a tu vida.",
    "Un paso más hacia tu meta.",
    "Hoy toca mantener el rumbo.",
    "No cambies el plan: cumple el plan.",
    "La tarde es para avanzar.",
    "No hace falta épico: hace falta hecho.",
    "Hazlo ya y te quitas peso mental.",
    "Tu rutina te sostiene.",
    "Suma otra repetición y ya.",
    "Hoy se gana por constancia."
  ],

  noche: [
    "Cierra el día con orgullo.",
    "Termina fuerte y duerme tranquilo.",
    "Hoy ya sumaste: remata con calma.",
    "Una sesión hoy vale por un día mejor mañana.",
    "La noche es para consolidar hábitos.",
    "Hazlo por tu descanso mental.",
    "Cierra el día cumpliendo contigo.",
    "Hoy cuenta aunque haya sido duro.",
    "Termina el día como un profesional.",
    "Disciplina también es saber cerrar.",
    "Una última victoria y a descansar.",
    "Cumple y suelta el día.",
    "Lo que haces de noche se nota mañana.",
    "Hoy te ganas el descanso.",
    "Entrena, cierra y recupera.",
    "No busques perfecto: busca hecho.",
    "Cierra el día sin excusas.",
    "Hazlo por tu yo de mañana.",
    "La constancia no tiene horario.",
    "Una sesión más, y listo.",
    "Hoy se entrena la disciplina.",
    "Termina con intención.",
    "Cierra el día sumando.",
    "No te falles al final.",
    "Hazlo simple y acaba bien.",
    "Hoy ya has llegado: remata.",
    "Cumple y descansa mejor.",
    "La noche es para demostrar carácter.",
    "Acaba el día más fuerte que lo empezaste.",
    "Una última acción cambia el día.",
    "No te lleves culpa a la cama.",
    "Cumple y duerme en paz.",
    "Lo que haces ahora te lo devuelve mañana.",
    "Cierra el día con una victoria silenciosa.",
    "Hazlo aunque sea corto.",
    "Una sesión pequeña sigue siendo una sesión.",
    "Termina el día con disciplina.",
    "Hoy no se negocia: se cumple.",
    "Cierra con técnica y control.",
    "Hazlo por tu objetivo, no por tu cansancio.",
    "La noche también construye progreso.",
    "Remata el día con cabeza.",
    "Cierra el día como quieres vivirlo.",
    "Cumple y baja revoluciones.",
    "Acaba con orgullo, sin ruido.",
    "Hoy sumas una prueba de constancia.",
    "Tu cuerpo agradece la consistencia.",
    "Hazlo y desconecta.",
    "Hoy ya has hecho mucho: haz lo correcto.",
    "Cierra el día alineado con tu meta.",
    "No te dejes para mañana.",
    "Termina con intención y calma.",
    "La constancia se ve en los días largos.",
    "Hoy se gana cuando nadie mira.",
    "Hazlo y descansa de verdad.",
    "Cierra el día con el trabajo hecho.",
    "Una sesión hoy te da paz.",
    "No te falles en la recta final.",
    "Hoy es disciplina, mañana es resultado.",
    "Acaba el día cumpliendo contigo.",
    "Cierra fuerte, duerme mejor.",
    "Hazlo por tu progreso acumulado.",
    "Hoy el objetivo es terminar.",
    "No necesitas ganas: necesitas cerrar.",
    "Una sesión más y el día queda perfecto.",
    "Cierra el día con orgullo y calma.",
    "Hazlo con control, sin prisa.",
    "La noche es para consolidar.",
    "Cierra el día sumando, no dudando.",
    "Cumple y a descansar.",
    "Hoy se entrena la mente también.",
    "Hazlo aunque sea mínimo.",
    "Una última victoria te cambia el día.",
    "Cierra el día sin cuentas pendientes.",
    "Haz lo que dijiste que harías.",
    "Termina el día con respeto propio.",
    "Tu disciplina te cuida.",
    "Hoy sumas: mañana lo notas.",
    "Cierra el día como un atleta.",
    "Hazlo por tu sueño y tu cuerpo.",
    "Termina el día sin excusas.",
    "La noche también cuenta.",
    "Cierra el día con el plan cumplido.",
    "Hazlo y desconecta sin culpa.",
    "Tu rutina te sostiene incluso de noche.",
    "Cierra con calma y orgullo.",
    "Hoy te mereces descansar con paz.",
    "No te traiciones al final.",
    "Cierra el día con una victoria real.",
    "Acaba bien, aunque haya sido un día raro.",
    "Hazlo y duerme tranquilo.",
    "Cierra el día con disciplina y ya.",
    "Una sesión más: y a descansar.",
    "Hoy se gana con constancia.",
    "Termina el día mejor de lo que empezó."
  ],
};

function pickDailyPhrase(theme, name, tz) {
  const key = `${dayKey(tz)}|${name}|${theme}`;
  const list = FRASES[theme] || FRASES.mañana;
  const idx = hashString(key) % list.length;
  return list[idx];
}

/* INTRO */
async function runIntro(ms) {
  const splash = document.getElementById("splash");
  if (!splash) return;

  // si intro=0 -> sin intro
  if (ms <= 0) {
    document.body.classList.remove("preload");
    document.body.classList.add("loaded");
    return;
  }

  // pequeña espera “pro”
  await new Promise((r) => setTimeout(r, ms));

  document.body.classList.remove("preload");
  document.body.classList.add("loaded");
}

(function init() {
  const name = safeName(getParam("name", "Alex"));
  const tz = getParam("tz", "");
  const introMs = parseInt(getParam("intro", "900"), 10);

  const hour = getHourInTZ(tz);
  const { saludo, tema } = getGreetingByHour(hour);

  // Emoji antes + saludo correcto
  const title = `👋 ${saludo}, ${name}.`;
  const phrase = pickDailyPhrase(tema, name, tz);

  document.getElementById("title").textContent = title;
  document.getElementById("subtitle").textContent = phrase;

  runIntro(Number.isFinite(introMs) ? introMs : 900);
})();
