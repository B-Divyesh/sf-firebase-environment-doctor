# Adversarial first-read review 3 — Firebase Environment Doctor

**Work order:** `firebase-environment-doctor-review-3`  
**Reviewed:** 2026-08-28 UTC  
**Live URL:** https://firebase-environment-doctor.sociobot.in  
**Verdict:** **FAIL**

## Cold first read

I opened `/` without prior storage in separate Playwright contexts at 390×844
and 1440×1000, before scrolling. On both screens I can answer all three first
read questions:

- It checks a Firebase project before a deploy.
- It is for Firebase developers who need to catch a wrong project, sign-in,
  emulator, or rules-file problem before changing cloud data.
- Click **“Try sample project check”** first; it says it will show a
  wrong-project result in the browser.

The headline is eight words, the audience sentence is 18 words, and the sample
action is visibly primary. This repairs the previous cold-read failure. The
paper-cut inspection-bench art is distinct and does not look like a generic
SaaS template.

## Findings

### F-3-1 — BLOCKING — route changes do not move keyboard focus to the new h1

**Earlier findings:** F-1-5 / F-2-5; partially fixed.

**Location / evidence:** On the live home page, I activated the header
**“Demo”** link with Playwright, waited for `/demo/`, and inspected
`document.activeElement`. It was `<body>`, not
`<h1 id="demo-title">See a wrong Firebase project before a deploy.</h1>`.
Browser Back likewise left focus on `<body>` on the home page. The polite
announcement does update to “Demo page loaded.”

The deployed source explains the failure: `site/src/main.ts` calls
`document.querySelector('main h1')?.focus()`, but every page's h1 lacks
`tabindex="-1"`, so it cannot receive programmatic focus. This means the
history key is consumed with no focus handoff.

**Why it fails:** Keyboard and screen-reader visitors who change pages are not
placed at the newly loaded page heading. This is specifically required for
deep links, Back/Forward, and route changes; an announcement alone does not
repair the lost reading position.

**Concrete fix:** Give each route h1 `tabindex="-1"` (or focus the already
focusable `main` and make that the documented target), retain the polite
announcement, and add a browser regression test that follows Home → Demo →
Back and asserts `document.activeElement === document.querySelector('h1')` on
each destination.

### F-3-2 — BLOCKING — the claims registry still omits visitor-facing claims

**Earlier findings:** F-1-2 / F-2-2; partially fixed.

**Location / evidence:** `.factory/claims.json` contains six testable claims:
local no-network, credential-value suppression, read-only network commands,
CLI-demo isolation, browser-demo isolation, and same-origin browser-demo
requests. The clean clone passes each listed command, but the following live
landing and README statements still make relied-on functional or safety claims
without a matching registry entry. The table lists each exact claim-like
sentence or label and the required concrete resolution.

| Location | Exact text | Required fix |
| --- | --- | --- |
| Landing trust line | “Runs locally by default” | Add `local-check-runs-locally` with a clean-fixture test showing no project data/network use, or remove it. |
| Landing trust line | “Does not deploy” | Add `never-deploys` with a subprocess allow-list test covering both local and `--network` paths, or remove it. |
| Landing checks | “Check five Firebase settings.” | Add a fixture test asserting the five named check categories and observable results, or use “The sample shows five checks.” |
| Landing checks | “The tool reads your project files and Firebase CLI results.” | Add a local/opt-in input-boundary claim test, or replace with “The sample shows project-file and Firebase CLI results.” |
| Landing checks | “It tells you what to check next.” | Add a test asserting a next-step message for each shipped fixture, or remove it. |
| Landing project card | “Finds the project chosen by your command, environment, or project file.” | Add `project-selection` with precedence fixtures, or shorten to “Shows the selected project.” |
| Landing sign-in card | “Checks local sign-in details. With `--network`, it checks Firebase access.” | Add explicit local-marker and network-access claims/tests, or use “The optional check can show Firebase access.” |
| Landing emulator card | “Compares emulator addresses with `firebase.json`.” | Add `emulator-address-check` against the demo fixture, or remove the sentence. |
| Landing rules card | “Checks that configured rules files exist.” | Add `rules-file-check` with present/missing fixtures, or remove the sentence. |
| Landing CLI card | “Checks Firebase is installed. With `--network`, it checks project access.” | Add separate CLI-presence and project-access claims/tests, or remove the sentence. |
| Landing exit codes | “Ready to inspect.” / “Problem found; `--strict` also fails on warnings.” / “Invalid command or unreadable input.” | Add an `exit-codes` claim with ready, warning, and invalid-input assertions, or label these as examples rather than promised outcomes. |
| README opening | “It checks the active project, sign-in details, emulators, and rules files.” | Register the four corresponding product checks above; do not leave this umbrella promise unlisted. |
| README exit codes | “Exit code `0` means the check is ready.” / “Exit code `1` means a problem was found.” / “`--strict` also returns `1` for warnings.” / “Exit code `2` means the command or input was invalid.” | Register and test the exact exit-code contract. |
| README network section | “The project check requires a listed Firebase account and checks project access.” | Add `network-account-and-project-access` with listed-account, no-account, permission, and unreachable fixtures. |
| README network section | “It reports sign-in, permission, and network failures separately.” | Add a classification claim with one observable fixture per category. |

**Why it fails:** The current registry proves several important boundaries, but
not all promises a developer is asked to rely on. A passing generic test suite
is not a substitute for one tagged clean-sandbox test per retained claim.

**Concrete fix:** Either add the named entries and tests above (each tagged
`@claim:<id>` and runnable from the demo/fixture entry point), or remove/recast
each listed statement as a non-promissory sample description. Update
`.factory/claims.json` so its `where` fields name these locations.

### F-3-3 — MINOR — three routes have incomplete Twitter metadata

**Earlier findings:** F-1-6 / F-2-5; partially fixed.

**Location / evidence:** Live metadata crawl found complete canonical, OG,
favicon, and Apple-touch metadata on all tested routes. Home and Demo also
have all four Twitter fields. `/privacy/` and `/terms/` omit
`twitter:image`. The live designed 404 at `/not-a-real-route` omits
`og:url`, `twitter:title`, `twitter:description`, and `twitter:image`.

**Why it fails:** These routes do not meet the stated per-route OG/Twitter
card requirement. A shared 1200×630 product image is already available, so
these are incomplete rather than unavailable metadata.

**Concrete fix:** Add the existing
`https://firebase-environment-doctor.sociobot.in/assets/doctor-share-1200-3f5aa21c.webp`
as `twitter:image` on Privacy and Terms. Add the missing 404 OG URL and
Twitter title, description, and image fields; extend the static metadata test
to require all fields on every HTML route.

## Claim tests and sandbox behaviour

I cloned the repository into
`/tmp/firebase-doctor-review3.HQ065c/repo`, then ran the registry commands
from that clean clone. `npm ci`, `npm test`, and `npm run build` completed
before the individual claim commands.

| Registry id | Result |
| --- | --- |
| `local-check-no-network` | PASS |
| `credential-values-hidden` | PASS |
| `read-only-firebase-commands` | PASS |
| `cli-demo-isolated` | PASS |
| `browser-demo-isolated` | PASS |
| `browser-demo-local-requests` | PASS |

I also ran the built binary from an unrelated temporary working directory.
`firebase-environment-doctor --demo` reported a new directory such as
`/tmp/firebase-environment-doctor-demo-4509-1787920595687988296`, not the
working directory, then reported the realistic `sample-store-prod` versus
`sample-store-dev` mismatch.

In a fresh 390px browser context, `/demo/?demo=1` immediately displayed that
wrong-project output, the persistent **“Demo — sample data, nothing is saved”**
banner, **Reset demo**, and **Start for real**. The only initial browser key
was `demo:firebase-environment-doctor:reset`; Reset removed it, Start for real
returned to `/` with no key, no cookies, and no session storage. Full-flow
request interception observed only
`https://firebase-environment-doctor.sociobot.in`; no third-party request was
made. No browser offline promise is made, so an offline reload is not asserted
as a product claim.

## Earlier-review verification

I read `review-1.md`, `review-2.md`, `polish-2.md`, both verification reports,
the prior handoff, and the current demo/design/copy/claims records. I checked
the repaired areas against live production and current source.

| Earlier finding | Current verification |
| --- | --- |
| F-1-1 / F-2-1 — real isolated demo | Fixed: live `/demo/?demo=1`, banner/reset/exit, `demo:` key, shipped `--demo`, temp-dir run, and claim tests all work. |
| F-1-2 / F-2-2 — claims | Partially fixed; six claims pass, but F-3-2 reissues the remaining unlisted promises. |
| F-1-3 / F-2-3 — credential classification | Fixed in current code/tests: non-empty account is required and the former expired-login demo text is absent. |
| F-1-4 / F-2-4 — cold first read and copy | Fixed for the first screen: job, audience, primary sample action, and outcome are clear. The remaining copy issues are limited to F-3-2's unlisted claims and the terminology note below. |
| F-1-5 / F-2-5 — real demo/404/routes | Real URLs, reloads, `/demo`, sitemap, titled 404, and route announcements work. Focus handoff is not actually fixed; see F-3-1. |
| F-1-6 / F-2-5 — metadata | Mostly fixed; see F-3-3 for the remaining route fields. |
| F-1-7 / F-2-6 — dark focus, mobile type, targets | Fixed: command focus is paper-coloured on the dark panel; relevant 390px text computes to 16px; brand/footer links are at least 44px high and 44px minimum width. |
| F-1-8 / F-2-6 — shared legal shell | Fixed: all routes have the same header/footer, Privacy/Terms, Param Factory attribution, and version. |
| F-1-9 / F-2-4 — jargon/contextless copy | Fixed for removed slogans, headings, CTA wording, and word limit. No banned marketing adjectives remain. |

No runtime AI feature, provider key, import/export, or sync is expected by the
available brief material (the researched `.factory/brief.json` is absent). An
AI feature would be decorative for this local diagnostic CLI, so no missed-AI
finding is raised.

## Structure and accessibility checks

The live crawl confirmed 200 responses for Home, Demo, Privacy, Terms, robots,
and sitemap; the deliberate unknown route returns a designed HTTP 404. All
rendered internal and GitHub source links returned 200 (hash links excluded as
in-page navigation). Each route has one h1, a main landmark, `lang="en"`, a
description, canonical, favicon, Apple-touch icon, security headers, and no
console errors. The 390px page has no horizontal overflow. The header/footer
are consistent. The remaining structure defects are F-3-1 and F-3-3.

## Copy audit

Counts use whitespace-separated words. Literal terminal output, literal shell
commands, option tokens, and the decorative check-mark icon are excluded; all
visitor-facing prose, headings, labels, controls, and README prose are listed.
`F-3-2` identifies every row marked **claim**. No row exceeds 22 words and no
banned marketing adjective appears.

### Landing page

| Text | Words | Audit |
| --- | ---: | --- |
| Skip to content | 3 | Clear link |
| Firebase Environment Doctor | 3 | Product name |
| Demo | 1 | Clear nav link |
| What it checks | 4 | Clear heading/link |
| Install | 1 | Clear nav link |
| Privacy | 1 | Clear nav link |
| Firebase project check | 3 | Clear label |
| Check your Firebase project before a deploy. | 8 | Clear h1 |
| For Firebase developers who need to catch a wrong project, login, emulator, or rules file before changing cloud data. | 18 | Clear audience; **terminology:** use “sign-in” and “rules files” to match the rest of the site. |
| Try sample project check | 4 | Result-naming primary action |
| Shows a wrong-project result in this browser. | 7 | Clear outcome |
| Install the CLI | 3 | Clear secondary action |
| Runs locally by default | 4 | **Claim — F-3-2** |
| Hides credential values | 3 | Covered by `credential-values-hidden` |
| Does not deploy | 3 | **Claim — F-3-2** |
| Check before changing cloud data. | 6 | Clear image caption |
| Your files stay on your computer | 6 | Clear heading |
| The default check reads project files without a network request. | 10 | Covered by `local-check-no-network` |
| Cloud check only when you ask | 6 | Clear heading |
| `--network` runs read-only Firebase account and project checks. | 7 | Covered by `read-only-firebase-commands` |
| Reports hide credentials | 3 | Clear heading |
| Cards and JSON omit credential values. | 6 | Covered by `credential-values-hidden` |
| Check five Firebase settings. | 5 | **Claim — F-3-2** |
| The tool reads your project files and Firebase CLI results. | 10 | **Claim — F-3-2** |
| It tells you what to check next. | 7 | **Claim — F-3-2** |
| Selected project | 2 | Clear h3 |
| Finds the project chosen by your command, environment, or project file. | 10 | **Claim — F-3-2** |
| Firebase access | 2 | Clear h3 |
| Checks local sign-in details. With `--network`, it checks Firebase access. | 10 | **Claim — F-3-2** |
| Addresses | 1 | Clear only with the preceding emulator label; rewrite heading to “Emulator addresses”. |
| Compares emulator addresses with `firebase.json`. | 5 | **Claim — F-3-2** |
| Rules files | 2 | Clear h3 |
| Checks that configured rules files exist. | 6 | **Claim — F-3-2** |
| Local tool | 2 | Context-light; rewrite heading to “Firebase CLI installed”. |
| Checks Firebase is installed. With `--network`, it checks project access. | 9 | **Claim — F-3-2** |
| Install the Firebase project check. | 5 | Clear h2 |
| Build it from this project source, then run it from a Firebase project directory. | 14 | Clear instruction |
| Copy install command | 3 | Result-naming button |
| Use `--json` for scripts. | 4 | Clear instruction |
| Use `--network` to check Firebase access. | 6 | Covered by `read-only-firebase-commands` |
| Use `--demo` for the bundled sample. | 6 | Covered by `cli-demo-isolated` |
| Ready to inspect. | 3 | **Claim — F-3-2** (exit-code outcome) |
| Problem found; `--strict` also fails on warnings. | 6 | **Claim — F-3-2** (exit-code outcome) |
| Invalid command or unreadable input. | 5 | **Claim — F-3-2** (exit-code outcome) |
| Firebase Environment Doctor · MIT · v0.1.0 | 5 | Product/version line |
| Source | 1 | Clear link |
| opens GitHub | 2 | Clear external-link notice |
| Terms | 1 | Clear link |
| Built by Param Factory | 4 | Clear attribution |

### README

| Text | Words | Audit |
| --- | ---: | --- |
| Firebase Environment Doctor | 3 | Product name |
| A Firebase project check for developers. | 6 | Clear introduction |
| Check your Firebase project before a risky command. | 8 | Clear instruction |
| It checks the active project, sign-in details, emulators, and rules files. | 10 | **Claim — F-3-2** |
| The default check reads project files without a network request. | 10 | Covered by `local-check-no-network` |
| With `--network`, it runs only read-only Firebase commands. | 8 | Covered by `read-only-firebase-commands` |
| Reports hide credential values. | 4 | Covered by `credential-values-hidden` |
| Install | 1 | Clear heading |
| Build from this source: | 4 | Clear instruction |
| Usage | 1 | Clear heading |
| Run from a Firebase project directory or one of its subdirectories: | 10 | Clear instruction |
| Use `--network` only when you want Firebase access checked: | 9 | Covered by `read-only-firebase-commands` |
| Use JSON output in scripts: | 5 | Clear instruction |
| Useful options: | 2 | Clear heading |
| Override project selection without changing files | 6 | **Claim — F-3-2** (option outcome) |
| Check Firebase access with read-only commands | 6 | Covered by `read-only-firebase-commands` |
| Print JSON for scripts | 4 | **Claim — F-3-2** (output outcome) |
| Disable color and interactive behavior | 5 | **Claim — F-3-2** (option outcome) |
| Exit with failure when warnings appear | 6 | **Claim — F-3-2** (exit-code outcome) |
| Diagnose a specific directory | 4 | **Claim — F-3-2** (option outcome) |
| Run the bundled sample project check | 6 | Covered by `cli-demo-isolated` |
| Exit code `0` means the check is ready. | 8 | **Claim — F-3-2** |
| Exit code `1` means a problem was found. | 8 | **Claim — F-3-2** |
| `--strict` also returns `1` for warnings. | 5 | **Claim — F-3-2** |
| Exit code `2` means the command or input was invalid. | 10 | **Claim — F-3-2** |
| Try the sample | 3 | Clear heading |
| Run the same sample shown on the website: | 8 | Clear instruction |
| The command copies the bundled project to a new temporary directory and prints that directory. | 14 | Covered by `cli-demo-isolated` |
| The sample selects `sample-store-prod` while its project file defaults to `sample-store-dev`. | 8 | Covered by the shipped CLI-demo fixture; add this sample-result assertion to that claim's stated scope. |
| What network mode runs | 5 | Clear heading |
| With `--network`, the tool runs these read-only Firebase commands: | 9 | Covered by `read-only-firebase-commands` |
| The project check requires a listed Firebase account and checks project access. | 11 | **Claim — F-3-2** |
| It reports sign-in, permission, and network failures separately. | 8 | **Claim — F-3-2** |
| Website demo and privacy | 4 | Clear heading |
| The website demo uses bundled sample data. | 7 | Covered by `browser-demo-isolated` |
| Reset removes its demo-only browser state. | 6 | Covered by `browser-demo-isolated` |
| The demo sends requests only to this site. | 8 | Covered by `browser-demo-local-requests` |
| See the live privacy page. | 5 | Clear link |
| Develop, test, and package | 4 | Clear heading |
| Requirements: Rust 1.85+ and Node.js 20+. | 5 | Clear requirement |
| `npm run build` writes the CLI to `dist/bin/` and the static site to `dist/site/`. | 13 | Contributor/build assertion; add a build-artifact test or move to contributor documentation. |
| The factory publishes the package; do not publish from this checkout. | 11 | Internal deployment instruction; move to `CONTRIBUTING`/factory handoff. |
| License | 1 | Clear heading |
| MIT. | 1 | Clear |
| See LICENSE. | 2 | Clear link |

## What would make this perfect

Make the focus handoff real and prove Home → Demo → Back keyboard behavior.
Register and test every remaining functional/exit-code promise (or remove it
from visitor copy), then complete Twitter metadata on the legal and 404 routes.
With those three changes verified against production, the first-screen clarity,
real isolated demo, visual identity, and core privacy boundaries would support
a PASS.
