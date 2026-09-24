# Help translation: Japanese, Korean, Chinese (Simplified) (ja, ko, zh-Hans)

## Goal
Translate the whole Help center into **Japanese, Korean, Chinese (Simplified)**: every article, every tip,
the checklist titles, the UI strings and the topic names. Then add
`ja`, `ko`, `zh-Hans` to `HELP_LOCALES`.

**Read `claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md` first, and follow
it exactly.** The engine is prompt `008` (read its report for the file layout
and the length caps).

"Done" = for each of the 3 languages, the files under `help/<code>/` exist,
the code is in `HELP_LOCALES`, and `npm run build` is green (64 articles each,
parity OK).

## Scope
- **In:** `help/ja/**`, `help/ko/**`, `help/zh-Hans/**`, and
  `site.config.mjs` (`HELP_LOCALES` only).
- **Read:** `help/en/**`, and `../familyplanner-app/lib/l10n/app_*.arb` for the
  labels.
- **Out:** English files, the engine, everything else.

## Notes for these languages
- Do one language completely (translate → build green → add to
  `HELP_LOCALES`) before starting the next. If the run gets too long, it's
  better to finish 2 languages well and report the third as not started than
  to leave 3 half done.
- Scripts without spaces: check the character caps from `008`'s report. Search keywords must be words people type (for Japanese, include kana/kanji forms people use).

## Constraints
- File-write tool, never heredocs; check `wc -c` on a few files.
- `npm run build` green after each language. Self-correct up to 2 tries per
  language.
- Leave unrelated uncommitted files alone.

## Commit & push
- **One commit per language:**
  `feat(help): help center in <Language> (<code>)`. Body: `Prompt:
  claude-prompts/2026-09-24/015-help-translate-ja-ko-zh-hans.md`.
- **Push now.** No deploy (Ammar deploys after all languages).

## Report
`claude-reports/2026-09-24/015-help-translate-ja-ko-zh-hans.md`, half a page:
- per language: done / not done, the 5 spot-checked articles, labels the ARB
  didn't have (and what you wrote instead), and "English issues";
- SHAs.
- `Help impact: none`.
