import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';

const output = new URL('../../dist/site/', import.meta.url);

test('home has baseline semantic and privacy metadata', async () => {
  const html = await readFile(new URL('index.html', output), 'utf8');
  assert.match(html, /<html lang="en">/);
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1);
  assert.match(html, /<main id="main">/);
  assert.match(html, /<title>Firebase Environment Doctor/);
  assert.match(html, /alt="Paper-cut terminal inspection bench/);
  assert.doesNotMatch(html, /google-analytics|googletagmanager|fonts\.googleapis|cdn\./i);
});

test('legal pages and original assets are included', async () => {
  for (const path of ['privacy/index.html', 'terms/index.html']) {
    const html = await readFile(new URL(path, output), 'utf8');
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1);
    assert.match(html, /<main/);
  }
  const hero = await stat(new URL('assets/doctor-diorama.webp', output));
  assert.ok(hero.size < 300_000, `hero is ${hero.size} bytes`);
});

test('performance asset budgets are respected', async () => {
  const assets = new URL('assets/', output);
  const { readdir } = await import('node:fs/promises');
  const files = await readdir(assets);
  const totals = { js: 0, css: 0, font: 0 };
  for (const file of files) {
    const size = (await stat(new URL(file, assets))).size;
    if (file.endsWith('.js')) totals.js += size;
    if (file.endsWith('.css')) totals.css += size;
    if (file.endsWith('.woff2')) totals.font += size;
  }
  assert.ok(totals.js <= 200_000, `JS is ${totals.js} bytes`);
  assert.ok(totals.css <= 50_000, `CSS is ${totals.css} bytes`);
  assert.ok(totals.font <= 120_000, `fonts are ${totals.font} bytes`);
});
