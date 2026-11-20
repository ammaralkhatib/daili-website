# Privacy policy: wall-screen numbers keep 400 days, wall-screen weather; legal guard 1.16.2

## Why
Three open points from the 1.16.2 legal check (`claude-reports/2026-11-12/006-legal-1-16-2.md`,
"Open items" 2, 3 and 5). Ammar decided them on 2026-11-20 (list item #19). As in
`2026-11-12/006`, **you write the sentences** — in the style, tone and section structure of the
existing `legal/privacy.en.html` and `legal/datenschutz.de.html` (German is authoritative, "du")
— **after checking every fact below against the code** in `~/Herd/familyplanner-api` and
`../daili-web`. A fact the code does not confirm → do NOT write it; list it under "Facts I could
not confirm" in the report. Planning Claude reviews English + German before Ammar deploys.

## First check (stop if it fails)
The api prompt `2026-11-20/001-wall-stats-400-days-export-categories` runs right before you, in
the same run script. Check that `~/Herd/familyplanner-api` `main` has a commit with the new command
`board-stats:prune` (`git -C ~/Herd/familyplanner-api log --oneline -5` and `grep -rn
"board-stats:prune" ~/Herd/familyplanner-api/routes/console.php`). If it is not there: change
nothing, write the report saying so, and stop.

## The facts to cover
1. **`#wall-screen-stats` — the time limit** (api `board-stats:prune`, new today). Today the
   paragraph says there is no fixed time limit ("…they stay, also after a screen is removed, until
   the family is deleted; the set-up counts have no link to anyone and are kept."). Replace that
   with the real rule — check it in the new command:
   - the numbers per day (use, ticks and new entries, tab counts) are deleted after 400 days;
   - the per-day set-up counts (no link to anyone) are deleted after 400 days too;
   - a removed screen's remaining data (its name, settings, how it was added, the device label,
     why it ended) is deleted 400 days after it was removed;
   - deleting the family still deletes all of it at once (check it is still true).
   Keep the rest of the paragraph. Keep the sentence about the parent's account deletion if it is
   still true.
2. **`#weather-summary` — the wall screen uses this place** (api `d04b69c6`, daili-web
   `src/features/board/useBoardWeather.ts`). Add one or two sentences: if a parent who switched on
   "Weather in daily summary" sets up a family wall screen (link `#wall-screens`), and the
   screen's own browser has no weather place of its own, the screen shows the weather for this
   same rough place (about 10 km); the screen's browser receives only this rough point (for the
   forecast and sunrise / sunset), not the place's name — check this in
   `WeatherController::screenCreatorPlace()` and the weather answer. If the parent switches the
   summary weather off, the screen shows no weather from it. A place chosen on the screen itself is
   the web's own place search (`#web-places`) — say so only if it is true and not already covered.
3. **Guard** `tools/check-legal.mjs`: add a `V1162_MUST_CONTAIN` block (privacy:
   `id="shopping"`, `id="recipe-notes"`, `id="wall-screen-stats"`; terms: none) with its
   `V1162_WHY` line (`… (app 1.16.2) are in every locale — see claude-prompts/2026-11-12/006`) and
   its loop, exactly like the `V116_MUST_CONTAIN` block. All 28 locales already have the 3 ids.

## Requirements
- `legal/privacy.en.html`, `legal/datenschutz.de.html`, and the same two paragraphs in every other
  `legal/privacy.*.html` (28 locales). Set each page's "last updated" date (text and `datetime`)
  to the day of this run.
- You write English and German yourself. The other 26 locales: translate from the English
  (sub-agents allowed, each MUST use model claude-opus-5-5; wait for all of them before the
  commit). Check every file on disk: same diff shape, the new date, complete `<p>…</p>`.
- Only `legal/**` and `tools/check-legal.mjs` change.
- 🔴 Report trap: the run script stops when any line of the report contains the word "status"
  and the word "blocked" together. Use the word "blocked" ONLY if you really are blocked.

## Build
`npm run build` passes (`legal OK · … 28 locale(s)`). Then remove `id="wall-screen-stats"` from a
COPY in a temp folder or check by reading the code that the new block would fail — do not commit a
broken file.

## Commit & push
`docs(legal): wall-screen numbers keep 400 days, wall-screen weather; legal guard 1.16.2`; body
`Prompt: claude-prompts/2026-11-20/001-legal-wall-stats-weather-guard.md`. 🔴 Do NOT stage
`static/assets/img/photos/`. **Push now. Do NOT run `./deploy.sh`** — Ammar deploys after
Planning Claude's review.

## Report
`claude-reports/2026-11-20/001-legal-wall-stats-weather-guard.md` (file-write tool; `wc -c` > 0),
short: the api check, each fact with the code line that proves it, the new EN + DE sentences in
full (quote blocks), facts not confirmed, locales done, build result, SHA + push. `## Help impact`:
none.
