// ============================================================
//  ПРОСМОТР ПРЕПОДАВАТЕЛЕЙ (МОДАЛКА + ФИЛЬТРЫ)
// ============================================================
(function () {
  const get$ = id => document.getElementById(id);
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
          let teacher = m[1].trim().replace(/[^А-Яа-яЁё\s\.]/g, '').replace(/\s+/g, ' ').trim();
          if (!teacher) return;
          const subject = t.split("преп.")[0].trim().replace(/,\s*$/, "");
          const roomMatch = t.match(/(?:ауд\.|спортивный зал)\s*([^,]+?)(?:\s|$)/i);
          let room = roomMatch ? roomMatch[1].trim() : "";
          if (t.toLowerCase().includes("спортивный зал")) room = "Спортивный зал";

          if (!ALL_TEACHERS[teacher]) ALL_TEACHERS[teacher] = { specs: new Set(), days: {} };
          ALL_TEACHERS[teacher].specs.add(spec);
          if (!ALL_TEACHERS[teacher].days[dayIndex]) ALL_TEACHERS[teacher].days[dayIndex] = [];
          ALL_TEACHERS[teacher].days[dayIndex].push({ number: p.number, text: subject, subject, room, group: groupName, spec, star: p.star });
        });
      });
    });
    Object.keys(ALL_TEACHERS).forEach(name => { ALL_TEACHERS[name].specs = Array.from(ALL_TEACHERS[name].specs); });
  }

  function openModal() {
    const modal = get$("teacherModal"), input = get$("modalTeacherInput");
    if (!modal) return;
    modal.classList.add("open"); input.value = ""; activeFilterSpec = null;
    renderModalFilters(); renderModalList("");
    setTimeout(() => input.focus(), 100);
  }

  function closeModal() { const modal = get$("teacherModal"); if (modal) modal.classList.remove("open"); }

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
        activeFilterSpec = (activeFilterSpec === spec) ? null : spec;
        renderModalFilters(); renderModalList(get$("modalTeacherInput").value);
      };
      bar.appendChild(chip);
    });
  }

  function renderModalList(query) {
    const list = get$("modalTeacherList");
    if (!list) return;
    const q = query.toLowerCase().trim();
    let names = Object.keys(ALL_TEACHERS).sort();
    if (q) names = names.filter(name => name.toLowerCase().includes(q));
    if (activeFilterSpec) names = names.filter(name => ALL_TEACHERS[name].specs.includes(activeFilterSpec));
    if (names.length === 0) { list.innerHTML = `<div class="ts-no-results">Никого не найдено</div>`; return; }
    list.innerHTML = "";
    names.forEach(name => {
      const el = document.createElement("div"); el.className = "ts-modal-item";
      const specs = ALL_TEACHERS[name].specs;
      let dotsHTML = '<div class="ts-dots">';
      specs.forEach(spec => { dotsHTML += `<span title="Ведет у ${spec}" style="background:${COLORS[spec] ? COLORS[spec].c : "#1769E0"};"></span>`; });
      dotsHTML += '</div>';
      el.innerHTML = `<span>${name}</span> ${dotsHTML}`;
      el.onclick = () => { state.teacher = name; closeModal(); state.week = currentWeek(); renderAll(); };
      list.appendChild(el);
    });
  }

  function initModal() {
    const openBtn = get$("openTeacherModalBtn"), modal = get$("teacherModal"), input = get$("modalTeacherInput");
    if (openBtn) openBtn.addEventListener("click", openModal);
    if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
    if (input) input.addEventListener("input", (e) => renderModalList(e.target.value));
    const changeBtn = get$("activeTeacherChangeBtn");
    if (changeBtn) changeBtn.addEventListener("click", openModal);
  }

  function renderTeacherSchedule() {
  const out = get$("out"), info = get$("weekInfo"), banner = get$("activeTeacherBanner"), bannerName = get$("activeTeacherName");
  if (!out) return;
  out.innerHTML = "";
  if (!state.teacher) { info.textContent = "Выберите преподавателя"; if (banner) banner.style.display = "none"; return; }
  
  const w = WEEK_LIST[state.week];
  info.textContent = `${state.teacher} · Неделя ${w.star} (${w.start} – ${w.end})`;
  if (banner && bannerName) { banner.style.display = "flex"; bannerName.textContent = state.teacher; }
  
  const cardsByDay = buildLessonCards(); // Используем общую функцию
  
  DAYS.forEach((day, index) => {
    const block = document.createElement("section"); block.className = "day";
    const h2 = document.createElement("h2"); h2.textContent = DAY_NAMES[day]; block.appendChild(h2);
    
    let dayCards = (cardsByDay[index] && cardsByDay[index][w.star]) || [];
    
    // Фильтр: оставляем карточки, где ведёт этот преподаватель
    dayCards = dayCards.filter(card => card.teachers.includes(state.teacher));
    
    if (!dayCards.length) { 
      const empty = document.createElement("div"); empty.className = "day-empty"; empty.textContent = "Выходной"; 
      block.appendChild(empty); out.appendChild(block); return; 
    }
    
    const grid = document.createElement("div"); grid.className = "cards";
    dayCards.forEach(card => {
      const el = document.createElement("article"); el.className = "card";
      const mainSpec = card.groups.length > 0 ? card.groups[0].spec : "ИСП";
      const specColor = COLORS[mainSpec] ? COLORS[mainSpec].c : "#1769E0";
      el.style.borderLeftColor = specColor;
      
      const subNote = card.subgroups.length ? ` <small style="color:#6b6b6b;font-weight:400">(подгр. ${card.subgroups.join(", ")})</small>` : "";
      
      // Чипсы ВСЕХ групп
      const chips = card.groups.map(g => {
        const col = (COLORS[g.spec] && COLORS[g.spec].c) || "#1769E0";
        return `<span class="group-chip" style="--chip-c:${col}">${g.group}</span>`;
      }).join("");
      
      el.innerHTML = `<div class="t" style="color: ${specColor}; font-weight: 600;">${card.time} <span style="opacity:0.6; color:var(--muted); font-weight:400;">· ${mainSpec}</span></div><div class="s">${card.subject}${subNote}</div><div class="m">${card.room}</div>${card.groups.length > 0 ? `<div class="card-groups">${chips}</div>` : ""}`;
      grid.appendChild(el);
    });
    
    block.appendChild(grid); out.appendChild(block);
  });
}

  window.__renderTeacherSchedule = renderTeacherSchedule;
  window.__renderTeacherFilters = () => {
    get$("rowSpecs").style.display = "none"; get$("rowCourses").style.display = "none"; get$("rowGroups").style.display = "none";
    get$("rowTeacherBtn").style.display = ""; applyColor("ИСП");
  };

  window.addEventListener("load", () => {
    if (typeof RAW_DATA === "undefined") return;
    buildTeacherSchedule(RAW_DATA);
    initModal();
  });
})();