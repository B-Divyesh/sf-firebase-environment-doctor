# Perfection-loop round 5 — repair map

**Candidate repaired:** `1b966e2fc7384f673400aa735f8dc5a43cb2ec30`
**Repair commit:** `a93ffd6` (`fix: surface demo result on mobile`)
**Deployment:** Azure Static Web Apps `27b26f5f-099c-485f-a6ed-904c9f0777d8`
**Live:** <https://firebase-environment-doctor.sociobot.in/>
**Verified:** 2026-08-28 UTC

| Finding id | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the real isolated `--demo` CLI path and direct demo sandbox; added a compact result slip generated from that CLI transcript. | `@claim:cli-demo-isolated`; `@claim:browser-demo-matches-cli`; [live demo](https://firebase-environment-doctor.sociobot.in/demo/?demo=1); `.factory/evidence/live/demo-390.png` |
| F-1-2 | Preserved the 25-entry claims registry and one observable tagged test per claim. | Clean clone `CLEAN_CLAIM_FINAL=25/25 passed`; `every registered claim has one tagged test and a runnable command` |
| F-1-3 | Preserved the non-empty-account requirement and separate sign-in, permission, and network classification. | Rust `identifies_no_account_from_real_firebase_login_list_shape`; Rust `identifies_expired_credentials_when_account_listing_succeeds` |
| F-1-4 | Preserved the plain job-first first screen, named Firebase-developer audience, one primary sample action, and stated result. | Live `npm run verify:live`; `.factory/evidence/live/home-390.png` |
| F-1-5 | Preserved direct Demo/Privacy/Terms pages, 404, history focus, and polite route announcements. | `demo, sitemap, and designed 404 are emitted`; live Home → Demo → Back check in `npm run verify:live` |
| F-1-6 | Preserved route-specific titles, descriptions, canonicals, full Open Graph/Twitter fields, favicon, and Apple touch icon. | `every product page has route metadata and a shared accessible shell`; live byte/status crawl |
| F-1-7 | Preserved dark-panel focus contrast, 16px phone text, and 44px controls. | `site/tests/browser.mjs`; live mobile/Axe checks in `npm run verify:live` |
| F-1-8 | Added the required product one-liner to the shared footer on every route, retaining legal links, build ID, and factory credit. | `every product page has route metadata and a shared accessible shell`; live Privacy/Terms/404 shell checks |
| F-1-9 | Regenerated the copy audit with source-backed counts and added a verification command. | `npm run audit:copy` reports 110 checked strings; `.factory/copy-audit.md` |
| F-2-1 | The one-click sandbox now shows the real warning result before the full generated terminal recording. | `@claim:browser-demo-isolated`; `@claim:browser-demo-matches-cli`; live demo screenshot |
| F-2-2 | Preserved complete registered proof for every retained reliance statement. | Clean clone independently ran all 25 `.factory/claims.json` commands |
| F-2-3 | Preserved real no-account and expired-after-listing tests; the demo makes no false expired-login claim. | Rust auth regression tests; `@claim:network-failure-classification` |
| F-2-4 | Preserved plain, result-naming wording across the first screen, controls, README, and catalog description. | `npm run audit:copy`; `.factory/catalog-description.txt`; live home check |
| F-2-5 | Preserved real URLs, reload behavior, 404 status, sitemap, metadata, and focus handoff. | `site/tests/site.test.mjs`; `npm run verify:live` |
| F-2-6 | Preserved keyboard focus, mobile type/target geometry, and a shared legal shell. | `site/tests/browser.mjs`; live Axe serious/critical = 0 |
| F-3-1 | Preserved route-heading focus on navigation and browser history restoration. | Local and live Home → Demo → Back assertions |
| F-3-2 | Preserved one test and one runnable clean-sandbox command for every visible reliance claim. | Registry-integrity test; clean-clone 25/25 matrix |
| F-3-3 | Preserved complete Twitter and Open Graph fields on legal and 404 pages. | Route metadata test; live verifier byte checks |
| F-4-1 | Kept exact full transcript fidelity and derived the new compact summary from that same release output. | `@claim:browser-demo-matches-cli`; built-page summary assertions; live demo screenshot |
| F-4-2 | Preserved the three verb-led workflow steps and generated command/output excerpt. | `landing explains the three-step Firebase project workflow`; live home check |
| F-5-1 | Replaced the below-fold demo introduction with a generated result slip containing CAUTION, `sample-store-prod`, `sample-store-dev`, and the first next check in the first 390×844 viewport. | `site/tests/browser.mjs` and `npm run verify:live` assert all four boxes fit the viewport; `.factory/evidence/live/demo-390.png`; [live demo](https://firebase-environment-doctor.sociobot.in/demo/?demo=1) |
| F-5-2 | Reduced the mobile hero’s top padding and tightened its rhythm so all three trust facts fit without scrolling. | `site/tests/browser.mjs` and `npm run verify:live` assert each trust fact’s bottom is ≤844px; `.factory/evidence/live/home-390.png`; [live home](https://firebase-environment-doctor.sociobot.in/) |
| F-5-3 | Replaced the metaphor-only 404 heading with “This Firebase check page was not found,” retaining the paper-slip line as supporting copy. | `demo, sitemap, and designed 404 are emitted`; live 404 status/content check |
| F-5-4 | Added “Checks Firebase projects before deploys.” to every shared footer. | Shared-shell test and live route crawl |
| F-5-5 | Corrected all 16 prior count errors, expanded audit coverage to demo/shared route copy, and made count/source checks executable. | `npm run audit:copy` → `Copy audit passed: 110 visible strings have reproducible whitespace-token counts.` |

## Final evidence

- Fresh clone: `/tmp/firebase-doctor-polish5.Zh2gTW` at `a93ffd6` passed `npm ci`, `npm test`, `npm run build`, and `cargo package --locked`.
- The same clean clone invoked every command from `.factory/claims.json` independently: **25/25 passed**. The compact demo result is included in the existing isolated-demo/transcript claim and checks the generated verdict, selected/default IDs, and first next check.
- Post-deploy `npm run verify:live` passed exact page/asset bytes, headers, route status, focus/Back behavior, demo reset/exit isolation, same-origin requests, 390px geometry, and serious/critical Axe checks.
- `/opt/fleet/lib/verify-url.sh` passed at the production root: HTTPS 200, 645ms cold load, correct title/lang, one h1, main landmark, image alt coverage, labeled buttons, and zero page/console errors. Evidence: `.factory/evidence/polish-5/verify-url/verify.json`.
- Mobile Lighthouse against production: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1.2s, LCP 1.4s, TBT 0ms, CLS 0.001. Report: `.factory/evidence/polish-5/lighthouse-mobile.json`.

No review finding remains unresolved.
