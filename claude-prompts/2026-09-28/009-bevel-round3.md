# Bevel home — round 3: Ammar's second change list + real app clips

## Goal

Round 2 (007) is live. Ammar reviewed it on 2026-09-28 evening. Build his
list below, plus the real app clips that 008 could not use (008 ran an older
version of its prompt and stopped on "Sandra" — Ammar has since confirmed
Sandra is fake demo data, and we are **not** using Apple's bezels).

Read `claude-reports/2026-09-28/007-bevel-round2-page.md` and
`claude-reports/2026-09-28/008-bevel-frames-and-videos.md` first.
Ammar's reference screenshot for item I1:
`claude-prompts/2026-09-28/round3-refs/intel-card-widths.webp`.

Done = every item is visible on `/`, `/de/`, `/ar/` at 1440×900 and
390×844, `npm run build` is green.

## Scope

- **In:** `templates/landing.html`, `static/assets/home.css`,
  `static/assets/home.js`, `build.mjs`, `site.config.mjs`,
  `tools/check-build.mjs` §15, new `static/assets/video/`,
  `static/.htaccess` (item C only).
- **Out:** content keys (none needed — say so if you find one), other
  pages. **Never run `./deploy.sh`.** Never commit `.mov`/`.dmg` files.

## C — Ammar still sees the old page

The live server serves round 2 (checked: the rating row "4.7 on Google Play"
is in the live HTML), but Ammar's browser shows the old page even after
clearing the cache. Check and fix what could keep an old page alive:
- the `Cache-Control` the `.htaccess` sends for **HTML** (`.html` and the
  directory index): it must be `no-cache` (revalidate every time) — add a
  rule if HTML has none or a long one;
- unhashed files that change in place (images under `/assets/img/home/`,
  `/assets/img/shots/…`, vendor scripts): the build must append
  `?v=<sha8 of the file>` to every such URL it writes into the HTML/CSS, so a
  changed image is fetched at once (the 30-day image cache stays);
- report exactly what you found and changed.

## H — Hero

- **H1** Move the three note pills (Free · No ads · Servers in the EU) back
  **under the subtitle** (lead), above the three buttons.
- **H2** The web button ("Open in your browser") gets a **fully rounded
  pill radius**, like the header's "Download app" button (`999px`). Keep the
  store badges as they are; same height.
- **H3** Card motion: the cards must **fade in and move outward at the same
  time** (one tween: opacity 0→1 and the drift start together — no "appear,
  then move"). They **never stop moving**: the slow drift continues through
  the ticking (ticks happen while they drift), then they speed up, fly out
  and fade. Use one continuous timeline per card: drift (slow, `none`
  ease, ~50 px over the whole visible life) + a separate faster exit segment.

## W — Works with

- **W1** Right now 2 items wrap alone into a second row. Make it balanced:
  one row when all 8 fit (reduce gap/size a little on 1100–1440 px), and
  when it must wrap, **4 + 4** (two rows of four, centred) — never 6 + 2.
  Mobile: 2 columns × 4 rows.

## M — Joined by 1,000+ members

- **M1** Each photo card gets a **soft inner shadow at the top** so the
  white caption reads clearly: a top gradient overlay
  `linear-gradient(to bottom, rgba(0,0,0,.38), rgba(0,0,0,0) 40%)` (tune so
  the caption passes 4.5:1 on the brightest photo, but keep it light).

## S — Start the day together

- **S1** The floating card on each of the 6 phones moves at a **different
  scroll speed** (parallax), e.g. yPercent ranges −30…+30, −55…+55,
  −20…+20, … varied per card so neighbours never move alike. The habits card
  stays aligned with its widget (no parallax on it — as 007 decided).
- **S2** More space **after the "Connect your calendars" card** before the
  Daili Plus section (≥ 120 px desktop, 72 px mobile).

## I — Daili Plus

- **I1** The three floating cards on the fixed phone must all have the
  **same width** (ref `intel-card-widths.webp`: the video card and the
  "3 events found" card differ). Fix one width (e.g. 300 px desktop,
  78 % of the phone on mobile) and the same inline-start offset for all three.
- **I2** More space **after the Daili Plus section** (after the Gemini
  line) before "See it in action" (≥ 120 px desktop, 72 px mobile).

## F — See it in action: real clips

Source: `/Users/ammarkhatib/Claude/Projects/Family Planner/website-redesign-bevel-2026-09-28/clips/`
— files named `flow-calendar.mov`, `flow-shopping.mov`, `flow-todos.mov`,
`flow-habits.mov`. **Use only the ones that exist**; a step without a clip
keeps its screenshot + drawn overlay as now (Ammar is re-recording calendar
and shopping because the old ones show junk test data).

For each clip that exists:
- Privacy/junk pass: one frame per second, look at all. "Sandra" is fake
  demo data (Ammar confirmed) — fine. Stop and report `blocked` only for
  real personal data (unknown real names, real addresses, notification
  banners). Junk test text ("test", "fddfsf", "rerew", "dfsdf") → trim the
  seconds that show it; if it can't be trimmed away, skip that clip and say so.
- Trim dead time; if still > 15 s, speed up (max 1.5×, `setpts`); final
  8–15 s. Crop the top status bar (it shows the red recording pill) down to
  the first app pixel row.
- Encode: 590 px wide, 30 fps, H.264 High, `-crf 28`, `yuv420p`,
  `-movflags +faststart`, **`-an`** → `static/assets/video/flow-<step>.mp4`
  ≤ 1.5 MB; poster `flow-<step>.webp` ≤ 60 KB (first frame).
- In the flow phone the step's screenshot becomes
  `<video muted playsinline preload="none" poster="…" data-flow-video>`;
  remove that step's drawn tap/pill overlay (keep its toast, shown when the
  clip ends). The step advances **1 s after its clip ends**; the progress
  ring follows the clip's real duration. Steps without a clip keep 6 s.
- Play only when the section is on screen, the tab is visible, reduced
  motion is off and `saveData` is not set; else posters. First clip
  `preload="auto"` only once the section is within half a screen.
- English UI in every locale is fine for now (note it).

## E — On every screen in your home

- **E1** **Watch mockup:** redesign it to look like a premium, *neutral*
  smartwatch (not an Apple Watch copy): a rounded-square case with a soft
  metallic gradient (light top-left highlight, darker bottom-right), a thin
  darker bezel ring around the black screen, one small round side button, a
  matte band in the brand's dark green-grey that tapers into the case with
  subtle stitching lines, a soft contact shadow. Keep size, tilt, position
  and the face content. Same watch in the hero.
- **E2** **Tablet mockup:** the border looks wrong. Rebuild it as a clean
  landscape tablet: an even 14 px dark bezel (#1c1f1e) on all four sides,
  outer radius 30 px, screen radius 18 px, a 1 px lighter outer edge
  highlight, a small camera dot centred on the top bezel, a soft floor
  shadow; the screenshot fills the screen with `object-fit: cover`
  top-aligned (no letterbox, no uneven edge).

## P — Privacy

- **P1** The glass lock behind "Private by design" even more transparent:
  max opacity `.18`.

## R — Ready when you are

- **R1** The "Open in your browser" button: fully rounded pill (`999px`),
  same height as the badges, globe icon kept.

## V — Reviews (switched on only with real reviews)

Ammar wants review boxes. **Do not invent reviews.** Build the section so it
is ready: when `REVIEWS` in `site.config.mjs` has ≥ 3 entries it renders as
a moving row of cards (5 stars drawn from each review's `stars`, title,
text in its original language with `lang`, first name + source + date). With
fewer than 3 it renders nothing. Leave `REVIEWS = []` — Ammar will paste
real Google Play reviews. §15: every rendered review comes from `REVIEWS`;
the words "Placeholder" and "Sample" appear nowhere in `dist/`.

## §15

Update for: pills under the lead; 4+4 wrap rule is CSS (no check needed);
the flow's `<video>`s — each referenced mp4 + poster exists in `dist/`,
each mp4 ≤ 1.6 MB, no `autoplay`; the `?v=` suffix on every
`/assets/img/home/` and `/assets/img/shots/` URL in the landing HTML. Prove it
can fail once.

## Verify

- `npm run build` green (tail).
- Screenshots `/`, `/de/`, `/ar/` at 1440×900 + 390×844: hero at t 0/2/4 s,
  works-with, members card top, day grid, Plus cards (same widths), flow with
  a clip playing, bento watch + tablet, final →
  `claude-reports/2026-09-28/shots/009-*.webp`.
- Overflow 0 of 28 at 390 px; no console errors on `/` and `/ar/`.

## Commit & push

`feat(site): Bevel home round 3 — hero motion, balanced works-with, clips, watch + tablet, spacing` —
body `Prompt: claude-prompts/2026-09-28/009-bevel-round3.md`. **Push now.**
Never deploy.

## Report

`claude-reports/2026-09-28/009-bevel-round3.md` (≤ one page): item C
findings, clips used/skipped with lengths and sizes, anything not done and
why, SHAs, owner step `./deploy.sh`.
