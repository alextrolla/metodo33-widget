document.addEventListener("DOMContentLoaded", () => {
    // 1. Data Pools (30 phrases each)
    const quotes = {
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

    // 2. Helper Functions
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // 3. Logic Execution
    const now = new Date();
    const hour = now.getHours();
    
    // Variables for logic
    let timeGreeting = "";
    let quotePool = [];
    
    // Time Logic (Strict Ranges)
    // 05:00 - 11:59 -> Buenos días
    // 12:00 - 19:59 -> Buenas tardes
    // 20:00 - 04:59 -> Buenas noches
    
    if (hour >= 5 && hour < 12) {
        timeGreeting = "Buenos días";
        quotePool = quotes.morning;
    } else if (hour >= 12 && hour < 20) {
        timeGreeting = "Buenas tardes";
        quotePool = quotes.afternoon;
    } else {
        timeGreeting = "Buenas noches";
        quotePool = quotes.night;
    }

    // 4. Personalization
    const userName = getUrlParameter('name') || "tío";
    const dayParam = getUrlParameter('day');

    // 5. DOM Updates
    const greetingEl = document.getElementById('greeting-text');
    const quoteEl = document.getElementById('quote-text');
    const dayEl = document.getElementById('day-counter');

    // Set Greeting
    greetingEl.innerText = `👋 ${timeGreeting}, ${userName}`;

    // Set Quote
    quoteEl.innerText = getRandomItem(quotePool);

    // Set Day (if exists)
    if (dayParam) {
        // Ensure it's a clean number (basic sanitization)
        const dayNum = parseInt(dayParam, 10);
        if (!isNaN(dayNum)) {
            dayEl.innerText = `Día ${dayNum}`;
            dayEl.classList.remove('hidden');
        }
    }
});
