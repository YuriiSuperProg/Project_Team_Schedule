// ============================================================
//  ЗВЁЗДНОЕ НЕБО (Генератор звёзд)
// ============================================================

(function () {
  const container = document.getElementById("starField");
  if (!container) return;

  const STAR_COUNT = 70; // Количество звёзд

  for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement("div");
    star.className = "star";
    
    // Случайный размер (от 1px до 3px)
    const size = Math.random() * 2 + 1 + "px";
    star.style.width = size;
    star.style.height = size;
    
    // Случайная позиция (от 0 до 100%)
    star.style.top = Math.random() * 100 + "%";
    star.style.left = Math.random() * 100 + "%";
    
    // Случайная задержка и длительность мерцания
    star.style.animationDelay = Math.random() * 5 + "s";
    star.style.animationDuration = (Math.random() * 3 + 2) + "s";
    
    // Случайная базовая яркость
    star.style.opacity = (Math.random() * 0.5 + 0.3).toString();

    container.appendChild(star);
  }
})();