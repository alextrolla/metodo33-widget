(() => {
  // ---------------- Helpers ----------------
  function getParam(name, fallback = "") {
    const url = new URL(window.location.href);
    const v = url.searchParams.get(name);
    return (v && v.trim()) ? v.trim() : fallback;
  }

  function getBucketByHour(hour) {
    // mañana 6-12, tarde 12-20, noche 20-6
    if (hour >= 6 && hour < 12) return "morning";
    if (hour >= 12 && hour < 20) return "afternoon";
    return "night";
  }

  function getGreetingByBucket(bucket) {
    if (bucket === "morning") return "Buenos días";
    if (bucket === "afternoon") return "Buenas tardes";
    return "Buenas noches";
  }

  function pickRandom(arr, avoid) {
    if (!Array.isArray(arr) || arr.length === 0) return "";
    if (arr.length === 1) return arr[0];

    let tries = 0;
    let candidate = arr[Math.floor(Math.random() * arr.length)];
    while (candidate === avoid && tries < 12) {
      candidate = arr[Math.floor(Math.random() * arr.length)];
      tries++;
    }
    return candidate;
  }

  // ---------------- Frases ----------------
  const QUOTES = {
    morning: [
      "Haz lo difícil ahora. Lo fácil no construye nada.",
      "La disciplina es libertad. Empieza ya.",
      "Hoy no se negocia. Hoy se cumple.",
      "Gana la mañana, gana el día.",
      "Tu versión del futuro te está mirando. No falles.",
      "El dolor de la disciplina o el dolor del arrepentimiento. Elige.",
      "No esperes a tener ganas. Hazlo sin ganas.",
      "Cada minuto cuenta. No lo desperdicies scrolleando.",
      "Enfócate. Una sola prioridad a la vez.",
      "El éxito es la suma de pequeños esfuerzos repetidos.",
      "Sé el hombre que dijiste que ibas a ser.",
      "Sin excusas. Ejecuta el plan.",
      "La comodidad es el enemigo del progreso.",
      "Hoy es un buen día para superar tus límites.",
      "Levántate y ataca tus objetivos.",
      "La consistencia vence a la intensidad.",
      "Mente fría, ejecución implacable.",
      "No busques motivación, busca disciplina.",
      "Lo que hagas antes de las 10am define tu día.",
      "Haz que este día cuente.",
      "Controla lo que puedes. Ignora lo que no.",
      "La acción cura el miedo. Muévete.",
      "No dejes para la tarde lo que construye tu vida ahora.",
      "Estás construyendo un legado, ladrillo a ladrillo.",
      "Sé implacable con tus distracciones.",
      "El respeto se gana cumpliendo tu propia palabra.",
      "Hoy es una oportunidad, no una obligación.",
      "Suda más en la práctica, sangra menos en la guerra.",
      "Mantén el estándar alto.",
      "Hazlo. Y hazlo bien."
    ],
    afternoon: [
      "No bajes el ritmo. Mantén la inercia.",
      "La fatiga es mental. Sigue empujando.",
      "Aquí es donde la mayoría abandona. Tú no.",
      "Revisa tus objetivos. ¿Te estás acercando?",
      "La constancia es aburrida, pero efectiva.",
      "No te distraigas. Termina lo que empezaste.",
      "El trabajo duro real empieza cuando quieres parar.",
      "Mantén el foco. El día aún no termina.",
      "Respira hondo y sigue ejecutando.",
      "La excelencia es un hábito, no un acto.",
      "No negocies contigo mismo. Cumple.",
      "Si estás cansado, descansa al final, no a la mitad.",
      "Pequeños avances. Gran progreso.",
      "Domina tu atención, domina tu vida.",
      "La tarde define quién eres cuando nadie mira.",
      "Sigue el plan. Confía en el proceso.",
      "Un paso más. Solo uno más.",
      "La resistencia es la clave del crecimiento.",
      "No pierdas el tiempo. Inviértelo.",
      "La disciplina te lleva donde la motivación no llega.",
      "Mantén la cabeza baja y sigue trabajando.",
      "¿Estás siendo productivo o solo estás ocupado?",
      "El esfuerzo de hoy es la recompensa de mañana.",
      "No te conformes con lo 'suficiente'.",
      "Supera la pereza de la tarde.",
      "Recuerda por qué empezaste.",
      "La mediocridad odia el esfuerzo. Sigue.",
      "Ordena tu entorno, ordena tu mente.",
      "Sé un profesional. Aparece y cumple.",
      "Acaba fuerte."
    ],
    night: [
      "Descansa para recargar, no para renunciar.",
      "Mañana se prepara hoy. Organiza tu mente.",
      "Duerme 8 horas. Tu cerebro te lo cobrará.",
      "Reflexiona: ¿Qué hiciste bien hoy?",
      "Desconecta para reconectar mejor mañana.",
      "La recuperación es parte del entrenamiento.",
      "Agradece el esfuerzo de hoy.",
      "Cierra el día con la conciencia tranquila.",
      "Deja el móvil. Cuida tu sueño.",
      "El descanso es un arma. Úsala bien.",
      "Planifica mañana. Gana antes de despertar.",
      "Paz mental es haber cumplido.",
      "No te lleves problemas a la cama.",
      "Mañana es otra oportunidad de guerra.",
      "El sueño construye el músculo y la mente.",
      "Apaga pantallas. Enciende tu recuperación.",
      "Si fallaste hoy, corrígelo mañana.",
      "Duerme con ambición, despierta con propósito.",
      "Silencio. Calma. Recuperación.",
      "Eres lo que haces repetidamente. Descansa.",
      "Prepara tu ropa de mañana. Elimina fricción.",
      "Un buen día empieza la noche anterior.",
      "Vacía tu mente en papel, no en la almohada.",
      "El descanso del guerrero es sagrado.",
      "Respeta tus ciclos de sueño.",
      "Lo hecho, hecho está. Suéltalo.",
      "Recarga la disciplina para mañana.",
      "Mañana será mejor si descansas bien.",
      "El éxito requiere pausa.",
      "Buenas noches. Mañana a por todas."
    ]
  };

  // ---------------- DOM ----------------
  const titleEl = document.getElementById("title");
  const subEl = document.getElementById("subtitle");

  // Nombre por URL: ?name=Gabriel
  const name = getParam("name", "Gabriel");

  let currentQuote = "";

  function renderGreetingNow() {
    const now = new Date();
    const bucket = getBucketByHour(now.getHours());
    const greeting = getGreetingByBucket(bucket);
    titleEl.textContent = `👋 ${greeting}, ${name}`;
    return bucket;
  }

  function setQuote(text) {
    currentQuote = text;
    subEl.textContent = text;
  }

  function rotateQuoteForCurrentBucket() {
    const bucket = renderGreetingNow(); // recalcula saludo y bucket SIEMPRE
    const next = pickRandom(QUOTES[bucket], currentQuote);
    if (!next || next === currentQuote) return;

    subEl.classList.add("is-fading");
    setTimeout(() => {
      setQuote(next);
      subEl.classList.remove("is-fading");
    }, 260);
  }

  // ---------------- INIT ----------------
  const initialBucket = renderGreetingNow();
  setQuote(pickRandom(QUOTES[initialBucket], null));

  // ---------------- Sync reflejo 60s + frase 120s ----------------
  // CSS sheen: 60s
  // Frase: 120s (cada 2 reflejos)
  const SHEEN_PERIOD_MS = 60000;
  const QUOTE_PERIOD_MS = 120000;

  // Ajuste fino: hace que el cambio ocurra cuando el reflejo ya está pasando.
  // Si quieres que cambie un poquito antes o después, toca este número.
  const SHEEN_PASS_DELAY_MS = 2400;

  // Mantiene el saludo correcto aunque cambie la hora sin recargar
  setInterval(renderGreetingNow, 60000);

  // (Opcional) primer reflejo ya va solo por CSS. Aquí solo cambiamos frase sincronizada.
  setInterval(() => {
    setTimeout(rotateQuoteForCurrentBucket, SHEEN_PASS_DELAY_MS);
  }, QUOTE_PERIOD_MS);
})();
