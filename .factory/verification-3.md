# Verification 3 — Check Firebase projects before risky commands

**Work order:** `firebase-environment-doctor-verify-3`  
**Verified:** 2026-09-06 UTC  
**Live URL:** <https://firebase-environment-doctor.sociobot.in>  
**Implementation candidate:** `f9f9247b4d903375d03fedb9d2ba711da007c531`  
**Documentation SHA:** `fc77f7fbaccf65f2c64e2799b361960ca7d3499d`

## Verdict

**PASS.** Finding count: **0**. Untested claim count: **0**.

The CLI, sample, static site, legal pages, and expected HTTP 404 work from a
clean checkout and on the live URL. All 26 declared claim commands pass
independently. No public claim is missing from the registry.

The documentation commit changes only `.factory/handoff.md` after the
implementation commit. `npm run verify:live` proved that the live HTML and
every built asset are byte-for-byte equal to the clean build of the candidate.

## Job, audience, and first action

I opened the live home page without prior storage in separate 390×844 phone
and 1440×1000 desktop contexts. I did not scroll before recording this:

- **Job:** Check a Firebase project before a deploy.
- **Audience:** Firebase developers who need to catch a wrong project,
  sign-in issue, emulator mismatch, or missing rules file before changing
  cloud data.
- **First action:** **Try sample project check.** The adjacent sentence says
  it shows a wrong-project result in the browser.

The three facts — **Runs locally by default**, **Hides credential values**, and
**Does not deploy** — fit in the first phone viewport. The final fact ends at
836.1px in the 844px viewport. The job, audience, action, and stated outcome
are also visible on desktop before scrolling.

## Clean checkout and package gates

I cloned `main` into `/tmp/firebase-doctor-verify3.oNfzcm/repo`. The clone was
clean at documentation SHA `fc77f7f`; its product implementation is
`f9f9247`. The environment had Node 22.23.2, npm 10.9.8, Rust 1.98.0, and
Cargo 1.98.0.

| Command | Result |
| --- | --- |
| `npm ci` | PASS; 25 packages installed and 0 vulnerabilities |
| `npm test` | PASS; strict Rust/TypeScript checks, 7 Rust tests, 6 site tests, browser/Axe checks, and 21 grouped claim tests |
| `npm run build` | PASS; produced `dist/bin/firebase-environment-doctor` and `dist/site/` |
| `cargo package --locked` | PASS; 29 files, 31.3 KiB compressed, verification build passed |
| `npm audit --audit-level=high` | PASS; 0 vulnerabilities |
| `npm run audit:copy` | PASS; 116 source-backed visible strings |
| `npm run verify:live` | PASS; routes, exact bytes, 404, metadata, privacy, phone layout, demo, and Axe |

The clean checkout remained unchanged after the build, tests, claims, and
package command.

## Declared claims

I executed the exact `test` value from every entry in
`.factory/claims.json`, one command at a time in the clean clone. Every command
exited 0 and made its observable assertions.

| Claim | Result | Coverage |
| --- | --- | --- |
| `local-check-no-network` | PASS | Complete |
| `local-check-runs-locally` | PASS | Complete |
| `credential-values-hidden` | PASS | Complete; text card and JSON, stdout and stderr |
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

I also cross-checked the live Home, Demo, Privacy, Terms, 404, footer, README,
and CLI help. Every statement a visitor could rely on maps to the registry.
There is no unlisted claim.

## Installed CLI and recovery paths

I installed the exact implementation into a new consumer root:

```sh
cargo install --git https://github.com/B-Divyesh/sf-firebase-environment-doctor.git \
  --rev f9f9247b4d903375d03fedb9d2ba711da007c531 --root <new-root> --locked
```

The installed `firebase-environment-doctor 0.1.0` passed:

- `--help`, `--version`, `--demo`, text cards, and parseable `--json`;
- normal local diagnosis with exit 0;
- a production-like wrong project with `--strict`, exit 1;
- emulator mismatch with `--strict`, exit 1;
- missing rules, exit 1;
- a missing root and an empty directory, exit 2;
- root discovery from a child directory, exit 0;
- recovery after adding the bundled project files, with parseable JSON;
- no-account, expired-sign-in, permission, and network classification in the
  clean claim fixtures; and
- the subprocess allow-list: local version lookup, then only
  `login:list --json` and `projects:list --json` in network mode.

The bundled CLI demo ran from an unrelated directory, created a newly named
directory under `/tmp`, and reported `sample-store-prod` against the project
file default `sample-store-dev`. It did not use the caller's project.

## One-click sample and data boundary

One click on the primary home action opened `/demo/?demo=1`. Its initial phone
viewport contained all of the useful populated result:

- `CAUTION · Wrong project selected`;
- selected project `sample-store-prod`;
- project-file default `sample-store-dev`; and
- the next check to confirm the project ID before a write or deploy.

The persistent banner says **Demo — sample data, nothing is saved** and exposes
**Reset demo** and **Start for real**. The only demo storage entry was
`demo:firebase-environment-doctor:reset=active`. I operated Reset with the
Space key; it removed the key and announced, “Demo reset. Sample project check
loaded.” Start for real returned home with empty local and session storage.
There were no cookies. All requests in the complete flow stayed on the product
origin. The rendered full transcript matched a fresh release `--demo` run.

## Live site, accessibility, privacy, and routes

- `/`, `/demo/`, `/privacy/`, `/terms/`, `/LICENSE.txt`, `robots.txt`, and
  `sitemap.xml` returned 200. All discovered internal links and the GitHub
  Source link resolved successfully.
- `/not-a-real-route` returned the expected HTTP 404 and a complete designed
  page. Its direct guidance says the address does not match a Firebase project
  check page. The removed paper/bench sentence is absent.
- Every product page has `lang="en"`, one h1, one main landmark, a unique
  plain title, canonical URL, description, Open Graph/Twitter data, favicon,
  Apple touch icon, shared navigation, legal links, product line, version, and
  factory credit.
- Fresh Axe scans reported **zero violations of any severity** on Home, Demo,
  Privacy, Terms, and the 404 at phone size. The product browser suite also
  passed desktop and phone Axe checks.
- Every rendered phone link and button on all five routes measured at least
  44×44 CSS pixels. The two former failures now measure: Demo **44×44** and
  Read the complete MIT License **298×44**.
- Keyboard checks passed for the skip link, Reset with Space, route links with
  Enter, focus handoff to each route h1, Back restoration, and polite route
  announcements. The skip-link focus outline is 3px with a 3px offset; dark
  terminal focus remains visible.
- Reduced-motion mode matched the media query, changed smooth scrolling to
  `auto`, and reduced the hero animation to 0.01ms. Nothing flashes or loops.
- At 200% text size, the desktop page retained all interactive elements and
  had no horizontal page overflow. The 390px pages also had no horizontal
  overflow.
- Home and demo requests were same-origin only. Fresh contexts had no cookies,
  analytics, advertising, third-party scripts, unexpected storage, or service
  worker registrations.
- The explicit light-only treatment is documented in `.factory/design.md`.
  Axe found no contrast violation. The original paper-cut illustration and
  locally hosted fonts match that product-specific design record.
- The URL verifier loaded the page in 621ms and found the correct title,
  language, one h1, main landmark, alt text, named buttons, and no unexpected
  console or page errors.

Chromium logs a failed-resource console line when the deliberately requested
document itself returns 404. That is the expected 404 status, not a broken
resource or product defect. No console error occurred on successful routes.

### Security and performance

HTTPS redirection is 301. Live responses include a same-origin CSP with
`frame-ancestors 'none'`, `X-Frame-Options: DENY`, restrictive
`Permissions-Policy`, `nosniff`, strict-origin referrer policy, and one-year
HSTS. HTML revalidates after 30 seconds; hashed assets use one-year immutable
caching.

Fresh Lighthouse 12.8.2 mobile results:

| Measure | Result |
| --- | ---: |
| Performance | 99 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| FCP | 1.05 s |
| LCP | 1.09 s |
| TBT | 112.5 ms |
| CLS | 0.00097 |
| Transfer | 101,799 B |

Built assets are 2.70 KB JavaScript, 14.53 KB CSS, 66.95 KB fonts, and 24.64
KB for the phone hero. All required budgets pass.

## Earlier finding disposition

I read reviews 1–8, both earlier independent verification reports, polish
reports 2–6, and the previous handoff. I rechecked their findings against the
candidate and live behavior.

| Earlier finding(s) | Current evidence |
| --- | --- |
| F-1-1, F-2-1, F-4-1, F-5-1 | Fixed. CLI and browser samples are real, separate, populated before scrolling, resettable, and transcript-matched. |
| F-1-2, F-2-2, F-3-2, F-6-1 | Fixed. All 26 reliance claims, including Terms, have one tagged test and an independently passing command. |
| F-8-1 | Fixed. `credential-values-hidden` now runs both text-card and JSON modes and rejects the sentinel/token field in stdout and stderr. |
| F-1-3, F-2-3, verification 2 auth | Fixed. Real-shaped no-account, expired-sign-in, permission, and network fixtures are classified separately without raw output. |
| F-1-4, F-2-4, F-5-2, F-1-9 | Fixed. The first view names the job, audience, result action, outcome, and three facts in plain words. |
| F-1-5, F-2-5, F-3-1, F-3-3, F-5-3 | Fixed. Direct routes, reload, history focus, announcements, metadata, literal 404 h1, recovery link, and expected 404 status pass. |
| F-1-6 | Fixed. Canonical, original share art, favicon, Apple touch icon, and complete Open Graph/Twitter metadata pass. |
| F-1-7, F-2-6, verification 2 focus/type | Fixed. Focus visibility, 16px phone content, target sizes, and shared shell pass. |
| F-8-2 | Fixed. All rendered phone links/buttons are measured on all five routes; minimum is 44×44. |
| F-1-8, F-5-4 | Fixed. Every route uses the shared shell with legal links, product line, version, and Param Factory credit. |
| F-4-2, F-5-5 | Fixed. The three-step workflow and reproducible copy audit pass. |
| F-8-3 | Fixed. The 404 uses direct page-address guidance; source and copy-audit tests reject the removed metaphor. |
| Verification 1 lint | Fixed. Strict Clippy passes in `npm test`. |
| Verification 1 cache/headers | Fixed. Live immutable caching, CSP, framing, permissions policy, and one-year HSTS pass. |

## Scope checks

This is a local CLI with a static documentation site. It has no backend,
tenant state, payment path, or shared database. Backend tenant isolation,
restart persistence, health endpoints, and HTTP 429/Retry-After therefore do
not apply. The site does not promise offline installation or update behavior;
there is no service worker. The tested local/no-network CLI promise is covered
by its own claim.

No AI, import, remote sync, or extra export feature is missing from the job.
The required diagnosis is deterministic and read-only, and JSON is already the
appropriate scripting output. A model call would weaken the stated privacy and
predictability without helping the brief.

## Evidence

Screenshots, the URL verifier output, and Lighthouse JSON are under
`/work/.evidence/firebase-environment-doctor-verify-3/`. This report is copied
to `/work/.evidence/qa-report.md`; `/work/.evidence/qa-result.json` records the
same PASS verdict, zero findings, zero untested claims, candidate SHA, live
URL, and repository report path.
