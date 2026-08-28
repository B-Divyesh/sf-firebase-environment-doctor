# Firebase Environment Doctor — polish 3 handoff

## Status

**PASS.** Product repair commit
`329e03ea2b8ecbf68328b48690118f6579874bf0` is pushed to `main` and deployed
to <https://firebase-environment-doctor.sociobot.in/> through the configured
static work-order command.

## What changed

- Fixed real route focus: each page h1 is programmatically focusable, link
  navigation moves focus to it, and Back/Forward restores it.
- Completed Privacy, Terms, and designed 404 Twitter/OG metadata and made the
  static metadata test require the complete route contract.
- Expanded `.factory/claims.json` from six to 24 claims. New release-binary
  tests prove local/default behavior, no deploy commands, five result areas,
  project selection, sign-in and project access, emulator/rules/CLI checks,
  exit codes, JSON, root discovery, failure classification, privacy, and build
  artifacts.
- Reworded the minor terminology drift on the first screen and cards while
  preserving the paper-cut inspection-bench visual system. The catalog line is
  now a verb-first, 41-character sentence.
- Removed the unused `--ci` flag rather than document behavior it did not
  implement.

The detailed finding-by-finding map is in `.factory/polish-3.md`.

## Verification

### Fresh clone

Clean clone: `/tmp/firebase-doctor-polish3.THMmUZ` at `329e03e`.

- `npm ci` — pass
- `npm test` — pass: strict format/Clippy/TypeScript, 7 Rust integration tests,
  site policy tests, local responsive Playwright/Axe smoke, and full claim suite
- `npm run build` — pass; produced `dist/bin/firebase-environment-doctor` and
  `dist/site/`
- `cargo package --locked` — pass; 26 files, 104.5KiB unpacked, 28.3KiB crate
- `npm audit --audit-level=high` — pass; 0 vulnerabilities
- Every exact command in `.factory/claims.json` — pass individually, 24/24.
  Each registry id has exactly one `@claim:<id>` test tag.

### Live production

- `/opt/fleet/lib/verify-url.sh https://firebase-environment-doctor.sociobot.in/`
  — pass. Evidence: `.factory/evidence/polish-3/verify-url/`.
- `npm run verify:live` — pass. It verified exact deployed bytes, static
  headers/caching, routes, designed 404, demo reset, same-origin requests,
  mobile no-overflow, keyboard behavior, and Axe serious/critical = 0.
- Fresh-context Playwright/Axe sweep — pass for `/`, `/demo/?demo=1`,
  `/privacy/`, `/terms/`, and `/not-a-real-route`; every route had zero
  serious/critical violations. It also proved Home → Demo → Back focus on the
  destination h1. Evidence: `.factory/evidence/polish-3/cold-live/`.
- Mobile Lighthouse — Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 1,202ms, LCP 1,352ms, TBT 0ms, CLS 0.000974. Evidence:
  `.factory/evidence/polish-3/lighthouse-mobile.json`.

The standalone `@axe-core/cli` launcher could not discover a Chrome binary in
this container. The equivalent `@axe-core/playwright` integration ran against
all live routes with the preinstalled Playwright Chromium and passed; this is
the supported alternate verification path in the work order.

## Run and release

```sh
npm ci
npm test
npm run build
cargo package --locked
```

The ready-to-publish crate is produced by `cargo package --locked`. Do not
publish it from this checkout; the factory owns registry release credentials.
Deploy the static site with the work-order build command and
`/opt/fleet/lib/deploy-static.sh firebase-environment-doctor dist/site`.

## Known gaps

None. This is a static CLI documentation site, not a PWA; it makes no offline
reload promise and therefore has no service worker/offline claim to maintain.
