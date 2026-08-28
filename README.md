# Firebase Environment Doctor

A read-only preflight for Firebase developers. It answers the questions that
matter before a risky command: which project is active, whether Firebase CLI
credentials are usable, where emulators point, which rules files are loaded,
and whether the current target looks like production.

The doctor never deploys, edits Firebase configuration, or prints tokens.
Network checks are disabled unless you pass `--network`.

## Install

Download the binary for your platform from a GitHub release, or build it:

```sh
cargo install --path .
```

Version 0.1.0 is ready to package with `cargo package` (publishing is handled by
the Param Factory).

## Usage

Run from a Firebase project directory or any child directory:

```console
$ firebase-environment-doctor
FIREBASE ENVIRONMENT DOCTOR · READ-ONLY PREFLIGHT
Project   my-app-dev · from .firebaserc (default)
Target    CLOUD · remote project selected
CLI       firebase 14.12.0 · found
Auth      cached session found · not validated (offline)
Rules     firestore.rules · sha256:830e8b7c4bb7
Verdict   CAUTION · 1 warning
```

Add explicit, documented Firebase CLI checks only when network access is okay:

```sh
firebase-environment-doctor --network
```

Automation receives a stable schema and no ANSI formatting:

```sh
firebase-environment-doctor --json --project my-app-dev > doctor.json
firebase-environment-doctor --ci --network
```

Useful options:

```text
--project <ID_OR_ALIAS>  Override project selection without changing files
--network                Opt in to read-only Firebase account/project checks
--json                   Emit versioned machine-readable JSON
--ci                     Disable color and interactive behavior
--strict                 Treat warnings as a failing exit status
--root <PATH>            Diagnose a specific directory
```

Exit codes are `0` for a usable environment, `1` when errors are found (or a
warning with `--strict`), and `2` for invalid invocation or unreadable input.

Project selection order is `--project`, `FIREBASE_PROJECT`,
`GOOGLE_CLOUD_PROJECT`, then `.firebaserc`'s `projects.default`. Alias values
are resolved through `.firebaserc`. Production-like IDs (`prod`, `production`,
or `live` as a segment) get a prominent warning. Emulator environment
variables are compared with `firebase.json` ports. Rules hashes use SHA-256 and
only the first 12 characters are printed in the card.

### What network mode runs

Only documented, read-only Firebase CLI surfaces:

```text
firebase login:list --json
firebase projects:list --json
```

The first checks authentication; the second checks reachability and whether
the selected project is visible. No repair, deploy, use, target, config:set, or
other mutating command is ever invoked.

## Example JSON

```json
{
  "schema_version": 1,
  "verdict": "caution",
  "project": { "id": "my-app-dev", "source": ".firebaserc (default)", "production_like": false },
  "network_opt_in": false,
  "findings": []
}
```

Fields may be added in compatible releases; `schema_version` changes for a
breaking representation change. Tests cover the documented project selection,
wrong-project warning, expired-login, emulator mismatch, and JSON behavior.

## Develop and verify

Requirements: Rust 1.85+ and Node.js 20+.

```sh
npm install
npm run lint
npm test
npm run build
npm run build:site   # static site only -> dist/site
cargo package
```

`npm test` runs Rust unit/integration tests and the static-site checks. The
full build produces the CLI in `dist/bin/` and the deployable landing page in
`dist/site/`.

## Privacy and safety

All analysis is local by default. No telemetry, analytics, third-party scripts,
or hosted fonts are used. The interactive website demo runs entirely in the
browser and stores nothing. See the live [privacy page](https://firebase-environment-doctor.sociobot.in/privacy/).

## License

MIT. See [LICENSE](LICENSE).
