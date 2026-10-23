// ============================================================
//  РОЛЬ + ЖИВОЙ ПОИСК ПРЕПОДАВАТЕЛЕЙ
// ============================================================
(function () {
  const get$ = id => document.getElementById(id);
  const ROLE_KEY = "role";

  function buildTeacherSchedule(raw) {
    const result = {};
    if (typeof raw === "undefined") return result;

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
          
          let teacher = m[1].trim();
          teacher = teacher.replace(/[^А-Яа-яЁё\s\.]/g, '').replace(/\s+/g, ' ').trim();
          if (!teacher) return;

          const subject = t.split("преп.")[0].trim().replace(/,\s*$/, "");
          const roomMatch = t.match(/ауд\.\s*([^,]+?)(?:\s|$)/);
          const room = roomMatch ? roomMatch[1].trim() : "";

          if (!result[spec]) result[spec] = {};
          if (!result[spec][teacher]) result[spec][teacher] = {};
          if (!result[spec][teacher][dayIndex]) result[spec][teacher][dayIndex] = [];

          result[spec][teacher][dayIndex].push({
            number: p.number, text: subject, subject: subject, room: room, group: groupName, spec: spec, star: p.star
          });
        });
      });
    });
    return result;
  }

  function getSavedRole() { return localStorage.getItem(ROLE_KEY) || ""; }
  function saveRole(role) { localStorage.setItem(ROLE_KEY, role); }
  function clearRole() { localStorage.removeItem(ROLE_KEY); }

  function switchToStudentUI() {
    get$("rowTeacher").style.display = "none";
    get$("rowCourses").style.display = "";
    get$("rowGroups").style.display = "";
  }

  function switchToTeacherUI() {
    get$("rowCourses").style.display = "none";
    get$("rowGroups").style.display = "none";
    get$("rowTeacher").style.display = "";
  }

  // --- ЖИВОЙ ПОИСК ---
  let currentIndex = -1;
  
  function renderTeacherFilters() {
    switchToTeacherUI();
    applyColor(state.spec || "ИСП");

    const specsBox = get$("specs");
    specsBox.innerHTML = "";

    Object.keys(window.TEACHER_SCHEDULE).sort().forEach(spec => {
      const b = document.createElement("button");
      b.className = "chip" + (state.spec === spec ? " on" : "");
      b.textContent = spec;
      b.onclick = () => { 
        state.spec = spec; 
        state.teacher = null; 
        applyColor(spec);
        get$("teacherInput").value = "";
        renderAll(); 
      };
      specsBox.appendChild(b);
    });

    get$("courses").innerHTML = "";
    get$("groups").innerHTML = "";
    
    const input = get$("teacherInput");
    if (state.teacher) input.value = state.teacher;
    else input.value = "";
  }

  function initLiveSearch() {
    const input = get$("teacherInput");
    const dropdown = get$("teacherDropdown");
    if (!input || !dropdown) return;

    function closeDropdown() {
      dropdown.classList.remove("open");
      currentIndex = -1;
    }

    function updateActiveItem() {
      const items = dropdown.querySelectorAll(".ls-item");
      items.forEach((item, idx) => {
        item.classList.toggle("active", idx === currentIndex);
        if (idx === currentIndex) item.scrollIntoView({ block: "nearest" });
      });
    }

    input.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (!state.spec) {
        dropdown.innerHTML = `<div class="ls-no-results">Сначала выберите специальность</div>`;
        dropdown.classList.add("open");
        return;
      }

      const teachers = (window.TEACHER_SCHEDULE || {})[state.spec] || {};
      const filtered = Object.keys(teachers).sort().filter(t => 
        t.toLowerCase().includes(query)
      );

      if (filtered.length === 0) {
        dropdown.innerHTML = `<div class="ls-no-results">Никого не найдено</div>`;
        dropdown.classList.add("open");
        return;
      }

      currentIndex = -1;
      dropdown.innerHTML = "";
      filtered.forEach(t => {
        const el = document.createElement("div");
        el.className = "ls-item";
        el.textContent = t;
        el.onclick = () => selectTeacher(t);
        dropdown.appendChild(el);
      });
      dropdown.classList.add("open");
    });

    document.addEventListener("click", (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        closeDropdown();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (!dropdown.classList.contains("open")) return;
      const items = dropdown.querySelectorAll(".ls-item");
      if (items.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % items.length;
        updateActiveItem();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateActiveItem();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (currentIndex >= 0 && items[currentIndex]) {
          selectTeacher(items[currentIndex].textContent);
        }
      } else if (e.key === "Escape") {
        closeDropdown();
      }
    });

    function selectTeacher(name) {
      state.teacher = name;
      input.value = name;
      closeDropdown();
      state.week = currentWeek();
      renderAll();
    }
  }

  function renderTeacherSchedule() {
    const out = get$("out"), info = get$("weekInfo");
    out.innerHTML = "";

    if (!state.spec) { info.textContent = "Выберите специальность"; return; }
    if (!state.teacher) { info.textContent = "Выберите преподавателя"; return; }

    const w = WEEK_LIST[state.week];
    info.textContent = `Неделя ${w.star} (${w.start} – ${w.end})`;

    const raw = (window.TEACHER_SCHEDULE[state.spec] || {})[state.teacher];
    if (!raw) return;

    DAYS.forEach((day, index) => {
      const dayPairs = raw[index];
      if (!dayPairs || !dayPairs.length) return;

      const weekPairs = dayPairs.filter(p => !p.star || p.star === w.star);
      if (!weekPairs.length) return;

      const block = document.createElement("section");
      block.className = "day";
      const h2 = document.createElement("h2");
      h2.textContent = DAY_NAMES[day];
      block.appendChild(h2);

      const grid = document.createElement("div");
      grid.className = "cards";
      weekPairs.sort((a, b) => a.number - b.number).forEach(p => {
        const card = document.createElement("article");
        card.className = "card";
        card.innerHTML = `
          <div class="t">${BELLS[p.number]} <span style="opacity:0.7;">· ${p.spec}</span></div>
          <div class="s">${p.subject}</div>
          <div class="m">${p.room} · <b>${p.group}</b></div>
        `;
        grid.appendChild(card);
      });

      block.appendChild(grid);
      out.appendChild(block);
    });
  }

  function setRole(role) {
    state.mode = role;
    saveRole(role);
    if (role === "teacher") {
      state.viewTeacher = true; state.teacher = null;
      get$("wish").style.display = "none";
    } else {
      state.viewTeacher = false; state.teacher = null;
      applyColor(state.spec || "ИСП");
      switchToStudentUI();
      get$("wish").style.display = "flex";
    }
    get$("roleScreen").style.display = "none";
    get$("scheduleScreen").style.display = "block";
    updateNavButtons();
    renderAll();
  }

  function viewTeacher() {
    state.viewTeacher = true; state.teacher = null;
    get$("wish").style.display = "none";
    updateNavButtons(); renderAll();
  }

  function backToStudent() {
    state.viewTeacher = false; state.teacher = null;
    applyColor(state.spec || "ИСП");
    switchToStudentUI();
    get$("wish").style.display = "flex";
    updateNavButtons(); renderAll();
  }

  // --- УПРАВЛЕНИЕ КНОПКАМИ В МЕНЮ И ШАПКЕ ---
  function updateNavButtons() {
    const btnDesktop = get$("switchRoleDesktop");
    const btnMobile = get$("switchRole");
    const btnForget = get$("forgetGroup"); // Кнопка "Забыть группу"
    const menu = get$("mobileMenu");
    const burger = get$("burger");

    function closeMenu() {
      if (menu) menu.classList.remove("open");
      if (burger) burger.classList.remove("open");
    }

    // Скрываем "Забыть группу", если мы в режиме препода
    if (btnForget) {
      if (state.mode === "teacher" || state.viewTeacher) {
        btnForget.style.display = "none";
      } else {
        btnForget.style.display = "block";
      }
    }

    // Функция для применения настроек к кнопке
    function applyBtnSettings(btn) {
      if (!btn) return;
      
      if (state.mode === "teacher") {
        btn.textContent = "🔄 Сменить роль";
        btn.onclick = () => { 
          clearRole(); 
          get$("roleScreen").style.display = ""; 
          get$("scheduleScreen").style.display = "none"; 
          closeMenu();
        };
      } else if (state.viewTeacher) {
        btn.textContent = "← К своим парам";
        btn.onclick = () => { 
          backToStudent(); 
          closeMenu();
        };
      } else {
        btn.textContent = "👀 Расписание преподавателей";
        btn.onclick = () => { 
          viewTeacher(); 
          closeMenu();
        };
      }
    }

    if (btnDesktop) {
      applyBtnSettings(btnDesktop);
    }

    if (btnMobile) {
      applyBtnSettings(btnMobile);
    }
  }

  function init() {
    if (typeof RAW_DATA === "undefined" || typeof SCHEDULE === "undefined") return;

    window.TEACHER_SCHEDULE = buildTeacherSchedule(RAW_DATA);
    window.__renderTeacherSchedule = renderTeacherSchedule;
    window.__renderTeacherFilters  = renderTeacherFilters;

    if (typeof state.mode === "undefined") state.mode = "student";
    if (typeof state.teacher === "undefined") state.teacher = null;
    if (typeof state.viewTeacher === "undefined") state.viewTeacher = false;

    document.querySelectorAll(".role-card").forEach(card => {
      card.addEventListener("click", () => setRole(card.dataset.role));
    });

    initLiveSearch();

    // Обработчик для кнопки "Забыть группу" в меню
    const btnForgetGroup = get$("forgetGroup");
    if (btnForgetGroup) {
      btnForgetGroup.addEventListener("click", () => {
        if (typeof clearGroup === "function") clearGroup();
        if (typeof renderAll === "function") renderAll();
        closeMenu();
      });
    }

    const saved = getSavedRole();
    if (saved === "teacher") setRole("teacher");
    else if (saved === "student") setRole("student");
    else {
      get$("roleScreen").style.display = "";
      get$("scheduleScreen").style.display = "none";
      updateNavButtons();
    }
  }

  window.addEventListener("load", init);
})();