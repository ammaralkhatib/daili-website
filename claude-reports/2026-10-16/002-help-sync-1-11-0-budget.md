# Help sync 1.11.0 — part 1: Budget

**Prompt:** `claude-prompts/2026-10-16/002-help-sync-1-11-0-budget.md`
**Completed:** 2026-10-16 · **Status:** done

## Summary

The Budget topic now matches app 1.11.0. It has 7 articles in all 25 help languages. The commit is pushed, and `./deploy.sh` was **not** run. `LIVE_APP_VERSION` is unchanged.

Step 0: there were no planning docs to commit.

## Articles × locales (7 × 25 = 175 files)

| # | id | kind | media | routes |
|---|---|---|---|---|
| 1 | budget-start | updated | budget-start (+ budget-category in the text) | /budget, /budget/new |
| 2 | budget-add | NEW, since 1.11.0 | budget-entry | /budget/:id |
| 3 | budget-bills | updated | notifications-choose | /budget/:id |
| 4 | budget-split | updated | budget-split (re-shot) | /budget/:id/split |
| 5 | budget-trends | NEW | budget-trends | /budget/:id/trends |
| 6 | budget-repeating | NEW | budget-repeating | /budget/:id (borrowed, see below) |
| 7 | budget-settings | NEW | budget-settings | /budget/:id/settings, /budget/:id/categories |

- **How:** I wrote the English first, keeping each one under the 150-word limit. A sub-agent checked the English against the app code. Then 6 sub-agents translated (4 languages each). They wrote `{{arbKey}}` placeholders, and a script filled those in with the app's own labels for each language.
- **Pictures:** all 7 budget pictures were found for every language (25 × 7 = 175 webp files). Nothing is missing.
- **Picture lists (`help/media*.json`):** I committed only the 5 new budget ids. The cycle, habits and account ids (part 2, prompt 003) are still uncommitted in the working tree. Those ids belong to no article yet, so `check-help` in the working tree shows 7 "orphan" errors until prompt 003 runs. Because of this, I ran the checks in a clean worktree (HEAD + only my staged changes).
- **Allowlist:** `/budget/:id/trends` was removed from `pending`.

## Facts corrected against the code

- **Prompt said:** the month-end card links to Compare months. **Code:** its "See September" button shows the ended month on the budget screen (`budget_screen.dart:1547`). Compare months opens from the **Compare months** link under "left" and from **⋯** (repeating budgets only). The article says that.
- **`/budget/:id/repeating`:** this is not in the app's `RoutePaths`, so `check-help` refuses it. budget-repeating uses `/budget/:id` instead. check-help allows the same route in two articles, so budget-add also has `/budget/:id`.
- **The fact-check sub-agent found 5 issues, all fixed before translating:**
  1. After you open a budget once, the Home tile opens that budget, not the list. **New budget** is in the switcher.
  2. The dashed line in Compare months is today's limit. A bar "over" is shown by its colour.
  3. The save button reads "Add £34.00", not "Add".
  4. **Add again** is under **More: …** and opens a copy for you to save.
  5. **Who can see it** only shows when others are in the family.
- **Labels:** the button is **Add expense** (the + is an icon). Quick add's row is **Expense**.

**Left out to stay under 150 words:** "Add to …" on the category sheet (it is only in the picture's alt text), the empty list's Household · Holiday · Party, and the private-budget owner also getting alerts. I also took out "tap a bill on the calendar to open its budget" and "tap Add after the last item is ticked" from budget-bills.

**Translator notes:**
- pt pictures use European Portuguese ("Renda"), while the text is Brazilian ("aluguel").
- In sv, da and nb, the app calls the feature "Hushållsbudget" and similar names, and the articles use that.
- Each rollover example uses the currency and amounts from that language's own pictures.

## Verification (clean worktree, HEAD + staged)

```
$ node tools/check-help.mjs
help OK · 89 article(s) · locale(s) en, de, … id · 73 app routes checked
$ npm run build
build OK · 2748 pages · 2728 in hreflang clusters
detector OK · 32 cases · 28 locale(s) built
```

- `dist/help/en.json` has 7 budget articles. The new routes `/budget/:id/trends`, `/budget/:id/settings` and `/budget/:id/categories` each resolve to an article.
- Spot-checked:
  - en: budget-start, budget-settings
  - de: budget-add
  - ja: budget-trends
  - pt: budget-repeating

## Commit & push

- `5e00977` `docs(help): 1.11.0 part 1 — Budget` (376 files). Pushed `db52b7f..5e00977`.
- `./deploy.sh` was not run.
- Untracked files that are not mine were left untracked.

## Open items for the owner

- Prompt 003 must commit the remaining media ids (cycle, habits, account-temperature).
- Small app text bug (from the app's report 006): German "Versicherungen ist überfällig".

## Help impact

n/a
