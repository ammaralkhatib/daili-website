# 002 — Wall display page: layout A (tiles + timeline)

Prompt: `claude-prompts/2026-11-12/002-wall-display-option-a.md`
Commits: `9c6e2afb` (docs: report 001, this prompt, mock v2, board.webp) and
`1dc0e953` feat(site): wall display page layout A. Both pushed to `main`.
`./deploy.sh` was not run. `static/assets/img/photos/` was not staged.

## What changed
- **Hero:** the words are the same, except the middle chip now says "Follow the steps". The headline is
  `clamp(38px, 5vw, 60px)`, and the grid is 5fr/6fr as in the mock.
- **Tablet:** the drawn tablet is gone: its HTML, its CSS, `--screen`, `--p1…--p4`, `WALL_WEEK`/`WALL_TODAY` and
  the `tablet` block in `wall/en.json`. In its place is `static/assets/img/wall/board.webp` (copied from the
  prompt folder, mode 644) inside the dark frame. It is an `<img width="1600" height="900" loading="eager"
  fetchpriority="high">`, and its alt text comes from the new `tabletAlt` key in `wall/en.json`. The build adds
  `?v=<sha8>` itself, so swapping the file needs no other change.
- **"Which device?":** a full-width `--mint-soft` container (radius 28, padding 24) with eight tiles: 4 per row
  on desktop and 2 per row at ≤ 900px. They are still plain `<a href="#id">` links with `aria-current`. The chosen
  tile is filled forest green. The sticky side rail is gone and the page is one column.
- **Device head:** the guessed line, then the name, the lead, four fact boxes (2 × 2 at ≤ 900px), then the
  progress bar. The guessed line now ends "Pick it above."
- **Steps:** a timeline. A mint line joins one number circle to the next, with no line after the last step and
  no border lines between steps. A ticked step's circle turns green. The jobs now sit in a `<div class="steps">`,
  so `:last-child` always finds the last step.
- **TV or other:** has `"plain": true`. A plain device gets no "Done" ticks and no progress bar in the HTML.
  `loadWall` accepts the flag but refuses anything other than true/false.
- **Text:** the help answer now says `as in the "Keep the screen on" step for your device`. The Mac step now
  reads `iMac or Mac mini: System Settings → Energy → Start up automatically after a power failure`.
- **check-build section 24:** now also checks that the page has the `board.webp` `<img>` with `?v=`,
  1600 × 900, an alt and no lazy loading, and that the file exists. It also checks that every non-plain device
  has one tick per step plus a progress bar, and that a plain device has neither. I broke the built page on
  purpose and both new checks fired.
- **README:** updated the wall guide section (`tabletAlt`, `plain`, the placeholder screenshot, tiles as the
  jump list).
- **wall.js:** removed `revealLink` (the phone's sideways device row no longer exists) and updated the header
  comment. Nothing else changed: hash links, Back/Forward, Copy and saved ticks work as before.

## Different from the mock, and why
- **Small phones (≤ 560px):** each tile puts its icon above the name, and the container's padding drops to
  16px. With the mock's icon-beside-text tiles at 360px, two tiles per row left about 60px for text, and
  "Window·s", "Raspber·ry Pi" and "Chrome·book" broke mid-word. The tiles are still 2 per row.
- **Eyebrow:** I kept the "Wall display guide" eyebrow, which the mock leaves out ("same words as now").
- **Mac step:** I kept the "iMac or Mac mini:" in front of the new path, because a MacBook has no Energy pane.
- **Tiles:** they stay links with `aria-current`. The mock uses buttons with `aria-pressed`.
- **Number circles on phone:** they now stay 42px, as in the mock. The old page shrank them to 36px.

## Doubts (not corrected)
- **Mac "Energy" pane:** "System Settings → Energy" is the name on recent macOS. On macOS 13 the pane was
  called "Energy Saver". I kept the prompt's wording.

## Build
`npm run build` passes (`build OK · 3484 pages`, `wall: /wall-display/ · 8 device guide(s) · en · noindex,
hidden`).

## What I looked at
Headless Chrome over CDP, serving `dist/`, with measurements read from the page and screenshots:
- **Desktop 1280:** 4 tiles per row, 4 fact boxes, the hero image loaded (1600 natural width), headline 60px.
  The timeline line shows on steps 1–4 and not on step 5. No guessed line with a hash; with no hash the line
  shows and the Mac is guessed (headless Mac user agent).
- **Breakpoint:** at 900px, 2 tiles and 2 × 2 facts; at 901px, 4 and 4.
- **Phone 360 and 390:** no sideways scroll (`scrollWidth` equals the viewport), 2 tiles per row, facts 2 × 2,
  no element sticks out, and no word breaks inside the tiles after the fix.
- **Dark mode (desktop and 390):** the container is `--mint-soft` dark (rgb 21,34,25), the page is dark, and the
  green ticks, circles and frame look right.
- **`#tv`** (clicking its tile and opening the hash): 0 ticks and no progress bar. The hash becomes `#tv`.
- **Saved ticks:** I ticked Windows steps 1 and 3. The page showed "2 of 5 done" with two green circles, and
  still did after a reload.
- **JavaScript off:** all eight guides show, and ticks, progress and Copy stay hidden.

## Help impact
None.
