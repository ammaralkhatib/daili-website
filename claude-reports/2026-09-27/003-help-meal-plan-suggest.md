# Help 1.7.0 part 4: "Let Daili plan your dinners" + AI privacy paragraph

**Prompt:** `claude-prompts/2026-09-27/003-help-meal-plan-suggest.md`
**Completed:** 2026-09-27 · **Status:** done (four small changes from the prompt, see below)

## What changed
- **New `meals/suggest.md`** (`meals-suggest`, `since: 1.7.0`, order 8, tip priority 46, `tipSkipIf: hasMealPlan`). Facts come from app prompt + report `2026-09-26/009`. Labels come from the `mealPlanSuggest*` keys in the ARB files at app HEAD. 1.7.0 isn't tagged yet, so the live tag `v1.6.0+11` doesn't have them. Body: the steps, open evenings only, planned dinners stay, the last two weeks are skipped, new ideas go to Recipes, **Try again** costs one more suggestion. Two notes: a privacy note and an AI-reads note.
- **Meals order**: to-shopping → 9, copy-week → 10.
- **`meals-plan-week`**: added the closing sentence, which points to **Let Daili plan your dinners** the way `calendar-add-event` points to its photo article ("See **…**"). Also `updated: 2026-09-27` and `meals-suggest` in `related`. Every locale got the sentence and `translatedFrom: 2026-09-27`.
- **24 translations** of the article, using each language's ARB labels (zh-Hans comes from `app_zh.arb`).
- **Privacy policy**: the "AI features (optional)" paragraph goes after "Connected calendars", and the Gemini sentence is added to the hosting paragraph. That's in `privacy.en.html`, `datenschutz.de.html` and the 26 other `privacy.<code>.html`, including ar/hi/ru, which are site locales but not help locales. Each file keeps its own du/Sie or tu/vous tone. The date moved to **27 September 2026** in all 28 files, because `check-legal` requires one shared date.

## Changes from the prompt (please check)
1. **Word cap.** Everything the prompt asked for came to about 200 words, and the cap is 150. I tightened the wording without dropping any fact. The intro is now just "Out of dinner ideas?". The body is exactly 150 words.
2. **tipBody.** The prompt's text is 125 characters and the limit is 120. It now reads: "Tap the sparkle on the Meal plan and Daili suggests a dinner for every open evening, from your recipes and new ones."
3. **`routes: /meal-plan, /meal-plan/suggest`.** The app's new review screen route failed the help route check ("has no article"). I listed it on this article instead of touching the allowlist, which the prompt kept out of scope.
4. **Privacy note in the article** also says "recent meals" are sent. The privacy paragraph says so too, and the server needs them to skip the last two weeks.
5. **German "Sie".** `datenschutz.de.html` uses **du** throughout. So the new German paragraph is written impersonally ("wenn sie ausdrücklich gestartet werden", "der eingegebene Wunsch") and fits the file either way.

## Training-data check
**Confirmed, so the half sentence stays.** The Gemini API Additional Terms (ai.google.dev/gemini-api/terms, last updated 2026-04-28), Paid Services section, say: "Google doesn't use your prompts (including associated system instructions, cached content, and files such as images, videos, or documents) or responses to improve our products." Google logs them only to detect abuse. This only holds while the key stays on a paid (billing-enabled) project.

## Pictures (`media-gaps.json`)
**No gaps, so it stays `{}`.** All 25 languages have `meals-suggest` (new, 720×622) and the re-shot `meals-plan-week`. I committed them (50 `.webp` + 25 manifests). I looked at the English shots: the sparkle is ringed in `meals-suggest`, and `meals-plan-week` still rings Monday's **+** (alt text unchanged).

## Verification
- `npm run build`: legal OK (2 docs × 28 locales), help OK (71 articles, 25 locales, 61 app routes), build OK (2034 pages), detector OK.
- `npm test`: detector OK, test-check-help OK (99 cases).
- `dist/help/en.json` and `de.json` contain `meals-suggest` and its tip. The page goes live once the release bumps `LIVE_APP_VERSION`.

## Not committed (other lanes)
`changelog/whats-new.{en,de}.html`, `claude/blog-seo-plan-2026-09.md`, `claude/blog-drafts/*`, `claude/website-scroll-story-2026-09-18.md`, `static/assets/img/blog/…`, `static/assets/img/photos/`.

## SHAs
- `49cdc49` docs(plan): sync planning docs
- feat(help): dinner suggestions article + AI privacy paragraph — see `git log` (this report is part of it). Pushed to `origin/main`.

## Help impact
meals-suggest: new article (1.7.0). meals-plan-week: one sentence pointing to it. Privacy policy: new AI paragraph, dated 27 September 2026.

## Open items for Ammar
- Deploy (`./deploy.sh`) to publish the privacy change. The help article follows at the 1.7.0 release bump.
- Server facts I couldn't check (the api repo isn't on this machine): "avoids the last two weeks" and "nothing is stored there". Both come from the prompt.
