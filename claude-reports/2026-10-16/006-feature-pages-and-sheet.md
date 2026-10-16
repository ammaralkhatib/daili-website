# Feature pages + the home sheet (Budget, Cycle, Habits)

**Prompt:** `claude-prompts/2026-10-16/006-feature-pages-and-sheet.md`
**Completed:** 2026-10-16 · **Status:** done · **Commit:** `cfad73f` (pushed to `origin/main`, **not deployed**)

## Summary

Budget, Cycle and Habits now each have their own page, in all 28 languages. On the home page these three cards are now links. A normal click opens the page's content in a large popup (a "sheet"), and the address changes to the page's own address. Back, Esc, the ✕ button or a click outside closes it, and the address is `/` again. Opened directly, the address shows the same content as a normal page. That also works without JavaScript.

**URL shape:** `/features/<slug>/` for English, `/<loc>/features/<slug>/` for every other language (e.g. `/de/features/cycle/`). The slug is English everywhere. A code comment next to `HOME_FEATURES` and one in `build.mjs` say these URLs must never move.

## Files

- `site.config.mjs`: `page: true`, `benefits` (one icon per benefit), `shot2` (Budget's split screen) on the three features. Four new icons (eye, repeat, lock, bell). `budget-split` added to `HELP_SHOT_SOURCES`.
- `static/assets/img/shots/<loc>/shot-budget-split.webp`: 25 new files, made from the help pictures with `make-site-shots.py --from-help`. ru, hi and ar use the English file.
- `build.mjs`: makes the feature pages (each one its own hreflang group, in the sitemap, priority 0.7). The card and the page now share one helper for the phone and the floating card. One template can now include another.
- `templates/feature.html` + `templates/_featuresheet.html`: the page and the `[data-feature-sheet]` part that the sheet reuses.
- `home.js` (`featureSheet`), `home.css` (page + sheet styles; the feature pages load home.css but not home.js).
- `tools/check-build.mjs`: section 15 now accepts `<a>` cards and checks that each card links to the page in its own language. The new section 18 checks the 3 × 28 pages: one fragment, one `<h1>`, canonical, the full hreflang set, sitemap entry, and the "All features" link.
- `content/*.json`: 39 new keys (33 strings) in each of the 28 files: `features.{all, close, questions, pages.budget|cycle|habits}` and `home.alt.shot-budget-split`. The page title is the card's name + " · daili", and the description is the lead. Neither is a separate key, so neither can drift. Sub-agents translated with the app's ARB words. I checked their output by script and applied it myself.

## Copy I corrected (it was not quite true in 1.11.0)

- **Budget benefit:** "Every repeating bill on one screen" became **"Everything that repeats, on one screen"**. Salary is not a bill. The app's own changelog line is "everything that repeats — rent, subscriptions, salary".
- **Budget FAQ, offline:** the copy said an expense "is sent when you are back online". It is not sent by itself. The app keeps it ("Not sent — you're offline. Your entry stays here.") and later offers "Use it". New text: "An expense you could not send stays on your phone, ready to send when you are back online."
- **Budget FAQ, bank:** "your bank details never leave your bank" became **"Daili never asks for your bank details"**. That is clearer and plainly true.
- **Habits lead:** "Every tick fills Minzi's energy" became **"Every tick adds to your family's energy"**. The bar is the *Family* energy, and private ticks and rest days give none.
- Everything else matched the help articles and the app's CHANGELOG. Cycle stays neutral: no medical terms and no "family planning". The FAQ answer keeps the approved disclaimer, "does not give medical or contraception advice".

## Tested

`npm run build` ×2, then headless Chrome over CDP. My own server and Chrome ran in one foreground script and both were stopped. **All 29 checks passed:**
- `/features/budget/` at 1440 and 390, `/de/features/cycle/`, `/ar/features/habits/` (RTL) at 1440 and 390: right language and direction, no sideways scroll, all pictures load.
- JS off: the page is complete, and the 3 home cards are plain links.
- On `/`, computer and phone: clicking Budget opens the sheet at `/features/budget/` with focus on ✕. Tab and Shift+Tab stay inside. The page underneath does not scroll. Back closes it (URL `/`, focus back on the card), Forward reopens it, and Esc, ✕ and a click outside all close it. The page is fetched only once. Cmd+click does not open the sheet. After the sheet, the pinned row still moves.
- `/ar/`: the sheet is mirrored (picture right, ✕ left). With reduced motion it opens without its animation.
- **Guard proof:** I broke 3 built pages: removed the fragment on `de/cycle`, removed one hreflang on `ja/budget`, and pointed the `fr` habits card at the English page. check-build caught all 3 (4 errors). After a rebuild it was green again.
- **Clean check:** other uncommitted files are in the tree (`legal/*`, `tools/check-legal.mjs`). So I also built HEAD plus only my 60 files in a separate git worktree, and it was green. I committed by file list, so those files stay out.

I did not open the prototype link (a claude.ai artifact). The look follows the prompt's description and the existing cards. I could not test Safari or a real phone.

## Build

```
$ npm run build                      → check-help: 2 errors (/lists/supplies, /budget/:id/trends — same as 005, prompt 004's job)
$ HELP_SKIP_ROUTE_CHECK=1 npm run build
content OK · 28 locale(s) · 411 keys each
legal OK · 2 document(s) × 28 locale(s)
built 2468 pages · 28 locale(s) · 2466 sitemap entries
build OK · 2468 pages · 2448 in hreflang clusters
detector OK · 32 cases · 28 locale(s) built
```

## Open items for Ammar

- **Run prompt 004 before deploying.** Until then, the plain `npm run build` stops on the 2 help routes. `./deploy.sh` was not run, as the prompt said.
- **Help ring:** the Budget split picture shows the Help center's orange ring around "Mark as paid", because it is a copy of the help picture. It is the same issue as in 005. Fix it the same way: shoot without the ring, then run `make-site-shots.py --from-help` again.
- **Check on a real phone and in Safari:** the bottom sheet, the swipe to scroll inside it, and Back.
- **Old local server:** `python3 -m http.server 8080` (pid 79684) is still running. It was not started in this run, so I left it alone.
- Prompt 007 adds the other ten pages: set `page: true` + `benefits` and add the words.

## Help impact

none
