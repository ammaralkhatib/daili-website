# Help sync 1.11.0 — part 2: Cycle, Habits, Settings (+ sign-in line)

## Goal
Second and last part of the 1.11.0 help sync (after `002`). Make the Cycle
and Habits topics and the Preferences article true for 1.11.0, in English
and every `HELP_LOCALES` language, with the pictures from app prompt
`2026-10-16/006`. At the end `help/routes-allowlist.json` → `pending` must be
EMPTY and every app route must have an article.

**Do not deploy.** `LIVE_APP_VERSION` stays as it is. New articles carry
`since: 1.11.0`; updated articles keep their `since`.

## Sources (read in place)
- Cycle: app reports `../familyplanner-app/claude-reports/2026-10-15/015`–`028`
  and `2026-10-16/002`–`003`; rules `../familyplanner-app/CLAUDE.md` §3 "Cycle
  tracker" + `../familyplanner-app/claude-prompts/CYCLE-PLAN.md`.
- Habits: app reports `2026-10-14/003`–`011`, `2026-10-15/001`–`002`; api
  reports `~/Herd/familyplanner-api/claude-reports/2026-10-14/007`–`008`;
  Project rules in `../familyplanner-app/CLAUDE.md` §3 "Habits + Minzi".
- Settings: app report `2026-10-16/005` (Temperature unit); sign-in consent
  line: app report `2026-10-14/002`.
- Labels: the ARB files. Pictures: app report `2026-10-16/006`. Check the
  app code when a report is unclear. Do not guess.

## Scope
- In: `help/<code>/cycle/*.md`, `help/<code>/habits/*.md`,
  `help/<code>/account/preferences.md`, `help/<code>/start/sign-in.md` (or
  whatever file holds the sign-in article), `help/media*.json` +
  `static/help/media/**` for the cycle/habits/account ids (commit them),
  `help/routes-allowlist.json`, `npm run build`.
- Out: `LIVE_APP_VERSION`, legal pages, Budget (part 1), other topics.
  🔴 Untracked files that are not yours: leave them untracked.

## Cycle (no `tipTitle`/`tipBody` on any Cycle article — a tip would advertise Cycle to everyone)
1. **`cycle-start`** (update) — design A: one card with a two-tone ring;
   "Period started" is always there, "Started earlier?" opens Edit period
   days; during a period: Light/Medium/Heavy right on the card, "+ Symptoms
   & mood", "It ended" asks which day was the last (today, yesterday, pick a
   day; earlier days in between count as period days). The card shows the
   dates of the next period as a range. Setting up: Today / Yesterday / 2
   days ago chips, a month grid, wheels for the lengths, "Not sure — Daili
   learns it from your logs". After a start you count as on your period for
   your usual length unless you say it ended. Keep the not-medical line and
   the link `/terms.html#cycle`. `media: cycle-start` (re-shot).
2. **`cycle-calendar`** (NEW) — "Cycle calendar, logging a day and history".
   Calendar: period = a band (solid = logged, soft = probably period,
   striped/soft range = predicted), today = a dark ring, "Edit period days"
   button at the bottom of the calendar card (mark/unmark many days,
   Done/Cancel). Day sheet: "Period today" switch, optional "How much?",
   Spotting separate, ‹ › between days, Clear day with Undo; symptoms incl.
   nausea, sleep problems, low energy, discharge; mood "Energetic". History:
   a bar per cycle, shortest/longest, a "Patterns" card from what you
   logged. `media: cycle-calendar`, picture `cycle-day` in the text,
   `routes: /cycle/history` (+ any other Cycle route not covered).
3. **`cycle-privacy`** (update) — reminders: new "Ask if my period started"
   (on by default; one reminder the day after the expected range ends);
   "period soon" says "in the next few days"; lock-screen text discreet by
   default. Lock: the app switcher shows only the Daili logo; on Android
   screenshots and screen recording of Cycle are blocked while locked.
   Import (CSV) of your own export (days already on the phone are kept) +
   the backup tip (iCloud Backup / Google backup). **Show on my calendar**:
   off by default, only on this phone, hidden while Cycle is locked; your
   own calendar shows a drop (filled = logged, outline = predicted) and a
   "Period" / "Period may start" row — the family never sees it. Replace
   `mediaPending` with `media: cycle-settings`. Link `/privacy.html#cycle`.
4. **`cycle-supplies`** (NEW) — "Supplies before your period". A few days
   before the predicted range the Cycle screen can show "Your period may
   start soon. Need anything?" → "Add to a list" → `/lists/supplies`: tick
   items (or add your own), pick one of YOUR private shopping lists or "New
   private list", Save. Only the ticked items are added, to a list only you
   see. × hides the card for this time; switch it off in Cycle settings
   ("Suggest supplies before my period"). `media: cycle-supplies`,
   `routes: /lists/supplies`.
Cycle wording: neutral and respectful in every language; only the app's own
Cycle words (ARB) — never add medical terms. Do NOT mention Cycle in any
Calendar or Lists article.

## Habits (respect the Minzi rule in CLAUDE.md §3: she only does what a real cat does)
5. **`habits-what`** (update) — the board: the + is a rounded square at the
   bottom right; the cat icon at the top right is gone (her card opens from
   the third tab, her name); the energy bar sits in the room card and
   becomes a small ring when you scroll; "My habits" is now "Today" with
   "x of y done"; no greeting bubble.
6. **`habits-create`** (update) — the new form (questions with icons, three
   "Who" cards — "Each of us" starts with you picked, "How do you track it?",
   "What do you count?" = the word after the number, "times" = just a
   number), the icon row (icon, up to 3 suggestions from the name, **More** →
   picker with search, groups and a colour; picture `habits-icons` in the
   text), "Save to my habit list", the "Start a habit" sheet ("Make your own"
   pinned at the bottom, your family's categories and saved habits, "Added"
   on templates in use, long-press a saved habit → Edit, Move, Delete),
   removing a person asks first because their ticks are deleted.
   `media: habits-create` (re-shot).
7. **`habits-categories`** (NEW) — "Your own habit categories and saved
   habits". Opened from the "Edit" chip in "Start a habit": make categories,
   save habits to reuse; shared with your family; the creator or an admin
   can edit; only admins can hide built-in categories. `media:
   habits-categories`; `routes`: the screen's path if it has one, else none
   (`tryIt: /habits`).
8. **`habits-tick`** (update) — quick "+1" taps all count; unticking your
   own habit shows Undo; 🎉 + confetti; counters fill piece by piece and can
   go past their goal (a small "+2" badge); long-press a counter row → the
   counter sheet with minus to fix a mistake; tapping a full counter no
   longer opens the sheet. Family tab: a bar per person, and "Together"
   habits in their own row, counted for whoever ticked.
9. **`habits-minzi`** (update) — a calm room with an armchair, she lives on
   the right; new things she does (kneading, chasing her tail, watching a
   butterfly, playing with a yarn ball); tap her for many reactions; after
   you rename her, the energy line and the tab use the new name.
10. **`habits-reminders`** (update) — counter habits can remind "Once a day"
   or "Each time" (up to 8 times, and they stop once the count is reached).
11. `habits-private`, `habits-streaks`: check against the new screens; change
   only what is now wrong.

## Settings + sign-in
12. **`account-preferences`** (update) — new "Temperature unit" row
   (Automatic / °C / °F; Automatic follows your phone's region; wind and
   rain units change with it). Title gets "temperature" if it lists the
   other rows. Picture `account-temperature` in the text if useful.
13. Sign-in article (e.g. `start-sign-in`): one sentence that continuing
   means agreeing to the terms of use, with links to the terms and the
   privacy policy (app report 2026-10-14/002). Only if the article describes
   that screen.

Front matter: `updated: <today>`, `order` within the topic (new Cycle
articles after the existing ones: start 1, calendar 2, privacy 3, supplies
4; habits-categories right after habits-create), `related` inside the topic.

## Constraints
- Translate every new and changed article into all `HELP_LOCALES`
  following `claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md`, with the
  app's own labels per language (pt = Brazilian "você", fr "tu", id
  "Anda"). el/uk/bg: never "family planner".
- `npm run build` green, `node tools/check-help.mjs` green, `pending` = {}.

## Verify
Build. Spot-check `en` `cycle-calendar` + `habits-create`, `de`
`cycle-supplies` + `account-preferences`, `ja` `habits-minzi`, `pt`
`cycle-privacy` (Brazilian); `dist/help/en.json` lists 4 Cycle articles and
the new Habits article; `/lists/supplies` resolves to `cycle-supplies`.

## Commit & push
`docs(help): 1.11.0 part 2 — Cycle, Habits, settings`; body
`Prompt: claude-prompts/2026-10-16/003-help-sync-1-11-0-cycle-habits-settings.md`.
**Push. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-10-16/003-help-sync-1-11-0-cycle-habits-settings.md`,
half a page: articles × locales, pictures found/missing, routes and
`pending`, facts you corrected against the code, build lines, SHA + push.
`## Help impact`: n/a.
