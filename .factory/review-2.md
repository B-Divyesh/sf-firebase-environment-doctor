# Adversarial first-read review 2 — Firebase Environment Doctor

**Work order:** firebase-environment-doctor-review-2  
**Reviewed:** 2026-08-28 UTC  
**Live URL:** https://firebase-environment-doctor.sociobot.in  
**Verdict:** **FAIL**

## Cold first read

I opened production in fresh browser contexts at 390×844 and 1440×1000 before
scrolling. My best inference is a command-line check of Firebase settings before
a risky command. I cannot tell who should use it: the screen never names
Firebase developers or their triggering situation. I cannot tell what to click
first: “Install the doctor” and “Run a sample diagnosis” compete and do not say
what happens.

This is blocking. “Know the target before you debug.” is a slogan, not the job.
“One local command checks the active Firebase project, credential state,
emulator endpoints, rules hashes, and CLI reachability—before a write command
gets the chance.” is technical and does not identify the visitor. Replace the
group with **“Check your Firebase project before a deploy.”** and **“For
Firebase developers who need to catch a wrong project, login, emulator, or
rules file before changing cloud data.”** Make **“Try sample project check”**
the primary action, followed by **“Shows a wrong-project result in this
browser.”** Keep **“Install the CLI”** secondary.

The paper-cut inspection bench is product-specific, not a generic SaaS
template. That does not cure the failures below.

## Findings

### F-2-1 — BLOCKING — the sample is not a real, isolated one-click CLI demo

**Earlier finding:** F-1-1, confirmed unfixed.

**Evidence:** The live “Run a sample diagnosis” action changes only to #demo
and shows prewritten “Wrong project” text. The /demo URL returns HTTP 200 with
the home title and h1. No persistent “Demo — sample data, nothing is saved”
banner, Reset demo, Start for real, demo namespace, demo documentation,
examples fixture, or real binary recording exists. In a clean-clone temporary
directory, the built binary returned “error: unexpected argument '--demo'
found” and exit 2.

Browser interception saw only same-origin assets and empty local/session
storage. That proves a static illustration, not a resettable demo or boundary
between sample and real data.

**Why a visitor is misled:** They cannot try the actual CLI job in one click.

**Concrete fix:** Ship a realistic fixture under examples and a --demo command
that copies it to a temp directory, runs the real diagnostic path, and prints
the output location. Make /demo immediately show that output under the
persistent banner, Reset demo, and Start for real. Document URL, command,
fixture, reset, and demo storage namespace in .factory/demo.md; add a
temp-directory regression test.

### F-2-2 — BLOCKING — every reliance claim is unlisted and untested

**Earlier finding:** F-1-2, confirmed unfixed.

**Evidence:** .factory/claims.json is absent and searching for @claim: found no
claim-tagged test. There were zero listed claim commands to run in the clean
clone. Unlisted landing claims include “Offline by default”, “Never prints
tokens”, “Never deploys”, “Reads Firebase project files without sending them
anywhere”, “Cloud checks run only with --network”, “Stable JSON and cards omit
credential values”, and “The browser demo is local and makes no requests.”
README adds “All analysis is local by default”, “No telemetry, analytics,
third-party scripts, or hosted fonts are used”, and “The interactive website
demo runs entirely in the browser and stores nothing.”

**Why a visitor is misled:** Safety, privacy, and behaviour promises lack
fresh-sandbox proof.

**Concrete fix:** Add claims.json with one observable claim-tagged test per
retained promise: no-network default, explicit read-only Firebase commands, no
mutation subprocess, secret suppression, and demo reset/isolation/request
interception. Delete claims that cannot be tested.

### F-2-3 — BLOCKING — “Expired login diagnosed” overstates the real CLI

**Earlier finding:** F-1-3 and verification-2 high finding, confirmed unfixed.

**Evidence:** The live demo says “Expired login diagnosed” and “× BLOCKED ·
Firebase login expired.” Source lines 689–717 remain unchanged after
verification-2: any successful, parseable firebase login:list JSON becomes
“Firebase login validated”; a failed firebase projects:list JSON becomes
cloud_unreachable. The only expired-login test makes login:list itself fail.
Verification-2 reproduced Firebase Tools 14.12.0 returning successful
{"status":"success"} with no authorised account, then this CLI reporting
validated login plus cloud_unreachable.

**Why a visitor is misled:** It can send a developer to investigate
connectivity when login is absent or expired.

**Concrete fix:** Require a non-empty authorised account. Use the
network-validating operation to distinguish authentication, permission, and
connectivity failures. Add real empty-login JSON and “login list succeeds,
project list rejects credentials” tests. Remove the live expired-login demo
until those tests pass.

### F-2-4 — BLOCKING — first-screen and product copy are not plain enough to act on

**Earlier finding:** F-1-4 and F-1-9, confirmed unfixed.

**Evidence:** The cold-read failure remains live. The audit below also finds a
23-word hero sentence, a 36-word README sentence, a 25-word exit-code sentence,
jargon such as “preflight”, “fixture”, “CLI reachability”, “SHA-256”, and
“command surface”, contextless headings, vague controls, and untested claims.

**Why a visitor is lost:** They must translate implementation language before
learning relevance or the next action.

**Concrete fix:** Apply the cold-screen replacement. Use “Firebase project
check” consistently; rename “Checks” to “What it checks”; remove internal
Factory-release language; split the long README lines; and test or remove every
safety assertion.

### F-2-5 — BLOCKING — demo route, 404, and share metadata are absent

**Earlier finding:** F-1-5 and F-1-6, confirmed unfixed.

**Evidence:** /demo responds 200 with home title “Firebase Environment Doctor —
Know your target before you debug” and home h1. /not-a-real-route responds 200
with identical contents. sitemap.xml omits /demo. No route has canonical, Open
Graph, Twitter, or apple-touch metadata. The home title is 64 characters and is
not a plain “Product — what it does” title. There is no route-change focus or
polite announcement because there is no route.

**Why a visitor is lost:** Direct links, reload, history, sharing, and bad URLs
do not describe the place reached.

**Concrete fix:** Add a real /demo with title “Demo — Firebase Environment
Doctor”, explicit demo h1, focus/announcement behaviour, and sitemap entry.
Serve a styled HTTP 404 with Home. Add per-route ≤60-character titles,
canonical, plain description, OG/Twitter title/description/project-owned
1200×630 art, and 180px apple-touch icon.

### F-2-6 — BLOCKING — previously reported focus, mobile, target-size, and shell defects remain

**Earlier finding:** F-1-7 and F-1-8; verification-2 medium/low findings,
confirmed unfixed.

**Evidence:** At 390px, focused install command has a 3px rgb(23, 36, 59)
outline on the same rgb(23, 36, 59) background: 1:1 focus contrast. Important
live text computes to 11.52–12.80px: terminal 12px, small note 11.84px, safety
copy 12.16px, check copy 12.48px, and copy button 11.52px. The mobile brand is
34×44px; footer Source is 42×44px and Terms 35×44px. Privacy's header has only
Home/Terms; Terms has Home/Privacy only; neither footer has “Built by Param
Factory” and a version/build id.

**Why a visitor is lost:** Keyboard focus disappears on a working control, and
phone instructions/actions are hard to read or tap. Legal routes lack the
common skeleton.

**Concrete fix:** Use a ≥3:1 contrasting focus ring on dark surfaces; make
default mobile informational/control type at least 16px; make brand/footer
targets 44×44px; and use one complete header/footer on every route. Add
computed-style, target-geometry, and focus-visual tests.

## Claims and clean-clone result

| Check | Result | Evidence |
| --- | --- | --- |
| claims registry | **FAIL** | .factory/claims.json absent. |
| every listed claim test | **FAIL** | Zero commands exist; live claims are untested. |
| npm ci | PASS | Clean clone at /tmp/firebase-doctor-review-2.8KtQsf/repo. |
| npm test | PASS | Lint, Rust tests, site tests, browser smoke, and axe passed. |
| npm run build | PASS | Release binary and dist/site produced. |
| CLI demo in temp dir | **FAIL** | Release binary rejects --demo, exit 2. |

Network interception during the sample saw only the product origin and no
cookies or web storage. This cannot prove the missing sandbox or claims.
.factory/brief.json is absent, so no extra AI/import/sync feature is inferred
beyond the core demo/diagnosis gap. No runtime AI feature or provider key is
present.

## Earlier-review verification

I read every earlier applicable record: review-1, verification, verification-2,
and the prior handoff. There are no polish files.

| Earlier item | Current status |
| --- | --- |
| verification-1 strict Clippy failure | Fixed: clean npm test runs strict Clippy successfully. |
| verification-1 cache/security-header findings | Fixed: immutable assets, CSP/frame protection, permissions policy, and one-year HSTS are live. |
| F-1-1 demo | Unfixed; reissued F-2-1. |
| F-1-2 claims | Unfixed; reissued F-2-2. |
| F-1-3 / verification-2 auth | Unfixed; reissued F-2-3; source is unchanged. |
| F-1-4 first screen | Unfixed; reissued F-2-4. |
| F-1-5 routes/404 | Unfixed; reissued F-2-5. |
| F-1-6 metadata | Unfixed; reissued F-2-5. |
| F-1-7 focus/mobile/targets | Unfixed; reissued F-2-6. |
| F-1-8 legal shell | Unfixed; reissued F-2-6. |
| F-1-9 copy | Unfixed; reissued F-2-4. |

## Copy audit

Counts are whitespace-token word counts. Every landing/README sentence,
heading, label, and control is listed; raw sample terminal values and literal
commands are not prose sentences. Every flagged row has a rewrite or a required
test/remove action.

### Landing page

| Text | Words | Flag / concrete fix |
| --- | ---: | --- |
| Firebase Environment Doctor | 3 | Product name; keep. |
| Checks | 1 | Contextless; use “What it checks”. |
| Try the demo | 3 | Vague; use “Try sample project check”. |
| Install | 1 | Vague; use “Install the CLI”. |
| Read-only terminal preflight | 3 | Jargon; use “Firebase project check”. |
| Know the target before you debug. | 7 | Use “Check your Firebase project before a deploy.” |
| One local command checks the active Firebase project, credential state, emulator endpoints, rules hashes, and CLI reachability—before a write command gets the chance. | 23 | >22/jargon; use “Check your Firebase project, login, emulators, and rules before a command changes cloud data.” |
| Install the doctor | 3 | Vague; use “Install the CLI”. |
| Run a sample diagnosis | 4 | Use “Try sample project check”. |
| Offline by default | 3 | Claim: add offline test or remove. |
| Never prints tokens | 3 | Claim: add secret-suppression test or remove. |
| Never deploys | 2 | Claim: add subprocess test or remove. |
| Inspect first. Debug second. | 4 | Slogan; remove. |
| Local first | 2 | Contextless; use “Your files stay on your computer”. |
| Reads Firebase project files without sending them anywhere. | 8 | Claim: test or remove. |
| Explicit network opt-in | 3 | Jargon; use “Cloud check only when you ask”. |
| Cloud checks run only with --network. | 6 | Claim: test or remove. |
| Shareable, not secret | 3 | Contextless; use “Reports hide credentials”. |
| Stable JSON and cards omit credential values. | 7 | Jargon/claim; use “Reports hide credential values.” and test. |
| Recorded fixture bench | 3 | Internal jargon; use “Sample project check”. |
| See the failure before it costs you. | 8 | Contextless; use “See a wrong-project result”. |
| These are the exact root categories covered by the CLI test fixtures. | 12 | Jargon/claim; use “Choose a sample result.” |
| The browser demo is local and makes no requests. | 10 | Claim: test or remove. |
| Wrong project | 2 | Clear result; keep. |
| Expired login | 2 | Unsupported; remove until F-2-3 passes. |
| Emulator mismatch | 2 | Clear result; keep. |
| Use Tab to enter, then ← and → to change cases. | 10 | Clear instruction; keep. |
| FIREBASE_PROJECT selects “studio-api-prod”. | 2 | Use “The selected project is studio-api-prod.” |
| Confirm this ID before any write command. | 7 | Clear instruction; keep. |
| Firebase login expired | 3 | Unsupported; remove until F-2-3 passes. |
| Run firebase login, then repeat with --network. | 6 | Use “Sign in with Firebase, then run the check again.” |
| No token or credential value was printed. | 7 | Claim: test or remove. |
| Align FIRESTORE_EMULATOR_HOST or unset it to use the cloud service intentionally. | 9 | Use “Set the Firestore emulator address to match firebase.json, or remove it.” |
| Five checks, one answer | 4 | Slogan; use “What the check inspects”. |
| A small surface for a messy environment. | 7 | Contextless; use “Check five Firebase settings”. |
| The doctor uses the configuration already in your repository and documented Firebase CLI surfaces. | 14 | Use “The tool reads your project files and Firebase CLI results.” |
| It does not try to repair or reinterpret your setup. | 10 | Claim: test or remove. |
| Resolves flags, environment variables, aliases, and the default project. | 9 | Use “Finds the project chosen by your command, environment, or project file.” |
| Finds local credential markers, then validates only when you opt in. | 10 | Use “Checks for local sign-in details. It validates them only with --network.” and test. |
| Compares environment endpoints with ports declared in firebase.json. | 7 | Use “Compares emulator addresses with firebase.json.” |
| Verifies configured files and fingerprints each one with SHA-256. | 8 | Use “Checks that configured rules files exist.”; test or omit hashes. |
| Checks the Firebase binary locally and project visibility on request. | 10 | Use “Checks Firebase is installed. With --network, it checks project access.” and test. |
| Version 0.1.0 | 2 | Build claim; show verified build id or remove. |
| Put the check beside the code. | 7 | Contextless; use “Install the Firebase project check”. |
| Build the single binary with Rust today. | 7 | Jargon; use “Install from the project source.” |
| Release downloads can be attached by the factory without changing the command surface. | 12 | Internal jargon; remove. |
| Copy install command | 3 | Result-naming verb; keep. |
| Then run firebase-environment-doctor from your Firebase project. | 6 | Clear instruction; keep. |
| Add --json for automation or --network for explicit account validation. | 9 | Use “Use --json for scripts. Use --network to check Firebase access.” and test. |
| Usable environment | 2 | Clear result; keep. |
| Blocked, or caution with --strict | 5 | Use “Problem found; --strict also fails on warnings.” |
| Invalid invocation or unreadable input | 5 | Clear error; keep. |
| Firebase Environment Doctor · MIT licensed · no telemetry | 7 | Claim: test telemetry absence or remove. |

### README

| Text | Words | Flag / concrete fix |
| --- | ---: | --- |
| A read-only preflight for Firebase developers. | 6 | Jargon; use “A Firebase project check for developers.” |
| It answers the questions that matter before a risky command: which project is active, whether Firebase CLI credentials are usable, where emulators point, which rules files are loaded, and whether the current target looks like production. | 36 | >22; split into “Check your Firebase project before a risky command.” and “It checks the active project, login, emulators, and rules files.” |
| The doctor never deploys, edits Firebase configuration, or prints tokens. | 9 | Claim: test or remove. |
| Network checks are disabled unless you pass --network. | 8 | Claim: test or remove. |
| Download the binary for your platform from a GitHub release, or build it: | 12 | No release linked; use “Build from this source:” unless releases ship. |
| Version 0.1.0 is ready to package with cargo package (publishing is handled by the Param Factory). | 15 | Internal jargon; remove. |
| Run from a Firebase project directory or any child directory: | 10 | Clear instruction; keep. |
| Add explicit, documented Firebase CLI checks only when network access is okay: | 11 | Use “Use --network only when you want to check Firebase access.” |
| Automation receives a stable schema and no ANSI formatting: | 8 | Use “Use JSON output in scripts.”; test schema promise or remove. |
| Useful options: | 2 | Clear heading; keep. |
| Override project selection without changing files | 6 | Clear; keep. |
| Opt in to read-only Firebase account/project checks | 8 | Claim: test or remove. |
| Emit versioned machine-readable JSON | 4 | Use “Print JSON for scripts.” |
| Disable color and interactive behavior | 5 | Clear; keep. |
| Treat warnings as a failing exit status | 7 | Use “Exit with failure when warnings appear.” |
| Diagnose a specific directory | 4 | Clear; keep. |
| Exit codes are 0 for a usable environment, 1 when errors are found (or a warning with --strict), and 2 for invalid invocation or unreadable input. | 25 | >22; split into 0 ready, 1 problem, 2 invalid command/input. |
| Project selection order is --project, FIREBASE_PROJECT, GOOGLE_CLOUD_PROJECT, then .firebaserc's projects.default. | 8 | Claim/jargon: shorten precedence list and test. |
| Alias values are resolved through .firebaserc. | 5 | Claim/jargon: test or remove. |
| Production-like IDs (prod, production, or live as a segment) get a prominent warning. | 12 | Claim: test or remove. |
| Emulator environment variables are compared with firebase.json ports. | 7 | Use “The tool checks emulator addresses against firebase.json.” and test. |
| Rules hashes use SHA-256 and only the first 12 characters are printed in the card. | 14 | Jargon/claim: remove detail or test it. |
| Only documented, read-only Firebase CLI surfaces: | 5 | Use “With --network, the tool runs these read-only Firebase commands:”. |
| The first checks authentication; the second checks reachability and whether the selected project is visible. | 14 | False/unproven auth claim; remove until F-2-3 passes. |
| No repair, deploy, use, target, config:set, or other mutating command is ever invoked. | 13 | Claim: test subprocess allowlist or use “It does not change Firebase settings.” |
| Fields may be added in compatible releases; schema_version changes for a breaking representation change. | 12 | Developer jargon: move to API docs with contract tests. |
| Tests cover the documented project selection, wrong-project warning, expired-login, emulator mismatch, and JSON behavior. | 13 | False for realistic expired login; remove until F-2-3 passes. |
| Requirements: Rust 1.85+ and Node.js 20+. | 5 | Clear requirement; keep. |
| After deployment, npm run verify:live checks byte identity, response policy, privacy, desktop/390px rendering, keyboard behavior, and serious/critical axe findings against the production URL. | 21 | Internal contributor detail; move to contributor docs. |
| npm test runs Rust unit/integration tests and the static-site checks. | 9 | Contributor detail; retain only if maintained. |
| The full build produces the CLI in dist/bin/ and the deployable landing page in dist/site/. | 15 | Contributor jargon; move to contributor docs. |
| All analysis is local by default. | 6 | Claim: test or remove. |
| No telemetry, analytics, third-party scripts, or hosted fonts are used. | 9 | Claim: add browser/network test or remove. |
| The interactive website demo runs entirely in the browser and stores nothing. | 11 | Misleading/unlisted claim: replace after F-2-1 test. |
| See the live privacy page. | 5 | Clear link; keep. |
| MIT. | 1 | Clear; keep. |
| See LICENSE. | 2 | Clear; keep. |

## Structure checks

Passed: language, one h1, main landmark, self-hosted assets, no console errors,
no 390px horizontal overflow, and no serious/critical axe issue in the project
smoke suite. Rendered home links and Source returned HTTP 200 or were same-page
anchors. The visual identity is distinct.

Failed: F-2-5 routing/404/metadata and F-2-6 shared-shell/focus/mobile
requirements. Axe does not detect the dark focus contrast and undersized
type/targets.

## What would make this perfect

Make the sample a real temp-directory CLI run and prove its sandbox; register
and test every remaining promise; repair real no-login/expired-login
classification; replace first-screen/jargon-heavy copy; then finish /demo, 404,
metadata, shared shell, dark focus, 16px mobile text, and 44px targets. Re-run
the complete review against a newly deployed build.

