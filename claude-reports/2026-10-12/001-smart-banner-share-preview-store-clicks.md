# 001 — Smart App Banner, share preview, store-click counter, small SEO fixes

**Status: done.** Commits: `72ba334` (step 0: the prompt file), `addfd70` (the change), plus the commit that holds this report. All pushed to `main`. `./deploy.sh` **not** run (owner item below).

## What changed

1. **Smart App Banner**: every page's head has `<meta name="apple-itunes-app" content="app-id=6800427546">`. The id is read out of `stores.ios.url` in `site.config.mjs`, not typed a second time, and the tag only appears while `stores.ios.available` is true. (`build.mjs` renderHead)
2. **Share preview**: 28 cards at 1200×630, one per site language (list below). Every non-blog page now has `og:image` (its language's card, with `?v=<sha8>` so messengers re-fetch it when it changes), `og:image:width`, `og:image:height`, `og:image:alt` ("Daili — <home h1>") and `twitter:card` = `summary_large_image`. Blog posts keep their hero image and now also have width, height and alt (taken from the post). `og:url` and `og:locale` were already there.
   - Generator: `node tools/make-og-images.mjs [locales…]`. It has no npm dependencies. It starts a small server for `static/` and has headless Chrome photograph an HTML card that uses the site's fonts, the home page's phone frame, the logo and `shots/<loc>/shot-home.webp` (the English shot for locales that have none, same rule as `imgSrc`). The headline shrinks until each half fits on one line. The run fails if a card is over 300 KB or the headline doesn't fit even at 36 px.
   - **JPEG, not PNG**: the PNGs were about 380 KB, over the 300 KB limit. JPEG at quality 90 is 55–69 KB and looks the same at preview size. The files are `og-<loc>.jpg`.
3. **Store-click counter** (`static/assets/script.js`, plus the 42-byte `static/assets/c.gif`): one capture-phase click listener. Each counted click requests `/assets/c.gif?s=<…>&p=<path>&r=<ref>&t=<ms>`:
   - `s=ios` / `s=android`: any store badge (header menu, final section, help pages)
   - `s=web`: the "Open web app" buttons
   - `s=ios|android`: the sticky "Get Daili" bar, depending on which store its link was set to
   - `s=menu`: the header "App laden" button, **only when it opens**. That button is not a store link; it only shows the badges. A fourth value keeps "opened the menu" apart from "went to a store". It's a deviation from the prompt's `ios|android|web` list.
   - `t=` is the click time. It's there because `.gif` has no Cache-Control rule in `.htaccess`, so without it a browser could serve a second identical click from its cache and the server would never see it. It isn't an identifier: the log line records the same time anyway.
   - It uses `new Image()`, as the prompt says. `fetch` would be blocked: the CSP allows `img-src 'self'`, but `connect-src` only for `api.daili.app`.
   - Nothing waits on the request. Store links open a new tab, so the request finishes.
   - The code comment states that nothing is stored and nothing is collected beyond the normal log line, and that this is why the site needs no consent banner.
4. **JSON-LD**: `applicationCategory` is now the plain value `"LifestyleApplication"`. `offers` (price 0 EUR) was already there. No `aggregateRating`.
5. **Alt texts**: new `home.alt.*` keys (16 strings) in all 28 `content/<loc>.json`. Each uses that locale's own feature words, e.g. Essensplan, Menus, Cardápio, Gezin. They cover:
   - the 8 member-card photos (described from the pictures)
   - every phone screenshot that a screen reader can reach: the 6 "start the day" cards, the calendar section, the 3 Daili Plus cards and the flat-lay phone

   What stays `alt=""` on purpose: everything inside `aria-hidden` boxes (hero phone, workflow phone, the bento's two tilted phones, the photo mosaic, the flat-lay objects), the family avatars (their names are printed under them), the Minzi drawings, the header logo (the link already says "daili") and the blog-index thumbnails (an aria-hidden duplicate of the title link).

   | | before | after |
   |---|---|---|
   | `<img>` with alt text (all 2259 pages) | 2026 | 2782 |
   | `<img alt="">` | 4824 | 4068 |
   | `<img>` with no alt | 0 | 0 |

   That's +27 per home page (×28): 11 screenshots, plus 16 photo tags because the marquee repeats its row.

## Checks

- **New section 17 in `tools/check-build.mjs`**:
  - every page has exactly one banner meta with the right id (and none if the listing is ever turned off)
  - `og:image` is an absolute daili.app URL, the file is in `dist/`, and its real pixel size (read from the JPEG/PNG/WebP header) matches `og:image:width/height`
  - non-blog pages use their own `<html lang>` card
  - `og:image:alt` is present and `twitter:card` is `summary_large_image`
  - all 28 cards exist at 1200×630 and under 300 KB
  - `c.gif` exists

  Negative test: with `og-fr.jpg` deleted from `dist/`, the check flagged every fr page plus the missing card.
- `npm run build`: **red, but not because of this change.** `check-help` reports 9 app routes that have no help article: `/onboarding/features`, `/cycle`, `/weather` and six `/budget…` routes. They come from `../familyplanner-app` at its committed HEAD; the app tree has only untracked `tool/run-*.sh` files. That was the case before any edit of mine. With `HELP_SKIP_ROUTE_CHECK=1` the full chain is green: content, legal, help, build, check-build (2259 pages) and detector. The same was true before and after the change.
- Head tags confirmed in `dist/de/index.html`, `dist/ja/index.html`, `dist/index.html`, `dist/zh-hans/index.html`, `dist/th/index.html` and a blog post.
- The counter was clicked in headless Chrome on `/de/?ref=welcome`:
  - header button opening → `s=menu&p=%2Fde%2F&r=welcome`; closing it → nothing
  - App Store badge → `s=ios`; Google Play badge → `s=android`; web app button → `s=web`
  - final-section App Store badge → `s=ios`
  - a plain nav link → nothing
  - iPhone sticky bar → `s=ios`
- Cards checked by eye: en, de, ja, ar (mirrored layout), bg, th.

## Generated share images (`static/assets/img/og/`)

og-en 64 KB · og-de 66 · og-fr 66 · og-es 63 · og-it 66 · og-nl 62 · og-pt 65 · og-sv 66 · og-da 66 · og-nb 66 · og-pl 67 · og-cs 64 · og-fi 66 · og-tr 63 · og-id 66 · og-ja 69 · og-ko 60 · og-zh-Hans 55 · og-zh-Hant 55 · og-th 68 · og-ru 62 · og-hi 62 · og-ar 60 · og-el 68 · og-uk 64 · og-bg 66 · og-ro 65 · og-sk 67 (all `.jpg`, 1200×630).

ar, hi and ru show the English home screen in the phone, as on their home pages (they have no capture set).

## Owner items (Ammar)

1. **Deploy**: `./deploy.sh`. Afterwards, `curl -sSI https://daili.app/assets/c.gif` and `curl -sSI https://daili.app/assets/img/og/og-de.jpg` should both be 200 (both files are mode 644).
2. **Reading the counts**: in the access log, `grep 'GET /assets/c.gif' access.log` gives one line per click, broken down by `s=`, `p=` and `r=`.
3. **Optional**: refresh the share preview of an existing link with the Facebook Sharing Debugger ("Scrape again"). WhatsApp caches previews per URL for a while.
4. **`check-help` is red** for the app routes listed above. That's for the help lane (articles, or `pending` entries in `help/routes-allowlist.json`), not this prompt.

## Not done / notes

- `templates/layout.html` was not changed. The head tags are built in `build.mjs` renderHead, where all the other meta tags already live.
- `og:locale` stays in its existing form (`de`, `zh_Hans`, …), not `de_DE`. The prompt only asked for it to be present.
- The untracked files that aren't mine were left alone and not staged: `claude-reports/2026-10-01/`, `static/assets/img/blog/what-to-look-for-family-app.webp`, `static/assets/img/photos/`.

## Help impact

none
