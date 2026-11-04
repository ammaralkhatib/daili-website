# 004 — Reviews: an open "Show original" closes when the reader moves on

## What changed
- `static/assets/home.js`: new `reviewOriginals()`, called right after `featureSheet()` so it runs before the GSAP and reduced-motion early returns. All listeners are delegated on `#reviews`, and the function returns at once if `#reviews` is absent. Only the touch outside-tap listener sits on `document`.
  - mouse/pen `pointerleave` (capture phase, target `.rv`) closes that card's open original. It also blurs the summary if a mouse click left focus on it, because otherwise `:focus-within` would keep the row stopped;
  - touch `pointerdown` on the document outside the open card closes it. Taps inside the card keep it open;
  - `focusout` whose `relatedTarget` is outside the card closes it. A null `relatedTarget` (a tap on plain text inside the card) does not close it, because tapping the original text on a phone would otherwise close it;
  - Esc inside an open card closes it and focuses its summary;
  - `toggle` (capture phase): opening a card closes any other open one, in both sets.
- `static/assets/home.css:183`: hover pause `.marq:hover` → `.marq:has(.rv:hover)`. The `:has(details[open])` / `:focus-within` rule is unchanged, so the JS-off behaviour and keyboard pause are unchanged.

## Checks (headless Chrome over CDP, real Input.* mouse/touch/key events, `dist/de/index.html` served locally)
- 1440, mouse: opened card, moved from summary to original text → open, row stopped: PASS
- 1440, mouse: moved out of the card onto the page (an H2 above the row) → closed, focus on BODY, transform -214.0 → -245.4 px within 1 s: PASS
- 1440, mouse: moved out onto the next card → first card closed, row paused by hover. Then left that card too → row moving: PASS
- one card open at a time: opened a first-set card, then a copy-set card → only the copy-set card stays open: PASS
- 1440, keyboard: Tab to the last translated summary, Enter (opens, row stopped), Tab onward to `A.store-badge` → closed, row moving: PASS
- 1440, keyboard: Enter then Esc → closed, focus on its summary: PASS
- 1440, keyboard (for information): Tab from an open card to the next card's summary → closed, but the row stays paused by the existing `:focus-within` rule until focus leaves the row
- 390, touch emulation: tapped Show original (opens), tapped the original text → still open, row stopped: PASS
- 390, touch: tapped the page outside (`SECTION.care`, not a link) → closed, row moving: PASS
- 390, touch: tapped Show original twice → opens, then closes (native `<details>`): PASS
- reduced motion: `animation-name: none` on the track: PASS. JS exceptions: none

## Build
`npm run build` → `build OK · 3308 pages · 3278 in hreflang clusters`, detector OK, help search OK.

## Commits
- `1018aac` step 0: 003 report + shots
- `12d5eb8` fix(home): an open review original closes when the reader moves on (home.js, home.css, this prompt)
- Pushed to origin/main. Not deployed. `static/assets/img/photos/` left untouched.

## Help impact
None.
