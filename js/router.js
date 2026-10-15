import { CELLS, LEGACY } from './config.js';

const IDS = new Set(CELLS.map(c => c.id));

export function parseHash(hash) {
  let h;
  try { h = decodeURIComponent(String(hash || '').replace(/^#/, '')).toLowerCase(); } catch { return null; }
  const id = LEGACY[h] ?? h;
  return IDS.has(id) ? id : null;
}

// Opening is plain navigation (<a href="#id">); closing pushes a hash-less entry, so Back reopens.
export function createRouter(bus, win = window) {
  const { location, history } = win;
  // Legacy, unknown and differently-cased hashes are rewritten to the canonical one (or removed).
  const normalise = id => {
    if (location.hash && location.hash !== '#' + id) history.replaceState(null, '', id ? '#' + id : location.pathname + location.search);
  };
  let current = parseHash(location.hash);
  normalise(current);

  const emit = initial => bus.dispatchEvent(new CustomEvent('route', { detail: { section: current, initial } }));

  win.addEventListener('hashchange', () => {
    const next = parseHash(location.hash);
    normalise(next);
    if (next === current) return;
    current = next;
    emit(false);
  });

  return {
    get: () => current,
    start: () => emit(true),
    close() {
      if (!current) return;
      history.pushState(null, '', location.pathname + location.search);
      current = null;
      emit(false);
    },
  };
}
