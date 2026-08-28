# Perfection-loop round 4 — repair map

**Product repair:** `4b051e92ae36d02c2140a0ed525fb12b4aa5addd`, `39c103de12ca406e67799bc77861be825299a64e`

**Deployment:** Azure Static Web Apps deployment `54732af7-132e-4e09-a71e-d5f2e9940b06`

**Live:** <https://firebase-environment-doctor.sociobot.in/>

**Verified:** 2026-08-28 UTC

| Finding id | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the real `--demo` temporary project and direct `?demo=1` sandbox. The browser now shows the complete generated CLI result with its banner, reset, and exit controls. | `demo_command_uses_a_new_temporary_sample_project`; `@claim:cli-demo-isolated`; `@claim:browser-demo-isolated`; `@claim:browser-demo-matches-cli`; `.factory/evidence/polish-4/live/demo-390.png`; [live demo](https://firebase-environment-doctor.sociobot.in/demo/?demo=1) |
| F-1-2 | Expanded `.factory/claims.json` to 25 claims and enforced one tagged test plus one runnable command for every entry. | `every registered claim has one tagged test and a runnable command`; clean-clone `CLEAN_CLAIM_FINAL=25/25 passed` |
| F-1-3 | Preserved the non-empty account requirement and separate sign-in, permission, and connectivity results. | `identifies_no_account_from_real_firebase_login_list_shape`; `identifies_expired_credentials_when_account_listing_succeeds`; `@claim:network-failure-classification` |
| F-1-4 | Preserved the job-first headline, named Firebase-developer audience, single primary sample action, and adjacent outcome sentence. | `site/tests/browser.mjs`; `.factory/copy-audit.md`; `.factory/evidence/polish-4/live/home-390.png`; [live home](https://firebase-environment-doctor.sociobot.in/) |
| F-1-5 | Preserved distinct Demo, Privacy, Terms, and designed 404 documents with direct URLs, history focus, and route announcements. | `demo, sitemap, and designed 404 are emitted`; live Home → Demo → Back focus check in `npm run verify:live`; [live 404](https://firebase-environment-doctor.sociobot.in/not-a-real-route) returns 404 |
| F-1-6 | Preserved route-specific titles, descriptions, canonicals, complete OG/Twitter cards, favicon, Apple touch icon, and project share art. | `every product page has route metadata and a shared accessible shell`; live page and asset byte checks in `npm run verify:live` |
| F-1-7 | Preserved the light terminal focus ring, 16px mobile information/control text, 44px brand/footer targets, and realistic sign-in results. | `site/tests/browser.mjs`; live computed-style and geometry checks; `.factory/evidence/polish-4/verify-url/screenshot-mobile.png` |
| F-1-8 | Preserved the shared four-link header and footer with Privacy, Terms, version, and Param Factory attribution on every route. | `every product page has route metadata and a shared accessible shell`; live Privacy, Terms, and 404 Axe/shell checks |
| F-1-9 | Preserved the plain first-screen and section wording, updated the verb-first 48-character catalog line, and re-audited the new workflow copy. | `.factory/copy-audit.md`; `.factory/catalog-description.txt`; live first-screen assertions in `npm run verify:live` |
| F-2-1 | Reverified the isolated CLI and browser sample paths and replaced the former hand-written web result with generated output. | `@claim:cli-demo-isolated`; `@claim:browser-demo-isolated`; `@claim:browser-demo-matches-cli`; [live demo](https://firebase-environment-doctor.sociobot.in/demo/?demo=1) |
| F-2-2 | Reverified every retained reliance statement through the 25-entry registry. | Clean clone at `/tmp/firebase-doctor-release.UVAF1o/repo`, commit `39c103d`; 25 individual claim commands passed |
| F-2-3 | Reverified no-account and expired-after-listing Firebase responses against the corrected classifier. | Two named Rust regression tests plus `@claim:network-account-and-project-access` |
| F-2-4 | Revalidated the first screen, result-naming controls, consistent terms, sentence limits, and absence of banned marketing words. | `.factory/copy-audit.md`; live 390px and 1440px checks; `.factory/evidence/polish-4/verify-url/screenshot-desktop.png` |
| F-2-5 | Reverified real routes, 404 status, sitemap, titles, canonical URLs, and complete share metadata. | `site/tests/site.test.mjs`; live byte/status checks in `npm run verify:live` |
| F-2-6 | Reverified focus contrast, mobile type, tap geometry, and the shared legal shell. | `site/tests/browser.mjs`; live Axe serious/critical = 0 on Home, Demo, Privacy, Terms, and 404 |
| F-3-1 | Preserved focusable route headings and verified focus transfer on navigation and Back. | Local and live Home → Demo → Back checks in `site/tests/browser.mjs` and `npm run verify:live` |
| F-3-2 | Preserved all 24 prior claim tests and added transcript fidelity as claim 25. | `.factory/claims.json`; registry integrity test; clean-clone `25/25` individual commands |
| F-3-3 | Preserved complete Twitter and Open Graph metadata on Privacy, Terms, and 404. | `every product page has route metadata and a shared accessible shell`; live byte-identity crawl |
| F-4-1 | The build runs the release binary with isolated `HOME` and empty `PATH`, normalizes only its random temporary path, and injects the complete output into `/demo`. | `@claim:browser-demo-matches-cli` compares rendered `textContent` exactly with a fresh release `--demo` run; `.factory/evidence/polish-4/live/demo-390.png`; [live demo](https://firebase-environment-doctor.sociobot.in/demo/?demo=1) |
| F-4-2 | Added “How to check a Firebase project” with three verb-led steps, the real local/network commands, and a generated real-output excerpt. | `landing explains the three-step Firebase project workflow`; local/live three-step browser assertions; `.factory/evidence/polish-4/live/home-390.png`; [live workflow](https://firebase-environment-doctor.sociobot.in/) |
| Verification 1 — lint, cache, and headers | Preserved strict formatting/Clippy, immutable hashed-asset caching, CSP, framing, permissions, and one-year HSTS. | Clean-clone `npm test`; `deployment policy hardens responses and safely caches hashed assets`; live header checks |
| Verification 2 — auth, focus, type, and targets | Preserved the corrected auth classifier and all keyboard/mobile accessibility repairs. | Rust auth tests; local/live Playwright checks; Lighthouse accessibility 100 |

## Release evidence

- Fresh clone of deployed commit `39c103de12ca406e67799bc77861be825299a64e`:
  `npm ci`, `npm test`, `npm run build`, and `cargo package --locked` passed.
  The suite included strict Rust/TypeScript lint, 7 Rust integration tests,
  6 site-policy tests, Playwright/Axe, and 20 claim test cases.
- Every command in `.factory/claims.json` was then run independently from that
  clone: `25/25` passed. The new exact transcript claim passed in its own fresh
  browser context.
- The deployed build passed `npm run verify:live`: exact route/asset bytes,
  hardened headers, first-screen copy, three workflow steps, 404, route focus,
  demo reset/exit isolation, exact CLI transcript, same-origin requests, mobile
  typography/targets, and serious/critical Axe findings = 0.
- `/opt/fleet/lib/verify-url.sh` passed with no console errors: load 824ms,
  `lang=en`, one h1, main landmark, alt coverage, and labeled buttons. Evidence:
  `.factory/evidence/polish-4/verify-url/verify.json`.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 850ms; LCP 1,060ms; TBT 22ms; CLS 0.000974. Raw report:
  `.factory/evidence/polish-4/lighthouse-mobile.json`.
- Emitted assets remain below budget: JS 2.70KB raw / 1.20KB gzip, CSS 13.04KB
  raw / 3.75KB gzip, fonts 66.95KB total.
- No offline behavior is promised by this CLI/docs site, and the copy/claims
  audit contains no offline claim. The applicable privacy and no-network
  behavior is covered by `local-check-no-network`, `website-no-tracking`, and
  the live request interception.

All review findings are resolved. No product gap remains from rounds 1–4.
