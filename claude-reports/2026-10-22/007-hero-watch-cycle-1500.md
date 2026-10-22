# 007 — Home: hero watch turns through its screens, 1,500+ members

**Status: DONE** · commit `bfb29b3` on main, pushed. `./deploy.sh` not run.
Step 0: the prompt file was the only pending planning doc. I committed and pushed it first as `2672017 docs(plan): sync planning docs`, so it is not in `bfb29b3`. I did not touch `claude-prompts/2026-10-21/`, `MARKETING-WEEKLY.md` or `static/assets/img/photos/`.

## What changed
- **Hero watch** (`build.mjs`): `heroWatch: watch('hwatch', { eager: true, cycle: true })`. The hero watch now has all five screens. Up next loads right away. Screens 2–5 have only `data-src`, so they load nothing until home.js asks for them.
- **home.js**: `watchCycle()` now runs `cycleWatch(face)` once for every `[data-watch-cycle]` face. Each watch has its own state, its own timer and its own on-screen observer. The hero's "card" is `.hero`. HOLD is 2.5 s and the slide 0.45 s, as before.
  - Hero: the screens load after the window `load` event, so the hero phone's first screenshot comes first. The first turn waits for the intro (INTRO = 2.1 s) and then HOLD, so it comes about 4.6 s after load.
  - Bento: no change. Its screens load when the card is two screens away.
  - The comment block and the file header are updated.
- No JS or reduced motion: Up next, still (`watchCycle` is never called with reduced motion).
- **Members:** `MEMBERS_COUNT = 1500`. I also changed the `@h2a` example in `content/en.json` to "1,500 / 1.500".
- **Other places with the number:** none. I searched content/, templates/, help/, blog/ (also static/ and tools/) for 1,000 / 1.000 / 1000+ and words like "thousand", 千 and ألف. The only hits were two money amounts in help budget pictures (NT$21,000, Rp…000), not user counts.
- Not in scope, so I left it: a comment in `home.css` line 88 still says "The bento watch's screens 2–5". The rule itself works for both watches.

## Check (headless Chrome, 1440 and 390 px, en / ja / ar)
- Hero watch: upnext › shopping › todos › habits › note › upnext in 16 s. It used that language's screenshots. No turn in the first 3.5 s.
- Hero scrolled away: it stayed on the same screen for 6 s. Back on screen: it turned again within 3.5 s.
- Bento watch: turns by itself (upnext › shopping › todos › habits in 9 s).
- Reduced motion (ja): Up next only, and 1 of 5 screens loaded.
- Headline: en "Joined by 1,500+ members", ja "1,500人以上", ar "أكثر من 1,500", de "Schon 1.500+ Mitglieder".
- A test mistake I fixed: my first "scrolled away" test put the hero's bottom edge at exactly 0 px. The browser still counts an element that touches the edge as on screen, so the watch kept turning. When I scrolled 400 px further, it stopped. The bento test also showed that the hero watch stops while it is off screen.
- The test server and Chrome ran in one foreground script and both stopped at the end. Nothing is left running.

## Build
```
content OK · 28 locale(s) · 519 keys each
legal OK · 2 document(s) × 28 locale(s)
help OK · 94 article(s) · 25 locale(s) · 74 app routes checked
test-check-help OK · 99 cases
build OK · 3233 pages · 3203 in hreflang clusters
detector OK · 32 cases · 28 locale(s) built
help search OK · 26 cases · 2 built page(s)
```
`npm test` is also green.

## Help impact
none

## Owner
- Run `./deploy.sh` when you want it live.
