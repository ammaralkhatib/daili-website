# Home page: hero watch turns through its screens too + 1,500 members

Two small changes from Ammar (2026-10-22).

## Requirements

1. **Hero watch cycles like the bento watch.** Today only the bento card's
   watch turns through Up next → Shopping → To-dos → Habits → Quick note
   (`watchCycle()` in `static/assets/home.js`, `watch(cls, { cycle })` in
   `build.mjs`). The hero watch (`.hwatch`) shows Up next, still. Make it
   turn the same way:
   - `build.mjs`: `heroWatch: watch('hwatch', { eager: true, cycle: true })`
     (Up next stays eager, screens 2–5 `data-src`).
   - `home.js`: make `watchCycle()` run for EVERY `[data-watch-cycle]`
     face, each with its own state, timer and on-screen observer (the
     hero's "card" is `.hero`). Same HOLD 2.5 s and 0.45 s crown slide.
   - Hero timing: the first turn comes only after the watch's intro has
     landed (~2.1 s after load, plus HOLD). Load the hero's screens 2–5
     after the window `load` event (not before — the hero phone's first
     screenshot comes first). Paused while the hero is off screen or the
     tab hidden.
   - No JS / reduced motion: Up next, still (as today).
   - Update the comment block on `watchCycle()` and the home.js header.

2. **1,000+ → 1,500+.** `site.config.mjs` `MEMBERS_COUNT = 1500` (the
   headline shows "1,500+", "1.500+", … per locale; the count-up animates to
   1,500). Grep content/, templates/, help/ and blog/ for any OTHER place
   that writes the user number as text ("1,000", "1.000", "1000+", in any
   locale) and update it to 1,500 — list them in the report. Update the
   `@h2a` example in `content/en.json` if it helps.

## Scope
- In: `build.mjs`, `static/assets/home.js`, `site.config.mjs`
  (MEMBERS_COUNT), content strings only where they hard-code the number,
  this prompt file.
- Out: everything else, `deploy.sh`.
  🔴 Files that are NOT yours — do not touch, stage or commit them:
  `claude-prompts/2026-10-21/`, `claude-prompts/MARKETING-WEEKLY.md`,
  `static/assets/img/photos/`, and anything prompt
  `2026-10-22/006-help-search-pricing.md` changes (help/*/account/plus.md,
  static/assets/help-search.js) if it is still uncommitted.

## Verify
`npm run build` green. In Chrome at 1440 and 390 px (en, ja, ar): the hero
watch turns through five screens in that language, stops while the hero is
scrolled away and resumes; the bento watch still turns on its own; the
members headline shows 1,500+ (de: 1.500+).

## Commit & push
`feat(home): hero watch turns through its screens, 1,500+ members`; body
`Prompt: claude-prompts/2026-10-22/007-hero-watch-cycle-1500.md`. Commit this
prompt file with it. **Push. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-10-22/007-hero-watch-cycle-1500.md`, a few lines: what
changed, other places with the number, build lines, SHA + push.
`## Help impact`: none.
