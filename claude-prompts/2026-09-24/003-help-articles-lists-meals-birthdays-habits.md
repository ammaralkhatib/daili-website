# Help articles, batch 2 (Lists, Meals, Birthdays, Habits) + wire in the batch-1 pictures

> **Run this AFTER app prompt `2026-09-24/008-help-shots-batch-1`.** That
> run writes the pictures this prompt wires in and commits. If it hasn't run,
> do Part B with whatever pictures exist and say so.

## Goal
**Part A.** Write the articles for four more topics, so that **every app route
of Lists & to-dos, Meals & recipes, Birthdays and Habits** leaves `pending`
in `help/routes-allowlist.json` (24 routes; after this only 8 remain, for
batch 3).

**Part B.** The app's help-shots tool now writes one picture per article,
named after the article id, into `static/help/media/en/` and
`help/media.json`. Wire every such picture into its article, and commit the
pictures.

"Done" = `npm run build` green; `pending` 32 → 8; every picture in
`media.json` belongs to an article (no orphans); the pictures are committed.

## Scope
- **In:** new `help/en/{lists,meals,birthdays,habits}/*.md`, front matter
  and body of existing articles (Part B only: the `media` line + one image
  line), `help/routes-allowlist.json`, and committing
  `static/help/media/en/*.webp` + `help/media.json` (made by the app tool, so
  don't edit the images).
- **Read, never write:** `../familyplanner-app` (screens, `lib/l10n/app_en.arb`,
  `CHANGELOG.md`, and `claude-prompts/2026-09-20/HABITS-CONTRACT.md` or the
  habits plan for the rules) and `../familyplanner-api` if needed for a rule.
- **Out:** engine, tools, templates, CSS, `site.config.mjs`, `HELP_PUBLIC`
  (stays false), legal, blog.

## Requirements

### Part A: house style (same as batch 1, repeated so this prompt stands alone)
- **The code wins.** Every step, button name (exact English ARB string, in
  `**bold**`) and fact comes from the app. When this outline disagrees, write
  what the app does and list the difference.
- **Only what users can reach today.** Skip dark, unannounced or
  flag-hidden features and say so (batch 1 skipped Google Calendar for this
  reason).
- Plain friendly English, short sentences, "you" voice. 2–5 steps (7 max),
  ≤ 150 words, `summary` = what it lets you do, one `> Note:` only for the
  thing people get wrong. `keywords` = what people type (synonyms: "grocery"
  for shopping, "chores" for to-dos, "kid", "partner"…).
- `since` = first **announced** version in the app CHANGELOG, or newer if the
  steps need something newer. `updated: 2026-09-24`. `related`: 1–3 ids.
- Brand rule: "daili" lowercase in display text.
- If an article would break a limit, split it; don't bend the rule.
- Habits: follow the **locked rules** in the app repo's CLAUDE.md §3
  "Habits + Minzi" (who may edit and tick, private habits, energy, rest days,
  streaks computed by the server). **Minzi is a real cat** in every sentence:
  she naps, sits, watches, goes on trips and sends postcards. She never waves,
  talks, holds things or wears things.

### Part A: the articles (outline; check each against the code)

**Lists & to-dos** (`help/en/lists/`)
| id | title (adjust to the app) | routes |
|---|---|---|
| `lists-shopping` | Shopping lists: add, check off, clear | `/lists`, `/lists/shopping`, `/lists/new`, `/lists/:id` |
| `lists-categories` | Shopping categories and your own ones | `/lists/:id` |
| `lists-move-items` | Move items to another list (and undo) | `/lists/:id` |
| `lists-todos` | To-do lists | `/lists/todos`, `/lists/:id` |
| `lists-assign` | Give a to-do to one or more people | `/lists/:id` |
| `lists-due-reminders` | Due dates, reminders, Done and Snooze | `/lists/:id` |
| `lists-repeating` | Repeating to-dos | `/lists/:id` |
| `lists-all-mine` | All or only mine | `/lists/:id` |
| `lists-edit-list` | Rename, recolour, reorder or delete a list | `/lists/:id/edit` |

Merge two of these if the app makes one of them too thin for its own
article (say which).

**Meals & recipes** (`help/en/meals/`)
| id | title | routes |
|---|---|---|
| `meals-add-recipe` | Add a recipe | `/recipes`, `/recipes/new`, `/recipes/:id`, `/recipes/:id/edit` |
| `meals-import-link` | Save a recipe from a website link | `/recipes/new` (or wherever the link import lives) |
| `meals-paste` | Paste a recipe as text | `/recipes/paste` |
| `meals-search-online` | Find recipes online | `/recipes/search-online` (needs a verified email: say so) |
| `meals-plan-week` | Plan the week's meals | `/meal-plan` |
| `meals-to-shopping` | Put a recipe's ingredients on your shopping list | `/add-to-shopping` |
| `meals-copy-week` | Copy a week of meals | `/meal-plan` |

**Birthdays** (`help/en/birthdays/`)
| id | title | routes |
|---|---|---|
| `birthdays-add` | Add a birthday or anniversary | `/celebrations`, `/celebrations/new`, `/celebrations/:id`, `/celebrations/:id/edit` |
| `birthdays-import` | Bring in birthdays from your contacts | `/celebrations/import` |
| `birthdays-reminders` | Birthday reminders | `/celebrations/:id` (+ settings if relevant) |
| `birthdays-comments` | Comments and hearts | `/celebrations/:id` |

**Habits & Minzi** (`help/en/habits/`)
| id | title | routes |
|---|---|---|
| `habits-what` | What habits are: each, together, personal | `/habits` |
| `habits-create` | Create or change a habit | `/habits/new`, `/habits/:id/edit` |
| `habits-tick` | Tick a habit: yours, together, a child's | `/habits/:id` |
| `habits-streaks` | Streaks and rest days | `/habits/:id` |
| `habits-minzi` | Energy, Minzi's trips and postcards | `/habits/minzi` |
| `habits-private` | Private habits | `/habits/new` |
| `habits-reminders` | Habit reminders | `/habits/:id` (or the form) |

Every route in the four tables must leave `pending`. If one really can't get
a true article, move it to `never` with a reason and report it.

**Tips** (skip keys from `help/skip-keys.json`; title ≤ 60, body ≤ 120):
`meals-import-link` skip `hasRecipes` (priority 55), `meals-to-shopping`
skip `hasMealPlan` (50), `birthdays-import` skip `hasCelebrations` (65),
`habits-what` skip `hasHabits` (85).
**Checklist:** `lists-shopping` → `checklist: 4`, `checklistDoneIf:
hasListItem`; `birthdays-add` → `checklist: 5`, `checklistDoneIf:
hasCelebrations`. (3 and 6 come in batch 3.)

### Part B: wire in the pictures
1. For every id in `help/media.json` that equals an **article id**: set
   `media: <id>` in that article's front matter (if missing), and put **one**
   image line `![<alt>](<id>)` in the body, right after the first paragraph
   (before the steps). **Open the image and look at it** before writing the alt
   text: say plainly what the picture shows and what is circled, for example
   "The Family screen. The Invite member row is circled."
2. If an article already has an image line for another id, keep it and only
   fix it if it points at a missing id.
3. `check-help` must end with **no orphan media** and fewer "missing media"
   warnings. Report the new warning count: articles still without a picture,
   which are the batch-2 ones plus any the app skipped.
4. Commit the pictures and `media.json` **separately first**:
   `chore(help): help-shots pictures (batch 1)`.

## Constraints
- `npm run build` green (all guards). Self-correct up to 2 tries.
- Write files with the file-write tool, never a heredoc; check `wc -c`.
- Don't touch `../familyplanner-app` or `../familyplanner-api`.
- Leave the unrelated uncommitted files (blog drafts, changelog pages,
  `BLOG-POST-TEMPLATE.md`) alone.

## Verify
- `npm run build` (report the help line + warning count).
- `pending` before → after, and the removed routes.
- `npm run serve`: 2 batch-1 articles now show their picture at phone width;
  search finds "grocery", "chores", "streak", "Minzi" in the right articles.

## Commit & push
1. This prompt file, if untracked: `docs(plan): add help articles batch 2 prompt`.
2. `chore(help): help-shots pictures (batch 1)` (images + `media.json`).
3. `feat(help): articles batch 2 — lists, meals, birthdays, habits; batch-1 pictures wired in`.
   Body: `Prompt: claude-prompts/2026-09-24/003-help-articles-lists-meals-birthdays-habits.md`.
- **Push now.** `HELP_PUBLIC` stays false.

## Report
`claude-reports/2026-09-24/003-help-articles-lists-meals-birthdays-habits.md`
(file-write tool, `wc -c` > 0):
- a table: article id → `since` → what the code showed / every correction of
  this outline;
- merged or skipped articles, and why;
- `pending` before → after;
- which batch-1 articles got a picture (id + alt text), and which still have
  none;
- SHAs, pushed or not.
