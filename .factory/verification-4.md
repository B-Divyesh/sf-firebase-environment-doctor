# Verification 4 — Check Firebase projects before risky commands

**Work order:** `firebase-environment-doctor-verify-4`  
**Verified:** 2026-09-06 UTC  
**Live URL:** <https://firebase-environment-doctor.sociobot.in>  
**Implementation candidate:** `40bcb6cc3f718a4d00ba6ef21c960ae0485c8dac`  
**Documentation baseline:** `09b6e1331bdf513e507716a7d589528c08c22ef9`

## Verdict

**PASS — 0 findings, 0 untested claims.**

The packaged CLI, one-click sample, static site, privacy boundary, legal pages,
and expected HTTP 404 work from a clean checkout and on the live URL. All 26
declared claim commands passed separately. No unlisted public claim was found.

The documentation baseline differs from the implementation candidate only in
`.factory/handoff.md`. `npm run verify:live` proved that production HTML and
every deployed asset are byte-for-byte equal to a clean build of `40bcb6c`.

## Job, audience, and first action

I opened production without prior storage in separate 390×844 phone and
1440×1000 desktop contexts. Before scrolling, both showed:

- **Job:** Check a Firebase project before a deploy.
- **Audience:** Firebase developers who need to catch wrong projects, sign-in
  issues, emulator mismatches, or missing rules files before changing cloud
  data.
- **First action:** **Try sample project check.** The adjacent sentence says it
  shows a wrong-project result in the browser.

The three facts — **Runs locally by default**, **Hides credential values**, and
**Does not deploy** — also fit in the first phone viewport. The title and all
section headings use plain task language; no metaphor or mood heading remains.

## Clean checkout and package gates

I made a clean detached checkout at the exact implementation SHA in
`/tmp/firebase-environment-doctor-verify-4.5ZdCpr/repo`. The environment used
Node 22.23.2, npm 10.9.8, Rust 1.98.0, and Cargo 1.98.0.

| Command | Result |
| --- | --- |
| `npm ci` | PASS; 25 packages installed, 0 vulnerabilities |
| `npm test` | PASS; strict Rust/TypeScript lint, 7 Rust tests, 6 site tests, browser/Axe checks, and 21 grouped claim tests |
| `npm run build` | PASS; created `dist/bin/` and `dist/site/` |
| `cargo package --locked` | PASS; 29 files, 31.3 KiB compressed, package verification build passed |
| `npm audit --audit-level=high` | PASS; 0 vulnerabilities |
| `npm run audit:copy` | PASS inside `npm test`; 116 visible strings checked |
| `npm run verify:live` | PASS; exact bytes, routes, headers, sample, privacy, mobile, and Axe |

The clean checkout remained unchanged after all commands. Built assets were
2.70 KB JavaScript, 14.56 KB CSS, 66.95 KB fonts, and a 24.64 KB phone hero
image, all within the declared budgets.

## Declared claims

I inspected each assertion and ran every exact `test` value from
`.factory/claims.json` separately in the clean checkout.

| Claim | Result |
| --- | --- |
| `local-check-no-network` | PASS |
| `local-check-runs-locally` | PASS |
| `credential-values-hidden` | PASS |
| `read-only-firebase-commands` | PASS |
| `never-deploys` | PASS |
| `cli-demo-isolated` | PASS |
| `browser-demo-isolated` | PASS |
| `browser-demo-local-requests` | PASS |
| `browser-demo-matches-cli` | PASS |
| `website-no-tracking` | PASS |
| `five-firebase-checks` | PASS |
| `project-input-boundaries` | PASS |
| `next-step-guidance` | PASS |
| `project-selection` | PASS |
| `local-sign-in-details` | PASS |
| `emulator-address-check` | PASS |
| `rules-file-check` | PASS |
| `firebase-cli-presence` | PASS |
| `project-access` | PASS |
| `json-output` | PASS |
| `project-root-discovery` | PASS |
| `exit-codes` | PASS |
| `network-account-and-project-access` | PASS |
| `network-failure-classification` | PASS |
| `build-artifacts` | PASS |
| `license-and-terms` | PASS |

**Claim total: 26/26 passed. Untested: 0.**

I cross-checked Home, Demo, Privacy, Terms, the 404, shared footer, README, and
CLI help against the registry. The credential test checks text and JSON plus
stdout and stderr using a sentinel. The command allow-list covers local and
network modes. I found no false, incomplete, missing, or unlisted claim.

## Installed CLI and recovery paths

I installed the package produced by `cargo package --locked` into a new
consumer root. The installed `firebase-environment-doctor 0.1.0` passed:

- helpful `--help` and `--version` output;
- `--demo` from an isolated environment with no Firebase CLI;
- a realistic CAUTION card for `sample-store-prod` versus the
  `sample-store-dev` project-file default;
- invalid missing-root handling with exit 2;
- recovery from that failure to parseable JSON from a nested directory;
- alias resolution in the installed artifact;
- strict-warning handling with exit 1; and
- normal local output with exit 0.

The demo created a new `/tmp/firebase-environment-doctor-demo-*` directory and
printed its path. Hashes of all three shipped sample files were unchanged. The
claim fixtures additionally passed missing rules, emulator mismatch, no
account, expired sign-in, permission failure, network failure, redaction, and
the exact read-only Firebase subprocess allow-list.

## One-click sample and data boundary

Pressing Enter on the first action opened `/demo/?demo=1` in one step. Its
initial phone viewport already showed:

- `CAUTION · Wrong project selected`;
- selected project `sample-store-prod`;
- project-file default `sample-store-dev`; and
- the next check to confirm the project before a write or deploy.

The complete browser transcript contained both emulator rows, the rules hash,
all three warnings, and the next checks from the release CLI. The persistent
banner said **Demo — sample data, nothing is saved** and exposed **Reset demo**
and **Start for real**. It remained after reload. Space activated Reset,
removed the sole `demo:firebase-environment-doctor:reset` key, preserved the
sample label, and announced the reset. Start for real returned home with empty
local and session storage. No cookies appeared, and every observed request
stayed on the product origin. The static demo cannot access local Firebase
project files.

## Live site, accessibility, privacy, and performance

- Home, Demo, Privacy, Terms, License, robots, sitemap, assets, and every
  discovered link returned a successful status. The GitHub source link
  returned 200.
- A deliberate unknown URL returned HTTP 404 with the designed page, one h1,
  the common shell, and a clear route home. This expected 404 is not a defect.
- Every route has `lang="en"`, one h1, one main, a unique route title,
  description, canonical, full Open Graph/Twitter metadata, favicon,
  Apple-touch icon, header, footer, legal links, product line, version, and
  factory credit.
- Independent Playwright Axe scans found zero violations of every severity on
  Home, Demo, Privacy, Terms, and the designed 404.
- Every visible phone link and button on all five routes measured at least
  44×44 CSS pixels. Every adjacent header target had at least an 8px gap; the
  minimum was exactly 8px. No route overflowed at 390px.
- All 12 visible Home links and buttons were reachable by keyboard with
  designed focus outlines and no trap. Skip navigation, Enter, Space, route
  h1 focus, polite announcements, and Back focus restoration passed.
- At 200% text size, the h1 and main remained visible without horizontal
  overflow. At reduced motion, smooth scrolling became `auto`, animation and
  transition durations were capped at 0.01ms, and nothing looped.
- Browser requests across Home, Demo, Privacy, and Terms were same-origin.
  There were no cookies, analytics, ads, third-party scripts, or service
  workers.
- Live response policy passed CSP, framing denial, HSTS, permissions policy,
  no-sniff, referrer policy, and immutable caching checks. The URL verifier
  loaded Home in 630ms with no console errors.
- Fresh mobile Lighthouse: Performance **100**, Accessibility **100**, Best
  Practices **100**, SEO **100**; FCP 903ms, LCP 1,057ms, TBT 30ms, CLS
  0.00097, and Speed Index 903ms.

No offline or update behavior is promised. This is a local CLI with a static
site, not a backend, so tenant isolation, restart persistence, SQLite, health,
and HTTP 429/Retry-After checks do not apply. The deterministic preflight does
not have a missing AI, import, export, or sync step; JSON is the appropriate
integration surface.

## Earlier finding disposition

I read reviews 1–9, verification reports 1–3, polish reports 2–6, and the prior
handoff. I checked every current disposition against the clean candidate and
live production.

| Earlier finding(s) | Current disposition |
| --- | --- |
| F-1-1, F-2-1, F-4-1, F-5-1 — missing, incomplete, or late sample | Fixed. Browser and installed CLI samples are isolated, immediate, complete, resettable, and transcript-matched. |
| F-1-2, F-2-2, F-3-2, F-6-1 — absent or incomplete claim coverage | Fixed. All 26 public claims, including Terms, have one complete tagged test and passed separately. |
| F-1-3, F-2-3, verification-2 auth — false credential classification | Fixed. No-account, expired-sign-in, permission, and network failures are distinct and raw output is redacted. |
| F-1-4, F-2-4, F-1-9, F-5-2 — unclear first screen, copy, or clipped fact | Fixed. Job, audience, action, outcome, and three facts fit before scrolling at both widths; copy audit passes. |
| F-1-5, F-2-5, F-3-1 — missing routes, 404, or focus behavior | Fixed. Direct routes, reload, expected HTTP 404, h1 focus, announcement, and Back restoration pass. |
| F-1-6, F-3-3 — incomplete canonical/share metadata | Fixed. All route metadata, favicon, Apple-touch icon, and original share image pass. |
| F-1-7, F-2-6, verification-2 focus/type/touch — accessibility regressions | Fixed. Focus contrast, mobile type, 44px targets, reduced motion, and the shared shell pass. |
| F-1-8, F-5-4 — incomplete legal shell/footer | Fixed. Every route has the common shell, legal links, product line, version, and factory credit. |
| F-4-2 — missing three-step workflow | Fixed. Three verb-led steps show the local command, result, and optional network check. |
| F-5-3, F-8-3 — unclear or metaphorical 404 copy | Fixed. The h1 and explanation directly identify the missing Firebase check page. |
| F-5-5 — incorrect copy-audit counts | Fixed. The executable 116-string audit passes. |
| F-8-1 — incomplete credential-redaction assertion | Fixed. Text and JSON stdout/stderr are tested with a secret sentinel. |
| F-8-2 — undersized Demo and License targets | Fixed. Every route has zero rendered targets below 44×44px. |
| F-9-1 — adjacent phone header targets touch | Fixed. Home, Demo, Privacy, Terms, and 404 each have a measured minimum 8px gap, 44px targets, and no overflow; the browser regression test covers every route. |
| Verification-1 lint/cache/headers | Fixed. Strict lint, immutable hashed assets, CSP, framing, permissions, referrer policy, and one-year HSTS all pass. |

## Evidence

Evidence is under `/work/.evidence/firebase-environment-doctor-verify-4/`:

- `npm-ci.log`, `npm-test.log`, and `quality-gates.log`;
- `claim-commands-summary.tsv` and one log per claim;
- `consumer-install.log` and `consumer-cli.log`;
- `verify-live.log`, `verify-url.log`, and `verify.json`;
- `live-browser-independent.log` and `live-interaction-links.log`;
- fresh phone and desktop screenshots; and
- `lighthouse-mobile.json`.

No product code was changed during verification. There are no known gaps or
required product changes.
