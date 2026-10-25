// ============================================================
//  ЗАПОМИНАНИЕ ГРУППЫ (ОТДЕЛЬНЫЙ МОДУЛЬ)
// ============================================================

(function () {
  const GROUP_KEY = "savedGroup";

  // --- Сохранить группу ---
  window.saveUserGroup = function (spec, course, group) {
    if (!spec || !course || !group) return;
    try {
      localStorage.setItem(GROUP_KEY, JSON.stringify({ spec, course, group }));
    } catch (e) {
      console.warn("Не удалось сохранить группу:", e);
    }
  };

  // --- Загрузить группу ---
  window.loadUserGroup = function () {
    try {
      const raw = localStorage.getItem(GROUP_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || !data.spec || !data.group) return null;
      return data; // { spec, course, group }
    } catch (e) {
      return null;
    }
  };

  // --- Забыть группу ---
  window.clearUserGroup = function () {
    try {
      localStorage.removeItem(GROUP_KEY);
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