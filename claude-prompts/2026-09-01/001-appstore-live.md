# The App Store listing is LIVE — flip the switch back on

## Goal
Apple approved the app on **2026-09-01**. Verified independently before writing
this prompt: `itunes.apple.com/lookup?id=6800427546&country=de` returns
`resultCount: 1` — "Daili: Familienplaner", version 1.2.0,
`currentVersionReleaseDate` 2026-09-01T16:46:41Z, seller Ammar Khatib.

Prompt 001 built `stores.ios.available` as the single switch for exactly this
moment. Flip it, and let the guard prove the site went back to a real link.

Done = the App Store badge is a working link to
`https://apps.apple.com/app/id6800427546` in all three places on all 23
landing pages, the "coming soon" chip and its popover render nowhere, and
`npm run build` is clean.

## Scope
- In: `site.config.mjs` (the `stores.ios` block only).
- Out: **everything else.** Do not delete the chip, the popover, the
  `store.appleSoon` / `store.iosSoon` strings, or the `available: false` arm of
  the `check-build.mjs` guard — that machinery is the tested off-switch for the
  next time a listing goes away, and it is now dormant, not dead. Do not touch
  `content/*.json`, `script.js`, `style.css`, or the templates.

## Requirements
1. `stores.ios`: `available: true`, `verified: true`. Replace the 2026-08-29
   rejection comment with a short one recording that the listing went public on
   2026-09-01 and was confirmed via the iTunes lookup API (`resultCount: 1`).
   Leave the URL itself unchanged.
2. Nothing else changes. If anything else *needs* to change for the build to
   pass, that is a finding — report it rather than widening the change quietly.

## Verify before you report
1. `npm run build` clean. Section 10 of `check-build.mjs` now runs its
   `available: true` arm and must PASS — it requires
   `href="https://apps.apple.com/app/id6800427546"` on all 23 landing pages.
2. `/usr/bin/grep -c 'store-badge soon' dist/index.html dist/de/index.html
   dist/ar/index.html` → **0** everywhere. The chip and the popover paragraph
   must not render at all.
3. `/usr/bin/grep -o 'installUrl[^,]*' dist/index.html` → the JSON-LD carries
   the Apple URL again (prompt 001 filtered it to available stores).
4. In a browser at `npm run serve`, 360px and desktop, on `/` and `/de/`:
   both badges are real links and open the right store; with an **iPhone user
   agent** the Apple badge is promoted (`.primary`) again and the sticky bottom
   bar is a normal `<a>` pointing at the App Store — not the `sticky-soon`
   span from prompt 001.
5. Open the live URL once in the browser and confirm it loads a real App Store
   page (not a 404), from a German IP if you can.

## Report
`claude-reports/2026-09-01/001-appstore-live.md` — short, a few lines is fine:
the diff, the guard's passing `available: true` arm, and the four checks above.
Commit and push. **Do not run `./deploy.sh`** — Ammar deploys.
