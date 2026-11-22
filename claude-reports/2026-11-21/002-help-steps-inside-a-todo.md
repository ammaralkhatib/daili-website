# 002 — Help: "Steps inside a to-do" (hidden until the release)

**Result:** done · **Commit:** `8f80fac6` docs(help): steps inside a to-do (hidden until the release) — 25 new files `help/<loc>/lists/steps.md` + 7 one-line `order:` changes in English lists articles. Pushed to origin/main (`157fdb5a..8f80fac6`). This report follows in its own `docs(report)` commit. `./deploy.sh` was NOT run — Ammar deploys.
**Step 0:** nothing to commit. The tree had only the old untracked `static/assets/img/photos/` folder (another lane, left alone as in earlier runs). No commit was being held.

## 1. How the article stays hidden
Same way as `meals-import-file`:
- **`since: 99.0.0`** in the English file. Translations carry no `since`.
- `LIVE_APP_VERSION` stays 1.17.0 (not changed).
- No other article lists `lists-steps` in `related` (checked with grep). No tip, no checklist row.
- `help/*/lists/todos.md` is not changed.
- The build proves it: "115 of 117 article(s) on pages", the page count stayed 3759, there is no `dist/help/lists/steps/`, and the sitemap does not have it. `dist/help/en.json` carries it with `since 99.0.0`, so the app's `filterHelpForVersion` hides it too.

## 2. The English article (in full, for review)
Front matter: `id: lists-steps`, topic `lists`, title "Steps inside a to-do", summary "Break a big to-do into small steps and tick them one by one.", the 10 keywords from the prompt, `routes: /lists/:id`, `tryIt: /lists/todos`, `since: 99.0.0`, `updated: 2026-11-22`, `mediaPending: the to-do sheet's Steps block under Name; a row with 2/5 and the round arrow`, `order: 5`, `related: lists-todos, lists-repeating, lists-assign`.

> Break a big to-do, like "Pack for the trip", into small steps. Tick them one by one.
>
> 1. Open a to-do list and tap a to-do.
> 2. Under **Name**, tap **Add a step**.
> 3. Type a step, like "Passport", and press Enter. A new line opens for the next one.
> 4. Steps save right away. In a new task (the up arrow, **Add with details**), they save with **Save**.
>
> In the list, the row shows how far you are, like 2/5. Tap the round arrow to see and tick the steps there.
>
> > Note: Ticking the last step ticks the to-do. Ticking the to-do ticks all its steps. A repeating to-do starts each new round with all steps open.
>
> > Note: Only to-do lists have steps, up to 50 per to-do. In the app, ticking works without internet, except on repeating to-dos. Other step changes need internet.
>
> On app.daili.app, you can add steps to to-dos you already have.

**Where I went against the prompt (the guard or the code wins):**
- **The move question is left out.** The prompt's point 5 said "Moving a to-do to a shopping list asks you: add the steps as items, or remove them." That is not true today. The phone (`list_detail_screen.dart:7075-7086`, `_moveTargets`) and the web (web report 002) only offer lists of the SAME type as move targets. So no user can move a to-do to a shopping list, and the question never shows. App report 003 and web report 002 both say so. A help text must not describe a screen nobody can reach. If the to-do → shopping move is opened later, the release sync adds one sentence.
- **`mediaPending` is shorter than the prompt's text.** The guard allows 80 characters; the prompt's text had 96.
- **`order: 5`, and the later lists articles move down by one.** Orders are whole numbers, and ties sort by title. `order: 4` would put "Steps…" BEFORE "To-do lists" (S comes before T), and `order: 5` alone would put it after "Give a to-do…" (`lists-assign`). So I changed only the `order:` line of 7 English articles: assign 5→6, due-reminders 6→7, repeating 7→8, all-mine 8→9, edit-list 9→10, archive-templates 10→11, stock 11→12. Their order on the live site is exactly the same as before. Translations have no `order`. `dist/help/en.json` now reads: … lists-todos, lists-steps, lists-assign, …
- **Offline sentence made more exact** (fact-check, below): "Ticking works without internet; adding steps needs internet" became "In the app, ticking works without internet, except on repeating to-dos. Other step changes need internet."
- **Web line made more exact:** "Steps work on app.daili.app too" became "On app.daili.app, you can add steps to to-dos you already have". The web has no new-task form, so steps there go only on existing to-dos.
- **150 words:** the body is at the cap. To fit, I left out a few true facts (list at the end).

## 3. Facts confirmed against the code
All from the app at HEAD (`../familyplanner-app`, English ARB + code), the app reports 002/003/004, the web reports 001/002 and the api reports 001/002 of 2026-11-21. I read them myself, then one fresh Opus 5.5 agent checked every sentence against the code BEFORE translating. It found no false sentence, and three that needed fixing (all fixed above).
- **Name** = `listDetailItemNameLabel` (`app_en.arb:944`, `list_detail_screen.dart:7241`). The Steps block sits right under it (`:7253`), with the heading **Steps** (`todoStepsTitle`).
- **Add a step** = `todoStepsAdd`. Enter saves the step and opens the next empty line (`todo_steps_block.dart:280-292`; the same on the web).
- "Steps save right away" = `todoStepsSaveNow`. A new task's steps save with the task (`todoStepsSaveWithTask`) when you tap **Save** (`listDetailItemEditSave`).
- **Add with details** (`listAddWithDetails`) is the tooltip / screen-reader name of the up-arrow button in the add bar (`list_detail_widgets.dart`). It opens the "New task" sheet, which has the Steps block.
- The row shows a count like ☑ 2/5 (`todo_row_steps.dart:54-57`). The round arrow (screen-reader names "Show steps" / "Hide steps") opens the steps in the row, and they can be ticked there (app report 004, web report 001).
- The last open step ticks the to-do. Ticking the to-do ticks all open steps (api `ShoppingItemUpdater.php:300-313`; plan Decisions 2 + 3).
- A repeating to-do's real new round un-ticks all steps (api report 002; Decision 5).
- Steps only on to-do lists (api refuses with `STEPS_ONLY_ON_TODOS`). Limit 50 per to-do (`todo_steps_block.dart:22`, api `ShoppingItemStep.php:32`, ARB `todoStepsLimit`).
- Offline: a step tick waits in the app's offline queue. On a repeating to-do it says "Not available offline" (`todo_steps_block.dart:392`). Add, rename, remove and sort are online only (the ✕ and ⋮⋮ go away offline, `canEdit`).
- The web has the count, the arrow, ticking in the row, and a Steps block in the side panel (add, rename, remove, sort). It has no new-task form and no offline queue.
- Examples are made up ("Pack for the trip", "Passport"); no real names or lists.

## 4. Facts I could not confirm
- **Whether the web part is live.** Web report 002 says "Not deployed — Ammar runs `./deploy.sh` now". The article is hidden until the app release, so this only matters then. I did not check the live web app.

**True, but left out for the 150-word cap:**
- A step name can be up to 200 characters.
- The block can be closed to one line ("Steps · 2 of 5"); that choice is remembered on the phone for every to-do.
- Rename a step by tapping its name; sort with ⋮⋮; remove with ✕.
- Ticking the last step shows "All steps done. To-do ticked." with Undo (no Undo on a repeating to-do).
- Un-ticking a step of a done to-do opens the to-do again. Un-ticking the to-do leaves its steps as they are.
- A second tick of a repeating to-do on the same day does not reset its steps (rare).
- Moving a to-do to another to-do list keeps its steps. "Make a copy" of a list copies the steps, all un-ticked.
- The Home "To-dos" popup and "My tasks" show the count too.
- A new task's steps can't be ticked before **Save**, and saving a new task with steps needs internet.

## 5. All help languages
Eight Opus 5.5 translators (3 locales each, in the foreground, started together) wrote all 24 locales from `/tmp/helpsteps/BRIEF.md`. Each used `labels.mjs` (the app's own words from the ARB at app HEAD, because the feature is not released yet) and `check-loc.mjs` (the guard for one locale + `translatedFrom: 2026-11-22` + the 4 bold labels exactly as in the ARB + "only this file changed"). I waited for all eight before committing. **All 24 were clean on the first check.** I checked on disk: 25 files exist, and the commit has exactly the 25 articles + the 7 order lines.

**My spot-check of 5 translations against their ARB:** de, fr, ja, pl, el — read in full. The bold labels are the ARB values (e.g. de **Schritt hinzufügen** / **Mit Details hinzufügen** / **Speichern**; ja **ステップを追加** / **詳細を入れて追加** / **保存**). The words for "steps", "to-do" and "new task" match `todoStepsTitle`, `todoStepsLimit` and `listDetailNewTaskTitle` (fr étapes / tâche / Nouvelle tâche; ja ステップ / やること / 新しいタスク; pl Kroki / zadanie; el Βήματα / εργασία). The made-up examples are translated naturally. No "family planner" wording in el/uk/bg.

**English issue all 8 translators raised (not a problem in this article):** `lists-steps` calls the **Add with details** button "the up arrow", but `lists-todos` (`help/en/lists/todos.md:27` and its picture alt) and `lists-shopping` (`shopping.md:28`) still say "the tune button". I checked: the up arrow came with app commit `243a6bc0`, and **no release tag contains it yet** (`git tag --contains` is empty; live is 1.17.0). So today `lists-todos` is right for the live app, and `lists-steps` is right for the release it ships with. → release sync item below.

## Verify
All in the foreground:
- `npm run check:help` → `help OK · 117 article(s) · 25 locale(s) · 92 app routes checked`.
- `npm run build` → exit 0:
  - `help: 115 of 117 article(s) on pages (live 1.17.0) · 14 topic(s) · en.json 117 articles, 16 tips, 6 checklist · PUBLIC`
  - `build OK · 3759 pages · 3728 in hreflang clusters`
  - `detector OK · 32 cases · 28 locale(s) built`
  - `help search OK · 38 cases · 2 built page(s)`
- The baseline before my change was also green (`check:help` 116 articles).
- No `CHANGELOG.md` line: this repo has none, and nobody can see the article before the release.

## Help impact
lists-steps: new article (hidden with `since: 99.0.0` until the next app release).

## Open items for the owner
- **Release help sync** (the prompt that cuts the release with steps):
  1. In `help/en/lists/steps.md`, set `since: 99.0.0` → the real release version.
  2. Add one line + a `related` link to `lists-steps` in `lists-todos` (English `related:`; the body line in all 25 locales). `todos.md` is at about 150 words, so the line needs a cut elsewhere.
  3. Fix "the tune button" → the up arrow in `lists-todos` (body + `lists-add-details-button` picture alt) and `lists-shopping`, all locales, and re-shoot that picture. The up arrow (`243a6bc0`) ships in the same release.
  4. Shoot the picture: replace `mediaPending:` with `media: lists-steps` and add the image line in all 25 languages.
  5. If the to-do → shopping-list move is opened by then (app report 003, Option A; web report 002), add one sentence about the move question.
- **Deploy:** Ammar runs `./deploy.sh` when he wants; the article stays hidden anyway. The 7 order changes do not change anything on the live site.
- **Before the release:** make sure the web deploy of steps (web report 002) has happened, so the last line is true.

DONE
