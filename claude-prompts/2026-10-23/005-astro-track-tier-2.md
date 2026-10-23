# Astro — start tracking tier-2 stores (SE, DK, NO, PL, BR, CZ)

## Goal
The ASO strategy (`~/Claude/Projects/Family Planner/marketing/aso/STRATEGY.md`
§2) puts Sweden, Denmark, Norway, Poland, Brazil and Czechia in tier 2:
5 tracked words each, checked monthly. Astro writes only — no store change,
no repo code. Ammar approved this on 2026-10-23. Independent of the 1.12.0
release; can run any time.

## Before you start
`claude mcp list` → `astro` must be connected. Not connected → stop,
report `blocked` (Astro must be open, Settings → MCP Server on).

## Steps
1. For each storefront below: if Daili (App Store id `6800427546`) is not
   tracked there, add it (`add_app`). Then add these keywords
   (`add_keywords`). The words come from the research in
   `store-listings/04,05,06,13,11,14-*.md`.

   | Store | Keywords |
   |---|---|
   | SE (se) | familjekalender, gemensam kalender, inköpslista, matsedel, delad kalender |
   | DK (dk) | familiekalender, fælles kalender, indkøbsliste, delt indkøbsliste, madplan |
   | NO (no) | familiekalender, delt handleliste, handleliste, gjøremål, delt kalender |
   | PL (pl) | kalendarz rodzinny, organizer rodzinny, lista zakupów, wspólny kalendarz, planer rodzinny |
   | BR (br) | agenda da família, agenda compartilhada, lista de compras, organizador familiar, calendário familiar |
   | CZ (cz) | rodinný kalendář, sdílený kalendář, nákupní seznam, jídelníček, rodinný plánovač |

   If Astro uses a different store code (e.g. `sv`, `da`, `nb`), use Astro's
   code and say which one in the report.
2. 🔴 **Never add** a word that reads as contraception: `familjeplanering`
   (SE), `familieplanlægning` (DK), `familieplanlegging` (NO),
   `planowanie rodziny` (PL), `planejamento familiar` (BR), `plánování
   rodiny` / `plánované rodičovství` (CZ). Never add competitor app names.
3. Do **not** remove, tag or note anything that already exists in any store.
4. Read back with `get_app_keywords` per store and record rank + popularity
   + difficulty for every new word (Astro may need a minute — if a value is
   still empty, say so, don't guess).

## Output
Append a section `## 2026-10-23 — tier-2 tracking` to
`~/Claude/Projects/Family Planner/marketing/aso/2026-10-20-baseline.md`
(file-write tool, never a heredoc): one table per store. Flag any word
already at rank 1–50 with popularity ≥ 20, and any store where ALL five
words sit at popularity 5 (= no measurable volume; tier 2 may be too early
there).

## Commit & push
Only the report: `docs(report): 2026-10-23 005 astro tier-2 tracking`. Push. No deploy.

## Report
`claude-reports/2026-10-23/005-astro-track-tier-2.md`, a few lines: what
was added per store, Astro's store codes if they differ, anything refused,
the flagged words and the "all at floor" stores.
`## Help impact`: none.
