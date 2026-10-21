# 001 — Astro: track GB, NL, FR, ES, IT

**Status:** done. Only Astro was written to. No store listing and no repo code changed.
Full tables: `~/Claude/Projects/Family Planner/marketing/aso/2026-10-20-baseline.md` → `## 2026-10-21 — new tracking`.

**Added** (Daili iPhone, `6800427546`; it was already a tracked app, so `add_app` was not needed, because Astro sets stores per keyword):
- **GB, NL, FR, ES, IT:** 6 words each, exactly as listed in the prompt (the store code for GB is `gb`).
- **US:** household planner, weekly planner, family budget, chore app.
- **DE:** planer, termine, kalender teilen.

That makes 37 words. Astro refused none and skipped none. Every word came back with popularity and difficulty filled in (read back at about 08:03 UTC), so no value is missing. Nothing that already existed was removed, tagged or noted. No contraception-sounding words and no competitor names were added.

**Flagged (rank 1–50, popularity ≥ 20):** only NL `familie agenda` (#28, pop 20).
Close but not flagged: GB `family organiser` #16 (pop 17), NL `gedeelde agenda` #53 (pop 28), DE `kalender teilen` #50 (pop 11).

**Notes:**
- Ranked, but with popularity 5: IT `organizzatore familiare` #4, IT `agenda familiare` #6, NL `gezinsagenda` #9, ES `organizador familiar` #11, NL `gezinsplanner` #14.
- None of the high-popularity list and meal words ranks in any of the five stores: shopping list, lista de la compra, lista della spesa, menu de la semaine, calendrier partagé, and so on. The same is true in US and DE.
- `household planner` (pop 5) and `weekly planner` (no rank) give the answer the 2026-10-20 en-US suggestion was waiting for. DE `planer` has pop 58 but no rank.

## Help impact
None.
