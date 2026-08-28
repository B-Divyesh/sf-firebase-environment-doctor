# Adversarial first-read review 1 — Firebase Environment Doctor

**Work order:** firebase-environment-doctor-review-1  
**Reviewed:** 2026-08-28 UTC  
**Live URL:** https://firebase-environment-doctor.sociobot.in  
**Verdict:** **FAIL**

## Method and cold first read

I opened the live site in brand-new Playwright contexts at 390×844 and
1440×1000 before scrolling. I exercised the visible sample link, /demo, the
CLI from a clean clone, live links, routes, metadata, storage, network origins,
and every prior QA record.

From the first mobile screen I can infer a read-only command-line check for
Firebase settings. I cannot establish **who** should use it: it names Firebase
but never says “Firebase developers” or their triggering situation. I also
cannot establish **what to click first**: the first-screen actions “Install the
doctor” and “Run a sample diagnosis” compete without saying which is primary or
what happens next. This is blocking.

Exact failing text:

- “Know the target before you debug.” It is a slogan, not the concrete job.
- “One local command checks the active Firebase project, credential state,
  emulator endpoints, rules hashes, and CLI reachability—before a write command
  gets the chance.” It names technical checks, not the intended person.
- “Install the doctor” / “Run a sample diagnosis.” Neither says the first
  visitor action and its outcome.

The paper-cut workbench is distinct from a generic SaaS template. That does not
offset the findings below.

## Findings

### F-1-1 — BLOCKING — no real, isolated one-click CLI demo

**Location / evidence:** “Run a sample diagnosis” changes only the URL to
/#demo and scrolls to prewritten terminal text. /demo returns byte-identical
home HTML, with the home title and h1. There is no “Demo — sample data, nothing
is saved” banner, Reset demo, Start for real, or demo namespace. The clean-clone
release binary rejects the required CLI entry:

    error: unexpected argument '--demo' found
    Usage: firebase-environment-doctor [OPTIONS]

There is no .factory/demo.md, examples/ fixture, or recording of the real
binary run. In a new browser context the link left local/session storage empty,
but that is not an isolated, resettable demo.

**Why it fails:** A visitor cannot try the real job without setup. A verifier
cannot exercise a stable temporary-directory sample.

**Fix:** Ship realistic Firebase fixtures and firebase-environment-doctor
--demo (or a demo subcommand) that copies them to a temp directory, runs the
real binary, and prints the output directory. Make /demo immediately show that
sample result, a persistent demo banner, working Reset demo and Start for real,
and document the URL, command, fixtures, reset, and namespace in
.factory/demo.md. Add a temp-directory regression test.

### F-1-2 — BLOCKING — claims registry and claim tests are absent

**Location / evidence:** .factory/claims.json does not exist. Therefore no
listed claim command could be run from the clean clone and no test is tagged
@claim:<id>. Unlisted reliance claims include “Offline by default”, “Never
prints tokens”, “Never deploys”, “Reads Firebase project files without sending
them anywhere”, “Cloud checks run only with --network”, “Stable JSON and cards
omit credential values”, “The browser demo is local and makes no requests”,
“All analysis is local by default”, “No telemetry, analytics, third-party
scripts, or hosted fonts are used”, and “The interactive website demo runs
entirely in the browser and stores nothing.”

**Why it fails:** These privacy, safety, and behaviour promises have no
defined clean-sandbox proof.

**Fix:** Add one claims.json record and one observable, tagged, fresh-sandbox
test for every retained claim: at least no network by default, opt-in network,
no mutating subprocess, token suppression, demo reset/isolation, and browser
request interception. Remove claims that cannot be tested.

### F-1-3 — BLOCKING — “Expired login diagnosed” remains false or unproven

**Location / evidence:** The live terminal tab says “Expired login diagnosed”
and “× BLOCKED · Firebase login expired”. The earlier
.factory/verification-2.md reproduced real Firebase Tools 14.12.0 returning
successful {"status":"success"} for an isolated no-account login:list and
showed the shipped CLI reporting “Firebase login validated” plus
cloud_unreachable. Current src/lib.rs:689–717 still accepts every successful,
parseable login:list JSON as validation and labels a failed projects:list as
cloud unreachability. No repair or realistic regression test exists.

**Why it fails:** The product claims it identifies the failure whose category it
can currently misreport, sending the developer toward the wrong fix.

**Fix:** Require a non-empty authorized account; distinguish auth rejection
from connectivity with the network-validating result; test real no-account JSON
and “login list succeeds, projects list rejects expired credentials.” Remove the
demo claim until that fixture passes.

### F-1-4 — BLOCKING — first screen lacks a named user and a single result action

**Location / evidence:** At 390px the page shows “Know the target before you
debug.”, the 23-word technical sentence, and two competing actions. It never
says who it is for.

**Why it fails:** A cold visitor must infer both relevance and first action.

**Fix:** Use: **“Check your Firebase project before a deploy”**; **“For Firebase
developers who need to catch the wrong project, login, emulator, or rules file
before changing cloud data.”**; primary **“Try sample project check”**; outcome
**“Shows a wrong-project result in this browser.”** Keep “Install the CLI” as
the secondary action.

### F-1-5 — BLOCKING — demo route and designed 404 are missing

**Location / evidence:** /demo serves the home page, retaining title “Firebase
Environment Doctor — Know your target before you debug” and home h1.
/not-a-real-route also responds 200 with the home page. sitemap.xml omits /demo.
There is no route change, focus move, or polite route announcement.

**Why it fails:** A direct demo link, reload, browser history, screen reader,
and a bad URL do not describe a real page.

**Fix:** Implement /demo, list it in sitemap, and set a distinct Demo title and
h1. Add an accessible styled 404 with a Home action and status 404. Test direct
load, reload, Back, focus, and announcement on route changes.

### F-1-6 — BLOCKING — canonical and share metadata are absent

**Location / evidence:** Home, Privacy, Terms, and /demo contain no canonical
link, OG metadata, or Twitter metadata. Only an SVG favicon is supplied; no
180px apple-touch icon is present. The home title is 64 characters, over the
60-character limit; /demo has no demo-specific title.

**Why it fails:** Canonical indexing and rich sharing are unspecified, while
the demo cannot be distinguished from home.

**Fix:** Add per-route ≤60-character titles, canonical links, plain
descriptions, OG/Twitter title/description/1200×630 original image, favicon,
and apple-touch icon. Example: “Firebase Environment Doctor — Check Firebase
projects”.

### F-1-7 — BLOCKING — all unresolved historical QA findings remain

**Location / evidence:** No earlier review-* or polish-* files exist. I read
.factory/handoff.md, .factory/verification.md, and
.factory/verification-2.md. Each remaining issue is confirmed:

- Auth classification is confirmed again by F-1-3.
- The global focus rule is 3px #17243B (site/src/styles.css:65–68), exactly the
  dark .command background. The focusable install command and Copy button have
  no distinguishable dark-surface focus indicator.
- At 390px, terminal is .75rem, small-note .74rem, safety/check text
  .76–.78rem, and the command button .72rem (about 11.5–12.5px), despite the
  design document's 16–18px body target.
- The mobile brand hides its text and leaves a 34px mark; Source and Terms are
  narrow text links. The stated 44×44 target floor is not met.

**Why it fails:** Keyboard focus is invisible and phone instructions/actions
are too small. The core credential finding is still misleading.

**Fix:** Use a contrasting ≥3:1 focus ring on dark panels; make informational
and control text 16px minimum on mobile; give brand/footer controls 44×44 hit
areas. Add visual-focus, computed-style, and target-geometry regression tests.

### F-1-8 — HIGH — legal pages lack the common header and footer

**Location / evidence:** Home offers Source, Privacy, and Terms. Privacy offers
only Home and Terms; Terms offers only Home and Privacy. No footer includes
“Built by Param Factory” or a version/build id.

**Why it fails:** The legal pages lack a visible route to the other legal page
and use a different site skeleton.

**Fix:** Render one shared shell on every route. Keep Privacy and Terms visible,
and add the factory attribution and version/build identifier.

### F-1-9 — HIGH — copy is too long, technical, and contextless

**Location / evidence:** The full audit below flags the hero's 23-word sentence,
README's 36-word opening, unexplained “SHA-256”, “CLI reachability”, “root
categories”, and “command surface”. “Know the target before you debug.”, “See
the failure before it costs you.”, “A small surface for a messy environment.”,
and “Put the check beside the code.” do not describe their sections by
themselves. “Install the doctor”, “Run a sample diagnosis”, “Try the demo”, and
“Checks” are not result-naming controls.

**Why it fails:** The visitor has to decode metaphors and implementation nouns
before knowing the job or next step.

**Fix:** Use the F-1-4 first-screen rewrite. Use “Firebase project check”
consistently, and rename controls “Try sample project check”, “View checks”,
and “Copy install command”. Split the long sentences as specified below.

## Claim-test result

There is no claims registry. Consequently there were zero listed claim commands
to run, which is a failure rather than a pass. General clean-clone checks did
pass in /tmp/firebase-doctor-review.DjRyXC/repo:

    npm ci       PASS
    npm test     PASS
    npm run build PASS

No @claim: tag exists.

## Demo/privacy sandbox result

The sample link produced a static wrong-project terminal result and only
same-origin requests; browser local/session storage remained empty. It did not
enter a demo mode. Since there is no banner, reset, namespace, real-data
boundary, or real CLI demo command, privacy interception cannot prove the
promised demo/CLI behaviour. This confirms F-1-1 and F-1-2.

## Copy audit

Word counts use whitespace tokens. All visitor-facing prose, headings, labels,
and controls are listed. ⚑ means the item needs the F-1-9 rewrite or a matching
claim test.

### Landing page

| Text | Words | Audit |
| --- | ---: | --- |
| Read-only terminal preflight | 3 | ⚑ jargon |
| Know the target before you debug. | 7 | ⚑ contextless |
| One local command checks the active Firebase project, credential state, emulator endpoints, rules hashes, and CLI reachability—before a write command gets the chance. | 23 | ⚑ >22; jargon |
| Install the doctor | 3 | ⚑ vague action |
| Run a sample diagnosis | 4 | ⚑ does not name a result |
| Offline by default | 3 | ⚑ claim |
| Never prints tokens | 3 | ⚑ claim |
| Never deploys | 2 | ⚑ claim |
| Inspect first. Debug second. | 4 | ⚑ slogan |
| Local first | 2 | ⚑ unclear heading |
| Reads Firebase project files without sending them anywhere. | 8 | ⚑ claim |
| Explicit network opt-in | 3 | ⚑ jargon |
| Cloud checks run only with --network. | 6 | ⚑ claim |
| Shareable, not secret | 3 | ⚑ unclear heading |
| Stable JSON and cards omit credential values. | 7 | ⚑ claim/jargon |
| Recorded fixture bench | 3 | ⚑ jargon |
| See the failure before it costs you. | 8 | ⚑ contextless heading |
| These are the exact root categories covered by the CLI test fixtures. | 12 | ⚑ jargon/claim |
| The browser demo is local and makes no requests. | 10 | ⚑ claim |
| Wrong project | 2 | clear result label |
| Expired login | 2 | ⚑ unsupported claim |
| Emulator mismatch | 2 | clear result label |
| Use Tab to enter, then ← and → to change cases. | 10 | clear instruction |
| Project context mismatch | 3 | clear result |
| FIREBASE_PROJECT selects “studio-api-prod”. | 2 | ⚑ unexplained variable |
| Confirm this ID before any write command. | 7 | clear instruction |
| Firebase login expired | 3 | ⚑ unsupported claim |
| Run firebase login, then repeat with --network. | 6 | ⚑ code jargon |
| No token or credential value was printed. | 7 | ⚑ claim |
| Emulator endpoint mismatch | 3 | clear result |
| Align FIRESTORE_EMULATOR_HOST or unset it to use the cloud service intentionally. | 9 | ⚑ unexplained variable |
| Five checks, one answer | 4 | ⚑ slogan |
| A small surface for a messy environment. | 7 | ⚑ contextless heading |
| The doctor uses the configuration already in your repository and documented Firebase CLI surfaces. | 14 | ⚑ jargon |
| It does not try to repair or reinterpret your setup. | 10 | ⚑ claim |
| Resolves flags, environment variables, aliases, and the default project. | 9 | ⚑ jargon |
| Finds local credential markers, then validates only when you opt in. | 10 | ⚑ claim/jargon |
| Compares environment endpoints with ports declared in firebase.json. | 7 | ⚑ jargon |
| Verifies configured files and fingerprints each one with SHA-256. | 8 | ⚑ jargon/claim |
| Checks the Firebase binary locally and project visibility on request. | 10 | ⚑ claim |
| Version 0.1.0 | 2 | version claim |
| Put the check beside the code. | 7 | ⚑ contextless heading |
| Build the single binary with Rust today. | 7 | ⚑ jargon |
| Release downloads can be attached by the factory without changing the command surface. | 12 | ⚑ internal jargon |
| Copy install command | 3 | clear result verb |
| Then run firebase-environment-doctor from your Firebase project. | 6 | clear instruction |
| Add --json for automation or --network for explicit account validation. | 9 | ⚑ jargon/claim |
| Usable environment | 2 | clear result |
| Blocked, or caution with --strict | 5 | ⚑ jargon |
| Invalid invocation or unreadable input | 5 | clear error |
| Firebase Environment Doctor · MIT licensed · no telemetry | 7 | ⚑ claim |

### README

| Text | Words | Audit |
| --- | ---: | --- |
| A read-only preflight for Firebase developers. | 6 | ⚑ replace preflight with check |
| It answers the questions that matter before a risky command: which project is active, whether Firebase CLI credentials are usable, where emulators point, which rules files are loaded, and whether the current target looks like production. | 36 | ⚑ >22; jargon |
| The doctor never deploys, edits Firebase configuration, or prints tokens. | 9 | ⚑ claim |
| Network checks are disabled unless you pass --network. | 8 | ⚑ claim |
| Download the binary for your platform from a GitHub release, or build it: | 12 | ⚑ unavailable-release direction |
| Version 0.1.0 is ready to package with cargo package (publishing is handled by the Param Factory). | 15 | ⚑ internal jargon/claim |
| Run from a Firebase project directory or any child directory: | 10 | clear instruction |
| Add explicit, documented Firebase CLI checks only when network access is okay: | 11 | ⚑ jargon |
| Automation receives a stable schema and no ANSI formatting: | 8 | ⚑ claim/jargon |
| Useful options: | 2 | clear heading |
| Override project selection without changing files | 6 | clear option |
| Opt in to read-only Firebase account/project checks | 8 | ⚑ claim |
| Emit versioned machine-readable JSON | 4 | ⚑ jargon |
| Disable color and interactive behavior | 5 | clear option |
| Treat warnings as a failing exit status | 7 | ⚑ jargon |
| Diagnose a specific directory | 4 | clear option |
| Exit codes are 0 for a usable environment, 1 when errors are found (or a warning with --strict), and 2 for invalid invocation or unreadable input. | 25 | ⚑ >22; jargon |
| Project selection order is --project, FIREBASE_PROJECT, GOOGLE_CLOUD_PROJECT, then .firebaserc's projects.default. | 8 | ⚑ claim/jargon |
| Alias values are resolved through .firebaserc. | 5 | ⚑ claim/jargon |
| Production-like IDs (prod, production, or live as a segment) get a prominent warning. | 12 | ⚑ claim |
| Emulator environment variables are compared with firebase.json ports. | 7 | ⚑ claim/jargon |
| Rules hashes use SHA-256 and only the first 12 characters are printed in the card. | 14 | ⚑ claim/jargon |
| Only documented, read-only Firebase CLI surfaces: | 5 | ⚑ jargon |
| The first checks authentication; the second checks reachability and whether the selected project is visible. | 14 | ⚑ claim |
| No repair, deploy, use, target, config:set, or other mutating command is ever invoked. | 13 | ⚑ claim/jargon |
| Fields may be added in compatible releases; schema_version changes for a breaking representation change. | 12 | ⚑ claim/jargon |
| Tests cover the documented project selection, wrong-project warning, expired-login, emulator mismatch, and JSON behavior. | 13 | ⚑ claim; see F-1-3 |
| Requirements: Rust 1.85+ and Node.js 20+. | 5 | clear requirement |
| After deployment, npm run verify:live checks byte identity, response policy, privacy, desktop/390px rendering, keyboard behavior, and serious/critical axe findings against the production URL. | 21 | ⚑ claim/jargon |
| npm test runs Rust unit/integration tests and the static-site checks. | 9 | ⚑ claim/jargon |
| The full build produces the CLI in dist/bin/ and the deployable landing page in dist/site/. | 15 | ⚑ claim/jargon |
| All analysis is local by default. | 6 | ⚑ claim |
| No telemetry, analytics, third-party scripts, or hosted fonts are used. | 9 | ⚑ claim |
| The interactive website demo runs entirely in the browser and stores nothing. | 11 | ⚑ claim; see F-1-1 |
| See the live privacy page. | 5 | clear link |
| MIT. | 1 | clear |
| See LICENSE. | 2 | clear |

Required long-copy rewrites:

- Hero: “Check your Firebase project, login, emulators, and rules before a
  command changes cloud data.” (16 words)
- README opening: “Check your Firebase project before a risky command.” (9)
  “It checks the active project, login, emulators, and rules files.” (11)
- Exit codes: “Exit 0 means ready.” “Exit 1 means a problem.” “Exit 2 means
  the command or input is invalid.”
- Network text: “With --network, the tool reads Firebase account and project
  information.” “It never writes Firebase settings.”

## Structure and link checks

- lang, one h1, main landmark, self-hosted assets, no console errors, and only
  same-origin page requests were observed.
- All rendered home links returned 200 or were valid same-page anchors; the
  GitHub source returned 200.
- Privacy and Terms have titles/descriptions, but fail F-1-6 and F-1-8.
- The visual identity is distinct, but required /demo, 404, route behaviour,
  and share metadata are not present.

## What would make this perfect

Ship and prove a real temp-directory CLI demo; make /demo a resettable,
bannered sandbox; register and test every visitor claim; repair actual auth
classification; replace the first-screen copy/action; then finish routing,
metadata, common shell, focus, target-size, and mobile-type repairs. Re-run the
complete review only after those changes are live.

