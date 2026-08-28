# Adversarial first-read review 6 — Firebase Environment Doctor

**Reviewed:** 2026-08-28 UTC  
**Live URL:** https://firebase-environment-doctor.sociobot.in/  
**Commit reviewed:** `c42094b46f9bafeaf5470879726e9876f76d188e`  
**Verdict:** **FAIL**

## Cold first read

I used new Playwright browser contexts at 390×844 and 1440×1000. I did not scroll before recording the first impression.

- **What it does:** It checks a Firebase project before a deploy, including the chosen project, sign-in, emulator addresses, and rules files.
- **For whom:** Firebase developers who could accidentally use the wrong project or incomplete local configuration before changing cloud data.
- **What to click first:** **“Try sample project check.”** The adjacent text, **“Shows a wrong-project result in this browser,”** says what will happen.

All three answers are available on the first screen at both sizes. At 390px, the primary action was 48px high at y=541–589, and all three trust facts were visible by y=836. The first-screen requirement is met.

## Finding

### F-6-1 — HIGH — Terms makes unregistered reliance claims

**Location / exact quotes:** [Terms](https://firebase-environment-doctor.sociobot.in/terms/) contains the following claim-like legal and product statements, but none has a corresponding entry in `.factory/claims.json`:

- “Firebase Environment Doctor is free, open-source software under the MIT License.”
- “You may use, copy, modify, and distribute it under that license.”
- “This independent developer tool is not affiliated with or endorsed by Google or Firebase.”
- “Firebase is a trademark of Google LLC.”
- “The software is provided as is, without warranty, as described in the MIT License.”

**Why this fails:** The claims contract requires every visitor-facing, reliance-bearing statement to be registered and proved in the clean sandbox, or removed if it cannot be proved. These are the terms a visitor is asked to rely on, yet the 25 registered tests cover the CLI, browser demo, privacy, and build artifacts only. A filesystem test can prove that the shipped `LICENSE` is MIT and that the published terms reproduce it; it cannot prove an external non-affiliation or trademark assertion.

**Concrete fix:** Add a `license-and-terms` claim with a clean-clone test that asserts the MIT `LICENSE` is shipped and the terms page links or accurately reproduces its grant and warranty language. Remove the untestable affiliation and trademark assertions, or replace them with a non-factual navigation note. Add one registry entry and observable test for every retained factual term.

## Copy audit

I checked every visitor-facing sentence/string on the landing page and README. The repository's reproducible audit (`npm run audit:copy`) also passed. No landing or README copy exceeds 22 words, uses a banned marketing adjective, or has inconsistent product terminology. Controls are result-naming verbs or clear navigation labels. Commands, option names, terminal output, and the product name are excluded from sentence counting.

### Landing page

| Text | Words |
| --- | ---: |
| Skip to content | 3 |
| Demo | 1 |
| What it checks | 3 |
| Install | 1 |
| Privacy | 1 |
| Firebase project check | 3 |
| Check your Firebase project before a deploy. | 7 |
| For Firebase developers who need to catch wrong projects, sign-in issues, emulator mismatches, or missing rules files before changing cloud data. | 21 |
| Try sample project check | 4 |
| Shows a wrong-project result in this browser. | 7 |
| Install the CLI | 3 |
| Runs locally by default | 4 |
| Hides credential values | 3 |
| Does not deploy | 3 |
| Check before changing cloud data. | 5 |
| Your files stay on your computer | 6 |
| The default check reads project files without a network request. | 10 |
| Cloud check only when you ask | 6 |
| --network runs read-only Firebase account and project checks. | 8 |
| Reports hide credentials | 3 |
| Cards and JSON omit credential values. | 6 |
| How it works | 3 |
| How to check a Firebase project | 6 |
| Start with local files. | 4 |
| Add the network check only when you need Firebase access confirmed. | 11 |
| Run the local check | 4 |
| Open a Firebase project directory and run: | 7 |
| Read the project and file results | 6 |
| Confirm the selected project. | 4 |
| Then follow the next check for each finding. | 8 |
| Choose the optional network check | 5 |
| Use this only when you want the tool to check Firebase access. | 12 |
| Check five Firebase settings. | 4 |
| The tool reads your project files and Firebase CLI results. | 10 |
| It tells you what to check next. | 7 |
| Selected project | 2 |
| Finds the project chosen by your command, environment, or project file. | 11 |
| Firebase access | 2 |
| Checks local sign-in details. | 4 |
| With --network, it checks Firebase access. | 6 |
| Emulator addresses | 2 |
| Compares emulator addresses with firebase.json. | 5 |
| Rules files | 2 |
| Checks that configured rules files exist. | 6 |
| Firebase CLI installed | 3 |
| Checks Firebase is installed. | 4 |
| With --network, it checks project access. | 6 |
| Install the Firebase project check. | 5 |
| Build it from this project source, then run it from a Firebase project directory. | 14 |
| Copy install command | 3 |
| Use --json for scripts. | 4 |
| Use --network to check Firebase access. | 6 |
| Use --demo for the bundled sample. | 6 |
| No blocking problem. | 3 |
| Problem found; --strict also fails on warnings. | 7 |
| Invalid command or unreadable input. | 5 |
| Source (opens GitHub) | 3 |
| Terms | 1 |
| Built by Param Factory | 4 |

### README

| Text | Words |
| --- | ---: |
| A Firebase project check for developers. | 6 |
| Check your Firebase project before a risky command. | 8 |
| It reports the selected project, sign-in details, emulator addresses, rules files, and Firebase CLI status. | 15 |
| The default check reads project files without a network request. | 10 |
| With --network, it runs only read-only Firebase commands. | 8 |
| Reports hide credential values. | 4 |
| Build from this source: | 4 |
| Run from a Firebase project directory or one of its subdirectories: | 11 |
| Use --network only when you want Firebase access checked: | 9 |
| Use JSON output in scripts: | 5 |
| Select a project without changing files | 6 |
| Check Firebase access with read-only commands | 6 |
| Print JSON for scripts | 4 |
| Exit with failure when warnings appear | 6 |
| Diagnose a specific directory | 4 |
| Run the bundled sample project check | 6 |
| Exit code 0 means no blocking problem. | 7 |
| Exit code 1 means a problem was found. | 8 |
| --strict also returns 1 for warnings. | 6 |
| Exit code 2 means the command or input was invalid. | 10 |
| Run the same sample shown on the website: | 8 |
| The command copies the bundled project to a new temporary directory and prints that directory. | 15 |
| The sample selects sample-store-prod while its project file defaults to sample-store-dev. | 11 |
| The website transcript is generated from this release command during every site build. | 13 |
| With --network, the tool runs these read-only Firebase commands: | 9 |
| The project check requires a listed Firebase account and checks project access. | 12 |
| It reports sign-in, permission, and network failures separately. | 8 |
| The website demo uses bundled sample data. | 7 |
| Reset removes its demo-only browser state. | 6 |
| The demo sends requests only to this site. | 8 |
| Requirements: Rust 1.85+ and Node.js 20+. | 6 |
| npm run build creates the CLI in dist/bin/ and the static site in dist/site/. | 14 |
| Deploy dist/site/ through the factory static work order. | 8 |
| MIT. | 1 |

## Demo and sandbox verification

The first landing action opens `/demo/?demo=1` in one click. In a new 390px context, the first viewport showed the product in use: **“CAUTION · Wrong project selected,”** `sample-store-prod`, `sample-store-dev`, and the next check. The persistent banner read **“Demo — sample data, nothing is saved,”** with **Reset demo** and **Start for real**.

The only browser key during the demo was `demo:firebase-environment-doctor:reset`; Reset removed it. No cookies or session-storage keys appeared. Request interception observed only `https://firebase-environment-doctor.sociobot.in`. The CLI `--demo` claim also passed from an unrelated temporary directory in the clean clone.

There is no offline promise to test. The relevant default-local and browser privacy claims were exercised through the release binary and same-origin interception tests.

## Claims verification

I read `.factory/claims.json` and executed every listed command from a fresh clone at `/tmp/firebase-doctor-review6.ycfPTO/repo`. All **25/25** commands passed, including the isolated CLI demo, browser reset/storage boundary, same-origin requests, exact CLI transcript, read-only subprocess allow-list, credential redaction, and all check/result claims. `npm test` also passed in that clone (20 aggregate tagged test cases; lint, Rust tests, copy audit, site policy, and browser/Axe checks included).

The landing page and README claims each map to registry entries. The unlisted Terms claims are reported as F-6-1.

## Earlier findings rechecked

I read `review-1.md` through `review-5.md`, every `polish-*.md`, and the prior handoff. The earlier findings were verified on the live deployment and current code, rather than accepted from their repair notes:

| Earlier finding | Current verification |
| --- | --- |
| F-1-1, F-2-1, F-5-1 | Direct demo opens with a real generated CLI result, banner, reset, and temporary-directory CLI path. |
| F-1-2, F-2-2, F-3-2 | Registry is present; all 25 listed commands passed. F-6-1 is the remaining Terms-only registry gap. |
| F-1-3, F-2-3 | Release tests passed the no-account and expired-credential classifiers; no false expired-login demo claim remains. |
| F-1-4, F-2-4, F-5-2 | Both cold first screens identify job, audience, action/outcome, and three facts. Copy counts pass. |
| F-1-5, F-2-5, F-3-1, F-3-3, F-5-3 | Demo, legal, and 404 routes are real; all have unique title/metadata and one h1. Forward and Back moved focus to h1 and announced the route. |
| F-1-6 | Canonical, favicon, Apple touch icon, OG, and Twitter metadata are present on each checked route. |
| F-1-7, F-2-6 | Current browser suite and live interaction confirmed focus, 44px actions, mobile content, shell, and no serious/critical Axe issue. |
| F-1-8, F-5-4 | Every checked route has the shared header/footer, Privacy/Terms, Param Factory credit, version, and product one-liner. |
| F-1-9, F-4-2, F-5-5 | Plain copy is under the cap; the landing page has the verb-led three-step workflow; the reproducible count audit passed. |
| F-4-1 | Browser transcript matched a fresh release `--demo` transcript exactly in the registered test. |

## Structure and identity

Home, Demo, Privacy, Terms, and a deliberate unknown path were checked live. The unknown path returned HTTP 404 with a designed recovery page. Each standard route had one h1, a plain route title, description, canonical, favicon, OG and Twitter data. All discovered navigable links returned 200, except the expected same-page skip link on the deliberately requested 404 response. The header and footer were consistent.

The paper-cut inspection bench, warm paper/ink/ember palette, Fraunces and IBM Plex Mono pairing, clipped sheets, and terminal inset are distinct from a generic SaaS template and match `.factory/design.md`. The three-step workflow, privacy boundary, live sample output, and footer complete the required landing structure.

## Missed leverage

No additional AI feature is expected. This job is a deterministic local configuration preflight; an AI explanation would add cost and ambiguity rather than improve the core check. JSON output already supplies the relevant script integration path, and the product does not imply remote sync or import.

## What would make this perfect

Resolve F-6-1: make every Terms statement either demonstrably backed by a registered clean-sandbox test or remove the statements that cannot be proved. After that change and a rerun of the same claim matrix, this review can pass.
