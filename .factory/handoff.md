# Firebase Environment Doctor — polish 6 handoff

## Status

**PASS — no known gaps.** Repair commit
`79f19a72f48cfa3e3ca223340cb88aa504e53dea` is pushed to `main` and deployed
as the static work-order artifact at
<https://firebase-environment-doctor.sociobot.in>.

## What changed

- Closed F-6-1. The Terms page now makes one testable MIT-license statement,
  links the shipped full license at `/LICENSE.txt`, and removes the unprovable
  affiliation and trademark assertions.
- Added `license-and-terms` to `.factory/claims.json` and its exact clean-build
  test. It verifies the repository MIT text, the deployed static copy, Terms
  link/copy, README license line, and MIT footer on every route.
- Updated the copy audit (117 reproducible visible strings) and catalog line:
  “Check Firebase projects before you deploy.”
- Retained and live-reverified every earlier demo, transcript, claims, route,
  metadata, 404, focus, legal-shell, mobile, accessibility, and paper-cut
  identity repair. See `.factory/polish-6.md` for one row per finding.

## Run and verify

```sh
npm ci
npm test
npm run build
cargo package --locked
npm run verify:live
```

`dist/site/` is the static deployment artifact. `cargo package --locked`
produces the ready-to-publish crate archive; publishing remains a factory
action.

## Exact evidence

- Fresh non-local clone: `/tmp/firebase-doctor-polish6.1zr5m0/repo` at
  `79f19a72f48cfa3e3ca223340cb88aa504e53dea`. `npm ci`, `npm test`,
  `npm run build`, and `cargo package --locked` passed.
- Every command in `.factory/claims.json` ran independently from that clone:
  **`CLEAN_CLAIM_FINAL=26/26 passed`**. This includes the new
  `@claim:license-and-terms` proof.
- Deployed through the static work-order configuration with
  `/opt/fleet/lib/deploy-static.sh firebase-environment-doctor /work/repo/dist/site`.
  The live Terms response contains the MIT statement/link, `/LICENSE.txt`
  returns 200, and the removed affiliation/trademark text is absent.
- Production `npm run verify:live` passed exact route/asset bytes, security
  headers, metadata, real 404, focus/Back behavior, demo isolation/reset,
  same-origin requests, 390px geometry, console checks, and Axe serious/critical
  checks.
- `/opt/fleet/lib/verify-url.sh` passed the live root: HTTPS 200, 675ms cold
  load, title/lang, one h1, main, image alt coverage, labelled buttons, and no
  console errors. Evidence: `.factory/evidence/polish-6/verify-url/verify.json`.
- Mobile Lighthouse on production: Performance **100**, Accessibility **100**,
  Best Practices **100**, SEO **100**; FCP 1.1s, LCP 1.2s, TBT 0ms, CLS 0.001.
  Evidence: `.factory/evidence/polish-6/lighthouse-mobile.json`.
- Live screenshots: `.factory/evidence/polish-6/live/home-390.png`,
  `.factory/evidence/polish-6/live/demo-390.png`, and
  `.factory/evidence/polish-6/live/terms-390.png`.

## Known gaps

None. No offline behavior is claimed for this CLI/docs product, so an offline
reload suite is not applicable. All retained privacy, safety, demo, legal, and
product claims have registered clean-sandbox proof.
