# 002 — Privacy + terms for app 1.10.0 (weather, Budget, Cycle), help live at 1.9.0

**Status: done.** Commits: `d695e6f` (step 0: prompts 002–005), `edaf007` (the change), plus the commit that holds this report. All pushed to `main`. `./deploy.sh` **not** run: Ammar deploys after Planning Claude checks.

## Facts check
I checked the code at HEAD of `main` in both repos. Every sentence in the English and German text is true, so I did not stop. Some things are true but not said in the text. Planning Claude should decide whether any of them need a sentence:
- **Bill and budget pushes show amounts.** They contain amount, spent and limit (`BuildsBudgetMessage.php:59, 88-89`). The text only says amounts never appear on widgets, the watch, wall displays or the daily summary, which is true.
- **The export also includes entries you wrote or paid in other people's budgets** that you can see (`ExportUserDataJob.php:322-324`). The text says only "the budgets you created". Repeat rules and alerts are not exported.
- **The phone keeps the last unrounded location fix** in local settings (`weather_preferences.dart:95`). It never leaves the phone.
- **There is no separate settlements table.** A settlement is a `budget_entries` row with `type=settlement`. The text's "settlements between family members" is still true.
- **Cache times:** WeatherKit keeps a forecast 15 minutes, MET Norway 10–60 minutes, so "up to one hour" holds. There are no coordinates in the Laravel log. The weather request URL (`/v1/weather?lat&lon&tz`, already rounded) does appear in the web server's access log, as the text says.

## Files changed
- `legal/privacy.*.html`: all 28 bodies, including `datenschutz.de.html`. Four new paragraphs: `weather`, `weather-summary`, `budget`, `cycle`. Also the new "no precise location / no health data" wording in the "does not collect" paragraph and in the "Few people" list item, a new sentence in section 7, and the date set to 12 October 2026.
- `legal/terms.*.html`: all 28 bodies, including `nutzungsbedingungen.de.html`. The `cycle` paragraph goes at the end of section 2, and the date is updated.
- `tools/check-legal.mjs`: the new guard (below).
- `site.config.mjs`: `LIVE_APP_VERSION = '1.9.0'`.

## App labels (ARB)
- **English:** "Use my location", "Weather on Today", "Weather in daily summary", "Cycle", "Delete all cycle data" and "Notifications" all match `app_en.arb`. No changes.
- **German:** one correction. The switch is „Wetter in der Tageszusammenfassung“ in the app (`calendarSettingsDigestWeather`), not „Wetter in der Zusammenfassung“. The others match: „Meinen Standort nutzen“, „Wetter auf Heute“, „Zyklus“, „Alle Zyklusdaten löschen“, „Benachrichtigungen“.
- **Translations:** labels come from each `app_<loc>.arb`. ar, hi and ru have no ARB, so those labels were translated naturally.

## Field-list corrections (allowed by the prompt)
- **Budget:** added icon, colour, members, "spending or income", and "when a bill was paid and how early to remind you". These are real columns in `budgets`, `budget_members` and `budget_entries`.
- **Cycle:** "period days, symptoms and notes" became "period days, flow, symptoms, moods and notes" (`cycle_models.dart`). The German now reads „Periodentage, Blutungsstärke, Beschwerden, Stimmungen und Notizen“.

## Translations
- **How they were made:** 26 locales, translated from the English by sub-agents into JSON files. One script applied them, and it checks that every "old" sentence occurs exactly once before it replaces it.
- **"No location" sentence:** every locale had a clear one. The Thai file has no sentence punctuation, so its replaced text includes the next words to be unique. Those words are kept unchanged.
- **Brand name:** "Apple Weather" stays in English in every translation; German uses "Apple Wetter" as written.
- **Polite or informal "you":** each translation keeps its file's form. Czech is mixed in the old file (mostly formal), so the new Czech paragraphs use the formal form.

## Guard
`check-legal.mjs` now requires two things:
- every privacy body has `id="weather"`, `id="weather-summary"`, `id="budget"`, `id="cycle"`, `MET Norway` and `Apple`;
- every terms body has `id="cycle"`.

**Proof it can fail:** I removed `id="weather-summary"` from `privacy.ja.html` and the check failed with `legal/privacy.ja.html does not contain id="weather-summary" — weather, Budget and Cycle (app 1.10.0) are in every locale…`. I restored the file and it passed again: `legal OK · 2 document(s) × 28 locale(s)`.

## Build
`npm run build` exits 0: `build OK · 2384 pages`, `check-help` included, and the `pending` routes are untouched. It prints 34 content warnings (home-page text length ratios). The build without my change prints the same 34, so they are not from this change.

I checked these built pages: `dist/privacy.html`, `dist/datenschutz.html`, `dist/terms.html`, `dist/nutzungsbedingungen.html`, `dist/fr/privacy.html` and `dist/ja/privacy.html`.
- The new paragraphs and ids are there, with date 2026-10-12.
- No page still says the app collects no location at all. The only "no location" text left is the new "no precise location" wording.

## Help 1.9.0
The five `since: 1.9.0` articles are now built pages: `dist/help/account/plus/`, `notes/pictures-voice/`, `notes/files/`, `notes/find/` and `meals/find/`, plus `dist/de/help/account/plus/`. The help index links to Plus.

## Not mine (untouched, not committed)
`claude-reports/2026-10-01/`, `static/assets/img/blog/what-to-look-for-family-app.webp`, `static/assets/img/photos/`.

## Open items for Ammar
- Run `./deploy.sh` after Planning Claude's check, and before build 16 goes to review.

## Help impact
none
