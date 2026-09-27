# Report — 004 Design B round 2

Prompt: `claude-prompts/2026-09-27/004-design-b-round-2.md`
Commit: `6ff74889b797d09a2b1c5678368d56627e137f66` (pushed)
`feat(site): Design B round 2 — hero pills + peek, two-step title slides, slab + pricing cleanups`
Status: **done**

## Build

`npm run build` passes with no env skips, before and after the change: all
seven links, `build OK · 2034 pages`, `detector OK`.

## The peek (§2), before the first flick

Hero `min-height: max(540px, calc(100vh − header − var(--peek)))`, `--peek`
300px (260px at `max-height: 760px`).

| page | hero | panel top | phone top | phone in view |
|---|---|---|---|---|
| `/` 1440×900 | 540 | 630 | 694 | **206px** |
| `/de/` 1440×900 | 540 | 630 | 694 | 206px |
| `/ar/` 1440×900 | 540 | 628 | 692 | 208px |
| `/` 1280×720 | 540 | 630 | 694 | 26px (the 540px floor leaves a 116px peek) |

To make the hero fit 540px, three things changed:
- the hero h1 is capped by height: `min(10.5vw, 12.5vh)`, and `min(7vw, 9vh)`
  for ar/th/hi/CJK;
- the lead is 20px on a 760px measure;
- the gaps are 22px.

The pill "Free / No ads / Servers in the EU" row ends 26px above the hero's
bottom edge.

The upper two cards now fade in over showcase `--p` .15–.35 (was .55–.75).
While the panel peeks, the showcase's `--p` is .37, so the first screen shows
them.

## Snap stops and the two-step slides

- **Snap stops at 1440×900: 19.** I counted the elements whose computed
  `scroll-snap-align` is `start`: hero, showcase, 7 chapters, life, web ×2,
  how ×2, compare ×2, pricing ×2, faq.
- **`--p` at the stops:** 0.000 at every first stop and 1.000 at every second.
- **Title position:** at every first stop the title is 0px from the pin centre
  (dx 0, dy 0), in en, de and ar, at both sizes.
- **`--dx`/`--dy` are measured by script.js.** The prompt suggested a
  constant `--lift` per slide. I measure instead, because the offset depends
  on how each translation wraps. It is measured on load, on resize and on
  font load.
- **Compare lead moved.** It now sits in the head's second column, beside the
  title. Under the title, the nine rows overflowed the pinned screen at 1440 by
  84px.
- **Compare table fades in.** The whole table now fades in at .40–.52. Without
  that, its rules and row labels showed at the first stop.
- **Fit:** every stop fits its pin at both sizes. At 1280×720, compare and
  web reach 6–12px into the pin's padding.
- **Reduced motion, 1440×900:** `#how` is 836px, which is exactly one screen
  (900 − 64). There are 15 stops and no `.snap2` is shown.
- **390 px:** no snap, the pins are static, and `--p` is 1 everywhere.
- **Overflow at 360 px:** `scrollWidth` is 360 on both `/` and `/ar/`.

## Guard 15 proof

I deleted the `.snap2` in `#how` from `landing.html`. The build then fails 28
times, once per locale, and exits non-zero:
`index.html  the how slide has 0 .snap2 elements, expected exactly 1 — it is a two-step slide`.
With the `.snap2` restored, the build is green. The new rules check:
- no `.chip` before the hero h1, and 3 `class="pill"`;
- the slab label is the bare wordmark;
- there is no `class="points"` in the price slide;
- the two-step slides are exactly [web, how, compare, pricing], with one
  `.snap2` each and none on the FAQ.

The 002 video rules are unchanged.

## Video (§7): re-encoded

`showcase-src.mp4` (10:18) was newer than the shipped file (07:25). I used
the same ffmpeg command at CRF 28, and made the poster with `cwebp -q 80`.
- `showcase.mp4`: **512,676 B**
- `showcase.webp`: **30,202 B**

The new clip is the 3D floating icons. `life` was not touched.

## Idle keys

- New: `hero.chip`, `pricing.points`.
- Still idle from 002: `story.cards.{calendar,shopping,todos,meals,birthdays,vault,family}`,
  `hero.kicker`, `hero.altCalendar`, `hero.altHome`.

`build.mjs` and `site.config.mjs` are untouched.

## Shots

`claude-reports/2026-09-27/shots-004/` (WebP):
- `en-1440-*` and `en-1280-*`: all 19 stops in order;
- `de-1440-*` and `ar-1440-*`: hero, web 1 and 2, and pricing 2;
- `m390-{en,ar}-full`: the full 390px pages.

## Help impact

none

## Owner actions

1. `./deploy.sh`.
2. Hand-test on a laptop:
   - two flicks per slide on web, how, compare and pricing;
   - the peek on first load;
   - the new showcase clip playing.

   On a phone, check it is still the plain page.
