# 006 — Help: "pricing" finds Daili Plus

**Status: DONE** · commit `93b37e7` on main, pushed (this report is the commit after it). `./deploy.sh` not run.
`claude-prompts/2026-10-22/007-hero-watch-cycle-1500.md` appeared during the run. It is not mine, so I left it uncommitted.

## Plus article (25 locales)
- **Price:** step 2 now says what Plus costs, with the wording of each locale's homepage FAQ ("€9.99" + that FAQ's words for the euro area). en: "Plus costs €9.99 a year in the euro area; the app shows the price in your store's currency. No trial."
- **en keywords:** `pricing, how much, upgrade, premium, paid, billing, money, fee, subscribe, renew, charge, expensive`.
  I changed the prompt's list in one way: I took out **cost** and **buy**. The new body already has "costs" and "when you buy", so those two keywords would add nothing (the prompt's own rule). In their place I put **charge** and **expensive**.
- **de keywords:** `upgrade, premium, bezahlen, kaufen, abrechnung, geld, gebühr, abonnieren, verlängern, teuer, kostenpflichtig, vollversion`.
  I left out kosten, kostet and wie viel: the text already has kostenlos, kostet and "wie viele", so search finds those words anyway.
- **Other 23 locales:** done. In every locale, no keyword is already in the article's own text (checked after the search's normalization), and no keyword is part of another keyword.
- **en body:** the price made it 158 words, over the 150 limit. I cut 8 words without losing a fact: "3 free AI actions", "shared by the family", "when free actions run out", "and AI actions left", "the app or account", "Details: Terms of Use". The translations still say the same facts.
- `updated` / `translatedFrom` are now `2026-10-22`. `check:help` is green.

## Second-try search
- `help-search.js`: the matching moved into `find(words)`. When it finds nothing (and the language is not one of the `NO_SPACES` five), search runs `find(words.map(cut))` once more. `cut` keeps the first `max(4, length − 3)` characters of words with 5+ characters. A search miss is only counted when both tries find nothing, and it is sent exactly as the person typed it. Results look the same as normal results.
- **How the test works:** `tools/test-help-search.mjs` runs the real `help-search.js` on a tiny fake DOM. I did not copy the matching code into the test.
  - Each cut word is pinned by two searches. An article whose text is exactly the cut word must be found. One whose text is the cut word minus one letter must not be found.
  - It also covers: pricing → price; a first-try hit stays unchanged; a miss is only counted after both tries; title hits come first; `ja` does no second try.
  - When `dist/` exists, it also runs the built search index of `/help/` (pricing, costs, how much, cost) and `/de/help/` (kosten, wie viel, preise, gebühr) and checks that Daili Plus is found.
  - The test runs in both `test` and `build`.
- **The test can fail:** I changed `max(4, …)` to `max(3, …)` and the test went red with 3 failures (costs, kosten, add events). Then I put it back, and it is green again.
- **No browser check:** I did not type the queries in a browser. The test runs these queries on the built index with the real script. "xyzzyq" (no result shown, miss sent) is checked in the fake-page cases only, not on the built index.

## Build
```
content OK · 28 locale(s) · 519 keys each
legal OK · 2 document(s) × 28 locale(s)
help OK · 94 article(s) · 25 locale(s) · 74 app routes checked
test-check-help OK · 99 cases
build OK · 3233 pages · 3203 in hreflang clusters
detector OK · 32 cases · 28 locale(s) built
help search OK · 26 cases · 2 built page(s)
```
`dist/help/en.json` and `de.json` (the files the app loads) have the new price sentence.

## Report only, no change
**94 of 94** English articles have at least one keyword that is already in their own text. The 3 worst: `anywhere/widgets` (12 of 12), `notes/notes` (12 of 12), `budget/bills` (11 of 11).

## Help impact
`account-plus: shows the price; search also finds near word forms ("pricing" → "price")`

## Owner
- Run `./deploy.sh`. The app also gets the new Plus text from this deploy.
