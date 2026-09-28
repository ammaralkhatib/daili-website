# Bevel home — round 2b: real Apple device frames + real app videos

## Goal

Two things Ammar delivered after 007 was written:
1. Apple's official **product bezels** (as `.dmg` disk images, not PNGs — so
   007 could not use them and fell back to CSS frames, item D2).
2. **Four real screen recordings** of the app for "See it in action".

Both are in
`/Users/ammarkhatib/Claude/Projects/Family Planner/website-redesign-bevel-2026-09-28/bezels/`:
`Bezel-iPhone-18.dmg`, `Bezel-Apple-Watch-Series-11-2025.dmg`,
`Bezel-iPad-Pro-(M5).dmg`, and `ScreenRecording_09-28-2026 18-39-47_1.mov`,
`… 18-41-59_1.mov`, `… 18-42-58_1.mov`, `… 18-43-49_1.mov`.

**Read `claude-reports/2026-09-28/007-bevel-round2-page.md` first** and build
on what 007 actually shipped.

## Scope

- **In:** `static/assets/img/home/` (frames), new `static/assets/video/`
  (clips), `templates/landing.html`, `static/assets/home.css`,
  `static/assets/home.js`, `site.config.mjs`, `build.mjs`,
  `tools/check-build.mjs` §15, `static/.htaccess` **only** to add `mp4` to
  the long-cache pattern if it is not covered.
- **Out:** content keys, other pages. Never commit a `.dmg`, `.mov` or any
  source file. **Never run `./deploy.sh`.**

## Step 1 — frames from the DMGs (item D1 of 007)

- Mount each read-only without Finder:
  `hdiutil attach -readonly -nobrowse -mountpoint /tmp/bz-<n> "<dmg>"`;
  list the PNGs; **detach when done** (`hdiutil detach /tmp/bz-<n>`).
- Pick: **iPhone 18** portrait, a neutral finish (silver/white or natural —
  say which); **Apple Watch Series 11, 46 mm, aluminium, with a sport band
  in a calm colour** (no bright band); **iPad Pro (M5) landscape**, silver.
- Convert to lossless webp with alpha into `static/assets/img/home/`:
  `frame-iphone.webp` (scale to 1000 px tall), `frame-watch.webp` (600 px
  tall incl. band), `frame-ipad.webp` (1400 px wide). Each ≤ 250 KB (else
  lossy q90 with alpha).
- **Find each screen hole by code** (scan alpha for the transparent screen
  area; take its bounding box + corner radius) and store it in
  `site.config.mjs` as `FRAMES = { iphone: {x,y,w,h,r}, watch: {…}, ipad: {…} }`
  in % of the image. Paste the numbers in the report.
- Use the frames **everywhere a device is drawn**: every phone (hero, day
  cards, intel, flow, every-screen, final), the hero watch and the
  every-screen watch (the coded face sits in the hole; rotate the composed
  watch as a whole for the tilt), and the tablet box (`web-calendar.webp` in
  the iPad hole). Composition = screenshot clipped to the hole's rect and
  radius, **under** the frame image. Remove the D2 CSS frames.
- Apple's terms: use the bezels unmodified (no recolouring, no cropping of
  the device, no added reflections).

## Step 2 — the four recordings → "See it in action"

- **Privacy check first.** Extract a frame every second from each `.mov`
  (`ffmpeg -i … -vf fps=1 /tmp/rec<n>-%02d.png`) and look at them. These
  were recorded on Ammar's own phone. If any frame shows a **real** person's
  name, a real event title, a real address, a notification banner or
  anything not from the demo family (Lena, Marco, Emma, Noah, Mia, the
  Bergers), **stop and report `blocked`**, listing the file and the second.
  Do not publish a real family's data.
- Identify which clip shows which step (calendar / shopping / to-dos /
  habits) from the frames; map them to the four `home.flow.items` in order.
  If a step has no clip or a clip fits none, keep the screenshot for that
  step and say so.
- Encode each: trim dead time at start/end (keep ≤ 12 s), crop the iOS
  status bar only if it shows a real carrier/notification, scale to 590 px
  wide (the phone hole), 30 fps, H.264 High, `-crf 28`, `yuv420p`,
  `+faststart`, **no audio (`-an`)** → `static/assets/video/flow-<step>.mp4`,
  each ≤ 1.5 MB (raise crf until it fits); poster = first frame →
  `flow-<step>.webp` (≤ 60 KB).
- In the flow phone, each step's `<img>` becomes
  `<video muted playsinline preload="none" poster="…" data-flow-video>` with
  the mp4 source (keep the `<img>` as the no-JS fallback inside it or as the
  poster). The step list drives it: activating a step resets its video to 0
  and plays it; **the next step starts when the video ends** (instead of the
  fixed 6 s), with a 1 s pause; the progress ring follows the video's
  duration. Remove the drawn overlays/toasts for steps that have a video
  (keep them for steps without one).
- Play only when the flow section is on screen, the tab is visible,
  `prefers-reduced-motion` is not `reduce` and `navigator.connection.saveData`
  is not true; otherwise show the poster. `preload="none"` until the section
  is near (IntersectionObserver `rootMargin: "50% 0px"`).
- Localization: the clips are English UI — acceptable on every locale for
  now (the same as the English fallback shots); note it in the report.

## §15

Add: every phone/watch/tablet on the landing uses a `frame-*.webp`; no D2
frame class left; each `flow-*.mp4` referenced exists in `dist/`, ≤ 1.6 MB,
has a poster, and no `<video>` has `autoplay`. Prove it can fail once.

## Verify

- `npm run build` green.
- Screenshots `/` and `/de/` at 1440×900 + 390×844: hero, day grid, intel,
  flow (one frame mid-video), every-screen, final →
  `claude-reports/2026-09-28/shots/008-*.webp`.
- No overflow at 390 px on all 28 landing pages; no console errors.

## Commit & push

`feat(site): Apple device frames and real app clips on the home page` —
body `Prompt: claude-prompts/2026-09-28/008-bevel-frames-and-videos.md`.
**Push now.** Never deploy.

## Report

`claude-reports/2026-09-28/008-bevel-frames-and-videos.md` (≤ one page):
chosen bezel files, FRAMES numbers, clip → step mapping with final sizes and
lengths, privacy check result, SHAs, owner step `./deploy.sh`.
