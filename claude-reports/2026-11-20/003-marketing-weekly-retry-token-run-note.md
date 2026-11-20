# 003 — Monday marketing job: try again, long sign-in key, one run note per run

**Result:** done · **Commit:** see the last line of this report (one commit: the 3 files below + this report) — pushed to origin/main. `./deploy.sh` was NOT run. `launchctl` was NOT run, the real claude step was NOT started, the real token was never read or printed.
**Step 0:** nothing to commit — this prompt was already in `49d3c39e`, `main` was equal to `origin/main`, no commits were held. `static/assets/img/photos/` stayed untouched and unstaged, as in earlier runs.

## What changed

`marketing/weekly.sh`, in plain words:

1. **Long sign-in key.** Before the claude step (not in `--dry`) it loads `CLAUDE_CODE_OAUTH_TOKEN` from the Keychain with `/usr/bin/security find-generic-password -s claude-code-oauth -w`, like the run scripts, and exports it. Empty → no claude step, notification "failed — no sign-in key", run note `result: failed` / `reason: no sign-in key in the Keychain (claude-code-oauth)`, exit 1. The value is never echoed; no `set -x`, no `env` dump.
2. **Try again.** The `claude -p` call runs in a loop of up to 3 tries. A try fails when claude exits non-zero OR the report file is missing/empty. One log line per try (`try 2 of 3: claude exited 1`), then `sleep 600` before the next one. Success stops the loop.
3. **Run note.** A `finish()` function on `trap … EXIT` writes `<OUT_ROOT>/weekly/runs/<date>.txt` on every exit (ok, failed, dry, early stop) with date, result, reason, tries, astro, search console (`ok` / `ERROR.txt (<first line>)` / `missing`, read from today's `gsc/<date>/` folder), report.
4. **Test-only switches** (the job never sets them): `WEEKLY_OUT_ROOT`, `WEEKLY_CLAUDE_CMD` (default `claude`), `WEEKLY_RETRY_SLEEP` (default 600), `WEEKLY_SKIP_KEYCHAIN=1`. They are listed in the script header.
5. Everything else stays as before: the PATH line, the Astro wait, the Search Console pull, `--dry`, the notifications, the allowed tools, `--permission-mode dontAsk`, `--add-dir`, the log file, and the exit code of a normal run (only the no-key case exits 1).

`claude-prompts/MARKETING-WEEKLY.md` — "Last week's report" now says: the newest older `<date>.md` file directly in `marketing/weekly/` (not the `runs/` folder).

`marketing/README.md` — "What runs" now lists the sign-in key, the 3 tries, and the run note, plus one line about the Keychain "Always allow" question.

No CHANGELOG line (internal).

## Verification

- `bash -n marketing/weekly.sh` → no error.
- `./marketing/weekly.sh --dry` → exit 0. Log:
  ```
  === 2026-11-20 11:29:45 CET weekly.sh start (dry=1) ===
  astro: not listening, opening Astro
  astro: still down after 90 s, the report will say so
  gsc: 2026-10-21..2026-11-17 → …/marketing/gsc/2026-11-20 (982 query rows, 1000 page rows)
  dry run: skipping claude -p
  === 2026-11-20 11:31:19 CET weekly.sh done (dry) ===
  run note: …/marketing/weekly/runs/2026-11-20.txt (result: dry)
  ```
  Note: `date: 2026-11-20` · `result: dry` · `reason: dry run` · `tries: 0` · `astro: down` · `search console: ok` · `report: none`.
  (Astro did not answer on port 8089 within 90 s today. The script handled that as before; the run note shows it.)
- Retry test, temp `WEEKLY_OUT_ROOT`, `WEEKLY_CLAUDE_CMD=/usr/bin/false WEEKLY_RETRY_SLEEP=1 WEEKLY_SKIP_KEYCHAIN=1`:
  ```
  try 1 of 3: claude exited 1
  waiting 1 s before the next try
  try 2 of 3: claude exited 1
  waiting 1 s before the next try
  try 3 of 3: claude exited 1
  report: missing or claude failed
  run note: /tmp/weekly-test.AllF4z/weekly/runs/2026-11-20.txt (result: failed)
  ```
  Note: `result: failed` · `reason: claude exited 1 after 3 tries` · `tries: 3` · `astro: down` · `search console: ok` · `report: none`.
- Success test, same temp folder, `WEEKLY_CLAUDE_CMD` = a tiny temp script that writes a 21-byte report and exits 0:
  ```
  try 1 of 3: ok
  report: /tmp/weekly-test.AllF4z/weekly/2026-11-20.md (21 bytes)
  run note: /tmp/weekly-test.AllF4z/weekly/runs/2026-11-20.txt (result: ok)
  ```
  Note: `result: ok` · `reason: report written` · `tries: 1` · `report: /tmp/weekly-test.AllF4z/weekly/2026-11-20.md`.
- Log grep for `CLAUDE_CODE_OAUTH_TOKEN=` or `sk-ant` → 0 hits.
- The no-key path was not run as a test: it would need the real Keychain read, and the prompt says not to read the token. It is a short `if [ -z … ]` block; `bash -n` passes.
- `npm run build` → exit 0 (`build OK · 3759 pages · 3728 in hreflang clusters`, `detector OK · 32 cases`, `help search OK · 26 cases`). `npm test` → exit 0 (detector 32, test-check-help 99, help search 26, test-blog-i18n 48). The build changed no tracked files.

## Cleaned up

- `Family Planner/marketing/weekly/runs/2026-11-20.txt` (from the dry run) and the then-empty `runs/` folder (the dry run made it; the job makes it again on Monday).
- `Family Planner/marketing/gsc/2026-11-20/` (`queries.json`, `pages.json`) — made by the three test runs; it did not exist before.
- Temp folders `/tmp/weekly-test.AllF4z` and `/tmp/weekly-fake.GmJ4AG`.
- Left as is: the new lines in `~/Library/Logs/daili-marketing-weekly.log` (the three test runs; the prompt asks for the log to show the run).

## Open items for Ammar

1. The first real check is **Monday 2026-11-23 07:00** — the Mac must be on and awake.
2. Started by launchd, the Keychain may ask once "allow `security` to use this item?". If Monday's run note says "no sign-in key", run `./marketing/weekly.sh` once by hand in a terminal and click "Always allow".
3. The gsc pull today hit exactly 1000 page rows — that is the row limit of list item #109, not this prompt.

## Help impact

none
