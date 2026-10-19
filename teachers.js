// ============================================================
//  РОЛЬ + ПРОСМОТР ПРЕПОДАВАТЕЛЕЙ ПО СПЕЦИАЛЬНОСТЯМ
//  Студент может временно глянуть расписание преподавателя
//  и вернуться к своим без потери выбранной группы
// ============================================================

(function () {

  const get$ = id => document.getElementById(id);
  const ROLE_KEY = "role";

  // ------------------------------------------------------------
  //  СОБИРАЕМ РАСПИСАНИЕ ПРЕПОДАВАТЕЛЕЙ
  //  TEACHER_SCHEDULE[spec][teacher][day] = [пары]
  // ------------------------------------------------------------
  function buildTeacherSchedule(raw) {
    const result = {};

    Object.keys(raw).forEach(groupName => {
      const specMatch = groupName.match(/^([А-ЯЁ]+)-/);
      if (!specMatch) return;
      const spec = specMatch[1];

      const days = raw[groupName];
      Object.keys(days).forEach(dayIndex => {
        const pairs = days[dayIndex];
        if (!Array.isArray(pairs)) return;

        pairs.forEach(p => {
          const t = p.text || "";
          const m = t.match(/преп\.\s*([^,]+)/);
          if (!m) return;
          const teacher = m[1].trim();

          const subject = t.split("преп.")[0].trim().replace(/,\s*$/, "");
          const roomMatch = t.match(/ауд\.\s*([^,]+?)(?:\s|$)/);
          const room = roomMatch ? roomMatch[1].trim() : "";

          if (!result[spec]) result[spec] = {};
          if (!result[spec][teacher]) result[spec][teacher] = {};
          if (!result[spec][teacher][dayIndex]) result[spec][teacher][dayIndex] = [];

          result[spec][teacher][dayIndex].push({
            number: p.number,
            text: subject,
            subject: subject,
            room: room,
            group: groupName,
            star: p.star
          });
        });
      });
    });

    return result;
  }

  // ------------------------------------------------------------
  //  РОЛЬ
  // ------------------------------------------------------------
  function getSavedRole() { return localStorage.getItem(ROLE_KEY) || ""; }
  function saveRole(role) { localStorage.setItem(ROLE_KEY, role); }
  function clearRole() { localStorage.removeItem(ROLE_KEY); }

  function showRoleScreen() {
    get$("roleScreen").style.display = "";
    get$("scheduleScreen").style.display = "none";
  }
  function showScheduleScreen() {
    get$("roleScreen").style.display = "none";
    get$("scheduleScreen").style.display = "";
  }

  // ------------------------------------------------------------
  //  ВСПОМОГАТЕЛЬНАЯ: переключить UI в "студенческий" вид
  // ------------------------------------------------------------
  function switchToStudentUI() {
    const label = get$("filterLabel1");
    if (label) label.textContent = "Специальность";

    const rowTeacher = get$("rowTeacher");
    if (rowTeacher) rowTeacher.style.display = "none";

    const rowCourses = get$("rowCourses");
    if (rowCourses) rowCourses.style.display = "";

    const rowGroups = get$("rowGroups");
    if (rowGroups) rowGroups.style.display = "";

    // чистим чипсы преподавателей
    const teachersBox = get$("teachers");
    if (teachersBox) teachersBox.innerHTML = "";
  }

  // ------------------------------------------------------------
  //  ФИЛЬТРЫ ПРЕПОДАВАТЕЛЕЙ
  // ------------------------------------------------------------
  function renderTeacherFilters() {
    const rowCourses = get$("rowCourses");
    const rowGroups  = get$("rowGroups");
    if (rowCourses) rowCourses.style.display = "none";
    if (rowGroups)  rowGroups.style.display = "none";

    const rowTeacher = get$("rowTeacher");
    if (rowTeacher) rowTeacher.style.display = "";

    const label = get$("filterLabel1");
    if (label) label.textContent = "Специальность";

    // -------- специальности --------
    const specsBox = get$("specs");
    if (!specsBox) return;
    specsBox.innerHTML = "";

    Object.keys(window.TEACHER_SCHEDULE).sort().forEach(spec => {
      const b = document.createElement("button");
      b.className = "chip" + (state.spec === spec ? " on" : "");
      b.textContent = spec;
      b.onclick = () => {
        state.spec = spec;
        state.teacher = null;
        renderAll();
      };
      specsBox.appendChild(b);
    });

    // -------- преподаватели выбранной специальности --------
    const teachersBox = get$("teachers");
    if (!teachersBox) return;
    teachersBox.innerHTML = "";

    if (!state.spec) return;

    const teachers = window.TEACHER_SCHEDULE[state.spec] || {};
    Object.keys(teachers).sort().forEach(t => {
      const b = document.createElement("button");
      b.className = "chip" + (state.teacher === t ? " on" : "");
      b.textContent = t;
      b.onclick = () => {
        state.teacher = t;
        state.week = currentWeek();
        renderAll();
      };
      teachersBox.appendChild(b);
    });

    const c = get$("courses"); if (c) c.innerHTML = "";
    const g = get$("groups");  if (g) g.innerHTML = "";
  }

  // ------------------------------------------------------------
  //  РАСПИСАНИЕ ПРЕПОДАВАТЕЛЯ
  // ------------------------------------------------------------
  function renderTeacherSchedule() {
    const out = get$("out");
    const info = get$("weekInfo");

    if (!state.spec) {
      info.textContent = "Выберите специальность";
      out.innerHTML = "";
      return;
    }
    if (!state.teacher) {
      info.textContent = "Выберите преподавателя";
      out.innerHTML = "";
      return;
    }

    const w = WEEK_LIST[state.week];
    info.textContent = `Неделя ${w.star}   (${w.start} – ${w.end})`;

    const raw = (window.TEACHER_SCHEDULE[state.spec] || {})[state.teacher] || {};
    out.innerHTML = "";

    DAYS.forEach((day, index) => {
      const dayPairs = raw[index];
      const block = document.createElement("section");
      block.className = "day";

      const h2 = document.createElement("h2");
      h2.textContent = DAY_NAMES[day];
      block.appendChild(h2);

      if (!dayPairs || !dayPairs.length) {
        const empty = document.createElement("div");
        empty.className = "day-empty";
        empty.textContent = "Выходной";
        block.appendChild(empty);
        out.appendChild(block);
        return;
      }

      const weekPairs = dayPairs.filter(p => !p.star || p.star === w.star);

      if (!weekPairs.length) {
        const empty = document.createElement("div");
        empty.className = "day-empty";
        empty.textContent = "Выходной";
        block.appendChild(empty);
        out.appendChild(block);
        return;
      }

      const seen = new Set();
      const uniq = weekPairs.filter(p => {
        const key = p.number + "_" + p.group + "_" + p.subject;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      const grid = document.createElement("div");
      grid.className = "cards";

      uniq.sort((a, b) => a.number - b.number).forEach(p => {
        const time = BELLS[p.number] || (p.number + " пара");
        const card = document.createElement("article");
        card.className = "card";
        card.innerHTML = `
          <div class="t">${time}</div>
          <div class="s">${p.subject}</div>
          <div class="m">${p.room} · ${p.group}</div>
        `;
        grid.appendChild(card);
      });

      block.appendChild(grid);
      out.appendChild(block);
    });
  }

  // ------------------------------------------------------------
  //  ПЕРЕКЛЮЧЕНИЯ
  // ------------------------------------------------------------
  function setRole(role) {
    state.mode = role;
    saveRole(role);

    if (role === "teacher") {
      state.viewTeacher = true;
      state.teacher = null;
      applyColor("teacher");
    } else {
      // студент — сбросить всё преподавательское
      state.viewTeacher = false;
      state.teacher = null;
      applyColor(state.spec || "ИСП");
      switchToStudentUI();
    }

    showScheduleScreen();
    updateNavButtons();
    renderAll();
  }

  function viewTeacher() {
    state.viewTeacher = true;
    state.teacher = null;
    applyColor("teacher");
    updateNavButtons();
    renderAll();
  }

  function backToStudent() {
    state.viewTeacher = false;
    state.teacher = null;
    applyColor(state.spec || "ИСП");
    switchToStudentUI();
    updateNavButtons();
    renderAll();
  }

  // ------------------------------------------------------------
  //  КНОПКА В ШАПКЕ
  // ------------------------------------------------------------
  function updateNavButtons() {
    const btn = get$("switchRole");
    if (!btn) return;

    if (state.mode === "teacher") {
      btn.textContent = "🔄 Сменить роль";
      btn.onclick = () => {
        clearRole();
        showRoleScreen();
      };
      return;
    }

    if (state.viewTeacher) {
      btn.textContent = "← К своим парам";
      btn.onclick = backToStudent;
      return;
    }

    btn.textContent = "👀 Расписание преподавателей";
    btn.onclick = viewTeacher;
  }

  // ------------------------------------------------------------
  //  СТАРТ
  // ------------------------------------------------------------
  function init() {
    if (typeof RAW_DATA === "undefined" || typeof SCHEDULE === "undefined") return;

    window.TEACHER_SCHEDULE = buildTeacherSchedule(RAW_DATA);

    // регистрируем свои рендеры для schedule.js
    window.__renderTeacherSchedule = renderTeacherSchedule;
    window.__renderTeacherFilters  = renderTeacherFilters;

    if (typeof state.mode === "undefined") state.mode = "student";
    if (typeof state.teacher === "undefined") state.teacher = null;
    if (typeof state.viewTeacher === "undefined") state.viewTeacher = false;

    document.querySelectorAll(".role-card").forEach(card => {
      card.addEventListener("click", () => setRole(card.dataset.role));
    });

    const saved = getSavedRole();
    if (saved === "teacher") {
      setRole("teacher");
    } else if (saved === "student") {
      setRole("student");
    } else {
      showRoleScreen();
    }

    updateNavButtons();
  }

  window.addEventListener("load", init);

})();