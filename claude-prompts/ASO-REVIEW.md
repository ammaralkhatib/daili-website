# ASO-REVIEW — keyword review before a release cut (reusable; Claude Code runs it in the daili-website repo)

ASO = App Store Optimization. This review reads Astro and proposes at most
2–3 keyword swaps per language. Planning Claude and Ammar decide; you only
propose. The rules come from `~/Claude/Projects/Family Planner/marketing/aso/STRATEGY.md`
— read §3 first.

**Read-only.** Astro tools allowed: `list_apps`, `get_app_keywords`,
`get_keyword_performance`, `get_keyword_suggestions`, `search_app_store`,
`get_app_ratings`, `extract_competitors_keywords`. No `add_*`, `remove_*`,
`set_*`, `manage_tag`. No repo file changes except the report. No git.

## Before you start
`claude mcp list` → `astro` must be connected. Not connected → stop, report
`blocked` (Astro must be open, Settings → MCP Server on).
Today's date = `date +%F` → <DATE>. The version being prepared is given in
the prompt that calls this file; call it <VERSION>.

## Inputs
1. Astro, Daili = App Store id `6800427546`, iPhone. Tier-1 stores: us de at gb nl fr es it.
   Tier-2 (only if tracked): se dk no pl br cz.
2. The live fields = the store-listings files
   `~/development/flutter_projects/familyplanner/store-listings/NN-*.md`
   (sections "App name", "Subtitle", "Keyword field"). If `marketing/aso/next-release-keywords.md`
   is PENDING, those are the fields about to go live — review on top of them.
3. `marketing/aso/keyword-log.md` — what was changed before and why. Never
   propose undoing a swap that is younger than 2 releases.
4. The newest `marketing/weekly/*.md` and `marketing/aso/*-baseline.md` for history.

## Steps (per tier-1 store)
1. `get_app_keywords` → table: keyword · rank · prev · pop · diff · group.
   Groups: **Keep** 1–10 · **Push** 11–50 & pop ≥ 20 · **Hold** 11–50 & pop < 20
   · **Push-next** 51–200 or unranked & pop ≥ 20 · **Drop** off-intent, or
   pop 5 for 4+ weeks (say how many weeks of history exist).
2. Check each field word: is it in title/subtitle too (wasted slot)? Is there
   a tracked keyword for it? If none → "unmeasured", not "dead".
3. `get_keyword_suggestions` (+ `extract_competitors_keywords` on the best
   tracked word) → candidates with pop ≥ 20 that match a feature Daili has.
   Rejected list with the reason (off-intent, competitor name, Apple feature
   name, pricing word, contraception reading, feature we don't have).
4. Compound languages (de, nl, + sv da nb fi when tracked): check that every
   searched form is in the field as a WHOLE word; a stem does not match.
5. Propose the new field: ≤ 100 chars, no title/subtitle word, singular, no
   spaces after commas, **max 3 swaps**, each swap with its number. Count
   with python, never by eye. If nothing beats what is there: "no change".
6. Ratings per store (`get_app_ratings`), one line — the real limiter.

## Output
`~/Claude/Projects/Family Planner/marketing/aso/<DATE>-review-<VERSION>.md`
(file-write tool, never a heredoc). Max 2 pages. Per store: the table, the
proposed field (or "no change") with the swaps and their numbers, rejected
candidates. End with "Decisions for Ammar" — one line per store.

## Report
`claude-reports/<DATE>/NNN-aso-review-<VERSION>.md`, a few lines: stores
reviewed, how many swaps proposed, anything Astro could not give.
`## Help impact`: none. Commit only the report. No push needed unless the
calling prompt says `Push now`.
