# Astro — start tracking GB, NL, FR, ES, IT (+ a few US/DE words)

## Goal
Astro tracks Daili only in US, DE and AT, so the weekly report can say
nothing real about our other big stores. Add tracking (Astro writes only —
no store change, no repo code). Ammar approved this on 2026-10-21.

## Before you start
`claude mcp list` → `astro` must be connected. Not connected → stop,
report `blocked` (Astro must be open, Settings → MCP Server on).

## Steps
1. For each storefront **GB, NL, FR, ES, IT**: if Daili (App Store id
   `6800427546`) is not tracked there, add it (`add_app`). Then add these
   keywords (`add_keywords`):

   | Store | Keywords |
   |---|---|
   | GB | family organiser, family calendar, shared diary, family planner, shopping list, meal planner |
   | NL | gezinsagenda, familie agenda, gedeelde agenda, boodschappenlijstje, weekmenu, gezinsplanner |
   | FR | agenda familial, calendrier famille, calendrier partagé, liste de courses, menu de la semaine, organisation famille |
   | ES | organizador familiar, calendario familiar, calendario compartido, lista de la compra, planificador de comidas, agenda familiar |
   | IT | organizzatore familiare, calendario famiglia, calendario condiviso, lista della spesa, menu settimanale, agenda familiare |

2. Add to the existing stores:
   - **US:** household planner, weekly planner, family budget, chore app
   - **DE:** planer, termine, kalender teilen

3. 🔴 **Never add** a word that reads as contraception: "family planning",
   "planning familial" (FR — the French family-planning organisation),
   "planificación familiar" (ES), "pianificazione familiare" (IT),
   "gezinsplanning" (NL), "Familienplanung" (DE). Never add competitor
   app names (Apple guideline 2.3.7, and they muddy the data).
4. Do **not** remove, tag or note anything that already exists.
5. Read back with `get_app_keywords` per store and record rank + popularity
   + difficulty for every new word (Astro may need a minute to fill them —
   if a value is still empty, say so, don't guess).

## Output
Append a section `## 2026-10-21 — new tracking` to
`~/Claude/Projects/Family Planner/marketing/aso/2026-10-20-baseline.md`
(file-write tool, never a heredoc): one table per store with the new words.
Flag any new word that is already rank 1–50 with popularity ≥ 20.

## Commit & push
Only the report: `docs(report): 2026-10-21 001 astro tracking`. Push. No deploy.

## Report
`claude-reports/2026-10-21/001-astro-track-five-stores.md`, a few lines:
what was added per store, anything Astro refused, the flagged words.
`## Help impact`: none.
