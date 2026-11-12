# Help sync 1.16.2: widgets per family, Shopping 2.0, categories per list, recipe screen, Cycle look, weather, wall display

## Goal
Make the help center true for app 1.16.2 (24) in English and every
`HELP_LOCALES` language, with the pictures from app prompt
`../familyplanner-app/claude-prompts/2026-11-12/016-help-pictures-1-16-2.md`
(the runner already wrote them to `static/help/media/**` for all locales —
commit them here; its report's `IDS:` line and alt texts list them).

**Do not deploy.** `LIVE_APP_VERSION` stays `1.16.1`. Updated articles keep
their `since` and get `updated:` = today. New paragraphs for features new in
1.16.2 are version-gated the way existing articles do it (see how 1.16.0 did
it). New articles get `since: 1.16.2`.

## The fact list
`claude-prompts/2026-11-12/help-impact-1-16-2.md` (next to this file) =
every `## Help impact` section of the app, web and api reports since the
1.16.0 cut, verbatim. **Read all of it; each line is a to-do.** Some lines
are web / wall-display only (already live) — those are to-dos too. When a
line is unclear, read that report and the app code/ARB labels
(`../familyplanner-app/lib/l10n/`, web: `../daili-web` locale files). Do not
guess.

## Must-do articles (on top of the fact list)
1. **Widgets** `anywhere-widgets` + `anywhere-widgets-settings`: each widget
   (Calendar, Next up, Birthday, Shopping, To-dos, Habits, Meals, Notes) can
   show a family or group — iPhone: long-press → Edit Widget → "Family or
   group"; Android: long-press → the pencil / Reconfigure → first row.
   "Active family" (default) follows the app. The first time a widget shows
   "Tap to load"; the header shows the family name; a tap opens Daili in that
   family. Lock-screen widgets, Quick add and the watch follow the active
   family. Also: the Calendar widget lists linked and phone calendar events
   (a phone event added while Daili is closed shows after Daili was opened).
2. **Shopping** `lists-shopping`: "Recently bought" (ticked items leave the
   list, one tap puts them back; the newest 60 are kept), urgent items (red
   mark, at the top, a tick clears it), "I'm going shopping" (one push to the
   others, once per list per 30 minutes, never for a private list), type
   "2 kg apples", paste several lines, new shopping lists sorted by category.
   `notifications-choose`: the going-shopping switch.
3. **Categories per list** `lists-categories`: ⋯ → Categories → "In this
   list" / "Not in this list", "Turn all off"; items keep their category; a
   new category made inside a tuned list is added to that list.
4. **Recipes**: the recipe screen (servings → amounts change; who loves a
   dish; the family's own notes; how often it was planned) — new article
   `meals-recipe-screen` if no existing one fits, else extend `meals-add-recipe`
   / `meals-cook-mode`. `meals-instagram`: works on Android too; when Daili
   can't read a post it says so → use screenshots.
5. **Calendar** `calendar-phone-calendars`: a phone calendar can keep its own
   colour; the Family screen has a row to the calendar settings. The day sheet
   shows the day's weather; on Home a tap on a day in the week card shows the
   weather hour by hour (`start-weather`).
6. **Cycle** (`cycle-start` etc.): rose look, one dot per day on the ring,
   today's log on the card, the day sheet with mood faces and one
   light/medium/heavy control, the pencil for period days.
7. **Wall display** `anywhere-wall` (+ `wall-tick`): the app shows the tablet
   address big with Copy and a "Setup guide" link; everything the web board
   lines in the fact list say (adds as the tapped person, rewards, recipes,
   weather in the top bar). Link the guide page `daili.app/wall-display/`.

🔴 Never mention: Outlook, the "free forever" welcome promise, Siri on the
watch, iPhone widget background updates, Nutrition, screen time, visibility
groups / "Circles", web Shopping 2.0 / web categories per list (not built yet).

## Routes
Run the help route check against the app's HEAD. Every app route added since
1.16.0 without an article goes into the `routes:` of the article that covers
it; a one-time or internal screen goes to `never` with a reason. The build must
end with an empty `pending` list.

## Translations
Translate every changed and new article into all `HELP_LOCALES`, following
`claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md` (labels from each
language's ARB). Pictures: the runner made them for all locales; a missing
locale picture → list it in the report (never invent one). Sub-agents may
translate in parallel, one locale group each — every sub-agent MUST use model
claude-opus-5-5.

## Build
`npm run build` must pass (check-help, routes, search tests). A failure not
caused by this change → stop, report `blocked`. Read the built English +
German widgets, shopping, categories and recipe pages: text, pictures,
related links render.

## Commit & push
`docs(help): 1.16.2 — widgets per family, shopping, categories per list, recipe screen, cycle`;
body `Prompt: claude-prompts/2026-11-12/005-help-sync-1-16-2.md`. Your files
only (plus the help pictures and `help/media*.json`). 🔴 Do NOT stage the
untracked `static/assets/img/photos/` folder, the untracked report
`claude-reports/2026-11-12/004-header-page-width.md`, or anything under
`legal/`. **Push now. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-11-12/005-help-sync-1-16-2.md` (file-write tool, never a
heredoc; `wc -c` non-zero), half a page: articles new / changed (and any
fact-list line you left alone, with why), routes added, locales done, missing
pictures, build result, SHA + push. `## Help impact`: this IS the help sync —
list the article ids.
