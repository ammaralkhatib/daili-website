# Report: 010 Bevel home round 4 — pills up, works-with wrap, two more clips, tablet

Prompt: `claude-prompts/2026-09-28/010-bevel-round4.md` · Status: **done, all 4 clips live**.
Commits: `e75adc9` docs(prompts) · `90aea0f` feat(site), **pushed** (`54a1dcf..90aea0f`) · this report. **Not deployed.**

## Clips (3)
Both takes are used, with no re-recording. Each step has a trim, the 009 pipeline (`fillborders=top=172:mode=smear`, 590×1278, 30 fps, H.264 High CRF 28, yuv420p, faststart, `-an`) and flat patches where needed. Their drawn overlays are gone because a step with `video:` drops its tap/pill. The toasts stay.
- **Calendar** `flow-calendar.mp4`: source 5.5–20.5 s = **15.0 s, 461 KB**, poster 28 KB. It shows New event → "Swimming" → category Sport → Save → the month grid with Swimming on the 30th. Patches are in 590-px output coordinates, source seconds:
  - Typed location "City pooö", 16.1–19.8 s: a white box x118–300 y704–752, with the caret redrawn at the start of the field. During the save slide (19.8–20.2 s) a per-frame white box follows the text as it leaves: 13 frames, measured by eye.
  - Keyboard suggestion row ("City", "poor", "pools"…), 14.1–19.4 s: the row is filled with keyboard grey (#DEDDE0), 57 px below the keyboard's edge. Key pop-ups stay untouched.
  - The "test" and "fddfsf" pills on Sep 19, 19.93–20.5 s: a box x420–505 y649–697 in the cell colour #FBF8F3. It is tracked while the grid slides in.
- **Shopping** `flow-shopping.mp4`: source 2.1–16.9 s = **14.8 s, 197 KB**, poster 21 KB. It starts in the open Groceries list: tick Milk, tick Eggs, add "Milk". This is a trim only. "rerew" (0–1.9 s) and "dfsdf" (17.5 s on) fall outside the kept part. **Not kept:** the tap that opens Groceries. The "rerew" card is visible there and moves in the cross-fade, so I trimmed that part instead of patching it.
- I looked at every half-second of both outputs, and every frame of the transitions and key pop-ups. No junk text is left, and no hard patch edges show. The German suggestion words while typing "Milk" ("Mils", "Militärische") are harmless, as in 009.

## The rest
- **1:** the pills are above the h1, with a 26 px gap (all widths, en/de/ar).
- **2:** works-with is a flex row with `flex-wrap: wrap`, centred, at `max-width: 90%`. The 009 steps and the 2-column phone grid are gone. It is 8 items on one line at 1440, 7+1 or 6+2 at 1180, and 3+2+2+1 at 390 px.
- **4:** the tablet has an 8 px #1b1e1d bezel, outer radius 22, screen radius 14, a 1 px #4a514d edge, a 4 px camera dot and a floor shadow. It sits 24/24 px from the box's sides, 26 px under the paragraph, and the box clips it.
  - **Deviation:** the screen is **3:2** (the shot is 16:10, so about 3 % is cropped per side). Above 1100 px the screen is also at least 360 px tall. Without that, the device ended *inside* its box between 1101 and 1250 px.
  - Measured in all 28 locales, it runs 30–59 px past the bottom at 1440 and 33–55 px at 1101–1180. It runs 64 px past on a phone, where the box takes its content height minus 64 px.
- **5:** `REVIEWS` stays empty. Nothing was added.

## §15 and checks
- §15 now checks that the pills come before the h1, the h1 before the lead, and the lead before the buttons. A step with a clip may have no drawn tap **or pill**. A poster must be ≤ 60 KB. The `<video>` count still equals the number of FLOW_STEPS with `video:` (now 4).
- **It can fail:** on a tampered `dist/index.html` I got 3 errors: pills below the lead, `step 1 plays a clip but still has its drawn overlay`, and `the step 2 <video> has autoplay`.
- `npm run build`: `build OK · 2034 pages · 2014 in hreflang clusters` / `detector OK · 32 cases · 28 locale(s) built`.
- `overflow: 0 of 28 landing pages overflow at 390 px`. Console: `/` 0 errors, `/ar/` 0 errors.
- Screenshots: 30 in `shots/010-*.webp`, covering en/de/ar × `-d-` 1440×900 and `-m-` 390×844. Each set has the hero, works-with, the calendar and shopping clips playing (5.5 s in) and the bento tablet.

## Owner step
`./deploy.sh`. If you later re-record calendar or shopping, only the mp4/webp in `static/assets/video/` need replacing.
