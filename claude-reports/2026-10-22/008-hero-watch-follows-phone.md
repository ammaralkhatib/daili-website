# 008 — Home: the hero watch follows the hero phone

**Status: DONE** · commit `7d69a7b` on main, pushed. `./deploy.sh` not run.
Step 0: the prompt file was the only pending planning doc. I committed and pushed it first as `9fde475 docs(plan): sync planning docs`, so it is not in `7d69a7b`. I did not touch `claude-prompts/2026-10-21/`, `MARKETING-WEEKLY.md` or `static/assets/img/photos/`.

## What changed
- **site.config.mjs:** every `HERO_SCENES` entry has a `watch` field, as in the prompt's table (calendar/birthdays/meals → `upnext`, todos → `todos`, shopping → `shopping`, habits → `habits`, notes → `note`).
- **build.mjs:** a watch screen's key is the part of its name after `shot-watch-`. The build throws if a non-null `watch` is not a real screen. The hero watch now has its screens in scene order (upnext, todos, shopping, habits, note), each with `data-ws="<key>"`. The bento keeps the old order. Each hero phone screenshot gets `data-watch="<key>"`, so home.js knows which watch screen goes with it. The hero watch no longer has `data-watch-cycle`.
- **home.js:** the hero watch has no timer of its own any more. A small helper, `heroWatch()`, has `load()` and `show()`. `heroScenes()` calls `load()` at the same moment it sets the phone's later screenshots to `eager`. At each scene start it calls `show()`, which adds the watch slide to that scene's timeline: start 0, 0.7 × T, `power3.inOut`, still sliding up like the crown. It does nothing if the screen is already showing or has not loaded (or failed). The watch is part of the timeline, so it pauses and goes on with the phone. `cycleWatch()` now runs for the bento only (2.5 s, unchanged). I updated the comments and the `home.css` comment.
- Reduced motion / no JS: Up next, still (unchanged code path).
- No CHANGELOG line: this repo has no `CHANGELOG.md`.
- A mistake I fixed: my first version wrote the two small shared helpers as `var` functions further down the file. `heroScenes()` runs before that line, so they did not exist yet and the phone stopped after scene 1. The headless check caught it. They are now normal function declarations.
- Not tested: the build's "not a real watch screen" error. I did not plant a bad key to see it throw.

## Check (headless Chrome, CDP, one foreground script; server and Chrome stopped at the end)
At 1440 and 390 px, en and ar: two full rounds each (15 scene starts). The watch at scene start + 0.8 s matched the table 15 of 15 times in all four. No JS errors. Every watch slide started within 0–42 ms of the phone's slide (my sampler checks every 20 ms). There was no watch turn at any other moment. One round (en 1440):

| phone | watch +0.8 s | slide |
|---|---|---|
| calendar | upnext | none (no-JS start) |
| todos | todos | yes |
| shopping | shopping | yes |
| habits | habits | yes |
| notes | note | yes |
| birthdays | upnext | yes |
| meals | upnext | no slide |
| calendar | upnext | no slide |

- **Throttled (1.5 Mbps, cache off, 390 en):** at that speed every screen was loaded by scene 2, so all 15 matched. To see a *late* screen, I made the test server send the todos watch screen 9 s late. In the todos scene the watch **stayed** on Up next (no slide). At shopping it turned to shopping, in step with the phone. In round 2 todos matched. With the shopping screen blocked (it fails), the watch stayed on To-dos during both shopping scenes and matched again at habits. It never turned after the phone.
- **Hero scrolled away** mid-slide (scene 3): for 9 s the phone and the watch did not move at all, and no scene started. Back on screen, both went on together and the next scenes matched.
- **Bento watch:** it turned on its own while the hero was away (shopping, todos, habits, 2.5 s apart). It did not turn while it was off screen.

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
