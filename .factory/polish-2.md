# Perfection-loop round 2 — repair map

**Repair commits:** `b91b2f6`, `57e0e61`  
**Live:** https://firebase-environment-doctor.sociobot.in  
**Verified:** 2026-08-28 UTC

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 / F-2-1 | Added `examples/demo-wrong-project`, real `--demo` temp-directory execution, `/demo/?demo=1`, persistent demo banner, reset/start controls, and `.factory/demo.md`. | `demo_command_uses_a_new_temporary_sample_project`; `@claim:cli-demo-isolated`; `@claim:browser-demo-isolated`; [live demo](https://firebase-environment-doctor.sociobot.in/demo/?demo=1); `.factory/evidence/live/demo-390.png` |
| F-1-2 / F-2-2 | Added six claim records and observable release-binary/browser claim tests. Removed unsupported marketing language. | Clean-clone run executed every command in `.factory/claims.json`, all passed; `site/tests/claims.test.mjs` |
| F-1-3 / F-2-3 / verification-2 high | Account listing now requires a non-empty account; project failures distinguish sign-in, permission, and connectivity. The demo no longer claims an expired-login result. | `identifies_no_account_from_real_firebase_login_list_shape`; `identifies_expired_credentials_when_account_listing_succeeds`; `@claim:credential-values-hidden` |
| F-1-4 / F-2-4 | Rewrote first screen with the requested developer/situation headline, single sample-check primary action, outcome note, plain section names, README, catalog description, and copy audit. | `site/tests/browser.mjs`; `.factory/copy-audit.md`; [live home](https://firebase-environment-doctor.sociobot.in/) |
| F-1-5 / F-2-5 | Added real demo, privacy, terms, and static 404 documents; direct `/demo` rewrite; sitemap entry; route announcement and navigation-focus handoff. | `site/tests/site.test.mjs`; `npm run verify:live`; [live /demo](https://firebase-environment-doctor.sociobot.in/demo); [live 404](https://firebase-environment-doctor.sociobot.in/not-a-real-route) returns 404 |
| F-1-6 / F-2-5 | Added per-route titles, descriptions, canonicals, OG/Twitter fields, 1200×630 project art, SVG favicon, and 180px apple-touch icon. | `every product page has route metadata and a shared accessible shell`; live byte-identity check in `npm run verify:live` |
| F-1-7 / F-2-6 / verification-2 medium-low | Added paper-colored dark-panel focus indicator; raised mobile informational/control text to 16px; made brand/footer targets at least 44px. | `site/tests/browser.mjs` computed-style and geometry assertions; `.factory/evidence/live/home-390.png` |
| F-1-8 / F-2-6 | Replaced divergent legal layouts with the shared four-link header and footer containing Privacy, Terms, build version, and Param Factory attribution. | `site/tests/browser.mjs` legal-route assertions; [live privacy](https://firebase-environment-doctor.sociobot.in/privacy/) |
| F-1-9 / F-2-4 | Removed slogans, unexplained labels, internal release language, and unsupported terminal example. Used “Firebase project check” consistently. | `.factory/copy-audit.md`; `site/tests/browser.mjs` |
| verification-1 Clippy/cache/header findings | Retained the prior strict lint and deploy-header repairs; no regression. | `npm run lint`; `npm run verify:live` response-header and immutable-asset checks |

## Live evidence

- `/opt/fleet/lib/verify-url.sh` passed: title, `lang`, one H1, main landmark,
  alt text, and no page/console errors. Its desktop/mobile captures and JSON are
  under `.factory/evidence/verify-url/`.
- `npm run verify:live` passed against the deployed production build: exact
  pages/assets, headers, 404, mobile layout, keyboard skip link, demo reset,
  same-origin requests, and axe serious/critical = 0.
- Mobile Lighthouse: performance 100, accessibility 100, best practices 100,
  SEO 100; LCP 1356ms; CLS 0.00097. Raw report:
  `.factory/evidence/lighthouse.json`.
