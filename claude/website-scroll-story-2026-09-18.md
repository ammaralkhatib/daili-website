# daili.app home page — the scroll story (lane opened 2026-09-08, mock approved 2026-09-18)

**Status:** mock v7 approved by Ammar ("go", 2026-09-18). Two prompts written,
not run: `daili-website/claude-prompts/2026-09-18/001-story-content-keys.md`
→ `002-scroll-story-home-page.md`. Mock: `claude-prompts/2026-09-08/scroll-story-mock.html`
(artifact "Daili Scroll Story", version 7).

## What the page becomes

A cash.app-style story. Every section is exactly one screen and the browser
**snaps** from one to the next (CSS `scroll-snap`, mandatory, desktop only —
one trackpad flick = one slide). Left: the text. Right: one sticky phone
(the screenshot alone, no bezel, rounded corners) whose next screen **slides
up over the previous one**, which stays still. Three small floating cards
per chapter (event pill, shopping row, to-do, reminder…) drift gently next
to the phone and swap with the chapter. Title → paragraph → bullets build up
as a slide settles; the previous text fades as it leaves. Background colour
changes per chapter (paper / forest / paper / mint / amber / paper / ink /
mint).

Order: hero (chapter 0) → calendar → shopping → to-dos → meals → celebrations
→ vault → family → web app (browser window enters full-screen, then shrinks
aside while the text fades in behind it) → getting started (steps slide in
one by one) → compare (column by column) → pricing (builds up) → FAQ +
footer (last slide).

**Mobile (≤ 900 px): a plain page.** No snap, no sticky phone, no cards.
Each chapter = text + its own screenshot, sections stack normally.

## Decisions Ammar took (in order)

- Whole home page, no library, hand-built CSS cards, mock first (2026-09-08).
- v2 → v3: hero merged into the story; cards bigger; no parallax on the cards
  (tried, disliked); collision between two chapter texts fixed; sections
  after the story build by scrolling, no big boxed containers.
- v4: phone bigger, cards anchored to the phone; web copy behind the window;
  no bezel; "one flick per slide".
- v5: mandatory snap, every slide one screen; screenshot slides with the
  scroll.
- v6 → v7: **photos tried and rejected** ("not at all") — the nine generated
  family photos stay in `static/assets/img/photos/` (01-hero … 09-web.webp)
  for a later round, nothing renders them; the new screenshot slides *over*
  the old one; rounded corners while sliding; no shadow at rest; simple
  mobile page.

## Content

Existing keys carry the story (`hero.*`, `features.<key>.*`, `web.*`,
`howItWorks.*`, `compare.*`, `pricing.*`, `faq.*`, `cta.sticky`). New in 001:
`story.cards.<hero|calendar|shopping|todos|meals|birthdays|vault|family>[3]`
with `t` (bold) + `s` (small) — 48 short strings × 28 locales; `nav.menu`;
a new `features.family.alt`. Removed: `hero.kicker`, `pricing.lead`.
Kept idle on purpose: `trust.*`, `featuresSection.*` (the trust strip is
gone from the page — Ammar has not said whether it should return).

## Owner actions (Ammar)

1. Delete the nine 1.6 MB PNG originals in `static/assets/img/photos/`
   (everything in `static/` is copied to the live site).
2. Delete the untracked `_to_delete/` folder at the website repo root.
3. **Before deploying the new page:** capture `app.daili.app/calendar`
   (week view, Bergers family, 1600×1000) and replace
   `static/assets/img/web-calendar.webp` — the web slide opens with that
   image full-screen; today it is a 2.9 KB mint placeholder.
4. Run 001, then 002 in Claude Code (website repo). Click through `/`,
   `/de/`, `/ar/` on the Mac (trackpad + mouse wheel) and on the phone.
5. `./deploy.sh`.

## Open questions for later rounds

- Photos (a different style, or real family photos) — v2 of this lane.
- Does the trust strip ("No ads · No tracking · No selling your data") come
  back somewhere (e.g. a fourth line under the hero)?
- The FAQ shows 4 questions in the mock; the content has 8 — 002 renders all
  8 (the slide has `min-height`, so it may be taller than one screen — fine).

## Traps found while building the mock

- A `margin-top` on the sticky text collapsed through the chapter box and
  shoved every chapter down (v3 "collision") — padding, never margin.
- `z-index` on the stacked screen images put the cards behind the phone —
  `.floats { z-index: 10 }`.
- Firefox ESR has no `:has()` — snap is scoped with a class on `<html>`.
- The cloud workspace cannot download from Higgsfield's CDN; generated
  images are saved by Ammar into a connected folder instead.
