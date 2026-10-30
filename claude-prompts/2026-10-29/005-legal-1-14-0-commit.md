# Commit the 1.14.0 privacy edits (finish of prompt 003)

## Why
Prompt `2026-10-29/003-legal-1-14-0` finished all its text work but stopped
as `blocked`: `npm run build` was red in the HELP route check (`/lists/archived`
and `/lists/templates` had no article). That was not caused by 003. Prompt
`2026-10-29/004-help-sync-1-14-0` (runs right before this one) writes that
article. 003's edits are still uncommitted on disk:
`legal/privacy.*.html` (27 files), `legal/datenschutz.de.html`,
`tools/check-legal.mjs`. Read `claude-reports/2026-10-29/003-legal-1-14-0.md`.

## Do
1. `git status`: the only uncommitted tracked changes must be those 29 files
   (the untracked `static/assets/img/photos/` is not yours — leave it). If
   anything else is uncommitted, stop and report `blocked`.
2. Do NOT re-translate or rewrite anything. Only one small text change: in
   the `wall-screens` paragraph of every body, the sentence "Unused set-up
   codes are deleted within a day." → "Set-up codes are deleted after about
   a day." (German: „Einrichtungs-Codes werden nach etwa einem Tag
   gelöscht.“; translate the others from the English, same register). Reason:
   the hourly prune deletes every pairing older than 24 h, used or not
   (003 report, "Two small notes").
3. `node tools/check-legal.mjs` → OK, then `npm run build` → must pass fully
   (no `HELP_SKIP_ROUTE_CHECK`). If the build is red for a reason that is not
   in `legal/` or `tools/check-legal.mjs`: stop, report `blocked`, commit
   nothing.
4. Read `dist/privacy.html` and `dist/datenschutz.html` once: the paragraph
   with `id="wall-screens"` is there, the changed sentence reads well.

## Commit & push
`docs(legal): 1.14.0 — language per device, family wall screens`; body
`Prompt: claude-prompts/2026-10-29/003-legal-1-14-0.md` and
`Finished by: claude-prompts/2026-10-29/005-legal-1-14-0-commit.md`. Only the
29 files. **Push now. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-10-29/005-legal-1-14-0-commit.md` (file-write tool,
never a heredoc; `wc -c` non-zero), a few lines: files committed, the
changed sentence, check-legal + build result, SHA + push.
`## Help impact`: none.
