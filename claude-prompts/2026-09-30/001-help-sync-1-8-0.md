# Help sync 1.8.0: assignees, private lists and tasks, family photo, habits "Coming up", iCloud mail, Apple Watch pictures

## Goal
Make the Help center true for release 1.8.0 (13). Cover everything the app, api
and web reports flagged under `## Help impact` since the 1.7.0 sync, in English
and in every `HELP_LOCALES` language, plus the re-shot pictures. Run this AFTER
the picture commands in "Pictures" below (the run script does them first).

**Do not deploy.** Ammar deploys on store day together with the
`LIVE_APP_VERSION` 1.8.0 bump. The app reads `help/en.json` live, so an early
deploy would describe features that people's app does not have yet.

## Sources (read in place, don't copy)
The `## Help impact` section of each report below is the full fact list. The
short list under "Updates" is only a map. When a report says more, follow the
report:
- `../familyplanner-app/claude-reports/2026-09-29/002-event-assignees-form.md`,
  `003-event-assignees-calendar-views.md`, `004-family-photo.md`,
  `013-notifications-row-wording.md`, `014-habits-coming-up.md`
- `../familyplanner-app/claude-reports/2026-09-30/001-private-lists.md`,
  `002-private-tasks.md`, `003-apple-mail-hints.md`, `005-add-bar-lock-right.md`
- `../familyplanner-app/claude-reports/2026-09-28/019-l10n-register-sweep.md`
  (the fr / pt / id / nb labels that changed)
- `~/Herd/familyplanner-api/claude-reports/2026-09-29/006-trust-apple-mail-addresses.md`,
  `008-restore-link-verifies-email.md`, and
  `2026-09-30/001-private-lists-and-todos-rules.md`,
  `002-private-lists-and-todos-side-channels.md`,
  `004-rescue-private-items-on-list-delete.md`
- `../daili-web/claude-reports/2026-09-30/001`–`004` (only when an article
  already talks about the web app)
Take labels from the app's ARB files (`../familyplanner-app/lib/l10n/`) and
check a behaviour in the app code when a report is unclear. Do not guess.

## Scope
- In: the articles below under every `help/<code>/`, `help/media*.json`, the
  pictures under `static/help/media/` for the ids listed in "Pictures" plus
  `watch-todos` / `watch-habits` / `watch-quick-note`, `npm run build`.
- Out: `site.config.mjs` (no `LIVE_APP_VERSION` bump), the home page / Bevel
  files, legal pages, blog, `changelog/whats-new.*.html` (the release prompt
  writes that), every other uncommitted file (`static/assets/img/blog/…`,
  `static/assets/img/photos/`: leave them untracked).

## Updates (English facts; write them in each article's own voice, 1–3 sentences each; set `updated: 2026-09-30`; `since` stays)

1. **`calendar-add-event`**: the new **For** row. You pick who the event is
   for (children too). Nobody picked means everyone. Only the picked people
   with a login get its reminders and notifications. Private events have no
   **For** row.
2. **`calendar-repeating`**: the people belong to the whole series. After you
   change them, **This event only** is not offered (use the app's greyed-option
   wording).
3. **`calendar-views`** (the article with the People filter): People now
   includes children. An event shows under the people it is for, and an event
   for everyone shows under the person who made it. The coloured stripe is the
   first picked person's colour.
4. **Family photo**: admins tap the family picture on the Family screen to take,
   choose or remove a photo. It also shows in the family switcher. Put it in
   the family article that describes the Family screen header or settings
   (`family-roles` or `family-groups`; pick the better fit and say which in
   the report).
5. **`habits-tick`** (or `habits-what` if the Today tab is described there):
   **Coming up** lists habits not due today, with the day each is next due.
   After you create a habit that isn't due today, a message says when it
   shows up.
6. **Private lists** (`lists-edit-list`, and one sentence in `lists-shopping` +
   `lists-todos` where a list is created): the **Only me** switch. Only you see
   the list and everything in it, and a lock shows next to its name. Only the
   person who made it can change the switch. Private lists and tasks send no
   notifications to others. They are not in the activity feed, other people's
   suggestions or morning summary, or on the TRMNL wall screen. Their
   reminders go only to you. Deleting a SHARED list keeps other members'
   private tasks: each of them gets a private list with the same name.
7. **Private tasks** (`lists-todos`, `lists-assign`, `lists-all-mine`):
   - In a shared to-do list, the lock sits on the right of the add bar, just
     before the send arrow. It shows an open lock while off and a closed lock
     while on. When it is on, the next tasks you add are private, until you
     leave the list.
   - The edit sheet has a **Private task** switch ("Only you can see this task.").
   - A private task can only be given to you, or to children without a login.
     Switching a task to private takes the other people off it.
   - Private tasks show a lock in **Mine** / My tasks.
8. **`account-password`** (forgot password part): with an @icloud.com / @me.com
   / @mac.com address, Apple may block our mail. Check Junk, or write to
   support@daili.app. On iPhone, **Continue with Apple** + **Share My Email**
   avoids it.
   **`family-invite`**: when you invite an iCloud address by email, also send
   the code or link yourself.
9. **`account-verify-email`**: iCloud / me.com / mac.com addresses count as
   confirmed right away and get no confirmation mail.
   **`account-delete`**: restoring with the link in our email also confirms
   your address.
10. **`notifications-turn-on`** (or `notifications-help`, wherever the
    "notifications are off" warning is quoted): the warning now says
    notifications are off, so daili can't tell you when something changes.
    It no longer talks only about reminders.
11. **Apple Watch pictures**: add `watch-todos`, `watch-habits` and
    `watch-quick-note` back to `anywhere-watch` at the matching sections
    (all locales). Re-add them to `help/media*.json` and commit their 75
    WebPs, which are on disk uncommitted.
12. **fr / pt / id / nb labels**: in those four help languages, replace every
    app label that report 019 changed with the new ARB label, so the text
    matches the 1.8.0 app (pt is now Brazilian, fr uses "tu", id uses "Anda",
    nb uses "KI").

Already checked, no change needed: no article lists holiday countries (the
Philippines needs nothing). No article quotes a reminder push text like
"Starts at 09:00" (the new "Tomorrow at 09:00" needs nothing).

## Pictures
The run script makes these with the app harness BEFORE this prompt. The
harness writes into this repo:
- en + all locales: `--only lists-todos,lists-assign,lists-all-mine,lists-edit-list,calendar-repeating,calendar-reminders,calendar-private,habits-tick`
- the full set again for `pt,fr,id,nb` (their labels changed).
Commit every changed or new picture under `static/help/media/` for those ids
and those four locales, plus the three watch pictures. List any missing
picture in the report (the `help/media-gaps.json` rules apply; do not fail for
it).

## Constraints
- Translate every changed article into all `HELP_LOCALES` following
  `claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md`. Use the app's own
  labels per language.
- `npm run build` green, `node tools/check-help.mjs` green.
- Front matter otherwise unchanged. No reordering.

## Verify
- Build. Spot-check `de` `lists-todos` and `en` `calendar-add-event`, and check
  that `pt` `lists-shopping` uses the new Brazilian labels.

## Commit & push
- `docs(help): 1.8.0 — assignees, private lists and tasks, family photo, Coming up, iCloud mail`;
  body includes `Prompt: claude-prompts/2026-09-30/001-help-sync-1-8-0.md`.
  **Push. Do NOT run `./deploy.sh`.**

## Report
- `claude-reports/2026-09-30/001-help-sync-1-8-0.md`, half a page: articles ×
  locales touched, pictures found/missing, build lines, SHA + push, and the
  reminder: deploy on store day with `LIVE_APP_VERSION` 1.8.0.
