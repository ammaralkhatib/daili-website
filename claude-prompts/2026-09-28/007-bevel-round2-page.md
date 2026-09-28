# Bevel home — round 2, 2/2: Ammar's change list on the live page

## Goal

The Bevel home page is live. Ammar reviewed it on 2026-09-28. Build his
change list (below, section by section). His screenshots are in
`claude-prompts/2026-09-28/round2-refs/` — open them first:
`01` live hero, `02–05` how bevel.health's "Intelligence" block scrolls,
`06` the shutter bars he wants gone, `07–14` the **real** iOS widgets (the
design the site's widget mockups must copy).

"Done" = every numbered item below is visible on `/`, `/de/`, `/ar/` at
1440×900 and 390×844, `npm run build` is green, and nothing on the page
claims something that isn't true.

Prerequisites — check, else stop `blocked` naming which:
1. 006 merged (`git log` shows `content: Bevel home round 2 strings`).
2. Optional, **not** blocking — **Apple device bezels**: if
   `/Users/ammarkhatib/Claude/Projects/Family Planner/website-redesign-bevel-2026-09-28/bezels/`
   holds an iPhone PNG and an Apple Watch PNG (Apple's official product
   bezels from developer.apple.com/design/resources), use them (item D1).
   If the folder is empty or missing, do D2 instead and say so.
3. Optional, not blocking — **recipe screenshots**: if the app prompt
   `familyplanner-app/claude-prompts/2026-09-28/021-store-shots-recipes.md`
   has run, `~/development/flutter_projects/familyplanner/store-shots/raw/<locale>/10-recipes.png`
   exist. Then extend `tools/make-site-shots.py` so `10-recipes` becomes
   `shot-recipes` (same size/quality rules as the other shots), run it, and
   commit the new `static/assets/img/shots/<locale>/shot-recipes.webp`
   files. If the raw files are not there, `imgSrc()` falls back to the old
   English `shot-recipes` — say so in the report.

## Scope

- **In:** `templates/landing.html`, `templates/layout.html` (header +
  download menu), `templates/_storebadges.html` only if needed for item H2,
  `build.mjs`, `site.config.mjs`, `static/assets/home.css`,
  `static/assets/home.js`, `static/assets/style.css` (header only),
  `static/assets/img/home/` (new device frames), `tools/check-build.mjs` §15,
  `content/*.json` (only the renames/deletions listed in item Z).
- **Out:** legal, blog, help, deploy. **Never run `./deploy.sh`.**

## A — Menu (header, all pages)

- **A1** The dark pill says `nav.downloadApp` ("Download app").
- **A2** The download menu it opens gets a third entry under the two store
  badges: a button-shaped link `nav.openWebApp` → `https://app.daili.app`,
  **white background, 1.5 px dark (`--ink`) border**, same height and
  radius as the badges, globe icon in front.
- **A3** Remove the **Privacy** and **Support** links from the header (they
  stay in the footer). Header links left: Features, Daili Plus, Watch &
  widgets, Blog, language switcher, Log in, Download app.

## H — Hero (no scroll effects in this section at all)

- **H1** The three `hero.notes` pills (Free · No ads · Servers in the EU)
  move **above** the headline.
- **H2** Under the lead: **three buttons in one row** — the App Store badge,
  the Google Play badge (from `_storebadges`, keep the `stores.*.available`
  machinery) and a web button (`hero.webLink`, transparent background, 1.5 px
  dark border, globe icon, **same height and corner radius as the badges**).
  Remove the "Download free" button.
- **H3** Under the buttons: the rating row like bevel.health —
  five stars (the last one filled proportionally, 4.7 → 70 %) + the text
  `home.hero.rating` with `{rating}` filled. Source of truth: new
  `export const RATING = { value: 4.7, source: 'Google Play', url: 'https://play.google.com/store/apps/details?id=app.daili' };`
  in `site.config.mjs` with the comment: "Copy the real number from the
  store by hand. Never round up, never show a number the store doesn't
  show. Set to null to hide the row." The stars are one element with
  `role="img"` and `aria-label` = `home.hero.ratingAlt`. The row links to
  `RATING.url`. **Do not write "globally" and do not show 4.8** — the App
  Store has no ratings yet (checked 2026-09-28: 0), Google Play shows 4.7.
  Guard (§15): the rendered value equals `RATING.value`.
- **H4** Delete the hero's scroll-linked timeline in `home.js` (the phone
  rise, the watch drift, the cards flying off on scroll). Keep the load-in
  intro. This also fixes item W1.
- **H5** **The phone plays the app by itself** (a loop, no scrolling):
  - The phone screen holds 7 screenshots in scene order: calendar, todos,
    shopping, habits, notes, birthdays, meals (`home.hero.scenes[i].id` →
    `shot-calendar`, `shot-todos`, `shot-shopping`, `shot-habits`,
    `shot-notes`, `shot-birthdays`, `shot-mealplan`, localized via
    `imgSrc()`; the first is eager, the rest lazy).
  - One scene (≈ 6.5 s, a GSAP timeline, repeat forever):
    1. the new screenshot **slides in from the inline-end side**
       (`xPercent 100 → 0`, 0.8 s, `power3.inOut`) over the previous one;
    2. its **3 cards fade in touching the phone** — each card overlaps the
       phone edge by ~24 px (card 1 top inline-start, card 2 middle
       inline-end, card 3 lower inline-start), stagger 0.15 s;
    3. they **drift slowly away** from the phone (~40 px, 2.2 s, `sine.out`);
    4. they **get ticked one after the other** (the existing `.done` state:
       check fills, title strikes through), 0.35 s apart;
    5. they **fly away faster and fade out** (~160 px outward, 0.6 s,
       `power2.in`);
    6. next scene.
  - Pause the loop when the hero is off-screen (`IntersectionObserver`) or
    the tab is hidden; resume where it was.
  - Reduced motion or no JS: the calendar screen with its 3 cards, static,
    unticked. Mobile (< 860 px): same loop, cards smaller, card 3 hidden.
  - RTL: "inline-end" and "outward" flip.
  - Remove the old 7 `hero.cards` and their positions from
    `site.config.mjs`.
- **H6** The watch: see D1/D2. It keeps its place and tilt (next to the
  phone, lower inline-end, as in `01-live-hero`), and its face shows
  `home.watch.*` as now.

## W — Works with

- **W1** The row must sit **below** the phone and watch with ~48 px space,
  never over them (it overlapped the phone in `01-live-hero`). Give the
  stage a height that contains the phone + watch at every width.

## S — Start the day together

- **S1** Remove the big gap between each card's text and its phone — the
  phone starts ~32 px under the paragraph.
- **S2** **6 cards in 2 rows of 3** from `home.day.cards6` (006):
  lists (`shot-shopping`), habits (`shot-habits`), notes (`shot-notes`),
  recipes (`shot-recipes`), meal plan (`shot-mealplan`), birthdays
  (`shot-birthdays`). Colours: lists leaf, habits honey, notes berry,
  recipes clay, meal plan berry-light (`#F3E2EC`→white) … pick the six tints
  from the palette so no two neighbours share one. Mobile: one column.
- **S3** Each card's floating widget is **bigger and wider than the phone**:
  width = phone width + 2 × 28 px, centred on the phone so it overhangs left
  and right by the same amount, text 16 px / 13.5 px, icon 40 px, and a
  stronger shadow (`0 30px 60px -18px rgba(21,39,31,.45), 0 4px 10px rgba(21,39,31,.08)`)
  so it pops off the phone. Keep the scroll parallax on the phone and the
  widget.
- **S4** The **habits** widget replaces the screenshot's own "Family energy"
  card: position it **exactly over** that card in `shot-habits` (measure its
  top/height in % of the screenshot — same place in every locale's capture;
  check `de` and `ja`), same content bigger, so the energy widget is never
  shown twice. No parallax on this one (it must stay aligned).
- **S5** Remove the "Dinner, decided" wide card (recipes + meal plan are
  cards now).
- **S6** **Connect your calendars** (the wide card, now directly under the 6
  cards): the three rings get **equal spacing** (radii e.g. 190 / 330 / 470 px);
  **no scroll effect** — the tile ring turns slowly by itself (CSS
  `@keyframes`, one turn in ~90 s, tiles counter-rotate to stay upright;
  paused under reduced motion). Add a second floating card
  `home.calendars.apple` (an Apple-Calendar-style red/white calendar icon
  drawn in SVG — not Apple's logo) under the Google one.

## I — Go deeper with Daili Intelligence (the bevel.health scroll)

Rebuild the three cards the way bevel.health does it (refs `02–05`): the
cards are **not** sticky any more; they scroll up normally, one after the
other, with a ~40 px dark gap between them. **The phone looks fixed in the
middle of the screen while the cards move behind/around it**, and each card
shows its own screenshot + floating card in that fixed phone:

- Each `.icard` gets `clip-path: inset(0 round 34px)` (and
  `overflow: clip`). Inside each card, the phone + its floating card sit in a
  wrapper with **`position: fixed`** at the same viewport spot for all three
  cards (vertically centred, horizontally where the right column is).
  Because each card clips its own fixed phone, you only ever see the part of
  a phone that lies inside the card currently passing — at the gap between
  two cards the phone looks cut, exactly like ref `03`.
- The fixed wrappers are shown only while the intel section is on screen
  (toggle a class with `ScrollTrigger` or an `IntersectionObserver`), so they
  never appear over other sections.
- The floating card on each phone moves up slowly as its card passes
  (`yPercent` scrub, as bevel.health does).
- Mobile (< 860 px) and reduced motion: no fixed trick — each card simply
  contains its phone, stacked.
- The avatar strip, eyebrow, h2, sub and the Gemini line stay.

## F — See it in action

- **F1** Remove the shutter bars completely (markup, CSS, JS) — ref `06`.
- **F2** Make the tinted box behind the phone **shorter** than the phone so
  the phone sticks out above and below it (box height ≈ 70 % of the phone
  height, vertically centred).
- **F3** (No change this round for video — Ammar will record real clips;
  a later prompt swaps the screenshots for them. Keep the markup so a
  `<video>` per step can replace the `<img>` later.)

## E — On every screen in your home

- **E1** Layout, no overlaps anywhere:
  row 1 = Apple Watch (1 col) · Widgets (1 col) · In your browser (2 cols);
  row 2 = On the wall with any tablet (2 cols) · And on every phone (2 cols).
  Mobile: one column.
- **E2** Watch: D1/D2 (correct proportions — the Series 11 46 mm case is
  about 0.83 wide : 1 tall without the band).
- **E3** Widgets: rebuild the mockups to **look like the real widgets** in
  refs `07–14` (light variants, since the page is light). Read the real
  layout, colours and paddings from `familyplanner-app/ios/FamCanvasWidgets/*.swift`.
  Show a home-screen-like grid with **no overlaps**: two small widgets side
  by side (Next up: weekday in red, big date, `+` button, two events with
  colour bars · Shopping: cart chip, `{count} to buy`, two unticked rows),
  one medium below (Habits: Minzi tile with the energy bar, three habit rows
  with count rings and an initial avatar). Texts from
  `home.screens.widgets2` (006). Dates are real: build them from the build
  date with `Intl.DateTimeFormat(locale)` (weekday long + day number) — no
  hard-coded "Montag 28".
- **E4** "In your browser" moves to row 1 (see E1).
- **E5** The TRMNL box becomes **"On the wall with any tablet"**
  (`home.screens.tablet`): a **landscape tablet mockup** (thin dark bezel,
  rounded 28 px, soft shadow, slight 3D tilt is optional) showing
  `web-calendar.webp` (the board screenshot can replace it later). TRMNL
  stays in the "Works with" row.
- **E6** "And on every phone": the phones get the real bezel (D1) or the
  corrected CSS frame (D2) — Ammar: "the border radius is not correct and the
  border is too thin".

## P — Private by design

- **P1** Make the glass lock in the background much lighter: max opacity
  `.35` (it was `.9`), and a softer stroke.

## R — Ready when you are

- **R1** The web button (`home.final.web`) gets the **same radius and height
  as the store badges** and a globe icon.
- **R2** The objects **rotate a little as they slide in**: each starts at its
  final rotation ± 10–14° (alternating sign) and settles on its final angle
  in the same scrub.
- **R3** More space under the phone so its whole shadow shows (≥ 120 px
  padding below the phone inside `.flat`).

## D — Device frames (used by hero, day cards, intel, flow, every-screen, final)

- **D1 (bezels present):** copy the two PNGs into `static/assets/img/home/`
  as `frame-iphone.webp` and `frame-watch.webp` (lossless webp with alpha,
  keep the original pixel size, ≤ 250 KB each; if larger, scale to 1000 px
  tall for the phone / 600 px for the watch). **Find the screen hole by
  code** (scan the alpha channel for the transparent screen rectangle) and
  store its rect and corner radius as percentages in `site.config.mjs`
  (`FRAMES`). Compose every phone as: screenshot (`object-fit: cover`,
  clipped to the hole's rect + radius) **under** the bezel image. Same for
  the watch face (the coded face sits in the hole). Keep the watch's tilt by
  rotating the composed watch as a whole. These are Apple's marketing
  bezels: use them unmodified (no recolouring, no cropping of the device),
  which is what Apple's terms allow for showing your own app.
- **D2 (no bezels):** keep the CSS frames but fix them: phone outer radius
  = 16 % of the phone width, 11 px frame at 300 px width scaling with it
  (`calc()`), a 1 px darker outer line, the screen radius = outer − frame;
  the watch case at the 0.83:1 ratio with a thicker band.

## Z — Keys

Rename `home.day.cards6` → `home.day.cards` and `home.screens.widgets2` →
`home.screens.widgets` (replacing the old ones), then delete from all 28
locales: `home.hero.cards`, `home.dinner`, `home.screens.trmnl`,
`home.nav.privacy`, `home.nav.cta`, and any other `home.*` key no template
reads any more (list them).

## §15 — update the guard

Adjust to the new shape: hero = 7 scenes × 3 cards and 7 screenshots, the
rating row renders `RATING.value` (and nothing when `RATING` is null), no
element with class `shut`/`shut-rows` anywhere, day = 6 cards, calendars
card has 2 floating cards, every-screen bento = 5 boxes, no `trmnl` box.
Prove it can fail once (break one, show the message, restore).

## Verify

- `npm run build` green (paste the tail).
- Screenshots `/`, `/de/`, `/ar/` at 1440×900 and 390×844: hero at t=0 s,
  t=3 s, t=7 s (scene 2); the day grid; the intel block at three scroll
  positions (phone looks fixed, cards pass behind it); every-screen bento;
  final. Commit them under `claude-reports/2026-09-28/shots/007-*.webp`.
- 28 landing pages at 390 px: no horizontal overflow (paste the result line).
- No console errors on `/` and `/ar/`.

## Commit & push

`feat(site): Bevel home round 2 — hero scene loop, rating row, 6 day cards, fixed-phone intel, real widgets, tablet` —
body `Prompt: claude-prompts/2026-09-28/007-bevel-round2-page.md`. **Push now.** Never deploy.

## Report

`claude-reports/2026-09-28/007-bevel-round2-page.md` (≤ one page): D1 or D2
(and the measured hole rects), recipes shots used or fallback, the §15 proof,
overflow result, keys deleted, anything from the list you could not do and
why, SHAs, owner step `./deploy.sh`.
