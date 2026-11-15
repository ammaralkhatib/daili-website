#!/usr/bin/env python3
"""Turns Claude Code's raw run output (one JSON object per line) into short,
readable lines. Used by run-prompt.sh. Never fails on a line it does not
understand: that line is printed as it is.

Prints at the end one machine line:  @@RESULT <DONE|BLOCKED|UNCLEAR>
"""
import json
import sys
import time

START = time.time()
BOLD, DIM, GREEN, RED, YELLOW, RESET = "\033[1m", "\033[2m", "\033[32m", "\033[31m", "\033[33m", "\033[0m"
if not sys.stdout.isatty():
    BOLD = DIM = GREEN = RED = YELLOW = RESET = ""

counts = {"read": 0, "edit": 0, "bash": 0, "agent": 0}
final_text = ""


def clock():
    s = int(time.time() - START)
    return "%02d:%02d" % (s // 60, s % 60)


def short(text, n=150):
    text = " ".join(str(text).split())
    return text if len(text) <= n else text[: n - 1] + "…"


def say(mark, text, colour=""):
    print("%s[%s]%s %s%s %s%s" % (DIM, clock(), RESET, colour, mark, text, RESET), flush=True)


def tool_line(name, data):
    data = data if isinstance(data, dict) else {}
    low = name.lower()
    if low == "bash":
        counts["bash"] += 1
        say("$", short(data.get("command", ""), 130), YELLOW)
    elif low in ("edit", "write", "multiedit", "notebookedit"):
        counts["edit"] += 1
        say("✎", "changes " + short(data.get("file_path", "?"), 120), GREEN)
    elif low in ("read", "grep", "glob", "ls"):
        counts["read"] += 1
        if counts["read"] % 10 == 1:  # reading is noisy: one line per ten
            say("·", "reading the code… (%d look-ups so far)" % counts["read"], DIM)
    elif low in ("task", "agent"):
        counts["agent"] += 1
        say("⇉", "helper started: " + short(data.get("description", data.get("prompt", "")), 110), BOLD)
    elif low in ("todowrite", "taskcreate", "taskupdate"):
        pass
    else:
        say("→", name)


for raw in sys.stdin:
    raw = raw.rstrip("\n")
    if not raw.strip():
        continue
    try:
        obj = json.loads(raw)
    except ValueError:
        print(raw, flush=True)  # not JSON: show it untouched
        continue
    if not isinstance(obj, dict):
        continue
    kind = obj.get("type")
    if kind == "system" and obj.get("subtype") == "init":
        say("●", "Claude Code started — model %s" % obj.get("model", "?"), BOLD)
    elif kind == "assistant":
        if obj.get("parent_tool_use_id"):
            continue  # a helper's own chatter: keep the screen calm
        content = (obj.get("message") or {}).get("content") or []
        for part in content if isinstance(content, list) else []:
            if not isinstance(part, dict):
                continue
            if part.get("type") == "text" and str(part.get("text", "")).strip():
                final_text = part["text"]
                say("💬", short(part["text"], 220))
            elif part.get("type") == "tool_use":
                tool_line(str(part.get("name", "tool")), part.get("input"))
    elif kind == "result":
        if isinstance(obj.get("result"), str) and obj["result"].strip():
            final_text = obj["result"]
        mins = (obj.get("duration_ms") or 0) / 60000.0
        print()
        print(BOLD + "── Claude Code's last message " + "─" * 40 + RESET)
        print(final_text.strip() or "(no text)")
        print(BOLD + "─" * 70 + RESET)
        say("■", "finished after %.0f min — %d commands, %d file changes, %d helpers"
            % (mins, counts["bash"], counts["edit"], counts["agent"]), BOLD)
        if obj.get("is_error"):
            say("!", "Claude Code reported an error (subtype: %s)" % obj.get("subtype", "?"), RED)

tail = final_text.strip()[-400:].upper()
verdict = "BLOCKED" if "BLOCKED" in tail else ("DONE" if "DONE" in tail else "UNCLEAR")
print("@@RESULT " + verdict, flush=True)
