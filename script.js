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
//  ЭКОСИСТЕМА
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const section  = document.getElementById("ecosystem");
  const grid     = document.getElementById("ecoGrid");
  const dotsBox  = document.getElementById("ecoDots");
  const overlay  = document.getElementById("ecoOverlay");
  const modal    = document.getElementById("ecoModal");
  const modalBox = document.getElementById("ecoModalContent");
  const closeBtn = document.getElementById("ecoModalClose");

  if (!section || !grid) return;

  const cards     = Array.from(grid.querySelectorAll(".eco-card"));
  const mqDesktop = window.matchMedia("(min-width: 901px)");
  const isDesktop = () => mqDesktop.matches;

  let modalOpen   = false;
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
    card.style.transform =
      `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(${SCALE},${SCALE},${SCALE})`;
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

    // ВСТАВЛЯЕМ СКОПИРОВАННЫЙ КОНТЕНТ В МОДАЛКУ
    modalBox.replaceChildren(clone);

    const color = card.dataset.color || "#1769E0";
    
    // Устанавливаем цвет только для свечения
    modalBox.style.setProperty("--eco-accent", color);
    
    overlay.hidden = false;
    modal.hidden = false;

    // FLIP
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
      if (e.target.closest(".eco-btn")) return;
      openModal(card);
    });
  });

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // ---------- Параллакс ----------
  modal.addEventListener("mousemove", (e) => {
    if (!modalOpen) return;
    const img = modalBox.querySelector(".mockup-img");
    if (!img) return;
    const x = (window.innerWidth / 2 - e.clientX) / 30;
    const y = (window.innerHeight / 2 - e.clientY) / 30;
    img.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
  });
  modal.addEventListener("mouseleave", () => {
    const img = modalBox.querySelector(".mockup-img");
    if (img) img.style.transform = "";
  });

  // ---------- Подсветка фона ----------
  function hexToRgba(hex, a) {
    const h = hex.replace("#", "");
    const n = parseInt(h.length === 3
      ? h.split("").map(c => c + c).join("")
      : h, 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }

  cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      if (!isDesktop() || modalOpen) return;
      const color = card.dataset.color || "#1769E0";
      section.style.setProperty("--eco-bg",
        `radial-gradient(circle at 50% 40%, ${hexToRgba(color, 0.08)}, transparent 70%)`);
    });
    card.addEventListener("mouseleave", () => {
      if (!isDesktop() || modalOpen) return;
      section.style.setProperty("--eco-bg", "transparent");
    });
  });

  // ---------- Точки ----------
  function buildDots() {
    dotsBox.replaceChildren();
    if (isDesktop()) return;

    cards.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "eco-dot";
      b.setAttribute("aria-label", `Слайд ${i + 1}`);
      if (i === 0) b.classList.add("active");
      b.addEventListener("click", () => {
        cards[i].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      });
      dotsBox.appendChild(b);
    });
  }

  function updateActiveDot() {
    if (isDesktop()) return;
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

  // ---------- Смена размера ----------
  let lastDesktop = isDesktop();
  mqDesktop.addEventListener("change", (e) => {
    const nowDesktop = e.matches;
    if (nowDesktop === lastDesktop) return;
    lastDesktop = nowDesktop;

    cards.forEach(c => (c.style.transform = ""));

    if (nowDesktop) {
      dotsBox.replaceChildren();
      closeModal();
    } else {
      buildDots();
      section.style.setProperty("--eco-bg", "transparent");
    }
  });

  // ---------- PWA-подсказка ----------
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".pwa-btn");
    
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      
      // Ищем ближайшую обертку для подсказки
      const wrapper = btn.closest(".pwa-wrapper");
      const hint = wrapper ? wrapper.querySelector(".pwa-hint") : null;
      
      if (hint) {
        document.querySelectorAll(".pwa-hint.show").forEach(h => {
          if (h !== hint) h.classList.remove("show");
        });
        hint.classList.toggle("show");
      }
      return;
    }

    document.querySelectorAll(".pwa-hint.show").forEach(hint => {
      if (!hint.contains(e.target)) {
        hint.classList.remove("show");
      }
    });
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