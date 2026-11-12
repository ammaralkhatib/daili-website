# Help impact since the 1.16.0 cut (2026-11-10 20:25) — fact list for help sync 1.16.2

Collected by Planning Claude 2026-11-12 from every report's `## Help impact` section (verbatim). `none` lines dropped.

## familyplanner/familyplanner-app · 2026-11-10/016-minute-steps-habit-reminder-tap.md
- Habits reminder article: if it says the tap "opens the habit's page", it should now say the tap opens your habits list at that habit, ready to tick. The app's local help copy (`test/fixtures/help/en.json`) has no such sentence. Please check the live article on daili.app/help.
- Any article that mentions 5-minute steps in time pickers: now every minute. None found locally.

## familyplanner/familyplanner-app · 2026-11-11/002-shopping-2-recently-bought-urgent-going.md
- `lists-shopping`: bought items are now "Recently bought" chips (tap to add back, pencil to delete, Clear all), urgent items (red !, sheet pill, swipe right), the "I'm going shopping" button, and new menu words ("Add all back", "Clear recently bought"). Pictures `lists-shopping-detail` and `lists-shopping-item-sheet` need re-shooting.
- `settings-notifications`: new switch "Someone is going shopping".

## familyplanner/familyplanner-app · 2026-11-11/003-shopping-2-typed-amount-paste.md
`lists-shopping`: you can type the amount with the name ("2 kg apples" → apples, 2 kg; tap the chip to keep your text), and paste a whole list (several lines) to add everything at once.

## familyplanner/familyplanner-app · 2026-11-11/004-phone-calendar-own-colour-family-calendars-row.md
- `calendar-phone-calendars`: new **Colour** row under "Belongs to" for each phone calendar that has a colour. "Person's colour" (default) or "Calendar's colour". With "Calendar's colour" the stripe at the front of the events is the calendar's own colour; "Belongs to" still decides the People filter and columns. Saved on this phone only.
- The linked calendars / calendar links article that describes the Family screen's **External calendars** section: there is a new last row, "Phone, Google and Outlook calendars", which opens Calendar settings (phone, Google and Outlook calendars are managed there, not on the Family screen).

## familyplanner/familyplanner-app · 2026-11-11/005-calendar-widget-linked-and-phone-events.md
Widgets help article: the Calendar widget now also lists events from linked
calendars (calendar links, Google, Outlook) and from the phone calendars
switched on in Daili. Phone events added while Daili has been closed appear
after the next time Daili is opened.

## familyplanner/familyplanner-app · 2026-11-11/007-cycle-rose-dot-ring-main-screen.md
- `cycle-start`: new rose colour, and the ring is now dots. The help shot needs a retake.
- `cycle-calendar`: "Edit period days" is now a pencil in the month header (no button under the calendar). In edit mode, Cancel/Done sit at the bottom of the screen. The legend has 3 items. The spotting and "symptoms or note" marks are explained in the info sheet. The help shot needs a retake.

## familyplanner/familyplanner-app · 2026-11-11/008-cycle-day-sheet-settings-shots-final.md
- Help shots `cycle-day` and `cycle-settings` need new pictures (and `cycle-start`, `cycle-calendar` from 007).
- Article texts: "Clear day" is now a bin button next to Done. The amount is one three-part control (Light · Medium · Heavy). Spotting only shows while "Period today" is off. Moods are faces. Settings rows moved: Lock, Home tile and "Show on my calendar" are under Privacy, and "Suggest supplies" is under Reminders.

## familyplanner/familyplanner-app · 2026-11-12/002-instagram-android-own-identity.md
`recipes-from-instagram`: it works on Android now, and there is a new message,
"Couldn't read this post" (with "Choose screenshots"), when Daili cannot load the
post — e.g. offline.

## familyplanner/familyplanner-app · 2026-11-12/004-wall-display-address-guide-day-sheet-weather.md
- wall-display article: the tablet address is now a big card with a Copy button, and a new
  "Setup guide" row links to daili.app/wall-display.
- calendar day sheet (and the Home week popup): shows that day's weather (icon + high / low) at
  the top right; a tap opens the Weather screen.

## familyplanner/familyplanner-app · 2026-11-12/006-meals-b5-recipe-screen-v2.md
- `meals/add-recipe`: the edit screen has a new **Our notes** field.
- **New article needed:** the recipe screen — the servings stepper ("set the servings, amounts update, nothing is saved, Add all to list uses the new amounts"), **Who likes it** (tap your own face; admins also for children without a login), "On the menu N times", and **Our notes**.
- `meals/find`: unchanged (the recipe list was not touched).
- The existing help pictures of the recipe screen (`meals-to-shopping`, `meals-plan-it`, cook mode) now show the new layout and should be re-taken at the next help sync.

## familyplanner/familyplanner-app · 2026-11-12/007-week-popup-weather-hours-strip.md
Home week popup shows the day's hourly weather (was: one high / low pill).

## familyplanner/familyplanner-app · 2026-11-12/008-categories-per-list.md
`lists-shopping: categories can be switched on/off per list (Categories screen: In this list / Not
in this list, Turn all off; settings icon in the item sheet)`. Help shots to re-shoot:
`lists-shopping-item-sheet`, `settings-shopping-category-edit` (+ the new `lists-categories*` ux shots).

## familyplanner/familyplanner-app · 2026-11-12/009-recipe-who-likes-it-avatars.md
none. The recipe-screen article is not written yet. When it is, it must say that faces are
dimmed until that person answers.

## familyplanner/familyplanner-app · 2026-11-12/012-widget-family-ios.md
widgets article: new "Family or group" setting on iPhone (Edit Widget → Family or group → "Active family" or one of your families; "Tap to load" the first time). Lock-screen widgets don't have it.

## familyplanner/familyplanner-app · 2026-11-12/013-widget-family-android-final.md
widgets article: new "Family or group" setting on Android (long-press → Reconfigure, the first row) and on iPhone (Edit Widget → Family or group): "Active family" or one of your families. The first time, the widget shows "Tap to load". The widget header shows the family's name. Lock-screen widgets, Quick add and the watch keep following the active family.

## familyplanner-api · 2026-11-10/007-new-shopping-lists-grouped.md
`lists-categories` (daili-website `help/en/lists/categories.md`): step 2 says
"Turn on **Group by category**." New shopping lists are now grouped already. Suggested
text: "2. New shopping lists are already grouped. For an older list, turn on **Group by
category**." The screenshot (switch circled) still fits.

## familyplanner-api · 2026-11-11/003-shopping-2-urgent-going-prune.md
`lists-shopping: urgent mark, going-shopping push, bought items kept = newest 60` (text follows with the app prompts).

## familyplanner/daili-web · 2026-11-11/001-board-event-popup.md
`anywhere-wall`: new for the user — tap an event to see when, who, where and its note, and tap a
Month day to see everything on it. The article is still true but does not mention this. One line
under the list of views would cover it.

## familyplanner/daili-web · 2026-11-11/002-board-calendar-tab.md
`anywhere-wall`: the line that lists the wall screen's views must change from "Home, Week, Month,
People, Meals, Lists, Habits, Countdown" to "Home, Calendar (Day · Week · Month), Meals, Lists,
Habits, Countdown". Also add one sentence: "Tap a face to see one person's plans; the rest fade."
I could not quote the exact live line, because the help fixture in `familyplanner-app` only links
to `anywhere-wall` and does not contain its text.

## familyplanner/daili-web · 2026-11-11/003-board-day-time-grid.md
`anywhere-wall`: add one line: "Calendar · Day shows today as a time grid, one column per person,
with a red line at the current time; tap List for the old list with to-dos."

## familyplanner/daili-web · 2026-11-11/005-board-meal-slots-quiet-week.md
anywhere-wall: one line — "On the Meals tab, tap an empty day to plan its dinner."

## familyplanner/daili-web · 2026-11-11/006-board-add-pill-fade-nav.md
`anywhere-wall`: "tap + to add" → "tap **+ Add** at the top"; add "On Calendar, use ‹ › or swipe to
see other days, weeks and months; Today brings you back"; "List shows the same person columns, with
to-dos" (it no longer has an Everyone column).

## familyplanner/daili-web · 2026-11-11/007-board-home-redesign.md
`anywhere-wall`: Home now reads "Today shows what is next, the rest of today and tomorrow; tap a
habit ring to open Habits; with no dinner, tap Plan a dinner".

## familyplanner/daili-web · 2026-11-11/008-board-meals-grid-popup.md
`anywhere-wall`: Meals now reads "Meals shows the week as a grid — breakfast, lunch and dinner. Tap
a meal to see its recipe. On a family screen, tap + in an empty cell to plan a meal."

## familyplanner/daili-web · 2026-11-11/009-board-todos-tab-shopping.md
`anywhere-wall`: change the views line to "Home, Calendar (Day · Week · Month), Meals, To-dos,
Shopping, Habits". Add: "To-dos shows each person's open to-dos side by side, plus an Anyone column
for to-dos nobody is assigned to. Tap a name to see one person's; the rest fade." Remove every
mention of the Countdown tab. Home's "Coming up" card still counts the days.

## familyplanner/daili-web · 2026-11-11/010-board-habits-rewards.md
`anywhere-wall`: add to the Habits part: "Habits look like in the app: tap a row to tick it. Each
person's rewards are under their habits — tap one to see it. On a wall screen, a parent can tap 'We
did it' on a full reward or add a new one with '+ Reward'."

## familyplanner/daili-web · 2026-11-11/011-web-habits-3-parity.md
The web Habits help article needs an update. It should say:
- the page shows one person at a time ("Switch person");
- there are three views (Cards, Checklist, Compact);
- clicking a habit opens its year and numbers;
- a tick shows a star toast;
- filling a reward opens "Plan it / We did it / Later".
Help impact: web habits article: one person at a time, three views, habit detail, star toast,
reward-reached dialog.

## familyplanner/daili-web · 2026-11-12/003-board-chrome-polish.md
`anywhere-wall`: "hold to leave" becomes: "To leave, tap the exit icon at the bottom of the
left bar, then press and hold the big round button until the ring is full. On a family screen,
Daili then asks whether to stop using the tablet." And "tap **+ Add** at the top" becomes "tap
the round **+** at the top right".

## familyplanner/daili-web · 2026-11-12/004-board-event-popup-cook-mode.md
`anywhere-wall`: "Tap an event to see when, who, where and its note" becomes "Tap an event to see
everything the phone shows: when, who it is for, how it repeats, its category, place and note, and
who added it." New paragraph: "On the Meals screen, open a recipe and tap **Cook**: the recipe fills
the screen, with ingredients on the left and steps on the right. Tap an ingredient or a step to
tick it off. The screen stays on and does not go back to the start while Cook mode is open."

## familyplanner/daili-web · 2026-11-12/007-wall-display-menu-entry-guide-links.md
wall-display help article: the left menu now has a "Wall display" button (above Help) that
opens the board, the family-screen setup and the code pairing. The menu, Preferences and the
pairing page now link to the setup guide at daili.app/wall-display.

