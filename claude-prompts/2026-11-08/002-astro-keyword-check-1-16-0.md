# Astro keyword check — 1.12.0 verdict, tracking sync, review for 1.16.0

## Goal
Three overdue ASO jobs in one run (ASO = App Store Optimization, being found in
App Store search). Ammar approved this on 2026-11-08. No store change, no repo
code — Astro tracking + two docs + the report.

- **A. Verdict** on the keyword-field swaps that went live with 1.12.0 on
  2026-10-24 (due 2026-11-07).
- **B. Tracking sync**: Astro must track the search PHRASES that match the
  words in our live keyword fields, so every field word is measured.
- **C. Review for 1.16.0**: run `claude-prompts/ASO-REVIEW.md` with
  <VERSION> = `1.16.0`, using the NEW thresholds below.

Read first: `~/Claude/Projects/Family Planner/marketing/aso/STRATEGY.md` §3 and
`ASO-REVIEW.md`. Tier-1 stores only: us de at gb nl fr es it (tier 2 has its
own monthly check — skip it).

## New thresholds (Ammar 2026-11-08 — overrides older numbers in ASO-REVIEW.md)
- A candidate word is worth a slot when **pop ≥ 20 AND diff ≤ 50**; prefer
  diff < 40. Pop ≥ 50 is a bonus, never a requirement.
- **Push** = rank 11–50, pop ≥ 20, diff ≤ 50. Rank 11–50 with diff > 50 =
  **Hold** (say "too hard for now").
- Reason: Daili has ~1 US / 4 DE ratings; high-difficulty words can't be won yet.

## Before you start
`claude mcp list` → `astro` must be connected. Not connected → stop, report
`blocked` (Astro must be open on the Mac, Settings → MCP Server on).
Daili = App Store id `6800427546`, iPhone.

## A. 1.12.0 verdict
1. `get_keyword_performance` (or `get_app_keywords`) for the words the 1.12.0
   swaps were made for: US `family hub`, `family organiser` · DE + AT
   `essensplaner`, `wochenplaner`, `haushaltsplaner`, `planer`, `termine` ·
   NL `familie agenda`, `gezinsplanner`. Not tracked yet → add it in step B
   and write "not measured before" (no verdict).
2. Compare with `marketing/aso/2026-10-20-baseline.md` (the "before" numbers).
3. Fill the empty **Verdict (+14 d)** cell of the three 1.12.0 rows in
   `marketing/aso/keyword-log.md`: `working` (rank clearly better) /
   `not yet` (no move) / `unclear` (too little data or mixed), each with the
   numbers, e.g. `working — essensplaner 1000→84, wochenplaner 1000→61`.
   Edit only those three cells.

## B. Tracking sync (Astro writes allowed ONLY here)
For each tier-1 store:
1. Read the live fields: title, subtitle, keyword field from
   `~/development/flutter_projects/familyplanner/store-listings/NN-*.md`
   (us = 00, gb = 01, de + at = 02, nl = 03, fr = 07, it = 08, es = 09).
2. For every field word, check that at least one tracked phrase contains it.
   A missing word → pick the best real search phrase for it from
   `get_keyword_suggestions` / `search_app_store` (a phrase people type, e.g.
   `chore chart`, not the bare word) and `add_keywords` it.
   **Max 8 new phrases per store.** Words with no phrase at pop > 5 → write
   "no searched phrase", don't add.
3. `remove_keywords` ONLY these clearly off-intent US rows: `family feud`,
   `family style`, `family album`. Anything else that looks off-intent →
   list it as "propose removal", don't remove.
4. 🔴 Never add contraception readings (family planning, Familienplanung,
   gezinsplanning, planning familial, pianificazione familiare, planificación
   familiar), competitor app names or Apple feature names. No `manage_tag`,
   no notes, no `set_*`.
5. Read back with `get_app_keywords`; if a new row has no values yet, say so,
   don't guess.

## C. Review for 1.16.0
Follow `ASO-REVIEW.md` steps 1–6 for every tier-1 store, with the new
thresholds above. Rule from the log: never propose undoing a 1.12.0 swap (it
is younger than 2 releases) unless part A shows it clearly failed — then say
so and still leave the decision to Ammar. Max 3 swaps per field, count
characters with python.

## Output
`~/Claude/Projects/Family Planner/marketing/aso/2026-11-08-review-1.16.0.md`
(file-write tool, never a heredoc). Max 3 pages, plain English, short
sentences. Order:
1. **One-line summary.**
2. **A. Verdict** — one line per 1.12.0 row.
3. **B. Tracking** — per store: added phrases (rank/pop/diff), removed, "no
   searched phrase" words, "propose removal" list.
4. **C. Review** — per store: the table (keyword · rank · prev · pop · diff ·
   group), proposed field or "no change" with each swap and its numbers,
   rejected candidates + reason, ratings (one line).
5. **Decisions for Ammar** — one line per store.

## Commit & push
Only the report (the marketing folder is outside the repo):
`docs(report): 2026-11-08 002 astro keyword check 1.16.0`; body
`Prompt: claude-prompts/2026-11-08/002-astro-keyword-check-1-16-0.md`.
Push now. No `./deploy.sh`. Leave `static/assets/img/photos/` untracked.

## Report
`claude-reports/2026-11-08/002-astro-keyword-check-1-16-0.md`, a few lines:
status, verdicts, phrases added/removed per store, swaps proposed, anything
Astro could not give. Check `wc -c` > 0.
`## Help impact`: none.
