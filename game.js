const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const hpText = document.getElementById("hpText");
const scoreText = document.getElementById("scoreText");
const finalScore = document.getElementById("finalScore");
const gameOverScreen = document.getElementById("gameOver");
const startScreen = document.getElementById("startScreen");
const startHint = document.getElementById("startHint");

// --- НАСТРОЙКА CANVAS ---
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// --- ОПРЕДЕЛЕНИЕ УСТРОЙСТВА ---
const isMobile = window.innerWidth <= 768 || window.matchMedia("(pointer: coarse)").matches;
if (isMobile && startHint) {
  startHint.innerHTML = "Води пальцем, чтобы двигаться.<br>Стрельба автоматическая!";
}

// --- ПЕРЕМЕННЫЕ ---
let gameLoop;
let player = { x: 0, y: 0, radius: isMobile ? 18 : 20, speed: 8 };
let bullets = [];
let enemyBullets = [];
let enemies = [];
let particles = [];
let stars = [];
let powerups = [];
let boss = null;
let hp = 100;
let score = 0;
let combo = 1;
let comboTimer = 0;
let shake = 0;
let keys = {};
let shooting = false; 
let lastShot = 0;
let isGameOver = false;
let isPlaying = false;
let spawnInterval;
let bossTimer = 0;
let restTimer = 0;
let touchTarget = null;

// Оружие
const WEAPONS = {
  NORMAL: { name: "Обычное", color: "#fbbf24", cooldown: isMobile ? 200 : 150, spread: 0, count: 1 },
  SPREAD: { name: "Веер", color: "#4C9AFF", cooldown: isMobile ? 300 : 250, spread: 0.3, count: 3 },
  LASER: { name: "Лазер", color: "#ef4444", cooldown: isMobile ? 100 : 80, spread: 0, count: 1 }
};
let currentWeapon = WEAPONS.NORMAL;

// --- УПРАВЛЕНИЕ (Pointer Events) ---
window.addEventListener("keydown", e => {
  if (isMobile) return;
  keys[e.code] = true;
  if (e.code === "Space") { e.preventDefault(); shooting = true; }
});
window.addEventListener("keyup", e => {
  if (isMobile) return;
  keys[e.code] = false;
  if (e.code === "Space") shooting = false;
});

canvas.addEventListener("mousedown", () => { if (!isMobile) shooting = true; });
window.addEventListener("mouseup", () => { if (!isMobile) shooting = false; });

// Универсальное управление указателем (мышь + палец)
canvas.addEventListener("pointerdown", (e) => {
  if (!isMobile || !isPlaying) return;
  e.preventDefault();
  shooting = true;
  touchTarget = { x: e.clientX, y: e.clientY - 60 };
});

canvas.addEventListener("pointermove", (e) => {
  if (!isMobile || !isPlaying) return;
  e.preventDefault();
  if (e.buttons > 0 || e.pointerType === "touch") {
    touchTarget = { x: e.clientX, y: e.clientY - 60 };
  }
});

canvas.addEventListener("pointerup", (e) => {
  if (!isMobile) return;
  e.preventDefault();
  touchTarget = null;
});

canvas.addEventListener("pointercancel", (e) => {
  if (!isMobile) return;
  touchTarget = null;
});

// --- ЗВЁЗДЫ ---
function initStars() {
  stars = [];
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: Math.random() * 4 + 1,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.3
    });
  }
}

// --- СПАВН ВРАГОВ ---
function spawnEnemy() {
  if (isGameOver || boss || restTimer > 0 || !isPlaying) return;
  const types = [
    { name: "Модуль", color: "#ef4444", hp: 1, speed: 3, size: isMobile ? 40 : 45 },
    { name: "Опрос", color: "#f59e0b", hp: 1, speed: 4.5, size: isMobile ? 30 : 35 },
    { name: "Зачёт", color: "#10b981", hp: 1, speed: 3.5, size: isMobile ? 35 : 40 }
  ];
  const type = types[Math.floor(Math.random() * types.length)];
  enemies.push({
    x: Math.random() * (canvas.width - type.size),
    y: -100,
    width: type.size, height: type.size,
    color: type.color, speed: type.speed,
    hp: type.hp, maxHp: type.hp, name: type.name
  });
}

// --- СПАВН БОССА ---
function spawnBoss() {
  if (isGameOver || boss || !isPlaying) return;
  const bossTypes = [
    { name: "Экзамен", color: "#8b5cf6", hp: isMobile ? 15 : 20, size: isMobile ? 80 : 100, speed: isMobile ? 1.2 : 1.5 },
    { name: "Сессия", color: "#ef4444", hp: isMobile ? 25 : 30, size: isMobile ? 100 : 120, speed: isMobile ? 0.8 : 1 }
  ];
  const type = bossTypes[Math.floor(Math.random() * bossTypes.length)];
  boss = {
    x: canvas.width / 2 - type.size / 2,
    y: -type.size - 50,
    width: type.size, height: type.size,
    color: type.color,
    speed: type.speed,
    hp: type.hp, maxHp: type.hp,
    name: type.name,
    attackTimer: 0,
    direction: 1
  };
  enemies = [];
  shake = 20;
}

function spawnEnemyBullet(x, y, angle) {
  enemyBullets.push({
    x: x, y: y,
    vx: Math.cos(angle) * (isMobile ? 4 : 5),
    vy: Math.sin(angle) * (isMobile ? 4 : 5),
    radius: isMobile ? 7 : 8,
    color: "#f59e0b"
  });
}

function dropPowerup(x, y) {
  const types = [
    { type: "heal", icon: "❤️", color: "#ef4444" },
    { type: "spread", icon: "🌀", color: "#4C9AFF" },
    { type: "laser", icon: "🔫", color: "#ef4444" }
  ];
  const type = types[Math.floor(Math.random() * types.length)];
  powerups.push({
    x: x, y: y, size: isMobile ? 28 : 30,
    type: type.type, icon: type.icon, color: type.color,
    speed: 2, life: 600
  });
}

// --- ОТРИСОВКА ---
function drawPlayer() {
  ctx.fillStyle = "rgba(76, 154, 255, 0.15)";
  ctx.beginPath();
  ctx.arc(player.x, player.y + 15, player.radius * 1.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#4C9AFF";
  ctx.beginPath();
  ctx.moveTo(player.x, player.y - player.radius);
  ctx.lineTo(player.x - player.radius, player.y + player.radius);
  ctx.lineTo(player.x, player.y + player.radius / 2);
  ctx.lineTo(player.x + player.radius, player.y + player.radius);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(player.x, player.y - 5, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawBoss() {
  if (!boss) return;
  ctx.fillStyle = boss.color;
  ctx.beginPath();
  ctx.roundRect(boss.x, boss.y, boss.width, boss.height, 20);
  ctx.fill();
  
  ctx.fillStyle = "#fff";
  ctx.font = `${isMobile ? 40 : 60}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("👹", boss.x + boss.width / 2, boss.y + boss.height / 2);
  
  const hpWidth = Math.min(300, canvas.width - 40);
  const hpX = (canvas.width - hpWidth) / 2;
  const hpY = isMobile ? 60 : 50;
  
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.beginPath();
  ctx.roundRect(hpX, hpY, hpWidth, isMobile ? 14 : 20, 10);
  ctx.fill();
  
  ctx.fillStyle = boss.color;
  ctx.beginPath();
  ctx.roundRect(hpX, hpY, hpWidth * Math.max(0, boss.hp / boss.maxHp), isMobile ? 14 : 20, 10);
  ctx.fill();
  
  ctx.fillStyle = "#fff";
  ctx.font = `bold ${isMobile ? 12 : 16}px Inter`;
  ctx.fillText(boss.name, canvas.width / 2, hpY - 8);
}

function drawEnemies() {
  enemies.forEach(e => {
    ctx.fillStyle = e.color;
    ctx.beginPath();
    ctx.roundRect(e.x, e.y, e.width, e.height, 10);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = `${isMobile ? 20 : 24}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("📚", e.x + e.width / 2, e.y + e.height / 2);
  });
}

function drawBullets() {
  ctx.fillStyle = currentWeapon.color;
  ctx.shadowColor = currentWeapon.color;
  ctx.shadowBlur = 10;
  bullets.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, isMobile ? 4 : 5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.shadowBlur = 0;
}

function drawEnemyBullets() {
  ctx.fillStyle = "#f59e0b";
  ctx.shadowColor = "#f59e0b";
  ctx.shadowBlur = 10;
  enemyBullets.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.shadowBlur = 0;
}

function drawPowerups() {
  powerups.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#fff";
    ctx.font = `${isMobile ? 14 : 16}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(p.icon, p.x, p.y);
  });
}

function drawParticles() {
  particles.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life / p.maxLife;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function createExplosion(x, y, color, count = 12) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x: x, y: y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      size: Math.random() * 4 + 2,
      life: 30, maxLife: 30, color: color
    });
  }
}

// --- ЛОГИКА ---
function update() {
  if (isGameOver || !isPlaying) return;

  // Движение
  if (isMobile) {
    if (touchTarget) {
      player.x += (touchTarget.x - player.x) * 0.2;
      player.y += (touchTarget.y - player.y) * 0.2;
    }
  } else {
    if (keys["KeyA"] || keys["ArrowLeft"]) player.x -= player.speed;
    if (keys["KeyD"] || keys["ArrowRight"]) player.x += player.speed;
    if (keys["KeyW"] || keys["ArrowUp"]) player.y -= player.speed;
    if (keys["KeyS"] || keys["ArrowDown"]) player.y += player.speed;
  }

  player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
  player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));

  if (comboTimer > 0) {
    comboTimer--;
    if (comboTimer === 0) combo = 1;
  }

  if (shake > 0) shake *= 0.9;
  if (restTimer > 0) restTimer--;

  // Стрельба
  const now = Date.now();
  if (shooting && now - lastShot > currentWeapon.cooldown) {
    const spread = currentWeapon.spread;
    const count = currentWeapon.count;
    for (let i = 0; i < count; i++) {
      let angle = -Math.PI / 2;
      if (count > 1) angle += (i - (count - 1) / 2) * spread;
      bullets.push({
        x: player.x, y: player.y - player.radius,
        speedX: Math.cos(angle) * (isMobile ? 12 : 15),
        speedY: Math.sin(angle) * (isMobile ? 12 : 15)
      });
    }
    lastShot = now;
  }

  bullets = bullets.filter(b => {
    b.x += b.speedX;
    b.y += b.speedY;
    return b.y > -20 && b.x > -20 && b.x < canvas.width + 20;
  });

  enemyBullets = enemyBullets.filter(b => {
    b.x += b.vx;
    b.y += b.vy;
    const dist = Math.hypot(b.x - player.x, b.y - player.y);
    if (dist < player.radius + b.radius) {
      hp -= 8;
      hpText.textContent = Math.max(0, hp);
      shake = 15;
      createExplosion(b.x, b.y, "#ef4444", 8);
      if (hp <= 0) endGame();
      return false;
    }
    return b.y > -50 && b.y < canvas.height + 50 && b.x > -50 && b.x < canvas.width + 50;
  });

  // Босс
  if (boss) {
    if (boss.y < (isMobile ? 100 : 120)) {
      boss.y += boss.speed;
    } else {
      boss.x += boss.speed * boss.direction;
      if (boss.x <= 0 || boss.x + boss.width >= canvas.width) {
        boss.direction *= -1;
      }
    }

    boss.attackTimer++;
    if (boss.attackTimer > 70) {
      boss.attackTimer = 0;
      for (let i = -2; i <= 2; i++) {
        const angle = Math.PI / 2 + i * 0.3;
        spawnEnemyBullet(boss.x + boss.width / 2, boss.y + boss.height, angle);
      }
    }
  } else {
    if (restTimer <= 0) {
      bossTimer++;
      if (bossTimer > 1200) {
        bossTimer = 0;
        spawnBoss();
      }
    }
  }

  // Враги
  if (!boss) {
    enemies.forEach(e => {
      e.y += e.speed;
      if (
        e.x < player.x + player.radius && e.x + e.width > player.x - player.radius &&
        e.y < player.y + player.radius && e.y + e.height > player.y - player.radius
      ) {
        hp -= 15;
        hpText.textContent = Math.max(0, hp);
        createExplosion(e.x + e.width / 2, e.y + e.height / 2, "#ef4444", 10);
        shake = 15;
        e.y = canvas.height + 200;
        if (hp <= 0) endGame();
      }
    });
  }

  // Столкновения
  bullets.forEach((b, bIndex) => {
    if (boss && b.x > boss.x && b.x < boss.x + boss.width &&
        b.y > boss.y && b.y < boss.y + boss.height) {
      boss.hp--;
      bullets.splice(bIndex, 1);
      if (boss.hp <= 0) {
        createExplosion(boss.x + boss.width / 2, boss.y + boss.height / 2, boss.color, 50);
        shake = 30;
        score += 200;
        scoreText.textContent = score;
        dropPowerup(boss.x + boss.width / 2, boss.y + boss.height / 2);
        boss = null;
        restTimer = 300;
      }
      return;
    }
    
    if (!boss) {
      enemies.forEach((e, eIndex) => {
        if (b.x > e.x && b.x < e.x + e.width &&
            b.y > e.y && b.y < e.y + e.height) {
          e.hp--;
          bullets.splice(bIndex, 1);
          if (e.hp <= 0) {
            createExplosion(e.x + e.width / 2, e.y + e.height / 2, e.color, 20);
            shake = 8;
            enemies.splice(eIndex, 1);
            combo = Math.min(combo + 0.5, 5);
            comboTimer = 120;
            const points = 10 * Math.floor(combo);
            score += points;
            scoreText.textContent = score;
            if (Math.random() < 0.35) {
              dropPowerup(e.x + e.width / 2, e.y + e.height / 2);
            }
          }
        }
      });
    }
  });

  // Бонусы
  powerups = powerups.filter(p => {
    p.y += p.speed;
    p.life--;
    const dist = Math.hypot(p.x - player.x, p.y - player.y);
    if (dist < player.radius + p.size / 2) {
      applyPowerup(p.type);
      createExplosion(p.x, p.y, p.color, 8);
      return false;
    }
    return p.y < canvas.height + 50 && p.life > 0;
  });

  // Частицы
  particles = particles.filter(p => {
    p.x += p.vx; p.y += p.vy;
    p.vx *= 0.95; p.vy *= 0.95;
    p.life--;
    return p.life > 0;
  });

  enemies = enemies.filter(e => e.y < canvas.height + 100);
  
  stars.forEach(s => {
    s.y += s.speed;
    if (s.y > canvas.height) {
      s.y = -10;
      s.x = Math.random() * canvas.width;
    }
  });
}

function applyPowerup(type) {
  if (type === "heal") {
    hp = Math.min(100, hp + 25);
    hpText.textContent = hp;
  } else if (type === "spread") {
    currentWeapon = WEAPONS.SPREAD;
    setTimeout(() => { if (currentWeapon === WEAPONS.SPREAD) currentWeapon = WEAPONS.NORMAL; }, 8000);
  } else if (type === "laser") {
    currentWeapon = WEAPONS.LASER;
    setTimeout(() => { if (currentWeapon === WEAPONS.LASER) currentWeapon = WEAPONS.NORMAL; }, 6000);
  }
}

function draw() {
  ctx.save();
  if (shake > 1) {
    ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
  }

  ctx.fillStyle = "#0B1120";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  stars.forEach(s => {
    ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
  });

  drawParticles();
  drawPowerups();
  drawBullets();
  drawEnemyBullets();
  drawEnemies();
  drawBoss();
  drawPlayer();

  ctx.restore();

  if (combo > 1) {
    ctx.fillStyle = "#FFD700";
    ctx.font = `bold ${isMobile ? 18 : 24}px Inter`;
    ctx.textAlign = "right";
    ctx.fillText(`x${Math.floor(combo)}`, canvas.width - 20, 40);
  }
  
  if (restTimer > 0) {
    ctx.fillStyle = "rgba(16, 185, 129, 0.8)";
    ctx.font = "bold 18px Inter";
    ctx.textAlign = "center";
    ctx.fillText("ОТДЫХ", canvas.width / 2, 100);
  }
}

function loop() {
  update();
  draw();
  if (!isGameOver && isPlaying) {
    gameLoop = requestAnimationFrame(loop);
  }
}

function endGame() {
  isGameOver = true;
  isPlaying = false;
  cancelAnimationFrame(gameLoop);
  clearInterval(spawnInterval);
  finalScore.textContent = score;
  gameOverScreen.classList.add("show");
}

function startGame() {
  startScreen.classList.remove("show");
  gameOverScreen.classList.remove("show");
  
  initStars();
  player = { x: canvas.width / 2, y: canvas.height - (isMobile ? 150 : 100), radius: isMobile ? 18 : 20, speed: 8 };
  bullets = [];
  enemyBullets = [];
  enemies = [];
  particles = [];
  powerups = [];
  boss = null;
  hp = 100;
  score = 0;
  combo = 1;
  comboTimer = 0;
  shake = 0;
  bossTimer = 0;
  restTimer = 0;
  currentWeapon = WEAPONS.NORMAL;
  isGameOver = false;
  isPlaying = true;
  shooting = isMobile; // На мобилке автострельба после старта
  hpText.textContent = hp;
  scoreText.textContent = score;
  
  clearInterval(spawnInterval);
  spawnInterval = setInterval(spawnEnemy, isMobile ? 1400 : 1200);
  
  loop();
}

// Инициализация фона до старта
initStars();
player.x = canvas.width / 2;
player.y = canvas.height - 100;
draw();