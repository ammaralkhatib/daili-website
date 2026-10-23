# Help (id): quote the two fixed avatar labels

## Goal
App `2026-10-23/004` changed two Indonesian labels:
`Avatar AI-mu` → `Avatar AI Anda` and `Ubah selfie-mu jadi avatar` →
`Ubah selfie Anda jadi avatar`. Replace every quote of the old values in
`help/id/**` (website report 2026-10-23/003 found 2 in `account/avatar-ai.md`)
with the new ones. Set `updated:` = today on changed pages. Nothing else.
Also commit the re-made picture `static/help/media/id/account-avatar-ai.webp`
(the run command made it before this prompt; it now shows "Avatar AI Anda").

## Build
`npm run build` must pass. Recount: `grep -rn 'AI-mu\|selfie-mu' help/id` = 0.

## Commit & push
`docs(help): id avatar labels say Anda`; body
`Prompt: claude-prompts/2026-10-23/004-id-avatar-labels.md`. **Push now. Do NOT
run `./deploy.sh`.** Leave `static/assets/img/photos/` untracked.

## Report
`claude-reports/2026-10-23/004-id-avatar-labels.md`, 5 lines: pages, recount,
build, SHA. `## Help impact`: none.
