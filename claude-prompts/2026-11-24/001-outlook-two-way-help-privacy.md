# Help + privacy: two-way calendars (Google and Outlook) — new hidden help article, privacy names Outlook two-way

Standard lane, website only. Feature "Outlook two-way" (Daili list item #299). Plan:
`/Users/ammarkhatib/Herd/familyplanner-api/claude-prompts/OUTLOOK-TWO-WAY-PLAN.md` (Decisions 2, 5, 8–11, Design
Part 7). The api, app and web prompts of this run come BEFORE this one — read their reports:
`~/Herd/familyplanner-api/claude-reports/2026-11-24/009…013-*.md`,
`../familyplanner-app/claude-reports/2026-11-24/009-…` + `010-…`, `../daili-web/claude-reports/2026-11-24/004-…` +
`005-…`. If one is missing, write from the plan and list every fact under "Facts I could not confirm".

Why now: Daili can write into a person's Outlook calendar once they switch it to two-way (for now only the owner has
the switch; everyone after the publisher check, #22 Part B). The privacy text must say so BEFORE anyone else can use
it, and the Help center has no two-way article at all yet — not even for Google, which is live since 2026-11-18.

Every sub-agent you start MUST use model claude-opus-5-5. Write the report with the file-write tool.

## 1. Privacy (`legal/privacy.<lang>.html`, 27 files, + `legal/datenschutz.de.html`)

Today (`privacy.en.html`, helper read 2026-11-24 — re-check): ~32 "Connected calendars" says Daili only reads,
"unless you switch one of your Google calendars to Two-way"; ~33 `id="copy-to-daili"` lists "an Outlook calendar"
among calendars Daili never changes and names only Google as the exception; section 5 `id="google-user-data"`
(~67-125) with `id="google-two-way"` (~76-79) is Google-only. `tools/check-legal.mjs` (~183-184, 292-293) requires
`id="google-two-way"` in every locale.

1. ~32 and ~33: Outlook calendars can be two-way too — same words as Google's, "Google or Outlook" (keep every
   Google sentence true; do not weaken any Google promise).
2. A new short sub-section `id="outlook-two-way"` right after `id="google-two-way"` (or inside the connected-calendars
   section if that reads better — say where): only when YOU switch an Outlook calendar to two-way, Daili asks
   Microsoft for the permission `Calendars.ReadWrite` ("read and change your calendar events"); it then changes,
   deletes or adds only the events you change, delete or add in Daili, only in that calendar; it never sends
   invitations or adds guests; events with guests stay view-only; a background job never writes; switching back to
   one-way, deselecting or disconnecting never deletes anything in Outlook; you can take the permission back in your
   Microsoft account (https://account.live.com/consent/Manage for personal accounts — check the link opens; for work
   or school accounts the company's own page — say it in words, no link). Outlook events never reach AI apps (same as
   today's MCP line, if the page has one — check).
3. Same change in every language (each file's own words for "two-way" — read how that file already says it for
   Google) and in `datenschutz.de.html`. Bump each page's "last updated" date to 2026-11-24 the way the files already
   do it. Extend `check-legal.mjs` so `id="outlook-two-way"` is required in every locale, like `google-two-way`.

## 2. Help — new article, HIDDEN until the Outlook switch is on for everyone

Same way as `help/en/calendar/shift-plan.md` (prompt `claude-prompts/2026-11-23/004-help-shift-plan.md` §1):
`since: 99.0.0` in the English file, NO `related:` link FROM any other article to it, do NOT bump
`LIVE_APP_VERSION`, do NOT change other articles now (translations carry no `since`).

**`help/en/calendar/two-way.md`, id `calendar-two-way`.** Front matter like `help/en/calendar/repeating.md`: topic
`calendar`, title "Change Google and Outlook events in Daili", a one-line summary, keywords (two-way, two way, sync,
edit Google event, edit Outlook event, Google Calendar, Outlook, Microsoft, write back, Save to), `routes:` the app's
real routes for the calendar picker and the external event edit (take them from the app reports;
`help/routes-allowlist.json:10` already has `/calendar/external-edit` "two-way Google, dark until the scope is
approved" — update that note), `tryIt:` the picker route if there is one, `since: 99.0.0`, `updated:` today,
`mediaPending:` "the calendar picker with the Two-way switch, and an Outlook event open for editing", `order:` after
the last calendar article, `related: calendar-phone-calendars, calendar-repeating, calendar-add-event`.

**Check every fact against the code before you write it** (app `lib/l10n/app_en.arb`, search `twoWay`; web
`../daili-web/src/i18n/en.ts`, object `twoWay` and its Outlook twins). Use the app's EXACT button names in **bold**.
Short sentences, easy words, numbered steps, "you", ≤ 260 words. Content:

1. One line: switch a Google or Outlook calendar to two-way, and changes you make in Daili go to that calendar too.
2. Numbered: where the switch is (the picker of a connected Google / Outlook account), the one-time permission
   (Google's page / Microsoft's page), then edit, delete or add events — **Save to** picks the calendar.
3. Only the person who connected the calendar can change its events; everyone else sees them as before (and can still
   use **Edit in Daili**).
4. Repeating events: **This day only** or **Whole series**; a whole series can change its title, place and notes,
   not its time (change the time day by day, or in Google / Outlook).
5. Some events stay view-only (with the reason in the event): events with guests, invitations from someone else,
   special events (Google: birthdays, focus time…; Outlook: online meetings), and in Outlook a few repeats Outlook
   counts differently ("every month on the 31st", "every year on 29 February").
6. Outlook only: you can't move one day of a series past the next or the previous day.
7. Changes made in Google or Outlook show in Daili within seconds.
8. One line: on the web (app.daili.app) it works the same.
9. One line: switching back to one-way, or disconnecting, never deletes anything in Google or Outlook.

## 3. Translations

A new English article breaks the build until it exists in every `HELP_LOCALES` language (`site.config.mjs`).
Translate it into all of them following `claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md`, with
`translatedFrom` = the English `updated`, exactly like `2026-11-23/004` §3. Use each language's REAL app words from
`../familyplanner-app/lib/l10n/app_<arb>.arb` (the `twoWay…` keys and their Outlook twins; zh-Hans → `app_zh.arb`,
zh-Hant → `app_zh_Hant.arb`). "Google", "Outlook", "Microsoft" stay as they are.

## 4. Verify

- `npm run check:help`, the legal check (`node tools/check-legal.mjs` or the npm script that runs it) and
  `npm run build` green (FOREGROUND); spot-check 5 translations against their ARB and 3 privacy languages against
  the English. The help article does NOT show on the built site's index or search (prove it like 2026-11-23/004).

## Commit & push

- `docs(legal,help): privacy names Outlook two-way; hidden article "Change Google and Outlook events in Daili"`;
  body names `Prompt: claude-prompts/2026-11-24/001-outlook-two-way-help-privacy.md`.
- **Push now.** Do NOT run `./deploy.sh` (Ammar deploys).
- 🔴 Report trap: never put the word "status" and the word "blocked" on one line unless you really are blocked (the
  run script stops on it).

## Report

- `claude-reports/2026-11-24/001-outlook-two-way-help-privacy.md` (file-write tool, `wc -c` > 0). The new privacy
  paragraph in en + de word for word; where it sits; facts I could not confirm; the routes; the open items for the
  Outlook switch-on day (real `since` for the article, `related` links from `calendar-phone-calendars` /
  `calendar-repeating` in all locales, the pictures). `## Help impact`: new hidden article `calendar-two-way`;
  privacy: Outlook two-way.
- `## Open items for the owner`: deploy the website (`./deploy.sh` in `daili-website`) — the privacy change should be
  live before anyone but Ammar gets the Outlook switch.
