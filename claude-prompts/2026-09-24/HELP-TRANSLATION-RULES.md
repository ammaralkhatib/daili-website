# Help translation rules (shared by prompts 009–016)

Read this before translating. The engine (prompt `008`) and its guard enforce
the structure. These rules are about **quality**.

## What to translate, per language
1. `help/<code>/_ui.json`: every key of `help/en/_ui.json`, including the 11
   topic titles + summaries.
2. **Every** English article `help/en/<topic>/<slug>.md` →
   `help/<code>/<topic>/<slug>.md`. Only the allowed keys (`id`, `title`,
   `summary`, `keywords`, `tipTitle`/`tipBody` if English has a tip,
   `translatedFrom` = the English `updated`). The same blocks in the same order.
   Image lines keep the id, and the alt text is translated.
3. Add the code to `HELP_LOCALES` in `site.config.mjs` once the language is
   complete and the build is green.

## Quality rules
- **Button and screen names = the app's own words.** Every name the reader
  must find in the app (buttons, tabs, screen titles, settings rows) comes from
  the app's ARB file for that language:
  `../familyplanner-app/lib/l10n/app_<arb>.arb`. The ARB codes are `zh` for
  `zh-Hans` and `zh_Hant` for `zh-Hant`, and the same code for the rest. Find
  the English label's ARB key in `app_en.arb`, then use the same key's value.
  Never invent a translation for a label that exists in the ARB. **Bold** the
  label as in English.
- **Informal, friendly register**, as the app uses it: German du, French tu,
  Spanish tú, Portuguese você, Italian tu, Dutch je/jij, Polish ty, Czech/Slovak
  ty, Turkish sen, Nordic du, Romanian tu, Greek εσύ, Ukrainian ти, Bulgarian ти, Indonesian Anda (the app uses Anda since 2026-09-25), Japanese です/ます, Korean 해요체, Chinese 你.
  Check the ARB for how the app itself addresses the user and match it.
- **Short, plain sentences.** The same meaning, no additions. Don't translate
  word by word: it must read like it was written in that language.
- **Brand:** "daili" lowercase in running text, as in English. "Minzi" stays
  Minzi. Store names stay (App Store, Google Play). iOS/Android menu names use
  the phone's official words in that language (e.g. German iPhone
  "Einstellungen").
- 🔴 **Never write "family planner"** in `el`, `uk` or `bg` (it means
  contraception there). Say family calendar / family organizer instead.
- **Keywords:** 5–12 words people would really search in that language
  (synonyms welcome), lower case where the script has case.
- Dates and numbers inside the text in the local style. Keep `**bold**` and
  the paragraph/step structure exactly.
- If an English article is unclear or wrong, **don't fix it silently**. Put it
  in the report under "English issues" (id + what).

## Verify (each language)
- `npm run build` is green, and the language is in `HELP_LOCALES`.
- `dist/help/<code>.json` has 64 articles, 9 tips and 6 checklist rows.
- Spot check: 5 random articles re-read against the ARB labels. Say which
  ones.
