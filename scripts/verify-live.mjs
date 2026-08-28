import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, readFile, readdir } from 'node:fs/promises';

const origin = (process.env.VERIFY_URL ?? 'https://firebase-environment-doctor.sociobot.in').replace(/\/$/, '');
const cacheBust = `polish-2-${Date.now()}`;
const evidence = process.env.EVIDENCE_DIR ?? '.factory/evidence/live';
await mkdir(evidence, { recursive: true });

function verifySecurityHeaders(headers) {
  const csp = headers.get('content-security-policy') ?? '';
  for (const value of ["default-src 'self'", "frame-ancestors 'none'", "object-src 'none'"]) assert.ok(csp.includes(value));
  const policy = headers.get('permissions-policy') ?? '';
  for (const value of ['camera=()', 'microphone=()', 'geolocation=()']) assert.ok(policy.includes(value));
  assert.equal(headers.get('x-frame-options'), 'DENY');
  const hsts = headers.get('strict-transport-security') ?? '';
  assert.ok(Number(hsts.match(/max-age=(\d+)/)?.[1]) >= 31_536_000);
}

for (const path of ['/', '/demo/', '/privacy/', '/terms/']) {
  const response = await fetch(`${origin}${path}?${cacheBust}`, { cache: 'no-store' });
  assert.equal(response.status, 200, path);
  verifySecurityHeaders(response.headers);
  const local = path === '/' ? 'index.html' : `${path.slice(1)}index.html`;
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), await readFile(`dist/site/${local}`), path);
}
const missing = await fetch(`${origin}/not-a-real-route?${cacheBust}`, { cache: 'no-store' });
assert.equal(missing.status, 404);
assert.match(await missing.text(), /This paper slip is not on the bench/);

for (const asset of await readdir('dist/site/assets')) {
  const response = await fetch(`${origin}/assets/${asset}?${cacheBust}`, { cache: 'no-store' });
  assert.equal(response.status, 200, asset);
  assert.equal(response.headers.get('cache-control'), 'public, max-age=31536000, immutable');
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), await readFile(`dist/site/assets/${asset}`), asset);
}

const browser = await chromium.launch();
try {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 1000 }]) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = []; const requests = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('request', (request) => requests.push(request.url()));
    await page.goto(`${origin}/?${cacheBust}`, { waitUntil: 'networkidle' });
    assert.equal(await page.title(), 'Firebase Environment Doctor — Check Firebase projects');
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('main').count(), 1);
    assert.deepEqual(errors, []);
    assert.ok(requests.every((url) => new URL(url).origin === origin));
    assert.deepEqual(await context.cookies(), []);
    assert.deepEqual(await page.evaluate(() => [localStorage.length, sessionStorage.length]), [0, 0]);
    const serious = (await new AxeBuilder({ page }).analyze()).violations.filter((item) => ['serious', 'critical'].includes(item.impact));
    assert.deepEqual(serious, [], serious.map((item) => item.id).join(', '));
    if (viewport.width === 390) {
      assert.ok(await page.locator('body').evaluate((node) => node.scrollWidth <= node.clientWidth));
      await page.screenshot({ path: `${evidence}/home-390.png`, fullPage: true });
      await page.keyboard.press('Tab');
      assert.equal(await page.locator(':focus').innerText(), 'Skip to content');
      await page.keyboard.press('Enter');
      assert.equal(await page.locator(':focus').getAttribute('id'), 'main');
      for (const selector of ['.small-note', '.safety-list span', '.checks p', '.command .button']) {
        assert.ok(await page.locator(selector).first().evaluate((node) => Number.parseFloat(getComputedStyle(node).fontSize) >= 16));
      }
    }
    await context.close();
  }
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const requests = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto(`${origin}/demo/?demo=1&${cacheBust}`, { waitUntil: 'networkidle' });
  assert.equal(await page.title(), 'Demo — Firebase Environment Doctor');
  assert.match(await page.locator('.demo-banner').innerText(), /nothing is saved/);
  assert.match(await page.locator('[data-demo-output]').innerText(), /sample-store-prod/);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  assert.deepEqual(await page.evaluate(() => Object.keys(localStorage)), []);
  assert.ok(requests.every((url) => new URL(url).origin === origin));
  await page.screenshot({ path: `${evidence}/demo-390.png`, fullPage: true });
  const serious = (await new AxeBuilder({ page }).analyze()).violations.filter((item) => ['serious', 'critical'].includes(item.impact));
  assert.deepEqual(serious, [], serious.map((item) => item.id).join(', '));
  await context.close();
} finally { await browser.close(); }

console.log(`Live routes, 404, metadata, privacy, mobile, demo, and axe passed: ${origin}`);
