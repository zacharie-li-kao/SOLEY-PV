import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CELLS, LEGACY } from '../js/config.js';
import { parseHash } from '../js/router.js';
import { resolveTheme, cssTheme } from '../js/theme.js';
import { detectPlatform } from '../js/ui/download.js';

test('config has 12 unique ids and legacy targets exist', () => {
  const ids = CELLS.map(c => c.id);
  assert.equal(ids.length, 12);
  assert.equal(new Set(ids).size, 12);
  for (const target of Object.values(LEGACY)) assert.ok(ids.includes(target), target);
});

test('parseHash: valid, case, legacy, unknown, malformed', () => {
  assert.equal(parseHash(''), null);
  assert.equal(parseHash('#'), null);
  assert.equal(parseHash('#download'), 'download');
  assert.equal(parseHash('#DOWNLOAD'), 'download');
  assert.equal(parseHash('#download-tab'), 'download');
  assert.equal(parseHash('#features-tab'), 'optics');
  assert.equal(parseHash('#patchnotes-tab'), 'releases');
  assert.equal(parseHash('#contact-tab'), 'about');
  assert.equal(parseHash('#foo'), null);
  assert.equal(parseHash('#%E2'), null);
});

test('resolveTheme: hour boundaries and saved choice', () => {
  assert.equal(resolveTheme(6, null), 'night');
  assert.equal(resolveTheme(7, null), 'day');
  assert.equal(resolveTheme(18, null), 'day');
  assert.equal(resolveTheme(19, null), 'night');
  assert.equal(resolveTheme(12, 'night'), 'night');
  assert.equal(resolveTheme(23, 'day'), 'day');
  assert.equal(resolveTheme(12, 'dark'), 'day');   // old or junk values ignored
  assert.equal(cssTheme('day'), 'light');
  assert.equal(cssTheme('night'), 'dark');
});

test('detectPlatform', () => {
  assert.equal(detectPlatform('Mozilla/5.0 (Windows NT 10.0; Win64; x64)'), 'windows');
  assert.equal(detectPlatform('Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5)'), 'macos');
  assert.equal(detectPlatform('Mozilla/5.0 (X11; Linux x86_64)'), 'linux');
  assert.equal(detectPlatform('Mozilla/5.0 (Linux; Android 14)'), 'windows');
  assert.equal(detectPlatform('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'), 'windows');
  assert.equal(detectPlatform(''), 'windows');
});
