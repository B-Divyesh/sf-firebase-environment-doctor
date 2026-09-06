# Review 9 — Check Firebase projects before risky commands

**Work order:** `firebase-environment-doctor-review-9`

**Reviewed:** 2026-09-06 UTC

**Live URL:** <https://firebase-environment-doctor.sociobot.in>

**Implementation candidate:** `f9f9247b4d903375d03fedb9d2ba711da007c531`

**Documentation baseline:** `b68927837a048b8574852c488648095901ee8fe0`

## Verdict

**FAIL.** Finding count: **1**. Untested claim count: **0**.

The product job, CLI, sample, claim tests, privacy boundary, routes, and
accessibility checks work. One minor phone-header spacing defect remains. The
work order permits PASS only with zero findings, so the product does not pass
this review.

The documentation baseline changes only `.factory/handoff.md` and adds
`.factory/verification-3.md` after the implementation candidate. The live
site verifier proved that production HTML and assets match a clean build of
the implementation candidate.

## Job, audience, and first action

I opened the live home page in fresh 390×844 phone and 1440×1000 desktop
contexts. I recorded the first view before scrolling:

- **Job:** Check a Firebase project before a deploy.
- **Audience:** Firebase developers who need to catch a wrong project,
  sign-in issue, emulator mismatch, or missing rules file before changing
  cloud data.
- **First action:** **Try sample project check.** The adjacent sentence says
  it shows a wrong-project result in the browser.

The three facts — **Runs locally by default**, **Hides credential values**, and
**Does not deploy** — fit before scrolling at both sizes. On the phone, the
last fact ends at 836.08px in the 844px viewport. The page has a direct
job-naming title and no metaphor or mood heading.

## Finding

### F-9-1 — MINOR — two adjacent phone header targets have no space between them

At 390px, the **Firebase Environment Doctor home** target spans x=16–60 and
the **Demo** target spans x=60–104. Their clickable rectangles touch, leaving
a **0px gap**. The result is the same on Home, Demo, Privacy, Terms, and the
designed 404.

Both targets are 44×44px, so Axe and the existing target-size test pass. The
attached design contract has a separate requirement: adjacent targets must be
at least 8px apart. The navigation's internal links have an 8px gap, but the
header has no gap between the wordmark and the navigation container.

**Required change:** Preserve the 44×44px targets and add at least 8px between
the wordmark and Demo at 390px without horizontal overflow. Add a browser
assertion for the gap between adjacent header targets, not only target width
and height.

Evidence: `/work/.evidence/firebase-environment-doctor-review-9/mobile-target-gaps.txt`
and `home-phone.png`.

## One-click sample and data boundary

One click on the primary action opened `/demo/?demo=1`. Its first phone view
already showed:

- `CAUTION · Wrong project selected`;
- selected project `sample-store-prod`;
- project-file default `sample-store-dev`; and
- the next check to confirm the project ID before a write or deploy.

The banner says **Demo — sample data, nothing is saved** and exposes **Reset
demo** and **Start for real**. The only storage entry was
`demo:firebase-environment-doctor:reset=active`. Space activated Reset, removed
that entry, kept the sample label, and announced the reset. Reload restored
the bundled sample. Start for real returned home with empty local storage,
session storage, and cookies.

All 30 observed requests in the complete sample flow stayed on the product
origin. The static browser demo cannot read a visitor's Firebase files. The
installed `--demo` command ran from an unrelated empty directory, copied the
bundled sample to a new `/tmp/firebase-environment-doctor-demo-*` directory,
and did not inspect the caller's directory.

## Declared claims

I ran each exact `test` value from `.factory/claims.json` separately in the
clean clone. All commands exited 0. I also inspected the assertions for the
full public statement, including text-card and JSON credential redaction.

| Claim | Result | Coverage |
| --- | --- | --- |
| `local-check-no-network` | PASS | Complete |
| `local-check-runs-locally` | PASS | Complete |
| `credential-values-hidden` | PASS | Complete; card and JSON, stdout and stderr |
| `read-only-firebase-commands` | PASS | Complete |
| `never-deploys` | PASS | Complete |
| `cli-demo-isolated` | PASS | Complete |
| `browser-demo-isolated` | PASS | Complete |
| `browser-demo-local-requests` | PASS | Complete |
| `browser-demo-matches-cli` | PASS | Complete |
| `website-no-tracking` | PASS | Complete |
| `five-firebase-checks` | PASS | Complete |
| `project-input-boundaries` | PASS | Complete |
| `next-step-guidance` | PASS | Complete |
| `project-selection` | PASS | Complete |
| `local-sign-in-details` | PASS | Complete |
| `emulator-address-check` | PASS | Complete |
| `rules-file-check` | PASS | Complete |
| `firebase-cli-presence` | PASS | Complete |
| `project-access` | PASS | Complete |
| `json-output` | PASS | Complete |
| `project-root-discovery` | PASS | Complete |
| `exit-codes` | PASS | Complete |
| `network-account-and-project-access` | PASS | Complete |
| `network-failure-classification` | PASS | Complete |
| `build-artifacts` | PASS | Complete |
| `license-and-terms` | PASS | Complete |

**Claim total: 26/26 passed. Untested: 0.**

I cross-checked Home, Demo, Privacy, Terms, 404, the shared footer, README,
and CLI help. I found no unlisted public claim.

## Clean checkout and package gates

I cloned `main` from GitHub to
`/tmp/firebase-doctor-review9.tvWAc4/repo`. It was clean at documentation
baseline `b689278` and contained implementation `f9f9247`. The environment had
Node 22.23.2, npm 10.9.8, Rust 1.98.0, and Cargo 1.98.0.

| Command | Result |
| --- | --- |
| `npm ci` | PASS; 25 packages, 0 vulnerabilities |
| `npm test` | PASS; lint, Rust, site, browser/Axe, and grouped claims |
| `npm run build` | PASS; created `dist/bin/` and `dist/site/` |
| `cargo package --locked` | PASS; 29 files, 31.3 KiB compressed |
| `npm audit --audit-level=high` | PASS; 0 vulnerabilities |
| `npm run audit:copy` | PASS; 116 source-backed visible strings |
| 26 individual claim commands | PASS; 26/26 |
| `npm run verify:live` | PASS; live routes, bytes, demo, privacy, mobile, and Axe |

The clean checkout remained unchanged after all commands.

## Installed CLI and recovery paths

I installed the exact implementation into a new consumer root:

```sh
cargo install --git https://github.com/B-Divyesh/sf-firebase-environment-doctor.git \
  --rev f9f9247b4d903375d03fedb9d2ba711da007c531 --root <new-root> --locked
```

The installed `firebase-environment-doctor 0.1.0` passed `--help`, `--version`,
the isolated demo, normal JSON, and parseability checks. A wrong production
project and emulator mismatch returned 1 with `--strict`. Missing rules
returned 1. A missing root, unknown flag, and empty project returned 2. Adding
only config and rules remained blocked because project selection was still
missing. Adding `.firebaserc` completed recovery from a child directory and
returned parseable JSON with selected project `careful-app-dev` and exit 0.

The clean claim fixtures also exercised no-account, expired-sign-in,
permission, network-failure, command allow-list, redaction, and project-access
paths against the release binary.

## Live structure, accessibility, privacy, and performance

- Home, Demo, Privacy, Terms, License, robots, and sitemap returned 200.
  `/not-a-real-route` returned the expected designed HTTP 404.
- The expected 404 navigation produced one browser resource message. No 200
  route produced a console or page error.
- Every page has `lang="en"`, one h1, one main landmark, a unique title,
  description, canonical URL, full share metadata, shared header/footer, and
  a route back home.
- All seven distinct internal and external links resolved successfully.
- Fresh Playwright Axe scans found zero violations of any severity on Home,
  Demo, Privacy, Terms, and 404 at phone size.
- Every rendered link and button was at least 44×44px. F-9-1 concerns the
  separate 8px spacing rule.
- All 15 Home controls showed a designed focus outline. Skip navigation,
  Space activation, route-heading focus, polite announcements, and Back focus
  passed.
- Reduced motion matched, capped animation and transition durations at
  0.01ms, and changed smooth scrolling to `auto`.
- A 720 CSS-pixel layout at device scale factor 2, equivalent to 200% on a
  1440px display, kept the h1 and all controls present without horizontal
  overflow.
- Browser requests were same-origin. No cookies, analytics, advertising,
  third-party scripts, or service workers appeared.
- Response headers include same-origin CSP, `frame-ancestors 'none'`, HSTS,
  frame denial, permissions policy, no-sniff, and strict-origin referrer
  policy. Hashed assets use one-year immutable caching.
- Built assets were 2.70KB JavaScript, 14.53KB CSS, 66.95KB fonts, and a
  24.64KB phone hero image.
- Fresh mobile Lighthouse scored Performance **100**, Accessibility **100**,
  Best Practices **100**, and SEO **100**. FCP was 1.20s, LCP 1.35s, TBT 0ms,
  CLS 0.00097, and total transfer was 101,784 bytes.
- The factory URL verifier loaded the page in 604ms with no errors and found
  the title, language, h1, main landmark, image alt text, and named buttons.

No offline or update behavior is promised. This is a static site and local
CLI, so backend tenant isolation, restart persistence, SQLite, health, and
HTTP 429 checks do not apply. The researched job does not benefit from an AI
step; deterministic local diagnosis and JSON output are the useful surfaces.

## Earlier finding disposition

I read reviews 1–8, verification reports 1–3, polish reports 2–6, and the prior
handoff. I checked each current disposition against the clean candidate and
live site.

| Earlier finding(s) | Current disposition |
| --- | --- |
| F-1-1, F-2-1, F-4-1, F-5-1 | Fixed. CLI and browser samples are isolated, populated before scrolling, resettable, and transcript-matched. |
| F-1-2, F-2-2, F-3-2, F-6-1 | Fixed. All 26 public claims, including Terms, have one tagged test and a passing command. |
| F-1-3, F-2-3, verification 2 auth | Fixed. No-account, expired-sign-in, permission, and network failures are separate and redact raw output. |
| F-1-4, F-2-4, F-5-2, F-1-9 | Fixed. Job, audience, first result action, three phone facts, and plain copy pass. |
| F-1-5, F-2-5, F-3-1, F-3-3 | Fixed. Direct routes, titles, metadata, reload, focus, announcement, Back, and HTTP 404 pass. |
| F-1-6 | Fixed. Canonical, original share image, favicon, Apple touch icon, and Open Graph/Twitter fields pass. |
| F-1-7, F-2-6, verification 2 focus/type | Fixed. Focus contrast, phone text size, 44×44 targets, and common shell pass. F-9-1 is a new adjacent-spacing issue. |
| F-1-8, F-5-4 | Fixed. Every route has the shared shell, legal links, product line, version, and factory credit. |
| F-4-2, F-5-5 | Fixed. The three-step workflow and executable copy-count audit pass. |
| F-5-3, F-8-3 | Fixed. The 404 h1 and supporting sentence give direct page-address guidance without metaphor copy. |
| F-8-1 | Fixed. The credential claim tests card and JSON output, stdout and stderr, against a sentinel. |
| F-8-2 | Fixed as reported. Demo and Terms License targets are at least 44×44px, and every route passes the target-size test. F-9-1 concerns space between two valid-size targets. |
| Verification 1 lint/cache/headers | Fixed. Strict lint, immutable asset caching, CSP, framing, permissions, referrer, and HSTS checks pass. |

## Evidence

Evidence is under `/work/.evidence/firebase-environment-doctor-review-9/`:

- `claim-matrix.txt` — all 26 commands run separately;
- `npm-test.txt`, `npm-build.txt`, `cargo-package.txt`, and `verify-live.txt`;
- `consumer-install.txt`, `consumer-matrix.txt`, and `consumer-recovery.txt`;
- `live-browser.txt`, `mobile-target-gaps.txt`, and fresh screenshots;
- `verify-url.txt`, `lighthouse.json`, and `lighthouse-summary.txt`.

No product code was changed during this review.

## Required result

**FAIL — 1 finding, 0 untested claims.**
