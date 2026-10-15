// The section sheet. Non-modal: the panel stays usable beside it, so any section is one click away.
// Sections stay in the dialog; only the open one is visible.
export function createSheet(onClose) {
  const dlg = document.getElementById('sheet');
  const body = dlg.querySelector('.sheet-body');
  const sections = [...body.querySelectorAll(':scope > section')];
  const path = document.getElementById('sheet-path');
  sections.forEach(s => { s.hidden = true; });
  let closing = 0;   // pending hide() timer, cancelled if a section opens first

  dlg.querySelector('.sheet-close').addEventListener('click', onClose);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && dlg.open && !document.querySelector('dialog:modal')) onClose();
  });

  // Restart the staggered rise of the section's first blocks (CSS .rise).
  function rise(section) {
    section.classList.remove('rise');
    void section.offsetWidth;
    section.classList.add('rise');
  }

  return {
    isOpen: () => dlg.open,
    show(id) {
      const section = document.getElementById(id);
      sections.forEach(s => { s.hidden = s !== section; });
      path.textContent = document.getElementById(id + '-h').textContent;
      clearTimeout(closing);
      body.classList.remove('leaving');
      if (!dlg.open) dlg.show();
      body.scrollTop = 0;
      rise(section);
      requestAnimationFrame(() => dlg.classList.add('in'));
      document.getElementById(id + '-h').focus({ preventScroll: true });
    },
    // Switching between sections: fade the text out only; the sheet itself stays.
    swap(ms) {
      body.classList.add('leaving');
      return new Promise(res => setTimeout(res, ms));
    },
    hide(ms) {
      if (!dlg.open) return Promise.resolve();
      dlg.classList.remove('in');
      return new Promise(res => { closing = setTimeout(() => { dlg.close(); body.classList.remove('leaving'); res(); }, ms); });
    },
  };
}
