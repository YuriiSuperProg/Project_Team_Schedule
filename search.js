// ============================================================
//  ПОИСК ПО ДАТЕ — отдельный модуль
//  Формат ввода: дд.мм.гггг
// ============================================================

(function () {

  const get$ = window.$ || (id => document.getElementById(id));

  // -------- маска ввода: цифры + точки автоматически --------
  function applyMask(input) {
    input.addEventListener("input", () => {
      let v = input.value.replace(/\D/g, ""); // только цифры
      v = v.slice(0, 8);                      // макс 8 цифр

      let out = "";
      if (v.length <= 2) {
        out = v;
      } else if (v.length <= 4) {
        out = v.slice(0, 2) + "." + v.slice(2);
      } else {
        out = v.slice(0, 2) + "." + v.slice(2, 4) + "." + v.slice(4);
      }

      input.value = out;
    });

    // запрещаем вводить нецифры
    input.addEventListener("keypress", e => {
      const c = e.key;
      if (c.length === 1 && !/\d/.test(c)) e.preventDefault();
    });
  }

  // -------- найти неделю по дате --------
  function findWeekByDate(target) {
    const parseDate = window.parseDate || (s => {
      const [d, m, y] = s.split(".").map(Number);
      return new Date(y, m - 1, d);
    });

    for (let i = 0; i < WEEK_LIST.length; i++) {
      const a = parseDate(WEEK_LIST[i].start);
      const b = parseDate(WEEK_LIST[i].end);
      a.setHours(0, 0, 0, 0);
      b.setHours(23, 59, 59, 999);
      if (target >= a && target <= b) return i;
    }
    return -1;
  }

  // -------- подсветить нужный день --------
  function highlightDay(dayIndex) {
    const days = document.querySelectorAll("#out .day");
    days.forEach(d => d.classList.remove("highlight"));
    if (days[dayIndex]) {
      days[dayIndex].classList.add("highlight");
      setTimeout(() => {
        days[dayIndex].scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }

  // -------- основная функция --------
   function searchByDate() {
    const input = get$("dateInput");
    if (!input) return;

    const val = input.value.trim();
    if (!val) {
      if (window.showGlobalToast) window.showGlobalToast("Введи дату в формате дд.мм.гггг");
      input.focus();
      return;
    }

    const parts = val.split(".");
    if (parts.length !== 3) {
      if (window.showGlobalToast) window.showGlobalToast("Формат: дд.мм.гггг");
      input.focus();
      return;
    }

    const [dd, mm, yyyy] = parts.map(Number);
    if (!dd || !mm || !yyyy || dd > 31 || mm > 12 || yyyy < 2000) {
      if (window.showGlobalToast) window.showGlobalToast("Неверная дата");
      input.focus();
      return;
    }

    const target = new Date(yyyy, mm - 1, dd);
    target.setHours(0, 0, 0, 0);

    const idx = findWeekByDate(target);
    if (idx === -1) {
      if (window.showGlobalToast) window.showGlobalToast("Эта дата не попадает в учебный год");
      return;
    }

    state.week = idx;
    const dayIndex = (target.getDay() + 6) % 7;

    if (window.unlockAchievement) {
      window.unlockAchievement("dateSearch");
    }

    renderSchedule();
    renderDayProgress();
    renderTomorrow();

    setTimeout(() => highlightDay(dayIndex), 100);
  }
  // -------- инициализация --------
  function init() {
    const btn = get$("dateFind");
    if (btn) btn.addEventListener("click", searchByDate);

    const input = get$("dateInput");
    if (input) {
      applyMask(input);
      input.addEventListener("keydown", e => {
        if (e.key === "Enter") searchByDate();
      });
    }
  }

  window.addEventListener("load", init);

  window.searchByDate = searchByDate;
  window.findWeekByDate = findWeekByDate;

})();