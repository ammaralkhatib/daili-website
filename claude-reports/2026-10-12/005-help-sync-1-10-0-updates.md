# 005 — Help sync 1.10.0 part 3: update existing articles

**Status: done. This was a RESUMED run.** The first run (2026-10-12) stopped at a usage limit. It left the en and nb articles finished but uncommitted, and translator output for 22 languages in `/tmp/help110c/out/` that had not been applied yet. cs and da were missing. On 2026-10-13 I checked what was there, kept it, finished the rest, and committed. The work is in commit `e84e132`, pushed to `main`. I did **not** run `./deploy.sh`, and `LIVE_APP_VERSION` is still `'1.9.0'`.

## What I checked from the first run
- **English:** a fresh sub-agent fact-checked all 15 changed English articles against the app at HEAD (clean tree) and the app, web and API reports. It found **no wrong sentences**, so I changed nothing in en.
- **nb:** already applied. I re-read it and kept it.
- **Widget name:** the brief used `navCalendar` for the widget's new name **Calendar**. The real name comes from Android `widget_calendar_name`. I compared both in all 25 languages, and they are the same word everywhere.

## Articles × locales (all 25 locales, `updated` / `translatedFrom: 2026-10-12`)
- **Rewritten:** `calendar-phone-calendars`. New title "Add other calendars: your phone, Google, links and files". It has the **Add a calendar** chooser, the **Only you** / **Family** tags, and ⋮ → **Remove**. It does not mention Outlook. It uses the picture `calendar-other-calendars`.
- **Updated:**
  - `calendar-edit-delete`: Move an event (drag, Undo).
  - `calendar-views`: **Show on calendar**, now with notes with a reminder and bills.
  - `calendar-repeating`: the per-day **For**.
  - `lists-todos`, `lists-due-reminders`, `lists-shopping`: open at that to-do, Minzi, **Add to budget**.
  - `habits-minzi`
  - `notes-notes`: the grid, and the Draw button.
  - `notes-pictures-voice`
  - `meals-search-online`: **All** / **Vegan** / **Vegetarian**. No sentence says "vegan only" any more.
  - `anywhere-widgets`: the widget is now called **Calendar**.
  - `anywhere-web`: notes on the web.
  - `account-preferences`: **Weather on Today**.
  - `account-feedback`: **Share Daili**.
- **Per-day "For": added.** App report `2026-10-10/001` exists and says done. The text is in `calendar-repeating`, with routes `/calendar/new, /calendar/edit`.
- **"Free forever": not added anywhere.**

## Pictures
- **Committed for all locales:** `notes-list`, `notes-new`, `notes-ai`, `meals-suggest`, `meals-youtube`, `meals-photo` and `calendar-photo`, all from app 009. The en folder also gets `meals-add-recipe`, `meals-import-link` and `meals-paste`. These are 009's "extra" re-shoots of the same recipe sheet.
- **Deleted: the old `calendar-phone-calendars` picture** (25 files, plus its entry in every `help/media*.json`). It showed the old Phone calendars section, which no longer exists. Once the article used `calendar-other-calendars`, `check-help` failed the old picture as an orphan.

## Routes
- `calendar-views` now also lists `/calendar/settings`.
- `calendar-repeating` now also lists `/calendar/edit`.
- **`pending` is `{}`.** It was already empty after part 2, and nothing new had to be added.

## Verify
- `node tools/check-help.mjs`: `help OK · 85 article(s) · 25 locales · 71 app routes checked`
- `npm run build`: exit 0
  - `content OK`, `legal OK`
  - `test-check-help OK · 99 cases`
  - `build OK · 2384 pages`
  - `detector OK`
  - every locale: `85 articles, 16 tips, 6 checklist`
- `grep -ril outlook help/*/calendar/phone-calendars.md` → nothing.
- **Spot checks:**
  - `en calendar-phone-calendars`: no Outlook.
  - `de meals-search-online`: "Zuerst ist **Alle** gewählt…", with no vegan-only sentence.
  - `nl notes-notes`: grid paragraph, Draw in the alt text.
  - `tr anywhere-widgets`: **Takvim**.
  - el/uk/bg: no "family planner".

## Small notes (not changed)
- `calendar-views` says the gear → Show on calendar "adds" the layers. All six are actually **on** by default. The text is still true, just a little loose.
- In `notes-notes`, "tag-coloured frames": only tiles that have a tag get a coloured border.
- In the da and cs ARB, `widgetCalendarTitle` (the header inside the widget) is still the old "Up next" word. The phone's widget list uses `widget_calendar_name`, which is "Kalender" / "Kalendář". So the help text is right.

## Not mine (untouched, still untracked)
`claude-reports/2026-10-01/`, `static/assets/img/blog/what-to-look-for-family-app.webp`, `static/assets/img/photos/`.

## Reminder for the owner
On store day: set `LIVE_APP_VERSION` to `'1.10.0'` and deploy. Don't deploy the site before then. These 15 articles keep their old `since`, so `since` does not hide them. A deploy now would show 1.10.0 features to people who still have 1.9.0.

## Help impact
n/a
