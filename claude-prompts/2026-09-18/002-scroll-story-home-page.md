# Scroll story 2/2 — rebuild the home page as the scroll story

## Goal

Replace the home page body with the **scroll story** in
`claude-prompts/2026-09-08/scroll-story-mock.html` (mock v7, Ammar approved
2026-09-18). One screen per section, the browser snaps from one to the next;
a sticky phone whose screenshot slides up over the previous one; small
floating cards next to the phone; text that builds up (title → paragraph →
bullets) as a slide settles. The mock's `<style>` is the CSS and its
`<script>` is the JS — translated into the site's engine (`{{ }}` keys,
`{{# }}` loops, partials, build.mjs helpers), into logical CSS properties so
Arabic mirrors, and into tokens.

Prerequisite: 001 (`story.cards`, `nav.menu`, family alt) is merged — check
`git log`; if it is missing, stop and report `blocked`.

Done = `npm run build` clean (all four links); `/`, `/de/`, `/ar/` render the
story at 1440×900, 1280×720 and 390×844 with **no horizontal overflow**; one
trackpad flick moves one slide; every other page (support, legal, what's-new,
blog index + post, 404) still looks right with the new CSS.

## Scope

- **In:** `templates/landing.html`, `static/assets/style.css`,
  `static/assets/script.js`, `build.mjs`, `site.config.mjs`,
  `tools/check-build.mjs` (section 15), `templates/layout.html` only for the
  burger `aria-label="{{ nav.menu }}"`.
- **Out:** `content/*.json` (001 did it; if a key is genuinely missing, stop
  and report which — never invent an English-only string), legal, blog,
  what's-new, `.htaccess`, deploy. **Never run `./deploy.sh`.**
- Housekeeping in the same run: delete
  `claude-prompts/2026-09-05/016-redesign-fixups.md` (untracked, superseded —
  its four items are either in 001 or obsolete).

## The page, top to bottom (desktop ≥ 901 px)

Read the mock once end to end before writing anything; the numbers below are
the mock's and are what Ammar approved.

1. **Header** unchanged (011). It is 64 px tall on desktop — put that in a
   token `--header-h` and use it everywhere the mock hard-codes 64.

2. **`<section class="story" id="story" data-active="0">`** — one `.wrap`
   grid: left column `.chapters`, right column `.stage`.
   - **Eight `.chapter` blocks**, `min-height: calc(100vh - var(--header-h))`,
     `scroll-snap-align: start`, flex-centred text. Chapter 0 is the **hero**
     (it also keeps `class="hero"` on the chapter so the sticky-CTA code in
     script.js still finds it): `hero.h1a` + `<em>hero.h1b</em>` with the
     hand-drawn underline, `hero.lead`, store-badges partial + `hero.webLink`
     → `https://app.daili.app`, `hero.notes[]` chips. **No kicker** (001
     removed the key). Chapters 1–7 = one per `FEATURES` entry, in
     `FEATURES` order: `num` "1 / 7" (numbers only, no string),
     `features.<key>.eyebrow` (rendered this time — it is the small uppercase
     label), `h2`, `p`, `bullets[]` (empty array renders nothing). Chapter 7
     (family) ends with a `btn-primary` link using `cta.sticky` to the
     first available store (same target logic the sticky CTA uses).
     Each chapter's text is inside `.txt`; each element that builds up is
     `.by` with the mock's `--a/--w` numbers (title `.45/.14`, paragraph
     `.6/.12`, bullets `.7 .76 .82 .88` with `.08`; hero: `0 .04 .08 .12`
     so it is complete on load whatever the window height).
   - **`.stage`** (`position: sticky; top: 0; height: 100vh`, centred): the
     `.device` → `.phone` → `.screen` with **eight `<img>`**, one per chapter,
     each `style="--k:<i>"`: chapter 0 = localized `shot-home` (`alt` =
     `hero.altHome`, `fetchpriority="high"`, not lazy — it is the LCP),
     then the seven feature screens in FEATURES order (`shot-calendar`,
     `shot-shopping`, `shot-todos`, `shot-mealplan`, `shot-birthdays`,
     `shot-documents`, `shot-family`; `alt` = `features.<key>.alt`; lazy).
     Use `imgSrc()` so each locale gets its own capture with the en fallback.
     Add `shot: 'shot-…'` to every `FEATURES` entry (today only two have it)
     and drop the `tile` field + `TILE_ICONS` (no grid any more — prove with
     grep that nothing else reads them).
     **No bezel**: the screenshot alone, `border-radius: 32px`, the mock's
     shadow. Width `--pw: min(340px, 38vh)`.
     The slide: each screen is `transform: translateY(calc(var(--t) * 100%))`
     with `--t: clamp(0, calc(var(--k) - var(--idx)), 1)`, `z-index: var(--k)`,
     `border-radius: 32px` on the image itself, and the lip shadow
     `box-shadow: 0 -14px 34px rgba(16,29,22, calc(var(--t) * (1 - var(--t)) * .9))`
     — so a settled screen has **no** shadow at the bottom (Ammar's explicit
     ask). `--idx` is set by JS on `.screen`.
   - **Eight `.floats` groups** (`data-floats="<i>"`, `aria-hidden`,
     `z-index: 10` — above the stacked screens, Ammar saw the cards vanish
     behind the phone once), each with **three `.fc` cards** from
     `story.cards.<key>` (`hero`, then the feature keys). Card *shape* is
     structure and lives in `site.config.mjs` as `STORY_CARDS`: per chapter
     three entries `{ kind, pos, dur?, color?, initial? }` where
     `kind ∈ pill | av | ico:<glyph> | tick | badge`, `pos` is the mock's
     inline position (`inset-inline-start:-36%;top:5%` — converted to logical
     properties; negative = hanging over the phone's edge), `dur` the drift
     period, `color` the avatar token (`--cat-plum` …), `initial` the avatar
     letter (a letter is decoration, not content — it stays in config, like
     the family tile's dots did). Take kinds, positions, icons (`ico` SVG
     paths as a small `STORY_ICONS` map: repeat, bell, cake, arrow, lock,
     photo, link) and durations **from the mock, card by card** — the mock is
     the spec. `t` renders bold, `s` small, `chk`/`tick` cards strike `t`
     through. Cards **do not move with the scroll** (no parallax — Ammar
     removed it); they drift ±6 px on a 6–8 s loop and fade in/out with the
     mock's `--in`/`--q` rule.
   - **Progress dots**: eight `<i>`, the active one wide; `aria-hidden`.
   - **Stage colour per chapter**: `.story[data-active="i"]` swaps
     `--stage-bg/fg/body/muted/eyebrow` exactly as the mock (0 paper,
     1 forest-deep + white text, 2 paper, 3 mint-soft, 4 amber-soft,
     5 paper, 6 ink + paper text, 7 mint), `.7s` transition.

3. **Five `.scene` slides after the story**, each
   `min-height: calc(100vh - var(--header-h))`, `scroll-snap-align: start`,
   content vertically centred, driven by `--p` (0 as the slide enters at the
   bottom edge, 1 when settled under the header):
   - `id="web"`: the browser window (`.laptop`, the real
     `/assets/img/web-calendar.webp` — the mock draws a placeholder calendar,
     **do not copy that**) enters full width, then shrinks to 55 % and slides
     to the inline-end side (`translateX(calc(30% * var(--dir) * var(--k)))`),
     while `.web-copy` (`web.eyebrow/h2/p/points[]/cta/note`) fades in
     **behind** it (`z-index` 0 vs 1). `web.cta` → `https://app.daili.app`
     `rel="noopener"`.
   - `id="how"`: `howItWorks.eyebrow/h2` then the three steps slide in from
     inline-end one after another (`.by.x`, `--a` .52/.66/.80). Steps are
     plain (top rule, big number, no card box).
   - `id="compare"`: heading + lead, then the table with the Daili column
     first (`.col1` `--a:.55`), shared calendar (`.col2` `.7`), paper
     (`.col3` `.85`) — the `.by` wraps a `<span>` inside each cell so the
     table geometry never changes. Keep `renderCompareTable` (marks from
     `COMPARE_MARKS`, the `d` class fallback), no card box, hairline rows
     only. Legend stays.
   - `id="pricing"`: `pricing.*` builds up (eyebrow → h2 → three points →
     promise → badges) on the left; the big `pricing.big` + `bigNote` rises on
     the right. No mint box, no border.
   - `id="faq"` (`class="scene last"`): `faq.*` (first `<details>` open, from
     `renderFaq`) and **the footer inside this last slide**, pinned to its
     bottom — with mandatory snap a footer outside the last slide can never
     be reached.

4. **Snap and the JS** (`static/assets/script.js`, replacing nothing — add a
   `story` block; keep header shadow, burger, download menu, language
   picker, chips, sticky CTA):
   - `html { scroll-snap-type: y mandatory; scroll-padding-top: var(--header-h) }`
     — only at ≥ 901 px and only on the landing page. The snap property must
     sit on the scroll container, which is `<html>`, and `<html>` carries no
     class today: add `page.htmlClass` in build.mjs (`'landing'` for the
     landing page, `''` otherwise), render it as
     `<html lang="…" dir="…" class="{{ page.htmlClass }}">` in layout.html,
     and write the rule as `html.landing { … }`. (`html:has(.story)` is NOT
     an option — Firefox ESR 115.) The blog and legal pages must not snap. While in layout.html: the burger's `aria-label="Menu"` becomes
     `aria-label="{{ nav.menu }}"` (key from 001).
   - One `frame()` on scroll/resize via `requestAnimationFrame`:
     `idx` = fractional chapter index **from the chapter geometry** (the
     chapter whose top is above the header line, plus how far it has
     scrolled past, divided by its own height) — not from a fixed slide
     height, because a long translation may make a chapter taller than one
     screen (`min-height`). Set `--idx` on `.screen`; per chapter
     `--p = clamp(1 - (i - idx))`, `--q = clamp((idx - i) / .5)`; the same on
     its `.floats`; `data-active = round(idx)`; per scene
     `--p = clamp((vh - (top - headerH)) / vh)`. With `prefers-reduced-motion`
     set every `--p` to 1 and `--q` to 0 (everything visible, screens still
     stack by `--idx` so the phone shows the right screen).
   - Keep the sticky CTA behaviour: it appears when the hero chapter is out
     of view (the existing IntersectionObserver on `.hero` — the hero chapter
     keeps that class).

5. **Mobile ≤ 900 px — a plain page, no snapping** (Ammar: "simple design
   for mobile, no slides"): `scroll-snap-type: none`; `.stage` hidden;
   every chapter is a stacked block: text first, then **its own screenshot**
   (`.mshot`, the same localized `shot-*`, `width: min(72%, 280px)`, radius
   26 px, shadow; `display: none` on desktop, lazy) — so render the `<img>`
   twice per chapter (stage + mshot); the browser loads one file. Stage
   colours off (paper throughout), a hairline between chapters, no cards, no
   dots. Scenes stack with normal padding; JS sets every `--p` to 1 on
   mobile and does nothing else. The footer returns to its normal place
   visually (it is still inside the last section).

6. **CSS hygiene**: every physical `left/right/margin-left/…` from the mock
   becomes its logical twin; the one `translateX` uses `--dir`; every colour
   is a token; dark mode values from the mock's `[data-theme]` blocks map onto
   the site's existing `prefers-color-scheme` block; `prefers-reduced-motion`
   stops the drift and every transition. **Delete** the rules the story
   replaces: `.hero` stack (`.stack`, `.laptop` hero copy, `.phone` bezel),
   `.trust`, `.bento`/`.tile`/`.t-*`, the boxed `.web`, `.steps` cards,
   `.price` box, `.faq` cards — no dead CSS. Keep `.legal`, blog, what's-new,
   support, 404 and store-badge rules working; the `.laptop` browser frame
   (bar + url) survives, reused by the web slide. Short screens:
   `@media (max-height: 760px)` tighten table padding and heading sizes as
   the mock does.

7. **build.mjs**: a `renderStory(loc)` helper returns `{ chapters, screens,
   floats, mshots }` (or one HTML string — your call, say which) from
   `FEATURES` + `STORY_CARDS` + `story.cards` + `features.<key>.*`; remove
   `renderFeatures`, `renderTrustPills`, `TRUST_ICONS`, `TILE_ICONS`, the
   hero `heroShots.web` (the browser window now lives only in the web slide;
   keep `web-calendar` sizing via `IMAGE_SIZES['web-']`). Every card must have
   exactly `t` and `s` or the build throws with the locale and chapter named.

8. **Guards** — rewrite `tools/check-build.mjs` section 15 for the new page
   and prove it can fail (delete one chapter from the template, run, restore;
   paste the failure line): the blocks in order are story (`<section
   class="story"`), `id="web"`, `id="how"`, `id="compare"`, `id="pricing"`,
   `id="faq"`; the story has exactly `FEATURES.length + 1` chapters, the
   same number of `.screen` images and of `.floats` groups, each group with
   exactly 3 `.fc`; the web slide links to `WEB_APP_URL` inside `id="web"`;
   the footer sits inside `id="faq"`; `class="bento"` and `class="tile"`
   appear nowhere. Section 14 (shot locale both ways) and 13 (fonts) stay
   green.

9. **`web-calendar.webp`**: if `static/assets/img/web-calendar.webp` is still
   the 2.9 KB mint placeholder from 014, build anyway but make it the
   **first owner action** in the report in bold: the web slide opens with
   that image full-screen, so the site must not be deployed until Ammar
   captures `app.daili.app/calendar` (week view, Bergers family, 1600×1000,
   webp) and replaces the file.

## Constraints

- No inverted sections; `{{? }}` only. `_storebadges.html` has no `id`s.
- Zero npm dependencies; no animation library; fonts from 011 only; the
  inline detector script is the only inline script (CSP hash) — the story JS
  goes in `script.js`.
- Do not add content keys.
- Write files with the file-write tool, never a shell heredoc.
- Self-correct up to 2 attempts, then `blocked`.

## Verify

- `npm run build`; `npm run serve`; Playwright screenshots into
  `claude-reports/2026-09-18/shots/`: `/`, `/de/`, `/ar/` at 1440×900 at
  scroll positions 0, 0.5 and 1 slides (the mid-slide one shows the screen
  sliding with rounded corners), at the web slide settled, and full-page at
  390×844. Also `/support.html`, `/privacy.html`, `/blog/` at 390.
  `document.documentElement.scrollWidth` at 360 px on `/` and `/ar/` must be
  360 (paste). At 1440×900 read `--idx` after `scrollTo(0, innerHeight - 64)`
  → must be 1.000 (paste). Total page height at 1440×900.

## Commit & push

- `feat(site): scroll-story home page — snapping slides, sticky phone, floating cards`
  — body `Prompt: claude-prompts/2026-09-18/002-scroll-story-home-page.md`.
  **Push now.**

## Report

- `claude-reports/2026-09-18/002-scroll-story-home-page.md`: deviations from
  the mock and why, the overflow and `--idx` numbers, page height, the guard
  failure proof, which CSS rules were deleted, owner actions (**web capture
  first**, then `./deploy.sh`), commit SHA.
