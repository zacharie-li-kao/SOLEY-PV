import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { CELLS } from '../js/config.js';
import { resolveTheme, cssTheme } from '../js/theme.js';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('every cell has a section and the cell links follow CELLS order', () => {
  for (const { id } of CELLS) assert.match(html, new RegExp(`<section id="${id}"`), id);
  const nav = html.match(/<nav class="cells"[\s\S]*?<\/nav>/)[0];
  const order = [...nav.matchAll(/href="#([a-z]+)"/g)].map(m => m[1]);
  assert.deepEqual(order, CELLS.map(c => c.id));
});

test('inline theme boot script matches resolveTheme', () => {
  const src = html.match(/<script id="theme-boot">([\s\S]*?)<\/script>/)[1];
  for (const saved of [null, 'day', 'night', 'dark', 'light']) {
    for (let hour = 0; hour < 24; hour++) {
      const root = { dataset: {} };
      vm.runInNewContext(src, {
        localStorage: { getItem: () => saved },
        Date: class { getHours() { return hour; } },
        document: { documentElement: root },
      });
      assert.equal(root.dataset.theme, cssTheme(resolveTheme(hour, saved)), `${saved} @ ${hour}h`);
    }
  }
});

test('copy rules: no em-dash, no exclamation, British spelling, no demo link', () => {
  const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, ' ');
  assert.ok(!html.includes('—'), 'em-dash');
  assert.ok(!text.includes('!'), 'exclamation mark');
  const us = text.match(/\b(modeling|modeled|colors?|behaviors?|centers?|license|characteriz\w*|optimiz\w*|analyz\w*|favor\w*)\b/gi);
  assert.equal(us, null, `US spelling: ${us}`);
  assert.ok(!/demo\.soley-pv\.com/.test(html), 'demo link');
});
