# Help 1.9.0 part 3: meals-find (ingredient search, family tags)

**Prompt:** `claude-prompts/2026-10-06/002-help-meals-find-tags.md` · **Status:** done · **Commit:** `1150539` (pushed to `origin/main`; step 0 had nothing to commit) · **Not deployed.**

## Articles × locales
2 English articles, each in all 24 other `HELP_LOCALES` = 50 files.
- **New: `meals-find`** "Find recipes: search and your own tags" (`since: 1.9.0`, route + tryIt `/recipes`, `media: meals-tags`, related `meals-add-recipe`, `meals-plan-week`). It covers search in the title and every ingredient ("pumpkin"), the "Contains: …" line, the meal plan picker searching the same way, family tags (shared, up to 50), **New tag** in the filter row or the form, tagging a recipe (⋮ → Edit), the filter (any of the picked ones, **Clear**), and long-press or **Manage tags** to rename, recolour or delete (the recipes stay).
- **Order:** `order: 1`, the same as `meals-add-recipe`. The guard allows two articles with the same order number and then sorts them by the English title, so "Add a recipe" comes first and this article right after it in every language. Nothing was renumbered.
- **`meals-add-recipe`:** step 3 now has **Tags** before **Categories** (in the app the Tags section sits above Categories). `related` now includes `meals-find`. `updated` and the translations' `translatedFrom` are now 2026-10-06.

**Word count (en):** meals-find 147 · meals-add-recipe 84 (the limit is 150).

## Decisions
- Every fact was checked against the app code. "Up to 50" comes from `kRecipeTagsMax`. Long-press opens the tag editor. **Manage tags** only shows once the family has a tag, and **Clear** only shows while a filter is on.
- **New tag** is written without the "+": the "+" is an icon, not part of the label (`recipeTagNew`). The English label **No color** uses the app's spelling.
- Left out (to stay short): the max name length; that a tag made from the filter row is not picked at once (one made in the form is); that **Delete tag** sits inside the edit sheet.

## Translations
AI sub-agents translated the text; no native speaker checked it. Button names were filled by a script from each language's ARB file. Demo words (tags, search word) come from the app's `help_demo_strings.dart`. The picture captions use the words shown in each language's picture. These words were picked by the translators, so a native check would help: the word for "long-press" in uk/bg/id/th/nb, the "magnifier" word in uk/bg/id/th/tr, the "meal plan recipe picker" wording (nl/sv/da/pl/es/pt), and "filter row" in ja/zh.

## Pictures
`meals-tags` and `meals-search-ingredient` (both new) are added to all 25 `help/media*.json` files. The five re-shot pictures (`meals-add-recipe`, `-import-link`, `-paste`, `-youtube`, `-photo`) are also in. All 7 ids are present in all 25 locales, so there are **no gaps**. 175 WebPs are committed. The 5 old hand-made picture gaps (anywhere-*, account-tips) are still listed and are not from this run.

## Build
```
content OK · 28 locale(s) · 305 keys each
legal OK · 2 document(s) × 28 locale(s)
help OK · 77 article(s) · 25 locales · 62 app routes checked
test-check-help OK · 99 cases
build OK · 2259 pages · 2239 in hreflang clusters
detector OK · 32 cases · 28 locale(s) built
```
`node tools/check-help.mjs` is green. Both passed on the first run. The 12 build warnings are old homepage text-length notes, not from this change. Spot checks in `dist/help/<code>.json` (en and de `meals-find`, pt `meals-add-recipe`) all read right.

Left alone (untracked, not mine): `claude-reports/2026-10-01/`, `static/assets/img/blog/…`, `static/assets/img/photos/`.

**Reminder:** deploy on store day, together with the `LIVE_APP_VERSION` 1.9.0 bump (`./deploy.sh`). I did not deploy.

## Help impact
n/a
