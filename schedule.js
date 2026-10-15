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
const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const DAY_NAMES = {
  Пн: "Понедельник", Вт: "Вторник", Ср: "Среда",
  Чт: "Четверг", Пт: "Пятница", Сб: "Суббота"
};

// ============================================================
//  СОСТОЯНИЕ
// ============================================================
let SCHEDULE = {};
let state = { spec: null, course: null, group: null, week: 0 };

const $ = id => document.getElementById(id);

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
//  ИМЯ ПОЛЬЗОВАТЕЛЯ
// ============================================================
function getUserName() {
  return localStorage.getItem("userName") || "";
}

function setUserName(name) {
  localStorage.setItem("userName", name.trim());
}

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
//  РАЗБОР НЕДЕЛЬ
// ============================================================
const WEEK_LIST = WEEKS.map(line => {
  const [start, end, star] = line.split("|").map(s => s.trim());
  return { start, end, star };
});

const parseDate = s => { const [d, m, y] = s.split(".").map(Number); return new Date(y, m - 1, d); };

function currentWeek() {
  const t = new Date(); t.setHours(0, 0, 0, 0);
  for (let i = 0; i < WEEK_LIST.length; i++) {
    const a = parseDate(WEEK_LIST[i].start);
    const b = parseDate(WEEK_LIST[i].end);
    b.setHours(23, 59, 59, 999);
    if (t >= a && t <= b) return i;
  }
  return 0;
}

// ============================================================
//  ПАРСИНГ ПАРЫ
// ============================================================
function parseText(text) {
  let t = text.replace(/^\d{2}\.\d{2}\.\d{4}(,\s*\d{2}\.\d{2}\.\d{4})*\s*/, "").trim();

  const teacherMatch = t.match(/преп\.\s*([^,]+?)(?:,\s*ауд\.|$)/);
  const teacher = teacherMatch ? teacherMatch[1].trim() : "";

  const roomMatch = t.match(/ауд\.\s*([^,]+?)(?:\s|$)/);
  const room = roomMatch ? roomMatch[1].trim() : "";

  const subject = t.split("преп.")[0].trim().replace(/,\s*$/, "");

  return { subject, teacher, room };
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
//  ГРУППИРОВКА
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
//  ПАРСИНГ ДНЯ
// ============================================================
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
  renderChips("specs", Object.keys(SCHEDULE), state.spec, spec => {
    state.spec = spec;
    state.course = null;
    state.group = null;
    state.week = currentWeek();
    applyColor(spec);
    renderAll();
  });

  if (state.spec) {
    renderChips("courses", Object.keys(SCHEDULE[state.spec]).sort(), state.course, course => {
      state.course = course;
      state.group = null;
      renderAll();
    }, c => c + " курс");
  } else $("courses").innerHTML = "";

  if (state.spec && state.course) {
    renderChips("groups", Object.keys(SCHEDULE[state.spec][state.course]).sort(), state.group, group => {
      state.group = group;
      renderAll();
    });
  } else $("groups").innerHTML = "";
}

// ============================================================
//  РАСПИСАНИЕ
// ============================================================
function renderSchedule() {
  const out = $("out");
  const info = $("weekInfo");

  if (!state.spec || !state.course || !state.group) {
    info.textContent = "Выберите группу";
    out.innerHTML = "";
    return;
  }

  const w = WEEK_LIST[state.week];
  info.textContent = `Неделя ${w.star}   (${w.start} – ${w.end})`;

  const raw = SCHEDULE[state.spec][state.course][state.group];
  out.innerHTML = "";

  DAYS.forEach((day, index) => {
    const dayPairs = raw[index];
    const block = document.createElement("section");
    block.className = "day";

    const h2 = document.createElement("h2");
    h2.textContent = DAY_NAMES[day];
    block.appendChild(h2);

    if (!dayPairs || dayPairs.length === 0) {
      const empty = document.createElement("div");
      empty.className = "day-empty";
      empty.textContent = "Выходной";
      block.appendChild(empty);
      out.appendChild(block);
      return;
    }

    const parsed = parseDay(dayPairs);
    const weekPairs = parsed[w.star] || [];

    if (weekPairs.length === 0) {
      const empty = document.createElement("div");
      empty.className = "day-empty";
      empty.textContent = "Выходной";
      block.appendChild(empty);
      out.appendChild(block);
      return;
    }

    const grid = document.createElement("div");
    grid.className = "cards";

    weekPairs.forEach(p => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <div class="t">${p.time}</div>
        <div class="s">${p.subject}${p.subgroup ? ' <small style="color:#6b6b6b;font-weight:400">(подгр. ' + p.subgroup + ')</small>' : ''}</div>
        <div class="m">${p.room} · ${p.teacher}</div>
      `;
      grid.appendChild(card);
    });

    block.appendChild(grid);
    out.appendChild(block);
  });
}

function renderAll() { renderFilters(); renderSchedule(); }

// ============================================================
//  ПЕРЕКЛЮЧЕНИЕ НЕДЕЛЬ
// ============================================================
function shiftWeek(d) {
  state.week = Math.max(0, Math.min(WEEK_LIST.length - 1, state.week + d));
  renderSchedule();
}
function goToday() { state.week = currentWeek(); renderSchedule(); }

// ============================================================
//  СТАРТ
// ============================================================
SCHEDULE = buildSchedule(RAW_DATA);
state.week = currentWeek();
renderAll();

// имя — спрашиваем один раз
applyName();
if (!getUserName()) {
  setTimeout(askName, 300);
}
$("nameEdit").addEventListener("click", askName);

// тема
initTheme();
$("themeToggle").addEventListener("click", toggleTheme);