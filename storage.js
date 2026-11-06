// ============================================================
//  ЗАПОМИНАНИЕ ГРУППЫ (ОТДЕЛЬНЫЙ МОДУЛЬ)
// ============================================================

(function () {
  const GROUP_KEY = "savedGroup";
  const groupKey = institution => `${GROUP_KEY}:${institution || "college"}`;

  // --- Сохранить группу ---
  window.saveUserGroup = function (spec, course, group, institution = "college") {
    if (!spec || !course || !group) return;
    try {
      localStorage.setItem(groupKey(institution), JSON.stringify({ spec, course, group }));
    } catch (e) {
      console.warn("Не удалось сохранить группу:", e);
    }
  };

  // --- Загрузить группу ---
  window.loadUserGroup = function (institution = "college") {
    try {
      const raw = localStorage.getItem(groupKey(institution)) || (institution === "college" ? localStorage.getItem(GROUP_KEY) : null);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || !data.spec || !data.group) return null;
      return data; // { spec, course, group }
    } catch (e) {
      return null;
    }
  };

  // --- Забыть группу ---
  window.clearUserGroup = function (institution = "college") {
    try {
      localStorage.removeItem(groupKey(institution));
      if (institution === "college") localStorage.removeItem(GROUP_KEY);
    } catch (e) { /* ignore */ }
  };

  // --- Показать плашку с текущей группой ---
  window.renderCurrentGroupBanner = function (spec, course, group) {
    const banner = document.getElementById("currentGroupBanner");
    const nameEl = document.getElementById("currentGroupName");
    if (!banner || !nameEl) return;

    if (spec && course && group) {
      banner.style.display = "flex";
      nameEl.textContent = group;
    } else {
      banner.style.display = "none";
    }
  };

  // --- Обработчик кнопки "Сменить" ---
  document.addEventListener("DOMContentLoaded", () => {
    const changeBtn = document.getElementById("changeGroupBtn");
    if (changeBtn) {
      changeBtn.addEventListener("click", () => {
        const filters = document.querySelector(".filters");
        if (filters) {
          filters.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    }
  });
})();