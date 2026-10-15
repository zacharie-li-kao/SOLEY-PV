// The 12 cell links: positioned over the projected 3D cells, and the hover source for the scene.
export function initCells(onHover) {
  const links = [...document.querySelectorAll('#cells .cell')];
  links.forEach((a, i) => {
    a.addEventListener('pointerenter', () => onHover(i));
    a.addEventListener('pointerleave', () => onHover(-1));
    a.addEventListener('focus', () => onHover(i));
    a.addEventListener('blur', () => onHover(-1));
  });
  return {
    place(rects) {
      rects.forEach((r, i) => Object.assign(links[i].style, { left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px` }));
    },
    focus(id) { links.find(a => a.hash === '#' + id)?.focus({ preventScroll: true }); },
  };
}
