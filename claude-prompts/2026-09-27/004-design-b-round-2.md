# Design B round 2 — hero tweaks, the showcase peek, and "title first, content second" slides

## Goal

Ammar's review of the live-built Design B (002, `09032b5`) on 2026-09-27. Eight
changes, all on the home page; the story machinery and everything 002 built
stays unless named here. Read `claude-reports/2026-09-27/002-home-page-design-b.md`
first — it tells you where things ended up.

Prerequisite: 002 + 003 merged (`git log` shows `09032b5` and the help
`a4b8c6c`). `npm run build` must already be green **without**
`HELP_SKIP_ROUTE_CHECK` — if it is not, stop and report `blocked`.

Done = build clean; `/`, `/de/`, `/ar/` at 1440×900 and 1280×720 with no
horizontal overflow; every snap stop below renders as described; mobile
(390) still the plain stacked page; `scrollWidth` 360 at 360 px.

## Scope

- **In:** `templates/landing.html`, `static/assets/style.css`,
  `static/assets/script.js`, `tools/check-build.mjs` (section 15),
  `static/assets/video/showcase.mp4` + `showcase.webp` (re-encode only).
- **Out:** `content/*.json` (keys that become idle stay idle — list them in
  the report), `build.mjs`/`site.config.mjs` unless a change below forces
  it (say which), legal, blog, help, what's-new, deploy. **Never run
  `./deploy.sh`.**

## The changes

### 1. Hero

- **Remove the pill** above the headline (`hero.chip` is no longer rendered —
  idle key).
- **`hero.notes[]` become pills**: the three notes ("Free", "No ads", "Servers
  in the EU") render as white outlined pills — the same `.chip` style the
  feature row under the showcase uses (white, 1px `--line`, 999px radius,
  14px/600). Centred, 10px gap, no middots.
- **"Open in your browser" on its own line**: the store badges stay on one
  row; `hero.webLink` moves to a new row directly under them (still the
  text-link style with the arrow), centred; then the pills row under that.
  Order top to bottom: h1 → lead → badges → web link → pills.
- `.by` timings shift with the rows (`0/.06`, `.04/.06`, `.08/.06`,
  `.10/.06`, `.12/.06`).

### 2. The showcase peeks into the hero screen

Today the hero fills the whole first screen and the video panel is a
surprise on the next flick. Ammar wants the **top of the video panel — with
the top part of the phone — visible under the hero on the first screen**.

- Hero slide: `min-height: max(540px, calc(100vh - var(--header-h) - var(--peek)))`
  with `--peek: 300px` (a token; `260px` at `max-height: 760px`). Keep
  `scroll-snap-align: start` on the hero **and** on the showcase, so the
  first flick still lands the panel exactly under the header.
- Showcase panel: the phone is bottom-anchored and 640px tall inside a
  `min(760px, …)` panel, so its top sits ~120px under the panel's top edge —
  a 300px peek shows the video, the two upper floating cards and the top
  ~180px of the phone. **Check that the phone top really is inside the peek
  at 1440×900** (measure `getBoundingClientRect` of the phone image vs the
  viewport before the first flick; paste the numbers) and adjust the panel
  height or the phone size until at least 120px of phone is visible.
- The hero content must still fit above the peek at 1440×900 and 1280×720
  (no clipping, nothing pushed under the panel); use the existing
  `max-height` tightening rules if needed.
- Mobile: no peek logic (plain flow already puts the panel right under the
  hero).

### 3. Story slab caption

Remove the "iPhone · Android" line under the `daili` wordmark in the mint
slab. Only the lowercase wordmark stays.

### 4. Pricing pills

Remove the `pricing.points[]` pill row (it repeats `pricing.lead` and the
promise). `pricing.points` becomes an idle key. Slide order stays: eyebrow →
€0 + bigNote → h2 → lead → promise → badges + web link.

### 5. "Title first, content second" — the two-step slides

For **web, how, compare and pricing** Ammar wants each slide to arrive in two
steps: the first flick shows **only the big centred title**, the next flick
moves the title up (smaller) and reveals the content. The web slide's
version: first stop = the browser window **whole, full width, centred, no
copy**; second stop = the window shrinks and slides aside while the copy
fades in behind it (today's settled state).

Mechanics (one pattern for all four, class `scene two-step`):

- The scene is **two screens tall**: `height: calc(2 * (100vh - var(--header-h)))`,
  `scroll-snap-align: start`. Inside it a sticky `.pin`
  (`position: sticky; top: var(--header-h); height: calc(100vh - var(--header-h))`)
  holds the content — the pin already exists in 002's markup; keep it.
- A second snap stop: an empty `<div class="snap2" aria-hidden="true"></div>`
  absolutely positioned at `top: calc(100vh - var(--header-h))` inside the
  scene with `scroll-snap-align: start`, `height: 1px`. With mandatory snap
  the browser now stops twice per scene.
- script.js: for a `.two-step` scene `--p` is **0 at the first stop and 1 at
  the second**: `p = clamp((headerH - rect.top) / (vh - headerH))` where
  `rect` is the scene. (Today's per-scene formula stays for `#faq`.) Set it
  on the scene as before; the existing `.by` rule keeps working.
- **Title block** (`.sec-head`, or the pricing eyebrow+€0+h2 group): at
  `--p: 0` centred in the pin, big — h2 `clamp(56px, 6.5vw, 96px)`, the
  pricing €0 at its current giant size; as `--p → 1` it moves to the pin's
  top and shrinks: `transform: translateY(calc(var(--p) * -1 * var(--lift)))`
  with `--lift` per slide (measure so the title ends where 002 put it) and
  `font-size: calc(<big>px - var(--p) * <big - small>px)` on the h2
  (the €0 shrinks the same way, to ~120px). No transitions — `--p` is the
  animation; `will-change: transform`.
- **Content** (`.steps`, the compare table + legend, the pricing lead +
  promise + badges): `.by` with `--a:.45;--w:.35` so it is invisible at the
  first stop and fully in at the second. Steps keep their staggered
  `:nth-child` starts, remapped into the `.45–1` window. Compare keeps its
  column-by-column reveal, remapped the same way.
- **Web slide**: the window is full width and centred at `--p: 0` (no copy
  visible), and 002's shrink-and-slide runs over `--p .2 → 1` (`--k`
  remapped), with `.web-copy` `.by` `--a:.55;--w:.3`. Nothing else changes.
- **Mobile ≤ 900px**: `.two-step` is one normal block (`height: auto`,
  `.snap2` gone, `.pin` static, `--p` forced to 1 by JS as today, title at
  its small size). **Reduced motion**: the same single-screen state (`--p` 1,
  `.snap2 { display: none }`, scene height one screen) — never two identical
  stops.
- FAQ + footer stay the last single slide.

### 6. Guard 15 additions

- the hero has no `.chip` element above the h1 and has three `.pill`
  (or whatever the class is) notes;
- the slab has no caption line under the wordmark (assert on the markup);
- no `class="points"` in `id="pricing"`;
- exactly four `.two-step` scenes (`web`, `how`, `compare`, `pricing`), each
  with exactly one `.snap2`, `#faq` with none;
- the video rules from 002 unchanged.
Prove one new rule can fail (delete a `.snap2`, run, paste, restore).

### 7. Showcase video swap (only if the owner already dropped a new clip)

Ammar is choosing a new showcase clip (3D floating feature icons). If
`/Users/ammarkhatib/Claude/Projects/Family Planner/website-redesign-2026-09-26/video/showcase-src.mp4`
is **newer** than `static/assets/video/showcase.mp4`, re-run 002's ffmpeg +
poster steps for `showcase` (same commands, same ≤ 2.5 MB target — CRF 28
first) and say so in the report. If it is not newer, leave the video alone.

## Constraints

Same as 002: no inverted sections, zero dependencies, no inline script,
self-hosted fonts, logical CSS properties, tokens only, file-write tool
only, self-correct twice then `blocked`. Do not add or edit content keys.

## Verify

- `npm run build` (no env skips); `npm run serve`; Playwright shots into
  `claude-reports/2026-09-27/shots-004/`: `/` at 1440×900 — hero with the
  peek (phone top visible), then each snap stop in order: showcase, chapter
  1, life, **web stop 1 + stop 2, how 1 + 2, compare 1 + 2, pricing 1 + 2**,
  faq; the same at 1280×720 for `/`; `/de/` and `/ar/` at 1440 for hero,
  web 1+2, pricing 2. Full page 390 for `/` and `/ar/`.
- Paste: the phone-top/viewport numbers from §2; `scrollWidth` at 360 on
  `/` and `/ar/`; with reduced motion emulated, the scroll height of `#how`
  equals one screen (paste); the number of snap stops at 1440×900 — count
  the elements whose **computed** `scroll-snap-align` is `start` — expected
  hero 1 + showcase 1 + chapters 7 + life 1 + four two-step scenes × 2 +
  faq 1 = **19** (paste the count).

## Commit & push

- `feat(site): Design B round 2 — hero pills + peek, two-step title slides, slab + pricing cleanups`
  — body `Prompt: claude-prompts/2026-09-27/004-design-b-round-2.md`. **Push now.**

## Report

`claude-reports/2026-09-27/004-design-b-round-2.md` (≤ one page): the peek
numbers, the snap-stop count, the guard proof, idle keys
(`hero.chip`, `pricing.points`, plus 002's list), whether the video was
re-encoded, owner actions (`./deploy.sh`, hand-test), commit SHA.
