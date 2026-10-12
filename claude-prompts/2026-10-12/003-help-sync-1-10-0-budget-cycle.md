# Help sync 1.10.0 — part 1: two new topics, Budget (3 articles) and Cycle (2 articles)

## Goal
App 1.10.0 (16) adds Budget and Cycle. The Help center gets a topic for each,
with articles in English and every `HELP_LOCALES` language, and the pictures
from app prompt `2026-10-12/009`. Part 2 (`004`) does Weather, .ics import and
the feature picker; part 3 (`005`) updates existing articles and empties the
`pending` routes.

**Do not deploy.** `LIVE_APP_VERSION` stays `'1.9.0'` (set by prompt `002`);
the new articles carry `since: 1.10.0`, so the app shows them only from
1.10.0 and the site only after Ammar's store-day bump.

## Sources (read in place — the reports are the fact list)
- App reports `../familyplanner-app/claude-reports/2026-10-07/023`–`028`
  (Budget) and `2026-10-07/018`–`022` + `2026-10-08/001`, `008` (Cycle) —
  their `## Help impact` and "what changed" parts.
- API reports `~/Herd/familyplanner-api/claude-reports/2026-10-07/004`–`006`,
  `2026-10-08/001` (bill reminders ignore quiet hours; limit alerts wait).
- Plans: `~/Herd/familyplanner-api/claude-prompts/BUDGET-PLAN.md`;
  `../familyplanner-app/CLAUDE.md` §3 "Budget" and "Cycle tracker".
- Labels: the app's ARB files (`../familyplanner-app/lib/l10n/`). Check
  behaviour in the app code when a report is unclear. Do not guess.
- Picture ids + alt texts: app report `2026-10-12/009` (`## Help impact`).

## Scope
- In: `help/<code>/budget/*.md`, `help/<code>/cycle/*.md` (new), every
  `help/<code>/_ui.json` (two topic titles + summaries), `site.config.mjs`
  (`HELP_TOPICS` + `HELP_ICONS` only), `build.mjs` (`HELP_GLYPHS` only),
  `help/media*.json` + `static/help/media/**` for the ids `budget-start`,
  `budget-split`, `cycle-start` (already written by the app's script — commit
  them), `help/routes-allowlist.json` (remove `pending` entries that a new
  article now covers), `npm run build`.
- Out: `LIVE_APP_VERSION`, legal pages, home page, blog, changelog pages,
  every other article. 🔴 Untracked files that are not yours
  (`claude-reports/2026-10-01/`, `static/assets/img/blog/…`,
  `static/assets/img/photos/`): leave them untracked.

## New topics
- `budget` — icon key `wallet` (the app maps it since app prompt 008), placed
  right after `notes`. Title "Budget", summary like "Plan your family money,
  split shared costs and never miss a bill."
- `cycle` — icon key `cycle`, placed right after `habits`. Title "Cycle",
  summary like "Track your period privately — it stays on your phone."
- Add both keys to `HELP_ICONS` and draw a glyph for each in `HELP_GLYPHS`
  (24×24 stroke icons in the same style as the others: a wallet; a drop or
  a circle-arrow — match the meaning of the app's Cycle tile icon).

## Articles (English facts; short sentences; the voice of the existing articles)

1. **`budget-start`** — "Plan your family budget" (`media: budget-start`,
   `routes: /budget, /budget/new, /budget/:id, /budget/:id/categories, /budget/:id/settings`,
   `tryIt: /budget`). Open Budget from Home; create from a template;
   monthly or one-time; currency (changing it later re-labels, never
   converts); a limit; **who sees it** (the whole family · chosen people ·
   only you — only the creator can make it private); categories with their
   own limits (Manage categories); add an entry with **+** (amount, title,
   category, date, who paid, how, note, shared, repeat); the budget screen
   (period, spent vs limit, categories, entries), search and the "Paid by"
   filter; CSV export in the budget's settings; who may change settings or
   delete (the creator, or an admin who can see it). Free for everyone.
2. **`budget-bills`** — "Bills, reminders and budget alerts" (no new
   picture unless 009 made one). Mark an entry as a bill with a due date;
   bills show on the calendar (Calendar settings → **Bills**) and a tap opens
   the budget; a reminder before a bill is due; alerts at 80 % and 100 % of a
   limit; both switches in Settings → Notifications (use the ARB labels);
   bill reminders come even in quiet hours, alerts wait until quiet hours
   end. From a shopping list: ⋯ → **Add to budget**, and the "All bought"
   offer after the last item is ticked.
3. **`budget-split`** — "Split shared costs and settle up" (`media:
   budget-split`, `routes: /budget/:id/split`). Turn on splitting in the
   budget's settings (not for private budgets); shared entries are split
   equally; the Balances card shows who owes whom (all-time); **Settle up**
   records a payment between two people. "Not shared" = only the payer's cost.
4. **`cycle-start`** — "Track your period with Cycle" (`media: cycle-start`,
   `routes: /cycle, /cycle/history`, `tryIt: /cycle`). Turn it on for
   yourself (Settings → Cycle, or the Cycle card when you set up Home); off
   by default; each person decides for themselves — nobody else in the family
   sees it, or sees that you use it; log a day; predictions are **ranges**,
   never one exact day; history. One clear line: Cycle is not a medical device
   and not a method of contraception (link `/terms.html#cycle`). Free.
5. **`cycle-privacy`** — "Cycle reminders, lock and where your data is"
   (`routes: /cycle/settings`). Reminders (period reminder and how many days
   before, log-day reminder, time; lock-screen text is discreet unless you
   switch clear text on); **Lock Cycle** (Face ID / fingerprint / phone code;
   locks again after a minute away); data is only on this phone and in the
   phone's own backup — never on Daili's server; export as a file; "Delete
   all cycle data"; signing out keeps the data but stops its reminders;
   deleting your account erases it. Link the privacy policy `/privacy.html#cycle`.

Front matter as in existing articles: `since: 1.10.0`, `updated: <today>`,
`order` within the topic, `related` (budget ↔ budget, cycle ↔ cycle, plus
`notifications-choose` for bills, `start-edit-home` for both). **No
`tipTitle`/`tipBody` on the Cycle articles** (a tip would advertise Cycle to
everyone); Budget articles may have one tip on `budget-start` only, with a
lower `tipPriority` than every existing tip.

## Constraints
- Translate every new article and the two topic strings into all
  `HELP_LOCALES` following `claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md`,
  with the app's own labels per language (pt = Brazilian "você", fr "tu",
  id "Anda"). Cycle wording: neutral and respectful in every language; use
  the app's own Cycle words (its ARB) — never add medical terms the app
  does not use. el/uk/bg: never "family planner".
- Brand: follow the existing articles' casing of "daili".
- Money examples (if any) in the locale's currency style.
- `npm run build` green, `node tools/check-help.mjs` green. No reordering of
  existing articles or topics other than inserting the two new ones.

## Verify
Build. Spot-check `en` `budget-start`, `de` `cycle-start`, `ja` `budget-split`,
`pt` `cycle-privacy` (Brazilian), and that the app JSON (`dist/help/en.json`)
lists both topics with icons `wallet` and `cycle`.

## Commit & push
`docs(help): 1.10.0 part 1 — Budget and Cycle topics`; body
`Prompt: claude-prompts/2026-10-12/003-help-sync-1-10-0-budget-cycle.md`.
**Push. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-10-12/003-help-sync-1-10-0-budget-cycle.md`, half a page:
articles × locales, pictures found/missing, routes removed from `pending`,
facts you corrected against the code, build lines, SHA + push.
`## Help impact`: n/a.
