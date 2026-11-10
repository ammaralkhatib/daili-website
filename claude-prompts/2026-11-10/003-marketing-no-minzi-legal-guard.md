# Website: Minzi out of the marketing pages; legal guard for 1.16.0

## Goal
Habits 3 removed Minzi the cat from the app; rewards replace her (plan
`~/Herd/familyplanner-api/claude-prompts/HABITS-3-PLAN.md`). The help center is already clean (help sync
`2026-11-10/001`), but `grep -ri minzi dist/` still finds the **marketing home page and the `features/habits`
pages in 28 languages** (from `content/*.json`) and `home.*.css`. Replace Minzi with the new Habits story. Also
add the 1.16.0 anchors to the legal guard. **Do NOT deploy** — this goes live on store day with the
`LIVE_APP_VERSION` bump (users keep seeing Minzi in the 1.15.0 app until then).

## Requirements
1. Every Minzi / cat / energy / trip / postcard text and picture on the marketing pages (all `content/*.json`
   locales, templates, CSS, images) → the new Habits story: "Habits, one person at a time, a year of done days on
   every habit, and family rewards: every finished day gives a star — set a reward like a cinema trip and plan it in
   the calendar when it's full." Keep each page's length and layout; reuse an existing picture or a new help
   picture from `static/help/media/<locale>/` (e.g. `habits-rewards`) where the old one showed Minzi; no emoji.
   Remove unused Minzi images and CSS. Old changelog pages stay as they are (history).
2. Never mention: Outlook, the free-forever promise, Siri on the watch, widget background updates, Nutrition,
   screen time, visibility groups.
3. `tools/check-legal.mjs`: add a `V116_MUST_CONTAIN` block for the 6 new privacy anchors (`#rewards`,
   `#stock-lists`, `#meal-wishes`, `#instagram-recipes`, `#offline`, `#read-aloud`) in every locale, like the
   earlier releases' blocks.
4. Translations: all locales from the English (sub-agents allowed, each MUST use model claude-opus-5-5).

## Build
`npm run build` passes. `grep -ri minzi dist/` = hits ONLY in old changelog pages (list them).

## Commit & push
`docs(site): habits without Minzi on the marketing pages; legal guard 1.16.0`; body
`Prompt: claude-prompts/2026-11-10/003-marketing-no-minzi-legal-guard.md`. 🔴 Do NOT stage
`static/assets/img/photos/`. **Push now. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-11-10/003-marketing-no-minzi-legal-guard.md` (file-write tool; `wc -c` > 0), short: pages
changed, pictures used, the final grep, build result, SHA + push. `## Help impact`: none.
