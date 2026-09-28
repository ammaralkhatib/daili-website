# Report — 005 Habits + Notes join the story

Prompt: `claude-prompts/2026-09-27/005-story-habits-notes.md`
Commit: `d082839` — `feat(site): Habits + Notes chapters, nine-screen story, refreshed captures` (pushed)
Status: **done**

Both prerequisites were met: `08-habits.png` and `09-notes.png` exist for all 25 mapped store locales, and 004 is in (`6ff7488`). `npm run build` is green: `content OK · 265 keys each`, `build OK · 2034 pages`, `detector OK`. The 17 content-length warnings are the ones that were there before. My first draft added three more (cs, fi, ru); I reworded those strings, so none of the 17 are new.

## Glossary rows (`content/glossary.md`, new table for all 28 locales)

| | en | de | ja | ar |
|---|---|---|---|---|
| Habits | Habits | Gewohnheiten | 習慣 | العادات |
| Notes | Notes | Notizen | メモ | الملاحظات |

- These come from the app's `dashboardTileHabits` / `dashboardTileNotes`. Every app locale has them.
- ar, hi and ru have no ARB file, so the website picked their words.

## Bullets checked against the help articles

- **Reworded:** `Streaks with rest days, so a holiday doesn't break them` became `Streaks with rest days and pauses, …`. You get one rest day a week, so a rest day can't cover a holiday; a pause (up to 14 days) can (`habits-streaks`).
- **Reworded:** `Pin, tag and search — on every phone and in the browser` became `… — yours and the ones shared with you`. The web app has no Notes (nothing in `daili-web`), so "in the browser" was false. The new ending is the **Mine / Shared with me** tabs from `notes-notes`.
- **Kept, your call:** `… — with a daily reminder`. **Together** habits have no reminders; Just me and Each of us do.
- The meals and calendar AI bullets match `meals-suggest` and `calendar-photo`. Neither says "AI".

## Screenshots

`python3 tools/make-site-shots.py` wrote **225 files, 6456K total, largest 45.0K, budget 45K each**. Every file is 640×1391.

- **Fallback:** the tool had no fallback, only a warning. On the first run, 9 `shot-habits` files were 45.3–47.9K: de, fr, it, nl, pt, pl, el, bg and ro.
- I added the smallest fallback that works to the tool: only a file over budget steps its quality down by 5 (floor 65). All 9 fit at quality 75 (39.4–41.9K). Every other file stays at 80.

`ls static/assets/img/shots/de` (9 files):

| file | bytes |
|---|---|
| shot-birthdays.webp | 22,366 |
| shot-calendar.webp | 30,444 |
| shot-family.webp | 28,522 |
| shot-habits.webp | 40,836 |
| shot-home.webp | 36,114 |
| shot-mealplan.webp | 29,906 |
| shot-notes.webp | 33,594 |
| shot-shopping.webp | 17,974 |
| shot-todos.webp | 29,922 |

## Guards

- **§14 was not counting 9.** It only asked for "at least one" own-locale file, so a locale that lost one shot fell back to English silently. It now requires every `SHOT_SOURCES` name (9) to come from the page's own folder.
- **Proof:** I moved `de/shot-habits.webp` aside and the build exited 1 with `de/index.html  uses 8 of the 9 own screenshots SHOT_SOURCES promises — shot-habits fell back to shots/en/ (re-run tools/make-site-shots.py de)`. I restored the file and the build is green again.
- **§15** needed no edits and passes with 9. On `/`, `/de/`, `/ar/` and `/ja/` there are 9 chapters, 9 screens, 9 `.mshot`s, 9 dots and 9 chips.
- check-legal is untouched and check-help is green.

## Verify (`claude-reports/2026-09-27/shots-005/`)

- **Chapters 4 and 7 at 1440×900** (`/`, `/de/`, `/ar/`): each settles at `--idx` 3.000 / 6.000 with the right screen at top 0.
  - de uses `shots/de/`.
  - ar shows English screens (it has no capture).
- **Chip row:** 9 chips on one line at 1440 and at 1280, so no wrap was needed.
  - Row width at 1280: **900 px** (en), **943 px** (de), **776 px** (ar), inside a 1178 px box.
- **`/` full page at 390:** 9 `.mshot`s, all loaded and visible.
- **Overflow:** none. `scrollWidth` equals the viewport at 1440, 1280, 390 and 360 on `/`, `/de/` and `/ar/`.

## Scope notes

- **Out-of-scope files:** `build.mjs`, `style.css`, `script.js` and `landing.html` still say "seven" in comments. The logic is all driven by `FEATURES`, so I didn't touch them.
- **In-scope file I changed beyond the prompt:** `tools/make-site-shots.py` (the fallback above).

## Help impact

none

## Owner actions

1. Notes and the two AI bullets describe 1.7.0 features, but `LIVE_APP_VERSION` is still 1.6.0. Run `./deploy.sh` once 1.7.0 is in the stores (or deploy now if you want to advertise ahead of it).
2. Hand-test on a laptop: scroll the story through all 9 chapters and check the phone, dots and chips. On a phone, check the 9 chapter screenshots.
