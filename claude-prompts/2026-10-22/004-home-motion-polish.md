# Home page: rating 4.9, faster hero, marquee never pauses, smoother feature row, slower flat-lay

Small polish on the live home page (daili.app), all from Ammar's list of
2026-10-22. Motion lives in `static/assets/home.js`, styles in
`static/assets/home.css`, markup in `build.mjs` `renderHome()`. Batch prompt:
one commit is fine.

## Requirements

1. **Rating 4.7 → 4.9.** `site.config.mjs` `RATING.value` = `4.9` (Ammar
   reads 4.9 on Google Play). Update the dated comment above it
   (2026-10-22). The last star must fill 90 %. Update any check or comment
   that hard-codes 4.7 (`build.mjs` comment, `@rating` description example).

2. **Hero flying cards: faster.** `heroScenes()` today runs one scene in
   about 6.3 s (slide 0.8, cards in at 0.7 s, ticks at 3.5 s, exit at
   5.3 s + 0.6 s, +0.2 s). Make one scene about **4.5 s**:
   - put the length in ONE constant at the top of `heroScenes()` (e.g.
     `var SCENE = 4.5;`) and derive every time in the scene from it, so
     Ammar can try 4 or 5 by changing one number;
   - keep the order and feel: screenshot slides in, cards fade in touching
     the phone, drift, get ticked one after the other, fly off. Ticks must
     still be clearly visible (each card ticked for at least ~0.8 s before
     it leaves);
   - keep the "never halts" rule: the exit ease's start speed must stay
     above the drift speed. Re-do the math in the comment with the new
     numbers;
   - fix the "~6.5 s" in the comments.

3. **"Joined by 1,000+ members" row never pauses.** Today
   `.home .marq:hover .marq-track{animation-play-state:paused}` stops it
   under the mouse. Remove that for the members row. The reviews row
   (`.revs`, only rendered with 3+ reviews) is text to read — keep its
   pause-on-hover, scoped to `.revs`.

4. **"Start the day together": fix the first scroll + remove the bar.**
   Ammar sees a glitch the FIRST time he scrolls into the pinned row, and
   thinks the pictures load at different times. Find the real cause, fix
   it, and say in the report what it was. Two likely causes to check:
   - the card screenshots are `loading="lazy"`; the pinned track moves by
     `transform`, so each phone's picture only starts loading when it
     slides into view → blank phones pop in and decode during the motion;
   - `home.js` adds a `refresh` (→ `ScrollTrigger.refresh()`) on the load
     of every not-yet-loaded `<img>`. When the row's lazy images load while
     the row is pinned, a refresh runs mid-pin and the page jumps.
   Wanted result:
   - all images inside `[data-frow]` are loaded and decoded BEFORE the row
     arrives: when the row is about 1.5 screens away (one ScrollTrigger,
     `once`), switch them to `loading="eager"` and call `decode()`; same on
     phones (the native swipe row has the same pop-in);
   - no `ScrollTrigger.refresh()` while the pin is active. Images whose size
     is fixed by CSS (`.phone .scr img` is 100 % × 100 % of a sized phone)
     do not need the refresh listener at all — skip them, or queue the
     refresh until the pin has ended;
   - **remove the progress bar** under the row (`.frow-prog` /
     `data-frow-bar`): markup, CSS (incl. RTL rule), the `progress` code in
     `show()`, the `check-build.mjs` assertion (it now expects the bar to be
     ABSENT) and the comments. Keep the counter ("3 of 13") and the arrows.
   Prove it: in Playwright/Chromium at 1440×900, **cache disabled and the
   network throttled** (e.g. 1.5 Mbps), load the page and wheel-scroll down
   into the row the first time. Before/after: record any jump in
   `scrollY` that the wheel did not cause, and whether a card shows an
   empty phone. After the fix: no jump, no empty phone.

5. **"Ready when you are" flat-lay: slower.** Today the objects and the
   phone land when the flat-lay's TOP reaches 30 % of the screen
   (`end: "top 30%"`), so they are already in place before the scene
   reaches the middle. Make them land when the flat-lay's **middle reaches
   the middle of the screen** (`end: "center center"` or the equivalent)
   for every `[data-obj]` and `.fphone`, and soften the follow a little
   (`scrub` 1 → 1.5). Check at 1440×900 and 390 px wide (the flat-lay is
   scaled 0.72 on phones): the last object must settle while the scene is
   centred, never after it has left.

## Scope
- In: `site.config.mjs` (RATING only), `build.mjs`, `static/assets/home.js`,
  `static/assets/home.css`, `tools/check-build.mjs`, `content/en.json`
  (`@rating` description only), this prompt file.
- Out: other sections, content strings, help, legal, blog, `deploy.sh`.
  🔴 Untracked files that are NOT yours (`claude-prompts/2026-10-21/`,
  `claude-prompts/MARKETING-WEEKLY.md`, `static/assets/img/photos/`): do not
  touch, stage or commit them.
- Reduced motion must still work: hero shows scene 1 still, row is a plain
  swipe row, flat-lay static.

## Verify
`npm run build` green (all its checks). Look at `dist/index.html` and
`dist/ar/` (RTL) at 1440 and 390 px: hero scene ≈ 4.5 s (measure it), the
member row keeps moving under the mouse, the feature row has no bar and no
first-scroll jump, the flat-lay settles mid-screen.

## Commit & push
`feat(home): rating 4.9, faster hero, smoother feature row, slower flat-lay`;
body `Prompt: claude-prompts/2026-10-22/004-home-motion-polish.md`. Commit
this prompt file with it. **Push. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-10-22/004-home-motion-polish.md`, half a page: the
hero numbers you chose, the REAL cause of the first-scroll glitch and the
throttled before/after result, the flat-lay trigger, build lines, SHA +
push. `## Help impact`: none.
