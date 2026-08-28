# Adversarial first-read review 5 — Firebase Environment Doctor

**Work order:** `firebase-environment-doctor-review-5`

**Reviewed:** 2026-08-28 UTC

**Live URL:** <https://firebase-environment-doctor.sociobot.in>

**Candidate:** `1b966e2fc7384f673400aa735f8dc5a43cb2ec30`

**Verdict:** **FAIL**

The product is clear, honest in its claims, and technically sound, but the
one-click browser demo does not show the product output in its first viewport.
Five findings remain, including one blocking demo finding. A PASS requires zero
findings.

## Cold first read

I opened production before scrolling in separate fresh Playwright contexts at
390×844 and 1440×900.

- **What does it do?** It checks a Firebase project for the selected project,
  sign-in, emulator, rules-file, and CLI problems before deployment.
- **For whom?** Firebase developers who want to catch those problems before
  changing cloud data.
- **What should I click first?** **“Try sample project check.”** The adjacent
  sentence says **“Shows a wrong-project result in this browser.”**

The exact copy that answers these questions is **“Check your Firebase project
before a deploy.”** and **“For Firebase developers who need to catch wrong
projects, sign-in issues, emulator mismatches, or missing rules files before
changing cloud data.”** No blocking cold-read clarity finding is raised.

## Findings

### F-5-1 — BLOCKING — the demo result is below the first viewport

**Earlier finding:** F-1-1 / F-2-1, half-fixed again. The real CLI demo,
isolation, banner, and transcript fidelity are fixed, but the required
immediate sample-result presentation is not.

**Exact location and evidence:** After clicking **“Try sample project check”**
at 390×844, the first viewport contains the 206px banner, the five-line heading
**“See a wrong Firebase project before a deploy.”**, and the sentence **“The
complete output below is generated from firebase-environment-doctor --demo
during the site build.”** The sample terminal begins at y=1,042, 198px below
the viewport. Even the sentence naming `sample-store-prod` begins at y=840. At
1440×900 the terminal begins at y=876, leaving only its edge at the bottom.

**Why this fails:** The first screen after the one-click action does not already
show the product being used with realistic sample data. A phone visitor sees an
introduction to a result and must scroll before seeing any project ID, warning,
verdict, or next check. The supplied demo contract makes a missing or weak demo
blocking.

**Concrete fix:** Put a compact real result directly below a shorter banner:
show `sample-store-prod`, the mismatch with `sample-store-dev`, the CAUTION
verdict, and the first next check within 844px. Keep the complete generated
terminal immediately below it. Add a 390×844 assertion that at least one real
sample value, verdict, and next check are fully visible without scrolling.

### F-5-2 — HIGH — the third required first-screen fact is clipped on a phone

**Exact location and evidence:** On the live 390×844 home page, **“Runs locally
by default”** occupies y=764–791 and **“Hides credential values”** y=799–825.
The third fact, **“Does not deploy,”** occupies y=833–860 and is not fully
visible before scrolling.

**Why this matters:** The required first-screen shape calls for three short
privacy/offline/price-or-boundary facts. The deployment-safety boundary is the
one fact the phone viewport hides.

**Concrete fix:** Recover at least 16px above the trust line on 390×844—reduce
the mobile heading/paragraph gap or tighten the action stack—and add a geometry
test requiring all three facts to be fully inside the initial viewport.

### F-5-3 — MINOR — the 404 h1 is not understandable out of context

**Exact quote/location:** The designed 404 h1 is **“This paper slip is not on
the bench.”**

**Why this matters:** A screen-reader heading list does not identify the error
or say that a page is missing. The paper metaphor is visually appropriate, but
the h1 still needs to state the job.

**Concrete fix:** Use **“This Firebase check page was not found.”** as the h1.
Keep the paper-slip line as supporting visual copy if desired.

### F-5-4 — MINOR — the shared footer omits the required product one-liner

**Exact quote/location:** Every route footer begins **“Firebase Environment
Doctor · MIT · v0.1.0”** and then lists Source, Privacy, Terms, and the factory
credit. It never says what the product does.

**Why this matters:** The common site skeleton requires a product one-liner in
the footer. A visitor entering on Privacy, Terms, or 404 does not get a compact
description there.

**Concrete fix:** Add **“Checks Firebase projects before deploys.”** to every
footer while retaining the legal links, attribution, and version.

### F-5-5 — MINOR — the recorded copy audit has incorrect word counts

**Exact location:** `.factory/copy-audit.md` says counts are word counts, but
16 entries disagree with whitespace-token counts. Examples include **“Check
your Firebase project before a deploy.”** recorded as 8 instead of 7,
**“What it checks”** as 4 instead of 3, and **“The website transcript is
generated from this release command during every site build.”** as 12 instead
of 13.

**Why this matters:** The current copy remains under the 22-word cap, but the
document presented as proof is not reproducible and can conceal a future limit
regression.

**Concrete fix:** Generate the table from extracted source text with one stated
tokenization rule and test that each stored count matches the generated count.

## Demo and sandbox verification

The landing action reaches `/demo/?demo=1` in one click. The persistent banner
is present with **Reset demo** and **Start for real**. The page immediately has
realistic bundled data in the document, but F-5-1 records that the data is not
visible in the first viewport.

In a fresh browser context:

- the only local-storage entry was
  `demo:firebase-environment-doctor:reset=active`;
- session storage and cookies were empty;
- Reset removed that demo-prefixed key and announced that the sample reloaded;
- Start for real targets `/` and removes the demo key;
- every request during Home → Demo → Reset stayed on the product origin.

I also ran the release binary from a new unrelated temporary directory. It
created `/tmp/firebase-environment-doctor-demo-*`, printed that location, and
reported the real `sample-store-prod` / `sample-store-dev` mismatch. The caller
directory retained only its pre-existing sentinel file. No browser offline
claim is made, so an offline reload test is not applicable.

## Claims verification

I cloned the repository with `git clone --no-local` into
`/tmp/firebase-doctor-review5.brBD3V/repo`, ran `npm ci`, and invoked every
`test` command in `.factory/claims.json` independently. All 25 passed.

| Claim id | Result |
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

The same clean clone passed `npm test`: strict Rust/TypeScript lint, 7 Rust
integration tests, 6 site-policy tests, browser/Axe checks, and 20 aggregate
claim test cases. `npm run verify:live` also passed. The individual claim runs
each rebuilt the release artifacts and collectively reported 25/25.

I found no additional unlisted reliance claim on the landing page or README.
Demo and privacy statements map to the browser isolation, request-boundary,
tracking, CLI-isolation, and transcript-fidelity entries. F-5-1 is a presentation
failure, not a false functional claim.

## Copy audit

Counts below use whitespace-separated tokens; code option names count as one
token. Literal commands, generated terminal output, decorative counters, and
the product name alone are not sentences. Headings, labels, links, and controls
are included so their context and verbs can be reviewed. No current item is
over 22 words, contains a banned marketing adjective, uses an inconsistent
product term, or gives a non-result-naming button. The counts below correct
F-5-5.

### Landing page

| Text | Words | Result |
| --- | ---: | --- |
| Skip to content | 3 | clear link |
| Demo | 1 | clear nav link |
| What it checks | 3 | clear nav link |
| Install | 1 | clear nav link |
| Privacy | 1 | clear nav link |
| Firebase project check | 3 | clear label |
| Check your Firebase project before a deploy. | 7 | clear h1 |
| For Firebase developers who need to catch wrong projects, sign-in issues, emulator mismatches, or missing rules files before changing cloud data. | 21 | clear audience and situation |
| Try sample project check | 4 | result-naming action |
| Shows a wrong-project result in this browser. | 7 | clear outcome |
| Install the CLI | 3 | clear secondary action |
| Runs locally by default | 4 | claim: `local-check-runs-locally` |
| Hides credential values | 3 | claim: `credential-values-hidden` |
| Does not deploy | 3 | claim: `never-deploys`; clipped per F-5-2 |
| Paper-cut terminal inspection bench connecting separate cloud, local emulator, and security rules stations | 13 | descriptive image alt |
| Check before changing cloud data. | 5 | clear caption |
| Your files stay on your computer | 6 | clear heading |
| The default check reads project files without a network request. | 10 | claim: `local-check-no-network` |
| Cloud check only when you ask | 6 | clear heading |
| --network runs read-only Firebase account and project checks. | 8 | claim: `read-only-firebase-commands` |
| Reports hide credentials | 3 | clear heading |
| Cards and JSON omit credential values. | 6 | claim: `credential-values-hidden` |
| How it works | 3 | clear label |
| How to check a Firebase project | 6 | clear heading |
| Start with local files. | 4 | claim: `local-check-runs-locally` |
| Add the network check only when you need Firebase access confirmed. | 11 | claim: `project-access` |
| Run the local check | 4 | verb-led heading |
| Open a Firebase project directory and run: | 7 | clear instruction |
| Read the project and file results | 6 | verb-led heading |
| Confirm the selected project. | 4 | clear instruction |
| Then follow the next check for each finding. | 8 | claim: `next-step-guidance` |
| Choose the optional network check | 5 | verb-led heading |
| Use this only when you want the tool to check Firebase access. | 12 | claim: `project-access` |
| Check five Firebase settings. | 4 | claim: `five-firebase-checks` |
| The tool reads your project files and Firebase CLI results. | 10 | claim: `project-input-boundaries` |
| It tells you what to check next. | 7 | claim: `next-step-guidance` |
| Selected project | 2 | clear heading |
| Finds the project chosen by your command, environment, or project file. | 11 | claim: `project-selection` |
| Firebase access | 2 | clear heading |
| Checks local sign-in details. | 4 | claim: `local-sign-in-details` |
| With --network, it checks Firebase access. | 6 | claim: `project-access` |
| Emulator addresses | 2 | clear heading |
| Compares emulator addresses with firebase.json. | 5 | claim: `emulator-address-check` |
| Rules files | 2 | clear heading |
| Checks that configured rules files exist. | 6 | claim: `rules-file-check` |
| Firebase CLI installed | 3 | clear heading |
| Checks Firebase is installed. | 4 | claim: `firebase-cli-presence` |
| With --network, it checks project access. | 6 | claim: `project-access` |
| Install the Firebase project check. | 5 | clear heading |
| Build it from this project source, then run it from a Firebase project directory. | 14 | clear instruction |
| Copy install command | 3 | result-naming button |
| Use --json for scripts. | 4 | claim: `json-output` |
| Use --network to check Firebase access. | 6 | claim: `project-access` |
| Use --demo for the bundled sample. | 6 | claim: `cli-demo-isolated` |
| No blocking problem. | 3 | claim: `exit-codes` |
| Problem found; --strict also fails on warnings. | 7 | claim: `exit-codes` |
| Invalid command or unreadable input. | 5 | claim: `exit-codes` |
| Source (opens GitHub) | 3 | clear external link |
| Terms | 1 | clear link |
| Built by Param Factory | 4 | clear attribution |

### README

| Text | Words | Result |
| --- | ---: | --- |
| Firebase Environment Doctor | 3 | product heading |
| A Firebase project check for developers. | 6 | clear introduction |
| Check your Firebase project before a risky command. | 8 | clear instruction |
| It reports the selected project, sign-in details, emulator addresses, rules files, and Firebase CLI status. | 15 | claim: `five-firebase-checks` |
| The default check reads project files without a network request. | 10 | claim: `local-check-no-network` |
| With --network, it runs only read-only Firebase commands. | 8 | claim: `read-only-firebase-commands` |
| Reports hide credential values. | 4 | claim: `credential-values-hidden` |
| Install | 1 | clear heading |
| Build from this source: | 4 | clear instruction |
| Usage | 1 | clear heading |
| Run from a Firebase project directory or one of its subdirectories: | 11 | claim: `project-root-discovery` |
| Use --network only when you want Firebase access checked: | 9 | claim: `project-access` |
| Use JSON output in scripts: | 5 | claim: `json-output` |
| Useful options: | 2 | clear heading |
| Select a project without changing files | 6 | claim: `project-selection` |
| Check Firebase access with read-only commands | 6 | claim: `read-only-firebase-commands` |
| Print JSON for scripts | 4 | claim: `json-output` |
| Exit with failure when warnings appear | 6 | claim: `exit-codes` |
| Diagnose a specific directory | 4 | claim: `project-root-discovery` |
| Run the bundled sample project check | 6 | claim: `cli-demo-isolated` |
| Exit code 0 means no blocking problem. | 7 | claim: `exit-codes` |
| Exit code 1 means a problem was found. | 8 | claim: `exit-codes` |
| --strict also returns 1 for warnings. | 6 | claim: `exit-codes` |
| Exit code 2 means the command or input was invalid. | 10 | claim: `exit-codes` |
| Try the sample | 3 | clear heading |
| Run the same sample shown on the website: | 8 | clear instruction |
| The command copies the bundled project to a new temporary directory and prints that directory. | 15 | claim: `cli-demo-isolated` |
| The sample selects sample-store-prod while its project file defaults to sample-store-dev. | 11 | claims: `cli-demo-isolated`, `browser-demo-isolated` |
| The website transcript is generated from this release command during every site build. | 13 | claim: `browser-demo-matches-cli` |
| What network mode runs | 4 | clear heading |
| With --network, the tool runs these read-only Firebase commands: | 9 | claim: `read-only-firebase-commands` |
| The project check requires a listed Firebase account and checks project access. | 12 | claim: `network-account-and-project-access` |
| It reports sign-in, permission, and network failures separately. | 8 | claim: `network-failure-classification` |
| Website demo and privacy | 4 | clear heading |
| The website demo uses bundled sample data. | 7 | claim: `browser-demo-isolated` |
| Reset removes its demo-only browser state. | 6 | claim: `browser-demo-isolated` |
| The demo sends requests only to this site. | 8 | claim: `browser-demo-local-requests` |
| See the live privacy page. | 5 | clear link sentence |
| Develop, test, package, and deploy | 5 | clear contributor heading |
| Requirements: Rust 1.85+ and Node.js 20+. | 6 | contributor requirement |
| npm run build creates the CLI in dist/bin/ and the static site in dist/site/. | 14 | claim: `build-artifacts` |
| Deploy dist/site/ through the factory static work order. | 8 | deployment instruction |
| License | 1 | clear heading |
| MIT. | 1 | license |
| See LICENSE. | 2 | clear link sentence |

Terminology is consistent: **Firebase project check** for the action,
**bundled sample project** for the sample, **Firebase access** for cloud access,
**sign-in** for login state, **project directory** for the local folder,
**wrong project** for the unsafe target, and **rules files** for rules
configuration.

## Earlier finding verification

I read `review-1.md` through `review-4.md`, `polish-2.md` through
`polish-4.md`, both verification reports, and the prior handoff. I checked each
finding against the live site and current source rather than relying on its
recorded repair status.

| Earlier finding | Current verification |
| --- | --- |
| F-1-1 | **Half-fixed; reissued as F-5-1.** The temp-directory CLI and isolated browser demo are real, but the browser's first viewport still does not show the result. |
| F-1-2 | Fixed: 25 registered claims each have one tagged test and all commands pass. |
| F-1-3 | Fixed: non-empty-account and expired-credential regression tests pass; the false demo claim is absent. |
| F-1-4 | Fixed: job, audience, primary action, and outcome are clear on both widths. |
| F-1-5 | Fixed: Demo and 404 are real routes; deep links, status, Back, h1 focus, and announcements work. |
| F-1-6 | Fixed: every route has the required canonical, OG/Twitter, favicon, and Apple-touch metadata. |
| F-1-7 | Fixed: dark-surface focus, mobile type, target sizes, and auth behavior pass live/current-code checks. |
| F-1-8 | Fixed for the reported legal-shell defect: legal routes share the header/footer, legal links, attribution, and version. F-5-4 is the separate one-liner requirement. |
| F-1-9 | Fixed in visitor copy: no long sentence, banned word, vague action, or inconsistent term remains. F-5-5 concerns the audit evidence. |
| F-2-1 | **Half-fixed; reissued as F-5-1** for immediate result visibility. |
| F-2-2 | Fixed: registry coverage and all claim commands pass. |
| F-2-3 | Fixed: realistic no-account and expired-after-listing classification tests pass. |
| F-2-4 | Fixed: the first screen and product copy are plain and actionable. |
| F-2-5 | Fixed: Demo, 404, sitemap, route focus, and share metadata pass. |
| F-2-6 | Fixed: focus contrast, 16px mobile informational text, 44px targets, and the common legal shell pass. |
| F-3-1 | Fixed: after navigation and Back, focus moves to the route h1 after the page frame. |
| F-3-2 | Fixed: the former landing/README claims are registered and independently pass. |
| F-3-3 | Fixed: Privacy, Terms, and 404 have complete Twitter and Open Graph fields. |
| F-4-1 | Fixed: the browser transcript exactly matches a normalized release `--demo` run. |
| F-4-2 | Fixed: the landing page has the three verb-led workflow steps with real commands and generated output. |

## Structure, links, and accessibility

| Route | Status | Title | h1 count |
| --- | ---: | --- | ---: |
| `/` | 200 | Firebase Environment Doctor — Check Firebase projects | 1 |
| `/demo/?demo=1` | 200 | Demo — Firebase Environment Doctor | 1 |
| `/privacy/` | 200 | Privacy — Firebase Environment Doctor | 1 |
| `/terms/` | 200 | Terms — Firebase Environment Doctor | 1 |
| unknown route | 404 | Page not found — Firebase Environment Doctor | 1 |

Every title is at most 53 characters. All routes have `lang="en"`, one main,
a description, canonical, full Open Graph/Twitter metadata, SVG favicon,
Apple-touch icon, shared header/footer, and self-hosted assets. All unique
rendered destinations—Home, Demo, Privacy, Terms, and GitHub Source—returned
200; the deliberate unknown route returned the designed 404. Valid routes had
no console/page errors. Axe found zero serious or critical violations on all
five documents. Home → Demo → Back moved focus to each destination h1 and
updated the polite route announcement.

The paper-cut bench, warm paper palette, Fraunces/Plex pairing, chamfered slips,
and original diorama are product-specific rather than a generic SaaS template.
F-5-3 and F-5-4 are the remaining structure/copy misses.

## Missed leverage

No missing AI, import, export, or sync feature is raised. This is a local
diagnostic CLI; adding model output would make deterministic safety guidance
less trustworthy and would be decorative. Scriptable JSON output already
covers the expected export path. No runtime provider key or AI endpoint is
present. `.factory/brief.json` is absent, so no unsupported feature is inferred
beyond the repository contract, examples, README, and design thesis.

## What would make this perfect

Show the real sample verdict and next check inside the first demo viewport;
bring all three home trust facts fully above the 390×844 fold; replace the 404
metaphor h1 with a literal not-found heading; add the footer one-liner; and
regenerate the copy-audit counts. Re-run the same 25-claim clean-clone matrix,
live route crawl, focus/Back check, Axe scan, and mobile viewport geometry after
deployment. Only a round with zero findings should pass.
