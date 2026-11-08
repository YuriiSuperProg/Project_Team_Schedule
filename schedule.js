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
  
  const repeatPattern = /^(.{2,})\1+$/; 
  const isRepeat = repeatPattern.test(clean);
  
  if (isRepeat) {
    const baseName = clean.match(/^(.{2,})\1/)[1]; 
    return { value: baseName, tooLong: false, isRepeat: true };
  }

  if (clean.length > 20) {
    return { value: clean.slice(0, 20), tooLong: true, isRepeat: false };
  }
  
  if (typeof isNameClean === "function" && !isNameClean(clean)) {
    return null; 
  }

  const vowels = (clean.match(/[аеёиоуыэюяaeiouy]/gi) || []).length;
  const vowelRatio = vowels / clean.length;
  const hasLongConsonantRun = /[бвгджзйклмнпрстфхцчшщbcdfghjklmnpqrstvwxz]{5,}/i.test(clean);

  if (vowelRatio < 0.25 || hasLongConsonantRun) {
    return null;
  }

  const finalName = clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
  const lowerClean = clean.toLowerCase();

  if (ALLOWED_NAMES.length > 0) {
    const isAllowed = ALLOWED_NAMES.some(n => {
      if (lowerClean === n) return true;
      if (lowerClean.length <= 4 && n.startsWith(lowerClean)) return true;
      return false;
    });

    if (!isAllowed) {
      if (clean.length <= 3) {
        return { value: finalName, tooLong: false, isRepeat: false };
      }
      return null;
    }
  }
  
  return { value: finalName, tooLong: false, isRepeat: false };
}

// ============================================================
//  СЕТКА ЗВОНКОВ И ДНИ
// ============================================================
const BELLS = { 
  1: "08:30–10:00", 
  2: "10:10–11:40", 
  3: "12:10–13:40", 
  4: "13:50–15:20", 
  5: "15:30–17:00",
  6: "17:10–18:40",
  7: "18:50–20:20"
};
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

    const name = result.value;

    if (result.isRepeat) {
      if (window.showGlobalToast) window.showGlobalToast(`🤖 Да ты циклическая программа! Оставили только "${name}".`);
    }

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
  const t = String(text || "")
    .replace(/^\d{2}\.\d{2}\.\d{4}(,\s*\d{2}\.\d{2}\.\d{4})*\s*/, "")
    .trim();

  let room = "";
  let textWithoutRoom = t;

  const roomRegex = /(?:ауд\.?|аудитория)\s*([А-Яа-яA-Za-z0-9\/\-]+)(?:\s*$|,)/i;
  const roomMatch = t.match(roomRegex);
  
  if (roomMatch) {
    room = roomMatch[1].trim();
    if (/с\/зал|спортивный/i.test(room)) room = "Спортивный зал";
    textWithoutRoom = t.replace(roomRegex, "").replace(/,\s*$/, "").trim();
  } else if (/спортивный зал|с\/зал/i.test(t)) {
    room = "Спортивный зал";
    textWithoutRoom = t.replace(/,\s*(?:ауд\.?)?\s*(?:спортивный зал|с\/зал)/i, "").trim();
  }

  let teacher = "";
  let subject = textWithoutRoom;

  const teacherRegex = /(?:,\s*|\s+)((?:к\.|д-р|д\.|ст\.|доцент|профессор|ассистент|преп\.?|ст\.преп\.?)[^А-ЯЁA-Z]*[А-ЯЁA-Z][а-яёa-z\-]+(?:\s+[А-ЯЁA-Z]\.(?:\s*[А-ЯЁA-Z]\.)?)?)$/;
  
  const teacherMatch = textWithoutRoom.match(teacherRegex);
  
  if (teacherMatch) {
    teacher = teacherMatch[1].trim();
    subject = textWithoutRoom.slice(0, teacherMatch.index).replace(/,\s*$/, "").trim();
  } else {
    const simpleTeacherRegex = /(?:,\s*|\s+)([А-ЯЁ][а-яё\-]+\s+[А-ЯЁ]\.\s*[А-ЯЁ]\.)$/;
    const simpleMatch = textWithoutRoom.match(simpleTeacherRegex);
    if (simpleMatch) {
      teacher = simpleMatch[1].trim();
      subject = textWithoutRoom.slice(0, simpleMatch.index).replace(/,\s*$/, "").trim();
    }
  }

  subject = subject.replace(/,\s*$/, "").trim();

  if (!teacher && /преп\./i.test(subject)) {
      const parts = subject.split(/преп\./i);
      if (parts.length > 1) {
          teacher = parts[1].trim();
          subject = parts[0].trim();
      }
  }

  return { subject, teacher, room };
}

function collectAllGroups(data) {
  const list = [];
  Object.keys(data).forEach(spec => Object.keys(data[spec]).forEach(course => Object.keys(data[spec][course]).forEach(group => {
    list.push({ spec, course, group, raw: data[spec][course][group] });
  })));
  return list;
}

function buildLessonCards(rawData, instType) {
  const data = rawData ? buildSchedule(rawData, instType) : SCHEDULE;
  
  const all = [];
  Object.keys(data).forEach(spec => Object.keys(data[spec]).forEach(course => Object.keys(data[spec][course]).forEach(group => {
    all.push({ spec, course, group, raw: data[spec][course][group] });
  })));

  const byDay = {};
  
  all.forEach(({ spec, group, raw }) => {
    Object.keys(raw).forEach(dayStr => {
      const dayIndex = Number(dayStr);
      (raw[dayStr] || []).forEach(p => {
        const time = p.time || BELLS[p.number] || (p.number + " пара");
        const parsed = parseText(p.text);
        const stars = p.star ? [p.star] : ["*", "**"];
        
        stars.forEach(star => {
          const key = [dayIndex, p.number, star, p.time || "", p.from || "", p.until || "", (p.except || []).join(","), parsed.subject.trim(), parsed.room.trim(), parsed.teacher].join("§");
          
          if (!byDay[dayIndex]) byDay[dayIndex] = {};
          if (!byDay[dayIndex][star]) byDay[dayIndex][star] = {};
          const bucket = byDay[dayIndex][star];
          
          if (!bucket[key]) {
            bucket[key] = { 
              time, number: p.number, subject: parsed.subject, room: parsed.room, 
              teachers: [], groups: [], subgroups: new Set(), 
              dates: p.dates || null, from: p.from || null, until: p.until || null, except: p.except || [],
              _tSet: new Set(), _gSet: new Set() 
            };
          }
          
          const card = bucket[key];
          
          const subValue = p.subgroup || p.subgroups;
          if (subValue) card.subgroups.add(subValue);
          
          if (parsed.teacher && !card._tSet.has(parsed.teacher)) { 
            card._tSet.add(parsed.teacher); card.teachers.push(parsed.teacher); 
          }
          
          const gKey = spec + "|" + group;
          if (!card._gSet.has(gKey)) { 
            card._gSet.add(gKey); card.groups.push({ spec, group }); 
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
        c.subgroups = Array.from(c.subgroups); delete c._tSet; delete c._gSet; return c; 
      }).sort((a, b) => a.number - b.number);
    });
  });
  return result;
}

function applyColor(spec) {
  const col = COLORS[spec] || { c: "#1769E0", soft: "#E8F1FF", text: "#1769E0" };
  const r = document.documentElement.style;
  r.setProperty("--c", col.c); r.setProperty("--c-soft", col.soft); r.setProperty("--c-text", col.text);
  const owl = document.querySelector(".owl");
  if (owl) owl.style.boxShadow = `0 10px 24px ${hexToRgba(col.c, 0.3)}`;
}

function flapFalcon() {
  const falcon = document.querySelector(".falcon-svg-wrap");
  if (!falcon || window.isAnimating) return; 
  const wings = falcon.querySelectorAll("#falconWingLeft, #falconWingRight");
  wings.forEach(wing => {
    const runningAnims = wing.getAnimations();
    runningAnims.forEach(a => a.cancel());
    const isLeft = wing.id === 'falconWingLeft';
    const angle = isLeft ? 15 : -15;
    wing.animate([{ transform: 'rotate(0deg)' }, { transform: `rotate(${angle}deg)`, offset: 0.4 }, { transform: 'rotate(0deg)' }], { duration: 400, easing: 'ease-in-out' });
  });
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16); const g = parseInt(hex.slice(3, 5), 16); const b = parseInt(hex.slice(5, 7), 16);
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
  
  document.querySelectorAll(".institution-btn").forEach(btn => {
    const active = btn.dataset.institution === state.institution;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
  
  const switchEl = document.getElementById("institutionSwitch");
  if (switchEl) switchEl.setAttribute("data-active", state.institution);

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
  // Управляем видимостью переключателя Колледж/Институт
  const switchWrap = document.querySelector(".institution-switch-wrap");
  if (switchWrap) {
    if (state.viewTeacher) {
      // Преподавателю переключатель не нужен — скрываем
      switchWrap.style.display = "none";
    } else {
      // Студенту — показываем
      switchWrap.style.display = "flex";
    }
  }

  // Если это режим преподавателя — уходим в его фильтры
  if (window.__renderTeacherFilters && state.viewTeacher) {
    return window.__renderTeacherFilters();
  }

  // --- РЕЖИМ СТУДЕНТА ---
  renderChips("specs", Object.keys(SCHEDULE), state.spec, spec => {
    state.spec = spec; state.course = null; state.group = null; state.subgroup = null; state.week = currentWeek();
    applyColor(spec); flapFalcon();
    if (window.saveUserGroup) window.saveUserGroup(state.spec, state.course, state.group, state.institution);
    showRandomWish(true); renderAll();
    window.dispatchEvent(new CustomEvent("specChanged", { detail: spec }));
    if (typeof maybeSayContextual === "function") maybeSayContextual(true);
  });

  if (state.spec) {
    renderChips("courses", Object.keys(SCHEDULE[state.spec]).sort(), state.course, course => {
      state.course = course; state.group = null; state.subgroup = null;
      if (window.saveUserGroup) window.saveUserGroup(state.spec, state.course, state.group, state.institution);
      renderAll();
      if (typeof maybeSayContextual === "function") maybeSayContextual(true);
    }, c => c + " курс");
  } else { $("courses").innerHTML = ""; }

  if (state.spec && state.course) {
    renderChips("groups", Object.keys(SCHEDULE[state.spec][state.course]).sort(), state.group, group => {
      state.group = group; state.subgroup = null;
      if (window.saveUserGroup) window.saveUserGroup(state.spec, state.course, state.group, state.institution);
      renderAll();
      if (typeof maybeSayContextual === "function") maybeSayContextual(true);
    });
  } else { $("groups").innerHTML = ""; }

  const rowSub = $("rowSubgroups");
  const subgroupsBox = $("subgroups");

  if (state.spec && state.course && state.group) {
    const groupData = SCHEDULE[state.spec][state.course][state.group];
    const hasSubgroups = Object.values(groupData).some(pairs => pairs.some(p => p.subgroup || p.subgroups));

    if (hasSubgroups && subgroupsBox) {
      rowSub.style.display = "flex"; subgroupsBox.innerHTML = "";
      [1, 2].forEach(sub => {
        const b = document.createElement("button");
        b.className = "chip" + (state.subgroup === sub ? " on" : "");
        b.textContent = `Подгруппа ${sub}`;
        b.onclick = () => {
          state.subgroup = sub; renderFilters(); renderSchedule(); renderDayProgress(); renderTomorrow();
          if (typeof maybeSayContextual === "function") maybeSayContextual(true);
        };
        subgroupsBox.appendChild(b);
      });
    } else { rowSub.style.display = "none"; }
  } else { if (rowSub) rowSub.style.display = "none"; }
}

function renderSchedule() {
  if (window.__renderTeacherSchedule && state.viewTeacher) {
    return window.__renderTeacherSchedule();
  }

  const out = $("out"), info = $("weekInfo");
  if (!out || !info) return;

  if (state.viewTeacher) {
    info.textContent = "Расписание преподавателя";
    out.innerHTML = "";

    if (!state.teacher) {
      out.innerHTML = "<div class='day-empty'>Выберите преподавателя через поиск</div>";
      return;
    }

    const w = WEEK_LIST[state.week];
    info.innerHTML = `Неделя ${w.star}<br><span style="font-size:0.9em; white-space:nowrap;">(${w.start} – ${w.end})</span>`;

    const collegeSchedule = buildLessonCards(RAW_DATA, "college");
    const instituteSchedule = buildLessonCards(VUZ_RAW_DATA, "institute");

    DAYS.forEach((day, index) => {
      const block = document.createElement("section");
      block.className = "day";
      const h2 = document.createElement("h2");
      h2.textContent = DAY_NAMES[day];
      block.appendChild(h2);
      
      const weekStart = parseDate(w.start);
      const lessonDate = new Date(weekStart);
      lessonDate.setDate(lessonDate.getDate() + index);
      const lessonDateKey = `${lessonDate.getFullYear()}-${String(lessonDate.getMonth() + 1).padStart(2, "0")}-${String(lessonDate.getDate()).padStart(2, "0")}`;

      const filterCards = (cards, instLabel) => {
        if (!cards) return [];
        return cards.filter(card => {
          if (card.dates && !card.dates.includes(lessonDateKey)) return false;
          if (card.from && lessonDateKey < card.from) return false;
          if (card.until && lessonDateKey > card.until) return false;
          if (card.except && card.except.includes(lessonDateKey)) return false;

                   // Умный поиск: ищем по фамилии (минимум 3 буквы), чтобы не путаться с инициалами
          const searchName = state.teacher.trim().toLowerCase().split(" ")[0]; // Берем только фамилию
          const hasTeacher = card.teachers.some(t => {
            const teacherName = t.toLowerCase();
            // Совпадение по фамилии (например, "Ерохина" найдёт "Ерохина О.А.")
            return teacherName.includes(searchName) || searchName.includes(teacherName.split(" ")[0]);
          });
          if (!hasTeacher) return false;

          card.institutionLabel = instLabel;
          return true;
        });
      };

      const collegeCards = filterCards((collegeSchedule[index] && collegeSchedule[index][w.star]) || [], "college");
      const instituteCards = filterCards((instituteSchedule[index] && instituteSchedule[index][w.star]) || [], "institute");

      const allCards = [...collegeCards, ...instituteCards];

      if (!allCards.length) {
        const empty = document.createElement("div"); empty.className = "day-empty"; empty.textContent = "Выходной";
        block.appendChild(empty); out.appendChild(block); return;
      }

      const grid = document.createElement("div"); grid.className = "cards";

      allCards.forEach(card => {
        const el = document.createElement("article"); el.className = "card";
        
        const chips = card.groups.map(g => {
          const col = (COLORS[g.spec] && COLORS[g.spec].c) || "#1769E0";
          return `<span class="group-chip" style="--chip-c:${col}">${g.group}</span>`;
        }).join("");

        const badge = card.institutionLabel === "institute" 
          ? `<span class="inst-badge inst-badge--institute">🎓 Институт</span>` 
          : `<span class="inst-badge inst-badge--college">🏫 Колледж</span>`;

        el.innerHTML = `
          <div class="card-header">
            <div class="t">${card.time}</div>
            ${badge}
          </div>
          <div class="s">${card.subject}</div>
          <div class="m">${card.room}</div>
          ${card.groups.length > 0 ? `<div class="card-groups">${chips}</div>` : ""}
        `;
        grid.appendChild(el);
      });

      block.appendChild(grid); out.appendChild(block);
    });
    return;
  }

  if (!state.spec || !state.course || !state.group) { 
    info.textContent = "Выберите группу"; out.innerHTML = ""; return; 
  }
  
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
    
    dayCards = dayCards.filter(card => card.groups.some(g => g.group === state.group));

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
  
  const mobileStart = document.createElement("span");
  mobileStart.className = "dc-mobile-edge-label start";
  mobileStart.textContent = BELLS[sorted[0].num].split("–")[0];
  trackWrap.appendChild(mobileStart);

  const mobileEnd = document.createElement("span");
  mobileEnd.className = "dc-mobile-edge-label end";
  mobileEnd.textContent = BELLS[sorted[sorted.length - 1].num].split("–")[1];
  trackWrap.appendChild(mobileEnd);

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
    status.textContent = "День завершён 🎉"; pairEl.textContent = "Хорошего отдыха!"; metaEl.textContent = ""; leftEl.textContent = "До завтра"; return;
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
    if(wrap) wrap.classList.add("hidden"); return; 
  }

  const now = new Date();
  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(now.getDate() + 1);
  tomorrowDate.setHours(0, 0, 0, 0);

  const tomorrowIndex = (tomorrowDate.getDay() + 6) % 7;
  const tomorrowKey = `${tomorrowDate.getFullYear()}-${String(tomorrowDate.getMonth() + 1).padStart(2, "0")}-${String(tomorrowDate.getDate()).padStart(2, "0")}`;

  const raw = SCHEDULE[state.spec][state.course][state.group]; 
  let pairs = raw[tomorrowIndex] || [];

  let weekIndex = state.week;
  if (now.getDay() === 0) {
    weekIndex = Math.min(state.week + 1, WEEK_LIST.length - 1);
  }
  const w = WEEK_LIST[weekIndex];

  pairs = pairs.filter(p => {
    if (p.star && p.star !== w.star) return false;
    if (p.dates && !p.dates.includes(tomorrowKey)) return false;
    if (p.from && tomorrowKey < p.from) return false;
    if (p.until && tomorrowKey > p.until) return false;
    if (p.except && p.except.includes(tomorrowKey)) return false;
    return true;
  });

  const dayName = DAY_NAMES[DAYS[tomorrowIndex]];
  const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  const dateStr = `${tomorrowDate.getDate()} ${months[tomorrowDate.getMonth()]}`;
  
  let headerHtml = `<div class="tm-header"><div class="tm-header-left"><span class="tm-icon">🌅</span><span class="tm-title">Завтра</span></div><div class="tm-header-right"><span class="tm-date">${dayName}, ${dateStr}</span></div></div>`;

  if (!pairs.length) { 
    wrap.innerHTML = headerHtml + `<div class="tm-empty">Пар <b>нет</b> — отдыхай! 🎉</div>`; 
    wrap.classList.remove("hidden"); if (window.unlockAchievement) window.unlockAchievement("tomorrowViewed"); return; 
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
    nameEditBtn.addEventListener("click", (e) => { e.preventDefault(); openNameModal(); });
  }

  const wishBtn = $("wishRefresh");
  if (wishBtn) wishBtn.addEventListener("click", () => showRandomWish(true));
  const themeToggleMenu = $("themeToggleMenu");
  if (themeToggleMenu) themeToggleMenu.addEventListener("click", toggleTheme);

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

    setBackgroundInert(false);
    if (mobileMenu.contains(document.activeElement)) { document.activeElement.blur(); }
    if (menuBtn) menuBtn.focus({ preventScroll: true });

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

  window.openFullscreenMenu = openFullscreenMenu;
  window.closeFullscreenMenu = closeFullscreenMenu;

  if (mobileMenu) mobileMenu.setAttribute("aria-hidden", "true");
  if (menuBtn) {
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.addEventListener("click", (event) => { event.preventDefault(); openFullscreenMenu(); });
  }
  if (closeMenuBtn) {
    closeMenuBtn.addEventListener("click", (event) => { event.preventDefault(); closeFullscreenMenu(); });
  }
  if (mobileMenu) {
    mobileMenu.addEventListener("click", (event) => { if (event.target === mobileMenu) closeFullscreenMenu(); });
  }
  document.addEventListener("keydown", (event) => {
    if (!menuIsOpen) return;
    if (event.key === "Escape") { event.preventDefault(); closeFullscreenMenu(); return; }
    if (event.key === "Tab") {
      const focusable = Array.from(mobileMenu.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(el => el.getClientRects().length > 0);
      if (!focusable.length) { event.preventDefault(); }
      else if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable[focusable.length - 1].focus(); }
      else if (!event.shiftKey && document.activeElement === focusable[focusable.length - 1]) { event.preventDefault(); focusable[0].focus(); }
    }
  });

  const roleCards = document.querySelectorAll(".role-card");
  roleCards.forEach(card => {
    card.addEventListener("click", () => {
      const role = card.dataset.role;
      localStorage.setItem("role", role);
      const roleScreen = $("roleScreen"); const scheduleScreen = $("scheduleScreen");
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
      if (typeof sayPhrase === "function") {
        phraseQueue = []; isSpeaking = false;
        if (state.viewTeacher) sayPhrase("Режим преподавателя. Найди себя через поиск 🔍", 5000);
        else sayPhrase("Отлично! Теперь выбери свою специальность 👇", 5000);
      }
    });
  });

  const savedRole = localStorage.getItem("role");
  if (savedRole) {
    const roleScreen = $("roleScreen"); const scheduleScreen = $("scheduleScreen");
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
    
    const linkHome = document.createElement("a"); linkHome.href = "index.html"; linkHome.className = "fs-link"; linkHome.style = "--i: 4;"; linkHome.innerHTML = "← На главную"; linkHome.onclick = () => closeFullscreenMenu(); dynamicNav.appendChild(linkHome);
  }

  document.querySelectorAll(".institution-btn").forEach(btn => btn.addEventListener("click", () => {
    if (btn.dataset.institution !== state.institution) activateInstitution(btn.dataset.institution, true);
  }));
  document.querySelectorAll(".institution-btn").forEach(btn => {
    const active = btn.dataset.institution === state.institution;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
  const switchElInit = document.getElementById("institutionSwitch");
  if (switchElInit) switchElInit.setAttribute("data-active", state.institution);
  buildMenu();
  renderAll();

  setInterval(() => { if (!state.viewTeacher) { renderDayProgress(); renderTomorrow(); showRandomWish(false); } }, 60000);
});

// ============================================================
//  МАСКОТ СОКОЛ: КЛИКИ, АНИМАЦИИ КРЫЛЬЕВ И КЛЮВА
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const mascot = document.getElementById("mascot");
  const falconWrap = document.getElementById("falconMascot");
  const bubble = document.getElementById("mascotBubble");
  
  if (!mascot || !falconWrap) return;

  let clickCount = 0;
  let lastClickTime = 0;
  let isAnimating = false;
  let currentFlyAnim = null;
  let currentChirpAnim = null;

  // Функция для нотки при чириканье
  function spawnNote() {
    const old = falconWrap.querySelector(".falcon-note");
    if (old) old.remove();

    const note = document.createElement("span");
    note.className = "falcon-note";
    note.textContent = "🎵";
    falconWrap.appendChild(note);
    requestAnimationFrame(() => note.classList.add("fly"));
    setTimeout(() => note.remove(), 1000);
  }

  falconWrap.addEventListener("click", () => {
    if (isAnimating) return;

    const now = Date.now();
    if (now - lastClickTime > 10000) clickCount = 0; // Сброс через 10 сек
    lastClickTime = now;
    clickCount++;

    const reaction = clickCount % 2;
    isAnimating = true;

    if (reaction === 0) {
      // === ВЗЛЁТ (машет крыльями) ===
      if (currentFlyAnim) currentFlyAnim.cancel();
      if (currentChirpAnim) currentChirpAnim.cancel();

      // Анимация всего тела
      currentFlyAnim = falconWrap.animate([
        { transform: 'translateY(0) scale(1)' },
        { transform: 'translateY(-30px) scale(1.05)', offset: 0.4 },
        { transform: 'translateY(0) scale(1)' }
      ], {
        duration: 1200,
        easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
      });

      // Анимация КРЫЛЬЕВ
      const wings = falconWrap.querySelectorAll("#falconWingLeft, #falconWingRight");
      wings.forEach(wing => {
        const isLeft = wing.id === 'falconWingLeft';
        const angle = isLeft ? 40 : -40; // Размах
        wing.animate([
          { transform: 'rotate(0deg)' },
          { transform: `rotate(${angle}deg)`, offset: 0.4 },
          { transform: 'rotate(0deg)' }
        ], {
          duration: 1200,
          easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
        });
      });

      currentFlyAnim.onfinish = () => { isAnimating = false; };
      setTimeout(() => { isAnimating = false; }, 1300);
      
      if (bubble) {
        bubble.textContent = "Вжух! ✈️";
        bubble.classList.add("show");
        setTimeout(() => bubble.classList.remove("show"), 2000);
      }

    } else {
      // === ЧИРИКАНЬЕ (двигает клювом) ===
      if (currentFlyAnim) currentFlyAnim.cancel();
      if (currentChirpAnim) currentChirpAnim.cancel();

      // Легкое покачивание тела
      currentChirpAnim = falconWrap.animate([
        { transform: 'translateY(0) scale(1)' },
        { transform: 'translateY(-2px) scale(1.02)', offset: 0.3 },
        { transform: 'translateY(0) scale(1)' }
      ], {
        duration: 600,
        easing: 'ease-in-out'
      });

      // Анимация КЛЮВА
      const beak = falconWrap.querySelector("#falconBeak");
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
      
      spawnNote();
      if (bubble) {
        bubble.textContent = "Чирик! 🎵";
        bubble.classList.add("show");
        setTimeout(() => bubble.classList.remove("show"), 2000);
      }
    }
  });
});
// ============================================================
//  КАБИНЕТЫ: ИНТЕРАКТИВНАЯ СЕТКА
// ============================================================
let roomCurrentDay = 'today';
let roomQuickFilter = 'all'; // 'all', 'now', 'next'

function switchView(view) {
  const btnSchedule = document.getElementById("btnViewSchedule");
  const btnRooms = document.getElementById("btnViewRooms");
  const scheduleContent = document.getElementById("scheduleContent");
  const roomsScreen = document.getElementById("roomsScreen");
  const activistHeader = document.getElementById("activistHeader");

  if (view === 'rooms') {
    scheduleContent.style.display = "none";
    roomsScreen.style.display = "block";
    btnSchedule.classList.remove("active");
    btnRooms.classList.add("active");
    
    if (activistHeader) {
      activistHeader.style.display = (state.viewTeacher || state.mode === 'teacher') ? "none" : "flex";
    }
    
    renderRoomsGrid();
  } else {
    scheduleContent.style.display = "block";
    roomsScreen.style.display = "none";
    btnSchedule.classList.add("active");
    btnRooms.classList.remove("active");
  }
}

function setRoomDay(day) {
  roomCurrentDay = day;
  document.getElementById("roomDayToday").classList.toggle("active", day === 'today');
  document.getElementById("roomDayTomorrow").classList.toggle("active", day === 'tomorrow');
  renderRoomsGrid();
}

function setQuickPair(type, btn) {
  roomQuickFilter = type;
  
  // 1. Снимаем активный класс со ВСЕХ кнопок
  document.querySelectorAll(".pill-btn").forEach(b => b.classList.remove("active"));
  
  // 2. Добавляем активный класс только на ту, которую нажали
  if (btn) {
    btn.classList.add("active");
  } else {
    // Если btn не передан (вызов из кода), находим нужную кнопку по порядку
    const btns = document.querySelectorAll(".pill-btn");
    if (type === 'now' && btns[0]) btns[0].classList.add("active");
    if (type === 'next' && btns[1]) btns[1].classList.add("active");
    if (type === 'all' && btns[2]) btns[2].classList.add("active");
  }
  
  // 3. Перерисовываем сетку кабинетов
  renderRoomsGrid();
}

function renderRoomsGrid() {
  const container = document.getElementById("roomsGridContainer");
  if (!container) return;

  // 1. Определяем день
  const targetDate = new Date();
  if (roomCurrentDay === 'tomorrow') targetDate.setDate(targetDate.getDate() + 1);
  const dayIndex = (targetDate.getDay() + 6) % 7;
  const dateKey = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, "0")}-${String(targetDate.getDate()).padStart(2, "0")}`;
  const weekStar = WEEK_LIST[state.week].star; 

  // 2. Определяем, какие пары показывать
  let displayPairs = [1, 2, 3, 4, 5, 6, 7];
  
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const BELL_MIN = {};
  Object.keys(BELLS).forEach(n => {
    const [start, end] = BELLS[n].split("–");
    BELL_MIN[n] = { start: toMin(start), end: toMin(end), num: Number(n) };
  });

  if (roomQuickFilter === 'now') {
    let currentPair = null;
    for (let n in BELL_MIN) {
      if (nowMin >= BELL_MIN[n].start && nowMin <= BELL_MIN[n].end) {
        currentPair = Number(n);
        break;
      }
    }
    displayPairs = currentPair ? [currentPair] : [];
  } else if (roomQuickFilter === 'next') {
    let nextPair = null;
    for (let n in BELL_MIN) {
      if (nowMin < BELL_MIN[n].start) {
        nextPair = Number(n);
        break;
      }
    }
    displayPairs = nextPair ? [nextPair] : [];
  }

  if (displayPairs.length === 0) {
    container.innerHTML = "<div class='rooms-empty'>Сейчас нет пар (перемена или отдых)</div>";
    return;
  }

  // 3. Собираем все кабинеты
  const allRooms = new Set();
  const busyMap = {}; 

  const processBase = (rawData, instType) => {
    const data = buildSchedule(rawData, instType);
    Object.keys(data).forEach(spec => {
      Object.keys(data[spec]).forEach(course => {
        Object.keys(data[spec][course]).forEach(group => {
          const pairs = data[spec][course][group][dayIndex] || [];
          pairs.forEach(p => {
            if (p.star && p.star !== weekStar) return;
            if (p.dates && !p.dates.includes(dateKey)) return;
            if (p.from && dateKey < p.from) return;
            if (p.until && dateKey > p.until) return;
            if (p.except && p.except.includes(dateKey)) return;

            const parsed = parseText(p.text);
            const room = parsed.room.replace(/[^А-Яа-я0-9\-\/\s]/g, "").trim();
            if (!room) return;

            allRooms.add(room);
            if (!busyMap[room]) busyMap[room] = {};
            
            const existing = busyMap[room][p.number];
            if (existing) {
              if (!existing.group.includes(group)) existing.group += `, ${group}`;
            } else {
              busyMap[room][p.number] = {
                group: group,
                subj: parsed.subject.replace(/\s*\(.*?\)\s*/g, "")
              };
            }
          });
        });
      });
    });
  };

  processBase(RAW_DATA, "college");
  processBase(VUZ_RAW_DATA, "institute");

  // 4. Фильтр по номеру аудитории
  const searchInput = document.getElementById("roomSearchInput");
  const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : "";

  let sortedRooms = Array.from(allRooms).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  
  if (searchQuery) {
    sortedRooms = sortedRooms.filter(r => r.toLowerCase().includes(searchQuery));
  }

  if (sortedRooms.length === 0) {
    container.innerHTML = "<div class='rooms-empty'>Кабинеты не найдены</div>";
    return;
  }

  // 5. Рендерим карточки
  let html = `<div class="rooms-mobile-list">`;
  
  sortedRooms.forEach(room => {
    let pairsHtml = '';
    let hasFreeInDisplay = false;
    
    displayPairs.forEach(i => {
      const busyInfo = busyMap[room] && busyMap[room][i];
      if (busyInfo) {
        const safeSubj = busyInfo.subj.replace(/"/g, "&quot;");
        const safeGroup = busyInfo.group.replace(/"/g, "&quot;");
        const safeRoom = room.replace(/"/g, "&quot;");
        
        pairsHtml += `
          <div class="room-pair busy" 
               data-subject="${safeSubj}" 
               data-groups="${safeGroup}" 
               data-room="${safeRoom}">
            <span class="pair-num">${i}</span>
            <span class="pair-icon">❌</span>
          </div>
        `;
      } else {
        hasFreeInDisplay = true;
        pairsHtml += `
          <div class="room-pair free">
            <span class="pair-num">${i}</span>
            <span class="pair-icon">✅</span>
          </div>
        `;
      }
    });

    const highlightClass = hasFreeInDisplay ? "highlight-free" : "";

    html += `
      <div class="room-card ${highlightClass}">
        <div class="room-header">
          <span class="room-name">🚪 ${room}</span>
        </div>
        <div class="room-pairs">
          ${pairsHtml}
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;

  // Навешиваем обработчики на занятые кнопки
  container.querySelectorAll(".room-pair.busy").forEach(el => {
    el.addEventListener("click", () => {
      const subj = el.getAttribute("data-subject") || "—";
      const groups = el.getAttribute("data-groups") || "—";
      const room = el.getAttribute("data-room") || "—";
      
      const modal = document.getElementById("pairInfoModal");
      if (!modal) return;

      document.getElementById("pairInfoSubject").textContent = subj;
      document.getElementById("pairInfoGroups").textContent = groups;
      document.getElementById("pairInfoRoom").textContent = room;
      modal.classList.add("open");
    });
  });
}

// Закрытие модалки по клику вне окна
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("pairInfoModal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("open");
    });
  }
});

// ============================================================
//  УМНЫЙ ПОИСК ПО КАБИНЕТАМ (С ЗАДЕРЖКОЙ)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("roomSearchInput");
  if (!searchInput) return;

  let searchTimeout;

  searchInput.addEventListener("input", () => {
    // Очищаем предыдущий таймер
    clearTimeout(searchTimeout);
    
    // Ставим новый с задержкой 300 мс (debounce)
    searchTimeout = setTimeout(() => {
      renderRoomsGrid();
    }, 300);
  });
});

// ============================================================
//  АВТО-ФОРМАТИРОВАНИЕ ВВОДА КАБИНЕТА (228 -> 2-28)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("roomSearchInput");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    let value = e.target.value;

    // 1. Убираем все нецифровые символы (кроме дефиса)
    value = value.replace(/[^\d-]/g, "");

    // 2. Если есть цифры и нет дефиса, ставим его после первой цифры
    // (например, "228" -> "2-28")
    if (/^\d{2,}$/.test(value)) {
      // Если ввели больше 1 цифры подряд, вставляем дефис после первой
      if (value.length > 1 && value.indexOf("-") === -1) {
        value = value[0] + "-" + value.slice(1);
      }
    }

    // 3. Ограничиваем длину (1 цифра этажа + дефис + 2 цифры кабинета = 4 символа)
    if (value.length > 4 && value.indexOf("-") !== -1) {
       // Обрезаем лишнее
       value = value.slice(0, 4);
    }

    // 4. Если пользователь сам стер дефис, не мешаем ему (например, стер всё)
    if (value === "-" || value === "") {
      value = "";
    }

    // Применяем отформатированное значение обратно в поле
    e.target.value = value;

    // Вызываем фильтрацию (если мы делали задержку, она сработает)
    if (typeof renderRoomsGrid === "function") {
      renderRoomsGrid();
    }
  });
});