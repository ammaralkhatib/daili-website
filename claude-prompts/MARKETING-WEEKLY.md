# MARKETING-WEEKLY — the Monday report (run headless by marketing/weekly.sh)

You are running unattended on Ammar's Mac. Nobody is watching. Your ONLY
output is one report file. You change nothing else: no repo file, no git,
no deploy, no Astro writes (no `add_*`, `remove_*`, `set_*`, `manage_tag`),
no store text. If something is missing, say so in the report and carry on.

Today's date: take it from `date +%F`. Call it <DATE>.
Write the report to `~/Claude/Projects/Family Planner/marketing/weekly/<DATE>.md`
(file-write tool; never a shell heredoc — `cat` is aliased to `bat` here).

## Inputs
1. **Search Console** — `~/Claude/Projects/Family Planner/marketing/gsc/<DATE>/`
   holds `queries.json` and `pages.json` (last 28 days, written by
   `marketing/gsc-pull.mjs` just before you start) and maybe `ERROR.txt`.
   It also holds `seo-report.json` — the counted totals, made by
   `~/Claude/Projects/Family Planner/daili-seo.sh` just before you start
   (`non_brand`, `brand`, `groups.A/B/C`, `queries_cut`, `pages_cut`).
   If the folder or files are missing → section 1 says "no Search Console
   data this week (reason)" and you skip to section 2.
2. **Astro** (MCP server `astro`) — read-only tools only:
   `list_apps`, `get_app_keywords`, `get_keyword_performance`,
   `get_keyword_suggestions`, `search_app_store`, `get_app_ratings`.
   Daili = App Store id `6800427546`. If Astro is not reachable → section 2
   says so.
3. **Last week's report** — the newest older `<date>.md` file directly in `marketing/weekly/`
   (not the `runs/` folder), to
   show what moved. First run: no comparison.
4. **What Daili really does** — `~/development/flutter_projects/familyplanner/daili-website/site.config.mjs`
   (`HOME_FEATURES`, `BLOG_POSTS` titles + `features`) and the blog posts'
   slugs. Never suggest content for a feature Daili does not have
   (custody/co-parenting schedules, bank-linked budgeting, chat, location
   sharing).

## Rules
- **Filter out brand queries** before anything else: `daili` and its
  misspellings/transliterations (daily-like spellings, dailli, daylie, dalili,
  даили, дейли, دايلي …), `daili app`, `minzi`. Report their total in one line.
- 🔴 Never propose "family planning" or its translations (familjeplanering,
  familieplanlægning, familieplanlegging, aile planlaması, planning familial,
  planificación familiar, Familienplanung, gezinsplanning) — it means
  contraception.
- Never propose competitor names as keywords.
- Numbers come from the inputs only. Never estimate a figure.

## Report shape (max ~1 page)
### 0. One-line summary
### 1. Search Console (non-brand, last 28 days)
Totals (clicks, impressions) and the change vs last week. Then three lists,
max 5 rows each, columns: query · page · impressions · clicks · position.

Where the numbers come from:
- The non-brand totals (clicks, views = impressions), the one brand total line
  and the rows of lists A / B / C come from `seo-report.json` (`non_brand`,
  `brand`, `groups.A` / `groups.B` / `groups.C`). **Never add up numbers by
  hand.**
- The change vs last week: last week's report numbers against this week's
  `seo-report.json`. If last week's report says its totals were counted by
  hand or its pull was cut at 1,000 rows, write "not comparable (last week's
  numbers were cut)" instead of a change.
- If `seo-report.json` is missing → write "no counted totals this week
  (seo-report.json missing)" in place of the totals, and still give lists
  A / B / C from `queries.json`.
- If `queries_cut` or `pages_cut` is true in `seo-report.json` → one warning
  line (that file was cut at 1,000 rows, so its totals are too low).
- `groups.B` gives the position > 30 rows; whether a ranking page is
  off-topic is still your call.

The lists:
- **A — close to page 1** (position 8–30, impressions ≥ 10): improve that page.
- **B — shown, no good page** (position > 30, or the ranking page is off-topic):
  a new post, help section or feature-page section.
- **C — page 1, no clicks** (position < 8, CTR < 1 %, impressions ≥ 20):
  rewrite title/description.
Include help pages in all languages, feature pages and the blog.
### 2. App Store (Astro)
Per tracked store: ratings count, words that moved ≥ 10 places (up or down),
new Keep (1–10) and new Push (11–50, pop ≥ 20) words. One line for stores
with no change.
### 3. Max 3 suggested actions
Each: what, where (page or store field), why (the number), effort (S/M).
Ammar and Planning Claude decide; you only suggest.
