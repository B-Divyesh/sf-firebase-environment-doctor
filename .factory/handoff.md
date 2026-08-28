# Firebase Environment Doctor — review 6 handoff

## Current review status

**FAIL — F-6-1 remains.** This review did not change product code. It added
`.factory/review-6.md` and rechecked the live site, clean clone, claims, demo,
copy, history, and route structure.

## Review 6 verification

- Fresh live contexts at 390×844 and 1440×1000 established the job, audience,
  and first action without scrolling.
- The live demo showed the generated wrong-project result in its first mobile
  viewport. The banner, Reset action, `demo:` storage namespace, and
  same-origin request boundary were checked in a new browser context.
- Fresh clone `/tmp/firebase-doctor-review6.ycfPTO/repo` passed `npm ci`,
  `npm test`, and every one of the 25 registry commands independently.
- Home, Demo, Privacy, Terms, and 404 were crawled for title/metadata,
  heading, footer/header, links, deep-link behavior, and focus after Back.

## Remaining work

Terms has unregistered licence, affiliation, trademark, and warranty claims.
Add registry proof for statements a clean clone can prove (at least the shipped
MIT licence and matching terms), and remove or replace statements that cannot
be sandbox-proven. See `F-6-1` in `.factory/review-6.md` for exact quotes and
the required fix. Re-run the 25-command claims matrix after repairing it.

## Historical round 5 handoff

## Status

**PASS — no known gaps.** Repair commit `a93ffd6` was deployed through the
factory static work order as Azure Static Web Apps deployment
`27b26f5f-099c-485f-a6ed-904c9f0777d8`.

## What changed

- The first demo viewport now contains a compact result slip generated from the
  real `firebase-environment-doctor --demo` transcript. It shows the CAUTION
  verdict, `sample-store-prod`, `sample-store-dev`, and first next check before
  the complete terminal recording.
- The 390×844 landing viewport now contains all three trust facts.
- The designed 404 has a literal, understandable h1. Every shared footer now
  includes the product one-liner.
- Copy-audit counts were corrected and are now checked against the built pages
  and README by `npm run audit:copy`.
- The existing isolated demo, claim registry, CLI auth classification, routes,
  metadata, focus transfer, accessible mobile behavior, privacy boundary, and
  product-specific paper-cut visual system were reverified without regression.

## Run and verify

```sh
npm ci
npm test
npm run build
cargo package --locked
npm run verify:live
```

For the packaged CLI, `cargo package --locked` produces the ready-to-publish
crate archive; registry publishing remains a factory action. The static
deployment artifact is `dist/site/`.

## Exact evidence

- Clean clone: `/tmp/firebase-doctor-polish5.Zh2gTW`, commit `a93ffd6`.
  `npm ci`, `npm test`, `npm run build`, and `cargo package --locked` all
  passed. The suite includes strict Rust/TypeScript lint, 7 Rust integration
  tests, 6 site-policy tests, browser/Axe checks, and 20 aggregate claim cases.
- Every command in `.factory/claims.json` was run independently from that clean
  clone: **`CLEAN_CLAIM_FINAL=25/25 passed`**.
- Production `npm run verify:live` passed exact route/asset bytes, headers,
  real 404, metadata, focus/Back behavior, demo isolation/reset, same-origin
  requests, 390px geometry, and Axe serious/critical checks.
- `/opt/fleet/lib/verify-url.sh` passed the live root: HTTPS 200, 645ms load,
  title/lang, one h1, main, alt text, labeled buttons, and no console errors.
  Evidence: `.factory/evidence/polish-5/verify-url/verify.json`.
- Live mobile Lighthouse: Performance **100**, Accessibility **100**, Best
  Practices **100**, SEO **100**; FCP 1.2s, LCP 1.4s, TBT 0ms, CLS 0.001.
  Evidence: `.factory/evidence/polish-5/lighthouse-mobile.json`.
- Screenshots: `.factory/evidence/live/home-390.png` and
  `.factory/evidence/live/demo-390.png`.

## Known gaps

None. No offline behavior is claimed, so no offline-reload suite applies to
this CLI/docs product. The documented local/default-network privacy boundaries
are covered by the registered release-binary and browser interception claims.
