# Adversarial first-read review 7 — Firebase Environment Doctor

**Reviewed:** 2026-08-28 UTC
**Live URL:** <https://firebase-environment-doctor.sociobot.in>
**Repository base:** `a52cc369c0b98438627b4d316ecf1b798a7b302a`
**Verdict:** **PASS**

## Cold first read

I opened the live site in separate fresh browser contexts at 390×844 and
1440×1000, without scrolling.

- **What it does:** It checks a Firebase project before a deploy.
- **For whom:** Firebase developers who need to catch wrong projects, sign-in
  issues, emulator mismatches, or missing rules files before changing cloud
  data.
- **What to click first:** **“Try sample project check.”** The adjacent text,
  **“Shows a wrong-project result in this browser.”**, names the outcome.

The exact first-screen text is “Check your Firebase project before a deploy.”
and “For Firebase developers who need to catch wrong projects, sign-in issues,
emulator mismatches, or missing rules files before changing cloud data.” The
headline is 7 words and the audience sentence is 21 words. The primary action
is visible and unambiguous at both widths. At 390px the three boundary facts
end at y=836 of an 844px viewport.

The paper-cut inspection bench, warm paper/ink/ember palette, clipped sheets,
locally hosted Fraunces/IBM Plex Mono pair, and original diorama match
`.factory/design.md`. It does not resemble a generic SaaS template.

## Findings

None. No blocking, high, minor, unlisted-claim, routing, accessibility, or
copy finding remains.

## Demo and sandbox verification

One click on the landing-page primary action opened `/demo/?demo=1`. The first
390×844 viewport already displayed:

- `CAUTION · Wrong project selected`
- selected project `sample-store-prod`
- project-file default `sample-store-dev`
- “Confirm this project ID before any command that can write or deploy.”

The persistent banner reads **“Demo — sample data, nothing is saved”** and
includes working **Reset demo** and **Start for real** controls. In a fresh
context the sole browser key was
`demo:firebase-environment-doctor:reset=active`; Reset removed it. Start for
real returned to `/` with no local/session storage or cookies. Request
interception throughout the flow observed only
`https://firebase-environment-doctor.sociobot.in`; there were no console or
page errors. No offline promise is made, so no unsupported offline test is
required.

From an unrelated temporary directory, clean-build
`firebase-environment-doctor --demo` created a new
`/tmp/firebase-environment-doctor-demo-*` directory and reported the same
realistic wrong-project sample. Its complete output matched the browser
recording under the registered transcript claim.

## Claims and clean-clone verification

I created a fresh clone at `/tmp/firebase-doctor-review7.kC1vnG/repo`, ran
`npm ci`, `npm test`, `npm run build`, and `cargo package --locked`, then
ran every command in `.factory/claims.json` separately. All **26/26** passed:

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
| `license-and-terms` | PASS |

The landing page, README, demo, privacy, terms, footer, and 404 were
cross-checked against the registry. Every reliance claim has a matching entry;
there is no unlisted visitor claim. The Terms sentence about local
configuration and optional Firebase results is covered by
`project-input-boundaries`; MIT release/license-link statements are covered
by `license-and-terms`.

## Copy audit

Whitespace-token counts follow the repository's executable audit. Literal
commands, option tokens, raw terminal output, decorative marks, and the product
name are code/output rather than sentences. `npm run audit:copy` passed with
117 checked visible strings. No landing or README entry exceeds 22 words, uses
a banned marketing adjective, has an inconsistent term, has a contextless
heading, or uses a non-result-naming button. “Clear” means no flag or rewrite
is needed; `claim:` names the passed registry entry.

### Landing page

| Text | Words | Check |
| --- | ---: | --- |
| Skip to content | 3 | Clear link |
| Demo | 1 | Clear navigation |
| What it checks | 3 | Clear navigation |
| Install | 1 | Clear navigation |
| Privacy | 1 | Clear navigation |
| Firebase project check | 3 | Clear label |
| Check your Firebase project before a deploy. | 7 | Clear h1 |
| For Firebase developers who need to catch wrong projects, sign-in issues, emulator mismatches, or missing rules files before changing cloud data. | 21 | Clear audience/situation |
| Try sample project check | 4 | Result-naming action |
| Shows a wrong-project result in this browser. | 7 | Clear outcome |
| Install the CLI | 3 | Clear action |
| Runs locally by default | 4 | claim: `local-check-runs-locally` |
| Hides credential values | 3 | claim: `credential-values-hidden` |
| Does not deploy | 3 | claim: `never-deploys` |
| Check before changing cloud data. | 5 | Clear caption |
| Your files stay on your computer | 6 | Clear heading |
| The default check reads project files without a network request. | 10 | claim: `local-check-no-network` |
| Cloud check only when you ask | 6 | Clear heading |
| --network runs read-only Firebase account and project checks. | 8 | claim: `read-only-firebase-commands` |
| Reports hide credentials | 3 | Clear heading |
| Cards and JSON omit credential values. | 6 | claim: `credential-values-hidden` |
| How it works | 3 | Clear label |
| How to check a Firebase project | 6 | Clear heading |
| Start with local files. | 4 | claim: `local-check-runs-locally` |
| Add the network check only when you need Firebase access confirmed. | 11 | claim: `project-access` |
| Run the local check | 4 | Clear verb-led step |
| Open a Firebase project directory and run: | 7 | Clear instruction |
| Read the project and file results | 6 | Clear verb-led step |
| Confirm the selected project. | 4 | Clear instruction |
| Then follow the next check for each finding. | 8 | claim: `next-step-guidance` |
| Choose the optional network check | 5 | Clear verb-led step |
| Use this only when you want the tool to check Firebase access. | 12 | claim: `project-access` |
| Check five Firebase settings. | 4 | claim: `five-firebase-checks` |
| The tool reads your project files and Firebase CLI results. | 10 | claim: `project-input-boundaries` |
| It tells you what to check next. | 7 | claim: `next-step-guidance` |
| Selected project | 2 | Clear heading |
| Finds the project chosen by your command, environment, or project file. | 11 | claim: `project-selection` |
| Firebase access | 2 | Clear heading |
| Checks local sign-in details. | 4 | claim: `local-sign-in-details` |
| With --network, it checks Firebase access. | 6 | claim: `project-access` |
| Emulator addresses | 2 | Clear heading |
| Compares emulator addresses with firebase.json. | 5 | claim: `emulator-address-check` |
| Rules files | 2 | Clear heading |
| Checks that configured rules files exist. | 6 | claim: `rules-file-check` |
| Firebase CLI installed | 3 | Clear heading |
| Checks Firebase is installed. | 4 | claim: `firebase-cli-presence` |
| With --network, it checks project access. | 6 | claim: `project-access` |
| Install the Firebase project check. | 5 | Clear heading |
| Build it from this project source, then run it from a Firebase project directory. | 14 | Clear instruction |
| Copy install command | 3 | Result-naming button |
| Use --json for scripts. | 4 | claim: `json-output` |
| Use --network to check Firebase access. | 6 | claim: `project-access` |
| Use --demo for the bundled sample. | 6 | claim: `cli-demo-isolated` |
| No blocking problem. | 3 | claim: `exit-codes` |
| Problem found; --strict also fails on warnings. | 7 | claim: `exit-codes` |
| Invalid command or unreadable input. | 5 | claim: `exit-codes` |
| Source (opens GitHub) | 3 | Clear external link |
| Terms | 1 | Clear link |
| Built by Param Factory | 4 | Clear attribution |

### README

| Text | Words | Check |
| --- | ---: | --- |
| A Firebase project check for developers. | 6 | Clear introduction |
| Check your Firebase project before a risky command. | 8 | Clear instruction |
| It reports the selected project, sign-in details, emulator addresses, rules files, and Firebase CLI status. | 15 | claim: `five-firebase-checks` |
| The default check reads project files without a network request. | 10 | claim: `local-check-no-network` |
| With --network, it runs only read-only Firebase commands. | 8 | claim: `read-only-firebase-commands` |
| Reports hide credential values. | 4 | claim: `credential-values-hidden` |
| Build from this source: | 4 | Clear instruction |
| Run from a Firebase project directory or one of its subdirectories: | 11 | claim: `project-root-discovery` |
| Use --network only when you want Firebase access checked: | 9 | claim: `project-access` |
| Use JSON output in scripts: | 5 | claim: `json-output` |
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
| Run the same sample shown on the website: | 8 | claims: `cli-demo-isolated`, `browser-demo-isolated` |
| The command copies the bundled project to a new temporary directory and prints that directory. | 15 | claim: `cli-demo-isolated` |
| The sample selects sample-store-prod while its project file defaults to sample-store-dev. | 11 | claims: `cli-demo-isolated`, `browser-demo-isolated` |
| The website transcript is generated from this release command during every site build. | 13 | claim: `browser-demo-matches-cli` |
| With --network, the tool runs these read-only Firebase commands: | 9 | claim: `read-only-firebase-commands` |
| The project check requires a listed Firebase account and checks project access. | 12 | claim: `network-account-and-project-access` |
| It reports sign-in, permission, and network failures separately. | 8 | claim: `network-failure-classification` |
| The website demo uses bundled sample data. | 7 | claim: `browser-demo-isolated` |
| Reset removes its demo-only browser state. | 6 | claim: `browser-demo-isolated` |
| The demo sends requests only to this site. | 8 | claim: `browser-demo-local-requests` |
| Requirements: Rust 1.85+ and Node.js 20+. | 6 | Contributor requirement |
| npm run build creates the CLI in dist/bin/ and the static site in dist/site/. | 14 | claim: `build-artifacts` |
| Deploy dist/site/ through the factory static work order. | 8 | Deployment instruction |
| MIT. | 1 | License |

Terminology is consistent: **Firebase project check**, **bundled sample
project**, **Firebase access**, **sign-in**, **project directory**, **wrong
project**, and **rules files**.

## Structure, links, accessibility, and history

`npm run verify:live` passed from the clean clone. It verified the live route
crawl, exact deployed assets, metadata, real 404, demo privacy/reset behavior,
mobile geometry, route focus/Back behavior, console checks, and Axe
serious/critical checks.

- `/`, `/demo/`, `/privacy/`, and `/terms/` return 200; an unknown URL
  returns the designed 404 with HTTP 404.
- Each route has one h1, a main landmark, `lang=\"en\"`, a description,
  canonical URL, favicon, Apple touch icon, complete Open Graph/Twitter data,
  a route-specific title under 60 characters, a consistent header/footer, and
  Privacy/Terms links.
- Home → Demo → Back moves focus to the destination h1 and updates the polite
  route announcement. Deep links and reloads retain their route.
- The route crawl found no dead navigable links; the GitHub Source destination
  returned 200.
- At 390px there is no horizontal overflow; relevant instructions and controls
  compute at least 16px, tap targets meet 44px, focus is visible on dark/light
  surfaces, and reduced-motion support remains in the CSS.

I read every `review-*.md`, `polish-*.md`, verification record, and the
previous handoff, then checked the live site and code rather than accepting the
repair notes. All historical findings are fixed:

| Earlier finding(s) | Confirmed current state |
| --- | --- |
| F-1-1, F-2-1, F-4-1, F-5-1 | Real isolated CLI/browser demo, first-viewport result, reset/exit, and exact transcript claim pass. |
| F-1-2, F-2-2, F-3-2, F-6-1 | All 26 registry entries cover visitor reliance claims, including Terms; all pass. |
| F-1-3, F-2-3 | No-account and expired-credential regressions pass; no false expired-login demo claim remains. |
| F-1-4, F-2-4, F-5-2, F-1-9 | First read is clear; three facts fit; no long, vague, jargon-heavy, or inconsistent copy remains. |
| F-1-5, F-2-5, F-3-1, F-3-3, F-5-3 | Routes, 404, metadata, h1 focus, announcement, and literal 404 h1 pass. |
| F-1-6 | Canonical, OG/Twitter, favicon, and Apple-touch metadata are complete. |
| F-1-7, F-2-6 | Focus, contrast, mobile type, target geometry, and shared shell pass. |
| F-1-8, F-5-4 | Shared footer includes product one-liner, version, legal links, and Param Factory credit. |
| F-4-2, F-5-5 | Three-step workflow and reproducible copy counts pass. |

## Missed leverage

No missing AI, import/export, or sync feature is raised. This is a
deterministic local diagnostic CLI; an AI interpretation would be decorative
and weaken the safety model. Scriptable JSON output is the appropriate
integration path. No runtime model endpoint, provider key, or external AI call
is present. `.factory/brief.json` is absent, so no further feature requirement
can honestly be inferred.

## What would make this perfect

Nothing remains to change for this review scope. Preserve the current claim
matrix, live route verifier, and mobile/browser checks so the zero-finding state
remains demonstrable.
