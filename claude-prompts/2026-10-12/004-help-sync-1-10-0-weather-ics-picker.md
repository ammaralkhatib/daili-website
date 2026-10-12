# Help sync 1.10.0 — part 2: Weather, .ics import, the feature picker (+ the Start articles they touch)

## Goal
Part 2 of the 1.10.0 help sync (part 1 = `003`, part 3 = `005`). Three new
articles and the Start/Notifications articles that mention the same
features, in English and every `HELP_LOCALES` language.

**Do not deploy.** `LIVE_APP_VERSION` stays `'1.9.0'`.

## Sources (read in place)
- App reports `../familyplanner-app/claude-reports/2026-10-07/007`,
  `2026-10-11/001`–`005`, `2026-10-12/004`–`006` (Weather);
  `2026-10-08/003`, `004`, `005` (.ics import, Other calendars chooser);
  `2026-10-08/007`, `008` (feature picker); `2026-10-07/003` (Home week popup).
- API report `~/Herd/familyplanner-api/claude-reports/2026-10-11/003`
  (weather in the daily summary).
- Weather data source: prod runs **Apple Weather** (WeatherKit), MET Norway
  only as a fallback; the Weather screen's credit line names whichever
  answered. The privacy policy paragraphs `#weather` and `#weather-summary`
  (website prompt `002`) are the wording to stay consistent with.
- Labels: the app's ARB files. Picture ids: app report `2026-10-12/009`.

## Scope
- In: the articles named below under every `help/<code>/`,
  `help/media*.json` + `static/help/media/**` for `start-weather`,
  `start-features`, `start-home`, `start-today`, `calendar-other-calendars`
  (written by the app script — commit them), `help/routes-allowlist.json`
  (remove `/weather` from `pending`), `npm run build`.
- Out: everything else (same list as prompt `003`). Untracked files that are
  not yours: leave them.

## New articles
1. **`start-weather`** (`help/<code>/start/weather.md`) — "The weather on
   Today, Home and the Weather screen" (`media: start-weather`, `routes:
   /weather`, `tryIt: /weather`, `related: start-today, start-home,
   notifications-choose`). Facts: the weather card on Today (choose **Use my
   location** or a city; "Location is off" if the permission is off); tap the
   card for the Weather screen (sky that matches the weather and the time of
   day, the next 24 hours, 10 days — tap a day for its hours —, wind, UV,
   humidity, sunrise and sunset, and the weather at your family's events);
   on Home the Today button shows the sky and the temperature and the
   Weather tile tells you when rain is coming; hide it (card menu or
   Settings → **Weather on Today**); the location is approximate and only
   used for the weather (link `/privacy.html#weather`); the credit line shows
   where the forecast comes from. **Weather in your daily summary**: the
   switch in Calendar settings → daily summary adds one weather line to the
   morning and evening summary; it keeps a rough place (~10 km) while it is
   on, off deletes it (link `/privacy.html#weather-summary`). Do NOT promise
   a rain chance everywhere — it is shown only when the source has it.
2. **`calendar-import`** (`help/<code>/calendar/import.md`) — "Import a
   calendar file (.ics)" (`routes`: the import review screen's route from
   `../familyplanner-app/lib/core/routing/route_names.dart` if it has one;
   `related: calendar-phone-calendars`). Facts: Calendar settings → **Other
   calendars** → **Add a calendar** → **Import a file**; or tap an .ics in
   Mail/Downloads and choose Daili (Android "Open with"), or share it to
   Daili (Android and iPhone, from Mail or Files); a review screen shows what
   was found and you pick what to add; past entries are left out; duplicates
   start unticked; some repeat rules are added once; to-dos go into a list
   you choose; the file stays on your phone. Phones only (not the web app).
3. **`start-features`** (`help/<code>/start/features.md`) — "Choose what
   you see on Home" (`media: start-features`, no route — `/onboarding/features`
   is in `never`; `related: start-edit-home, start-create-family`). Facts:
   right after you create or join your first family, Daili asks what you
   want to use it for; every feature is on except Cycle; tap a card to read
   about it, tap its box to turn it off; change it any time in Settings →
   **Home screen**. One neutral sentence on the Cycle card: off by default,
   private, only on this phone (link `cycle-start`).

`since: 1.10.0`, `updated: <today>` for all three. At most one tip, on
`start-weather`, with a lower `tipPriority` than every existing tip.

## Updates (`updated: <today>`, `since` unchanged)
4. **`start-today`**: the weather card sits at the top (when it is on); pull
   down to refresh it; tap it for the Weather screen. Picture `start-today`.
5. **`start-home`**: the Weather tile; the Today button's sky and
   temperature; the week card's popup now lists birthdays, meals, to-dos and
   notes too, and a day with only those gets a grey dot. Picture `start-home`.
6. **`start-create-family`** and **`start-join`**: a new step after the
   family step — "What do you want to use Daili for?" (Continue / Skip), link
   `start-features`.
7. **`start-edit-home`**: one line + link to `start-features` (the picker
   writes the same Home settings).
8. **`notifications-choose`**: the new switches **Bill reminders** and
   **Budget alerts** (link `budget-bills`), and where the daily summary's
   weather switch is (link `start-weather`). Find where the daily summary is
   described today (grep "summary"); if no article describes it, add two
   sentences here.

## Constraints
Same as prompt `003` (translation rules file, app labels per language,
pt Brazilian, el/uk/bg never "family planner", brand casing, build +
`check-help` green, no reordering).

## Verify
Build. Spot-check `en` `start-weather`, `de` `calendar-import`, `fr`
`start-features`, `ko` `start-home`.

## Commit & push
`docs(help): 1.10.0 part 2 — weather, .ics import, feature picker`; body
`Prompt: claude-prompts/2026-10-12/004-help-sync-1-10-0-weather-ics-picker.md`.
**Push. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-10-12/004-help-sync-1-10-0-weather-ics-picker.md`, half a
page: articles × locales, pictures, routes, where the daily summary is now
described, build lines, SHA + push. `## Help impact`: n/a.
