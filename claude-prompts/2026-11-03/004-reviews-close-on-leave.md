# Reviews row — an open "Show original" closes when the reader moves on

## Goal

Live since `193b51b`: opening "Show original" on a review card stops the row (`home.css` ~530,
`.marq:is(:has(details[open]),:focus-within)`), and it stays stopped until the reader clicks "Show original" again.
Ammar (2026-11-03): when the cursor leaves the card, the original should close and the row should move again.
Done = the rules below, `npm run build` green, behaviour checked in a real browser. **Do not deploy.**

## Behaviour

1. **Mouse / trackpad** (`pointerType === 'mouse'` or `'pen'`): when the pointer LEAVES a review card (`.rv`) whose
   `<details>` is open, close it (`details.open = false`). Use `pointerleave` on the card, not on the summary — moving
   from the summary down into the original text must NOT close it.
2. **Hover pause = per card, not per row.** Today `.revs .marq:hover` stops the row while the cursor is anywhere over
   it, so after leaving a card onto the gap or the row's edge it would still stand. Change it to stop only while the
   cursor is over a card: `.revs .marq:has(.rv:hover) .marq-track`. Result: leave the card → it closes → the row moves
   again (unless the cursor is now on another card, which pauses as a normal hover).
3. **Touch** (no pointer leave on phones): an open card closes when the reader taps anywhere outside that card
   (`pointerdown` on the document, target not inside the open card). A tap inside the card, including on the
   original text, keeps it open. Tapping "Show original" again still closes it (native `<details>`).
4. **Keyboard:** when focus leaves the card (`focusout` with `relatedTarget` outside the card), close it — so Tab
   onward resumes the row. Esc while focus is in an open card closes it and keeps focus on its summary.
5. Only ONE card open at a time: opening a card closes any other open one (both card sets).
6. Unchanged: `prefers-reduced-motion` (no animation at all), the `tabindex="-1"` copy set, JS-off behaviour (without
   JS the card still opens and closes by tapping "Show original"; the row pause while open stays as the fallback).

## Where

Small block in `static/assets/home.js` (the home page's existing script), event delegation on `#reviews` — no
per-card listeners, works for both card sets. If `#reviews` is absent (fewer than 3 reviews), the block does nothing.
CSS: only the hover-pause selector change in `home.css` (keep the `:has(details[open])` / `:focus-within` rule — it
covers JS-off and keyboard).

## Verify

Plain `npm run build` green. In a real browser (Playwright, `de/index.html` from `dist/` served locally), at 1440:
- open a card with the mouse, move inside it (summary → original text): stays open, row stopped;
- move the mouse out of the card onto empty page: card closed, row transform changes again within 1 s;
- move out onto the NEXT card: first card closed, row paused (hover), moves again after leaving that card too.
At 390 with touch emulation: open a card, tap the original text (stays open), tap the page outside (closes, row
moves). Keyboard: Tab to a summary, Enter (opens), Tab onward (closes, row moves); Enter then Esc (closes, focus on
summary). One line per check in the report.

## Commit & push

`fix(home): an open review original closes when the reader moves on` — body
`Prompt: claude-prompts/2026-11-03/004-reviews-close-on-leave.md`. Commit this prompt file with it. Step 0 commits
the untracked `claude-reports/2026-11-03/003-*` as usual; `static/assets/img/photos/` is not yours. **Push. Do NOT run
`./deploy.sh`.**

## Report

`claude-reports/2026-11-03/004-reviews-close-on-leave.md` (file-write tool; `wc -c` > 0), a few lines: what changed,
the check results, build line, SHA + push. `## Help impact`: none.
