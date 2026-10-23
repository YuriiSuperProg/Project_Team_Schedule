// ============================================================
//  СЕТКА ЗВОНКОВ
// ============================================================
const BELLS = {
  1: "08:30–10:00",
  2: "10:10–11:40",
  3: "12:10–13:40",
  4: "13:50–15:20",
  5: "15:30–17:00"
};

// ============================================================
//  ДНИ
// ============================================================
const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const DAY_NAMES = {
  Пн: "Понедельник", Вт: "Вторник", Ср: "Среда",
  Чт: "Четверг", Пт: "Пятница", Сб: "Суббота", Вс: "Воскресенье"
};

// ============================================================
//  ПОЖЕЛАНИЯ
// ============================================================
const WISHES = {
  "ЮСП": [
    { emoji: "⚖️", text: "Сегодня отличный день, чтобы всё успеть — даже закон!" },
    { emoji: "📜", text: "Учись с улыбкой — и кодексы запомнятся сами." },
    { emoji: "🤵", text: "Впереди только победы. В суде и в жизни!" },
    { emoji: "📚", text: "Каждая пара — шаг к твоей блестящей карьере." },
    { emoji: "🕵️", text: "Ты — лучший детектив в своей собственной истории успеха." },
    { emoji: "🧑‍💼", text: "Помни: правда на твоей стороне, а удача — в кармане." },
    { emoji: "🔨", text: "Сегодня всё по плечу. Даже самые строгие преподаватели." },
    { emoji: "📝", text: "Твой конспект — это карта к сокровищам знаний!" },
    { emoji: "🚀", text: "Вперёд к знаниям — легко и с удовольствием!" },
    { emoji: "📖", text: "Улыбайся! Ведь у тебя всё под контролем." }
  ],
  "ИСП": [
    { emoji: "💻", text: "Пусть код компилируется, а жизнь — радует!" },
    { emoji: "🐛", text: "Пусть багов будет мало, а хороших оценок — много." },
    { emoji: "🚀", text: "Ты — творец цифровых миров. Создавай и вдохновляйся!" },
    { emoji: "☕", text: "Сегодня идеальный день для продуктивного кодинга." },
    { emoji: "🤖", text: "Твой потенциал безграничен, как массив без размера." },
    { emoji: "🧠", text: "Каждая решённая задача делает тебя сильнее!" },
    { emoji: "🔥", text: "Гори, но не выгорай. Отдых тоже важен!" },
    { emoji: "⌨️", text: "Пусть каждая строка кода приносит радость." },
    { emoji: "🎯", text: "Сегодня отличный день для новых открытий!" },
    { emoji: "🍕", text: "Ты большой молодец. Не забывай вкусно кушать!" }
  ],
  "РУПО": [
    { emoji: "💻", text: "Программирование — это магия, и ты — волшебник!" },
    { emoji: "🐛", text: "Пусть все баги превращаются в полезные фичи!" },
    { emoji: "🎧", text: "Хорошая музыка и хороший код — отличный дуэт." },
    { emoji: "🚀", text: "К знаниям — на полной скорости и с улыбкой!" },
    { emoji: "🤯", text: "Твой мозг способен на многое. Даже на эту лабу!" },
    { emoji: "🧠", text: "Ты умнее, чем кажется. Особенно после пары!" },
    { emoji: "💾", text: "Записывай — будущее скажет тебе спасибо." },
    { emoji: "🎮", text: "Отдыхай с умом, учись с интересом!" },
    { emoji: "⚡", text: "Ты заряжен на успех. Докажи это миру!" }
  ],
  "ЗСП": [
    { emoji: "🌱", text: "Расти, как цветок под солнцем — ярко и смело!" },
    { emoji: "🌍", text: "Наш мир огромен, и ты делаешь его лучше." },
    { emoji: "🍃", text: "Спокойствие и гармония. Всё идёт как надо." },
    { emoji: "🌳", text: "Дыши глубже и наслаждайся процессом обучения." },
    { emoji: "🏞️", text: "Знания — это новые горизонты. Открывай их!" },
    { emoji: "🌿", text: "Маленькие шаги ведут к большим победам." },
    { emoji: "☀️", text: "Пусть сегодняшний день будет солнечным и добрым!" },
    { emoji: "🪴", text: "Всё растёт с любовью и заботой. Твои знания тоже." },
    { emoji: "🗺️", text: "Твой маршрут — к мечте. И шаг за шагом ты идёшь по нему." }
  ],
  "ЭСП": [
    { emoji: "📈", text: "Пусть твой личностный рост всегда идёт вверх!" },
    { emoji: "💸", text: "Инвестиции в себя — самые выгодные!" },
    { emoji: "💰", text: "Ты — ценный актив. Помни об этом." },
    { emoji: "📊", text: "Умные люди всегда в цене. И ты среди них." },
    { emoji: "🧮", text: "Всё сходится! Деньги, учёба и отличное настроение." },
    { emoji: "🏦", text: "Твоё будущее — надёжный банк с большими процентами." },
    { emoji: "💼", text: "Сегодня ты студент, а завтра — покоритель вершин!" },
    { emoji: "📉", text: "Любой график можно развернуть вверх. Как и твою учёбу." },
    { emoji: "🧠", text: "Твои знания — твой золотой запас." }
  ]
};

// ============================================================
//  СОСТОЯНИЕ
// ============================================================
let SCHEDULE = {};
let state = { spec: null, course: null, group: null, week: 0 };

const $ = id => document.getElementById(id);

// ============================================================
//  ХЕЛПЕРЫ ВРЕМЕНИ
// ============================================================
function toMin(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function fmtLeft(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h) return `${h} ч ${m} мин`;
  return `${m} мин`;
}

// ============================================================
//  ТЁМНАЯ ТЕМА
// ============================================================
function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") document.documentElement.classList.add("dark");
  updateThemeIcon();
}

function updateThemeIcon() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  const isDark = document.documentElement.classList.contains("dark");
  btn.textContent = isDark ? "☀️" : "🌙";
}

function toggleTheme() {
  document.documentElement.classList.toggle("dark");
  const isDark = document.documentElement.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeIcon();
}

// ============================================================
//  ИМЯ
// ============================================================
function getUserName() { return localStorage.getItem("userName") || ""; }
function setUserName(name) { localStorage.setItem("userName", name.trim()); }

function applyName() {
  const saved = getUserName();
  const el = document.getElementById("userName");
  if (el) el.textContent = saved || "друг";
}

function askName() {
  const current = getUserName();
  const entered = prompt("Как тебя зовут?", current || "");
  if (entered && entered.trim()) {
    setUserName(entered);
    applyName();
  }
}

// ============================================================
//  ГРУППА
// ============================================================
const GROUP_KEY = "savedGroup";

function saveGroup() {
  if (!state.spec || !state.course || !state.group) return;
  try {
    localStorage.setItem(GROUP_KEY, JSON.stringify({
      spec: state.spec, course: state.course, group: state.group
    }));
  } catch (e) { /* ignore */ }
}

function loadGroup() {
  try {
    const raw = localStorage.getItem(GROUP_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data || !data.spec || !data.group) return false;
    if (!SCHEDULE[data.spec] || !SCHEDULE[data.spec][data.course] || !SCHEDULE[data.spec][data.course][data.group]) return false;

    state.spec = data.spec;
    state.course = data.course;
    state.group = data.group;
    applyColor(data.spec);
    return true;
  } catch (e) {
    return false;
  }
}

function clearGroup() {
  localStorage.removeItem(GROUP_KEY);
  state.spec = null; state.course = null; state.group = null; state.week = currentWeek();
  applyColor("ИСП");
}

// ============================================================
//  ПОЖЕЛАНИЕ (С ПРОВЕРКОЙ ПО ВРЕМЕНИ ДЛЯ КАЖДОЙ СПЕЦИАЛЬНОСТИ)
// ============================================================
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
  const interval = 1.5 * 60 * 60 * 1000;

  if (!force && (now - lastChange < interval)) {
    return; 
  }

  localStorage.setItem(storageKey, now.toString());
  
  if (lastWishIndex[spec] === undefined) lastWishIndex[spec] = -1;
  let i;
  do { i = Math.floor(Math.random() * list.length); } while (i === lastWishIndex[spec] && list.length > 1);
  lastWishIndex[spec] = i;
  
  const w = list[i];
  emojiEl.textContent = w.emoji;
  textEl.textContent = w.text;
  
  wrap.classList.remove("changing");
  void wrap.offsetWidth;
  wrap.classList.add("changing");
}

// ============================================================
//  НЕДЕЛИ
// ============================================================
const WEEK_LIST = WEEKS.map(line => {
  const [start, end, star] = line.split("|").map(s => s.trim());
  return { start, end, star };
});
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

// ============================================================
//  ПАРСИНГ
// ============================================================
function parseText(text) {
  let t = text.replace(/^\d{2}\.\d{2}\.\d{4}(,\s*\d{2}\.\d{2}\.\d{4})*\s*/, "").trim();
  
  const teacherMatch = t.match(/преп\.\s*([^,]+)/);
  const teacher = teacherMatch ? teacherMatch[1].trim() : "";
  
  const roomMatch = t.match(/(?:ауд\.|спортивный зал)\s*([^,]+?)(?:\s|$)/i);
  let room = roomMatch ? roomMatch[1].trim() : "";
  
  if (t.toLowerCase().includes("спортивный зал")) {
    room = "Спортивный зал";
  }

  const subject = t.split("преп.")[0].trim().replace(/,\s*$/, "");
  return { subject, teacher, room };
}

function parseDay(pairs) {
  const result = { "*": [], "**": [] };
  pairs.forEach(p => {
    const time = BELLS[p.number] || (p.number + " пара");
    const parsed = parseText(p.text);
    const item = { time, ...parsed, subgroup: p.subgroup };
    if (p.star === "*") result["*"].push(item);
    else if (p.star === "**") result["**"].push(item);
    else { result["*"].push(item); result["**"].push(item); }
  });
  return result;
}

// ============================================================
//  АГРЕГАЦИЯ ПОТОКОВЫХ ПАР
// ============================================================
function collectAllGroups() {
  const list = [];
  Object.keys(SCHEDULE).forEach(spec => {
    Object.keys(SCHEDULE[spec]).forEach(course => {
      Object.keys(SCHEDULE[spec][course]).forEach(group => {
        list.push({ spec, course, group, raw: SCHEDULE[spec][course][group] });
      });
    });
  });
  return list;
}

function lessonKey(dayIndex, p, parsed, star, groupName) {
  const sub = p.subgroup ? `|sub${p.subgroup}` : "";
  const dates = p.dates ? `|d${p.dates.join(",")}` : "";
  
  const isLecture = parsed.subject.includes("(л.)");
  const teacherKey = isLecture ? "" : `|t${parsed.teacher}`;

  return [
    dayIndex, p.number, star, parsed.subject.trim(),
    parsed.room.trim(), sub, dates, teacherKey
  ].join("§");
}

function buildLessonCards() {
  const all = collectAllGroups();
  const byDay = {};

  all.forEach(({ spec, group, raw }) => {
    Object.keys(raw).forEach(dayStr => {
      const dayIndex = Number(dayStr);
      const pairs = raw[dayStr] || [];
      pairs.forEach(p => {
        const time = BELLS[p.number] || (p.number + " пара");
        const parsed = parseText(p.text);
        const stars = p.star ? [p.star] : ["*", "**"];
        stars.forEach(star => {
          const key = lessonKey(dayIndex, p, parsed, star, group);
          if (!byDay[dayIndex]) byDay[dayIndex] = {};
          if (!byDay[dayIndex][star]) byDay[dayIndex][star] = {};
          const bucket = byDay[dayIndex][star];
          if (!bucket[key]) {
            bucket[key] = {
              time, number: p.number,
              subject: parsed.subject, room: parsed.room,
              teachers: [], groups: [],
              subgroup: p.subgroup || null,
              dates: p.dates || null,
              _tSet: new Set(), _gSet: new Set()
            };
          }
          const card = bucket[key];
          if (parsed.teacher && !card._tSet.has(parsed.teacher)) {
            card._tSet.add(parsed.teacher);
            card.teachers.push(parsed.teacher);
          }
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
      result[d][star] = Object.values(byDay[d][star])
        .map(c => { delete c._tSet; delete c._gSet; return c; })
        .sort((a, b) => a.number - b.number);
    });
  });
  return result;
}

// ============================================================
//  ЦВЕТ
// ============================================================
function applyColor(spec) {
  const col = COLORS[spec] || { c: "#1769E0", soft: "#E8F1FF", text: "#1769E0" };
  const r = document.documentElement.style;
  r.setProperty("--c", col.c);
  r.setProperty("--c-soft", col.soft);
  r.setProperty("--c-text", col.text);
}

// ============================================================
//  СБОРКА
// ============================================================
function buildSchedule(raw) {
  const result = {};
  Object.keys(raw).forEach(groupName => {
    const match = groupName.match(/^([А-ЯЁ]+)-/);
    if (!match) return;
    const spec = match[1];
    const course = GROUP_TO_COURSE[groupName];
    if (!course) return;
    if (!result[spec]) result[spec] = {};
    if (!result[spec][course]) result[spec][course] = {};
    result[spec][course][groupName] = raw[groupName];
  });
  return result;
}

// ============================================================
//  ЧИПЫ
// ============================================================
function renderChips(containerId, items, current, onClick, label = x => x) {
  const box = $(containerId);
  box.innerHTML = "";
  items.forEach(item => {
    const b = document.createElement("button");
    b.className = "chip" + (current === item ? " on" : "");
    b.textContent = label(item);
    b.onclick = () => onClick(item);
    box.appendChild(b);
  });
}

// ============================================================
//  ФИЛЬТРЫ
// ============================================================
function renderFilters() {
  if (window.__renderTeacherFilters && state.viewTeacher) {
    return window.__renderTeacherFilters();
  }

  renderChips("specs", Object.keys(SCHEDULE), state.spec, spec => {
    state.spec = spec; state.course = null; state.group = null; state.week = currentWeek();
    applyColor(spec); saveGroup(); 
    showRandomWish(true); 
    renderAll();
  });

  if (state.spec) {
    renderChips("courses", Object.keys(SCHEDULE[state.spec]).sort(), state.course, course => {
      state.course = course; state.group = null; saveGroup(); renderAll();
    }, c => c + " курс");
  } else $("courses").innerHTML = "";

  if (state.spec && state.course) {
    renderChips("groups", Object.keys(SCHEDULE[state.spec][state.course]).sort(), state.group, group => {
      state.group = group; saveGroup(); renderAll();
    });
  } else $("groups").innerHTML = "";
}

// ============================================================
//  РАСПИСАНИЕ
// ============================================================
function renderSchedule() {
  if (window.__renderTeacherSchedule && state.viewTeacher) {
    return window.__renderTeacherSchedule();
  }

  const out = $("out"), info = $("weekInfo");
  if (!state.spec || !state.course || !state.group) {
    info.textContent = "Выберите группу";
    out.innerHTML = "";
    return;
  }

  const w = WEEK_LIST[state.week];
  info.textContent = `Неделя ${w.star}   (${w.start} – ${w.end})`;
  out.innerHTML = "";

  const cardsByDay = buildLessonCards();

  DAYS.forEach((day, index) => {
    const block = document.createElement("section");
    block.className = "day";
    const h2 = document.createElement("h2");
    h2.textContent = DAY_NAMES[day];
    block.appendChild(h2);

    let dayCards = (cardsByDay[index] && cardsByDay[index][w.star]) || [];
    dayCards = dayCards.filter(card =>
      card.groups.some(g => g.group === state.group)
    );

    if (!dayCards.length) {
      const empty = document.createElement("div");
      empty.className = "day-empty";
      empty.textContent = "Выходной";
      block.appendChild(empty);
      out.appendChild(block);
      return;
    }

    const grid = document.createElement("div");
    grid.className = "cards";

    dayCards.forEach(card => {
      const el = document.createElement("article");
      el.className = "card";

      const teachers = card.teachers.length ? card.teachers.join(", ") : "";
      const subNote = card.subgroup
        ? ` <small style="color:#6b6b6b;font-weight:400">(подгр. ${card.subgroup})</small>`
        : "";

      const chips = card.groups.map(g => {
        const col = (COLORS[g.spec] && COLORS[g.spec].c) || "#1769E0";
        const isMine = (g.group === state.group);
        return `<span class="group-chip${isMine ? " mine" : ""}"
                     style="--chip-c:${col}">${g.group}</span>`;
      }).join("");

      el.innerHTML = `
        <div class="t">${card.time}</div>
        <div class="s">${card.subject}${subNote}</div>
        <div class="m">${card.room}${teachers ? " · " + teachers : ""}</div>
        ${card.groups.length > 1 ? `<div class="card-groups">${chips}</div>` : ""}
      `;
      grid.appendChild(el);
    });

    block.appendChild(grid);
    out.appendChild(block);
  });
}

// ============================================================
//  ВИДЖЕТ ДНЯ (ВРЕМЯ ПАР НА ШКАЛЕ)
// ============================================================
function renderDayProgress() {
  const card = $("dayCard"), status = $("dayStatus"), percent = $("dayPercent");
  const ringFill = $("dcRingFill"), pairEl = $("dcPair"), metaEl = $("dcMeta");
  const leftEl = $("dayLeft"), track = $("dcTrack"), labels = $("dcLabels");

  if (!card || !track) return;
  if (state.viewTeacher) { card.classList.add("hidden"); return; }
  if (!state.spec || !state.group || state.week !== currentWeek()) { card.classList.add("hidden"); return; }

  const now = new Date();
  const todayIndex = (now.getDay() + 6) % 7;
  const raw = SCHEDULE[state.spec][state.course][state.group];
  let pairs = raw[todayIndex];

  if (!pairs || !pairs.length) { card.classList.add("hidden"); return; }

  const week = WEEK_LIST[state.week];
  pairs = pairs.filter(p => !p.star || p.star === week.star);
  if (!pairs.length) { card.classList.add("hidden"); return; }

  const BELL_MIN = {};
  Object.keys(BELLS).forEach(n => {
    const [start, end] = BELLS[n].split("–");
    BELL_MIN[n] = { start: toMin(start), end: toMin(end), num: Number(n) };
  });

  const seenNum = new Set();
  const sorted = pairs
    .filter(p => BELL_MIN[p.number])
    .filter(p => { if (seenNum.has(p.number)) return false; seenNum.add(p.number); return true; })
    .map(p => ({ ...BELL_MIN[p.number], pair: p }))
    .sort((a, b) => a.start - b.start);

  if (!sorted.length) { card.classList.add("hidden"); return; }

  const dayStart = sorted[0].start;
  const dayEnd = sorted[sorted.length - 1].end;
  const nowMin = now.getHours() * 60 + now.getMinutes();

  card.classList.remove("hidden");

  const total = dayEnd - dayStart;
  let passed = nowMin - dayStart;
  passed = Math.max(0, Math.min(total, passed));
  const percentVal = Math.round((passed / total) * 100);
  percent.textContent = percentVal + "%";

  const dash = 2 * Math.PI * 52;
  ringFill.style.strokeDasharray = dash;
  ringFill.style.strokeDashoffset = dash - (dash * percentVal / 100);

  // --- УДАЛЯЕМ СТАРЫЕ ЭЛЕМЕНТЫ ---
  const existingBtn = document.getElementById("dcMobileBtn");
  if (existingBtn) existingBtn.remove();

  // --- ДОБАВЛЯЕМ КНОПКУ В БЛОК ИНФОРМАЦИИ (ТОЛЬКО НА МОБИЛКЕ) ---
  const isMobile = window.innerWidth <= 640;
  if (isMobile) {
    const btn = document.createElement("button");
    btn.id = "dcMobileBtn";
    btn.className = "dc-mobile-btn";
    btn.innerHTML = "🕒 Посмотреть время пар";
    btn.onclick = () => openMobileBells(sorted);
    
    // Вставляем кнопку прямо после кнопки "До звонка"
    leftEl.after(btn);
  }

  // --- ОТРИСОВКА ШКАЛЫ ---
  track.innerHTML = "";
  labels.innerHTML = "";

  const trackWrap = document.createElement("div");
  trackWrap.style.cssText = "position:relative;width:100%;height:100%;";
  track.appendChild(trackWrap);

  const bg = document.createElement("div");
  bg.style.cssText = "position:absolute;top:0;left:0;right:0;bottom:0;background:var(--line);border-radius:999px;";
  trackWrap.appendChild(bg);

  for (let i = 0; i < sorted.length; i++) {
    const item = sorted[i];
    const leftP = ((item.start - dayStart) / total) * 100;
    const wP = ((item.end - item.start) / total) * 100;

    const seg = document.createElement("div");
    seg.style.cssText = `
      position:absolute;
      left:${leftP}%;
      width:${wP}%;
      top:0; bottom:0;
      background: var(--c, var(--blue));
      border-radius: 4px;
      z-index: 2;
    `;
    trackWrap.appendChild(seg);

    const timeLabel = document.createElement("span");
    timeLabel.className = "dc-time-label desktop-only";
    timeLabel.textContent = BELLS[item.num].replace("–", " – ");
    timeLabel.style.left = `${leftP + wP/2}%`;
    trackWrap.appendChild(timeLabel);

    if (i < sorted.length - 1) {
      const nextItem = sorted[i + 1];
      const breakStart = item.end;
      const breakEnd = nextItem.start;
      const breakDuration = breakEnd - breakStart;

      if (breakDuration > 0) {
        const bLeftP = ((breakStart - dayStart) / total) * 100;
        const bWP = ((breakEnd - breakStart) / total) * 100;
        
        const breakSeg = document.createElement("div");
        breakSeg.style.cssText = `
          position:absolute;
          left:${bLeftP}%;
          width:${bWP}%;
          top:0; bottom:0;
          background: var(--c-soft, var(--blue-soft));
          z-index: 1;
        `;
        trackWrap.appendChild(breakSeg);

        const bLabel = document.createElement("span");
        bLabel.className = "dc-break-label desktop-only";
        bLabel.textContent = `${breakDuration} мин`;
        bLabel.style.left = `${bLeftP + bWP/2}%`;
        trackWrap.appendChild(bLabel);
      }
    }
  }

  if (nowMin >= dayStart && nowMin <= dayEnd) {
    const nowP = ((nowMin - dayStart) / total) * 100;
    
    const dot = document.createElement("div");
    dot.style.cssText = `
      position:absolute;
      top:50%;
      left:${nowP}%;
      width:14px; height:14px;
      border-radius:50%;
      background: var(--c, var(--blue));
      border: 3px solid var(--card);
      transform: translate(-50%, -50%);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--c, var(--blue)) 25%, transparent);
      z-index: 4;
    `;
    trackWrap.appendChild(dot);

    const nowTimeLabel = document.createElement("span");
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    nowTimeLabel.textContent = `${hh}:${mm}`;
    nowTimeLabel.style.cssText = `
      position:absolute;
      left:${nowP}%;
      top: -22px;
      transform: translateX(-50%);
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--c, var(--blue));
      background: var(--card);
      padding: 2px 6px;
      border-radius: 6px;
      white-space: nowrap;
      z-index: 5;
      box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    `;
    trackWrap.appendChild(nowTimeLabel);
  }

  // --- СТАТУСЫ ---
  let current = null;
  sorted.forEach(item => { if (nowMin >= item.start && nowMin <= item.end) current = item; });

  if (nowMin < dayStart) {
    status.textContent = "День ещё не начался";
    pairEl.textContent = "Скоро первая пара";
    metaEl.textContent = `Начало в ${BELLS[sorted[0].num].split("–")[0]}`;
    leftEl.textContent = `До начала ${fmtLeft(dayStart - nowMin)}`;
    return;
  }

   if (nowMin > dayEnd) {
    status.textContent = "День завершён 🎉";
    pairEl.textContent = "Хорошего отдыха!";
    
    const pairsCount = sorted.length;
    let pairsWord = "пар";
    if (pairsCount === 1) pairsWord = "пара";
    else if (pairsCount > 1 && pairsCount < 5) pairsWord = "пары";

    const firstPairTime = BELLS[sorted[0].num].split("–")[0];
    const lastPairTime = BELLS[sorted[sorted.length - 1].num].split("–")[1];
    
    const tomorrowIndex = (now.getDay() + 1) % 7;
    const tomorrowPairs = raw[tomorrowIndex];
    let tomorrowText = "";

    if (!tomorrowPairs || !tomorrowPairs.length) {
      tomorrowText = "Завтра — выходной.";
    } else {
      const weekNow = WEEK_LIST[state.week];
      const tomorrowFiltered = tomorrowPairs.filter(p => !p.star || p.star === weekNow.star);
      
      if (tomorrowFiltered.length === 0) {
        tomorrowText = "Завтра — выходной.";
      } else {
        const firstTomorrow = [...tomorrowFiltered].sort((a, b) => a.number - b.number)[0];
        const timeTomorrow = BELLS[firstTomorrow.number] ? BELLS[firstTomorrow.number].split("–")[0] : "";
        tomorrowText = `Завтра — ${tomorrowFiltered.length} пар(ы), первая в ${timeTomorrow}.`;
      }
    }

    metaEl.textContent = `Пары прошли с ${firstPairTime} до ${lastPairTime} (${pairsCount} ${pairsWord}). ${tomorrowText}`;
    leftEl.textContent = "До завтра";
    return;
  }

  if (current) {
    status.textContent = `Идёт ${current.num}-я пара`;
    pairEl.textContent = current.pair.text.split("преп.")[0].trim();
    metaEl.textContent = `${BELLS[current.num]}`;
    leftEl.textContent = `До звонка ${fmtLeft(current.end - nowMin)}`;
  } else {
    let currentBreak = null;
    for (let i = 0; i < sorted.length - 1; i++) {
      if (nowMin > sorted[i].end && nowMin < sorted[i + 1].start) {
        currentBreak = {
          end: sorted[i].end,
          nextStart: sorted[i + 1].start,
          nextPair: sorted[i + 1].pair
        };
        break;
      }
    }

    if (currentBreak) {
      status.textContent = "Перемена";
      pairEl.textContent = currentBreak.nextPair.text.split("преп.")[0].trim();
      metaEl.textContent = `Следующая в ${BELLS[sorted.find(s => s.start === currentBreak.nextStart).num].split("–")[0]}`;
      leftEl.textContent = `До пары ${fmtLeft(currentBreak.nextStart - nowMin)}`;
    }
  }
}

// Вспомогательная функция для открытия модалки со звонками
function openMobileBells(sorted) {
  let modal = document.getElementById("bellsModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "bellsModal";
    modal.className = "bells-modal-overlay";
    modal.innerHTML = `
      <div class="bells-modal">
        <div class="bells-modal-header">
          <h3>Расписание звонков</h3>
          <button class="bells-modal-close" onclick="document.getElementById('bellsModal').classList.remove('open')">✕</button>
        </div>
        <div class="bells-modal-content" id="bellsModalContent"></div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Закрытие по клику вне окна
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("open");
    });
  }

  const content = document.getElementById("bellsModalContent");
  let html = "";
  
  sorted.forEach((item, i) => {
    const timeStr = BELLS[item.num].replace("–", " – ");
    html += `<div class="bells-row"><span>${item.num}-я пара</span> <b>${timeStr}</b></div>`;
    if (i < sorted.length - 1) {
      const next = sorted[i+1];
      const bDur = next.start - item.end;
      if (bDur > 0) {
        html += `<div class="bells-break">Перемена: ${bDur} мин</div>`;
      }
    }
  });
  
  content.innerHTML = html;
  modal.classList.add("open");
}

// ============================================================
//  БЛОК «ЗАВТРА» (УЛУЧШЕННЫЙ СПИСОК)
// ============================================================
function renderTomorrow() {
  const wrap = $("tomorrow"), mainEl = $("tmMain"), subEl = $("tmSub");
  if (!wrap || !mainEl || !subEl) return;
  if (state.viewTeacher) { wrap.classList.add("hidden"); return; }
  if (!state.spec || !state.group) { wrap.classList.add("hidden"); return; }

  const now = new Date();
  const todayIndex = (now.getDay() + 6) % 7; 
  const tomorrowIndex = (todayIndex + 1) % 7;
  
  const raw = SCHEDULE[state.spec][state.course][state.group];
  let pairs = raw[tomorrowIndex];
  
  const dayName = DAY_NAMES[DAYS[tomorrowIndex]];
  
  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(now.getDate() + 1);
  const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  const dateStr = `${tomorrowDate.getDate()} ${months[tomorrowDate.getMonth()]}`;

  if (!pairs || !pairs.length) {
    mainEl.innerHTML = "Пар <b>нет</b> — отдыхай! 🎉";
    subEl.innerHTML = `${dayName}, <span style="opacity:0.7">${dateStr}</span>`;
    wrap.classList.remove("hidden");
    return;
  }

  const w = WEEK_LIST[state.week];
  pairs = pairs.filter(p => !p.star || p.star === w.star);
  
  if (!pairs.length) {
    mainEl.innerHTML = "Пар <b>нет</b> — отдыхай! 🎉";
    subEl.innerHTML = `${dayName}, <span style="opacity:0.7">${dateStr}</span>`;
    wrap.classList.remove("hidden");
    return;
  }

  const sorted = [...pairs].sort((a, b) => a.number - b.number);
  
  let pairsHtml = '<div class="tm-list">';
  sorted.forEach(p => {
    const time = BELLS[p.number] ? BELLS[p.number].split("–")[0] : "";
    const parsed = parseText(p.text);
    const subject = parsed.subject;
    const room = parsed.room;

    pairsHtml += `
      <div class="tm-item">
        <div class="tm-time">${time}</div>
        <div class="tm-subject">
          ${subject}
          ${room ? `<span class="tm-room">${room}</span>` : ""}
        </div>
      </div>
    `;
  });
  pairsHtml += '</div>';

  mainEl.innerHTML = pairsHtml;
  subEl.innerHTML = `${dayName}, <span style="opacity:0.7">${dateStr}</span> · пар: ${sorted.length}`;
  wrap.classList.remove("hidden");
}

// ============================================================
//  ОБЩИЙ РЕНДЕР
// ============================================================
function renderAll() {
  renderFilters();
  renderSchedule();
  renderDayProgress();
  renderTomorrow();
  showRandomWish();
}

function shiftWeek(d) {
  state.week = Math.max(0, Math.min(WEEK_LIST.length - 1, state.week + d));
  renderSchedule(); renderDayProgress(); renderTomorrow();
}

function goToday() {
  state.week = currentWeek();
  renderSchedule(); renderDayProgress(); renderTomorrow();
}

// ============================================================
//  СТАРТ
// ============================================================
SCHEDULE = buildSchedule(RAW_DATA);
state.week = currentWeek();

initTheme();
applyName();

$("nameEdit").addEventListener("click", askName);
$("themeToggle").addEventListener("click", toggleTheme);

const wishBtn = $("wishRefresh");
if (wishBtn) wishBtn.addEventListener("click", () => showRandomWish(true));

const forgetBtn = $("forgetGroup");
if (forgetBtn) {
  forgetBtn.addEventListener("click", () => {
    clearGroup();
    renderAll();
    if ($("mobileMenu")) $("mobileMenu").classList.remove("open");
    if ($("burger")) $("burger").classList.remove("open");
  });
}

// НОВАЯ СТРОКА: Вместо старого prompt() вызываем welcome.js (он подгрузится отдельно)
// Старую строку if (!getUserName()) setTimeout(askName, 500); мы УДАЛИЛИ.
// welcome.js сам проверит наличие имени при загрузке страницы.

showRandomWish(true);

setInterval(() => {
  if (!state.viewTeacher) { 
    renderDayProgress(); 
    renderTomorrow(); 
    showRandomWish(false); 
  }
}, 60000);