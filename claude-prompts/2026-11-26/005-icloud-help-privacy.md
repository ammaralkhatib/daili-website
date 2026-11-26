# Help + privacy: Apple Calendar (iCloud) — new hidden help article, privacy says what Daili keeps (an Apple app-specific password)

Standard lane, website only. Feature "Apple / iCloud two-way" (Daili list item #395). Plan:
`/Users/ammarkhatib/Herd/familyplanner-api/claude-prompts/ICLOUD-TWO-WAY-PLAN.md` (Decisions 1–9, Design part 9,
Facts → "Read on Apple's own pages"). The api, app and web prompts of this run come BEFORE this one — read their
reports: `~/Herd/familyplanner-api/claude-reports/2026-11-26/004…007-icloud-*.md` and `010…013-icloud-*.md`,
`../familyplanner-app/claude-reports/2026-11-26/038-…`, `039-…`, `040-…`, `../daili-web/claude-reports/2026-11-26/003-…`
+ `004-…`. If one is missing, write from the plan and list every fact under "Facts I could not confirm".
The picked screen texts: `../design-handovers/2026-11-26-icloud-connect-RESULT.md`.
Model: `claude-prompts/2026-11-24/001-outlook-two-way-help-privacy.md` + its report.

Why now: with this feature Daili keeps something new and sensitive — a person's Apple app-specific password. The
privacy text must say so BEFORE the owner switches iCloud on (it is off for everyone today). The help article is
written now and stays hidden until the app version with the iCloud screens is live.

Every sub-agent you start MUST use model claude-opus-5-5. Write the report with the file-write tool.

## 1. Privacy (`legal/privacy.<lang>.html`, 27 files, + `legal/datenschutz.de.html`)

Today (`privacy.en.html`, helper read 2026-11-26 — re-check): ~32 "Connected calendars (optional)" speaks of "a
Google or Outlook calendar"; ~33 `id="copy-to-daili"`; ~34 `id="outlook-two-way"`. Other prompts of today
(`003-contacts-help-privacy.md`, `004-privacy-tips-opt-in.md`) edit other paragraphs of the same files and may or
may not have run before you — work on the files as they are on disk and do not undo their changes.

1. ~32 and ~33: where the page lists the calendars one can connect or switch to Two-way, add Apple Calendar
   (iCloud) — "a Google, Outlook or Apple (iCloud) calendar". Keep every Google and Outlook sentence true; do not
   weaken any promise. Add the pointer "… and 'Apple Calendar (iCloud)' below explains them for iCloud".
2. A new paragraph `<p id="icloud-calendar">` right after `id="outlook-two-way"`. English (Planning Claude's draft,
   built from the code and the plan — keep the meaning of every sentence; fix a sentence only where the reports of
   this run show the code does something else, and list each fix in the report):

   > **Apple Calendar (iCloud) (optional).** Connecting an iCloud calendar is being rolled out step by step, so it
   > may not be offered to you yet. Apple has no sign-in button for calendars. So you make an "app-specific
   > password" for Daili on Apple's page (account.apple.com) and type it into the Daili app together with the
   > e-mail address of your Apple Account. Daili never asks for your normal Apple password and never stores it.
   > The app sends the e-mail address and the app-specific password once, over an encrypted connection, to our
   > server. We store the password there encrypted (AES-256); it is never shown again, never sent back to an app,
   > never written to a log and never shared with anyone. Our server uses it for one thing only: to read the
   > calendars you select from Apple's calendar server (caldav.icloud.com) and — only if you switch a calendar to
   > "Two-way" — to save the events you yourself add, change or delete in Daili. Apple does not limit an
   > app-specific password to calendars: technically it could also open your iCloud mail and contacts. Daili never
   > does that. The events of the calendars you select are stored on our server like those of a Google or Outlook
   > calendar, so you — and, only if you choose, your family — can see them. Apple does not tell us when something
   > changes, so our server looks for changes regularly (two-way calendars about every 15 minutes). With Two-way
   > sync, Daili writes to iCloud only when you yourself add, change or delete an event in Daili, and only in that
   > calendar; a background job never writes. Daili never adds guests and never sends invitations; events with
   > guests stay view-only. Only the person who connected the calendar can change its events: other family
   > members, a family wall screen, a TRMNL display and connected AI apps cannot, and iCloud events never reach
   > connected AI apps. When you disconnect iCloud in Daili, we delete the stored password and the synced events at
   > once; nothing is deleted in iCloud. Daili cannot remove the password at Apple — you can delete it yourself at
   > any time at account.apple.com → Sign-In and Security → App-Specific Passwords; from that moment Daili has no
   > access any more. Changing your Apple Account password also ends every app-specific password. Legal basis:
   > performance of the contract with you (Art. 6(1)(b) GDPR).

3. Same change in every language (each file's own words for "Two-way" and for the connected-calendars part — read
   how that file says it for Outlook; Apple's menu names in Apple's own translation of that language, as on
   support.apple.com/<locale>/102654 — where unsure keep the English name in quotes and list the language) and in
   `datenschutz.de.html`. Bump each page's "last updated" date the way the files already do it. Extend
   `tools/check-legal.mjs` so `id="icloud-calendar"` is required in every locale, like `outlook-two-way`.
4. Check the page's other lists that name what we store or who receives data (data categories, recipients /
   processors, deletion, data export): Apple is NOT a processor of ours here — it is the person's own account that
   our server signs in to on their instruction; say it the way the page says it for Google and Microsoft. Add the
   Apple Account e-mail and the encrypted app-specific password where the page lists the stored Google / Microsoft
   access keys. List every place you touched.

## 2. Help — new article, HIDDEN until the app version with iCloud is live

Same way as `help/en/calendar/two-way-outlook.md`: `since: 99.0.0` in the English file, NO `related:` link FROM any
other article to it, do NOT bump `LIVE_APP_VERSION`, do NOT change any other article now (`phone-calendars.md`
still says "Apple Calendar" for the phone tile — that is true for the live app; the rename ships with the app
build and is a list item for release day).

**`help/en/calendar/connect-icloud.md`, id `calendar-connect-icloud`.** Front matter like `two-way-outlook.md`:
topic `calendar`, title "Connect your Apple calendar (iCloud)", a one-line summary, keywords (icloud, apple
calendar, apple, iphone calendar, app-specific password, app password, two-way, sync, connect, reconnect, access
expired), `routes:` the app's real routes (from the app reports; update `help/routes-allowlist.json` if a new
route needs it), `tryIt: /calendar/settings`, `since: 99.0.0`, `updated:` today, `mediaPending:` "the connect
screen with the five steps; Apple's page with the new password", `order:` after the last calendar article,
`related: calendar-two-way, calendar-phone-calendars, calendar-repeating`.

**Check every fact against the code before you write it** (app `lib/l10n/app_en.arb`, the `icloud…` keys and the
`…ICloud` twins; the RESULT file for the steps). Use the app's EXACT button and field names in **bold**. Short
sentences, easy words, numbered steps, "you", ≤ 300 words. Content:

1. One line: bring your iCloud calendars into Daili for the whole family, also on the web.
2. Numbered — the same five steps as the app's screen: open **Calendar** → the gear → **Add a calendar** → **Apple
   Calendar (iCloud)**; open account.apple.com and sign in; **Sign-In and Security** → **App-Specific Passwords**;
   make one named "Daili" and copy it; paste it into Daili with your Apple Account e-mail and tap **Connect**; pick
   the calendars and who sees them.
3. "Not your normal Apple password" — Daili never asks for it. If you can't find "App-Specific Passwords":
   two-factor authentication is off; turn it on first.
4. On an iPhone: the same calendar may already show as a phone calendar ("Calendars on this iPhone"). Daili offers
   to turn the phone copy off, so events don't show twice.
5. Two-way: set a calendar's **Sync** to **Two-way** (no extra page at Apple). Then edit, delete or add its events;
   **This day only** or **Whole series**; a whole series can change title, place and notes, not its time. Events
   with guests stay view-only. Changes made in Apple's Calendar app show in Daili within about 15 minutes.
6. "Access expired — reconnect": happens when you change your Apple password or delete the app-specific password.
   Make a new one and connect again (in the phone app).
7. One line: on app.daili.app you can see and change these events; connecting is done in the phone app.
8. One line: removing the account in Daili deletes nothing in iCloud; delete the app-specific password at
   account.apple.com if you want it gone at Apple too.

## 3. Translations

A new English article breaks the build until it exists in every `HELP_LOCALES` language (`site.config.mjs`).
Translate it into all of them following `claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md`, with
`translatedFrom` = the English `updated`. Use each language's REAL app words from
`../familyplanner-app/lib/l10n/app_<arb>.arb` (zh-Hans → `app_zh.arb`, zh-Hant → `app_zh_Hant.arb`). "iCloud",
"Apple", "Daili", `account.apple.com` stay as they are.

## 4. Verify

- `npm run check:help`, the legal check and `npm run build` green (FOREGROUND); spot-check 5 translations against
  their ARB and 3 privacy languages against the English. The help article does NOT show on the built site's index
  or search (prove it like `2026-11-24/001`).

## Constraints

- 🔴 Never say or hint that iCloud two-way is available to everyone now ("rolled out step by step").
- 🔴 No sentence may promise more than the code does (for example: we do NOT remove the password at Apple).
- 🔴 Do not deploy (`./deploy.sh` is Ammar's step). Do not bump `LIVE_APP_VERSION`.
- In the report, never put the word "status" and the word "blocked" on one line unless you really are blocked.

## Commit & push

- `docs(legal,help): privacy explains Apple Calendar (iCloud); hidden article "Connect your Apple calendar"`; body
  names `Prompt: claude-prompts/2026-11-26/005-icloud-help-privacy.md`.
- **Push now.** If pushing fails, stop and report (never force). **No deploy.**

## Report

- `claude-reports/2026-11-26/005-icloud-help-privacy.md`: every privacy sentence you changed against the draft and
  why; every place of the privacy page you touched; the languages where an Apple menu name stayed English; facts
  you could not confirm; the build proof that the article is hidden; SHA, pushed.
- `## Open items for the owner`: (1) read the English + German privacy paragraph `id="icloud-calendar"` BEFORE
  deploying the website; (2) `./deploy.sh` in `daili-website` — and the privacy text must be live before
  `ICLOUD_CALENDAR_ENABLED=true` is set on the server; (3) on the app's release day: open the article (real
  `since`, pictures, links from the other calendar articles) and rename "Apple Calendar" in `phone-calendars.md`
  to "Calendars on this iPhone" in every language.
