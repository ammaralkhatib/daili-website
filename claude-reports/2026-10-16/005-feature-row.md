# Home: all features in one horizontal row

**Prompt:** `claude-prompts/2026-10-16/005-feature-row.md`
**Completed:** 2026-10-16 · **Status:** done · **Commit:** `871452f` (pushed to `origin/main`, **not deployed**)

## Summary

"Start the day together" is now one row with 13 cards (6 before). On a computer the row stays in the middle of the screen while you scroll down, and the cards move sideways. After the last card, the page scrolls on. On phones, touch screens, with reduced motion or without JavaScript, it is a normal swipe row. Above the row there is a counter ("7 of 13") and ← → buttons. Below it there is a thin progress bar.

## What changed

- **Data:** `HOME_FEATURES` in `site.config.mjs` (replaces `DAY_CARDS`). Each entry is `{ slug, shot, tint, icon, tone, done?, energy?, amount?, newUntil? }`. To add a feature later, add one entry here and one card in each `content/*.json`. Budget and Cycle have `newUntil: '2026-12-31'`. The build stops if two neighbours have the same tint, or if a card's `slug` in the content does not match the config.
- **Budget amount:** 24 € converted into the currency that locale's budget screenshot shows. `BUDGET_CURRENCY` + `EURO_RATES` are copied from the app's help-shot demo data and rounded the same way. The page formats it with `Intl.NumberFormat`: de "24 €", en "£24", ja "￥3,960". ru, hi and ar show the English screenshot, so they show £.
- **Screenshots:** a new `--from-help` mode in `tools/make-site-shots.py` turns the help pictures into `shots/<loc>/shot-budget|cycle|weather.webp` (640×1391, same size as the other shots, `?v=` added automatically). 75 files for 25 locales. ru, hi and ar have no help pictures, so they use the `en` files. Calendar, To-dos, Family and Documents use the existing shots. Documents is English everywhere, as before.
- **Words:** in all 28 locales: `slug` on all 13 cards, 7 new cards (h3/p/t/s), 4 row keys (`new`, `prev`, `next`, `counter`), 6 new screenshot alt texts. Feature names come from the app's ARB files, and `@cards` is updated. Person names follow each locale's screenshots.
- **Motion (`home.js` `featureRow`):** ScrollTrigger pin with `scrub`, scroll distance 0.6 × overflow (2,520 px at 1440 wide), `invalidateOnRefresh`, works with Lenis, goes the other way in `/ar/`. Inside the pinned row the phones and floating cards stay still (no jitter). In the swipe row they keep their old up/down movement.
- **check-build:** checks the card count and order, that each card's screenshot is the locale's own file (or the `en` fallback) and exists, that the badge shows only until `newUntil`, and that the counter, arrows and bar are there.

## Copy changed because it was not true

- **Family:** "Noah joined The Bergers" became **"Emma joined The Bergers"**. Noah is a managed child with no login, so he cannot "join".
- **Weather:** "Take an umbrella" became the app's own tile text **"H 16° · L 7°"**. The app never gives that advice. "Rain from 3 pm" became **"Rain from 15:00"** (the site uses 24-hour times).
- **Cycle:** the card uses the app's own `cycleNextIn` text, "Next period in 8–14 days" (the screenshot shows the same). In fi, fr, it, nl, ro and bg the full app wording is over 32 characters, so the word "next" was dropped. In pl, uk and ro the grammatically correct plural form for 14 is used.

## Tested

Headless Chrome over CDP, with my own server, stopped at the end:

- **1440×900:** pins at 81 px from the top, all 13 cards reachable ("13 of 13", x = −4,200), page goes on after the last card.
- **Arrows:** the next arrow moves to card 2.
- **Keyboard:** Tab onto card 9 moves the page so the card is in view.
- **1024×700:** pins at 63 px and fits.
- **390×844 and 360×780:** swipe row with snap, counter follows; the page never scrolls sideways.
- **`/ar/`:** row moves the other way, arrows and progress bar mirrored.
- **Reduced motion:** swipe row, arrows work.
- **No JavaScript:** native scroll, controls hidden but keep their space.

I could not test a real mouse wheel or trackpad, or Safari. Those are Ammar's checks.

**Guard proof:** I planted 3 faults in a built page (one card removed, a badge on Calendar, the wrong screenshot on Cycle). check-build caught each one. I restored the page and the build was green again.

## Build

```
$ npm run build            → check-help: 2 errors (/lists/supplies, /budget/:id/trends have no article)
$ HELP_SKIP_ROUTE_CHECK=1 npm run build
content OK · 28 locale(s) · 372 keys each
legal OK · 2 document(s) × 28 locale(s)
test-check-help OK · 99 cases
build OK · 2384 pages · 2364 in hreflang clusters
detector OK · 32 cases · 28 locale(s) built
```

The 2 help errors are not caused by this change. They are the app's two new screens that prompt 004 parks in `help/routes-allowlist.json`. That file is outside this prompt's scope, so I left it alone. Once 004 runs, the plain `npm run build` should be green.

## Open items for Ammar

- **Help rings:** the three new screenshots (Budget, Cycle, Weather) still show the Help center's orange ring round one button, because they are copies of the help pictures. To remove the ring, add a run of the app's `tool/help-shots.sh` without the ring, then run `make-site-shots.py --from-help` again.
- **Check on a real Mac:** the pinned row with a mouse wheel and a trackpad, and in Safari.
- **Old local server:** a `python3 -m http.server 8080 --directory dist` has been running since 19 Sep. It was not started in this run, so I left it running.
- **Commit and deploy:** run prompt 004 before the next deploy. `./deploy.sh` was not run, as the prompt asked.

## Help impact

none
