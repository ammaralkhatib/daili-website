# 003 — LIVE_APP_VERSION 1.16.1 (store day)

Prompt: `claude-prompts/2026-11-12/003-live-app-version-1-16-1.md`
Commits: `bc2ad3f4` (docs: reports 2026-11-10/003 and 2026-11-12/002, this prompt) and `b2f5f3df`
chore(help): LIVE_APP_VERSION 1.16.1. Both pushed to `main`. `./deploy.sh` was not run.
`static/assets/img/photos/` was not staged.

## Change
`site.config.mjs`: `LIVE_APP_VERSION = '1.16.1'` (was `'1.15.0'`). Nothing else.

## Help lines
- Before: `help: 104 of 110 article(s) on pages (live 1.15.0) · 14 topic(s) · en.json 110 articles, 16 tips, 6 checklist · PUBLIC`
- After: `help: 110 of 110 article(s) on pages (live 1.16.1) · 14 topic(s) · en.json 110 articles, 16 tips, 6 checklist · PUBLIC`

6 more articles are now on pages. The built page count went from 3484 to 3634.

## Minzi grep
`grep -ril minzi dist/` finds only `dist/neuigkeiten.html` and `dist/whats-new.html`, the What's-new pages.
That is as expected, so nothing to stop for.

## Build
`npm run build` passes: `build OK · 3634 pages · 3603 in hreflang clusters`, detector OK, help search OK.

## Help impact
The 1.16.0 articles and paragraphs (`since: 1.16.0`) now show on the help pages.
