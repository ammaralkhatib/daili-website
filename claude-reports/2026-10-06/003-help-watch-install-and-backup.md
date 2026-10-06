# 003 — Help: watch installs by itself, no watch Siri, note-files backup

Status: done · commit `1238de1` (step 0: `371116c`), pushed · `./deploy.sh` **not** run.

- **New en step 1** (`anywhere-watch`): "daili usually appears on your watch by itself with the iPhone app. If not, in the iPhone's **Watch** app, tap **My Watch**, then **Install** next to daili under **Available Apps**." I used Apple's own path (My Watch → scroll to Available Apps). I left out the prompt's "**Apps**" step: I could not confirm that label exists, and I didn't want to guess it in 24 languages. Steps 2–3 kept. `updated` was already 2026-10-06.
- **Siri:** the watch Siri sentence is gone in all 25 files. The pencil / **Add item** part stays. A grep of `help/*/` finds no other "Siri" at all.
- **files.md: no change.** App report 007 (`## Help impact`) says the article is already correct (iPhone backup yes, Android no).
- **Locales:** en + all 24 `HELP_LOCALES`. Each one uses the phone's own Watch app words ("Meine Watch", "Ma montre", "マイウォッチ" …). The translations still say "scroll down to Available Apps". Only English was shortened, to fit the 150-word limit (it is at exactly 150 now).
- **Build:** `node tools/check-help.mjs` OK (77 articles × 25 locales). `npm run build` OK (2259 pages, detector OK).
- **Left untracked (not mine):** `claude-reports/2026-10-01/` (report 2026-10-05/001 asked whether to commit it, and there is no answer yet), plus `static/assets/img/blog/` and `static/assets/img/photos/`.

## Help impact
`anywhere-watch`: the install step now says the watch app usually installs by itself, and the watch Siri phrases are gone. `notes-files`: none.
