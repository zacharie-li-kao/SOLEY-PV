export function detectPlatform(ua, touchPoints = 0) {
  if (/iPhone|iPad|Android/.test(ua) || (/Macintosh/.test(ua) && touchPoints > 1)) return 'windows';   // iPadOS reports a Mac
  if (/Macintosh|Mac OS X/.test(ua)) return 'macos';
  if (/Linux|X11/.test(ua)) return 'linux';
  return 'windows';
}

// Moves the single ember button to the visitor's platform; Windows is primary in the static HTML.
export function initDownload(doc = document, ua = navigator.userAgent, touchPoints = navigator.maxTouchPoints) {
  const platform = detectPlatform(ua, touchPoints);
  doc.querySelectorAll('[data-platform]').forEach(a => {
    const on = a.dataset.platform === platform;
    a.classList.toggle('btn-primary', on);
    a.classList.toggle('btn-secondary', !on);
  });
}
