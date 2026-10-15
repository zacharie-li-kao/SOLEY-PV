export function detectPlatform(ua) {
  if (/iPhone|iPad|Android/.test(ua)) return 'windows';
  if (/Macintosh|Mac OS X/.test(ua)) return 'macos';
  if (/Linux|X11/.test(ua)) return 'linux';
  return 'windows';
}

// Moves the single ember button to the visitor's platform; Windows is primary in the static HTML.
export function initDownload(doc = document, ua = navigator.userAgent) {
  const platform = detectPlatform(ua);
  doc.querySelectorAll('[data-platform]').forEach(a => {
    const on = a.dataset.platform === platform;
    a.classList.toggle('btn-primary', on);
    a.classList.toggle('btn-secondary', !on);
  });
}
