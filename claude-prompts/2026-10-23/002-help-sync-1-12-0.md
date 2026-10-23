# Help sync 1.12.0: AI avatar (new), widgets, Budget guests + share, colour default, Edit Home tile

## Goal
Make the help center true for app 1.12.0 (18) in English and every
`HELP_LOCALES` language, with the pictures from app prompt
`../familyplanner-app/claude-prompts/2026-10-23/002-help-shots-1-12-0.md`
(already written to `static/help/media/**` by the runner — commit them here).

**Do not deploy.** `LIVE_APP_VERSION` stays as it is. The new article carries
`since: 1.12.0`. Updated articles keep their `since` and get `updated:` = the
day you run this.

## Sources (read in place — the reports are the fact list)
- App reports `../familyplanner-app/claude-reports/`:
  `2026-10-20/003`–`006`, `011` (widgets) · `2026-10-21/001`–`003` +
  `2026-10-22/003` (AI avatar) · `2026-10-22/008`–`009` (budget guests, share)
  · `2026-10-22/013` (app colour on by default) · `2026-10-22/015` +
  `2026-10-23/001` (Edit Home tile, Family last, "tiles") · `2026-10-23/002`
  (picture ids + alt texts). Read their `## Help impact` and "what changed".
- API reports `~/Herd/familyplanner-api/claude-reports/2026-10-21/001`
  (avatar rules) and `2026-10-22/009`–`010` (guests, share page).
- Labels: the app's ARB files (`../familyplanner-app/lib/l10n/`). Check the app
  code when a report is unclear. Do not guess.

## Scope
- In: `help/<code>/account/*.md` (new avatar article + `profile`),
  `help/<code>/anywhere/widgets.md`, `help/<code>/budget/split.md`,
  `help/<code>/start/edit-home.md` (+ `start/home.md` only if it names the tile
  order), `help/media*.json` + `static/help/media/**` for the ids from app
  report 2026-10-23/002, `npm run build`.
- Out: `LIVE_APP_VERSION`, legal pages, other articles, home page, blog.
  🔴 Untracked files that are not yours (`static/assets/img/photos/`): leave
  them untracked.

## Articles (English facts; short sentences; the voice and brand spelling of the existing articles)

1. **`account-avatar-ai`** (NEW, topic account, `since: 1.12.0`, after
   `account-profile` in `order`) — "Create your avatar with AI". Profile →
   **Change picture** → **Create avatar with AI** (also from a child's picture
   sheet, for admins). Two tabs: **From a selfie** (adults, own avatar only;
   the one-time "18 or older" question; tips: face the camera, good light,
   only you) and **Pick your look** (age, skin tone, hair, hair colour, beard,
   glasses, head covering, top colour — the only way for children; "For
   children we never use a photo"). One try makes 3 versions and uses 1 AI
   action; there is also a monthly avatar limit (read the number and the
   wording from the app — don't promise more than it says). Pick one → it
   becomes your picture. **Your AI avatars**: every version stays on this phone
   (newest 30 per person, not on other phones or the web), shown under
   **Choose an avatar** above Adults; tap = use it again (no AI action); long
   press = save or share, or delete. Daili Plus feature — same wording as
   other Plus articles (founder families included — check `account-plus`).
   Privacy line: the selfie is sent to our AI partner and deleted right after
   (as the app says). `media: account-avatar-ai`, second picture
   `account-avatar-ai-look` in the text. `keywords`: avatar, AI avatar, selfie,
   cartoon, profile picture, draw me, create avatar, pick your look.
   `related: account-profile, account-plus`.
2. **`account-profile`** (update) — the picture step mentions **Create avatar
   with AI** (link the new article) and that your AI avatars sit under
   **Choose an avatar**. The colour step: **Use my color for the app** is now
   ON by default; switch it off to keep daili green (also under Settings →
   Appearance → App colour). Check the exact labels in `app_en.arb`.
3. **`anywhere-widgets`** (update) — Calendar widget lists your next days (not
   only today and tomorrow), events happening now stay; widgets switch to the
   new day by themselves and show "+N more"; they update by themselves when
   your family changes something (iPhone: not after the app was swiped away);
   Android: ticks show at once, follows dark mode; iPhone lock screen hides
   titles until you unlock. Keep it short — one short paragraph or 3 bullets,
   no technical words (no "background refresh", no "3-hour job").
4. **`budget-split`** (update) — **Guests**: friends without Daili; add,
   rename or delete them in Split costs (a guest still used in entries can't
   be deleted — say what the app says); a guest can pay an expense and settle
   up; on a shared expense choose **For whom**; a private budget can split
   costs with guests only. **Share** (`budgetShareSheetTitle` "Share with
   guests"): **Send summary** (who pays whom as a message) and **Link for
   guests** (a read-only page, no app needed; Copy / Share; **Stop sharing**
   makes the old link stop working; only a guest-enabled budget can make one).
   Pictures: re-shot `budget-split` + new `budget-share` in the text.
5. **`start-edit-home`** (update) — a dashed **Edit Home** tile at the end of
   Home opens edit mode ("Add, hide or move tiles"); Family is the last tile by
   default. Picture `start-edit-home-tile` in the text (keep `media:` as is).
   `start-home`: change only if it states where Family sits.

## Translations
Translate every new and changed article into all `HELP_LOCALES`, following
`claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md` (labels from each
language's ARB). New pictures: the runner already made them for all locales;
if a locale's picture is missing, list it in the report (do not invent one).
Pictures that already exist and did not change: untouched.

## Build
`npm run build` must pass (check-help, routes, search tests). A build failure
not caused by this change: stop, report `blocked`.
Read `dist/help/account/avatar-ai/` (or the real built path), the German
version, and `dist/help/budget/split/`: text, pictures, related links render.

## Commit & push
`docs(help): 1.12.0 — AI avatar, widgets, budget guests + share, colour default, Edit Home tile`;
body `Prompt: claude-prompts/2026-10-23/002-help-sync-1-12-0.md`. Your files
only (plus the help pictures). **Push now. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-10-23/002-help-sync-1-12-0.md`, half a page: articles new
/ changed, labels checked (and any mismatch with a report), locales done,
missing pictures, build result, SHA + push. `## Help impact`: this IS the help
sync — list the article ids.
