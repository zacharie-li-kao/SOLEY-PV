// gallery.js: a plain image viewer; native <dialog> gives Esc and focus handling.
export function initGallery() {
  const dlg = document.getElementById('viewer'), big = dlg.querySelector('img'), cap = dlg.querySelector('p');
  document.querySelectorAll('.gallery figure').forEach(fig => {
    fig.querySelector('button').addEventListener('click', () => {
      const img = fig.querySelector('img');
      big.src = img.currentSrc || img.src;
      big.alt = img.alt;
      cap.textContent = fig.querySelector('figcaption').textContent;
      dlg.showModal();
    });
  });
  dlg.addEventListener('click', () => dlg.close());
}
