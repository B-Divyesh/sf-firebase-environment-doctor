# Firebase Environment Doctor — round 4 handoff

## Status

Released and verified. All findings from reviews 1–4 are resolved. No known
product or release gaps remain.

## What changed

- Replaced the edited browser sample with a deterministic recording generated
  by the release `firebase-environment-doctor --demo` command at site-build
  time. Only the unique temporary-directory path is normalized.
- Added `browser-demo-matches-cli` to the 25-entry claims registry. Its browser
  test compares the rendered transcript exactly with a fresh release CLI run.
- Added the missing three-step “How to check a Firebase project” workflow with
  real local/network commands and a generated output excerpt.
- Re-audited copy, demo documentation, visual thesis, catalog description, and
  all earlier demo, claims, auth, routing, metadata, focus, legal, privacy, and
  mobile repairs.

## Verification

- Repair commits: `4b051e92ae36d02c2140a0ed525fb12b4aa5addd` and
  `39c103de12ca406e67799bc77861be825299a64e`.
- Fresh clone: `/tmp/firebase-doctor-release.UVAF1o/repo`, exact deployed
  commit `39c103de12ca406e67799bc77861be825299a64e`.
- Passed: `npm ci`, `npm test`, `npm run build`, and
  `cargo package --locked`.
- Passed independently: every `.factory/claims.json` command, `25/25`.
- Full suite totals: 7 Rust integration tests, 6 site-policy tests, Playwright
  browser/accessibility checks, and 20 claim test cases containing 25 unique
  claim tags.
- Deployment: Azure Static Web Apps deployment
  `54732af7-132e-4e09-a71e-d5f2e9940b06`.
- Live `npm run verify:live`: route and asset byte identity, response headers,
  first-screen wording, exact demo transcript, banner/reset/exit isolation,
  same-origin requests, route focus/Back, 404, legal shells, mobile geometry,
  and Axe serious/critical = 0.
- Factory URL check: pass, 824ms observed load, no console errors. See
  `.factory/evidence/polish-4/verify-url/verify.json`.
- Mobile Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; FCP 850ms, LCP 1,060ms, TBT 22ms, CLS 0.000974. See
  `.factory/evidence/polish-4/lighthouse-mobile.json`.
- Live screenshots:
  `.factory/evidence/polish-4/live/home-390.png`,
  `.factory/evidence/polish-4/live/demo-390.png`, and
  `.factory/evidence/polish-4/verify-url/screenshot-desktop.png`.

The product makes no offline-use promise and ships no service worker. Offline
reload testing is therefore outside its CLI/docs scope; local no-network and
browser privacy boundaries are explicitly claim-tested instead.

## Run and verify

```sh
npm ci
npm test
npm run build
cargo package --locked
EVIDENCE_DIR=.factory/evidence/polish-4/live npm run verify:live
```

Deploy `dist/site/` with the static work-order configuration. The release CLI
is at `dist/bin/firebase-environment-doctor` after `npm run build`.

## Known gaps and next steps

None for the reviewed scope. Registry publishing remains a factory operation.
