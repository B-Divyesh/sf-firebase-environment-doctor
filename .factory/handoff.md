# Firebase Environment Doctor — polish 2 handoff

## Status

Released and verified at https://firebase-environment-doctor.sociobot.in.

Repair commits: `b91b2f6` (product repair), `57e0e61` (live verifier), and
`13d2ac0` (demo-cookie proof). All are pushed to `main`; the deployed static
build includes `13d2ac0`.

## What changed

- Added a real `firebase-environment-doctor --demo` command. It copies the
  shipped wrong-project sample into a new temporary directory and runs the real
  diagnostic path there.
- Added `/demo/?demo=1` with an isolated sample-state key, persistent demo
  banner, Reset demo, and Start for real actions.
- Added the claims registry, tagged release-binary/browser claim tests, and
  realistic sign-in expiration/no-account classification tests.
- Rebuilt the static site around real `/demo`, `/privacy`, `/terms`, and 404
  documents, per-route metadata, OG art, Apple icon, sitemap, and SWA 404
  routing.
- Rewrote the first screen, README, catalog line, and supporting copy in plain
  language; preserved the paper-cut inspection-bench visual system.
- Fixed dark-panel focus contrast, 16px mobile information/control text,
  44px brand/footer targets, and the shared legal page shell.

## Verification

From the working tree:

```sh
npm test
npm run build
cargo package --locked
```

All passed. `npm test` includes strict format/Clippy/TypeScript, seven Rust
tests, static metadata/policy tests, Playwright desktop/390px/axe tests, and
all six claim records.

From a clean clone at `/tmp/firebase-doctor-clean.RK6D3c/repo`, `npm ci` passed
and every exact command listed in `.factory/claims.json` passed individually.

Production checks passed:

```sh
/opt/fleet/lib/verify-url.sh https://firebase-environment-doctor.sociobot.in .factory/evidence/verify-url
EVIDENCE_DIR=.factory/evidence/live npm run verify:live
```

These checks confirmed live byte identity for product pages/assets, response
headers, titles, language, H1/main/alt/console baseline, mobile layout, skip
link, demo reset, same-origin demo requests, 404, and zero serious/critical axe
issues. Screenshots are `.factory/evidence/verify-url/screenshot-desktop.png`,
`.factory/evidence/verify-url/screenshot-mobile.png`,
`.factory/evidence/live/home-390.png`, and `.factory/evidence/live/demo-390.png`.

Mobile Lighthouse on the live URL: Performance 100, Accessibility 100, Best
Practices 100, SEO 100, LCP 1356ms, CLS 0.00097. The report is
`.factory/evidence/lighthouse.json`.

## Run and package

```sh
npm ci
npm test
npm run build
cargo package --locked
```

The deployable static site is `dist/site`; the binary is
`dist/bin/firebase-environment-doctor`. The factory owns publishing; no crate
was published from this work order.

## Known gaps

None. No unresolved review finding remains.
