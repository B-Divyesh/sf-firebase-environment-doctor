# Independent verification 2 — FAIL

**Work order:** `firebase-environment-doctor-verify-2`  
**Candidate:** `a4f32de7f8aa2a007a3f40cb15020bd8228c2675`  
**Live URL:** https://firebase-environment-doctor.sociobot.in/  
**Date:** 2026-08-28 UTC

## Verdict

**FAIL.** The candidate builds, packages, and deploys cleanly, and the live site
is byte-identical to the candidate. However, the CLI does not reliably identify
the required expired/no-login root category when used with the real Firebase
CLI. It can say `Firebase login validated` when `firebase login:list --json`
reports no authorized account, then misclassify the resulting failure as
`cloud_unreachable`. That contradicts the brief's core credential-validity job
and its explicit success measure.

No product code was modified during this verification.

## Clean-checkout gates

Verification ran from a detached, clean worktree at the exact candidate SHA.
Environment: Node `v22.23.2`, npm `10.9.8`, Rust/Cargo `1.98.0`.

| Check | Result | Evidence |
| --- | --- | --- |
| `npm ci` | PASS | 25 packages installed from lockfile; 0 vulnerabilities. |
| `npm test` | PASS | Strict Rust format/Clippy, TypeScript, 4 Rust integration tests, 4 site/policy tests, local 1440px/390px Playwright, and axe all passed. |
| `npm run build` | PASS | Exact production build produced `dist/bin/firebase-environment-doctor` and `dist/site`. |
| `npm audit --audit-level=high` | PASS | 0 vulnerabilities. |
| `cargo package --locked` | PASS | 23 files; 97.6 KiB unpacked and 27.4 KiB compressed; Cargo verification build passed. |
| Clean consumer install | PASS | Extracted the `.crate`, installed it with `cargo install --path ... --root <empty-root> --locked`, and exercised the installed executable. |

The final clean worktree remained unchanged after build and test.

## CLI end-to-end matrix

The packaged-and-installed executable was used, not the repository debug
binary.

| Case | Result |
| --- | --- |
| Normal offline fixture | Exit 0; schema 1; selected `careful-app-dev`; cloud target; no network opt-in. |
| Wrong project | `FIREBASE_PROJECT=careful-app-prod --strict` exited 1 with `production_target` and `project_context_mismatch`. |
| Alias boundary | `--project production --strict` resolved to `careful-app-prod`, retained the alias, and exited 1. |
| Emulator mismatch | Normalized `http://localhost:9099/` to the configured Auth endpoint and identified Firestore `8181` versus `8080`; strict exit 1. |
| Rules fingerprint | Produced full SHA-256 `1b7714d5...50a40` in JSON and the expected 12-character card fingerprint. |
| Missing rules | Blocked with `rules_missing`; exit 1. |
| Missing project | Blocked with `project_missing`; exit 1; recovered to ready/0 with `--project recovered-dev`. |
| Invalid JSON | Actionable file/parse error; exit 2; recovered after replacing the malformed fixture. |
| Missing root / unknown flag | Both produced actionable errors and exit 2. |
| Project precedence / file root | Explicit `--project careful-app-dev` beat a conflicting environment value, and a rules-file path correctly resolved its parent project; exit 0 with a healthy fake CLI. |
| Credential marker | Missing `GOOGLE_APPLICATION_CREDENTIALS` warned and strict-exited 1; an existing marker was reported as present but explicitly not validated offline. |
| CI/network safety | `--ci --network` did not prompt. Recorded subprocesses were exactly `firebase --version`, `firebase login:list --json`, and `firebase projects:list --json`; no write/deploy command was invoked. |
| Secret suppression | Fake Firebase responses contained `TOP_SECRET_SENTINEL` in token/error fields; the emitted report contained neither the sentinel nor a token field. |

`--help` is useful, `--version` reports `0.1.0`, JSON is stable and
script-friendly, and the documented 0/1/2 exit-code model otherwise works.

### Real Firebase CLI auth reproduction

Firebase Tools `14.12.0` was run with an isolated empty XDG config:

```text
$ XDG_CONFIG_HOME=<empty> npx --yes firebase-tools@14.12.0 login:list --json
{
  "status": "success"
}
exit 0
```

The installed candidate was then run with that exact Firebase executable and
the same empty config:

```text
auth.state:       ok
auth.summary:     Firebase login validated
finding.code:     cloud_unreachable
network_opt_in:   true
exit:             1
```

This is not merely a mock mismatch. Firebase Tools' `login:list` implementation
returns successfully after reading configured accounts; with no active user it
returns no result, which the JSON wrapper serializes as `{"status":"success"}`.
It also does not validate a cached refresh token over the network. The candidate
accepts any successful, parseable JSON as valid authentication. Its existing
expired-login test instead makes `login:list` itself fail, so it does not model
the real command surface.

## Live deployment and browser evidence

`npm run verify:live` and `/opt/fleet/lib/verify-url.sh` both passed against the
production URL.

- Candidate identity: home HTML and every built asset matched byte for byte in
  the repository verifier. Independent `cmp` also matched `/privacy/`,
  `/terms/`, `robots.txt`, and `sitemap.xml`. Home SHA-256 was
  `b3bbde52ec5c860935438aaa4cb5cf6f7e09f2461b34cc7a6a8828fca3447d55`.
- Desktop 1440×1000 and mobile 390×844 were visually reviewed. Normal sizing
  had no horizontal page overflow; the intended stacked mobile layout worked.
- Home, privacy, and terms had zero axe serious/critical findings. The factory
  URL verifier found a title, `lang=en`, one H1, a main landmark, no missing
  image alt text, no unlabeled button, no console/page errors, and HTTP 200.
- Keyboard traversal reached the skip link, navigation, actions, roving
  tablist, horizontally scrollable command, copy button, and footer links.
  Skip-link focus transfer worked. Arrow/Home/End tab behavior worked. All
  three demo cases updated their selected state, terminal, and live status.
  Enter copied the documented install command to the clipboard and gave
  immediate feedback.
- Reduced-motion emulation matched and capped all animation/transition
  durations at `0.01ms`; smooth scrolling became `auto`.
- Only same-origin document, JS, CSS, image, SVG, and self-hosted-font requests
  occurred. Cookies, local storage, session storage, and service-worker
  registrations were all empty.
- The site is intentionally static, not a PWA or backend; service-worker
  update/offline and concurrency/persistence/health checks are not applicable.

### Response policy and caching

- HTTP redirects to HTTPS with 301.
- HTML: `Cache-Control: public, must-revalidate, max-age=30`.
- Hashed assets: `Cache-Control: public, max-age=31536000, immutable`.
- Live headers include same-origin CSP with `frame-ancestors 'none'` and
  `object-src 'none'`, `X-Frame-Options: DENY`, restrictive
  `Permissions-Policy`, `X-Content-Type-Options: nosniff`, strict-origin
  referrer policy, and HSTS `max-age=31536000; includeSubDomains; preload`.

### Performance

Fresh Lighthouse 12.8.2 mobile results:

| Category / metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| FCP | 1,201 ms |
| LCP | 1,351 ms |
| CLS | 0.000746 |
| TBT | 71 ms |
| Initial transferred bytes | 101,369 B |

Built budgets pass: JS 3,790 B, CSS 10,168 B, fonts 66,948 B, mobile hero
24,642 B, and desktop hero 67,128 B.

## Defects

### High — credential checks misclassify no-login and expired-login states

`apply_network_checks` treats exit success plus any valid JSON from
`firebase login:list --json` as proof that login is valid. The real Firebase
CLI exits 0 with `{"status":"success"}` when no account is authorized, and
`login:list` only lists locally configured accounts rather than validating an
expired token. A subsequent `projects:list` failure is labeled
`cloud_unreachable`, while the report simultaneously says authentication is
validated. This fails the brief's explicit expired-login root-category success
measure and makes the website's “Expired login diagnosed” claim inaccurate.

Parse and require a non-empty authorized-account result, and classify
authentication failures from the actual network-validating command separately
from connectivity failures. Add tests using the real no-account JSON shape and
the realistic sequence “login list succeeds, project list rejects expired
credentials.”

### Medium — dark command controls have no distinguishable keyboard focus

The focusable install-command `<code>` and “Copy install command” button sit on
`rgb(23, 36, 59)`. Keyboard focus applies a 3px outline of the exact same
`rgb(23, 36, 59)`, a 1:1 contrast ratio against its surroundings. The button's
light border is present before and during focus, so focus causes no visible
change. This violates the explicit visible-focus and 3:1 focus-indicator
requirements even though axe cannot detect it.

### Medium — significant mobile informational copy is below the stated body size

At 390px, important diagnostic and explanatory text renders at 11.52–13.12px
(`.command .button`, `.small-note`, `.safety-list span`, `.checks p`, terminal,
and demo tabs), despite the design thesis specifying 16–18px body copy and the
acceptance principles requiring legible mobile body text. The content remains
present at 200% text sizing, but the default mobile presentation is needlessly
difficult to read.

### Low — several mobile targets are narrower than 44px

At 390px, the collapsed home-brand link measures 34×44px, while footer
“Source” and “Terms” links measure 42×44px and 35×44px. Their spacing is good
and WCAG's spacing exception may apply, but they miss this product contract's
explicit 44×44px target floor.

## What does not block release

The earlier predecessor's strict-Clippy, immutable-cache, CSP/framing,
permissions-policy, and HSTS defects are fixed in this candidate. There is no
fresh deployment-only failure: production is reachable, hardened, fast, and
matches the candidate. The FAIL is caused by the core auth classification and
the accessibility defects above.
