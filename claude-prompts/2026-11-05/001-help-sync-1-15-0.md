# Help sync 1.15.0: Meals 2.0, Edit in Daili, Calendars filter + "Only me" links, Home card, share → event, daily to-do reminder, Tips & suggestions, Help improve Daili, AI for adults

## Goal
Make the help center true for app 1.15.0 (21) in English and every `HELP_LOCALES` language, with the
pictures from app prompt `../familyplanner-app/claude-prompts/2026-11-05/001-prerelease-1-15-0.md`
(already written to `static/help/media/**` by the runner — commit them here).

**Do not deploy.** `LIVE_APP_VERSION` stays as it is. Updated articles keep their `since` and get
`updated:` = the day you run this. New paragraphs for features new in 1.15.0 are marked the way existing
articles mark version-gated text (check how 1.14.0 did it in `calendar-views` / `lists-archive-templates`).
New articles get `since: 1.15.0`.

## Sources (read in place — the reports are the fact list)
- App reports `../familyplanner-app/claude-reports/`: `2026-11-02/004` (Help improve Daili) · `005`
  (crash reports) · `007` (AI for adults) · `008`–`014` (Meals 2.0: hub + settings, week planner, add
  sheet, meal sheet + Plan it, busy evenings, share-in sheet, Tonight on Home) · `2026-11-03/002`–`007`
  (Leo round: Year titles, Home card 3 events + swipe, Year All events, "Only me" links + Calendars
  filter, share a message → Event, Home card today only) · `007`–`009` (meals polish: clean week list,
  Cook mode, source pill, YouTube picture, placeholders) · `010` (recipe search ideas + time) · `011`
  (remind daily) · `2026-11-04/001` (At due time) · `002` (Home card linked calendars) · `003` (linked
  events: Edit in Daili) · `004` (Tips & suggestions switch) · `005` (meal-plan actions) · `007` (pull to
  refresh, "Only me" on Google calendars, Refresh now) · `2026-11-05/001` (pictures + alt texts).
- API reports `~/Herd/familyplanner-api/claude-reports/2026-11-02/007` (AI adults) · `009` (recipe delete
  keeps meals) · `011` (Plan my week, YouTube) · `2026-11-03/002` (Only me links) · `004`–`006` (recipe
  search) · `007` (remind daily) · `2026-11-04/001`–`004` (linked events) · `005`–`006` (nudges).
- Web reports `../daili-web/claude-reports/2026-11-03/001`–`007`, `2026-11-04/001`–`003` (the web side of
  the same features).
- Labels: the app's ARB files (`../familyplanner-app/lib/l10n/`) and, for web steps, `../daili-web`
  locale files. Check the code when a report is unclear. Do not guess. Read every `## Help impact`
  section above.

## Articles (English facts; short sentences; voice and brand spelling of the existing articles)

**Meals (biggest change — the meals topic needs a real pass, not one line each)**

1. **`meals-plan-week`** — Meal plan and recipes are now one **Meals** screen with a **Plan | Recipes**
   switch. The week is a clean list of each day's planned meals; the day's **+** adds a meal (opens the
   add sheet: one tap on a recent meal or a recipe plans it, Undo; typing a new name adds it as a meal).
   Tap a meal to open the **meal sheet**: servings, who cooks, a note, **Move or swap**, **Cook double**,
   **Change meal**, **Remove** (Undo, no confirm dialog). Today's main meal is a **Tonight** card with a
   Recipe button. Under the week title one row you can swipe: **Plan my week** (AI, adults) ·
   **Shop this week** (only once the week has meals) · **Copy last week**. A **busy evening** chip on a
   day (from the family calendar, dinner time − 90 min to + 30 min) and "Busy evening — something quick?"
   on its empty dinner; the add sheet lists quick meals first on such days. **Meal settings** = the tune
   icon in the top bar. A new family sees a first-week card. Pictures `meals-plan-week`, `meals-add-meal`,
   `meals-meal-sheet`. Keywords: tonight, busy, cooks, who cooks, servings, swap, move, double.
2. **NEW `meals-meal-settings`** (topic meals, route `/meal-plan/settings`): which meals you plan
   (breakfast, lunch, dinner, snack), usual servings, dinner time (also sets the busy-evening window).
   Everyone in the family can change them. On the web too (⋯ → Meal settings). Picture
   `meals-meal-settings`. Then remove `/meal-plan/settings` from `pending` in `help/routes-allowlist.json`.
3. **NEW `meals-leftovers-and-eating-out`**: in the add sheet the **Leftovers** chip (pick the meal from
   the last 3 days), **Eating out** and **Takeaway**; in the meal sheet **Eat out instead** /
   **Leftovers instead** / **Cook double** (the dish moves to the next free dinner, one Undo); the
   Tonight widget says "Eating out" / "Leftovers: …". Web: the same from quick add and the meal panel.
4. **`meals-add-recipe`** — the recipe screen has a **Plan** button (Plan it sheet: day, meal, servings);
   the recipe's **source** is a small pill at the top next to time/servings; deleting a recipe no longer
   removes it from the meal plan (the planned meals stay, with the recipe's name).
5. **NEW `meals-cook-mode`** (short): the **Cook mode** switch above the ingredients keeps the screen on
   while you cook; it is off each time you open a recipe and turns itself off after 1 hour without a
   touch. Picture `meals-cook-mode`. Link from `meals-add-recipe` related.
6. **`meals-youtube`** — a YouTube recipe shows a live video preview in its source card (not saved), and
   the video picture at the top with ▶ when the recipe has no own photo; no video picture is saved any
   more — add your own photo. For adults (18+); a video whose description links to a recipe page can be
   imported by anyone. On the web only such videos can be imported; others say "open it in the app".
7. **NEW `meals-share-sheet`**: share from another app into daili → **Note | Recipe | Event**. Recipe:
   a link (also straight from the browser or YouTube), a photo (1 AI action, only the first picture is
   read) or text. Event: the AI suggests the event from a message (WhatsApp, Signal …) or a screenshot
   (1 AI action). Nothing is saved until you tap Save. Picture `meals-share-sheet` if it was made (the
   app report says). Link from `meals-import-link`, `calendar-add-event`, `notes-notes` related.
8. **`meals-search-online`** — before you type, idea rows (season, quick dinners, new on the blogs, your
   family's favourite; See more); every card shows its cooking time; recipes come from blogs in your own
   language (a small language tag marks the rare card that isn't); **Save and plan** on a result. Picture
   re-shot. Non-recipe posts (round-ups, weekly menus) no longer appear.
9. **`meals-suggest`** — **Try again** gives new ideas; after "Add N dinners" a sheet offers to add the
   ingredients to a shopping list; for adults (18+), asks once.

**Calendar + Home**

10. **`calendar-phone-calendars`** (the "other calendars" article) — **Copy to Daili → Edit in Daili**:
    the event stays linked, the original disappears from daili, time/title/place changes from a Google
    calendar or a calendar link arrive by themselves; the **From {calendar}** line on the event; if you
    changed a detail yourself the app asks **Use it / Keep mine**; if the original is gone: **Removed from
    … → Delete / Keep**; linked events can't repeat; events you copied before were linked too. Phone
    calendar: the phone event is hidden on this phone while the daili event exists and comes back if you
    delete it; no automatic updates. **Only me** on calendar links: every member may add their own "Only
    me" link; only admins add links for the whole family; a private link shows "Only you" and has no
    Belongs to. Google: the per-calendar switch is now **Only me** (ON = only you see it; Belongs to is
    hidden while on). **Refresh now** in the account's ⋮ menu, and pull down on the calendar fetches your
    Google calendars right away (at most every 5 minutes). Pictures `calendar-link-only-me`,
    `calendar-linked-event`. Keywords: edit in daili, linked, only me, refresh, pull to refresh.
    🔴 Do NOT mention Outlook anywhere (not announced yet) — say "Google calendar" and "calendar link".
11. **`calendar-views`** — Year view: the **All events** switch (off by default) also shows events with
    a time, as one-day bars; too many → a line says to open a month; short events show the start of
    their title when there is room. **Pull down** on any calendar view reloads it (and refreshes your own
    linked calendars). Web: the same; All events is remembered per browser; the full title on hover.
    Picture `calendar-year-view` re-shot.
12. **The article that explains the Filter button** (find it by content — `calendar-categories` or
    `calendar-views`): new **Calendars** section — hide the family calendar or any linked / phone
    calendar; remembered on this phone for each family; counts on the Filter button; Home and widgets
    are not filtered. Web: the same, per browser. Picture `calendar-filter-calendars`.
13. **`start-home`** — the week card lists today's remaining events (up to 3) with start–end time and
    "+N more" on the last row; when nothing is left today it shows the next one; includes linked and
    phone calendars; the "n today" badge is gone; in the week view (popup and pinned card) swipe
    sideways on the events for the next/previous day and on the day strip for the next/previous week.
    New **Tonight** card: tonight's dinner, or 3 meals that plan with one tap (+ Undo) and "Plan the
    week". Picture `start-home` re-shot.

**Lists, notifications, account**

14. **`lists-due-reminders`** — new switch **Remind again every day until done** under the reminder:
    the reminder comes back every day at the same time until the task is ticked off (at most 30 days
    after the due date; works on already-overdue tasks); the first timed choice is now **At due time**.
    Web: the same under the Reminder menu. Pictures `lists-remind-daily` (new), `lists-due-reminders`.
15. **`notifications-choose`** — new row **Tips & suggestions** (the last push switch, above Email).
    Web: its own "Tips" group. Picture re-shot.
16. **NEW `notifications-tips`** (short): what they are (one short notification about a feature your
    family has not tried), how often (at most one a day, only a few in total, early evening, never in
    quiet hours), how to turn them off (Settings → Notifications → Tips & suggestions, app or web).
17. **NEW `account-help-improve`** (topic account): the **Help improve Daili** switch — on the last
    sign-up screen, in a one-time question on Home, and in Settings → About under Privacy policy. On =
    daili counts which screens you open (numbers per day, never what you typed; nothing in Cycle) and
    sends crash reports; off = everything stops and the stored counts are deleted. Only adults (an admin
    or someone 18+) can switch it on. Link to the privacy policy. Picture `account-help-improve`.
18. **`account-preferences`** — AI features are for adults (18+): the first time, daili asks once;
    while AI is not allowed, Settings → Preferences shows an **I'm 18 or older** row. Add one line
    "for adults (18+); daili asks once" to every AI article: `meals-suggest`, `meals-photo`,
    `meals-youtube`, `calendar-photo`, the Notes AI article (find it: `notes-notes` or `notes-find`),
    `account-avatar-ai`.
19. The older owed items in PLAN.md "Help sync owed" are NOT part of this prompt — leave them.

🔴 Never mention: Outlook, the "free forever" welcome promise, Siri on the watch, widget background
updates, Nutrition / calorie tracking (all "not announced yet" or not built).

## Routes
Run the help route check against the app's HEAD (`DAILI_APP_REPO` as the build expects). Every app route
added since 1.14.0 that has no article (the build names them) goes into the `routes:` of the article
above that covers it; if one is a one-time or internal screen, add it to `never` with a reason. The build
must end with an empty `pending` list.

## Translations
Translate every changed and new article into all `HELP_LOCALES`, following
`claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md` (labels from each language's ARB). New pictures: the
runner already made them for all locales; if a locale's picture is missing, list it in the report (do not
invent one). Pictures that did not change: untouched. Sub-agents may translate in parallel, one locale
group each — every sub-agent MUST use model claude-opus-5-5.

## Build
`npm run build` must pass (check-help, routes, search tests). A build failure not caused by this change:
stop, report `blocked`. Read the built English + German `meals/plan-week`, the new `meals/meal-settings`,
`calendar/phone-calendars` and `account/help-improve` pages: text, pictures, related links render.

## Commit & push
`docs(help): 1.15.0 — Meals 2.0, Edit in Daili, calendars filter, Home card, share to event, daily reminder, tips, help improve`;
body `Prompt: claude-prompts/2026-11-05/001-help-sync-1-15-0.md`. Your files only (plus the help
pictures and `help/media*.json`). 🔴 Do NOT stage the untracked `static/assets/img/photos/` folder or
anything under `legal/`. **Push now. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-11-05/001-help-sync-1-15-0.md` (file-write tool, never a heredoc; `wc -c` non-zero),
half a page: articles changed + new (and any from the list you left alone, with why), labels checked (and
any mismatch with a report), routes added, locales done, missing pictures, build result, SHA + push.
`## Help impact`: this IS the help sync — list the article ids.
