# Monday job: read ALL Search Console rows, and count the totals before the claude step

List item #109, parts 1 and 2. Batch lane: two small changes to the Monday marketing job
(`marketing/`). Planning Claude read the code on 2026-11-20 (read-only). Nothing in the website
itself changes; no deploy.

## Goal

1. `gsc-pull.mjs` asks Google for at most 1,000 rows. Since 2026-11-09 `pages.json` has exactly
   1,000 rows, so small pages are missing and the totals are too low. After this change the pull
   reads ALL rows.
2. The claude step of the Monday job cannot run node or python (only Read/Write/date), so on
   2026-11-02 and 2026-11-09 it added up the Search Console totals by hand. After this change
   `weekly.sh` counts the totals BEFORE the claude step with the existing read-only script
   `daili-seo.sh`, and the report takes its numbers from that file.

## Scope

- In: `marketing/gsc-pull.mjs`, `marketing/weekly.sh`, `claude-prompts/MARKETING-WEEKLY.md`,
  `marketing/README.md`.
- Read only (do NOT change): `~/Claude/Projects/Family Planner/daili-seo.sh` (outside this repo;
  Planning Claude owns it — it already treats a file with `"complete": true` as not cut, see 1d).
- Out: the website pages, `build.mjs`, `deploy.sh`, the launchd plist, the retry / Keychain /
  run-note logic added this morning (`434739fb`) — keep it exactly as it is.

## Requirements

### 1. Read all rows (`gsc-pull.mjs`)

a. Page through the answer: `rowLimit: 25000` (Google's maximum per call) and `startRow` 0,
   25000, 50000 … until a call returns fewer rows than the limit (or no `rows`). Put all rows
   into ONE `rows` array, in the order Google sent them.
b. A safety stop: at most 20 calls per dimension set. If the 20th call is still full, keep what
   you have and set `"complete": false` (see c) — never loop forever.
c. Add two fields to BOTH output files, next to `site` / `startDate` / `endDate` / `dimensions`:
   `"rowCount": <number of rows>` and `"complete": true` (false only in case b).
   Keep every field that is there today (`site`, `startDate`, `endDate`, `dimensions`, `rows`,
   `responseAggregationType` if Google sends it) — `daili-seo.sh` reads them.
d. The console line names the number of calls too, e.g.
   `gsc: 2026-10-24..2026-11-20 → … (3104 query rows in 1 call, 1290 page rows in 1 call)`.
e. Everything else stays: zero npm dependencies, the key is never printed, any failure writes
   `ERROR.txt` and exits 0.

### 2. Count the totals before the claude step (`weekly.sh` + `MARKETING-WEEKLY.md`)

a. Right after `node marketing/gsc-pull.mjs`, if `$GSC_DIR/queries.json` and `pages.json` exist
   and are not empty, run (FULL path, quoted — the folder name has a space):
   `"$HOME/Claude/Projects/Family Planner/daili-seo.sh" report --json --date "$DATE"`
   and write its output to `$GSC_DIR/seo-report.json`. Write to a temp file first and move it
   into place only when the script exited 0 and the output is valid, non-empty JSON — never leave
   a half file. If the script is missing or fails: no `seo-report.json`, one line in the log with
   the exit code and the first line of its stderr.
b. The run note gets one new line `totals: ok` | `totals: failed (<reason>)` | `totals: skipped
   (no Search Console data)`. Keep the other lines and their order; add this one after
   `search console:`.
c. The dry run (`--dry`) also makes `seo-report.json` (it runs before the claude step).
d. `MARKETING-WEEKLY.md`, input 1: add `seo-report.json` — made by `daili-seo.sh` just before
   you start. Rules for section 1:
   - Totals (non-brand clicks and views), the brand total line, and the rows of lists A / B / C
     come from `seo-report.json` (`non_brand`, `brand`, `groups.A/B/C`). **Never add up numbers
     by hand.**
   - The change vs last week: last week's report numbers against this week's file. If last week's
     report says its totals were counted by hand or its pull was cut at 1,000 rows, say "not
     comparable (last week's numbers were cut)" instead of a change.
   - If `seo-report.json` is missing → write "no counted totals this week (seo-report.json
     missing)" in place of the totals and still give lists A / B / C from `queries.json`.
   - If `queries_cut` or `pages_cut` is true in the file → one warning line.
   - Group B: keep the report's wording ("position > 30, or the ranking page is off-topic"); the
     file gives the position > 30 rows, the off-topic call stays yours.
   - Keep everything else in the file as it is (brand filter, "family planning" rule, Astro part,
     shape, max ~1 page).
e. `marketing/README.md`: two short lines — the pull reads all rows (`complete` / `rowCount`),
   and `seo-report.json` + the `totals:` run-note line.

## Constraints

- Bash 3.2 (macOS `/bin/bash`): no `mapfile`, no `${var,,}`. `set -uo pipefail` stays.
- launchd PATH: `daili-seo.sh` runs `/usr/bin/python3` by full path, so it works under launchd.
- Never print the key or the sign-in token; all output goes to the log as today.
- The claude step's allowed tools do NOT change (Read/Write/Glob/Grep/date + the six Astro reads).
- 🔴 Report trap: never put the word "status" and the word "blocked" on one line unless you really
  are blocked.

## Verify

- `bash -n marketing/weekly.sh` and `node --check marketing/gsc-pull.mjs` → no error.
- `./marketing/weekly.sh --dry` (real pull, read-only at Google; it also opens Astro, that is fine):
  - the log line shows the row counts and calls; `queries.json` and `pages.json` have
    `"complete": true` and `rowCount` = the length of `rows`; say in the report whether
    `pages.json` now has MORE than 1,000 rows (it should).
  - `seo-report.json` exists, is valid JSON, `pages_cut` is false; quote its `non_brand` and
    `brand` totals in the report.
  - the run note says `result: dry` and `totals: ok`.
  - Then run `"$HOME/Claude/Projects/Family Planner/daili-seo.sh" report --date <today>` once
    and check it prints NO "is CUT" warning.
- Failure test: run the dry run once with a temp copy where the daili-seo path points to a
  missing file (a test-only env var like `WEEKLY_SEO_CMD` is fine; the job never sets it) →
  no `seo-report.json`, run note `totals: failed (…)`, the job still ends normally.
- Afterwards delete ONLY what the tests made: today's `runs/<today>.txt` and today's
  `Family Planner/marketing/gsc/<today>/` folder (both did not exist before the test — check
  first, and if they did exist, leave them). Say in the report what you removed.
- `npm run build` once (nothing should change; the repo must stay green).

## Commit & push

- Two commits:
  `fix(marketing): the Search Console pull reads all rows` and
  `feat(marketing): the Monday job counts the totals before the claude step`.
  Body: `Prompt: claude-prompts/2026-11-20/005-marketing-all-search-rows-and-counted-totals.md`
- **Push now.** (A website push does not deploy. Do NOT run `./deploy.sh`.)

## Report

- `claude-reports/2026-11-20/005-marketing-all-search-rows-and-counted-totals.md` from the
  template: what changed in plain words; row counts before (1,000) and after; the totals from
  `seo-report.json`; the test outputs; what you cleaned up; SHAs; pushed or not.
- Open item for Ammar: the first real Monday with this change is 2026-11-23 07:00 (the Mac must
  be on and awake) — Planning Claude checks the run note (list item #170).
- `## Help impact`: none.
