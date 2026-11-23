# Help: new article "Shift plan" (hidden until the release)

Standard lane, website only. Feature "Shift plan / Dienstplan" (Daili list item #281). Plan:
`/Users/ammarkhatib/development/flutter_projects/familyplanner/familyplanner-app/claude-prompts/SHIFTS-PLAN.md`
(**Decisions** D1–D7). Design words: `/Users/ammarkhatib/development/flutter_projects/familyplanner/design-handovers/2026-11-23-shift-plan-RESULT.md`.
It ships with the next app release (and the web after it). The Help center needs the article now,
hidden.

Every sub-agent you start MUST use model claude-opus-5-5. Write the report with the file-write tool.

## 1. Keep it hidden

Same way as `help/en/lists/steps.md` (prompt `claude-prompts/2026-11-21/002-help-steps-inside-a-todo.md`
§1, commit `8f80fac6`): `since: 99.0.0` in the English file, NO `related:` link FROM any other article to
it, do NOT bump `LIVE_APP_VERSION`. Do NOT change `help/*/calendar/views.md` or `add-event.md` now
(translations carry no `since`, so a change would go live at once) — the release help sync adds the
link from "Calendar views" later.

## 2. The article — `help/en/calendar/shift-plan.md`, id `calendar-shift-plan`

Front matter like `help/en/calendar/repeating.md`: topic `calendar`, title "Plan your shifts", a
one-line summary, keywords (shift, shifts, shift plan, rota, roster, work schedule, early shift, late
shift, night shift, Dienstplan, tap days, nurse, shift work), `routes:` the app's new routes (take the
exact paths from the app reports `../familyplanner-app/claude-reports/2026-11-23/018-…` and `019-…`,
expected `/calendar/shifts` and `/calendar/shifts/types`; add them to `help/routes-allowlist.json` if
`check-help` needs it), `tryIt: /calendar/shifts`, `since: 99.0.0`, `updated:` today, `mediaPending:`
"the Shift plan month with Early and Night days, and the My shifts list", `order:` after the last
calendar article (shift the siblings only if the build asks), `related: calendar-views,
calendar-add-event, calendar-reminders`.

**Check every fact against the code before you write it**: the app (`../familyplanner-app/lib/l10n/app_en.arb`
— search `shift`; the reports 018 and 019) and, for the one web line, the web
(`../daili-web/src/i18n/en.ts` — search `shift`; `../daili-web/claude-reports/2026-11-23/009-…`). The app
and web prompts run BEFORE this one; if a report is missing, write from the RESULT and list every fact
under "Facts I could not confirm". Use the app's EXACT button names in **bold**. Style: short sentences,
easy words, numbered steps, "you", ≤ 220 words. Content:

1. One line: save your shifts once, then tap days in a month to plan them; each day becomes a normal
   event the whole family sees.
2. Numbered: Calendar → **View** → **Shift plan** → the first time, tap **+** on a ready shift (Early,
   Late, Night) or **Make your own shift** → pick a shift at the top → tap the days → **Save … days**.
3. Tap a day again to remove it, or pick **Off** and tap. Changed days get a small dot until you save.
   One shift per day.
4. **My shifts** (the pencil): name, short label (shown in the month), start, end, colour, a reminder
   before every day. A night shift that ends after midnight shows **+1 day**. Up to 20 shifts. Changes
   apply to new days only; days you already planned stay as they are. Deleting a shift keeps its
   planned days in the calendar.
5. In the calendar a shift day is a normal event in the shift's colour: open it to change or delete
   just that day. Removing a day in the Shift plan deletes that event, even if someone changed it.
6. Admins can plan for a child without their own login (**Plan for**).
7. One line: on the web (app.daili.app) it is in the calendar's **View** menu too.
8. No save without internet: "Nothing was saved. Try again." — your taps stay until you save.

## 3. Translations

A new English article breaks the build until it exists in every `HELP_LOCALES` language
(`site.config.mjs`). Translate it into all of them following
`claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md`, with `translatedFrom` = the English `updated` —
exactly as `claude-prompts/2026-11-21/002-help-steps-inside-a-todo.md` §3 did (same blocks, same order,
≤ 210 words). Use each language's REAL app words from `../familyplanner-app/lib/l10n/app_<arb>.arb`
(the `shift…` keys; zh-Hans → `app_zh.arb`, zh-Hant → `app_zh_Hant.arb`). German: the feature is
**Dienstplan**, the types are **Schichten** (Ammar's words). 🔴 No real user's names in examples (the
design boards use made-up names; use none or a made-up one).

## 4. Verify

- `npm run check:help` and `npm run build` green (FOREGROUND); spot-check 5 translations against their
  ARB. The article does NOT show on the built site's index or search (prove it the way 2026-11-21/002
  did).

## Commit & push

- `docs(help): article "Plan your shifts" (hidden, since 99.0.0)`; body names
  `Prompt: claude-prompts/2026-11-23/004-help-shift-plan.md`.
- **Push now.** Do NOT run `./deploy.sh` (Ammar deploys; nothing changes on the live site anyway).
- 🔴 Report trap: never put the word "status" and the word "blocked" on one line unless you really
  are blocked (the run script stops on it).

## Report

- `claude-reports/2026-11-23/004-help-shift-plan.md` (file-write tool, `wc -c` > 0). Facts I could not
  confirm; the routes added; the open items for the release help sync (real `since`, a line + `related`
  link in `calendar-views` in all locales, the pictures). `## Help impact`: new hidden article
  `calendar-shift-plan`.
