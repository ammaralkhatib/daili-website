# Weekly marketing report

Every **Monday at 07:47** (local time) the Mac writes one report from Google Search Console and Astro to:

```
~/Claude/Projects/Family Planner/marketing/weekly/<YYYY-MM-DD>.md
```

Planning Claude reads it in the next session. The job never publishes, deploys, commits or changes store text. What goes into the report is defined in `claude-prompts/MARKETING-WEEKLY.md`.

If the Mac is asleep at 07:47, launchd runs the job at the next wake. If the Mac is shut down at that time, that week is skipped.

## What runs

1. `weekly.sh` opens Astro if it is not running and waits up to 90 s for its MCP server on `127.0.0.1:8089`.
2. `gsc-pull.mjs` pulls 28 days of Search Console data, ending 3 days ago, into `~/Claude/Projects/Family Planner/marketing/gsc/<date>/` (`queries.json`, `pages.json`). If something goes wrong, it writes `ERROR.txt` there instead.
3. `claude -p` runs headless with read-only tools and writes the report.
4. A macOS notification says "ready" or "failed — see log".

Log: `~/Library/Logs/daili-marketing-weekly.log`.

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
