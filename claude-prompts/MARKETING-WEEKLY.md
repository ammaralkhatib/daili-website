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
   If the folder or files are missing → section 1 says "no Search Console
   data this week (reason)" and you skip to section 2.
2. **Astro** (MCP server `astro`) — read-only tools only:
   `list_apps`, `get_app_keywords`, `get_keyword_performance`,
   `get_keyword_suggestions`, `search_app_store`, `get_app_ratings`.
   Daili = App Store id `6800427546`. If Astro is not reachable → section 2
   says so.
3. **Last week's report** — the newest older file in `marketing/weekly/`, to
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
max 5 rows each, columns: query · page · impressions · clicks · position:
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
