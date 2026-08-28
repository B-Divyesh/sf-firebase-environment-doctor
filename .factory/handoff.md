# Review handoff: Firebase Environment Doctor

## Status — FAIL

Completed adversarial first-read review 2 on 2026-08-28 UTC. No product code was
modified. The committed review is .factory/review-2.md.

## What was verified

- Opened live production cold in fresh 390×844 and 1440×1000 browser contexts.
- Exercised the sample action, direct /demo, unknown route, live
  storage/request interception, links, metadata, focus styling, mobile type,
  and touch geometry.
- Read all earlier review, verification, and handoff records. Confirmed fixed
  lint/cache/header items and the still-unfixed demo, claims, auth, copy,
  routing, metadata, focus, mobile, target-size, and shared-shell findings.
- In clean clone /tmp/firebase-doctor-review-2.8KtQsf/repo, ran npm ci,
  npm test, and npm run build; all passed. The release binary rejects --demo in
  a temporary directory.
- .factory/claims.json is absent, so no listed claim tests exist or could run.

## Required next work

See F-2-1 through F-2-6 in .factory/review-2.md. The release is not ready: the
sample is static rather than a real isolated CLI demo, every visitor claim is
untested, and the CLI can misclassify a real no-login/expired-login state.

The repository remains buildable. This commit changes only review and handoff
documentation.
