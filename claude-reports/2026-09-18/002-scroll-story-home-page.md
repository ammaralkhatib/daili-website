# Report — 002 scroll story 2/2, the home page

Prompt: `claude-prompts/2026-09-18/002-scroll-story-home-page.md`
Prerequisite 001 was merged first (`2ff3c40`, `c2a064f`).
Commit: `41b4e41 (the page) · 5422d66 (the web capture)`

## Done

The home page is the story: eight chapters (hero + the seven `FEATURES`), one
sticky phone with eight stacked screenshots, three floating cards per chapter,
then the five slides — web app, steps, comparison, price, FAQ with the footer
inside it. Snapping is on `<html class="landing">` above 900 px only; below that
it is a plain page with each chapter's own screenshot under its text.

`npm run build` is clean through all four links; `tools/check-build.mjs` section
15 was rewritten for the new page and fails when a chapter goes missing (proof
below).

## The numbers

Measured in headless Chrome 153 inside an iframe sized to the exact viewport —
headless Chrome on macOS refuses a window narrower than ~500 px, so 360 px and
390 px are impossible to test with `--window-size`, and an iframe of that width
is a real viewport for `vh`, sticky, snap and the scroll container.

**No horizontal overflow at 360 px** (`document.documentElement.scrollWidth`):

```
/      360×800   scrollWidth 360   clientWidth 360   page 12813 px
/ar/   360×800   scrollWidth 360   clientWidth 360   page 12491 px
/      390×844   scrollWidth 390   clientWidth 390   page 12656 px
/ar/   390×844   scrollWidth 390   clientWidth 390   page 12560 px
```

**One flick = one slide.** At 1440×900, `scrollTo(0, innerHeight - 64)` then
reading `--idx` off `.screen`:

```
/      idx 1.000   scrollY 837   chapter 1 top = 64 (the header line)   page 11084 px
/de/   idx 1.000   scrollY 837   chapter 1 top = 64                     page 11084 px
/ar/   idx 1.000   scrollY 837   chapter 1 top = 64                     page 11072 px
/      1280×720 · scrollTo(0, 656) → idx 1.000, page 9025 px
```

`scrollY` lands on 837 rather than 836 because the header is 65 px tall, not 64:
`--header-h` is 64 and `header` adds a 1 px transparent bottom border that turns
visible on scroll. Snap absorbs it — chapter 1's top is exactly on the header
line afterwards — so the extra pixel is invisible, and `--idx` is 1.000 anyway
because the per-chapter fraction is clamped.

**Total page height at 1440×900: 11 084 px** (13 slides of 836 px plus the
header and the last slide's footer). The old page was 8 700 px.

A programmatic scroll to a far slide arrives exactly: `scrollTo(0, 6689)` (the
web slide) ends on 6689 with the story's `--idx` at its last chapter, and a
scroll past the end snaps to the FAQ slide's top. An earlier reading that looked
like it stopped 2 000 px short was the measurement catching `scroll-behavior:
smooth` mid-animation, not the page.

## Found and fixed while reading the screenshots

- **`/ar/` counted backwards.** The chapter counter `1 / 7` is two digit runs
  and a neutral slash, so an Arabic paragraph reorders it to "7 / 1". It is
  wrapped in `<bdi>` now — the same fix, for the same reason, as the endonyms
  in the language picker.
- **Reduced motion would have stacked all twenty-four cards over the phone.**
  Pinning every `--p` to 1, as the prompt describes, makes the text visible but
  also makes all eight card groups visible at once. The chapters are pinned; the
  cards keep the real values, because which three cards show is content, not an
  effect.
- **`--idx` ran to 8.** Once the last chapter scrolls past, the fraction pushed
  the index one past the last chapter, which dropped the story's ground colour
  and its active dot while the section was still partly on screen. Clamped.

## Guard proof

`tools/check-build.mjs` 15 now asserts the six blocks in order, `FEATURES.length
+ 1` chapters, the same number of `--k` screenshots and of `.floats` groups,
three `.fc` per group, the web slide's link, the footer inside the last slide,
and that no `class="bento"` / `class="tile"` survives. With the hero chapter
deleted from `templates/landing.html`:

```
28 build error(s):
index.html                         has 7 story chapters, expected 8 (FEATURES + the hero) — a chapter was dropped
de/index.html                      has 7 story chapters, expected 8 (FEATURES + the hero) — a chapter was dropped
```

Restored, and the build is green again.

## Deviations from the mock, and why

1. **Three cards in the hero, not four.** The mock's hero floats four cards; 001
   gives every chapter exactly three. The dropped one is "Emma turns 12", which
   the birthdays chapter shows anyway. The ticked card took the dropped card's
   start-side slot so the group still balances two/one around the phone.
2. **`t` is bold as a whole.** The mock hand-writes the emphasis inside a card
   (`<b>Milk</b> · 2 l`); the content files carry one string, so `t` is the bold
   line and `s` the small one, as the prompt specifies. On a ticked card only
   `t` is struck through — the mock struck the small line too, which made
   "Noah · done" hard to read.
3. **The status badges show both lines.** The mock's dark pills are one line
   ("synced in about a second"); 001 gives them a `t` and an `s`, so the pill
   carries both, the second at 65 % of the paper colour.
4. **The hand-drawn underline is a background, not an overlay.** The mock puts
   an absolutely positioned SVG under a `white-space: nowrap` span, which pushes
   the headline off screen in German, Finnish, Turkish and Polish. Same drawing,
   applied as a background image on the inline box, so it wraps with the text.
5. **Eight icons, not seven.** The prompt lists repeat, bell, cake, arrow, lock,
   photo, link; the mock's meal card uses a pot, so `STORY_ICONS` has eight.
6. **Two card shapes the five kinds could not draw.** The to-do card is a
   checkbox, text, then the assignee's avatar (`box: true`), and the family card
   is five overlapping avatars (`kind: 'avs'`). Both are in `STORY_CARDS`.
7. **The two dark chapters have their own tokens.** `--forest-deep` and `--ink`
   both go *light* in this site's dark mode (they are a hover colour and body
   text there), so using them as the mock does would paint a full-screen
   near-white chapter and then put white text on it. `--stage-forest`,
   `--stage-ink` and `--on-dark` stay dark in both modes.
8. **`min-height`, not `height`, on chapters and slides** (the prompt's
   instruction, not the mock's): a long translation may make a chapter taller
   than the viewport, and the FAQ has eight questions here against the mock's
   four. This is also why script.js reads each chapter's own height instead of
   assuming one screen.
9. **The step numbers stay a CSS counter.** The mock writes `<div class="n">1`
   into the markup; the template loops the three steps and has no index, and a
   digit is not content.
10. **The header is 64 px now, not 66.** The prompt says to tokenise "the 64 px
    header", the mock's header is 64, and the slide geometry only works if the
    chapter height and the scroll step agree. `.nav` is `var(--header-h)`.
11. **`#features` survives as an id** on the first feature chapter. The header
    link said `#features` and the grid it pointed at is gone; pointing it at
    `#story` would have scrolled to the top of the page, which does nothing.
12. **`.by` defaults to visible.** In the mock `--p` starts at 0, so a blocked
    or failed script.js leaves a blank home page. Here the CSS default is the
    finished state and script.js turns the animation on by writing real values
    in its first frame.
13. **The hero chapter is in the template, the other seven come from
    `renderStory()`.** Chapter 0 is the only one with store badges, and those
    come from the `storebadges` partial — the engine resolves a partial in a
    template, not inside a string build.mjs hands it. `renderStory` returns
    `{ chapters, screens, floats, dots, heroMshot }`: five lists that have to
    stay in the same order, which is why one function builds them all.
14. **The footer moved inside the last slide** through `page.footerHtml` plus a
    `{{? page.siteFooter }}` guard in layout.html, so every other page keeps it
    after `</main>` and the two can never drift apart.

## What was deleted from style.css

`.hero` (grid, mint glow, kicker, h1/em/lead/ctas/note), `.stack`, the `.phone`
bezel, the whole `.trust` strip, `.bento` / `.tile` / `.t-*` and their 960 px and
600 px media blocks, the boxed dark `.web` panel, the bordered `.step` card, the
mint `.price` box, the old `.faq` card rules, `section.block`, the hero/stack/
web/price arms of the responsive block, and `.tile:hover` from the
reduced-motion block. `.laptop` (frame, bar, url) survived and is reused by the
web slide; `.legal`, the blog, what's-new, support, 404 and the store badges
were not touched.

`site.config.mjs` lost `TILE_ICONS` and `TRUST_ICONS` (grep: nothing else read
them) and the `tile` field; it gained `shot` on every FEATURES entry,
`WEB_APP_URL`, `STORY_ICONS` and `STORY_CARDS`. `build.mjs` lost
`renderFeatures`, `renderTrustPills`, `renderHeroShots` and `imgTag`, and gained
`renderStory`, `renderWebShot`, `storyCard` and `renderFooter`.

## Screenshots

`claude-reports/2026-09-18/shots/` — 1440×900 and 1280×720 desktop, 390 mobile,
and the three other page types at 390. The mid-slide captures have snap switched
off for the screenshot only, because a programmatic scroll to half a slide is
otherwise re-snapped before the shutter.

| file | what it shows |
|---|---|
| `en-1440-slide0.png` `de-…` `ar-…` | chapter 0, the hero, with its three cards |
| `en-1440-slide0.5.png` `de-…` `ar-…` | half a slide: the calendar screen sliding up over the home screen, rounded corners, the lip shadow only mid-slide |
| `en-1440-slide1.png` `de-…` `ar-…` | chapter 1 settled: the forest ground, the text built up, no shadow under the settled screen |
| `en-1440-web.png` `de-…` `ar-…` | the web slide, the browser window shrunk aside with the copy behind it |
| `en-390-top.png` `de-…` `ar-…` | the plain mobile page: text, then each chapter's own screenshot |
| `en-390-lower.png` | further down the mobile page |
| `en-390-support.png` `en-390-privacy.png` `en-390-blog.png` | the three other page types, unchanged by the new CSS |

Captured with headless Chrome 153 through the iframe harness described above;
`/ar/` is rendered with `?hl=en` only to stop the language detector redirecting
the harness — the page itself is the Arabic build.

## Owner actions

1. **`static/assets/img/web-calendar.webp` is already the real capture** — it
   changed from the 2.9 KB mint placeholder to a 47 KB 1600×1000 capture of
   `app.daili.app` (week view, September 2026, the Bergers) while this ran, so
   the blocker the prompt asked for is gone. It was an uncommitted change to a
   tracked file; it is committed here in its own commit so it cannot get lost.
2. Click through `/`, `/de/` and `/ar/` on the Mac with a trackpad **and** a
   mouse wheel, and on a real phone. Headless Chrome cannot tell you whether one
   flick feels like one slide.
3. `./deploy.sh` (never run from here).
4. Still open from the plan doc: delete the nine 1.6 MB PNG originals in
   `static/assets/img/photos/` — everything under `static/` is copied to the
   live site — and the untracked `_to_delete/` folder at the repo root.

## Also in this run

- `claude-prompts/2026-09-05/016-redesign-fixups.md` deleted (untracked,
  superseded — its `nav.menu` item shipped in 001).
- The burger's `aria-label` is `{{ nav.menu }}` in all 28 locales.
- `trust.*` and `featuresSection.*` are now idle in all 28 content files: the
  page renders neither. They were kept on purpose (001) and nothing warns about
  them, so if the trust strip does not come back, a later run should delete the
  keys rather than leave them to rot.
