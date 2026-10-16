# Feature pages + the home "sheet" — Budget, Cycle, Habits first

## Goal
Every feature gets its own page at `/features/<slug>/` (and
`/<loc>/features/<slug>/`). On the home page, a click on a feature card
opens that page's content in a large popup ("sheet") and changes the browser
address to the page URL; Back closes it. Opened directly (Google, a shared
link, later the app's deep link), the URL shows the same content as a normal
full page. This prompt builds the machinery and the first three pages:
**budget, cycle, habits**. Prompt 007 adds the other ten.
Look and behaviour: the approved prototype
https://claude.ai/artifact/MG2cAfcQxsRJHk5i6gau3t (tap a card).
Copy: `claude-prompts/2026-10-16/FEATURE-PAGES-COPY.md` (check every claim).

## Scope
- In: `site.config.mjs` (feature list from 005: `page: true` per feature,
  optional `shot2`), `build.mjs` (page generation, sitemap, alternates),
  a new `templates/feature.html` (+ a partial for the sheet body),
  `static/assets/home.js` / `home.css` (sheet), `content/*.json` (all 28),
  `tools/check-build.mjs`, `npm run build`.
- Out: AASA / assetlinks / any app deep-link work (later, with the 1.12
  app build), help, legal, `LIVE_APP_VERSION`.
  🔴 Untracked files that are not yours: leave them untracked.

## Requirements
1. **URLs.** `/features/<slug>/index.html` for English (served from the
   root, like the rest of the site) and `/<loc>/features/<slug>/` for every
   other locale. English slug in every language. These URLs must never
   move later (they become deep links) — say so in a code comment next to
   the list.
2. **Page.** Uses the site layout (header, footer, language menu,
   `<html lang dir>`). Top: the feature's tinted background with the phone
   (+ `shot2` where set; Budget: the split screen) and its floating card,
   then title, lead, benefits (icon + title + text), FAQ as `<details>`
   when the feature has one, the store badges partial (no `id`s — it is
   included elsewhere too), and a link back to all features
   (`/#features` in the page's language). `<title>` "<Feature> · daili",
   meta description = lead, canonical, `hreflang` alternates for all
   locales + `x-default`, entries in `sitemap.xml`. Works fully without JS.
3. **Sheet on the home page.** Cards with `page: true` become links
   (`<a class="fcard" href="…">`). With JS: a plain click (no modifier keys)
   fetches the page once (cache it), takes the marked fragment
   (`[data-feature-sheet]`), and opens it in a dialog: two columns on a
   computer (visual left, text right, max 1120 × 740), a bottom sheet on a
   phone; `history.pushState` to the page URL; Back, Esc, the close button
   and a click on the backdrop close it (and restore the home URL); focus
   moves into the dialog, is trapped, and returns to the card; page scroll
   and Lenis stop while it is open. Fetch fails → normal navigation.
   Reduced motion: no animation. RTL: mirrored layout.
4. **Content** for budget, cycle, habits in all 28 `content/*.json`: lead,
   benefits, FAQ, the page `<title>`/description, plus shared labels
   ("All features", "Close", "Questions"). Translate with the app's own
   words and `content/glossary.md`. 🔴 Cycle: neutral and respectful in
   every language, no medical terms, no "family planning" wording. Minzi
   rule for Habits. No "free", no prices, no "Plus".
5. **check-build.** For every `page: true` feature: the page exists in all
   28 locales, the home card links to the page of ITS OWN locale, the page
   has the `[data-feature-sheet]` fragment, a canonical, the full
   `hreflang` set, and is in the sitemap. Prove one check can fail (break
   it once, then revert).

## Constraints
- Zero npm dependencies; no new library.
- `npm run build` green.
- The pinned row from 005 keeps working while and after a sheet opens
  (call `ScrollTrigger.refresh()` only if the layout changed).

## Verify
Build, serve `dist/` locally. Check: `/features/budget/` direct (desktop +
390 px), `/de/features/cycle/`, `/ar/features/habits/` (RTL), JS off
(full page, home cards are plain links), on `/` click Budget → sheet + URL
`/features/budget/` → Back closes → URL `/`; Esc; Tab stays in the sheet.

## Commit & push
`feat(site): feature pages and the home sheet (budget, cycle, habits)`;
body `Prompt: claude-prompts/2026-10-16/006-feature-pages-and-sheet.md`.
**Push. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-10-16/006-feature-pages-and-sheet.md`, half a page:
URL shape, files, keys × locales, copy you corrected (and why), what you
tested, build lines, SHA + push. `## Help impact`: none.
