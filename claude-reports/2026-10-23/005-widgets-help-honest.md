# 005 — Widgets help: no background-update promise

- **Status:** done. Commit `e8dd912`, pushed to `origin/main`. `./deploy.sh` was NOT run.
- **Languages changed (25):** en, de, bg, cs, da, el, es, fi, fr, id, it, ja, ko, nb, nl, pl, pt, ro, sk, sv, th, tr, uk, zh-Hans, zh-Hant. In each `anywhere/widgets.md`, the "update by themselves" sentence is gone and only "The calendar widget shows your next days." is left. The note's second sentence ("If one looks out of date, open daili for a moment.") is back, copied word for word from each language's file at `ec96460^`. Nothing was re-translated. Only these 2 lines changed per file, and `updated: 2026-10-23` is kept.
- **Build:** `npm run build` passed in the foreground (build OK · 3233 pages; the detector and help-search checks are also OK). I checked en and de by eye, and the git diff for the other 23 languages: 0 copies of the dropped sentence are left.
- **Also:** I committed and pushed the planning docs first (`d1a0bf2`). `static/assets/img/photos/` stays untracked.

## Help impact
`anywhere-widgets` — no background-update promise.
