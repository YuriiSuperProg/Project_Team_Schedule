// ============================================================
//  ЛИЧНЫЙ КАБИНЕТ + SVG-ПЕРСОНАЖИ + ДОСТИЖЕНИЯ + ПАСХАЛКИ
// ============================================================

// --- 1. SVG-РИСУНКИ ПЕРСОНАЖЕЙ ---

function getMikeSVG() {
  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="65" rx="38" ry="30" fill="#7CD44A" stroke="#2F9C66" stroke-width="2"/>
      <path d="M 18 45 Q 10 25 22 15 Q 28 30 30 45" fill="#7CD44A" stroke="#2F9C66" stroke-width="2"/>
      <path d="M 82 45 Q 90 25 78 15 Q 72 30 70 45" fill="#7CD44A" stroke="#2F9C66" stroke-width="2"/>
      <circle cx="50" cy="52" r="24" fill="#FFFFFF" stroke="#2F9C66" stroke-width="2"/>
      <circle cx="50" cy="52" r="14" fill="#3EB1E8"/>
      <circle cx="50" cy="52" r="7" fill="#0F172A"/>
      <circle cx="47" cy="49" r="2.5" fill="#FFFFFF"/>
      <path d="M 30 75 Q 50 88 70 75" stroke="#0F172A" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>
  `;
}

function getSullySVG() {
  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 15 35 Q 5 15 20 10 Q 25 20 25 35" fill="#4C9AFF" stroke="#2b6fbb" stroke-width="2"/>
      <path d="M 85 35 Q 95 15 80 10 Q 75 20 75 35" fill="#4C9AFF" stroke="#2b6fbb" stroke-width="2"/>
      <ellipse cx="50" cy="60" rx="42" ry="35" fill="#4C9AFF" stroke="#2b6fbb" stroke-width="2"/>
      <ellipse cx="25" cy="50" rx="8" ry="10" fill="#8A2BE2" opacity="0.6"/>
      <ellipse cx="75" cy="55" rx="7" ry="9" fill="#8A2BE2" opacity="0.6"/>
      <ellipse cx="35" cy="80" rx="6" ry="5" fill="#8A2BE2" opacity="0.6"/>
      <ellipse cx="65" cy="82" rx="8" ry="6" fill="#8A2BE2" opacity="0.6"/>
      <ellipse cx="50" cy="30" rx="5" ry="4" fill="#8A2BE2" opacity="0.6"/>
      <ellipse cx="50" cy="60" rx="30" ry="22" fill="#6BB5FF" />
      <circle cx="38" cy="55" r="10" fill="#FFFFFF" stroke="#2b6fbb" stroke-width="1.5"/>
      <circle cx="62" cy="55" r="10" fill="#FFFFFF" stroke="#2b6fbb" stroke-width="1.5"/>
      <circle cx="38" cy="55" r="5" fill="#0F172A"/>
      <circle cx="62" cy="55" r="5" fill="#0F172A"/>
      <circle cx="36" cy="53" r="1.5" fill="#FFFFFF"/>
      <circle cx="60" cy="53" r="1.5" fill="#FFFFFF"/>
      <path d="M 38 72 Q 50 82 62 72" stroke="#0F172A" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M 42 40 L 45 48" stroke="#2b6fbb" stroke-width="2" stroke-linecap="round"/>
      <path d="M 58 40 L 55 48" stroke="#2b6fbb" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
}

function getMinionSVG() {
  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="15" width="50" height="75" rx="25" fill="#FFD700" stroke="#DAA520" stroke-width="2"/>
      <path d="M 45 15 Q 45 5 50 5 Q 55 5 55 15" fill="#0F172A"/>
      <path d="M 32 55 L 32 75" stroke="#1769E0" stroke-width="6" stroke-linecap="round"/>
      <path d="M 68 55 L 68 75" stroke="#1769E0" stroke-width="6" stroke-linecap="round"/>
      <path d="M 25 65 L 75 65 L 75 90 L 25 90 Z" fill="#4C9AFF" stroke="#1769E0" stroke-width="2"/>
      <rect x="20" y="35" width="60" height="25" rx="8" fill="#888" stroke="#333" stroke-width="2"/>
      <circle cx="37" cy="47" r="10" fill="#FFFFFF" stroke="#333" stroke-width="2"/>
      <circle cx="63" cy="47" r="10" fill="#FFFFFF" stroke="#333" stroke-width="2"/>
      <circle cx="37" cy="47" r="4" fill="#0F172A"/>
      <circle cx="63" cy="47" r="4" fill="#0F172A"/>
      <circle cx="36" cy="46" r="1.5" fill="#FFFFFF"/>
      <circle cx="62" cy="46" r="1.5" fill="#FFFFFF"/>
      <path d="M 42 82 Q 50 88 58 82" stroke="#0F172A" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    </svg>
  `;
}

function getSpongeBobSVG() {
  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="15" width="60" height="55" rx="6" fill="#FFE600" stroke="#D4B300" stroke-width="2"/>
      <circle cx="30" cy="30" r="2" fill="#E6CF00" opacity="0.5"/>
      <circle cx="70" cy="25" r="2" fill="#E6CF00" opacity="0.5"/>
      <circle cx="25" cy="55" r="2" fill="#E6CF00" opacity="0.5"/>
      <circle cx="75" cy="50" r="2" fill="#E6CF00" opacity="0.5"/>
      <path d="M 20 50 L 13 55 L 13 72" stroke="#0F172A" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 80 50 L 87 55 L 87 72" stroke="#0F172A" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="20" y="63" width="60" height="10" fill="#FFFFFF" stroke="#D4B300" stroke-width="1"/>
      <polygon points="50,63 45,73 55,73" fill="#FF0000" stroke="#CC0000" stroke-width="1"/>
      <rect x="20" y="73" width="60" height="12" fill="#8B4513" stroke="#5C2E0B" stroke-width="1"/>
      <rect x="20" y="73" width="60" height="3" fill="#0F172A"/>
      <circle cx="36" cy="42" r="13" fill="#FFFFFF" stroke="#0F172A" stroke-width="2"/>
      <circle cx="64" cy="42" r="13" fill="#FFFFFF" stroke="#0F172A" stroke-width="2"/>
      <circle cx="36" cy="42" r="6" fill="#00BFFF"/>
      <circle cx="64" cy="42" r="6" fill="#00BFFF"/>
      <circle cx="36" cy="42" r="2.5" fill="#0F172A"/>
      <circle cx="64" cy="42" r="2.5" fill="#0F172A"/>
      <circle cx="34" cy="40" r="1.5" fill="#FFFFFF"/>
      <circle cx="62" cy="40" r="1.5" fill="#FFFFFF"/>
      <path d="M 26 30 L 26 34 M 34 27 L 33 31 M 44 28 L 42 32" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M 74 30 L 74 34 M 66 27 L 67 31 M 56 28 L 58 32" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="24" cy="55" r="4" fill="#FF9999" opacity="0.4"/>
      <circle cx="76" cy="55" r="4" fill="#FF9999" opacity="0.4"/>
      <path d="M 35 55 Q 50 65 65 55" stroke="#0F172A" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <rect x="43" y="57" width="5" height="6" fill="#FFFFFF" stroke="#0F172A" stroke-width="1"/>
      <rect x="52" y="57" width="5" height="6" fill="#FFFFFF" stroke="#0F172A" stroke-width="1"/>
      <rect x="32" y="85" width="4" height="10" fill="#0F172A"/>
      <rect x="64" y="85" width="4" height="10" fill="#0F172A"/>
      <ellipse cx="34" cy="95" rx="8" ry="4" fill="#0F172A"/>
      <ellipse cx="66" cy="95" rx="8" ry="4" fill="#0F172A"/>
    </svg>
  `;
}

function getSpiderSVG() {
  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 25 60 Q 10 65 15 80" stroke="#E60000" stroke-width="10" stroke-linecap="round" fill="none"/>
      <path d="M 75 60 Q 90 65 85 80" stroke="#E60000" stroke-width="10" stroke-linecap="round" fill="none"/>
      <path d="M 40 75 Q 35 90 40 100" stroke="#1769E0" stroke-width="12" stroke-linecap="round" fill="none"/>
      <path d="M 60 75 Q 65 90 60 100" stroke="#1769E0" stroke-width="12" stroke-linecap="round" fill="none"/>
      <ellipse cx="50" cy="65" rx="24" ry="20" fill="#1769E0" stroke="#0F172A" stroke-width="2"/>
      <path d="M 30 60 Q 50 50 70 60 Q 70 80 50 82 Q 30 80 30 60 Z" fill="#E60000" stroke="#0F172A" stroke-width="1.5"/>
      <path d="M 50 62 L 50 72 M 45 65 L 55 65 M 44 69 L 56 69" stroke="#0F172A" stroke-width="1.5"/>
      <circle cx="50" cy="67" r="2.5" fill="#0F172A"/>
      <circle cx="50" cy="38" r="30" fill="#E60000" stroke="#0F172A" stroke-width="2.5"/>
      <path d="M 50 8 L 50 68 M 20 38 L 80 38 M 28 16 L 72 60 M 72 16 L 28 60" stroke="#0F172A" stroke-width="0.8" opacity="0.4"/>
      <circle cx="50" cy="38" r="12" stroke="#0F172A" stroke-width="0.8" fill="none" opacity="0.4"/>
      <circle cx="50" cy="38" r="22" stroke="#0F172A" stroke-width="0.8" fill="none" opacity="0.4"/>
      <path d="M 20 35 Q 32 20 45 38 Q 32 45 20 35 Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M 80 35 Q 68 20 55 38 Q 68 45 80 35 Z" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" stroke-linejoin="round"/>
    </svg>
  `;
}

function getVenomSVG() {
  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 40 75 Q 35 90 40 100" stroke="#1A1A1A" stroke-width="12" stroke-linecap="round" fill="none"/>
      <path d="M 60 75 Q 65 90 60 100" stroke="#1A1A1A" stroke-width="12" stroke-linecap="round" fill="none"/>
      <path d="M 25 60 Q 10 65 15 80" stroke="#1A1A1A" stroke-width="10" stroke-linecap="round" fill="none"/>
      <path d="M 75 60 Q 90 65 85 80" stroke="#1A1A1A" stroke-width="10" stroke-linecap="round" fill="none"/>
      <ellipse cx="50" cy="65" rx="24" ry="20" fill="#1A1A1A" stroke="#000" stroke-width="2"/>
      <path d="M 50 55 L 50 75 M 42 60 L 58 60 M 40 65 L 60 65 M 38 70 L 62 70" stroke="#FFFFFF" stroke-width="2"/>
      <circle cx="50" cy="65" r="4" fill="#FFFFFF"/>
      <circle cx="50" cy="38" r="30" fill="#1A1A1A" stroke="#000" stroke-width="2.5"/>
      <path d="M 22 30 Q 35 15 45 40 Q 32 50 22 30 Z" fill="#FFFFFF" stroke="#000" stroke-width="2" stroke-linejoin="round"/>
      <path d="M 78 30 Q 65 15 55 40 Q 68 50 78 30 Z" fill="#FFFFFF" stroke="#000" stroke-width="2" stroke-linejoin="round"/>
      <path d="M 30 55 Q 50 70 70 55" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/>
      <polygon points="35,55 38,62 41,55" fill="#FFFFFF" stroke="#000" stroke-width="0.5"/>
      <polygon points="42,57 45,65 48,57" fill="#FFFFFF" stroke="#000" stroke-width="0.5"/>
      <polygon points="52,57 55,65 58,57" fill="#FFFFFF" stroke="#000" stroke-width="0.5"/>
      <polygon points="59,55 62,62 65,55" fill="#FFFFFF" stroke="#000" stroke-width="0.5"/>
      <path d="M 45 66 Q 50 80 55 66" fill="#FF0000" stroke="#990000" stroke-width="1"/>
    </svg>
  `;
}

function getHulkSVG() {
  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 35 75 Q 30 90 35 100" stroke="#5DBA52" stroke-width="16" stroke-linecap="round" fill="none"/>
      <path d="M 65 75 Q 70 90 65 100" stroke="#5DBA52" stroke-width="16" stroke-linecap="round" fill="none"/>
      <path d="M 28 70 L 72 70 L 75 85 L 60 80 L 50 85 L 40 80 L 25 85 Z" fill="#6A2C91" stroke="#4B0082" stroke-width="1.5"/>
      <path d="M 20 45 Q 50 35 80 45 L 75 75 Q 50 80 25 75 Z" fill="#5DBA52" stroke="#2E7D32" stroke-width="2"/>
      <path d="M 50 40 L 50 70 M 30 55 L 70 55" stroke="#2E7D32" stroke-width="1.5" fill="none" opacity="0.3"/>
      <path d="M 20 50 Q 5 55 10 75" stroke="#5DBA52" stroke-width="14" stroke-linecap="round" fill="none"/>
      <circle cx="10" cy="75" r="10" fill="#5DBA52" stroke="#2E7D32" stroke-width="2"/>
      <path d="M 80 50 Q 95 55 90 75" stroke="#5DBA52" stroke-width="14" stroke-linecap="round" fill="none"/>
      <circle cx="90" cy="75" r="10" fill="#5DBA52" stroke="#2E7D32" stroke-width="2"/>
      <circle cx="50" cy="30" r="22" fill="#5DBA52" stroke="#2E7D32" stroke-width="2"/>
      <path d="M 28 22 Q 30 5 50 8 Q 70 5 72 22 Q 65 15 50 18 Q 35 15 28 22 Z" fill="#0F172A"/>
      <circle cx="40" cy="32" r="3" fill="#0F172A"/>
      <circle cx="60" cy="32" r="3" fill="#0F172A"/>
      <path d="M 32 28 L 45 30 M 68 28 L 55 30" stroke="#0F172A" stroke-width="2" stroke-linecap="round"/>
      <path d="M 38 42 Q 50 48 62 42" stroke="#0F172A" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M 40 42 L 45 46 L 50 42 L 55 46 L 60 42" fill="#FFFFFF" stroke="#0F172A" stroke-width="1"/>
    </svg>
  `;
}

function getAvatarSVG(id) {
  if (id === "mike") return getMikeSVG();
  if (id === "sully") return getSullySVG();
  if (id === "minion") return getMinionSVG();
  if (id === "spongebob") return getSpongeBobSVG();
  if (id === "spider") return getSpiderSVG();
  if (id === "venom") return getVenomSVG();
  if (id === "hulk") return getHulkSVG();
  return null;
}

// ============================================================
//  2. ЛОГИКА ПРОФИЛЯ
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const profileOverlay = document.getElementById("profileModal");
  const closeBtn = document.getElementById("profileCloseBtn");
  const openProfileBtns = document.querySelectorAll(".open-profile-btn");
  
  const elName = document.getElementById("profileName");
  const elGroup = document.getElementById("profileGroup");
  const elSpec = document.getElementById("profileSpec");
  const elLevel = document.getElementById("profileLevel");
  const elXpBar = document.getElementById("profileXpBar");
  const elXpText = document.getElementById("profileXpText");
  const elAvatar = document.getElementById("profileAvatar");

  const tabs = document.querySelectorAll(".profile-tab");
  const panes = document.querySelectorAll(".profile-pane");

  // Открытие / Закрытие профиля
  if (profileOverlay) {
    openProfileBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        updateProfileData();
        renderAchievements();
        renderStats();
        unlockAchievement("profileOpened");
        profileOverlay.classList.add("open");
        // Сова НЕ уезжает при открытии профиля
      });
    });

    const closeProfile = () => {
      profileOverlay.classList.remove("open");
      document.body.classList.remove("modal-open"); // Сова возвращается при закрытии
    };

    if (closeBtn) closeBtn.addEventListener("click", closeProfile);
    profileOverlay.addEventListener("click", (e) => {
      if (e.target === profileOverlay) closeProfile();
    });
  }

  // Переключение вкладок
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      panes.forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("pane-" + tab.dataset.tab).classList.add("active");
      
      // Сова переезжает в правый угол ТОЛЬКО на вкладке "Секреты"
      if (tab.dataset.tab === "secrets") {
        document.body.classList.add("modal-open");
      } else {
        document.body.classList.remove("modal-open");
      }

      if (tab.dataset.tab === "achievements") {
        unlockAchievement("achViewer");
      }
    });
  });

  // Обновление данных профиля
  function updateProfileData() {
    const name = localStorage.getItem("userName") || "Студент";
    const savedGroupRaw = localStorage.getItem("savedGroup");
    let group = "Не выбрана";
    let spec = "—";
    
    if (savedGroupRaw) {
      try {
        const g = JSON.parse(savedGroupRaw);
        group = g.group || "Не выбрана";
        spec = g.spec || "—";
      } catch (e) {}
    }

    let visits = parseInt(localStorage.getItem("visitCount") || "0", 10);
    if (!sessionStorage.getItem("sessionCounted")) {
      visits++;
      localStorage.setItem("visitCount", visits);
      sessionStorage.setItem("sessionCounted", "true");
    }
    
    const level = Math.floor(visits / 5) + 1;
    const xpInLevel = (visits % 5) * 20;

    if (elName) elName.textContent = name;
    if (elGroup) elGroup.textContent = group;
    if (elSpec) elSpec.textContent = spec;
    if (elLevel) elLevel.textContent = `LVL ${level}`;
    if (elXpBar) elXpBar.style.width = `${xpInLevel}%`;
    if (elXpText) elXpText.textContent = `${xpInLevel} / 100 XP`;

    if (elAvatar) {
      const savedAvatar = localStorage.getItem("userAvatar") || "🎓";
      const svg = getAvatarSVG(savedAvatar);
      
      if (svg) {
        elAvatar.innerHTML = svg;
      } else {
        elAvatar.textContent = savedAvatar;
      }
    }
    
    const settingsName = document.getElementById("settingsName");
    if (settingsName) settingsName.value = name;
    renderAvatarPicker();
  }

  // Достижения
  const ACHIEVEMENTS = [
    // --- Обычные ---
    { id: "firstStep", icon: "🐣", title: "Первый шаг", desc: "Выбрана первая группа" },
    { id: "explorer", icon: "🔭", title: "Исследователь", desc: "Все специальности изучены" },
    { id: "earlyBird", icon: "🌅", title: "Ранняя пташка", desc: "Заход до 08:00" },
    { id: "nightOwl", icon: "🦉", title: "Полуночник", desc: "Заход после 23:00" },
    { id: "loyal", icon: "🔥", title: "Постоянный гость", desc: "3 дня подряд" },
    { id: "weekend", icon: "🎉", title: "Трудяга", desc: "Заход в выходной день" },
    { id: "themeSwitcher", icon: "🌓", title: "Хамелеон", desc: "Сменил тему оформления" },
    { id: "profileOpened", icon: "👤", title: "Это я!", desc: "Открыл свой профиль" },
    { id: "achViewer", icon: "🏆", title: "Коллекционер", desc: "Открыл вкладку достижений" },
    { id: "avatarChanged", icon: "🎨", title: "Стиляга", desc: "Сменил аватарку" },
    { id: "nameChanged", icon: "📝", title: "Как меня зовут?", desc: "Изменил своё имя" },
    { id: "tomorrowViewed", icon: "🔮", title: "Ванга", desc: "Посмотрел расписание на завтра" },
    { id: "weekShift", icon: "🗓", title: "Путешественник", desc: "Переключил неделю" },
    { id: "dateSearch", icon: "🔍", title: "Детектив", desc: "Нашёл день через поиск" },
    { id: "bellSchedule", icon: "🔔", title: "Звонок", desc: "Посмотрел расписание звонков" },
    { id: "consoleOpen", icon: "🕵️", title: "Хакер", desc: "Открыл секретную консоль" },
    { id: "logoSpinner", icon: "💫", title: "Круть", desc: "Закрутил логотип" },

    // --- Секретные ---
    { 
      id: "handshake_dev", 
      icon: "🤝", 
      title: "Рукопожатие", 
      desc: "Пожми руку разработчику (Юрию) и спроси секретный код.",
      secret: true 
    },
    { 
      id: "beta_tester", 
      icon: "🧪", 
      title: "Бета-тестер", 
      desc: "Найди баг на сайте и сообщи о нем. Разработчик даст код.",
      secret: true 
    },
    { 
      id: "inspirer", 
      icon: "💡", 
      title: "Вдохновитель", 
      desc: "Предложи идею, которую добавят на сайт. Получи код.",
      secret: true 
    },
    { 
      id: "admin", 
      icon: "👑", 
      title: "Админ", 
      desc: "Секретный доступ только для избранных.",
      secret: true 
    },
    // --- ЛЕГЕНДАРНОЕ ---
    { 
      id: "legend_isp241", 
      icon: "🏆", 
      title: "Легенда ИСП-241", 
      desc: "Выдаётся лично разработчиком за особые заслуги перед группой.",
      secret: true,
      legendary: true
    }
  ];

  // Секретные коды
  const SECRET_CODES = {
    "HANDSHAKE_DEV_YURIY": "handshake_dev",
    "I_FOUND_A_BUG": "beta_tester",
    "COOL_IDEA_2026": "inspirer",
    "SUPER_ADMIN": "admin",
    "LEGEND_241": "legend_isp241"
  };

  function getUnlocked() {
    try { return JSON.parse(localStorage.getItem("achievements") || "[]"); } catch { return []; }
  }

  function unlockAchievement(id) {
    const unlocked = getUnlocked();
    if (unlocked.includes(id)) return;
    unlocked.push(id);
    localStorage.setItem("achievements", JSON.stringify(unlocked));
    const ach = ACHIEVEMENTS.find(a => a.id === id);
    if (ach) showToast(`🏆 Достижение: ${ach.title}!`);
    if (id === "consoleOpen") {
      console.log("%c🕵️ Секретное сообщение!", "color: #1769E0; font-size: 16px; font-weight: bold;");
      console.log("%cТы нашел пасхалку! Держи достижение 'Хакер'.", "color: #94A3B8; font-size: 14px;");
    }
  }

  // Делаем функцию глобальной
  window.unlockAchievement = unlockAchievement;

  function renderAchievements() {
    const grid = document.getElementById("achGrid");
    if (!grid) return;
    
    const unlocked = getUnlocked();
    grid.innerHTML = "";
    
    ACHIEVEMENTS.forEach(ach => {
      const isUnlocked = unlocked.includes(ach.id);
      const el = document.createElement("div");
      
      let classes = "ach-item";
      if (isUnlocked) classes += " unlocked";
      if (ach.legendary) classes += " ach-item-legendary";
      
      el.className = classes;
      
      el.innerHTML = `
        <div class="ach-icon">${isUnlocked ? ach.icon : "🔒"}</div>
        <div class="ach-info">
          <h4>${ach.title}</h4>
          <p>${ach.desc}</p>
        </div>
      `;
      grid.appendChild(el);
    });
  }

  // Логика ввода секретного кода
  const saveSecretBtn = document.getElementById("saveSecretBtn");
  const secretCodeInput = document.getElementById("secretCodeInput");

  if (saveSecretBtn && secretCodeInput) {
    saveSecretBtn.addEventListener("click", () => {
      const code = secretCodeInput.value.trim().toUpperCase();
      
      if (SECRET_CODES[code]) {
        const achId = SECRET_CODES[code];
        unlockAchievement(achId);
        
        showToast(`🤫 Секретный код активирован!`);
        secretCodeInput.value = "";
        
        const achTab = document.querySelector('.profile-tab[data-tab="achievements"]');
        if (achTab) achTab.click();
      } else {
        secretCodeInput.style.borderColor = "#ef4444";
        secretCodeInput.value = "";
        secretCodeInput.placeholder = "Неверный код!";
        setTimeout(() => {
          secretCodeInput.style.borderColor = "";
          secretCodeInput.placeholder = "НАПРИМЕР: HANDSHAKE";
        }, 2000);
      }
    });
  }

  // Статистика
  function renderStats() {
    const streak = parseInt(localStorage.getItem("visitStreak") || "0", 10);
    const visits = parseInt(localStorage.getItem("visitCount") || "0", 10);
    let visitedSpecs = [];
    try { visitedSpecs = JSON.parse(localStorage.getItem("visitedSpecs") || "[]"); } catch {}

    const sStreak = document.getElementById("statStreak");
    const sVisits = document.getElementById("statVisits");
    const sSpecs = document.getElementById("statSpecs");

    if (sStreak) sStreak.textContent = streak;
    if (sVisits) sVisits.textContent = visits;
    if (sSpecs) sSpecs.textContent = visitedSpecs.length;
  }

  // Настройки (Имя) — С ПРОВЕРКОЙ
  const saveNameBtn = document.getElementById("saveNameBtn");
  if (saveNameBtn) {
    saveNameBtn.addEventListener("click", () => {
      const raw = document.getElementById("settingsName").value;
      
      // Используем validateName из schedule.js (глобальная функция)
      const name = validateName(raw);
      
      if (!name) {
        showToast("❌ Имя должно быть от 2 до 20 букв.");
        return;
      }
      
      localStorage.setItem("userName", name);
      unlockAchievement("nameChanged");
      updateProfileData();
      const greetName = document.getElementById("userName");
      if (greetName) greetName.textContent = name;
      saveNameBtn.textContent = "Сохранено!";
      setTimeout(() => { saveNameBtn.textContent = "Сохранить"; }, 2000);
    });
  }

  // Выбор аватара
  function renderAvatarPicker() {
    const picker = document.getElementById("avatarPicker");
    if (!picker) return;
    
    const avatars = [
      { id: "🎓", type: "emoji" },
      { id: "mike", type: "svg" },
      { id: "sully", type: "svg" },
      { id: "minion", type: "svg" },
      { id: "spongebob", type: "svg" },
      { id: "spider", type: "svg" },
      { id: "venom", type: "svg" },
      { id: "hulk", type: "svg" },
      { id: "👨‍🎓", type: "emoji" },
      { id: "👩‍🎓", type: "emoji" },
      { id: "🦊", type: "emoji" },
      { id: "🐱", type: "emoji" },
      { id: "🦉", type: "emoji" },
      { id: "🚀", type: "emoji" },
      { id: "😎", type: "emoji" },
      { id: "🧑‍💻", type: "emoji" }
    ];
    const current = localStorage.getItem("userAvatar") || "🎓";
    
    picker.innerHTML = "";
    avatars.forEach(av => {
      const el = document.createElement("div");
      el.className = "avatar-opt";
      if (av.id === current) el.classList.add("selected");
      
      if (av.type === "svg") {
        el.innerHTML = getAvatarSVG(av.id);
      } else {
        el.textContent = av.id;
      }
      
      el.onclick = () => {
        localStorage.setItem("userAvatar", av.id);
        unlockAchievement("avatarChanged");
        renderAvatarPicker();
        updateProfileData();
      };
      picker.appendChild(el);
    });
  }

  // Тосты (уведомления)
  function showToast(text) {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.style.cssText = "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:25000;display:flex;flex-direction:column;gap:10px;pointer-events:none;";
      document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.style.cssText = "background:var(--card);color:var(--text);padding:14px 20px;border-radius:12px;box-shadow:var(--shadow-xl);border-left:4px solid var(--c,var(--blue));font-weight:600;font-size:0.9rem;animation:fadeIn 0.3s ease;";
    toast.textContent = text;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Проверка достижений при загрузке
  function checkAchievementsOnLoad() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    if (localStorage.getItem("savedGroup")) unlockAchievement("firstStep");
    if (hour < 8) unlockAchievement("earlyBird");
    if (hour >= 23) unlockAchievement("nightOwl");
    if (day === 0 || day === 6) unlockAchievement("weekend");
    
    const today = now.toDateString();
    const lastVisit = localStorage.getItem("lastVisitDate");
    let streak = parseInt(localStorage.getItem("visitStreak") || "0", 10);
    
    if (lastVisit !== today) {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      if (lastVisit === yesterday.toDateString()) streak++;
      else streak = 1;
      localStorage.setItem("visitStreak", streak);
      localStorage.setItem("lastVisitDate", today);
    }
    if (streak >= 3) unlockAchievement("loyal");
  }

  // Исследователь
  function trackSpecVisit(spec) {
    let visited = [];
    try { visited = JSON.parse(localStorage.getItem("visitedSpecs") || "[]"); } catch {}
    if (!visited.includes(spec)) {
      visited.push(spec);
      localStorage.setItem("visitedSpecs", JSON.stringify(visited));
    }
    if (visited.length >= 5) {
      unlockAchievement("explorer");
    }
  }

  window.addEventListener("specChanged", (e) => {
    trackSpecVisit(e.detail);
  });

  checkAchievementsOnLoad();

  // ============================================================
  //  3. СОВА (ГЛАЗА)
  // ============================================================
  const owlPupils = document.querySelectorAll(".owl-pupil");

  if (owlPupils.length) {
    document.addEventListener("mousemove", (e) => {
      const owl = document.querySelector(".owl");
      if (!owl) return;
      
      const owlRect = owl.getBoundingClientRect();
      const owlCenterX = owlRect.left + owlRect.width / 2;
      const owlCenterY = owlRect.top + owlRect.height / 2;

      const deltaX = e.clientX - owlCenterX;
      const deltaY = e.clientY - owlCenterY;
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.hypot(deltaX, deltaY), 100);

      const maxOffset = 3;
      const offsetX = Math.cos(angle) * (distance / 100) * maxOffset;
      const offsetY = Math.sin(angle) * (distance / 100) * maxOffset;

      owlPupils.forEach(pupil => {
        pupil.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      });
    });

    if (window.innerWidth < 768) {
      let t = 0;
      setInterval(() => {
        t += 0.1;
        const offsetX = Math.cos(t) * 2;
        const offsetY = Math.sin(t) * 2;
        owlPupils.forEach(pupil => {
          pupil.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
      }, 100);
    }
  }
});

// ============================================================
//  4. ПАСХАЛКИ
// ============================================================

// 1. Секрет в консоли
setTimeout(() => {
  console.log("%c🕵️ Секретное сообщение!", "color: #1769E0; font-size: 16px; font-weight: bold;");
  console.log("%cТы нашел пасхалку! Держи достижение 'Хакер'.", "color: #94A3B8; font-size: 14px;");
  if (typeof window.unlockAchievement === "function") {
    window.unlockAchievement("consoleOpen");
  }
}, 1000);

// 2. Закрути логотип
document.addEventListener("DOMContentLoaded", () => {
  const logo = document.querySelector(".logo");
  if (!logo) return;

  let clickCount = 0;
  let clickTimer = null;

  logo.addEventListener("click", (e) => {
    if (clickCount > 0) e.preventDefault();
    clickCount++;

    if (clickCount >= 5) {
      e.preventDefault();
      logo.style.transition = "transform 1s ease-in-out";
      logo.style.transform = "rotate(720deg)";
      
      const bubble = document.getElementById("mascotBubble");
      if (bubble) {
        bubble.textContent = "Ой, голова кружится! 🌀";
        bubble.classList.add("show");
        setTimeout(() => bubble.classList.remove("show"), 3000);
      }
      
      if (typeof window.unlockAchievement === "function") {
        window.unlockAchievement("logoSpinner");
      }

      setTimeout(() => {
        logo.style.transform = "";
        clickCount = 0;
      }, 1000);
      return;
    }

    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => { clickCount = 0; }, 1000);
  });
});