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
//  ПОЖЕЛАНИЯ
// ============================================================
const WISHES = [
  { emoji: "🌟", text: "Хорошего дня! Пусть всё получится." },
  { emoji: "☕", text: "Не забудь про кофе — пары длинные." },
  { emoji: "📚", text: "Учись, но не забывай отдыхать." },
  { emoji: "💪", text: "Ты справишься. Даже с этой парой." },
  { emoji: "🎯", text: "Сегодня отличный день, чтобы всё успеть." },
  { emoji: "🍀", text: "Пусть преподаватель будет в хорошем настроении." },
  { emoji: "🚀", text: "Вперёд к знаниям — и без опозданий!" },
  { emoji: "🎧", text: "Между парами — музыка и отдых." },
  { emoji: "☀️", text: "Хорошего настроения на весь день!" },
  { emoji: "🍩", text: "После пар можно и вкусненького." },
  { emoji: "🧠", text: "Твоя голова — твой главный актив." },
  { emoji: "🌱", text: "Маленькие шаги каждый день — большие результаты." },
  { emoji: "🔥", text: "Сегодня всё по плечу!" },
  { emoji: "🎉", text: "Пусть пар будет меньше, а знаний — больше." },
  { emoji: "🧘", text: "Спокойно. Всё идёт по плану." },
  { emoji: "💡", text: "Вдруг сегодня узнаешь что-то важное." },
  { emoji: "🚌", text: "Успей на пару — и без пробок!" },
  { emoji: "✨", text: "Ты молодец. Просто помни это." },
  { emoji: "📝", text: "Записывай — потом скажешь спасибо себе." },
  { emoji: "🍕", text: "Пятница близко, а ты уже герой." },
  { emoji: "🎓", text: "Ты учишься ради себя. Помни это." },
  { emoji: "💙", text: "Команда ПараЗвёзд верит в тебя." },
  { emoji: "😊", text: "Даже самая скучная пара когда-то закончится." },
  { emoji: "⚡", text: "Скорость — твой друг. Но не на парах." },
  { emoji: "🕶", text: "Ты крут. И это не обсуждается." }
];

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
//  ЗАПОМИНАНИЕ ГРУППЫ
// ============================================================
const GROUP_KEY = "savedGroup";

function saveGroup() {
  if (!state.spec || !state.course || !state.group) return;
  try {
    localStorage.setItem(GROUP_KEY, JSON.stringify({
      spec: state.spec,
      course: state.course,
      group: state.group
    }));
  } catch (e) { /* приватный режим */ }
}

function loadGroup() {
  try {
    const raw = localStorage.getItem(GROUP_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data || !data.spec || !data.group) return false;

    if (!SCHEDULE[data.spec]) return false;
    if (!SCHEDULE[data.spec][data.course]) return false;
    if (!SCHEDULE[data.spec][data.course][data.group]) return false;

    state.spec = data.spec;
    state.course = data.course;
    state.group = data.group;

    applyColor(data.spec);
    return true;
  } catch (e) {
    console.warn("load group error:", e);
    return false;
  }
}

function clearGroup() {
  localStorage.removeItem(GROUP_KEY);
  state.spec = null;
  state.course = null;
  state.group = null;
  state.week = currentWeek();
  applyColor("ИСП");
}

// ============================================================
//  ПОЖЕЛАНИЕ ДНЯ
// ============================================================
let lastWishIndex = -1;

function showRandomWish() {
  const wrap = $("wish");
  const emojiEl = $("wishEmoji");
  const textEl = $("wishText");
  if (!wrap || !emojiEl || !textEl) return;

  let i;
  do {
    i = Math.floor(Math.random() * WISHES.length);
  } while (i === lastWishIndex && WISHES.length > 1);

  lastWishIndex = i;
  const w = WISHES[i];

  emojiEl.textContent = w.emoji;
  textEl.textContent = w.text;

  wrap.classList.remove("changing");
  void wrap.offsetWidth;
  wrap.classList.add("changing");
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
    saveGroup();
    renderAll();
  });

  if (state.spec) {
    renderChips("courses", Object.keys(SCHEDULE[state.spec]).sort(), state.course, course => {
      state.course = course;
      state.group = null;
      saveGroup();
      renderAll();
    }, c => c + " курс");
  } else $("courses").innerHTML = "";

  if (state.spec && state.course) {
    renderChips("groups", Object.keys(SCHEDULE[state.spec][state.course]).sort(), state.group, group => {
      state.group = group;
      saveGroup();
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

// ============================================================
//  ВИДЖЕТ ДНЯ
// ============================================================
function renderDayProgress() {
  const card = $("dayCard");
  const status = $("dayStatus");
  const percent = $("dayPercent");
  const ringFill = $("dcRingFill");
  const pairEl = $("dcPair");
  const metaEl = $("dcMeta");
  const leftEl = $("dayLeft");
  const track = $("dcTrack");
  const labels = $("dcLabels");

  if (!card || !track) return;

  // пересоздаём dcNow, если его нет в DOM
  let nowDot = $("dcNow");
  if (!nowDot) {
    nowDot = document.createElement("div");
    nowDot.id = "dcNow";
    nowDot.className = "dc-now";
    track.appendChild(nowDot);
  }

  if (!state.spec || !state.group || state.week !== currentWeek()) {
    card.classList.add("hidden");
    return;
  }

  const now = new Date();
  const todayIndex = (now.getDay() + 6) % 7;
  const raw = SCHEDULE[state.spec][state.course][state.group];
  const pairs = raw[todayIndex];

  if (!pairs || !pairs.length) {
    card.classList.add("hidden");
    return;
  }

  const BELL_MIN = {};
  Object.keys(BELLS).forEach(n => {
    const [start, end] = BELLS[n].split("–");
    BELL_MIN[n] = { start: toMin(start), end: toMin(end), num: Number(n) };
  });

  const sorted = pairs
    .filter(p => BELL_MIN[p.number])
    .map(p => ({ ...BELL_MIN[p.number], pair: p }))
    .sort((a, b) => a.start - b.start);

  if (!sorted.length) {
    card.classList.add("hidden");
    return;
  }

  const dayStart = sorted[0].start;
  const dayEnd   = sorted[sorted.length - 1].end;
  const nowMin   = now.getHours() * 60 + now.getMinutes();

  card.classList.remove("hidden");

  const total = dayEnd - dayStart;
  let passed = nowMin - dayStart;
  passed = Math.max(0, Math.min(total, passed));
  const percentVal = Math.round((passed / total) * 100);
  percent.textContent = percentVal + "%";

  const dash = 2 * Math.PI * 52;
  ringFill.style.strokeDasharray = dash;
  ringFill.style.strokeDashoffset = dash - (dash * percentVal / 100);

  // удаляем только сегменты (не трогаем dcNow)
  track.querySelectorAll(".dc-segment").forEach(s => s.remove());

  sorted.forEach(item => {
    const seg = document.createElement("div");
    seg.className = "dc-segment";
    const leftP = ((item.start - dayStart) / total) * 100;
    const wP    = ((item.end - item.start) / total) * 100;
    seg.style.cssText = `
      position:absolute;
      left:${leftP}%;
      width:${wP}%;
      top:0; bottom:0;
      background: color-mix(in srgb, var(--c) 30%, transparent);
      border-right: 2px solid var(--card);
      border-radius: 2px;
    `;
    track.appendChild(seg);
  });

  const nowP = ((nowMin - dayStart) / total) * 100;
  nowDot.style.left = Math.max(0, Math.min(100, nowP)) + "%";

  labels.innerHTML = "";
  sorted.forEach(item => {
    const s = document.createElement("span");
    s.textContent = BELLS[item.num].split("–")[0];
    labels.appendChild(s);
  });

  let current = null;
  sorted.forEach(item => {
    if (nowMin >= item.start && nowMin <= item.end) current = item;
  });

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
    metaEl.textContent = `Пары закончились в ${BELLS[sorted[sorted.length - 1].num].split("–")[1]}`;
    leftEl.textContent = "До завтра";
    return;
  }

  if (current) {
    status.textContent = `Идёт ${current.num}-я пара`;
    pairEl.textContent = current.pair.text.split("преп.")[0].trim();
    metaEl.textContent = `${BELLS[current.num]}`;
    leftEl.textContent = `До звонка ${fmtLeft(current.end - nowMin)}`;
  } else {
    let next = null;
    sorted.forEach(item => {
      if (nowMin < item.start && (!next || item.start < next.start)) next = item;
    });
    if (next) {
      status.textContent = "Перемена";
      pairEl.textContent = next.pair.text.split("преп.")[0].trim();
      metaEl.textContent = `Следующая в ${BELLS[next.num].split("–")[0]}`;
      leftEl.textContent = `До пары ${fmtLeft(next.start - nowMin)}`;
    }
  }
}

// ============================================================
//  ОБЩИЙ РЕНДЕР
// ============================================================
function renderAll() {
  renderFilters();
  renderSchedule();
  renderDayProgress();
  if (typeof showRandomWish === "function") showRandomWish();
}

// ============================================================
//  ПЕРЕКЛЮЧЕНИЕ НЕДЕЛЬ
// ============================================================
function shiftWeek(d) {
  state.week = Math.max(0, Math.min(WEEK_LIST.length - 1, state.week + d));
  renderSchedule();
  renderDayProgress();
}
function goToday() {
  state.week = currentWeek();
  renderSchedule();
  renderDayProgress();
}

// ============================================================
//  СТАРТ
// ============================================================
SCHEDULE = buildSchedule(RAW_DATA);
state.week = currentWeek();

// восстановить ранее выбранную группу
loadGroup();

renderAll();

// имя
applyName();
if (!getUserName()) {
  setTimeout(askName, 300);
}
$("nameEdit").addEventListener("click", askName);

// тема
initTheme();
$("themeToggle").addEventListener("click", toggleTheme);

// пожелание дня
showRandomWish();
const wishBtn = $("wishRefresh");
if (wishBtn) wishBtn.addEventListener("click", showRandomWish);

// кнопка «Забыть группу»
const forgetBtn = $("forgetGroup");
if (forgetBtn) {
  forgetBtn.addEventListener("click", () => {
    clearGroup();
    renderAll();
  });
}

// обновление виджета дня раз в минуту
setInterval(renderDayProgress, 60000);