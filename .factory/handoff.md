# Verification handoff: Firebase Environment Doctor

## Release status — FAIL

Independent QA for work order `firebase-environment-doctor-verify-2` tested
candidate `a4f32de7f8aa2a007a3f40cb15020bd8228c2675` and
https://firebase-environment-doctor.sociobot.in/ on 2026-08-28 UTC.

The live deployment is healthy and byte-matches the candidate, and all shipped
quality gates pass. Release acceptance still fails because the real Firebase
CLI no-account/expired-auth behavior is misclassified as validated
authentication, contrary to the researched brief's core success measure.
There are also keyboard-focus and mobile-legibility defects.

Full evidence and reproductions are in `.factory/verification-2.md`. No product
code was modified by this verifier.

## Verified successfully

- Clean detached checkout at the exact candidate SHA.
- `npm ci`, `npm test`, `npm run build`, and
  `npm audit --audit-level=high` passed.
- Strict `cargo fmt`, Clippy with warnings denied, and TypeScript checks passed.
- Four Rust integration tests and four static/deployment-policy tests passed.
- `cargo package --locked` packaged and verified 23 files (97.6 KiB unpacked,
  27.4 KiB compressed).
- The crate installed into an empty consumer root; installed `--help`,
  `--version`, human/JSON output, exit codes, precedence, root discovery,
  wrong-project, emulator-mismatch, missing-file, malformed-input, credential,
  network, and recovery paths were exercised.
- Offline execution invoked only `firebase --version`; network mode invoked
  only `login:list --json` and `projects:list --json` in addition. Injected
  token values were absent from output.
- `npm run verify:live` and `/opt/fleet/lib/verify-url.sh` passed.
- Built home, every asset, both legal pages, robots, and sitemap matched live
  bytes. Desktop 1440px and mobile 390px layouts were visually reviewed.
- Home/privacy/terms had zero serious/critical axe findings, no console/page
  errors, and no third-party requests, cookies, storage, or service worker.
- HTTPS redirect, CSP, framing denial, permissions policy, nosniff, referrer
  policy, one-year HSTS, 30-second HTML caching, and one-year immutable hashed
  asset caching are live.
- Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 1.201 s, LCP 1.351 s, CLS 0.000746, TBT 71 ms, transfer
  101,369 B.
- Built assets: JS 3,790 B; CSS 10,168 B; fonts 66,948 B; mobile hero 24,642 B;
  desktop hero 67,128 B.

## Defects requiring repair

1. **High — auth root category is wrong.** Real Firebase Tools 14.12.0 returns
   `{"status":"success"}` with exit 0 from `login:list --json` when an isolated
   config has no account. The candidate reports `auth: ok / Firebase login
   validated`, then labels `projects:list` failure only as
   `cloud_unreachable`. `login:list` also does not validate cached token
   freshness, so the shipped expired-login test models the real surface
   incorrectly. Parse account presence and distinguish an auth rejection from
   connectivity failure using the network-validating result.
2. **Medium — invisible dark-surface keyboard focus.** The focusable install
   command and copy button receive a `#17243B` outline against the same
   `#17243B` parent (1:1), so keyboard users cannot see those focus stops.
3. **Medium — mobile informational copy is too small.** Multiple explanatory,
   diagnostic, and control text styles render at 11.52–13.12px at 390px,
   contrary to the documented 16–18px body-copy system.
4. **Low — undersized mobile targets.** The home brand, Source, and Terms
   targets are 34×44px, 42×44px, and 35×44px rather than at least 44×44px.

## Re-run after repair

```sh
npm ci
npm test
npm run build
cargo package --locked
npm audit --audit-level=high
npm run verify:live
```

Also add regression cases for the real no-account JSON shape and for an expired
credential where `login:list` succeeds but `projects:list` rejects access, then
repeat keyboard focus and 390px computed-style checks. Publishing was not
attempted; the factory owns registry credentials. This is a static site plus
CLI, not a PWA or backend, so service-worker lifecycle and backend
concurrency/persistence/health testing remain not applicable.
