// ============================================================
//  ПРОСМОТР ПРЕПОДАВАТЕЛЕЙ (МОДАЛКА + ФИЛЬТРЫ)
// ============================================================
(function () {
  const get$ = id => document.getElementById(id);
  let ALL_TEACHERS = {};
  let activeFilterSpec = null; 

  // Собираем преподавателей из ОБЕИХ баз (колледж и институт)
  function buildTeacherSchedule() {
    ALL_TEACHERS = {};
    
    const collectFromBase = (rawData, institutionType) => {
      if (typeof rawData === "undefined") return;
      
      Object.keys(rawData).forEach(groupName => {
        const specMatch = groupName.match(/^(.+?)-/);
        if (!specMatch) return;
        const spec = specMatch[1].trim();
        
        Object.keys(rawData[groupName]).forEach(dayIndex => {
          const pairs = rawData[groupName][dayIndex];
          if (!Array.isArray(pairs)) return;
          
          pairs.forEach(p => {
            const parsed = (typeof parseText === "function") 
              ? parseText(p.text) 
              : { subject: p.text, teacher: "", room: "" };
            
            const rawTeacher = parsed.teacher;
            if (!rawTeacher) return;

            // ЖЕСТКАЯ ОЧИСТКА: оставляем только Фамилию и Инициалы (И.О.)
            // Паттерн ищет слово с большой буквы, за которым идут инициалы (например, "Ерохина О.А.")
            const match = rawTeacher.match(/([А-ЯЁ][а-яё\-]+\s+[А-ЯЁ]\.\s*(?:[А-ЯЁ]\.)?)/);
            
            // Если нашли — берем только это. Если нет — берем все буквы, цифры и точки.
            let cleanName = match ? match[1].replace(/\s+/g, " ").trim() : rawTeacher.replace(/[^А-Яа-яЁё\s\.\-]/g, "").trim();
            
            // Если имя пустое — пропускаем
            if (!cleanName) return;

            // Определяем "крутость" для сортировки
            let rank = 0;
            if (rawTeacher.includes("профессор")) rank = 3;
            else if (rawTeacher.includes("доцент")) rank = 2;
            else if (rawTeacher.includes("ст.преп")) rank = 1;
            else if (rawTeacher.includes("преп")) rank = 1;

            // Если преподавателя ещё нет или у него меньше ранг — создаём/обновляем
            if (!ALL_TEACHERS[cleanName] || (ALL_TEACHERS[cleanName].rank || 0) < rank) {
              ALL_TEACHERS[cleanName] = ALL_TEACHERS[cleanName] || { specs: new Set(), institutions: new Set(), days: {} };
              ALL_TEACHERS[cleanName].fullName = rawTeacher; // Сохраняем самую "крутую" запись
              ALL_TEACHERS[cleanName].rank = rank;
            }
            
            const teacher = cleanName;
            
            ALL_TEACHERS[teacher].specs.add(spec);
            ALL_TEACHERS[teacher].institutions.add(institutionType);
            
            if (!ALL_TEACHERS[teacher].days[dayIndex]) {
              ALL_TEACHERS[teacher].days[dayIndex] = [];
            }
            
            ALL_TEACHERS[teacher].days[dayIndex].push({ 
              number: p.number, subject: parsed.subject, room: parsed.room, 
              group: groupName, spec: spec, institution: institutionType, star: p.star 
            });
          });
        });
      });
    };
    
    collectFromBase(typeof RAW_DATA !== "undefined" ? RAW_DATA : null, "college");
    collectFromBase(typeof VUZ_RAW_DATA !== "undefined" ? VUZ_RAW_DATA : null, "institute");
    
    // Set -> Array
    Object.keys(ALL_TEACHERS).forEach(name => { 
      ALL_TEACHERS[name].specs = Array.from(ALL_TEACHERS[name].specs); 
      ALL_TEACHERS[name].institutions = Array.from(ALL_TEACHERS[name].institutions);
    });
  }

  function openModal() {
    const modal = get$("teacherModal"), input = get$("modalTeacherInput");
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
        activeFilterSpec = (activeFilterSpec === spec) ? null : spec;
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
    if (q) names = names.filter(name => name.toLowerCase().includes(q));
    if (activeFilterSpec) names = names.filter(name => ALL_TEACHERS[name].specs.includes(activeFilterSpec));
    if (names.length === 0) { 
      list.innerHTML = `<div class="ts-no-results">Никого не найдено</div>`; 
      return; 
    }
    list.innerHTML = "";
    
    names.forEach(name => {
      const el = document.createElement("div"); 
      el.className = "ts-modal-item";
      const specs = ALL_TEACHERS[name].specs;
      
      // Только цветные точки специальностей
      let dotsHTML = '<div class="ts-dots">';
      specs.forEach(spec => { 
        dotsHTML += `<span title="Ведет у ${spec}" style="background:${COLORS[spec] ? COLORS[spec].c : "#1769E0"};"></span>`; 
      });
      dotsHTML += '</div>';
      
      const displayName = ALL_TEACHERS[name].fullName || name;
      el.innerHTML = `<span>${displayName}</span> ${dotsHTML}`;
      
      el.onclick = () => { 
        state.teacher = name; 
        state.viewTeacher = true; 
        closeModal(); 
        state.week = currentWeek(); 
        renderAll(); 
        if (window.updateProfileData) window.updateProfileData();
      };
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
    
    if (!state.teacher) { 
      info.textContent = "Выберите преподавателя"; 
      if (banner) banner.style.display = "none"; 
      return; 
    }
    
    const w = WEEK_LIST[state.week];
    info.innerHTML = `${ALL_TEACHERS[state.teacher]?.fullName || state.teacher}<br><span style="font-size:0.85em; opacity:0.8;">Неделя ${w.star} (${w.start} – ${w.end})</span>`;
    
    if (banner && bannerName) { 
      banner.style.display = "flex"; 
      bannerName.textContent = ALL_TEACHERS[state.teacher]?.fullName || state.teacher; 
    }
    
    const collegeCards = buildLessonCards(RAW_DATA, "college");
    const instituteCards = buildLessonCards(VUZ_RAW_DATA, "institute");
    
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
          
          const searchName = state.teacher.trim().toLowerCase().split(" ")[0];
          const hasTeacher = card.teachers.some(t => {
            const teacherName = t.toLowerCase();
            return teacherName.includes(searchName) || searchName.includes(teacherName.split(" ")[0]);
          });
          if (!hasTeacher) return false;
          
          card.institutionLabel = instLabel;
          return true;
        });
      };
      
     const collegeDayCards = filterCards((collegeCards[index] && collegeCards[index][w.star]) || [], "college");
     const instituteDayCards = filterCards((instituteCards[index] && instituteCards[index][w.star]) || [], "institute");
     const allCards = [...collegeDayCards, ...instituteDayCards];

      // Сортируем все пары строго по номеру
      allCards.sort((a, b) => a.number - b.number);
            
      if (!allCards.length) { 
        const empty = document.createElement("div"); empty.className = "day-empty"; empty.textContent = "Выходной"; 
        block.appendChild(empty); out.appendChild(block); return; 
      }
      
      const grid = document.createElement("div"); grid.className = "cards";
      
      allCards.forEach(card => {
        const el = document.createElement("article"); el.className = "card";
        const mainSpec = card.groups.length > 0 ? card.groups[0].spec : "ИСП";
        const specColor = COLORS[mainSpec] ? COLORS[mainSpec].c : "#1769E0";
        el.style.borderLeftColor = specColor;
        
        const subNote = card.subgroups.length ? ` <small style="color:#6b6b6b;font-weight:400">(подгр. ${card.subgroups.join(", ")})</small>` : "";
        
        const chips = card.groups.map(g => {
          const col = (COLORS[g.spec] && COLORS[g.spec].c) || "#1769E0";
          return `<span class="group-chip" style="--chip-c:${col}">${g.group}</span>`;
        }).join("");
        
        const badge = card.institutionLabel === "institute" 
          ? `<span class="inst-badge inst-badge--institute">🎓 Институт</span>` 
          : `<span class="inst-badge inst-badge--college">🏫 Колледж</span>`;
        
        el.innerHTML = `
          <div class="card-header">
            <div class="t" style="color: ${specColor}; font-weight: 600;">${card.time} <span style="opacity:0.6; color:var(--muted); font-weight:400;">· ${mainSpec}</span></div>
            ${badge}
          </div>
          <div class="s">${card.subject}${subNote}</div>
          <div class="m">${card.room}</div>
          ${card.groups.length > 0 ? `<div class="card-groups">${chips}</div>` : ""}
        `;
        
        // ДОБАВЛЕНО: Открытие модалки для преподавателя
        el.style.cursor = "pointer";
        el.addEventListener("click", () => {
          const modal = document.getElementById("lessonDetailsModal");
          if (!modal) return;
          document.getElementById("ldTime").textContent = card.time;
          document.getElementById("ldSubject").textContent = card.subject;
          document.getElementById("ldRoom").textContent = card.room || "Не указана";
          document.getElementById("ldTeacher").textContent = card.teachers.length ? card.teachers.join(", ") : "Не указан";
          
          const groupsContainer = document.getElementById("ldGroups");
          groupsContainer.innerHTML = "";
          card.groups.forEach(g => {
            const col = (COLORS[g.spec] && COLORS[g.spec].c) || "#1769E0";
            groupsContainer.innerHTML += `<span class="group-chip" style="--chip-c:${col}">${g.group}</span>`;
          });
          
          modal.classList.add("open");
        });

        grid.appendChild(el);
      });
      
      block.appendChild(grid); out.appendChild(block);
    });
  }

  window.__renderTeacherSchedule = renderTeacherSchedule;
  window.__renderTeacherFilters = () => {
    get$("rowSpecs").style.display = "none"; 
    get$("rowCourses").style.display = "none"; 
    get$("rowGroups").style.display = "none";
    get$("rowTeacherBtn").style.display = ""; 
    applyColor("ИСП");
  };

  window.addEventListener("load", () => {
    buildTeacherSchedule();
    initModal();
  });
})();