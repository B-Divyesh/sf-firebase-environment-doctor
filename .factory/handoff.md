# Review handoff: Firebase Environment Doctor

## Status — FAIL

Completed adversarial first-read review work order
firebase-environment-doctor-review-1 on 2026-08-28 UTC. No product code was
changed. The full evidence and required repairs are in .factory/review-1.md.

## What was verified

- Opened the live page in fresh 390px and desktop browser contexts before
  scrolling; captured /tmp/fed-mobile.png and /tmp/fed-desktop.png.
- Exercised the visible sample link and /demo; neither provides a genuine
  sandboxed CLI demo. The release binary rejects --demo.
- Confirmed /demo and an unknown path both fall back to the home page.
- Checked live metadata, headers, storage, request origins, all home links,
  legal pages, and historical verification records.
- Created a clean clone at /tmp/firebase-doctor-review.DjRyXC/repo and ran:

    npm ci
    npm test
    npm run build

All three passed. The claims registry is missing, so there were no registered
claim commands to run.

## Blocking work left

1. Add a real, temp-directory CLI sample command and resettable /demo route.
2. Add .factory/claims.json plus one tagged sandbox test per retained claim.
3. Fix the known no-login/expired-login auth classification and remove the
   unsupported live demo assertion until tested.
4. Repair the first-screen copy/action, routes/404, metadata, common legal
   shell, dark focus, mobile text, and undersized targets.

The repository remains buildable; this commit changes only review and handoff
documentation.
