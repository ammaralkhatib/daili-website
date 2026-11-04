# 001 — Help sync 1.15.0

**Status: done.** Commits `3cacbb5` (the sync) and `266c506` (two missed `related` links), both pushed to `origin/main`. **Not deployed** (no `./deploy.sh`). `LIVE_APP_VERSION` is still 1.14.0, so the 6 new articles have no page yet. They are in `dist/help/<loc>.json`.
Step 0: the planning docs went first as `6909b5b` (prompts 001 + 002 and report 2026-11-03/004).

## Articles
**New** (`since: 1.15.0`): `meals-meal-settings`, `meals-leftovers-and-eating-out`, `meals-cook-mode`, `meals-share-sheet`, `notifications-tips`, `account-help-improve`.

**Updated** (`updated: 2026-11-05`, `since` unchanged):
- **Meals:** `meals-plan-week`, `meals-add-recipe`, `meals-youtube`, `meals-search-online`, `meals-suggest`.
- **Calendar and Home:** `calendar-views` (it also carries the Filter → Calendars part), `calendar-phone-calendars`, `start-home`.
- **Lists, notifications, account:** `lists-due-reminders`, `notifications-choose`, `account-preferences`.
- **The "adults (18+)" line:** `meals-photo`, `calendar-photo`, `notes-notes`, `account-avatar-ai`.
- **The share link:** `meals-import-link`.

As in 1.13.0 and 1.14.0, there is no in-article version marker; the new text is simply written in.

**Changed, though not on the list, because the code made them false:**
- `meals-copy-week` and `meals-to-shopping`: the copy and cart buttons at the top and the empty-week button are gone. The articles now name **Copy last week** and **Shop this week** in the row under the week.
- `start-today`: the **Tonight** card only lives on the Today screen, under **Meals today**. It is not on Home and not on the Plan tab. So I left it out of `start-home` and `meals-plan-week`, and wrote it here.

**Pictures removed:** `meals-suggest` and `meals-copy-week` showed the old top bar (sparkle, copy, cart). Both articles now use the re-shot `meals-plan-week`. I deleted the two orphaned ids from every `help/media*.json` and `git rm`'d their 50 webp files.

**`related` only:** `calendar-add-event` and `notes-notes` now link to `meals-share-sheet`.

**Facts left out to stay under 150 words:**
- the first-week card's details;
- web drag-to-swap;
- the "+N more" label on the Home card;
- "Tap a person to hide them" and "tap an empty spot" in the views;
- "All is picked at first" in online search;
- "it can take up to a minute" for YouTube;
- "Morning of (9:00)" as an example reminder.

## Labels checked
Every new label is an `{{arbKey}}` placeholder that `/tmp/help115/fill.mjs` filled from each `app_<lang>.arb`, so none was typed by hand. A fresh Opus fact-check against the app, API and web code found 23 errors before translation. All are fixed.

**Where it corrected a report or the prompt:**
- **Tonight card:** it is on the Today screen only.
- **"Busy evening — something quick?":** this string is never used. The add sheet says "Busy evening, so quick meals come first".
- **Busy evenings:** they use every calendar daili shows (timed events only), not just the family calendar.
- **No YouTube live preview:** ▶ opens YouTube.
- **Google:** the button is **Connect**, not Link.
- **Try again:** it reopens the filters.
- **Suggestions:** meals from the last 7 days are skipped, not two weeks. The old article was wrong too.
- **Tips:** at most one a day and two a week, only after a day or two away. There is no "few in total" cap.
- **Help improve Daili:** the row in Settings only shows for admins, or once it is on.
- **Save and plan:** it sits on the search result card.
- **Cook double:** it also doubles the servings.

## Routes
`/meal-plan/settings` is now covered by `meals-meal-settings`, and the `pending` list is empty. The build found no other app route without an article (81 routes checked against app HEAD `49d05302`).

## Locales
All 24 `HELP_LOCALES`, done by 12 Opus translators with 2 locales each, plus one round of English clarity fixes sent back to them. All of them finished before the commit. I re-rendered and re-checked all 600 files myself: 25/25 clean per locale.

## Missing pictures
None. All 25 locales have all 16 new and re-shot pictures.

## Build
`npm run build` is green: 103 articles per locale, 81 app routes, the guard tests and help search all pass.

I read the built en + de `meals/plan-week` and `calendar/phone-calendars` pages: the text, pictures (3 and 2) and related links render. `meals-meal-settings` and `account-help-improve` render correctly in `en.json` and `de.json`, with their picture and related links.

## Open items for Ammar
- **Outlook in a picture:** `calendar-link-only-me` shows the app's own hint "Paste an ICS or webcal link — from Google Calendar, Apple Calendar, Outlook…" in every locale. The help text never says Outlook. If even this must go, the hint string or the shot needs a change.
- **Re-shoot later (in help-shots.json):** `meals-suggest` and `meals-copy-week` were removed here. If they are shot again, add them back to the articles. `start-today` does not show the Tonight card yet.
- **Same label for two buttons (ARB):** "Plan my week" and "Plan the week" are identical in de, nb, sv, sk and ro. In fi, "Eating out" and "Eat out instead" are identical.
- **Outlook in an older article:** `anywhere-ai-apps` in all 25 locales says "Google or Outlook events never reach it" (a privacy note). I didn't touch it here; drop "or Outlook" if Outlook must not appear anywhere.

## Help impact
This IS the help sync:
- **New:** `meals-meal-settings`, `meals-leftovers-and-eating-out`, `meals-cook-mode`, `meals-share-sheet`, `notifications-tips`, `account-help-improve`.
- **Updated:** `meals-plan-week`, `meals-add-recipe`, `meals-youtube`, `meals-search-online`, `meals-suggest`, `meals-copy-week`, `meals-to-shopping`, `meals-photo`, `meals-import-link`, `calendar-views`, `calendar-phone-calendars`, `calendar-photo`, `start-home`, `start-today`, `lists-due-reminders`, `notifications-choose`, `account-preferences`, `account-avatar-ai`, `notes-notes`.
- **`related` only:** `calendar-add-event`.
