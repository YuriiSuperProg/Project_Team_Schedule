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
//  МЕНЮ (МОДАЛЬНОЕ ОКНО)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");
  const closeBtn = document.getElementById("closeMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const themeBtn = document.getElementById("themeToggle");

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

  // Закрытие при клике на ссылки
  const menuLinks = mobileMenu.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  // Закрытие при клике на затемненный фон
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMenu();
  });
});

// ============================================================
//  ПЛАВНОЕ ПОЯВЛЕНИЕ
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const revealTargets = document.querySelectorAll('.about-item, .member, .cta, .eco-card');
  
  revealTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => revealObserver.observe(el));
});

// ============================================================
//  ПОДСКАЗКА ДЛЯ PWA
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const pwaBtn = document.getElementById("pwaBtn");
  const pwaHint = document.getElementById("pwaHint");

  if (pwaBtn && pwaHint) {
    pwaBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      pwaHint.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!pwaBtn.contains(e.target) && !pwaHint.contains(e.target)) {
        pwaHint.classList.remove("show");
      }
    });
  }
});