# Design B round 2 fixups — the second stop shows everything, and a video that really loops

## Goal

Ammar's review of 004 (`6ff7488`) on 2026-09-27, four points. The two-step
mechanic stays; what changes is what the **second stop** shows: the complete
content, at once, nothing cut off, nothing overlapping, nothing still fading.
Plus a showcase clip that ends where it starts.

Prerequisite: 004 merged. Build green without env skips.

## Scope

- **In:** `templates/landing.html`, `static/assets/style.css`,
  `static/assets/script.js`, `tools/check-build.mjs` §15,
  `static/assets/video/showcase.mp4` + `showcase.webp`.
- **Out:** content keys, build.mjs, site.config.mjs, deploy.

## 1. Second stop = the whole content, in one go (all four two-step slides)

Rule for `web`, `how`, `compare`, `pricing`: at `--p: 1` **every** element
of the slide is fully visible and fully opaque, and the slide fits the pin
at 1440×900 **and** 1280×720 with nothing clipped. The build-up may still
run during the flick, but it must be **finished by `--p: .85`** (every `.by`
in these slides: `--a + --w ≤ .85`; steps and compare columns included) so
a settled second stop is never a half-faded state — the screenshots show
step 3, the promise and the last compare rows still faint or missing at the
stop.

Per slide:

- **web** — at the second stop the browser window is **beside** the copy,
  never over it (the shot shows the window covering the text). Two columns
  in the pin: copy `minmax(0, 1fr)` on the inline-start side, window
  `min(58%, 820px)` on the inline-end side, `gap: 48px`, both vertically
  centred; the window's shrink-and-slide (`--k`) must end exactly in that
  column (measure, don't guess — set the translate from the two columns'
  geometry in JS, the way 004 measures `--dx/--dy`). Copy fully in by `.85`.
- **how** — three steps in one row (`repeat(3, minmax(0,1fr))`, gap 40px),
  all three complete at the stop; at 1280×720 shrink step copy to 15px if
  needed rather than wrapping to a second row.
- **compare** — all **nine** rows visible at the stop at 900px and 720px
  tall: compact rows (`padding-block: 10px` at 1440, `8px` at ≤ 760px tall;
  16px/15px text), table header 13px; if it still does not fit at 720,
  `transform: scale(.92)` on the table wrapper at `max-height: 760px` — never
  clip, never an inner scrollbar. Column reveal finished by `.85`.
- **pricing** — the h2 and the lead must never overlap (the shot shows the
  lead sitting on the h2's baseline): the title block (eyebrow → €0 →
  bigNote → h2) is one flex column with real gaps, the lead and the promise
  follow it in flow; the €0 shrinks to ~120px at the stop; promise and
  badges fully in by `.85`.

## 2. "Set up in about a minute" — always two lines

The `how` title wraps to two lines at the big first stop and collapses to one
line at the second. Keep it two lines at both: same `max-width` on the h2 at
both stops — `max-width: 12ch` at the big size and, after the shrink, the
**same pixel width** (measure the big-state width in JS and keep it) — plus
`text-wrap: balance` so the two lines are even. Check en, de, ar: two lines
each at 1440 (paste the line counts via `getClientRects().length` of a
wrapping span, or the h2 height ÷ line-height).

## 3. Compare — two-line title, lead under it

- The `compare` h2 keeps two lines at both stops (same rule as §2).
- `compare.lead` moves **under the title** (004 put it in a second column):
  eyebrow → h2 → lead, left-aligned, lead `max-width: 640px`, 17px. The lead
  is part of the title block at the first stop (centred with it, big title,
  lead 19px) and travels up with it.
- The table then needs the compact rows of §1 to fit; verify at 720.

## 4. The showcase clip must loop (end = start)

004 re-encoded the new clip but did **not** build the loop (§7 step A of 004
was skipped — the report says "same ffmpeg command"). Do it now, but with
the method that cannot fail: **ping-pong** — the clip plays forward, then
backward, so the last frame *is* the first frame. Slow drifting icons look
natural in reverse.

```
ffmpeg -y -i "<src>" -filter_complex \
 "[0:v]split[f][r];[r]reverse[rv];[f][rv]concat=n=2:v=1:a=0,setpts=N/FRAME_RATE/TB[v]" \
 -map "[v]" -an -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p /tmp/showcase-pingpong.mp4
```

Then 002's web encode + poster on `/tmp/showcase-pingpong.mp4` (16 s now;
CRF 28 first, ≤ 2.5 MB — expect ~1 MB). Prove the loop: first frame vs last
frame mean absolute difference **< 2/255** (paste). Poster = first frame.

If Ammar has meanwhile dropped a clip named `showcase-loop-src.mp4` in the
same folder (a Higgsfield render whose first and last frame are identical),
use **that** one instead, straight through 002's encode — no ping-pong — and
prove the same first/last-frame number.

## Guards (§15)

- every two-step slide: no `.by` with `--a + --w > .85` (parse the inline
  styles in the built HTML);
- `id="compare"`: the lead is a sibling *after* the h2 inside the head, not
  in a second column;
- the showcase `<video>`'s poster and mp4 exist, mp4 ≤ 2.6 MB (as before).
Prove one new rule can fail (set a `--w` too high, run, paste, restore).

## Verify

- `npm run build`; shots into `claude-reports/2026-09-27/shots-006/`:
  the **second stop** of web, how, compare, pricing at 1440×900 and 1280×720
  for `/`; `/de/` and `/ar/` at 1440 for how and compare (two-line titles);
  the first stop of how and compare at 1440 (title still two lines).
- Paste: every two-step slide's tallest content bottom vs the pin bottom at
  720 (must be ≥ 0px inside); the title line counts; the first/last-frame
  difference of the video; `scrollWidth` 360.

## Commit & push

- `fix(site): two-step slides settle complete, two-line titles, compare lead under title, looping showcase clip`
  — body `Prompt: claude-prompts/2026-09-27/006-two-step-slides-fixups.md`. **Push now.**

## Report

`claude-reports/2026-09-27/006-two-step-slides-fixups.md` (half a page): the
fit numbers at 720, line counts, loop proof and clip length, guard proof,
commit SHA. Owner actions: `./deploy.sh`, hand-test.
