# Home: all features in one horizontal row

## Goal
Replace the "Start the day together" grid (6 cards, 2 rows) with ONE
horizontal row that holds every feature (13 now, more later). On a computer
the row is pinned: scrolling down moves it sideways until the last card,
then the page scrolls on. On a phone, touch screen, with reduced motion or
without JavaScript it is a normal swipe row with snap. Adding a feature
later must be one entry in `site.config.mjs` + its words.
Approved prototype (look and behaviour):
https://claude.ai/artifact/MG2cAfcQxsRJHk5i6gau3t
Copy + order: `claude-prompts/2026-10-16/FEATURE-PAGES-COPY.md`.

## Scope
- In: `site.config.mjs` (`DAY_CARDS` → a feature list), `build.mjs`
  (`dayCards`), `templates/landing.html` (the `.day` section only),
  `static/assets/home.css`, `static/assets/home.js`, `content/*.json`
  (`home.day.*` + new row keys, all 28 locales), `tools/check-build.mjs`,
  `tools/make-site-shots.py` / `static/assets/img/shots/**` for the new
  screenshots, `npm run build`.
- Out: every other section (the "Connect your calendars" wide card stays
  below the row as today), help, legal, `LIVE_APP_VERSION`. No feature pages
  yet (prompt 006): cards are not links in this prompt.
  🔴 Untracked files that are not yours: leave them untracked.

## Requirements
1. **Data.** One list in `site.config.mjs` (e.g. `HOME_FEATURES`): per
   feature `slug`, `shot`, `tint`, widget `icon`/`tone`/`done`/`energy`,
   optional `newUntil: 'YYYY-MM-DD'`. Order and slugs from the copy file.
   Budget and Cycle get `newUntil: '2026-12-31'`; the "New" badge renders
   only while `BUILD_DATE <= newUntil`. Neighbour tints never repeat.
2. **Screenshots.** Calendar, To-dos, Documents, Family: the existing
   `shot-*` files. Budget, Cycle, Weather: no store captures exist → take
   them from the help pictures (`static/help/media/<loc>/budget-start.webp`,
   `cycle-start.webp`, `start-weather.webp`) into `shots/<loc>/shot-budget`
   etc. through the existing shot tooling (same size and `?v=` hashing as
   the other shots). Locales without a help picture fall back to `en`, the
   same way `SHOT_LOCALE` falls back today.
3. **Words.** New cards from the copy file, in all 28 `content/*.json`,
   translated with the app's own feature names and `content/glossary.md`.
   The Budget amount is formatted with `Intl.NumberFormat` in the page's
   language and the currency that locale's budget screenshot shows. Also new
   keys: "New" badge, previous/next button labels, the counter
   ("{n} of {total}"). Update the `@cards` description.
4. **Markup.** Same card design as today (`.fcard`, phone, floating card).
   Cards are 400 px wide on a computer, `min(84vw, 360px)` on a phone. A
   counter + ← → buttons above the row, a thin progress bar under it.
   Complete and usable with JavaScript off (native horizontal scroll).
5. **Pinned mode** (`home.js`) only when `(min-width: 861px) and (hover:
   hover) and (pointer: fine)` and not reduced motion: ScrollTrigger pins
   the row block when it reaches the middle of the screen; the track moves
   by its overflow; scroll distance = 0.6 × the overflow (so 13 cards take
   about 2–3 screens); `scrub` smooth; `invalidateOnRefresh`. Works with the
   existing Lenis instance. The arrows scroll the page to the matching
   position. Focusing a card with Tab moves the row so it is visible.
   🔴 RTL (`/ar/`): the row moves the other way (use the file's `D`).
6. **Native mode** (everything else): `overflow-x: auto`, `scroll-snap`,
   no visible scrollbar, arrows hidden on phones, counter + progress follow
   `scrollLeft`. The page body never scrolls sideways at 360 px.
7. **Card motion.** The current per-card parallax uses vertical triggers.
   Inside the pinned row, drive the floating cards with ScrollTrigger's
   `containerAnimation` or leave them still — no jitter. Keep the habits
   energy widget exactly on its screenshot.
8. **check-build.** Card count = the feature list length; every card has a
   screenshot that exists for its locale or the `en` fallback; the badge
   appears only while `newUntil` is in the future. Prove the count check
   can fail (one deliberate wrong count, then revert), per the guard-test
   rules.

## Constraints
- Zero npm dependencies; GSAP/ScrollTrigger/Lenis are the vendored files.
- `npm run build` green (check-content, check-build, test-detector).
- No layout shift above the row; the section order in check-build §15 stays.

## Verify
`npm run build`. Then serve `dist/` locally (`python3 -m http.server 8080`
in `dist/`) and check at 1440×900 (pinned, all 13 cards reachable, page
continues after the last one), 1024×700, 390×844 (swipe), `/ar/` (mirrored),
and with reduced motion. Say in the report what you could and could not
test (a real mouse wheel / trackpad is Ammar's check).

## Commit & push
`feat(home): all features in one horizontal row`; body
`Prompt: claude-prompts/2026-10-16/005-feature-row.md`.
**Push. Do NOT run `./deploy.sh`** (the 1.11.0 help pages wait for the
release; this ships with that deploy).

## Report
`claude-reports/2026-10-16/005-feature-row.md`, half a page: the data
shape, screenshots added per locale (+ fallbacks), keys × locales, any copy
line you changed because it was not true, what you tested, build lines, SHA
+ push. `## Help impact`: none.
