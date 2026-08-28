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
    try {
      const response = await fetch(origin);
      if (response.ok) return;
    } catch {}
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
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    await page.goto(origin, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('main').count(), 1);
    assert.equal(consoleErrors.length, 0, consoleErrors.join('\n'));
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((item) => ['serious', 'critical'].includes(item.impact));
    assert.deepEqual(serious, [], serious.map((item) => `${item.id}: ${item.help}`).join('\n'));
    if (viewport.width === 390) {
      assert.ok(await page.locator('body').evaluate((node) => node.scrollWidth <= node.clientWidth));
      await page.getByRole('tab', { name: 'Wrong project' }).focus();
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.getByRole('tab', { name: 'Expired login' }).getAttribute('aria-selected'), 'true');
      assert.match(await page.locator('[data-demo-output]').innerText(), /Firebase login expired/);
    }
    await context.close();
  }

  const legalContext = await browser.newContext();
  const legalPage = await legalContext.newPage();
  for (const path of ['/privacy/', '/terms/']) {
    await legalPage.goto(origin + path, { waitUntil: 'networkidle' });
    const results = await new AxeBuilder({ page: legalPage }).analyze();
    assert.equal(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact)).length, 0);
  }
  await legalContext.close();
  console.log('Browser smoke: desktop + 390px mobile, keyboard tabs, console, and axe passed');
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}
