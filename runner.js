// ============================================================
//  ЗАЧЁТКА-РАННЕР (DOM-версия, без Canvas)
// ============================================================
function initDomRunner() {
  const wrap = document.getElementById("runnerWrap");
  const track = document.getElementById("runnerTrack");
  const player = document.getElementById("runnerPlayer");
  const startScreen = document.getElementById("runnerStartScreen");
  const gameOverScreen = document.getElementById("runnerGameOverScreen");
  const startBtn = document.getElementById("runnerStartBtn");
  const restartBtn = document.getElementById("runnerRestartBtn");
  const finalScoreEl = document.getElementById("runnerFinalScore");
  const recordEl = document.getElementById("runnerRecord");
  const modeBadge = document.getElementById("gameModeBadge");

  if (!wrap || !track) return;

  let isPlaying = false;
  let score = 0;
  let speed = 3000; // ms
  let spawnInterval = null;
  let gameLoop = null;
  let isHardcore = false;

  // Список препятствий
  const obstacles = ["МОДУЛЬ", "СЕМЕСТР", "ЗАЧЁТ", "ЭКЗАМЕН", "ДЕДЛАЙН", "ЗАДАНИЕ"];

  function checkHardcore() {
    if (typeof state === "undefined" || !state.spec || !state.course || !state.group || !SCHEDULE) return false;
    const todayIndex = (new Date().getDay() + 6) % 7;
    const raw = SCHEDULE[state.spec][state.course][state.group];
    const currentW = WEEK_LIST[state.week].star;
    let pairs = raw[todayIndex] || [];
    pairs = pairs.filter(p => !p.star || p.star === currentW);
    return new Set(pairs.map(p => p.number)).size >= 4;
  }

  function updateUIMode() {
    isHardcore = checkHardcore();
    if (isHardcore) {
      wrap.classList.add("hardcore");
      modeBadge.className = "mode-badge hardcore";
      modeBadge.textContent = "🔥 ХАРДКОР";
    } else {
      wrap.classList.remove("hardcore");
      modeBadge.className = "mode-badge normal";
      modeBadge.textContent = "Обычный";
    }
  }

  function jump() {
    if (!isPlaying) return;
    if (player.classList.contains("jumping")) return;
    player.classList.add("jumping");
    setTimeout(() => player.classList.remove("jumping"), 700);
  }

  function spawnObstacle() {
    if (!isPlaying) return;
    
    // Генерируем препятствие только через БЕЗОПАСНОЕ расстояние
    const ob = document.createElement("div");
    ob.className = "runner-obstacle";
    // Случайный текст из массива
    ob.textContent = obstacles[Math.floor(Math.random() * obstacles.length)];
    
    const duration = speed / 1000;
    ob.style.animationDuration = duration + "s";
    
    track.appendChild(ob);

    // Проверка столкновения
    const checkCollision = setInterval(() => {
      if (!isPlaying) { clearInterval(checkCollision); return; }
      
      const obRect = ob.getBoundingClientRect();
      const playerRect = player.getBoundingClientRect();
      
      // Более точная проверка (с учетом размера зачётки)
      const isOverlapping = 
        obRect.left < playerRect.right - 10 && 
        obRect.right > playerRect.left + 10 &&
        obRect.top < playerRect.bottom - 10 &&
        obRect.bottom > playerRect.top + 10;

      if (isOverlapping) {
        clearInterval(checkCollision);
        return gameOver();
      }

      // Если препятствие улетело — чистим интервал
      if (obRect.right < playerRect.left - 100) {
        clearInterval(checkCollision);
      }
    }, 50);

    setTimeout(() => {
      if (ob.parentNode) ob.parentNode.removeChild(ob);
    }, speed);
  }

  function startGame() {
    updateUIMode();
    startScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    wrap.classList.remove("game-over-flash");
    
    isPlaying = true;
    score = 0;
    speed = isHardcore ? 2000 : 3500; // Даем больше времени на прыжок
    
    track.querySelectorAll(".runner-obstacle").forEach(o => o.remove());

    // Безопасный интервал спавна: первый через 1.5 сек, потом с запасом
    setTimeout(() => {
      if (isPlaying) spawnObstacle();
      
      // Дальше спавним с интервалом
      spawnInterval = setInterval(() => {
        if (isPlaying) spawnObstacle();
      }, isHardcore ? 1800 : 2500);
      
    }, 1000);

    gameLoop = setInterval(() => {
      if (isPlaying) score += isHardcore ? 2 : 1;
    }, 100);
  }

  function gameOver() {
    isPlaying = false;
    clearInterval(spawnInterval);
    clearInterval(gameLoop);
    
    wrap.classList.add("game-over-flash");
    setTimeout(() => wrap.classList.remove("game-over-flash"), 400);

    finalScoreEl.textContent = score;
    gameOverScreen.classList.remove("hidden");

    let best = parseInt(localStorage.getItem("runnerRecord") || "0", 10);
    if (score > best) {
      localStorage.setItem("runnerRecord", score);
      recordEl.textContent = score;
    }
  }

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && isPlaying) { e.preventDefault(); jump(); }
  });
  wrap.addEventListener("pointerdown", (e) => {
    if (isPlaying && !e.target.closest("button")) jump();
  });

  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", startGame);

  updateUIMode();
  recordEl.textContent = (localStorage.getItem("runnerRecord") || "0");
  
  if (typeof state !== "undefined") {
    window.addEventListener("specChanged", updateUIMode);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initDomRunner();
});