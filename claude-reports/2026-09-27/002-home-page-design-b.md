# Report — 002 Design B 2/2, the home page rebuild

Prompt: `claude-prompts/2026-09-27/002-home-page-design-b.md`
Commit: `09032b5a47116f3d7e0bda1aebbbfe3e2f519220` (pushed)
`feat(site): Design B home page — editorial hero, video showcase, mint-slab story, life + centred pricing`
Status: **done**, with one build caveat (below).

## Build

`npm run build` **fails at `check-help`**, before this prompt's code runs:
`app route "/meal-plan/suggest" has no article`. The route came from the app
repo's `36d8bd86` (2026-09-26 22:57). It is the same failure 001 reported, and
it belongs to the help lane. With `HELP_SKIP_ROUTE_CHECK=1` every link is green:
content OK, legal OK, test-check-help OK, `build OK · 2034 pages`, `detector OK`.

## Videos (CRF 28 was enough)

| file | size |
|---|---|
| showcase.mp4 | 327,272 B |
| life.mp4 | 372,214 B |
| showcase.webp | 17,286 B |
| life.webp | 13,002 B |

This Homebrew ffmpeg has no `libwebp`. So the poster frame went out as PNG
(ffmpeg) and was then encoded with `cwebp -q 80`. `life-src.mp4` is a steaming
mug on a sunlit table, not a top-down shot. I used it as supplied.

## Proofs (headless Chrome over CDP, local server for dist/)

- **Overflow** (`scrollWidth == clientWidth`): passes for `/`, `/de/` and `/ar/`
  at 1440 and at 1280×720, for `/` and `/ar/` at 390 and at **360 (360 = 360)**,
  and for support, privacy, blog and help at 390.
- **Video plays**: showcase frame vs poster at t=3.1 s differs in **20,552 of
  57,600** sampled pixels (en; de 20,652; ar 20,552). It pauses when you leave,
  and the life video only starts at its slide.
- **Reduced motion, 1440×900**: both videos `paused:true`, `readyState 0`, **no
  mp4 request**.
- **390×844**: both videos `paused:true`, `networkState 1`, `readyState 0`,
  **mp4 requests: []**.
- **Weight**:
  - `dist/index.html` is 41,425 B.
  - `/` at 1440 after scrolling the whole page transfers **1,235,507 B with the
    videos** (699,936 B of that is mp4) and **535,571 B without** (reduced
    motion).
- **Slides taller than one screen**:
  - At 1280×720: web +142, compare +82, faq +208 px. These are **identical on
    the pre-change build** (I measured 1c33001 in a worktree), so they are not
    new.
  - At 1440: compare +100 and faq +51. I did not measure these on the old
    build, but this prompt left both slides' markup and CSS untouched.
  - Every new slide fits at both sizes.
- **Guard proof**: with `id="life"` deleted, the check fails 56 times, e.g.
  `index.html has no life block (id="life") where the mock puts it …` plus
  `the life slide has 0 <video> elements, expected 1`. With the section
  restored it passes again. Sections 13 and 14 are still green.

Shots: `claude-reports/2026-09-27/shots/` (WebP). That covers hero, showcase,
chapter-2 mid-slide and settled, life and pricing for en/de/ar at 1440 and
1280, the 390 full pages for en and ar, three dark-mode stills, and the other
four pages at 390.

## Deviations from the mock and why

- **Third showcase card**: I drew it as a `tick`, not the mock's cake. Its key
  text is "Take out the bins · Noah · done" ("the key wins"), so a cake icon
  would be wrong.
  - Positions are the mock's, as percentages of the panel.
  - `STORY_ICONS` keeps only `cart`.
- **Nav CTA label** still reads `nav.download`. `templates/layout.html` is not
  in scope, and the button is already the filled forest pill. Switching it to
  `cta.sticky` is a one-token change if you want it.
- **Language button**: 44px tall, round, outline. It keeps the language code
  next to the globe and drops the chevron.
- **Hero h1 for ar/th/hi/ja/ko/zh**: `clamp(56px, 7vw, 104px)`. The display
  face has no glyphs for these scripts, and the system fallback at 156px was
  three lines and 105px over the slide in Arabic.
- **Story grid**: `min(520px, 45%) / 1fr`, gap `min(96px, 6vw)`. This is the
  mock's 520/96 from about 1160px up. Anything narrower, down to 901px, would
  otherwise squeeze the chapters.
- **Progress dots**: moved to the slab's top inline-end corner, because the
  phone fills the slab's bottom edge.
- **Short screens (≤760px tall)**: the hero headline, the chapter h2 and the
  €0 get smaller so every new slide fits 1280×720.
- **Video paths** are hard-coded in `landing.html`, not passed through build.mjs
  (my call: four fixed files).

## CSS deleted

- The `.story[data-active]` colour blocks and the `--stage-*` tokens (in both
  light and dark).
- `.floats` and `.device`.
- The hero's chapter rules: `.chapter h1`, `h1 em`, `.lead`, `.note`,
  `.eyebrow`, and the hero mshot.
- The two-column `.price` grid and its ✓ list.
- The `.story` colour transition.

Each selector was grepped in templates and build.mjs first.

## Idle keys to delete in a content prompt (× 28)

`story.cards.{calendar,shopping,todos,meals,birthdays,vault,family}`,
`hero.kicker`, `hero.altCalendar`, `hero.altHome`.

Also for content: ar `life.facts[1].t` wraps to two lines in its card. It still
fits, but it would read better shorter.

## Help impact

none

## Owner actions

1. Help lane: write the article for `/meal-plan/suggest`, or mark it
   `pending`, so `npm run build` goes green without the skip.
2. `./deploy.sh`.
3. Hand-test on a phone and a laptop: the videos play on the laptop, stay a
   poster on the phone, and the snap feels right.
