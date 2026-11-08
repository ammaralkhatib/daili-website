# 002: Astro keyword check, 1.12.0 verdict, tracking sync, review for 1.16.0

**Status: done.** No store change, no repo code. Astro connected. No sub-agents used. The commit holds only this report; the planning docs went first in `cb34fe03`.

Files (outside the repo):
- `marketing/aso/2026-11-08-review-1.16.0.md` (176 lines, about 3 pages; I can't measure pages exactly)
- `marketing/aso/keyword-log.md` (only the three verdict cells)

## Verdicts (1.12.0, +15 days)
- **en-US: unclear.** family hub 38→75 (best 15 on 10-28, then 129, out, 75). family organiser not measured before.
- **de-DE: unclear (mixed).** haushaltsplaner DE 1000→83, AT 208→68; wochenplaner DE 1000→87, AT 128→80; essensplaner AT 204→105. No move in DE for essensplaner, planer, termine. AT planer, termine not measured before.
- **nl-NL: not yet.** familie agenda 28→25, gezinsplanner 14→17.

## Tracking: 23 added, 3 removed
- **US +4:** family organiser, daily planner, schedule planner, list reminders. **Removed:** family feud, family style, family album.
- **DE +1:** kalender familie.
- **AT +4:** einkaufsliste familie, planer, termine, geburtstagskalender.
- **GB +4:** family chores, daily planner, todo list, calendar organizer.
- **NL +1:** verjaardagskalender.
- **FR +3:** organisation repas, calendrier rappel, planning partagé.
- **ES +4:** calendario tareas, organizador semanal, calendario cumpleaños, compartir familia.
- **IT +2:** calendario compleanni, pianificatore pasti.

Read back with `get_app_keywords`: all rows present, all have pop and diff. The review lists "no searched phrase" words and the "propose removal" rows.

## Swaps proposed (Ammar decides; counted with python)
- **US (99 chars):** `mom` → `budget`, family budget 24/39.
- **NL (97):** `verjaardag` → `verjaardagskalender`, 34/11; `kind` out.
- **FR (94):** `organiseur` → `semaine`, menu de la semaine 50/48.
- **ES (97):** `supermercado` → `planificador`, `hijo` + `cole` → `comida`, planificador de comidas 39/23.
- **IT (99):** `impegno` → `pianificatore`, `todo` out, pianificatore pasti 25/11.
- **GB, DE + AT:** no change.

## What Astro could not give
- **Popularity of a chosen phrase without adding it.** `search_app_store` has no pop. Removals were limited to three rows, so I added only phrases that showed a figure in suggestions or extraction. So "no searched phrase" means none found, not proof none exists.
- **Pop history.** Pop exists only for 10-21 and today, so the "pop 5 for 4+ weeks" Drop test can't be met. No word was dropped on pop.
- **One consistent pop figure.** Rows and suggestions disagree for some phrases (ES calendario familiar 5 vs 23, IT calendario famiglia 11 vs 31).
- **Ratings for GB and IT.** Astro returned no row for either store.
- One extraction hit Astro's 30 requests/min limit; the retry worked.

## Worth checking
- **Below the floor:** AT `termine` came back pop 5, under part B's floor. I added it because part A asked for it, and listed it as "propose removal".
- **Rule conflict:** the prompt calls 1.12.0 "younger than 2 releases", but 1.13, 1.14 and 1.15 have shipped since. I followed the prompt and proposed no undo; the question is in the review.
- **Removal confirmation:** Astro's `remove_keywords` asks for confirmation first. I treated the prompt's named list as that confirmation.
- **Tier-1 ratings:** DE now has 12 ratings; the prompt's "~4 DE" is out of date.

## Help impact
none
