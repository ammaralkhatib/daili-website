# Smart App Banner, share preview, store-click counter, small SEO fixes

## Why

Analysis 2026-10-12 (Project doc `claude/user-drop-analysis-2026-10-12.md`):
App Store downloads that come from daili.app fell from ~6.5 to ~1.6 a day since
late September. Google traffic to the site did NOT fall (it rose), the site is
fast and the mobile layout is fine. So SEO is not the cause; the weak spot is
the step from "visitor on the site" to "opens the store" — and we cannot even
measure it today. The app will soon share `https://daili.app/?ref=welcome` and
`?ref=settings` links (app prompt `2026-10-12/001`), so the link preview in
WhatsApp/Messenger matters too.

## Scope

- In: `templates/layout.html` (head), `build.mjs` (head/meta + JSON-LD),
  `static/assets/script.js`, a new `static/assets/c.gif` (1×1), a new
  generator under `tools/` for the share images + its output in
  `static/assets/img/og/`, `tools/check-build.mjs` (checks for the new head
  tags), image `alt` texts in templates/content where they are missing.
- Out: page design and copy, legal pages' text, blog posts' content.
  🔴 Untracked files that are NOT yours (`claude-reports/2026-10-01/`,
  `static/assets/img/blog/what-to-look-for-family-app.webp`,
  `static/assets/img/photos/`): do not touch, stage or commit them.

## 1. Apple Smart App Banner (every page, every language)

Add `<meta name="apple-itunes-app" content="app-id=6800427546">` to the head.
iPhone Safari then shows Apple's own "Get" banner at the top. One line, no JS.

## 2. Share preview (Open Graph / Twitter)

- Generate one **1200×630** image per site language
  (`static/assets/img/og/og-<lang>.png`, PNG or high-quality JPEG ≤ 300 KB):
  mint background (#BFE6D2 → #F6FBF8), the localized home `h1`
  ("Your family, on the same page" / "Eure Familie, auf einer Seite" …) left,
  a phone with the home screen capture right (use the existing
  `static/assets/img/shots/` home shot), the daili logo. A small node or
  python script in `tools/` makes all of them, so they can be re-made.
- Head: `og:image` = that language's image (blog posts keep their own image),
  add `og:image:width`/`og:image:height`, `og:image:alt`, `og:url`,
  `og:locale`; `twitter:card` → `summary_large_image`.

## 3. Count store clicks (no cookies, no consent banner)

On click of any App Store / Google Play badge, the header "App laden"/"Get
the app" button and the sticky "Get Daili" bar, fire
`new Image().src = '/assets/c.gif?s=<ios|android|web>&p=<path>&r=<ref>'`
where `r` is the page's `?ref=` value if any (else empty). Do not delay the
navigation. Nothing is stored in the browser and no new data is collected
beyond the normal server log line — say so in a code comment (this is why the
site needs no consent banner; keep it that way).

## 4. JSON-LD

`SoftwareApplication`: add `"offers": {"@type": "Offer", "price": "0",
"priceCurrency": "EUR"}` and `"applicationCategory": "LifestyleApplication"`
(plain value). Do NOT add aggregateRating (Ammar may supply real numbers later).

## 5. Alt texts

Real photos and app screenshots get a short, localized descriptive `alt`
(from the content JSON, all languages). Purely decorative images keep
`alt=""`. Count before/after in the report.

## Verify

- `npm run build` (or the repo's build command) + `node tools/check-build.mjs`
  green; extend the check: every page has the smart-banner meta and an og:image
  that exists on disk.
- Open `dist/de/index.html` and one other language: head tags present.
- Report the list of generated og images.

## Commit & push

- `feat(site): smart app banner, share images, store-click counter, seo fixes`;
  body `Prompt: claude-prompts/2026-10-12/001-smart-banner-share-preview-store-clicks.md`.
- **Push now.** Deploy stays Ammar's step: `./deploy.sh` (owner item in the report).

## Report

`claude-reports/2026-10-12/001-smart-banner-share-preview-store-clicks.md`.
