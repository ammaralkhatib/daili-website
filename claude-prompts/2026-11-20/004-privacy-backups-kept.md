# Privacy policy: say how long server backups are kept

List item #104. Standard lane, legal text only. Ammar confirmed on 2026-11-20: the Daili server is
still at Host Europe; backups are kept on the server AND in Hetzner storage. Planning Claude checked
the files the same day (read-only).

## Goal

The privacy policy promises that a deleted account is gone after the 30-day grace period, but it
says nothing about backups. Add the truth in plain words: server backups are kept for about 4 weeks
(4 weekly full backups + the daily changes), on the server and in Hetzner storage in Germany; so a
deleted account's data can stay in a backup for up to about 4 more weeks after the 30 days, and is
then gone for good. Backups are never used to restore single accounts or for anything else than
bringing the service back after a failure.

## Scope

- In: every privacy body in `legal/` — `privacy.<loc>.html` (all languages there) and
  `datenschutz.de.html` (German, authoritative). Section 8 "How long we keep data" (en :139-140; de
  "8. Speicherdauer" :139), section 7 "Where your data lives" (en :137, the Hetzner sentence), and the
  processors list (en :94, where Hetzner Online GmbH is named for Daili cloud note files).
  The `<p class="updated">` date in each file you change.
- Out: terms pages, impressum, the app, the help center, any other section.

## Requirements

1. **Section 8:** add one short paragraph after the 30-day sentence (English, the binding text):
   "We keep backups of the server for about 4 weeks (weekly full backups plus the daily changes),
   on the server and in Hetzner storage in Germany. So after your account is deleted, its data can
   stay in a backup for up to about 4 more weeks; then it is gone for good. We use backups only to
   bring Daili back after a failure, never to restore or look at single accounts."
   Keep the style of the page (short sentences, `<strong>` only where the page already uses it).
2. **Section 7 + processors list:** Hetzner Online GmbH today is named only for note files. Extend
   it to "note files in Daili cloud and encrypted server backups" (say "encrypted" ONLY if the
   backup bucket really is encrypted — check `/Users/ammarkhatib/Herd/familyplanner-api/claude-prompts/SERVER-CHECK-PLAN.md`
   and `DEPLOY.md` in the api repo; if it is not clearly stated there, leave the word out and say
   so in the report). Host Europe stays the server host.
3. **German (`datenschutz.de.html`):** the same meaning in the page's own German, in exactly the
   same form of address the rest of that page uses (do not switch it).
4. **Every other language:** the same meaning, in that page's own language and register. Sub-agents
   for the translations are allowed; each MUST use model claude-opus-5-5, and wait for all of them
   before you commit. Do not change anything else in those files.
5. **Date:** set `<p class="updated"><time datetime="…">` to the day of this run in EVERY privacy
   body (they must all carry the same date — `tools/check-legal.mjs` checks it), with the visible
   date text in each page's format.
6. `tools/check-legal.mjs` must pass (same `<h2>` count in every body, binding-language note, one date).

## Constraints

- Legal text: change only what the Requirements say. No new section, no new `<h2>`.
- Run the repo's build and checks (`npm run build` or the command in this repo's CLAUDE.md / package.json,
  including `tools/check-legal.mjs`) in the FOREGROUND; self-correct up to 2 tries.
- 🔴 Report trap: never put the word "status" and the word "blocked" on one line unless you really
  are blocked.

## Verify

- The build + `node tools/check-legal.mjs` clean.
- `git diff --stat` shows only `legal/privacy.*.html` and `legal/datenschutz.de.html`.

## Commit & push

- `docs(legal): privacy policy says how long server backups are kept`
  Body: `Prompt: claude-prompts/2026-11-20/004-privacy-backups-kept.md`
- **Push now.** (Pushing does NOT deploy the website; Ammar runs `./deploy.sh` later.)

## Report

- `claude-reports/2026-11-20/004-privacy-backups-kept.md`: the new English paragraph in full, the
  German one in full, the number of language files changed, whether "encrypted" was used and why,
  check-legal result, SHA, pushed or not.
- Owner step: deploy the website (`./deploy.sh`) when it suits; the app shows the policy from the website.
- `## Help impact`: `none`.
