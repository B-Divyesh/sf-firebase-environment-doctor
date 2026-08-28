import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { generateDemoTranscript } from '../scripts/demo-transcript.mjs';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
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
        if (!html.includes(transcriptMarker) && !html.includes(excerptMarker)) return html;
        transcript ??= generateDemoTranscript(resolve(__dirname, '../target/release/firebase-environment-doctor'));
        const excerpt = transcript
          .split('\n')
          .filter((line) => /^(Project|Rules|Verdict)\s|^  \[warn\] --project/.test(line))
          .join('\n');
        return html
          .replace(transcriptMarker, escapeHtml(transcript))
          .replace(excerptMarker, escapeHtml(excerpt));
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
