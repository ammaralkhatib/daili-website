# Home page: the hero watch follows the hero phone

Ammar (2026-10-22): the hero watch must show the SAME feature as the hero
phone and change at the SAME moment. When the phone shows a feature the
watch has no screen for, the watch does not move until a matching screen
comes. (007 gave the hero watch its own 2.5 s timer — that goes.)

## Mapping (data, in `site.config.mjs`)
Add a `watch` field to each `HERO_SCENES` entry — the watch screen for that
scene, or `null`:

| scene | phone shot | watch |
|---|---|---|
| calendar | shot-calendar | `upnext` |
| todos | shot-todos | `todos` |
| shopping | shot-shopping | `shopping` |
| habits | shot-habits | `habits` |
| notes | shot-notes | `note` |
| birthdays | shot-birthdays | `upnext` (Up next shows the next birthday) |
| meals | shot-mealplan | `upnext` (Up next shows tonight's dinner) |

So in one round: Up next → To-dos → Shopping → Habits → Quick note → Up
next (with birthdays), stays for meals, stays for calendar. A `null`
means "keep whatever is showing". `build.mjs` checks every non-null value
names a real watch screen (throws otherwise) and writes the hero watch's
screens in that order with a `data-ws="<key>"` each, Up next first.

## Behaviour (`static/assets/home.js`)
1. The hero watch has **no own timer**. `heroScenes()` drives it: at the
   start of each scene (the same timeline position as the phone's slide,
   time 0), if the scene's `watch` key differs from what the watch shows
   AND that screen is loaded, the watch changes — **same start, same
   duration (0.7 × T) and same ease (`power3.inOut`) as the phone's
   slide**. Keep the crown direction (new screen slides up in, old one up
   out), only the timing matches the phone.
2. Not loaded yet, or failed → the watch stays put for this scene (never
   wait — waiting would break the match). It catches up at the next scene
   whose screen is ready.
3. Scene 1 (calendar) is already on screen without JS: the watch shows Up
   next from the start, no slide.
4. Because the watch is part of the hero timeline, it pauses and resumes
   with it (hero off screen / tab hidden) — no own observer for the hero
   watch.
5. Screen loading: start loading the hero watch's screens 2–5 together with
   the phone's later screenshots (the code that sets them `eager`), so they
   are ready by scene 2.
6. The **bento** watch keeps its own 2.5 s cycle (unchanged). Split the code
   so `cycleWatch()` runs for the bento only, and the hero watch is a small
   "show screen <key>" helper used by `heroScenes()`.
7. Reduced motion / no JS: Up next, still (as now).
8. Update the comments (file header, `heroScenes()`, the watch block) and the
   stale `home.css` comment ("The bento watch's screens 2–5").

## Scope
- In: `site.config.mjs` (HERO_SCENES `watch` fields), `build.mjs`,
  `static/assets/home.js`, `static/assets/home.css` (comment), checks in
  `tools/` if they assert the hero watch markup, this prompt file.
- Out: everything else, `deploy.sh`. 🔴 Not yours, never stage:
  `claude-prompts/2026-10-21/`, `claude-prompts/MARKETING-WEEKLY.md`,
  `static/assets/img/photos/`.

## Verify
`npm run build` green. Headless Chrome at 1440 and 390 px (en, ar): log,
for two full rounds, the phone scene and the watch screen at each scene
start + 0.8 s — they must match the table every time (meals and calendar
keep Up next with no slide). Throttle the network once (1.5 Mbps, cache off)
and confirm a late screen makes the watch STAY, then match at a later scene,
never lag behind the phone. Hero scrolled away → both stop; back → both go
on together. Bento watch still cycles alone.

## Commit & push
`feat(home): hero watch follows the hero phone`; body
`Prompt: claude-prompts/2026-10-22/008-hero-watch-follows-phone.md`. Commit
this prompt file with it. **Push. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-10-22/008-hero-watch-follows-phone.md`, a few lines:
what changed, the logged phone/watch pairs (one round), the throttled
result, build lines, SHA + push. `## Help impact`: none.
