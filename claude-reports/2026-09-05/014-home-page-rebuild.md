# 014 — rebuild the home page from the mock

Prompt: `claude-prompts/2026-09-05/014-home-page-rebuild.md`
Commit: `7fbf72d`

Prerequisites checked first: 011 `4d82f80`, 012 `9205975`, 013 `ba5d6ef` are all
on `main`. Nothing was blocked.

## What shipped

`templates/landing.html` is now the mock's markup in the site's engine: hero
(kicker, headline, lead, store badges, web link, three ✓ notes) with a phone in
front of a browser window → trust strip → the seven-tile feature grid → the dark
"also on your computer" block → three steps → comparison → the €0 price block →
FAQ with the first answer open. The sticky mobile CTA stays.

Behind it:

| File | What changed |
|---|---|
| `templates/landing.html` | rewritten from the mock; the seven alternating feature blocks, the gallery strip, the early-bird box and the empty `testimonials` section are gone |
| `build.mjs` | `renderTrustPills` → inline strip, `renderFeatures` → bento tiles, `renderHeroShots` → phone + web screenshot, `renderCompareTable` → `.cmp` classes, **new** `renderFaq`, **deleted** `renderGallery` |
| `site.config.mjs` | `FEATURES` is now `{ key, tile, shot? }`, **new** `TILE_ICONS`, **deleted** `GALLERY`, `IMAGE_SIZES` gained `web-` (1600×1000) |
| `static/assets/style.css` | the mock's CSS in logical properties; every rule for the old hero, feature blocks, gallery, pill cards, compare table, price box and scroll-reveal deleted |
| `static/assets/script.js` | the `.reveal` IntersectionObserver block removed (−1.9 kB); header, burger, menus, badge promotion, "coming soon" cards and sticky CTA untouched |
| `content/*.json` (23) | removed `gallery.*`, `hero.note`, `pricing.earlyBirdTitle`, `pricing.earlyBird`, `pricing.cta` — 176 keys per locale, `check-content` passes |
| `tools/check-build.mjs` | new section 15, below |
| `static/assets/img/web-calendar.webp` | **placeholder** — see owner actions |

## Numbers

Measured in headless Chrome against `dist/` on `npm run serve`, after scrolling
each page to force every `loading="lazy"` image. Full-page heights:

| Page | Before (HEAD) | After | Change |
|---|---|---|---|
| `/` at 1280 | **8807 px** | **6030 px** | **−31.5 %** |
| `/` at 390 | 11694 px | 8800 px | −24.8 % |
| `/de/` at 1280 | 8807 px | 6283 px | −28.7 % |
| `/ar/` at 1280 | — | 5984 px | — |

The "before" numbers are from a `git worktree` build of `9c5a347`, not from the
prompt's estimate. The 25 % target is met at 1280 with room to spare.

**Horizontal overflow — `document.documentElement.scrollWidth` at 360 px:**

```
/      360   scrollWidth = 360
/ar/   360   scrollWidth = 360
```

Also 390 = 390 on `/`, `/de/`, `/ar/`, `/support.html`, `/privacy.html`,
`/blog/`, `/whats-new.html`, `/404.html` and a blog post. The one element wider
than the viewport is the comparison table (`min-width:520px`), which scrolls
inside its own `.table-scroll` and never reaches the document.

## The guard (check-build.mjs section 15)

There were no existing landing-page assertions naming the gallery or feature
markup to update — nothing in `check-build.mjs` looked at the home page's body
at all. Section 15 is new and asserts, on all 23 built landing pages:

- the eight blocks exist **in the mock's order** (hero → trust → features → web
  → how → compare → pricing → faq);
- exactly one `<div class="bento">` holding exactly `FEATURES.length` tiles;
- exactly one `<div class="web">`, and an `href="https://app.daili.app"`
  **inside that block** — the header, the hero and one FAQ answer all mention
  the web app too, so a page-wide substring check would pass on a section that
  had lost its link.

Proof it fails (three ways, against a built `dist/` then rebuilt):

```
$ # one <article class="tile t-bday"> deleted from dist/index.html,
$ # and the web CTA's href replaced with "#"
$ node tools/check-build.mjs
2 build errors:
index.html   has 6 feature tiles, FEATURES has 7 — a tile was dropped from the grid
index.html   the web-app block does not link to https://app.daili.app — that
             block is the only reason the section exists

$ # and with the trust strip cut out of dist/de/index.html
de/index.html  has no trust strip block (<div class="trust") — the landing page
               is missing a section
```

Deleting the tile from `FEATURES` itself never reaches section 15: `check-content`
stops the build first with "features.birthdays orphan — not in FEATURES", in all
23 locales. That is the older guard doing its job, so the tile count in section
15 is the second lock, for a tile lost in `renderFeatures` rather than in config.

## Deviations from the mock, and why

1. **No floating notification cards** (`.f1`, `.f2`). As instructed — four
   strings × 23 locales for decoration.
2. **The browser window shows a real screenshot, not the CSS-drawn week.** The
   mock draws a fake calendar in ~40 elements of markup; requirement 2 asks for
   `web-calendar.webp`. The mock's `.webmock`, `.week`, `.day` and `.ev` rules
   are therefore not in the stylesheet at all.
3. **Bullets render on every tile that has them**, not only the calendar tile.
   The mock shows bullets on `t-cal` only, but requirement 3 says the tile copy
   is "h2 + p + bullets" and empty arrays render nothing — so shopping (3),
   to-dos (2) and meals (3) show theirs. On the narrow `t-shop` tile that meant
   the last two bullets ran under the phone bezel, so its copy is clamped to 56 %
   (mock: 62 %) and its screenshot moved out and down (52 % / −20 % / −52 %).
   **If you would rather have the mock's airier tile, the fix is one line in
   `renderFeatures`** — say so and the bullets come off the shot tiles.
4. **Row labels in the comparison table stay `<th scope="row">`** (the mock uses
   `<td>`). Keeps the table navigable by screen reader; `.cmp tbody th` resets
   the display face the mock's `th` rule would otherwise apply.
5. **The Daili column is marked with a class, not only `:has()`** — requirement
   5. Every cell of it carries `class="d"`; the `:has()` rule is kept alongside.
6. **The hero's phone keeps a real `alt`** (`hero.altHome`); the browser window
   is `aria-hidden` with `alt=""`. The mock hides the whole stack. The phone is
   the product, and there is no content key for the web capture to use.
7. **The trust strip is `role="group"` with `aria-label="{{ trust.h2 }}"`.** The
   mock's strip has no heading; this keeps the (translated) heading doing
   something for screen readers without putting it back on the page.
8. **`.copy` inside a tile is a flex column with the same 10px gap as the tile.**
   In the mock the two tiles that wrap their words in `.copy` space them by
   margins only, which reads visibly tighter than the five that do not.
9. **Colours the mock hard-codes are tokens**: `--cat-green/-amber/-plum/-sky/-red`
   (the kicker dots and the family avatars — deliberately *not* flipped in dark
   mode: they are the app's own event colours), `--amber-ic`/`--amber-ink` for
   the family tile's chip, and `--web-mint`/`--web-mint-ink` for the dark block.
   That last pair matters: the mock uses `--mint-strong`, which *darkens* in dark
   mode and would have put a near-black tick and near-black button text on a
   near-black card.
10. **Type scale is scoped, not global.** The mock sets `h2` and `h3` sizes on
    the elements; here they are on `.sec-head h2, .web h2, .price h2`, `.tile h3`
    and `.step h3`, so the legal pages, the blog, the release notes and support
    keep the sizes they set. Nothing else on the site moved: `/support.html`,
    `/privacy.html`, `/whats-new.html`, `/404.html`, `/blog/` and a blog post
    were all captured at 390 px and are unchanged.
11. **`.hero h1` is `clamp(2.7rem, 6.4vw, 5.4rem)`** (mock: `clamp(3rem, 7vw,
    5.4rem)`) and Arabic/Thai get `line-height:1.2` instead of `.98`, which clips
    marks above and below the line.

Two keys are now in content but rendered nowhere: `pricing.lead` and
`hero.altCalendar` (requirement 7 says `altCalendar` stays), plus every
`features.*.eyebrow` — requirement 3 says to keep those. `pricing.lead` is the
only one that looks like an oversight rather than a decision: the mock's price
block goes straight from the headline to the checklist. **Say the word and it
either comes back under the headline or comes out of all 23 files.**

## Screenshots

In `claude-reports/2026-09-05/shots/`:

`014-home-1280.png`, `014-home-de-1280.png`, `014-home-ar-1280.png`,
`014-home-390.png`, `014-home-de-390.png`, `014-home-ar-390.png`,
`014-home-1280-dark.png`, `014-home-390-dark.png`, and the pages the new CSS had
to leave alone: `014-support-390.png`, `014-privacy-390.png`, `014-blog-390.png`,
`014-post-390.png`, `014-whatsnew-390.png`, `014-404-390.png`.

Arabic mirrors throughout: the stack, the tile screenshots, the avatars, the
tinted column and the tick rules all flip; the address bar in the browser frame
stays LTR, because a URL is not mirrored text.

## Owner actions

1. **Replace `static/assets/img/web-calendar.webp` with a real capture.** It is
   a flat mint 1600×1000 placeholder right now, and it appears twice on every
   landing page (hero and web section) — the two largest empty rectangles on the
   page. Wanted: `app.daili.app/calendar`, week view, the Bergers demo family,
   1600×1000, webp. Nothing else needs to change when it lands; the file name
   and the recorded size already match.
2. **Deploy: `./deploy.sh`.** 011–014 together are the new site, and this is the
   commit that makes them one page. (Not run here — the prompt says never.)
3. Decide on `pricing.lead` (above), and on whether the shot tiles keep their
   bullets (deviation 3).
