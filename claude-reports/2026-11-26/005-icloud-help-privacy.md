# 005 — Privacy explains Apple Calendar (iCloud); hidden help article "Connect your Apple calendar (iCloud)"

**Result:** done · **Commit:** `3717a6af` docs(legal,help): privacy explains Apple Calendar (iCloud); hidden article "Connect your Apple calendar". It has 54 files and is pushed to origin/main (`c2caf101..3717a6af`). This report follows in its own `docs(report)` commit. `./deploy.sh` was NOT run, because Ammar deploys. `LIVE_APP_VERSION` is unchanged (1.17.0).
**Step 0:** nothing to commit. The prompt was already in `b350e40b`, no commits were held, and `main` was equal to `origin/main`. `static/assets/img/photos/` (the old untracked pictures) stayed out of every commit, as in earlier runs. Prompt 003 (contacts) has not run yet, so there was nothing of it to keep.

All upstream reports were there and I read them or had them checked: api 004–007 and 010–013, app 038–040, web 003–004, and the RESULT file. A read-only helper (Opus 5.5) checked every sentence of the privacy draft against the api code, citing file:line. I checked the help facts against the app ARB and code myself.

## 1. Privacy

### The new paragraph `id="icloud-calendar"` (right after `outlook-two-way`, all 28 pages)

English, word for word:

> **Apple Calendar (iCloud) (optional).** Connecting an iCloud calendar is being rolled out step by step, so it may not be offered to you yet. Apple has no sign-in button for calendars. So you make an "app-specific password" for Daili on Apple's page ([account.apple.com](https://account.apple.com)) and type it into the Daili app together with the e-mail address of your Apple Account. Daili never asks for your normal Apple password and never stores it. The app sends the e-mail address and the app-specific password once, over an encrypted connection, to our server. We store the password there encrypted (AES-256); it is never shown again, never sent back to an app, never written to a log and never shared with anyone — only Apple's calendar server receives it, because Apple asks for it every time our server reads or saves your calendars. We keep the e-mail address so you can see which Apple Account is connected. Our server uses the password for one thing only: to read the list of your calendars (their names and colours) and the calendars you select from Apple's calendar servers (caldav.icloud.com and the iCloud server it names for your account) and — only if you switch a calendar to "Two-way" — to save the events you yourself add, change or delete in Daili. Apple does not limit an app-specific password to calendars: technically it could also open your iCloud mail and contacts. Daili never does that. The events of the calendars you select are stored on our server like those of a Google or Outlook calendar, so you — and, only if you choose, your family — can see them. Apple does not tell us when something changes, so our server looks for changes regularly (two-way calendars about every 15 minutes). With Two-way sync, Daili writes to iCloud only when you yourself add, change or delete an event in Daili, and only in that calendar; a background job never writes. When you change an event, Daili changes only its title, place, notes, start and end in Apple's copy; a new event gets only these, its time zone, its repeat rule if it repeats and a technical event ID that Daili makes up. People, reminders and categories stay in Daili. So that Two-way sync can work, we store for each iCloud event Apple's address for it, a version stamp and, if it must stay view-only, only the reason. Daili never adds guests and never sends invitations; events with guests stay view-only. Only the person who connected the calendar can change its events: other family members, a family wall screen, a TRMNL display and connected AI apps cannot, and iCloud events never reach connected AI apps. When you disconnect iCloud in Daili, we delete the stored password and the synced events at once; nothing is deleted in iCloud. If you delete your Daili account, the synced events are removed at once and the stored password at the end of the 30-day grace period (section 8). Daili cannot remove the password at Apple — you can delete it yourself at any time at account.apple.com → Sign-In and Security → App-Specific Passwords; from that moment Daili has no access any more. Changing your Apple Account password also ends every app-specific password. Legal basis: performance of the contract with you (Art. 6(1)(b) GDPR).

### Every change against Planning Claude's draft, and why

1. **"never shared with anyone"** → I added "— only Apple's calendar server receives it, because Apple asks for it every time our server reads or saves your calendars". The password goes to Apple as HTTP Basic auth on every CalDAV request (`ICloudCalDavClient.php:668`). Without this, the sentence would be untrue.
2. **"to read the calendars you select from Apple's calendar server (caldav.icloud.com)"** → "to read the list of your calendars (their names and colours) and the calendars you select from Apple's calendar servers (caldav.icloud.com and the iCloud server it names for your account)". The picker reads the names, colours and write rights of all your calendars (`ICloudCalendarSource.php:78-117`). Only the first check goes to `caldav.icloud.com`; after that the server talks to the `pNN-caldav.icloud.com` host that Apple names (`ICloudCalDavClient.php:56,398-413,726`).
3. **Added: account deletion.** "If you delete your Daili account, the synced events are removed at once and the stored password at the end of the 30-day grace period (section 8)." The draft only covered disconnect. On account deletion, the calendars and events go at once (`AccountSoftDeleter.php:123-125`), but the password row stays until the 30-day purge (`AccountPurger.php:59,416-440`).
4. **Added: what is sent and what is stored**, mirroring the Outlook paragraph. "When you change an event, Daili changes only its title, place, notes, start and end…", "People, reminders and categories stay in Daili", "we store for each iCloud event Apple's address for it, a version stamp and … the reason". This comes from `ICloudEventDocument.php:68-136` (the fields), and `external_events` `provider_event_id`, `etag` and `write_block`. I wrote "changes only … in Apple's copy" and not "sends only", because for a change Daili sends back Apple's whole event with only those fields changed.
5. **Added: "We keep the e-mail address so you can see which Apple Account is connected."** It is stored (`connected_accounts.provider_email`) and shown only to its owner (point 4 of the prompt).
6. **Made it a link:** account.apple.com (first mention) is now a link, like Outlook's consent page.

Every other sentence is the draft as written. The helper confirmed each one: AES-256-CBC (`config/app.php:136`, `encrypted` cast `ConnectedAccount.php:62`); never sent to an app (`$hidden`, `ConnectedAccountResource.php`); never logged (log lines carry ids and exception classes only, `#[\SensitiveParameter]`, scrubbed query errors); no IMAP or CardDAV code anywhere; writes happen only inside the owner's own request and no job writes; no ATTENDEE/ORGANIZER/METHOD is ever sent and events with guests are blocked as `guests`; only the owner, never a wall screen; AI apps see ICS feeds only (`McpAgenda.php:58-70`); disconnect deletes the account row with its calendars and events at once and calls nothing at Apple. Two-way calendars refresh when they are older than 15 minutes (checked every minute). View-only calendars refresh about every hour, and the draft's "regularly" covers that.

### Every place of the privacy page I touched (the same in all 28 pages)

- **Section 4, "Connected calendars"** (6 spots):
  - "If you connect a Google, Outlook or Apple (iCloud) calendar"
  - "one of your Google, Outlook or Apple (iCloud) calendars to Two-way"
  - "saved in Google, Outlook or iCloud" (2×)
  - the pointer: "…and "Apple Calendar (iCloud)" below explains them for iCloud"
  - "the synced events and access keys (for iCloud: the app-specific password) are then deleted"
  - "For events from a Google, Outlook or iCloud calendar or a calendar link, we store…". The notes are cleaned and capped at 2,000 for iCloud too (`CalendarDescription.php:29`).
- **Section 4, "Edit in Daili"** (`copy-to-daili`, 6 spots). iCloud was added to: "on View only can't be changed", "except while it stays linked … (AI apps)", "the Daili event stays linked", "switched to Two-way", "also saved in Google, Outlook or iCloud", and the delete choice "Daili and iCloud" (the app's own `twoWayDeleteBothICloud`) + the pointer. The helper confirmed linking, write-back and AI hiding work the same for iCloud (`WriteBackRule.php:29-58`, `CalendarProviderRegistry.php:104`, `McpAgenda.php:58-70`).
- **Section 4, new paragraph** `icloud-calendar`.
- **Section 4, "AI apps you connect"**: "events from connected Google, Outlook or iCloud calendars … never reach an AI app".
- **Section 6, the "Access keys" bullet**: the Google/Microsoft sentence is unchanged ("…never leave our server"). After it comes: "The app-specific password of a connected Apple Account is encrypted the same way; it goes only to Apple's calendar server, which asks for it on every sync, and never to an app or a browser." I did NOT write "never leaves our server" for the password, because it does go to Apple.
- **Not touched, on purpose:**
  - Section 5 is Google's own section for its reviewers.
  - Section 6 "Access control" lists push notices, and Apple sends none.
  - Section 7 "Where your data lives" does not list Google or Microsoft as processors for calendars either. Apple is the person's own account, which our server signs in to on their instruction. The new paragraph says this in its own words ("only Apple's calendar server receives it").
  - Section 8 keeps the general 30-day rule, and the new paragraph points to it.
  - Data export: the export does not include the e-mail, the password or the synced iCloud events. The page names no export contents, so nothing to change.
- **Dates:** all 28 pages already said 2026-11-26 (from prompt 004), so there was nothing to bump.
- **`tools/check-legal.mjs`:** `id="icloud-calendar"` is now required in every locale, next to `google-two-way` and `outlook-two-way`. I watched it fail on 26 files before the translations went in.

### German (`datenschutz.de.html`)

I wrote it myself, with the same facts in the same order. The heading is "Apple Kalender (iCloud) (freiwillig)", the app's `icloudCalendarName`. The menu path is "account.apple.com → Anmelden und Sicherheit → App-spezifische Passwörter" (the ARB values, which are Apple's German words). The delete choice is „Daili und iCloud“, and the legal basis is „Art. 6 Abs. 1 lit. b DSGVO“, as in the Outlook paragraph.

### Languages where an Apple menu name stayed English

- **hi, ru** (privacy only, no ARB): "Sign-In and Security" → "App-Specific Passwords" are in English, in quotes. Apple's Hindi page shows the names in English. For Russian, the translator thinks Apple says "Вход и безопасность" / "Пароли приложений" but was not sure.
- **bg and id:** the app's own ARB keeps these menu names in English, so the help article and the privacy path use the English names as well. The rules say: ARB value wins. For bg it is all three (`icloudMenuSignInSecurity`, `icloudMenuAppPasswords`, `icloudMenuGenerate`). For id it is the first two.
- **pt:** `icloudMenuGenerate` is still English in `app_pt.arb`, so step 4 of the pt article shows "Generate an app-specific password".
- **ar:** the names are taken from Apple's Arabic page (support.apple.com/ar-ae/102654): «تسجيل الدخول والأمان» → «كلمات السر الخاصة بالتطبيقات».

## 2. Help article (hidden)

`help/en/calendar/connect-icloud.md`, id `calendar-connect-icloud`:
- topic `calendar`, title "Connect your Apple calendar (iCloud)", 11 keywords (the prompt's list).
- `routes: /calendar/settings, /calendar/external-edit`, `tryIt: /calendar/settings`.
- `since: 99.0.0`, `updated: 2026-11-26`, `mediaPending`, `order: 14`.
- `related: calendar-two-way, calendar-phone-calendars, calendar-repeating`.

> Share iCloud calendars with your family, also on the web.
>
> 1. Open **Calendar**, tap the gear, **Add a calendar**, **Apple Calendar (iCloud)**.
> 2. Tap **Open account.apple.com**, sign in.
> 3. **Sign-In and Security**, then **App-Specific Passwords**.
> 4. Tap **Generate an app-specific password**, name it "Daili", copy it.
> 5. Paste it with your Apple Account e-mail, tap **Connect**.
> 6. Pick calendars and who sees them.
>
> Not your normal Apple password. No **App-Specific Passwords**? Turn on two-factor authentication.
>
> On iPhone, daili offers to turn off the same phone calendar, so nothing doubles.
>
> **Sync** → **Two-way**: edit, delete, add. Repeats: **This day only** or **Whole series** (not its time). Guest events stay view-only. Apple's changes show in about 15 minutes.
>
> **Access expired — reconnect**? You changed your Apple password or deleted the app password. Make a new one, reconnect on your phone.
>
> app.daili.app shows and changes them too. Removing the account deletes nothing in iCloud; delete the password at account.apple.com.

**Where I went against the prompt (the guard or house style wins):**
- **150 words, not 300.** The guard allows 150 English words (`LIMITS.words`), as in 2026-11-24/001. All 8 points are in, made short. The facts I left out are listed below.
- **Six steps, not five.** The app's five steps begin after the tile, so "open the tile" is my step 1. Apple's page is split into 2–4 the same way as the app's steps 1–4, and "pick the calendars" is step 6.
- **Routes:** the connect screen has no route of its own. It opens with `MaterialPageRoute` from `other_calendars_section.dart:207-213`. So the routes are `/calendar/settings` (and `/calendar/external-edit` for two-way editing). No change to `help/routes-allowlist.json`.
- **"daili" in lower case** in running text, as the help center does. "Daili" stays only as the name you give the password, because the app's step 3 says "give it the name “Daili”".
- **Every bold label** is the exact ARB value: `calendarTitle`, `calendarSettingsAddCalendar`, `icloudCalendarName`, `icloudConnectStep1Button`, `icloudMenuSignInSecurity`, `icloudMenuAppPasswords`, `icloudMenuGenerate`, `providerConnectCta`, `twoWaySyncLabel`, `twoWayModeTwoWay`, `twoWayScopeThisDay`, `twoWayScopeSeries`, `calendarSettingsConnectionRevoked`.

**True, but left out because of the 150-word cap:**
- Two-way for iCloud needs no extra page at Apple: the Sync switch turns on directly (app 039 `_tapTwoWay`).
- The password is 16 letters (`abcd-efgh-ijkl-mnop`). A normal-looking password is never sent, and the app shows "That looks like your normal Apple password".
- After 3 refusals the app shows "Too many tries", with a wait of 15 minutes.
- Reconnect shows the same five steps with the Apple Account already filled in and locked.
- The "shows twice" sheet appears only on iPhone/iPad, after **Save** in the picker. **Keep both** is remembered, and the phone calendar can be turned on again in "Calendars on this iPhone".
- With **Whole series**, days you changed one by one keep their own changes (`twoWayScopeSeriesReplacesHintICloud`).
- A monthly repeat on the 29th–31st can't be saved to iCloud; the app offers to save it to Daili instead.
- On the web, the iCloud card is under **Family** and can't connect or reconnect (web 004).

**How it stays hidden** (proved like 2026-11-24/001):
- `since: 99.0.0` is in the English file. Translations carry no `since`, and `LIVE_APP_VERSION` stays 1.17.0.
- No article lists `calendar-connect-icloud` in `related` (checked in `dist/help/en.json`: empty). No other article was changed; `phone-calendars.md` still says "Apple Calendar".
- Build: "115 of 125 article(s) on pages". Before, it was 115 of 124. The page count stays 3759.
- `find dist -path '*connect-icloud*'` finds nothing: no `dist/help/calendar/connect-icloud/` in any language.
- A grep over `dist/` finds the id only in the 25 app files `dist/help/<loc>.json`, with `since 99.0.0`, so the app hides it too. It is in no HTML page, no sitemap and no search index.

## 3. Translations

- **Help:** 24 languages. I wrote German myself; 8 sub-agents wrote the other 23.
- **Privacy:** 26 languages. The same 8 sub-agents wrote one replacement sheet per language. My script applied the sheets: every "old" text must appear exactly once, and the paragraph goes right after `outlook-two-way`. All 26 were applied on the first try (15 replacements + 1 paragraph each).
- **Sub-agents:** all 9 ran on Opus 5.5 (`claude-opus-5-5`): 1 read-only fact checker and 8 translators. I waited for all 9 before any build or commit, and I checked their files on disk (23 help files, 26 sheets).
- **My check script, all 24 help languages:**
  - every bold is one of the 13 ARB values for that language, and the count is the same as in English (14);
  - the block shape is the same;
  - `translatedFrom: 2026-11-26`, and app.daili.app and account.apple.com are present;
  - the length guard passes;
  - no "family planner" in el/uk/bg.
  - All 24 pass.
- **Privacy, all 28 pages:**
  - exactly one `id="icloud-calendar"`, right after `outlook-two-way`;
  - each has the account.apple.com link, AES-256, caldav.icloud.com, TRMNL and the 30 days;
  - no `&amp;amp;`;
  - `git diff` shows exactly 4 changed lines + 1 new line per file.
- **Address form:** each privacy paragraph uses its page's form (formal fr vous, cs vy, tr siz, ru вы, ko 합니다체; id kamu as its page). The help articles use the app's informal form (id Anda).

**My spot-check, 5 help translations against their ARB:** I read fr, pl, el, ja and zh-Hant in full. The meaning matches the English, and every bold is the ARB value. For example:
- fr: **Connexion et sécurité** / **Mots de passe pour applications** / **Générer un mot de passe pour application** / **Connecter**
- pl: **Logowanie i zabezpieczenia** / **Hasła aplikacji** / **Wygeneruj hasło aplikacji** / **Połącz**
- el: **Σύνδεση και ασφάλεια** / **Ειδικά για εφαρμογές συνθηματικά** / **Αμφίδρομος** / **Όλη η σειρά**
- ja: **サインインとセキュリティ** / **アプリ用パスワード** / **連携する** / **シリーズ全体**
- zh-Hant: **登入與安全** / **App 專用密碼** / **雙向** / **整個系列**

**My spot-check, 3 privacy languages against the English:** I read the fr, pl and ja paragraphs in full. All facts are there, in the same order:
- rollout, app-specific password, never the normal password;
- sent once, encrypted, AES-256;
- only Apple's server gets it;
- calendar list + selected calendars;
- mail/contacts never;
- 15 minutes;
- only that calendar and no background job;
- what is changed/sent and stored;
- no guests;
- only the owner, AI apps never;
- disconnect, account deletion with 30 days;
- Apple's menu path;
- the legal basis.

Each uses its file's own words for "Two-way", "View only" and the section names.

**Translator notes (none blocks anything):**
- **Gaps in the app's ARB:** `app_pt.arb` `icloudMenuGenerate` and the three `icloudMenu*` keys in `app_bg.arb` are still English, and id has two of them in English. `app_sv.arb`: "App-specifika lösenord" (with a hyphen) vs "Skapa ett appspecifikt lösenord" (without). zh-Hant `登入與安全` may be `登入與安全性` on Apple's own page (not checked). sk uses two forms of the name, the same as its ARB. These are app texts, for the app lane.
- ja has no ARB value for "Daili and iCloud" in the page's style, so it uses 「DailiとiCloud」 as the page writes Google/Outlook.
- The nb, el and sk privacy pages use their own word for "event" ("oppføring", "ραντεβού", "termín"), and the new paragraph keeps it.
- ar uses Apple's word for the app-specific password (كلمة سر) next to the page's كلمة المرور for the normal password.

## Facts I could not confirm

- **That iCloud is off on production today.** Both switches are off by default (`ICLOUD_CALENDAR_ENABLED`, `calendar_two_way_icloud`). I cannot see the production `.env` or settings.
- **Step 4 of the article ("name it "Daili"").** This comes from the app's step 3 and the RESULT. Whether Apple really asks for a name, and whether it asks for the Apple password again, is still open (RESULT item 2, app 039 open item 1).
- **"Turn on two-factor authentication"** is from Apple's page (via the RESULT). The iPhone menu name in the app's yellow box was not read on a real phone. The article does not use that menu name.
- **Apple's own menu names in the other languages.** These come from the app's ARB (app 038). I did not check them against support.apple.com/<locale>/102654, except ar (the translator read Apple's Arabic page).
- **"Daili never asks for your normal Apple password."** The app never asks, and it refuses anything that is not 16 lower-case letters. A normal password that happens to be 16 lower-case letters would be sent to Apple once; if Apple refuses it, nothing is saved (`CalendarConnectionController.php:482-490`).
- Everything else was checked in the code or the reports (see §1 and §2).

## Verify (all in the foreground)

- `npm run check:help` → `help OK · 125 article(s) · locale(s) en, de, … id · 99 app routes checked`.
- `node tools/check-legal.mjs` → `legal OK · 2 document(s) × 28 locale(s)`.
- `npm run build` → exit 0:
  - `help: 115 of 125 article(s) on pages (live 1.17.0) · 14 topic(s) · en.json 125 articles, 16 tips, 6 checklist · PUBLIC`
  - `build OK · 3759 pages · 3728 in hreflang clusters`
  - `detector OK · 32 cases · 28 locale(s) built`
  - `help search OK · 38 cases · 2 built page(s)`
- No `CHANGELOG.md` line, because this repo has none.

## Help impact

New hidden article `calendar-connect-icloud` ("Connect your Apple calendar (iCloud)", `since: 99.0.0`). Privacy: new paragraph `icloud-calendar`, plus iCloud in "Connected calendars", "Edit in Daili", "AI apps you connect" and section 6, on all 28 pages.

## Open items for the owner

1. **Read the English and German paragraph `id="icloud-calendar"` BEFORE deploying the website** (`legal/privacy.en.html`, `legal/datenschutz.de.html`). The text is above and in German on the page. Look most closely at the four sentences I added to the draft (§1, points 1–5).
2. **`./deploy.sh` in `daili-website`.** The privacy text must be live BEFORE `ICLOUD_CALENDAR_ENABLED=true` is set on the server. The help article stays hidden after the deploy.
3. **On the app's release day** (the version with app 038–040):
   - In `help/en/calendar/connect-icloud.md`, set `since: 99.0.0` to the real app version.
   - Pictures: replace `mediaPending` with `media` (the connect screen with the five steps; Apple's page with the new password) and add the image lines in all 25 languages.
   - Add links to `calendar-connect-icloud` from the other calendar articles (`calendar-phone-calendars`, `calendar-two-way`). Both are near the word cap.
   - Rename "Apple Calendar" in `phone-calendars.md` to "Calendars on this iPhone" in every language (the ARB `calendarSettingsPhoneTitleIos`).
   - If Apple's step 3 turns out different on the real iPhone test, fix step 4 of the article too.
4. **For the app lane (not this repo):** the ARB gaps above (pt/bg/id Apple menu names still in English, the sv hyphen, and zh-Hant `登入與安全` vs Apple's wording). When the ARB changes, the help bolds must follow.
5. A native speaker could read the new privacy paragraph some time, mainly hi and ru (no ARB, menu names in English) and ar (two words for "password").

DONE
