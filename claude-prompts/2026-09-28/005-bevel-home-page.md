# Bevel home 2/2 — build the new home page (bevel.health-style)

## Goal

Replace the Design-B home page with the new page Ammar approved on
2026-09-28, modelled on bevel.health: free scrolling with smooth scroll,
floating Daili cards that get ticked and fly away, a moving photo strip,
colourful feature cards, a dark "Daili Intelligence" block with stacking
cards, animated workflows, a "works on every screen" bento, a glass-lock
privacy panel, a photo mosaic and a flat-lay final section.

**The spec is the mock:** `claude-prompts/2026-09-28/bevel-mock/index.html`
(+ `assets/`, `media.json`). Open it in a browser and scroll it end to end
before writing anything. Its CSS (in `<style>`) and its motion code (the
`class Component` script at the bottom — `boot()` and `flows()`) are the
reference implementation: port them, don't reinvent them. Numbers, colours,
timings and layout in the mock are the intended ones.

Ammar's call: ship it, then polish it live. "Done" = the new page builds
clean in all 28 locales, looks like the mock on desktop and phone, the other
pages (support, legal, blog, help, what's-new, 404) still look right, and the
legal paths and store links are untouched.

Prerequisites — check all, else stop and report `blocked` naming which:
1. 004 merged (`git log` shows `content: Bevel home page strings`).
2. `curl -sI` on the first URL in `bevel-mock/media.json` returns 200
   (the generated photos live on Higgsfield's CDN until you download them).

## Scope

- **In:** `templates/landing.html`, `templates/layout.html` (header only),
  `build.mjs`, `site.config.mjs`, `static/assets/style.css`,
  `static/assets/script.js`, new `static/assets/home.css`,
  new `static/assets/home.js`, new `static/assets/vendor/`,
  new `static/assets/img/home/`, `tools/check-build.mjs` (§15 rewrite),
  `content/*.json` (only to delete keys that become unused).
- **Out:** legal texts, blog, help, what's-new content, `deploy.sh`,
  `.htaccess` (the CSP already allows `script-src 'self'` — self-hosted
  scripts need no change; if you find you must touch it, stop and report).
  **Never run `./deploy.sh`.**

## Step 0 — assets (before any HTML)

1. **Vendor scripts** → `static/assets/vendor/`: `gsap.min.js` and
   `ScrollTrigger.min.js` from npm `gsap@3.15.0` (`dist/`), `lenis.min.js`
   from npm `lenis@1.3.26` (`dist/`). Get them with
   `npm pack gsap@3.15.0 lenis@1.3.26` in a temp dir (do NOT add them to
   `package.json` — the site stays zero-dependency). Add
   `static/assets/vendor/LICENSES.md` naming both packages, versions and
   licences (GSAP "Standard 'No Charge' License", Lenis MIT). The files stay
   minified, unmodified.
2. **Generated media** → `static/assets/img/home/`: download every URL in
   `bevel-mock/media.json` (27 PNGs) to a temp dir outside the repo, convert
   with Pillow (as `tools/make-site-shots.py` does) to `<key>.webp`:
   - `p_*` (photos, 3:4): 720 px wide, quality 78, each ≤ 110 KB.
   - `o_*` (flat-lay objects, transparent): 520 px wide, **keep the alpha**
     (`RGBA`, quality 85, `method=6`), each ≤ 90 KB. Check one output really
     has an alpha channel.
   Never commit the PNGs. Paste the size table in the report.
3. **App artwork** → same folder: the 9 avatars
   (`familyplanner-app/assets/avatars/{adult_1,adult_7,adult_12,adult_20,adult_31,child_1,child_5,child_9,child_14}.png`,
   200 px webp) and Minzi (`familyplanner-app/assets/habits/minzi_sit.png`,
   `minzi_jump.png`, 400 px webp, alpha kept). The app repo is at
   `~/development/flutter_projects/familyplanner/familyplanner-app`.
4. **QR code** → copy `bevel-mock/assets/qr.svg` to
   `static/assets/img/home/qr.svg` (it encodes `https://daili.app`; verify
   by decoding it if you have a tool, otherwise say so).

## The page, top to bottom

Build every section from the mock's markup and CSS, with every string from
`home.*` (004) or the existing keys named below. Section ids and order are
asserted by §15:

1. **Header (all pages, `layout.html`)** — becomes the mock's floating
   pill: brand, links, language switcher (`page.langNav`, **keep it** — the
   mock has none, it sits before the CTA), "Log in" → `https://app.daili.app`,
   and the dark "Get the app" pill which opens the **existing** download
   menu (`.dl-btn`/`.dl-menu` + `_storebadges` partial, unchanged
   behaviour). Links: `home.nav.features` → `#features`, `home.nav.plus` →
   `#plus`, `home.nav.screens` → `#screens`, `home.nav.privacy` →
   `#privacy`, plus the existing Support and Blog links (on non-home pages
   the anchors become `<homeHref>#…`). Below 860 px: brand + CTA + burger,
   the links go into the existing burger panel (keep the `<noscript>`
   fallback working). Drop `nav.pricing` and `nav.webApp` from the header.
   ⚠ The mock's page root is `class="dl"`, which clashes with the site's
   `.dl` download menu — the mock root is not ported; never reuse that class.
2. **QR card** — fixed bottom-right, desktop only (≥ 861 px), landing only;
   fades out as the members section arrives (mock: `[data-qr]`).
3. **`<section class="hero" id="hero">`** — keep `class="hero"` (script.js's
   sticky CTA keys on it). `hero.h1a` / `hero.h1b` headline (split into
   words for the intro), `home.hero.lead`, CTA = `home.hero.cta` (opens the
   download menu / `#get`) + `hero.webLink`, the three `hero.notes[]` pills.
   Stage: phone with the localized `shot-home` via `imgSrc()` (eager,
   `alt=home.hero.alt`), the drawn Apple Watch (`home.watch.*`), the 7
   `home.hero.cards` (the mock's positions/icons/colours; cards 3, 6, 7 hidden
   below 860 px, the rest use the mock's mobile positions). Aurora
   background as in the mock. Then the "Works with" row (`home.works`).
4. **`<section class="members" id="features">`** — the two badges, the h2
   (`home.members.h2a` with `{count}` filled from `MEMBERS_COUNT` in
   `site.config.mjs`, formatted with `Intl.NumberFormat(locale)`; `h2b` on a
   second line), the marquee: 8 photo cards (`p_kitchen, p_market, p_teen,
   p_cake, p_football, p_super, p_desk, p_balcony` with
   `home.members.cards[i]`, the ticked state as in the mock) and the 2 tiles
   at positions 3 and 7. Add `export const MEMBERS_COUNT = 1000;` with the
   comment: "Real, current user count — Ammar updates it by hand. Never
   round up."
5. **`<section class="day">`** — `home.day` 3 cards (calendar / shopping /
   habits localized shots) + the **Dinner** wide card (`home.dinner`,
   `shot-mealplan`) + the **Calendars** wide card (`home.calendars`,
   `id="calendars"`, the orbit of tiles, `shot-calendar`).
6. **`<section class="intel" id="plus">`** — dark block: avatar strip (9
   avatars, names Lena, Marco, Emma, Noah, Mia, Oma Rosi, Opa Karl, Lukas,
   Sofia — names are data, not content keys; keep them in `site.config.mjs`),
   eyebrow + two-tone h2 + sub from `home.plus`, the 3 sticky stacking cards
   (`video` → `shot-recipes`, `letter` → `shot-calendar`, `ideas` →
   `shot-mealplan`), `home.plus.fine` under them.
7. **`<section class="flow" id="workflows">`** — the shutter bars at its top,
   the 4 workflow buttons + phone (`shot-calendar`, `shot-shopping`,
   `shot-todos`, `shot-habits`), overlays, toasts, Minzi jump — all from
   `home.flow`. The overlay positions in the mock (% of the screen) were
   measured on the English shots; check them on `de` and `ar` and adjust only
   if a tick lands visibly off its row.
8. **`<section class="screens" id="screens">`** — the bento: watch, widgets,
   TRMNL (`home.screens.trmnl.days`), browser (`web-calendar.webp`,
   `alt=home.screens.web.alt`), phones (`shot-birthdays`, `shot-notes`).
9. **`<section class="priv" id="privacy">`** — the vault with the glass
   lock SVG, `home.privacy`.
10. **`<section class="care">`** — the mosaic (7 columns, keys as in the
    mock) + `home.care`.
11. **Reviews** — render **only when `REVIEWS.length >= 3`**. Add
    `export const REVIEWS = [];` to `site.config.mjs` with a comment
    describing the shape `{ title, text, name, source: 'App Store' | 'Google Play', stars, lang }`
    (real reviews, shown in their original language with `lang` on the
    card; Ammar will add them). With the empty array: no section, no
    markup, no CSS hook left dangling. **No placeholder review text may ship.**
12. **`<section class="final" id="get">`** — `home.final` h2 + sub, the
    **real** store badges (`{{> storebadges }}`, which also carries the
    `stores.*.available` machinery) + `hero.webLink`, then the flat-lay:
    12 objects around the localized `shot-home` phone.
13. **`<section class="faq" id="faq">`** — keep the existing FAQ (`faq.*`,
    and its JSON-LD if the build emits one) as a calm `<details>` accordion
    in the page's style. The mock has no FAQ; this one stays for search and
    support.
14. **Footer** — the normal site footer after `</main>`
    (`page.siteFooter` true for the landing now; the "footer inside the last
    slide" special case goes, snap scrolling is gone).

**Removed from the home page:** showcase, story (sticky phone + screens),
life, web, how, compare, pricing slides, the snap scrolling (`html.landing`
snap rules), the Design-B videos (`static/assets/video/` — delete the folder
if nothing else uses it). Then grep `templates/`, `build.mjs` and
`site.config.mjs`: every content key no page uses any more is **deleted from
all 28 locales** (list them in the report). Keys another page still uses stay.

## Motion (`static/assets/home.js`, landing only)

Port the mock's `boot()` + `flows()` with these changes:

- The **window** scrolls on the real site: no `scroller` default, Lenis on
  the window (`new Lenis({ autoRaf: false, anchors: { offset: -90 } })`,
  driven from `gsap.ticker` exactly like the mock, `lenis.on('scroll',
  ScrollTrigger.update)`). The fixed header height is the anchor offset.
- Load order on the landing page only, all `defer`:
  `vendor/gsap.min.js`, `vendor/ScrollTrigger.min.js`, `vendor/lenis.min.js`,
  `home.js` (inject via `page.headExtra` for the landing; other pages load
  none of them). `home.css` likewise only on the landing.
- **No JS / reduced motion:** the page must be complete and readable —
  reveal states are set by JS only (never hide content in CSS), marquees and
  aurora stop under `prefers-reduced-motion`, hero cards show ticked, the
  flow shows item 1 with its overlay. With reduced motion Lenis is not
  started.
- **RTL (`ar`):** the page mirrors. Use logical properties
  (`inset-inline-start`, `margin-inline`, `padding-inline`) where the mock
  uses left/right for layout; the hero cards' fly-away direction and the
  marquee direction flip when `document.dir === 'rtl'`. The phone/text
  order in the wide cards mirrors by itself with grid.
- Keep `script.js` for what all pages need (burger, language menu, download
  menu, sticky CTA). Delete the Design-B-only code in it (story `--idx`,
  two-step slides, video policy) and say in the report what went.
- Re-run `ScrollTrigger.refresh()` after late images load (as the mock does)
  and on font load (`document.fonts.ready`).

## Constraints

- Zero npm dependencies stays true (`package.json` unchanged).
- Legal paths `/privacy.html`, `/datenschutz.html`, `/support.html` and all
  locale paths unchanged; the store on/off machinery and check-build §10
  untouched and green.
- No external URL anywhere in `dist/` for images, fonts or scripts (no
  CloudFront, no CDN) — everything self-hosted.
- The brand rule: bare lowercase "daili" in display spots (wordmark, QR
  title), "Daili" inside sentences.
- `text-transform: uppercase` nowhere in the new CSS (Turkish/Greek casing).
- Other pages must not change look except the header. Take screenshots of
  `/support.html`, `/blog/`, `/help/` (index), `/privacy.html` and the 404
  page at 1440×900 and 390×844 **before** your first edit and after the
  build, and compare them.

## Check-build §15 — rewrite

Replace the Design-B assertions with the new page's shape, on all 28 built
landing pages:
- the sections exist in this order: `#hero`, `#features`, `.day`, `#plus`,
  `#workflows`, `#screens`, `#privacy`, `.care`, (reviews only if
  `REVIEWS.length >= 3`), `#get`, `#faq`; the footer follows `</main>`;
- the hero has exactly 7 cards, the members track exactly 8 photo cards
  (count unique cards if the track is duplicated for the loop), the flow
  exactly 4 buttons / 4 screens / 4 toasts, the intel block 3 cards;
- `{count}` appears nowhere in `dist/`, and each landing page shows the
  member number formatted for its locale;
- with `REVIEWS` empty there is no reviews section, and the strings
  `Placeholder` and `Sample name` appear nowhere in `dist/`;
- the three vendor scripts + `home.js` are referenced on the landing pages
  and on no other page; every `/assets/img/home/*` reference resolves to a
  file in `dist/`, none over 120 KB;
- no `cloudfront.net` and no `http(s)://` image/script source in `dist/`
  HTML.
Prove the guard can fail (per the guard-tests rule): break one assertion on
purpose (e.g. drop one hero card), show the failing message, restore.

## Verify

- `npm run build` green — paste the last lines.
- Screenshots of `/`, `/de/`, `/ar/` at 1440×900 (at scroll 0, the members
  strip, the intel stack mid-scroll, the final flat-lay) and 390×844 (top,
  middle, end). Compare with the mock; list any visible difference you left
  and why.
- Horizontal overflow: for all 28 landing pages at 390 px,
  `document.documentElement.scrollWidth <= innerWidth` (script it, paste the
  result line).
- The other-pages before/after comparison (header change only).
- Console: no errors on `/` and `/ar/` in desktop and mobile emulation.

## Commit & push

- `feat(site): Bevel-style home page — smooth scroll, floating cards, intel stack, flat-lay`
  — body `Prompt: claude-prompts/2026-09-28/005-bevel-home-page.md`.
  One commit for the page; a separate `chore(content): drop keys the old home page used`
  if you delete keys. **Push now.** Never deploy.

## Report

`claude-reports/2026-09-28/005-bevel-home-page.md` (≤ one page): media size
table (one line per group: count, min/max KB), what was removed from
script.js/style.css/content, the §15 guard proof, the overflow result, known
differences from the mock, SHAs, push result, and the owner step:
`./deploy.sh` (Ammar runs it).
