# Home page reviews — readable in every page language, clearly marked as translated

## Goal

The reviews row (`#reviews`, live since `fecd705`) shows each review in the reviewer's own language, so most visitors
cannot read most cards. Ammar's pick (2026-11-03): show each card **in the page's language**, marked "Translated from
<language>", with the reviewer's own words one tap away — like Google Play does. A review already in the page's
language shows as it is, no label. Honesty rule: a translation is NEVER shown without its label, and the original is
always in the page.

Done = all parts below, `npm run build` green with no override, every new guard proven to fail. **Do not deploy.**

Load the `frontend-design:frontend-design` skill for part 3 and stay inside the existing `home.css` tokens, fonts and
card design — this is a small addition to a card, not a redesign.

## 1. Data

- Each `REVIEWS` entry in `site.config.mjs` gets a stable `id` (kebab, e.g. `valentino-2026-10-31`,
  `willoo98-2026-10-02`). Update the doc comment: id is required and never changes; adding a review means adding its
  translation to every `content/reviews/<loc>.json`.
- New folder `content/reviews/`, one file per site locale (all 28 in `LOCALES`):
  `{ "<id>": { "title": "...", "text": "..." }, ... }` — `title` only when the original has one. A locale whose
  language IS the review's language has NO entry for it (that page shows the original).
  Language match = `new Intl.Locale(loc).language === review.lang` (so `zh-Hans`/`zh-Hant` count as `zh`).
- Write the translations yourself. Rules:
  - Faithful and natural, the tone of a happy parent writing a store review — not marketing copy. Do not add,
    strengthen or drop praise. Keep the "…" in the Kathii19866 excerpt where it is.
  - Normal sentence case (Valentino's ALL-CAPS first sentence is not copied into translations).
  - "Daili", "App Store", "Google Play", "Google Calendar" stay as they are. `zh-Hans` = Simplified, `zh-Hant` =
    Traditional; `ar` right-to-left.
  - Use `content/glossary.md` for app words (to-do, shopping list, family…) so the cards match the rest of the page.

## 2. New strings (all 28 `content/<loc>.json`, en.json with `@`-descriptions)

- `home.reviews.translated` — "Translated from {language}". `{language}` is filled by the build with
  `new Intl.DisplayNames([loc], { type: 'language' }).of(review.lang)` — never hand-written language names.
- `home.reviews.original` — "Show original" (the tap target).
- `home.reviews.anonymous` — what Play shows for an anonymous reviewer, in that language ("Google Play user",
  de "Google Play-Nutzer"…). The build uses it when a review's `name` is exactly `Google Play user`.
check-content's usual rules apply (placeholder parity: `{language}` exactly once).

## 3. The card

Translated card (page language ≠ review language):
stars → title (translated, if any) → who-line → text (translated, `lang` = page language) → one small line:
"Translated from Italian · Show original". "Show original" is a `<details><summary>`; open, it shows the reviewer's
own title (if any) + text below, with `lang` = the review's language, exactly as in `REVIEWS`. Works with JS off. No
new JavaScript unless something truly needs it.
Original card (same language): exactly as today, no label, no `<details>`.

- While a card's `<details>` is open, or a card has keyboard focus, the row stops moving
  (`.marq:has(details[open]) .marq-track`, `:focus-within`), so a reader is never chased by the marquee. The existing
  hover pause stays; `prefers-reduced-motion` behaviour stays.
- The second, `aria-hidden` card set has no focusable `<summary>` (a hidden copy must not take keyboard focus) — e.g.
  `inert` on that set, or render its label without `<details>`.
- The label line is small and quiet (`--ink3`, the who-line's size). The summary looks like a text link, has a visible
  focus ring, and a ≥ 24 px tap height.
- Cards keep equal height in the row (as today). Check it does not grow badly: if the tallest translated card is more
  than ~25 % taller than today's 319 px at 1440, report it (don't redesign).
- RTL (`ar`): label and summary sit on the reading side, nothing mirrored wrongly.

## 4. Guards

In `tools/check-content.mjs` (or a new `check-reviews` step in the same chain — your call, keep it in `npm run build`):
a. Every locale file exists, has exactly the ids it should (every review whose language differs from the locale's,
   none it should not), and `title` exactly when the original has one. Unknown/stale ids fail.
b. A translation ≥ 25 chars must not be byte-identical to the original (catches an untranslated copy).
c. Empty strings fail.

In `tools/check-build.mjs` §15 (extend it):
d. On every landing page, each card's ORIGINAL title + text still match `REVIEWS` exactly, in order (in `<details>` or
   in the main text) — real words, never edited.
e. A card shows a translated text ⇔ it has the "Translated from …" label and the `<details>` with the original. No
   translated card without label; no label on an original card.
f. Translated `<p>` carries the page's `lang`; original `<p>` carries the review's `lang`.

Prove each guard can fail (delete one id from `ja`, copy the original into `fr`, drop the label on one card in a built
page, edit one original word in a built page), see it go red, restore, confirm `git diff` shows only intended changes.
One line per guard in the report.

## Scope

- In: `site.config.mjs` (ids + comment), `content/reviews/*.json` (new), the three keys in all `content/<loc>.json`,
  `build.mjs`, `static/assets/home.css`, `tools/check-content.mjs` / new check + `package.json` build chain,
  `tools/check-build.mjs` §15, `README.md` (one line on adding a review), this prompt file.
- Out: the review choice and order, other sections, blog, help, legal, `deploy.sh`. Untracked
  `static/assets/img/photos/` is not yours — leave it, don't let it block step 0. The untracked
  `claude-reports/2026-11-03/002-…md` IS a planning doc — commit it in step 0 as usual.

## Verify

Plain `npm run build` green. In `dist/`: `index.html` (en: willoo98 + agranger original, 5 translated), `de/index.html`
(3 German originals, 4 translated), `ja/index.html` (all 7 translated), `ar/index.html` (RTL). Screenshots at 1440
and 390 px of `de` and `ja`, one with a `<details>` open, and check: row stops while open, label readable, nothing
overflows, cards line up. Tab through the row once with the keyboard: only the visible set takes focus.

## Commit & push

`feat(home): reviews translated into every page language, original one tap away` — body
`Prompt: claude-prompts/2026-11-03/003-translated-reviews.md`. Commit this prompt file with it. **Push. Do NOT run
`./deploy.sh`.**

## Report

`claude-reports/2026-11-03/003-translated-reviews.md` (file-write tool; `wc -c` > 0), half a page: what changed, the
English + German translations of the 7 cards (so Ammar can read them), the guard proofs (red → green), tallest card
height before → after, build line, SHA + push. `## Help impact`: none.
