# 010 — Short legal links (/en/privacy, /privacy, /fr/terms) reach the real page (#313)

**Result:** done · **Commit:** `d01db73d` fix(site): short legal links (/en/privacy, /privacy, /fr/terms) reach the real page. 2 files, pushed to origin/main (`fd17a457..d01db73d`). This report follows in its own `docs(report)` commit. `./deploy.sh` was NOT run, because Ammar deploys.
**Step 0:** `fd17a457` docs(plan): sync planning docs (this prompt). No commits were held, so it was pushed at once. `static/assets/img/photos/` (the old untracked pictures) stayed out of every commit, as the prompt said.

## Summary

Before, `/privacy`, `/fr/privacy`, `/de/privacy` and the like were 404s, and `/en/privacy` was a 301 to a 404. Now each short form gets ONE 301 to the real `.html` page. The rule only fires when the request would have been a 404 before: it is not a file, not a directory, and `<path>.html` IS a file in the document root. So no URL that answers today changes, and a junk path still gets the site's 404 page.

## Files touched

- `static/.htaccess`: new rule 4a (`/en/<page>` in one hop, placed before rule 4), new rule 6 (6a German guesses, 6b the general short form → `.html`). The old "6. Nothing else is rewritten" note is now 7, with its text unchanged. Rules 1, 2, 3, 4 and 5, the Accept-Language note and `-MultiViews` are untouched.
- `deploy.sh`: a new helper `check_to <path> <expected-path>` next to `check`. It uses the same retry flags, has no `-L`, and wants exactly `301 https://daili.app<expected>`. There are 6 new smoke lines: `/en/privacy`, `/en/terms`, `/privacy`, `/terms`, `/fr/privacy`, `/de/privacy`. Every existing check is unchanged.

`git diff --stat`: `deploy.sh | 18 +`, `static/.htaccess | 44 +-`. Nothing outside Scope changed. `build.mjs` already copies `.htaccess` as it is, so it needed no change, and I added no new check in `tools/`.

## Decisions

- **German files:** `dist/` confirms that German has no `/de/privacy.html` or `/de/terms.html`. Its pages are at the root: `/datenschutz.html`, `/nutzungsbedingungen.html`, `/impressum.html`. `/de/` holds only `index.html`, `support.html`, `features/` and `help/`. So 6a points at the root files, as the prompt said. Each 6a rule has a `!-f` guard, so if the build ever writes a real `/de/privacy.html`, that file wins.
- **The order of the rules:** 4a must come before rule 4, or `/en/privacy` would take two hops. 6b comes after rule 5, so the Chinese casing runs first and `/zh-Hans/privacy` goes to `/zh-hans/privacy` and then to `/zh-hans/privacy.html` (two hops, which the prompt allows).
- **Two small guards (my addition):**
  - `[^/]` at the start of the captured path, so that a doubled slash can never build a protocol-relative `//host` Location.
  - `index` and `404` are left out. `/index` → `/index.html` → `/` would be two hops onto a URL that rule 3 already handles, and `404.html` is not a page to land on. `/index` and `/404` stay 404, as they were before.
- **Deliberately not done:** serving the `.html` under the short URL with no redirect (that would give one page two URLs), and any spelling or language guessing beyond 6a.
- **No CHANGELOG line:** this repo has no root `CHANGELOG.md`, and the prompt's Scope is `.htaccess` + `deploy.sh` only.

## Verification

- `npm run build` (every check): green, `build OK · 3759 pages`, detector OK, help search OK.
- `npm test`: green. detector 32 cases, test-check-help 99, help search 38, test-blog-i18n 48.
- `bash -n deploy.sh`: syntax OK.
- **Local Apache** (macOS `/usr/sbin/httpd` 2.4.66): a throw-away config in `/tmp/daili-ht-uUmk/` with Listen 127.0.0.1:18473, `AllowOverride All` on `dist/`, and mod_rewrite, headers, dir, mime, alias, authz, unixd and prefork. No system config and no sudo. One foreground script started it, ran every curl, and stopped it. Afterwards `pgrep -f /tmp/daili-ht-uUmk/daili-ht.conf` found nothing (exit 1). `error.log` has only the start and stop notices.

Locations are shown without the `http://127.0.0.1:18473` prefix.

| Path | Code | Location |
|---|---|---|
| `/en/privacy` | 301 | /privacy.html |
| `/en/terms` | 301 | /terms.html |
| `/privacy` | 301 | /privacy.html |
| `/terms` | 301 | /terms.html |
| `/impressum` | 301 | /impressum.html |
| `/support` | 301 | /support.html |
| `/datenschutz` | 301 | /datenschutz.html |
| `/nutzungsbedingungen` | 301 | /nutzungsbedingungen.html |
| `/whats-new` | 301 | /whats-new.html |
| `/privacy/` | 301 | /privacy.html |
| `/privacy?x=1` | 301 | /privacy.html?x=1 |
| `/fr/privacy` | 301 | /fr/privacy.html |
| `/fr/terms` | 301 | /fr/terms.html |
| `/fr/privacy/` | 301 | /fr/privacy.html |
| `/es/terms` | 301 | /es/terms.html |
| `/zh-hans/privacy` | 301 | /zh-hans/privacy.html |
| `/zh-Hans/privacy` | 301 | /zh-hans/privacy (then → .html) |
| `/de/privacy` | 301 | /datenschutz.html |
| `/de/datenschutz` | 301 | /datenschutz.html |
| `/de/privacy.html` | 301 | /datenschutz.html |
| `/de/datenschutz.html` | 301 | /datenschutz.html |
| `/de/terms` | 301 | /nutzungsbedingungen.html |
| `/de/terms.html` | 301 | /nutzungsbedingungen.html |
| `/de/nutzungsbedingungen` | 301 | /nutzungsbedingungen.html |
| `/de/nutzungsbedingungen.html` | 301 | /nutzungsbedingungen.html |
| `/de/impressum` | 301 | /impressum.html |
| `/de/impressum.html` | 301 | /impressum.html |
| `/de/support` | 301 | /de/support.html |
| `/en/privacy.html` | 301 | /privacy.html |
| `/en/` | 301 | / |
| `/en` | 301 | / |
| `/en/help/` | 301 | /help/ |
| `/en/index` | 301 | /index (rule 4, as before) |
| `/index` | 404 | — |
| `/404` | 404 | — |
| `/` | 200 | — |
| `/de` | 301 | /de/ |
| `/de/` | 200 | — |
| `/help` | 301 | /help/ |
| `/help/` | 200 | — |
| `/privacy.html` | 200 | — |
| `/datenschutz.html` | 200 | — |
| `/support.html` | 200 | — |
| `/terms.html` | 200 | — |
| `/fr/privacy.html` | 200 | — |
| `/index.html` | 301 | / |
| `/de.html` | 301 | /de/ |
| `/this-does-not-exist` | 404 | — (body: "Page not found — Daili") |
| `/fr/this-does-not-exist` | 404 | — |
| `//privacy` | 301 | /privacy.html |

`/privacy.html` still carries `Cache-Control: no-cache` and the CSP.

**One limit of the local check:** the Mac's disk ignores upper and lower case, but the server's does not. Because of that, `/zh-Hans/privacy` might take a different path on the server than it did here. Rule 5 still runs first on the server, so it is fine either way (two hops at most). The live smoke test is the final proof for `%{DOCUMENT_ROOT}` behind Plesk.

## Commit + push

- `fd17a457` docs(plan): sync planning docs, pushed.
- `d01db73d` fix(site): short legal links … (body: #313, the rule, Prompt line), pushed `fd17a457..d01db73d`.
- This report: its own `docs(report)` commit, pushed.

## Help impact

none

## Open items for the owner

- Run `./deploy.sh` in `daili-website`. Its smoke test must print `==> ok`. The 6 new `check_to` lines prove the rule live, including that `%{DOCUMENT_ROOT}` points at `httpdocs` behind Plesk. If one of them fails, the rollback command it prints is safe, because the old rules did not depend on any of this.

## Deviations

- Two small guards I added on my own: the `[^/]` start and the `index|404` exclusion (see Decisions). Both only keep URLs that were 404s before as 404s.
- No CHANGELOG line (no root `CHANGELOG.md` in this repo).
- No sub-agents were used.
