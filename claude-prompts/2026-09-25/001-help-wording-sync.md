# Help texts follow the app's wording fixes + 2 English fixes

> Runs **after** app prompt `familyplanner-app/claude-prompts/2026-09-25/001-l10n-wording-fixes.md`.

## Goal
The app fixed several translated words (report and table:
`../familyplanner-app/claude-reports/2026-09-25/001-l10n-wording-fixes.md` +
`001-label-changes.json`) and re-shot the Help pictures that show them
(untracked files in `static/help/media/<code>/`). Now:
1. every help text that quotes a changed label uses the new word;
2. the re-shot pictures are committed;
3. the 2 English issues the translators found are fixed, in all 25
   languages.

"Done" = no help text quotes an old label from the table; the new pictures
are committed; the 2 English articles are fixed and their 24 translations
follow; `npm run build` green; no "older than English" warning for these
articles.

## Requirements
1. **Labels:** for each row of the table (map ARB `zh` → `zh-Hans`,
   `zh_Hant` → `zh-Hant`), find the old word in `help/<code>/**` (titles,
   summaries, keywords, body, alt texts, tip texts, `_ui.json`) and replace it
   with the new one. Also adjust grammar around it if needed. **Keep old words
   as keywords** if people may still search them (e.g. "tagebuch"), because
   the store app shows the old word until the next build.
2. **Register:** where the app moved a language to one address form (pt
   você, fr tu, sk/tr/uk/id informal), check that the help texts in that
   language use the same form everywhere. They should already, but fix any
   leftovers.
3. **English fix 1, `lists-categories`:** the note talks about deleting a
   category, but no step says how. Find the real way to delete a category in
   the app (`../familyplanner-app/lib/`, the categories screen) and add it as a
   step or in the note, whichever fits the word limit. Bump `updated`.
4. **English fix 2, `anywhere-wall`:** say briefly that the wall screen (the
   web board) is in English and German for now. Bump `updated`.
5. Translate both changes into all 24 languages (rules:
   `claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md`), and set their
   `translatedFrom` to the new English `updated`.
6. **Pictures:** commit the re-shot files + `help/media.<code>.json` changes.
   Open 3 of them to check they show the new word.

## Constraints
- `npm run build` green (all guards). Self-correct up to 2 tries.
- File-write tool, never heredocs. Leave unrelated uncommitted files alone.

## Commit & push
- This prompt, if untracked: `docs(plan): add help wording sync prompt`.
- `chore(help): re-shot pictures after the app wording fixes`.
- `fix(help): texts follow the app's wording fixes; lists-categories and anywhere-wall clarified in all languages`.
  Body: `Prompt: claude-prompts/2026-09-25/001-help-wording-sync.md`.
- **Push now.**

## Report
`claude-reports/2026-09-25/001-help-wording-sync.md`, half a page:
- count of replaced labels per locale;
- the delete-a-category answer;
- the two English texts;
- SHAs.
- Open item for Ammar: `./deploy.sh`.
