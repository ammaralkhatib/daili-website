# Website: the wall display setup guide page (English, hidden for now)

## Goal
A new page `daili.app/wall-display/` that shows a family how to turn an old tablet (or PC, Raspberry Pi, Mac …)
into a Daili wall screen. The reader picks a device and gets the same five steps for it: connect, full screen,
keep the screen on, start by itself, protect the battery. English only for now. The page is built but **hidden**
(noindex, no links to it) until Ammar has tested the steps on real devices.

**The design and every word come from the mock:** `claude-prompts/2026-11-12/wall-display-mock.html` (open it in a
browser first). Port its layout, its texts and its behaviour into the site. Ammar will ask for design changes after
he sees it running, so keep the page easy to change: all words in one data file, all styles in one CSS file.

## Requirements
1. **Page.** English only, like the blog index: `locales: ['en']`, `cluster: null` (no hreflang), out
   `wall-display/index.html`. It uses the normal site layout (`layout.html` header, language picker, footer).
   Do NOT port the mock's own top bar (`.top`) or its footer line ("Design mock …").
   Title `Turn an old tablet into a family wall display | Daili`; description (≤ 155 chars) in the same plain tone.
2. **All words in one file: `wall/en.json`** (new folder at the repo root, next to `help/`). It holds the hero
   texts, the device list (id, name, sub line, icon key, lead, facts, jobs with their steps, notes, commands), the
   "Now hang it up" list, "Battery and safety", "Something not working?" and every UI word ("Which device?",
   "Done", "Copy", "Copied", "{n} of {total} done", the "You seem to be on this kind of device…" line). No
   sentence may be hard-coded in the template or in JS. Do NOT add keys to `content/*.json` (that would need 28
   translations). A later `wall/de.json` must be the only thing a translation needs.
   Copy the texts from the mock's `D` array and HTML as they are. Device ids stay: `ipad`, `android`, `fire`,
   `windows`, `pi`, `mac`, `chromebook`, `tv`.
3. **The build renders everything as real HTML.** Every device's full guide is in the page source as
   `<section id="<device id>">…</section>`, and the device list is plain links (`<a href="#ipad">`). So without
   JavaScript the page is one long readable guide with a jump list, and search engines see all steps.
   `build.mjs` must stop with a clear error when `wall/en.json` is broken (a device without jobs, a job without
   steps, a duplicate id, an unknown icon key).
4. **JavaScript only improves it** — new file `static/assets/wall.js`, loaded with `<script src defer>` like
   `script.js` (the CSP allows no inline script and no inline `onclick`; give it the same cache-busting the other
   assets get). With JS: only ONE device section is visible; the device comes from `location.hash`, else from a
   guess by user agent (same `guess()` rules as the mock), else `ipad`; a tap on a device link switches without a
   page jump and updates the hash; the "Done" tick per step is kept in `localStorage` (key `wall-done`, every
   read/write in try/catch, the page works without storage) and drives the "n of 5 done" bar; "Copy" buttons copy
   the command (clipboard in try/catch, fallback = select the text). `hashchange` is handled. The line "You seem
   to be on this kind of device…" shows only when the device was guessed.
5. **Styles** — new file `static/assets/wall.css`, loaded only on this page (the way `home.css` is loaded only on
   the home page). Use the site's existing colour and font tokens from `style.css`; do not redefine them. Only add
   the few tokens the site lacks (the mock's `--amber-ink`, `--screen`, `--p1…--p4`), with light AND dark values in
   the same pattern `style.css` uses. Dark mode must look right. Phone width (≤ 860 px): one column, the device
   list becomes a row you swipe sideways; the page body never scrolls sideways; command boxes scroll inside
   themselves. Respect `prefers-reduced-motion`. Visible keyboard focus on device links, ticks and Copy buttons.
6. **The drawn tablet in the hero** (the mock's `.tablet`) is built from HTML + CSS as in the mock, `aria-hidden`.
   Its words ("This week", "Dinner tonight" …) come from `wall/en.json` too. No emoji anywhere. Device icons are
   the mock's plain line drawings — never a brand logo.
7. **Hidden switch.** `site.config.mjs`: `export const WALL_GUIDE_PUBLIC = false;` with a comment. While false:
   the page has `<meta name="robots" content="noindex">` and is not in the sitemap. While true: indexable and in
   the sitemap (priority `0.6`). No other page links to it in this prompt, in either state.
8. **Guards.** `tools/check-build.mjs` gets a new numbered section: `wall-display/index.html` exists; it contains
   one `<section id>` per device in `wall/en.json`; it has zero `hreflang=`; it is noindex and absent from the
   sitemap exactly when `WALL_GUIDE_PUBLIC` is false; it loads `wall.js` and `wall.css`; it has no inline
   `<script>` body and no `on…=` attribute. README: a short "Wall display guide" paragraph (the data file, the
   switch, how a translation would be added).

## Constraints
- Zero npm dependencies, as always. No external fonts, scripts or images.
- Brand rule: bare lowercase "daili" only as the logo word; "Daili" inside sentences.
- Do not touch the help articles, `content/*.json`, the home page or the legal pages.
- The steps are not device-tested yet. Do not "correct" menu names from your own knowledge; if a text in the mock
  looks wrong, keep it and list it in the report.

## Verify
- `npm run build` passes (all guards, the new section included).
- `npm run serve` → `http://localhost:8080/wall-display/`: every device opens; `#windows` in the address opens
  Windows; a tick survives a reload; Copy works; with JavaScript off all eight guides show one after another.
- Check it once at phone width and once in dark mode (headless screenshot is fine); say in the report what you
  looked at.

## Commit & push
`feat(site): wall display setup guide page (English, hidden)`; body
`Prompt: claude-prompts/2026-11-12/001-wall-display-guide-page.md`. Commit this prompt and the mock file with it.
🔴 Do NOT stage `static/assets/img/photos/`. **Push now. Do NOT run `./deploy.sh`** (the site carries 1.16.0
texts that must wait for store day).

## Report
`claude-reports/2026-11-12/001-wall-display-guide-page.md` (file-write tool; `wc -c` > 0), short and in plain
English: files added, how the page is wired into the build, anything in the mock you changed and why, texts that
looked wrong, build result, what you looked at, SHA + push. `## Help impact`: none (the help article
`anywhere-wall` gets a link to this page in a later prompt, when the page goes public).
