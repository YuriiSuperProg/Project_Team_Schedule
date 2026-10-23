// ============================================================
//  КРАСИВОЕ ПРИВЕТСТВИЕ (ПЕРВЫЙ ЗАХОД)
// ============================================================
(function() {
  const WELCOME_KEY = "welcomeShown";
  
  // Если имя уже есть — ничего не показываем
  if (localStorage.getItem("userName")) return;

  // Создаем HTML модалки
  const overlay = document.createElement("div");
  overlay.className = "welcome-overlay";
  overlay.id = "welcomeModal";

  overlay.innerHTML = `
    <div class="welcome-card">
      <div class="welcome-icon">👋</div>
      <h2>Привет!</h2>
      <p>Как тебя зовут? Мы будем обращаться к тебе по имени.</p>
      
      <div class="welcome-input-wrap">
        <input type="text" id="welcomeInput" class="welcome-input" placeholder="Твоё имя..." autocomplete="off">
      </div>
      
      <button id="welcomeBtn" class="welcome-btn">Продолжить</button>
    </div>
  `;

  // Добавляем в body после загрузки страницы
  window.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(overlay);
    
    const input = document.getElementById("welcomeInput");
    const btn = document.getElementById("welcomeBtn");

    // Фокус на инпут
    setTimeout(() => input.focus(), 100);

    const submit = () => {
      const val = input.value.trim();
      if (val) {
        localStorage.setItem("userName", val);
        
        // Если мы на странице расписания, обновляем имя
        const nameEl = document.getElementById("userName");
        if (nameEl) nameEl.textContent = val;
        
        // Анимация закрытия
        overlay.classList.add("closing");
        setTimeout(() => overlay.remove(), 300);
      } else {
        input.classList.add("error");
        setTimeout(() => input.classList.remove("error"), 500);
      }
    };

    btn.addEventListener("click", submit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") submit();
    });
  });
})();