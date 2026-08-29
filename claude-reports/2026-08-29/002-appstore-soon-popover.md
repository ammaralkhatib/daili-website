# The "coming soon" sentence is now a popover on the chip

Tapping the App Store badge opens a small card with an arrow touching the chip,
in all three places the badge appears, in all 23 locales, both themes, LTR and
RTL. No new strings: it is the same `<p class="store-soon">` the partial has
always rendered, restyled and positioned in place. No template, content or
config file changed.

Screenshots (no server needed): `shots/hero-360-light.png`,
`shots/hero-360-dark.png`, `shots/hero-360-ar-light.png`,
`shots/nav-menu-card.png`, `shots/cta-360-light.png`.

## What changed, per file

**`static/assets/style.css`** — one new block after `.store-soon`, plus five
lines in the dark block. Every rule hangs off `.soon-pop` or `.soon-anchor`,
both of which only `script.js` adds, so with JS off not one of them matches.
The card is `--card` on a 1px `--line` border, 14px radius, `--body` text,
`box-shadow 0 14px 34px rgba(var(--shadow),.18)`, `padding:11px 14px`,
`width:max-content` capped at `min(280px,calc(100vw - 32px))`, `z-index:35`
(above the page, below the sticky bar at 40), and a `.18s` fade-in that the
reduced-motion block already kills. Dark mode redefines the shadow to
`rgba(var(--shadow),.55)` — everything else is a token that flips on its own,
but `--shadow` becomes `0,0,0` there and `.18` of black on a near-black page is
invisible.

**`static/assets/script.js`** — the toggle block is rewritten. On load each chip
finds its note through the shared `.badges`/`.dl-menu` container (as before),
gives it `.soon-pop`, a generated `id` (`store-soon-1..3` — the partial is on
the page three times, so ids cannot come from the template), hides it, and
points the chip's `aria-describedby` at it. `aria-expanded` tracks open/closed
exactly as it did. `closeCards()` sweeps every chip, so only one card is ever
open; it is called from the chip handler, the document click handler, the
dropdown button and Escape. Escape closes the card and returns focus to the
chip. The chip's `stopPropagation()` — the thing that keeps the nav dropdown
open — is unchanged.

## Clamping and the arrow

`place()` works in a single **inline** axis: `inlineStart()` returns the
distance from a reference's inline-start edge, which is `left` in LTR and
`right` in RTL, and everything downstream is written against that. So `/ar/`
mirrors with no second code path and no physical `left`/`right` anywhere. The
card is positioned with `insetInlineStart` / `insetBlockStart`.

The card wants `chipMid - width/2`. That is then clamped between
`EDGE - boxStart` and `viewport - EDGE - width - boxStart`, where `boxStart` is
the container's own distance from the viewport's inline-start edge — subtracting
it is what converts viewport bounds into the container's coordinates. Below
~312px viewport the two bounds cross; the card then parks at the low bound
rather than oscillating.

The arrow is a 12px square at `top:-6px`, rotated 45°, given the card's
background so it hides the card's top border where they overlap. Its tip sits
8.5px above the card, and the card sits 8px below the chip, so the tip touches
the chip's bottom edge. Its offset is `chipMid - cardStart - 6` written to a
`--soon-arrow` custom property, i.e. it moves back by exactly however much the
clamp pushed the card, then is limited to 10px from either end so it cannot
climb onto a rounded corner. **Its borders are physical** (`border-top` /
`border-left`), deliberately: `rotate()` does not mirror in RTL — the file's own
`--rot-*` note says as much — so `border-inline-start` would have pointed the
tip sideways in `/ar/`. Only its offset is logical. Verified pointing at the
chip in all 18 locale × width × position combinations, including the clamped
`/ar/` nav case.

## What the nav dropdown needed

Nothing. `.dl-menu` has no `overflow`, so it does not clip the card — measured
by walking every ancestor and comparing rects: no clipper. `templates/layout.html`
is untouched. Two things did have to respect it: `.soon-anchor` (`position:relative`)
is applied **only** where the container is still `position:static`, since
`.dl-menu` is already absolute and turning it relative would drop the dropdown
into the flow; and the card's `z-index:35` sits inside `.dl-menu`'s own
stacking context at 30, which is already above the page.

## Decided differently

1. **The card is `pointer-events:none`.** Not in the brief, and it cost me the
   ability to select the sentence — but at 360px in **English** the badge row
   wraps (the chip is 162px, Play is 152px, and the content box is 320px), and
   the card lands squarely on top of the Google Play badge. Without this the
   card swallows the tap and Play is unreachable until you dismiss it. With it,
   the tap passes through to Play and the document handler closes the card on
   the way — one tap, verified by hit-testing the Play badge's centre while the
   card covers it, in the hero and in the nav dropdown. Consequence: a tap on
   the card also closes it. §5 asks that outside taps, a second chip tap and
   Escape close it; all three still do.

2. **`.soon-anchor` carries `z-index:35`, not just `position:relative`.** In the
   hero, `.badges` is a `.hero .copy > *` and so runs the `rise` intro
   animation. Its final keyframe is `transform:none`, but with
   `animation-fill-mode:forwards` Chrome leaves the computed value as the
   identity matrix, not `none` — which still makes `.badges` a stacking context
   and traps the card's `z-index` inside it. The first build painted the card
   **under** the `Free · No ads · Your data stays in the EU` line. Caught in the
   first screenshot; the z-index on the anchor fixes it.

3. **Escape is layered.** With a card open inside the nav dropdown, Escape
   closes the card only and focuses the chip; a second Escape closes the menu,
   as it always did. Closing both at once would have put focus on a
   `display:none` button, which §5's "returns focus to the chip" cannot mean.

4. **A `resize` listener, but still no `scroll` listener.** §4 forbids the
   latter and absolute positioning makes it unnecessary. A resize, though,
   changes both the clamp and whether the badge row wraps, so an open card is
   repositioned. Verified 1280 → 360 → 1280 with the card open.

## Verified

1. `npm run build` clean (content OK · 23 locales · 158 keys → 52 pages → build
   OK → detector OK · 32 cases; the same 10 pre-existing length warnings).
   `/usr/bin/grep -rn "apps.apple.com" dist/` → no matches.
2. Headless Chrome over the DevTools protocol against `npm run serve`, at
   **360px** and **1280px**, on `/`, `/de/` and `/ar/` — 18 combinations. For
   every one of the **three** chips: the card opens, is fully inside the
   viewport, and its arrow tip lands within the chip's own bounds. Opening one
   closes the other two (`aria-expanded` follows). The nav dropdown stays open
   when its chip is tapped.
3. Second tap closes; outside tap closes; Escape closes and
   `document.activeElement === the chip`; closing the dropdown by its button
   also closes the card inside it.
4. **§8 scrollWidth at 360px**, measured at a fixed scroll position so the
   `.reveal` transforms are settled: `closed 476 → open 476 → closed 476` for
   the hero, and never above 476 for the bottom CTA, in `/` and `/ar/`. That is
   the same pre-existing 476 report 001 recorded; the card adds nothing.
5. **JavaScript disabled** (`Emulation.setScriptExecutionDisabled`, inspected
   over `DOM`/`CSS` rather than by script): all three `.store-soon` nodes are
   `display:block`, `position:static`, `class="store-soon" role="status"` — no
   `id`, no `aria-describedby`. Zero `.soon-pop` / `.soon-anchor` nodes on the
   page. The two in `.badges` are laid out (320px and 274px wide); the third is
   inside the closed `.dl-menu`, exactly as before.
6. **Themes.** Light: card `#FFFFFF` on page `#FCFAF4`, border `#E7E2D5`, text
   `#2A3830`. Dark: card `#16201B` on page `#0E1512`, border `#25332C`, text
   `#C9D6CE`, shadow `rgba(0,0,0,.55)`. Arrow fill and borders match the card in
   both.
7. **iPhone UA, narrow viewport:** the sticky bottom bar is unchanged from
   prompt 001 — `<span class="sticky-soon">…</span>` plus the close button, zero
   `<a>` inside, close still dismisses it. It is not a `.store-soon`, so none of
   this touches it. Neither badge is `.primary` on iOS.

Not deployed — `./deploy.sh` not run.
