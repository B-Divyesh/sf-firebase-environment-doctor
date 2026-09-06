# Review 10 — Check Firebase projects before risky commands

**Work order:** `firebase-environment-doctor-review-10`  
**Reviewed:** 2026-09-06 UTC  
**Live URL:** <https://firebase-environment-doctor.sociobot.in>  
**Implementation candidate:** `40bcb6cc3f718a4d00ba6ef21c960ae0485c8dac`  
**Documentation baseline:** `e98a97e44880a07398891ac303d70ba94a924dbd`

## Verdict

**PASS — 0 findings, 0 untested claims.**

The installed CLI, one-click sample, static site, privacy boundary, legal
pages, and expected HTTP 404 work from a clean checkout and on the live URL.
All 26 declared claim commands passed separately. No false, incomplete,
missing, or unlisted public claim was found.

The commits after the implementation candidate change only
`.factory/handoff.md` and add `.factory/verification-4.md`. A fresh
`npm run verify:live` proved that production HTML and every deployed asset are
byte-for-byte equal to a clean build of `40bcb6c`.

I read the full repository QA report at `.factory/verification-4.md`. The
work-order's separate `factory-evidence/firebase-environment-doctor-verify-4/qa-report.md`
path was not mounted in this worker at its repository, `/work`, root, or
`/work/.evidence` locations. The repository report contains the complete
verification result summarized in the work order.

## Job, audience, and first action

I opened production without prior site storage in separate 390×844 phone and
1440×1000 desktop contexts. Before scrolling, both showed:

- **Job:** Check a Firebase project before a deploy.
- **Audience:** Firebase developers who need to catch wrong projects, sign-in
  issues, emulator mismatches, or missing rules files before changing cloud
  data.
- **First action:** **Try sample project check.** The adjacent sentence says it
  shows a wrong-project result in the browser.

The phone also showed all three facts before the 844px fold: **Runs locally by
default**, **Hides credential values**, and **Does not deploy**. The last fact
ended at 836.08px. The title names the job, and the page uses plain section
headings rather than metaphor or mood copy.

## One-click sample and data boundary

The primary action opened `/demo/?demo=1` in one click. Without scrolling, the
phone showed:

- `CAUTION · Wrong project selected`;
- selected project `sample-store-prod`;
- project-file default `sample-store-dev`; and
- the next check to confirm the project ID before any write or deploy.

The full transcript also showed both emulator rows, the real rules hash, all
three warnings, and all next checks produced by the release CLI. The persistent
banner said **Demo — sample data, nothing is saved** and provided **Reset demo**
and **Start for real**.

The sample label survived reload. Reset removed only
`demo:firebase-environment-doctor:reset`; separately inserted real-mode local
and session values remained unchanged. Start for real removed demo state,
returned home, and still did not alter those real-mode values. No cookie was
created. Every observed request stayed on the product origin. The browser
sample is bundled static data and cannot read a visitor's Firebase project.

The installed `--demo` command ran from an unrelated directory with no
Firebase CLI on `PATH`. It created and printed a new
`/tmp/firebase-environment-doctor-demo-*` directory, diagnosed the same
wrong-project sample, and left the shipped example and caller directory
unchanged.

## Declared claims

I inspected the assertions and ran the exact `test` value from every entry in
`.factory/claims.json` separately in the clean candidate checkout.

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

I cross-checked Home, Demo, Privacy, Terms, the 404, the shared footer, README,
and installed CLI help against the registry. The credential test checks both
text-card and JSON output, stdout and stderr, using a secret sentinel. The
subprocess test covers local and network command allow-lists. No additional
public reliance claim was found.

## Clean checkout and package gates

I cloned the repository without local-link optimization, detached at the exact
implementation SHA in `/tmp/firebase-environment-doctor-review-10.fSCjRg/repo`,
and used Node 22.23.2, npm 10.9.8, Rust 1.98.0, and Cargo 1.98.0.

| Command | Result |
| --- | --- |
| `npm ci` | PASS; 25 packages installed, 0 vulnerabilities |
| `npm test` | PASS; strict Rust/TypeScript lint, 7 Rust tests, 6 site tests, browser/Axe checks, and 21 grouped claim tests |
| `npm run build` | PASS; created `dist/bin/` and `dist/site/` |
| `cargo package --locked` | PASS; 29 files, 31.3 KiB compressed, package verification build passed |
| `npm audit --audit-level=high` | PASS; 0 vulnerabilities |
| `npm run audit:copy` | PASS; 116 source-backed visible strings |
| `npm run verify:live` | PASS; exact bytes, routes, headers, sample, privacy, mobile geometry, and Axe |

The clean checkout remained unchanged after all commands. Built assets were
2.70 KB JavaScript, 14.56 KB CSS, 66.95 KB fonts, and a 24.64 KB phone hero
image, within the declared budgets.

## Installed CLI and recovery paths

I installed the directory produced by `cargo package --locked` into a new
consumer root. The installed `firebase-environment-doctor 0.1.0` passed:

- helpful `--help` and `--version` output;
- the isolated `--demo` path with no Firebase CLI available;
- invalid missing-root handling with exit 2;
- recovery from that error to parseable JSON from a nested project directory;
- normal local output with selected `sample-store-dev` and exit 0; and
- a production-like override with `--strict`, three warnings, and exit 1.

The clean claim fixtures additionally exercised missing rules, emulator
mismatch, project precedence and aliases, no account, expired sign-in,
permission failure, network failure, credential redaction, and the exact
read-only Firebase subprocess allow-list.

## Live site, accessibility, privacy, and performance

- Home, Demo, Privacy, Terms, License, robots, sitemap, site assets, and the
  GitHub Source destination returned successful responses.
- A deliberate unknown URL returned HTTP 404 with the designed page, one h1,
  the common shell, direct missing-page wording, and a route home. Its expected
  failed-document console message is not a defect; successful routes had no
  console or page errors.
- Every route has `lang="en"`, one h1, one main, a unique route title,
  description, canonical, full Open Graph/Twitter data, favicon, Apple-touch
  icon, header, footer, legal links, product line, version, and factory credit.
- Fresh Playwright Axe scans found zero violations of every severity on Home,
  Demo, Privacy, Terms, and the designed 404.
- Every visible phone link and button on all five routes measured at least
  44×44 CSS pixels. Adjacent phone header targets had at least an 8px gap on
  every route; the measured minimum was exactly 8px.
- Keyboard traversal, skip navigation, Enter and Space activation, visible
  focus, route-h1 focus, polite announcements, and Back focus restoration
  passed. The focused primary action has a clearly visible ink-and-paper ring.
- At 200% text size, the h1 and main remained visible without horizontal
  overflow. Reduced-motion mode disables smooth scrolling, caps transitions
  and animation at 0.01ms, and leaves no loop or flash.
- Browser requests stayed same-origin. There were no cookies, analytics, ads,
  third-party scripts, or service workers.
- Response policy passed CSP, framing denial, HSTS, permissions policy,
  no-sniff, referrer policy, and immutable caching checks.
- The factory URL verifier loaded Home in 879ms with no console errors and
  confirmed title, language, one h1, main, image alternatives, and named
  buttons.
- Fresh mobile Lighthouse scored Performance **100**, Accessibility **100**,
  Best Practices **100**, and SEO **100**. FCP was 1,202ms, LCP 1,352ms, TBT
  0ms, CLS 0.00097, and total transfer 101,811 bytes.

No offline or update behavior is promised. This is a local CLI with a static
site, not a backend, so tenant isolation, restart persistence, SQLite, health,
and HTTP 429/Retry-After checks do not apply. No AI, import, remote sync, or
additional export feature is missing from the researched job. Deterministic
local diagnosis and JSON are the appropriate surfaces.

## Earlier finding disposition

I read reviews 1–9, verification reports 1–4, polish reports 2–6, and the prior
handoff. I checked every disposition against the clean candidate and live
production.

| Earlier finding(s) | Current disposition |
| --- | --- |
| F-1-1, F-2-1, F-4-1, F-5-1 — missing, incomplete, late, or edited sample | Fixed. Browser and installed CLI samples are isolated, immediate, complete, resettable, and transcript-matched. |
| F-1-2, F-2-2, F-3-2, F-6-1 — absent or incomplete claim coverage | Fixed. All 26 public claims, including Terms, have one complete tagged test and passed separately. |
| F-1-3, F-2-3, verification-2 auth — false credential classification | Fixed. No-account, expired-sign-in, permission, and network failures are distinct and raw output is redacted. |
| F-1-4, F-2-4, F-1-9, F-5-2 — unclear first screen, copy, or clipped fact | Fixed. Job, audience, action, outcome, and three facts fit before scrolling; the executable copy audit passes. |
| F-1-5, F-2-5, F-3-1 — missing routes, 404, or focus behavior | Fixed. Direct routes, reload, expected HTTP 404, h1 focus, announcement, and Back restoration pass. |
| F-1-6, F-3-3 — incomplete canonical/share metadata | Fixed. Every route has complete canonical, Open Graph, Twitter, favicon, Apple-touch, and original share-art metadata. |
| F-1-7, F-2-6, verification-2 focus/type/target findings | Fixed. Focus contrast, mobile type, 44px targets, reduced motion, and the common shell pass. |
| F-1-8, F-5-4 — incomplete legal shell/footer | Fixed. Every route has the common shell, legal links, product line, version, and factory credit. |
| F-4-2 — missing three-step workflow | Fixed. Three verb-led steps show the local command, result, and optional network check. |
| F-5-3, F-8-3 — unclear or metaphorical 404 copy | Fixed. The h1 and explanation directly identify the missing Firebase check page. |
| F-5-5 — incorrect copy-audit counts | Fixed. The executable 116-string audit passes. |
| F-8-1 — incomplete credential-redaction assertion | Fixed. Text and JSON stdout/stderr are tested with a secret sentinel. |
| F-8-2 — undersized Demo and License targets | Fixed. Every route has zero rendered phone targets below 44×44px. |
| F-9-1 — adjacent phone header targets touch | Fixed. Home, Demo, Privacy, Terms, and 404 each have a measured minimum 8px gap, 44px targets, and no overflow; the browser regression covers every route. |
| Verification-1 lint/cache/headers | Fixed. Strict lint, immutable hashed assets, CSP, framing, permissions, referrer policy, and one-year HSTS pass. |

## Evidence

Fresh browser and performance evidence is under
`/work/.evidence/firebase-environment-doctor-review-10/`, including phone and
desktop screenshots, demo and focus screenshots, the live browser result,
header spacing measurements, URL-verifier output, and two Lighthouse JSON
reports. Clean-checkout, claim, package, and installed-consumer results are
recorded above.

No product code was changed during this review. There are no known gaps or
required product changes.
