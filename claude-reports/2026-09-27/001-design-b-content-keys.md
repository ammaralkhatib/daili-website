# Report — 001 Design B 1/2, content keys for the new home page

Prompt: `claude-prompts/2026-09-27/001-design-b-content-keys.md`
Commit: `472737f11de1f9ec240ac1ed5848ecb33bb0c4c2`
`content: Design B home page strings (hero.chip, showcase.*, life.*, pricing.lead) × 28 locales`

## Done

- `hero.chip` (first key in `hero`), new `showcase` object (between `hero` and
  `story`), new `life` object (between `story` and `howItWorks`), and
  `pricing.lead` (after `bigNote`, directly under the €0) in all 28 files. That
  is 13 new strings per locale, all translated in the 27 non-English files. No
  other keys were added and nothing was removed.
- `@chip`, `@pill` and `@facts` descriptions are in `en.json`, one line each
  like the rest of the file.
- `node tools/check-content.mjs` passes: `content OK · 28 locale(s) · 247 keys
  each`, 0 errors. It still shows 17 warnings, and they are the same 17 as
  before this run. None of them is a new key.
- `npm run build`: content and legal pass, but **the build fails at the help
  check**. The error is `help/routes-allowlist.json: app route
  "/meal-plan/suggest" has no article`. It fails the same way with my content
  changes stashed, so this run did not cause it. The app has a new route that
  has no help article yet.

## Spot check — `life.facts[1].t`

| loc | value |
|---|---|
| de | `Server in der EU` |
| ja | `サーバーはEU内` |
| ar | `خوادم في الاتحاد الأوروبي` |
| tr | `Sunucular AB'de` |

## Shortened or over the cap

- **ar `life.facts[1].t` is 25 characters, over the 22 cap.** I kept it on
  purpose. "EU" has no common Arabic abbreviation, and `خوادم في أوروبا`
  ("in Europe") would make the trust claim weaker. It also matches `hero.notes`.
  Arabic joined script is narrow, so it should still fit on one line. 002
  should check it in the card.
- Several "Free. No ads." lines lose the full stop or become one phrase so
  they stay at 22 or under: it `Gratis, senza annunci`, da `Gratis og
  reklamefri`, fi `Ilmainen, mainokseton`, el `Δωρεάν, 0 διαφημίσεις`, ru
  `Бесплатно, без рекламы` (exactly 22), uk `Без оплати й реклами`.
- "Kids & grandma too" became whatever sounds natural and fits: fr `Ados,
  enfants, mamie`, es `Para niños y abuelas`, pt `Para crianças e avós`, ja
  `子どももおばあちゃんも`.
- `showcase.pill` uses each locale's existing `story.cards.shopping[2]` wording
  (t — s), so the pill and the card say the same thing.

## Strings in the mock with no key (not added — for 002 to decide)

- `Made in Austria` is a 4th hero trust note, but `hero.notes` has only 3.
- `Made in Innsbruck, Austria` is in the footer. No footer key has it.
- `Home-screen widgets` is in the chip row. No `features.*.eyebrow` has it.
- `the daili app` and `iPhone · Android` are the caption in the video panel.
  `hero.kicker` is close, but says "web browser" too.
- The floating cards in the video panel don't match `story.cards.hero`. The
  mock shows 4 cards (`Piano lesson · every other Wednesday · Noah`, `Tuesday ·
  Dinner`, `Milk · 2 l · Lena added it`, `Emma turns 12 · in 22 days · reminder
  for everyone`), and 2 of the `s` lines don't exist anywhere.
