# Help sync 1.13.0: Copy to Daili, monthly weekday, to-do repeats, notes formatting, family + account changes

## Goal
Make the help center true for app 1.13.0 (19) in English and every
`HELP_LOCALES` language, with the pictures from app prompt
`../familyplanner-app/claude-prompts/2026-10-27/007-help-shots-1-13-0.md`
(already written to `static/help/media/**` by the runner — commit them here).

**Do not deploy.** `LIVE_APP_VERSION` stays as it is. No new article this
round; updated articles keep their `since` and get `updated:` = the day you
run this. Where a NEW feature gets a new paragraph inside an old article,
mark it the way existing articles mark version-gated text (check how
`account-avatar-ai` / 1.12.0 did it; if there is no in-article gate, just
write it).

## Sources (read in place — the reports are the fact list)
- App reports `../familyplanner-app/claude-reports/`: `2026-10-24/006`
  (Copy to Daili) · `2026-10-25/003` (invite step after create) · `004`
  (delete reason) · `006` (Android backup) · `007` (app switcher) · `010`–`014`
  (S6: delete family, no-family access, Apple name, family screens, account
  screens) · `2026-10-26/003`–`005` (S7: Home card, all-day reminders, Google
  link messages) · `2026-10-27/001` · `002` (monthly weekday) · `003` (notes
  formatting) · `006` (to-do repeats) · `007` (picture ids + alt texts).
- API reports `~/Herd/familyplanner-api/claude-reports/`: `2026-10-24/006`
  `007` `009` · `2026-10-25/003` `021` `023` · `2026-10-26/002` `003` `004`
  `006` `008` · `2026-10-27/002` `004`.
- Web reports `../daili-web/claude-reports/2026-10-25/005` `006` (web sign-in:
  Forgot password, Restore my account; delete family on the web).
- Labels: the app's ARB files (`../familyplanner-app/lib/l10n/`) and, for web
  steps, `../daili-web` locale files. Check the code when a report is unclear.
  Do not guess. Read every `## Help impact` section above.

## Articles (English facts; short sentences; voice and brand spelling of the existing articles)

1. **`calendar-phone-calendars`** — new short section **Copy to Daili**:
   events from your phone or a linked calendar can't be changed in Daili; tap
   the event → **Copy to Daili** → the New event form opens filled in → assign
   people, add reminders, Save. The original stays. Also: linking a Google
   calendar now has one more confirm step that names your Daili account (Link
   / Cancel), and clear messages when linking fails; a subscribed calendar
   drops cancelled events, and one that no longer exists shows as gone.
   🔴 Do NOT mention Outlook anywhere (not announced yet).
2. **`calendar-repeating`** — Monthly now has a choice: **On day 5** (as
   before) or **On the first … / last …** weekday (e.g. every first Thursday);
   changing the start date moves the weekday with it. Monthly on the 29th–31st
   falls on the last day of shorter months. "This and following": moving a
   weekly event to another weekday moves the rest of the series; days you
   deleted, moved or changed are kept. Picture `calendar-repeating-monthly`
   in the text.
3. **`calendar-reminders`** — all-day events offer **on the day / the day
   before / a week before**, at 9:00.
4. **`lists-repeating`** — three new choices: **Every few weeks** (how many
   weeks + which days), **Every few months** (how many months + day of the
   month), **Yearly** (same date as the due date each year). Update the alt
   text of the re-shot `lists-repeating` picture (it now shows all choices).
   Add a few keywords (every 2 weeks, every 3 months, every 6 months,
   half-yearly, yearly, annual).
5. **`notes-notes`** — formatting: tap **B** (bold), **I** (italic) or **H**
   (heading) while writing; works in the app and on app.daili.app. Picture
   `notes-formatting` in the text. Keywords: bold, italic, heading, format.
6. **`family-roles`** — the owner can **delete a family or group** (Family →
   Ownership → Delete this family or group; type the family's name, plus your
   password if your account has one). Allowed even when others are in it; they
   get a note that the family is gone. Also on app.daili.app.
7. **`family-invite`** — right after you create a family the invite screen
   opens once by itself (with **Add a child without an account** and
   **Later**); an e-mail invite needs an address, and an unconfirmed account
   gets a **Verify email** button there; **Get a new code** cancels all older
   codes (e-mail invites stay); the join field accepts a pasted invite link.
8. **`start-create-family`** — a new family starts with your country's first
   day of the week and public holidays (change them in calendar settings);
   then the invite screen opens once (see 7).
9. **`start-join`** — only if it describes the code field: a pasted invite
   link works too.
10. **`account-delete`** — new reason **I'd rather not say**; without a
    family you reach it via the **Account** button on the create-or-join
    screen; an owner who must hand over first is told which family. Keep the
    "type delete" step as the app says it now.
11. **`account-verify-email`** (and wherever "change e-mail" is described) —
    the link opens a page with a **Confirm address** button (one extra tap);
    **Change email address** is now on the Profile screen; your old address
    gets a short notice and your other devices are signed out; the newsletter
    moves to the new address.
12. **`account-password`** — **Set password** for a Google/Apple account
    keeps you signed in everywhere; a password **reset** signs you out on
    other devices and in connected AI apps, and those phones get no
    notifications until they sign in again.
13. **`account-download-data`** — the export needs a confirmed e-mail address
    (say where to confirm).
14. **`start-home`** — only if it describes the week card's "next up": it
    now also shows today's all-day events and events happening right now.
15. **`cycle-privacy`**, **`vault-where`**, **`notes-files`** — check every
    sentence about backups and the app switcher against reports
    `2026-10-25/006` and `007`: Cycle, Budget and Documents are always hidden
    in the app switcher (Android also blocks screenshots there); on Android
    the phone's backup now really includes your documents, photos and Cycle
    data. Change only sentences that are now wrong or incomplete.
16. **`start-sign-in`** + **`anywhere-web`** — on a fresh iPhone install you
    sign in again (like Android); on app.daili.app the sign-in page has
    **Forgot password** and **Restore my account**.

🔴 Never mention: Outlook, the "free forever" welcome promise, Siri on the
watch, widget background updates (all "not announced yet").

## Translations
Translate every changed article into all `HELP_LOCALES`, following
`claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md` (labels from each
language's ARB). New pictures: the runner already made them for all locales;
if a locale's picture is missing, list it in the report (do not invent one).
Pictures that did not change: untouched. Sub-agents may translate in
parallel, one locale group each.

## Build
`npm run build` must pass (check-help, routes, search tests). A build failure
not caused by this change: stop, report `blocked`.
Read the built English + German `calendar/repeating`, `lists/repeating` and
`notes/notes` pages: text, pictures, related links render.

## Commit & push
`docs(help): 1.13.0 — Copy to Daili, monthly weekday, to-do repeats, notes formatting, family + account`;
body `Prompt: claude-prompts/2026-10-27/002-help-sync-1-13-0.md`. Your files
only (plus the help pictures and `help/media*.json`). **Push now. Do NOT run
`./deploy.sh`.**

## Report
`claude-reports/2026-10-27/002-help-sync-1-13-0.md`, half a page: articles
changed (and any from the list you left alone, with why), labels checked (and
any mismatch with a report), locales done, missing pictures, build result,
SHA + push. `## Help impact`: this IS the help sync — list the article ids.
