import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { generateDemoTranscript } from '../scripts/demo-transcript.mjs';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function requiredMatch(transcript: string, expression: RegExp, label: string): RegExpMatchArray {
  const match = transcript.match(expression);
  if (!match) throw new Error(`The --demo transcript did not include ${label}.`);
  return match;
}

function demoSummary(transcript: string): string {
  const project = requiredMatch(transcript, /^Project\s+(.+?)\s+·/m, 'the selected project')[1];
  const mismatch = requiredMatch(
    transcript,
    /^  \[warn\] --project selects '(.+?)' while \.firebaserc defaults to '(.+?)'\.$/m,
    'the project mismatch'
  );
  const verdict = requiredMatch(transcript, /^Verdict\s+([A-Z]+)\s+·/m, 'the verdict')[1];
  const nextCheck = requiredMatch(transcript, /^  - (Confirm this project ID before .+)$/m, 'the first next check')[1];
  if (project !== mismatch[1]) throw new Error('The selected-project summary does not match the mismatch finding.');
  return `<section class="demo-summary" data-demo-summary aria-labelledby="demo-summary-title">
  <div class="demo-summary-heading"><p class="eyebrow">Sample result</p><h2 id="demo-summary-title"><span data-demo-verdict>${escapeHtml(verdict)}</span> · Wrong project selected</h2></div>
  <dl>
    <div><dt>Selected project</dt><dd><code data-demo-selected>${escapeHtml(project)}</code></dd></div>
    <div><dt>Project file default</dt><dd><code data-demo-default>${escapeHtml(mismatch[2])}</code></dd></div>
    <div><dt>Next check</dt><dd data-demo-next-check>${escapeHtml(nextCheck)}</dd></div>
  </dl>
</section>`;
}

function demoRecording() {
  let transcript: string | undefined;
  return {
    name: 'firebase-doctor-demo-recording',
    transformIndexHtml: {
      order: 'pre' as const,
      handler(html: string, context: { filename: string }) {
        const transcriptMarker = '{{FIREBASE_DOCTOR_DEMO_TRANSCRIPT}}';
        const excerptMarker = '{{FIREBASE_DOCTOR_WORKFLOW_EXCERPT}}';
        const summaryMarker = '{{FIREBASE_DOCTOR_DEMO_SUMMARY}}';
        if (!html.includes(transcriptMarker) && !html.includes(excerptMarker) && !html.includes(summaryMarker)) return html;
        transcript ??= generateDemoTranscript(resolve(__dirname, '../target/release/firebase-environment-doctor'));
        const excerpt = transcript
          .split('\n')
          .filter((line) => /^(Project|Rules|Verdict)\s|^  \[warn\] --project/.test(line))
          .join('\n');
        return html
          .replace(transcriptMarker, escapeHtml(transcript))
          .replace(excerptMarker, escapeHtml(excerpt))
          .replace(summaryMarker, demoSummary(transcript));
      }
    }
  };
}

export default defineConfig({
  root: resolve(__dirname),
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: resolve(__dirname, '../dist/site'),
    emptyOutDir: true,
    target: 'es2022',
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        demo: resolve(__dirname, 'demo/index.html'),
        privacy: resolve(__dirname, 'privacy/index.html'),
        terms: resolve(__dirname, 'terms/index.html'),
        notFound: resolve(__dirname, '404.html')
      }
    }
  },
  plugins: [demoRecording()]
});
