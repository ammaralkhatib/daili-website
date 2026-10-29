# Help sync 1.14.0: People + Year views, lists archive + templates, wall screens, sign-in, habits, vault, activity

## Goal
Make the help center true for app 1.14.0 (20) in English and every
`HELP_LOCALES` language, with the pictures from app prompt
`../familyplanner-app/claude-prompts/2026-10-29/017-prerelease-1-14-0.md`
(already written to `static/help/media/**` by the runner — commit them here).

**Do not deploy.** `LIVE_APP_VERSION` stays as it is. Updated articles keep
their `since` and get `updated:` = the day you run this. New paragraphs for
features new in 1.14.0 are marked the way existing articles mark
version-gated text (check how 1.13.0 did it in `calendar-repeating` /
`notes-notes`; if there is no in-article gate, just write it). New articles
get `since: 1.14.0`.

## Sources (read in place — the reports are the fact list)
- App reports `../familyplanner-app/claude-reports/`: `2026-10-27/005` +
  `2026-10-28/001`–`003` (vault folders) · `2026-10-28/005` `006` (week
  numbers) · `2026-10-29/001` (wall screens in the app) · `002` `004`
  (habits every N weeks, Some days default) · `003` (already linked) · `006`
  `007` (calendar belongs to) · `008` (People view) · `009` (Year view) ·
  `010` (clear activity) · `011` (push language per device) · `012` (export
  "verify first") · `013` (sign-in layout) · `014` (Cycle tile) · `016` (lists
  archive + templates) · `017` (pictures + alt texts).
- API reports `~/Herd/familyplanner-api/claude-reports/2026-10-28/001`–`003`
  (wall screens) · `2026-10-29/005` (activity clear, 90 days) · `007` (lists).
- Web reports `../daili-web/claude-reports/2026-10-29/001`–`009` (web side of
  the same features: People view key P, Year view key Y, belongs-to, habits,
  activity clear if `008` exists).
- Labels: the app's ARB files (`../familyplanner-app/lib/l10n/`) and, for web
  steps, `../daili-web` locale files. Check the code when a report is unclear.
  Do not guess. Read every `## Help impact` section above.

## Articles (English facts; short sentences; voice and brand spelling of the existing articles)

1. **`calendar-views`** — two new views: **People** (one column per family
   member, like a wall planner; the Columns sheet reorders or hides people;
   tap an empty spot to add an event for that person) and **Year** (only
   all-day and multi-day events, colour = person, chips filter people, tap a
   month to open it). Both also on app.daili.app (keys P and Y). Add **Week
   numbers** (Calendar settings → Week numbers; "W44" in the first day of each
   week, in the header of week/3-day/day). Pictures `calendar-people-view`,
   `calendar-year-view` in the text. Keywords: people, columns, wall planner,
   year, holidays, trips, week number, KW, calendar week.
2. **`calendar-phone-calendars`** (and the article(s) for Google / `.ics`
   links — find them by content) — each linked calendar has a **Belongs to**
   row (Google: default you, a calendar not shared shows "Only you"; `.ics`:
   default Everyone, list shows "For Mia, Leo"; phone calendars: default you,
   saved on this phone only). Events then get that person's colour stripe and
   a "For …" line, and the People filter hides them with that person. Adding
   a link your family already has now says "This calendar is already linked
   …". Re-shot picture `calendar-other-calendars`.
   🔴 Do NOT mention Outlook anywhere (not announced yet).
3. **NEW `lists-archive-templates`** (topic lists): archive a finished list
   (list card ⋯ or the list's ⋯ → **Archive**, Undo), find it under
   **Archived · N** at the end of your lists, open it read-only, **Restore** or
   **Delete**; **Save as template** from a list's ⋯, then **New list → Start
   from a template**; manage templates under the lists ⋯ → **Templates**
   (use, rename, delete). Templates are shared with the family. Shopping and
   to-do lists. Routes: `/lists/archived`, `/lists/templates`. Pictures
   `lists-archive`, `lists-templates`. Link it from `lists-edit-list` +
   `lists-shopping` related.
4. **`anywhere-wall`** (+ `anywhere-wall-tick` if it names the app) — app path:
   **Settings → Wall display → Connect a screen** (type the code or scan the
   QR the tablet shows), and **Wall screens** to see or remove your family's
   screens (only admins). Use the app's real labels. Then empty the `pending`
   list in `help/routes-allowlist.json` (the four `/settings/wall-display*`
   routes go into this article's `routes:`).
5. **`start-sign-in`** — new order: Google / Apple first, then "or with
   email" and the form; the switch to the other screen is always at the
   bottom. New phones start on **Create account**. Pictures `start-sign-in`
   + `start-register`.
6. **`start-edit-home`** + **`cycle-start`** — in edit mode the Cycle tile
   shows (faded) even while Cycle is off; tapping it starts the Cycle setup.
   Cycle can also be turned on from **Settings → Home screen**. Re-shot
   picture `start-edit-home`.
7. **`habits-create`** — "Some days" can repeat **every 2–8 weeks** (e.g.
   every second Tuesday) with a **First time** choice (on edit: **Next
   time**); rows read "Every 2 weeks · Tue"; picking Some days starts with
   only today's day switched on. Re-shot picture `habits-create`.
8. **`family-activity`** — **Clear** clears the list only for you; your
   family still sees everything; entries are removed after 90 days anyway;
   archived / restored lists show with their own words. Re-shot picture.
9. **`vault-documents`** + **`vault-photos`** (+ `vault-where` if it
   describes it) — with 2+ families or groups, each folder / album has
   **Show in** (all my families, or one family); a small family tag marks the
   ones shown only in the current family; every folder/album has a ⋮ menu
   with Edit and Delete; the line "Only on this phone. Only you can see these
   files/photos." sits under the grid. Re-shot pictures.
10. **`account-preferences`** — line 31 ("Except the language, these settings
    are for this phone only.") and line 33 (the Note) are wrong now:
    notifications come in the language Daili uses **on that phone**; e-mails
    in the language you last picked.
11. **`account-download-data`** — without a confirmed e-mail the app now says
    so and offers **Send link**.
12. The older owed items in PLAN.md "Help sync owed" are NOT part of this
    prompt — leave them.

🔴 Never mention: Outlook, the "free forever" welcome promise, Siri on the
watch, widget background updates (all "not announced yet").

## Translations
Translate every changed and new article into all `HELP_LOCALES`, following
`claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md` (labels from each
language's ARB). New pictures: the runner already made them for all locales;
if a locale's picture is missing, list it in the report (do not invent one).
Pictures that did not change: untouched. Sub-agents may translate in
parallel, one locale group each.

## Build
`npm run build` must pass (check-help, routes, search tests). A build failure
not caused by this change: stop, report `blocked`.
Read the built English + German `calendar/views`, the new lists article and
`anywhere/wall` pages: text, pictures, related links render.

## Commit & push
`docs(help): 1.14.0 — People + Year views, list archive + templates, wall screens, sign-in, habits, vault, activity`;
body `Prompt: claude-prompts/2026-10-29/004-help-sync-1-14-0.md`. Your files
only (plus the help pictures and `help/media*.json`). 🔴 Do NOT stage the
untracked `static/assets/img/photos/` folder. **Push now. Do NOT run
`./deploy.sh`.**

## Report
`claude-reports/2026-10-29/004-help-sync-1-14-0.md` (file-write tool, never
a heredoc; `wc -c` non-zero), half a page: articles changed + new (and any
from the list you left alone, with why), labels checked (and any mismatch with
a report), locales done, missing pictures, build result, SHA + push.
`## Help impact`: this IS the help sync — list the article ids.
