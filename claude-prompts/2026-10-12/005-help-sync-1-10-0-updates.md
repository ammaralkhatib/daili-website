# Help sync 1.10.0 — part 3: update existing articles (calendar, lists, notes, meals, widgets, web, settings) + empty `pending`

## Goal
Last part of the 1.10.0 help sync (after `003` and `004`). Make every
existing article true for 1.10.0, in English and every `HELP_LOCALES`
language, and leave `help/routes-allowlist.json` → `pending` EMPTY.

**Do not deploy.** `LIVE_APP_VERSION` stays `'1.9.0'`.

## Sources (read in place)
App reports `../familyplanner-app/claude-reports/` with a `## Help impact`
line since `2026-10-07` (list below names them), daili-web reports
`../daili-web/claude-reports/2026-10-09/001`–`004` and
`2026-10-10/001` (if it exists), API report
`~/Herd/familyplanner-api/claude-reports/2026-10-10/001`. Labels = the ARB
files. Check the app code when a report is unclear.

## Updates (`updated: <today>`, `since` unchanged; each in the article's own voice)
1. **`calendar-phone-calendars`** — rewrite for the new **Other calendars**
   section (app 2026-10-08/005 + 006). New title like "Add other calendars:
   your phone, Google, links and files"; keep the id. **Add a calendar**
   opens a chooser: your phone's calendars (**Apple Calendar** on iPhone,
   **Phone calendars** on Android), **Google Calendar**, subscribe with a
   link, **Import a file** (link `calendar-import`). Linked calendars show
   "Only you" / "Family". The phone row: tap to choose calendars, ⋮ →
   **Remove** (asks first; nothing on the phone is deleted; adding it again
   restores your picks). 🔴 Do NOT mention Outlook (hidden until it is ready).
   Picture: `calendar-other-calendars` in the text; keep `media:` as is
   unless the old picture is now wrong.
2. **`calendar-edit-delete`** — new section "Move an event": hold it and drag
   it — to another day in the month view, to another day and time in the
   week, 3-day and day views (all-day events across days in week and 3-day);
   a repeating event asks "this one" or "this and following"; **Undo** on
   the message (app 2026-10-07/005, 006).
3. Calendar layers (find the article that lists what the calendar can show
   — birthdays, meals, to-dos; likely `calendar-views`): add **Notes with a
   reminder** and **Bills** (link `budget-bills`); the day sheet shows those
   rows, and a to-do row opens its list at that to-do (app 2026-10-07/003,
   2026-10-07/028).
4. **Per-day "For"** (only if `../familyplanner-app/claude-reports/2026-10-10/001-per-day-event-assignees.md`
   exists and says done; otherwise skip and say so): in the article that
   explains who an event is for (`calendar-add-event` / `calendar-repeating`),
   add: in a repeating event you can set the people for ONE day — edit that
   day, change **For**, choose "only this event"; picking the series' people
   again makes the day follow the series; reminders follow that day's people
   (api 2026-10-10/001).
5. **`lists-todos`** / **`lists-due-reminders`**: tapping a to-do reminder
   opens the list at that to-do and highlights it; finishing a whole list,
   or all of Today's to-dos, brings Minzi out to celebrate. **`lists-shopping`**:
   ⋯ → **Add to budget**, and the "All bought" offer after the last item
   (link `budget-bills`).
6. **`habits-minzi`**: Minzi also appears outside Habits — but only when a
   list is finished or all of Today's to-dos are done.
7. **`notes-notes`**: Notes opens in the **grid** (pictures and drawings
   big; tiles show their tag colours as a border); the button at the top
   switches to the list. **Draw** is its own button in the new-note bar,
   after Link. **`notes-pictures-voice`**: replace "Photo → Draw" with the
   Draw button. Pictures `notes-list`, `notes-new` (re-shot by app 009).
8. **`meals-search-online`** (and `meals-find` if it repeats it): online
   search now finds every kind of recipe; **All** is the default and
   **Vegan** / **Vegetarian** are optional filters. Remove every "only vegan
   and vegetarian" sentence.
9. **`anywhere-widgets`**: the calendar widget is called **Calendar** in the
   phone's widget list (was "Up next"); check the widget list in the text
   against the app's widgets today (read `../familyplanner-app/lib/features/home_widgets/`)
   and fix any wrong count or name.
10. **`anywhere-web`**: Notes are on the web app now — list, filters, write,
    tags, pin, sharing, reminders, Recently deleted, pictures for Daili Plus
    families; notes with a reminder on the web calendar; Home's quick
    capture can make a note. Not on the web: recording voice and the AI
    helpers.
11. **`account-preferences`** (or the article that walks through Settings):
    the **Share Daili** row (About), and **Weather on Today** (link
    `start-weather`).
12. AI pictures: if app 009 re-shot any of `notes-ai`, `meals-suggest`,
    `meals-youtube`, `meals-photo`, `calendar-photo`, commit the new files
    (no text change — the moving border is decoration).
13. 🔴 Do NOT add the early-family "free forever" promise anywhere (locked
    2026-10-12: in the app only).

## Routes
Give each article the app routes it covers (read
`../familyplanner-app/lib/core/routing/route_names.dart`). Then
`help/routes-allowlist.json` → `pending` must be `{}`; if a route is still
not covered by any article, write the shortest correct article section that
covers it rather than leaving it pending, and say so.

## Constraints
Same as prompt `003` (translation rules, app labels per language, pt
Brazilian, el/uk/bg never "family planner", brand casing, build +
`check-help` green, no reordering). Changed articles in every locale get the
new `translatedFrom`.

## Verify
Build. Spot-check `en` `calendar-phone-calendars` (no "Outlook"), `de`
`meals-search-online` (no vegan-only sentence), `nl` `notes-notes`, `tr`
`anywhere-widgets`, and `pending` is empty. `grep -ril outlook help/*/calendar/phone-calendars.md`
→ nothing.

## Commit & push
`docs(help): 1.10.0 part 3 — calendar, lists, notes, meals, widgets, web, settings`;
body `Prompt: claude-prompts/2026-10-12/005-help-sync-1-10-0-updates.md`.
**Push. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-10-12/005-help-sync-1-10-0-updates.md`, half a page:
articles × locales, whether per-day "For" was added, routes now covered,
`pending` empty, build lines, SHA + push, reminder: deploy on store day with
`LIVE_APP_VERSION` 1.10.0. `## Help impact`: n/a.
