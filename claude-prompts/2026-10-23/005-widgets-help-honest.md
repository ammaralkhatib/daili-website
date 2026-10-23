# Help: widgets article — drop the "update by themselves" promise

## Goal
Website `ec96460` (help sync 1.12.0) changed `anywhere-widgets` to say
"Widgets update by themselves when your family changes something (on iPhone,
not after you swiped daili away; then open daili once)." Ammar's device test on
2026-10-23 showed this is NOT true yet: on iPhone and Android the widget did
not update without opening the app. The help must not promise it.

## Requirements
In `help/en/anywhere/widgets.md` and the same article in every other
`HELP_LOCALES` language:
1. Replace that sentence with: `The calendar widget shows your next days.`
   (keep that half; drop the "update by themselves" half completely).
2. Bring back the old note's second sentence: the note becomes
   `> Note: Widgets show your active family or group. If one looks out of date, open daili for a moment.`
   Each language: use that language's OLD wording of this sentence from git
   (`git show ec96460^:help/<code>/anywhere/widgets.md`) — don't re-translate.
3. Nothing else in the article changes. Keep `updated: 2026-10-23`.

## Build
`npm run build` must pass. `grep -rln` for the dropped sentence per language
(check en/de by eye, the rest by the git diff) → 0 left.

## Commit & push
`docs(help): widgets article no longer promises background updates`; body
`Prompt: claude-prompts/2026-10-23/005-widgets-help-honest.md`. **Push now.
Do NOT run `./deploy.sh`.** Leave `static/assets/img/photos/` untracked.

## Report
`claude-reports/2026-10-23/005-widgets-help-honest.md`, 5 lines: languages
changed, build, SHA. `## Help impact`: `anywhere-widgets` — no background-update
promise.
