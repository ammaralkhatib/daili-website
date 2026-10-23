# Help: pt, id, nb and th pages quote the app's new words

## Goal
App `199fd6b9` (app report `../familyplanner-app/claude-reports/2026-10-23/003-l10n-register-fixes.md`)
changed 129 strings: pt European → Brazilian (`compartilhar`, `você`,
"Absorventes"…), id `kamu/-mu` → `Anda`, nb `AI` → `KI`, th `อวตาร` → `อวาตาร์`.
The help articles type the app's labels as plain text, so some pages in these
four languages now quote OLD labels. The runner has already re-made the
pictures for these four locales (ids below) — commit them here.

## Scope
- In: `help/pt/**`, `help/id/**`, `help/nb/**`, `help/th/**` (text only),
  the re-made pictures `static/help/media/{pt,id,nb,th}/**` + `help/media*.json`
  changes the picture run wrote.
- Out: other languages, English, legal, home page, `LIVE_APP_VERSION`.
  🔴 `static/assets/img/photos/` is not yours — leave it untracked.

## Requirements
1. For each of the four languages: take every key changed in `199fd6b9`
   (`git -C ../familyplanner-app show 199fd6b9 -- lib/l10n/app_<arb>.arb`; nb
   ARB = `nb`, pt = `pt`, id = `id`, th = `th`). Where a help page quotes the
   OLD value of a changed key (bold label, alt text, keyword, tip), replace it
   with the NEW value. The app report's "Help impact" lists the pages found so
   far (pt `budget/split.md`, `cycle/supplies.md`; id `cycle/supplies.md`,
   `account/avatar-ai.md`, one more `kamu`; nb `anywhere/ai-apps.md`,
   `account/avatar-ai.md`, `account/profile.md`; th `account/avatar-ai.md`,
   `account/profile.md`) — check the whole language folder, not only these.
2. The text around a label must still read well (pt: Brazilian, `você`; id:
   `Anda`; nb: `KI`). Don't rewrite anything else.
3. th: in `keywords`, keep both spellings (people search both).
4. Changed pages get `updated:` = today; do not touch `translatedFrom`.

## Build
`npm run build` must pass. Recount and report: `help/pt` European `partilh`
(not `compartilh`) = 0; `help/id` pronoun `kamu`/`-mu` = 0 (`tamu`, `temu` are
words); `help/nb` user-visible `AI` = 0 (product names excluded); `help/th`
labels use `อวาตาร์`.

## Commit & push
`docs(help): pt, id, nb, th quote the app's new words`; body
`Prompt: claude-prompts/2026-10-23/003-help-l10n-labels.md`. **Push now. Do NOT
run `./deploy.sh`.**

## Report
`claude-reports/2026-10-23/003-help-l10n-labels.md`, a few lines: pages changed
per language, recounts, pictures committed, build, SHA. `## Help impact`: none
(this is a help fix).
