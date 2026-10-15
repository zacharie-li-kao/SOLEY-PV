import { DAY_START, NIGHT_START, THEME_KEY } from './config.js';

// Mirrored by the inline #theme-boot script in index.html (tests/page.test.mjs keeps them equal).
export function resolveTheme(hour, saved) {
  if (saved === 'day' || saved === 'night') return saved;
  return hour >= DAY_START && hour < NIGHT_START ? 'day' : 'night';
}

export const cssTheme = t => (t === 'day' ? 'light' : 'dark');

export function initTheme(bus, doc = document) {
  const root = doc.documentElement;
  let current = root.dataset.theme === 'light' ? 'day' : 'night';
  return {
    get: () => current,
    toggle() {
      current = current === 'day' ? 'night' : 'day';
      root.dataset.theme = cssTheme(current);
      try { localStorage.setItem(THEME_KEY, current); } catch { /* private mode: choice lasts this page only */ }
      bus.dispatchEvent(new CustomEvent('theme', { detail: current }));
    },
  };
}
