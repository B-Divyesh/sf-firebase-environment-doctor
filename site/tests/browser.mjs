import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';

const origin = 'http://127.0.0.1:4173';
const server = spawn(process.execPath, [
  'node_modules/vite/bin/vite.js', 'preview', '--config', 'site/vite.config.ts',
  '--host', '127.0.0.1', '--port', '4173', '--strictPort'
], { stdio: 'ignore' });

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try { if ((await fetch(origin)).ok) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('Preview server did not start');
}

let browser;
try {
  await waitForServer();
  browser = await chromium.launch();
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 1000 }]) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    await page.goto(origin, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('main').count(), 1);
    assert.match(await page.locator('h1').innerText(), /Check your Firebase project before a deploy/);
    assert.equal(consoleErrors.length, 0, consoleErrors.join('\n'));
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((item) => ['serious', 'critical'].includes(item.impact));
    assert.deepEqual(serious, [], serious.map((item) => `${item.id}: ${item.help}`).join('\n'));
    if (viewport.width === 390) {
      assert.ok(await page.locator('body').evaluate((node) => node.scrollWidth <= node.clientWidth));
      for (const selector of ['.small-note', '.safety-list span', '.checks p', '.command .button']) {
        const size = await page.locator(selector).first().evaluate((node) => Number.parseFloat(getComputedStyle(node).fontSize));
        assert.ok(size >= 16, `${selector} is ${size}px`);
      }
      const brand = await page.locator('.brand').boundingBox();
      const footer = await page.locator('.footer-links a').all();
      assert.ok(brand.width >= 44 && brand.height >= 44);
      for (const link of footer) {
        const box = await link.boundingBox();
        assert.ok(box.width >= 44 && box.height >= 44);
      }
    }
    await context.close();
  }

  const demoContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const demo = await demoContext.newPage();
  await demo.goto(`${origin}/demo/?demo=1`, { waitUntil: 'networkidle' });
  assert.equal(await demo.title(), 'Demo — Firebase Environment Doctor');
  assert.match(await demo.locator('h1').innerText(), /wrong Firebase project/i);
  assert.match(await demo.locator('.demo-banner').innerText(), /nothing is saved/);
  assert.ok(await demo.locator('.terminal').evaluate((node) => Number.parseFloat(getComputedStyle(node).fontSize) >= 16));
  await demo.getByRole('button', { name: 'Reset demo' }).click();
  assert.match(await demo.locator('[data-route-announcement]').innerText(), /Demo reset/);
  const command = demo.locator('.terminal');
  await command.focus();
  const focus = await command.evaluate((node) => getComputedStyle(node).outlineColor);
  assert.notEqual(focus, 'rgb(23, 36, 59)');
  const results = await new AxeBuilder({ page: demo }).analyze();
  const seriousDemo = results.violations.filter((item) => ['serious', 'critical'].includes(item.impact));
  assert.deepEqual(seriousDemo, [], seriousDemo.map((item) => `${item.id}: ${item.help}`).join('\n'));
  await demoContext.close();

  const routingContext = await browser.newContext();
  const routing = await routingContext.newPage();
  await routing.goto(origin, { waitUntil: 'networkidle' });
  await routing.getByRole('link', { name: 'Demo' }).click();
  await routing.waitForURL(`${origin}/demo/`);
  await routing.waitForFunction(() => document.activeElement === document.querySelector('#demo-title'));
  assert.equal(await routing.locator(':focus').getAttribute('id'), 'demo-title');
  assert.match(await routing.locator('[data-route-announcement]').innerText(), /Demo page loaded/);
  await routing.goBack({ waitUntil: 'networkidle' });
  await routing.waitForFunction(() => document.activeElement === document.querySelector('#hero-title'));
  assert.equal(await routing.locator(':focus').getAttribute('id'), 'hero-title');
  assert.match(await routing.locator('[data-route-announcement]').innerText(), /Home page loaded/);
  await routingContext.close();

  const legalContext = await browser.newContext();
  const legalPage = await legalContext.newPage();
  for (const path of ['/privacy/', '/terms/']) {
    await legalPage.goto(origin + path, { waitUntil: 'networkidle' });
    assert.equal(await legalPage.locator('header nav a').count(), 4);
    assert.match(await legalPage.locator('footer').innerText(), /Built by Param Factory/);
    const results = await new AxeBuilder({ page: legalPage }).analyze();
    assert.equal(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact)).length, 0);
  }
  await legalContext.close();
  console.log('Browser smoke: routes, 390px layout, focus, demo controls, console, and axe passed');
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}
