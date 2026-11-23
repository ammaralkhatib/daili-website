# Website + help: Daili Plus gives 50 AI actions a month, not 30

## Why
List item #25 "Plus: raise AI actions from 30 to 50 a month". Ammar decided on 2026-11-23: "i prefer to
increase them to 50". The api prompt `familyplanner-api 2026-11-23/005` raises the real limit; the app and
the web change their own texts in the same run. daili.app still says 30 in two kinds of places
(Planning Claude grep, 2026-11-23):

1. **FAQ "Is Daili free?" / pricing answer** in `content/<lang>.json` (en `content/en.json` ~:380, de
   ~:330): "… gives you 30 AI actions a month and 5 GB …". One line in each of the 28 files (some languages
   word it differently: ko `AI 30번`, zh `30 次 AI`, th `30 ครั้ง` …).
2. **Help articles**, in every help language (`help/<lang>/…`): the notes that say "Daili Plus gives 30" —
   English: `calendar/photo.md`, `meals/photo.md`, `meals/instagram.md`, `meals/youtube.md`,
   `meals/suggest.md`, `account/avatar-ai.md`, and `account/plus.md` (+ check `notes/notes.md`,
   `meals/cook-with.md`, `meals/share-sheet.md`, which name AI actions too).

## Requirements
1. Change ONLY the Plus AI number: 30 → 50, in every language, in the places above. Find them with your own
   grep in each language (the number next to the words for AI / actions / Plus); never touch other 30s
   (30 days, newest 30, 30 minutes …). Free stays **3**, storage stays **5 GB**, price stays as it is.
2. Help front matter: English files you change get `updated: 2026-11-23`; every translation you change
   gets `translatedFrom: 2026-11-23`. Do not change `since`, `mediaPending` or anything else there.
3. Do NOT change the What's-new / changelog pages for older versions (1.9.0 said 30 — that is history),
   blog posts that report what was true on their date, or `legal/` (grep `legal/` and the terms for "30"
   next to AI; if a legal text names the number, do NOT change it — name the file and line in the report;
   Ammar decides).
4. In the report, list per language how many lines changed. Any file that still holds "30" next to AI
   after your change → name it and say why it stays.

## Verify
- `npm run check:help`, `npm run build` (runs all checks) green, in the FOREGROUND.
- `grep` once more over `content/` and `help/`: no Plus "30" left (except what Requirement 3 keeps).

## Commit & push
- Conventional Commit `docs(site,help): Daili Plus gives 50 AI actions a month (was 30)`; body names
  `Prompt: claude-prompts/2026-11-23/001-plus-ai-actions-50.md`.
- **Push now.** Do NOT run `./deploy.sh`: Ammar deploys the website after Planning Claude's check, once the
  api change is live.

## Report
- `claude-reports/2026-11-23/001-plus-ai-actions-50.md`: files and lines per language, what you kept and
  why, checks, SHA, pushed.
- Do not write the word "blocked" next to a status anywhere in the report unless you really stopped.
