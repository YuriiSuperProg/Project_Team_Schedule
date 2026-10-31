// ============================================================
//  ЛИЧНЫЙ КАБИНЕТ + SVG-ПЕРСОНАЖИ + ДОСТИЖЕНИЯ + ДРУЗЬЯ + ГРУППА + ПАСХАЛКИ
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
        document.body.classList.add("profile-open");
      });
    });

    const closeProfile = () => {
      profileOverlay.classList.remove("open");
      document.body.classList.remove("modal-open");
      document.body.classList.remove("profile-open");
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

    // --- СКРЫВАЕМ ДУБЛЬ СПЕЦИАЛЬНОСТИ ---
    if (elName) elName.textContent = name;
    if (elGroup) elGroup.textContent = group;
    
    if (elSpec) {
      // Если специальность уже есть в названии группы (например, ЮСП-263) или это прочерк
      if (group.includes(spec) || spec === "—") {
        elSpec.style.display = "none"; // Скрываем
      } else {
        elSpec.style.display = "inline"; // Показываем
        elSpec.textContent = spec;
      }
    }

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
    { id: "handshake_dev", icon: "🤝", title: "Рукопожатие", desc: "Пожми руку разработчику (Юрию) и спроси секретный код.", secret: true },
    { id: "beta_tester", icon: "🧪", title: "Бета-тестер", desc: "Найди баг на сайте и сообщи о нем. Разработчик даст код.", secret: true },
    { id: "inspirer", icon: "💡", title: "Вдохновитель", desc: "Предложи идею, которую добавят на сайт. Получи код.", secret: true },
    { id: "admin", icon: "👑", title: "Админ", desc: "Секретный доступ только для избранных.", secret: true },
    { id: "legend_isp241", icon: "🏆", title: "Легенда ИСП-241", desc: "Выдаётся лично разработчиком за особые заслуги перед группой.", secret: true, legendary: true }
  ];

  // ============================================================
  //  СЕКРЕТНЫЕ КОДЫ (ЗАЩИТА ЧЕРЕЗ МАТЕМАТИЧЕСКУЮ ФОРМУЛУ)
  // ============================================================

  // Функция, которая превращает слово в число (наш "хеш")
  function wordToHash(word) {
    if (!word) return 0;
    const clean = word.trim().toUpperCase();
    let sum = 0;
    for (let i = 0; i < clean.length; i++) {
      sum += clean.charCodeAt(i);
    }
    return sum * 7 + clean.length; // Формула: (сумма кодов букв * 7) + длина слова
  }

  // База. Слева — ЧИСЛО (результат формулы), справа — ID достижения.
  const SECRET_HASHES = {
    "2251": "handshake_dev",   // Слово: YURA
    "1992": "beta_tester",     // Слово: BETA
    "2798": "inspirer",        // Слово: SUPER
    "2111": "admin",           // Слово: COOL
    "3023": "legend_isp241"    // Слово: LEGEND
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
      const input = secretCodeInput.value.trim();
      
      if (!input) {
        showToast("⚠️ Введите код.");
        return;
      }
      
      // Считаем хеш от того, что ввёл студент
      const inputHash = wordToHash(input);
      
      // Ищем этот хеш в базе
      if (SECRET_HASHES[String(inputHash)]) {
        const achId = SECRET_HASHES[String(inputHash)];
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

       const saveNameBtn = document.getElementById("saveNameBtn");
  if (saveNameBtn) {
    saveNameBtn.addEventListener("click", () => {
      const input = document.getElementById("settingsName");
      const raw = input.value;
      const result = validateName(raw);
      
      if (!result) {
        input.style.borderColor = "#ef4444";
        showToast("❌ Имя должно быть от 2 до 20 букв, без HTML-тегов и матов.");
        setTimeout(() => { input.style.borderColor = ""; }, 2000);
        return;
      }

      const name = result.value;

      if (result.isRepeat) {
        showToast(`🤖 Да ты циклическая программа! Оставили только "${name}".`);
      }

      if (result.tooLong) {
        const jokes = [
          "😅 Ого, да ты графоман! Мы обрезали имя до 20 символов.",
          "📜 Это имя или глава из «Войны и мира»? Оставили только 20 букв.",
          "✂️ Ножницы судьбы сказали: «Хватит!». Имя обрезано до 20 символов.",
          "🤯 Длинновато будет! Оставили только самое главное.",
          "🤖 Мой процессор чуть не завис. Укоротили до 20 буковок."
        ];
        showToast(jokes[Math.floor(Math.random() * jokes.length)]);
      }

      localStorage.setItem("userName", name);
      unlockAchievement("nameChanged");
      updateProfileData();
      const greetName = document.getElementById("userName");
      if (greetName) greetName.textContent = name;
      if (input) input.value = name;

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
  //  3. ДРУЗЬЯ (СОЗВЕЗДИЕ) И ГРУППА
  // ============================================================
  
  function renderFriendsNetwork() {
    const container = document.getElementById("friendsNetwork");
    if (!container) return;

    let friends = [];
    try {
      friends = JSON.parse(localStorage.getItem("friendsNetwork") || "[]");
    } catch (e) {}

    if (friends.length === 0) {
      container.innerHTML = `
        <div class="friends-empty">
          <div style="font-size: 3rem; margin-bottom: 10px;">🌌</div>
          Твоя сеть пока пуста.<br>
          Нажми «Поделиться», чтобы отправить другу ссылку, или добавь его через ссылку.
        </div>
      `;
      return;
    }

    container.innerHTML = "";
    
    const myAvatar = localStorage.getItem("userAvatar") || "🎓";
    const myName = localStorage.getItem("userName") || "Я";
    const centerNode = document.createElement("div");
    centerNode.className = "friend-node center";
    const mySvg = getAvatarSVG(myAvatar);
    centerNode.innerHTML = mySvg || myAvatar;
    centerNode.title = myName;
    centerNode.style.left = "50%";
    centerNode.style.top = "50%";
    container.appendChild(centerNode);

    const centerX = container.offsetWidth / 2;
    const centerY = container.offsetHeight / 2;
    const radius = 120;

    friends.forEach((friend, index) => {
      const angle = (index / friends.length) * 2 * Math.PI - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const line = document.createElement("div");
      line.className = "friend-line";
      const length = Math.hypot(x - centerX, y - centerY);
      line.style.width = `${length}px`;
      line.style.left = `${centerX}px`;
      line.style.top = `${centerY}px`;
      line.style.transform = `rotate(${angle}rad)`;
      container.appendChild(line);

      const friendNode = document.createElement("div");
      friendNode.className = "friend-node";
      friendNode.style.left = `${x}px`;
      friendNode.style.top = `${y}px`;
      friendNode.title = friend.title || "Друг";
      
      const friendSvg = getAvatarSVG(friend.avatar);
      friendNode.innerHTML = friendSvg || friend.avatar || "❓";
      
      friendNode.onclick = () => {
        if (friend.avatar === "❓") {
          if (confirm(`Удалить ${friend.title} из созвездия?`)) {
            let currentFriends = JSON.parse(localStorage.getItem("friendsNetwork") || "[]");
            currentFriends = currentFriends.filter(f => f.id !== friend.id);
            localStorage.setItem("friendsNetwork", JSON.stringify(currentFriends));
            renderFriendsNetwork();
          }
        } else {
          showToast(`👤 ${friend.title}`);
        }
      };
      
      container.appendChild(friendNode);
    });
  }

  // --- Секретный ключ для подписи (генерируется один раз) ---
  function getSecretKey() {
    let key = localStorage.getItem("friendSecretKey");
    if (!key) {
      key = Math.random().toString(36).slice(2, 10);
      localStorage.setItem("friendSecretKey", key);
    }
    return key;
  }

  // --- Генерация подписи (хеш от имени + аватар + времени + ключа) ---
  function generateSignature(name, avatar, timestamp) {
    const secret = getSecretKey();
    return wordToHash(name + avatar + timestamp + secret);
  }

  // --- Ссылка-приглашение (С ЗАЩИТОЙ 2 МИНУТЫ + 1 РАЗ) ---
  const shareBtn = document.getElementById("shareProfileBtn");
  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      const myName = localStorage.getItem("userName") || "Студент";
      const myAvatar = localStorage.getItem("userAvatar") || "🎓";
      const timestamp = Date.now();
      
      // Генерируем подпись
      const sig = generateSignature(myName, myAvatar, timestamp);
      
      // Генерируем ID (безопасный для русских букв)
      const myId = btoa(encodeURIComponent(myName) + timestamp).slice(0, 10);
      
      const url = `${window.location.origin}${window.location.pathname}#addFriend=true&name=${encodeURIComponent(myName)}&avatar=${encodeURIComponent(myAvatar)}&id=${myId}&t=${timestamp}&sig=${sig}`;
      
      navigator.clipboard.writeText(url).then(() => {
        showToast("🔗 Ссылка скопирована! Она действует 45 секунд и только 1 раз.");
      }).catch(() => {
        prompt("Скопируй ссылку и отправь другу (действует 45 секунд, 1 раз):", url);
      });
    });
  }

  // --- Проверка входящей ссылки (С ЗАЩИТОЙ 2 МИНУТЫ + 1 РАЗ) ---
  function checkInviteLink() {
    const hash = window.location.hash;
    if (hash.startsWith("#addFriend=")) {
      const params = new URLSearchParams(hash.slice(1));
      const name = params.get("name");
      const avatar = params.get("avatar");
      const id = params.get("id");
      const timestamp = parseInt(params.get("t"), 10);
      const sig = parseInt(params.get("sig"), 10);

      // 1. Проверка времени (ссылка живет 2 минуты)
      const fortyFiveSeconds = 45 * 1000;
      if (!timestamp || (Date.now() - timestamp > fortyFiveSeconds)) {
        showToast("⌛ Срок действия этой ссылки истек (больше 45 секунд). Попроси друга создать новую.");
        history.replaceState(null, "", window.location.pathname + window.location.search);
        return;
      }

      // 2. Проверка подписи (не подделана ли ссылка)
      const expectedSig = generateSignature(name, avatar, timestamp);
      if (sig !== expectedSig) {
        showToast("⚠️ Эта ссылка была подделана или повреждена. Добавление отменено.");
        history.replaceState(null, "", window.location.pathname + window.location.search);
        return;
      }

      // 3. Проверка: не использовалась ли ссылка раньше (1 раз)
      const usedLinks = JSON.parse(localStorage.getItem("usedInviteLinks") || "[]");
      if (usedLinks.includes(id)) {
        showToast("🚫 Эта ссылка уже была использована. Попроси друга создать новую.");
        history.replaceState(null, "", window.location.pathname + window.location.search);
        return;
      }

      // 4. Если проверки прошли — добавляем друга
      if (name && id) {
        let friends = [];
        try { friends = JSON.parse(localStorage.getItem("friendsNetwork") || "[]"); } catch(e) {}
        
        if (!friends.some(f => f.id === id)) {
          friends.push({ id: id, avatar: avatar, title: name });
          localStorage.setItem("friendsNetwork", JSON.stringify(friends));
          
          // Помечаем ссылку как использованную
          usedLinks.push(id);
          localStorage.setItem("usedInviteLinks", JSON.stringify(usedLinks));
          
          showToast(`🎉 ${name} добавлен в твоё созвездие!`);
          renderFriendsNetwork();
        } else {
          showToast(`👤 ${name} уже есть в твоём созвездии.`);
        }
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    }
  }
  checkInviteLink();

  // --- ГРУППА ---
  function renderGroupTab() {
    const groupNameDisplay = document.getElementById("groupNameDisplay");
    const groupRankDisplay = document.getElementById("groupRankDisplay");
    const groupScoreBadge = document.getElementById("groupScoreBadge");
    const groupMembersList = document.getElementById("groupMembersList");
    const groupTotem = document.getElementById("groupTotem");

    if (!groupNameDisplay) return;

    let groupData = null;
    try {
      groupData = JSON.parse(localStorage.getItem("savedGroup"));
    } catch (e) {}

    if (!groupData || !groupData.group) {
      groupNameDisplay.textContent = "Группа не выбрана";
      groupRankDisplay.textContent = "Выбери группу в расписании, чтобы участвовать в битве.";
      groupScoreBadge.textContent = "0 XP";
      groupMembersList.innerHTML = `<div style="color: var(--muted); font-size: 0.9rem;">Сначала выбери группу в расписании.</div>`;
      groupTotem.style.opacity = "0.5";
      return;
    }

    const myGroup = groupData.group;
    groupNameDisplay.textContent = myGroup;
    groupTotem.style.opacity = "1";

    let groupScore = parseInt(localStorage.getItem(`groupScore_${myGroup}`) || "0", 10);
    groupScoreBadge.textContent = `${groupScore} XP`;
    groupRankDisplay.textContent = `Твой вклад: ${groupScore} очков. Топ обновляется через QR-дуэли!`;

    let friends = [];
    try {
      friends = JSON.parse(localStorage.getItem("friendsNetwork") || "[]");
    } catch (e) {}

    const groupMates = friends.filter(f => f.group === myGroup);
    groupMembersList.innerHTML = "";
    
    const myAvatar = localStorage.getItem("userAvatar") || "🎓";
    const mySvg = getAvatarSVG(myAvatar);
    const myNode = document.createElement("div");
    myNode.className = "group-member-avatar";
    myNode.style.borderColor = "var(--c, var(--blue))";
    myNode.innerHTML = mySvg || myAvatar;
    myNode.title = "Это ты";
    groupMembersList.appendChild(myNode);

    if (groupMates.length > 0) {
      groupMates.forEach(f => {
        const fNode = document.createElement("div");
        fNode.className = "group-member-avatar";
        const fSvg = getAvatarSVG(f.avatar);
        fNode.innerHTML = fSvg || f.avatar || "❓";
        fNode.title = f.title || "Одногруппник";
        groupMembersList.appendChild(fNode);
      });
    } else {
      for (let i = 0; i < 3; i++) {
        const emptyNode = document.createElement("div");
        emptyNode.className = "group-member-avatar empty";
        emptyNode.innerHTML = "?";
        emptyNode.title = "Пригласи друга в группу";
        groupMembersList.appendChild(emptyNode);
      }
    }
  }

  // --- Обработчики кликов по вкладкам ---
  const friendsTab = document.querySelector('.profile-tab[data-tab="friends"]');
  if (friendsTab) {
    friendsTab.addEventListener("click", () => renderFriendsNetwork());
  }
  const groupTab = document.querySelector('.profile-tab[data-tab="group"]');
  if (groupTab) {
    groupTab.addEventListener("click", () => renderGroupTab());
  }

  // ============================================================
  //  4. СОВА (ГЛАЗА)
  // ============================================================
  const owlPupils = document.querySelectorAll(".falcon-pupil");

  if (owlPupils.length) {
    document.addEventListener("mousemove", (e) => {
      const owl = document.querySelector(".falcon");
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
//  5. ПАСХАЛКИ
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

// ==========================================
// ЛОГИКА ВКЛАДКИ «БИТВА ГРУПП» В ПРОФИЛЕ
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const authView = document.getElementById("battleAuthView");
  const profileView = document.getElementById("battleProfileView");

  function updateBattleView() {
    const user = getCurrentUser();
    if (user) {
      authView.style.display = "none";
      profileView.style.display = "block";
      document.getElementById("gameProfileName").textContent = user.nickname;
      document.getElementById("gameProfileId").textContent = `ID: ${user.id}`;
      document.getElementById("gameProfileGroup").textContent = `Группа: ${user.group}`;
      document.getElementById("gameProfilePoints").textContent = user.season_points || 0;
    } else {
      authView.style.display = "block";
      profileView.style.display = "none";
    }
  }

  // Регистрация
  document.getElementById("gameRegisterBtn")?.addEventListener("click", () => {
    const nick = document.getElementById("gameNickname").value.trim();
    const group = document.getElementById("gameGroup").value;
    const pin = document.getElementById("gamePin").value;

    if (!nick || !pin) return showToast("Заполните все поля");
    if (nick.includes(" ")) return showToast("Никнейм не должен содержать пробелов");

    const res = registerUser(nick, group, pin);
    if (res.success) {
      showToast(`Успех! Ваш ID: ${res.user.id}`);
      updateBattleView();
    } else {
      showToast(res.error);
    }
  });

  // Вход
  document.getElementById("gameLoginBtn")?.addEventListener("click", () => {
    const nick = document.getElementById("gameNickname").value.trim();
    const pin = document.getElementById("gamePin").value;

    if (!nick || !pin) return showToast("Заполните все поля");

    const res = loginUser(nick, pin);
    if (res.success) {
      showToast(`Привет, ${res.user.nickname}!`);
      updateBattleView();
    } else {
      showToast(res.error);
    }
  });

  // Выход
  document.getElementById("gameLogoutBtn")?.addEventListener("click", () => {
    logoutUser();
    updateBattleView();
  });

  // При клике на вкладку "Битва Групп" обновляем данные
  const battleTab = document.querySelector('.profile-tab[data-tab="battle"]');
  if (battleTab) {
    battleTab.addEventListener("click", updateBattleView);
  }
});