# Help: new article "Steps inside a to-do" (hidden until the release)

Standard lane, website only. Feature "Steps inside a to-do" (Daili list item one-hundred-ninety-five).
Plan: `/Users/ammarkhatib/development/flutter_projects/familyplanner/familyplanner-app/claude-prompts/SUBTASKS-PLAN.md`
(**Decisions**). It ships in the NEXT app release, whose version is not decided. The Help center needs
the article now, hidden until that release.

Every sub-agent you start MUST use model claude-opus-5-5. Write the report with the file-write tool.

## 1. Keep it hidden

Same way as `help/en/meals/import-file.md` (prompt `claude-prompts/2026-11-19/001-help-import-recipe-file.md`
§1): `since: 99.0.0` in the English file, NO `related:` link FROM any other article to it, do NOT bump
`LIVE_APP_VERSION`. Do NOT change `help/*/lists/todos.md` now (translations carry no `since`, so a change
there would go live at once) — the release help sync adds the line and the link there.

## 2. The article — `help/en/lists/steps.md`, id `lists-steps`

Front matter like the neighbours in `help/en/lists/`: topic `lists`, title "Steps inside a to-do", a one-line
summary, keywords (steps, subtasks, sub-task, checklist, inside a task, break down, small steps, progress,
tick, packing list), `routes: /lists/:id`, `tryIt: /lists/todos`, `since: 99.0.0`, `updated:` today,
`mediaPending:` "the to-do sheet with the Steps block under the name, and a list row with 2/5 and the round
arrow" (check the build accepts it, like `import-file.md`), `order:` right after `lists-todos`, `related:
lists-todos, lists-repeating, lists-assign`.

**Check every fact against the app code before you write it** (`../familyplanner-app`: the en texts in
`lib/l10n/app_en.arb` — search "Steps", "Add a step", "All steps done", "Shopping lists have no steps" —
and the app reports `claude-reports/2026-11-21/002-item-steps-data.md`, `003-item-steps-sheet.md`,
`004-item-steps-row-popup.md`, which hold the click-paths). The app prompts run BEFORE this one in the same
run; if a report is missing, write from the plan's Decisions and list every fact under "Facts I could not
confirm". Use the app's EXACT button names in **bold**. The user word is **Steps**, never "subtasks"
(only as a keyword). Style: short sentences, easy words, numbered steps, "you", ≤ 150 words. Content:

1. One line: break a big to-do into small steps, and tick them one by one.
2. Numbered: open a to-do in a to-do list → under **Name**, tap **Add a step** → type it and press Enter for
   the next one → steps save right away (for a new task: with **Save**).
3. In the list: the row shows how far you are (like 2/5); tap the round arrow to see the steps and tick them
   right there.
4. `> Note:` the last step ticks the to-do; ticking the to-do ticks all its steps. A repeating to-do starts
   each new round with all steps open again.
5. `> Note:` only to-do lists have steps. Moving a to-do to a shopping list asks you: add the steps as items,
   or remove them. Ticking works without internet; adding steps needs internet.
6. One line: steps work on app.daili.app too.

No picture yet (`mediaPending`).

## 3. All help languages

A new English article breaks the build until it exists in every `HELP_LOCALES` language (`site.config.mjs`
:1391). Translate it into all of them following `claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md`,
with `translatedFrom` = the English `updated`. Use each language's REAL app words from
`../familyplanner-app/lib/l10n/app_<arb>.arb` (the keys above; zh-Hans → `app_zh.arb`, zh-Hant →
`app_zh_Hant.arb`).

## Constraints

- 🔴 No real user's names or lists in any example; example to-dos are made up (e.g. "Pack for the trip":
  passport, chargers, snacks).
- Only whole-article gating exists — keep everything about steps inside this one article.

## Verify

- `npm run check:help` and `npm run build` green, FOREGROUND. Spot-check 5 translations against their ARB.

## Commit & push

- Conventional Commit `docs(help): steps inside a to-do (hidden until the release)`; body names
  `Prompt: claude-prompts/2026-11-21/002-help-steps-inside-a-todo.md`.
- **Push now.** Do NOT run `./deploy.sh` (Ammar does; the article stays hidden anyway).

## Report

- `claude-reports/2026-11-21/002-help-steps-inside-a-todo.md`: what was written, facts confirmed against the
  code, "Facts I could not confirm", and the open item for the release help sync: set the real `since`, add
  one line + a `related` link in `lists-todos` (all locales), shoot the picture.
