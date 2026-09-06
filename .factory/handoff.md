# Review 8 handoff — Check Firebase projects before risky commands

## Result

**FAIL.** Review 8 found three issues: one high-severity claim-test gap and two
minor live-site contract gaps. The full evidence and required changes are in
`.factory/review-8.md`.

Implementation candidate:
`79f19a72f48cfa3e3ca223340cb88aa504e53dea`. Documentation SHA before this
report: `75bd3be6085c2c6b32245b943433c62f25d87051`. Live pages and assets matched
the implementation candidate byte-for-byte.

## What was checked

- Fresh phone and desktop live contexts, one-click sample, reset, exit, storage,
  cookies, requests, keyboard, route focus, reduced motion, legal pages, links,
  titles, and designed HTTP 404.
- Clean candidate checkout with `npm ci`, `npm test`, `npm run build`,
  `cargo package --locked`, copy audit, live verifier, and all 26 declared claim
  commands run separately.
- Clean consumer installs from the local checkout and the documented Git URL,
  followed by help, version, sample, JSON, invalid-input, recovery, boundary,
  and network-classification paths.
- Full Axe scans on five routes at phone and desktop widths, the factory URL
  verifier, and mobile Lighthouse.
- Every finding from reviews 1–7 and both earlier verification reports.

## Findings to repair

1. Extend `@claim:credential-values-hidden` to test both the default text card
   and JSON with a sentinel credential value.
2. Raise the live header Demo link and Terms license link to at least 44×44 CSS
   pixels, then test all phone links and buttons.
3. Remove or replace “This paper slip is not on the bench.” on the 404 page and
   update the copy audit.

## Verification results

- Declared claim commands: 26 exited 0; 25 completely proved; 1 incomplete.
- `npm test`: PASS.
- `npm run build`: PASS; `dist/bin/` and `dist/site/` produced.
- `cargo package --locked`: PASS; 29 files, 30.8 KiB compressed.
- `npm run verify:live`: PASS for candidate identity and covered behavior.
- Axe: 0 violations at 390×844 and 1440×1000 across Home, Demo, Privacy,
  Terms, and 404.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.35s, TBT 0ms, CLS 0.00097.
- `verify-url.sh`: PASS; 678ms load and no console errors.

## How to repeat

```sh
npm ci
npm test
npm run build
cargo package --locked
npm run audit:copy
npm run verify:live
```

Then run each command in `.factory/claims.json` separately and inspect every
phone link/button, not only the targets currently covered by the browser test.

## Scope notes

No product code was changed. The product is a static site and local CLI, so
backend tenancy, restart persistence, health, rate limiting, and SQLite do not
apply. No offline promise exists. No AI feature is appropriate for this
deterministic read-only check.
