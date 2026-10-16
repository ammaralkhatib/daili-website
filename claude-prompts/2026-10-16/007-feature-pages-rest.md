# Feature pages — the other ten features

## Goal
Finish the feature pages from `006`: give the remaining ten features a page
and turn on their home cards' sheet. After this prompt every card in the row
opens its page.

## Scope
- In: `site.config.mjs` (`page: true` for calendar, lists, todos, notes,
  recipes, meal-plan, birthdays, weather, documents, family; `shot2` only
  where a second screenshot really adds something), `content/*.json` (all
  28), `npm run build`.
- Out: the machinery from 006 (only fix it if a new page breaks it, and say
  so), help, legal, `LIVE_APP_VERSION`.
  🔴 Untracked files that are not yours: leave them untracked.

## Requirements
1. Copy from `claude-prompts/2026-10-16/FEATURE-PAGES-COPY.md`, every claim
   checked against `help/en/**`, `../familyplanner-app/CHANGELOG.md` and the
   app code where unclear. Rewrite or drop anything not true in 1.11.0
   (e.g. recipe tags, the weather card's second line) and list it.
   Calendar: Google and phone calendars only — Outlook is not live.
2. All 28 locales, the app's own feature names, `content/glossary.md`.
   No "free", no prices, no "Plus".
3. check-build from 006 now covers all 13 features; add one assertion that
   every feature in the list has `page: true` (so a new feature cannot ship
   without a page).

## Constraints
- `npm run build` green.

## Verify
Build, serve `dist/`; open each of the 13 sheets on `/` (desktop + 390 px)
and two direct pages in other languages (`/fr/features/recipes/`,
`/ja/features/family/`).

## Commit & push
`feat(site): feature pages for the remaining ten features`; body
`Prompt: claude-prompts/2026-10-16/007-feature-pages-rest.md`.
**Push. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-10-16/007-feature-pages-rest.md`, half a page: pages ×
locales, copy you corrected, build lines, SHA + push. `## Help impact`: none.
