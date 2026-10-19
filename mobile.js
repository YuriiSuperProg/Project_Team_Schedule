// ============================================================
//  МОБИЛЬНОЕ МЕНЮ
// ============================================================

(function () {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobileMenu");

  if (!burger || !menu) return;

  function toggle() {
    const isOpen = menu.classList.contains("open");
    if (isOpen) {
      menu.classList.remove("open");
      burger.classList.remove("open");
    } else {
      menu.classList.add("open");
      burger.classList.add("open");
    }
  }

  burger.addEventListener("click", toggle);

  // закрываем меню при клике на ссылку
  menu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      menu.classList.remove("open");
      burger.classList.remove("open");
    });
  });

  // закрываем при клике вне меню
  document.addEventListener("click", e => {
    if (!menu.classList.contains("open")) return;
    if (menu.contains(e.target) || burger.contains(e.target)) return;
    menu.classList.remove("open");
    burger.classList.remove("open");
  });
})();