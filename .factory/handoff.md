# Firebase Environment Doctor — review 3 handoff

## Status

Review 3 is **FAIL**. No product code was changed. The full review is in
`.factory/review-3.md`.

## What was verified

- Fresh 390px and desktop production visits clearly explained the job,
  intended Firebase-developer audience, and primary sample action.
- `/demo/?demo=1` immediately showed the wrong-project sample, persistent
  demo banner, Reset demo, Start for real, the isolated `demo:` browser key,
  and same-origin-only browser requests. Reset and exiting demo left no
  browser storage/cookies.
- A clean clone at `/tmp/firebase-doctor-review3.HQ065c/repo` passed `npm ci`,
  `npm test`, `npm run build`, and all six exact commands in
  `.factory/claims.json`.
- The release CLI's `--demo` command was run from an unrelated temporary
  directory. It created a distinct `/tmp/firebase-environment-doctor-demo-*`
  sample directory and produced the expected `sample-store-prod` versus
  `sample-store-dev` warning.
- Production route/link/metadata checks confirmed real Home/Demo/Privacy/Terms
  routes, a designed HTTP 404, 200 internal/external links, mobile no-overflow,
  headers, and no console errors.

## Remaining gaps

1. Route changes and Back do not focus the new h1 because the h1 elements are
   not programmatically focusable, despite the route script attempting focus.
2. The six registered claims pass, but several live operational and exit-code
   promises are still not registered/tested. The exact statements and required
   claim IDs/tests are enumerated in review finding F-3-2.
3. Privacy, Terms, and the designed 404 have incomplete Twitter/OG metadata.

## Next steps

Implement the three fixes above, add regression tests, deploy, and repeat the
live first-read review. Do not mark the product accepted until the report has
zero findings.
