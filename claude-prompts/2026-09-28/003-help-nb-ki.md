# Help: Norwegian says "KI", and commit the refreshed calendar-photo picture

## Goal
Two small leftovers from the 1.7.0 help sync (report `2026-09-28/002`):
(1) the Norwegian help mixes "AI" and "KI" — the app says "KI", so the help
must too; (2) `static/help/media/en/calendar-photo.webp` was re-shot on
2026-09-28 (only the date on screen changed) and never committed.

## Scope
- In: `help/nb/**` articles that contain the word "AI" (today:
  `calendar/photo.md`, `meals/photo.md`, `meals/suggest.md`; check all of
  `help/nb`), `static/help/media/en/calendar-photo.webp`.
- Out: every other language and file. Leave the untracked blog/photo images
  alone (Ammar's own work).

## Requirements
1. In `help/nb`, replace "AI" (as a word) with "KI" wherever it means
   artificial intelligence; keep product names ("Google Gemini") as they are.
   Set `updated:`/`translatedFrom:` only if the site's rules require it for a
   wording-only change (follow `claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md`).
2. Commit the re-shot `calendar-photo.webp` (en) in the same commit.

## Constraints
- `npm run build` green, `node tools/check-help.mjs` green.

## Commit & push
- `docs(help): Norwegian uses KI; refreshed calendar-photo picture`; body
  includes `Prompt: claude-prompts/2026-09-28/003-help-nb-ki.md`. Push (Ammar
  deploys).

## Report
- `claude-reports/2026-09-28/003-help-nb-ki.md`, a few lines: files changed,
  build output, SHA + push.
