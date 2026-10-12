# 004 — Help sync 1.10.0 part 2: Weather, .ics import, feature picker

**Status: done.** Step 0 had nothing to do: no planning docs were waiting. The work is in commit `ab8f822`, pushed to `main`. This report is in the commit after it. I did **not** run `./deploy.sh`, and `LIVE_APP_VERSION` is still `'1.9.0'`.

## Articles (all 25 locales)
- **New, `since: 1.10.0`:**
  - `start-weather` (order 8): has the only new tip, priority **30**, lower than every other tip (the lowest was 35).
  - `calendar-import` (calendar, order 10)
  - `start-features` (order 7)
- **Updated, `updated: 2026-10-12`:**
  - `start-today`: the weather card at the top, pull down to refresh, tap for Weather. New alt text, because the picture now shows the Today screen.
  - `start-home`: the Today button shows sky + temperature, the Weather tile, and the week now lists birthdays, meals, to-dos, notes and **bills**, with a grey dot.
  - `start-create-family` and `start-join`: the "What do you want to use Daili for?" step.
  - `start-edit-home`: one line saying the picker sets the same tiles.
  - `notifications-choose`: **Bill reminders** and **Budget alerts**, plus the daily summary. Its alt text now says "seven switches".
- **How the translations were made:** same method as 003. I wrote the English first. A fresh sub-agent fact-checked it against the code, and I fixed 5 sentences. Then six translators each did 4 languages from a `{{arbKey}}` template, and a script filled in the app labels. The 6 updated articles only add the new lines; every other line stays as it was.

## Daily summary
No article described it before. It is now covered in two places:
- **`notifications-choose`**, new paragraph: it lives in **Calendar settings → Daily summary** (Morning, Evening, Weather in daily summary).
- **`start-weather`**: the weather line, the rough place (about 10 km), and that switching it off deletes the place.

## Pictures and routes
- **Pictures committed for all 25 locales:** `start-weather`, `start-features`, `calendar-other-calendars` (used by `calendar-import`), `start-home`, `start-today`, plus every `help/media*.json` (all its changes were these ids).
- **Pictures left for part 3:** the re-shot notes and meals pictures, and `calendar-photo` (all uncommitted).
- **`pending` is now `{}`:** `/weather` was the last entry, and `start-weather` covers it.
- **Routes (prompt deviation):** the guard requires at least one route per article.
  - `start-features` uses `/settings/home-tiles`, because `/onboarding/features` stays in `never`.
  - `calendar-import` uses `/calendar/settings`, because the review screen has no route.

## Facts where the code differed from the prompt
- **The week popup also lists bills** (when the Bills layer is on).
- **"Open with" is Android only.** Sharing to daili works on both phones.
- **Past *events* and *finished* to-dos are left out.** A to-do whose date has passed is still offered.
- **The Weather screen's events block** shows today's timed events only, at most 3, and sits above the 10 days.
- **Family can be hidden later** in Settings → Home screen, so the text says "Calendar and Family are not on the list; they stay on Home".
- **No rain chance is promised,** and no weather source is named: the text says "the bottom line names the source".

## Left out to stay under 150 words
- the 12-hour strip on the Today card
- the "Tomorrow:" line
- feels like
- dew point
- the Open settings button
- the 30-minute auto-refresh
- the 300-entry import cap

Privacy links became text ("More in the privacy policy on daili.app"), because body links are forbidden.

## Verify
- **`npm run build` exits 0:**
  - `help OK · 85 article(s) · … · 71 app routes checked`
  - `test-check-help OK · 99 cases`
  - `build OK · 2384 pages`
  - every locale: `85 articles, 16 tips, 6 checklist`
- **Spot checks:** `en start-weather`, `de calendar-import`, `fr start-features` (tu, "Agenda"), `ko start-home`. All labels match the ARBs.

## Notes from the translators (app side, not fixed)
- **`featurePickerTitle` writes "Daili" with a capital D** in every language, so it shows that way in the help next to lower-case "daili".
- **The section and the weather switch use different words for the summary** in fi (kooste/yhteenveto), sk (prehľad/súhrn), ko (하루 요약/일일 요약) and zh-Hans (汇总/摘要).
- **`settingsWeatherOnToday` reads stiffly** in pl ("Pogoda w Dziś") and cs ("Počasí v Dnes").
- **th:** `featurePickerTitle` has no question mark.

## Not mine (untouched, not committed)
- `claude-reports/2026-10-01/`
- `static/assets/img/blog/what-to-look-for-family-app.webp`
- `static/assets/img/photos/`
- the part-3 pictures

## Help impact
n/a
