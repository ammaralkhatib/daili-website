# Redesign 4/5 — rebuild the home page from the mock

## Goal

Replace the landing page body with the new design in
`claude-prompts/2026-09-05/redesign-mock.html` (Ammar approved it 2026-09-05):
hero with phone + browser window, trust strip, **feature grid** (replaces the
seven tall alternating blocks and the "A look inside" gallery), a dark
**"Also on your computer"** section, three steps, comparison table, "€0"
pricing block, FAQ. The mock's `<style>` is the CSS; its markup is the
template — translated into the site's engine (`{{ }}` keys, `{{# }}` loops,
partials) and into logical CSS properties so Arabic mirrors.

Prerequisites: 011 (fonts/header), 012 (localized screenshots) and 013 (all
content keys) are merged — check `git log` first; if any is missing, stop and
report `blocked`.

Done = `npm run build` clean; `/`, `/de/`, `/ar/` render the new page at 1280
and 390 px with **no horizontal overflow**; every other page (support, legal,
what's-new, blog index + post, 404) still looks right with the new CSS; the
page is at least 25 % shorter than today's 8,700 px at 1280 px.

## Scope

- **In:** `templates/landing.html`, `templates/layout.html` (only if the mock
  needs a hook), `static/assets/style.css` (delete the old hero / feature /
  gallery / compare / pricing / faq / reveal rules; add the mock's), 
  `static/assets/script.js` (remove the `.reveal` scroll-in code — it caused the
  known 116 px overflow at 360 px; keep sticky CTA, download menu, language
  picker, burger, FAQ), `build.mjs` (`renderFeatures` → grid, `renderTrustPills`
  → strip, remove `renderGallery`, hero shots + web screenshot), 
  `site.config.mjs` (`FEATURES` gains tile metadata, `GALLERY` removed),
  `content/*.json` (**removals only**, requirement 7), `static/assets/img/web-calendar.webp`
  (requirement 2), `tools/check-build.mjs` (guard update, requirement 8).
- **Out:** legal pages, blog, what's-new, `.htaccess`, deploy. **Never run `./deploy.sh`.**

## Requirements

1. **Section order and keys** (all keys exist after 013):
   hero (`hero.kicker`, `hero.h1a/h1b`, `hero.lead`, store badges partial,
   `hero.webLink` → `https://app.daili.app`, `hero.notes[]`) → trust strip
   (`trust.pills[]` + `TRUST_ICONS`, no card-in-card: the inline 3-column strip
   with top/bottom rule from the mock) → features grid (`features.section*` +
   one tile per `FEATURES` entry) → web section (`web.*`) → steps
   (`howItWorks.*`) → compare (`compare.*`) → pricing (`pricing.*` with
   `big`, `bigNote`, `promiseTitle`, `promise`, badges partial) → FAQ (`faq.*`,
   first item open by default as in the mock). Sticky mobile CTA stays.

2. **Hero device stack**: the phone shows the localized `shot-home` (from 012);
   behind it a browser frame showing `/assets/img/web-calendar.webp` — a real
   screenshot of app.daili.app. **If `static/assets/img/web-calendar.webp` is
   missing when you start**, generate a temporary 1600×1000 placeholder with
   Pillow (mint background `#DCEFDF`, no text), commit it, and list "replace
   `web-calendar.webp` with a real capture (app.daili.app/calendar, week view,
   Bergers family, 1600×1000, webp)" as the first owner action in the report.
   Drop the two floating notification cards from the mock (they would cost 4
   strings × 23 locales) — the stack is phone + browser only. On ≤ 600 px the
   browser frame is hidden and the phone sits centred (mock's media query).

3. **Feature grid** (`FEATURES` in `site.config.mjs` becomes
   `{ key, tile: 'cal'|'shop'|'todo'|'meal'|'bday'|'vault'|'fam', shot?: 'shot-calendar' }`):
   calendar (4×2, phone shot, bullets), shopping (2×2, phone shot), to-dos,
   meals, birthdays (2×1 each), vault (3×1, mint ground), family (3×1, amber
   ground, five coloured avatar dots — **no letters**, so it needs no
   translation). Tile copy = existing `features.<key>.eyebrow/h2/p/bullets`;
   the `eyebrow` renders as the small icon label only if the mock shows one
   (it does not — keep the key, render `h2` + `p` + bullets; `alt` feeds the
   image). Empty `bullets` arrays render nothing (already the rule). Grid
   collapses to 2 columns ≤ 960 px and 1 column ≤ 600 px; phone shots hide at
   ≤ 600 px exactly as the mock does.

4. **Web section**: dark `--frame` block with the same browser frame + the
   same `web-calendar.webp`; `web.cta` links to `https://app.daili.app`
   (`rel="noopener"`).

5. **Compare table**: mock classes (`.cmp`); the highlighted Daili column
   uses `:has()` as in the mock **plus** a plain class fallback on each `td`
   (Firefox ESR). Legend stays.

6. **CSS hygiene**: every physical `left/right/margin-left/…` from the mock
   becomes its logical twin; transforms use the existing `--dir` sign; all
   colours are tokens; dark-mode values from the mock; `prefers-reduced-motion`
   disables the tile hover lift and any animation. Remove the old rules the
   new sections replace — no dead CSS for the seven-block layout, gallery
   strip or early-bird box. Keep `.legal`, blog, what's-new, support, 404 and
   store-badge rules working; adjust their spacing to the new type scale if
   they look off (small edits only, say what you changed).

7. **Content removals** (all 23 files, same keys): `gallery.*` (whole object),
   `hero.note`, `pricing.earlyBirdTitle`, `pricing.earlyBird`, `pricing.cta`
   if nothing renders it (grep first). `hero.altHome`/`altCalendar` stay.
   `check-content` must still pass.

8. **Guards** (`tools/check-build.mjs`): update the existing landing-page
   assertions that named the gallery/feature markup; add: every landing page
   contains exactly one `<section class="web"` (or the mock's class) with an
   `href="https://app.daili.app"`, and exactly one `.bento` (or the mock's
   class) with 7 tiles. Prove one can fail (delete a tile, run, restore).

## Constraints

- No inverted sections; `{{? }}` only. `_storebadges.html` has no `id`s.
- Do not add content keys — 013 added all of them; if one is genuinely
  missing, stop and report which (do not invent an English-only string).
- Zero npm dependencies. Fonts from 011 only.
- Self-correct up to 2 attempts, then `blocked`.

## Verify

- `npm run build`; `npm run serve`; screenshots at 1280 and 390 px of `/`,
  `/de/`, `/ar/` (full page) into `claude-reports/2026-09-05/shots/`; also
  `/support.html`, `/privacy.html`, `/blog/` at 390 px. Measure
  `document.documentElement.scrollWidth` at 360 px on `/` and `/ar/` — must
  equal 360 (paste the numbers). Record the full-page height of `/` at 1280.

## Commit & push

- `feat(site): new home page — hero with web app, feature grid, web section, €0 pricing`
  — body `Prompt: claude-prompts/2026-09-05/014-home-page-rebuild.md`.
  **Push now.**

## Report

- `claude-reports/2026-09-05/014-home-page-rebuild.md`: what deviates from the
  mock and why, the overflow numbers, page height before/after, guard failure
  proof, owner actions (web screenshot if placeholder; **deploy with
  `./deploy.sh` now** — 011–014 together are the new site).
