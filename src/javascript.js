(() => {
  /* Theme: storage keys */
  const STORAGE_KEY = 'theme';
  const root = document.documentElement;
  const btn  = document.getElementById('themeToggle');
  const icon = btn?.querySelector('.theme-toggle__icon');
  const text = btn?.querySelector('.theme-toggle__text');

  /* Theme: media preference */
  const systemPrefersDark = () =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  /* Theme: storage helpers */
  const getStored = () => localStorage.getItem(STORAGE_KEY) || '';
  const setStored = (val) => localStorage.setItem(STORAGE_KEY, val);

  /* Theme: current */
  const getCurrentTheme = () => {
    const attr = root.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr;
    return systemPrefersDark() ? 'dark' : 'light';
  };

  /* Theme: apply */
  const applyTheme = (val) => {
    if (val === 'light' || val === 'dark') {
      root.setAttribute('data-theme', val);
    } else {
      root.removeAttribute('data-theme'); // auto
    }
    updateToggleVisuals();
  };

  /* Theme: toggle visuals */
  const updateToggleVisuals = () => {
    if (!btn) return;
    const current = getCurrentTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    if (icon) icon.textContent = next === 'dark' ? '🌙' : '☀️';
    if (text) text.textContent = next.charAt(0).toUpperCase() + next.slice(1);
    btn.setAttribute('aria-label', `Switch to ${next} mode`);
    btn.setAttribute('aria-pressed', current === 'dark' ? 'true' : 'false');
  };

  /* Theme: init */
  const init = () => {
    const stored = getStored();
    if (stored === 'light' || stored === 'dark') {
      applyTheme(stored);
    } else {
      applyTheme(''); // auto
    }

    if (btn) {
      btn.addEventListener('click', () => {
        const next = getCurrentTheme() === 'dark' ? 'light' : 'dark';
        setStored(next);
        applyTheme(next);
      });
    }

    /* Theme: system change listener */
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    mql.addEventListener?.('change', () => {
      if (!getStored()) applyTheme(''); // auto
    });

    /* Footer year */
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  };

  /* Boot */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* Nav: active link highlight */
(() => {
  const normalize = (p) => {
    if (!p) return 'index.html';
    p = p.split('?')[0].split('#')[0].replace(/^\.\//, '');
    const file = p.split('/').pop();
    return file || 'index.html';
  };

  const currentFile = normalize(location.pathname);
  document.querySelectorAll('nav a[href]').forEach(a => {
    const hrefFile = normalize(a.getAttribute('href'));
    if (hrefFile === currentFile) a.classList.add('is-active');
  });
})();

(() => {
  /* Mobile nav: elements */
  const toggle = document.getElementById('navToggle');
  const nav    = document.getElementById('primaryNav');
  if (!toggle || !nav) return;

  /* Mobile nav: open/close */
  const close = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open menu');
  };
  const open = () => {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded','true');
    toggle.setAttribute('aria-label','Close menu');
  };

  /* Mobile nav: toggle click */
  toggle.addEventListener('click', () => {
    nav.classList.contains('is-open') ? close() : open();
  });

  /* Mobile nav: close on outside click */
  document.addEventListener('click', (e) => {
    if (!nav.classList.contains('is-open')) return;
    const isToggle = toggle.contains(e.target);
    const isInside = nav.contains(e.target);
    if (!isToggle && !isInside) close();
  });

  /* Mobile nav: close on Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  /* Mobile nav: reset on resize up */
  const mq = window.matchMedia('(min-width: 761px)');
  mq.addEventListener?.('change', () => close());
})();

// mobile nav toggle
(() => {
  const btn = document.getElementById('menuToggle');     // toggle button
  const panel = document.getElementById('primaryMenu');  // mobile menu panel
  if (!btn || !panel) return;

  const open = () => {
    panel.hidden = false;
    document.body.classList.add('nav-open');             // lock scroll (CSS)
    btn.setAttribute('aria-expanded', 'true');
  };

  const close = () => {
    panel.hidden = true;
    document.body.classList.remove('nav-open');
    btn.setAttribute('aria-expanded', 'false');
  };

  const isOpen = () => !panel.hidden;

  btn.addEventListener('click', () => {                  // toggle on click
    isOpen() ? close() : open();
  });

  document.addEventListener('keydown', (e) => {          // close on Esc
    if (e.key === 'Escape' && isOpen()) close();
  });

  document.addEventListener('click', (e) => {            // close on outside click
    if (isOpen() && !panel.contains(e.target) && !btn.contains(e.target)) close();
  });

  const mql = window.matchMedia('(min-width: 768px)');   // reset on resize >= 768px
  const handle = () => { if (mql.matches) close(); };
  mql.addEventListener ? mql.addEventListener('change', handle) : mql.addListener(handle);
})();
