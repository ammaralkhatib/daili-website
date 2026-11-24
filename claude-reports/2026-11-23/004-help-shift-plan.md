# 004 — Help: new article "Plan your shifts" (hidden until the release)

**Result:** done · **Commit:** `57496cea` docs(help): article "Plan your shifts" (hidden, since 99.0.0). It has 25 new files, `help/<loc>/calendar/shift-plan.md`, and nothing else. Pushed to origin/main (`c74cc828..57496cea`). This report follows in its own `docs(report)` commit. `./deploy.sh` was NOT run, because Ammar deploys.
**Step 0:** there was nothing to commit. The tree had only the old untracked `static/assets/img/photos/` folder; it is not a planning doc and not mine, so I left it out of every commit, as earlier runs did. No commit was being held, and `main` was equal to `origin/main`.

## 1. How the article stays hidden
- **`since: 99.0.0`** is in the English file. Translations carry no `since`.
- `LIVE_APP_VERSION` stays 1.17.0.
- No other article lists `calendar-shift-plan` in `related` (checked in `dist/help/en.json`).
- `help/*/calendar/views.md` and `add-event.md` are not changed.
- Proof from the build:
  - "115 of 120 article(s) on pages". The page count stays 3759 (the same as before).
  - There is no `dist/help/calendar/shift-plan/` and no `dist/de/help/calendar/shift-plan/`.
  - 0 sitemaps mention it.
  - A grep over all of `dist/` finds it only in the app's `dist/help/<loc>.json` files, with `since 99.0.0`, so the app's `filterHelpForVersion` hides it too. It is in no HTML page and no search index.

## 2. The English article
Front matter:
- `id: calendar-shift-plan`, topic `calendar`, title "Plan your shifts".
- summary: "Save your shifts once, then tap days in a month to plan them. Each day becomes a family event."
- 12 keywords.
- `routes: /calendar/shifts, /calendar/shifts/types`, `tryIt: /calendar/shifts`.
- `since: 99.0.0`, `updated: 2026-11-24`.
- `mediaPending: the Shift plan month with Early and Night days; the My shifts list`.
- `order: 11`, `related: calendar-views, calendar-add-event, calendar-reminders`.

> Save your shifts once, then tap days to plan them. Each day becomes a family event.
>
> 1. In the calendar, tap **View**, then **Shift plan**.
> 2. The first time, tap **+** on a ready shift or **Make your own shift**.
> 3. Pick a shift at the top, then tap days. Tap again to remove, or use **Off**.
> 4. Tap the save button at the bottom. Unsaved days show a dot.
>
> The pencil opens **My shifts**. Tap a shift to change its times, colour or reminder. Changes apply to new days only. A deleted shift's days stay in the calendar, but leave the Shift plan.
>
> Open a day in the calendar to change just that day. Removing a day here deletes its event, even an edited one.
>
> Admins can plan for a child without a login (**Plan for**). **Shift plan** is on app.daili.app too.
>
> > Note: Saving needs internet. If it fails, unsaved days keep their dots.

**Where I went against the prompt (the guard or the code wins):**
- **150 words, not 220.** The guard (`LIMITS.words` in `tools/help-lib.mjs`) allows 150 words for English. My first full draft had 230. I did not touch the tooling: I tightened the text and list the facts I left out below. This is the same as 2026-11-23/003.
- **12 keywords, not 13.** The guard allows 12, so I dropped "tap days". "Dienstplan" is written `dienstplan` because keywords must be lower case.
- **Step 5 "Save … days" became "the save button at the bottom".** The fact-check showed that the button reads "Save {n} days" only when every change fills an empty day. If a change removes or replaces a saved shift, it reads "Save {n} changes" (`shift_plan_screen.dart:489-491`). One quoted label would be wrong half the time. The button sits in the bottom bar (`bottomNavigationBar: _SaveBar`, `:271`).
- **"Deleting a shift keeps its planned days" got a second half.** The events do stay in the calendar. But they are unlinked from the shift, so they **leave the Shift plan month** and can then only be removed in the calendar (api `ShiftTypeController.php:155-157,177`). The text now says "stay in the calendar, but leave the Shift plan".
- **Web line: "Shift plan is on app.daili.app too" instead of "in the View menu too".** On the web, the View menu only exists from 1024 to 1535 px wide (`hidden lg:block 2xl:hidden`). At other widths there is a Shift plan icon in the toolbar instead (`lg:hidden 2xl:grid`, web report 009). "In the View menu" would be false on most screens.
- **The offline sentence keeps no quote.** The red box says "No internet. Nothing was saved. Try again." (`shiftSaveError`). Saving goes one request at a time, so after a part-failure "Nothing was saved" can itself be wrong. Instead I wrote what is always true: unsaved days keep their dots. → owner item below.
- **`order: 11`.** The last calendar article with an order is `calendar-import` (10). `calendar-phone-calendars` has no `order`, so it sorts last anyway. The new article now sits between them: … calendar-import, calendar-shift-plan, calendar-phone-calendars. No sibling changed.
- **Routes:** nothing was added to `help/routes-allowlist.json`. Before my change, `check:help` was red with exactly the two errors "app route "/calendar/shifts" / "/calendar/shifts/types" has no article". The article's `routes:` fixes both, and the check is green now ("98 app routes checked").

## 3. Facts confirmed against the code
I read the app reports 018 + 019, the web report 009, the English ARB (`shift…`, `calendarView…`) and `en.ts` (`shifts:`). Then one fresh Opus 5.5 fact-checker checked every sentence against the app, api and web code, BEFORE translating. It found 3 misleading sentences, all fixed above.
- **View** = `calendarViewLabel` (bottom bar, `calendar_screen.dart:1759`). The **Shift plan** row (`shiftPlanTitle`) is the last row of the "Choose view" sheet (`calendar_view_switcher_sheet.dart:143-162`).
- First time: three ready shifts (Early / Late / Night shift), each with a round **+** that saves it at once. The month then opens with that shift picked (`shifts_first_time.dart:219-230`, `shift_plan_screen.dart:210-213`). **Make your own shift** (`shiftMakeOwn`) opens an empty "New shift" form.
- The chips sit at the top. Tapping a day with the same shift removes it, and **Off** (`shiftOffChip`) removes a planned day's shift. Another shift replaces it, one shift per day (`shift_plan_draft.dart:60-80`). The green dot marks unsaved days (`shift_month_grid.dart:341-355`).
- The pencil (tooltip "Edit shifts") opens **My shifts** (`shiftMyShiftsTitle`). A shift has Name, Short label, Start, End, Colour and Reminder (Off, 15 min, 30 min, 1 h, 2 h) (`shift_type_sheet.dart:284-390`).
- "Changes apply to new days only" = `shiftEditNote`. The server never repaints or renames old events; the colour is copied once, when a day is made (`EventController.php:402-413`).
- Each day is its own event, shared (not private), in the shift's colour. The extra dates (`also_on_dates`) become separate single events, not a series (`EventController.php:456-471`), so opening one changes only that day.
- Removing a day in the Shift plan deletes by event id (`shift_plan_controller.dart:247-253`). Editing an event does not clear its shift link, so even an edited day is deleted.
- **Plan for** (`shiftPlanFor`) appears only for an admin with at least one child without a login (`shift_person_provider.dart:30-62`). The server checks the same (`ShiftPlanner.php:48-55`).
- Saving needs internet. After a failure the days that did not get through keep their dots (`shift_plan_controller.dart:175-229`).
- The web has the same Shift plan at `/calendar/shifts` (web report 009).
- No names of real people anywhere; the article has no example names at all.

## 4. Facts I could not confirm
- **Whether the web part is live.** Web report 009 says the deploy waits for the app release (D6). The article is hidden until then, so this only matters at the release. I did not check the live web app.
- Everything else was confirmed in the code (see 3). Both app reports and the web report were there.

**True, but left out because of the 150-word cap:**
- The three ready shifts by name (Early shift, Late shift, Night shift).
- A night shift that ends after midnight shows **+1 day** in My shifts.
- Up to 20 shifts per person ("You can save up to 20 shifts.").
- The short label (up to 4 letters) is what the month shows. The form also has the name, and the reminder is "before every day with this shift".
- Each day shows in the shift's colour in the calendar.
- "One shift per day": a different shift replaces the old one.
- **Undo all** next to the save button. Leaving with unsaved days asks "Leave without saving?" (Leave / Keep planning). Switching the "Plan for" person asks too.
- The exact red-box text "No internet. Nothing was saved. Try again." (see the owner item).
- The month arrows go 12 months back and 12 months ahead.
- On a tablet, the View button shows the current view's name (e.g. "Month") or only an icon; its tooltip is still "View". `calendar-views` has the same simplification today.
- On the web you click instead of tap, and below 1024 / from 1536 px it is the toolbar's shift icon.

## 5. All help languages
- **Kit:** `/tmp/helpshift/` with `BRIEF.md`, `labels.mjs` (the app's own words from the ARB at app HEAD, because the feature is not released yet), and `check-loc.mjs`. `check-loc.mjs` runs the guard for one locale and checks `translatedFrom: 2026-11-24`, that app.daili.app is kept, that the bold set is exactly the English set with ARB values plus "+", that no space is missing after a full stop, and that only this file changed.
- **Translators:** eight claude-opus-5-5 translators, 3 locales each, ran in the foreground and were started together. I waited for all eight before committing. **All 24 locales were clean on the first check.** On disk, all 25 files exist, and the commit has exactly those 25 files.
- German uses **Dienstplan** for the feature and **Schichten** for the types, as the ARB already does.

**English fix after translating:** two translators said "Changed days show a dot" should say *unsaved* days. The dot does mark unsaved days, and the note already says so. I changed only the English to "Unsaved days show a dot." (same word count) and did not run a second round. About half the translations say "days you changed" (de, fr, el …) and the rest say "days not saved yet" (ja, ko, zh, pl …). Both are true, because the dot disappears on save.

**My spot-check of 5 translations against their ARB:** I read de, fr, pl, ja and el in full. The bold labels are the ARB values:
- de: **Ansicht** / **Dienstplan** / **Eigene Schicht anlegen** / **Frei** / **Meine Schichten** / **Planen für**
- fr: **Affichage** / **Planning des postes** / **Créer ton propre poste** / **Repos** / **Mes postes** / **Planifier pour**
- pl: **Widok** / **Grafik zmian** / **Utwórz własną zmianę** / **Wolne** / **Moje zmiany** / **Planuj dla**
- ja: **表示** / **シフト表** / **自分でシフトを作る** / **休み** / **自分のシフト** / **対象**
- el: **Προβολή** / **Πρόγραμμα βαρδιών** / **Φτιάξε δική σου βάρδια** / **Ρεπό** / **Οι βάρδιές μου** / **Σχεδιασμός για**

The meaning matches the English in all five. Polish follows the app and uses "poprawki" for "changes", because "zmiana" is also "shift". French says "agenda", like its neighbour articles. el, uk and bg have no "family planner" wording (grep).

Translator notes, none of them a problem:
- fi's "Plan for" label is "Kenen vuorot" ("Whose shifts"), so the sentence keeps it in brackets.
- sk, ro, uk and bg inflect the plain (not bold) feature name.
- el, bg and ko use the neighbour articles' word for "tap".

## Verify
All in the foreground:
- `npm run check:help` → `help OK · 120 article(s) · 25 locale(s) · 98 app routes checked`. The baseline before my change was red with only the two "app route has no article" errors for the new shift routes.
- `npm run build` → exit 0:
  - `help: 115 of 120 article(s) on pages (live 1.17.0) · 14 topic(s) · en.json 120 articles, 16 tips, 6 checklist · PUBLIC`
  - `build OK · 3759 pages · 3728 in hreflang clusters`
  - `detector OK · 32 cases · 28 locale(s) built`
  - `help search OK · 38 cases · 2 built page(s)`
- No `CHANGELOG.md` line: this repo has none, and nobody can see the article before the release.

## Help impact
New hidden article `calendar-shift-plan` ("Plan your shifts", `since: 99.0.0`), for the new screens `/calendar/shifts` and `/calendar/shifts/types`.

## Open items for the owner
- **Release help sync** (the prompt that cuts the release with the Shift plan):
  1. In `help/en/calendar/shift-plan.md`, change `since: 99.0.0` to the real release version.
  2. Add one line and a `related` link to `calendar-shift-plan` in `calendar-views`: English `related:`, plus the body line in all 25 locales. `views.md` is near the word cap, so the line needs a cut elsewhere.
  3. Shoot the pictures: replace `mediaPending:` with `media:` (the month with Early and Night days; the My shifts list) and add the image lines in all 25 languages.
  4. Optional: if there is room, add the left-out facts that matter most (Undo all, up to 20 shifts, +1 day for night shifts).
- **App text to look at (not mine to change):** `shiftSaveError` says "No internet. Nothing was saved. Try again." After a part-failure, some days ARE saved (app report 019, fact-check item 14). A future app prompt could say "Not everything was saved".
- **Deploy:** Ammar runs `./deploy.sh` when he wants; the article stays hidden anyway. Before the release, make sure the web Shift plan (web report 009) is deployed too, so the last line of the article is true.

DONE
