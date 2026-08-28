# Firebase Environment Doctor

A Firebase project check for developers. Check your Firebase project before a
risky command. It reports the selected project, sign-in details, emulator
addresses, rules files, and Firebase CLI status.

The default check reads project files without a network request. With
`--network`, it runs only read-only Firebase commands. Reports hide credential
values.

## Install

Build from this source:

```sh
cargo install --path .
```

## Usage

Run from a Firebase project directory or one of its subdirectories:

```sh
firebase-environment-doctor
```

Use `--network` only when you want Firebase access checked:

```sh
firebase-environment-doctor --network
```

Use JSON output in scripts:

```sh
firebase-environment-doctor --json --project my-app-dev > doctor.json
```

Useful options:

```text
--project <ID_OR_ALIAS>  Select a project without changing files
--network                Check Firebase access with read-only commands
--json                   Print JSON for scripts
--strict                 Exit with failure when warnings appear
--root <PATH>            Diagnose a specific directory
--demo                   Run the bundled sample project check
```

Exit code `0` means no blocking problem. Exit code `1` means a problem was
found. `--strict` also returns `1` for warnings. Exit code `2` means the command
or input was invalid.

## Try the sample

Run the same sample shown on the website:

```sh
firebase-environment-doctor --demo
```

The command copies the bundled project to a new temporary directory and prints
that directory. The sample selects `sample-store-prod` while its project file
defaults to `sample-store-dev`.

## What network mode runs

With `--network`, the tool runs these read-only Firebase commands:

```text
firebase login:list --json
firebase projects:list --json
```

The project check requires a listed Firebase account and checks project access.
It reports sign-in, permission, and network failures separately.

## Website demo and privacy

The website demo uses bundled sample data. Reset removes its demo-only browser
state. The demo sends requests only to this site. See the live
[privacy page](https://firebase-environment-doctor.sociobot.in/privacy/).

## Develop, test, package, and deploy

Requirements: Rust 1.85+ and Node.js 20+.

```sh
npm ci
npm test
npm run build
cargo package --locked
```

`npm run build` creates the CLI in `dist/bin/` and the static site in
`dist/site/`. Deploy `dist/site/` through the factory static work order.

## License

MIT. See [LICENSE](LICENSE).
