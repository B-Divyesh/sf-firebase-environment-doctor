import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, readFile, readdir } from 'node:fs/promises';
import { generateDemoTranscript } from './demo-transcript.mjs';

const origin = (process.env.VERIFY_URL ?? 'https://firebase-environment-doctor.sociobot.in').replace(/\/$/, '');
const cacheBust = `polish-4-${Date.now()}`;
const evidence = process.env.EVIDENCE_DIR ?? '.factory/evidence/live';
const expectedDemoTranscript = generateDemoTranscript('dist/bin/firebase-environment-doctor');
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
    assert.equal(await page.locator('h1').innerText(), 'Check your Firebase project before a deploy.');
    assert.match(await page.locator('.lede').innerText(), /^For Firebase developers/);
    assert.equal(await page.getByRole('link', { name: 'Try sample project check' }).getAttribute('href'), '/demo/?demo=1');
    assert.equal(await page.locator('.action-note').innerText(), 'Shows a wrong-project result in this browser.');
    assert.equal(await page.locator('.workflow-steps > li').count(), 3);
    assert.deepEqual(await page.locator('.workflow-steps h3').allInnerTexts(), [
      'Run the local check',
      'Read the project and file results',
      'Choose the optional network check'
    ]);
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
      for (const selector of ['.small-note', '.safety-list span', '.workflow-steps p', '.workflow-index', '.workflow-output', '.checks p', '.command .button']) {
        assert.ok(await page.locator(selector).first().evaluate((node) => Number.parseFloat(getComputedStyle(node).fontSize) >= 16));
      }
      const networkCommand = page.getByLabel('Optional network check command');
      await networkCommand.focus();
      assert.equal(await networkCommand.evaluate((node) => getComputedStyle(node).whiteSpace), 'pre');
      assert.notEqual(await networkCommand.evaluate((node) => getComputedStyle(node).outlineColor), 'rgb(23, 36, 59)');
      const brand = await page.locator('.brand').boundingBox();
      assert.ok(brand.width >= 44 && brand.height >= 44);
      for (const link of await page.locator('.footer-links a').all()) {
        const box = await link.boundingBox();
        assert.ok(box.width >= 44 && box.height >= 44);
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
  assert.equal(await page.locator('[data-demo-output]').textContent(), expectedDemoTranscript);
  assert.deepEqual(await page.evaluate(() => Object.keys(localStorage)), ['demo:firebase-environment-doctor:reset']);
  const terminal = page.locator('[data-demo-output]');
  await terminal.focus();
  assert.notEqual(await terminal.evaluate((node) => getComputedStyle(node).outlineColor), 'rgb(23, 36, 59)');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  assert.deepEqual(await page.evaluate(() => Object.keys(localStorage)), []);
  assert.ok(requests.every((url) => new URL(url).origin === origin));
  await page.screenshot({ path: `${evidence}/demo-390.png`, fullPage: true });
  const serious = (await new AxeBuilder({ page }).analyze()).violations.filter((item) => ['serious', 'critical'].includes(item.impact));
  assert.deepEqual(serious, [], serious.map((item) => item.id).join(', '));
  await page.getByRole('link', { name: 'Start for real' }).click();
  await page.waitForURL(`${origin}/`);
  assert.deepEqual(await page.evaluate(() => [Object.keys(localStorage), Object.keys(sessionStorage)]), [[], []]);
  await context.close();

  const routeContext = await browser.newContext();
  const routePage = await routeContext.newPage();
  await routePage.goto(`${origin}/`, { waitUntil: 'networkidle' });
  await routePage.getByRole('link', { name: 'Demo' }).click();
  await routePage.waitForURL(`${origin}/demo/`);
  await routePage.waitForFunction(() => document.activeElement === document.querySelector('#demo-title'));
  assert.match(await routePage.locator('[data-route-announcement]').innerText(), /Demo page loaded/);
  await routePage.goBack({ waitUntil: 'networkidle' });
  await routePage.waitForFunction(() => document.activeElement === document.querySelector('#hero-title'));
  assert.match(await routePage.locator('[data-route-announcement]').innerText(), /Home page loaded/);
  await routeContext.close();

  const shellContext = await browser.newContext();
  const shellPage = await shellContext.newPage();
  for (const path of ['/privacy/', '/terms/', '/not-a-real-route']) {
    const response = await shellPage.goto(origin + path, { waitUntil: 'networkidle' });
    assert.equal(response?.status(), path === '/not-a-real-route' ? 404 : 200);
    assert.equal(await shellPage.locator('header nav a').count(), 4);
    assert.match(await shellPage.locator('footer').innerText(), /Built by Param Factory/);
    const seriousShell = (await new AxeBuilder({ page: shellPage }).analyze()).violations.filter((item) => ['serious', 'critical'].includes(item.impact));
    assert.deepEqual(seriousShell, [], `${path}: ${seriousShell.map((item) => item.id).join(', ')}`);
  }
  await shellContext.close();
} finally { await browser.close(); }

console.log(`Live routes, 404, metadata, privacy, mobile, demo, and axe passed: ${origin}`);
