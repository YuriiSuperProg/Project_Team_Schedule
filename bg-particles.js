// ============================================================
//  ФОН: ПЫЛИНКИ + БЛЁСТКИ + ИНТЕРАКТИВ
//  ПК — отталкивание от курсора, клик-волна, скролл-параллакс,
//       hover-мерцание блёсток.
//  Мобилка — только плавное «дыхание», без интерактива.
// ============================================================
(function () {
  const container   = document.getElementById('bgParticles');
  const sparkleBox  = document.getElementById('bgSparkles');
  const decor       = document.querySelector('.bg-decor');

  if (!container || !decor) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const isMobile    = window.innerWidth < 641;
  const isCoarse    = window.matchMedia('(pointer: coarse)').matches;
  const canInteract = !isCoarse && !isMobile;

  // ============================================================
  //  ПЫЛИНКИ
  // ============================================================
  const DUST_COUNT = isMobile ? 25 : 60;
  const dusts = [];
  const fragDust = document.createDocumentFragment();

  for (let i = 0; i < DUST_COUNT; i++) {
    const el = document.createElement('span');
    el.className = 'bg-particle';

    const size = Math.random() * 2 + 1.5; // 1.5–3.5px
    el.style.width  = size.toFixed(1) + 'px';
    el.style.height = size.toFixed(1) + 'px';

    const baseX = Math.random() * 100;
    const baseY = Math.random() * 100;
    el.style.left = baseX.toFixed(2) + '%';
    el.style.top  = baseY.toFixed(2) + '%';

    // Только синий / голубой
    el.style.background = Math.random() > 0.5
      ? 'rgba(76, 154, 255, 0.85)'
      : 'rgba(23, 105, 224, 0.7)';

    const dur = (Math.random() * 22 + 18).toFixed(1); // 18–40s
    el.style.animationDuration = dur + 's';
    el.style.animationDelay    = (-Math.random() * 20).toFixed(1) + 's';

    el.style.setProperty('--dust-min', (Math.random() * 0.1 + 0.05).toFixed(2));
    el.style.setProperty('--dust-max', (Math.random() * 0.2 + 0.25).toFixed(2));

    fragDust.appendChild(el);

    dusts.push({
      el,
      baseX, baseY,
      x: baseX, y: baseY,
      tx: baseX, ty: baseY,
      size,
      depth: Math.random() * 0.5 + 0.5, // 0.5–1 — для параллакса
    });
  }
  container.appendChild(fragDust);

  // ============================================================
  //  БЛЁСТКИ
  // ============================================================
  const sparkles = [];
  if (sparkleBox) {
    const SPARKLE_COUNT = isMobile ? 10 : 25;
    const fragSpark = document.createDocumentFragment();

    for (let i = 0; i < SPARKLE_COUNT; i++) {
      const el = document.createElement('span');
      el.className = 'bg-sparkle';

      const size = Math.random() * 1.5 + 2; // 2–3.5px
      el.style.width  = size.toFixed(1) + 'px';
      el.style.height = size.toFixed(1) + 'px';

      const baseX = Math.random() * 100;
      const baseY = Math.random() * 100;
      el.style.left = baseX.toFixed(2) + '%';
      el.style.top  = baseY.toFixed(2) + '%';

      // Только синий / голубой — фиолетовый убран
      el.style.background = Math.random() > 0.4
        ? 'rgba(76, 154, 255, 0.9)'
        : 'rgba(23, 105, 224, 0.9)';
      el.style.setProperty('--spark-glow', 'rgba(76, 154, 255, 0.6)');

      const dur = (Math.random() * 2.5 + 2).toFixed(1); // 2–4.5s
      el.style.animationDuration = dur + 's';
      el.style.animationDelay    = (-Math.random() * 5).toFixed(1) + 's';

      fragSpark.appendChild(el);

      sparkles.push({ el, baseX, baseY, size });
    }
    sparkleBox.appendChild(fragSpark);
  }

  // ============================================================
  //  ИНТЕРАКТИВ — только ПК с мышью
  // ============================================================
  if (!canInteract) return;

  // ---- ВАЖНО: переменные ДО tick(), иначе ReferenceError ----
  let cx = 0, cy = 0;     // текущий сдвиг облаков
  let tcx = 0, tcy = 0;   // целевой сдвиг облаков

  let mouseX = -9999;
  let mouseY = -9999;
  let mouseActive = false;

  let scrollY = window.scrollY;
  let targetScrollY = scrollY;

  // Волны от кликов
  const waves = [];
  const WAVE_RADIUS = 140;
  const WAVE_DURATION = 900;

  let raf = null;
  let needsFrame = true;

  function scheduleFrame() {
    if (!needsFrame) {
      needsFrame = true;
      raf = requestAnimationFrame(tick);
    }
  }

  function tick() {
    raf = null;
    needsFrame = false;

    const now = performance.now();

    // Плавный скролл-параллакс
    scrollY += (targetScrollY - scrollY) * 0.08;

    // Очистка старых волн
    for (let i = waves.length - 1; i >= 0; i--) {
      if (now - waves[i].t0 > WAVE_DURATION) waves.splice(i, 1);
    }

    let animated = false;

    // ---- Пылинки ----
    for (const d of dusts) {
      let tx = d.baseX;
      let ty = d.baseY;

      // Параллакс на скролл (глубина)
      ty += (scrollY * 0.003) * d.depth;

      // Отталкивание от курсора
      if (mouseActive) {
        const dxPx = (d.x - (mouseX / window.innerWidth) * 100) * window.innerWidth / 100;
        const dyPx = (d.y - (mouseY / window.innerHeight) * 100) * window.innerHeight / 100;
        const dist = Math.hypot(dxPx, dyPx);
        const R = 90;
        if (dist < R && dist > 0.01) {
          const force = (1 - dist / R) * 3.5;
          tx += (dxPx / dist) * force;
          ty += (dyPx / dist) * force;
          animated = true;
        }
      }

      // Волны от кликов
      for (const w of waves) {
        const age = (now - w.t0) / WAVE_DURATION;
        if (age >= 0 && age <= 1) {
          const wx = (w.x / window.innerWidth) * 100;
          const wy = (w.y / window.innerHeight) * 100;
          const dxPx = (d.x - wx) * window.innerWidth / 100;
          const dyPx = (d.y - wy) * window.innerHeight / 100;
          const dist = Math.hypot(dxPx, dyPx);
          const R = WAVE_RADIUS;
          if (dist < R && dist > 0.01) {
            const strength = (1 - age) * (1 - dist / R) * 5;
            tx += (dxPx / dist) * strength;
            ty += (dyPx / dist) * strength;
            animated = true;
          }
        }
      }

      // Сглаживание
      d.tx += (tx - d.tx) * 0.12;
      d.ty += (ty - d.ty) * 0.12;
      d.x  += (d.tx - d.x) * 0.18;
      d.y  += (d.ty - d.y) * 0.18;

      d.el.style.left = d.x.toFixed(2) + '%';
      d.el.style.top  = d.y.toFixed(2) + '%';

      if (Math.abs(d.tx - d.x) > 0.005 || Math.abs(d.ty - d.y) > 0.005) {
        animated = true;
      }
    }

    // ---- Блёстки: hover-мерцание ----
    for (const s of sparkles) {
      const sxPx = (s.baseX / 100) * window.innerWidth;
      const syPx = (s.baseY / 100) * window.innerHeight;
      const dx = sxPx - mouseX;
      const dy = syPx - mouseY;
      const dist = Math.hypot(dx, dy);

      if (mouseActive && dist < 70) {
        const intensity = 1 - dist / 70;
        s.el.style.opacity   = (0.5 + intensity * 0.5).toFixed(2);
        s.el.style.transform = `scale(${(1 + intensity * 0.4).toFixed(2)})`;
        animated = true;
      } else {
        s.el.style.opacity   = '';
        s.el.style.transform = '';
      }
    }

    // ---- Облака: плавный сдвиг за мышью ----
    cx += (tcx - cx) * 0.08;
    cy += (tcy - cy) * 0.08;
    decor.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`;

    if (animated || Math.abs(targetScrollY - scrollY) > 0.1) {
      scheduleFrame();
    }
  }

  // ---- Слушатели ----
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    mouseActive = true;

    tcx = (e.clientX / window.innerWidth - 0.5) * 16;
    tcy = (e.clientY / window.innerHeight - 0.5) * 16;

    scheduleFrame();
  });

  document.addEventListener('mouseleave', () => {
    mouseActive = false;
    scheduleFrame();
  });

  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
    scheduleFrame();
  }, { passive: true });

  // ---- Клик-волна (игнорируем клики по ссылкам/кнопкам) ----
  document.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button, input, textarea, select, .eco-card, .fullscreen-menu')) return;
    waves.push({ x: e.clientX, y: e.clientY, t0: performance.now() });
    scheduleFrame();
  });

  // Первый кадр
  scheduleFrame();
})();