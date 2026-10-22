# Help: "pricing" finds Daili Plus — useful keywords, the price, a second-try search

## Goal
dashi → Help → "Searches that found nothing" shows **pricing**. The answer
exists (`help/<locale>/account/plus.md`), but search missed it twice over:

1. Search is plain substring matching: every typed word must appear in the
   article. The article has the keyword `price`; "pricing" does not contain
   "price", so no match.
2. The keyword list is full (12 = the max in `tools/help-lib.mjs`), and most
   slots repeat words already in the title/summary/body (`daili plus`,
   `plus`, `cloud`, `cancel`, `founder`, …), so they add nothing.

And even when found, the article never says what Plus costs.

Done = "pricing", "cost", "how much", "costs", "invites", "reminders" (and
the same kind of words in every language) find the right article, and the
Plus article states the price. The app loads its Help text from
`daili.app/help/<lang>.json`, so the content part reaches the app with the
next deploy. (The app's own search gets the same second-try rule in app
prompt `2026-10-22/005`.)

## Scope
- In: `help/*/account/plus.md` (all 25 locales), `static/assets/help-search.js`,
  a new `tools/test-help-search.mjs`, `package.json` (wire the test into
  `test` and `build`), this prompt file.
- Out: every other article, `content/*.json`, templates, `build.mjs`, legal,
  blog, `deploy.sh`.
  🔴 Untracked files that are NOT yours (e.g. `claude-prompts/2026-10-21/`,
  `claude-prompts/MARKETING-WEEKLY.md`, `static/assets/img/photos/`): do not
  touch, stage or commit them.
- No file overlap with `005-home-watch-screens-faq.md`; run in either order.

## Requirements

### Part A — the Plus article (all 25 locales)

1. **Price sentence.** In step 2 (English today: "Tap **Get Plus**. You pay
   yearly, in your store's currency. No trial.") say the price. English:
   "Tap **Get Plus**. Plus costs €9.99 a year in the euro area; the app
   shows the price in your store's currency. No trial."
   Each other locale: take the price wording from THAT locale's homepage FAQ
   answer to "What does Daili cost?" in `content/<locale>.json` (English:
   "€9.99 in the euro area; the app shows the price in your currency"), so
   the price format and words match the homepage exactly. Do not invent a
   price or a currency the FAQ does not show.
2. **Keywords that earn their slot.** A keyword is useful only if it is NOT
   already found in the title, summary or body (after the search's own
   normalization: lower case, accents dropped). Replace the useless ones with
   words people type when they ask about money. English, final list (12):
   `pricing, cost, how much, upgrade, premium, paid, buy, billing, money, fee, subscribe, renew`
   Other locales: the same idea with that language's natural words (e.g.
   German: `kosten, kostet, wie viel, upgrade, premium, bezahlen, kaufen,
   abrechnung, geld, gebühr, abonnieren, verlängern` — but drop any that the
   German text already contains and use the slot for another). Keep only
   words this article actually answers (no "refund": the article does not
   answer it). Max 12, lower case (check-help enforces both).
3. Bump `updated:` in `en` and `translatedFrom:` in every translation to
   `2026-10-22`; keep `npm run check:help` green.

### Part B — second-try search (`static/assets/help-search.js`)

4. When the normal search finds **no** article, try once more with shorter
   words. The rule (the app uses the SAME rule — do not change it):
   - Skip the second try in the no-space languages (`ja`, `ko`, `zh-Hans`,
     `zh-Hant`, `th` — the existing `NO_SPACES` list).
   - Each typed word (after `norm()`, split on spaces): if it has **5 or
     more** characters, cut it to its first `max(4, length − 3)` characters;
     shorter words stay as they are. Length = JS `.length` after `norm()`.
   - Match again with the cut words, exactly like the first try (every word
     must appear; title hits first; then page order).
5. The search-miss event is sent only when the second try ALSO finds
   nothing. The text sent stays what the person typed (unchanged).
6. Results from the second try look exactly like normal results (no label).
7. **Test** (`tools/test-help-search.mjs`, plain node, no dependencies, like
   `tools/test-detector.mjs`): either load the file with a tiny fake DOM, or
   move the matching into a pure function inside the file that the test can
   reach — say which. Must pass:
   - cut words: `pricing→pric`, `invites→invi`, `rezepten→rezep`,
     `reminders→remind`, `costs→cost`, `kosten→kost`, `add events→add even`,
     `shop→shop`, `café→cafe` (after norm).
   - "pricing" finds an article that only has "price"; a query the first try
     already answers returns the first-try result unchanged (no second try);
     a miss is sent only when both tries find nothing; a `ja` page does no
     second try.
   - Prove the test can fail: break the rule once, see it red, put it back
     (one line in the report).
8. Wire the test into the `test` and `build` scripts in `package.json`.

## Constraints
- Zero dependencies, no inline script, CSP unchanged; results still built
  with `textContent`.
- The keyword limits (1–12, lower case) stay as they are — do not raise them.
- Brand: capital "Daili" inside sentences.

## Verify
- `npm run build` green (all its checks, incl. the new test).
- In `dist/help/index.html` (and `dist/de/help/`): type `pricing`, `costs`,
  `kosten`, `wie viel` → Daili Plus shows. Type `xyzzyq` → "no result" shows.

## Commit & push
`feat(help): pricing finds Daili Plus — useful keywords, the price, second-try search`;
body `Prompt: claude-prompts/2026-10-22/006-help-search-pricing.md`. Commit
this prompt file with it. **Push. Do NOT run `./deploy.sh`** (owner step).

## Report
`claude-reports/2026-10-22/006-help-search-pricing.md`, half a page: the
en + de keyword lists (other locales: one line, "done"), which test approach
you chose, the fail-proof line, build lines, SHA + push.
Report only, no change: how many of the English articles have keywords that
are already in their own text (one number + the 3 worst articles).
`## Help impact`: `account-plus: shows the price; search also finds near word forms ("pricing" → "price")`.
Owner item: `./deploy.sh` (the app picks up the new Plus text from it too).
