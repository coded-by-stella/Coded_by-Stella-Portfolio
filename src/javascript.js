/* Theme: basic toggle */
(() => {
  const STORAGE_KEY = 'theme';
  const root = document.documentElement;
  const btn  = document.getElementById('themeToggle');
  const icon = btn?.querySelector('.theme-toggle__icon');
  const text = btn?.querySelector('.theme-toggle__text');

  const prefersDark = () =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const getStored = () => localStorage.getItem(STORAGE_KEY) || '';
  const setStored = (val) => localStorage.setItem(STORAGE_KEY, val);

  const currentTheme = () => {
    const attr = root.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr;
    return prefersDark() ? 'dark' : 'light';
  };

  const apply = (val) => {
    if (val === 'light' || val === 'dark') root.setAttribute('data-theme', val);
    else root.removeAttribute('data-theme');
    updateToggle();
  };

  const updateToggle = () => {
    if (!btn) return;
    const cur = currentTheme();
    const next = cur === 'dark' ? 'light' : 'dark';
    if (icon) icon.textContent = next === 'dark' ? '🌙' : '☀️';
    if (text) text.textContent = next[0].toUpperCase() + next.slice(1);
    btn.setAttribute('aria-label', `Switch to ${next} mode`);
    btn.setAttribute('aria-pressed', cur === 'dark' ? 'true' : 'false');
  };

  const init = () => {
    const stored = getStored();
    apply(stored === 'light' || stored === 'dark' ? stored : '');

    if (btn) {
      btn.addEventListener('click', () => {
        const next = currentTheme() === 'dark' ? 'light' : 'dark';
        setStored(next);
        apply(next);
      });
    }

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    mql.addEventListener?.('change', () => { if (!getStored()) apply(''); });

    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  };

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
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

/* Mobile nav: centered dropdown */
(() => {
  const toggle = document.getElementById('navToggle');   // toggle button
  const nav    = document.getElementById('primaryNav');  // dropdown panel
  if (!toggle || !nav) return;

  const close = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open menu');
    document.body.classList.remove('menu-open');
  };
  const open = () => {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded','true');
    toggle.setAttribute('aria-label','Close menu');
    document.body.classList.add('menu-open');
  };

  toggle.addEventListener('click', () => {
    nav.classList.contains('is-open') ? close() : open();
  });

  document.addEventListener('click', (e) => {
    if (!nav.classList.contains('is-open')) return;
    const hitToggle = toggle.contains(e.target);
    const hitNav    = nav.contains(e.target);
    if (!hitToggle && !hitNav) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  const mq = window.matchMedia('(min-width: 761px)');
  mq.addEventListener?.('change', () => close());
})();
