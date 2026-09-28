# Report: 005 Bevel home 2/2 — the new home page

Prompt: `claude-prompts/2026-09-28/005-bevel-home-page.md` · Status: **done**
Commits: `1dd5944` feat(site): Bevel-style home page … · `9ad8485` chore(content): drop keys the old home page used. **Pushed** (`8e73348..9ad8485 main -> main`). Not deployed.
Prerequisites: 004 was merged (`6e90788`), and the first media URL returned `HTTP/2 200`. Step 0 had no pending docs to commit.

## What changed (plain words)
- **The home page is the mock**, in all 28 languages: hero with 7 floating cards and the watch, the photo strip, the Start-the-day cards, the dark Daili Plus block with its 3 stacking cards, See it in action, the screens bento, the lock, the mosaic, the flat-lay, and the FAQ. The site footer now comes after `</main>`.
- **Header on every page** is now the floating pill: links, language switcher, Log in, and a dark "Get the app" button that opens the old store-badge menu. Below 860 px the links go into the burger menu. Between 861 and 1080 px the pill gets a bit tighter, because 12 languages overflowed it at 900 px. Now every language fits at 861, 900, 1000 and 1080 px.
- **Motion** is in `home.js`, a port of the mock's `boot()` and `flows()`. The window scrolls smoothly with Lenis. The home page loads GSAP, ScrollTrigger and Lenis (self-hosted in `static/assets/vendor/`, with `LICENSES.md`), and no other page loads them. Without JavaScript or with reduced motion, the page is complete: the cards show ticked, step 1 is finished, and nothing is hidden.
- `site.config.mjs` now holds `MEMBERS_COUNT = 1000`, which shows as 1,000 or 1.000 depending on the language, and `REVIEWS = []`. The reviews section only appears once there are 3 real reviews; right now there is no reviews markup at all. It also holds the page's icons, positions and the 9 demo-family names.
- **Removed:** from `script.js`, the scroll story, the two-step slides and the video player (558 → 298 lines). From `style.css`, all Design-B rules, snap scrolling and the unused colour variables (1192 → 666 lines). Also the `static/assets/video/` folder. **Content keys deleted in all 28 languages:** `nav.features`, `nav.pricing`, `nav.download`, `hero.chip`, `hero.kicker`, `hero.lead`, `hero.altCalendar`, `hero.altHome`, and the whole `showcase`, `story`, `life`, `howItWorks`, `compare`, `pricing`, `trust`, `featuresSection`, `features` and `web` blocks.

## Media (static/assets/img/home/)
| group | count | min–max |
|---|---|---|
| photos `p_*` (720 px) | 15 | 59.8–109.9 KB |
| objects `o_*` (520 px, alpha kept, checked: RGBA, corner alpha 0) | 12 | 20.1–71.4 KB |
| avatars `av-*` (200 px) | 9 | 6.5–8.9 KB |
| Minzi (400 px, alpha) | 2 | 16.8–17.1 KB |
| `qr.svg` | 1 | 20.3 KB |

Five photos went over 110 KB at quality 78, so I lowered their quality until they fit: cake and picnic 74, table 66, balcony 62, and grandpa 50 (it shows at 150 px, and looks fine there). **QR:** I decoded it with a small script. It says `https://daili.app` (byte mode, error level M).

## Guards and checks
- `npm run build` is green: `build OK · 2034 pages · 2014 in hreflang clusters` / `detector OK · 32 cases · 28 locale(s) built`.
- **§15 rewritten** as the prompt asks. **Proof it can fail:** I removed hero card 7 from `dist/index.html`, and the check reported `the hero has 6 floating cards, expected 7 (home.hero.cards)`. A rebuild restored it.
- **Outside the listed scope, but needed:** §14 now only requires a language's own copy of the screenshots the page actually shows (the new page doesn't show `shot-family`). `check-content` lost its FEATURES check, because `FEATURES` and `features.*` are gone. `layout.html` got one line in `<head>` for `home.css`, placed after `style.css`: §13 reads the first stylesheet, and the order matters for which styles win.
- **Overflow at 390 px, all 28 landing pages:** `pages 28 max scrollWidth 390 innerWidth 390`.
- **Console:** no errors or warnings on `/` and `/ar/`, desktop and mobile. **Other pages** (support, blog, help, privacy, 404, at 1440 and 390): only the header changed. Everything below moved down 3 px on desktop and 1 px on phone; after shifting by that, only a few hundred scattered anti-aliasing pixels differ.
- Screenshots of `/`, `/de/`, `/ar/` are in `claude-reports/2026-09-28/shots/005-*.webp` (21 files, committed with this report). The German ticks in See it in action land on their rows. `ar` uses the English screenshots, so the positions stay as they were.

## Known differences from the mock
- The header also has Support, Blog and the language switcher, as the prompt asks. The hero button goes to `#get` (the real store badges); it does not open the menu.
- I did not port the mock's uppercase widget labels (the "no uppercase" rule). The member tiles show full size: in the mock the orbit's `.tile` rule clashed with them, so I renamed the orbit's version.
- The FAQ keeps its content, restyled as white cards.
- Two bugs I found and fixed: without JavaScript, the dark "shutter" bars covered See it in action; and on the home page the store badges' text was invisible.

## Help impact
none

## Owner step
Run `./deploy.sh` (Ammar).
