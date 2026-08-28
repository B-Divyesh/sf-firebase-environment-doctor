import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import test from 'node:test';

const output = new URL('../../dist/site/', import.meta.url);

test('every product page has route metadata and a shared accessible shell', async () => {
  const pages = [
    ['index.html', 'Firebase Environment Doctor — Check Firebase projects'],
    ['demo/index.html', 'Demo — Firebase Environment Doctor'],
    ['privacy/index.html', 'Privacy — Firebase Environment Doctor'],
    ['terms/index.html', 'Terms — Firebase Environment Doctor'],
    ['404.html', 'Page not found — Firebase Environment Doctor']
  ];
  for (const [path, title] of pages) {
    const html = await readFile(new URL(path, output), 'utf8');
    assert.match(html, /<html lang="en">/);
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, path);
    assert.match(html, /<main[^>]*tabindex="-1"/);
    assert.match(html, /<h1[^>]*tabindex="-1"/);
    assert.match(html, new RegExp(`<title>${title}</title>`));
    assert.ok(title.length <= 60, `${title} is too long`);
    assert.match(html, /<link rel="canonical" href="https:\/\/firebase-environment-doctor\.sociobot\.in/);
    assert.match(html, /property="og:title"/);
    assert.match(html, /property="og:description"/);
    assert.match(html, /property="og:url"/);
    assert.match(html, /property="og:image" content="https:\/\/firebase-environment-doctor\.sociobot\.in\/assets\/doctor-share-1200-3f5aa21c\.webp"/);
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    assert.match(html, /name="twitter:title"/);
    assert.match(html, /name="twitter:description"/);
    assert.match(html, /name="twitter:image" content="https:\/\/firebase-environment-doctor\.sociobot\.in\/assets\/doctor-share-1200-3f5aa21c\.webp"/);
    assert.match(html, /apple-touch-icon-180-4e2e0d9f.png/);
    assert.match(html, /Built by Param Factory/);
  }
});

test('demo, sitemap, and designed 404 are emitted', async () => {
  const demo = await readFile(new URL('demo/index.html', output), 'utf8');
  assert.match(demo, /Demo — sample data, nothing is saved/);
  assert.match(demo, /data-reset-demo/);
  assert.match(demo, /data-start-real/);
  const sitemap = await readFile(new URL('sitemap.xml', output), 'utf8');
  assert.match(sitemap, /\/demo\//);
  const config = JSON.parse(await readFile(new URL('staticwebapp.config.json', output), 'utf8'));
  assert.equal(config.routes.find((route) => route.route === '/demo')?.rewrite, '/demo/index.html');
  assert.equal(config.responseOverrides?.['404']?.rewrite, '/404.html');
  assert.equal(config.responseOverrides?.['404']?.statusCode, 404);
  const notFound = await readFile(new URL('404.html', output), 'utf8');
  assert.match(notFound, /This paper slip is not on the bench/);
});

test('landing explains the three-step Firebase project workflow', async () => {
  const home = await readFile(new URL('index.html', output), 'utf8');
  for (const text of [
    'How to check a Firebase project',
    'Run the local check',
    'Read the project and file results',
    'Choose the optional network check',
    'firebase-environment-doctor'
  ]) assert.match(home, new RegExp(text));
  assert.match(home, /firebase-environment-doctor <span class="command-flag">--network<\/span>/);
  assert.match(home, /data-demo-excerpt/);
  assert.match(home, /sha256:ed1e7c11f025/);
  assert.doesNotMatch(home, /FIREBASE_DOCTOR_(DEMO_TRANSCRIPT|WORKFLOW_EXCERPT)/);
});

test('every registered claim has one tagged test and a runnable command', async () => {
  const claims = JSON.parse(await readFile(new URL('../../.factory/claims.json', import.meta.url), 'utf8'));
  const claimTests = await readFile(new URL('claims.test.mjs', import.meta.url), 'utf8');
  assert.equal(new Set(claims.map((claim) => claim.id)).size, claims.length);
  for (const claim of claims) {
    const tag = `@claim:${claim.id}`;
    assert.equal(claimTests.split(tag).length - 1, 1, `${tag} must tag exactly one test`);
    assert.match(claim.test, new RegExp(`--test-name-pattern=['\"]${tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['\"]`));
    assert.ok(claim.sandbox.length > 20, `${claim.id} needs a concrete sandbox`);
  }
});

test('performance asset budgets and original share art are respected', async () => {
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
  const share = await stat(new URL('assets/doctor-share-1200-3f5aa21c.webp', output));
  assert.ok(share.size < 300_000);
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
  const assetNames = await readdir(new URL('assets/', output));
  for (const name of assetNames) assert.match(name, /-[a-zA-Z0-9_-]{8,}\.[a-z0-9]+$/, `${name} needs a content hash`);
});
