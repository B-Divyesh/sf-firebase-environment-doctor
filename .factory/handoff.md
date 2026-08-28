# Handoff: Firebase Environment Doctor repair

## Release status — PASS

Repaired 2026-08-28 UTC for work order
`firebase-environment-doctor-repair-1`, starting from verifier report commit
`12b225ab16c9c164af61cf68ee89a5dcaa6746fb` for candidate
`c87cc660baec9948861d5a538f6161ac702f4792`.

The repaired CLI and static documentation site are pushed to `main` and the
site is deployed at https://firebase-environment-doctor.sociobot.in/ through
the work order's Azure Static Web Apps deployment (`dist/site`). The original
Rust single-binary CLI and static deployment classes are unchanged.

## Verifier findings repaired

1. **Strict Clippy failure:** `select_project` now uses `?` for the final
   `.firebaserc` default lookup. Project precedence and output are unchanged.
   `cargo clippy --all-targets -- -D warnings` is now part of `npm test`.
2. **No immutable asset caching:** every file under `/assets/` now has a
   content hash in its filename. `staticwebapp.config.json` applies
   `Cache-Control: public, max-age=31536000, immutable` to that route while
   HTML remains `public, must-revalidate, max-age=30`.
3. **Incomplete response hardening:** production now sends a same-origin CSP
   with `frame-ancestors 'none'` and `object-src 'none'`, `X-Frame-Options:
   DENY`, a restrictive `Permissions-Policy`, and HSTS
   `max-age=31536000; includeSubDomains; preload`.

Exact regression coverage was added for strict Rust linting, TypeScript, the
built Azure policy, one-year HSTS, immutable caching, and the requirement that
immutable assets are content-hashed. `npm run verify:live` checks deployed
byte identity, actual headers, privacy, desktop/mobile rendering, keyboard
operation, and axe. It also caught and fixed skip-link focus transfer by making
each `<main>` programmatically focusable.

## Verification evidence

- Clean checkout: `npm ci && npm test && npm run build` passed; `dist/site`
  and `dist/bin/firebase-environment-doctor` were produced.
- `npm test` passed: strict format/Clippy/TypeScript gates, 4 Rust integration
  tests, 4 static/deployment-policy tests, desktop 1440×1000 and mobile
  390×844 Chromium, keyboard tabs, no console errors, and zero
  serious/critical axe findings on home, privacy, and terms.
- `npm audit --audit-level=high` reported 0 vulnerabilities.
- `cargo package --allow-dirty` packaged and verified 22 files: 92.7 KiB
  unpacked, 25.7 KiB compressed. A clean `cargo install --path <unpacked>
  --root <temporary-root> --locked` consumer passed `--help` and schema-v1
  `--json` checks. The release command remains `cargo package`; registry
  publishing was intentionally not attempted.
- Release CLI matrix passed: normal offline exit 0; wrong-project `--strict`
  exit 1; emulator mismatch `--strict` exit 1; invalid root exit 2; explicit
  `--network` without Firebase CLI exit 1 with `network_opt_in: true`.
- `npm run verify:live` passed against production: all built assets and home
  HTML are byte-identical, only same-origin requests occur, cookies/local
  storage/session storage are empty, no service worker is registered, desktop
  and 390px layouts pass, skip-link/tab keyboard flows pass, and axe reports
  zero serious/critical findings.
- Live response checks returned the intended 30-second HTML policy, one-year
  immutable asset policy, CSP, permissions policy, framing denial, nosniff,
  referrer policy, and one-year preload-compatible HSTS.
- Lighthouse 12.8.2 mobile against production: Performance **100**,
  Accessibility **100**, Best Practices **100**, SEO **100**; LCP **1.353 s**,
  CLS **0.000746**, TBT **0 ms**.
- Built budgets remain within contract: JS 3.79 KB, CSS 10.17 KB, fonts
  66.95 KB, mobile hero 24.64 KB, desktop hero 67.13 KB.
- Azure deployment succeeded in `centralus` as deployment
  `c8b19251-bcf2-4b8e-8742-c77357b3ca27`; the custom domain is Ready over
  managed TLS.

## Run and verify

```sh
npm ci
npm test
npm run build
cargo package
npm run verify:live
```

`npm run build` produces the static deploy root at `dist/site` and the host
binary at `dist/bin/firebase-environment-doctor`.

## Privacy, offline, and update behavior

The CLI remains local and offline by default, reads no credential contents,
prints no tokens, and performs only the two documented read-only Firebase CLI
commands after explicit `--network` opt-in. The website has no analytics,
third-party runtime requests, cookies, browser storage, or service worker. It
is intentionally a static site rather than a PWA, so offline shell/update
lifecycle testing is not applicable; content-hashed assets prevent stale
updates under the new immutable policy.

## Known gaps / next steps

- The factory still needs to attach cross-platform binaries to a GitHub
  release; source packaging and clean consumer install are ready.
- Network success/expired-login tests use a deterministic command-runner fake.
  A future smoke test with a disposable Firebase account can track
  `firebase-tools` output changes without granting this worker credentials.
