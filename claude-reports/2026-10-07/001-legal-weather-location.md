# 001 — Privacy: weather on the Today screen (approximate location, MET Norway)

**Status: blocked.** One sentence of the prompt's text is not true for the code, and the prompt says to stop and report in that case, not to change the text. No legal file was changed. Commits: `33aef12` (step 0: the prompt file), plus the commit that holds this report. Both pushed to `main`. `./deploy.sh` **not** run.

## The sentence that is not true

Prompt text (EN, same in DE): *"Before anything leaves your phone, the app rounds the place to about 1 km."*

What the code does with **"Use my location"**: after the forecast arrives, the app asks the phone's own map service (Apple / Google, via the `geocoding` plugin) for the **name of the town at your position**, and it passes the **unrounded** coordinates to that lookup. In plain words: the app rounds before talking to *our* server, but it also hands your approximate position, unrounded, to Apple's or Google's geocoding service to get a name like "Innsbruck" for the card. Apple and Google run that service on their servers, so this does leave the phone.

Where: `familyplanner-app/lib/features/weather/application/weather_controller.dart` lines 303–311 (`placeName(lat, lon, …)` inside `_fetchAndShow`, only when the source is `location`), calling `place_search_service.dart` line 72 (`placemarkFromCoordinates`). The same happens on every later refresh (`_showLocationOutcome` → `_fetchAndShow`), not only on the tap. The position itself is coarse (`LocationAccuracy.low`: roughly 1 km on iPhone, roughly city level on Android), but the app does not round it before this lookup.

The text covers the map service only for the **city** path ("If you choose a city instead, the name you type is looked up by your phone's own map service…"). So the paragraph is missing one data flow, and the "before anything leaves your phone" sentence contradicts it.

**Suggested fix (Planning Claude's call):** add one sentence after the city sentence, e.g. EN *"With \"Use my location\", the app also asks that map service for the name of the town at your position, so the card can show it."* and DE *"Bei „Meinen Standort nutzen“ fragt die App diesen Kartendienst außerdem nach dem Namen des Ortes an deiner Position, damit die Karte ihn anzeigen kann."* — and soften "Before anything leaves your phone" to "Before anything goes to our server". Or change the app to round (or skip the name lookup) first. I stopped before translating because fixing the sentence afterwards would mean redoing it in all 28 files.

## Everything else checked — true

All other facts in the prompt match the code (app at `af7e1065`, api at `bf78001`, the api repo is local at `~/Herd/familyplanner-api`):
- location only after the tap; `ask: false` on later refreshes never shows the OS dialog; low accuracy;
- city search through the phone's geocoder;
- the app sends 2-decimal coordinates (`roundCoordinate`); the server rounds again (`ShowWeatherRequest`);
- `MetNoWeatherProvider`: only rounded lat/lon + Daili User-Agent to `api.met.no`; cache key `weather:metno:{lat}:{lon}` with no user id; TTL = MET's `Expires` clamped 10–60 min; coordinates never logged;
- place, city and last forecast only in SharedPreferences `weather.*`; hide via card menu or Settings → "Weather on Today".

Minor, not a blocker: "Only if you tap 'Use my location' does the app ask your phone for your approximate location" — after the first tap the app reads the position again on every refresh without a new tap. Readers will understand "only if you choose this", so I would leave it.

**ARB words for DE** (checked, match the prompt): `weatherUseMyLocation` = "Meinen Standort nutzen", `settingsWeatherOnToday` = "Wetter auf Heute". All 25 ARBs have both keys (no ar/hi/ru ARB, as expected), ready for the re-run.

## Not done (waits for the corrected text)

Privacy paragraphs in 28 files, the 26 translations, the `check-legal.mjs` guard, the build. Nothing in `legal/` or `tools/` was touched; `git status` shows only the untracked files below.

## Untracked files that are not mine (left alone)

`claude-reports/2026-10-01/001-legal-daili-plus.md`, `static/assets/img/blog/what-to-look-for-family-app.webp`, `static/assets/img/photos/` (9 webp). Note: the 2026-10-01 report is a finished report that was never committed (commit `a98f36c` took the prompt but not this report). CLAUDE.md step 0 would normally commit it; the prompt said not to touch it, so I didn't — say the word and the next run commits it.

## Help impact

none
