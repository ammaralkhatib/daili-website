# Help: new article "Import recipes from another app" (hidden until the release)

Every sub-agent you start MUST use model claude-opus-5-5. Write the report to
`claude-reports/2026-11-19/001-help-import-recipe-file.md` with the file-write tool.

## Why
The app gets a Paprika file import (app repo prompts `2026-11-19/005` + `006`, run just before
this one): Recipes → **+** → **From another app** → pick the `.paprikarecipes` file → a check
screen → import → a summary. It ships in the NEXT app release, whose version is not decided.
The Help center needs the article now, hidden until that release.

## 1. Keep it hidden
Same way as `help/en/anywhere/tablet.md` was hidden before 1.17.0 (report
`claude-reports/2026-11-15/002-help-daili-on-a-tablet.md` §1): `since: 99.0.0` in the English
file, no `related:` link FROM any other article to it, and do NOT bump `LIVE_APP_VERSION`.
Do NOT change `help/*/meals/add-recipe.md` now (translations carry no `since`, so a change
there would go live at once) — the release help sync adds the line there.

## 2. The article — `help/en/meals/import-file.md`, id `meals-import-file`
Front matter like the neighbours (`meals/paste.md`, `meals/import-link.md`): topic `meals`,
title "Import recipes from another app", a one-line summary, keywords (paprika, import, file,
export, paprikarecipes, move, switch, recipe app, many recipes, collection, all at once),
`routes: /recipes`, `tryIt: /recipes`, `since: 99.0.0`, `updated:` today,
`mediaPending: the Recipes + menu with "From another app" circled` (check the build accepts
it, like `tablet.md`), `order:` after `meals-paste`, `related: meals-add-recipe, meals-paste,
meals-import-link`.

**Check every fact against the app code before you write it** (`../familyplanner-app`:
`lib/features/recipes/…` import files, the en texts in `lib/l10n/app_en.arb` keys
`recipeAddFromFile…` / `recipeFile…`, and the app reports `claude-reports/2026-11-19/005-…`
and `006-…`, which hold a step-by-step user walk). Use the app's EXACT button names in **bold**.
A fact the code does not confirm → leave it out and list it under "Facts I could not confirm".
Style: short sentences, easy words, numbered steps, "you". Content, in this order:
1. One line: moving from Paprika? Bring all your recipes at once — with photos.
2. **In Paprika** (numbered): export your recipes in the **Paprika** format (the file ends in
   `.paprikarecipes`) and save or share it to your phone (Files app / Downloads). Keep these
   steps general ("In Paprika, choose export and the Paprika format") — do NOT invent exact
   Paprika menu names; say "the menu names can differ a little by version".
3. **In Daili** (numbered): Recipes → **+** → **From another app** → pick the file → check the
   list (untick what you don't want; recipes already in Daili are unticked and skipped) →
   **Import N recipes** → keep Daili open until it is done → **Go to recipes**.
4. What comes along: title, ingredients, steps, servings, times, the source link, notes, the
   photo, and Paprika's categories as tags (only what the code really maps).
5. `> Note:` limits — a family can have 50 tags (extra categories are left out); very long
   recipes are shortened (Daili keeps up to 100 ingredients and 50 steps); the summary tells
   you.
6. `> Note:` the file is read on your phone; only the recipes you import are saved. Importing
   the same file twice adds nothing twice.
7. One line: only Paprika files for now, and only in the phone app (not on app.daili.app).
No picture yet (`mediaPending`).

## 3. All help languages
A new English article breaks the build until it exists in every `HELP_LOCALES` language.
Translate it into all of them following `claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md`.
Use each language's REAL app button names from `../familyplanner-app/lib/l10n/app_<loc>.arb`
(the keys above). "Paprika" and `.paprikarecipes` stay as they are.

## Constraints
- 🔴 No real user's recipes, file names or mail text anywhere. Example recipe names, if any,
  are made up.
- Change nothing else on the site.

## Verify / Commit & push / Report
`npm run build` green; the new article is NOT in the built pages, sitemap or search (check
like the tablet report did and say how). Commit `docs(help): import recipes from another app
(hidden until the release)`, push to `origin/main`. Do NOT run `deploy.sh` — Ammar deploys.
Report: the English article text in full (Planning Claude reviews it), the ONE line the
release prompt must change (`since: 99.0.0` → the version), the line `meals-add-recipe` needs
at release, facts you could not confirm, build result, SHA, push result.

⚠️ The run script stops when a report line holds "status" and "blocked" together. Only a
truly blocked run may write that.
