# The "coming soon" sentence becomes a popover, not a line under the badges

## Goal
Prompt 001 shipped the sentence as a paragraph under the badge row. Ammar's
verdict after looking at it: **it is not clear** — it reads as more page copy,
so the connection between "I tapped the App Store button" and "here is why
nothing happened" is lost.

Replace that inline paragraph with a **small popover anchored to the chip**:
a little card with a pointer arrow touching the App Store badge, holding the
same sentence. Tap the chip → the card appears next to it. Tap outside, tap
the chip again, or press Escape → it goes away.

Done = tapping the App Store badge produces something that obviously belongs
to that badge, in all three places the badge appears, in all 23 locales,
in both themes, in LTR and RTL — and nothing new needs translating.

## Scope
- In: `static/assets/script.js`, `static/assets/style.css`.
- Likely in, only if an ancestor clips the card: `templates/layout.html`
  (the `.dl-menu` dropdown).
- Out: **no new content keys and no `content/*.json` edits** — reuse the
  `store.iosSoon` string that is already there in 23 languages. No changes to
  `site.config.mjs`, `check-build.mjs` §10, the badge markup's `data-store` /
  `aria-expanded` contract, or the Google Play badge.
- **Out: the sticky bottom bar on iOS.** It shows the sentence as its own text
  and reads fine. Leave it exactly as it is.

## Requirements

1. **Reuse the existing node.** `templates/_storebadges.html` already renders
   `<p class="store-soon" role="status">{{ store.iosSoon }}</p>`. Keep that
   markup. JavaScript turns it into the card on load (add a class, position
   it, hide it); it does **not** get replaced or re-created, so the sentence
   still comes from the translation file and never from JS.

2. **No-JS behaviour is unchanged.** With JavaScript off, the paragraph must
   still be a plain visible line under the badges, exactly as it is today.
   So every popover style must hang off a class that **only JS adds** — never
   off `.store-soon` alone.

3. **The card.** Panel background (not the page background), 1px border,
   rounded corners, a soft shadow, comfortable padding, and a small arrow
   (a rotated square is fine) whose tip touches the bottom edge of the chip.
   `max-width: min(280px, calc(100vw - 32px))`. It must sit **above** the page
   content (`z-index` below the sticky bar, above everything else nearby).

4. **Anchoring.** Absolutely positioned inside the chip's own container, so it
   moves with the page on scroll — do **not** use `position: fixed` and do not
   add a scroll listener. Horizontally it is centred on the chip, then clamped
   so it never crosses the viewport edge; when it is clamped, the **arrow
   moves independently** so it still points at the chip. Give the container
   `position: relative` only where needed, and check that no ancestor's
   `overflow` clips the card — the nav `.dl-menu` dropdown is the one to
   verify. If it does clip, fix the clipping; do not move the card somewhere
   else to dodge it.

5. **Open / close.** Tap the chip toggles it. Tapping anywhere outside closes
   it. Escape closes it **and returns focus to the chip**. Only one card open
   at a time — opening one closes the others. The nav dropdown must not close
   when the card inside it is opened (that behaviour is already there for the
   chip; keep it).

6. **Accessibility.** `aria-expanded` keeps tracking open/closed, as it does
   now. Give each card a **JS-generated unique id** (the partial is on the
   page three times, so ids must not come from the template) and point the
   chip's `aria-describedby` at it. Keep `role="status"`.

7. **Themes and RTL.** Define the card's colours in the light block and
   re-define them in the dark block (~line 345) — no colour may exist only in
   one theme. Use logical properties (`inset-inline`, `margin-block-*`) so
   `/ar/` mirrors correctly, and confirm the arrow points the right way there.

8. **No new horizontal overflow.** The page already has a pre-existing ~116px
   overflow at 360px from the `.reveal` transforms (measured in report 001).
   Measure `document.documentElement.scrollWidth` at 360px with the card open
   and closed: it must not grow beyond that existing number.

## Verify before you report
1. `npm run build` clean, and `/usr/bin/grep -rn "apps.apple.com" dist/` still
   finds nothing.
2. `npm run serve`, then in a browser at **360px** and desktop width, on `/`,
   `/de/` and `/ar/`:
   - all **three** chips (nav download menu, hero, bottom CTA) open a card
     that visibly points at the chip that was tapped;
   - opening one closes the others; outside-tap, second tap and Escape all
     close it; focus returns to the chip on Escape;
   - the card is fully visible — not clipped by the nav dropdown, not off the
     screen edge — and the arrow still points at the chip when clamped;
   - RTL is mirrored, dark mode is readable.
3. JavaScript disabled: the sentence is a plain visible line under the badges
   in all three places, as before.
4. The `scrollWidth` measurement from §8, card open and closed.
5. iPhone UA on a narrow viewport: the sticky bottom bar is **unchanged** from
   prompt 001 (a `<span class="sticky-soon">`, no link, close button works).

**Take screenshots** of the hero card at 360px in light and dark, and of the
nav-menu card, and save them under `claude-reports/2026-08-29/shots/`. Ammar
judged the last version by eye, so the report should let him do that without
starting a server.

## Report
`claude-reports/2026-08-29/002-appstore-soon-popover.md` — half a page: what
changed in each file, how the clamping and the arrow work, what the nav
dropdown needed, and anything you decided differently and why. Commit and
push. **Do not run `./deploy.sh`.**
