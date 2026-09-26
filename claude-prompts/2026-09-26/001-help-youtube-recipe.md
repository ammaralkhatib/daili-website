# Help: "Save a recipe from a YouTube video" — new article + updated import article, 25 languages

## Goal
The app (build 12, version 1.7.0) gets a new row in the Recipes "+" menu:
**From a YouTube video** — paste a cooking video link and daili writes the
recipe. The help center needs one new article for it, and the existing
"Save a recipe from a website link" article must stop saying YouTube doesn't
work. Both in English and in every `HELP_LOCALES` language. Pictures are
already shot by Ammar with the app's `tool/help-shots.sh` (ids
`meals-youtube`, `meals-add-recipe`, `meals-import-link`, `meals-paste` —
the + menu changed for all four) and sit in `static/help/media/<code>/` with
`help/media*.json` updated; this prompt only writes text.

## Scope
- In: `help/en/meals/youtube.md` (new), `help/en/meals/import-link.md`
  (changed), the same two files under every other `help/<code>/meals/`,
  `help/en/meals/paste.md` only if it names YouTube, and their translations
  for that one sentence. `npm run build` output.
- Out: `site.config.mjs` (`LIVE_APP_VERSION` stays 1.6.0 — the release prompt
  bumps it), `routes-allowlist.json` (no new route: it is a sheet on
  `/recipes`), any other article, pictures.

## Requirements

1. **New English article `help/en/meals/youtube.md`** — frontmatter:
   `id: meals-youtube`, `topic: meals`,
   `title: Save a recipe from a YouTube video`,
   `summary: Paste the link of a cooking video, and daili writes the ingredients and steps for you — in your language.`,
   `keywords: youtube, video, recipe video, cooking video, import video, link, ai, save recipe, shorts`,
   `routes: /recipes`, `tryIt: /recipes`, `since: 1.7.0`,
   `updated: 2026-09-26`, `media: meals-youtube`, `order: 3`
   (today: paste 3, search-online 4, plan-week 5, to-shopping 6, copy-week 7 —
   bump each of those by one so the list reads add · import link · youtube ·
   paste · search · plan week · to shopping · copy week; the `order` key is
   English-only, so no translation change for that),
   `related: meals-import-link, meals-paste, meals-add-recipe`,
   `tipTitle: Turn a YouTube video into a recipe`,
   `tipBody: Paste a cooking video link and daili writes the ingredients and steps for you.`,
   `tipSkipIf: hasRecipes`, `tipPriority: 50`.
   Body (same style as import-link.md — short, friendly, bold = the app's
   own labels from `app_en.arb`: **Recipes**, **+**, **From a YouTube video**,
   **YouTube link**, **Paste**, **Read the video**, **Save**):

   > Saw a dish on YouTube? daili can write the recipe for you.
   >
   > ![The Recipes screen with the + menu open. From a YouTube video is circled.](meals-youtube)
   >
   > 1. Copy the video link in the YouTube app (Share → Copy link).
   > 2. On Home, tap **Recipes**, then **+**, then **From a YouTube video**.
   > 3. Paste the link under **YouTube link**, or tap **Paste**. Then tap **Read the video**.
   > 4. daili reads the video — this can take up to a minute. Check what it found and fix anything that's off. Then tap **Save**.
   >
   > daili first looks at the video's description. If the recipe is there, or the description links to a recipe page, it takes it from there and it's quick. Otherwise it watches the video.
   >
   > The ingredients and steps come out in the language your phone uses, whatever language the video is in.
   >
   > > Note: Only public videos up to 25 minutes work. Every family gets a few free video reads each month. Daili Plus has more — and if your family joined early, video reads are free for life.

2. **Update `help/en/meals/import-link.md`**: `updated: 2026-09-26`; add
   `meals-youtube` to `related`; replace the last note with:
   `> Note: Instagram and TikTok links don't contain recipe data. Copy the recipe text instead, and use **Paste recipe text**. For YouTube, use **From a YouTube video**.`
   Also update the picture alt text if the menu wording changed (the + menu
   now shows a short line under each option; the circled item is the same).

3. **`help/en/meals/paste.md`**: if it lists YouTube among the "no recipe
   data" apps, remove YouTube from that sentence and set `updated:
   2026-09-26`. Otherwise leave it untouched.

4. **Translations** (rules: `claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md`):
   for every code in `HELP_LOCALES` except `en`, write
   `help/<code>/meals/youtube.md` (allowed keys only: `id`, `title`,
   `summary`, `keywords`, `tipTitle`, `tipBody`, `translatedFrom: 2026-09-26`)
   and update the note in `help/<code>/meals/import-link.md` (+ `paste.md` if
   changed) with `translatedFrom: 2026-09-26`. Button names come from that
   language's ARB (`../familyplanner-app/lib/l10n/app_<arb>.arb` — keys
   `recipeAddYoutube`, `recipeImportYoutubeUrlLabel`, `recipeImportReadVideo`,
   `recipeImportPaste`, `recipeAddPasteText`, `recipeAddImport`; the ARB
   files were updated by the app prompt `2026-09-26/003`). Informal register
   as the ARB does it. 🔴 Never "family planner" in `el`, `uk`, `bg`.
   "daili" lowercase, "Daili Plus" as a product name keeps the capital.

5. **Build**: `npm run build` green — the help guard requires every English
   article in every locale and flags a changed article whose translation is
   older than English. If a picture is missing for a locale (Ammar's shot
   run failed for one), do NOT invent a media entry — report it.

## Constraints
- Only the files named above; no engine or template changes.
- Same blocks in the same order in every language (engine guard).

## Verify
- `npm run build` green; open `dist/help/en/meals/youtube/index.html` and
  one other locale to see the picture and the note render.

## Commit & push
- `docs(help): YouTube video → recipe article + import-link update, 25 languages`;
  body includes `Prompt: claude-prompts/2026-09-26/001-help-youtube-recipe.md`.
  Include the new/changed pictures under `static/help/media/**` and
  `help/media*.json` in the same commit (they are untracked from the shot run).
- **Push now.** (Website push does not deploy — Ammar runs `./deploy.sh`.)

## Report
- `claude-reports/2026-09-26/001-help-youtube-recipe.md` in the short style
  of `claude-reports/2026-09-25/001-help-wording-sync.md` (file-write tool;
  check `wc -c`). List any locale whose picture was missing.
