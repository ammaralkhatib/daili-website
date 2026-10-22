# 004 — Home: rating 4.9, faster hero, smoother feature row, slower flat-lay

**Status: DONE** · commit `d42e92c` on main, pushed. `./deploy.sh` not run.
Planning docs (this prompt and 005) were committed first as `ba187a9` (`docs(plan): sync planning docs`), so the prompt file is in that commit, not in `d42e92c`.

## Rating
`RATING.value` = 4.9 (comment dated 2026-10-22). The last star is filled 90 %. The German page shows "4,9 bei Google Play". I also updated the `build.mjs` comment and the `@rating` example. `check-build` already compares against `RATING.value`, so it needed no change.

## Hero: 4.5 s per scene
All times now come from one number, `var SCENE = 4.5` in `heroScenes()` (T = SCENE / 4.5). At 4.5:
- the new screenshot slides in over 0–0.7 s;
- the cards fade in at 0.6, 0.72 and 0.84 s;
- they are ticked at 2.2, 2.5 and 2.8 s;
- they start to leave at 3.6, 3.7 and 3.8 s (0.5 s exit), so each card stays ticked for 1.0–1.4 s;
- the scene ends at 4.3 s, plus a 0.2 s pause.

"Never halts" still holds. The exit starts at 0.1 × 160 px / 0.5 s = 32 px/s. The drift is 50 px / 3.0 s ≈ 17 px/s. Both speeds scale with 1/T, so the rule holds at 4 or 5 too.

Measured in Chrome (time between scene starts): **4.5 s** (it was 6.3 s). Scene 1 is 4.05 s, because it skips the slide.

## Members row never pauses
The pause-on-hover rule is now `.home .revs .marq:hover …`. Checked with the mouse over the members row (en, ar, 390 px): the animation keeps running and the track keeps moving.

## Feature row: the real cause of the first-scroll glitch
There were **two causes, and the jump was the refresh.** I measured in headless Chrome over CDP (Playwright is not installed here) at 1440×900, with the cache off, the network throttled to 1.5 Mbps, and a real mouse-wheel scroll into the row:

| | before | after |
|---|---|---|
| `ScrollTrigger.refresh()` runs while pinned | 5 | 0 |
| frames where the card track jumped sideways | 5 (−136 to −164 px in one frame, while the page moved only 12–18 px) | 0 |
| frames with an empty phone on screen | 107 (cards 5–13) | 0 |
| unexpected `scrollY` jumps | 0 | 0 |

- **The jump:** each lazy picture that finished loading called `refresh()`. Run during the pin, a refresh makes the smoothed (scrub 0.6) track skip its catch-up and snap to the scroll position. That is the ~150 px jerk. `scrollY` itself never jumped.
- **The pop-in:** the cards move sideways inside a clipped box, so each lazy picture only started loading when its card slid into view.

**Fix:**
1. When the row is 1.5 screens away (one ScrollTrigger, `once`), every `<img>` in the row is set to `loading="eager"` and `decode()`d. This also works on phones and with reduced motion. At 390 px all 14 pictures were loaded by the end.
2. Pictures inside `.phone .scr` no longer ask for a refresh, because their size comes from CSS.
3. Any refresh that is asked for while the pin is active now waits until the pin is left.

**Progress bar removed:** the markup, the CSS (including the RTL rule and the `:not(.on)` rule), the code in `show()` and the comments. `check-build` now fails if `data-frow-bar` or `frow-prog` comes back. The counter and the arrows stay.

One small note: with reduced motion on the throttled network, a fast scroll still showed 2 frames of a not-yet-loaded phone, because there is no smooth scroll there and the 1.5-screen head start is short at 1.5 Mbps. This is acceptable to me.

## Flat-lay
Every `[data-obj]` and `.fphone` now uses `end: "center center"` with `scrub: 1.5`. I checked all 13 triggers at 1440×900 and at 390×844, in en and ar. At the end point, the flat-lay's middle is exactly at the screen's middle (offset 0 px), and the whole scene is in view (1440: top 30 px, bottom 870 px; 390: top 120 px, bottom 725 px).

## Build
```
content OK · 28 locale(s) · 511 keys each
legal OK · 2 document(s) × 28 locale(s)
build OK · 3233 pages · 3203 in hreflang clusters
detector OK · 32 cases · 28 locale(s) built
```
No server or Chrome is left running. The harness was one foreground script in `/tmp`, and the before-build worktree has been removed.

## Help impact
none
