# Help impact since 1.15.0 — collected by Planning Claude 2026-11-10

Every `## Help impact` section of the app, web and api reports from 2026-11-05 (after the 1.15.0 cut) to 2026-11-10, verbatim. Lines that only said "none" are left out.

### familyplanner-app — 2026-11-05/004-calendar-meal-cook-faces.md
`calendar-filter` + `meals/plan-week`: the calendar's agenda and day sheet show the cooks next to a planned meal. Note: I found no article with these exact ids in `lib/` or `assets/`, only a code file named `calendar_filter_sheet.dart`, so please check the ids at the help sync. Do not write that the timeline views or Home show cooks.

### familyplanner-app — 2026-11-05/006-meal-plan-bottom-bar.md
`meals-plan-week`, `meals-suggest`, `meals-to-shopping`, `meals-copy-week`: the three
buttons moved from under the week header to a bar at the bottom of the screen
(Today · AI plan · Shop · Copy week). The labels are now "AI plan", "Shop" and "Copy
week". Any text that says "under the week" needs the new place, and the four
pictures need re-capturing at the next help sync. The help-shot keys did not change
(`help.meals.suggestWeek`, `help.meals.copyWeek`, `mealPlanShopWeek`,
`help.meals.dayAdd`).

### familyplanner-app — 2026-11-05/009-home-tiles-live-facts.md
`start-home`, `start-edit-home-tile`: tiles are shorter and show live facts (tonight's dinner, next birthday, member and recipe counts). The summary arrow is now a small round button. Pictures should be re-captured at the next help sync. The article text only needs a change if it quotes a tile subtitle ("Family recipe box", "Members & invites", "This week's meals", "Birthdays & celebrations").

### familyplanner-app — 2026-11-05/010-home-polish-followups.md
none (pictures only; already covered by 009's help note)

### familyplanner-app — 2026-11-05/014-home-bottom-bar-notes-count.md
- `start-today`: Today moved from the header to the bar at the bottom of Home.
- `family-activity`: the Activity button (bell) moved from the header to the bar at the bottom of Home — texts naming "the bell at the top" need the new place.
- `start-weather`: tapping the weather at the top of Home now opens the Weather screen.
- `notes-tile`: the Notes tile shows how many notes you have.
- Pictures re-captured at the next help sync.

### familyplanner-app — 2026-11-05/015-home-read-aloud-visible.md
none (the Vorlesen lane owns the article)

### familyplanner-app — 2026-11-05/016-home-header-icons-mini-fab.md
- `start-today`: Today is now a calendar icon at the top of Home, next to the weather chip ("tap the calendar icon at the top").
- `family-activity`: the bell is back at the top of Home.
- `start-weather`: the weather chip at the top opens the Weather screen.
- Pictures re-captured at the next help sync.

### familyplanner-app — 2026-11-06/001-event-sheet-layout.md
`calendar-edit-delete` (and any other Help picture showing the event sheet): the sheet looks different, so re-shoot at the next help sync. The empty grey rows and the tap-for-a-hint bubbles are gone; if a Help text mentions them, it needs a change.

### familyplanner-app — 2026-11-06/002-event-sheet-add-and-attach.md
- Attach articles: one Attach button + a list, instead of four pills.
- Photos on an event: camera / camera roll / Daili Photos.
- `calendar-edit-delete`: new Add chips on the sheet; links in notes can be tapped. Re-shoot its picture.

### familyplanner-app — 2026-11-06/003-plan-it-all-meals.md
`meals-meal-settings`: "Plan" on a recipe and "Move" on a meal now offer every meal;
"Meals you plan" only picks the default meal (the main meal, which the day's "+"
also adds). The article's sentence "The week then shows only the meals you plan" is
not true anymore (in the code it never was for meals that exist): the week shows
every meal you planned. Planning Claude should reword it in the help sync.

### familyplanner-app — 2026-11-06/004-photo-roster-and-cap.md
`calendar-photo`: new "Shift roster" option (type your name, only your shifts are read, up to two months) + the "Only the first N entries were read" note on the review screen.

### familyplanner-app — 2026-11-06/005-event-my-reminder.md
`calendar-reminders`: "Your reminder" in the event sheet (same as the event, none, or your own times; nobody else changes). The Edit form still sets the reminder for everyone.
`calendar-edit-delete`: the Reminder add-chip now opens "Your reminder", not Edit.

### familyplanner-app — 2026-11-06/006-event-more-days.md
`calendar-add-event`: new "More days" row in the New event form. Tick several days and save once; each day becomes its own event, and attachments stay on the first day. Not with Repeats. The server's report adds one point for this article: other family members get one bundled push about 3–4 minutes later, not an instant one.

### familyplanner-app — 2026-11-06/007-meal-not-eating.md
`meals/plan-week` (the article that covers the meal sheet): new "Who's eating" row in the meal sheet, and the week card can show "3 of 4 eating".

### familyplanner-app — 2026-11-06/008-event-sheet-followups.md
- Edit event: Edit is now a pencil icon, and Delete is the same size.
- Edit event: Edit (and every Add chip) returns to the sheet, not the calendar.
- Event sheet: "Added by" sits in the footer on two lines, and there are new Add chips for Repeats and Category.

### familyplanner-app — 2026-11-06/009-event-sheet-footer-avatar.md
Event sheet footer shows the creator's avatar.

### familyplanner-app — 2026-11-06/010-synced-event-sheets.md
`calendar-linked-event`: synced and phone event sheets show location + notes
rows and a lock row; "Edit in Daili" is now an outlined button in the sheet's
pinned footer, with its explanation beside it — help pictures of these sheets
need re-shooting at the next help sync.

### familyplanner-app — 2026-11-06/012-my-reminder-one-list.md
`calendar-reminders`: the event sheet shows YOUR reminder; tap it to change it
just for you; the form sets it for everyone.

### familyplanner-app — 2026-11-07/001-meal-note-link-pill.md
`meals/plan-week`: in the meal sheet, a link in the note shows as a button under the note;
one tap opens it. A link-only note shows the site name in the week.

### familyplanner-app — 2026-11-07/002-day-sheet-one-design.md
The day sheet: no count, "Today ·" / "Tomorrow ·" in the title, Add event always visible,
a new empty-day icon, and an event opens over the day. List rows everywhere: colour bar
inside the card, no lone faces, meal pictures and icons instead of emoji, thin lines
between rows, birthdays under the events. The Home week card now shows who cooks.
Help pictures to re-shoot at the next help sync (`tool/help-shots.json`):
- `calendar-edit-delete` and `calendar-linked-event` — the new day sheet is now under the
  event sheet.
- `start-today` — look at it: Today's event cards changed, but this picture is cropped to
  the top, so they may not be in it.
No help picture shows the day sheet itself, the pinned card or the list view. `start-home`
uses the unpinned card, which did not change. I did not read the Help article texts.

### familyplanner-app — 2026-11-07/003-habits3-home-cards.md
- `habits-minzi`: **its screenshot will break.** It highlights `help.habits.energy` on `/habits` (`tool/help-shots.json`), and the energy bar is gone from that screen. The article itself describes the cat and the energy, so it must go or be rewritten.
- `habits-what`: the screen now looks different, with no tabs or room. Text and screenshot need a refresh.
- `habits-tick`: ticking is the same, but it now happens on a card with a grid. The screenshot needs a refresh, and any mention of tabs must go.
- `habits-streaks`, `habits-categories`: their routes still work. Check the wording for any mention of tabs or the room.
- New: the person switch and the sheet have no article yet.
I found these ids in `tool/help-shots.json`. The help text itself is not in this repo (the fixture `test/fixtures/help/en.json` has only 6 articles, none about habits), so I could not read the wording. Please check it during the help sync.

### familyplanner-app — 2026-11-07/004-habits3-checklist-compact.md
- `habits-what`: the screen now has three views. The article and screenshot need them.
- `habits-tick`: you can now also tick in the Checklist, up to 5 days back from there. Counters open their sheet from a square.
- New: the view switch has no article yet.
The help text is not in this repo, so I could not read the wording. Help screenshots still use Cards, the default on a fresh install.

### familyplanner-app — 2026-11-07/005-habits3-detail-year-grid.md
- `habits-streaks`: the screen now shows the year and the chips first, and its help photo now highlights the chips. The text and the photo need a refresh.
- `habits-what`: the habit detail looks different. Check the wording if it describes this screen.
The help text is not in this repo, so I could not read the wording.

### familyplanner-app — 2026-11-07/006-habits3-remove-minzi.md
- **Picture removed:** `habits-minzi` (help shot, with its highlight `help.habits.energy`). No other shot depended on it.
- **App Help screens:** Help home, the help checklist and the tip sheet have new pictures (see above), and the cat's description for screen readers is gone.
- **Reworded strings users see:**
  - `featureInfoHabits` and `featurePickerBlurbHabits` (no cat)
  - `habitsHowItWorksTick`
  - `habitsCounterDone` ("Done for today!")
  - `habitsMenuRestFooter`
  - `habitsFormPrivateNote`
  - `settingsNotifyHabitChangesHint`
- **Server help text not changed:** `familyplanner-api/lang/en/habits.php` still names Minzi, and the help article text does not live in this repo. The plan handles it in Phase 4.

### familyplanner-app — 2026-11-07/007-habits3-widgets-watch-no-minzi.md
`widgets article`: the habits widget pictures show the old cat and energy bar and need new ones with the ring. Any words about Minzi or energy on the widget must go. The Apple Watch part, if it has a picture, needs the same.

### familyplanner-app — 2026-11-07/008-event-form-one-design.md
- Pictures to re-shoot at the next help sync (they show the event form or these sheets): `calendar-repeating`, `calendar-repeating-monthly`, `calendar-reminders`, `calendar-private`, `calendar-photo`. Prompt 009 takes them.
- Article text: the help articles are not in this repo (Help centre admin), so I could not check them. Please look in `calendar-photo` for "the scan icon above" (the button is now at the right of the title field), in `calendar-reminders` for "Add reminder" (now: tap the Reminder row and tick), and in any calendar article for "Description" (the field is now "Notes").

### familyplanner-app — 2026-11-07/009-event-date-time-sheet.md
- `calendar-add-event` (or whichever article explains new events): the date and the time are now picked in ONE sheet (month calendar + time wheel + Done), not a calendar dialog and a clock. The help articles are not in this repo, so I could not check their text. Please look for "clock" or "OK" in the date/time steps.
- Help pictures: none of the `tool/help-shots.json` pictures shows the date or time picker. The new `event-form-date` ux shot shows it, if a help picture is wanted.

### familyplanner-app — 2026-11-07/010-lists-one-design.md
- `lists-shopping`: delete = swipe left, or Delete in the item sheet. Move =
  press and hold. Quantity on the right of the row; "Completed" folds away.
- `lists-todos`: shorter dates, faces on the right, the bar colour follows the
  first person. Due chips only while typing. The picked person stands out
  (others fade), and the circles start on the left.
- Help pictures of both list screens need a re-shoot at the next help sync.

### familyplanner-app — 2026-11-07/011-habits3-round3-look-colours.md
- `habits-create`: the form now has an Icon row (current icon, 3 suggestions, "All {count}") and a separate Colour section with 24 colours. The icon picker no longer shows colours.
- `habits-tick`: the tick circle is smaller and filled in the habit's own colour. Confetti plays around it. Counters show the count inside the ring.
- `habits-what`: the header shows the avatar with a swap badge and a "Switch person" line, and it stays at the top while scrolling. Days before a habit started show as faint squares.

### familyplanner-app — 2026-11-07/012-habits3-icons-no-emoji.md
- `habits-create`: the icon picker has about 150 more icons; old habits now show an icon instead of their emoji.
- cheers article: the five cheers are icons in coloured circles (thumbs up, heart, party, strong, star), not emoji.
- widgets article: each habit row starts with a small square in the habit's colour; the small and medium widgets (and the watch) show the count only in the ring.

### familyplanner-app — 2026-11-08/001-event-form-sheets-done.md
`calendar-reminders` and `calendar-repeating`: the pictures show these sheets, so re-shoot them at the next help sync. The reminder article may mention a "Custom…" button; it is now a row in the list.

### familyplanner-app — 2026-11-08/002-lists-show-new-item.md
`lists-shopping`, `lists-todos`: after you add an item, the list scrolls to it and it lights up briefly.

### familyplanner-app — 2026-11-08/003-safety-family-notifications-links.md
`account-safety` and `notifications-family` are now linked from Settings and Notification settings.

### familyplanner-app — 2026-11-08/004-budget-weekend-shift.md
`budget-repeating`: new "If it falls on a weekend" row (and the weekend hint).

### familyplanner-app — 2026-11-08/005-lists-category-pills-emoji.md
`lists-categories`: new category sheet look: big emoji grid, keyboard cell for any emoji. The help pictures of the item sheet and category sheet need a re-shoot at the next help sync.

### familyplanner-app — 2026-11-08/006-lists-emoji-picker.md
`lists-categories`: the last cell opens a full emoji picker with search.

### familyplanner-app — 2026-11-08/007-meal-week-one-design.md
- Meals article: the week plan picture `meals-plan-week` changed; new gestures: swipe left to remove, press and hold to move.
- `home-popup-meal-plan`: new row look.

### familyplanner-app — 2026-11-08/008-meal-wishes.md
New Meals feature "Wishes" (bottom bar button, wishes sheet, add a wish, plan it). Needs a new help article `meals-wishes`.

### familyplanner-app — 2026-11-08/009-meal-wishes-part-2.md
- `meals-wishes` (new article): the add-meal section, the "<name>'s wish" tag, and the AI chip.
- `notifications-choose` / `notifications-family`: new switch "Your meal wishes".

### familyplanner-app — 2026-11-08/010-meal-week-followups.md
Pictures of the day sheet, the Home popup, Today and the week change (row ends, stronger meal pictures): re-shoot at the next help sync. The move sheet's greyed days are a new rule for users: check the meal-plan help article's move text at the same sync.

### familyplanner-app — 2026-11-08/011-month-view-one-design.md
`calendar-views`, `calendar-add-event`, `calendar-search`: the month grid in the background looks different. Any help picture or article showing the month grid, the week number in Monday's corner, the meal fork in month cells or the "New" tags needs a re-shoot or re-word at the next help sync. The "Week numbers" setting now shows a column on the left of the month grid.

### familyplanner-app — 2026-11-08/012-recipe-from-several-photos.md
- Recipe-from-photo article: up to 5 pictures, new review screen, still 1 AI action. Take photo stays one photo.
- `meals/share-sheet`: replace the "only the first picture" sentence with "up to 5". This applies to Recipe only; the **Event side still reads only the first picture**.

### familyplanner-app — 2026-11-08/014-meal-sheets-one-design.md
Meals help articles about the meal sheet, Plan it and Plan my week need a text and picture check:
- Meal sheet: the wish is now a pink pill, Recipe is a small pill under the title, Remove is a trash icon without a word, the note has no "Note" label, and the line explaining "Eat out or leftovers instead" is gone.
- Plan it: the picked day is solid green, only planned days have a dot, and "Pick a day. Free days are marked." is gone. Any article saying free days are marked must change.
- Plan my dinners: "Use family wishes" is now a switch row, not a chip.
Help-shot ids: `meals-meal-sheet`, `meals-meal-sheet-wish`, `meals-plan-it`, `meals-suggest`, `meals-add-meal`.

### familyplanner-app — 2026-11-08/015-date-time-sheet-everywhere.md
- **Help pictures to retake:** none. I searched `tool/help-shots.json` for shots that tap a date or time control and found none, and read the shots that sit near one: `lists-due-reminders`, `birthdays-reminders`, `habits-reminders`, `budget-entry`, `budget-repeating`, `budget-settings`, `cycle-settings`. Each shows the row, not the open dialog, so they stay true.
- **Help text — not checked, please do this in the release help sync:** the articles live at `daili.app/help/<code>.json`, outside this repo, so I could not read them. Articles to check: `habits`, `lists` (to-dos), `budget`, `notes`, `birthdays`. What changed for the user: a date or time now opens a bottom sheet instead of a dialog, and a note reminder is one sheet, not two steps. The in-app strings in `app_en.arb` and `lib/features/help` have no wording about the old dialogs.

### familyplanner-app — 2026-11-08/016-ai-scan-ring-photo-sheet.md
- `calendar-photo`: new sheet look and text; the scan button has a ring. Help shot: `calendar-photo`.
- `meals-photo`: the sheet behind "From a photo" has the new look and text. Help shot: `meals-photo` shows the chooser, whose row did not change, so it only needs a re-take if the article shows or describes the sheet.
- `account-avatar-ai`: the row has a ring. Help shot: `account-avatar-ai`.
- `meals-share-sheet`: the Event and Recipe boxes have a ring. Help shot: `meals-share-sheet`. It may not change if the shot opens on the Note side; I did not re-take it.

### familyplanner-app — 2026-11-08/017-home-loading-skeletons.md
`none` — no help article mentions the empty message or the card's loading state (searched the help strings for "Nothing planned").

### familyplanner-app — 2026-11-08/018-meal-sheets-final-check.md
None from this prompt. No exact hits for the next help sync.
One similar line, for a quick look at that sync: `daili-website/help/en/meals/leftovers-and-eating-out.md:22`
says "**Eat out instead** moves the dish to the next free dinner". The button names still exist
(`mealSheetEatOutInstead`, `mealSheetLeftoversInstead`), so I saw no reason to treat the line as wrong.

### familyplanner-app — 2026-11-08/019-instagram-link-to-recipe.md
- New article "Recipes from Instagram".
- `meals/share-sheet`: new Instagram line, "Daili reads the recipe from the post's text."

### familyplanner-app — 2026-11-09/001-instagram-picture-and-video-row.md
- Recipe-add article: the row is renamed "From YouTube or Instagram", and it takes only those two links. The paste-text row now says "From TikTok, Facebook or a message".
- "Recipes from Instagram": the picture comes along. iPhone: Daili sits under "More" in the share menu the first time; tip: add it to favourites.

### familyplanner-app — 2026-11-09/002-notes-list-one-design.md
`notes-list`, `notes-filter`: the filter button is now inside the search field; the view switch moved to the ⋯ menu; the first-time screen has no button; a new note, also from the share sheet, scrolls into view with a burst, and Save-to-Daili now lands on Notes.

### familyplanner-app — 2026-11-09/003-note-editor-rich-text-rows.md
- `notes-new`: settings are now rows in the sheet (Who can see it, Tags, Remind me); the ⋯ sheet is gone.
- `notes-formatting`: formatting now shows while typing, with no signs; the format row replaces the two small pills and appears only with the keyboard up.
The Help pictures were not re-shot. `notes-new` and `notes-formatting` in `tool/help-shots.json` were not run, because a normal run writes into the website repo. They should work, since they use the same keys and the same switch as the new shots, but that is not proven until the release help sync.

### familyplanner-app — 2026-11-09/004-note-checklist-like-keep.md
`notes-formatting`: a checklist now works like rows, with drag, × and a Completed section; bold, italic, heading and bullets are off in a checklist.

### familyplanner-app — 2026-11-09/005-youtube-picture-from-list.md
- Recipe-add article: after Save you land on your recipes list and see the new recipe there, not on the recipe screen. This holds for every way of adding, including imports.
- Recipe-add article: the video sheet's button now says "Read".

### familyplanner-app — 2026-11-09/006-stock-lists-core.md
New screen: stock list (`/lists/:id` for a list of type stock). Shopping "+" now asks Shopping list / Stock list.

### familyplanner-app — 2026-11-09/007-stock-lists-extras.md
- `lists-stock`: new article (what a stock list is, how to create one, tap = low/out, ticked = back in stock, Keep in stock, who sees what, old app versions).
- `lists-shopping`: gains one line about "Keep in stock". The English text was also trimmed slightly to stay within the 150-word limit; translations were not trimmed.
- Both are committed but **not live** until the website is deployed.

### familyplanner-app — 2026-11-09/008-calendar-show-new-event.md
- `calendar-add-event`: after you save a new event and close its sheet, the calendar shows you where it landed with a short glow.
- `calendar-views`: Week, 3-day and Day open at the current time.

### familyplanner-app — 2026-11-09/010-read-aloud-home.md
New article `home-read-aloud`: tap the talking-face button next to + on Home and Daili reads your day aloud; tap again to stop.

### familyplanner-app — 2026-11-09/011-read-aloud-settings-spoken-reminders.md
- `home-read-aloud`: speed and a sample in Settings → Read aloud; long-press the button.
- New section `notifications-spoken` (Android): Speak my reminders says event and to-do reminders out loud, never on silent, vibrate, Do Not Disturb or in quiet hours.
- New screen `/settings/read-aloud`.

### familyplanner-app — 2026-11-09/012-notes-offline-saved-copy.md
`notes-list`: the list now opens offline from a saved copy ("showing saved notes"), and editing still needs a connection. `notes-notes` could say the same in one line.

### familyplanner-app — 2026-11-09/013-notes-offline-weak-signal-search.md
`notes-list`: search and filters now work offline on the saved notes. `notes-notes`: a new note saves at once on the phone even with weak signal and is sent later ("Waiting for network").

### familyplanner-app — 2026-11-09/015-list-form-v2.md
- `lists-create` (the article that shows the new-list form): no banner any more. You choose the icon by tapping it in the name field. Colours are a 5 × 2 grid. "Only me" sits under the colours, and "Start from a template" is at the end.
- `lists-stock`: stock lists always use the box icon (you can't change it); title "New stock list".

### familyplanner-app — 2026-11-09/017-recipe-list-newest-first-sort.md
`recipes` article: there is a new Sort button (⇅) in the Recipes bar. The list now opens with the newest recipe first, and you can switch to Name A–Z or Quickest first. The phone remembers the choice. The meal-plan picker stays A–Z.

### familyplanner-app — 2026-11-09/018-note-settings-chips-and-burst-on-top.md
`notes-new`: the settings are now chips above the line (Who can see it · Tags · Remind me), always visible, also while typing. The `help.notes.visibility` anchor is kept.

### familyplanner-app — 2026-11-09/019-read-aloud-best-voice.md
`home-read-aloud`: Daili uses the best voice on your phone; how to download a nicer one (Premium/Enhanced); choose a voice in Settings → Read aloud → Voice; hide the Home button with Show button on Home.

### familyplanner-app — 2026-11-09/023-note-bottom-panel-and-short-screens.md
`notes-new`: the attach buttons have no boxes now and sit under a rounded line; on
small phones the chips hide while you type.

### familyplanner-app — 2026-11-09/024-lists-offline-saved-copy.md
`lists-shopping` and `lists-todos`: lists open without internet from a copy on the phone ("showing saved lists"), and changes other than ticking and adding need a connection for now. `lists-stock` could add one line: stock taps need a connection.

### familyplanner-app — 2026-11-09/025-lists-offline-tick-and-add.md
- `lists-shopping` and `lists-todos`: you can tick, untick and add items with no signal. A small cloud mark shows on a row until Daili has sent it. While a row waits, it can't be edited or moved, and "Uncheck all" / "Delete completed" wait too. A repeating to-do still needs a connection. If the list was deleted meanwhile, you see "Couldn't add … — the list is no longer available".
- `lists-stock`: no change (stock taps and stock adds still need a connection).

### familyplanner-app — 2026-11-10/003-home-header-hi-group-weather.md
Home header: line 1 is now "Hi, <name>" (was "Good morning/afternoon/evening, <name>"), the group name is the bold line, and the weather shows the temperature on its icon. The help shots `start-home`, `start-today` and `family-activity` show the header — re-capture them at the release help sync. No help article text mentions "Good morning" (searched `daili-website/help` + `content`).

### familyplanner-app — 2026-11-10/004-home-weather-number-16-regular.md
None new: the same header pictures as 003 (`start-home`, `start-today`, `family-activity`).

### familyplanner-app — 2026-11-10/007-habit-rewards-screens.md
- New screen `/habits/rewards`.
- New screen `/habits/rewards/new`.
- Habits now has a Habits · Rewards bar, and its "+" sits on that bar.

### familyplanner-app — 2026-11-10/008-habit-rewards-moments.md
- New article needed: `habits-rewards` (stars, setting a reward, the reached sheet, Plan it, We did it, Start again).
- The `habits-*` articles must lose Minzi.
- New one-time sheet "What's new in Habits" on `/habits`.

### familyplanner-app — 2026-11-10/010-habits3-finish-contrast-full-suite.md
none (pictures are re-shot at the help sync).

### familyplanner-app — 2026-11-10/011-star-toast-one-line-per-reward.md
`habits-rewards`: the message after a tick shows every reward the star went into (up to 3, then "+N more").

### familyplanner-api — 2026-11-06/001-photo-roster-and-cap.md
none yet (the app prompt adds the visible part).

### familyplanner-api — 2026-11-06/002-event-my-reminders.md
none yet (the app prompt changes the screen).

### familyplanner-api — 2026-11-06/003-events-also-on-dates.md
none yet (the app prompt adds the visible part).

### familyplanner-api — 2026-11-06/004-meal-not-eating.md
none yet (the app prompt adds the visible part)

### familyplanner-api — 2026-11-06/005-trmnl-fahrenheit-and-review-frames.md
`trmnl`: you can choose °C or °F for the weather on the plugin's settings page. US installations start on °F.

### familyplanner-api — 2026-11-06/006-trmnl-framework-foundation-today.md
none yet (010 collects). No changelog line either: this is not live, and 010 adds the TRMNL line.

### familyplanner-api — 2026-11-06/007-trmnl-framework-three-days-week.md
none yet (010 collects). No changelog line either, as in 006: 010 adds the TRMNL line.

### familyplanner-api — 2026-11-06/008-trmnl-framework-month.md
none yet (010 collects). No changelog line either, as in 006/007: 010 adds the TRMNL line.

### familyplanner-api — 2026-11-06/009-trmnl-framework-list.md
none yet (010 collects). No changelog line either, as in 006–008: 010 adds the TRMNL line.

### familyplanner-api — 2026-11-06/010-trmnl-framework-sweep.md
`trmnl`: the screens look different on every device, so the article's screenshots may need refreshing.

### familyplanner-api — 2026-11-06/011-external-event-description.md
none (the app half, app `2026-11-06/010`, reports it)

### familyplanner-api — 2026-11-06/013-trmnl-framework-polish.md
none (the `trmnl` article line from 010 still stands)

### familyplanner-api — 2026-11-06/015-trmnl-design-round.md
`trmnl`: the Week screen is no longer offered; screenshots may need refreshing.

### familyplanner-api — 2026-11-07/003-habit-colors-24.md
none — no help text in this repo quotes a habit reminder.

### familyplanner-api — 2026-11-08/001-budget-weekend-shift.md
none yet (the app prompt adds it).

### familyplanner-api — 2026-11-08/002-meal-wishes.md
none yet (clients)

### familyplanner-api — 2026-11-08/003-meal-wishes-ai.md
none yet

### familyplanner-api — 2026-11-08/004-recipe-from-photos.md
none (server only; the app prompt names the articles).

### familyplanner-api — 2026-11-08/006-recipe-from-caption.md
none (server only).

### familyplanner-api — 2026-11-09/002-stock-lists.md
none yet (the app shows nothing until app 006/007 ship)

### familyplanner-api — 2026-11-10/003-habit-rewards-api.md
none (the app prompts carry it).

### familyplanner-api — 2026-11-10/004-habit-rewards-events-push.md
none (app prompts carry it).

### daili-web — 2026-11-06/001-calendar-my-reminder-more-days.md
Help impact: calendar reminders + create-event articles: "Your reminder" and "More days" are also on the web.

### daili-web — 2026-11-06/002-meal-not-eating.md
Help impact: Meals "meal sheet" article: "Who's eating" is also on the web.

### daili-web — 2026-11-06/003-my-reminder-one-list.md
Help impact: calendar reminders article — "Your reminder" is one list on the web too, same as the phone.

### daili-web — 2026-11-07/001-board-never-stuck.md
Help impact: wall-display article: on a wall screen the first tap goes full screen, and the board restarts and reconnects by itself.

### daili-web — 2026-11-07/002-board-view-logic-fixes.md
Help impact: none (the board shows the same things, correctly).

### daili-web — 2026-11-07/005-habits-colours-icons-no-emoji.md
`habits-create`: the form has an Icon card (current icon, 3 suggestions, "All 431") and a
Colour card with 24 colours; the icon picker no longer shows colours. Cheers article: cheers
are icons in coloured circles, not emoji.

### daili-web — 2026-11-08/001-budget-weekend-shift.md
Help impact: `budget-repeating` web steps: new weekend choice ("If it falls on a weekend" under Repeat, and the one-line hint).

### daili-web — 2026-11-08/002-meal-wishes.md
`meals-wishes`: add the web steps (Wishes row, wish popover, Family wishes in the add popover). `notifications-family`: the web also has the "Your meal wishes" switch.

### daili-web — 2026-11-10/001-habit-rewards.md
Web Habits gets a Rewards tab (`/habits?tab=rewards`) — the habits help article should mention
it.

