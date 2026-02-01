(() => {
  // --------- Helpers ----------
  function getParam(name, fallback = "") {
    const url = new URL(window.location.href);
    const v = url.searchParams.get(name);
    return (v && v.trim()) ? v.trim() : fallback;
  }

  function getGreetingByHour(hour) {
    // Ajusta si quieres: mañana 6-12, tarde 12-20, noche 20-6
    if (hour >= 6 && hour < 12) return "Buenos días";
    if (hour >= 12 && hour < 20) return "Buenas tardes";
    return "Buenas noches";
  }

  // --------- Datos (por ahora 1 frase) ----------
  const defaultQuote = "No necesitas ganas: necesitas el siguiente paso.";

  // --------- Render ----------
  const titleEl = document.getElementById("title");
  const subEl = document.getElementById("subtitle");

  // Nombre configurable por URL: ?name=Gabriel
  const name = getParam("name", "Gabriel");

  // Hora local del dispositivo (debe cuadrar en móvil/iPad/PC)
  const now = new Date();
  const hour = now.getHours();
  const greeting = getGreetingByHour(hour);

  // 1 solo emoji, y saludo + nombre
  titleEl.textContent = `👋 ${greeting}, ${name}`;
  subEl.textContent = defaultQuote;
})();
