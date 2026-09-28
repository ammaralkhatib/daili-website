# Bevel home — round 4: pills up, works-with wrap, two more clips, tablet

## Goal

Ammar's next small list (2026-09-28, after 009). Read
`claude-reports/2026-09-28/009-bevel-round3.md` first and build on it.
Done = visible on `/`, `/de/`, `/ar/` at 1440×900 and 390×844,
`npm run build` green.

## Scope

- **In:** `templates/landing.html`, `static/assets/home.css`,
  `static/assets/home.js`, `build.mjs`, `site.config.mjs` (`FLOW_STEPS`),
  `static/assets/video/`, `tools/check-build.mjs` §15.
- **Out:** content keys, other pages. **Never run `./deploy.sh`.** Never
  commit `.mov` files.

## 1 — Hero pills back on top

Move the three note pills (Free · No ads · Servers in the EU) back **above
the headline** (where 007 had them). Update the §15 rule from 009 to match.

## 2 — Works with: one flowing row

Replace 009's "8 / 4+4 / 2×4" steps with a simple inline flow: the items
sit inline, centred, in a container **max-width 90 %** of the section
(`flex-wrap: wrap; justify-content: center`), and whatever does not fit
wraps to the next row by itself. Remove the breakpoint steps 009 added.
Mobile: same rule (no 2-column grid).

## 3 — Calendar + shopping clips: use the recordings we have

Ammar does not want to re-record. The clips are now in
`/Users/ammarkhatib/Claude/Projects/Family Planner/website-redesign-bevel-2026-09-28/clips/`:
`flow-calendar.mov`, `flow-shopping.mov` (plus the two already used).
They contain **junk test text** (009/008 reports: calendar "test",
"fddfsf" on Sep 19 at ~0:02–0:04 and ~0:20–0:22, typed location "City pooö"
~0:15–0:24; shopping list "rerew" ~0:00–0:01 and ~0:17, item "dfsdf"
~0:17–0:19). Make them usable, in this order of preference:
1. **Trim** the seconds that show junk (start/end), keeping one continuous
   8–15 s part that tells the story (calendar: open new event → type
   "Swimming" → pick time → save; shopping: open Groceries → tick items).
2. Where junk is inside the part you must keep (e.g. the "City pooö"
   location field, a "test" pill in the month grid), **cover only that small
   area** for those seconds with a flat patch in the surrounding background
   colour (ffmpeg `drawbox` with `t=fill` and the sampled colour, or `delogo`),
   so it reads as an empty field / empty cell. No blur smears.
3. If neither works for a clip, skip that clip (keep its screenshot) and say
   why.
Then the same pipeline as 009 for both (status-bar blanking with
`fillborders`, 590 px, 30 fps, CRF 28, `-an`, ≤ 1.5 MB, poster ≤ 60 KB),
add `video:` to their `FLOW_STEPS` entries, and remove their drawn
overlays (keep their toasts). Paste the trims/patches per clip (seconds +
box) in the report and look at every output second once more.

## 4 — Tablet mockup: thinner border, bigger device

Replace 009's tablet with our own design:
- a thin, even bezel: **8 px** (#1b1e1d) on all sides, outer radius 22 px,
  screen radius 14 px, a 1 px lighter outer edge line, a tiny camera dot in
  the top bezel, a soft floor shadow;
- the device is **much bigger**: it fills the box's width minus 24 px on
  each side and extends past the box's bottom edge (the box clips it), so it
  covers most of the container under the title and paragraph;
- screen = the screenshot, `object-fit: cover`, top-aligned;
- mobile: the same, full box width.

## 5 — Reviews

No change: the section stays off until `REVIEWS` has ≥ 3 **real** reviews
(Ammar will paste them). Do not add sample reviews.

## §15

Update: pills above the h1; flow `<video>` count = number of `FLOW_STEPS`
with `video:` (expect 4 if both clips passed); same mp4/poster/autoplay rules
as 009. Prove it can fail once.

## Verify

- `npm run build` green (tail).
- Screenshots `/`, `/de/`, `/ar/` at 1440×900 + 390×844: hero top,
  works-with, flow playing calendar and shopping, bento tablet →
  `claude-reports/2026-09-28/shots/010-*.webp`.
- Overflow 0 of 28 at 390 px; no console errors on `/` and `/ar/`.

## Commit & push

`feat(site): Bevel home round 4 — pills on top, flowing works-with, calendar + shopping clips, bigger tablet` —
body `Prompt: claude-prompts/2026-09-28/010-bevel-round4.md`. **Push now.**
Never deploy.

## Report

`claude-reports/2026-09-28/010-bevel-round4.md` (≤ half a page): clip
trims/patches, sizes, anything skipped and why, SHAs, owner step
`./deploy.sh`.
