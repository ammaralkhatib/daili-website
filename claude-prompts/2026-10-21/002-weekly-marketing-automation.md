# Weekly marketing report — automation on the Mac

## Goal
Every Monday morning the Mac makes one report from Search Console + Astro,
without Ammar doing anything, and saves it to
`~/Claude/Projects/Family Planner/marketing/weekly/<date>.md`. Planning
Claude reads it in the next session and writes the action prompts. The job
**never publishes, deploys, commits or changes store text.**
The report's content is defined in `claude-prompts/MARKETING-WEEKLY.md`
(Planning Claude's file — read it, do not edit it).

## Scope
- In: new folder `marketing/` in this repo (`weekly.sh`, `gsc-pull.mjs`,
  `app.daili.marketing-weekly.plist`, `README.md`), the installed copy of the
  plist in `~/Library/LaunchAgents/`, one test run.
- Out: the website build, `site.config.mjs`, `dist/`, every other repo.
  `marketing/` must NOT be picked up by `npm run build` (check that it is not).

## Requirements
1. **`marketing/gsc-pull.mjs`** — Node, **zero npm dependencies** (this
   repo's rule): sign a service-account JWT with `node:crypto` (RS256),
   exchange it at `https://oauth2.googleapis.com/token` (scope
   `https://www.googleapis.com/auth/webmasters.readonly`), then call
   `searchanalytics.query` for site `sc-domain:daili.app`, last 28 days
   ending 3 days ago (Search Console data lags), `rowLimit` 1000, twice:
   dimensions `[query, page]` → `queries.json`, `[page]` → `pages.json`.
   Key file: `~/.config/daili/gsc-service-account.json`. Output folder:
   `~/Claude/Projects/Family Planner/marketing/gsc/<YYYY-MM-DD>/`.
   No key file, or any HTTP error → write `ERROR.txt` there with the reason,
   exit 0 (the Astro half still runs). Never print or log the key.
2. **`marketing/weekly.sh`** (bash, `set -uo pipefail`):
   - Set `PATH` explicitly (launchd has almost none): include the folders
     where `node` and `claude` actually live on this Mac — find them now with
     `command -v` and write the absolute paths into the script.
   - Use `/bin/cat`, `/usr/bin/grep` explicitly (interactive aliases don't
     apply in scripts, but be explicit anyway).
   - Make sure Astro runs: if nothing listens on `127.0.0.1:8089`
     (`/usr/bin/nc -z`), `open -ga Astro` and wait up to 90 s. Still down →
     go on; the report will say Astro was unreachable.
   - Run `node marketing/gsc-pull.mjs`.
   - Run Claude Code headless: `claude -p "$(/bin/cat claude-prompts/MARKETING-WEEKLY.md)"`
     with `--allowedTools` limited to: `Read`, `Write`, `Glob`, `Grep`,
     `Bash(date:*)`, and the six read-only Astro tools named in
     MARKETING-WEEKLY.md (`mcp__astro__…`). No other tools. Find the exact
     flag spelling with `claude --help`; do not guess.
   - Log everything to `~/Library/Logs/daili-marketing-weekly.log`
     (append, with a timestamp line per run).
   - At the end show a macOS notification (`osascript -e 'display
     notification …'`): "Daili weekly report ready" or "… failed — see log".
   - `weekly.sh --dry` = run everything except the `claude -p` step.
3. **launchd** — `marketing/app.daili.marketing-weekly.plist`, label
   `app.daili.marketing-weekly`, `StartCalendarInterval` **Monday 07:47**
   (local time), `RunAtLoad` false, stdout/stderr to the log. Install a copy
   to `~/Library/LaunchAgents/` and load it with
   `launchctl bootstrap gui/$(id -u) <plist>` (if already loaded,
   `bootout` first). A Mac that is asleep at 07:47 runs it at the next wake —
   say so in the README.
4. **`marketing/README.md`** — short, plain English: what runs when, where
   the report lands, how to run it now (`./marketing/weekly.sh`), how to stop
   it (`launchctl bootout gui/$(id -u)/app.daili.marketing-weekly`), where the
   key lives and that it must never be committed. Add
   `marketing/*.json` and `*.key` to `.gitignore` as a guard.

## Test
1. `./marketing/weekly.sh --dry` → `gsc/<date>/` has either the two JSON
   files or `ERROR.txt` (the key may not exist yet — that is fine, say which).
2. `./marketing/weekly.sh` once for real (Astro open) → the report file
   exists and is non-empty (`wc -c`). Do not paste it into the report; give
   its path and size.
3. `launchctl print gui/$(id -u)/app.daili.marketing-weekly` shows the job
   with the Monday 07:47 trigger.

## Commit & push
`feat(marketing): weekly Search Console + Astro report on the Mac`; body
`Prompt: claude-prompts/2026-10-21/002-weekly-marketing-automation.md`.
Push. **Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-10-21/002-weekly-marketing-automation.md`, half a page:
files, the exact `claude -p` command line, where node/claude were found,
test results (dry + real), whether the Search Console key existed, launchd
status, SHA + push. `## Help impact`: none.
