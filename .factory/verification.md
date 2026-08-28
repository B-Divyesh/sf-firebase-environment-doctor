# Independent verification — FAIL

**Work order:** `firebase-environment-doctor-verify-1`  
**Candidate:** `c87cc660baec9948861d5a538f6161ac702f4792` (`main`)  
**Live URL:** https://firebase-environment-doctor.sociobot.in/  
**Date:** 2026-08-28 UTC

## Verdict

**FAIL.** The end-to-end CLI and the matching deployed site work, but the
candidate fails the requested available lint gate:

```text
cargo clippy --all-targets -- -D warnings
error: this block may be rewritten with the `?` operator
  --> src/lib.rs:220:16
error: could not compile `firebase-environment-doctor` (lib) due to 1 previous error
```

This is a release quality-gate failure, so the candidate cannot receive a
PASS. No product code was modified during verification.

## Environment and reproducible gates

Clean checkout confirmed at the candidate SHA before installing. Environment:
Node `v22.23.2`, npm `10.9.8`, Cargo `1.98.0`.

| Check | Result | Evidence |
| --- | --- | --- |
| `npm ci` | PASS | Lockfile installation completed; 0 audit vulnerabilities reported. |
| `npm test` | PASS | 4 Rust integration tests, 3 site tests, and Playwright desktop/390px/axe smoke passed. |
| `npm run build` | PASS | Release CLI copied to `dist/bin/firebase-environment-doctor`; Vite site built under `dist/site`. |
| `cargo fmt --check` | PASS | No formatting diff. |
| `cargo clippy --all-targets -- -D warnings` | **FAIL** | `clippy::question_mark` at `src/lib.rs:220`; strict warnings are errors. |
| `cargo package` | PASS | Cargo packaged and verified 22 files; crate is 25.3 KiB compressed. |
| Clean-consumer install | PASS | Extracted the `.crate`, ran `cargo install --path <extracted> --root <clean temp root> --locked`, then exercised installed `--help` and `--json`. |

The source package is ready to publish after the lint failure is resolved;
publishing was not attempted.

## CLI end-to-end evidence

The release binary was exercised against the shipped fixtures and invalid
inputs. All results use `--json` where machine output matters.

| Case | Result |
| --- | --- |
| Normal local fixture | Exit 0; selected `.firebaserc` default `careful-app-dev`, cloud target, and SHA-256 rules hash. The only caution was the verifier host lacking `firebase` on `PATH`. |
| Wrong project | `FIREBASE_PROJECT=careful-app-prod --strict` exited 1 with `production_target` and `project_context_mismatch`. |
| Emulator mismatch | Configured Auth endpoint matched; `FIRESTORE_EMULATOR_HOST=localhost:8181` versus `127.0.0.1:8080` exited 1 under `--strict` with `emulator_mismatch`. |
| Network opt-in recovery | `--network` on a host without Firebase CLI exited 1, set `network_opt_in: true`, and reported `auth_invalid` plus `cloud_unreachable`; no credentials or tokens appeared in JSON/output. |
| Alias/boundary | `--project production --strict` resolved the alias to `careful-app-prod` and emitted the production/context warnings. |
| Invalid input | Missing `--root` and unknown flag both exited 2 with actionable Clap/application errors. |

The existing deterministic integration tests also cover healthy and expired
network classifications. Source review confirms the only opt-in subprocess
calls are `firebase login:list --json` and `firebase projects:list --json`;
their stdout is classified and not printed. Offline mode only checks local
marker-file existence and never reads token stores or invokes a write/deploy
command.

## Deployed-site, privacy, accessibility, and performance evidence

The live deployment **matches the candidate exactly**: the fetched home HTML,
hashed JS, hashed CSS, desktop WebP, and mobile WebP all had byte-for-byte
`cmp` equality with `dist/site` from this build. The deployed page references
`main-BrGbuCRi.js` and `main-9qqC3GPL.css` as produced locally.

- Fresh Playwright checks at 1440×1000 and 390×844: one `<h1>` and one
  `<main>`, no page errors, no console errors, no horizontal mobile overflow.
- Axe serious/critical findings: **0** on home, `/privacy/`, and `/terms/`.
- Keyboard: the skip link receives a visible `3px solid rgb(23, 36, 59)` focus
  outline; arrow-key navigation selected the Expired login tab and updated its
  live diagnostic output. Reduced-motion mode used a `0.01ms` transition.
- Network privacy: the live home made only same-origin document, JS, CSS,
  image, SVG, and self-hosted-font requests—no analytics, trackers, CDNs,
  cookies, storage, or third-party requests observed.
- Built assets: JS 3,790 B, CSS 10,159 B, self-hosted fonts 66,948 B, mobile
  hero 24,642 B, desktop hero 67,128 B. All are within the stated budgets.
- Lighthouse 12.8.2 mobile against the live URL (Chromium, screenshot capture
  disabled due to an initial browser-tab crash): Performance **100**,
  Accessibility **100**, Best Practices **100**, SEO **100**; LCP 1,380 ms,
  CLS 0.000746, TBT 0 ms.

## Defects

### Medium — strict lint quality gate fails

`cargo clippy --all-targets -- -D warnings` fails at `src/lib.rs:220` with
`clippy::question_mark`. The work order explicitly requires available
type/lint checks, so this blocks PASS even though tests and production build
pass. Replace the final `else if` block with the equivalent `?` form or apply
an intentional, justified lint allowance, then rerun the strict command.

### Low — hashed static assets are not immutable-cached

Live responses for `/`, the hashed JS, CSS, fonts, and images all return
`cache-control: public, must-revalidate, max-age=30`. The performance contract
calls for long-lived immutable caching for hashed assets. Configure the deploy
so content-hashed assets use a long `max-age` with `immutable`, while HTML can
remain short-lived/revalidated.

### Low — response-policy hardening is incomplete

The deployment sends HSTS, `Referrer-Policy: strict-origin-when-cross-origin`,
and `X-Content-Type-Options: nosniff`, but does not send CSP,
`Permissions-Policy`, `X-Frame-Options`, or an equivalent CSP
`frame-ancestors`. HSTS is only `max-age=10886400` despite carrying `preload`
(below the one-year preload requirement). Add an appropriate static-site CSP,
framing protection, restrictive permissions policy, and a one-year-or-greater
HSTS max-age.

## Scope notes

This is a CLI, not a PWA or backend: no service worker/offline-update,
concurrency, persistence, or health endpoint applies. A real authenticated
Firebase account was deliberately not introduced; the explicit network failure
and deterministic success/expired-login runner tests cover the safe behavior
without sending credentials or mutating Firebase.
