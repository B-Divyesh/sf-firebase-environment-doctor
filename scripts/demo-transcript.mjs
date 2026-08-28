import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';

const demoDirectoryPattern = /^Demo sample copied to (.+)$/m;

export function normalizeDemoTranscript(output) {
  return output
    .replace(demoDirectoryPattern, 'Demo sample copied to <new temporary directory>')
    .trimEnd();
}

export function generateDemoTranscript(binaryPath) {
  const isolatedHome = mkdtempSync(join(tmpdir(), 'firebase-doctor-transcript-home-'));
  let demoDirectory;
  try {
    const result = spawnSync(resolve(binaryPath), ['--demo'], {
      cwd: isolatedHome,
      encoding: 'utf8',
      env: {
        HOME: isolatedHome,
        PATH: '',
        TMPDIR: tmpdir()
      }
    });
    if (result.status !== 0) {
      throw new Error(`Could not record --demo output (exit ${result.status}).\n${result.stderr}`);
    }
    if (result.stderr) throw new Error(`The --demo recording wrote to stderr:\n${result.stderr}`);
    demoDirectory = result.stdout.match(demoDirectoryPattern)?.[1];
    if (!demoDirectory) throw new Error('The --demo recording did not report its temporary directory.');
    return normalizeDemoTranscript(result.stdout);
  } finally {
    if (demoDirectory && isSafeDemoDirectory(demoDirectory)) {
      rmSync(demoDirectory, { recursive: true, force: true });
    }
    rmSync(isolatedHome, { recursive: true, force: true });
  }
}

function isSafeDemoDirectory(directory) {
  const resolvedTemp = resolve(tmpdir());
  const resolvedDirectory = resolve(directory);
  const child = relative(resolvedTemp, resolvedDirectory);
  return child !== ''
    && !child.startsWith(`..${sep}`)
    && child !== '..'
    && !isAbsolute(child)
    && child.startsWith('firebase-environment-doctor-demo-');
}
