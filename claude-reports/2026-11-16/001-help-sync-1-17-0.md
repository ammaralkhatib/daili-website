# 001 — Help sync 1.17.0: tablets, chores, rewards that cost stars, buddy, shared notes, lists, widgets

**Status:** done · **Commit:** `40afc548` docs(help): 1.17.0 — tablets, chores, rewards, buddy, shared notes (1144 files: 25 locales × 16 changed + 3 new articles, 425 new + 218 re-shot help pictures, `help/media*.json`, `help/routes-allowlist.json`). Pushed to origin/main together with this report. `./deploy.sh` was NOT run. `LIVE_APP_VERSION` is still 1.16.2.
**Step 0:** `23cd3934` docs(plan): sync planning docs (this prompt + `help-impact-1-17-0.md`), pushed. `static/assets/img/photos/` and `legal/` were not staged.

## Articles
Facts come from the app at tag `v1.17.0+25` (and the api at HEAD), gathered by 5 Opus 5.5 agents. A 6th fresh agent fact-checked the English before translating. It found **14 problems**, and I fixed all of them. Examples: the Stars choices are 0, 1, 2, 3, 5 or 10, not "0 to 10"; Archive/Delete sit in the **Edit chore** menu, not on the chore page; **Undo** comes only when closing saves, not after **Save**; a saved note is shared via **Change** at **Who can see it**; Cmd/Ctrl+Enter also presses **Create**.

**New (`since: 1.17.0`, so no web page until the release bump; they are already in `dist/help/<loc>.json`):**
- `habits-chores`: what a chore is, the + → **Chore** chooser, stars, who, the three ways of sharing, when (incl. **Just once**), edit / archive / delete, admins only, who ticks.
- `habits-stars` ("Stars and your buddy"): how stars are earned (0/1/2/3/5/10 per habit, stars from at most 5 habits a day, chores on top, counters at the goal, Together → family rewards only), and the buddy (where to pick it, **No buddy, just stars**, where it shows, **All done for today!**).
- `notes-others-edit`: **Others can edit**, what others may and may not do, **Daili cloud** for pictures, **Edited by**, **Use their version** / **Keep mine as a new note**.

**Changed (`updated: 2026-11-16`):** `anywhere-tablet` (`since` 99.0.0 → 1.17.0, plain first line, shortcuts corrected against 040/041, "phones keep their layout, also turned sideways"; `mediaPending` kept); `habits-rewards` (rewritten: price vs jar, Ask for it / Take back, Needs your answer → Approve / Not now, Give it now, the wallet card, **A parent says yes first**); `habits-create` (Stars row + picture, admins tap **Habit**); `habits-what`; `habits-categories` (path through the chooser); `family-roles` (the "Is … a parent?" sheet + picture); `notes-notes` (closing saves, Undo, draft text kept); `lists-shopping` / `lists-todos` (**Add with details**); `lists-edit-list` (⋯ → **Edit** inside the list + picture); `anywhere-widgets` (Quick add = Event, To-do, Item, Note; narrow, tall Android widgets tick); `anywhere-widgets-settings` (To-dos **Time span** + **Add to**); `calendar-views` (stripes + picture); `calendar-phone-calendars` (Only me → private unless people are picked); `meals-to-shopping` (scaled to servings + picture); `notifications-spoken` (**Also on silent or vibrate**).

**Where I went against the prompt (the 150-word guard wins; I did not widen it):**
- Buddy and the star rules got their own article, `habits-stars`, and shared-note editing got its own article, `notes-others-edit`. The guard has no headings, so a "section" can't exist, and `habits-rewards` / `notes-notes` were already at 148 words.
- Meal-plan scaling went into `meals-to-shopping` (the article about the week's **Shop**), not `meals-plan-week`.
- The ⋯ row is **Edit** in the app (`listMenuEdit`), not "Edit list" as the prompt and report 050 say.
- Prompt "Stars row (0–20)": the app offers only 0, 1, 2, 3, 5, 10 (the server accepts up to 20).
- Linked "Only me" event: the form shows **Private event** OFF. The server makes the event private on save, and only when nobody is picked under **For**. The text says that.
- "Is … a parent?" comes back once a day until answered, so the text says "until answered", not "once".

**Fact-list lines I left alone:** two-way Google (all lines: dark, forbidden); the tablet "none until the tablet release" lines beyond the article; the share-your-calendar line (no help article describes Daili's own calendar link, so there is nothing to correct); `start-read-aloud` (it doesn't repeat the silent rule); 075 "swipe up on the card" (`start-home` doesn't mention the arrow/pull); 051 and 002 (none). Left out to fit 150 words: the chore's **Day** row, the "+N stars per day" line on the habit page, and the "Approved → Plan it" step for priced rewards.

## Routes
`/habits/chores/new` and `/habits/:id/chore` → `habits-chores` (removed from `pending`). `/calendar/external-edit` → `never` ("two-way Google, dark until the scope is approved"). `pending` is now empty. The app's `route_names.dart` is clean and the same at HEAD and `v1.17.0+25`.

## Locales and pictures
All 24 `HELP_LOCALES` languages: 8 Opus 5.5 translators × 3 locales, in the foreground, with `/tmp/help117/` (BRIEF, `labels.mjs` from the 1.17.0 ARB + Android strings, `check-loc.mjs`). I waited for all 8. Every locale passed its check. On disk I confirmed: exactly 16 changed + 3 new files per locale, labels taken from the working tree equal the tag, no `content/glossary.md` change, no forbidden words in the new text. The pl/cs/sk translator used helper agents of its own and then re-checked all three locales itself.
**Missing pictures: none.** All 17 new ids exist in all 25 locales (`/tmp/help117/pics.mjs`). New and changed alt texts use each locale's own demo names (ja 健太/陽菜, id Andi/Putri, …).

## Build
`npm run build` (foreground): **build OK** · 3659 pages · detector OK · help search OK. Every locale has 115 articles in its json. I read the built English and German `habits/rewards`, `notes/notes` and `family/roles` pages: text is right, all pictures load, no broken help links. The English and German tablet, chores, stars and others-edit articles in `dist/help/{en,de}.json` have the right blocks, every picture file and valid related links.

## Things to know (from the translators, not blocking)
- **German:** the app uses "Aufgabe(n)" for BOTH chores and to-dos (`habitsChoresTitle`, `widgetQuickAddTodo`). The help follows the app, so German help now says "Aufgaben" for two features. Worth a separate German word for chores in the app.
- **ja, th, ko, zh pictures** of `meals-week-shopping` show "2× …" in front of lines that DO have an amount (e.g. 2× かぼちゃ 1/4個). The app can't read those amounts, so it uses the 2× fallback. The alts describe what each picture shows. This is an app item (amount reading in those languages), not a help error.
- The `habits-all-done` picture shows the card while a "First one gets it" chore is still open. The code counts only Everyone / your-turn chores. The English says "every habit and chore due today", which is close but not exact for first-one chores.
- fi bolds "Muokkaaja:" with its colon; ja/ko/zh `notesEditedBy` start with the name, so the bold is the part after the name.

## Open items for the owner
- At the 1.17.0 release: bump `LIVE_APP_VERSION` and run `./deploy.sh`. Then the 4 `since: 1.17.0` articles get their pages.
- Tablet pictures (`anywhere-tablet` keeps `mediaPending`) and an Android picture for `notifications-spoken` are still owed.

## Help impact
This IS the help sync. New: `habits-chores`, `habits-stars`, `notes-others-edit`; published: `anywhere-tablet`. Changed: `habits-rewards`, `habits-create`, `habits-what`, `habits-categories`, `family-roles`, `notes-notes`, `lists-shopping`, `lists-todos`, `lists-edit-list`, `anywhere-widgets`, `anywhere-widgets-settings`, `calendar-views`, `calendar-phone-calendars`, `meals-to-shopping`, `notifications-spoken`.
