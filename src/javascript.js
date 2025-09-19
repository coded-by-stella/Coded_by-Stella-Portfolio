/* App shell - safe utilities and modules */
(function(){
  'use strict';

  /* Utils - DOM ready */
  function onReady(fn){
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  /* Utils - matchMedia change with fallback */
  function onMQ(mq, handler){
    if (!mq) return;
    if (typeof mq.addEventListener === 'function') mq.addEventListener('change', handler);
    else if (typeof mq.addListener === 'function') mq.addListener(handler);
  }

  /* Theme toggle */
  onReady(function(){
    var STORAGE_KEY = 'theme';
    var root = document.documentElement;
    var btn  = document.getElementById('themeToggle');
    var icon = btn ? btn.querySelector('.theme-toggle__icon') : null;
    var text = btn ? btn.querySelector('.theme-toggle__text') : null;

    function prefersDark(){
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    function getStored(){ try { return localStorage.getItem(STORAGE_KEY) || ''; } catch(e){ return ''; } }
    function setStored(val){ try { localStorage.setItem(STORAGE_KEY, val); } catch(e){} }

    function currentTheme(){
      var attr = root.getAttribute('data-theme');
      if (attr === 'light' || attr === 'dark') return attr;
      return prefersDark() ? 'dark' : 'light';
    }

    function apply(val){
      if (val === 'light' || val === 'dark') root.setAttribute('data-theme', val);
      else root.removeAttribute('data-theme');
      updateToggle();
    }

    function updateToggle(){
      if (!btn) return;
      var cur  = currentTheme();
      var next = cur === 'dark' ? 'light' : 'dark';
      if (icon) icon.textContent = next === 'dark' ? '🌙' : '☀️';
      if (text) text.textContent = next.charAt(0).toUpperCase() + next.slice(1);
      btn.setAttribute('aria-label', 'Switch to ' + next + ' mode');
      btn.setAttribute('aria-pressed', cur === 'dark' ? 'true' : 'false');
    }

    var stored = getStored();
    apply(stored === 'light' || stored === 'dark' ? stored : '');

    if (btn) {
      btn.addEventListener('click', function(){
        var next = currentTheme() === 'dark' ? 'light' : 'dark';
        setStored(next);
        apply(next);
      });
    }

    var mql = window.matchMedia('(prefers-color-scheme: dark)');
    onMQ(mql, function(){ if (!getStored()) apply(''); });

    var y = document.getElementById('year');
    if (y) y.textContent = String(new Date().getFullYear());
  });

  /* Active link highlight */
  onReady(function(){
    function normalize(p){
      if (!p) return 'index.html';
      p = p.split('?')[0].split('#')[0].replace(/^\.\//, '');
      var file = p.split('/').pop();
      return file || 'index.html';
    }
    var currentFile = normalize(location.pathname);
    document.querySelectorAll('nav a[href]').forEach(function(a){
      var hrefFile = normalize(a.getAttribute('href'));
      if (hrefFile === currentFile) a.classList.add('is-active');
    });
  });

  /* Mobile nav - centered dropdown */
  onReady(function(){
    var toggle = document.getElementById('navToggle');
    var nav    = document.getElementById('primaryNav');
    if (!toggle || !nav) return;

    function close(){
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded','false');
      toggle.setAttribute('aria-label','Open menu');
      document.body.classList.remove('menu-open');
    }
    function open(){
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded','true');
      toggle.setAttribute('aria-label','Close menu');
      document.body.classList.add('menu-open');
    }

    toggle.addEventListener('click', function(){
      nav.classList.contains('is-open') ? close() : open();
    });

    document.addEventListener('click', function(e){
      if (!nav.classList.contains('is-open')) return;
      var hitToggle = toggle.contains(e.target);
      var hitNav    = nav.contains(e.target);
      if (!hitToggle && !hitNav) close();
    });

    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape') close();
    });

    var mq = window.matchMedia('(min-width: 761px)');
    onMQ(mq, close);
  });

  /* Mobile nav - desktop reset */
  onReady(function(){
    var nav = document.getElementById('primaryNav');
    var btn = document.getElementById('navToggle');
    var mq  = window.matchMedia('(min-width: 761px)');

    function hardReset(){
      if (!nav) return;
      if (mq.matches) {
        nav.classList.remove('is-open');
        document.body.classList.remove('menu-open');
        if (btn) btn.setAttribute('aria-expanded','false');
      }
    }
    hardReset();
    onMQ(mq, hardReset);
  });

  /* Equalize card widths on desktop */
  onReady(function(){
    var mq = window.matchMedia('(min-width: 1000px)');

    function equalizeGrid(grid){
      var cards = Array.from(grid.querySelectorAll('.card'));
      if (cards.length === 0) return;
      cards.forEach(function(c){ c.style.width = ''; });
      if (!mq.matches) return;
      var max = 0;
      cards.forEach(function(c){ max = Math.max(max, c.getBoundingClientRect().width); });
      cards.forEach(function(c){ c.style.width = max + 'px'; });
    }

    function run(){
      document.querySelectorAll('.grid--cards').forEach(equalizeGrid);
    }

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
    else run();

    window.addEventListener('resize', run, { passive: true });
    onMQ(mq, run);
  });

  /* FAQ accordion - single open behavior */
  onReady(function(){
    var list = document.querySelector('.faq-list');
    if (!list) return;
    var items = list.querySelectorAll('details.faq');
    items.forEach(function(d){
      d.addEventListener('toggle', function(){
        if (d.open) items.forEach(function(o){ if (o !== d) o.open = false; });
      });
    });
  });

})();
