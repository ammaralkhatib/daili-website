# Redesign 1/5 — fonts, tokens, header, language chip, footer

## Goal

daili.app gets a full visual redesign in five prompts (011–015, this folder).
This first one lays the foundation every later prompt builds on: the two brand
fonts (self-hosted), the CSS tokens, a new header with a **"Web app"** link and a
**small language chip** (globe + `EN`, not the full language name), a working
**mobile menu button**, and a footer that links the web app. After this prompt the
existing landing/legal/blog/support pages still build and render (with the new
header, fonts and colours); the landing page body itself is rebuilt in 014.

**The reference design** is `claude-prompts/2026-09-05/redesign-mock.html` — a
finished, hand-built HTML mock of the new home page (English). Its `<style>`
block is the target CSS; its header is the target header. Lift from it, do not
reinvent. Image placeholders in the mock look like `{{IMG:dashboard}}` — ignore
them here, 014 handles images.

Done = `npm run build` fully clean (all four steps), every page in `dist/`
carries the new header/footer and loads both fonts from `/assets/fonts/`, the
language chip shows the two-letter code, the burger menu works at 390 px, and
`check-build.mjs` proves the fonts are self-hosted.

## Scope

- **In:** `static/assets/fonts/` (new), `static/assets/style.css`,
  `static/assets/script.js`, `templates/layout.html`, `build.mjs`
  (`renderLangNav` + `renderFooterLinks` only), `content/*.json` (ONE new key,
  requirement 4), `tools/check-build.mjs` (one guard, requirement 7),
  `README.md` (fonts paragraph).
- **Out:** `templates/landing.html`, `site.config.mjs` (except nothing),
  `legal/`, `blog/`, images, `.htaccess` (its CSP already has
  `font-src 'self'` — verify, do not edit), deploy. **Never run `./deploy.sh`.**

## Requirements

1. **Fonts, self-hosted.** Copy these woff2 files from the web app's
   node_modules (`~/development/flutter_projects/familyplanner/daili-web/node_modules/@fontsource/`)
   into `static/assets/fonts/`:
   - `figtree/files/figtree-latin-{400,500,600,700}-normal.woff2`
   - `figtree/files/figtree-latin-ext-{400,700}-normal.woff2`
   - `sofia-sans-condensed/files/sofia-sans-condensed-{latin,latin-ext,cyrillic,greek}-{700,800}-normal.woff2`
   Declare them with `@font-face` at the top of `style.css`, each with the
   matching `unicode-range` from the @fontsource CSS file of the same name
   (`figtree/latin-400.css` etc. — copy the range verbatim so a Cyrillic page
   only downloads the Cyrillic face), `font-display: swap`. Copy the SIL OFL
   licence text of both fonts into `static/assets/fonts/LICENSE.txt` (it is in
   each package's `LICENSE` file). Font stacks exactly as the mock's
   `--display` and `--sans` tokens. Arabic, Thai, Hindi, CJK pages fall through
   to the system stack — that is intended; keep the existing per-language
   line-height/letter-spacing rules.

2. **Tokens + base.** Replace the `:root`, `[dir="rtl"]`, dark-mode and
   base-element rules in `style.css` with the mock's tokens (paper, card, ink,
   body, muted, forest, forest-deep, on-forest, mint, mint-strong, mint-soft,
   amber, amber-soft, line, frame, shadow, display, sans, ease) — **keep the
   existing `--dir` / `--rot-*` RTL machinery and the logical-property
   convention** (the mock uses physical `right:`/`left:` in a few places; when
   lifting, convert to `inset-inline-end/start` so Arabic still mirrors). Keep
   the site's existing dark-mode block approach (`prefers-color-scheme`); use
   the mock's dark values. Old rules that later prompts replace (hero,
   features, gallery, compare, pricing, faq) may stay for now so the current
   landing page still renders — 014 deletes them.

3. **Header** (`templates/layout.html`): brand (logo + lowercase wordmark
   `daili` in the display face, per the brand rule), then links
   **Features · Web app · Pricing · Support · Blog**, then the language chip,
   then the `Download` pill with the existing store-badge dropdown (keep
   `{{> storebadges }}` and the `.dl` behaviour unchanged). "Web app" is an
   external link to `https://app.daili.app` (`rel="noopener"`, same tab is
   fine), styled forest like the mock's `.nl-web`.
   **Mobile (≤ 860 px):** brand · language chip · round burger button; the
   burger opens the link list as a full-width panel under the header (mock:
   `body.menu-open`), closes on outside click and on Escape. No JavaScript →
   the links must still be reachable: render them in the DOM always, hide with
   CSS only. The old 3-row wrapping header is gone.

4. **Language chip** (`build.mjs` → `renderLangNav`): the `<summary>` shows the
   globe icon + the locale's **uppercase code** (`EN`, `DE`, `ZH` for both
   Chinese variants — the menu disambiguates them) + a small chevron; the
   `aria-label` stays the translated `nav.language`. The menu keeps the endonym
   grid (3 columns, 2 on narrow screens) and now prefixes each row with its
   code in the display face like the mock (`<small>DE</small>Deutsch`). Add ONE
   new content key, `nav.webApp` ("Web app" / "Web-App" / …), to **all 23**
   `content/*.json` files, translated properly (≥ 25-char identical-to-English
   check does not bite on a 7-char string, but translate anyway; keep `Daili`
   out of it). No other content keys.

5. **Footer**: copyright line left; right: `Web app` (→ app.daili.app) · Support
   · Blog · What's new · Privacy Policy · Terms · Impressum, in that order,
   generated in `renderFooterLinks` as today.

6. **script.js**: burger toggle + outside/Escape close, sticky-header shadow on
   scroll (already exists), the language-picker outside-click close (already
   exists — keep). Everything else in `script.js` stays.

7. **Guard** in `tools/check-build.mjs`: every built HTML page's CSS href
   resolves to a stylesheet whose `@font-face` `src` URLs ALL start with
   `/assets/fonts/` and each such file exists in `dist/`; and no built file
   references `fonts.googleapis.com` / `fonts.gstatic.com`. **Prove it can
   fail** (point one `src` at Google, run, restore) and paste the failing line
   in the report.

## Constraints

- Zero npm dependencies stays true (fonts are copied files, not a package).
- The home-page detector, hreflang, sitemap, blog, what's-new and legal pages
  must be untouched in behaviour — `check-build` proves it.
- Template engine has **no inverted sections**; conditionals are `{{? }}` only.
- `_storebadges.html` is included three times per page — no `id` attributes.
- Self-correct lint/tests (here: the four build steps) up to 2 attempts, then
  report `blocked`.

## Verify

- `npm run build` clean. `npm run serve`, open `/`, `/de/`, `/ar/`, `/ru/`,
  `/privacy.html`, `/blog/` at 1280 and 390 px; confirm fonts (DevTools →
  Network shows only `/assets/fonts/*.woff2`), the chip reads `EN` / `DE` /
  `AR`, the burger opens/closes, the Arabic header mirrors. Screenshots of `/`
  desktop + mobile and `/ar/` mobile into `claude-reports/2026-09-05/shots/`.

## Commit & push

- `feat(site): redesign foundation — self-hosted brand fonts, new header, language chip, footer`
  (body: `Prompt: claude-prompts/2026-09-05/011-redesign-foundation.md`).
- **Push now.** Pushing does not deploy this site.

## Report

- `claude-reports/2026-09-05/011-redesign-foundation.md`, short: what changed,
  the proven guard failure, the screenshots, anything that did not fit the mock
  and why. Open item for Ammar: nothing to deploy yet — deploy after 014.
