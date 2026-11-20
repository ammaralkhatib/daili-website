# Weekly marketing report

Every **Monday at 07:00** (local time) the Mac writes one report from Google Search Console and Astro to:

```
~/Claude/Projects/Family Planner/marketing/weekly/<YYYY-MM-DD>.md
```

Planning Claude reads it in the next session. The job never publishes, deploys, commits or changes store text. What goes into the report is defined in `claude-prompts/MARKETING-WEEKLY.md`.

If the Mac is asleep at 07:00, launchd runs the job at the next wake. If the Mac is shut down at that time, that week is skipped.

## What runs

1. `weekly.sh` opens Astro if it is not running and waits up to 90 s for its MCP server on `127.0.0.1:8089`.
2. `gsc-pull.mjs` pulls 28 days of Search Console data, ending 3 days ago, into `~/Claude/Projects/Family Planner/marketing/gsc/<date>/` (`queries.json`, `pages.json`). If something goes wrong, it writes `ERROR.txt` there instead.
3. It loads the long-lived claude sign-in key from the Keychain (`claude-code-oauth`, the same key the run scripts use). No key → no claude step, the run fails.
4. `claude -p` runs headless with read-only tools and writes the report. If claude fails or the report is missing, it waits 10 minutes and tries again — up to 3 tries.
5. A macOS notification says "ready" or "failed — see log".
6. Every run (ok, failed or dry) writes one short run note to `~/Claude/Projects/Family Planner/marketing/weekly/runs/<date>.txt`: result, reason, tries, Astro, Search Console, report path.

Log: `~/Library/Logs/daili-marketing-weekly.log`. The sign-in key never goes into the log.

The first time launchd runs it, macOS may ask "allow `security` to use this item?". If a run note says "no sign-in key", run `./marketing/weekly.sh` once by hand and click "Always allow".

## Run it now

```
./marketing/weekly.sh          # full run
./marketing/weekly.sh --dry    # everything except the claude step
```

## Stop it

```
launchctl bootout gui/$(id -u)/app.daili.marketing-weekly
```

To turn it back on, copy `app.daili.marketing-weekly.plist` to `~/Library/LaunchAgents/` and run `launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/app.daili.marketing-weekly.plist`.

## The Search Console key

The script reads a Google service-account key from `~/.config/daili/gsc-service-account.json`. That service account needs read access to the `sc-domain:daili.app` property: add its email address as a user in Search Console.

**Never commit the key** and never copy it into this repo. `.gitignore` blocks `marketing/*.json` and `*.key` as a guard.

## If node or claude moves

`weekly.sh` names their folders explicitly, because launchd starts with almost no `PATH`. After a Node upgrade through Herd, update `NODE_DIR`. Find the new folders with `command -v node` and `command -v claude`.
