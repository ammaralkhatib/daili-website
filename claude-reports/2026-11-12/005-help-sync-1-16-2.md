# 005 — Help sync 1.16.2

**Status: done.** Commit `8845a546`, pushed to `origin/main`. **Not deployed** (no `./deploy.sh`). `LIVE_APP_VERSION` is still 1.16.1.
Step 0: the 3 prompt files went first as `f5b7adf5` (pushed). Report 004 and `static/assets/img/photos/` stay uncommitted, as the prompt said.

## Articles
**New:** `meals-recipe-screen` (`since: 1.16.2`). It covers servings (+/−, "not scaled", nothing saved), **Who likes it** (dimmed faces, admins answer for children), "On the menu", and **Our notes**. It has 3 pictures. It has no page until the version bump; it is in `dist/help/<loc>.json`.

**Changed** (`updated: 2026-11-13`), 18 articles:
- **Widgets:** `anywhere-widgets` and `anywhere-widgets-settings`: Family or group, Active family, Tap to load, the family name, a tap opens that family, and the Calendar widget with linked and phone calendars.
- **Lists:** `lists-shopping` (Recently bought, Urgent, I'm going shopping, "2 kg apples", paste) and `lists-categories` (In this list / Not in this list, Turn all off, new lists already grouped).
- **Meals:** `meals-add-recipe` (Our notes), `meals-to-shopping` (Add all to list uses the new amounts), `meals-instagram` (Android, "Couldn't read this post").
- **Calendar and weather:** `calendar-phone-calendars` (Colour row, Family screen row) and `start-weather` (day sheet weather, hourly weather on Home).
- **Cycle:** `cycle-start`, `-calendar`, `-privacy`, `-supplies`.
- **Wall:** `anywhere-wall` (new tabs, address + Copy, Setup guide → daili.app/wall-display, leaving) and `anywhere-wall-tick` (the round +, rewards).
- **Others:** `habits-reminders`, `notifications-choose` (going-shopping switch), `budget-bills` (alt text only, because the re-shot `notifications-choose` picture no longer shows Bill reminders).

**Version gating:** the help engine has no way to hide a single paragraph by version, and 1.16.0 did not do that either. So the changed pages describe 1.16.2 as soon as the site is deployed. 👉 Deploy only after 1.16.2 is in the stores.

**Code beat the prompt (I followed the code):**
- **Widgets:** Quick add has no family setting. The family name shows only when a widget shows a family that is not the active one.
- **Home weather:** hourly weather opens from the week card's next event, not from a day.
- **Shopping:** the 30-minute limit is per person and per list. The button is also hidden on archived lists. Urgent items move up within their category.
- **Habits:** on a counter, **Done** can't count. Tapping the reminder opens Habits.
- **Wall screen:** the round + asks "Who's adding?" (it is not "the tapped person"). Anyone with a login can add a reward; only parents tap **We did it**.

A fresh fact-check found 16 more errors. I fixed all of them before translating.

**Left alone:**
- The web Habits line: there is no web Habits article.
- 5-minute steps: no article mentions them.
- `lists-move-items` and `meals-cook-mode`: still true with the new pictures.

**Left out (150-word limit):**
- **Lists:** press-and-hold to move, the budget offer and Keep in stock (all three are in `lists-shopping`), plus the "Delete category" reassurance detail.
- **Meals:** Instagram's "remove the picture".
- **Calendar:** **Refresh now** and **From School**.
- **Wall screen:** the iPad/Android install lines (the Setup guide has them now) and Day · Time/List.
- **Other:** "Today's events show their weather", and the Cycle tile in Home's edit mode.

## Routes
No app route changed since 1.16.0. The `pending` list is empty, and 84 routes were checked against app HEAD (`b8e10a21`; the app tree was clean).

## Locales
All 24 `HELP_LOCALES`, done by 8 Opus translators with 3 locales each. All of them finished before the commit. I checked every locale myself with the guard.
- The old "widget settings are in English" notes are gone, because the widget strings are translated now.
- One shared English bug (a missing blank line in `anywhere-widgets-settings`) is fixed in all 25 files.

## Pictures
- **Committed:** 21 ids × 25 locales. No locale picture is missing.
- **Held back:** `family-calendars`. The screenshot shows "Phone, Google and **Outlook** calendars", and Outlook is on the never-mention list. I removed it from every `media*.json`. Its 25 files are in `/tmp/help1162/held/`; I did not delete them. The article keeps the sentence without the picture.
- **App issues seen in the pictures:**
  - In ja, ko, zh-Hans, zh-Hant and th, `meals-recipe-servings` shows every amount as "not scaled". Scaling probably can't read the ingredient format there.
  - uk, bg and el only understand Latin "kg", not "кг".

## Build
`npm run build` is green: help OK (111 articles × 25 locales, 84 app routes), test-check-help OK, build OK (3,634 pages), detector OK and help search OK. I read the built en and de pages for widgets, widgets-settings, shopping and categories, and `meals-recipe-screen` in en.json and de.json. The text, the pictures (all files are in `dist/`) and the related links are fine, with 0 broken links.

## Open items for the owner
- Deploy the help after 1.16.2 is live in the stores.
- `family-calendars`: re-shoot it without the Outlook row, or decide that the screenshot is fine.
- The app scaling issue (ja/ko/zh/th) and "кг" (uk/bg/el).
- `WALL_GUIDE_PUBLIC = false`, so daili.app/wall-display is noindex and not linked from the site, yet the app and help link to it. Its text is also out of date ("Hold to leave" without the exit icon, and "Connect a screen with a code").

## Help impact
This IS the help sync.
- **New:** meals-recipe-screen.
- **Changed:** anywhere-widgets, anywhere-widgets-settings, anywhere-wall, anywhere-wall-tick, budget-bills, calendar-phone-calendars, cycle-start, cycle-calendar, cycle-privacy, cycle-supplies, habits-reminders, lists-shopping, lists-categories, meals-add-recipe, meals-instagram, meals-to-shopping, notifications-choose, start-weather.
