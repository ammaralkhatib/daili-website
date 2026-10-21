# 002 — Weekly marketing report, automated on the Mac

**Status:** done. Commit `a1c614d`, pushed. No deploy.

**Files:**
- `marketing/weekly.sh`
- `marketing/gsc-pull.mjs` (zero dependencies; signs an RS256 JWT with `node:crypto`)
- `marketing/app.daili.marketing-weekly.plist`
- `marketing/README.md`
- `.gitignore` (`marketing/*.json`, `*.key`)
- installed copy: `~/Library/LaunchAgents/app.daili.marketing-weekly.plist`

`npm run build` does not pick up `marketing/`. `build.mjs` copies only `static/` into `dist/` and reads only `content/` and `templates/`.

**Where node and claude live** (written into `weekly.sh` as `NODE_DIR` and `CLAUDE_DIR`):
- node: `~/Library/Application Support/Herd/config/nvm/versions/node/v24.15.0/bin/node`. The path includes the version number, so update it after a Herd Node upgrade (the README says so).
- claude: `~/.local/bin/claude`.

**The `claude -p` command** (flag spelling checked with `claude --help`):
```
claude -p "$(/bin/cat claude-prompts/MARKETING-WEEKLY.md)" \
  --allowedTools "Read,Write,Glob,Grep,Bash(date:*),mcp__astro__list_apps,mcp__astro__get_app_keywords,mcp__astro__get_keyword_performance,mcp__astro__get_keyword_suggestions,mcp__astro__search_app_store,mcp__astro__get_app_ratings" \
  --permission-mode dontAsk \
  --add-dir "$HOME/Claude/Projects/Family Planner/marketing"
```
Two flags were added beyond the prompt:
- `--permission-mode dontAsk` denies any tool that isn't listed. Without it, "no other tools" would depend on a prompt that nobody is there to answer.
- `--add-dir` lets `Write` reach the report folder, which is outside the repo.

**Tests:**
- `--dry`: Astro was already up. There is **no Search Console key** (`~/.config/daili/` does not exist), so `gsc/2026-10-21/ERROR.txt` was written with "no key file at …" and the script went on, as designed. Because no key exists yet, the JWT/token code has not run against Google.
- Real run: took 47 s and `claude` exited 0. The report is at `~/Claude/Projects/Family Planner/marketing/weekly/2026-10-21.md`, **3505 bytes**. Section 2 holds live Astro data for all 8 stores. Section 1 says there was no Search Console data. The notification fired.
- `launchctl print gui/$(id -u)/app.daili.marketing-weekly` shows the job is loaded and not running, with calendar trigger `Weekday 1, Hour 7, Minute 47` and the log as stdout and stderr.

**Notes:**
- `claude-prompts/MARKETING-WEEKLY.md` is still untracked. I didn't edit or commit it because it's Planning Claude's file. The job reads it from disk.
- To turn on the Search Console half, put the service-account key at `~/.config/daili/gsc-service-account.json` and add the account's email as a user on `sc-domain:daili.app`.

## Help impact
None.
