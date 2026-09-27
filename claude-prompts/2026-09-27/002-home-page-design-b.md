# Design B 2/2 — rebuild the home page as "Paper & Mint editorial"

## Goal

Re-skin the home page to **Design B** from the Claude Design canvas (Ammar's
pick, 2026-09-27): `claude-prompts/2026-09-27/design-b-mock.html` is the spec —
open it in a browser and read it end to end before writing anything. The
scroll-story *machinery* from 2026-09-18 (mandatory snap on desktop, sticky
phone, screenshots sliding up, `--p/--q/--idx` in script.js, plain stacked
mobile page) **stays**. What changes is the page around it:

- a centred editorial **hero** (huge condensed headline with the hand-drawn
  underline, no phone next to it),
- a new **showcase** slide: a rounded panel with a slow *video* behind an
  upright phone and three floating cards,
- the story with the phone on the **inline-start side on a mint slab** and
  numbered chapters, calm cream throughout (no per-chapter colour swaps, no
  floating cards in the story any more),
- a new **"life"** slide: a video card with a title over it + three fact cards,
- a **centred pricing** slide with the giant €0,
- web / how / compare / FAQ+footer keep their current mechanics, restyled only
  where the mock shows it.

Prerequisites — check all three, else stop and report `blocked` naming which:
1. 001 merged (`git log` shows `content: Design B home page strings`).
2. `ffmpeg` on PATH (`which ffmpeg`). Missing → owner action
   `brew install ffmpeg`.
3. The two source videos exist (Ammar downloads them from his Higgsfield
   library; links in `/Users/ammarkhatib/Claude/Projects/Family Planner/website-redesign-2026-09-26/README.md`):
   - `/Users/ammarkhatib/Claude/Projects/Family Planner/website-redesign-2026-09-26/video/showcase-src.mp4` (the sage pebbles)
   - `/Users/ammarkhatib/Claude/Projects/Family Planner/website-redesign-2026-09-26/video/life-src.mp4` (the kitchen table, top-down)

Done = `npm run build` clean (all four links); `/`, `/de/`, `/ar/` render at
1440×900, 1280×720 and 390×844 with **no horizontal overflow**; the videos play
on desktop and stay a poster on mobile / reduced motion; every other page
still looks right with the new CSS.

## Scope

- **In:** `templates/landing.html`, `static/assets/style.css`,
  `static/assets/script.js`, `build.mjs`, `site.config.mjs`,
  `tools/check-build.mjs` (section 15), `static/assets/video/` (new folder,
  four files), `static/.htaccess` **only** to add `mp4` to the long-cache
  file pattern next to `webp` (check first — if `mp4` is already covered, do
  not touch the file).
- **Out:** `content/*.json` (001 did it; a missing key → stop and report
  which), legal, blog, help, what's-new, deploy. **Never run `./deploy.sh`.**

## Step 0 — the two videos (before any HTML)

Encode both sources into `static/assets/video/` (`static/` is copied verbatim
to `dist/` — nothing else may land there, never the sources):

```
ffmpeg -y -i "<src>" -an -vf "scale=1280:-2,fps=24" -c:v libx264 -profile:v high \
  -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart static/assets/video/<name>.mp4
ffmpeg -y -i static/assets/video/<name>.mp4 -frames:v 1 -c:v libwebp -quality 80 \
  static/assets/video/<name>.webp
```

`<name>` = `showcase` and `life`. Targets: each `.mp4` **≤ 2.5 MB** (raise
`-crf` to 30, then 32, until it fits — paste the final sizes), each poster
`.webp` ≤ 120 KB. Both clips are 8 s and loop; if the first and last frames
differ visibly, that is acceptable (the loop point sits behind the phone /
under the title). No audio track at all (`-an`).

## The page, top to bottom (desktop ≥ 901 px)

Every block is one snap slide (`min-height: calc(100vh - var(--header-h))`,
`scroll-snap-align: start`) unless said otherwise; the order is asserted by
guard 15 (below). Numbers are the mock's; keep them.

1. **Header** unchanged. The nav CTA becomes the filled forest pill
   (`Get Daili — free` = `cta.sticky`, already there); the language button
   is a 44 px round outline button as in the mock.

2. **`<section class="hero" id="hero">`** — centred, text only:
   `hero.chip` in a white pill with a green dot; `h1` = `hero.h1a` +
   `<em>hero.h1b</em>` with the hand-drawn amber underline SVG under the
   `em` (the mock's `<path>`; keep the SVG inline, `aria-hidden`); the
   headline is `--display` at `clamp(88px, 10.5vw, 156px)`, line-height .9,
   max-width 1100; `hero.lead` centred (max-width 680, 22 px); the store
   badges partial + `hero.webLink` → `https://app.daili.app`; `hero.notes[]`
   as the "Free · No ads · Servers in the EU" row separated by hairline
   middots. Keep `class="hero"` on this section: script.js's sticky-CTA
   IntersectionObserver keys on it. The `.by` build-up: chip `0/.04`,
   h1 `0/.06`, lead `.04/.06`, badges `.08/.06`, notes `.12/.06` — complete
   on load whatever the window height. **The h1 is the LCP now, not the
   phone image.**

3. **`<section class="showcase" id="showcase">`** — the video panel:
   - `<h2 class="sr-only">showcase.h2</h2>` (visually hidden; the section
     needs a heading and the guard looks for it).
   - `.panel`: `max-width: 1328px`, `height: min(760px, calc(100vh - var(--header-h) - 120px))`,
     `border-radius: 40px`, `overflow: hidden`, `background: var(--mint-soft)`,
     the mock's soft shadow. Inside, in this order:
     - `<video class="panel-video" muted loop playsinline preload="none"
       poster="/assets/video/showcase.webp" aria-hidden="true"
       data-autoplay>` with one `<source src="/assets/video/showcase.mp4" type="video/mp4">`.
       **No `autoplay` attribute** — script.js starts it (rule below). The
       poster is what everyone without JS, on mobile, or with reduced motion
       sees. `object-fit: cover`, opacity `.9`.
     - the radial cream vignette `div` from the mock (`aria-hidden`).
     - the phone: **bezel-less**, bottom-anchored, `width: 300px`, top
       corners `36px`, no bottom corners (it rises out of the panel's bottom
       edge); the image is the localized `shot-home` via `imgSrc()`,
       `alt="{{ showcase.alt }}"`, `loading="lazy"` (it is below the fold at
       every size — the hero slide is first). Use the phone-rising shadow from
       the mock.
     - **three floating cards** = `story.cards.hero` drawn with
       `STORY_CARDS.hero` (kinds/positions/durations from the mock's four
       cards: take the first three — pill *Piano lesson* left-top, `ico:cart`
       *Milk* right-top, `ico:cake` *Emma turns 12* right-bottom; positions as
       logical properties, `inset-inline-start`/`-end`, drifting ±12 px on
       8–10 s). Same `.fc` markup and `storyCard()` helper as today, just
       rendered here instead of inside the story. Card content stays the
       three `story.cards.hero` strings — if the mock's card text differs
       from the key's text, **the key wins** (the mock was written by hand).
     - the bottom pill: `showcase.pill` in the dark blurred pill, centred at
       the bottom, green dot in front.
   - Under the panel, the **chip row**: one white outlined pill per
     `FEATURES` entry with `features.<key>.eyebrow` (7 chips; the mock shows
     8 — drop "Home-screen widgets", there is no key). Centred, wraps.

4. **`<section class="story" id="story">`** — the existing machinery with
   these changes:
   - `.wrap` grid becomes **stage first, chapters second**
     (`grid-template-columns: 520px minmax(0, 1fr); gap: 96px`), so the phone
     sits on the inline-start side and mirrors in Arabic by itself.
   - `.stage` is the **mint slab**: `position: sticky; top: var(--header-h)`,
     `height: calc(100vh - var(--header-h))`, inside it a `520 × min(720px, 100%)`
     rounded (40 px) `var(--mint)` box, bottom-anchored phone (bezel-less,
     `--pw: 300px`, top corners 36 px, no bottom corners, the rising shadow),
     the small label top-start: `<span class="disp">daili</span>` — the bare
     wordmark is a *display* context, so lowercase — over a muted
     "iPhone · Android" line (no key: it is the two product names joined by a
     middot, same as `hero.kicker` used to be; build it in the template, not
     in content).
   - **Chapters = `FEATURES` only, 7 of them** (the hero is no longer a
     chapter). Each: `<span class="num">0N — {{ eyebrow }}</span>` (N =
     1-based, two digits, `--display` 20 px, muted, letter-spacing .08em —
     **no `text-transform: uppercase`**: it breaks Turkish/Greek casing and
     does nothing for CJK), `h2` at 68 px, `p`, `bullets[]` (unchanged
     rendering), a hairline `border-block-end` between chapters. `.by`
     timings as today (title `.45/.14`, paragraph `.6/.12`, bullets from
     `.7`).
   - **Screens: 7** (`shot-calendar` … `shot-family` in FEATURES order, the
     first one `--k:0` not lazy since it is the slab's first paint; the rest
     lazy). The slide rule (`--t`, lip shadow only mid-slide, z-index) is
     unchanged.
   - **No `.floats` in the story** (the cards moved to the showcase), **no
     stage colour swaps** (`.story[data-active]` rules go; the page stays
     `--paper`), **progress dots stay** (7).
   - Because the hero is no longer chapter 0, `--idx` now starts at 0 on the
     calendar chapter — script.js's geometry-based `idx` needs no formula
     change, only the assumption "chapter 0 = hero" wherever it was used
     (the `data-active` colour code, the `.hero` mshot). Check every place
     that reads `chapters[0]`.

5. **`<section class="scene" id="life" data-scene>`** — new slide, one
   `.wrap` grid `minmax(0,1fr) 420px; gap: 32px`:
   - `.life-card` (`border-radius: 32px`, `min-height: 440px`, ink
     background): `<video class="panel-video" muted loop playsinline
     preload="none" poster="/assets/video/life.webp" aria-hidden="true"
     data-autoplay>` + mp4 source; the bottom gradient; over it `life.h2`
     (`--display` 44 px, white) and `life.p` (15 px, 80 % white). Build-up:
     card `.35/.15`.
   - three `.fact` cards from `life.facts[]` (`t` in `--display` 40 px
     forest, `s` 15 px; the third card inverted: ink background, mint `t`) —
     render via a small `renderFacts(loc)` in build.mjs that **throws** when
     the array is not exactly 3 `{t,s}` objects (locale named). `.by`
     `.5/.1`, `.6/.1`, `.7/.1`.

6. **`id="web"`** — keep the current mechanics (window enters full width and
   shrinks aside while the copy fades in behind). Restyle only: the window
   gets the mock's `1px` hairline border + the softer shadow. Nothing else.

7. **`id="how"`, `id="compare"`** — unchanged.

8. **`id="pricing"`** — **centred** layout: `pricing.eyebrow`, then the
   giant `pricing.big` (`--display` `clamp(140px, 16vw, 220px)`, forest,
   line-height .85), `pricing.h2` (64 px), **`pricing.lead`** (new key from
   001) under it, then `pricing.points[]` as three small white outlined pills
   in a row (they were a list — the strings are short enough), then the
   `promise` block (title + text, max-width 640, centred), then the badges +
   `hero.webLink` button row. Build-up top to bottom `.35 → .85`. The
   `bigNote` stays as `<small>` under the price.

9. **`id="faq"` + footer** — unchanged (footer stays inside the last slide).

## script.js

- **Video policy** (new block, after the story block): for every
  `video[data-autoplay]`: play it only when **all** hold — viewport
  `≥ 901px`, `prefers-reduced-motion: no-preference`, `navigator.connection`
  absent or `saveData !== true`, and the video's section is within one
  viewport of the visible area (an `IntersectionObserver` with
  `rootMargin: "100% 0px"`; pause + `preload` stays `none` when it leaves).
  On `play()` failure (autoplay policy) do nothing — the poster stays. Re-run
  the check on `resize` and when the reduced-motion query changes.
- The story block: adapt to 7 chapters / no floats / no `data-active`
  colours; **do not** remove the `--q` fade or the reduced-motion branch.
- Sticky CTA: still keyed on `.hero` (now the hero *section*).
- No other behaviour changes. No inline script (CSP hashes).

## Mobile ≤ 900 px — the plain page, as today

- No snap, no sticky stage; the hero centred with the headline at
  `clamp(56px, 15vw, 88px)`; the showcase panel `height: 520px`, phone
  `width: min(60%, 240px)`, cards hidden, video **not** started (poster
  only); the chip row scrolls horizontally in one line
  (`overflow-x: auto; scroll-snap-type: x proximity`, no visible scrollbar);
  the story = each chapter as text + its own `.mshot` (unchanged); the life
  slide = video card (poster) above the three facts stacked; pricing
  centred as on desktop. `document.documentElement.scrollWidth` at 360 px
  must equal 360 on `/` and `/ar/`.

## CSS hygiene

- Logical properties everywhere (`inset-inline-*`, `padding-inline`,
  `border-block-end`); the one `translateX` keeps `--dir`.
- Every colour is a token; new ones only if the mock uses a value no token
  has (then add it to the `:root` block **and** the dark block).
- Dark mode: the mint slab → `--mint` dark value, the showcase panel
  `--mint-soft` dark value, fact cards `--card`, the inverted card stays ink;
  the video posters are light — put a `rgba(14,23,18,.35)` overlay on
  `.panel-video` in dark mode so the page does not glare.
- `prefers-reduced-motion`: no drift, no transitions, videos never started
  (the JS rule) — and the CSS hides the `<video>` element entirely in that
  case so the poster shows through `background-image` on the wrapper? **No:**
  simpler — keep the `<video>`; a paused video shows its poster. Just make
  sure nothing animates.
- **Delete** the rules the redesign retires: the story's per-chapter
  `[data-active]` colour blocks, `.floats` positioning inside `.stage`
  (the `.fc` card rule itself survives, used by the showcase), the hero's
  side-by-side grid, the hero `mshot`, and the pricing two-column layout.
  Grep for each deleted selector in every template before removing it —
  no dead CSS, no missing CSS.

## build.mjs / site.config.mjs

- `renderStory(loc)` now returns chapters (7), screens (7), dots (7) and
  mshots — **no floats, no hero chapter**; a new `renderShowcase(loc)`
  returns the three cards (from `STORY_CARDS.hero` + `story.cards.hero`)
  and the chip row; `renderFacts(loc)` as above. `STORY_CARDS` keeps only
  the `hero` entry (the seven feature entries go; `STORY_ICONS` keeps only
  the glyphs still referenced — prove with grep). The
  `story.cards.<feature>` keys in `content/*.json` become **idle** — leave
  them (content is out of scope) and list them in the report under "idle
  keys to delete in a content prompt".
- `IMAGE_SIZES` and `imgSrc()` unchanged; the showcase phone and the seven
  story screens use the localized captures with the en fallback, as before.
- `page.video = { showcase: '/assets/video/showcase.mp4', … }` — or
  hard-code the four paths in the template; your call, say which.

## Guards — rewrite `tools/check-build.mjs` section 15, prove it can fail

Delete the `id="life"` section from the template, run, paste the failure
line, restore. The section asserts, on every landing page:

- blocks in this order: `class="hero"`, `id="showcase"`, `class="story"`,
  `id="life"`, `id="web"`, `id="how"`, `id="compare"`, `id="pricing"`,
  `id="faq"`;
- the story has exactly `FEATURES.length` chapters, the same number of
  `.screen` images and of `.mshot` images, exactly `FEATURES.length` dots,
  and **no** `class="floats"`;
- the showcase has exactly 3 `.fc` cards, one `<video … data-autoplay>` with
  a `poster` under `/assets/video/` and **no `autoplay` attribute**; the same
  for the life slide; both posters and both `.mp4` files exist in `dist/`
  and each `.mp4` is under 2.6 MB;
- `class="sr-only"` heading inside `id="showcase"`; the footer inside
  `id="faq"`; `class="bento"`, `class="tile"` and `data-active` appear
  nowhere;
- the `text-transform` word does not appear in `style.css` inside a rule
  that starts with `.story` (the casing trap).
Sections 13 and 14 stay green.

## Constraints

- No inverted sections; `{{? }}` only. `_storebadges.html` has no `id`s
  (it is now included in hero + pricing + nav = three times, as before).
- Zero npm dependencies, no animation library, self-hosted fonts only, one
  inline script (the detector) only.
- Do not add content keys. Do not touch `content/*.json`.
- Write files with the file-write tool, never a shell heredoc.
- Self-correct up to 2 attempts, then `blocked`.

## Verify

- `npm run build`; `npm run serve`; Playwright screenshots into
  `claude-reports/2026-09-27/shots/`: `/`, `/de/`, `/ar/` at 1440×900 at
  the hero, the showcase (video playing — screenshot after 1.5 s must differ
  from the poster; paste the pixel-diff count or a "frames differ" line),
  chapter 2 mid-slide, the life slide, pricing; full-page at 390×844 for
  `/` and `/ar/`. Also `/support.html`, `/privacy.html`, `/blog/`, `/help/`
  at 390 (CSS regressions).
- `scrollWidth` at 360 on `/` and `/ar/` (paste).
- With `prefers-reduced-motion: reduce` emulated at 1440×900: both videos
  `paused === true` (paste).
- At 390×844: both videos `paused === true` and `networkState` shows no
  media fetched (`preload="none"` honoured; paste).
- Total `dist/index.html` weight + transferred bytes for `/` at 1440×900
  with and without the videos (Playwright `request` sizes; paste both
  numbers — Ammar wants to know the cost).

## Commit & push

- `feat(site): Design B home page — editorial hero, video showcase, mint-slab story, life + centred pricing`
  — body `Prompt: claude-prompts/2026-09-27/002-home-page-design-b.md`.
  **Push now.**

## Report

- `claude-reports/2026-09-27/002-home-page-design-b.md` (≤ one page):
  deviations from the mock and why, the video sizes, the weight numbers, the
  overflow and reduced-motion proofs, the guard failure proof, deleted CSS
  rules, idle keys, owner actions (`./deploy.sh`, then a phone + laptop
  hand-test), commit SHA.
