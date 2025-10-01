(function () {
  const docEl = document.documentElement;
  const body = document.body;
  const widget = document.querySelector('.settings-widget');
  const toggle = widget ? widget.querySelector('.settings-widget__toggle') : null;
  const panel = widget ? widget.querySelector('.settings-widget__panel') : null;
  const zoomSelect = widget ? widget.querySelector('#settingsZoom') : null;
  const themeRadios = widget ? Array.from(widget.querySelectorAll('input[name="settingsTheme"]')) : [];
  const languageSelect = widget ? widget.querySelector('#settingsLanguage') : null;
  const prefersDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : { matches: false, addEventListener: null };
  const STORAGE_KEYS = {
    zoom: 'settings:zoom',
    theme: 'theme',
    language: 'settings:language'
  };

  const canStore = (() => {
    try {
      const test = '__settings_test__';
      window.localStorage.setItem(test, '1');
      window.localStorage.removeItem(test);
      return true;
    } catch (err) {
      return false;
    }
  })();

  const storage = {
    get(key) {
      if (!canStore) return null;
      try {
        return window.localStorage.getItem(key);
      } catch (err) {
        return null;
      }
    },
    set(key, value) {
      if (!canStore) return;
      try {
        if (value === null || typeof value === 'undefined') {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, value);
        }
      } catch (err) {
        /* noop */
      }
    }
  };

  function clampZoom(value) {
    const numeric = parseFloat(value);
    if (!Number.isFinite(numeric)) return 1;
    return Math.min(1.5, Math.max(0.8, numeric));
  }

  function ensureSelectValue(select, value, labelFormatter) {
    if (!select) return;
    const exists = Array.from(select.options).some(option => option.value === value);
    if (!exists) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = typeof labelFormatter === 'function' ? labelFormatter(value) : value;
      select.append(option);
    }
    select.value = value;
  }

  function applyZoom(value) {
    const zoom = clampZoom(value);
    docEl.style.fontSize = `${Math.round(zoom * 100)}%`;
    storage.set(STORAGE_KEYS.zoom, String(zoom));
    ensureSelectValue(zoomSelect, String(zoom), val => `${Math.round(parseFloat(val) * 100)}%`);
  }

  function syncThemeInputs(choice) {
    themeRadios.forEach(radio => {
      radio.checked = radio.value === choice;
    });
  }

  function applyTheme(choice) {
    const normalized = choice === 'dark' || choice === 'light' ? choice : 'auto';
    body.classList.remove('theme-dark', 'theme-light');
    if (normalized === 'dark') {
      body.classList.add('theme-dark');
      storage.set(STORAGE_KEYS.theme, 'dark');
    } else if (normalized === 'light') {
      body.classList.add('theme-light');
      storage.set(STORAGE_KEYS.theme, 'light');
    } else {
      storage.set(STORAGE_KEYS.theme, null);
    }
    syncThemeInputs(normalized);
  }

  function applyLanguage(lang) {
    if (!lang) return;
    docEl.setAttribute('lang', lang);
    storage.set(STORAGE_KEYS.language, lang);
    if (languageSelect) {
      ensureSelectValue(languageSelect, lang, null);
    }
  }

  function openPanel() {
    if (!widget || !toggle || !panel) return;
    widget.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
    if (zoomSelect && typeof zoomSelect.focus === 'function') {
      try {
        zoomSelect.focus({ preventScroll: true });
      } catch (err) {
        zoomSelect.focus();
      }
    }
  }

  function closePanel() {
    if (!widget || !toggle || !panel) return;
    widget.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
  }

  function togglePanel() {
    if (!widget || !toggle || !panel) return;
    const isOpen = widget.classList.contains('open');
    if (isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  }

  const storedZoom = storage.get(STORAGE_KEYS.zoom);
  if (storedZoom) {
    applyZoom(storedZoom);
  } else {
    applyZoom('1');
  }

  const storedTheme = storage.get(STORAGE_KEYS.theme);
  if (storedTheme === 'dark' || storedTheme === 'light') {
    applyTheme(storedTheme);
  } else {
    applyTheme('auto');
  }

  const storedLanguage = storage.get(STORAGE_KEYS.language);
  applyLanguage(storedLanguage || docEl.getAttribute('lang') || 'en');

  if (zoomSelect) {
    zoomSelect.addEventListener('change', event => {
      applyZoom(event.target.value);
    });
  }

  if (themeRadios.length) {
    themeRadios.forEach(radio => {
      radio.addEventListener('change', event => {
        if (event.target.checked) {
          applyTheme(event.target.value);
        }
      });
    });
  }

  if (languageSelect) {
    languageSelect.addEventListener('change', event => {
      applyLanguage(event.target.value);
    });
  }

  if (toggle && panel) {
    panel.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', togglePanel);
  }

  document.addEventListener('click', event => {
    if (!widget || !panel || !toggle) return;
    if (!widget.contains(event.target)) {
      closePanel();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closePanel();
    }
  });

  if (prefersDark && typeof prefersDark.addEventListener === 'function') {
    prefersDark.addEventListener('change', event => {
      if (!storage.get(STORAGE_KEYS.theme)) {
        applyTheme('auto');
      }
    });
  } else if (prefersDark && typeof prefersDark.addListener === 'function') {
    prefersDark.addListener(event => {
      if (!storage.get(STORAGE_KEYS.theme)) {
        applyTheme('auto');
      }
    });
  }
})();
