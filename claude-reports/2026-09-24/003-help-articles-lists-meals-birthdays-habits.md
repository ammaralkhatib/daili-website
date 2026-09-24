# 003 — Help articles, batch 2 + batch-1 pictures: report

Prompt: `claude-prompts/2026-09-24/003-help-articles-lists-meals-birthdays-habits.md`
Commits: `95a8ebd` docs(plan): add help articles batch 2 prompt · `483d840` chore(help): help-shots pictures (batch 1) · `335873b` feat(help): articles batch 2 — lists, meals, birthdays, habits; batch-1 pictures wired in
**Pushed** to `origin/main` (with this report's commit). Nothing deployed. `HELP_PUBLIC` is still false.

The app help-shots run (008) had already happened: all 17 batch-1 pictures were on disk and in `media.json`, so Part B was complete.

## Result

`npm run build` is green:

```
help OK · 47 article(s) · 54 app routes checked
test-check-help OK · 55 cases (1 clean fixture + every guard rule planted and caught)
built 189 pages · 28 locale(s) · 132 sitemap entries
help: 47 of 47 article(s) on pages (live 1.6.0) · 7 topic(s) · en.json 47 articles, 8 tips, 4 checklist · noindex preview
build OK · 189 pages · 114 in hreflang clusters
```

**Missing-media warnings: 17 → 27.** All 17 batch-1 warnings are gone. The 27 left are exactly the 27 new batch-2 articles. The app skipped no batch-1 picture. The log prints 54 lines because each warning prints twice.

**No orphan media.** Every id in `media.json` is used by an article.

## Articles

Every button name is the exact English ARB string. "Code" means `../familyplanner-app` at `29fa02c8`. For `since`: 1.0.0 = 2026-08-11, 1.1.0 = 08-19, 1.2.0 = 09-01. The CHANGELOG only starts at 1.2.0, so for older things I used the date the ARB string first appeared (`git log -S`).

### Lists & to-dos

| id | since | what the code showed / corrections to the outline |
|---|---|---|
| `lists-shopping` | 1.0.0 | Home **Shopping** tile → the list overview (`/lists` just redirects to `/lists/shopping`). **+** (tooltip **New list**) → **Name**, **Color**, **Icon** → **Create**. **Add item** bar at the bottom. Tap a row to edit (**Quantity**, **Note**). Tap the box to tick it, and the item moves to **Completed**, with **Undo** in the message. **⋯** → **Delete completed** / **Uncheck all** (both from 07-17). Checklist 4, `hasListItem`. |
| `lists-categories` | 1.5.0 | **⋯** → **Group by category** switch + **Categories** (drag to order, tap to edit name/emoji/**Hidden**, **Add category**, up to 30). The item sheet has a **Category** chip row. Deleting a category keeps its items (`shoppingCategoryDeleteBody`). The same switch and **Supermarket order** are also on the list's **Edit list** screen. |
| `lists-move-items` | 1.4.0 | Item sheet → **Move to list…** → **Move to** picker → message "Moved to {list}" with **Undo**. **Detail:** the row only shows when there's another list of the **same type** (`_moveTargets`). Shopping never moves to to-dos, even though the server would allow it. |
| `lists-todos` | **1.4.0** | Same flow as shopping, but in the **To-dos** box. The edit sheet has **Assignee**, **Category**, **Due date**, **Repeat**, **Note**. **⋯** → **Group by** (**Due date** / **Person** / **Category** / **Manual order**), saved per list on this device. `since` is 1.4.0 because the steps use Group by and to-do categories. |
| `lists-assign` | 1.5.0 | **Assignee** field → **Assign to** picker (multi-select, **Save**). It has login members and managed children. **Detail:** reminders go only to assignees who are members, and a task given only to a child "Reminds everyone" (`_reminderAudienceHint`). |
| `lists-due-reminders` | 1.4.0 | The **Today** / **Tomorrow** / **Pick a date…** chips above the add bar set a due **day**, never a reminder. In the edit sheet, **Add due date**, **Add time**, then **Reminder** (only shown once there's a due date). Day presets are **Morning of (9:00)**, 1 and 2 days before, and timed ones are at time / 5 / 15 / 30 min / 1 h / 1 day, plus **Custom…**. The notification has **Done** and **Snooze 15 min** (1.1.0). Clearing the due date clears the reminder and the repeat. |
| `lists-repeating` | 1.0.0 | **Repeat**: **None** / **Daily** / **Every few days** / **Weekly** (**On these days**) / **Monthly** (**Day of the month**). It's greyed out until the task has a due date. It's one task that comes back: ticking it moves the due date, and a message says "Comes back {date}". From 2026-08-05. |
| `lists-all-mine` | 1.4.0 | **Correction:** the "All / Mine" switch lives on the **To-dos box** (`/lists/todos`), not inside a list. It's two circles, with you on the right, and **Mine** is a cross-list view. Inside a to-do list there's a different thing: the member circle row (Everyone + each person with work, with progress rings). Both are covered, and `routes` has `/lists/todos, /lists/:id`. The note gives the ownership rule (assignees, otherwise whoever added it). |
| `lists-edit-list` | 1.0.0 | Card **⋯** → **Edit** / **Delete**. Edit list = **Name**, **Color**, **Icon**, **Save**. Reorder = long-press a card and drag (`LongPressDraggable`). **Correction:** delete has **no confirm dialog**. It's a message with **Undo** that counts down before it's committed. |

No lists articles were merged. Each one had enough real content.

### Meals & recipes

| id | since | what the code showed / corrections to the outline |
|---|---|---|
| `meals-add-recipe` | 1.0.0 | Recipes **+** opens a chooser: **New recipe**, **Import from link**, **Search online**, **Paste recipe text**. Form: **Title**, **Description**, **Prep (min)**, **Cook (min)**, **Servings**, **Categories**, **Add photo**, **Add ingredient**, **Add step** → **Create**. The detail menu is **⋮** → **Edit** / **Delete**. |
| `meals-import-link` | **1.4.0** | **Correction:** the link import isn't a route. It's a sheet over `/recipes` that lands on `/recipes/:id/edit` with "Imported from {host} — check and save" → **Save**. So `routes: /recipes, /recipes/:id/edit`. **Recipe link** field, **Paste**, **Import**. `since` is 1.4.0 because the **Paste** button, the tidied links and the social-link message are all 1.4.0. Tip: skip `hasRecipes`, 55. |
| `meals-paste` | 1.4.0 | **Paste recipe text** → paste or **Paste** → **Continue** → the New recipe form, pre-filled → **Create**. |
| `meals-search-online` | 1.0.0 | **Search online** → "What would you like to cook?" → **Search** → tap a result → import → edit preview → **Save**. **Addition:** results are only from **vegan & vegetarian recipe blogs** (`recipeSearchOnlineAttribution`), so the summary says so. There's a daily limit. **Verified email:** the app never says so. CLAUDE.md §3 says online recipe search needs a verified email, but the search screen maps that server refusal to the generic **Search failed**. The note says to verify in Settings. Worth an app fix: a clear "verify your email" message. |
| `meals-plan-week` | 1.0.0 | **+** on a day → **Add a meal**: **Date**, **Meal** (Breakfast/Lunch/Dinner/Snack), **Recipe** + **Choose recipe** or **Free text** + **Title**, **Note** → **Save**. Tapping a meal opens **Open recipe** / **Edit** / **Delete**. I didn't use "tap anywhere on the row" because that's 1.6.0. |
| `meals-to-shopping` | 1.0.0 | Two ways in: the cart button on a recipe (also "Add all to list" next to Ingredients), and the cart button in the Meal plan app bar, which covers the shown week. Screen **Add to shopping list**: **Add to** list picker, ingredients pre-ticked, button **Add {n} items**, then **Open list**. Only recipe meals bring ingredients. Tip: skip `hasMealPlan`, 50. |
| `meals-copy-week` | 1.0.0 | App-bar copy button (**Copy from last week**), and the same button on an empty week. It asks **Copy** only when the week already has meals. It's additive ("Existing meals stay"), and it copies from the week before the one shown. |

### Birthdays

| id | since | what the code showed / corrections to the outline |
|---|---|---|
| `birthdays-add` | 1.0.0 | **+** (**Add celebration**) → **What are you celebrating?** **Birthday** / **Anniversary** / **Celebration** → **Name**, **Month**, **Day**, **Show year** + **Year** → **Create**. A new one starts with a same-day reminder at the default time (`initialRemindersFor`). Checklist 5, `hasCelebrations`. |
| `birthdays-import` | **1.2.0** | **Correction/detail:** the way in is the **gear** (**Birthday settings**) → **Import from contacts**, or the empty-state button. Intro → **Continue** → permission → tick / **Select all**, **Remind me on the day**, **Import {n}**. `since` is 1.2.0 because import was broken until "importing birthdays from your contacts now works" (1.2.0). Tip: skip `hasCelebrations`, 65. |
| `birthdays-reminders` | 1.0.0 | Up to 5 (`celebrationRemindersAtCap`). **Add reminder** has presets (same day, 1 day before at 18:00, 1 and 2 days before at the default time) plus **Custom…** (**When** 0–30 days, **Time**). **Default reminder time** is in the gear sheet: device-only, and only for new reminders. I didn't say who gets birthday reminders, because that's server behaviour and the api repo isn't on this machine. |
| `birthdays-comments` | 1.0.0 | Heart toggle (Like / Unlike), **Comments**, **Add a comment…**, **Send**. Delete through **⋯** on your own comment. Admins can delete any comment (`canDelete: own \|\| isAdmin`). Title is now "Comments and hearts on a birthday". |

### Habits & Minzi

All `since: 1.6.0`. The rules follow CLAUDE.md §3 "Habits + Minzi" and `HABITS-CONTRACT.md`. Minzi only naps, sits, watches, goes on trips and sends postcards. None of her speech bubbles are quoted.

| id | what the code showed / corrections to the outline |
|---|---|
| `habits-what` | **Who**: **Just me** / **Each of us** / **Together** ("Anyone in the family can tick it"). The first run is the **Meet your family cat** flow: name the cat, pick 2–3 habits. Tip: skip `hasHabits`, 85. |
| `habits-create` | **+** in the Habits bottom bar → template sheet (12 templates, **Make your own**) → the form opens pre-filled. **Name**, **Who** (**Who is in?**), **Type** **Yes / no** / **Counter** + **Target** + **Unit**, **How often** **Every day** / **Some days** / **A few times a week**, **More** → **Start habit**. Edit is the pencil, which only shows when `canEdit`. **Archive** / **Delete** are in the **⋯** menu. "Only an admin can add other people". |
| `habits-tick` | Row = open the habit. The round button on the right = tick, and on a counter it opens **One more** / **One less**. Long-press → **Fill in yesterday**. The detail calendar edits the last 7 days (`habitsDayReadOnly`). Admins tick for managed children (**You tick for {name}**). Nobody ticks for another login member. |
| `habits-streaks` | **Current streak** / **Best**. A few-times-a-week habit counts weeks. Long-press → **Rest day today** (1 a week, covers all your habits today, no energy) and **Pause for a few days** (up to 14 days). Family streak = at least one tick a day, shown on the **Family** tab. |
| `habits-minzi` | **Family energy** bar. Full bar → trip tonight, back in the morning, tap the card to open the postcard. **Minzi** in the bottom bar → `/habits/minzi`: stats, **Postcards**, **Rename**. The note gives the ledger rule: one credit per person per habit per day, and none for private habits or rest days. |
| `habits-private` | **Private** switch under **More**. It's only enabled for **Just me** ("Only a “Just me” habit can be private"). Private habits earn no family energy and stay off the board. A lock + **Private** show on the habit. |
| `habits-reminders` | **Correction:** **Together** habits **can't** have a reminder (`canHaveReminder => mode != together`). Reminders are per person: on create everyone gets the time, and later each person edits their own. The notification has **Done** and no Snooze. A counter needs the app ("Open Daili to count this one."). |

`related` only links ids that exist. `keywords` are 12 or fewer, all lower case. Tips (8 total): the 4 from batch 1 plus `meals-import-link`, `meals-to-shopping`, `birthdays-import`, `habits-what`. Checklist (4 total): 1, 2, 4, 5.

## Merged or skipped

Nothing merged, nothing skipped, nothing moved to `never`. Every route in the four tables got a real article.

## Allowlist

`pending`: **32 → 8**. These 24 routes were removed, which is exactly the prompt's list:
`/lists`, `/lists/shopping`, `/lists/todos`, `/lists/new`, `/lists/:id`, `/lists/:id/edit`, `/recipes`, `/recipes/new`, `/recipes/paste`, `/recipes/search-online`, `/recipes/:id`, `/recipes/:id/edit`, `/meal-plan`, `/habits`, `/habits/new`, `/habits/minzi`, `/habits/:id`, `/habits/:id/edit`, `/celebrations`, `/celebrations/new`, `/celebrations/import`, `/celebrations/:id`, `/celebrations/:id/edit`, `/add-to-shopping`.
Left for batch 3: `/documents`, `/documents/:folderId`, `/photos`, `/photos/all`, `/photos/:albumId`, `/settings`, `/settings/profile`, `/settings/notifications`.

## Pictures (Part B)

I looked at each picture before writing its alt text. Each one got `media: <id>` and one image line right after the first paragraph.

| id | alt text |
|---|---|
| `start-sign-in` | The Sign in screen. The Continue with Google button is circled. |
| `start-create-family` | The welcome screen for new users. The Create a family or group button is circled. |
| `start-join` | The Join a family or group screen with the Invite code field. The Scan QR code button is circled. |
| `start-edit-home` | The Home screen settings with a switch and a drag handle for each tile. The drag handle next to Shopping is circled. |
| `start-today` | The top of Home. The Today button next to the bell is circled. |
| `family-children` | The Children section on the Family screen with two children. The Add child row is circled. |
| `family-roles` | The Members list on the Family screen with Owner and Admin labels. The Admin label and the ⋮ button next to Marco are circled. |
| `family-groups` | The Your families & groups sheet over Home. The Create a family or group button is circled. |
| `family-activity` | The top of Home. The bell button at the top right is circled. |
| `calendar-views` | The calendar in Month view. The View button in the bottom bar is circled. |
| `calendar-add-event` | The calendar in Month view. The + button at the bottom right is circled. |
| `calendar-repeating` | The new event form. The Repeats row is circled. |
| `calendar-reminders` | The Reminder section of the event form with two reminders. The Add reminder button is circled. |
| `calendar-private` | The event form. The Private event switch is circled. |
| `calendar-categories` | The Event categories screen with six categories. The Add category row is circled. |
| `calendar-search` | The calendar in Month view. The Search button in the bottom bar is circled. |
| `calendar-edit-delete` | An event opened from the calendar. The Edit event button is circled, with the delete button next to it. |

`family-invite`, `calendar-phone-calendars` and `start-home` already had their image lines and still point at existing ids, so I didn't touch them.
**Still without a picture:** the 27 batch-2 articles. No batch-1 article is missing one.

`start-edit-home` shows Settings → **Home screen**, not the long-press edit mode. That's fine, because the article describes both, but a long-press shot would match step 1 better.

## Checks

- Headless Chrome, with each page in a 390 px iframe: `/help/start/today/` and `/help/family/children/` show their picture (318 px wide, loaded, 0 px horizontal overflow).
- Help search, top 3: "grocery" → lists-shopping, lists-categories, lists-move-items. "chores" → lists-todos, lists-assign, lists-repeating. "streak" → habits-streaks, habits-what, habits-minzi. "Minzi" → habits-minzi, habits-what, habits-create.
- The help home's "New in version 1.6.0" now also lists the seven habits articles.

## Things to know

- **Commit `483d840` can't build on its own.** It adds `media.json` entries that no article uses yet (orphans), and the next commit fixes that. The prompt asked for this order. The pushed tip is green.
- **App follow-up, not done here:** an unverified user who tries online recipe search only sees **Search failed** (see `meals-search-online`).
- I left the unrelated uncommitted files alone (blog drafts, changelog pages, `BLOG-POST-TEMPLATE.md` and so on).

Help impact: 27 new help articles, and 17 batch-1 articles now show their picture. 8 routes are still pending articles (`help/routes-allowlist.json`).
