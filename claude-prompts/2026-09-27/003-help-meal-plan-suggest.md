# Help sync 1.7.0 (part 4): "Let Daili plan your dinners" + the AI privacy paragraph

## Goal
Two 1.7.0 gaps. (1) A new meals article for the AI dinner suggestions
(app prompt `../familyplanner-app/claude-prompts/2026-09-26/009-meal-plan-suggest-app.md`,
report `../familyplanner-app/claude-reports/2026-09-26/009-meal-plan-suggest-app.md`
— read them, don't guess), with a tip, plus one line in the plan-week
article. (2) The privacy policy finally names the AI features (YouTube →
recipe, photo → events, photo → recipe, dinner suggestions) in every
language. Pictures: Ammar shoots `meals-suggest` (new) and re-shoots
`meals-plan-week` (the app bar has one more icon) with `tool/help-shots.sh`
in all 25 languages BEFORE this run; they land in `static/help/media/<code>/`
+ manifests. Reference them; a missing one goes to `media-gaps.json`.

## Scope
- In: `help/en/meals/suggest.md` (new) + every locale; `help/en/meals/plan-week.md`
  + every locale (one sentence + `updated`); `order` shifts in
  `help/en/meals/*.md` + locales; `legal/privacy.en.html`,
  `legal/datenschutz.de.html` and every other `legal/privacy.<code>.html`;
  `npm run build`.
- Out: `site.config.mjs`, other articles, allowlist (no new routes), the
  terms pages.

## Requirements
1. **`help/en/meals/suggest.md`** — `id: meals-suggest`, `topic: meals`,
   `title: Let Daili plan your dinners`, `summary: One tap suggests a dinner
   for every open evening of the week — from your own recipes, plus a few
   new ideas.`, `keywords: meal plan, suggest, ai, plan my week, dinner
   ideas, what's for dinner, weekly menu, quick dinners, vegetarian, kids`,
   `routes: /meal-plan`, `tryIt: /meal-plan`, `since: 1.7.0`,
   `updated: 2026-09-27`, `media: meals-suggest`, `order: 8` (to-shopping →
   9, copy-week → 10), `related: meals-plan-week, meals-to-shopping,
   meals-add-recipe, meals-photo`, tip: `tipTitle: Out of dinner ideas?`,
   `tipBody: Tap the sparkle on the Meal plan and Daili suggests a dinner for
   every open evening — from your recipes, plus a few new ones.`,
   `tipSkipIf: hasMealPlan`, `tipPriority: 46`. Body (≤ 150 words): picture
   (the Meal plan app bar with the sparkle ringed); steps: Home → **Meal
   plan** → the **sparkle** icon (**Plan my week for me**; on an empty week
   also the button **Let Daili suggest**) → choose filters — **Quick (under
   30 min)**, **Kid-friendly**, **Vegetarian**, **Only my recipes** — and,
   if you like, type a wish under **Anything to use up or avoid?** → **Suggest
   dinners** → on **Your week, suggested**, untick a day you don't want,
   tap **Swap** for another idea (free), tap a **New recipe** card to read
   it → **Add N dinners**. Facts to state: only open evenings from today are
   filled, dinners already planned stay; new ideas are saved to your
   Recipes when you add them, so **To shopping** works; Daili avoids what you
   ate in the last two weeks; **Try again** makes a new plan and uses one
   more suggestion. Privacy box: your recipe titles and your wish text are
   sent to Google's AI to make the plan, nothing is stored there. Note box:
   suggestions come from the same monthly AI pool as video and photo reads;
   Plus has more; early families free for life.
2. **`meals-plan-week`**: add one sentence at the end — "Out of ideas? The
   sparkle at the top asks Daili for a dinner suggestion for every open
   evening — see *Let Daili plan your dinners*." (link the article the way
   the other articles cross-link), `updated: 2026-09-27`, add
   `meals-suggest` to `related`. Picture reference unchanged (Ammar re-shot
   it).
3. **Privacy policy** — in `legal/privacy.en.html`, after the "Connected
   calendars (optional)" paragraph, add one paragraph:
   `<p><strong>AI features (optional).</strong> Some features ask Google's
   Gemini AI for help, only when you start them: turning a YouTube video, a
   photo or a screenshot into a recipe, reading dates from a photographed
   letter, and suggesting dinners for your week. For these, the video link,
   the photo, or — for suggestions — your recipe titles, your recent meals
   and the wish you typed are sent to Google (Google Ireland Ltd.) once and
   used only to answer. Photos are read once and never stored on our
   servers; Google does not use this data to train its models. Each family
   has a monthly number of AI actions; we count them, nothing else.</p>`.
   Extend the hosting paragraph ("The Daili server is hosted by …") with:
   "Gemini requests may be processed by Google on servers outside the EU
   under the EU standard contractual clauses." Same in
   `legal/datenschutz.de.html` (proper German, "Sie") and in every other
   `legal/privacy.<code>.html`, translated in the tone of that file. Keep
   each file's existing structure and `updated`/date line convention (bump
   it if the files carry one). Check the claim "does not use this data to
   train its models" against Google's paid Gemini API terms (the key is a
   paid-tier key); if you cannot confirm it from the terms, drop that half
   sentence and say so in the report.
4. Translations for the article + the plan-week sentence, same rules as
   before (labels from the app's ARB snapshot in that language — the
   `mealPlanSuggest*` keys).

## Constraints
- `npm run build` + `node tools/check-help.mjs` green; `npm test` green.
- Word cap ≤ 150 for the article body.

## Commit & push
- `feat(help): dinner suggestions article + AI privacy paragraph — 1.7.0
  part 4`; body includes
  `Prompt: claude-prompts/2026-09-27/003-help-meal-plan-suggest.md`. Push
  (Ammar deploys).

## Report
- `claude-reports/2026-09-27/003-help-meal-plan-suggest.md`, half a page,
  with the `media-gaps.json` list and the training-data check result.
