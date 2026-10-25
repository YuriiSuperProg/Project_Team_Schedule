// ============================================================
//  ТЁМНАЯ ТЕМА
// ============================================================
function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") document.documentElement.classList.add("dark");
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = document.getElementById("themeIcon");
  if (!icon) return;
  const isDark = document.documentElement.classList.contains("dark");
  icon.textContent = isDark ? "☀️" : "🌑";
}

function toggleTheme() {
  document.documentElement.classList.toggle("dark");
  const isDark = document.documentElement.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeIcon();
}

initTheme();

// ============================================================
//  МЕНЮ
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn    = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeBtn   = document.getElementById("closeMenuBtn");
  const themeBtn   = document.getElementById("themeToggle");

  if (!menuBtn || !mobileMenu) return;

  function toggleMenu(e) {
    if (e) e.stopPropagation();
    const isOpen = mobileMenu.classList.toggle("open");
    menuBtn.classList.toggle("open", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  function closeMenu() {
    mobileMenu.classList.remove("open");
    menuBtn.classList.remove("open");
    document.body.style.overflow = "";
  }

  menuBtn.addEventListener("click", toggleMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);

  if (themeBtn) {
    themeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleTheme();
    });
  }

  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  mobileMenu.addEventListener("click", (e) => {
    if (e.target === mobileMenu) closeMenu();
  });
});

// ============================================================
//  ПЛАВНОЕ ПОЯВЛЕНИЕ
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const revealTargets = document.querySelectorAll(
    ".about-item, .member, .cta, .eco-card"
  );

  revealTargets.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(14px)";
    el.style.transition = "opacity .5s ease, transform .5s ease";
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => revealObserver.observe(el));
});

// ============================================================
//  ЭКОСИСТЕМА (3D-наклон, свайп и модалка)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("ecosystem");
  const grid    = document.getElementById("ecoGrid");
  const dotsBox = document.getElementById("ecoDots");
  const overlay = document.getElementById("ecoOverlay");
  const modal   = document.getElementById("ecoModal");
  const modalBox= document.getElementById("ecoModalContent");
  const closeBtn= document.getElementById("ecoModalClose");

  if (!section || !grid) return;

  const cards = Array.from(grid.querySelectorAll(".eco-card"));
  const mqDesktop = window.matchMedia("(min-width: 901px)");
  const isDesktop = () => mqDesktop.matches;

  let modalOpen = false;
  let lastFocused = null;

  // ---------- 3D-наклон ----------
  const TILT_MAX = 10;
  const SCALE    = 1.04;

  function onMove(e) {
    if (modalOpen || !isDesktop()) return;
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top)  / r.height;
    const rotY = (px - 0.5) * 2 * TILT_MAX;
    const rotX = -(py - 0.5) * 2 * TILT_MAX;
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(${SCALE},${SCALE},${SCALE})`;
  }

  function onLeave(e) {
    const card = e.currentTarget;
    card.style.transform = "";
  }

  cards.forEach(card => {
    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
  });

  // ---------- Модалка с FLIP ----------
  function openModal(card) {
    if (!isDesktop() || modalOpen) return;
    modalOpen = true;

    const rect = card.getBoundingClientRect();
    cards.forEach(c => (c.style.transform = ""));

    const clone = card.cloneNode(true);
    clone.classList.remove("eco-card");
    clone.removeAttribute("data-color");

    modalBox.replaceChildren(clone);

    const color = card.dataset.color || "#1769E0";
    modalBox.style.setProperty("--eco-accent", color);
    
    overlay.hidden = false;
    modal.hidden = false;

    // FLIP-анимация
    modalBox.style.transformOrigin = "top left";
    modalBox.style.transition = "none";

    const modalRect = modalBox.getBoundingClientRect();
    const scaleX = rect.width / modalRect.width;
    const scaleY = rect.height / modalRect.height;
    const translateX = rect.left - modalRect.left;
    const translateY = rect.top - modalRect.top;

    modalBox.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
    modalBox.style.opacity = "0";
    modalBox.style.borderRadius = "24px";

    void modalBox.offsetWidth;

    requestAnimationFrame(() => {
      modalBox.style.transition = "transform 0.55s cubic-bezier(0.2, 0.9, 0.3, 1.05), opacity 0.4s ease, border-radius 0.4s ease";
      modalBox.style.transform = "translate(0, 0) scale(1, 1)";
      modalBox.style.opacity = "1";
      modalBox.style.borderRadius = "28px";

      overlay.classList.add("is-open");
      modal.classList.add("is-open");
    });

    document.body.style.overflow = "hidden";
    lastFocused = document.activeElement;
    setTimeout(() => closeBtn.focus(), 600);
  }

  function closeModal() {
    if (!modalOpen) return;
    modalOpen = false;

    modalBox.style.transition = "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease";
    modalBox.style.transform = "scale(0.9) translateY(20px)";
    modalBox.style.opacity = "0";

    overlay.classList.remove("is-open");
    modal.classList.remove("is-open");

    setTimeout(() => {
      overlay.hidden = true;
      modal.hidden = true;
      modalBox.replaceChildren();
      modalBox.style.transform = "";
      modalBox.style.opacity = "";
      modalBox.style.transition = "";
      modalBox.style.borderRadius = "";
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }, 400);
  }

  cards.forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".eco-btn")) return; // Если кликнули на кнопку внутри карточки — не открываем модалку
      openModal(card);
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (overlay) overlay.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // ---------- Подсветка фона ----------
  function hexToRgba(hex, a) {
    const h = hex.replace("#", "");
    const n = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }

  cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      if (!isDesktop() || modalOpen) return;
      const color = card.dataset.color || "#1769E0";
      section.style.setProperty("--eco-bg", `radial-gradient(circle at 50% 40%, ${hexToRgba(color, 0.08)}, transparent 70%)`);
    });
    card.addEventListener("mouseleave", () => {
      if (!isDesktop() || modalOpen) return;
      section.style.setProperty("--eco-bg", "transparent");
    });
  });

  // ---------- Точки ----------
  function buildDots() {
    if (!dotsBox) return;
    dotsBox.replaceChildren();
    if (isDesktop()) return;

    cards.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "eco-dot";
      if (i === 0) b.classList.add("active");
      b.addEventListener("click", () => {
        cards[i].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      });
      dotsBox.appendChild(b);
    });
  }

  function updateActiveDot() {
    if (!dotsBox || isDesktop()) return;
    const gridRect = grid.getBoundingClientRect();
    const center = gridRect.left + gridRect.width / 2;
    let best = 0, bestDist = Infinity;
    cards.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - center);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    dotsBox.querySelectorAll(".eco-dot").forEach((b, i) => {
      b.classList.toggle("active", i === best);
    });
  }

  let tick = null;
  grid.addEventListener("scroll", () => {
    if (isDesktop() || tick) return;
    tick = requestAnimationFrame(() => {
      updateActiveDot();
      tick = null;
    });
  });

  mqDesktop.addEventListener("change", (e) => {
    if (e.matches) {
      if (dotsBox) dotsBox.replaceChildren();
      closeModal();
    } else {
      buildDots();
      section.style.setProperty("--eco-bg", "transparent");
    }
  });

  buildDots();
});

// ============================================================
//  ПРИВЕТСТВИЕ
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("welcomeOverlay");
  const input   = document.getElementById("welcomeInput");
  const btn     = document.getElementById("welcomeBtn");

  if (!overlay || !input || !btn) return;

  const KEY = "welcomeName";

  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch {}

  if (saved && saved.trim().length >= 2) {
    overlay.hidden = true;
    return;
  }

  overlay.hidden = false;
  setTimeout(() => input.focus(), 100);

  function hideOverlay() {
    overlay.classList.add("closing");
    setTimeout(() => {
      overlay.hidden = true;
      overlay.classList.remove("closing");
      document.body.style.overflow = "";
    }, 300);
  }

  function submit() {
    const name = input.value.trim();

    if (name.length < 2) {
      input.classList.add("error");
      setTimeout(() => input.classList.remove("error"), 500);
      input.focus();
      return;
    }

    try {
      localStorage.setItem(KEY, name);
    } catch (e) {
      console.warn("Не удалось сохранить имя:", e);
    }

    hideOverlay();
  }

  btn.addEventListener("click", submit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  });
});

// ============================================================
//  КНОПКА «НАВЕРХ»
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const toTop = document.getElementById("toTop");
  if (toTop) {
    toTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});

// ============================================================
//  3D-НАКЛОН ЭКОСИСТЕМЫ (СЛЕЖКА ЗА МЫШКОЙ)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".eco-card");

  cards.forEach(card => {
    // При движении мыши над карточкой
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // Позиция мыши по X внутри карточки
      const y = e.clientY - rect.top;  // Позиция мыши по Y внутри карточки
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Вычисляем угол наклона (чем дальше от центра, тем больше наклон)
      const rotateX = ((y - centerY) / centerY) * -10; // Максимальный наклон 10 градусов
      const rotateY = ((x - centerX) / centerX) * 10;

      // Применяем 3D-трансформацию
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      
      // Делаем превью внутри карточки чуть более объемным
      const preview = card.querySelector('.eco-preview');
      if (preview) {
        preview.style.transform = `translateZ(20px)`; // Сдвигаем превью вперед
      }
    });

    // Когда мышка уходит с карточки — плавно возвращаем её в исходное положение
    card.addEventListener("mouseleave", () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      card.style.transition = "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)";
      
      const preview = card.querySelector('.eco-preview');
      if (preview) {
        preview.style.transform = `translateZ(0)`;
      }
    });

    // Когда мышка заходит на карточку — убираем задержку для мгновенной реакции
    card.addEventListener("mouseenter", () => {
      card.style.transition = "none";
    });
  });
});

// ============================================================
//  МОБИЛЬНЫЙ ХАБ ЭКОСИСТЕМЫ
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const hub = document.getElementById("ecoMobileHub");
  if (!hub) return;

  const buttons = hub.querySelectorAll(".emh-btn");
  const titleEl = document.getElementById("emhTitle");
  const descEl  = document.getElementById("emhDesc");
  const ctaEl   = document.getElementById("emhCta");
  const contentBox = document.getElementById("emhContent");

  // Модалка iOS
  const iosModal = document.getElementById("iosInstallModal");
  const closeInstallBtn = document.getElementById("closeInstallBtn");

  // Данные для каждого таба
  const data = {
    web: { 
      title: "Web / PWA", 
      desc: "Работает в браузере. Можно установить на iPhone как приложение.", 
      cta: "Как установить?", 
      action: "modal" // Специальное действие для открытия модалки
    },
    android: { 
      title: "Android", 
      desc: "Скоро появится в Google Play", 
      cta: "Скачать", 
      link: "#" 
    },
    tg: { 
      title: "Telegram-бот", 
      desc: "Расписание прямо в мессенджере", 
      cta: "Перейти", 
      link: "#" 
    }
  };

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const target = btn.dataset.target;
      const info = data[target];

      if (info) {
        titleEl.textContent = info.title;
        descEl.textContent = info.desc;
        ctaEl.textContent = info.cta;

        // Если это Web/iOS - вешаем открытие модалки
        if (info.action === "modal") {
          ctaEl.href = "javascript:void(0)";
          ctaEl.onclick = (e) => {
            e.preventDefault();
            iosModal.classList.add("open");
          };
        } else {
          // Для остальных - обычная ссылка
          ctaEl.href = info.link || "#";
          ctaEl.onclick = null;
        }

        // Анимация появления
        contentBox.style.animation = "none";
        contentBox.offsetHeight;
        contentBox.style.animation = "emhFadeIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards";
      }
    });
  });

  // Закрытие модалки
  if (closeInstallBtn) {
    closeInstallBtn.addEventListener("click", () => {
      iosModal.classList.remove("open");
    });
  }
  if (iosModal) {
    iosModal.addEventListener("click", (e) => {
      if (e.target === iosModal) iosModal.classList.remove("open");
    });
  }
});