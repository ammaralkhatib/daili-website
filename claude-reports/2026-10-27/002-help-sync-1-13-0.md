# 002 — Help sync 1.13.0: Copy to Daili, monthly weekday, to-do repeats, notes formatting, family + account

**Prompt:** `claude-prompts/2026-10-27/002-help-sync-1-13-0.md`
**Completed:** 2026-10-27 · **Status:** done

## Summary

The help center now matches app 1.13.0 in English and the 24 other help
languages. 18 articles are updated (`updated: 2026-10-27`, `since` kept), with
no new articles. The 1.13.0 pictures are committed. The build is green. I did
not deploy, and `LIVE_APP_VERSION` is unchanged. There is no in-article version
gate (`account-avatar-ai` is a whole new article), so the new text is simply
written into the articles.

Step 0: I committed the untracked `claude-reports/2026-10-27/001-legal-1-13-0.md`
as `334ff20 docs(plan): sync planning docs` and pushed it. The folder
`static/assets/img/photos/` was already untracked (files from September). It is
not mine, so I left it alone and did not commit it.

**Articles changed** (English facts; every language got the same changes):

- `calendar-phone-calendars`: the **Copy to Daili** paragraph; the Google step now has **Link** on the page that names your daili account. I cut the intro line to stay under the 150-word limit.
- `calendar-repeating`: Monthly offers **On day 5** or **On the first Thursday**, and both follow the start date; days 29–31 move to the last day of shorter months; days you changed or deleted stay; a weekly event on one weekday moves the rest of the series with "This and following". New picture `calendar-repeating-monthly`.
- `calendar-reminders`: an all-day event offers **Morning of (9:00)**, **1 day before (9:00)** and **1 week before (9:00)**.
- `lists-repeating`: **Every few weeks**, **Every few months** (6 = every half year) and **Yearly**; new alt text for the re-shot picture; new keywords (every 2 weeks, every 3/6 months, half-yearly, yearly, annual).
- `notes-notes`: formatting while you write, with picture `notes-formatting`; keywords bold, italic, heading, format.
- `family-roles`: the owner can delete the family or group (Ownership → **Delete this family or group**, type its name, plus your password if you have one). Also on app.daili.app.
- `family-invite`: the invite screen opens once after you create a family (**Add a child without an account** / **Later**); an email invite needs an address and a verified email (**Verify email**); **Get a new code** cancels all older codes, but email invites stay; you can paste the link to join.
- `start-create-family`: after you create a family the invite screen opens once; the week start and holidays follow your country (change them under Calendar → gear → **Week starts on** / **Holidays**).
- `start-join`: you can paste the invite link into the code field.
- `account-delete`: **I'd rather not say**; with no family, the person icon on the create-or-join screen opens Profile; daili names the family you own.
- `account-verify-email`: **Confirm address** on the page the link opens; **Change email address** is on Profile (old address gets a notice, other devices are signed out, the newsletter moves too); the locked list now includes downloading your data.
- `account-password`: **Set password** keeps you signed in; a reset signs you out of other devices and connected AI apps, and those phones get no notifications until you sign in again.
- `account-download-data`: the export needs a verified email, and the article says how to verify.
- `start-home`: the top card also shows today's all-day events and events happening right now.
- `cycle-privacy`: the app switcher **always** hides Cycle, and Android blocks screenshots (before, this said it only happened with the lock on).
- `notes-files`: on Android, note pictures and recordings move only by phone-to-phone transfer, not by Google backup.
- `start-sign-in`: after you reinstall daili, you sign in again.
- `anywhere-web`: **Forgot password?** and **Restore my account** are on the web sign-in page; deleting a family is no longer listed as phone-only (it works on the web now), deleting your account still is.

**Left alone:** `vault-where`. It already says Android's Google backup has documents and photos move only phone-to-phone, and app report 2026-10-25/006 confirms that is now true. The prompt says "photos" are in the backup, but the code says they are not. The article does not mention the app switcher, so no sentence there is wrong.

**Left out to stay under 150 words** (all are shown on screen):
- why Google linking can fail (the messages);
- that a subscribed calendar drops cancelled events or shows "gone";
- "Nothing on your phone is deleted" when you remove a calendar;
- "Scan link" and search in notes;
- the Apple "Share My Email" tip in `account-password`.

## Labels checked

- New labels come from `app_<arb>.arb` through `{{arbKey}}` placeholders: `calendarCopyToDaili`, `reminderAllDay*`, `listDetailRepeatEveryNWeeks/EveryNMonths/Yearly`, `familyOwnershipSectionHeader`, `familyDeleteTile`, `familyInviteWelcomeAddChild/Later`, `familyInviteVerifyEmailButton`, `familySettingsWeekStart/Holidays`, `profileDeleteReasonPreferNotToSay`, `verifyChangeEmailButton`, `loginForgotPassword`, `authPendingDeletionRestore`.
- Server-page labels: **Link** comes from api `lang/<loc>/calendar_connect.php`, and **Confirm address** from `verify_email.php`. The monthly labels were filled in by hand from `calendarRepeatMonthlyOnDay` and `calendarRepeatMonthlyOnNth`.
- **Mismatches with the prompt and reports:**
  1. The heading button in the app is a **T** icon (`Icons.title_rounded`, and the picture shows it). The web uses **H**. The text says "**T** … (**H** on app.daili.app)". Note that the help-shots report's alt text also says "B / I / H".
  2. All-day reminders are "Morning of / 1 day before / 1 week before (9:00)", not "on the day / the day before / a week before".
- A fresh fact-check against the code (before translating) found 4 more errors, all fixed:
  1. Note drawings ARE in the Android Google backup; only pictures and recordings are not.
  2. The export gives only a generic error when your email isn't verified, so the text now says "the request fails".
  3. Deleting a family sends nothing. The others see an in-app message, not a notification.
  4. The weekday move only works for a weekly event on ONE weekday.
- **App issue worth fixing:** the app shows its generic "Couldn't request the export" message for `403 EMAIL_VERIFICATION_REQUIRED` (`profile_screen.dart:427`). It should say "verify your email first".
- **pt register:** the pt translator noted that the app ARB (`profileDeleteConfirmOrEnglish`, "escreve") and the api `link_button` ("Ligar") use European Portuguese, while the help text uses Brazilian Portuguese. The help text quotes them as the product shows them.

## Locales

All 24 are done (de nl sv da nb fi fr it es pt pl cs sk ro tr el uk bg ja ko zh-Hans zh-Hant th id). Each has all 18 articles, `translatedFrom: 2026-10-27`, and no leftover placeholders.
- 8 translator sub-agents (Opus 5.5) did 3 languages each and ran in the foreground.
- Two English sentences were unclear and the translators read them in different ways. I fixed the English, and every translator then fixed those two sentences.

**Missing pictures:** none. All 25 languages have `calendar-repeating-monthly`, `notes-formatting` and the re-shot `lists-repeating`.

## Verification

- `check-help`: help OK, 95 articles, 25 languages, 74 app routes checked.
- `npm run build`: exit 0, build OK (3258 pages). The language-detector, help-search and check-help self-tests all pass. The 55 warnings are site-copy length ratios, not help articles.
- I read the built pages `calendar/repeating`, `lists/repeating` and `notes/notes` in English and German. The text, the pictures (including each language's own new pictures) and the related links all show correctly.

## Commit

- `96f090b` — `docs(help): 1.13.0 — Copy to Daili, monthly weekday, to-do repeats, notes formatting, family + account`. It has 550 files: 450 articles, 25 `help/media*.json` and 75 pictures. **Pushed** to origin/main. `./deploy.sh` was **not** run.

## Help impact

This IS the help sync for 1.13.0: calendar-phone-calendars, calendar-repeating, calendar-reminders, lists-repeating, notes-notes, family-roles, family-invite, start-create-family, start-join, account-delete, account-verify-email, account-password, account-download-data, start-home, cycle-privacy, notes-files, start-sign-in, anywhere-web.

## Open items for the owner

- Deploy when 1.13.0 is live (`./deploy.sh`, then `LIVE_APP_VERSION` 1.13.0).
- Optional app fix: give a clear message when the data export is refused because the email isn't verified.
