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
