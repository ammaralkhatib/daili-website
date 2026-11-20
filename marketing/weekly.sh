#!/bin/bash
# The Monday marketing report: Search Console + Astro → one Markdown file in
# ~/Claude/Projects/Family Planner/marketing/weekly/<date>.md.
# Run by launchd (app.daili.marketing-weekly.plist), or by hand:
#
#     ./marketing/weekly.sh          # everything
#     ./marketing/weekly.sh --dry    # everything except the claude -p step
#
# Every run (ok, failed, dry) leaves one run note in
# marketing/weekly/runs/<date>.txt, so a missing report says why.
#
# Never publishes, deploys, commits or changes store text. The report itself is
# defined in claude-prompts/MARKETING-WEEKLY.md.
#
# Test-only switches (the job itself never sets them):
#   WEEKLY_OUT_ROOT      another output folder instead of the real marketing/ one
#   WEEKLY_CLAUDE_CMD    command run instead of `claude` (default: claude)
#   WEEKLY_RETRY_SLEEP   seconds between tries (default: 600)
#   WEEKLY_SKIP_KEYCHAIN=1  do not load the sign-in key from the Keychain
#   WEEKLY_SEO_CMD       command run instead of daili-seo.sh (the totals step)
set -uo pipefail

# launchd starts with almost no PATH. These are where node (Herd's nvm) and
# claude live on this Mac; update them if either moves.
NODE_DIR="$HOME/Library/Application Support/Herd/config/nvm/versions/node/v24.15.0/bin"
CLAUDE_DIR="$HOME/.local/bin"
export PATH="$NODE_DIR:$CLAUDE_DIR:/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"

REPO="$(cd "$(dirname "$0")/.." && pwd)"
OUT_ROOT="${WEEKLY_OUT_ROOT:-$HOME/Claude/Projects/Family Planner/marketing}"
LOG="$HOME/Library/Logs/daili-marketing-weekly.log"
DATE="$(/bin/date +%F)"
REPORT="$OUT_ROOT/weekly/$DATE.md"
RUN_NOTE="$OUT_ROOT/weekly/runs/$DATE.txt"
# gsc-pull.mjs always writes here (its own fixed path).
GSC_DIR="$HOME/Claude/Projects/Family Planner/marketing/gsc/$DATE"
# Counts the Search Console totals before the claude step (read-only; it runs
# /usr/bin/python3 by full path, so it works under launchd).
SEO_CMD="${WEEKLY_SEO_CMD:-$HOME/Claude/Projects/Family Planner/daili-seo.sh}"
SEO_REPORT="$GSC_DIR/seo-report.json"
CLAUDE_CMD="${WEEKLY_CLAUDE_CMD:-claude}"
RETRY_SLEEP="${WEEKLY_RETRY_SLEEP:-600}"
MAX_TRIES=3
DRY=0
[ "${1:-}" = "--dry" ] && DRY=1

# What the run note will say; changed as the run goes on.
RESULT="failed"
REASON="script stopped early"
TRIES=0
ASTRO="down"
TOTALS="failed (script stopped before the totals step)"
REPORT_NOTE="none"

/bin/mkdir -p "$OUT_ROOT/weekly/runs" "$(/usr/bin/dirname "$LOG")"
exec >>"$LOG" 2>&1
echo "=== $(/bin/date '+%F %T %Z') weekly.sh start (dry=$DRY) ==="

# One short run note per run, written on every exit (also an early one).
finish() {
  local gsc first
  if [ -f "$GSC_DIR/ERROR.txt" ]; then
    first="$(/usr/bin/head -n 1 "$GSC_DIR/ERROR.txt" | /usr/bin/tr -d '\r')"
    gsc="ERROR.txt ($first)"
  elif [ -s "$GSC_DIR/queries.json" ]; then
    gsc="ok"
  else
    gsc="missing"
  fi
  {
    echo "date: $DATE"
    echo "result: $RESULT"
    echo "reason: $REASON"
    echo "tries: $TRIES"
    echo "astro: $ASTRO"
    echo "search console: $gsc"
    echo "totals: $TOTALS"
    echo "report: $REPORT_NOTE"
  } >"$RUN_NOTE"
  echo "run note: $RUN_NOTE (result: $RESULT)"
}
trap finish EXIT

cd "$REPO" || { echo "cannot cd to $REPO"; REASON="cannot cd to $REPO"; exit 1; }

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
  ASTRO="up"
else
  echo "astro: still down after 90 s, the report will say so"
fi

node marketing/gsc-pull.mjs || echo "gsc-pull exited $?"

# The totals for section 1 of the report, counted by daili-seo.sh so the
# claude step never adds numbers up by hand. Written to a temp file and moved
# into place only when the script exited 0 and the output is non-empty, valid
# JSON — a failed count leaves no seo-report.json at all.
count_totals() {
  local tmp err code first
  /bin/rm -f "$SEO_REPORT"
  if [ ! -s "$GSC_DIR/queries.json" ] || [ ! -s "$GSC_DIR/pages.json" ]; then
    echo "totals: skipped, no Search Console data"
    TOTALS="skipped (no Search Console data)"
    return
  fi
  tmp="$(/usr/bin/mktemp "$GSC_DIR/.seo-report.XXXXXX")" || {
    echo "totals: cannot make a temp file in $GSC_DIR"
    TOTALS="failed (cannot make a temp file)"
    return
  }
  err="$(/usr/bin/mktemp -t daili-seo-err)" || err="/dev/null"
  "$SEO_CMD" report --json --date "$DATE" >"$tmp" 2>"$err"
  code=$?
  first=""
  [ "$err" != "/dev/null" ] && first="$(/usr/bin/head -n 1 "$err" | /usr/bin/tr -d '\r')"
  [ "$err" != "/dev/null" ] && /bin/rm -f "$err"
  if [ "$code" != 0 ]; then
    echo "totals: daili-seo.sh exited $code: ${first:-(no error text)}"
    TOTALS="failed (daili-seo.sh exited $code${first:+: $first})"
    /bin/rm -f "$tmp"
    return
  fi
  if [ ! -s "$tmp" ] || ! /usr/bin/python3 -c 'import json, sys; d = json.load(open(sys.argv[1])); sys.exit(0 if isinstance(d, dict) and d else 1)' "$tmp" 2>/dev/null; then
    echo "totals: daili-seo.sh exited 0 but its output is empty or not valid JSON"
    TOTALS="failed (output empty or not valid JSON)"
    /bin/rm -f "$tmp"
    return
  fi
  /bin/chmod 644 "$tmp"
  /bin/mv -f "$tmp" "$SEO_REPORT"
  echo "totals: $SEO_REPORT"
  TOTALS="ok"
}
count_totals

if [ "$DRY" = 1 ]; then
  echo "dry run: skipping claude -p"
  RESULT="dry"
  REASON="dry run"
  echo "=== $(/bin/date '+%F %T %Z') weekly.sh done (dry) ==="
  notify "Daili weekly dry run done"
  exit 0
fi

# Long-lived sign-in key (claude setup-token), like the run scripts, so the end
# of the Mac's normal claude sign-in cannot stop the job. Never echo it: all
# output goes to the log.
if [ "${WEEKLY_SKIP_KEYCHAIN:-0}" != "1" ]; then
  CLAUDE_CODE_OAUTH_TOKEN="$(/usr/bin/security find-generic-password -s claude-code-oauth -w 2>/dev/null)"
  if [ -z "$CLAUDE_CODE_OAUTH_TOKEN" ]; then
    echo "sign-in: no key in the Keychain (claude-code-oauth), no claude step"
    REASON="no sign-in key in the Keychain (claude-code-oauth)"
    notify "Daili weekly report failed — no sign-in key"
    exit 1
  fi
  export CLAUDE_CODE_OAUTH_TOKEN
fi

# Read-only on purpose: the six Astro read tools, file read/write, and date.
# dontAsk denies every tool not listed instead of waiting for a prompt nobody
# answers.
ALLOWED="Read,Write,Glob,Grep,Bash(date:*),mcp__astro__list_apps,mcp__astro__get_app_keywords,mcp__astro__get_keyword_performance,mcp__astro__get_keyword_suggestions,mcp__astro__search_app_store,mcp__astro__get_app_ratings"

# Up to 3 tries (for example the Mac had no internet for a moment). A try
# fails when claude exits non-zero or the report is missing/empty afterwards.
OK=0
STATUS=0
while [ "$TRIES" -lt "$MAX_TRIES" ]; do
  TRIES=$((TRIES + 1))
  "$CLAUDE_CMD" -p "$(/bin/cat claude-prompts/MARKETING-WEEKLY.md)" \
    --allowedTools "$ALLOWED" \
    --permission-mode dontAsk \
    --add-dir "$OUT_ROOT"
  STATUS=$?
  if [ "$STATUS" = 0 ] && [ -s "$REPORT" ]; then
    echo "try $TRIES of $MAX_TRIES: ok"
    OK=1
    break
  fi
  if [ "$STATUS" != 0 ]; then
    echo "try $TRIES of $MAX_TRIES: claude exited $STATUS"
  else
    echo "try $TRIES of $MAX_TRIES: claude exited 0 but the report is missing or empty"
  fi
  if [ "$TRIES" -lt "$MAX_TRIES" ]; then
    echo "waiting $RETRY_SLEEP s before the next try"
    /bin/sleep "$RETRY_SLEEP"
  fi
done

if [ "$OK" = 1 ]; then
  echo "report: $REPORT ($(/usr/bin/wc -c <"$REPORT" | /usr/bin/tr -d ' ') bytes)"
  RESULT="ok"
  REASON="report written"
  REPORT_NOTE="$REPORT"
  notify "Daili weekly report ready"
else
  echo "report: missing or claude failed"
  if [ "$STATUS" != 0 ]; then
    REASON="claude exited $STATUS after $TRIES tries"
  else
    REASON="report missing or empty after $TRIES tries"
  fi
  notify "Daili weekly report failed — see log"
fi
echo "=== $(/bin/date '+%F %T %Z') weekly.sh done ==="
