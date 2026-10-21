#!/bin/bash
# The Monday marketing report: Search Console + Astro → one Markdown file in
# ~/Claude/Projects/Family Planner/marketing/weekly/<date>.md.
# Run by launchd (app.daili.marketing-weekly.plist), or by hand:
#
#     ./marketing/weekly.sh          # everything
#     ./marketing/weekly.sh --dry    # everything except the claude -p step
#
# Never publishes, deploys, commits or changes store text. The report itself is
# defined in claude-prompts/MARKETING-WEEKLY.md.
set -uo pipefail

# launchd starts with almost no PATH. These are where node (Herd's nvm) and
# claude live on this Mac; update them if either moves.
NODE_DIR="$HOME/Library/Application Support/Herd/config/nvm/versions/node/v24.15.0/bin"
CLAUDE_DIR="$HOME/.local/bin"
export PATH="$NODE_DIR:$CLAUDE_DIR:/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"

REPO="$(cd "$(dirname "$0")/.." && pwd)"
OUT_ROOT="$HOME/Claude/Projects/Family Planner/marketing"
LOG="$HOME/Library/Logs/daili-marketing-weekly.log"
DATE="$(/bin/date +%F)"
REPORT="$OUT_ROOT/weekly/$DATE.md"
DRY=0
[ "${1:-}" = "--dry" ] && DRY=1

/bin/mkdir -p "$OUT_ROOT/weekly" "$(/usr/bin/dirname "$LOG")"
exec >>"$LOG" 2>&1
echo "=== $(/bin/date '+%F %T %Z') weekly.sh start (dry=$DRY) ==="

cd "$REPO" || { echo "cannot cd to $REPO"; exit 1; }

notify() {
  /usr/bin/osascript -e "display notification \"$1\" with title \"Daili marketing\"" || true
}

# Astro serves its MCP endpoint only while the app is open.
if ! /usr/bin/nc -z 127.0.0.1 8089 2>/dev/null; then
  echo "astro: not listening, opening Astro"
  /usr/bin/open -ga Astro || echo "astro: open failed"
  for _ in $(/usr/bin/seq 1 90); do
    /usr/bin/nc -z 127.0.0.1 8089 2>/dev/null && break
    /bin/sleep 1
  done
fi
if /usr/bin/nc -z 127.0.0.1 8089 2>/dev/null; then
  echo "astro: up"
else
  echo "astro: still down after 90 s, the report will say so"
fi

node marketing/gsc-pull.mjs || echo "gsc-pull exited $?"

if [ "$DRY" = 1 ]; then
  echo "dry run: skipping claude -p"
  echo "=== $(/bin/date '+%F %T %Z') weekly.sh done (dry) ==="
  notify "Daili weekly dry run done"
  exit 0
fi

# Read-only on purpose: the six Astro read tools, file read/write, and date.
# dontAsk denies every tool not listed instead of waiting for a prompt nobody
# answers.
ALLOWED="Read,Write,Glob,Grep,Bash(date:*),mcp__astro__list_apps,mcp__astro__get_app_keywords,mcp__astro__get_keyword_performance,mcp__astro__get_keyword_suggestions,mcp__astro__search_app_store,mcp__astro__get_app_ratings"

claude -p "$(/bin/cat claude-prompts/MARKETING-WEEKLY.md)" \
  --allowedTools "$ALLOWED" \
  --permission-mode dontAsk \
  --add-dir "$OUT_ROOT"
STATUS=$?
echo "claude exited $STATUS"

if [ "$STATUS" = 0 ] && [ -s "$REPORT" ]; then
  echo "report: $REPORT ($(/usr/bin/wc -c <"$REPORT" | /usr/bin/tr -d ' ') bytes)"
  notify "Daili weekly report ready"
else
  echo "report: missing or claude failed"
  notify "Daili weekly report failed — see log"
fi
echo "=== $(/bin/date '+%F %T %Z') weekly.sh done ==="
