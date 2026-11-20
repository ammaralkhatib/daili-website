# Monday marketing job: try again, long sign-in key, one run note per run

List item #106. Standard lane. Ammar decided this on 2026-11-17 (weekly report plan, decision 6:
"Repair it, Tuesday page tells me"): try again when there is no internet, use the long sign-in key
like the run scripts, write down each run. No mail alarm, no healthchecks.io check.
**It must be in place before Monday 2026-11-23 07:00** — the Mac's own claude sign-in ends between
2026-11-23 and 2026-11-26.

## Goal

The Monday 07:00 job (`marketing/weekly.sh`, started by launchd
`app.daili.marketing-weekly.plist`) no longer fails silently:

1. When the claude step fails (for example the Mac had no internet for a moment — that is what
   happened on 2026-11-16: `ENOTFOUND`, `claude exited 1`), it tries again.
2. It signs in with the long-lived key from the Keychain, so the end of the Mac's normal claude
   sign-in cannot stop it.
3. Every run leaves one short run note, so the planned Tuesday weekly page (and the SEO skill) can
   see "Monday's report is missing, and why".

## Scope

- In: `marketing/weekly.sh`, `claude-prompts/MARKETING-WEEKLY.md` (one line, see 4),
  `marketing/README.md` (a few lines, if it describes the job's steps).
- Out: `marketing/gsc-pull.mjs` (its 1,000-row limit is list item #109, NOT this prompt), the plist
  (schedule and path stay), the allowed tools list (stays read-only), every other website file.
- Do NOT run `launchctl` and do NOT start the real claude step. Planning Claude / Ammar check the
  real run on Monday.

## Requirements

1. **Long sign-in key.** Before the claude step (skip it in `--dry`), load the token exactly like
   the run scripts do (see `~/Claude/Projects/Family Planner/run-prompts-2026-11-20-backup-key.sh`
   lines 10–14):
   `CLAUDE_CODE_OAUTH_TOKEN="$(/usr/bin/security find-generic-password -s claude-code-oauth -w 2>/dev/null)"`
   then `export CLAUDE_CODE_OAUTH_TOKEN`. Empty → no claude step; the run note says
   `failed · no sign-in key in the Keychain (claude-code-oauth)`; notify; exit 1.
   🔴 The token must never reach the log: all output goes to the log (`exec >>"$LOG"`), so no
   `set -x`, no `echo` of the variable, no `env` dump. Do NOT read or print the real token while you
   work on this prompt either.
2. **Try again.** Wrap the `claude -p` call in up to 3 tries. A try counts as failed when claude
   exits non-zero OR the report file is missing/empty afterwards. Between tries wait 10 minutes
   (`sleep 600`). Make the wait and the command testable without the real claude:
   `WEEKLY_RETRY_SLEEP` (seconds, default 600) and `WEEKLY_CLAUDE_CMD` (default `claude`). Log one
   line per try (`try 2 of 3: claude exited 1`). Success on any try → stop trying.
   Before a retry, check the internet is back is NOT needed — just wait and try.
3. **Run note.** At the end of EVERY run (ok, failed, dry), write one small text file
   `"$OUT_ROOT/weekly/runs/$DATE.txt"` (create the `runs/` folder). Content, one item per line:
   ```
   date: 2026-11-23
   result: ok | failed | dry
   reason: <short: "report written" / "claude exited 1 after 3 tries" / "no sign-in key in the Keychain" / "dry run">
   tries: <n>
   astro: up | down
   search console: ok | ERROR.txt (<first line of it>) | missing
   report: <path or "none">
   ```
   Use `/bin/date`, full paths for tools (launchd has a tiny PATH — see the top of the script).
   Write the note even when the script ends early (a small `finish()` function or a `trap … EXIT`).
4. **The report prompt must not take a run note for last week's report.** The notes live in the
   `runs/` sub-folder, so they are not `.md` files in `weekly/`. Still, change the line in
   `claude-prompts/MARKETING-WEEKLY.md` ("Last week's report — the newest older file in
   `marketing/weekly/`") to say "the newest older `<date>.md` file directly in `marketing/weekly/`
   (not the `runs/` folder)".
5. Keep everything else as it is: the Astro wait, the Search Console pull, `--dry`, the
   notifications, the allowed tools and `--permission-mode dontAsk`, the log file.

## Constraints

- Bash 3.2 (macOS `/bin/bash`): no `mapfile`, no `${var,,}`, no associative arrays.
- `set -uo pipefail` stays (no `-e`).
- No CHANGELOG line (internal, not something an app user sees).
- 🔴 Report trap: the run script stops when any line of the report has the word "status" and then
  the word "blocked" on the same line. Use the word "blocked" ONLY if you really are blocked.

## Verify

- `bash -n marketing/weekly.sh` → no error.
- `./marketing/weekly.sh --dry` → the log shows the run; `runs/<today>.txt` says `result: dry`.
  (The dry run opens Astro and pulls Search Console as today — that is fine.) Afterwards, delete
  ONLY the files this test made under `Family Planner/marketing/weekly/runs/` and today's
  `Family Planner/marketing/gsc/<today>/` folder if the test created it, so Monday starts clean —
  say in the report what you removed.
- Retry test without the real claude and without the token: run the script with
  `WEEKLY_CLAUDE_CMD=/usr/bin/false WEEKLY_RETRY_SLEEP=1 WEEKLY_SKIP_KEYCHAIN=1` — add the
  test-only switch `WEEKLY_SKIP_KEYCHAIN=1` (skips step 1; the job itself never sets it).
  Expect 3 tries in the log and a note with `result: failed`, `tries: 3`. Then
  `WEEKLY_CLAUDE_CMD` pointing to a tiny temp script that writes a non-empty report file and exits
  0 → `result: ok`, `tries: 1`. Use a temp `OUT_ROOT` for these tests if you can (an override env
  var is fine), so no real report file is written. Clean up all temp files.
- Run `npm run build` once (nothing in it should change, but the repo must stay green).

## Commit & push

- `fix(marketing): the Monday job tries again, signs in with the long key, writes a run note`
  Body: `Prompt: claude-prompts/2026-11-20/003-marketing-weekly-retry-token-run-note.md`
- **Push now.** (A website push does not deploy. Do NOT run `./deploy.sh`.)

## Report

- `claude-reports/2026-11-20/003-marketing-weekly-retry-token-run-note.md` from the template:
  what changed in the script, in plain words; the test outputs (try lines, the notes); what you
  cleaned up; commit SHA; pushed or not.
- Open items for Ammar (write them plainly):
  1. The first real check is Monday 2026-11-23 07:00 — the Mac must be on and awake.
  2. Started by launchd, the Keychain may ask once "allow `security` to use this item?". If the
     run note on Monday says "no sign-in key", Ammar runs `./marketing/weekly.sh` once by hand and
     clicks "Always allow".
- `## Help impact`: none.
