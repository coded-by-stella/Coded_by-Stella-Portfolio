(() => {
  const STORAGE_KEY = 'theme';
  const root = document.documentElement;
  const btn  = document.getElementById('themeToggle');
  const icon = btn?.querySelector('.theme-toggle__icon');
  const text = btn?.querySelector('.theme-toggle__text');

  const systemPrefersDark = () =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const getStored = () => localStorage.getItem(STORAGE_KEY) || '';
  const setStored = (val) => localStorage.setItem(STORAGE_KEY, val);

  const getCurrentTheme = () => {
    const attr = root.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr;
    return systemPrefersDark() ? 'dark' : 'light';
  };

  const applyTheme = (val) => {
    if (val === 'light' || val === 'dark') {
      root.setAttribute('data-theme', val);
    } else {
      root.removeAttribute('data-theme'); // auto (segue il sistema)
    }
    updateToggleVisuals();
  };

  const updateToggleVisuals = () => {
    if (!btn) return;
    const current = getCurrentTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    if (icon) icon.textContent = next === 'dark' ? '🌙' : '☀️';
    if (text) text.textContent = next.charAt(0).toUpperCase() + next.slice(1);
    btn.setAttribute('aria-label', `Switch to ${next} mode`);
    btn.setAttribute('aria-pressed', current === 'dark' ? 'true' : 'false');
  };

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

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    mql.addEventListener?.('change', () => {
      if (!getStored()) applyTheme(''); // resta in auto
    });

    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// Highlight active nav link (handles ./filename.html)
(() => {
  const normalize = (p) => {
    if (!p) return 'index.html';
    // strip any query/hash, leading "./", and folder parts
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


