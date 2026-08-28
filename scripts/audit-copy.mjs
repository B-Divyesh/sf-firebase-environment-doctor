import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const auditPath = new URL('../.factory/copy-audit.md', import.meta.url);
const audit = await readFile(auditPath, 'utf8');
const sourceFiles = [
  new URL('../README.md', import.meta.url),
  new URL('../dist/site/index.html', import.meta.url),
  new URL('../dist/site/demo/index.html', import.meta.url),
  new URL('../dist/site/privacy/index.html', import.meta.url),
  new URL('../dist/site/terms/index.html', import.meta.url),
  new URL('../dist/site/404.html', import.meta.url)
];

function visibleText(source, isHtml = false) {
  const withoutMarkup = isHtml ? source.replace(/<[^>]*>/g, '') : source;
  return withoutMarkup
    .replace(/`/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenCount(text) {
  return visibleText(text).split(/\s+/).filter(Boolean).length;
}

const renderedSource = (await Promise.all(sourceFiles.map((file) => readFile(file, 'utf8'))))
  .map((source, index) => visibleText(source, index > 0))
  .join(' ');
const rows = audit.split('\n').flatMap((line) => {
  const columns = line.split('|').map((column) => column.trim());
  if (columns.length !== 5 || !/^\d+$/.test(columns[2])) return [];
  return [{ text: columns[1], recorded: Number(columns[2]) }];
});

assert.ok(rows.length > 70, 'The copy audit must cover the landing page, README, demo, and shared routes.');
for (const { text, recorded } of rows) {
  const actual = tokenCount(text);
  assert.equal(recorded, actual, `Incorrect word count for: ${text}`);
  assert.ok(actual <= 22, `More than 22 words: ${text}`);
  assert.ok(renderedSource.includes(visibleText(text)), `Audited copy is not in the built product or README: ${text}`);
}

console.log(`Copy audit passed: ${rows.length} visible strings have reproducible whitespace-token counts.`);
