# 001 — Help: "Import recipes from another app" (hidden until the release)

**Status:** done · **Commit:** `d168c3d0` docs(help): import recipes from another app (hidden until the release) — 25 new files `help/<loc>/meals/import-file.md`. Pushed to origin/main (`9d23df01..d168c3d0`). This report follows in its own `docs(report)` commit. `./deploy.sh` was NOT run — Ammar deploys.
**Step 0:** `9d23df01` docs(plan): sync planning docs (this prompt file), pushed. `static/assets/img/photos/` was left untouched (another lane, as in earlier runs).

## 1. How the article stays hidden
Same way as the tablet article before 1.17.0:
- **`since: 99.0.0`** in the English file. Translations carry no `since`.
- `LIVE_APP_VERSION` stays 1.17.0 (not changed).
- No other article lists `meals-import-file` in `related`. It has no tip and no checklist row.
- `help/*/meals/add-recipe.md` is not changed.
- The app hides it too: `filterHelpForVersion` drops any article newer than the app (report `2026-11-15/002` §1).

**The ONE line the release prompt must change:** in `help/en/meals/import-file.md`, `since: 99.0.0` → `since: <release version>`. When the picture exists, also replace `mediaPending:` with `media: meals-import-file` and add the image line in all 25 languages. The app's `tool/help-shots.json` already has the `meals-import-file` line.

**The line `meals-add-recipe` needs at release:** add `meals-import-file` to its `related:` line (English only, because translations cannot carry `related`):
`related: meals-recipe-screen, meals-find, meals-import-link, meals-youtube, meals-instagram, meals-paste, meals-import-file, meals-plan-week, meals-cook-mode`
The body is at 147 of 150 words. A sentence there (e.g. "Moving from Paprika? **From another app** in the same **+** menu brings in a whole file.") would need a cut somewhere else, plus 24 translations. My recommendation: the `related` link only.

## 2. The English article (in full, for review)
Front matter: `id: meals-import-file`, topic `meals`, title "Import recipes from another app", summary "Moving from Paprika? Bring your recipes into daili in one go, with their photos.", the 11 keywords from the prompt, `routes: /recipes`, `tryIt: /recipes`, `since: 99.0.0`, `updated: 2026-11-19`, `mediaPending: the Recipes + menu with "From another app" circled`, `order: 6`, `related: meals-add-recipe, meals-paste, meals-import-link`.

> Moving from Paprika? Bring your recipes over in one go, with photos.
>
> In Paprika, export in the Paprika format (a .paprikarecipes file) and save it on your device, for example in Files or Downloads. Menu names can differ by version.
>
> 1. On Home, tap **Recipes**, then **+**, then **From another app**, and pick the file.
> 2. Untick what you don't want. Recipes already in daili start unticked.
> 3. Tap **Import 12 recipes** (your count). Keep daili open until it's done.
> 4. Tap **Go to recipes**.
>
> Title, ingredients, steps, servings, times, source link, notes and photo come along. Categories become tags.
>
> > Note: A family can have 50 tags; extra categories are left out. Long recipes are shortened (100 ingredients, 50 steps). The summary tells you.
>
> > Note: The file is read on your device; only imported recipes are saved. Importing again skips recipes with the same name and link.
>
> Paprika files only for now, and not on app.daili.app.

**Where I went against the prompt (the guard wins; I did not widen it):**
- **One numbered list only.** The guard allows one list per article. So "In Paprika" is a short paragraph, and only "In Daili" is the numbered list.
- **150 words maximum.** The body is exactly 150 words, so every point is short.
- **`order: 6`, not 5.** The orders are whole numbers, and ties are sorted by title. With 5 the article would sort BEFORE "Paste a recipe as text". With 6 it comes after paste and after "Find recipes online" (also 6).
- **"Import N recipes"** is written as **Import 12 recipes** (your count). A bold label must be real app words. In each language it is the app's own button text for 12, with that language's plural form.

**Fact-check:** one fresh Opus 5.5 agent checked every sentence against the app, api and web code BEFORE translating. I fixed these points:
- **"all your recipes"** (the prompt's wording) → "your recipes … in one go". Only the first 500 recipes of a file are read (`paprika_reader.dart:13`). The server also takes at most 200 recipe photos per user per hour (`config/rate_limits.php:198`). I made the same fix in all 24 languages: 12 summaries and 15 first lines said "all", and I removed that word.
- **"phone"** → "device". The import works on tablets too. Only the web build hides it (`recipeFileImportAvailable` = `!kIsWeb`).
- **Steps:** the steps past 50 are not dropped. They are joined onto step 50 while it stays under 2000 characters. So the text says "shortened (100 ingredients, 50 steps)", not "cut to".
- **"Importing the same file twice adds nothing twice"** was too strong. "Already there" means the same title, plus the same link if the recipe has one (app `recipe_file_import_flow.dart:177-197`, api `RecipeBulkImporter.php:150-158`). So a recipe you renamed in daili comes in again. The text says "skips recipes with the same name and link".
- Style: "**Recipes**, then **+**, then …" now matches the other articles.

## 3. All help languages
Eight Opus 5.5 translators (3 locales each, in the foreground) wrote all 24 locales. They used `/tmp/helpimp/BRIEF.md`, the app's own words (`labels.mjs`: the ARB at app HEAD, with the counted button filled for 12 using each locale's plural rule — uk/pl "many", ro "few") and a guard check per locale. I waited for all eight. All 24 were clean on the first report.
- I checked on disk: all 25 files exist, and the commit has exactly 25 files.
- I read de, fr and ja in full. I re-ran the check for all 24 after my "all" fixes: clean.
- Translators' notes (none blocking): the app's own strings write "Daili" with a capital D, and the help text writes "daili" (that is the help rule). cs and sk handle the endings of "Paprika" (sk writes "z aplikácie Paprika" so the name stays as it is). Apple's local name of the Files app is used in each language.

## Facts I could not confirm (left out)
- **Paprika's own export menus.** They are not in our code, so the text stays general ("Menu names can differ by version"), as the prompt asked.
- **What happens when you leave the app mid-import.** Back is blocked during the import. If the phone suspends the app, the result is not proven in code or tests. The fact-checker thought it ends as "No internet — import stopped", but I could not confirm it. The article only says "Keep daili open until it's done".

**True, but left out for the 150-word cap:**
- The 500-recipes-per-file cap (the check screen says "Showing the first 500 recipes.").
- The description also comes along.
- A source name without a link goes into the notes as "Source: …".
- The total time is used as the cook time when there is no prep or cook time.
- Rating, nutrition, difficulty and extra photos are not imported.
- The **Stop** button and **Show which**.
- Switching family stops the import.
- One feed line (and one push) goes to the family.
- **Select all / Select none.**

## Verify
- **Baseline before my change:** `npm run build` was RED with `app route "/focus" has no article`. App commit `34827c05` (Focus timer, in no release tag: `git tag --contains` is empty) added that route. It is not caused by this prompt.
- **So, as in earlier runs:** I copied `route_names.dart` from the live tag `v1.17.0+25` into `/tmp/helpimp/app-live/` and ran `DAILI_APP_REPO=/tmp/helpimp/app-live npm run build` in the foreground. The route check still ran, against what is live. → **exit 0.** The output:
  - `help: 115 of 116 article(s) on pages (live 1.17.0) · en.json 116 articles, 16 tips, 6 checklist`
  - `build OK · 3759 pages`
  - `detector OK`
  - `help search OK`
- The build accepts `mediaPending`. It lists the article under "14 article(s) waiting for a picture: meals-import-file — the Recipes + menu with "From another app" circled".
- **How I checked it is hidden:**
  - `grep -rl "meals-import-file\|import-file\|Import recipes from another app\|paprikarecipes" dist --exclude="*.json"` → no file. So it has no page, no sitemap entry and no search file.
  - `find dist -path "*import-file*"` → nothing.
  - It appears only in the 25 `dist/help/<loc>.json` files (no other json has it). There it has `since: 99.0.0`, and no article lists it in `related`.

## Help impact
`meals-import-file`: new article, hidden until the release with the Paprika import (since 99.0.0). `meals-add-recipe`: unchanged now; it gets its `related` link at release (§1).

## Open items for Ammar
- **Before you deploy:** `./deploy.sh` runs the same build, so it stops on the unreleased `/focus` route. Use `DAILI_APP_REPO=/tmp/helpimp/app-live ./deploy.sh`, or add `/focus` to `"pending"` in `help/routes-allowlist.json` with its own prompt. This commit changes nothing a visitor can see, so a deploy is not needed for it.
- **Release prompt:** set `since:` in `help/en/meals/import-file.md`, add the picture (in place of `mediaPending`), and add `meals-import-file` to `meals-add-recipe`'s `related` line.
- **Worth a look (Planning Claude):** the server takes at most 200 recipe photos per user per hour. A file with more than 200 recipes that have photos loses the rest ("N photos could not be added"). Importing again does not bring them back, because those recipes are now skipped as "already there". This could go on the list.
