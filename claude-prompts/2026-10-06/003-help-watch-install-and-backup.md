# Help: Apple Watch installs by itself (usually), no watch Siri, note-files backup fact

## Goal
1. `help/<code>/anywhere/watch.md` step 1 tells everyone to open the Watch
   app → Available Apps → Install. Apple's default is that a watch app
   installs by itself when the iPhone app is installed ("By default, Apple
   Watch automatically installs the watch-compatible versions of your iPhone
   apps", Apple Watch User Guide). Rewrite step 1 so it says: after you
   install Daili on your iPhone, it usually appears on your watch by itself;
   if it does not, open the **Watch** app on your iPhone → **My Watch** →
   **Apps** (or the list at the bottom) → **Available Apps** → **Install**
   next to Daili. Keep steps 2–3. Bump `updated`.
1b. Same article, the "By voice" paragraph: remove the sentence
   'Or ask Siri: "Add to my Daili list" or "New note in Daili".' (and its
   translation in every locale). Siri on the watch failed Ammar's device test
   on 2026-10-06 and is not announced. Keep the pencil / Add item part.
   Then grep every `help/*/` file for "Siri" and list any other hit in the
   report (do not change Siri lines that are about the iPhone app, only the
   watch phrases).
2. `help/<code>/notes/files.md`: the app report
   `../familyplanner-app/claude-reports/2026-10-06/007-string-fixes-before-cut.md`
   (`## Help impact`) says whether note files are in the phone backup on
   Android / iOS. Make the article match that report exactly (if it says the
   article is correct, change nothing there and say so).

All `HELP_LOCALES` (`claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md`),
app labels from the ARBs, same limits and voice. **Do not deploy.**

## Constraints
- `npm run build` green, `node tools/check-help.mjs` green.
- Untracked files that are not yours: leave them.

## Commit & push
`docs(help): watch installs by itself, no watch Siri; note-files backup fact`; body
`Prompt: claude-prompts/2026-10-06/003-help-watch-install-and-backup.md`.
**Push. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-10-06/003-help-watch-install-and-backup.md`, ≤ 12 lines:
new en step 1, the files.md change (or "no change"), locales, build, SHA.
