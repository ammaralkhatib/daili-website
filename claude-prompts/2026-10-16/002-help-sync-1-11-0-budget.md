# Help sync 1.11.0 — part 1: Budget (4 updated + 3 new articles)

## Goal
App 1.11.0 (17) changes Budget a lot (review round 2026-10-15: redesign,
category sheet, number pad, quick add, Compare months, Repeating screen,
rollover, offline, switcher sheet). Make the Budget topic true for 1.11.0 in
English and every `HELP_LOCALES` language, with the pictures from app prompt
`2026-10-16/006`. Part 2 (`003`) does Cycle, Habits and Settings.

**Do not deploy.** `LIVE_APP_VERSION` stays as it is. New articles carry
`since: 1.11.0` (the app shows them from 1.11.0; the site after Ammar's
store-day bump). Updated articles keep their `since`.

## Sources (read in place — the reports are the fact list)
- App reports `../familyplanner-app/claude-reports/2026-10-15/003`–`014`
  and `2026-10-16/001` — their `## Help impact` and "what changed" parts.
- API reports `~/Herd/familyplanner-api/claude-reports/2026-10-15/001`–`006`
  and `2026-10-16/001` (alert text includes carried money).
- Plan: `~/Herd/familyplanner-api/claude-prompts/BUDGET-PLAN.md` §13–§14.
- Labels: the app's ARB files (`../familyplanner-app/lib/l10n/`). Check the
  app code when a report is unclear. Do not guess.
- Picture ids + alt texts: app report `2026-10-16/006` (`## Help impact`).

## Scope
- In: `help/<code>/budget/*.md`, `help/media*.json` +
  `static/help/media/**` for the budget ids (already written by the app's
  script — commit them), `help/routes-allowlist.json` (only if a route needs
  a `pending` entry — it should not), `npm run build`.
- Out: `LIVE_APP_VERSION`, legal pages, other topics, home page, blog.
  🔴 Untracked files that are not yours (`claude-reports/2026-10-01/`,
  `static/assets/img/blog/…`, `static/assets/img/photos/`): leave them untracked.

## Articles (English facts; short sentences; the voice of the existing articles)
Use the app's NEW words everywhere: "Coming up" (not "Planned"), "Split
costs", "Settle up", "Mark paid", "Who pays whom", "No one", "Not set",
"Set a limit", "+ Add expense" — check each against `app_en.arb`.

1. **`budget-start`** (update) — "Plan your family budget". Creating is
   shorter (icon square, one period control, one card, pinned Create; "Starts
   on" can be "Last day of the month"; the empty list offers Household ·
   Holiday · Party). The budget screen: overdue bills on top, what's left
   and about how much per day, a colour stripe of where the money went,
   "Set a limit", "+ Add expense". Tap a category → its own sheet (what's
   left, per day, last month, entries, Show all, Edit limit, "Add to …";
   picture `budget-category` in the text). Switch budgets: tap the budget
   name with ⇅ → "Your budgets" list (New budget, All budgets). Offline: you
   can see a budget you opened before but not change it; an expense that
   couldn't be sent is kept and offered next time. The month-end card (first
   7 days of a new period, repeating budgets with a limit, once per phone per
   period). Who sees a budget (unchanged). Move the routes
   `/budget/:id/categories` and `/budget/:id/settings` to article 7.
   `media: budget-start`.
2. **`budget-add`** (NEW) — "Add an expense". The number pad; your last
   category is already picked; the day chip at the top; payer + split in one
   row; repeat, bill, note and payment method under "More"; Undo after
   saving. From Home: the Budget tile's "+" and Quick add → "Expense". Swipe
   an entry right (or More → "Add again") to copy it, dated today.
   `media: budget-entry`, `routes: /budget/:id` (only if check-help allows a
   route in two articles — else no `routes`, `tryIt: /budget`), `order: 2`.
3. **`budget-bills`** (update) — "Coming up" bills, overdue bills on top of
   the budget, "Mark paid". Alerts at 80 % / 100 % — with rollover they count
   the money carried in, and the alert shows that total limit. Rest unchanged.
4. **`budget-split`** (update) — the new words; the settle-up history and
   "Last settled on"; the settle sheet has a date and warns above the
   suggested amount. `media: budget-split` (re-shot).
5. **`budget-trends`** (NEW) — "Compare months". `/budget/:id/trends`: bars
   per period, tap a bar for its numbers, categories vs the previous period;
   the month-end card links here. `media: budget-trends`,
   `routes: /budget/:id/trends`.
6. **`budget-repeating`** (NEW) — "Everything that repeats".
   `/budget/:id/repeating`: rent, subscriptions, salary per month; change
   from the next one; end a repeat in one tap; show its entries.
   `media: budget-repeating`, `routes: /budget/:id/repeating`.
7. **`budget-settings`** (NEW) — "Budget settings, categories, rollover and
   export". Details first with a pinned Save, then More (Split costs,
   Categories, Export, Delete). Categories: each row shows this period's
   spending, "+ New category" at the top, a warning when category limits add
   up to more than the budget. **Move what's left to next month** (repeating
   budgets with a limit; overspending is never carried; "of €2,500 + €212
   from September" under "left"). CSV export opens in Excel (in German-style
   regions it uses `;` and `12,50`). Who may change or delete (unchanged:
   the creator, or an admin who can see it). `media: budget-settings`,
   `routes: /budget/:id/settings, /budget/:id/categories`.

Front matter as in existing articles: `updated: <today>`, `order` 1–7 in the
order above, `related` inside the topic (+ `notifications-choose` for bills,
`start-edit-home` for budget-add). Keep the one existing tip on
`budget-start` only; no new tips.

## Constraints
- Translate every new and changed article into all `HELP_LOCALES`
  following `claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md`, with the
  app's own labels per language (pt = Brazilian "você", fr "tu", id
  "Anda"). Money examples in the locale's currency style.
- Brand: follow the existing articles' casing of "daili".
- `npm run build` green, `node tools/check-help.mjs` green.

## Verify
Build. Spot-check `en` `budget-start` + `budget-settings`, `de`
`budget-add`, `ja` `budget-trends`, `pt` `budget-repeating`; the app JSON
(`dist/help/en.json`) lists 7 budget articles; the new routes resolve to an
article.

## Commit & push
`docs(help): 1.11.0 part 1 — Budget`; body
`Prompt: claude-prompts/2026-10-16/002-help-sync-1-11-0-budget.md`.
**Push. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-10-16/002-help-sync-1-11-0-budget.md`, half a page:
articles × locales, pictures found/missing, routes, facts you corrected
against the code, build lines, SHA + push. `## Help impact`: n/a.
