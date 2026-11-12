# 001 — Wall display guide page (English, hidden)

**Done.** `daili.app/wall-display/` is built from the mock. It is noindex, not in the sitemap, and nothing links to it.
Commit `d4138efa` was pushed to `main`. `./deploy.sh` was **not** run.

## Files added
- `wall/en.json` holds every word on the page: the hero, the drawn tablet, the UI words, the 8 devices, "Now hang it up",
  "Battery and safety" and "Something not working?". Text is plain, with `**bold**` and `` `code` `` only and no HTML.
- `templates/wall.html` is the page structure.
- `static/assets/wall.css` holds all the page's styles. It is loaded on this page only.
- `static/assets/wall.js` adds the enhancements. It is loaded with `<script src defer>`.
- The prompt and `wall-display-mock.html` are committed with it.

## Files changed
- `site.config.mjs`: `WALL_GUIDE_PUBLIC = false`, with a comment.
- `build.mjs`:
  - `loadWall()` checks the data file and stops with a clear error.
  - `renderWall()` builds the HTML and `wallPage` defines the page.
  - `wall.css` and `wall.js` are content-hashed like `home.css`.
- `templates/layout.html`: the slot `page.homeCss` is now `page.pageCss`. It carries home.css on the home and feature pages and wall.css here.
- `tools/check-build.mjs`: new section 24, and section 1 now expects the page.
- `README.md`: a "Wall display guide" section and a line for `wall/` in the Layout table.

## How the page is wired into the build
- It is set up like the blog index: `locales: ['en']`, `cluster: null`, output `wall-display/index.html`, priority 0.6, and `noindex: !WALL_GUIDE_PUBLIC`.
  The sitemap already leaves noindex pages out, so the switch controls both the noindex tag and the sitemap entry.
- The build writes every device's full guide as `<section class="wall-dev" id="<id>">`, and the device list is plain `<a href="#ipad">` links.
  Without JavaScript the page is one long guide with a jump list.
- The parts that only work with JavaScript carry `hidden` in the HTML and `wall.js` turns them on: the progress bar, the "Done" ticks and the Copy buttons.
- `wall.js` needs no words of its own. "{n} of {total} done" and "Copied" reach it through `data-` attributes the build fills from the JSON.
- The build stops when `wall/en.json` is broken. I planted each fault and the build named it:
  - a device without jobs: `devices[2] (fire) has no jobs`
  - a job without steps
  - a duplicate id
  - an unknown icon key
  - an unclosed `**`
  - JSON that does not parse
- **Translations:** a `wall/de.json` alone is enough. The build finds it, checks it has the same devices and the same job counts, writes
  `/de/wall-display/` and puts the pages in their own hreflang cluster. I tested this with a throwaway copy, which built and passed the guards, then deleted it.
- **Section 24 checks:**
  - one `<section id>` per device, and a plain link for each;
  - no hreflang in the `<head>` while the guide is English only;
  - noindex and absent from the sitemap exactly while the switch is false, and in the sitemap when it is true;
  - it loads the hashed `wall.js` and `wall.css`, and no other page loads them;
  - no inline `<script>` body and no `on…=` attribute;
  - no other page links to it while it is hidden.

  The hreflang check covers the `<head>` only, as the blog's check does. The language picker and the nav link carry `hreflang` on `<a>` tags on every page by design.

## What I changed from the mock, and why
1. **"daili icon" → "Daili icon"** (4 steps on iPad). The brand rule allows lowercase "daili" only as the logo word.
   The home-screen icon is labelled "Daili" anyway: `short_name` in the app's `web/manifest.json`.
2. **Device list:** the mock used tab buttons. They are now plain links with `aria-current` on the chosen one, so they also work without JavaScript.
3. **"Now hang it up"** appears once, after all the device sections. Without that, it would appear 8 times without JavaScript. With JavaScript it looks the same as the mock.
4. **Focus ring:** I used the site's green ring, because the mock's amber has poor contrast on the light paper.
   The Copy button keeps amber, because it sits on the dark command box where green would not show.
5. **Site layout:** the site header, gutter (22px) and footer replace the mock's top bar, its footer line and its 16px gutter.
   - The device list sticks at 88px from the top so it clears the floating header.
   - The site footer's 90px top gap is removed on this page only, so the footer sits right under the band as it does in the mock.
6. **Pair steps:** the mock's `pair()` helper is written out as literal steps for each device. Each device can then be edited or translated on its own.
7. **Phone device row:** I added a little padding so the focus ring is not cut off.

Headings keep the mock's weight of 700; the site normally uses 800. All colours are the site's tokens.
I added only `--amber-ink`, `--screen` and `--p1…--p4`, with light and dark values. The person colours are the same in dark, as in the mock.

## Texts that looked wrong (kept as in the mock)
- The hero says "Follow five steps", but **TV or other** has 4 jobs, so it shows "n of 4 done".
- **Mac, step 4:** "**Energy →** Start up automatically after a power failure" has no "System Settings →" in front, unlike every other step.
- **"Something not working?":** "as in step 3 for your device". For TV, step 3 is "What does not work".
- Please check these on a real device:
  - **Pi:** the `~/.config/labwc/autostart` path only applies to Raspberry Pi OS with labwc (Bookworm, late 2024 on). Older images use a different autostart.
  - **Pi:** the `chromium` command is `chromium-browser` on older images.
  - **Windows:** the Edge path `Program Files (x86)` may differ on some machines.
  - **Mac:** the Chrome menu wording "Cast, save, and share → Install page as app".
- The drawn tablet's date "Thu 12 Nov" is fixed text. It is a drawing, but it will look dated after today.

## Build
`npm run build` passes: content, reviews, legal, help, the build, check-build with section 24, detector and help search.
It reports `wall: /wall-display/ · 8 device guide(s) · en · noindex, hidden`, `build OK · 3484 pages`, and `/wall-display/` is not in the sitemap.

## What I looked at
I served `npm run serve` (localhost:8080) and drove headless Chrome over CDP. All 28 checks passed:
- A fresh load shows one device. It was Mac, guessed from the user agent, and the "You seem to be on…" line showed.
- All 8 device links switch with no page jump (scrollY did not change), and the hash updates.
- Opening `#windows` shows Windows without the guessed line. A typed `#pi` switches to the Pi. The skip link's `#main` leaves the chosen device alone.
- A tick survives a reload: "1 of 5 done", the bar at 20%, and `wall-done` = `{"windows0":true}`.
- Copy puts exactly the command on the clipboard, shows "Copied", then goes back to "Copy".
- **JavaScript off:** all 8 guides show one after another, and the progress bars, ticks and Copy buttons stay hidden.
- **Phone (375px):** the page is 375 wide with no sideways scroll, in one column. The device list is a sideways row (1306px of content in 343px), and the selected chip scrolls into view. The Windows/Pi command boxes scroll inside themselves.
- **Dark mode:** the page, the tablet screen, the tips and the band use the dark tokens. I checked screenshots on desktop and phone.
- **Keyboard focus:** a visible 3px ring on a device link, a tick and a Copy button.
- **Reduced motion:** the progress bar does not animate.
- The console showed no errors.

The site CSP comes from `.htaccess`, so the local Python server did not apply it. The guard checks the CSP rules instead: no inline script and no `on…=` attributes.

## Commit
`d4138efa feat(site): wall display setup guide page (English, hidden)`, pushed to `origin/main`.
`static/assets/img/photos/` was not staged and `./deploy.sh` was not run.

## Help impact
None. The help article `anywhere-wall` gets a link to this page in a later prompt, when the page goes public.
