# 005 — Monday job: read ALL Search Console rows, count the totals before the claude step

**Result:** done · **Commits:** `88ed628c` fix(marketing): the Search Console pull reads all rows · `9a70c59b` feat(marketing): the Monday job counts the totals before the claude step — both pushed to origin/main together with this report. `./deploy.sh` was NOT run (nothing in the website changed).
**Step 0:** `e7779220` docs(plan): sync planning docs (this prompt file), pushed. No commits were held. `static/assets/img/photos/` stayed untouched and unstaged, as in earlier runs.
No sub-agents were used.

## What changed, in plain words
1. **`marketing/gsc-pull.mjs` reads every row.** Each call now asks for 25,000 rows (Google's maximum) and moves on with `startRow` 0, 25000, 50000 … until a call returns fewer rows than that, or no `rows`. All rows go into one `rows` array, in Google's order. Safety stop: 20 calls per dimension set. If the 20th call is still full, the file keeps what it has and says `"complete": false`. Both files have two new fields, `rowCount` and `complete`. Every old field is still there (`site`, `startDate`, `endDate`, `dimensions`, `rows`, `responseAggregationType`). The console line now gives the calls too. Zero npm dependencies, the key is never printed, and a failure still writes `ERROR.txt` and exits 0. One small difference: when Google sends no rows, the file now has `"rows": []` where before it had no `rows` key.
2. **`marketing/weekly.sh` counts the totals.** Right after the pull, if `queries.json` and `pages.json` exist and are not empty, it runs `"$HOME/Claude/Projects/Family Planner/daili-seo.sh" report --json --date "$DATE"`. The output goes to a temp file in the same folder. The temp file is moved to `gsc/<date>/seo-report.json` only if the script exited 0 and the output is non-empty, valid JSON (checked with `/usr/bin/python3`). Any old `seo-report.json` from the same day is removed first, so a failed count never leaves a file behind. A failure writes one log line with the exit code and the first stderr line. The run note has a new line `totals: ok | failed (<reason>) | skipped (no Search Console data)`, right after `search console:`. If the script stops before this step, the line says `failed (script stopped before the totals step)`. The dry run makes the file too. There is a new test-only switch, `WEEKLY_SEO_CMD` (the job never sets it). The retry, Keychain and run-note logic from `434739fb` is unchanged, and so are the claude step's allowed tools.
3. **`claude-prompts/MARKETING-WEEKLY.md`.** Input 1 now names `seo-report.json`. Section 1 has a new list, "Where the numbers come from": the totals, the brand line and the rows of lists A / B / C come from that file, and the step never adds numbers up by hand. The change vs last week says "not comparable (last week's numbers were cut)" when last week's report was counted by hand or its pull was cut. A missing file means writing "no counted totals this week (seo-report.json missing)" and still giving A / B / C from `queries.json`. When `queries_cut` or `pages_cut` is true, the report adds one warning line. Group B keeps its wording; the off-topic call stays the claude step's. Nothing else in the file changed.
4. **`marketing/README.md`.** Two new lines: the pull reads all rows (`rowCount` / `complete`), and what `seo-report.json` is. The run-note sentence now names the `totals:` line.

## Row counts: before and after
| file | 2026-11-16 (old pull) | 2026-11-20 test (new pull) |
|---|---|---|
| `queries.json` | 906 | 982 rows in 1 call, `complete: true`, `rowCount` 982 |
| `pages.json` | **1,000 (cut)** | **1,757 rows in 1 call**, `complete: true`, `rowCount` 1757 |

So `pages.json` now has MORE than 1,000 rows (757 more). In both new files `rowCount` equals the length of `rows`.

## Totals from `seo-report.json` (test pull, window 2026-10-21 → 2026-11-17)
- `non_brand`: **2203 views, 9 clicks** (523 rows)
- `brand`: **6608 views, 76 clicks** (459 rows)
- `queries_cut`: false · `pages_cut`: false · `all_pages`: 20839 views, 241 clicks
- groups: A 26 rows, B 17 rows, C 13 rows

## Test outputs
- `bash -n marketing/weekly.sh` → no error · `node --check marketing/gsc-pull.mjs` → no error.
- `node marketing/gsc-pull.mjs` (before commit 1): `gsc: 2026-10-21..2026-11-17 → …/gsc/2026-11-20 (982 query rows in 1 call, 1757 page rows in 1 call)`.
- `./marketing/weekly.sh --dry` (real pull, Astro up), log:
  ```
  gsc: 2026-10-21..2026-11-17 → …/gsc/2026-11-20 (982 query rows in 1 call, 1757 page rows in 1 call)
  totals: …/gsc/2026-11-20/seo-report.json
  dry run: skipping claude -p
  ```
  Run note: `result: dry`, `search console: ok`, `totals: ok`. `seo-report.json` is valid JSON, mode 644.
- `daili-seo.sh report --date 2026-11-20`: no "is CUT" line (grep count 0). It prints `NON-BRAND: 2203 views, 9 clicks (523 rows)`.
- Failure test (`WEEKLY_SEO_CMD=/tmp/no-such-dir/daili-seo.sh`, dry run): the job exits 0, there is no `seo-report.json` and no temp file is left. Log: `totals: daili-seo.sh exited 127: ./marketing/weekly.sh: line 126: /tmp/no-such-dir/daili-seo.sh: No such file or directory`. Run note: `totals: failed (daili-seo.sh exited 127: … No such file or directory)`.
- Extra test (`WEEKLY_SEO_CMD=/bin/echo`: exits 0, but the output is not JSON): no `seo-report.json`, and the run note says `totals: failed (output empty or not valid JSON)`.
- `npm run build` (foreground): all steps passed, "build OK · 3759 pages". `npm test`: detector OK, test-check-help OK (99 cases), help search OK, test-blog-i18n OK (48 cases). The build changed no tracked file.

## Cleaned up
Neither of these existed before the tests (checked first):
- `Family Planner/marketing/weekly/runs/2026-11-20.txt`, and the then-empty `runs/` folder. The dry run made the folder; the job makes it again on Monday.
- `Family Planner/marketing/gsc/2026-11-20/` (`queries.json`, `pages.json`; the failure tests had already removed `seo-report.json`).
The older folders (`gsc/2026-10-21` … `2026-11-16`, `weekly/*.md`) were not touched. The test lines stay in `~/Library/Logs/daili-marketing-weekly.log`, as with earlier tests.

## Open items for the owner
- The first real Monday with this change is **2026-11-23 07:00** (the Mac must be on and awake). Planning Claude checks the run note (list item #170).

## Help impact
none
