# 001 — Privacy policy: wall-screen numbers keep 400 days, wall-screen weather; legal guard 1.16.2

**Result:** done · **Commit:** `762deab6` docs(legal): wall-screen numbers keep 400 days, wall-screen weather; legal guard 1.16.2 — pushed to origin/main (29 files: 28 `legal/privacy.*` + `tools/check-legal.mjs`). `./deploy.sh` was NOT run: Ammar deploys after Planning Claude's review.
**Step 0:** `8f144887` docs(plan): sync planning docs (this prompt file), pushed. No commits were held. `static/assets/img/photos/` stayed unstaged.

## The api check (first check)
Passed. api `main` has `e2df361d feat(privacy): wall-screen numbers keep 400 days; list categories in the data export` (+ report `e62266fa`). `routes/console.php:269` schedules `board-stats:prune` daily; the command is `app/Console/Commands/PruneBoardStats.php`.

## Facts and the code that proves them

**1. `#wall-screen-stats` — 400 days (all confirmed)**
- One window for all: `PruneBoardStats.php:34` uses `PruneActiveDays::DAYS`, which is `400` (`PruneActiveDays.php:13`).
- Numbers per day (use stamps, ticks, adds, tab counts — all in `board_screen_days`): deleted when the day is older than 400 days — `PruneBoardStats.php:37`.
- Per-day set-up counts (`board_daily_counts`, no screen or family column): same rule — `:41`.
- Removed screens: the `board_screens` row (name, settings, last used, `added_via`, `device_label`, `revoked_reason`) is deleted 400 days after `revoked_at` — `:45-48`. A live screen is never deleted, only its old day rows.
- Deleting the family still deletes all of it: `FamilyDeleter.php:60` removes every screen at once, `:68` soft-deletes the family, and `FamilyPurger.php:55` later deletes the family row for good. The database then deletes the screens and their day rows (`cascadeOnDelete`, board_screens migration `:29`, stats migration `:42-43`). I wrote "together with the family", not "at once", because the rows go when the family itself goes for good (after the 30-day grace), like the existing rewards sentence.
- Kept sentence "the screen loses its link to them" is still true: `created_by_user_id` is `nullOnDelete` (board_screens migration `:30`), and account deletion also removes the parent's screens (`AccountSoftDeleter.php:82`, `AccountPurger.php:273`).

**2. `#weather-summary` — the wall screen uses this place (all confirmed)**
- A screen request with no point gets the creator's summary place: `WeatherController.php:34-36` → `screenCreatorPlace()` `:59-67`.
- The place is the rough one: saved at 1 decimal (~10 km) in `MeController.php:289`; the controller sends it on as-is (`round(…, 2)` at `:67` does not make it finer).
- The answer has only the point, no name: `WeatherReportBuilder.php:56` `'location' => ['lat', 'lon']`; the controller comment (`:20-22`) says the web needs it for sunrise / sunset.
- Switch off → no weather from it: `MeController.php:297-300` sets lat, lon and place name to null; then `WeatherController.php:63-64` answers 404 `WEATHER_NO_PLACE`.
- The web asks in this order: the browser's own place first, then the screen's family place, else a "Weather" chip — `daili-web src/features/board/useBoardWeather.ts:5-12, 44-67`.
- A place picked on the screen uses the same `PlaceDialog` as the web's Weather page (`searchPlaces` from `src/api/weather`, place kept in the browser via `setWeatherPlace`). That is the `#web-places` case. It was not yet said for screens, so I added one short sentence with a link.

**3. Guard** — `V1162_MUST_CONTAIN` (privacy: `id="shopping"`, `id="recipe-notes"`, `id="wall-screen-stats"`; terms: none), `V1162_WHY` and its loop, the same shape as `V116`.

## New text — English

`#wall-screen-stats` — this replaces "There is no fixed time limit for them yet: …":
> The numbers per day (use, ticks and new entries, and tab counts) and the per-day set-up counts are deleted after 400 days. When a screen is removed, everything else we kept about it (its name, display settings, when it was last used, how it was added, its device label and why it ended) is deleted 400 days after it was removed. Deleting the family deletes all of it together with the family.

`#weather-summary` — added after "It is part of your data export.", before "Legal basis":
> If you set up a family wall screen (see <a href="#wall-screens">"Family wall screen"</a> below) and the screen's browser has no weather place of its own, the screen shows the weather for this same rough place: the screen's browser receives only the rounded point (for the forecast and for sunrise and sunset), never the place's name. When you switch the summary weather off, the screen gets no weather from it any more. A place chosen on the screen itself works like any weather place in the web app (see <a href="#web-places">"Weather in the web app"</a> above).

## New text — German (binding)

`#wall-screen-stats`:
> Die Zahlen pro Tag (Nutzung, Häkchen und neue Einträge sowie Tab-Zahlen) und die Einrichtungs-Zahlen pro Tag werden nach 400 Tagen gelöscht. Wird ein Bildschirm entfernt, wird alles, was wir sonst noch über ihn gespeichert haben (sein Name, seine Anzeige-Einstellungen, wann er zuletzt benutzt wurde, wie er hinzugefügt wurde, seine Gerätebezeichnung und warum er endete), 400 Tage nach dem Entfernen gelöscht. Wird die Familie gelöscht, wird all das zusammen mit der Familie gelöscht.

`#weather-summary`:
> Richtest du einen Familien-Wandbildschirm ein (siehe <a href="#wall-screens">„Familien-Wandbildschirm“</a> unten) und hat der Browser des Bildschirms keinen eigenen Wetter-Ort, zeigt der Bildschirm das Wetter für denselben groben Ort: Der Browser des Bildschirms erhält nur den gerundeten Punkt (für die Vorhersage und für Sonnenaufgang und Sonnenuntergang), nie den Namen des Ortes. Schaltest du das Wetter in der Zusammenfassung aus, bekommt der Bildschirm daraus kein Wetter mehr. Ein Ort, der auf dem Bildschirm selbst gewählt wird, funktioniert wie jeder Wetter-Ort in der Web-App (siehe <a href="#web-places">„Wetter in der Web-App“</a> oben).

## Facts I could not confirm
None. Every fact in the prompt matches the code.

Two notes for the review (not written into the policy):
- The pairing rows (`board_pairings`) are not pruned by the new command: when their screen goes, they stay with `board_screen_id = null` (`PruneBoardStats.php` doc comment). They have their own clean-up, `PruneBoardPairings`, and the page already says "Set-up codes are deleted after about a day". I did not re-check that job in this run.
- Counts already saved stay with the screen's other numbers after "Help improve Daili" is switched off (existing sentence). With the new rule they now also end after 400 days. I left that sentence as it was.

## Locales
All 28: en + de by me. The other 26 were translated from the English by five Opus 5.5 sub-agents (es fr it pt ro · nl da sv nb fi · pl cs sk bg ru uk · el tr ar hi id · ja ko th zh-Hans zh-Hant). All of them finished before the commit. The first agent I started had an empty brief by mistake; I stopped it at once, and it had changed no file. I checked every file on disk myself:
- every file has the same diff shape (3 lines changed: the date, `#weather-summary`, `#wall-screen-stats`), and the line count is unchanged;
- `datetime="2026-11-20"` plus the date text for the 20th is on all 28 pages;
- all 56 changed paragraphs are complete, closed `<p id="…">…</p>` lines with balanced `<a>` tags;
- every sentence join is clean. Two agents found and fixed a missing space after the new stats sentences; my own check found no glued sentences or double spaces left.

## Checks
- `npm run build` with the app's working tree: `legal OK · 2 document(s) × 28 locale(s)`, but then `check-help` fails with 5 errors. The app routes `/focus`, `/move`, `/move/routine/:key`, `/move/session` and `/move/statistics` have no help article. These routes are COMMITTED in app HEAD (`3ce399b1`) but in no release tag (`v1.17.0+25` and `v1.16.2+24` have none of them). So website HEAD was red before this change, and this prompt did not cause it.
- Because this prompt allows only `legal/**` + the guard, I did not add them to `help/routes-allowlist.json`. Instead I ran the full build against the newest release tag's `route_names.dart` (`DAILI_APP_REPO=<scratch copy of v1.17.0+25>`). That build passed: exit 0, `legal OK · 2 document(s) × 28 locale(s)`, `help OK · 116 article(s) · 87 app routes checked`, `build OK · 3759 pages`, detector + help-search OK.
- Guard test: in a temp copy (`legal/` + `tools/check-legal.mjs` + `site.config.mjs`) I removed `id="wall-screen-stats"` from `privacy.sv.html`. `check-legal.mjs` then failed with exit 1: `legal/privacy.sv.html does not contain id="wall-screen-stats" — shopping, recipe notes and wall-screen numbers (app 1.16.2) are in every locale — see claude-prompts/2026-11-12/006`. Nothing broken was committed.

## Open items for Ammar
- **Deploy after review.** A plain `./deploy.sh` runs the same build, so it will stop on the 5 Move/Focus routes. Two choices:
  - (a) **Recommended:** run `DAILI_APP_REPO=<folder with lib/core/routing/route_names.dart from v1.17.0+25> ./deploy.sh`.
  - (b) Planning Claude writes a small prompt that puts the 5 routes under "pending" in `help/routes-allowlist.json` (its own commit, like `fc0fcf63`).
- No code or api step is needed for this prompt.

## Help impact
none
