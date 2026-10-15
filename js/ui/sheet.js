// The section sheet. Sections stay in the dialog; only the open one is visible.
export function createSheet(onClose) {
  const dlg = document.getElementById('sheet');
  const sections = [...dlg.querySelectorAll('.sheet-body > section')];
  const path = document.getElementById('sheet-path');
  const map = dlg.querySelector('.sheet-map');

  // Mini-map from the cell links, so labels stay in index.html.
  for (const cell of document.querySelectorAll('#cells .cell')) {
    const a = document.createElement('a');
    a.href = cell.getAttribute('href');
    a.setAttribute('aria-label', cell.textContent.trim());
    a.title = cell.textContent.trim();
    map.append(a);
  }
  sections.forEach(s => { s.hidden = true; });

  dlg.addEventListener('cancel', e => { e.preventDefault(); onClose(); });           // Esc
  dlg.addEventListener('click', e => { if (e.target === dlg) onClose(); });           // backdrop
  dlg.querySelector('.sheet-close').addEventListener('click', onClose);

  return {
    isOpen: () => dlg.open,
    show(id) {
      sections.forEach(s => { s.hidden = s.id !== id; });
      const heading = document.getElementById(id + '-h');
      path.textContent = heading.textContent;
      map.querySelectorAll('a').forEach(a => a.toggleAttribute('aria-current', a.hash === '#' + id));
      if (!dlg.open) dlg.showModal();
      dlg.querySelector('.sheet-body').scrollTop = 0;
      requestAnimationFrame(() => dlg.classList.add('in'));
      heading.focus({ preventScroll: true });
    },
    hide(ms) {
      if (!dlg.open) return Promise.resolve();
      dlg.classList.remove('in');
      return new Promise(res => setTimeout(() => { dlg.close(); res(); }, ms));
    },
  };
}
