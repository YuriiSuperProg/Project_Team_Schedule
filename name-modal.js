// ============================================================
//  ИЗМЕНЕНИЕ ИМЕНИ (ОТДЕЛЬНЫЙ СКРИПТ, ЧТОБЫ ТОЧНО РАБОТАЛО)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("nameEdit");
  const modal = document.getElementById("nameModal");
  const input = document.getElementById("nameModalInput");
  const saveBtn = document.getElementById("nameModalSave");
  const cancelBtn = document.getElementById("nameModalCancel");

  if (!btn || !modal || !input || !saveBtn || !cancelBtn) {
    console.warn("Не найдены элементы для модалки имени");
    return;
  }

  // Проверка имени (только буквы, 2-20 символов)
  function isValidName(raw) {
    if (!raw) return false;
    const clean = raw.trim().replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, "");
    return clean.length >= 2 && clean.length <= 20;
  }

  // Открытие
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    input.value = localStorage.getItem("userName") || "";
    modal.classList.add("open");
    setTimeout(() => input.focus(), 100);
  });

  // Закрытие по кнопке "Отмена"
  cancelBtn.addEventListener("click", () => {
    modal.classList.remove("open");
  });

  // Сохранение
  saveBtn.addEventListener("click", () => {
    const raw = input.value.trim();
    if (!isValidName(raw)) {
      input.style.borderColor = "#ef4444";
      input.placeholder = "Только буквы (2-20 символов)";
      setTimeout(() => {
        input.style.borderColor = "";
        input.placeholder = "Введи имя...";
      }, 2000);
      return;
    }

    const clean = raw.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, "").slice(0, 20);
    localStorage.setItem("userName", clean);
    
    // Обновляем имя в приветствии
    const nameEl = document.getElementById("userName");
    if (nameEl) nameEl.textContent = clean;
    
    // Обновляем профиль, если открыт
    const profileName = document.getElementById("profileName");
    if (profileName) profileName.textContent = clean;
    
    // Достижение
    if (window.unlockAchievement) window.unlockAchievement("nameChanged");
    
    modal.classList.remove("open");
  });

  // Закрытие по клику на фон
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("open");
  });

  // Закрытие по Enter
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveBtn.click();
    }
  });

  // Закрытие по Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      modal.classList.remove("open");
    }
  });
});