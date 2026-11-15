#!/bin/bash
# Daili prompt runner — shows WHICH prompt is running and what Claude Code is doing.
#
# Use it from the repo's folder, in a normal terminal (not inside Claude Code):
#   ./claude-prompts/run-prompt.sh claude-prompts/2026-11-13/002-some-prompt.md
# Several prompts in a row (stops at the first BLOCKED):
#   ./claude-prompts/run-prompt.sh claude-prompts/<date>/003-a.md claude-prompts/<date>/004-b.md
#
# RUN_PLAIN=1 in front = old behaviour (no live lines, only the final text).
set -o pipefail
export CLAUDE_CODE_SUBAGENT_MODEL=claude-opus-5-5
MODEL=claude-opus-5-5
RULE="Every sub-agent you start MUST use model claude-opus-5-5, and you must wait for all of them to finish before committing. Run lint and tests in the FOREGROUND. End your last message with the single word DONE or BLOCKED."

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_DIR" || exit 1
case "$(basename "$REPO_DIR")" in
  familyplanner-api) REPO="BACKEND (familyplanner-api)" ; TAG=api ;;
  familyplanner-app) REPO="FLUTTER APP (familyplanner-app)" ; TAG=app ;;
  daili-web)         REPO="WEB (daili-web)" ; TAG=web ;;
  daili-website)     REPO="WEBSITE (daili-website)" ; TAG=site ;;
  *)                 REPO="$(basename "$REPO_DIR")" ; TAG=repo ;;
esac
B=$'\033[1m'; D=$'\033[2m'; G=$'\033[32m'; R=$'\033[31m'; Z=$'\033[0m'
line() { printf '%s\n' "════════════════════════════════════════════════════════════════════════"; }

if [ "$#" -eq 0 ]; then echo "Give me at least one prompt file. Example:"; /usr/bin/sed -n '4,5p' "$0"; exit 1; fi
for P in "$@"; do [ -f "$P" ] || { echo "${R}Not found: $REPO_DIR/$P${Z}"; exit 1; }; done
command -v claude >/dev/null || { echo "${R}The 'claude' command was not found in this terminal.${Z}"; exit 1; }
KEEP_AWAKE=""; command -v caffeinate >/dev/null && KEEP_AWAKE="caffeinate -i"

TOTAL=$#; N=0
for P in "$@"; do
  N=$((N+1))
  ID="$(basename "$P" .md)"
  TITLE="$(/usr/bin/grep -m1 '^# ' "$P" | /usr/bin/sed 's/^# //')"
  GOAL="$(/usr/bin/awk '/^## Goal/{f=1;next} /^## /{f=0} f&&NF{print "   " $0; if(++n==4) exit}' "$P")"
  if /usr/bin/grep -qi 'hold the push' "$P" && ! /usr/bin/grep -q '\*\*Push now\*\*' "$P"; then PUSH="commit only — NOT pushed"; else PUSH="commit + push (backend: a push goes live on the server)"; fi
  LOG="/tmp/daili-run-$TAG-$ID.log"; RAW="/tmp/daili-run-$TAG-$ID.jsonl"
  HEAD_BEFORE="$(git rev-parse HEAD 2>/dev/null)"
  printf '\033]0;%s\007' "Daili run: $TAG $ID ($N/$TOTAL)"   # the terminal tab shows the prompt

  { line
    echo "${B} DAILI PROMPT RUN  $N of $TOTAL${Z}"
    echo "  Repo:    ${B}$REPO${Z}"
    echo "  Prompt:  ${B}$ID${Z}"
    echo "  Title:   $TITLE"
    echo "  File:    $REPO_DIR/$P"
    echo "  Goal:"; echo "$GOAL"
    echo "  At end:  $PUSH"
    echo "  Started: $(date '+%H:%M')   ·   full log: $LOG"
    echo "  ${D}Stop it any time with Ctrl+C. Nothing is committed before the tests pass.${Z}"
    line; } | tee "$LOG"

  ASK="Read CLAUDE.md. First commit any pending planning docs (the docs step of the run rules). Then run $P exactly as written, per CLAUDE.md section 2. $RULE"
  if [ -n "$RUN_PLAIN" ] || ! command -v python3 >/dev/null; then
    $KEEP_AWAKE claude -p --model "$MODEL" --permission-mode bypassPermissions "$ASK" 2>&1 | tee -a "$LOG"
    if tail -5 "$LOG" | /usr/bin/grep -q BLOCKED; then VERDICT=BLOCKED; elif tail -5 "$LOG" | /usr/bin/grep -q DONE; then VERDICT=DONE; else VERDICT=UNCLEAR; fi
  else
    $KEEP_AWAKE claude -p --model "$MODEL" --permission-mode bypassPermissions \
      --output-format stream-json --verbose "$ASK" 2>&1 \
      | tee "$RAW" | python3 "$REPO_DIR/claude-prompts/run_watch.py" | tee -a "$LOG"
    VERDICT="$(/usr/bin/grep '^@@RESULT ' "$LOG" | tail -1 | /usr/bin/awk '{print $2}')"
    [ -z "$VERDICT" ] && VERDICT=UNCLEAR
  fi

  REPORT="claude-reports/$(basename "$(dirname "$P")")/$ID.md"
  { line
    echo "${B} RESULT of $ID  ($REPO)${Z}"
    case "$VERDICT" in
      DONE)    echo "  ${G}${B}DONE${Z}" ;;
      BLOCKED) echo "  ${R}${B}BLOCKED${Z} — nothing more runs. Tell Planning Claude." ;;
      *)       echo "  ${R}${B}UNCLEAR${Z} — the run ended without DONE or BLOCKED. Tell Planning Claude." ;;
    esac
    echo "  New commits:"
    if [ -n "$HEAD_BEFORE" ] && [ "$(git rev-parse HEAD)" != "$HEAD_BEFORE" ]; then git log --oneline "$HEAD_BEFORE"..HEAD | /usr/bin/sed 's/^/    /'; else echo "    (none)"; fi
    if [ -s "$REPORT" ]; then echo "  Report:  $REPO_DIR/$REPORT"; else echo "  Report:  ${R}missing${Z} ($REPORT)"; fi
    AHEAD="$(git rev-list --count '@{u}..HEAD' 2>/dev/null)"
    [ -n "$AHEAD" ] && { [ "$AHEAD" = "0" ] && echo "  Pushed:  yes" || echo "  Pushed:  no — $AHEAD commit(s) only on this Mac"; }
    DIRTY="$(git status --short | /usr/bin/wc -l | /usr/bin/tr -d ' ')"
    [ "$DIRTY" != "0" ] && echo "  ${R}Note:${Z} $DIRTY file(s) changed but not committed."
    echo "  Finished: $(date '+%H:%M')"
    line; } | tee -a "$LOG"

  [ "$VERDICT" = "DONE" ] || { echo "Reply to Planning Claude:  ${B}$TAG $ID $VERDICT${Z}"; exit 1; }
done
echo "All $TOTAL run(s) finished. Reply to Planning Claude:  ${B}$TAG $(basename "${!#}" .md) DONE${Z}"
