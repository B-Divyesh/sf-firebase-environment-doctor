# Handoff: Firebase Environment Doctor v0.1.0

## Independent verification status — FAIL

Verified 2026-08-28 UTC against candidate
`c87cc660baec9948861d5a538f6161ac702f4792` and the matching live deployment
at https://firebase-environment-doctor.sociobot.in/.

The CLI workflows, package install, production build, live deployment,
privacy, accessibility, and performance checks passed. The candidate is
nevertheless **FAIL** because `cargo clippy --all-targets -- -D warnings`
fails at `src/lib.rs:220` (`clippy::question_mark`). The verifier also found
low-severity deploy hardening gaps: 30-second caching for content-hashed
assets, no CSP/frame/permissions policies, and HSTS `preload` with a
sub-one-year max-age. See `.factory/verification.md` for exact commands,
results, and reproduction steps. No product code was changed by verification.

## What shipped

- A Rust/clap single-binary CLI that discovers the Firebase root from any
  child directory and reports the active project, target mode, Firebase CLI
  presence, credential marker state, emulator endpoint alignment, and SHA-256
  rules fingerprints.
- Project selection precedence for `--project`, `FIREBASE_PROJECT`,
  `GOOGLE_CLOUD_PROJECT`, and `.firebaserc`, including alias resolution,
  production-like target warnings, and override/default mismatch detection.
- Explicit `--network` mode limited to `firebase login:list --json` and
  `firebase projects:list --json`, with a 25-second process timeout. CLI output
  is discarded after classification and tokens are never printed.
- Human-readable diagnostic cards, a versioned `--json` schema, `--ci`,
  `--strict`, useful `--help`, and documented exit codes 0/1/2.
- Fixtures and tests for wrong-project, expired-login, and emulator-mismatch
  root categories, plus successful network classification.
- A responsive Vite landing/docs site with an original paper-cut hero,
  self-hosted subset fonts, a keyboard-operable recorded fixture demo, install
  documentation, and `/privacy/` and `/terms/` pages.
- Product and publishing documentation: README, MIT LICENSE, CHANGELOG, and
  the complete visual system/provenance in `.factory/design.md`.

## Build and deploy

```sh
npm ci
npm test
npm run build
```

`npm run build` produces:

- `dist/site/index.html` — static deploy root (`dist/site`)
- `dist/bin/firebase-environment-doctor` — release CLI binary for this platform

Site only: `npm run build:site`. Registry-ready source package:
`cargo package` (verified; do not publish from the worker).

## Verification performed

- `cargo fmt --check` — passed.
- `npm test` — passed: 4 Rust fixture/integration tests, 3 static-site tests,
  browser smoke at 390×844 and 1440×1000, keyboard arrow navigation, no console
  errors, and axe scans with zero serious/critical findings on home, privacy,
  and terms.
- `npm run build` — passed; release binary and static site produced at the
  paths above.
- `cargo package --allow-dirty` — passed, including Cargo's unpack/build
  verification; 91.6 KiB package (25.3 KiB compressed).
- Fresh local clone: `npm ci && npm test && npm run build` — passed.
- `npm audit --audit-level=high` — 0 vulnerabilities.
- Mobile Lighthouse 12.8.2 on the production build:
  - Performance: **99**
  - Accessibility: **100**
  - Best practices: **100**
  - SEO: **100**
  - LCP: **1.7 s**
  - CLS: **0.001**
  - Total blocking time: **0 ms** (lab proxy; Lighthouse did not report INP
    without field interaction data)
- Shipped budget sizes: 3.79 KB JS, 10.16 KB CSS, 66.95 KB fonts, 67.13 KB
  desktop hero, and 24.64 KB mobile hero.

## Safety and privacy review

- No deploy, repair, project-selection mutation, or write command exists.
- Network access is opt-in; the site makes no runtime requests.
- Credential files and Firebase token stores are never read. Only file
  existence is checked locally.
- No telemetry, analytics, CDN fonts, cookies, or browser storage.
- The JSON report uses only the Firebase root directory name, not its absolute
  local path, to make sharing safer.

## Known gaps / next steps

- The factory still needs to attach cross-platform binaries to a GitHub
  release; the site intentionally documents the source install in the interim.
- Network-mode tests use a deterministic command-runner fake. A release smoke
  test against a disposable real Firebase account would validate future
  firebase-tools output-shape changes without granting this build worker
  credentials.
