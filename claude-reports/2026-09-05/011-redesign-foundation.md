# Redesign 1/5 — fonts, tokens, header, language chip, footer

Prompt: `claude-prompts/2026-09-05/011-redesign-foundation.md`.
Build clean: `content OK · 23 locale(s) · 160 keys each` → `built 66 pages` →
`build OK · 66 pages · 52 in hreflang clusters` → `detector OK · 32 cases`.

**Nothing to deploy yet.** The landing page body is still the old one; deploy
after 014.

## What changed

**Fonts.** 14 woff2 files copied out of the web app's `@fontsource` packages
(figtree 5.3.0, sofia-sans-condensed 5.3.0) into `static/assets/fonts/`, plus
both SIL OFL texts in `LICENSE.txt` there. Every `@font-face` carries the
`unicode-range` of its subset copied verbatim from the package's own CSS, so the
subsetting works: `/ru/` pulls `sofia-sans-condensed-cyrillic-{700,800}`,
`/de/` and `/en/` do not, and `/ar/` downloads no Arabic face at all because
neither family has one — it falls through to the system stack, as intended.
Measured in the browser, not assumed (see *Verified* below). Still zero npm
dependencies: copied files, not a package.

**Tokens + base.** `:root`, the dark-mode block and the base elements are the
mock's. The `--dir` / `--rot-*` RTL machinery and the logical-property
convention are untouched; everything lifted from the mock was converted from
`right:`/`left:` to `inset-inline-*` on the way in. Four legacy tokens
(`--cream`, `--trust-a`, `--trust-b`, `--radius`) are kept and commented — only
the landing sections 014 rebuilds still read them, and dropping them now would
render the current home page unstyled.

**Header.** Brand (logo + lowercase `daili` in the display face) · Features ·
**Web app** · Pricing · Support · Blog · language chip · Download. Web app is
`https://app.daili.app`, `rel="noopener"`, same tab, styled forest. The
store-badge dropdown and `{{> storebadges }}` are unchanged. Below 860px:
brand · chip · burger, with the links **and** the Download pill in a panel the
burger opens — absolutely positioned inside the sticky `<header>`, so it is
full-bleed, overlays the page and needs no hard-coded header height.

**Language chip.** `<summary>` is globe + the uppercase code + a chevron; both
Chinese builds read `ZH`. `aria-label` is still the translated `nav.language`.
The menu keeps the endonym grid and now prefixes each row with its code in the
display face.

**Footer.** Web app · Support · Blog · What's new · Privacy · Terms · Impressum,
as a flex row with its own gaps instead of a `·`-joined sentence.

**Content.** One new key, `nav.webApp`, in all 23 files, translated.

## The proven guard failure

New section 13 in `check-build.mjs`: every built page's stylesheet is resolved,
every `@font-face` `src` must start with `/assets/fonts/` and name a file that
exists in `dist/`, and no file anywhere in the built tree may mention
`fonts.googleapis.com` / `fonts.gstatic.com`.

Pointed one `src` at Google, ran `npm run build`, restored it:

```
2 build error(s):
assets/style.cf500cf4.css          @font-face src "https://fonts.gstatic.com/s/figtree/v5/figtree-latin-400-normal.woff2" is not under /assets/fonts/ — the brand fonts are self-hosted, never fetched from anywhere else
assets/style.cf500cf4.css          references fonts.gstatic.com — the fonts are served from /assets/fonts/, and the CSP is font-src 'self'
```

Both halves fired. `static/.htaccess` already has `font-src 'self'` — verified,
not edited.

## Verified

Measured in headless Chrome against `npm run serve`, via `performance
.getEntriesByType("resource")` and computed styles:

| Page | fonts fetched | `h1` family | chip |
|---|---|---|---|
| `/de/` | 4× figtree-latin, 2× sofia-latin | Sofia Sans Condensed | `DE` |
| `/ru/` | the same **+ sofia-cyrillic-700/800** | Sofia Sans Condensed | `RU` |
| `/ar/` | latin only — no Arabic face exists | Sofia Sans Condensed | `AR` |
| `/privacy.html`, `/blog/` | figtree + sofia latin | Sofia Sans Condensed | `EN` |

Every URL was `/assets/fonts/*.woff2`. No request to any other host, on any
page. `clientWidth === body.scrollWidth` on all five, so nothing overflows
sideways. Burger opens and closes at 390px; `/ar/` mirrors — brand right, chip
and burger left, panel right-aligned.

Screenshots in `shots/`: `011-home-1280.png`, `011-home-390.png`,
`011-home-390-menu.png` (panel open), `011-ar-390.png`,
`011-langpicker-1280.png`.

## Did not fit the mock, and why

- **One picker, not two.** The mock ships a second, abbreviated `.lang-mobile`
  for phones because the desktop one is inside the panel. Duplicating 23 rows
  into every page was not worth it, so `.menu` — the panel — is
  `display:contents` on desktop: `.links`, `.langpicker` and `.dl` all become
  direct flex items of `.nav`, and `order` puts the chip between the links and
  the pill. Below 860px `.menu` becomes a real box and the chip, which was never
  inside it, stays in the header row. Same result, one DOM, one picker.
- **The panel is absolute, not `position:fixed; inset:66px 0 auto 0`.** Same
  overlay, but anchored to the sticky header, so it does not depend on the
  header being exactly 66px tall and has no physical inset to mirror in Arabic.
- **`<bdi>` instead of `dir="rtl"` on the Arabic picker row.** The row is a flex
  line (code, then endonym) and `dir` on the `<a>` reverses it, so on an English
  page the Arabic row alone came out mirrored and fell out of its column.
  `<bdi>` isolates the name's direction without touching the layout — and needs
  no attribute, it detects RTL from the text.
- **The mock's `h2`/`h3` font *sizes* are not in the base rules**, only the
  family, weight and tracking. `h2{font-size:clamp(2rem,4.4vw,3.1rem)}` belongs
  to the rebuilt landing page; adding it now would be a landmine for the legal,
  support and blog pages 014 does not touch. Same reason the mock's
  `line-height:1.02` gets one compensating rule for those pages — 1.02 is right
  for 3rem display type and makes two lines touch at 1.25rem, which is where
  every German legal heading wraps.
- **`.eyebrow` was left alone.** The mock redefines it as a rule + uppercase
  label; the current landing page uses it as a pill. That is 014's.
- **The `≤560px` rule hiding the Blog link is gone.** It existed because the old
  header wrapped; the links are one-per-line in a panel now, so the Blog link is
  reachable in every locale at every width.

## Open items for Ammar

1. **Nothing to deploy.** After 014.
2. **The burger's `aria-label` is the English word "Menu"** in all 23 locales.
   The prompt allowed exactly one new content key and that was `nav.webApp`, so
   there is no translated string to use. It is a real gap for `/ar/`, `/ja/`,
   `/ko/`, `/th/`, `/hi/` and the two Chinese builds — the word is a loanword in
   most of the Latin-script locales but not those. One key, `nav.menu`, in a
   later prompt fixes it; the file to change is `templates/layout.html`.
3. **The desktop screenshot of `/` is the English root with the language
   detector stripped.** The detector reads `navigator.languages`, headless
   Chrome's `--lang` does not change it (the README says so), and this machine
   redirects `/` to `/de/`. The detector is the only difference between that
   file and the real `/`, and `/de/` at both widths was checked separately.
