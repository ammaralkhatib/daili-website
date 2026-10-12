# 003 — Help sync 1.10.0 part 1: Budget and Cycle topics

**Status: done.** Step 0 had nothing to do: no planning docs were waiting. The work is in commit `10c6343`, and this report is in the commit after it. Both are pushed to `main`. I did **not** run `./deploy.sh`, and `LIVE_APP_VERSION` is still `'1.9.0'`.

## What's new
- **Two topics.** `budget` (icon `wallet`) comes right after Notes. `cycle` (icon `cycle`) comes right after Habits. Both keys are in `HELP_ICONS`, with new glyphs in `build.mjs` `HELP_GLYPHS`: a wallet, and a drop (the app's Cycle tile uses `Icons.water_drop_rounded`). No other topic moved.
- **5 articles × 25 locales = 125 files**, all `since: 1.10.0`, plus the two topic titles and summaries in every `_ui.json`:
  - `budget-start` (order 1): has the only new tip, priority **35**, lower than every existing tip (the lowest was 40).
  - `budget-bills` (2)
  - `budget-split` (3)
  - `cycle-start` (1)
  - `cycle-privacy` (2)
  - The Cycle articles have no tip. `related` links each topic's articles to each other, plus `notifications-choose` (bills) and `start-edit-home` (all five).
- **How the translations were made.** I wrote the English first and had it fact-checked against the code. Then I made a template where every app label is an `{{arbKey}}` placeholder (57 keys, all present in all 24 ARBs). Six sub-agents each translated 4 languages, and a script filled in each language's ARB label. The alt texts follow each language's own pictures (names, currency, month).

## Pictures
- **Found and committed**, for all 25 locales: `budget-start`, `budget-split`, `cycle-start`.
- **Also committed:** the re-shot `notifications-choose`. `budget-bills` uses it, and only the new shot shows **Bill reminders** and **Budget alerts**. Its own article's alt text is part 3's job.
- **`help/media*.json`:** I committed only the three new entries. `start-weather`, `start-features`, `calendar-other-calendars` and the `start-today` height change stay uncommitted for 004/005. With no article using them yet, the guard would call them orphans and fail.
- **Missing:** `cycle-privacy` has no picture. It is marked `mediaPending: Cycle settings screen; no help-shots entry yet`, and the build lists it.

## Routes
- **Removed from `pending`** (7): `/cycle`, `/budget`, `/budget/new`, `/budget/:id`, `/budget/:id/categories`, `/budget/:id/settings`, `/budget/:id/split`.
- **Still pending:** `/weather`, for part 2.
- **Prompt deviation:** `/cycle/history` and `/cycle/settings` are not in the app's `RoutePaths` (they are child routes), so the guard rejects them. Both Cycle articles list `routes: /cycle`.

## Facts I corrected against the code (the prompt or the app's picture report was wrong)
- **Categories:** there is no "Manage categories" row. The way in is **⋯** → **Categories**, or Settings → "Manage" → Categories.
- **Bill due date:** a bill has no separate due-date field. The entry's **Date** is the due date.
- **Who gets bill reminders:** the person in **Paid by**. If nobody is set, everyone who can see the budget gets them.
- **Limit alerts:** they are about the budget's overall limit only.
- **Splitting:** **Split shared costs** in Budget settings opens a sheet with the switch, **Who shares the costs** and **Save**. Costs are split equally among the chosen people, not the whole family.
- **Settle up:** the button exists, on the Balances card. App report 009 said it didn't. Then you tap **Mark as paid** twice (once on the list, once to confirm). The payment does not count as spending.
- **Logging a period:** "Period started today" only shows before any period is logged. Later periods are logged by tapping the day in the month. **Log today** and **It ended** only show while a period is running.
- **Cycle card:** it is only in the first-run feature picker, not in Settings → Home screen.
- **Lock-screen text:** the discreet reminder says "You have a reminder. Tap to open." (`cycleNotificationDiscreetBody`).
- **Deleting your account:** it erases Cycle data on this phone. An older phone backup may still have it, and the article says so.

## Left out to stay under 150 words
- 4 templates in detail
- the 20-budget cap
- reminder time 09:00
- the "All bought" offer's conditions (2+ items, once a day)
- period-reminder defaults (2 days before, 09:00)

**No body links are allowed** (the guard forbids them), so the terms and privacy links became text: "More in the terms of use / privacy policy on daili.app."

## Verify
- I ran the build in a clean worktree of HEAD plus the staged change only, because the uncommitted part-2 pictures would make the working tree red. `npm run build` exits 0:
  - `help OK · 82 article(s) · locale(s) en … id · 71 app routes checked`
  - `test-check-help OK · 99 cases`
  - `build OK · 2384 pages`
  - every locale: `82 articles, 15 tips, 6 checklist`
  - the same 34 old home-page content warnings as before
- `dist/help/en.json` lists `budget` → `wallet` and `cycle` → `cycle`, and has one new tip (`budget-start`, 35).
- **Spot checks:** `en budget-start`, `de cycle-start`, `ja budget-split`, `pt cycle-privacy`. The pt one uses Brazilian você ("Você tem um lembrete", "seu celular"). All labels match the ARBs.

## Notes from the translators (app side, not fixed)
- **pl:** the budget picture reads "Lena jest winien" (masculine form). The Polish ARB string may need a gender-neutral wording.
- **pt:** ARB `quietHoursHint` uses European Portuguese "defines". The rest of the file is Brazilian.
- **it:** the app calls Budget "Bilancio" but `listMenuAddToBudget` says "Aggiungi al budget".
- **zh-Hans / zh-Hant:** "budget alerts" and "reminders" are the same word (提醒), so those titles say 账单、账单提醒和预算提醒.

## Not mine (untouched, not committed)
- `claude-reports/2026-10-01/`
- `static/assets/img/blog/what-to-look-for-family-app.webp`
- `static/assets/img/photos/`
- the part-2/3 pictures and the rest of the `help/media*.json` changes

## Help impact
n/a
