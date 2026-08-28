import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const origin = (process.env.VERIFY_URL ?? 'https://firebase-environment-doctor.sociobot.in').replace(/\/$/, '');
const requiredPolicies = {
  'content-security-policy': ["default-src 'self'", "frame-ancestors 'none'", "object-src 'none'"],
  'permissions-policy': ['camera=()', 'microphone=()', 'geolocation=()'],
};

function verifySecurityHeaders(headers) {
  for (const [name, values] of Object.entries(requiredPolicies)) {
    const actual = headers.get(name) ?? '';
    for (const value of values) assert.ok(actual.includes(value), `${name} is missing ${value}`);
  }
  assert.equal(headers.get('x-frame-options'), 'DENY');
  const hsts = headers.get('strict-transport-security') ?? '';
  const maxAge = Number(hsts.match(/max-age=(\d+)/)?.[1]);
  assert.ok(maxAge >= 31_536_000, `HSTS max-age is ${maxAge}`);
  assert.match(hsts, /includeSubDomains; preload/);
}

const cacheBust = `repair-${Date.now()}`;
const homeResponse = await fetch(`${origin}/?${cacheBust}`, { cache: 'no-store' });
assert.equal(homeResponse.status, 200);
verifySecurityHeaders(homeResponse.headers);
assert.match(homeResponse.headers.get('cache-control') ?? '', /max-age=30/);
assert.deepEqual(Buffer.from(await homeResponse.arrayBuffer()), await readFile('dist/site/index.html'));

for (const asset of await readdir('dist/site/assets')) {
  const response = await fetch(`${origin}/assets/${asset}?${cacheBust}`, { cache: 'no-store' });
  assert.equal(response.status, 200, asset);
  verifySecurityHeaders(response.headers);
  assert.equal(response.headers.get('cache-control'), 'public, max-age=31536000, immutable');
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), await readFile(`dist/site/assets/${asset}`), asset);
}

const browser = await chromium.launch();
try {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 1000 }]) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const runtimeErrors = [];
    const requests = [];
    page.on('console', (message) => { if (message.type() === 'error') runtimeErrors.push(message.text()); });
    page.on('pageerror', (error) => runtimeErrors.push(error.message));
    page.on('request', (request) => requests.push(request.url()));
    await page.goto(`${origin}/?${cacheBust}`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('main').count(), 1);
    assert.deepEqual(runtimeErrors, []);
    assert.ok(requests.every((url) => new URL(url).origin === origin), requests.join('\n'));
    assert.deepEqual(await context.cookies(), []);
    assert.deepEqual(await page.evaluate(() => [localStorage.length, sessionStorage.length]), [0, 0]);
    assert.equal(await page.evaluate(async () => 'serviceWorker' in navigator
      ? (await navigator.serviceWorker.getRegistrations()).length
      : 0), 0, 'the non-PWA site must not retain a stale service-worker cache');
    const serious = (await new AxeBuilder({ page }).analyze()).violations
      .filter((item) => ['serious', 'critical'].includes(item.impact));
    assert.deepEqual(serious, [], serious.map((item) => item.id).join(', '));
    if (viewport.width === 390) {
      assert.ok(await page.locator('body').evaluate((node) => node.scrollWidth <= node.clientWidth));
      await page.keyboard.press('Tab');
      assert.equal(await page.locator(':focus').innerText(), 'Skip to content');
      await page.keyboard.press('Enter');
      assert.equal(await page.locator(':focus').getAttribute('id'), 'main');
      await page.getByRole('tab', { name: 'Wrong project' }).focus();
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.getByRole('tab', { name: 'Expired login' }).getAttribute('aria-selected'), 'true');
      assert.match(await page.locator('[data-demo-output]').innerText(), /Firebase login expired/);
    }
    await context.close();
  }

  const context = await browser.newContext();
  const page = await context.newPage();
  for (const path of ['/privacy/', '/terms/']) {
    await page.goto(origin + path, { waitUntil: 'networkidle' });
    const serious = (await new AxeBuilder({ page }).analyze()).violations
      .filter((item) => ['serious', 'critical'].includes(item.impact));
    assert.deepEqual(serious, [], `${path}: ${serious.map((item) => item.id).join(', ')}`);
  }
  await context.close();
} finally {
  await browser.close();
}

console.log(`Live identity, response policy, privacy, desktop/390px, keyboard, and axe passed: ${origin}`);
