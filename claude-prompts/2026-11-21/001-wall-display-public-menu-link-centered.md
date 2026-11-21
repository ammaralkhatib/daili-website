# Wall display guide goes public: a menu link in the header, and the menu in the middle

List item #205 (Ammar 2026-11-20). Standard lane. Ammar decided on 2026-11-21 in the planning chat,
after he was told the page is hidden because its steps are not tested on real devices yet and that
it is English only: **"Make it public now"**. Planning Claude checked the files the same day
(read-only).

## Goal

1. The wall display guide `daili.app/wall-display/` is public: indexable and in the sitemap.
2. The top menu of every page has a new link "Wall display" (in the page's language) that opens
   that guide. The guide stays English only, so every language links to the one English page.
3. On a wide screen the menu links sit in the MIDDLE of the header pill (brand on the left, the
   language chip + "Download app" on the right), not pushed to the right next to the chip.

## Scope

- In:
  - `site.config.mjs` — `WALL_GUIDE_PUBLIC` (:1348, `false` today) and its doc comment (:1340-1347).
  - `templates/layout.html` — the `<nav class="links">` (:33-39).
  - `content/<loc>.json` — every content file (30 today): one new key `home.nav.wall`, next to
    `home.nav.screens`; update the `@nav` description ("three section links" → name the new one).
  - `static/assets/style.css` — the header rules (:159-235: `.nav`, `.links`, the
    `@media(min-width:861px)` block that sets `.links{margin-inline-start:auto}`, and the
    861–1080 px block that tightens the links).
  - `build.mjs` only if the nav needs a new page value (for example an `aria-current` on the guide
    itself); `tools/check-build.mjs` section 24 only if a check must learn the new rule (see
    Requirement 4).
- Out:
  - The guide's own text (`wall/en.json`) and its translations — it stays English only, no
    hreflang cluster (check-build section 24 keeps enforcing that).
  - The help article `anywhere-wall` and a link from it to the guide (its own prompt later).
  - The footer, the burger's behaviour, the language picker, the download menu.
  - `LIVE_APP_VERSION`, the help center, the blog.

## Requirements

1. **Public.** `WALL_GUIDE_PUBLIC = true`. Rewrite its doc comment: public since 2026-11-21 (Ammar),
   English only, linked from the header menu. The build then makes the page indexable and puts it in
   the sitemap (priority 0.6, already built in) — check both in `dist/`.

2. **Menu link.** In `layout.html`, a new `<a class="nl" href="/wall-display/">{{ home.nav.wall }}</a>`
   after the "Watch & widgets" (`screens`) link and before "Blog". The same plain `/wall-display/`
   href on every page and in every language (the guide has no other language). On a non-English
   page add `hreflang="en"` to that link so readers and search engines know it opens an English page
   (only if the template can tell the page's locale without a hack; else leave it out and say so).
   On the guide page itself the link gets `aria-current="page"` if the other menu links already do
   that kind of thing; if not, skip it. The link must also show in the burger panel on a phone (it
   is in the same `<nav>`, so it should — check it).

3. **Words.** `home.nav.wall` in every `content/<loc>.json`: English `"Wall display"`. Other
   languages: the same short words the help center already uses for this feature in that language
   (look at the title of `help/<loc>/anywhere/wall.md`; shorten to one or two words, ≤ 16 characters,
   no "Daili" needed). A language with no help folder: a normal short translation. `check-content`
   must stay green (every key in every file).

4. **Menu in the middle (wide screens).** At ≥ 1081 px: brand at the start, the six links centred in
   the pill, language chip + Download pill at the end. Today `.links{margin-inline-start:auto}` pushes
   the links to the end. A clean way: `margin-inline:auto` on `.links` (equal free space on both
   sides) — then the links are centred between the brand and the chip, which is fine; if Ammar's
   "center" needs the links in the exact middle of the pill, use a three-column layout only if it does
   not break the 861–1080 px tightening or the burger. Pick the simplest that looks centred and
   say which in the report.
   - 861–1080 px: six links must still fit the pill without wrapping or overflow in the LONGEST
     languages (uk, ro, de, el, fi — measure; the comment at the 861–1080 block says seven links in
     uk/ro already needed tightening). If they do not fit centred, keep that range end-aligned or
     tighten further (smaller padding), but never cut or hide a link.
   - ≤ 860 px (burger): unchanged except the new link in the panel.
   - Right-to-left is not a concern (no RTL locale).
   - Check with a real browser if one is available on the Mac (for example `npm run serve` + a
     headless Chrome / Playwright screenshot at 1440, 1000 and 390 px, in en and uk); if none is
     available, say so in the report and explain how you checked the widths instead. Put any
     screenshots in `claude-reports/2026-11-21/001-shots/` (small PNGs).

5. **Build checks.** `npm run build` green. Section 24 already checks the PUBLIC case (not noindex, in
   the sitemap) — do not weaken any check. If a check should now also make sure every page's menu
   links to `/wall-display/` while `WALL_GUIDE_PUBLIC` is true, add that small check (one `fail` if
   a page with the header has no such link).

## Constraints

- No inline `<script>` bodies and no `on…=` handlers (CSP; check-build section 24 + others).
- The guide page must stay without hreflang declarations in its `<head>` (English only).
- Keep the header's look otherwise identical (pill, sizes, colours, the dark Download pill).
- 🔴 Report trap: never put the word "status" and the word "blocked" on one line unless you really
  are blocked.

## Verify

- `npm run build` (runs every check) and `npm test` — both green, in the FOREGROUND.
- In `dist/`: `wall-display/index.html` has no `noindex`; `sitemap.xml` lists `/wall-display/`; the
  English and one other home page (`de`) have the new menu link with the right word.

## Commit & push

- One commit: `feat(wall): public wall display guide + header menu link, centred menu`.
  Body: `Prompt: claude-prompts/2026-11-21/001-wall-display-public-menu-link-centered.md`
- **Push now.** (Pushing does NOT deploy the website; Ammar runs `./deploy.sh` later.)

## Report

- `claude-reports/2026-11-21/001-wall-display-public-menu-link-centered.md` from
  `claude-reports/TEMPLATE.md` if it exists (else the usual short report): what changed; the
  centring way you picked; how you checked the widths (and the shots); the word you used per language
  (one table); build + test results; SHA; pushed or not.
- Owner steps for Ammar: (1) `./deploy.sh` in `daili-website`; (2) open daili.app on a laptop → the
  menu is in the middle and has "Wall display" → it opens the guide; (3) on a phone → burger → the
  link is there; (4) later: test the guide's steps on a real tablet (the page is public now).
- `## Help impact`: `none` (the help article is not changed), unless you changed help text.
