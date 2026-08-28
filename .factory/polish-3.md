# Perfection-loop round 3 — repair map

**Product repair:** `329e03ea2b8ecbf68328b48690118f6579874bf0`  
**Live:** <https://firebase-environment-doctor.sociobot.in/>  
**Deployment:** factory static work-order command, 2026-08-28 UTC

| Finding id | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the real `--demo` temporary project and direct `/demo/?demo=1` sandbox with banner, reset, and exit. | Clean `@claim:cli-demo-isolated`, `@claim:browser-demo-isolated`; [live demo](https://firebase-environment-doctor.sociobot.in/demo/?demo=1); `.factory/evidence/polish-3/cold-live/demo-390.png` |
| F-1-2 | Expanded the registry to 24 observable claims, each with exactly one tagged release-binary or browser test. | Clean-clone `CLEAN-CLAIM FINAL 24/24 passed`; `.factory/claims.json` |
| F-1-3 | Retained the non-empty-account and sign-in/permission/network classification repair. | Rust `identifies_no_account_from_real_firebase_login_list_shape`; `identifies_expired_credentials_when_account_listing_succeeds`; clean `@claim:network-failure-classification` |
| F-1-4 | Kept the plain first screen and made terminology consistent: sign-in, emulator mismatches, and rules files. | `site/tests/browser.mjs`; `.factory/copy-audit.md`; [live home](https://firebase-environment-doctor.sociobot.in/) |
| F-1-5 | Made cross-document route focus real by focusing each `tabindex="-1"` h1 on link navigation and Back/Forward. | `site/tests/browser.mjs` Home → Demo → Back; `.factory/evidence/polish-3/cold-live/report.json` |
| F-1-6 | Completed route metadata with canonical, OG, Twitter, share image, favicon, and Apple touch icon checks on every page. | `every product page has route metadata and a shared accessible shell`; live route metadata check |
| F-1-7 | Preserved repaired dark-panel focus contrast, 16px mobile text, and 44px brand/footer targets. | `site/tests/browser.mjs`; live `npm run verify:live`; `.factory/evidence/polish-3/cold-live/home-390.png` |
| F-1-8 | Preserved the shared legal header/footer, Privacy/Terms links, Param Factory attribution, and version line. | `site/tests/browser.mjs`; [live Privacy](https://firebase-environment-doctor.sociobot.in/privacy/) |
| F-1-9 | Re-audited all landing and README copy; renamed context-light card headings and removed unsupported wording. | `.factory/copy-audit.md`; `site/tests/browser.mjs` |
| F-2-1 | Reverified the isolated CLI/browser sample paths from a clean clone. | Clean `@claim:cli-demo-isolated`, `@claim:browser-demo-isolated`; [live demo](https://firebase-environment-doctor.sociobot.in/demo/?demo=1) |
| F-2-2 | Added tests for every previously unlisted reliance claim, including exit codes and result categories. | Clean `CLEAN-CLAIM FINAL 24/24 passed`; `.factory/claims.json` |
| F-2-3 | Reverified realistic no-account and expired-credential handling. | Rust auth regression tests; clean `@claim:network-account-and-project-access` |
| F-2-4 | Revalidated the one-screen job, named audience, primary action, and plain supporting copy. | `.factory/copy-audit.md`; `.factory/evidence/polish-3/cold-live/home-390.png` |
| F-2-5 | Reverified direct demo, legal, 404, sitemap, titles, and complete share metadata. | `site/tests/site.test.mjs`; live `npm run verify:live`; [live 404](https://firebase-environment-doctor.sociobot.in/not-a-real-route) |
| F-2-6 | Reverified keyboard focus, responsive sizes, target geometry, and shared shell. | `site/tests/browser.mjs`; Playwright Axe live-route report |
| F-3-1 | Added `tabindex="-1"` to every route h1 and focus restoration for navigation plus history restoration. | `site/tests/browser.mjs` and live cold Home → Demo → Back check in `.factory/evidence/polish-3/cold-live/report.json` |
| F-3-2 | Registered and tested local execution, no deploy, five checks, input boundaries, guidance, selection, sign-in, emulator, rules, CLI, access, JSON, root discovery, exit codes, classification, tracking, and build artifacts. | Clean-clone 24/24 individual registry commands passed; `.factory/claims.json`; `site/tests/claims.test.mjs` |
| F-3-3 | Added `twitter:image` to Privacy/Terms and complete `og:url` plus Twitter metadata to the designed 404. | `site/tests/site.test.mjs`; live cold route metadata check |
| Verification 1 lint/cache/header defects | Preserved strict Clippy, immutable asset caching, CSP/framing, permissions policy, and one-year HSTS. | `npm run lint`; live `npm run verify:live` |
| Verification 2 auth/focus/mobile/target defects | Preserved the auth fix and accessible dark/mobile treatments while adding claim proof for the public behavior. | Rust auth tests; `site/tests/browser.mjs`; live Playwright Axe report |

## Final live evidence

- `npm run verify:live` passed against production: byte identity for pages and
  assets, hardened headers, 404, mobile layout, demo reset, privacy boundary,
  and Axe serious/critical findings = 0.
- `/opt/fleet/lib/verify-url.sh` passed at the live root. It recorded title,
  `lang=en`, one h1, main, image alt coverage, no unlabeled buttons, and no
  console errors in `.factory/evidence/polish-3/verify-url/`.
- A fresh 390px Playwright context rechecked home → demo → Back focus, demo
  storage reset, route metadata, titles, 404 status, and all five route Axe
  scans. Screenshots and report are in `.factory/evidence/polish-3/cold-live/`.
- Mobile Lighthouse is Performance **100**, Accessibility **100**, Best
  Practices **100**, SEO **100**; FCP 1,202ms, LCP 1,352ms, TBT 0ms, CLS
  0.000974. Raw report: `.factory/evidence/polish-3/lighthouse-mobile.json`.
