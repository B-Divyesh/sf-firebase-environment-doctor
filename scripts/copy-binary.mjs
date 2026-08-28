import { copyFile, mkdir } from 'node:fs/promises';
import { platform } from 'node:os';

const extension = platform() === 'win32' ? '.exe' : '';
await mkdir(new URL('../dist/bin/', import.meta.url), { recursive: true });
await copyFile(
  new URL(`../target/release/firebase-environment-doctor${extension}`, import.meta.url),
  new URL(`../dist/bin/firebase-environment-doctor${extension}`, import.meta.url)
);
