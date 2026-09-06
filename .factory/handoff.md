# Review 9 handoff — Firebase Environment Doctor

## Result

**FAIL.** Review 9 found **1 minor finding** and **0 untested claims**.

**Implementation reviewed:** `f9f9247b4d903375d03fedb9d2ba711da007c531`

**Documentation baseline:** `b68927837a048b8574852c488648095901ee8fe0`

The live product and clean implementation otherwise pass. No product code was
changed because this work order is review-only.

## Remaining finding

At 390px, the 44×44px home wordmark target ends at x=60 and the 44×44px Demo
target begins at x=60. Their gap is 0px on Home, Demo, Privacy, Terms, and 404.
The attached design contract requires at least 8px between adjacent targets.

Preserve both target sizes, add at least 8px between them without phone
overflow, and add a browser assertion for adjacent header-target spacing.

## Verified

- Fresh clone at documentation baseline `b689278`.
- `npm ci`, `npm test`, `npm run build`, `cargo package --locked`, dependency
  audit, copy audit, and live byte/runtime verifier passed.
- All 26 declared claim commands passed separately. Untested claims: 0.
- Exact Git-installed CLI passed help, version, demo, normal JSON, wrong
  project, emulator mismatch, missing rules, invalid input, boundary, and
  recovery paths.
- Fresh phone and desktop contexts confirmed the job, audience, first action,
  three facts, populated sample, persistent label, reset, exit, and no real
  data access.
- All-severity Axe scans, focus, keyboard, history, reduced motion, 200%
  equivalent layout, route titles, legal pages, links, privacy requests, and
  expected designed HTTP 404 passed.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.35s, TBT 0ms, CLS 0.00097.

## Repeat verification

```sh
npm ci
npm test
npm run build
cargo package --locked
npm run verify:live
```

Then execute every `test` command in `.factory/claims.json` separately and
measure the horizontal gap between the wordmark and Demo targets at 390px.

The full report is `.factory/review-9.md`. Evidence is under
`/work/.evidence/firebase-environment-doctor-review-9/`.
