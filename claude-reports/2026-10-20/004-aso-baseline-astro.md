# 004 — ASO baseline from Astro

**Status:** done. Read-only: nothing was added, removed or tagged in Astro, and no store-listing file was edited.
Full tables: `~/Claude/Projects/Family Planner/marketing/aso/2026-10-20-baseline.md`.

**Astro tools** (`astro`, connected at `http://127.0.0.1:8089/mcp`):

| Tool | What it does |
|---|---|
| `list_apps` | Lists the tracked apps, with keyword counts and stores |
| `get_app_keywords` | Tracked keywords for one app: rank, previous rank, popularity, difficulty, app count, last update |
| `get_keyword_performance` | One keyword across apps; optional history and stats (trend, volatility) |
| `get_keyword_suggestions` | AI suggestions per app and store. Takes no seed phrase |
| `extract_competitors_keywords` | Word combinations from the apps ranking for an already tracked keyword, with popularity |
| `search_app_store` | Live search results. Gives `yourAppRanking` only inside the top 50 |
| `get_most_searched_keywords` | Top searches per store and category (paginated) |
| `get_app_ratings` | Rating and review count per store, optional history |
| `add_app`, `add_keywords` | Write. `add_keywords` is the only way to get popularity for a word you pick |
| `remove_keywords` | Write, destructive. Needs confirmation |
| `set_keyword_note`, `set_keyword_tag`, `manage_tag` | Write: notes and tags |

**Data date.** 2026-10-21 07:48 UTC. Six US rows were last refreshed 2026-10-13. Astro has only about 8 days of history, so every Drop call is provisional.

**Coverage.** Astro tracks Daili in **US, DE and AT only**. GB, NL, FR, ES and IT got top-50 spot checks through `search_app_store`. Two of them already have Keep words: NL `gezinsagenda` #9 and IT `organizzatore familiare` #4. NL `familie agenda` #28 (pop 20) is the only strict Push word in the whole run.

**Push words (rank 11–50, pop ≥ 20).** There are **none in US or DE**. Pop 20 is the threshold because Astro's scale bottoms out at 5. The top 5 below are "Push-next" (rank 51–200 or unranked, pop ≥ 20):
- **US:** family hub (74, pop 29, diff 17), family calendar (172), shared calendar (unranked), family app (fell from 23 to unranked), chore chart.
- **DE:** essensplaner (57), haushaltsplaner (34), wochenplaner (31), familienplaner (24, the title word, unranked), familienkalender (22, the subtitle word, 182).

**Two findings that matter more than keywords:**
1. The `daili` brand is **unranked in the US**, but #1 in DE and AT. Apple seems to read it as "daily".
2. The title and subtitle are indexed (live text was checked against the listings), yet Daili still doesn't rank for them in DE. The limit is ratings and authority (1 US rating, 4 DE ratings), not metadata.

**Suggested keyword fields** (not applied):
- en-US (96): `planner,grocery,shopping,meal,chore,hub,organiser,schedule,reminder,daily,kids,mom,widget,budget`
- de-DE (98): `familie,kalender,einkaufsliste,essensplaner,wochenplaner,haushaltsplaner,planer,termine,geburtstag`

  The DE field today holds the stems `essensplan`, `wochenplan` and `haushalt`. Apple doesn't split compounds, so they miss the `-planer` searches, which are the ones with volume.

**Rejected candidates:** family mart, family style, family feud, family album (off-intent), family sharing (Apple's feature), `organisateur` (French, offered in the DE, ES and IT stores), competitor brand names, and `kostenlos`/`gratuit` combos (pricing word, left to Ammar). No contraception, custody, chat or location terms came up.

**What Astro could not give:**
- Google Play (Astro is App Store only).
- Popularity for words I picked, without writing them to Astro.
- Suggestions seeded by a phrase.
- Ranks beyond 50 in untracked stores.
- Impressions or conversion.

**For the weekly automation:** add GB, NL, FR, ES and IT keywords in Astro first. Otherwise those five storefronts stay as spot checks.

## Help impact
None.
