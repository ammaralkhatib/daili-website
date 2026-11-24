# 003 — Help: "Meal times" (hidden until the release), 25 languages

**Result:** done · **Commit:** `0535fe01` docs(help): meal times (hidden until the release) — 25 languages (#287). That is 25 new files `help/<loc>/meals/meal-times.md` plus 2 one-line `order:` changes in English meals articles. Pushed to origin/main (`b841dde9..0535fe01`). This report goes in its own `docs(report)` commit. `./deploy.sh` was NOT run, because Ammar deploys.
**Step 0:** nothing to commit. The prompt was already in `dc157596`. The tree had only the old untracked `static/assets/img/photos/` folder (another lane), which I left alone as in earlier runs. No commit was being held, and `main` was equal to `origin/main`.

I read all five earlier reports first: api 018, app 019/020/021 and web 008. All five exist.

## 1. How the article stays hidden
I used the same method as `lists-steps`:
- **`since: 99.0.0`** is in the English file. Translations carry no `since`.
- `LIVE_APP_VERSION` stays 1.17.0 (not changed).
- No other article lists `meals-meal-times` in `related` (checked with grep: no hits outside its own 25 files). There is no tip and no checklist row.
- `meals-meal-settings`, `meals-plan-week` and `calendar-views` are not changed.
- The build proves it:
  - The build line reads "115 of 123 article(s) on pages".
  - The page count stayed 3759.
  - There is no `dist/help/meals/meal-times/` (but `dist/help/meals/meal-settings/` exists).
  - The sitemap has 0 hits.
  - `dist/help/en.json` carries it with `since 99.0.0` and routes `/meal-plan/settings, /meal-plan, /calendar/settings`, so the app hides it too.
- **Order:** `order: 13`, right after `meals-meal-settings` (12). Ties sort by title, and "Leftovers…" would come before "Meal times…". So I moved `leftovers-and-eating-out` 13→14 and `cook-mode` 14→15 (only their `order:` line). The live order is the same as before. `en.json` now reads: … meals-copy-week, meals-meal-settings, meals-meal-times, meals-leftovers-and-eating-out, meals-cook-mode.

## 2. The English article (in full)
Front matter:
- `id: meals-meal-times`, topic `meals`
- title "Meal times: a time for every meal"
- summary "Give each meal a usual time, move one meal to another time, and see your meals at their time in the calendar."
- the 10 keywords from the prompt
- `routes: /meal-plan/settings, /meal-plan, /calendar/settings`, `tryIt: /meal-plan/settings`
- `since: 99.0.0`, `updated: 2026-11-25`
- `mediaPending: Meal settings with times next to the switches` (46 characters)
- `order: 13`, `related: meals-meal-settings, meals-plan-week, calendar-views`

> Every meal can have a time, and the calendar shows meals at their time.
>
> 1. On Home, tap **Meal plan**, then the tune icon (**Meal settings**).
> 2. Tap the time next to a meal, like 18:30.
> 3. Pick a time and tap **Done**.
>
> It's the usual time for the whole family. Past meals keep their time.
>
> One meal at another time: tap it, then **Time**. Pick a time, choose **Just this meal** or **This and future**, then **Done**. **Use usual time** takes it back. Each snack can have its own time.
>
> In the **Day**, **3 days** and **Week** view, a meal is a block with a dashed edge at its time. Tap it to open the meal plan. To turn this off: the gear → **Show on calendar** → **Meals at their time**.
>
> > Note: daili still uses the dinner time to find busy evenings.
>
> On app.daili.app, you set the times in the same places.

**Where I went against the prompt (the guard or the code wins):**
- **150 words, not 220.** The help guard's limit is 150 (`tools/help-lib.mjs:42`). The first draft had 169 words, and I cut it to exactly 150. Left-out facts are listed in section 4.
- **"Tap it to open the meal plan", not "open the meal".** The block's tap calls `_openMeal` = `context.pushNamed(RouteNames.mealPlan)` (`calendar_timeline_columns.dart:312`). That opens the meal plan, not the meal's sheet. App report 021 says the same ("Tapping the block opens the meal plan, as the old chip did").
- **el, uk, bg: the Home tile word.** The translators used `mealPlanTitle`, which my brief named. On Home, the tile's label is `dashboardTileMealPlan` (`home_dashboard_view.dart:503`). In 22 languages both keys have the same text. In el, uk and bg they differ (el **Γεύματα** vs "Πρόγραμμα γευμάτων", uk/bg **Меню** vs "Меню на тиждень"/"Меню за седмицата"). The el translator noticed this. I changed step 1 in those three files to the Home tile word, as their live `meal-settings.md` already does, and re-ran the check: all three are clean.

## 3. Facts confirmed (app HEAD `ddaf648b`, web HEAD, api report 018)
- **Meal plan** = `dashboardTileMealPlan` on the Home tile (`home_dashboard_view.dart:503`; en "Meal plan", same as `mealPlanTitle`, `app_en.arb:2567`).
- Tune icon with the tooltip **Meal settings** (`meal_plan_week_screen.dart:969-970`, `:1212-1213`; `mealsSettingsTitle`, `app_en.arb:8960`).
- The time pill sits next to each meal that is switched on. Tapping it opens the time wheel, and the new time saves at once as the family's usual time from today (app 020 §2, `meal_settings_screen.dart:142`, `:212`). The defaults are 07:30 / 12:30 / 18:30 / 15:30 (api 018 §2, app 020 §1).
- **Done** = `calendarPeopleColumnsDone` "Done", the button of the time sheet (`daili_date_time_sheet.dart:246`, `app_en.arb:471`).
- The time is for the whole family. Past meals keep their time: the server stamps the old time on that slot's meals from before today (api 018 §4, `MealTimes::stampPast`). The app has the line `mealTimePastKeep` "Past meals keep their time." (`app_en.arb:11642`).
- **Time** = `mealTimeRowTitle`, the first row of the meal sheet (`meal_plan_entry_sheet.dart:1581`, `app_en.arb:11620`).
- **Just this meal** / **This and future** = `mealTimeJustThis` / `mealTimeThisAndFuture` (`app_en.arb:11628`, `:11632`). They sit under the wheel, before Done (`meal_plan_entry_sheet.dart:338`). They are offered for today and later; a meal before today gets the wheel only (`:323`).
- **Use usual time** = `mealTimeUseUsual` "Use usual time ({time})" (`app_en.arb:11626`, `meal_plan_entry_sheet.dart:1625`). It shows only on a meal with its own time and sends `meal_time: null` (app 020 §4).
- Each snack can have its own time. Several snacks on one day are allowed, and the add sheet only warns (api 018 §5 test with 3 snacks, app 020 §5).
- **Day**, **3 days**, **Week** = `calendarViewDay` / `calendarViewThreeDay` / `calendarViewWeek` (`app_en.arb:435-437`). The dashed blocks show in these views (app 021 §3, `CalendarMealBlock` + `DashedRRectPainter`).
- **Show on calendar** = `calendarSettingsShowSection` (`app_en.arb:276`). **Meals at their time** = `calendarSettingsMealsAtTime` (`app_en.arb:11652`). It is on by default (api 018 §9, app 021 §1). Off puts meals back at the top of the day (`calendarSettingsMealsAtTimeHint`). The live `calendar-views` already says "The gear → **Show on calendar**".
- Busy evenings still use the dinner time (`mealsSettingsTimesHelp`, `app_en.arb:11610`). App 020 also says every `dinnerTime` reader is unchanged.
- Web: the same times in Meal settings and the meal panel (`daili-web/src/i18n/en.ts:2226`, `:2363-2369`), and the switch `showMealsAtTime` (`:5374`). In day and week view, a click on a block opens the meal plan on that day (web 008 §5).
- The routes `/meal-plan/settings`, `/meal-plan` and `/calendar/settings` are in `route_names.dart:214`, `:243`, `:245`. The route check passed ("99 app routes checked").

## 4. Facts I could not confirm
- **Whether the api and web parts are live.** Web report 008 says "pushed, NOT deployed", and the web deploy has to wait until api 018 (with its migration) is live. The article is hidden until the app release, so this only matters then. I did not check the live sites.
- Not seen on a device or in a browser; I only read the code and the reports.

**True, but left out because of the 150-word cap:**
- A meal before today gets only the wheel, with no "Just this meal / This and future" choice.
- The add sheet has a **Time** row under the meal chips, and warns (without blocking) when the day already has a snack.
- The week plan shows each meal's time first, with an own time in honey and a small dot, and it sorts a day's meals by time.
- Day lists, the agenda/list view, the tablet day panel and the Home week popup show each meal's time. Meals sit among the events by time, with the switch on or off.
- **Meals at their time** shows only while **Meals** is on.
- Block lengths: breakfast 30, lunch 45, dinner 60, snack 15 minutes; they are cut at midnight. Blocks can't be dragged and never count as busy.
- A meal and an event at the same time stand side by side.
- Web: Meal settings is in the meal plan's **⋯** menu. The web calendar has blocks in day and week view (no 3-day view there). A click opens the meal plan on that day.
- "Free for everyone": there is no plan gate, so the article needs no plan line.

## 5. All help languages
- Eight Opus 5.5 translators (3 locales each) worked in the foreground and were started together. All wrote from `/tmp/helpmealtimes/BRIEF.md`.
- Each used `labels.mjs` (the app's own words from the ARB at app HEAD, because the feature is not released yet). Each also used `check-loc.mjs`, which runs the guard for one locale and checks:
  - `translatedFrom: 2026-11-25`
  - the 13 bold labels exactly as in the ARB, in English order
  - app.daili.app and 18:30 kept
  - that only their own file changed
- I waited for all eight before committing. All 24 were clean on the first check. After my el/uk/bg fix, those three were clean again. I checked on disk: 25 files exist, and the commit has exactly the 25 articles plus the 2 order lines.
- 18:30 is kept as written in every language (da, fi and fr would usually write 18.30 / 18h30). This matches the brief; the app shows the phone's own time format.

**My spot-check against the ARB: de, fr, ja, pl, el (read in full)**
- The bold labels are the ARB values: de **Essensplan** / **Essenseinstellungen** / **Fertig** / **Uhrzeit** / **Nur diese Mahlzeit** / **Diese und künftige** / **Übliche Zeit nehmen** / **Im Kalender anzeigen** / **Mahlzeiten zu ihrer Uhrzeit**; ja **献立** / **食事の設定** / **完了** / **この食事だけ** / **この食事以降** / **いつもの時間にする**; el **Γεύματα** (Home tile) / **Ρυθμίσεις γευμάτων** / **Τέλος** / **Συνηθισμένη ώρα**.
- The words for "busy evenings" match each locale's live `meal-settings.md` (pl "pracowite wieczory", fr "soirées chargées", el "γεμάτα βράδια"), and the tone (du/tu) matches too.
- There is no "family planner" wording in el, uk or bg.

**English points the translators raised (none is wrong, kept as is):**
- "tap it, then **Time**" and "**Use usual time** takes it back" are short. The translations say what is meant: tap that meal; it goes back to the usual time.
- "Use usual time" shows only on a meal with its own time; that detail was left out for the cap.
- Step 1 has no "at the top" (cut for the cap).
- "Each snack can have its own time" does not say outright that a day can have several snacks. The keyword "several snacks" covers search.

## Release sync (when the build is live)
All three live articles are near the 150-word cap (my count: plan-week 149, meal-settings 145, calendar-views 149). Each change below comes with a cut. Check the count with `parseArticle` before translating.

1. **`meals-meal-settings`** (`help/en/meals/meal-settings.md`)
   - Step 4 `**Dinner time**: when you usually eat.` → `4. Next to each meal you plan, tap its time to change it. Past meals keep their time.`
   - Cut to make room: `These settings are for the whole family, and everyone in it can change them.` → `Everyone in the family can change these settings.`
   - The busy-evening paragraph stays as it is (it is about dinner time and is still true).
   - Title: `Meal settings: which meals, servings and dinner time` → `Meal settings: which meals, servings and times`. Summary: `… and when you have dinner.` → `… and when you eat each meal.`
   - Keywords: add `meal time`.
   - `related:` add `meals-meal-times`.
   - Re-shoot the picture (the Dinner time row is gone; the pills are new) and its alt text: `Meal settings with Breakfast, Lunch, Dinner and Snack switches, each with its time, and usual servings. The meal switches are circled.`
2. **`meals-plan-week`** (`help/en/meals/plan-week.md`)
   - Step 4: `Tap a planned meal to set **Servings**, …` → `Tap a planned meal to set **Time**, **Servings**, …`
   - New sentence after the "Who's eating" paragraph: `Each meal shows its time first, and a day's meals sort by time. The add sheet has a **Time** row too.`
   - Cut to make room (about 15 words), e.g. drop `**Meals** opens on **Plan**, next to **Recipes**.` and `A link in the note becomes a button.`, or move that detail elsewhere. That is Planning Claude's call.
   - Add `meals-meal-times` to `related` (it has 3 today, so there is room).
3. **`calendar-views`** (`help/en/calendar/views.md`)
   - `The gear → **Show on calendar** adds birthdays, meals, to-dos and more, and **Week numbers**.` → `The gear → **Show on calendar** adds birthdays, meals, to-dos and more, **Week numbers**, and **Meals at their time**: meals as blocks at their time.`
   - That is about 8 more words, so cut about 7 elsewhere (e.g. shorten the People sentence or the stripes line).
   - Add `meals-meal-times` to `related` (that makes 6; the guard has no limit on `related`).
4. **`meals-meal-times`**: delete `since: 99.0.0` → the real release version. Shoot the picture: replace `mediaPending:` with `media: meals-meal-times` and add the image line in all 25 languages.
5. All three live articles: bump `updated:`, and the translations follow (same blocks, the ARB words at the release tag).

## Verify
All in the foreground:
- `npm run check:help` → `help OK · 123 article(s) · locale(s) en, de, … id · 99 app routes checked`
- `npm run build` → exit 0:
  - `help: 115 of 123 article(s) on pages (live 1.17.0) · 14 topic(s) · en.json 123 articles, 16 tips, 6 checklist · PUBLIC`
  - `build OK · 3759 pages · 3728 in hreflang clusters`
  - `detector OK · 32 cases · 28 locale(s) built`
  - `help search OK · 38 cases · 2 built page(s)`
  - `test-check-help OK · 99 cases`
- `meals-meal-times` has no page, and `dist/help/en.json` has it with `since 99.0.0`.
- No `CHANGELOG.md` line: this repo has none, and nobody can see the article before the release.

## Commit & push
- `0535fe01` docs(help): meal times (hidden until the release) — 25 languages (#287) → pushed, `b841dde9..0535fe01`.
- This report: its own `docs(report): 003-help-meal-times` commit, pushed after it.
- `./deploy.sh` not run (Ammar deploys; the article stays hidden anyway, and the 2 order changes do not change the live site).

## Help impact
new hidden article `meals-meal-times` (hidden with `since: 99.0.0` until the app release with meal times).

## Open items for the owner
- Release help sync: the section above (Planning Claude puts it on the list).
- Before the release: make sure api 018 and web 008 are deployed, so the web line in the article is true.

DONE
