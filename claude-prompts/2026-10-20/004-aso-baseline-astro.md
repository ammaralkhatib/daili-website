# ASO baseline from Astro (first hand run before automating)

## Goal
Ammar's Astro app (App Store keyword tracker) now talks to Claude Code
through its MCP server. This is a **read-only data run**: pull where Daili
ranks today, find the keywords worth working on, and write one report. No
code, no store changes. It is also the dry run for the weekly automation, so
record exactly which Astro tools exist and what they return.

## Before you start
Run `claude mcp list`. `astro` must show as connected
(`http://127.0.0.1:8089/mcp`). If it is missing or failing, stop and report
`blocked` — Astro must be open with Settings → MCP Server switched on.

## Steps
1. **List Astro's MCP tools** (name + one line each) — goes into the report
   so the weekly prompt can name them later.
2. **The app.** Daili on the App Store = id `6800427546`. If Astro does not
   track it yet, say so and stop after step 1 (Ammar adds it in Astro).
3. **Tracked keywords now**, for these storefronts: US, GB, DE, AT, NL, FR,
   ES, IT. Per keyword: rank, popularity, difficulty (whatever Astro calls
   them). Note Astro's date for the data.
4. **Sort into three groups** per storefront:
   - **Keep** — rank 1–10.
   - **Push** — rank 11–50 and popularity worth it (say what threshold you
     used and why). These are the "shown but not clicked" words — the main
     output.
   - **Drop** — rank > 100 or popularity near zero after weeks of tracking.
5. **New candidates** from Astro's suggestions around: family calendar,
   family planner/organiser, shared shopping list, chores/to-dos for family,
   meal plan, family budget, habits for kids. Max 10 per storefront.
   🔴 Filter honestly — reject any word for a feature Daili does NOT have
   (co-parenting/custody schedules, bank-linked budgeting, chat/messaging,
   location sharing) and any word that reads as contraception: "family
   planning" and its literal translations (familjeplanering,
   familieplanlægning, familieplanlegging, aile planlaması). Say what you
   rejected.
6. **Compare with what we ship.** Current subtitle + keyword field per
   locale are in `~/development/flutter_projects/familyplanner/store-listings/`
   (`00-MASTER-en-US.md`, `01-en-GB.md`, `02-de-DE.md`, …). They may differ
   from what is live — say so where unsure. Per storefront: which Push/New
   words are missing from title + subtitle + keyword field, and which words
   in the keyword field earn nothing (Drop). German: Apple does not split
   compounds — check whole words.
7. **Suggest** at most one new keyword field (≤ 100 characters, comma
   separated, no spaces after commas, no word that already appears in title
   or subtitle) for **en-US** and **de-DE** only. Do NOT edit the
   store-listings files.

## Output
- Data + groups: write
  `~/Claude/Projects/Family Planner/marketing/aso/2026-10-20-baseline.md`
  (create the folders; use the file-write tool, never a heredoc — `cat` is
  `bat` on this Mac). Tables, one section per storefront.
- Report (below) is the half-page summary.

## Commit & push
Only the report: `docs(report): 2026-10-20 004 aso baseline`. Push. No
deploy. (The baseline file lives outside the repo on purpose.)

## Report
`claude-reports/2026-10-20/004-aso-baseline-astro.md`, half a page: Astro's
tool list, data date, top 5 Push words for US and DE, the two suggested
keyword fields, anything Astro could not give (e.g. Google Play).
`## Help impact`: none.
