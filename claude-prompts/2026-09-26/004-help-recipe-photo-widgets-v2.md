# Help sync 1.7.0 (part 3): "Save a recipe from a photo" + widgets v2

## Goal
Two more 1.7.0 gaps: a new meals article for the photo → recipe feature
(with a tip), and the widgets article brought up to widgets v2 (Habits +
Minzi, Next up / birthday countdown, Tonight's dinner / today's meals,
Quick add, per-widget settings, iPhone lock-screen set, ticking to-dos and
shopping items from the widget). English + every `HELP_LOCALES` language.
Pictures: Ammar re-shoots the five chooser shots (`meals-add-recipe`,
`meals-import-link`, `meals-paste`, `meals-youtube`, `meals-photo`) with
`tool/help-shots.sh`; they land in `static/help/media/<code>/` + manifests.
Reference them; a missing one goes to `media-gaps.json`.

## Scope
- In: `help/en/meals/photo.md` (new) + every locale; `help/en/meals/*.md`
  `order` shifts if needed; `help/en/anywhere/widgets.md` + every locale;
  `npm run build`.
- Out: `site.config.mjs`, other articles, allowlist (no new routes).

## Requirements
1. **`help/en/meals/photo.md`** — `id: meals-photo`, `topic: meals`,
   `title: Save a recipe from a photo`, `summary: Photograph a cookbook
   page, a handwritten card or a screenshot — daili writes the recipe for
   you, in your language.`, `keywords: photo, camera, cookbook, handwritten,
   screenshot, scan recipe, ai, save recipe, picture`, `routes: /recipes`,
   `tryIt: /recipes`, `since: 1.7.0`, `updated: 2026-09-26`,
   `media: meals-photo`, `order: 4` (paste → 5, search-online → 6,
   plan-week → 7, to-shopping → 8, copy-week → 9), `related: meals-youtube,
   meals-paste, meals-add-recipe, calendar-photo`, tip: `tipTitle: Grandma's
   recipe card, saved in seconds`, `tipBody: Photograph a cookbook page or a
   handwritten card and daili writes the recipe for you.`,
   `tipSkipIf: hasRecipes`, `tipPriority: 47`. Body (≤ 150 words): picture
   (the + menu with **From a photo** ringed); steps: Recipes → **+** → **From
   a photo** → Take photo / Choose from library → (library) check it's sharp
   → **Read this photo** → the New recipe form opens filled in — check the
   amounts, then **Save**; comes out in your phone's language whatever the
   page's language; best with printed or clearly written text; privacy box
   (read by Google's AI, deleted at once, camera data stripped); note box
   (free reads per month shared with video and calendar-photo reads; Plus
   has more; early families free for life).
2. **`anywhere-widgets`** — rewrite the body for widgets v2 (facts in
   `../familyplanner-app/claude-prompts/WIDGET-PLAN.md` §7 and the reports
   `../familyplanner-app/claude-reports/2026-09-23/*` + `2026-09-24/001–006`;
   read them, don't guess): the widget list (Calendar/Next up, Shopping,
   To-dos, Habits + Minzi, Birthday countdown, Tonight's dinner / today's
   meals, Quick add, Quick note), tick a to-do or shopping item right on the
   widget, the "+" on a widget opens the right screen, long-press → edit →
   choose family/group and Everyone/Only me or which list, iPhone lock-screen
   widgets (Next up, Quick note, Quick add), Android has no lock-screen
   widgets. Keep `mediaPending`, keep the tip. Stay under the word cap —
   split into a second article `anywhere-widgets-settings` ("Choose what a
   widget shows") only if it doesn't fit, with `since: 1.7.0`.
3. Translations for both, same rules as before (labels from the app's ARB
   snapshot in that language).

## Constraints
- `npm run build` + `node tools/check-help.mjs` green.

## Commit & push
- `feat(help): recipe from a photo + widgets v2 — 1.7.0 part 3`; body
  includes `Prompt: claude-prompts/2026-09-26/004-help-recipe-photo-widgets-v2.md`.
  Push (Ammar deploys).

## Report
- `claude-reports/2026-09-26/004-help-recipe-photo-widgets-v2.md`, half a
  page, with the `media-gaps.json` list.
