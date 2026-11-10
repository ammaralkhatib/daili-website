# Help sync 1.16.0: Habits Rewards (Minzi out), stock lists, lists + notes offline, Read aloud, meal wishes, Instagram recipes, shift rosters, the UX rounds

## Goal
Make the help center true for app 1.16.0 (22) in English and every `HELP_LOCALES` language, with the
pictures from app prompt `../familyplanner-app/claude-prompts/2026-11-10/013-prerelease-1-16-0.md` (the
runner already wrote them to `static/help/media/**` for all locales — commit them here; its report's
`IDS:` line and alt texts list them).

**Do not deploy.** `LIVE_APP_VERSION` stays `1.15.0`. Updated articles keep their `since` and get
`updated:` = today. New paragraphs for features new in 1.16.0 are version-gated the way existing
articles do it (see how 1.15.0 did it in `meals-plan-week`). New articles get `since: 1.16.0`.

## The fact list
`claude-prompts/2026-11-10/help-impact-1-16-0.md` (next to this file) = every `## Help impact` section of
the app, web and api reports since the 1.15.0 cut, verbatim. **Read all of it; each line is a to-do.** When a
line is unclear, read that report and the app code/ARB labels (`../familyplanner-app/lib/l10n/`, web:
`../daili-web` locale files). Do not guess. Habits rules: `~/Herd/familyplanner-api/claude-prompts/HABITS-3-PLAN.md` §5.

## Must-do articles (on top of the fact list)
1. **Habits — the biggest change.** Minzi, energy, trips and postcards are GONE everywhere.
   - **Delete `habits-minzi`** in every locale (+ its picture refs). If the site has a redirect mechanism for
     removed articles, point it to `habits-rewards`; otherwise make sure no link or search entry points to it.
   - `grep -ri` all help files (all locales) for Minzi / the cat / energy / trip / postcard (and their words in
     each language) — every hit is rewritten or removed.
   - **NEW `habits-rewards`** (routes `/habits/rewards`, `/habits/rewards/new` + the edit route if the build
     names it): each finished habit day = 1 star (max 5 per person per day; a counter at its goal; a rest day
     earns none; **private habits earn no stars**; a "together" habit's star counts for family rewards only);
     a reward is a jar that fills with the stars earned AFTER it was made — one star fills EVERY reward it
     counts for; make a reward: 12 ideas or your own, For (Family or You; admins also for other members and
     children without a login), stars 5–500, which habits count, "Starts again when done"; the ★ chip in the
     Habits header = lifetime stars; after a tick a message shows each reward the star went into (up to 3,
     then "+N more"); a full reward opens "reward reached" and the family gets a notification (habit
     notifications switch); **Plan it** puts it in the calendar (next Saturday, all day); a grown-up (admin)
     taps **We did it** → Enjoyed; Start again. Web: Habits → Rewards tab (no reached sheet on the web).
   - Rewrite `habits-what` (one person at a time, "Switch person", Cards / Checklist / Compact views, a year grid
     on every habit, Habits · Rewards bar, the one-time "Habits got simpler" sheet), and check `habits-tick`,
     `habits-streaks`, `habits-create` (icons + 24 colours, no emoji), `habits-categories`, `habits-private`,
     `habits-reminders`, the cheers text (icons, not emoji), and the widgets/watch text (progress ring).
2. **Lists**: `lists-stock` (exists in English since `04cfa19a` — finish it in all locales; add: stock taps
   need a connection); `lists-shopping`, `lists-todos`: lists open offline from a saved copy, tick / untick /
   add work with no signal (cloud mark until sent), swipe left to delete, press and hold to move, one-line
   rows, the list scrolls to a new item with a little burst; `lists-categories`: emoji grid + full picker with
   search; the new-list form (icon in the name field, colours, Only me).
3. **Read aloud — NEW `home-read-aloud`** (route `/settings/read-aloud`): the talking-face button next to "+" on
   Home reads what Today shows (events, to-dos, meals …) with the phone's own voice — nothing is sent anywhere;
   tap again to stop; long-press for speed; Settings → Read aloud: voice, speed, "Show button on Home"; how to
   get a nicer voice (use the app's own steps text; iPhone menu names as in the ARB). **Android only:** "Speak
   my reminders" says event and to-do reminders out loud; never on silent, vibrate, Do Not Disturb, quiet hours
   or with Daili notifications off. Put the Android part where the notifications articles fit best.
4. **Meals**: NEW `meals-wishes` (everyone adds a wish; whoever plans puts it on a day; "<name>'s wish" tag; the
   wisher gets a notification — "Your meal wishes" switch; admins can add for a child without a login; Plan my
   week can use wishes; web steps from the web report); NEW `meals-instagram` (share or paste a public Instagram
   post → Daili reads the recipe from the post's TEXT, 1 AI action; the post's picture comes along and can be
   removed before saving; no written recipe → use screenshots; iPhone: Daili is under "More" in the share menu
   the first time); update `meals-plan-week` (bottom bar Today · AI plan · Shop · Copy week, one card per day,
   swipe left to remove, press and hold to drag, Who's eating, links in a meal's note are buttons, who cooks),
   `meals-meal-settings` (Plan and Move offer every meal; drop "the week then shows only the meals you plan"),
   `meals-photo` + `meals-share-sheet` (up to 5 photos → one recipe; an Event still reads the first picture),
   `meals-add-recipe` (row "From YouTube or Instagram", after Save you land on your recipes, Sort: newest /
   A–Z / quickest), and the meal sheet / Plan it / Plan my week texts.
5. **Calendar**: one date-and-time sheet everywhere; "More days"; the scan button in the title field; the new
   event sheet (pencil + trash, Add chips incl. Repeats + Category, one Attach list, tappable links, "Added
   by"); "Your reminder" (the sheet sets yours, the form sets everyone's; Custom is a row; Done); "Fill from a
   photo" can read a shift roster (your name → only your shifts, up to two months); synced and phone events show
   location + notes; Week / 3-day / Day open at "now"; a new event lights up where it landed; month view
   (markers beside the date, week numbers in their own column, the View sheet); the day sheet; cooks on the
   calendar's meal line.
6. **Home**: "Hi, <name>", the group name is the big line, temperature on the weather icon, the calendar icon
   opens Today, the bell is at the top, tiles show live facts.
7. **Notes**: filter inside the search field, List/Grid in ⋯; the list + search work offline from a saved copy;
   a new note saves at once on weak signal ("Waiting for network"); Only me · Tags · Remind me are chips above
   the attach buttons; formatting shows while typing (no signs); checklists work like rows (drag, ×, Completed).
8. **Budget** `budget-repeating`: "If it falls on a weekend" (app + web). **Notifications**: the "Your meal
   wishes" switch; the reward push follows the habit notifications switch. **TRMNL**: °C/°F, the Week screen is
   gone. **Wall display**: first tap goes full screen; it restarts and reconnects by itself.
9. **Older owed lines** (PLAN.md "Help sync owed", may already be done — check each, fix only what is still
   untrue): `account-delete`, `account-email`, `account-password`, `account-data`, `family-settings`,
   `family-invite`, `family-create`, `calendar-phone-calendars` (Copy → Edit in Daili), web `account-signin`,
   `account-preferences` (notifications follow each phone's language).

🔴 Never mention: Outlook, the "free forever" welcome promise, Siri on the watch, widget background updates,
Nutrition / calorie tracking, screen time, visibility groups / "Circles", Phase 3 habit extras (share card,
times a month, day notes, quit habits) — not built or not announced.

## Routes
Run the help route check against the app's HEAD (`DAILI_APP_REPO` as the build expects — the plain build now
works because `habits-minzi` is gone). Every app route added since 1.15.0 without an article goes into the
`routes:` of the article that covers it; a one-time or internal screen goes to `never` with a reason. The
build must end with an empty `pending` list.

## Translations
Translate every changed and new article into all `HELP_LOCALES`, following
`claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md` (labels from each language's ARB). Pictures: the runner
made them for all locales; a missing locale picture → list it in the report (never invent one). Sub-agents may
translate in parallel, one locale group each — every sub-agent MUST use model claude-opus-5-5.

## Build
`npm run build` must pass (check-help, routes, search tests). A failure not caused by this change → stop,
report `blocked`. Read the built English + German `habits/rewards`, `habits/what`, `lists/stock`,
`meals/wishes` and the read-aloud page: text, pictures, related links render; no Minzi anywhere
(`grep -ri minzi dist/` = 0 hits outside old changelog pages).

## Commit & push
`docs(help): 1.16.0 — rewards, stock lists, offline lists + notes, read aloud, meal wishes, Instagram recipes`;
body `Prompt: claude-prompts/2026-11-10/001-help-sync-1-16-0.md`. Your files only (plus the help pictures and
`help/media*.json`). 🔴 Do NOT stage the untracked `static/assets/img/photos/` folder or anything under
`legal/`. **Push now. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-11-10/001-help-sync-1-16-0.md` (file-write tool, never a heredoc; `wc -c` non-zero),
half a page: articles new / changed / deleted (and any fact-list line you left alone, with why), routes added,
locales done, missing pictures, build result, the Minzi grep result, SHA + push.
`## Help impact`: this IS the help sync — list the article ids.
