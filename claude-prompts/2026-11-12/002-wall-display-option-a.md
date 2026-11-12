# Website: wall display page — new layout "Option A" (tiles + timeline)

## Goal
Ammar picked a new layout for `daili.app/wall-display/` (built in `2026-11-12/001`, commit `d4138efa`). The device
list moves from the side into a wide light container with big tiles, the four facts become four boxes, the steps
run down one line, and the hero tablet shows a real screenshot of the wall board instead of the drawn one.

**Design source:** `claude-prompts/2026-11-12/wall-display-mock-v2.html` (open it in a browser; `board.webp` lies
next to it). The mock holds three options behind a dark bar. **Build option A only** (it is the default view).
Ignore the dark "Design option" bar, everything for `.opt-b` / `.opt-c`, and the mock's footer line.

## Requirements
1. **Hero.** Same words as now. The headline is smaller: `clamp(38px, 5vw, 60px)` (mock `.hero h1`). The three
   "how" chips stay; the middle one now reads **"Follow the steps"** (not "five").
2. **Tablet = a screenshot.** Copy `claude-prompts/2026-11-12/board.webp` to `static/assets/img/wall/board.webp`
   and show it inside the dark tablet frame (mock `.tablet`): `<img>` with `width="1600" height="900"`, a real
   `alt` from `wall/en.json`, loaded eagerly (it is the hero). Remove the drawn tablet: its HTML, its CSS, the
   `--screen` and `--p1…--p4` tokens, and the whole `tablet` block in `wall/en.json` (replace it with the one alt
   text). The image is a placeholder; Ammar will swap the file later, so nothing else may depend on its content.
3. **"Which device?" container.** A full-width container with the light mint background (`--mint-soft`, radius
   28px, padding 24px), the heading inside it, and the eight devices as tiles in a grid: 4 columns on desktop,
   2 columns at ≤ 900px (mock `.pick`, `.opt-a .pick .devs`, `.dev`). Each tile: icon, name, sub line; white card
   with a thin line; the chosen one is filled forest green. The tiles stay plain `<a href="#id">` links with
   `aria-current`, as now. No sticky side rail any more; the page is one column.
4. **Device head.** Under the container: the guessed-device line, the device name, the lead, then the **four
   facts as four separate boxes** in one row (2 × 2 at ≤ 900px): white card, thin line, radius 16px, small grey
   label over a bold value (mock `.facts`, `.fact`). Then the progress bar.
   Change the guessed line to end with "Pick it above." (it said "in the list").
5. **Steps as a timeline.** Each step: number circle on the left, title, steps, tip, command boxes, "Done" tick.
   A thin mint line joins the circles from one step to the next; no line after the last step (mock `.a-job`).
   A ticked step's circle turns forest green, as now. No border lines between steps any more.
6. **Text fixes** in `wall/en.json`:
   - TV or other: this section is information, not a setup. Give the device `"plain": true`; a plain device shows
     no "Done" ticks and no progress bar (HTML and JS). The build check accepts the flag.
   - "Something not working?" first answer: `as in the "Keep the screen on" step for your device` (was "step 3").
   - Mac, start-by-itself step: `System Settings → Energy → Start up automatically after a power failure`.
7. **Everything else stays:** "Now hang it up" (once, after the steps), "Battery and safety", "Something not
   working?", the hidden switch `WALL_GUIDE_PUBLIC = false`, the no-JavaScript behaviour (all eight guides show,
   the tiles jump to them), hash links like `#windows`, Copy buttons, saved ticks, dark mode, focus rings, the
   `wall/<locale>.json` translation path. Update `tools/check-build.mjs` section 24 and the README only where this
   change makes them wrong (for example: the page now must contain the `board.webp` image).

## Constraints
- All styles stay in `static/assets/wall.css`, all words in `wall/en.json`, zero dependencies, site tokens only.
- Do not "correct" menu names from your own knowledge; list doubts in the report.
- Do not touch other pages.

## Verify
- `npm run build` passes.
- `npm run serve` → `/wall-display/`: check desktop, phone width (no sideways scroll; tiles 2 per row; facts 2 × 2)
  and dark mode; `#tv` shows no ticks and no progress bar; a tick on another device still survives a reload;
  JavaScript off still shows all eight guides. Say in the report what you looked at.

## Commit & push
First commit the pending docs (`claude-reports/2026-11-12/001-…md`, this prompt, the v2 mock and `board.webp` in
`claude-prompts/2026-11-12/`). Then `feat(site): wall display page layout A (tiles, fact boxes, timeline, real
screenshot)`; body `Prompt: claude-prompts/2026-11-12/002-wall-display-option-a.md`.
🔴 Do NOT stage `static/assets/img/photos/`. **Push now. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-11-12/002-wall-display-option-a.md` (file-write tool; `wc -c` > 0), short, plain English:
what changed, anything you did differently from the mock and why, build result, what you looked at, SHA + push.
`## Help impact`: none.
