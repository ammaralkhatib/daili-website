# Help sync 1.9.0

**Prompt:** `claude-prompts/2026-10-05/002-help-sync-1-9-0.md` · **Status:** done · **Commit:** `250d12c` (pushed to `origin/main`; step 0 was `50a1696`, the 003 report) · **Not deployed.**

## Articles × locales
12 English articles, each in all 24 other `HELP_LOCALES` (`updated` / `translatedFrom: 2026-10-06`) = 300 files.
- **New:** `notes-pictures-voice` (routes `/notes`, `/notes/new`) and `account-plus` (route `/settings`), both `since: 1.9.0`.
- **Rewritten:** `notes-notes` (5 pictures in the text, `since` stays 1.7.0).
- **Edited:** `calendar-photo`, `meals-photo`, `meals-youtube`, `meals-suggest` (3 free AI actions, 30 with Plus; `account-plus` added to `related`), `account-profile` (the switch, 6 steps now), `account-preferences` (this is the Appearance article; new picture `account-app-colour`), `account-delete`, `family-groups` (this is the switching article), `anywhere-watch` (Siri).
- **Turkish:** "etkinlik listesi" → "etkinlik akışı" in 3 more files. None is left.
- **`lists-*`:** checked, already right (lock on the right, open/closed). No change.

## Decisions you should know
- **The 150-word limit did not fit every fact.** I kept the rules and limits a user cannot see on the screen, and left these out:
  - `notes-notes`: Copy/Send start with the title; the pin and ⋯ in the note row; how the cards look; chips under the search field; the top part hiding; Paste link, link titles, `https://` optional; Undo; the review screen. Also gone from the old text: the Quick note widget / Action Button line, the activity-feed line, Mine / Shared with me.
  - `notes-pictures-voice`: the cloud badge ("tap to try again"), "a cloud drawing needs a connection", the one-button voice sheet. The six colours and "New tag" are only in the picture descriptions.
  - **My suggestion:** two small extra articles (finding notes + Recently deleted; where note files are kept) would hold all of it. Say if you want them.
- **No links inside articles** (the guard forbids them). `account-plus` is linked through `related`. The Terms are named as "Terms of Use on daili.app", not linked.
- The old "a few free reads … free for life" sentences were replaced, not kept next to the new one.
- **Siri:** 17 languages quote Siri's own phrases. pl, cs, sk, ro, el, uk, bg and id have none, so they quote the English ones and say so.
- Added from app report 007: on Android, text in pictures is read in Latin script only.
- A second reader (a sub-agent) checked the English against the app code. Three sentences were fixed in all languages: leaving the profile brings the old colour back (the switch itself stays); the share question only comes for a note with files on this phone; Founder families cannot open the Plus sheet, so the Terms pointer goes to daili.app.

## Translations
Done by sub-agents (AI), not read by a native speaker. A script put every button name in from the app's ARB files, so labels match the app exactly.

## Pictures
All 11 ids × 25 locales are there, sizes match `help/media*.json`, no gaps. Committed: 200 new + 75 changed WebPs and the 25 media lists.

## Routes
`routes-allowlist.json` → `pending` was already empty; nothing to remove. 62 app routes checked.

## Build
```
help OK · 74 article(s) · 25 locales · 62 app routes checked
test-check-help OK · 99 cases
build OK · 2259 pages · 2239 in hreflang clusters
detector OK · 32 cases · 28 locale(s) built
```
Spot checks in `dist/help/<code>.json`: en `notes-pictures-voice`, de `account-plus`, ja `notes-notes`; `tr.json` has no "etkinlik listesi". Green on the first run.

## Open points (app side)
- `AppShortcuts.xcstrings` fi: "…${applicationName}iin" gives "Dailiiin". The help says "Dailiin".
- `app_pt.arb`: `notesShareTextOnly` ("Partilhar só o texto") and `settingsNoteFilesPausedReason` ("telemóvel") are European Portuguese. The help shows the label as the app has it.
- The word for "AI action" differs between strings in el, bg and id. `app_cs.arb` `notesReminderOnlyYou` uses formal "vy".
- `notes-tile` picture is one re-shoot behind (app report 004).

**Reminder:** deploy on store day together with the `LIVE_APP_VERSION` 1.9.0 bump (`./deploy.sh`). A deploy before that day would already show the rewritten Notes article and the Plus sentences to 1.8.0 users. The two new articles only become pages after the bump.

## Help impact
n/a
