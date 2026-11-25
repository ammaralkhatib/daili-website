# daili.app: short legal links (/en/privacy, /privacy, /fr/terms …) reach the real page instead of a 404

Standard lane, website only. List item #313. Rides the 1.18.0 week (the website deploys on its own; Ammar runs
`./deploy.sh`). Every sub-agent you start MUST use model claude-opus-5-5. Write the report with the file-write tool.

## Goal

The legal pages exist only as `.html` files: `/privacy.html`, `/terms.html`, `/impressum.html`, `/support.html`
(English at the root), `/<lang>/privacy.html` + `/<lang>/terms.html` for the other languages, and the German ones at
the root under their own names (`/datenschutz.html`, `/nutzungsbedingungen.html`). Checked live 2026-11-25:

| Asked for | Today |
|---|---|
| `/en/privacy`, `/en/terms` | 301 → `/privacy`, `/terms` → **404** |
| `/privacy`, `/terms`, `/impressum`, `/support`, `/datenschutz` | **404** |
| `/fr/privacy` (and every language) | **404** (`/fr/privacy.html` = 200) |
| `/de/privacy`, `/de/datenschutz` | **404** |
| `/en/privacy.html` | 301 → `/privacy.html` (fine) |

People and other services (an app store form, a provider's app registration) type the short form. Rule 4 in
`static/.htaccess` (`^en/(.*)$ → /$1`) sends `/en/privacy` on to a 404. Done = every short form above lands on the
right real page in at most ONE redirect (301), the `.html` URLs keep answering 200 directly, and nothing else on the
site changes.

## Scope

- In: `static/.htaccess` (the RewriteRules), `deploy.sh` (the smoke list only), a small check in `tools/` if the
  build's checks are the natural place for it.
- Out: page content, `legal/*`, templates, `site.config.mjs`, `build.mjs` (unless the copy of `.htaccess` really
  needs it — say why), the help folder's own `static/help/.htaccess`, the CSP, the cache headers, every link inside
  the site (they already use `.html`). Leave the untracked `static/assets/img/photos/` alone (not yours; do not add,
  move or delete it, and it is no reason to stop).

## Requirements

1. **Short form → `.html` (root and every language folder).** A request for `/<path>` or `/<path>/` that is not a
   file and not a directory, where `<path>.html` IS a file in the document root, gets ONE `301` to `/<path>.html`
   (query string kept). Use `%{DOCUMENT_ROOT}` + `-f` / `!-d` conditions so it can only ever point at a file that
   exists — never a guess. This must cover `/privacy`, `/terms`, `/impressum`, `/support`, `/datenschutz`,
   `/nutzungsbedingungen`, `/whats-new`, `/fr/privacy`, `/fr/terms`, … every built language.
2. **`/en/…` in one hop.** `/en/privacy` → `/privacy.html` directly (not `/privacy` → `/privacy.html`). Place the
   new rule(s) so rule 4 still sends every other `/en/…` where it sends it today (`/en/` → `/`, `/en/help/` →
   `/help/`, `/en/privacy.html` → `/privacy.html`).
3. **German guesses.** German has no `/de/privacy.html`: `/de/privacy`, `/de/privacy.html`, `/de/datenschutz`,
   `/de/datenschutz.html` → `/datenschutz.html`; `/de/terms`, `/de/terms.html`, `/de/nutzungsbedingungen(.html)` →
   `/nutzungsbedingungen.html`; `/de/impressum(.html)` → `/impressum.html`. Check `dist/` first that this is really
   where the German files are; if the build puts them elsewhere, point there and say so.
4. **Nothing else moves.** Keep rules 1, 3, 5 and the "no Accept-Language" note as they are; `-MultiViews` stays.
   The Chinese casing rule (5) keeps working (`/zh-Hans/privacy` may take two hops: casing, then `.html` — fine).
   `/this-does-not-exist` still answers the site's own 404 page. Comment the new block in the file's style (why, and
   what is deliberately not done).
5. **Smoke test.** Add to `deploy.sh`'s smoke list: `/en/privacy`, `/en/terms`, `/privacy`, `/terms`,
   `/fr/privacy`, `/de/privacy` must answer 301, and their redirect target must be the expected `.html` URL (add a
   small helper next to `check`, e.g. `check_to <path> <expected-location>` using `curl -w '%{redirect_url}'`, same
   retry flags). The existing checks stay.
6. **Proof before deploy — a local Apache.** macOS has `/usr/sbin/httpd` with `mod_rewrite`
   (`/usr/libexec/apache2/mod_rewrite.so`). After `npm run build`, serve `dist/` with a throw-away config in the
   scratch/tmp folder (Listen 127.0.0.1 on a free high port, `AllowOverride All`, `mod_rewrite`, `mod_headers`,
   `mod_dir`, `mod_mime`, `mod_alias` if needed; NOT the system config, never `sudo`). Start it, curl every path of
   the Goal table + requirement 3 + `/`, `/de/`, `/en/`, `/en/help/`, `/privacy.html`, `/fr/privacy.html`,
   `/this-does-not-exist`, and STOP it — all in ONE foreground shell command, so no server is left running when the
   command ends (check with `pgrep -f <your temp conf>` afterwards: nothing). Put the table of answers (path → code →
   location) in the report. If the local Apache cannot start at all, say so, write "Not checked locally", and rely
   on the smoke test — do not install anything.

## Constraints

- The three store-listing URLs `/privacy.html`, `/datenschutz.html`, `/support.html` must keep answering 200
  directly — never a redirect (they are printed in the live store listings).
- No new external request, no JavaScript, no change to the CSP or the cache rules.
- `npm run build` green (it runs all checks), and `npm test` green — FOREGROUND. Self-correct up to 2 tries.

## Verify

- `npm run build`, `npm test`, the local Apache table (requirement 6).
- `git diff --stat` shows only files in Scope.

## Commit & push

- One commit: `fix(site): short legal links (/en/privacy, /privacy, /fr/terms) reach the real page` — body: `#313`,
  the rule in one sentence, `Prompt: claude-prompts/2026-11-25/010-legal-short-links.md`.
- **Push now** (to `origin/main`; on failure stop and report, never force). Pushing does NOT deploy this site — write
  under "Open items for the owner": run `./deploy.sh` in `daili-website`, and its smoke test must print `==> ok`.

## Report

`claude-reports/2026-11-25/010-legal-short-links.md` (mkdir -p), same shape as
`claude-reports/2026-11-24/002-google-colours-privacy-help.md`: summary, files touched, decisions, verification
(with the local Apache table), commit + push, `## Help impact` (expected `none`), open items, deviations. In the
report, never put the word "status" and the word "blocked" on one line unless you really are stuck.
