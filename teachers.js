// ============================================================
//  РОЛЬ + ПРОСМОТР ПРЕПОДАВАТЕЛЕЙ (МОДАЛКА + ФИЛЬТРЫ)
// ============================================================
(function () {
  const get$ = id => document.getElementById(id);
  const ROLE_KEY = "role";

  let ALL_TEACHERS = {};
  let activeFilterSpec = null; 

  function buildTeacherSchedule(raw) {
    if (typeof raw === "undefined") return;

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

          if (!ALL_TEACHERS[teacher]) ALL_TEACHERS[teacher] = { specs: new Set(), days: {} };
          ALL_TEACHERS[teacher].specs.add(spec);

          if (!ALL_TEACHERS[teacher].days[dayIndex]) ALL_TEACHERS[teacher].days[dayIndex] = [];

          ALL_TEACHERS[teacher].days[dayIndex].push({
            number: p.number, text: subject, subject: subject, room: room, group: groupName, spec: spec, star: p.star
          });
        });
      });
    });

    Object.keys(ALL_TEACHERS).forEach(name => {
      ALL_TEACHERS[name].specs = Array.from(ALL_TEACHERS[name].specs);
    });
  }

  function getSavedRole() { return localStorage.getItem(ROLE_KEY) || ""; }
  function saveRole(role) { localStorage.setItem(ROLE_KEY, role); }
  function clearRole() { localStorage.removeItem(ROLE_KEY); }

  function switchToStudentUI() {
    get$("rowSpecs").style.display = "";
    get$("rowCourses").style.display = "";
    get$("rowGroups").style.display = "";
    get$("rowTeacherBtn").style.display = "none";
  }

  function switchToTeacherUI() {
    get$("rowSpecs").style.display = "none";
    get$("rowCourses").style.display = "none";
    get$("rowGroups").style.display = "none";
    get$("rowTeacherBtn").style.display = "";
  }

  function renderTeacherFilters() {
    switchToTeacherUI();
    applyColor("ИСП");
  }

  // --- МОДАЛКА ---
  function openModal() {
    const modal = get$("teacherModal");
    const input = get$("modalTeacherInput");
    if (!modal) return;

    modal.classList.add("open");
    input.value = "";
    activeFilterSpec = null;
    
    renderModalFilters();
    renderModalList("");
    
    setTimeout(() => input.focus(), 100);
  }

  function closeModal() {
    const modal = get$("teacherModal");
    if (modal) modal.classList.remove("open");
  }

  function renderModalFilters() {
    const bar = get$("modalSpecsFilter");
    if (!bar) return;
    
    bar.innerHTML = "";
    
    const uniqueSpecs = new Set();
    Object.values(ALL_TEACHERS).forEach(t => t.specs.forEach(s => uniqueSpecs.add(s)));
    
    Array.from(uniqueSpecs).sort().forEach(spec => {
      const col = COLORS[spec] ? COLORS[spec].c : "#1769E0";
      
      const chip = document.createElement("button");
      chip.className = "ts-filter-chip" + (activeFilterSpec === spec ? " on" : "");
      
      chip.innerHTML = `<span class="dot" style="background:${col};"></span> ${spec}`;
      
      chip.onclick = () => {
        if (activeFilterSpec === spec) {
          activeFilterSpec = null;
        } else {
          activeFilterSpec = spec;
        }
        renderModalFilters();
        renderModalList(get$("modalTeacherInput").value);
      };
      
      bar.appendChild(chip);
    });
  }

  function renderModalList(query) {
    const list = get$("modalTeacherList");
    if (!list) return;

    const q = query.toLowerCase().trim();
    let names = Object.keys(ALL_TEACHERS).sort();

    if (q) {
      names = names.filter(name => name.toLowerCase().includes(q));
    }

    if (activeFilterSpec) {
      names = names.filter(name => ALL_TEACHERS[name].specs.includes(activeFilterSpec));
    }

    if (names.length === 0) {
      list.innerHTML = `<div class="ts-no-results">Никого не найдено</div>`;
      return;
    }

    list.innerHTML = "";
    names.forEach(name => {
      const el = document.createElement("div");
      el.className = "ts-modal-item";
      
      const specs = ALL_TEACHERS[name].specs;
      let dotsHTML = '<div class="ts-dots">';
      specs.forEach(spec => {
        const col = COLORS[spec] ? COLORS[spec].c : "#1769E0";
        dotsHTML += `<span title="Ведет у ${spec}" style="background:${col};"></span>`;
      });
      dotsHTML += '</div>';

      el.innerHTML = `<span>${name}</span> ${dotsHTML}`;
      
      el.onclick = () => {
        state.teacher = name;
        closeModal();
        state.week = currentWeek();
        renderAll();
      };
      list.appendChild(el);
    });
  }

  function initModal() {
    const openBtn = get$("openTeacherModalBtn");
    const closeBtn = get$("closeTeacherModal");
    const modal = get$("teacherModal");
    const input = get$("modalTeacherInput");

    if (openBtn) openBtn.addEventListener("click", openModal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    if (input) {
      input.addEventListener("input", (e) => renderModalList(e.target.value));
    }
  }

  function renderTeacherSchedule() {
    const out = get$("out"), info = get$("weekInfo");
    out.innerHTML = "";

    if (!state.teacher) { 
      info.textContent = "Выберите преподавателя"; 
      return; 
    }

    const w = WEEK_LIST[state.week];
    info.textContent = `Неделя ${w.star} (${w.start} – ${w.end})`;

    const data = ALL_TEACHERS[state.teacher];
    if (!data) return;

    DAYS.forEach((day, index) => {
      const dayPairs = data.days[index];
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

      weekPairs.sort((a, b) => {
        if (a.number !== b.number) return a.number - b.number;
        return a.group.localeCompare(b.group);
      }).forEach(p => {
        const card = document.createElement("article");
        card.className = "card";
        
        const specColor = COLORS[p.spec] ? COLORS[p.spec].c : "#1769E0";
        card.style.borderLeftColor = specColor;
        
        card.innerHTML = `
          <div class="t" style="color: ${specColor}; font-weight: 600;">${BELLS[p.number]} <span style="opacity:0.6; color:var(--muted); font-weight:400;">· ${p.spec}</span></div>
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

  function updateNavButtons() {
    const btnDesktop = get$("switchRoleDesktop");
    const btnMobile = get$("switchRole");
    const btnForget = get$("forgetGroup"); 
    const menu = get$("mobileMenu");
    const burger = get$("burger");

    function closeMenu() {
      if (menu) menu.classList.remove("open");
      if (burger) burger.classList.remove("open");
    }

    if (btnForget) {
      if (state.mode === "teacher" || state.viewTeacher) {
        btnForget.style.display = "none";
      } else {
        btnForget.style.display = "block";
      }
    }

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

    if (btnDesktop) applyBtnSettings(btnDesktop);
    if (btnMobile) applyBtnSettings(btnMobile);
  }

  function init() {
    if (typeof RAW_DATA === "undefined" || typeof SCHEDULE === "undefined") return;

    buildTeacherSchedule(RAW_DATA);
    window.__renderTeacherSchedule = renderTeacherSchedule;
    window.__renderTeacherFilters  = renderTeacherFilters;

    if (typeof state.mode === "undefined") state.mode = "student";
    if (typeof state.teacher === "undefined") state.teacher = null;
    if (typeof state.viewTeacher === "undefined") state.viewTeacher = false;

    document.querySelectorAll(".role-card").forEach(card => {
      card.addEventListener("click", () => setRole(card.dataset.role));
    });

    initModal();

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