# Copy audit — 2026-08-28, polish 4

Commands, option names, terminal output, the product name, and the decorative
check mark are excluded from sentence counts. Every visitor-facing sentence is
22 words or fewer. No banned marketing wording appears.

## Landing page

| Text | Words | Audit |
| --- | ---: | --- |
| Skip to content | 3 | Clear link |
| Demo | 1 | Clear nav link |
| What it checks | 4 | Clear nav link |
| Install | 1 | Clear nav link |
| Privacy | 1 | Clear nav link |
| Firebase project check | 3 | Clear label |
| Check your Firebase project before a deploy. | 8 | Clear h1 |
| For Firebase developers who need to catch wrong projects, sign-in issues, emulator mismatches, or missing rules files before changing cloud data. | 21 | Clear audience and situation |
| Try sample project check | 4 | Names result |
| Shows a wrong-project result in this browser. | 7 | States outcome |
| Install the CLI | 3 | Clear secondary action |
| Runs locally by default | 4 | Claim: `local-check-runs-locally` |
| Hides credential values | 3 | Claim: `credential-values-hidden` |
| Does not deploy | 3 | Claim: `never-deploys` |
| Check before changing cloud data. | 6 | Clear image caption |
| Your files stay on your computer | 6 | Clear heading |
| The default check reads project files without a network request. | 10 | Claim: `local-check-no-network` |
| Cloud check only when you ask | 6 | Clear heading |
| --network runs read-only Firebase account and project checks. | 7 | Claim: `read-only-firebase-commands` |
| Reports hide credentials | 3 | Clear heading |
| Cards and JSON omit credential values. | 6 | Claim: `credential-values-hidden` |
| How it works | 3 | Clear label |
| How to check a Firebase project | 6 | Clear workflow heading |
| Start with local files. | 4 | Claim: `local-check-runs-locally` |
| Add the network check only when you need Firebase access confirmed. | 11 | Claim: `project-access` |
| Run the local check | 4 | Verb-led step |
| Open a Firebase project directory and run. | 7 | Clear instruction |
| Read the project and file results | 6 | Verb-led step |
| Confirm the selected project. | 4 | Clear instruction |
| Then follow the next check for each finding. | 8 | Claim: `next-step-guidance` |
| Choose the optional network check | 5 | Verb-led step |
| Use this only when you want the tool to check Firebase access. | 12 | Claim: `project-access` |
| Check five Firebase settings. | 5 | Claim: `five-firebase-checks` |
| The tool reads your project files and Firebase CLI results. | 10 | Claim: `project-input-boundaries` |
| It tells you what to check next. | 7 | Claim: `next-step-guidance` |
| Selected project | 2 | Clear h3 |
| Finds the project chosen by your command, environment, or project file. | 10 | Claim: `project-selection` |
| Firebase access | 2 | Clear h3 |
| Checks local sign-in details. | 4 | Claim: `local-sign-in-details` |
| With --network, it checks Firebase access. | 6 | Claim: `project-access` |
| Emulator addresses | 2 | Clear h3 |
| Compares emulator addresses with firebase.json. | 5 | Claim: `emulator-address-check` |
| Rules files | 2 | Clear h3 |
| Checks that configured rules files exist. | 6 | Claim: `rules-file-check` |
| Firebase CLI installed | 3 | Clear h3 |
| Checks Firebase is installed. | 4 | Claim: `firebase-cli-presence` |
| With --network, it checks project access. | 6 | Claim: `project-access` |
| Install the Firebase project check. | 5 | Clear h2 |
| Build it from this project source, then run it from a Firebase project directory. | 14 | Clear instruction |
| Copy install command | 3 | Names result |
| Use --json for scripts. | 4 | Claim: `json-output` |
| Use --network to check Firebase access. | 6 | Claim: `project-access` |
| Use --demo for the bundled sample. | 6 | Claim: `cli-demo-isolated` |
| No blocking problem. | 3 | Claim: `exit-codes` |
| Problem found; --strict also fails on warnings. | 6 | Claim: `exit-codes` |
| Invalid command or unreadable input. | 5 | Claim: `exit-codes` |
| Source (opens GitHub) | 3 | Clear external link |
| Terms | 1 | Clear link |
| Built by Param Factory | 4 | Clear attribution |

## README

| Text | Words | Audit |
| --- | ---: | --- |
| A Firebase project check for developers. | 6 | Clear introduction |
| Check your Firebase project before a risky command. | 8 | Clear instruction |
| It reports the selected project, sign-in details, emulator addresses, rules files, and Firebase CLI status. | 14 | Claim: `five-firebase-checks` |
| The default check reads project files without a network request. | 10 | Claim: `local-check-no-network` |
| With --network, it runs only read-only Firebase commands. | 8 | Claim: `read-only-firebase-commands` |
| Reports hide credential values. | 4 | Claim: `credential-values-hidden` |
| Build from this source. | 4 | Clear instruction |
| Run from a Firebase project directory or one of its subdirectories. | 10 | Claim: `project-root-discovery` |
| Use --network only when you want Firebase access checked. | 9 | Claim: `project-access` |
| Use JSON output in scripts. | 5 | Claim: `json-output` |
| Select a project without changing files. | 6 | Claim: `project-selection` |
| Check Firebase access with read-only commands. | 6 | Claim: `read-only-firebase-commands` |
| Print JSON for scripts. | 4 | Claim: `json-output` |
| Exit with failure when warnings appear. | 6 | Claim: `exit-codes` |
| Diagnose a specific directory. | 4 | Claim: `project-root-discovery` |
| Run the bundled sample project check. | 6 | Claim: `cli-demo-isolated` |
| Exit code 0 means no blocking problem. | 7 | Claim: `exit-codes` |
| Exit code 1 means a problem was found. | 8 | Claim: `exit-codes` |
| --strict also returns 1 for warnings. | 5 | Claim: `exit-codes` |
| Exit code 2 means the command or input was invalid. | 10 | Claim: `exit-codes` |
| Run the same sample shown on the website. | 8 | Claims: `cli-demo-isolated`, `browser-demo-isolated` |
| The command copies the bundled project to a new temporary directory and prints that directory. | 14 | Claim: `cli-demo-isolated` |
| The sample selects sample-store-prod while its project file defaults to sample-store-dev. | 12 | Claims: `cli-demo-isolated`, `browser-demo-isolated` |
| The website transcript is generated from this release command during every site build. | 12 | Claim: `browser-demo-matches-cli` |
| With --network, the tool runs these read-only Firebase commands. | 9 | Claim: `read-only-firebase-commands` |
| The project check requires a listed Firebase account and checks project access. | 11 | Claim: `network-account-and-project-access` |
| It reports sign-in, permission, and network failures separately. | 8 | Claim: `network-failure-classification` |
| The website demo uses bundled sample data. | 7 | Claim: `browser-demo-isolated` |
| Reset removes its demo-only browser state. | 6 | Claim: `browser-demo-isolated` |
| The demo sends requests only to this site. | 8 | Claim: `browser-demo-local-requests` |
| Requirements: Rust 1.85+ and Node.js 20+. | 5 | Contributor requirement |
| npm run build creates the CLI in dist/bin/ and the static site in dist/site/. | 13 | Claim: `build-artifacts` |
| Deploy dist/site/ through the factory static work order. | 8 | Deployment instruction |
| MIT. | 1 | License |

## Terminology

| Concept | One term used |
| --- | --- |
| Product action | Firebase project check |
| Sample | bundled sample project |
| Cloud access | Firebase access |
| Login state | sign-in |
| Local configuration folder | project directory |
| Unsafe target | wrong project |
| Rules configuration | rules files |
