# Help 1.9.0 part 3: find recipes — search by ingredient + family tags

## Goal
Build 15 (1.9.0) adds two Recipes features: search finds a word in the
title OR any ingredient, and families can make their own recipe tags.
Add one article and touch one, in English and every `HELP_LOCALES` language.
Runs after website `2026-10-06/001-help-notes-find-and-files` and after app
`../familyplanner-app/claude-prompts/2026-10-06/004-help-shots-recipe-tags-search`
+ its all-locales picture run.

**Do not deploy.** Store day only, with `LIVE_APP_VERSION` 1.9.0.

## Sources (do not guess)
App reports `../familyplanner-app/claude-reports/2026-10-06/001-recipe-search-by-ingredient.md`,
`002-recipe-family-tags.md`, `004-help-shots-recipe-tags-search.md` (picture
ids actually made, demo words); the app's ARB labels
(`../familyplanner-app/lib/l10n/app_*.arb`: `recipesSearchHint`,
`recipesSearchIngredientMatch`, `recipesFilterLabel`, the `recipeTag*` keys,
`recipesManageTags`); the app code when unclear.

## Articles
1. **`meals-find`** (NEW, `help/<code>/meals/find.md`, `since: 1.9.0`,
   `media: meals-tags`, routes `/recipes`, tryIt `/recipes`, order right
   after `meals-add-recipe` (renumber the others only if the guard needs
   unique orders), related `meals-add-recipe`, `meals-plan-week`).
   Title like "Find recipes: search and your own tags". Facts:
   - Search (magnifier on Recipes): finds the word in the title or in any
     ingredient — "pumpkin" finds every recipe that uses pumpkin. A recipe
     found by an ingredient shows "Contains: …". Same search when you pick a
     recipe for the meal plan.
   - Tags are the family's own labels (like Party, Gluten-free, Favourite),
     shared by everyone in the family; up to 50.
   - Make one: **+ New tag** in the filter row, or under **Tags** in the
     recipe form → name, colour (or none) → Save.
   - Put tags on a recipe: open it → ⋮ → Edit → tap the tags → Save. They
     show on the recipe.
   - Filter: tap a tag (or category) in the row; with several picked you see
     recipes that have ANY of them; **Clear** shows all again.
   - Rename, recolour or delete: long-press a tag, or **Manage tags**.
     Deleting removes it from every recipe; the recipes stay.
   Second picture `meals-search-ingredient` in the search part, if app 004
   made it.
2. **`meals-add-recipe`**: step 3 adds **Tags** next to **Categories**;
   `related` gains `meals-find`; bump `updated`.

## Pictures
Made before this prompt (en + all locales): `meals-tags`,
`meals-search-ingredient` (if made), and re-shot `meals-add-recipe`,
`meals-import-link`, `meals-paste`, `meals-youtube`, `meals-photo`. Add the
new ids to `help/media*.json` with matching alt text; commit the WebPs for
all locales. List gaps; don't fail for them.

## Constraints
- Translate into all `HELP_LOCALES`
  (`claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md`), app labels per
  language from the ARBs, demo words from app report 004.
- Same limits and voice as the other Meals articles (word limit, no inline
  links — use `related`).
- `npm run build` green, `node tools/check-help.mjs` green.
- Untracked files that are not yours: leave them.

## Verify
Build; spot-check `en` `meals-find`, `de` `meals-find`, `pt` `meals-add-recipe`.

## Commit & push
`docs(help): 1.9.0 part 3 — meals-find (ingredient search, family tags)`;
body `Prompt: claude-prompts/2026-10-06/002-help-meals-find-tags.md`.
**Push. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-10-06/002-help-meals-find-tags.md`, half a page:
articles × locales, en word count, pictures, build, SHA + push, store-day
deploy reminder. `## Help impact`: n/a.
