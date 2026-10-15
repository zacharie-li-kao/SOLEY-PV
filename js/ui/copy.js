// copy.js: copy buttons; the confirmation text comes from data-done in the HTML.
export function initCopy() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    const label = btn.textContent;
    btn.addEventListener('click', async () => {
      const src = document.getElementById(btn.dataset.copy);
      try { await navigator.clipboard.writeText(src.textContent); btn.textContent = btn.dataset.done; }
      catch { getSelection().selectAllChildren(src); }
      setTimeout(() => { btn.textContent = label; }, 2000);
    });
  });
}
