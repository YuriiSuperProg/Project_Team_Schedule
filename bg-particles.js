// ============================================================
//  ФОН: ПЫЛИНКИ + БЛЁСТКИ (ЦВЕТ ОТ СПЕЦИАЛЬНОСТИ)
// ============================================================
(function () {
  const container   = document.getElementById('bgParticles');
  const sparkleBox  = document.getElementById('bgSparkles');
  const decor       = document.querySelector('.bg-decor');

  if (!container || !decor) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const isMobile = window.innerWidth < 641;
  const isTouchpad = window.matchMedia('(hover: none)').matches || 
                     window.matchMedia('(pointer: coarse)').matches;

  // ============================================================
  //  ПЫЛИНКИ
  // ============================================================
  const DUST_COUNT = (isMobile || isTouchpad) ? 15 : 30;
  const fragDust = document.createDocumentFragment();

  for (let i = 0; i < DUST_COUNT; i++) {
    const el = document.createElement('span');
    el.className = 'bg-particle';

    const size = Math.random() * 2 + 1.5;
    el.style.width  = size.toFixed(1) + 'px';
    el.style.height = size.toFixed(1) + 'px';

    el.style.left = (Math.random() * 100).toFixed(2) + '%';
    el.style.top  = (Math.random() * 100).toFixed(2) + '%';

    // Цвет берем из CSS-переменной специальности
    // (var(--c) — основной цвет, var(--c-soft) — светлый)
    el.style.background = Math.random() > 0.5
      ? 'var(--c, #1769E0)'
      : 'var(--c-soft, #E8F1FF)';

    const dur = (Math.random() * 25 + 15).toFixed(1);
    el.style.animationDuration = dur + 's';
    el.style.animationDelay    = (-Math.random() * 20).toFixed(1) + 's';

    el.style.setProperty('--dust-min', (Math.random() * 0.1 + 0.05).toFixed(2));
    el.style.setProperty('--dust-max', (Math.random() * 0.2 + 0.25).toFixed(2));

    fragDust.appendChild(el);
  }
  container.appendChild(fragDust);

  // ============================================================
  //  БЛЁСТКИ
  // ============================================================
  if (sparkleBox) {
    const SPARKLE_COUNT = (isMobile || isTouchpad) ? 8 : 15;
    const fragSpark = document.createDocumentFragment();

    for (let i = 0; i < SPARKLE_COUNT; i++) {
      const el = document.createElement('span');
      el.className = 'bg-sparkle';

      const size = Math.random() * 1.5 + 2;
      el.style.width  = size.toFixed(1) + 'px';
      el.style.height = size.toFixed(1) + 'px';

      el.style.left = (Math.random() * 100).toFixed(2) + '%';
      el.style.top  = (Math.random() * 100).toFixed(2) + '%';

      // Цвет — тоже от специальности
      el.style.background = Math.random() > 0.4
        ? 'var(--c, #1769E0)'
        : 'var(--c-soft, #E8F1FF)';

      // Свечение тоже в цвете специальности (через color-mix)
      el.style.setProperty('--spark-glow', 'color-mix(in srgb, var(--c, #1769E0) 50%, transparent)');

      const dur = (Math.random() * 2.5 + 2).toFixed(1);
      el.style.animationDuration = dur + 's';
      el.style.animationDelay    = (-Math.random() * 5).toFixed(1) + 's';

      fragSpark.appendChild(el);
    }
    sparkleBox.appendChild(fragSpark);
  }

  // ============================================================
  //  ПАРАЛЛАКС ОБЛАКОВ
  // ============================================================
  const isRealMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  
  if (isRealMouse && !isTouchpad) {
    let tcx = 0, tcy = 0;
    let cx = 0, cy = 0;
    let rafId = null;

    function updateDecor() {
      cx += (tcx - cx) * 0.05;
      cy += (tcy - cy) * 0.05;
      decor.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`;
      
      if (Math.abs(tcx - cx) > 0.1 || Math.abs(tcy - cy) > 0.1) {
        rafId = requestAnimationFrame(updateDecor);
      } else {
        rafId = null;
      }
    }

    document.addEventListener('mousemove', (e) => {
      tcx = (e.clientX / window.innerWidth - 0.5) * 12;
      tcy = (e.clientY / window.innerHeight - 0.5) * 12;
      
      if (!rafId) rafId = requestAnimationFrame(updateDecor);
    });
  }
})();