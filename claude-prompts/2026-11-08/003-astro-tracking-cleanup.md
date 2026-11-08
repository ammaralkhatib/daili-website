# Astro — tracking clean-up after the 1.16.0 keyword review

## Goal
Ammar approved the "Decisions for Ammar" list of
`~/Claude/Projects/Family Planner/marketing/aso/2026-11-08-review-1.16.0.md`
on 2026-11-08. This run only changes what Astro WATCHES. No store change, no
repo code, no other doc.

## Before you start
`claude mcp list` → `astro` must be connected. Not connected → stop, report
`blocked`. Daili = App Store id `6800427546`, iPhone.

## Steps
1. `remove_keywords` exactly these rows (Ammar's approval = the confirmation
   Astro asks for):
   - US: `cozi family organizer`, `app organizer`, `family time`, `household planner`
   - AT: `termine`
2. `add_keywords`:
   - GB: `family app`
   - GB, NL, FR, ES, IT: `daili` (the brand)
3. Nothing else: no other add/remove, no `manage_tag`, no notes, no `set_*`.
4. Read back with `get_app_keywords` for US, AT, GB, NL, FR, ES, IT: the five
   removed rows are gone, the six new rows exist. Note rank + pop + diff of the
   new rows (empty → say so, don't guess).

## Commit & push
Only the report: `docs(report): 2026-11-08 003 astro tracking clean-up`; body
`Prompt: claude-prompts/2026-11-08/003-astro-tracking-cleanup.md`. Push now.
No `./deploy.sh`. Leave `static/assets/img/photos/` untracked.

## Report
`claude-reports/2026-11-08/003-astro-tracking-cleanup.md`, 5–8 lines: status,
removed, added (with rank/pop/diff), anything refused. Check `wc -c` > 0.
`## Help impact`: none.
