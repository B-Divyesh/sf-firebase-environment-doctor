# Adversarial first-read review 4 — Firebase Environment Doctor

**Work order:** firebase-environment-doctor-review-4  
**Reviewed:** 2026-08-28 UTC  
**Live URL:** https://firebase-environment-doctor.sociobot.in  
**Verdict:** **FAIL**

## Cold first read

I opened production in new Playwright contexts at 390×844 and 1440×1000 before scrolling.

- It checks a Firebase project before a deploy.
- It is for Firebase developers who need to catch project, sign-in, emulator, or rules-file problems before changing cloud data.
- Click **“Try sample project check”** first. The adjacent text says **“Shows a wrong-project result in this browser.”**

The evidence is **“Check your Firebase project before a deploy.”** and the named-user sentence beneath it. The headline is eight words and the audience sentence is 21 words. The primary action is visibly primary at 390px. No cold-read finding is raised. The paper-cut inspection bench is distinct rather than a generic SaaS template.

## Findings

### F-4-1 — BLOCKING — the browser demo falsely presents an edited transcript as the --demo result

**Earlier finding:** F-1-1 / F-2-1, reissued. The isolation portion is fixed, but the required real CLI terminal demonstration is only half fixed.

**Location / exact quote:** /demo/?demo=1 says **“This is the result from firebase-environment-doctor --demo.”** Its terminal says **“Verdict CAUTION · 0 errors · 3 warnings”**, but displays only two [warn] findings. It also omits two Emulator rows, the third CLI-not-found warning, and uses the invented value sha256:sample.

**Verification:** From an unrelated temporary directory, the clean-clone release binary printed the same project mismatch plus the two emulator rows, actual SHA-256 prefix ed1e7c11f025, the third warning “firebase CLI not found on PATH”, and all four next checks. The static pre at site/demo/index.html:29–43 is therefore not a recording of the real command it claims to show. No claims.json entry tests page-transcript fidelity.

**Why this blocks:** For a CLI, the sample terminal is the product demonstration. A first-time developer is shown a selectively reduced report while being told it is the command result. The demo is not an honest representation of the real job.

**Concrete fix:** Generate a deterministic terminal recording/transcript from the release binary against the bundled sample during the build, and render it on /demo; alternatively make the transcript byte-for-byte match the controlled command output. Include every result line or label a shortened display as an excerpt. Add a browser-demo-matches-cli claim whose clean-sandbox test runs --demo with the same controlled Firebase absence and compares the displayed normalized transcript to the output.

### F-4-2 — HIGH — the landing page omits the required three-step How it works explanation

**Location / evidence:** Home goes from the privacy strip to **“Check five Firebase settings.”** and then **“Install the Firebase project check.”** There is no How it works section and no three-step explanation of local check, reading results, and optional network check. This is confirmed by site/index.html:31–42.

**Why a visitor is lost:** The cards say what is inspected, but not the operating sequence. A visitor who does not take the demo cannot see the normal workflow or understand when --network belongs in it. This misses the required site skeleton.

**Concrete fix:** Add an h2, **“How to check a Firebase project”**, with three verb-led steps: **“Run the local check,” “Read the project and file results,”** and **“Choose the optional network check.”** Show the real command and a compact real-output excerpt; add a content test requiring the three steps.

## Claims and clean-clone verification

I cloned the repository to /tmp/firebase-doctor-review-4.pA41VA/repo. npm ci, npm test, and npm run build passed. npm test includes strict format/Clippy/TypeScript, Rust integration tests, site policy tests, Playwright/Axe, and the full claim suite. I invoked the registered filtered commands from that clean clone; the full suite and individual filtered runs passed. The sample browser claim command was also visibly re-run and passed.

| Claim id | Result |
| --- | --- |
| local-check-no-network | PASS |
| local-check-runs-locally | PASS |
| credential-values-hidden | PASS |
| read-only-firebase-commands | PASS |
| never-deploys | PASS |
| cli-demo-isolated | PASS |
| browser-demo-isolated | PASS |
| browser-demo-local-requests | PASS |
| website-no-tracking | PASS |
| five-firebase-checks | PASS |
| project-input-boundaries | PASS |
| next-step-guidance | PASS |
| project-selection | PASS |
| local-sign-in-details | PASS |
| emulator-address-check | PASS |
| rules-file-check | PASS |
| firebase-cli-presence | PASS |
| project-access | PASS |
| json-output | PASS |
| project-root-discovery | PASS |
| exit-codes | PASS |
| network-account-and-project-access | PASS |
| network-failure-classification | PASS |
| build-artifacts | PASS |

The registry covers landing and README reliance claims. No additional unlisted claim was found there. F-4-1 is an unlisted demo-page claim: its assertion that the static transcript is the real --demo result is neither true nor registered.

## Demo and privacy sandbox

The landing action reaches /demo/?demo=1 in one click. Its first screen shows a wrong-project report and the persistent **“Demo — sample data, nothing is saved”** banner with **Reset demo** and **Start for real**. In a fresh mobile context, the only storage state in demo was demo:firebase-environment-doctor:reset=active; there were no cookies or session keys. Reset removed that key and announced “Demo reset. Sample project check loaded.” Start for real returned home with no browser storage. Full-flow interception observed only the product origin and no console errors.

The release --demo command was run from a newly created unrelated temporary directory. It copied the sample to a new /tmp/firebase-environment-doctor-demo-* directory and did not use the caller’s project. No offline product promise exists, so no offline reload claim applies. The browser isolation is good; the transcript mismatch in F-4-1 remains blocking.

## Structure, accessibility, and links

Live /, /demo/, /privacy/, and /terms/ returned 200; an unknown route returned the designed 404 with status 404. robots.txt, sitemap.xml, favicon, Apple touch icon, share image, and the GitHub Source link returned 200. Each route has a route-appropriate title under 60 characters, one h1, lang=en, a description, canonical URL, OG and Twitter fields, favicon, common header/footer, Privacy/Terms links, and the factory/version footer. The local browser/Axe test passed serious and critical checks. Production had no console errors or horizontal overflow at 390px or desktop.

Current code provides focusable route h1 elements and route focus handling; the local Home → Demo → Back regression passes. The missing workflow is F-4-2. No generic-template finding is raised: local type, textured paper palette, chamfered slips, and original diorama follow the recorded design direction.

## Earlier-review verification

I read review-1.md, review-2.md, review-3.md, polish-2.md, polish-3.md, and the prior handoff. Each earlier finding was checked live and in code.

| Earlier finding | Current status |
| --- | --- |
| F-1-1 / F-2-1 | **Half-fixed; reissued as F-4-1.** URLs, banner, reset, demo: key, and CLI command work, but the web terminal is not the command result it claims to be. |
| F-1-2 / F-2-2 / F-3-2 | Fixed: 24 registered claims have tagged tests and landing/README claims map to them. |
| F-1-3 / F-2-3 | Fixed: current Rust fixtures cover empty account and expired credentials; the old expired-login demo claim is absent. |
| F-1-4 / F-2-4 | Fixed: the mobile hero names job, audience, primary sample action, and outcome. |
| F-1-5 / F-2-5 / F-3-1 | Fixed: direct routes, reloads, sitemap, 404, announcements, and h1 focus restoration are implemented and locally tested. |
| F-1-6 / F-2-5 / F-3-3 | Fixed: emitted routes carry canonical, OG, Twitter, favicon, and Apple-touch metadata. |
| F-1-7 / F-2-6 | Fixed: dark terminal focus is light; 390px tests assert 16px relevant text and 44px brand/footer targets. |
| F-1-8 / F-2-6 | Fixed: Privacy and Terms share the complete header/footer, legal links, attribution, and version. |
| F-1-9 / F-2-4 | Fixed for plain wording, headings, controls, and word limits; see the copy audit. |

No AI feature, import/export, or sync is an omitted expected capability. The researched brief is absent, and the product is deliberately a local diagnostic CLI; adding AI would be decorative. No provider key or runtime AI call is present.

## Copy audit

Counts are whitespace-separated. Literal commands, option tokens, raw terminal output, and the product name are code/output rather than prose sentences. The audit lists every visitor-facing landing and README sentence, heading, label, and control. No entry exceeds 22 words, uses a banned marketing adjective, has inconsistent terminology, or is a non-result-naming button. Claim rows have a matching claims.json entry except the demo transcript claim in F-4-1.

### Landing page

| Text | Words | Check |
| --- | ---: | --- |
| Skip to content | 3 | clear link |
| Demo | 1 | clear nav link |
| What it checks | 4 | clear nav link |
| Install | 1 | clear nav link |
| Privacy | 1 | clear nav link |
| Firebase project check | 3 | clear label |
| Check your Firebase project before a deploy. | 8 | clear h1 |
| For Firebase developers who need to catch wrong projects, sign-in issues, emulator mismatches, or missing rules files before changing cloud data. | 21 | clear audience |
| Try sample project check | 4 | result-naming action |
| Shows a wrong-project result in this browser. | 7 | clear outcome |
| Install the CLI | 3 | clear action |
| Runs locally by default | 4 | claim: local-check-runs-locally |
| Hides credential values | 3 | claim: credential-values-hidden |
| Does not deploy | 3 | claim: never-deploys |
| Check before changing cloud data. | 6 | clear caption |
| Your files stay on your computer | 6 | clear heading |
| The default check reads project files without a network request. | 10 | claim: local-check-no-network |
| Cloud check only when you ask | 6 | clear heading |
| --network runs read-only Firebase account and project checks. | 7 | claim: read-only-firebase-commands |
| Reports hide credentials | 3 | clear heading |
| Cards and JSON omit credential values. | 6 | claim: credential-values-hidden |
| Check five Firebase settings. | 5 | claim: five-firebase-checks |
| The tool reads your project files and Firebase CLI results. | 10 | claim: project-input-boundaries |
| It tells you what to check next. | 7 | claim: next-step-guidance |
| Selected project | 2 | clear h3 |
| Finds the project chosen by your command, environment, or project file. | 10 | claim: project-selection |
| Firebase access | 2 | clear h3 |
| Checks local sign-in details. | 4 | claim: local-sign-in-details |
| With --network, it checks Firebase access. | 6 | claim: project-access |
| Emulator addresses | 2 | clear h3 |
| Compares emulator addresses with firebase.json. | 5 | claim: emulator-address-check |
| Rules files | 2 | clear h3 |
| Checks that configured rules files exist. | 6 | claim: rules-file-check |
| Firebase CLI installed | 3 | clear h3 |
| Checks Firebase is installed. | 4 | claim: firebase-cli-presence |
| With --network, it checks project access. | 6 | claim: project-access |
| Install the Firebase project check. | 5 | clear h2 |
| Build it from this project source, then run it from a Firebase project directory. | 14 | clear instruction |
| Copy install command | 3 | result-naming button |
| Use --json for scripts. | 4 | claim: json-output |
| Use --network to check Firebase access. | 6 | claim: project-access |
| Use --demo for the bundled sample. | 6 | claim: cli-demo-isolated |
| No blocking problem. | 3 | claim: exit-codes |
| Problem found; --strict also fails on warnings. | 6 | claim: exit-codes |
| Invalid command or unreadable input. | 5 | claim: exit-codes |
| Source (opens GitHub) | 3 | clear external link |
| Terms | 1 | clear link |
| Built by Param Factory | 4 | clear attribution |

### README

| Text | Words | Check |
| --- | ---: | --- |
| A Firebase project check for developers. | 6 | clear introduction |
| Check your Firebase project before a risky command. | 8 | clear instruction |
| It reports the selected project, sign-in details, emulator addresses, rules files, and Firebase CLI status. | 14 | claim: five-firebase-checks |
| The default check reads project files without a network request. | 10 | claim: local-check-no-network |
| With --network, it runs only read-only Firebase commands. | 8 | claim: read-only-firebase-commands |
| Reports hide credential values. | 4 | claim: credential-values-hidden |
| Build from this source. | 4 | clear instruction |
| Run from a Firebase project directory or one of its subdirectories. | 10 | claim: project-root-discovery |
| Use --network only when you want Firebase access checked. | 9 | claim: project-access |
| Use JSON output in scripts. | 5 | claim: json-output |
| Select a project without changing files. | 6 | claim: project-selection |
| Check Firebase access with read-only commands. | 6 | claim: read-only-firebase-commands |
| Print JSON for scripts. | 4 | claim: json-output |
| Exit with failure when warnings appear. | 6 | claim: exit-codes |
| Diagnose a specific directory. | 4 | claim: project-root-discovery |
| Run the bundled sample project check. | 6 | claim: cli-demo-isolated |
| Exit code 0 means no blocking problem. | 7 | claim: exit-codes |
| Exit code 1 means a problem was found. | 8 | claim: exit-codes |
| --strict also returns 1 for warnings. | 5 | claim: exit-codes |
| Exit code 2 means the command or input was invalid. | 10 | claim: exit-codes |
| Run the same sample shown on the website. | 8 | claims: cli-demo-isolated, browser-demo-isolated |
| The command copies the bundled project to a new temporary directory and prints that directory. | 14 | claim: cli-demo-isolated |
| The sample selects sample-store-prod while its project file defaults to sample-store-dev. | 12 | claims: cli-demo-isolated, browser-demo-isolated |
| With --network, the tool runs these read-only Firebase commands. | 9 | claim: read-only-firebase-commands |
| The project check requires a listed Firebase account and checks project access. | 11 | claim: network-account-and-project-access |
| It reports sign-in, permission, and network failures separately. | 8 | claim: network-failure-classification |
| The website demo uses bundled sample data. | 7 | claim: browser-demo-isolated |
| Reset removes its demo-only browser state. | 6 | claim: browser-demo-isolated |
| The demo sends requests only to this site. | 8 | claim: browser-demo-local-requests |
| Requirements: Rust 1.85+ and Node.js 20+. | 5 | contributor requirement |
| npm run build creates the CLI in dist/bin/ and the static site in dist/site/. | 13 | claim: build-artifacts |
| Deploy dist/site/ through the factory static work order. | 8 | deployment instruction |
| MIT. | 1 | license |

## What would make this perfect

Make the demo terminal a verifiable, complete recording of the release binary and add the missing three-step workflow section. Re-run the clean-clone claim matrix, including the new transcript-fidelity claim, and the site can be reviewed for PASS.

