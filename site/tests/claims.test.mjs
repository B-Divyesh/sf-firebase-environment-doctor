import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { chmod, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { chromium } from 'playwright';

const binary = new URL('../../dist/bin/firebase-environment-doctor', import.meta.url).pathname;

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: 'utf8', ...options });
  assert.equal(result.status, 0, `${command} failed: ${result.stderr}`);
  return result.stdout;
}

test('@claim:local-default-no-network', () => {
  const output = run(binary, ['--root', 'tests/fixtures/wrong-project', '--json']);
  const report = JSON.parse(output);
  assert.equal(report.network_opt_in, false);
  assert.equal(report.auth.summary.includes('network'), true);
});

test('@claim:credential-values-hidden', async () => {
  const temporary = await mkdtemp(join(tmpdir(), 'doctor-claim-'));
  try {
    const fakeFirebase = join(temporary, 'firebase');
    await writeFile(fakeFirebase, `#!/bin/sh\nif [ "$1" = "--version" ]; then echo 14.12.0; exit 0; fi\nif [ "$1" = "login:list" ]; then echo '{"result":[{"user":{"email":"developer@example.test","token":"TOP_SECRET_SENTINEL"}}]}'; exit 0; fi\necho '{"error":{"message":"Authentication Error: TOP_SECRET_SENTINEL"}}' >&2\nexit 1\n`);
    await chmod(fakeFirebase, 0o755);
    const result = spawnSync(binary, ['--root', 'tests/fixtures/wrong-project', '--network', '--json'], {
      encoding: 'utf8',
      env: { ...process.env, PATH: `${temporary}:${process.env.PATH}` }
    });
    assert.equal(result.status, 1, result.stderr);
    const output = result.stdout;
    assert.doesNotMatch(output, /TOP_SECRET_SENTINEL|"token"/);
    assert.match(output, /auth_invalid/);
  } finally { await rm(temporary, { recursive: true, force: true }); }
});

test('@claim:network-opt-in @claim:read-only-firebase-commands', async () => {
  const temporary = await mkdtemp(join(tmpdir(), 'doctor-commands-'));
  try {
    const log = join(temporary, 'commands.log');
    const fakeFirebase = join(temporary, 'firebase');
    await writeFile(fakeFirebase, `#!/bin/sh\necho "$@" >> "$DOCTOR_COMMAND_LOG"\nif [ "$1" = "--version" ]; then echo 14.12.0; exit 0; fi\nif [ "$1" = "login:list" ]; then echo '{"result":[{"user":{"email":"developer@example.test"}}]}'; exit 0; fi\necho '{"result":[{"projectId":"careful-app-dev"}]}'\n`);
    await chmod(fakeFirebase, 0o755);
    const output = run(binary, ['--root', 'tests/fixtures/wrong-project', '--network', '--json'], {
      env: { ...process.env, PATH: `${temporary}:${process.env.PATH}`, DOCTOR_COMMAND_LOG: log }
    });
    assert.equal(JSON.parse(output).network_opt_in, true);
    const commands = (await (await import('node:fs/promises')).readFile(log, 'utf8')).trim().split('\n');
    assert.deepEqual(commands, ['--version', 'login:list --json', 'projects:list --json']);
  } finally { await rm(temporary, { recursive: true, force: true }); }
});

test('@claim:cli-demo-isolated', () => {
  const output = run(binary, ['--demo']);
  assert.match(output, /Demo sample copied to \/tmp\//);
  assert.match(output, /sample-store-prod/);
  assert.match(output, /\.firebaserc defaults to 'sample-store-dev'/);
});

test('@claim:browser-demo-isolated @claim:browser-demo-local-requests', async () => {
  const origin = 'http://127.0.0.1:4174';
  const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--config', 'site/vite.config.ts', '--host', '127.0.0.1', '--port', '4174', '--strictPort'], { stdio: 'ignore' });
  let browser;
  try {
    for (let attempt = 0; attempt < 50; attempt += 1) {
      try { if ((await fetch(origin)).ok) break; } catch {}
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    const origins = [];
    page.on('request', (request) => origins.push(new URL(request.url()).origin));
    await page.goto(`${origin}/demo/?demo=1`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Reset demo' }).click();
    assert.match(await page.locator('body').innerText(), /Demo — sample data, nothing is saved/);
    assert.deepEqual([...new Set(origins)], [origin]);
    assert.deepEqual(await page.evaluate(() => Object.keys(localStorage)), []);
    assert.deepEqual(await context.cookies(), []);
    await context.close();
  } finally {
    if (browser) await browser.close();
    server.kill('SIGTERM');
  }
});
