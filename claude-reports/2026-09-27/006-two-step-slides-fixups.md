# Report — 006 two-step slides fixups

Prompt: `claude-prompts/2026-09-27/006-two-step-slides-fixups.md`
Commit: see `git log` — `fix(site): two-step slides settle complete, two-line titles, compare lead under title, looping showcase clip` (pushed)
Status: **done**

## Build

`npm run build` is green with no env skips: `build OK · 2034 pages`, `detector OK`. The 17 content-length warnings were there before; no content changed.

## What changed

- **Reveal timing.** Every `.by` in web, how, compare and pricing now ends by `--p .85`:
  - web copy: .45 + .35
  - steps: .45/.15, .55/.15, .65/.2
  - compare columns: the same three timings
  - price promise: .5 + .3; badges: .6 + .25
  - the web window's `--k`: .15 → .85
- **web.** The slide is now a grid: copy `minmax(0,1fr)`, window `min(58%,820px)`, gap 48px, rows centred. The window is laid out in its own column. At the stop its transform is `none`, so it ends exactly in the column. script.js measures that column against the pin and sets `--ws`/`--wx`/`--wy`, which scale and move the window to the centre for the first stop (≤ 1080px wide, ≤ the pin's content height).
- **Two-line titles (how, compare).** script.js measures the h2's one-line width at the big size. It sets `max-width` to about 55% of that, widening until the title really is two lines, then `text-wrap: balance`. **Deviation:** the width is written in `em`, not px. A fixed pixel width would let the small title fit on one line again. With `em`, the lines break in the same places at both sizes. The CSS fallback is `12ch`, but a fixed 12ch gave 3–4 lines for the German titles.
- **Compare lead.** It is under the h2 in the title block (eyebrow → h2 → lead) and is no longer a `.by`. It is 19px at the first stop and 17px at the second, `max-width: 640px`, and centred with the title.
- **Compare table.** Rows are 10px / 16px (8px / 15px at ≤ 760px tall), and the header is 13px. The `scale(.92)` fallback was not needed.
- **pricing.** The title block is one flex column with 14px gaps, and the lead and promise follow it in the flow. The h2 now has `line-height: 1.1` and no margins. The €0 is 120px at the stop (104px at ≤ 760px tall).

## Fit at the second stop

These are the pin's bottom minus the lowest content bottom, all `.by` at opacity 1:

| slide | en 1280×720 | de 1280×720 | ar 1280×720 | en 1440×900 |
|---|---|---|---|---|
| web | 83.6 | 58.0 | 74.8 | 173.6 |
| how | 152.0 | 152.0 | 156.6 | 216.1 |
| compare | 22.2 (9/9 rows) | 22.2 | 14.4 | 56.2 |
| pricing | 110.7 | 110.7 | 92.1 | 180.8 |

- **web:** the window and the copy overlap by 0 px² at every stop.
- **pricing:** there is 18px from the h2 to the lead at 1440, and 12px at 720.
- **how:** all three steps start on one row at every size.
- **Width:** `scrollWidth` at 360px is 360 on `/` and `/ar/`.

## Title line counts

The count is the h2 height ÷ line-height, at 1440×900 (first stop / second stop):
- how, en/de/ar: 2/2 each;
- compare, en/de/ar: 2/2 each;
- also 2/2 at 1280×720 in all three.

## Loop

No `showcase-loop-src.mp4` was there, so I used the ping-pong of `showcase-src.mp4`. It is 193 frames forward plus 193 reversed: 386 frames at 24 fps, **16.08 s**. Then I ran 002's encode at CRF 28, which gave **1,028,100 B**. The poster is the first frame through `cwebp -q 80`: 29,922 B.

The first frame against the last frame of the shipped mp4 differs by a mean absolute **1.706/255** (max 65). The plain CRF 28 encode gave 2.070/255. That is because the last frame was a low-quality B/P frame, so I added `-force_key_frames "expr:eq(n,385)"` to 002's command.

## Guard proof (§15)

**Inline timing:** I set the price badges to `--w:.35`, so they end at .95. The build exits 1 with 28 errors:
`index.html  the pricing slide has a reveal that ends at --p 0.95, after 0.85 — the second stop would show it half-faded: <div class="ctas badges by" style="--a:.6;--w:.35">…`

**CSS-resolved timing:** I set `.step:nth-child(3)` to `--w:.3`. The build exits 1:
`the how slide has a reveal that ends at --p 0.95 … <div class="step by x">…`

Both are restored and the build is green. The compare-lead position rule is new too. The video rules are unchanged.

## Shots

They are in `claude-reports/2026-09-27/shots-006/` (WebP):
- the second stop of web, how, compare and pricing in en, at 1440 and 1280;
- how and compare in de and ar at 1440, both stops;
- the first stop of how and compare in en at 1440.

## Help impact

none

## Owner actions

1. `./deploy.sh`.
2. Hand-test on a laptop:
   - flick through web, how, compare and pricing and check each second stop is complete;
   - watch the showcase clip go round once (about 16 s) with no jump.
