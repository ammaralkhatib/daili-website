# Website: LIVE_APP_VERSION 1.16.1 (store day)

## Goal
App 1.16.1 is live on both stores (Ammar, 2026-11-12). The help center must now show the articles and paragraphs
made for 1.16.0 (`since: 1.16.0`), and the site can be deployed. Same one-line step as `56c1616a` for 1.15.0.

## Requirements
1. `site.config.mjs`: `export const LIVE_APP_VERSION = '1.16.1';` (was `'1.15.0'`). Nothing else.
2. `npm run build` passes. In the report, give the help line the build prints
   (`help: N of M article(s) on pages (live 1.16.1) …`) and the same line from before the change, so we see how many
   articles became visible.
3. `grep -ril minzi dist/` — list the files. Expected: only old changelog / What's-new pages. Anything else =
   stop and report, do not fix here.

## Commit & push
First commit the pending docs (`claude-reports/2026-11-10/003-…md`, `claude-reports/2026-11-12/002-…md`, this
prompt). Then `chore(help): LIVE_APP_VERSION 1.16.1`; body
`Prompt: claude-prompts/2026-11-12/003-live-app-version-1-16-1.md`.
🔴 Do NOT stage `static/assets/img/photos/`. **Push now. Do NOT run `./deploy.sh`** — Ammar runs it himself.

## Report
`claude-reports/2026-11-12/003-live-app-version-1-16-1.md` (file-write tool; `wc -c` > 0), a few lines: the two
help lines, the Minzi grep result, build result, SHA + push. `## Help impact`: 1.16.0 articles now show on pages.
