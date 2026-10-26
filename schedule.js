// ============================================================
//  ЗАГРУЗКА СЛОВАРЯ МАТОВ (JSON)
// ============================================================
let BAD_WORDS = [];

fetch("bad-words.json")
  .then(res => res.json())
  .then(data => {
    BAD_WORDS = data;
    console.log("✅ Словарь матов загружен:", BAD_WORDS.length, "слов");
  })
  .catch(() => {
    console.warn("⚠️ Не удалось загрузить bad-words.json. Фильтр будет отключен.");
  });

// Умная проверка (с учетом латиницы и повторов)
function isNameClean(raw) {
  if (!raw || !raw.trim()) return false;
  if (BAD_WORDS.length === 0) return true; // Если словарь не загрузился — не блокируем

  let clean = raw.trim().replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, "").toLowerCase();

  // Меняем латинские буквы на русские (для обхода мата латиницей)
  const map = { "a":"а", "e":"е", "o":"о", "p":"р", "c":"с", "y":"у", "x":"х", "k":"к", "b":"в", "m":"м", "h":"н", "t":"т" };
  clean = clean.split("").map(ch => map[ch] || ch).join("");

  // Схлопываем повторные буквы (сссууукккааа -> сука)
  clean = clean.replace(/(.)\1+/g, "$1");

  // Ищем мат по корням
  return !BAD_WORDS.some(word => clean.includes(word));
}

// Основная функция валидации имени
function validateName(raw) {
  if (!raw || !raw.trim()) return null;
  const clean = raw.trim().replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, "");
  if (clean.length < 2 || clean.length > 20) return null;
  if (!isNameClean(raw)) return null; // Если мат — отказ
  return clean;
}

// ============================================================
//  СЕТКА ЗВОНКОВ И ДНИ (WEEKS берется из data.js)
// ============================================================
const BELLS = { 1: "08:30–10:00", 2: "10:10–11:40", 3: "12:10–13:40", 4: "13:50–15:20", 5: "15:30–17:00" };
const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const DAY_NAMES = { Пн: "Понедельник", Вт: "Вторник", Ср: "Среда", Чт: "Четверг", Пт: "Пятница", Сб: "Суббота", Вс: "Воскресенье" };
const WISHES = {
  "ЮСП": [{ emoji: "⚖️", text: "Сегодня отличный день, чтобы всё успеть — даже закон!" }],
  "ИСП": [{ emoji: "💻", text: "Пусть код компилируется, а жизнь — радует!" }],
  "РУПО": [{ emoji: "💻", text: "Программирование — это магия, и ты — волшебник!" }],
  "ЗСП": [{ emoji: "🌱", text: "Расти, как цветок под солнцем — ярко и смело!" }],
  "ЭСП": [{ emoji: "📈", text: "Пусть твой личностный рост всегда идёт вверх!" }]
};

let SCHEDULE = {};
let state = { spec: null, course: null, group: null, week: 0, mode: "student", viewTeacher: false, teacher: null };
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
//  ИЗМЕНЕНИЕ ИМЕНИ (ЧЕРЕЗ КРАСИВУЮ МОДАЛКУ)
// ============================================================
function openNameModal() {
  const modal = document.getElementById("nameModal");
  const input = document.getElementById("nameModalInput");
  const saveBtn = document.getElementById("nameModalSave");
  const cancelBtn = document.getElementById("nameModalCancel");

  if (!modal || !input || !saveBtn || !cancelBtn) {
    console.warn("Модалка имени не найдена в HTML");
    return;
  }

  input.value = localStorage.getItem("userName") || "";
  modal.classList.add("open");
  setTimeout(() => input.focus(), 100);

  saveBtn.onclick = () => {
    const raw = input.value.trim();
    const name = validateName(raw);
    
    if (!name) {
      input.style.borderColor = "#ef4444";
      input.placeholder = "Только буквы (2-20 символов, без мата)";
      setTimeout(() => {
        input.style.borderColor = "";
        input.placeholder = "Введи имя...";
      }, 2500);
      return;
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
  if (!force && (now - lastChange < 1.5 * 60 * 60 * 1000)) return;
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
  let t = text.replace(/^\d{2}\.\d{2}\.\d{4}(,\s*\d{2}\.\d{2}\.\d{4})*\s*/, "").trim();
  const teacherMatch = t.match(/преп\.\s*([^,]+)/);
  const teacher = teacherMatch ? teacherMatch[1].trim() : "";
  const roomMatch = t.match(/(?:ауд\.|спортивный зал)\s*([^,]+?)(?:\s|$)/i);
  let room = roomMatch ? roomMatch[1].trim() : "";
  if (t.toLowerCase().includes("спортивный зал")) room = "Спортивный зал";
  const subject = t.split("преп.")[0].trim().replace(/,\s*$/, "");
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
        const time = BELLS[p.number] || (p.number + " пара");
        const parsed = parseText(p.text);
        const stars = p.star ? [p.star] : ["*", "**"];
        stars.forEach(star => {
          const key = lessonKey(dayIndex, p, parsed, star);
          if (!byDay[dayIndex]) byDay[dayIndex] = {};
          if (!byDay[dayIndex][star]) byDay[dayIndex][star] = {};
          const bucket = byDay[dayIndex][star];
          if (!bucket[key]) {
            bucket[key] = { time, number: p.number, subject: parsed.subject, room: parsed.room, teachers: [], groups: [], subgroup: p.subgroup || null, dates: p.dates || null, _tSet: new Set(), _gSet: new Set() };
          }
          const card = bucket[key];
          if (parsed.teacher && !card._tSet.has(parsed.teacher)) { card._tSet.add(parsed.teacher); card.teachers.push(parsed.teacher); }
          const gKey = spec + "|" + group;
          if (!card._gSet.has(gKey)) { card._gSet.add(gKey); card.groups.push({ spec, group }); }
        });
      });
    });
  });
  const result = {};
  Object.keys(byDay).forEach(d => {
    result[d] = {};
    Object.keys(byDay[d]).forEach(star => {
      result[d][star] = Object.values(byDay[d][star]).map(c => { delete c._tSet; delete c._gSet; return c; }).sort((a, b) => a.number - b.number);
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

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildSchedule(raw) {
  const result = {};
  Object.keys(raw).forEach(groupName => {
    const match = groupName.match(/^([А-ЯЁ]+)-/);
    if (!match) return;
    const spec = match[1], course = GROUP_TO_COURSE[groupName];
    if (!course) return;
    if (!result[spec]) result[spec] = {};
    if (!result[spec][course]) result[spec][course] = {};
    result[spec][course][groupName] = raw[groupName];
  });
  return result;
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
    state.spec = spec; state.course = null; state.group = null; state.week = currentWeek();
    applyColor(spec);
    if (window.saveUserGroup) window.saveUserGroup(state.spec, state.course, state.group);
    showRandomWish(true);
    renderAll();
    window.dispatchEvent(new CustomEvent("specChanged", { detail: spec }));
  });
  if (state.spec) {
    renderChips("courses", Object.keys(SCHEDULE[state.spec]).sort(), state.course, course => {
      state.course = course; state.group = null;
      if (window.saveUserGroup) window.saveUserGroup(state.spec, state.course, state.group);
      renderAll();
    }, c => c + " курс");
  } else $("courses").innerHTML = "";
  if (state.spec && state.course) {
    renderChips("groups", Object.keys(SCHEDULE[state.spec][state.course]).sort(), state.group, group => {
      state.group = group;
      if (window.saveUserGroup) window.saveUserGroup(state.spec, state.course, state.group);
      renderAll();
    });
  } else $("groups").innerHTML = "";
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
    dayCards = dayCards.filter(card => card.groups.some(g => g.group === state.group));
    if (!dayCards.length) {
      const empty = document.createElement("div"); empty.className = "day-empty"; empty.textContent = "Выходной";
      block.appendChild(empty); out.appendChild(block); return;
    }
    const grid = document.createElement("div"); grid.className = "cards";
    dayCards.forEach(card => {
      const el = document.createElement("article"); el.className = "card";
      const teachers = card.teachers.length ? card.teachers.join(", ") : "";
      const subNote = card.subgroup ? ` <small style="color:#6b6b6b;font-weight:400">(подгр. ${card.subgroup})</small>` : "";
      const chips = card.groups.map(g => {
        const col = (COLORS[g.spec] && COLORS[g.spec].c) || "#1769E0";
        const isMine = (g.group === state.group);
        return `<span class="group-chip${isMine ? " mine" : ""}" style="--chip-c:${col}">${g.group}</span>`;
      }).join("");
      el.innerHTML = `<div class="t">${card.time}</div><div class="s">${card.subject}${subNote}</div><div class="m">${card.room}${teachers ? " · " + teachers : ""}</div>${card.groups.length > 1 ? `<div class="card-groups">${chips}</div>` : ""}`;
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
    status.textContent = "День завершён 🎉"; pairEl.textContent = "Хорошего отдыха!";
    const pairsCount = sorted.length; let pairsWord = "пар"; if (pairsCount === 1) pairsWord = "пара"; else if (pairsCount > 1 && pairsCount < 5) pairsWord = "пары";
    const firstPairTime = BELLS[sorted[0].num].split("–")[0], lastPairTime = BELLS[sorted[sorted.length - 1].num].split("–")[1];
    const tomorrowIndex = (now.getDay() + 1) % 7, tomorrowPairs = raw[tomorrowIndex]; let tomorrowText = "";
    if (!tomorrowPairs || !tomorrowPairs.length) tomorrowText = "Завтра — выходной.";
    else {
      const weekNow = WEEK_LIST[state.week], tomorrowFiltered = tomorrowPairs.filter(p => !p.star || p.star === weekNow.star);
      if (tomorrowFiltered.length === 0) tomorrowText = "Завтра — выходной.";
      else { const firstTomorrow = [...tomorrowFiltered].sort((a, b) => a.number - b.number)[0]; const timeTomorrow = BELLS[firstTomorrow.number] ? BELLS[firstTomorrow.number].split("–")[0] : ""; tomorrowText = `Завтра — ${tomorrowFiltered.length} пар(ы), первая в ${timeTomorrow}.`; }
    }
    metaEl.textContent = `Пары прошли с ${firstPairTime} до ${lastPairTime} (${pairsCount} ${pairsWord}). ${tomorrowText}`; leftEl.textContent = "До завтра"; return;
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
  if (!wrap || state.viewTeacher || !state.spec || !state.group) { if(wrap) wrap.classList.add("hidden"); return; }
  const now = new Date(), todayIndex = (now.getDay() + 6) % 7, tomorrowIndex = (todayIndex + 1) % 7;
  const raw = SCHEDULE[state.spec][state.course][state.group]; let pairs = raw[tomorrowIndex];
  const dayName = DAY_NAMES[DAYS[tomorrowIndex]], tomorrowDate = new Date(now); tomorrowDate.setDate(now.getDate() + 1);
  const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  const dateStr = `${tomorrowDate.getDate()} ${months[tomorrowDate.getMonth()]}`;
  let headerHtml = `<div class="tm-header"><div class="tm-header-left"><span class="tm-icon">🌅</span><span class="tm-title">Завтра</span></div><div class="tm-header-right"><span class="tm-date">${dayName}, ${dateStr}</span></div></div>`;
  if (!pairs || !pairs.length) { wrap.innerHTML = headerHtml + `<div class="tm-empty">Пар <b>нет</b> — отдыхай! 🎉</div>`; wrap.classList.remove("hidden"); if (window.unlockAchievement) window.unlockAchievement("tomorrowViewed"); return; }
  const w = WEEK_LIST[state.week]; pairs = pairs.filter(p => !p.star || p.star === w.star);
  if (!pairs.length) { wrap.innerHTML = headerHtml + `<div class="tm-empty">Пар <b>нет</b> — отдыхай! 🎉</div>`; wrap.classList.remove("hidden"); if (window.unlockAchievement) window.unlockAchievement("tomorrowViewed"); return; }
  const sorted = [...pairs].sort((a, b) => a.number - b.number); let pairsHtml = '<div class="tm-list">';
  sorted.forEach(p => { const time = BELLS[p.number] ? BELLS[p.number].split("–")[0] : ""; const parsed = parseText(p.text); pairsHtml += `<div class="tm-item"><div class="tm-time">${time}</div><div class="tm-subject"><div class="tm-subject-name">${parsed.subject.replace(/\s*\(.*?\)\s*/g, '')}</div>${parsed.room ? `<div class="tm-room">${parsed.room}</div>` : ""}</div></div>`; });
  pairsHtml += '</div>'; wrap.innerHTML = headerHtml + pairsHtml + `<div class="tm-footer">Всего пар: ${sorted.length}</div>`; wrap.classList.remove("hidden");
  if (window.unlockAchievement) window.unlockAchievement("tomorrowViewed");
}

function renderAll() {
  renderFilters(); renderSchedule(); renderDayProgress(); renderTomorrow(); showRandomWish();
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
  if (typeof RAW_DATA !== "undefined") SCHEDULE = buildSchedule(RAW_DATA);
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

  // Меню (бургер)
  const menuBtn = $("menuBtn"), mobileMenu = $("mobileMenu"), closeMenuBtn = $("closeMenuBtn");
  if (menuBtn && mobileMenu) menuBtn.addEventListener("click", () => { mobileMenu.classList.add("open"); menuBtn.classList.add("open"); document.body.style.overflow = "hidden"; });
  if (closeMenuBtn && mobileMenu) closeMenuBtn.addEventListener("click", () => { mobileMenu.classList.remove("open"); menuBtn.classList.remove("open"); document.body.style.overflow = ""; });
  if (mobileMenu) mobileMenu.addEventListener("click", (e) => { if (e.target === mobileMenu) { mobileMenu.classList.remove("open"); menuBtn.classList.remove("open"); document.body.style.overflow = ""; } });

  // Выбор роли
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
    });
  });

  // Восстановление сессии
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
    const saved = window.loadUserGroup();
    if (saved && SCHEDULE[saved.spec] && SCHEDULE[saved.spec][saved.course] && SCHEDULE[saved.spec][saved.course][saved.group]) {
      state.spec = saved.spec; state.course = saved.course; state.group = saved.group;
      applyColor(saved.spec);
    }
  }

  // Меню навигации
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
      btnForgetGroup.onclick = () => { if (window.clearUserGroup) window.clearUserGroup(); state.spec = null; state.course = null; state.group = null; state.week = currentWeek(); applyColor("ИСП"); renderAll(); if (mobileMenu) mobileMenu.classList.remove("open"); if (menuBtn) menuBtn.classList.remove("open"); document.body.style.overflow = ""; buildMenu(); };
      dynamicNav.appendChild(btnForgetGroup);
    }
    
    const linkHome = document.createElement("a"); linkHome.href = "index.html"; linkHome.className = "fs-link"; linkHome.style = "--i: 4;"; linkHome.innerHTML = "← На главную"; linkHome.onclick = () => { mobileMenu.classList.remove("open"); menuBtn.classList.remove("open"); document.body.style.overflow = ""; }; dynamicNav.appendChild(linkHome);
  }

  buildMenu();
  renderAll();

  setInterval(() => { if (!state.viewTeacher) { renderDayProgress(); renderTomorrow(); showRandomWish(false); } }, 60000);
});

// ============================================================
//  МАСКОТ СОВА: ФРАЗЫ, КЛИКИ И ОБЛАЧКО
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const mascot = document.getElementById("mascot");
  const bubble = document.getElementById("mascotBubble");
  
  if (!mascot || !bubble) return;

  let bubbleTimeout;

  function say(text, duration = 3000) {
    bubble.textContent = text;
    bubble.classList.add("show");
    clearTimeout(bubbleTimeout);
    bubbleTimeout = setTimeout(() => {
      bubble.classList.remove("show");
    }, duration);
  }

  setTimeout(() => {
    if (localStorage.getItem("savedGroup")) {
      say("О, ты вернулся! 👋");
    } else {
      say("Привет! Выбери группу →");
    }
  }, 1500);

  const phrases = [
    "Учись хорошо! 📚",
    "Не забудь про перемену! ☕",
    "Ты справишься! 💪",
    "Хорошего дня! 🌟",
    "Сова всегда на твоей стороне 🦉",
    "Не забудь сделать домашку! 📝",
    "Отдохни немного, ты много работаешь 😉"
  ];
  
  mascot.addEventListener("click", () => {
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    say(randomPhrase);
    mascot.style.transform = "scale(0.9) translateY(5px)";
    setTimeout(() => {
      mascot.style.transform = "";
    }, 150);
  });

  window.addEventListener("specChanged", (e) => {
    const specName = e.detail;
    say(`О, ${specName} — крутой выбор! 🚀`);
  });
});

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