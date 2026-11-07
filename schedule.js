let BAD_WORDS = [];
let ALLOWED_NAMES = [];

// Загружаем маты
fetch("bad-words.json")
  .then(res => res.json())
  .then(data => {
    BAD_WORDS = data;
  })
  .catch(() => {
    console.warn("⚠️ Не удалось загрузить bad-words.json.");
  });

// Загружаем словарь имён
fetch("names.json")
  .then(res => res.json())
  .then(data => {
    ALLOWED_NAMES = data;
    console.log("✅ Словарь имён загружен:", ALLOWED_NAMES.length, "имён");
  })
  .catch(() => {
    console.warn("⚠️ Не удалось загрузить names.json. Проверка на реальные имена отключена.");
  });

// Умная проверка (с учетом латиницы и повторов)
function isNameClean(raw) {
  if (!raw || !raw.trim()) return false;
  if (BAD_WORDS.length === 0) return true;
  let clean = raw.trim().replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, "").toLowerCase();
  const map = { "a":"а", "e":"е", "o":"о", "p":"р", "c":"с", "y":"у", "x":"х", "k":"к", "b":"в", "m":"м", "h":"н", "t":"т" };
  clean = clean.split("").map(ch => map[ch] || ch).join("");
  clean = clean.replace(/(.)\1+/g, "$1");
  return !BAD_WORDS.some(word => clean.includes(word));
}


// Основная функция валидации и очистки имени
function validateName(raw) {
  if (!raw || !raw.trim()) return null;
  
  let clean = raw.trim().replace(/[^a-zA-Zа-яА-ЯёЁ\s\-]/g, "");
  clean = clean.replace(/\s+/g, " ").replace(/-+/g, "-").trim();

  if (clean.length < 2) return null;
  
  // 1. Проверка на повторение (ЮрийЮрий -> Юрий)
  const repeatPattern = /^(.{2,})\1+$/; 
  const isRepeat = repeatPattern.test(clean);
  
  if (isRepeat) {
    const baseName = clean.match(/^(.{2,})\1/)[1]; 
    return { value: baseName, tooLong: false, isRepeat: true };
  }

  // 2. Проверка на длину
  if (clean.length > 20) {
    return { value: clean.slice(0, 20), tooLong: true, isRepeat: false };
  }
  
  // 3. Проверка на маты
  if (typeof isNameClean === "function" && !isNameClean(clean)) {
    return null; 
  }

  // 4. Проверка на "читаемость" (наша старая проверка)
  const vowels = (clean.match(/[аеёиоуыэюяaeiouy]/gi) || []).length;
  const vowelRatio = vowels / clean.length;
  const hasLongConsonantRun = /[бвгджзйклмнпрстфхцчшщbcdfghjklmnpqrstvwxz]{5,}/i.test(clean);

  if (vowelRatio < 0.25 || hasLongConsonantRun) {
    return null;
  }

  // 5. Строгая проверка по словарю имён
  const finalName = clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
  const lowerClean = clean.toLowerCase();

  if (ALLOWED_NAMES.length > 0) {
    // Ищем ТОЧНОЕ совпадение (или имя, от которого наше является уменьшительным, длиной до 4 букв)
    const isAllowed = ALLOWED_NAMES.some(n => {
      // Точное совпадение
      if (lowerClean === n) return true;
      // Разрешаем уменьшительные формы (например, "Юра" от "Юрий"), но не длиннее 4 букв
      if (lowerClean.length <= 4 && n.startsWith(lowerClean)) return true;
      return false;
    });

    if (!isAllowed) {
      // Если имени нет в словаре, но оно короткое (2-3 буквы, например "Ян") — разрешаем
      if (clean.length <= 3) {
        return { value: finalName, tooLong: false, isRepeat: false };
      }
      // Иначе — отказ (это абракадабра)
      return null;
    }
  }
  
  // Всё ок
  return { value: finalName, tooLong: false, isRepeat: false };
}

// ============================================================
//  СЕТКА ЗВОНКОВ И ДНИ
// ============================================================
const BELLS = { 1: "08:30–10:00", 2: "10:10–11:40", 3: "12:10–13:40", 4: "13:50–15:20", 5: "15:30–17:00" };
const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const DAY_NAMES = { Пн: "Понедельник", Вт: "Вторник", Ср: "Среда", Чт: "Четверг", Пт: "Пятница", Сб: "Суббота", Вс: "Воскресенье" };
const WISHES = {
  "ЮСП": [
    { emoji: "⚖️", text: "Сегодня отличный день, чтобы всё успеть — даже закон!" },
    { emoji: "📚", text: "Параграфы сами себя не прочитают. Вперёд!" },
    { emoji: "⚖️", text: "Пусть справедливость восторжествует на всех парах!" },
    { emoji: "🧠", text: "Знания — твоя лучшая защита." },
    { emoji: "🕊️", text: "Спокойствие и только спокойствие." }
  ],
  "ИСП": [
    { emoji: "💻", text: "Пусть код компилируется, а жизнь — радует!" },
    { emoji: "🐛", text: "Желаю тебе найти все баги до того, как их найдёт преподаватель." },
    { emoji: "☕️", text: "Кофе — это топливо для программиста. Не забудь заправиться!" },
    { emoji: "🚀", text: "Пусть твой проект летит в продакшн без падений!" },
    { emoji: "🧠", text: "Каждая решённая задача делает тебя сильнее." }
  ],
  "РУПО": [
    { emoji: "💻", text: "Программирование — это магия, и ты — волшебник!" },
    { emoji: "⚙️", text: "Главное — чтобы всё работало. А как — мы придумаем по ходу." },
    { emoji: "📈", text: "Расти над собой каждый день, даже если это сложно." },
    { emoji: "⌨️", text: "Пусть пальцы летают по клавишам, а ошибки обходят стороной." },
    { emoji: "🎯", text: "Сфокусируйся на главном — и всё получится!" }
  ],
  "ЗСП": [
    { emoji: "🌱", text: "Расти, как цветок под солнцем — ярко и смело!" },
    { emoji: "🌍", text: "Береги природу, а она сбережёт тебя!" },
    { emoji: "🍃", text: "Вдохни свежий воздух и начни день с улыбки." },
    { emoji: "☀️", text: "Пусть солнце светит даже в самые пасмурные дни." },
    { emoji: "🌿", text: "Гармония внутри и снаружи — вот твой путь." }
  ],
  "ЭСП": [
    { emoji: "📈", text: "Пусть твой личностный рост всегда идёт вверх!" },
    { emoji: "💰", text: "Экономика — это искусство возможного. Делай невозможное!" },
    { emoji: "📊", text: "Пусть графики только растут, а убытки обходят стороной." },
    { emoji: "🧮", text: "Считай правильно, живи красиво." },
    { emoji: "🤝", text: "Связи решают всё. Не забывай общаться!" }
  ]
};

let SCHEDULE = {};
let state = { institution: localStorage.getItem("institution") === "institute" ? "institute" : "college", spec: null, course: null, group: null, subgroup: null, week: 0, mode: "student", viewTeacher: false, teacher: null };
const $ = id => document.getElementById(id);

function toMin(t) { const [h, m] = t.split(":").map(Number); return h * 60 + m; }
function fmtLeft(min) { const h = Math.floor(min / 60); const m = min % 60; return h ? `${h} ч ${m} мин` : `${m} мин`; }

function initTheme() {
  if (localStorage.getItem("theme") === "dark") document.documentElement.classList.add("dark");
  updateThemeIcon();
}
function updateThemeIcon() {
  const menuIcon = document.getElementById("themeIcon");
  if (menuIcon) menuIcon.textContent = document.documentElement.classList.contains("dark") ? "☀️" : "🌑";
}
function toggleTheme() {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
  updateThemeIcon();
  if (window.unlockAchievement) window.unlockAchievement("themeSwitcher");
}

function applyName() {
  const saved = localStorage.getItem("userName") || "";
  const el = document.getElementById("userName");
  if (el) el.textContent = saved || "друг";
}

// ============================================================
//  ИЗМЕНЕНИЕ ИМЕНИ
// ============================================================
function openNameModal() {
  const modal = document.getElementById("nameModal");
  const input = document.getElementById("nameModalInput");
  const saveBtn = document.getElementById("nameModalSave");
  const cancelBtn = document.getElementById("nameModalCancel");

  if (!modal || !input || !saveBtn || !cancelBtn) {
    console.error("ОШИБКА: Элементы модалки #nameModal не найдены в HTML!");
    return;
  }

  input.value = localStorage.getItem("userName") || "";
  input.style.borderColor = "";
  input.placeholder = "Введи имя...";
  
  modal.classList.add("open");
  setTimeout(() => input.focus(), 100);

  saveBtn.onclick = () => {
    const raw = input.value.trim();
    const result = validateName(raw);
    
    if (!result) {
      input.style.borderColor = "#ef4444";
      input.placeholder = "Только буквы (2-20 символов)";
      setTimeout(() => {
        input.style.borderColor = "";
        input.placeholder = "Введи имя...";
      }, 2000);
      return;
    }

    // Берем строку из объекта
    const name = result.value;

    // Уведомление про повторение (ЮрийЮрий)
    if (result.isRepeat) {
      if (window.showGlobalToast) window.showGlobalToast(`🤖 Да ты циклическая программа! Оставили только "${name}".`);
    }

    // Шутка про длинное имя
    if (result.tooLong) {
      const jokes = [
        "😅 Ого, да ты графоман! Мы обрезали имя до 20 символов.",
        "📜 Это имя или глава из «Войны и мира»? Оставили только 20 букв.",
        "✂️ Ножницы судьбы сказали: «Хватит!». Имя обрезано до 20 символов.",
        "🤯 Длинновато будет! Оставили только самое главное.",
        "🤖 Мой процессор чуть не завис. Укоротили до 20 буковок."
      ];
      const joke = jokes[Math.floor(Math.random() * jokes.length)];
      if (window.showGlobalToast) window.showGlobalToast(joke);
    }

    // СОХРАНЯЕМ СТРОКУ
    localStorage.setItem("userName", name);
    applyName();
    if (window.unlockAchievement) window.unlockAchievement("nameChanged");
    modal.classList.remove("open");
  };

  cancelBtn.onclick = () => modal.classList.remove("open");
  modal.onclick = (e) => { if (e.target === modal) modal.classList.remove("open"); };
  input.onkeydown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); saveBtn.click(); }
    if (e.key === "Escape") { modal.classList.remove("open"); }
  };
}

function askName() { openNameModal(); }

let lastWishIndex = {};
function showRandomWish(force = false) {
  if (state.viewTeacher) return;
  const wrap = $("wish"), emojiEl = $("wishEmoji"), textEl = $("wishText");
  if (!wrap || !emojiEl || !textEl) return;
  
  const spec = state.spec || "ИСП";
  const list = WISHES[spec] || WISHES["ИСП"];
  if (!list || !list.length) return;
  
  const now = Date.now();
  const storageKey = `wishLastChange_${spec}`;
  const lastChange = parseInt(localStorage.getItem(storageKey) || "0", 10);
  
  // Если прошло меньше 30 мин И это не принудительное обновление (кнопка) — не меняем
  if (!force && (now - lastChange < 0.5 * 60 * 60 * 1000)) return;
  
  localStorage.setItem(storageKey, now.toString());
  
  if (lastWishIndex[spec] === undefined) lastWishIndex[spec] = -1;
  
  let i;
  do { i = Math.floor(Math.random() * list.length); } while (i === lastWishIndex[spec] && list.length > 1);
  
  lastWishIndex[spec] = i;
  emojiEl.textContent = list[i].emoji;
  textEl.textContent = list[i].text;
  
  wrap.classList.remove("changing");
  void wrap.offsetWidth;
  wrap.classList.add("changing");
}

const WEEK_LIST = WEEKS.map(line => { const [start, end, star] = line.split("|").map(s => s.trim()); return { start, end, star }; });
const parseDate = s => { const [d, m, y] = s.split(".").map(Number); return new Date(y, m - 1, d); };
function currentWeek() {
  const t = new Date(); t.setHours(0, 0, 0, 0);
  for (let i = 0; i < WEEK_LIST.length; i++) {
    const a = parseDate(WEEK_LIST[i].start), b = parseDate(WEEK_LIST[i].end);
    b.setHours(23, 59, 59, 999);
    if (t >= a && t <= b) return i;
  }
  return 0;
}

function parseText(text) {
  // 1. Убираем даты в начале (если есть)
  const t = String(text || "")
    .replace(/^\d{2}\.\d{2}\.\d{4}(,\s*\d{2}\.\d{2}\.\d{4})*\s*/, "")
    .trim();

  // 2. Ищем аудиторию. Она почти всегда в самом конце: "ауд. 2-28", "аудитория 1-33", "с/зал"
  let room = "";
  let textWithoutRoom = t;

  // Паттерн для аудитории
  const roomRegex = /(?:ауд\.?|аудитория)\s*([А-Яа-яA-Za-z0-9\/\-]+)(?:\s*$|,)/i;
  const roomMatch = t.match(roomRegex);
  
  if (roomMatch) {
    room = roomMatch[1].trim();
    // Если это спортзал, приводим к красивому виду
    if (/с\/зал|спортивный/i.test(room)) room = "Спортивный зал";
    
    // Отрезаем аудиторию от текста, чтобы она не путалась с преподавателем
    textWithoutRoom = t.replace(roomRegex, "").replace(/,\s*$/, "").trim();
  } else if (/спортивный зал|с\/зал/i.test(t)) {
    room = "Спортивный зал";
    textWithoutRoom = t.replace(/,\s*(?:ауд\.?)?\s*(?:спортивный зал|с\/зал)/i, "").trim();
  }

  // 3. Ищем преподавателя в оставшемся тексте.
  // Преподаватель — это всё, что идет после степени (к.пед.н., доцент, ст.преп., ассистент и т.д.)
  // или после слова "преп."
  let teacher = "";
  let subject = textWithoutRoom;

  // Паттерн: степень + ФИО (до конца строки)
  const teacherRegex = /(?:,\s*|\s+)((?:к\.|д-р|д\.|ст\.|доцент|профессор|ассистент|преп\.?|ст\.преп\.?)[^А-ЯЁA-Z]*[А-ЯЁA-Z][а-яёa-z\-]+(?:\s+[А-ЯЁA-Z]\.(?:\s*[А-ЯЁA-Z]\.)?)?)$/;
  
  const teacherMatch = textWithoutRoom.match(teacherRegex);
  
  if (teacherMatch) {
    teacher = teacherMatch[1].trim();
    // Предмет — это всё, что было до преподавателя
    subject = textWithoutRoom.slice(0, teacherMatch.index).replace(/,\s*$/, "").trim();
  } else {
    // Если не нашли по степени, ищем просто ФИО в конце (например, "Абрамов Е.В.")
    const simpleTeacherRegex = /(?:,\s*|\s+)([А-ЯЁ][а-яё\-]+\s+[А-ЯЁ]\.\s*[А-ЯЁ]\.)$/;
    const simpleMatch = textWithoutRoom.match(simpleTeacherRegex);
    if (simpleMatch) {
      teacher = simpleMatch[1].trim();
      subject = textWithoutRoom.slice(0, simpleMatch.index).replace(/,\s*$/, "").trim();
    }
  }

  // 4. Чистим предмет от лишних запятых и пробелов
  subject = subject.replace(/,\s*$/, "").trim();

  // Если преподаватель не нашелся, но в тексте есть "преп.", попробуем вытащить по нему
  if (!teacher && /преп\./i.test(subject)) {
      const parts = subject.split(/преп\./i);
      if (parts.length > 1) {
          teacher = parts[1].trim();
          subject = parts[0].trim();
      }
  }

  return { subject, teacher, room };
}

function collectAllGroups() {
  const list = [];
  Object.keys(SCHEDULE).forEach(spec => Object.keys(SCHEDULE[spec]).forEach(course => Object.keys(SCHEDULE[spec][course]).forEach(group => {
    list.push({ spec, course, group, raw: SCHEDULE[spec][course][group] });
  })));
  return list;
}

function lessonKey(dayIndex, p, parsed, star) {
  const sub = p.subgroup ? `|sub${p.subgroup}` : "";
  const dates = p.dates ? `|d${p.dates.join(",")}` : "";
  const teacherKey = parsed.subject.includes("(л.)") ? "" : `|t${parsed.teacher}`;
  return [dayIndex, p.number, star, parsed.subject.trim(), parsed.room.trim(), sub, dates, teacherKey].join("§");
}

function buildLessonCards() {
  const all = collectAllGroups();
  const byDay = {};
  
  all.forEach(({ spec, group, raw }) => {
    Object.keys(raw).forEach(dayStr => {
      const dayIndex = Number(dayStr);
      (raw[dayStr] || []).forEach(p => {
        const time = p.time || BELLS[p.number] || (p.number + " пара");
        const parsed = parseText(p.text);
        const stars = p.star ? [p.star] : ["*", "**"];
        
        stars.forEach(star => {
          // КЛЮЧ: День | Номер пары | Неделя | Предмет | Аудитория | Преподаватель
          // Группа и подгруппа НЕ входят в ключ, чтобы лекции склеились
          const key = [dayIndex, p.number, star, p.time || "", p.from || "", p.until || "", (p.except || []).join(","), parsed.subject.trim(), parsed.room.trim(), parsed.teacher].join("§");
          
          if (!byDay[dayIndex]) byDay[dayIndex] = {};
          if (!byDay[dayIndex][star]) byDay[dayIndex][star] = {};
          const bucket = byDay[dayIndex][star];
          
          if (!bucket[key]) {
            bucket[key] = { 
              time, 
              number: p.number, 
              subject: parsed.subject, 
              room: parsed.room, 
              teachers: [], 
              groups: [], // Сюда соберутся ВСЕ группы
              subgroups: new Set(), // Собираем подгруппы
              dates: p.dates || null,
              from: p.from || null,
              until: p.until || null,
              except: p.except || [],
              _tSet: new Set(), 
              _gSet: new Set() 
            };
          }
          
          const card = bucket[key];
          
          // Собираем подгруппы (если есть)
          const subValue = p.subgroup || p.subgroups;
          if (subValue) card.subgroups.add(subValue);
          
          // Собираем преподавателей
          if (parsed.teacher && !card._tSet.has(parsed.teacher)) { 
            card._tSet.add(parsed.teacher); 
            card.teachers.push(parsed.teacher); 
          }
          
          // Собираем группы
          const gKey = spec + "|" + group;
          if (!card._gSet.has(gKey)) { 
            card._gSet.add(gKey); 
            card.groups.push({ spec, group }); 
          }
        });
      });
    });
  });
  
  const result = {};
  Object.keys(byDay).forEach(d => {
    result[d] = {};
    Object.keys(byDay[d]).forEach(star => {
      result[d][star] = Object.values(byDay[d][star]).map(c => { 
        c.subgroups = Array.from(c.subgroups); // Set -> Array
        delete c._tSet; 
        delete c._gSet; 
        return c; 
      }).sort((a, b) => a.number - b.number);
    });
  });
  return result;
}

function applyColor(spec) {
  const col = COLORS[spec] || { c: "#1769E0", soft: "#E8F1FF", text: "#1769E0" };
  const r = document.documentElement.style;
  r.setProperty("--c", col.c); 
  r.setProperty("--c-soft", col.soft); 
  r.setProperty("--c-text", col.text);

  const owl = document.querySelector(".owl");
  if (owl) {
    owl.style.boxShadow = `0 10px 24px ${hexToRgba(col.c, 0.3)}`;
  }
}

/* ============================================================
   СОКОЛ: КОРОТКИЙ ВЗМАХ ПРИ СМЕНЕ СПЕЦИАЛЬНОСТИ
   ============================================================ */
function flapFalcon() {
  const falcon = document.querySelector(".falcon-svg-wrap");
  if (!falcon) return;
  
  // Если сокол сейчас в полёте или чирикает (isAnimating = true) — ничего не делаем
  if (window.isAnimating) return; 

  const wings = falcon.querySelectorAll("#falconWingLeft, #falconWingRight");
  
  wings.forEach(wing => {
    // Отменяем старые анимации на этом крыле (если были)
    const runningAnims = wing.getAnimations();
    runningAnims.forEach(a => a.cancel());

    const isLeft = wing.id === 'falconWingLeft';
    const angle = isLeft ? 15 : -15; // Едва заметный взмах (15 градусов)
    
    wing.animate([
      { transform: 'rotate(0deg)' },
      { transform: `rotate(${angle}deg)`, offset: 0.4 },
      { transform: 'rotate(0deg)' }
    ], {
      duration: 400,
      easing: 'ease-in-out'
    });
  });
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildSchedule(raw, institution = "college") {
  const result = {};
  Object.keys(raw || {}).forEach(groupName => {
    const match = groupName.match(/^(.+?)-(\d{3})/);
    if (!match) return;
    const spec = match[1].trim();
    let course = GROUP_TO_COURSE[groupName];
    if (institution === "institute") {
      const code = Number(match[2].slice(1));
      course = code >= 21 && code <= 61 && (71 - code) % 10 === 0 ? String((71 - code) / 10) : null;
    }
    if (!course) return;
    if (!result[spec]) result[spec] = {};
    if (!result[spec][course]) result[spec][course] = {};
    result[spec][course][groupName] = raw[groupName];
  });
  return result;
}

function activateInstitution(institution, restore = true) {
  state.institution = institution === "institute" ? "institute" : "college";
  localStorage.setItem("institution", state.institution);
  SCHEDULE = buildSchedule(state.institution === "institute" ? VUZ_RAW_DATA : RAW_DATA, state.institution);
  
  state.spec = state.course = state.group = null;
  state.subgroup = null;
  state.week = currentWeek();
  
  if (restore && window.loadUserGroup) {
    const saved = window.loadUserGroup(state.institution);
    if (saved && SCHEDULE[saved.spec]?.[saved.course]?.[saved.group]) {
      state.spec = saved.spec; state.course = saved.course; state.group = saved.group;
    }
  }
  
  // Обновляем кнопки
  document.querySelectorAll(".institution-btn").forEach(btn => {
    const active = btn.dataset.institution === state.institution;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
  
  // ФИКС: Двигаем ползунок в новое положение
  const switchEl = document.getElementById("institutionSwitch");
  if (switchEl) {
    switchEl.setAttribute("data-active", state.institution);
  }

  applyColor(state.spec || (state.institution === "college" ? "ИСП" : "teacher"));
  renderAll();
}

function renderChips(containerId, items, current, onClick, label = x => x) {
  const box = $(containerId);
  if (!box) return;
  box.innerHTML = "";
  items.forEach(item => {
    const b = document.createElement("button");
    b.className = "chip" + (current === item ? " on" : "");
    b.textContent = label(item);
    b.onclick = () => onClick(item);
    box.appendChild(b);
  });
}

function renderFilters() {
  if (window.__renderTeacherFilters && state.viewTeacher) return window.__renderTeacherFilters();

  renderChips("specs", Object.keys(SCHEDULE), state.spec, spec => {
    state.spec = spec;
    state.course = null;
    state.group = null;
    state.subgroup = null;
    state.week = currentWeek();
    applyColor(spec);
    flapFalcon();
    if (window.saveUserGroup) window.saveUserGroup(state.spec, state.course, state.group, state.institution);
    showRandomWish(true);
    renderAll();
    window.dispatchEvent(new CustomEvent("specChanged", { detail: spec }));
    if (typeof maybeSayContextual === "function") maybeSayContextual(true);
  });

  if (state.spec) {
    renderChips("courses", Object.keys(SCHEDULE[state.spec]).sort(), state.course, course => {
      state.course = course;
      state.group = null;
      state.subgroup = null;
      if (window.saveUserGroup) window.saveUserGroup(state.spec, state.course, state.group, state.institution);
      renderAll();
      if (typeof maybeSayContextual === "function") maybeSayContextual(true);
    }, c => c + " курс");
  } else {
    $("courses").innerHTML = "";
  }

  if (state.spec && state.course) {
    renderChips("groups", Object.keys(SCHEDULE[state.spec][state.course]).sort(), state.group, group => {
      state.group = group;
      state.subgroup = null;
      if (window.saveUserGroup) window.saveUserGroup(state.spec, state.course, state.group, state.institution);
      renderAll();
      if (typeof maybeSayContextual === "function") maybeSayContextual(true);
    });
  } else {
    $("groups").innerHTML = "";
  }

  // ЛОГИКА ПОДГРУПП
  const rowSub = $("rowSubgroups");
  const subgroupsBox = $("subgroups");

  if (state.spec && state.course && state.group) {
    const groupData = SCHEDULE[state.spec][state.course][state.group];
    const hasSubgroups = Object.values(groupData).some(pairs =>
      pairs.some(p => p.subgroup || p.subgroups)
    );

    if (hasSubgroups && subgroupsBox) {
      rowSub.style.display = "flex";
      subgroupsBox.innerHTML = "";

      [1, 2].forEach(sub => {
        const b = document.createElement("button");
        b.className = "chip" + (state.subgroup === sub ? " on" : "");
        b.textContent = `Подгруппа ${sub}`;
        b.onclick = () => {
          state.subgroup = sub;
          renderFilters();
          renderSchedule();
          renderDayProgress();
          renderTomorrow();
          if (typeof maybeSayContextual === "function") maybeSayContextual(true);
        };
        subgroupsBox.appendChild(b);
      });
    } else {
      rowSub.style.display = "none";
    }
  } else {
    if (rowSub) rowSub.style.display = "none";
  }
}

function renderSchedule() {
  if (window.__renderTeacherSchedule && state.viewTeacher) return window.__renderTeacherSchedule();
  const out = $("out"), info = $("weekInfo");
  if (!state.spec || !state.course || !state.group) { info.textContent = "Выберите группу"; out.innerHTML = ""; return; }
  
  const w = WEEK_LIST[state.week];
  info.innerHTML = `Неделя ${w.star}<br><span style="font-size:0.9em; white-space:nowrap;">(${w.start} – ${w.end})</span>`;
  out.innerHTML = "";
  const cardsByDay = buildLessonCards();
  
  DAYS.forEach((day, index) => {
    const block = document.createElement("section");
    block.className = "day";
    const h2 = document.createElement("h2");
    h2.textContent = DAY_NAMES[day];
    block.appendChild(h2);
    
    let dayCards = (cardsByDay[index] && cardsByDay[index][w.star]) || [];
    const weekStart = parseDate(w.start);
    const lessonDate = new Date(weekStart);
    lessonDate.setDate(lessonDate.getDate() + index);
    const lessonDateKey = `${lessonDate.getFullYear()}-${String(lessonDate.getMonth() + 1).padStart(2, "0")}-${String(lessonDate.getDate()).padStart(2, "0")}`;
    dayCards = dayCards.filter(card => (!card.dates || card.dates.includes(lessonDateKey)) && (!card.from || lessonDateKey >= card.from) && (!card.until || lessonDateKey <= card.until) && !(card.except || []).includes(lessonDateKey));
    
    // Фильтр: оставляем карточки, где есть наша группа
    dayCards = dayCards.filter(card => card.groups.some(g => g.group === state.group));

    // Фильтр по подгруппе (если у карточки есть подгруппа, и мы выбрали подгруппу)
    if (state.subgroup) {
      dayCards = dayCards.filter(card => {
        if (!card.subgroups || card.subgroups.length === 0) return true;
        return card.subgroups.includes(state.subgroup);
      });
    }

    if (!dayCards.length) {
      const empty = document.createElement("div"); empty.className = "day-empty"; empty.textContent = "Выходной";
      block.appendChild(empty); out.appendChild(block); return;
    }
    
    const grid = document.createElement("div"); grid.className = "cards";
    
    dayCards.forEach(card => {
      const el = document.createElement("article"); el.className = "card";
      const teachers = card.teachers.length ? card.teachers.join(", ") : "";
      
      // Чипсы ВСЕХ групп
      const chips = card.groups.map(g => {
        const col = (COLORS[g.spec] && COLORS[g.spec].c) || "#1769E0";
        const isMine = (g.group === state.group);
        return `<span class="group-chip${isMine ? " mine" : ""}" style="--chip-c:${col}">${g.group}</span>`;
      }).join("");
      
      el.innerHTML = `<div class="t">${card.time}</div><div class="s">${card.subject}</div><div class="m">${card.room}${teachers ? " · " + teachers : ""}</div>${card.groups.length > 1 ? `<div class="card-groups">${chips}</div>` : ""}`;
      grid.appendChild(el);
    });
    
    block.appendChild(grid); out.appendChild(block);
  });
}

function renderDayProgress() {
  const card = $("dayCard"), status = $("dayStatus"), percent = $("dayPercent");
  const ringFill = $("dcRingFill"), pairEl = $("dcPair"), metaEl = $("dcMeta");
  const leftEl = $("dayLeft"), track = $("dcTrack"), labels = $("dcLabels");
  if (!card || !track) return;
  if (state.viewTeacher) { card.classList.add("hidden"); return; }
  if (!state.spec || !state.group || state.week !== currentWeek()) { card.classList.add("hidden"); return; }
  const now = new Date(), todayIndex = (now.getDay() + 6) % 7;
  const raw = SCHEDULE[state.spec][state.course][state.group];
  let pairs = raw[todayIndex];
  if (!pairs || !pairs.length) { card.classList.add("hidden"); return; }
  const week = WEEK_LIST[state.week];
  pairs = pairs.filter(p => !p.star || p.star === week.star);
  if (!pairs.length) { card.classList.add("hidden"); return; }
  const BELL_MIN = {};
  Object.keys(BELLS).forEach(n => { const [start, end] = BELLS[n].split("–"); BELL_MIN[n] = { start: toMin(start), end: toMin(end), num: Number(n) }; });
  const seenNum = new Set();
  const sorted = pairs.filter(p => BELL_MIN[p.number]).filter(p => { if (seenNum.has(p.number)) return false; seenNum.add(p.number); return true; }).map(p => ({ ...BELL_MIN[p.number], pair: p })).sort((a, b) => a.start - b.start);
  if (!sorted.length) { card.classList.add("hidden"); return; }
  const dayStart = sorted[0].start, dayEnd = sorted[sorted.length - 1].end;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  card.classList.remove("hidden");
  const total = dayEnd - dayStart;
  let passed = Math.max(0, Math.min(total, nowMin - dayStart));
  const percentVal = Math.round((passed / total) * 100);
  percent.textContent = percentVal + "%";
  const dash = 2 * Math.PI * 52;
  ringFill.style.strokeDasharray = dash;
  ringFill.style.strokeDashoffset = dash - (dash * percentVal / 100);
  const existingBtn = document.getElementById("dcMobileBtn");
  if (existingBtn) existingBtn.remove();
  if (window.innerWidth <= 640) {
    const btn = document.createElement("button"); btn.id = "dcMobileBtn"; btn.className = "dc-mobile-btn"; btn.innerHTML = "🕒 Посмотреть время пар";
    btn.onclick = () => openMobileBells(sorted);
    leftEl.after(btn);
  }
  track.innerHTML = ""; labels.innerHTML = "";
  const trackWrap = document.createElement("div"); trackWrap.style.cssText = "position:relative;width:100%;height:100%;"; track.appendChild(trackWrap);
  const bg = document.createElement("div"); bg.style.cssText = "position:absolute;top:0;left:0;right:0;bottom:0;background:var(--line);border-radius:999px;"; trackWrap.appendChild(bg);
  for (let i = 0; i < sorted.length; i++) {
    const item = sorted[i];
    const leftP = ((item.start - dayStart) / total) * 100, wP = ((item.end - item.start) / total) * 100;
    const seg = document.createElement("div"); seg.style.cssText = `position:absolute; left:${leftP}%; width:${wP}%; top:0; bottom:0; background: var(--c, var(--blue)); border-radius: 4px; z-index: 2;`; trackWrap.appendChild(seg);
    const timeLabel = document.createElement("span"); timeLabel.className = "dc-time-label desktop-only"; timeLabel.textContent = BELLS[item.num].replace("–", " – "); timeLabel.style.left = `${leftP + wP/2}%`; trackWrap.appendChild(timeLabel);
    if (i < sorted.length - 1) {
      const nextItem = sorted[i + 1], breakStart = item.end, breakEnd = nextItem.start, breakDuration = breakEnd - breakStart;
      if (breakDuration > 0) {
        const bLeftP = ((breakStart - dayStart) / total) * 100, bWP = ((breakEnd - breakStart) / total) * 100;
        const breakSeg = document.createElement("div"); breakSeg.style.cssText = `position:absolute; left:${bLeftP}%; width:${bWP}%; top:0; bottom:0; background: var(--c-soft, var(--blue-soft)); z-index: 1;`; trackWrap.appendChild(breakSeg);
        const bLabel = document.createElement("span"); bLabel.className = "dc-break-label desktop-only"; bLabel.textContent = `${breakDuration} мин`; bLabel.style.left = `${bLeftP + bWP/2}%`; trackWrap.appendChild(bLabel);
      }
    }
  }
  
  // === НОВЫЕ ПОДПИСИ НАЧАЛА И КОНЦА (ТОЛЬКО ДЛЯ МОБИЛКИ) ===
  const mobileStart = document.createElement("span");
  mobileStart.className = "dc-mobile-edge-label start";
  mobileStart.textContent = BELLS[sorted[0].num].split("–")[0];
  trackWrap.appendChild(mobileStart);

  const mobileEnd = document.createElement("span");
  mobileEnd.className = "dc-mobile-edge-label end";
  mobileEnd.textContent = BELLS[sorted[sorted.length - 1].num].split("–")[1];
  trackWrap.appendChild(mobileEnd);
  // ==========================================================

  if (nowMin >= dayStart && nowMin <= dayEnd) {
    const nowP = ((nowMin - dayStart) / total) * 100;
    const dot = document.createElement("div"); dot.style.cssText = `position:absolute; top:50%; left:${nowP}%; width:14px; height:14px; border-radius:50%; background: var(--c, var(--blue)); border: 3px solid var(--card); transform: translate(-50%, -50%); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c, var(--blue)) 25%, transparent); z-index: 4;`; trackWrap.appendChild(dot);
    const nowTimeLabel = document.createElement("span"); const hh = String(now.getHours()).padStart(2, '0'), mm = String(now.getMinutes()).padStart(2, '0');
    nowTimeLabel.textContent = `${hh}:${mm}`; nowTimeLabel.style.cssText = `position:absolute; left:${nowP}%; top: -22px; transform: translateX(-50%); font-size: 0.7rem; font-weight: 600; color: var(--c, var(--blue)); background: var(--card); padding: 2px 6px; border-radius: 6px; white-space: nowrap; z-index: 5; box-shadow: 0 2px 6px rgba(0,0,0,0.08);`; trackWrap.appendChild(nowTimeLabel);
  }
  let current = null;
  sorted.forEach(item => { if (nowMin >= item.start && nowMin <= item.end) current = item; });
  if (nowMin < dayStart) { status.textContent = "День ещё не начался"; pairEl.textContent = "Скоро первая пара"; metaEl.textContent = `Начало в ${BELLS[sorted[0].num].split("–")[0]}`; leftEl.textContent = `До начала ${fmtLeft(dayStart - nowMin)}`; return; }
  if (nowMin > dayEnd) {
    status.textContent = "День завершён 🎉"; 
    pairEl.textContent = "Хорошего отдыха!";
    metaEl.textContent = ""; 
    leftEl.textContent = "До завтра"; 
    return;
  }
  if (current) { status.textContent = `Идёт ${current.num}-я пара`; pairEl.textContent = current.pair.text.split("преп.")[0].trim(); metaEl.textContent = `${BELLS[current.num]}`; leftEl.textContent = `До звонка ${fmtLeft(current.end - nowMin)}`; }
  else {
    let currentBreak = null;
    for (let i = 0; i < sorted.length - 1; i++) { if (nowMin > sorted[i].end && nowMin < sorted[i + 1].start) { currentBreak = { end: sorted[i].end, nextStart: sorted[i + 1].start, nextPair: sorted[i + 1].pair }; break; } }
    if (currentBreak) { status.textContent = "Перемена"; pairEl.textContent = currentBreak.nextPair.text.split("преп.")[0].trim(); metaEl.textContent = `Следующая в ${BELLS[sorted.find(s => s.start === currentBreak.nextStart).num].split("–")[0]}`; leftEl.textContent = `До пары ${fmtLeft(currentBreak.nextStart - nowMin)}`; }
  }
}
function openMobileBells(sorted) {
  let modal = document.getElementById("bellsModal");
  if (!modal) {
    modal = document.createElement("div"); modal.id = "bellsModal"; modal.className = "bells-modal-overlay";
    modal.innerHTML = `<div class="bells-modal"><div class="bells-modal-header"><h3>Расписание звонков</h3><button class="bells-modal-close" onclick="document.getElementById('bellsModal').classList.remove('open')">✕</button></div><div class="bells-modal-content" id="bellsModalContent"></div></div>`;
    document.body.appendChild(modal);
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("open"); });
  }
  const content = document.getElementById("bellsModalContent"); let html = "";
  sorted.forEach((item, i) => {
    const timeStr = BELLS[item.num].replace("–", " – "); html += `<div class="bells-row"><span>${item.num}-я пара</span> <b>${timeStr}</b></div>`;
    if (i < sorted.length - 1) { const next = sorted[i+1], bDur = next.start - item.end; if (bDur > 0) html += `<div class="bells-break">Перемена: ${bDur} мин</div>`; }
  });
  content.innerHTML = html; modal.classList.add("open");
  if (window.unlockAchievement) window.unlockAchievement("bellSchedule");
}

function renderTomorrow() {
  const wrap = $("tomorrow");
  if (!wrap || state.viewTeacher || !state.spec || !state.group) { 
    if(wrap) wrap.classList.add("hidden"); 
    return; 
  }

  const now = new Date();
  // Получаем завтрашнюю дату
  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(now.getDate() + 1);
  tomorrowDate.setHours(0, 0, 0, 0); // Обнуляем время для точного сравнения

  // Индекс дня недели для завтра (0 - Пн, 6 - Вс)
  const tomorrowIndex = (tomorrowDate.getDay() + 6) % 7;
  
  // Форматируем завтрашнюю дату в ключ YYYY-MM-DD (как в данных)
  const tomorrowKey = `${tomorrowDate.getFullYear()}-${String(tomorrowDate.getMonth() + 1).padStart(2, "0")}-${String(tomorrowDate.getDate()).padStart(2, "0")}`;

  // Получаем пары на завтра
  const raw = SCHEDULE[state.spec][state.course][state.group]; 
  let pairs = raw[tomorrowIndex] || [];

  // Определяем, какая неделя будет завтра (если сегодня воскресенье — берем следующую)
  let weekIndex = state.week;
  // Если сегодня воскресенье, завтра понедельник — это новая неделя
  if (now.getDay() === 0) {
    weekIndex = Math.min(state.week + 1, WEEK_LIST.length - 1);
  }
  const w = WEEK_LIST[weekIndex];

  // Фильтруем пары: по звездочке (неделя) и по конкретным датам
  pairs = pairs.filter(p => {
    // 1. Проверка на звездочку (четность недели)
    if (p.star && p.star !== w.star) return false;
    
    // 2. Проверка на конкретные даты (например, "2026-09-07")
    if (p.dates && !p.dates.includes(tomorrowKey)) return false;
    
    // 3. Проверка на начало действия (from)
    if (p.from && tomorrowKey < p.from) return false;
    
    // 4. Проверка на конец действия (until)
    if (p.until && tomorrowKey > p.until) return false;
    
    // 5. Проверка на исключения (except)
    if (p.except && p.except.includes(tomorrowKey)) return false;
    
    return true;
  });

  const dayName = DAY_NAMES[DAYS[tomorrowIndex]];
  const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  const dateStr = `${tomorrowDate.getDate()} ${months[tomorrowDate.getMonth()]}`;
  
  let headerHtml = `<div class="tm-header"><div class="tm-header-left"><span class="tm-icon">🌅</span><span class="tm-title">Завтра</span></div><div class="tm-header-right"><span class="tm-date">${dayName}, ${dateStr}</span></div></div>`;

  if (!pairs.length) { 
    wrap.innerHTML = headerHtml + `<div class="tm-empty">Пар <b>нет</b> — отдыхай! 🎉</div>`; 
    wrap.classList.remove("hidden"); 
    if (window.unlockAchievement) window.unlockAchievement("tomorrowViewed"); 
    return; 
  }

  const sorted = [...pairs].sort((a, b) => a.number - b.number); 
  let pairsHtml = '<div class="tm-list">';
  
  sorted.forEach(p => { 
    const time = BELLS[p.number] ? BELLS[p.number].split("–")[0] : ""; 
    const parsed = parseText(p.text); 
    pairsHtml += `<div class="tm-item"><div class="tm-time">${time}</div><div class="tm-subject"><div class="tm-subject-name">${parsed.subject.replace(/\s*\(.*?\)\s*/g, '')}</div>${parsed.room ? `<div class="tm-room">${parsed.room}</div>` : ""}</div></div>`; 
  });
  
  pairsHtml += '</div>'; 
  wrap.innerHTML = headerHtml + pairsHtml + `<div class="tm-footer">Всего пар: ${sorted.length}</div>`; 
  wrap.classList.remove("hidden");
  
  if (window.unlockAchievement) window.unlockAchievement("tomorrowViewed");
}

function renderAll() {
  renderFilters(); 
  renderSchedule(); 
  renderDayProgress(); 
  renderTomorrow(); 
  showRandomWish();
  if (window.renderCurrentGroupBanner) window.renderCurrentGroupBanner(state.spec, state.course, state.group);
}

function shiftWeek(d) {
  state.week = Math.max(0, Math.min(WEEK_LIST.length - 1, state.week + d));
  renderSchedule(); renderDayProgress(); renderTomorrow();
  if (window.unlockAchievement) window.unlockAchievement("weekShift");
}

function goToday() {
  state.week = currentWeek(); renderSchedule(); renderDayProgress(); renderTomorrow();
  setTimeout(() => {
    const todayIndex = (new Date().getDay() + 6) % 7, days = document.querySelectorAll("#out .day");
    days.forEach(d => d.classList.remove("highlight"));
    if (days[todayIndex]) { days[todayIndex].classList.add("highlight"); days[todayIndex].scrollIntoView({ behavior: "smooth", block: "center" }); }
  }, 100);
}

// ============================================================
//  ИНИЦИАЛИЗАЦИЯ
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  SCHEDULE = buildSchedule(state.institution === "institute" ? VUZ_RAW_DATA : RAW_DATA, state.institution);
  state.week = currentWeek();
  initTheme(); applyName();

  const nameEditBtn = $("nameEdit");
  if (nameEditBtn) {
    nameEditBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openNameModal();
    });
  }

  const wishBtn = $("wishRefresh");
  if (wishBtn) wishBtn.addEventListener("click", () => showRandomWish(true));
  const themeToggleMenu = $("themeToggleMenu");
  if (themeToggleMenu) themeToggleMenu.addEventListener("click", toggleTheme);

  // ============================================================
  // ПОЛНОЭКРАННОЕ МЕНЮ: открытие, закрытие и блокировка фона
  // ============================================================
  const menuBtn = $("menuBtn");
  const mobileMenu = $("mobileMenu");
  const closeMenuBtn = $("closeMenuBtn");
  let menuIsOpen = false;
  let menuScrollY = 0;
  let inertBackground = [];

  function setBackgroundInert(enabled) {
    if (!mobileMenu) return;
    if (enabled) {
      inertBackground = Array.from(document.body.children)
        .filter(el => el !== mobileMenu)
        .map(el => ({ element: el, hadInert: el.hasAttribute("inert") }));
      inertBackground.forEach(({ element }) => element.setAttribute("inert", ""));
    } else {
      inertBackground.forEach(({ element, hadInert }) => {
        if (!hadInert) element.removeAttribute("inert");
      });
      inertBackground = [];
    }
  }

  function openFullscreenMenu() {
    if (!menuBtn || !mobileMenu || menuIsOpen) return;
    menuIsOpen = true;
    menuScrollY = window.scrollY || window.pageYOffset || 0;

    mobileMenu.inert = false;
    mobileMenu.classList.add("open");
    menuBtn.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");
    menuBtn.setAttribute("aria-expanded", "true");
    setBackgroundInert(true);

    // Фиксированная блокировка работает и в мобильных Safari.
    document.body.dataset.menuScrollY = String(menuScrollY);
    document.body.style.position = "fixed";
    document.body.style.top = `-${menuScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    if (closeMenuBtn) closeMenuBtn.focus({ preventScroll: true });
  }

  function closeFullscreenMenu() {
    if (!mobileMenu || !menuIsOpen) return;

    // Сначала снимаем inert с фона. Затем явно убираем фокус
    // с кнопки внутри меню и возвращаем его на бургер.
    setBackgroundInert(false);
    if (mobileMenu.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    if (menuBtn) menuBtn.focus({ preventScroll: true });

    // inert исключает скрытое меню из фокуса и дерева доступности.
    mobileMenu.inert = true;
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    if (menuBtn) {
      menuBtn.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }

    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    document.body.style.overflow = "";
    delete document.body.dataset.menuScrollY;

    menuIsOpen = false;
    window.scrollTo(0, menuScrollY);
  }

  // Делаем функции доступными динамическим пунктам меню ниже.
  window.openFullscreenMenu = openFullscreenMenu;
  window.closeFullscreenMenu = closeFullscreenMenu;

  if (mobileMenu) mobileMenu.setAttribute("aria-hidden", "true");
  if (menuBtn) {
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.addEventListener("click", (event) => {
      event.preventDefault();
      openFullscreenMenu();
    });
  }
  if (closeMenuBtn) {
    closeMenuBtn.addEventListener("click", (event) => {
      event.preventDefault();
      closeFullscreenMenu();
    });
  }
  if (mobileMenu) {
    mobileMenu.addEventListener("click", (event) => {
      if (event.target === mobileMenu) closeFullscreenMenu();
    });
  }
  document.addEventListener("keydown", (event) => {
    if (!menuIsOpen) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeFullscreenMenu();
      return;
    }
    if (event.key === "Tab") {
      const focusable = Array.from(mobileMenu.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter(el => el.getClientRects().length > 0);
      if (!focusable.length) {
        event.preventDefault();
      } else if (event.shiftKey && document.activeElement === focusable[0]) {
        event.preventDefault();
        focusable[focusable.length - 1].focus();
      } else if (!event.shiftKey && document.activeElement === focusable[focusable.length - 1]) {
        event.preventDefault();
        focusable[0].focus();
      }
    }
  });

  const roleCards = document.querySelectorAll(".role-card");
  roleCards.forEach(card => {
    card.addEventListener("click", () => {
      const role = card.dataset.role;
      localStorage.setItem("role", role);
      
      const roleScreen = $("roleScreen");
      const scheduleScreen = $("scheduleScreen");
      
      if (roleScreen) roleScreen.style.display = "none";
      if (scheduleScreen) scheduleScreen.style.display = "block";

      state.mode = role;
      state.viewTeacher = (role === "teacher");
      state.teacher = null;
      
      const wish = $("wish");
      if (wish) wish.style.display = state.viewTeacher ? "none" : "flex";
      if (!state.viewTeacher) applyColor(state.spec || "ИСП");

      renderAll();
      buildMenu();
      // Мгновенная реакция на клик
      if (typeof sayPhrase === "function") {
        phraseQueue = [];
        isSpeaking = false;
        if (state.viewTeacher) {
          sayPhrase("Режим преподавателя. Найди себя через поиск 🔍", 5000);
        } else {
          sayPhrase("Отлично! Теперь выбери свою специальность 👇", 5000);
        }
      }
    });
  });

  const savedRole = localStorage.getItem("role");
  if (savedRole) {
    const roleScreen = $("roleScreen");
    const scheduleScreen = $("scheduleScreen");
    if (roleScreen) roleScreen.style.display = "none";
    if (scheduleScreen) scheduleScreen.style.display = "block";
    state.mode = savedRole;
    state.viewTeacher = (savedRole === "teacher");
    if (state.viewTeacher) { const wish = $("wish"); if (wish) wish.style.display = "none"; }
  }

  if (window.loadUserGroup) {
    const saved = window.loadUserGroup(state.institution);
    if (saved && SCHEDULE[saved.spec] && SCHEDULE[saved.spec][saved.course] && SCHEDULE[saved.spec][saved.course][saved.group]) {
      state.spec = saved.spec; state.course = saved.course; state.group = saved.group;
      applyColor(saved.spec);
    }
  }

  function buildMenu() {
    const dynamicNav = $("dynamicMenuNav");
    if (!dynamicNav) return;
    dynamicNav.innerHTML = "";
    const isTeacher = (state.mode === "teacher");
    
    const btnProfile = document.createElement("button"); btnProfile.className = "fs-link open-profile-btn"; btnProfile.style = "--i: 1;"; btnProfile.innerHTML = "🎓 Мой профиль"; dynamicNav.appendChild(btnProfile);
    
    const btnSwitchMode = document.createElement("button"); btnSwitchMode.className = "fs-link"; btnSwitchMode.style = "--i: 2;";
    if (isTeacher) { btnSwitchMode.innerHTML = "👨‍🎓 Расписание студентов"; btnSwitchMode.onclick = () => { localStorage.setItem("role", "student"); localStorage.removeItem("savedGroup"); location.reload(); }; }
    else { btnSwitchMode.innerHTML = "👨‍🏫 Расписание преподавателей"; btnSwitchMode.onclick = () => { localStorage.setItem("role", "teacher"); localStorage.removeItem("savedGroup"); location.reload(); }; }
    dynamicNav.appendChild(btnSwitchMode);
    
    if (!isTeacher) {
      const btnForgetGroup = document.createElement("button"); btnForgetGroup.className = "fs-link"; btnForgetGroup.style = "--i: 3;"; btnForgetGroup.innerHTML = "🗑 Забыть группу";
      btnForgetGroup.onclick = () => { if (window.clearUserGroup) window.clearUserGroup(state.institution); state.spec = null; state.course = null; state.group = null; state.subgroup = null; state.week = currentWeek(); applyColor("ИСП"); renderAll(); closeFullscreenMenu(); buildMenu(); };
      dynamicNav.appendChild(btnForgetGroup);
    }
    
    const linkHome = document.createElement("a"); 
    linkHome.href = "index.html"; 
    linkHome.className = "fs-link"; 
    linkHome.style = "--i: 4;"; 
    linkHome.innerHTML = "← На главную"; 
    linkHome.onclick = () => closeFullscreenMenu(); 
    dynamicNav.appendChild(linkHome);
  }

  document.querySelectorAll(".institution-btn").forEach(btn => btn.addEventListener("click", () => {
    if (btn.dataset.institution !== state.institution) activateInstitution(btn.dataset.institution, true);
  }));
  document.querySelectorAll(".institution-btn").forEach(btn => {
    const active = btn.dataset.institution === state.institution;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
    // Инициализируем ползунок при загрузке
  const switchElInit = document.getElementById("institutionSwitch");
  if (switchElInit) switchElInit.setAttribute("data-active", state.institution);
  buildMenu();
  renderAll();

  setInterval(() => { if (!state.viewTeacher) { renderDayProgress(); renderTomorrow(); showRandomWish(false); } }, 60000);
});

// ============================================================
//  МАСКОТ СОКОЛ: КОНТЕКСТНЫЕ РЕПЛИКИ
// ============================================================

/* ============================================================
   СОКОЛ: НАСТРОЕНИЕ ПО ВРЕМЕНИ СУТОК
   ============================================================ */
function applyFalconMood() {
  const hour = new Date().getHours();
  const root = document.documentElement;
  root.classList.remove("falcon-morning", "falcon-day", "falcon-evening", "falcon-night");

  let phase;
  if (hour >= 6 && hour < 11)       phase = "falcon-morning";
  else if (hour >= 11 && hour < 18) phase = "falcon-day";
  else if (hour >= 18 && hour < 23) phase = "falcon-evening";
  else                               phase = "falcon-night";

  root.classList.add(phase);
  root.dataset.falconPhase = phase.replace("falcon-", "");
}

// ============================================================
//  РЕПЛИКИ МАСКОТА (С ОЧЕРЕДЬЮ)
// ============================================================
let phraseQueue = [];
let isSpeaking = false;

function sayPhrase(text, duration = 6000) {
  const bubble = document.getElementById("mascotBubble");
  if (!bubble) return;

  // Если уже говорим — ставим в очередь (макс 2 сообщения)
  if (isSpeaking) {
    if (phraseQueue.length < 2) {
      phraseQueue.push({ text, duration });
    }
    return;
  }

  isSpeaking = true;
  bubble.textContent = text;
  bubble.classList.add("show");

  setTimeout(() => {
    bubble.classList.remove("show");
    isSpeaking = false;
    
    // Если есть очередь — показываем следующую
    if (phraseQueue.length > 0) {
      const next = phraseQueue.shift();
      setTimeout(() => sayPhrase(next.text, next.duration), 400);
    }
  }, duration);
}

/**
 * Определяет, что сказать, исходя из текущего состояния.
 * Возвращает { text, priority } или null.
 * priority: чем больше — тем «важнее» реплика (чтобы не перебивать друг друга).
 */
function getMascotPhrase() {
  const now = new Date();
  const hour = now.getHours();
  const dayIndex = (now.getDay() + 6) % 7;
  const nowMin = hour * 60 + now.getMinutes();

  // 1. Роль не выбрана
  if (!localStorage.getItem("role")) {
    return { text: "Привет! Для начала выбери, кто ты 👆", priority: 100 };
  }

  // 2. РЕЖИМ ПРЕПОДАВАТЕЛЯ (проверяем до всего остального!)
  if (state.viewTeacher) {
    if (!state.teacher) {
      return { text: "Режим преподавателя. Найди себя через поиск 🔍", priority: 95 };
    }
    // Если преподаватель найден, дальше можно добавить логику для его расписания, 
    // но пока просто возвращаем null или контекст
    return null; 
  }

  // --- ДАЛЬШЕ ТОЛЬКО ДЛЯ СТУДЕНТОВ ---

  // 3. Специальность не выбрана
  if (!state.spec) {
    return { text: "Отлично! Теперь выбери свою специальность 👇", priority: 90 };
  }

  // 4. Курс не выбран
  if (!state.course) {
    return { text: `Отлично! Теперь выбери свой курс 👇`, priority: 85 };
  }

  // 5. Группа не выбрана
  if (!state.group) {
    return { text: `Остался последний шаг — выбери свою группу 👇`, priority: 80 };
  }

  // 6. Чужая неделя
  if (state.week !== currentWeek()) {
    return { text: `Ты смотришь неделю ${WEEK_LIST[state.week].star}. Вернись к текущей →`, priority: 50 };
  }

  // 7. Расписание на сегодня
  const raw = SCHEDULE[state.spec]?.[state.course]?.[state.group];
  if (!raw) return null;
  
  let pairs = raw[dayIndex];
  const w = WEEK_LIST[state.week];
  if (pairs) {
    pairs = pairs.filter(p => !p.star || p.star === w.star);
  }

  // 8. Если пар нет
  if (!pairs || !pairs.length) {
    if (dayIndex >= 5) {
      return { text: "Сегодня выходной. Отдыхай! 🎉", priority: 70 };
    }
    return { text: "Сегодня пар нет — свободный день! 🌿", priority: 80 };
  }

  // 9. Сортируем
  const BELL_MIN = {};
  Object.keys(BELLS).forEach(n => {
    const [s, e] = BELLS[n].split("–");
    BELL_MIN[n] = { start: toMin(s), end: toMin(e), num: Number(n) };
  });
  const seen = new Set();
  const sorted = pairs
    .filter(p => BELL_MIN[p.number])
    .filter(p => { if (seen.has(p.number)) return false; seen.add(p.number); return true; })
    .map(p => ({ ...BELL_MIN[p.number], pair: p }))
    .sort((a, b) => a.start - b.start);

  if (!sorted.length) return null;
  const dayStart = sorted[0].start;
  const dayEnd = sorted[sorted.length - 1].end;

  // 10. До пар
  if (nowMin < dayStart) {
    const firstTime = BELLS[sorted[0].num].split("–")[0];
    const minsLeft = dayStart - nowMin;
    if (minsLeft <= 60) {
      return { text: `Скоро первая пара в ${firstTime}. Собирайся! ⏰`, priority: 90 };
    }
    return { text: `Доброе утро! Первая пара в ${firstTime}`, priority: 40 };
  }

  // 11. После пар
  if (nowMin > dayEnd) {
    if (dayIndex === 4) {
      return { text: "Ура, выходные! 🎉 Отдыхай как следует", priority: 85 };
    }
    return { text: "Пары закончились. Хорошего отдыха! 🌙", priority: 60 };
  }

  // 12. Идет пара
  const current = sorted.find(item => nowMin >= item.start && nowMin <= item.end);
  if (current) {
    const subject = current.pair.text.split("преп.")[0].trim().replace(/\s*\(.*?\)\s*/g, "");
    const minsLeft = current.end - nowMin;
    if (minsLeft <= 5) {
      return { text: `Скоро звонок! ${subject} заканчивается`, priority: 75 };
    }
    return { text: `Сейчас: ${subject}`, priority: 65 };
  }

  // 13. Перемена
  for (let i = 0; i < sorted.length - 1; i++) {
    if (nowMin > sorted[i].end && nowMin < sorted[i + 1].start) {
      const next = sorted[i + 1];
      const minsToNext = next.start - nowMin;
      const nextSubject = next.pair.text.split("преп.")[0].trim().replace(/\s*\(.*?\)\s*/g, "");
      if (minsToNext <= 2) {
        return { text: `Перемена кончается! Следующая — ${nextSubject}`, priority: 70 };
      }
      return { text: `Перемена. ${minsToNext} мин до «${nextSubject}»`, priority: 55 };
    }
  }

  return null;
}

// Показать реплику, если она «важнее» предыдущей за последние N секунд
let _lastPhraseTime = 0;
let _lastPhraseText = "";
let _phraseTimer = null;

function maybeSayContextual(force = false) {
  if (_phraseTimer) clearTimeout(_phraseTimer);

  _phraseTimer = setTimeout(() => {
    // ЗАЩИТА: если сокол сейчас говорит, не перебиваем его
    if (isSpeaking && !force) return;
    
    // ЗАЩИТА: если сокол говорил меньше 8 секунд назад — ждем
    if (!force && Date.now() - _lastPhraseTime < 8000) return;

    const phrase = getMascotPhrase();
    if (!phrase) return;

    const now = Date.now();
    if (!force && phrase.text === _lastPhraseText) return;

    _lastPhraseText = phrase.text;
    _lastPhraseTime = now;
    
    phraseQueue = [];
    isSpeaking = false;
    
    sayPhrase(phrase.text);
  }, force ? 50 : 400); // Если force — срабатываем почти сразу, иначе ждем 400мс
}

// Инициализация маскота
document.addEventListener("DOMContentLoaded", () => {
  const mascot = document.getElementById("mascot");
  const bubble = document.getElementById("mascotBubble");
  if (!mascot || !bubble) return;

    // Первое приветствие — через 1.5 сек после загрузки
  setTimeout(() => {
    const role = localStorage.getItem("role");
    
    if (!role) {
      // Если роль не выбрана (мы на экране "Кто ты?")
      sayPhrase("Привет! Для начала выбери, кто ты 👆", 4000);
    } else if (localStorage.getItem("savedGroup")) {
      // Если роль выбрана и группа сохранена
      maybeSayContextual(true);
    } else {
      // Если роль выбрана, но группа еще нет
      sayPhrase("Привет! Выбери свою специальность 👇", 4000);
    }
  }, 1500);

// ============================================================
//  РОТАЦИЯ РЕАКЦИИ НА КЛИК: взлёт ↔ чириканье
// ============================================================
const falconWrap = document.getElementById("falconMascot");
let clickCount = 0;
let lastClickTime = 0;
const CLICK_RESET_MS = 10000;

function spawnNote() {
  if (!falconWrap) return;
  const old = falconWrap.querySelector(".falcon-note");
  if (old) old.remove();

  const note = document.createElement("span");
  note.className = "falcon-note";
  note.textContent = "🎵";
  falconWrap.appendChild(note);
  requestAnimationFrame(() => note.classList.add("fly"));
  setTimeout(() => note.remove(), 1000);
}

// 1. Сначала обработчик КЛИКА
let isAnimating = false; // Блокиратор: не даем кликать во время анимации

// Объекты для хранения текущих анимаций
let currentFlyAnim = null;
let currentChirpAnim = null;

mascot.addEventListener("click", () => {
  if (isAnimating) return; // Если анимация уже идет — стоп

  const now = Date.now();
  if (now - lastClickTime > CLICK_RESET_MS) clickCount = 0;
  lastClickTime = now;

  const reaction = clickCount % 2;
  clickCount++;

  if (reaction === 0) {
    // === ВЗЛЁТ ===
    isAnimating = true;
    
    // 1. Отменяем старые анимации (если вдруг зависли)
    if (currentFlyAnim) currentFlyAnim.cancel();
    if (currentChirpAnim) currentChirpAnim.cancel();

    if (falconWrap) {
      const wings = falconWrap.querySelectorAll("#falconWingLeft, #falconWingRight");
      
      // 2. Запускаем анимацию через Web Animations API
      currentFlyAnim = falconWrap.animate([
        { transform: 'translateY(0) scale(1)' },
        { transform: 'translateY(-30px) scale(1.05)', offset: 0.4 },
        { transform: 'translateY(0) scale(1)' }
      ], {
        duration: 1200,
        easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
      });

      wings.forEach(wing => {
        const isLeft = wing.id === 'falconWingLeft';
        const angle = isLeft ? 40 : -40;
        wing.animate([
          { transform: 'rotate(0deg)' },
          { transform: `rotate(${angle}deg)`, offset: 0.4 },
          { transform: 'rotate(0deg)' }
        ], {
          duration: 1200,
          easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
        });
      });

      // 3. По окончании — сбрасываем флаг
      currentFlyAnim.onfinish = () => { isAnimating = false; };
      // Страховка, если onfinish не сработает
      setTimeout(() => { isAnimating = false; }, 1300);
    }
    sayPhrase("Вжух! ✈️", 2000);

  } else {
    // === ЧИРИКАНЬЕ ===
    isAnimating = true;

    if (currentFlyAnim) currentFlyAnim.cancel();
    if (currentChirpAnim) currentChirpAnim.cancel();

    if (falconWrap) {
      const beak = falconWrap.querySelector("#falconBeak");
      
      // Анимация тела
      currentChirpAnim = falconWrap.animate([
        { transform: 'translateY(0) scale(1)' },
        { transform: 'translateY(-2px) scale(1.02)', offset: 0.3 },
        { transform: 'translateY(0) scale(1)' }
      ], {
        duration: 600,
        easing: 'ease-in-out'
      });

      // Анимация клюва
      if (beak) {
        beak.animate([
          { transform: 'rotateX(0deg) scaleY(1)' },
          { transform: 'rotateX(-25deg) scaleY(0.7)', offset: 0.5 },
          { transform: 'rotateX(0deg) scaleY(1)' }
        ], {
          duration: 150, // Быстрое щелканье
          iterations: 4,
          easing: 'ease-in-out'
        });
      }

      currentChirpAnim.onfinish = () => { isAnimating = false; };
      setTimeout(() => { isAnimating = false; }, 700);
    }
    spawnNote();
    sayPhrase("Чирик! 🎵", 2000);
  }
});

// 2. А ТЕПЕРЬ (ОТДЕЛЬНО, СНАРУЖИ) обработчик КЛАВИАТУРЫ
if (falconWrap) {
  falconWrap.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();          // чтобы Space не скроллил страницу
      mascot.click();              // вызываем тот же обработчик, что и мышкой
    }
  });
}

  // Реакция на смену специальности
  window.addEventListener("specChanged", (e) => {
    const specName = e.detail;
    sayPhrase(`О, ${specName} — крутой выбор! 🚀`);
  });

  // Реакция на открытие профиля
  const profileBtns = document.querySelectorAll(".open-profile-btn");
  profileBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      setTimeout(() => sayPhrase("О, достижения? Покажи, что собрал 🏆"), 400);
    });
  });

  // При возврате на вкладку — обновляем реплику
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      maybeSayContextual(false);
    }
  });

  
  // Обновлять реплику раз в 5 минут
  setInterval(() => {
    if (!document.hidden) maybeSayContextual(false);
  }, 5 * 60 * 1000);
  // Настроение по времени суток
  applyFalconMood();
  setInterval(applyFalconMood, 60 * 1000);
});

// Хук: после renderAll обновляем реплику
// (renderAll вызывается из schedule.js при смене группы/курса/спец.)
const _origRenderAll = window.renderAll;
if (typeof _origRenderAll === "function") {
  window.renderAll = function () {
    _origRenderAll.apply(this, arguments);
    setTimeout(() => maybeSayContextual(false), 300);
  };
}

// ============================================================
//  АВТОМАТИЧЕСКАЯ ЧИСТКА ИМЕНИ ПРИ ЗАГРУЗКЕ
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const savedName = localStorage.getItem("userName");
    if (savedName && savedName.trim().length > 0) {
      if (!isNameClean(savedName)) {
        localStorage.setItem("userName", "Пользователь");
        const nameEl = document.getElementById("userName");
        if (nameEl) nameEl.textContent = "Пользователь";
        if (window.showGlobalToast) {
          window.showGlobalToast("⚠️ Ваше имя содержало недопустимые слова и было изменено.");
        }
      }
    }
  }, 1000);
});

/* ============================================================
   СОКОЛ: СЛЕЖЕНИЕ ЗРАЧКАМИ ЗА КУРСОРОМ
   ============================================================ */
(function initFalconTracking() {
  const pupils = document.getElementById('falconPupils');
  if (!pupils) return;

  // На тач-устройствах курсора нет — выходим
  if (window.matchMedia('(pointer: coarse)').matches) return;

  // Уважаем reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const MAX_OFFSET = 2;      // максимум смещения в px (в системе viewBox)
  const INFLUENCE_RADIUS = 400; // на каком расстоянии от сокола начинаем реагировать
  let rafId = null;
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  function onMove(e) {
    // Позиция сокола на экране
    const svg = pupils.ownerSVGElement;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const falconCX = rect.left + rect.width / 2;
    const falconCY = rect.top + rect.height / 2;

    const dx = e.clientX - falconCX;
    const dy = e.clientY - falconCY;
    const dist = Math.hypot(dx, dy);

    if (dist > INFLUENCE_RADIUS) {
      targetX = 0;
      targetY = 0;
    } else {
      // Нормализуем вектор и умножаем на MAX_OFFSET.
      // Мягкое затухание: чем ближе — тем сильнее сдвиг (но не больше MAX_OFFSET).
      const strength = 1 - dist / INFLUENCE_RADIUS;
      const angle = Math.atan2(dy, dx);
      targetX = Math.cos(angle) * MAX_OFFSET * strength;
      targetY = Math.sin(angle) * MAX_OFFSET * strength;
    }

    scheduleFrame();
  }

  function scheduleFrame() {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(tick);
  }

  function tick() {
    rafId = null;
    // Плавная интерполяция (lerp) к цели
    currentX += (targetX - currentX) * 0.25;
    currentY += (targetY - currentY) * 0.25;

    // Если почти дошли — фиксируем и останавливаемся
    if (Math.abs(targetX - currentX) < 0.01 && Math.abs(targetY - currentY) < 0.01) {
      currentX = targetX;
      currentY = targetY;
    } else {
      scheduleFrame();
    }

    pupils.style.transform = `translate(${currentX}px, ${currentY}px)`;
  }

  document.addEventListener('mousemove', onMove, { passive: true });

  // При уходе курсора со страницы — возвращаем зрачки в центр
  document.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
    scheduleFrame();
  });

  // При скролле позиция сокола меняется — пересчитываем при следующем mousemove.
  // (onMove всегда читает rect заново, так что отдельный обработчик не нужен.)

  // Если пользователь включит reduced-motion на лету — сбрасываем
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener?.('change', (e) => {
    if (e.matches) {
      pupils.style.transform = '';
      document.removeEventListener('mousemove', onMove);
    }
  });
})();
// ============================================================
//  БЛОК ПРАЗДНИКА (ДЕНЬ НАРОДНОГО ЕДИНСТВА)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("holidaySection");
  if (!section) return;

  // Проверяем дату
  const now = new Date();
  const month = now.getMonth(); // 10 = Ноябрь
  const day = now.getDate();
  
  // Показываем только с 1 по 4 ноября
  const isHolidayPeriod = (month === 10 && day >= 1 && day <= 4);
  
  if (!isHolidayPeriod) return;

  // Показываем блок
  section.style.display = "block";

  // Меняем текст в зависимости от даты
  const titleEl = document.getElementById("holidayTitle");
  const subtitleEl = document.getElementById("holidaySubtitle");

  if (day === 4) {
    // 4 ноября — сам праздник
    if (titleEl) titleEl.textContent = "С Днём народного единства!";
    if (subtitleEl) subtitleEl.textContent = "Сегодня выходной день. Пар не будет.";
  } else {
    // 1, 2, 3 ноября — наступающий
    if (titleEl) titleEl.textContent = "С наступающим Днём народного единства!";
    if (subtitleEl) subtitleEl.textContent = "Скоро выходной — 4 ноября. Пар не будет.";
  }

  // Генерируем конфетти
  const confettiBox = section.querySelector(".holiday-confetti");
  if (confettiBox) {
    const colors = ["#1769E0", "#4C9AFF", "#E60000", "#FFFFFF"];
    
    for (let i = 0; i < 20; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const delay = Math.random() * 5;
      const dur = Math.random() * 3 + 4;
      const size = Math.random() * 4 + 6;
      
      piece.style.left = left + "%";
      piece.style.width = size + "px";
      piece.style.height = size + "px";
      piece.style.background = color;
      piece.style.animationDelay = delay + "s";
      piece.style.animationDuration = dur + "s";
      piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      
      confettiBox.appendChild(piece);
    }
  }
});