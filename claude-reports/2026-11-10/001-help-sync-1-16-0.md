# 001 — Help sync 1.16.0

**Status: done, with one open check (see "Minzi grep").** Commit `d2377aa7`, pushed to `origin/main`. **Not deployed** (no `./deploy.sh`). `LIVE_APP_VERSION` is still 1.15.0, so the new articles have no page yet. They are in `dist/help/<loc>.json`.
Step 0: the planning docs went first as `45179230` (pushed).

## Articles
**New** (`since: 1.16.0`): `habits-rewards`, `meals-wishes`, `meals-instagram`, `start-read-aloud`, `notifications-spoken`. `lists-stock` is now in all 25 languages, with its picture.
- **`start-read-aloud`, not `home-read-aloud`:** the build guard needs id = `<topic>-<slug>`, and there is no `home` topic. Nothing in the app links to that id.
- **`notifications-spoken`:** the **Speak my reminders** switch lives in Settings → Read aloud, and `notifications-choose` had no room left. So it got its own short article. It says "Android only".

**Deleted:** `habits-minzi` in all 25 languages, with its picture. The site has no redirect list for removed help articles, so I added none. No link, `related` line or search entry points to it now. (A `.htaccess` 301 to `/help/habits/rewards/` would only work after the version bump.)

**Changed** (`updated: 2026-11-10`): 44 articles.
- **Habits:** what, tick, streaks, create, private.
- **Lists:** shopping, todos, categories, edit-list, archive-templates.
- **Meals:** plan-week, meal-settings, suggest, copy-week, to-shopping, photo, share-sheet, add-recipe, find (now also covers sorting), youtube, import-link.
- **Calendar:** add-event, edit-delete, photo, reminders, repeating, views.
- **Notes:** notes, find, pictures-voice.
- **Start:** home, today, weather.
- **Notifications:** choose, family, tips.
- **Other:** budget-repeating, anywhere-trmnl, wall, web, widgets, widgets-settings, watch.

**Minzi is gone everywhere in the help:**
- The Habits topic is now "Habits & rewards" in all 25 languages.
- The Minzi picture on the help home page is removed (template, `build.mjs`, CSS, `minziAlt`, and the `minzi-look-right.webp` file).
- **Three old pictures still showed Minzi, so I dropped them:** `watch-habits`, `notifications-help` ("Minzi's trips") and `start-features` ("with Minzi the cat"). I removed them from every `media*.json` and deleted their webp files in all locales. `notifications-help` and `start-features` now have `mediaPending`.

**Checked, no change needed:** `habits-categories`, `habits-reminders`, `start-edit-home`, `family-activity` (the bell is at the top again), all of `calendar-phone-calendars` / import / private / search / categories, and meals cook-mode / paste / search-online / leftovers.
- **Older owed lines** (account-delete, password, download-data, verify-email, family-roles, family-invite, start-create-family, start-sign-in, account-preferences): each one was already true.

**Fact checks:** two fresh Opus agents checked the English against the app, web and API code before translation. They fixed 5 sentences:
- **Meal wishes:** the wisher is told only when someone else plans the wish.
- **Instagram:** without AI, the text is sorted on your phone.
- **Calendar reminders:** a shared event reminds the people it's for, not the whole family.
- **Habit templates:** the **Added** label means "a habit you already have".
- **Read aloud:** **Show me how** only appears when the phone has a basic voice.

I also fixed `calendar-views`: "On Home, tap Calendar" became "tap the week card", because Home has no Calendar tile.

**Where the code disagreed with the prompt (I followed the code):**
- Any member can plan a wish.
- The Checklist shows 5 days; you can change up to 7 days back.
- The "Your reminder" sheet ends with **Save** (the form's sheet ends with **Done**).
- The category sheet's last cell opens an emoji picker with search. There is no keyboard cell any more.
- Nothing celebrates a finished list now, so the "Minzi may cheer" line is gone with no replacement.

**Left out to stay under 150 words:**
- **Rewards:** the ★ lifetime chip, "+N more", Enjoyed and Start again.
- **Watch:** the ring.
- **Habit ticks:** confetti.
- **Shopping and to-dos:** the Quantity/Note step, Undo, Only me, Group by, Add to budget.
- **Calendar:** the "first N entries" note, "attachments stay on the first day", and the one date-and-time sheet (no article mentioned the old dialogs).
- **Weather:** the source line.
- **Notifications:** the list of daily-summary switches.

## Routes
`/habits/rewards`, `/habits/rewards/new`, `/habits/rewards/:id/edit` → `habits-rewards`; `/settings/read-aloud` → `start-read-aloud` (+ `notifications-spoken`). The `pending` list is empty: 84 app routes were checked against app HEAD.

## Locales
All 24 `HELP_LOCALES`, done by 12 Opus translators with 2 locales each. All of them finished before the commit. Every label is an `{{arbKey}}` placeholder filled from each `app_<lang>.arb`. A block-parity check compared each file with the English. I re-filled all 1,225 files myself: 0 problems.

## Pictures
- **Committed:** all pictures from app prompt 013, including the re-shot `meals-copy-week` and `meals-suggest`, which their articles use again.
- **No locale picture is missing.**
- **Re-shoots owed:** `watch-habits`, `notifications-help` and `start-features` (dropped, see above); a Tips shot for `notifications-tips` (its old picture now circles "Your meal wishes"); `anywhere-trmnl` (old design, but its alt is still true).

## Build
`npm run build` is green: check-help OK, 110 articles × 25 locales, build OK with 3,483 pages, detector OK, help search OK. I read the built en + de for habits-rewards, habits-what, lists-stock, meals-wishes and start-read-aloud: the text, pictures (files in `dist/help/media/`) and `related` links are all fine.

## Minzi grep
`grep -ri minzi help/ templates/` = **0**. In `dist/help/` = **0**.
`grep -ri minzi dist/` = **59 files**:
- the marketing home page and `features/habits` pages in 28 languages (from `content/*.json`);
- `home.*.css`;
- the old changelog pages.

The marketing pages are not help files, so this prompt did not touch them. **They need their own website prompt before deploy.**

## Open items for the owner
- A website prompt to take Minzi off the home and `features/habits` pages.
- Re-shoot the 3 dropped pictures plus a Tips picture.
- **App ARB:** `readAloudIosMenuReadSpeak` is still English ("Read & Speak") in fr, it, nb, fi, tr and el. "(enhanced)"/"(premium)" are also still English in some of these (it, pt, tr). The read-aloud article shows these English words until the ARB is fixed.
- The widget settings are still English in several locales (an old note in those translations says so).

## Help impact
This IS the help sync:
- **New:** habits-rewards, meals-wishes, meals-instagram, start-read-aloud, notifications-spoken.
- **Deleted:** habits-minzi.
- **Changed:** the 44 articles listed above, plus lists-stock in all locales, notifications-help and start-features (picture dropped), and the Habits topic name.
