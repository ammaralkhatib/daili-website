# Design B 1/2 — the content keys for the new home page

## Goal

Add the strings the Design-B home page (002) needs to **every one of the 28
locales** in `content/<locale>.json`, in the same house style as the 2026-09-18
`story.cards` round: natural, short, translated by a native writer — never
English left in place, never a machine-literal calque. Nothing else changes.

Prerequisite: nothing. This prompt touches `content/*.json` only (plus the
`@`-description objects that document a key for translators). Read
`claude-prompts/2026-09-18/001-story-content-keys.md` and its report first —
same job, same rules, same traps (the `check-content.mjs` identical-string rule,
placeholder parity, "Daili" survives, no transliterated brand).

Design reference (what each string is for, where it sits):
`claude-prompts/2026-09-27/design-b-mock.html` — open it in a browser.

## The keys (English is the source; every other locale gets the translation)

Add, in this order, at the natural place in each file (next to the section
they belong to):

1. **`hero.chip`** — the small pill above the headline.
   en: `Now on iPhone, Android and the web`
   `@chip.description`: "Pill above the headline. Product names stay in Latin
   letters (iPhone, Android). Under 40 characters."

2. **`showcase`** — new object for the video panel under the hero:
   - `showcase.pill` — en: `Synced in about a second — on every phone in the family`
     `@pill.description`: "Dark pill at the bottom of the video panel. One
     sentence, no full stop."
   - `showcase.h2` — en: `One app for the whole family` — visually hidden
     heading for the section (screen readers + the section-order guard).
   - `showcase.alt` — en: `The Daili home screen with an event, a shopping
     item and a birthday floating next to it` — the alt of the phone image in
     the panel (the video is decorative, `aria-hidden`).

3. **`life`** — new object for the "real life" slide (video card + three facts):
   - `life.h2` — en: `Plan it on Sunday evening. Live it all week.`
   - `life.p` — en: `Five minutes at the kitchen table — and four phones know
     the plan.`
   - `life.facts` — array of exactly **3** objects `{ "t", "s" }`
     (`t` bold, `s` small — same shape and same `@`-doc wording as
     `story.cards`):
     1. `t`: `Free. No ads.` — `s`: `Nothing sold, nothing tracked for advertising.`
     2. `t`: `Servers in the EU` — `s`: `Your family's data stays in Europe. Photos and documents never leave the phone.`
     3. `t`: `Kids & grandma too` — `s`: `Own logins for teens, managed profiles for little ones. Invite with a 6-digit code.`
     `@facts.description`: "Three fact cards next to the video. `t` is one
     short bold line (under 22 characters), `s` one sentence."

4. **`pricing.lead`** — en: `No credit card, no trial, no locked features.` —
   the one-liner under the big €0 (the old `pricing.lead` was removed on
   2026-09-18; this is a new, shorter string — do not resurrect the old text).

Nothing is removed in this prompt. `story.cards.hero` (3 cards) is reused by
002 for the floating cards in the video panel; `features.<key>.eyebrow` is
reused for the chip row and the chapter labels. **Do not add other keys.** If
002's mock shows a string you cannot map to a key listed here or an existing
one, stop and report which — never invent an English-only fallback.

## Translation rules (unchanged from 09-18)

- `tools/check-content.mjs` must pass: key-set equality with `en`, array
  length 3 for `life.facts`, no string ≥ 25 characters byte-identical to
  English, "Daili" never transliterated (the new strings do not contain the
  brand — keep it that way).
- Product names stay Latin (`iPhone`, `Android`); "EU" may be the locale's
  usual abbreviation (`EU`, `UE`, `ЕС`, `AB`, …).
- RTL (`ar`): plain text, no Latin punctuation at line ends.
- Thai/CJK: no spaces added where the language has none.
- Keep the file's key order tidy: new keys sit beside their section, not
  appended at the end.

## Verify

- `node tools/check-content.mjs` clean for all 28.
- `npm run build` still clean (the keys are not referenced yet — the build
  must not care).
- Paste the `life.facts[1].t` value for `de`, `ja`, `ar`, `tr` in the report
  as a spot check.

## Commit & push

- `content: Design B home page strings (hero.chip, showcase.*, life.*, pricing.lead) × 28 locales`
  — body `Prompt: claude-prompts/2026-09-27/001-design-b-content-keys.md`.
  **Push now.**

## Report

- `claude-reports/2026-09-27/001-design-b-content-keys.md` (half a page): the
  four spot-check values, any locale where a string had to be shortened and
  why, commit SHA.
