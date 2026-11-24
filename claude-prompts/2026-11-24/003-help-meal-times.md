# Help: "Meal times" — new hidden article, 25 languages (live articles stay as they are until the release)

Standard lane, website only. Feature "Meal times" (Daili list item #287). Plan:
`/Users/ammarkhatib/Herd/familyplanner-api/claude-prompts/MEAL-TIMES-PLAN.md` v1.0. The api, app and web prompts of
this run come BEFORE this one — read their reports first:
`~/Herd/familyplanner-api/claude-reports/2026-11-24/018-meal-times-server.md`,
`../familyplanner-app/claude-reports/2026-11-24/019-meal-times-texts.md`, `020-meal-times-meals.md`,
`021-meal-times-calendar.md`, `../daili-web/claude-reports/2026-11-24/008-meal-times-web.md`. If one is missing,
write from the plan and list every fact under "Facts I could not confirm".

What the feature does (for the text — check every fact against the code): each meal (breakfast, lunch, dinner,
snack) has a usual time for the family, set in Meal settings next to its switch (defaults 7:30, 12:30, 18:30, 15:30).
One meal can get its own time in its meal sheet: "Just this meal", or "This and future" (= the usual time from
today; past meals keep the time they had). Each snack can have its own time, so a day can have several snacks. The
add sheet shows the time under the meal chips. The week plan shows the time in front of each meal and sorts by time.
In the calendar's day, 3-day and week view a meal is a block with a dashed edge at its time (breakfast 30 min, lunch
45, dinner 60, snack 15); tap it to open the meal. Calendar settings → Show on calendar → **Meals at their time**
(on by default; off = meals at the top of the day as before). Day lists and the agenda show the meal's time. Dinner
time still finds busy evenings. On app.daili.app: the same times in Meal settings and the meal panel, the same blocks
in day and week view; clicking a block opens the meal plan on that day. Free for everyone.

Every sub-agent you start MUST use model claude-opus-5-5. Write the report with the file-write tool.

## 1. New article, HIDDEN until the app with the screens is in the stores

Same way as `help/en/lists/steps.md` (report `claude-reports/2026-11-21/002-…`): `since: 99.0.0` in the English file,
NO `related:` link FROM any other article to it, do NOT bump `LIVE_APP_VERSION`, do NOT change `meals-meal-settings`,
`meals-plan-week` or `calendar-views` now (they describe the live app — Req 3).

**`help/en/meals/meal-times.md`, id `meals-meal-times`.** Front matter like `help/en/meals/meal-settings.md`: topic
`meals`, title "Meal times: a time for every meal", a one-line summary, keywords (meal time, breakfast time, lunch
time, dinner time, snack time, several snacks, calendar, time block, just this meal, this and future), `routes:` the
app's real routes (`/meal-plan/settings`, `/meal-plan`, `/calendar/settings` — check them in the app router and
`help/routes-allowlist.json`), `tryIt: /meal-plan/settings`, `since: 99.0.0`, `updated:` the day you run,
`mediaPending:` short (≤ 80 characters, the guard's limit), e.g. "Meal settings with times next to the switches",
`order:` right after `meals-meal-settings` (whole numbers; move later English `order:` lines down by one only if
needed — the live order must not change), `related: meals-meal-settings, meals-plan-week, calendar-views`.

**Check every fact against the code before you write it** (app `lib/l10n/app_en.arb` keys from app 019; web
`src/i18n/en.ts`). Button and screen names in **bold** must match the app EXACTLY. Short sentences, easy words,
numbered steps, "you", ≤ 220 words. Content:

1. One line: every meal can have a time, and the calendar shows meals at their time.
2. Numbered: Home → **Meal plan** → the tune icon (**Meal settings**) → tap the time next to a meal → pick the time.
   This is the usual time for the whole family; past meals keep their time.
3. One meal at another time: tap the meal → **Time** → pick → **Just this meal** or **This and future**. **Use usual
   time** takes it back. Each snack can have its own time.
4. The calendar: in the day, 3-day and week view a meal is a block with a dashed edge at its time; tap it to open the
   meal. Calendar settings → **Meals at their time** turns this off.
5. A Note: dinner time still finds busy evenings. On app.daili.app you set the times in the same places.

## 2. All help languages

All 24 other locales, the same way as the steps article (the app's own words from the ARB at app HEAD, because the
feature is not released yet; `translatedFrom:` the day you run; translations carry no `since`). One Opus 5.5
translator per 3 locales, in the FOREGROUND, started together; wait for all before committing. Spot-check 5 (de, fr,
ja, pl, el) against their ARB yourself.

## 3. The live articles — NOT now, write the release-sync text instead

In the report, a section `## Release sync (when the build is live)` with the exact new sentences for:
- `meals-meal-settings`: step 4 "Dinner time" → the times next to the switches; the busy-evening paragraph stays
  true (dinner time); add `meals-meal-times` to `related`.
- `meals-plan-week`: the time row in the meal sheet and the add sheet; the week rows show the time.
- `calendar-views`: "Show on calendar" now also has **Meals at their time**.
- the new article loses `since: 99.0.0`.
Planning Claude puts this on the list for the release help sync.

## Verify

- FOREGROUND: `npm run check:help` and `npm run build` (paste the "N of M article(s) on pages" line — the new article
  must NOT have a page; `dist/help/en.json` carries it with `since 99.0.0`).

## Commit & push

- `docs(help): meal times (hidden until the release) — 25 languages (#287)`; body names
  `Prompt: claude-prompts/2026-11-24/003-help-meal-times.md`.
- **Push now.** Do NOT run `./deploy.sh` (Ammar deploys).

## Report

- `claude-reports/2026-11-24/003-help-meal-times.md` (file-write tool, `wc -c` > 0): the English article in full, how
  it stays hidden, facts confirmed (file:line), "Facts I could not confirm", the release-sync section, the build
  lines, the push result. In the report, never put the word "status" and the word "blocked" on one line unless you
  really are blocked.
- `## Help impact`: new hidden article `meals-meal-times`.
