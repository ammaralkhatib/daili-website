# Report: 009 Bevel home round 3: Ammar's second list + real app clips

Prompt: `claude-prompts/2026-09-28/009-bevel-round3.md` · Status: **done**, with 2 clips of 4 and two deviations (listed below).
Commits: `c3bc803` docs(prompts) · `924aebb` feat(site): Bevel home round 3, **pushed** (`b8f6998..924aebb`) · this report. **Not deployed.**

## C: why the old page could survive
Live checks (`curl -sSI`) on 2026-09-28:
- **HTML** (`/`, `/de/`, and the directory index too) was sent with `public, max-age=0, must-revalidate`. It is now **`no-cache`**. It was not a long cache, so it was not the main cause.
- **Images, shots and vendor scripts** had no version in their URL and are cached for 30 days (JS for 7). A changed image or screenshot could stay stale for up to a month, even though the HTML was new. **Fix:** `build.mjs versionAssets()` runs over every finished page and appends `?v=<sha8 of the file>` to every `/assets/img/`, `/assets/vendor/` and `/assets/video/` URL (in `src`, `href` and `poster`). The CSS names no images. The 30-day cache stays.
- **Extra finding:** `/assets/img/home/qr.svg` returned **403** live. The file was mode `600` locally, and `rsync -rltz` keeps that mode. `build.mjs copyDir` now writes every file in `dist/` as 644 and every directory as 755. Your untracked `static/assets/img/photos/*` and `blog/what-to-look-for-family-app.webp` are also 600. Since they are copied into `dist/`, the build now fixes their mode as well.
- Not fixable from here: if your browser still shows the old page after the deploy, test in a private window. The Plesk nginx in front of Apache sends `x-accel-version`, and its cache settings are in Plesk, not in `.htaccess`.

## Clips (F)
In the folder: **habits** and **to-dos** only. Calendar and shopping are missing, so they keep their screenshot and the drawn overlay.
- I checked every second of both clips. They show only the demo family ("Sandra" is fine, as you confirmed). There are no real names, addresses, notification banners or junk text. The to-dos clip shows a German iOS keyboard (QWERTZ, "plants" suggestion), which is harmless.
- `flow-habits.mp4`: source 17.5 s, trimmed to 1.0–14.5 s = **13.5 s, 462 KB**, poster 24 KB. `flow-todos.mp4`: source 15.2 s, trimmed to 1.0–13.5 s = **12.5 s, 501 KB**, poster 11 KB. No speed-up was needed. Both are 590×1278, 30 fps, H.264 High, CRF 28, yuv420p, faststart, no audio.
- **Deviation:** the status bar is **blanked, not cropped**. I first cropped it (590×1194). That clip is wider than the frame's screen, so `cover` cut about 5 % off each side on a phone ("Edit item" read as "dit item"). Now the top 172 rows are filled with the first app row (`fillborders=mode=smear`), so no clock or recording pill shows. The clip then has the same shape as the screenshots, and only about 2 % is trimmed per side.
- Behaviour, measured: the ring runs exactly the clip's length (12.53 s), the toast appears when the clip ends, and the next step starts about 1 s later. Nothing plays while the section is off screen or the tab is hidden, or with reduced motion or Save-Data (then the step shows the poster for 6 s). `preload="none"`; the first clip switches to `auto` within half a screen. The UI is English in every locale for now.

## The rest of the list
- **H1–H3:** the pills sit under the lead (22 px), with the buttons 26 px below. The web button is a 999px pill, 48 px tall like the badges (hero and final, **R1**). Each card fades in and starts drifting at the same moment. The drift is 50 px, linear (30 px on a phone), and continues through the ticks. The exit easing starts at about 27 px/s, so the cards never stop.
- **W1:** measured in all 28 locales. It is one row of 8 from 1180 px up (slightly smaller from 1180 to 1440 px), 4 + 4 at 1100 and 1024 px, and 2 × 4 at 390 px. Greek wrapped one label at 1180 px until I added a 1180–1279 px step.
- **M1 deviation:** the prompt's `.38 → 0 at 40 %` gave only **2.1:1** on p_cake and p_balcony (95th-percentile pixel behind the caption). The lightest gradient that passes is `.60 → .55 at 16 % → 0 at 45 %`. The worst photo now reaches 5.2:1.
- **S1:** the floating cards move at ±30/55/20/60/35/50 yPercent. The habits widget stays fixed to its phone. **S2/I2:** 120 px on desktop and 72 px on a phone, both after the calendars card and after the Gemini line.
- **I1:** all three Plus cards are 300 px wide at the same −120 px offset (195 px = 78 % at the same offset on a phone).
- **E1:** the watch is new and neutral: a metal case lit from the top left, a dark bezel ring, one round button, a matte green-grey band with lugs and stitching, and a contact shadow. Its size stays 150×181 (0.830), with the same tilt, in the hero and the bento. **E2:** the tablet is flat on, with an even 14 px bezel on all four sides (measured). The outer radius is 30 px, the screen radius 18 px, with a 1 px light edge and a camera dot. The image uses cover, top-aligned. **P1:** the lock reaches at most `.18`.
- **V:** it renders only with 3 or more `REVIEWS`, as a moving row: 5 stars (the first `stars` filled), the title and text with the review's `lang`, and name · source · date in the page's own date format. A new `date` key is required. `REVIEWS = []`, so nothing renders. I tested it with 3 throwaway entries and reverted them, so they were never committed. No content keys were needed.

## §15 and checks
- New in §15: pills sit between the lead and the buttons. Each flow `<video>` matches FLOW_STEPS, is muted, playsinline and `preload="none"` with no autoplay, its mp4 is at most 1.6 MB, its poster exists, and its step has no tap. Every home and shot URL carries `?v=` equal to the file's sha8. The review cards must equal `REVIEWS` in order. "Placeholder" and "Sample" appear in no dist/ text file. Outside §15: §2 (links) now ignores `?v=` instead of skipping those URLs, and the blog hero check accepts `?v=`.
- **It can fail:** on a tampered `dist/index.html` I got 3 errors: pills not between the lead and the buttons, `the step 4 <video> has autoplay`, and `names /assets/img/home/minzi_jump.webp without ?v=`. On the review test, one changed card gave `the reviews row shows 3 card(s) that are not exactly REVIEWS' 3`.
- `npm run build`: `build OK · 2034 pages · 2014 in hreflang clusters` / `detector OK · 32 cases · 28 locale(s) built`.
- Overflow: `0 of 28 landing pages overflow at 390 px`. Console: `/` 0 errors, `/ar/` 0 errors (full scroll plus 16 s of clip playback).
- Screenshots: 99 in `shots/009-*.webp` for en, de and ar at 1440×900 (`-d-`) and 390×844 (`-m-`). They cover the hero at t0, t2 and t4, works-with, members, the day grid and its end, Plus a/ab/b/c/end, a playing flow clip, the bento and the final section.

## Owner steps
`./deploy.sh`. After that, send calendar and shopping re-recordings (add `video:` in `FLOW_STEPS`), and real Google Play reviews for `REVIEWS`.
