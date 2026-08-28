import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { chmod, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { chromium } from 'playwright';

const binary = new URL('../../dist/bin/firebase-environment-doctor', import.meta.url).pathname;
const fixture = (name) => `tests/fixtures/${name}`;

function command(commandName, args, options = {}) {
  return spawnSync(commandName, args, { encoding: 'utf8', ...options });
}

function expectStatus(result, status, label) {
  assert.equal(result.status, status, `${label}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
}

function report(args, options = {}) {
  const result = command(binary, [...args, '--json'], options);
  expectStatus(result, options.status ?? 0, `firebase-environment-doctor ${args.join(' ')}`);
  return JSON.parse(result.stdout);
}

async function withFakeFirebase(script, callback) {
  const temporary = await mkdtemp(join(tmpdir(), 'doctor-claim-'));
  try {
    const executable = join(temporary, 'firebase');
    await writeFile(executable, `#!/bin/sh\n${script}`);
    await chmod(executable, 0o755);
    return await callback({
      temporary,
      env: { ...process.env, PATH: `${temporary}:${process.env.PATH}` }
    });
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

function healthyFirebase() {
  return `
if [ "$1" = "--version" ]; then echo 14.12.0; exit 0; fi
if [ "$1" = "login:list" ]; then echo '{"result":[{"user":{"email":"developer@example.test"}}]}'; exit 0; fi
if [ "$1" = "projects:list" ]; then echo '{"result":[{"projectId":"careful-app-dev"}]}'; exit 0; fi
exit 64
`;
}

test('@claim:local-check-no-network @claim:local-check-runs-locally', async () => {
  await withFakeFirebase(`
echo "$@" >> "$DOCTOR_COMMAND_LOG"
if [ "$1" = "--version" ]; then echo 14.12.0; exit 0; fi
exit 64
`, async ({ temporary, env }) => {
    const log = join(temporary, 'commands.log');
    const result = command(binary, ['--root', fixture('wrong-project'), '--json'], {
      env: { ...env, DOCTOR_COMMAND_LOG: log }
    });
    expectStatus(result, 0, 'default local check');
    const parsed = JSON.parse(result.stdout);
    assert.equal(parsed.network_opt_in, false);
    assert.equal(parsed.root, 'wrong-project');
    assert.equal(parsed.project.id, 'careful-app-dev');
    assert.deepEqual((await readFile(log, 'utf8')).trim().split('\n'), ['--version']);
  });
});

test('@claim:credential-values-hidden', async () => {
  await withFakeFirebase(`
if [ "$1" = "--version" ]; then echo 14.12.0; exit 0; fi
if [ "$1" = "login:list" ]; then echo '{"result":[{"user":{"email":"developer@example.test","token":"TOP_SECRET_SENTINEL"}}]}'; exit 0; fi
echo '{"error":{"message":"Authentication Error: TOP_SECRET_SENTINEL"}}' >&2
exit 1
`, async ({ env }) => {
    const result = command(binary, ['--root', fixture('wrong-project'), '--network', '--json'], { env });
    expectStatus(result, 1, 'network credential suppression check');
    assert.doesNotMatch(result.stdout, /TOP_SECRET_SENTINEL|"token"/);
    assert.match(result.stdout, /auth_invalid/);
  });
});

test('@claim:read-only-firebase-commands @claim:never-deploys', async () => {
  await withFakeFirebase(`
echo "$@" >> "$DOCTOR_COMMAND_LOG"
${healthyFirebase()}
`, async ({ temporary, env }) => {
    const log = join(temporary, 'commands.log');
    const local = command(binary, ['--root', fixture('wrong-project'), '--json'], {
      env: { ...env, DOCTOR_COMMAND_LOG: log }
    });
    expectStatus(local, 0, 'local command allow-list check');
    const network = command(binary, ['--root', fixture('wrong-project'), '--network', '--json'], {
      env: { ...env, DOCTOR_COMMAND_LOG: log }
    });
    expectStatus(network, 0, 'network command allow-list check');
    assert.deepEqual(
      (await readFile(log, 'utf8')).trim().split('\n'),
      ['--version', '--version', 'login:list --json', 'projects:list --json']
    );
  });
});

test('@claim:cli-demo-isolated', () => {
  const result = command(binary, ['--demo']);
  expectStatus(result, 0, 'bundled CLI demo');
  assert.match(result.stdout, /Demo sample copied to \/tmp\//);
  assert.match(result.stdout, /sample-store-prod/);
  assert.match(result.stdout, /\.firebaserc defaults to 'sample-store-dev'/);
});

test('@claim:five-firebase-checks', async () => {
  await withFakeFirebase(healthyFirebase(), async ({ env }) => {
    const parsed = report(['--root', 'examples/demo-wrong-project', '--project', 'sample-store-prod'], { env });
    assert.equal(parsed.project.id, 'sample-store-prod');
    assert.equal(parsed.auth.state, 'skipped');
    assert.equal(parsed.cli.state, 'ok');
    assert.ok(parsed.emulators.length >= 2, 'emulator checks are present');
    assert.ok(parsed.rules.length >= 1, 'rules-file checks are present');
  });
});

test('@claim:project-input-boundaries', async () => {
  await withFakeFirebase(healthyFirebase(), async ({ env }) => {
    const local = report(['--root', fixture('wrong-project')], { env });
    assert.equal(local.root, 'wrong-project');
    assert.equal(local.project.id, 'careful-app-dev');
    const network = report(['--root', fixture('wrong-project'), '--network'], { env });
    assert.equal(network.network_opt_in, true);
    assert.equal(network.auth.summary, 'Firebase sign-in and project access checked');
  });
});

test('@claim:next-step-guidance', () => {
  for (const name of ['wrong-project', 'emulator-mismatch', 'expired-login']) {
    const parsed = report(['--root', fixture(name)]);
    assert.ok(parsed.suggestions.length > 0, `${name} should include a next step`);
    assert.ok(parsed.suggestions.every((suggestion) => suggestion.trim().length > 0));
  }
});

test('@claim:project-selection', async () => {
  await withFakeFirebase(healthyFirebase(), async ({ env }) => {
    const projectFile = `${fixture('wrong-project')}/.firebaserc`;
    const before = await readFile(projectFile, 'utf8');
    const defaultProject = report(['--root', fixture('wrong-project')], { env });
    assert.equal(defaultProject.project.id, 'careful-app-dev');
    assert.equal(defaultProject.project.source, '.firebaserc (default)');
    const environmentProject = report(['--root', fixture('wrong-project')], {
      env: { ...env, FIREBASE_PROJECT: 'careful-app-prod' }
    });
    assert.equal(environmentProject.project.id, 'careful-app-prod');
    assert.equal(environmentProject.project.source, 'FIREBASE_PROJECT');
    const commandProject = report(['--root', fixture('wrong-project'), '--project', 'production'], {
      env: { ...env, FIREBASE_PROJECT: 'careful-app-dev' }
    });
    assert.equal(commandProject.project.id, 'careful-app-prod');
    assert.equal(commandProject.project.source, '--project');
    assert.equal(commandProject.project.alias, 'production');
    assert.equal(await readFile(projectFile, 'utf8'), before);
  });
});

test('@claim:local-sign-in-details', async () => {
  await withFakeFirebase(healthyFirebase(), async ({ temporary, env }) => {
    const credentials = join(temporary, 'application-credentials.json');
    await writeFile(credentials, '{}');
    const parsed = report(['--root', fixture('wrong-project')], {
      env: { ...env, GOOGLE_APPLICATION_CREDENTIALS: credentials }
    });
    assert.equal(parsed.auth.state, 'ok');
    assert.match(parsed.auth.summary, /application credentials file found/);
  });
});

test('@claim:emulator-address-check', () => {
  const parsed = report(['--root', fixture('emulator-mismatch')], {
    env: { ...process.env, FIRESTORE_EMULATOR_HOST: 'localhost:8181', FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9099' }
  });
  const firestore = parsed.emulators.find((item) => item.service === 'firestore');
  assert.deepEqual(firestore, {
    service: 'firestore', configured: '127.0.0.1:8080', environment: '127.0.0.1:8181', state: 'warning'
  });
  assert.ok(parsed.findings.some((finding) => finding.code === 'emulator_mismatch'));
});

test('@claim:rules-file-check', async () => {
  const present = report(['--root', fixture('wrong-project')]);
  assert.equal(present.rules[0].state, 'ok');
  await withFakeFirebase(healthyFirebase(), async ({ temporary, env }) => {
    await writeFile(join(temporary, '.firebaserc'), '{"projects":{"default":"missing-rules-dev"}}');
    await writeFile(join(temporary, 'firebase.json'), '{"firestore":{"rules":"missing.rules"}}');
    const result = command(binary, ['--root', temporary, '--json'], { env });
    expectStatus(result, 1, 'missing rules check');
    const missing = JSON.parse(result.stdout);
    assert.equal(missing.rules[0].state, 'error');
    assert.ok(missing.findings.some((finding) => finding.code === 'rules_missing'));
  });
});

test('@claim:firebase-cli-presence', async () => {
  await withFakeFirebase(healthyFirebase(), async ({ env }) => {
    const parsed = report(['--root', fixture('wrong-project')], { env });
    assert.equal(parsed.cli.state, 'ok');
    assert.match(parsed.cli.summary, /firebase 14\.12\.0/);
  });
});

test('@claim:project-access', async () => {
  await withFakeFirebase(healthyFirebase(), async ({ env }) => {
    const parsed = report(['--root', fixture('wrong-project'), '--network'], { env });
    assert.equal(parsed.auth.summary, 'Firebase sign-in and project access checked');
    assert.equal(parsed.findings.some((finding) => finding.code === 'project_inaccessible'), false);
  });
});

test('@claim:json-output', () => {
  const result = command(binary, ['--root', fixture('wrong-project'), '--json']);
  expectStatus(result, 0, 'JSON output');
  assert.equal(result.stdout.includes('\u001B['), false, 'JSON has no ANSI control sequences');
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.schema_version, 1);
  assert.equal(typeof parsed.verdict, 'string');
});

test('@claim:project-root-discovery', async () => {
  const temporary = await mkdtemp(join(tmpdir(), 'doctor-child-root-'));
  try {
    const nested = join(temporary, 'nested');
    const { mkdir } = await import('node:fs/promises');
    await mkdir(nested);
    await writeFile(join(temporary, '.firebaserc'), '{"projects":{"default":"child-root-dev"}}');
    await writeFile(join(temporary, 'firebase.json'), '{}');
    const parsed = report(['--root', nested]);
    assert.equal(parsed.root, temporary.split('/').at(-1));
    assert.equal(parsed.project.id, 'child-root-dev');
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test('@claim:exit-codes', async () => {
  await withFakeFirebase(healthyFirebase(), async ({ temporary, env }) => {
    const credentials = join(temporary, 'application-credentials.json');
    await writeFile(credentials, '{}');
    const ready = command(binary, ['--root', fixture('wrong-project')], {
      env: { ...env, GOOGLE_APPLICATION_CREDENTIALS: credentials }
    });
    expectStatus(ready, 0, 'ready exit code');
    const warning = command(binary, ['--root', fixture('wrong-project'), '--project', 'careful-app-prod', '--strict'], { env });
    expectStatus(warning, 1, 'strict warning exit code');
    const invalid = command(binary, ['--root', join(temporary, 'missing-project')], { env });
    expectStatus(invalid, 2, 'invalid input exit code');
    await writeFile(join(temporary, '.firebaserc'), '{"projects":{"default":"missing-rules-dev"}}');
    await writeFile(join(temporary, 'firebase.json'), '{"firestore":{"rules":"missing.rules"}}');
    const problem = command(binary, ['--root', temporary], { env });
    expectStatus(problem, 1, 'problem-found exit code');
  });
});

test('@claim:network-account-and-project-access', async () => {
  const scenarios = [
    ['listed account', '{"result":[{"user":{"email":"developer@example.test"}}]}', '{"result":[{"projectId":"careful-app-dev"}]}', '', 0, undefined],
    ['no listed account', '{"status":"success"}', '{"result":[{"projectId":"careful-app-dev"}]}', '', 1, 'auth_invalid'],
    ['permission failure', '{"result":[{"user":{"email":"developer@example.test"}}]}', '', 'Permission denied', 1, 'project_inaccessible'],
    ['network failure', '{"result":[{"user":{"email":"developer@example.test"}}]}', '', 'Network request failed', 1, 'cloud_unreachable']
  ];
  for (const [name, login, projects, projectsError, status, code] of scenarios) {
    await withFakeFirebase(`
if [ "$1" = "--version" ]; then echo 14.12.0; exit 0; fi
if [ "$1" = "login:list" ]; then echo '${login}'; exit 0; fi
if [ "$1" = "projects:list" ]; then ${projectsError ? `echo '${projectsError}' >&2; exit 1` : `echo '${projects}'; exit 0`}; fi
exit 64
`, async ({ env }) => {
      const result = command(binary, ['--root', fixture('wrong-project'), '--network', '--json'], { env });
      expectStatus(result, status, name);
      const parsed = JSON.parse(result.stdout);
      if (code) assert.ok(parsed.findings.some((finding) => finding.code === code), name);
      else assert.equal(parsed.auth.summary, 'Firebase sign-in and project access checked');
    });
  }
});

test('@claim:network-failure-classification', async () => {
  const outcomes = [
    ['Authentication Error: credentials expired', 'auth_invalid'],
    ['Permission denied for this project', 'project_inaccessible'],
    ['Network request failed', 'cloud_unreachable']
  ];
  for (const [error, code] of outcomes) {
    await withFakeFirebase(`
if [ "$1" = "--version" ]; then echo 14.12.0; exit 0; fi
if [ "$1" = "login:list" ]; then echo '{"result":[{"user":{"email":"developer@example.test"}}]}'; exit 0; fi
echo '${error}' >&2
exit 1
`, async ({ env }) => {
      const result = command(binary, ['--root', fixture('wrong-project'), '--network', '--json'], { env });
      expectStatus(result, 1, `${code} classification`);
      const parsed = JSON.parse(result.stdout);
      assert.ok(parsed.findings.some((finding) => finding.code === code), error);
      assert.equal(parsed.findings.filter((finding) => ['auth_invalid', 'project_inaccessible', 'cloud_unreachable'].includes(finding.code)).length, 1);
    });
  }
});

test('@claim:build-artifacts', async () => {
  const { access } = await import('node:fs/promises');
  await access(binary);
  await access(new URL('../../dist/site/index.html', import.meta.url));
});

test('@claim:browser-demo-isolated @claim:browser-demo-local-requests @claim:website-no-tracking', async () => {
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
    await page.goto(origin, { waitUntil: 'networkidle' });
    assert.deepEqual(await context.cookies(), []);
    assert.deepEqual(await page.evaluate(() => [Object.keys(localStorage), Object.keys(sessionStorage)]), [[], []]);
    await page.goto(`${origin}/demo/?demo=1`, { waitUntil: 'networkidle' });
    assert.deepEqual(await page.evaluate(() => Object.keys(localStorage)), ['demo:firebase-environment-doctor:reset']);
    assert.match(await page.locator('[data-demo-output]').innerText(), /sample-store-prod/);
    assert.match(await page.locator('[data-demo-output]').innerText(), /sample-store-dev/);
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
