# Full app check S0 — baseline scans (daili-website)

## Goal
Deep check of the whole product starts (plan: Project doc
`claude/full-app-check-plan-2026-10-23.md`, session S0). This prompt only
MEASURES — no fixes, no upgrades, no content or source change.

## Scope
In: read-only commands + one report. Out: `package.json`, `build.mjs`, `templates/`, `content/`, `static/`, any `npm install`/`npm update`/`npm audit fix`.

## Requirements
1. Versions: `node -v`, `npm -v`, and the direct dependencies with versions from `package-lock.json` (one line each).
2. `npm audit --json` — list each advisory: package, severity, id, fix available. Summary counts by severity.
3. `npm outdated --json` — direct dependencies: current, wanted, latest, major jump yes/no.
4. `which osv-scanner && osv-scanner scan --lockfile package-lock.json` — if missing, say "not installed".
5. `which gitleaks && gitleaks detect --no-banner --redact -v` — if missing, say so; findings REDACTED (file + commit + rule only).
6. Build: `node build.mjs 2>&1 | tail -5` (or the build command in `package.json`) — must succeed; note how many HTML pages land in `dist/` (`find dist -name "*.html" | wc -l`) and the total size of `dist/` (`du -sh dist`).
7. Counts (no judgement): number of help articles per language (`help/en` file count and whether every other language folder has the same count — list languages that differ); number of blog posts; `grep -rln "http://" dist/ | wc -l` (pages with plain-http links, excluding `http://www.w3.org` and `http://schema.org`); pages in `dist/` without a `<meta name="description"` (`grep -L 'name="description"' $(find dist -name "*.html") | wc -l`); `<img` tags without `alt=` in `dist/` (count).
8. Security headers the repo itself sets (any `.htaccess`, `_headers`, `<meta http-equiv="Content-Security-Policy"`) — fact only.
9. Big static files: `find static dist -type f -size +1M | head -20` with sizes (page speed input for S18).

## Constraints
Install nothing. Never print a secret. Fix nothing. Anything critical → top of the report under `## 🔴 Look at this first`.

## Commit & push
One commit: `docs(report): S0 baseline scan (website)`. Do NOT run `./deploy.sh`. Push if the repo has a remote; otherwise commit only and say so.

## Report
`claude-reports/2026-10-24/001-check-baseline-tools.md`, ONE page: 🔴 section (or "nothing"), versions, audit, outdated, osv/gitleaks, build line + page count, counts, headers fact, big files, SHA. Plain words.
`## Help impact`: none.
