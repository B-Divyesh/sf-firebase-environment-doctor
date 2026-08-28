# Polish 6 — final finding closure

**Repair commit:** `79f19a72f48cfa3e3ca223340cb88aa504e53dea`  
**Production:** <https://firebase-environment-doctor.sociobot.in>  
**Result:** PASS — no finding remains open.

This round fixed F-6-1 and independently rechecked every earlier finding on the
deployed product. The product remains the paper-cut inspection bench described
in `.factory/design.md`; no generic template or deployment-class change was
made.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained the real `--demo` temporary-project path and direct isolated browser demo with banner, reset, and exit. | `@claim:cli-demo-isolated`; `@claim:browser-demo-isolated`; [live demo](https://firebase-environment-doctor.sociobot.in/demo/?demo=1); `live/demo-390.png` |
| F-1-2 | Retained the claims registry; added the 26th registered claim for the remaining Terms promise. | Clean-clone `CLEAN_CLAIM_FINAL=26/26 passed`; `site/tests/site.test.mjs` registry-integrity test |
| F-1-3 | Retained the non-empty-account and expired-credential classifiers; the demo makes no false expired-login assertion. | Rust `tests/diagnostics.rs`; `@claim:network-failure-classification` |
| F-1-4 | Retained the plain first-screen job, audience, primary sample action, and outcome. | Live cold check in `npm run verify:live`; `live/home-390.png` |
| F-1-5 | Retained direct Demo/Privacy/Terms routes, resettable demo, designed HTTP 404, and route announcements. | `npm run verify:live`; live `/demo/`, `/privacy/`, `/terms/`, and `/not-a-real-route` |
| F-1-6 | Retained route-specific titles, canonical URLs, Open Graph/Twitter metadata, favicon, and Apple touch icon. | `site/tests/site.test.mjs`; live byte/status checks in `npm run verify:live` |
| F-1-7 | Retained keyboard focus, contrast, 44px targets, 16px mobile text, and reduced-motion-safe layout. | `site/tests/browser.mjs`; live Axe serious/critical = 0 in `npm run verify:live` |
| F-1-8 | Retained the common header/footer and legal navigation on all pages. | `site/tests/site.test.mjs`; live shell crawl in `npm run verify:live` |
| F-1-9 | Retained the reproducible plain-copy audit and added the revised Terms strings. | `npm run audit:copy` → 117 strings |
| F-2-1 | Retained the real one-click sample and CLI temporary-directory isolation. | `@claim:cli-demo-isolated`; `@claim:browser-demo-matches-cli`; [live demo](https://firebase-environment-doctor.sociobot.in/demo/?demo=1) |
| F-2-2 | Retained proof for every visible reliance statement and added `license-and-terms`. | Clean-clone 26/26 registry matrix |
| F-2-3 | Retained real no-account, expired-auth, permission, and network classifications. | `@claim:network-account-and-project-access`; `@claim:network-failure-classification` |
| F-2-4 | Retained concise product wording and updated the catalog line to “Check Firebase projects before you deploy.” | `npm run audit:copy`; `.factory/catalog-description.txt` |
| F-2-5 | Retained real routes, unique metadata, sitemap, and styled 404. | `site/tests/site.test.mjs`; live 404/status checks |
| F-2-6 | Retained the accessible mobile shell and focus treatment. | `site/tests/browser.mjs`; `npm run verify:live` |
| F-3-1 | Retained focus transfer to each destination h1 and polite route announcements on navigation and Back. | Local/live Home → Demo → Back assertions in `site/tests/browser.mjs` and `npm run verify:live` |
| F-3-2 | Retained exactly one tagged test per registry entry; added the Terms entry and test. | `site/tests/site.test.mjs`; clean-clone 26/26 matrix |
| F-3-3 | Retained complete Twitter fields on Home, Demo, legal, and 404 routes. | `site/tests/site.test.mjs`; live byte checks |
| F-4-1 | Retained the full transcript generated from the release `--demo` command. | `@claim:browser-demo-matches-cli`; [live demo](https://firebase-environment-doctor.sociobot.in/demo/?demo=1) |
| F-4-2 | Retained the three verb-led workflow steps and generated output excerpt. | `landing explains the three-step Firebase project workflow`; [live home](https://firebase-environment-doctor.sociobot.in/) |
| F-5-1 | Retained the first-viewport demo result with verdict, both project IDs, and next check. | `site/tests/browser.mjs`; `live/demo-390.png` |
| F-5-2 | Retained all three mobile trust facts inside the first 390×844 viewport. | `site/tests/browser.mjs`; `live/home-390.png` |
| F-5-3 | Retained the literal, understandable 404 h1. | `demo, sitemap, and designed 404 are emitted`; live 404 check |
| F-5-4 | Retained the shared product one-liner in every footer. | `site/tests/site.test.mjs`; live shell check |
| F-5-5 | Retained the executable copy-count audit; Terms additions are included. | `npm run audit:copy` → 117 reproducible counts |
| F-6-1 | Replaced untestable affiliation/trademark statements. Terms now states the MIT release, links a same-origin full `LICENSE.txt`, and the registry proves the source license, built license, Terms link, README, and all MIT footers. | `@claim:license-and-terms`; [live Terms](https://firebase-environment-doctor.sociobot.in/terms/); `live/terms-390.png` |

## Final production evidence

- `npm run verify:live` passed cold byte/status checks for Home, Demo, Privacy,
  Terms, all assets, and the real 404; it also passed demo isolation/reset,
  same-origin requests, mobile geometry, focus/Back behavior, console checks,
  and Axe serious/critical checks.
- `/opt/fleet/lib/verify-url.sh` passed at the live root: HTTP 200, 675ms
  cold load, title/lang/one h1/main/alt checks, labelled buttons, and no
  console errors. Evidence: `verify-url/verify.json`.
- Mobile Lighthouse on production: Performance **100**, Accessibility **100**,
  Best Practices **100**, SEO **100**; FCP 1.1s, LCP 1.2s, TBT 0ms, CLS 0.001.
  Evidence: `lighthouse-mobile.json`.

