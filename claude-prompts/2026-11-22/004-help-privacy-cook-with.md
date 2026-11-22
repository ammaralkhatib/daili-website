# Help + privacy: "Cook with what we have" (help hidden until the release)

Standard lane, website only. Feature #166, plan `~/Herd/familyplanner-api/claude-prompts/COOK-WITH-WHAT-WE-HAVE-PLAN.md`
(Decisions 1, 3, 5, 6, 8; Design parts 5 and 8). It ships in the NEXT app release (version not decided) and on
app.daili.app when Ammar deploys the web.

Every sub-agent you start MUST use model claude-opus-5-5. Write the report with the file-write tool.

Everything below was built today in the other repos (all run before this prompt):
- api `2026-11-22/010` (`POST /v1/recipes/ideas`) and `011` (`POST /v1/recipes/ingredients-from-photo`);
- app `2026-11-22/007` (food sheet, stock lists, "Say it", results) and `008` (photo, AI ideas, idea page, save / plan /
  add missing, one more line on the AI consent sheet);
- web `2026-11-22/002` (window + results page `/recipes/cook`), `003` (the web's own 18+ and AI consent windows), `004`
  (photo + AI ideas on the web).
Read their reports (`~/Herd/familyplanner-api/claude-reports/2026-11-22/010-…`, `011-…`,
`../familyplanner-app/claude-reports/2026-11-22/007-…`, `008-…`, `../daili-web/claude-reports/2026-11-22/002-…`,
`003-…`, `004-…`) for the click-paths and the exact texts. **Check every fact against the code before you write it**
(the en texts in `../familyplanner-app/lib/l10n/app_en.arb` — keys `cookWith…`, `aiConsentCookWith`; the web's
`src/i18n/en.ts`). A report missing → write from the plan and list each such fact under "Facts I could not confirm".

## 1. Help article — new, hidden until the release

Same way as `help/en/meals/import-file.md` and `help/en/lists/steps.md` (prompts `2026-11-19/001`, `2026-11-21/002`):
`since: 99.0.0` in the English file, NO `related:` link FROM any other article to it, do NOT bump `LIVE_APP_VERSION`,
do NOT change other articles now. Help articles have no sections, so this is a NEW article:
`help/en/meals/cook-with.md`, id `meals-cook-with`, topic `meals`, title "Cook with what we have", a one-line summary,
keywords (what can I cook, ingredients at home, fridge, leftovers, use up, pantry, stock list, ideas, AI ideas, photo of
the fridge, say ingredients, missing), `routes:` the app route(s) the reports name (check against `help-lib.mjs` /
`help/routes-allowlist.json`), `tryIt: /recipes`, `since: 99.0.0`, `updated:` today, `mediaPending:` "the food sheet
with chips and the three tiles, and the results with one recipe card and two AI idea cards", `order:` after
`meals-find`, `related: meals-find, meals-suggest, meals-photo, meals-to-shopping`.

Content, short, like the neighbours (`find.md`, `suggest.md`): where the card is; the four ways to add food (type, your
stock list — and the small picker with two or more lists, say it, a photo = 1 AI action); "Always at home" things
(salt, oil …) never count as missing; the order of "Our recipes that fit"; "New ideas with AI" = 1 AI action, free right
after a photo, nothing is charged when no ideas come back; the three buttons (Cook it on … saves the recipe too · Save
as recipe · Add missing to shopping list); **"Check the ingredients for allergies — the AI does not know them."**;
nothing about your food is saved; adults only (the 18+ question). One short paragraph for the web: same feature at
app.daili.app → Recipes; "Say it" only in browsers that have speech recognition (Chrome, Safari, Edge — not Firefox).

Translate into all 24 other help locales (the folders in `help/`; the help tooling's locale list). Translations carry
no `since` (check how `steps.md`'s translations did it and copy that).

## 2. Privacy policy — two changes, all locales

English (`legal/privacy.en.html`) is the source; German (`legal/datenschutz.de.html`, "du") is authoritative for
Germany; then every other `legal/privacy.<locale>.html`. Write in the style and tone of the paragraphs you change.

a) **"AI features (optional)"** (`privacy.en.html` ~:34): add "suggesting dishes from food you pick or from a photo
   of your food" to the list of features, and to "what is sent": "the food you picked, the photo of your food". Say
   that the food photo is not stored (only read) — check api 011's report — and that **in the web app
   (app.daili.app) the same AI feature exists**: the web asks the same 18+ question (a "No" is remembered only in that
   browser) and asks for AI consent once per browser. Do not change any other sentence of that paragraph.
b) **`id="voice"`** (~:40, "Speaking a note"): widen it to "speaking a note or saying what food you have", and add:
   "In the web app, "Say it" uses your browser's own speech recognition (for example in Chrome, Edge or Safari), which
   may send your voice to Google or Apple under their own terms; Daili receives only the text. Browsers without speech
   recognition do not show the button."

Keep `tools/check-legal.mjs` green. Bump the policy's "last updated" date the way the last legal prompt did
(`claude-prompts/2026-11-22/002-legal-help-delete-comeback.md`) — read it and do the same.

## Verify

- `npm run check:help`, `npm run build` (runs all checks) green, FOREGROUND. Spot-check 5 help translations against
  their ARB words and 3 privacy translations against the English.

## Commit & push

- Conventional Commit `docs(help,legal): cook with what we have — help (hidden) + privacy lines`; body names
  `Prompt: claude-prompts/2026-11-22/004-help-privacy-cook-with.md`.
- **Push now.** Do NOT run `./deploy.sh`: **Ammar reads the English and German privacy text first** (Planning Claude
  shows it to him in the Verify chat), then deploys the website BEFORE the web deploy.

## Report

- `claude-reports/2026-11-22/004-help-privacy-cook-with.md`: what was written, the full new English AND German privacy
  sentences quoted (Ammar reads them there), facts confirmed against the code, "Facts I could not confirm", and the
  open items for the release help sync: set the real `since`, add a `related` link from `meals-find`, shoot the picture.
- Do not write the word "blocked" next to a status anywhere in the report unless you really stopped.
