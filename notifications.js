// ============================================================
//  УМНЫЕ УВЕДОМЛЕНИЯ ОБ ИЗМЕНЕНИЯХ В РАСПИСАНИИ
// ============================================================
(function () {
  const SNAPSHOT_PREFIX = "scheduleSnapshot_";
  const HISTORY_PREFIX  = "scheduleHistory_";
  const UNREAD_KEY      = "notificationsUnread";
  const MAX_HISTORY     = 20;

  function normalizePair(p) {
    if (!p || !p.text) return null;
    return {
      number: p.number,
      text: (p.text || "").replace(/\s+/g, " ").trim(),
      star: p.star || null,
      subgroup: p.subgroup || null,
      dates: p.dates ? [...p.dates].sort().join(",") : null
    };
  }

  function makeSnapshot(rawGroup) {
    if (!rawGroup) return null;
    const snap = {};
    Object.keys(rawGroup).forEach(day => {
      const pairs = rawGroup[day] || [];
      snap[day] = pairs.map(normalizePair).filter(Boolean).sort((a, b) => a.number - b.number || (a.text > b.text ? 1 : -1));
    });
    return snap;
  }

  function diffSnapshots(oldSnap, newSnap) {
    const result = { added: [], removed: [], changed: [] };
    if (!oldSnap || !newSnap) return result;
    const allDays = new Set([...Object.keys(oldSnap), ...Object.keys(newSnap)]);
    const keyOf = p => `${p.number}|${p.subgroup || ""}|${p.dates || ""}|${p.star || ""}`;

    allDays.forEach(day => {
      const oldList = oldSnap[day] || [];
      const newList = newSnap[day] || [];
      const oldMap = new Map(oldList.map(p => [keyOf(p), p]));
      const newMap = new Map(newList.map(p => [keyOf(p), p]));

      oldMap.forEach((p, key) => { if (!newMap.has(key)) result.removed.push({ day: Number(day), pair: p }); });
      newMap.forEach((p, key) => { if (!oldMap.has(key)) result.added.push({ day: Number(day), pair: p }); });
      newMap.forEach((p, key) => {
        if (oldMap.has(key)) {
          const oldP = oldMap.get(key);
          if (oldP.text !== p.text) result.changed.push({ day: Number(day), oldPair: oldP, newPair: p });
        }
      });
    });
    return result;
  }

  function checkGroup(spec, course, group) {
    if (!spec || !course || !group || !SCHEDULE[spec]?.[course]?.[group]) return;
    const rawGroup = SCHEDULE[spec][course][group];
    const newSnap  = makeSnapshot(rawGroup);
    const key      = SNAPSHOT_PREFIX + group;
    let oldSnap = null;
    try { const raw = localStorage.getItem(key); if (raw) oldSnap = JSON.parse(raw); } catch (e) {}

    if (!oldSnap) { 
      try { localStorage.setItem(key, JSON.stringify(newSnap)); } catch (e) {} 
      hideNotice(); 
      return; 
    }
    
    const diff = diffSnapshots(oldSnap, newSnap);
    const total = diff.added.length + diff.removed.length + diff.changed.length;
    
    if (total > 0) {
      showNotice(); 
      saveHistory(group);
      try { localStorage.setItem(key, JSON.stringify(newSnap)); } catch (e) {}
    } else {
      hideNotice();
    }
  }

  // ------------------------------------------------------------
  //  ПЛАШКА ПРЕДУПРЕЖДЕНИЯ (упрощенная)
  // ------------------------------------------------------------
  function showNotice() {
    const notice = document.getElementById("scheduleNotice");
    if (!notice) return;

    notice.innerHTML = `
      <div class="sn-content" style="flex-direction:column;align-items:flex-start;gap:10px;flex:1;">
        <div style="display:flex;align-items:center;gap:10px;">
          <span class="sn-icon">⚠️</span>
          <div class="sn-text">
            <b>Внимание!</b> Расписание могло измениться.<br>
            Пожалуйста, уточните актуальную информацию у своего <b>старосты</b>.
          </div>
        </div>
      </div>
      <div class="sn-actions">
        <button class="sn-btn-close" id="snCloseBtn">Понятно</button>
      </div>
    `;

    notice.classList.remove("hidden");

    const btn = document.getElementById("snCloseBtn");
    if (btn) btn.onclick = () => {
      notice.classList.add("hidden");
      try { localStorage.setItem(UNREAD_KEY, "0"); } catch (e) {}
      updateBell();
    };
  }

  function hideNotice() { 
    const notice = document.getElementById("scheduleNotice"); 
    if (notice) notice.classList.add("hidden"); 
  }

  // ------------------------------------------------------------
  //  ИСТОРИЯ УВЕДОМЛЕНИЙ (упрощенная)
  // ------------------------------------------------------------
  function saveHistory(group) {
    const key = HISTORY_PREFIX + group;
    let history = [];
    try { history = JSON.parse(localStorage.getItem(key) || "[]"); } catch (e) {}

    history.unshift({ 
      date: new Date().toISOString(), 
      // Сохраняем просто факт предупреждения
      isWarning: true 
    });
    
    if (history.length > MAX_HISTORY) history = history.slice(0, MAX_HISTORY);
    try { localStorage.setItem(key, JSON.stringify(history)); } catch (e) {}

    // Увеличиваем счетчик непрочитанных на 1 (а не на количество измененных пар)
    const unread = parseInt(localStorage.getItem(UNREAD_KEY) || "0", 10);
    try { localStorage.setItem(UNREAD_KEY, String(unread + 1)); } catch (e) {}
    
    updateBell();
  }

  function ensureBell() {
    const navActions = document.querySelector(".nav-actions");
    if (!navActions || document.getElementById("bellBtn")) return;
    const bell = document.createElement("button");
    bell.id = "bellBtn"; bell.className = "nav-icon-btn bell-btn"; bell.title = "Уведомления";
    bell.innerHTML = `🔔<span class="bell-badge" id="bellBadge" style="display:none;">0</span>`;
    const profileBtn = navActions.querySelector(".open-profile-btn");
    if (profileBtn) navActions.insertBefore(bell, profileBtn); else navActions.appendChild(bell);
    bell.addEventListener("click", openHistoryPanel); updateBell();
  }

  function updateBell() {
    const badge = document.getElementById("bellBadge");
    if (!badge) return;
    const unread = parseInt(localStorage.getItem(UNREAD_KEY) || "0", 10);
    if (unread > 0) { badge.textContent = unread > 99 ? "99+" : String(unread); badge.style.display = "flex"; } else { badge.style.display = "none"; }
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }

  function openHistoryPanel() {
    const group = (typeof state !== "undefined" && state) ? state.group : null;
    if (!group) { if (window.showGlobalToast) window.showGlobalToast("Сначала выберите группу"); return; }
    
    let history = [];
    try { history = JSON.parse(localStorage.getItem(HISTORY_PREFIX + group) || "[]"); } catch (e) {}
    
    const old = document.getElementById("notifPanel"); if (old) old.remove();
    
    const panel = document.createElement("div"); 
    panel.id = "notifPanel"; 
    panel.className = "notif-panel";
    
    panel.innerHTML = `
      <div class="notif-window">
        <div class="notif-panel-header">
          <h3>🔔 Уведомления · ${group}</h3>
          <button class="notif-panel-close" id="notifPanelClose">✕</button>
        </div>
        <div class="notif-panel-body">
          ${history.length === 0 
            ? `<div class="notif-empty">Пока нет изменений в расписании 🎉</div>` 
            : history.map(entry => `
                <div class="notif-entry">
                  <div class="notif-date">${formatDate(entry.date)}</div>
                  <div class="sn-diff-item sn-diff-change">
                    <span class="sn-diff-icon">⚠️</span>
                    <span class="sn-diff-text">Расписание было обновлено. Уточните у старосты.</span>
                  </div>
                </div>
              `).join("")}
        </div>
      </div>
    `;
    
    document.body.appendChild(panel);
    try { localStorage.setItem(UNREAD_KEY, "0"); } catch (e) {} 
    updateBell();
    
    requestAnimationFrame(() => panel.classList.add("open"));
    
    const close = () => { panel.classList.remove("open"); setTimeout(() => panel.remove(), 300); };
    const closeBtn = document.getElementById("notifPanelClose"); 
    if (closeBtn) closeBtn.onclick = close;
    
    panel.addEventListener("click", (e) => { if (e.target === panel) close(); });
  }

  window.addEventListener("specChanged", () => {
    setTimeout(() => {
      if (typeof state !== "undefined" && state && state.spec && state.course && state.group) {
        checkGroup(state.spec, state.course, state.group);
      }
    }, 300);
  });

  window.addEventListener("load", () => {
    ensureBell();
    setTimeout(() => {
      if (typeof state !== "undefined" && state && state.spec && state.course && state.group) {
        checkGroup(state.spec, state.course, state.group);
      }
    }, 1200);
  });

  window.ScheduleNotifications = { check: checkGroup, openPanel: openHistoryPanel };
})();