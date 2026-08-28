import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import test from 'node:test';

const output = new URL('../../dist/site/', import.meta.url);

test('home has baseline semantic and privacy metadata', async () => {
  const html = await readFile(new URL('index.html', output), 'utf8');
  assert.match(html, /<html lang="en">/);
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1);
  assert.match(html, /<main id="main"[^>]*tabindex="-1"/);
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
  const hero = await stat(new URL('assets/doctor-diorama-dfb324dc.webp', output));
  assert.ok(hero.size < 300_000, `hero is ${hero.size} bytes`);
});

test('performance asset budgets are respected', async () => {
  const assets = new URL('assets/', output);
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

test('deployment policy hardens responses and safely caches hashed assets', async () => {
  const config = JSON.parse(await readFile(new URL('staticwebapp.config.json', output), 'utf8'));
  const assetRoute = config.routes.find((route) => route.route === '/assets/*');
  assert.equal(assetRoute?.headers?.['Cache-Control'], 'public, max-age=31536000, immutable');

  const headers = config.globalHeaders;
  assert.match(headers['Content-Security-Policy'], /frame-ancestors 'none'/);
  assert.match(headers['Content-Security-Policy'], /object-src 'none'/);
  assert.equal(headers['X-Frame-Options'], 'DENY');
  assert.match(headers['Permissions-Policy'], /camera=\(\)/);
  assert.match(headers['Permissions-Policy'], /microphone=\(\)/);
  const maxAge = Number(headers['Strict-Transport-Security'].match(/max-age=(\d+)/)?.[1]);
  assert.ok(maxAge >= 31_536_000, `HSTS max-age is ${maxAge}`);
  assert.match(headers['Strict-Transport-Security'], /includeSubDomains; preload/);

  const assetNames = await readdir(new URL('assets/', output));
  assert.ok(assetNames.length > 0);
  for (const name of assetNames) {
    assert.match(name, /-[a-zA-Z0-9_-]{8,}\.[a-z0-9]+$/, `${name} must carry a content hash before immutable caching`);
  }
});
