# Review 8 — Check Firebase projects before risky commands

**Work order:** `firebase-environment-doctor-review-8`

**Reviewed:** 2026-09-06 UTC

**Live URL:** <https://firebase-environment-doctor.sociobot.in>

**Implementation candidate:** `79f19a72f48cfa3e3ca223340cb88aa504e53dea`

**Documentation SHA:** `75bd3be6085c2c6b32245b943433c62f25d87051`

**Verdict:** **FAIL**

**Finding count:** **3**

**Untested claim count:** **1**

## Job, audience, and first action

I opened the live page without prior storage in separate 390×844 phone and
1440×1000 desktop browser contexts. I did not scroll before recording this:

- **Job:** Check the selected Firebase project, sign-in, emulator addresses,
  rules files, and Firebase CLI before a risky command.
- **Audience:** Firebase developers who need to catch a wrong project or local
  setup problem before changing cloud data.
- **First action:** **Try sample project check.** The next line says it shows a
  wrong-project result in the browser.

The first screen communicates all three points at both sizes. The three short
facts also fit in the first phone viewport. The visual design matches
`.factory/design.md` and does not look like a default framework page.

## Findings

### F-8-1 — HIGH — credential-card privacy is not covered by its claim test

The registered `credential-values-hidden` claim says, “Cards and JSON omit
credential values.” Its only tagged test runs the release CLI with `--json` and
asserts that a sentinel token is absent from JSON. It never runs or checks the
default text card. The claim command exits successfully, but it does not prove
the complete public claim.

I separately ran the installed CLI's text card against a fake Firebase command
that returned `TOP_SECRET_SENTINEL` in both account JSON and an authentication
error. The live behavior was safe: the sentinel did not appear. This manual
result does not replace the required repeatable claim test.

**Required change:** In the existing tagged test, run both default card output
and `--json` against the sentinel fixture. Assert that neither stdout nor
stderr contains the credential value or raw token field.

### F-8-2 — MINOR — two phone targets are smaller than 44×44 pixels

At 390px, every checked route renders the header **Demo** link at 40×44 CSS
pixels. On Terms, **Read the complete MIT License** renders at 290×20 pixels.
Both miss the attached accessibility and site-structure requirement that every
touch target be at least 44×44 pixels.

The current browser test checks the brand and footer links only. It therefore
misses these targets. This means the earlier narrow-target finding was not
fully closed, although its named brand and footer examples were fixed.

**Required change:** Give the Demo link a 44px minimum inline size and give the
inline license link a 44px-high clickable area. Test every visible link and
button at 390px, not a selected subset.

### F-8-3 — MINOR — the 404 page still uses metaphor copy

The designed 404 correctly returns HTTP 404 and has the clear h1, “This
Firebase check page was not found.” Its next sentence is “This paper slip is
not on the bench.” The plain-words contract forbids metaphor and requires every
sentence to carry useful product information. The copy audit currently labels
this sentence “Supporting visual copy,” so its automated audit does not catch
the contract failure.

**Required change:** Remove that sentence or replace it with a direct statement
about the invalid page address. Update the copy audit to reject metaphor-only
copy rather than marking it clear.

## One-click sample and data boundary

One click on the primary action opened `/demo/?demo=1`. The first 390×844
viewport showed all of the useful populated result:

- `CAUTION · Wrong project selected`
- selected project `sample-store-prod`
- project-file default `sample-store-dev`
- the next check to confirm the project ID before a write or deploy

The persistent banner says **Demo — sample data, nothing is saved** and keeps
**Reset demo** and **Start for real** visible. The only browser storage entry
was `demo:firebase-environment-doctor:reset`. Reset removed it. Start for real
returned to `/` with no local storage, session storage, or cookies. Every
observed request stayed on the product origin.

The installed `--demo` command ran from an unrelated empty directory. It made
a newly named directory under `/tmp`, diagnosed the bundled sample, and left
the current directory unchanged. Its JSON and card results identified the
production-like override and the different project-file default. No real
Firebase data was read or changed.

## Claims

I ran every `test` command in `.factory/claims.json` separately from the clean
candidate checkout. All 26 commands exited 0. Twenty-five claims have complete
observable coverage. `credential-values-hidden` is incomplete as described in
F-8-1, so the untested claim count is 1.

| Claim | Command result | Coverage result |
| --- | --- | --- |
| `local-check-no-network` | PASS | Complete |
| `local-check-runs-locally` | PASS | Complete |
| `credential-values-hidden` | PASS | **Incomplete: JSON only, not card** |
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

I cross-checked the live landing, Demo, Privacy, Terms, 404, footer, README, and
CLI help against the registry. I found no additional missing claim entry.

## Clean checkout and installed CLI

The candidate was checked out at
`/tmp/firebase-doctor-review8.vxRxRW/repo`. Documented prerequisites were
already available: Node 22.23.2, npm 10.9.8, Rust 1.98.0, and Cargo 1.98.0.

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 25 packages installed, 0 vulnerabilities |
| `npm test` | PASS; lint, 7 Rust integration tests, 6 site tests, browser/Axe, and 21 grouped claim tests |
| `npm run build` | PASS; created `dist/bin/` and `dist/site/` |
| `cargo package --locked` | PASS; 29 files, 30.8 KiB compressed |
| `npm run audit:copy` | PASS mechanically; 117 source-backed counts, but F-8-3 remains |
| `npm run verify:live` | PASS; live pages and assets match the candidate bytes |

I also ran the website's documented clean-consumer command:

```sh
cargo install --git https://github.com/B-Divyesh/sf-firebase-environment-doctor
```

It installed `firebase-environment-doctor 0.1.0` from documentation SHA
`75bd3be`. That SHA changes reports only after implementation candidate
`79f19a7`; the installed product code is the reviewed candidate.

The installed artifact passed `--help`, `--version`, `--demo`, and `--json` in
an isolated environment. A directory without Firebase files returned exit 2
with a direct error. Adding the bundled project recovered to a parseable
report. The suite also passed normal, warning, strict-warning, missing-rules,
invalid-root, child-root, wrong-project, emulator-mismatch, no-account,
expired-login, permission, and network-failure paths. Only the documented
read-only Firebase commands were observed.

## Live pages, accessibility, privacy, and performance

- `/`, `/demo/`, `/privacy/`, `/terms/`, and `/LICENSE.txt` returned 200.
  The GitHub Source link returned 200.
- `/not-a-real-route` returned the expected designed HTTP 404. The 404 status
  is not a defect; F-8-3 concerns one sentence on that page.
- Each page has its own title, one h1, `lang="en"`, a main landmark, canonical
  metadata, full Open Graph/Twitter data, a shared header/footer, and a way
  home.
- Home → Demo → Back moved focus to the destination h1 and updated the polite
  route announcement. Skip, copy, and reset controls worked with the keyboard.
- Full Axe scans found zero violations of any severity on all five pages at
  both 390×844 and 1440×1000. Manual target geometry found F-8-2, which Axe
  does not report.
- Focus indicators were visible on paper and terminal surfaces. Normal motion
  uses one 280ms entrance. Reduced motion changes it to 0.01ms and disables
  smooth scrolling.
- At desktop width, 200% text sizing caused no horizontal overflow and kept
  every link and button present.
- `verify-url.sh` passed: load 678ms, correct title/lang/h1/main/alt labels, and
  zero console errors.
- Mobile Lighthouse scored Performance 100, Accessibility 100, Best Practices
  100, and SEO 100. FCP was 1.20s, LCP 1.35s, TBT 0ms, and CLS 0.00097.
- Built assets were 2.70KB JavaScript, 14.40KB CSS, and 66.95KB fonts. The
  mobile hero was 24.64KB. These are within the product budgets.
- Browser requests were same-origin. No cookies, analytics, advertising,
  third-party scripts, or unexpected storage appeared.

No offline or update behavior is promised. This is a static documentation site
and local CLI, not a backend, so tenant isolation, server restart persistence,
health endpoints, SQLite, and HTTP 429 behavior do not apply.

## Earlier finding disposition

I read reviews 1–7, both independent verification reports, polish reports 2–6,
and the prior handoff. I then checked the current live behavior and candidate.

| Earlier finding(s) | Current disposition |
| --- | --- |
| F-1-1, F-2-1, F-4-1, F-5-1 | Fixed. CLI and browser samples are real, isolated, populated, immediate, resettable, and transcript-matched. |
| F-1-2, F-2-2, F-3-2, F-6-1 | The missing registry and Terms entry are fixed. F-8-1 identifies one remaining incomplete assertion inside a registered claim. |
| F-1-3, F-2-3; verification-2 auth | Fixed. No-account, expired sign-in, permission, and network errors are separated without exposing raw output. |
| F-1-4, F-2-4, F-5-2 | Fixed. The job, audience, first action, outcome, and three facts fit before scrolling. |
| F-1-5, F-2-5, F-3-1, F-3-3 | Fixed. Routes, titles, metadata, focus transfer, announcements, Back, reload, and the HTTP 404 work. |
| F-1-6 | Fixed. Canonical, favicon, Apple touch, Open Graph, and Twitter metadata are present. |
| F-1-7, F-2-6; verification-2 focus and type | Fixed for focus contrast, 16px phone copy, and the named brand/footer targets. F-8-2 proves the broader 44px target requirement is still incomplete. |
| F-1-8, F-5-4 | Fixed. All pages use the shared shell, legal links, product description, version, and factory credit. |
| F-1-9, F-4-2, F-5-5 | Sentence lengths, controls, terminology, workflow steps, and recorded counts are fixed. F-8-3 is the remaining plain-words exception. |
| F-5-3 | The literal 404 h1 is fixed. The supporting metaphor is separately reported as F-8-3. |
| Verification 1 lint | Fixed. Strict Clippy passes. |
| Verification 1 cache and headers | Fixed. Hashed assets are immutable; CSP, framing, permissions, and one-year HSTS headers pass live checks. |

## Missed leverage

No AI, import, export, or sync feature is missing from the researched job. This
tool's value is a deterministic, local, read-only diagnosis. JSON output is the
right integration surface. Adding a model call would weaken the privacy and
predictability requirements.

## Required result

**FAIL.** Three findings remain, including one incompletely tested public
claim. A later review may declare PASS only after all three are repaired,
deployed where applicable, and independently verified with zero findings and
zero untested claims.
