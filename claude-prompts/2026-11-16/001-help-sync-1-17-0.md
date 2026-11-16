# Help sync 1.17.0: tablets, chores, rewards that cost stars, buddy, shared notes, lists, widgets

## Goal
Make the help center true for app 1.17.0 (25) in English and every `HELP_LOCALES` language, with the pictures
from app prompt
`/Users/ammarkhatib/development/flutter_projects/familyplanner/familyplanner-app/claude-prompts/2026-11-16/073-help-pictures-1-17-0.md`
(the runner already wrote them to `static/help/media/**` for all locales — commit them here; its report's `IDS:`
line and alt texts list them).

**Do not deploy.** `LIVE_APP_VERSION` stays `1.16.2`. Updated articles keep their `since` and get `updated:` =
today. New paragraphs for features new in 1.17.0 are version-gated the way existing articles do it (see how 1.16.2
did it). New articles get `since: 1.17.0`.

## The fact list
`claude-prompts/2026-11-16/help-impact-1-17-0.md` (next to this file) = every `## Help impact` section of the app,
api, web and website reports since the 1.16.2 cut, verbatim. **Read all of it; each section is a to-do.** Also read
the `## Help impact` of app `2026-11-16/071` and api `2026-11-16/002` (written after the list). When a line is
unclear, read that report and the ARB labels (`../familyplanner-app/lib/l10n/`). Do not guess.

## Must-do articles (on top of the fact list)
1. **Tablet** `anywhere-tablet`: set `since: 1.17.0` (was `99.0.0`). Keep `mediaPending` (pictures come later).
   Reword the first paragraph's "Lists and recipes open beside their list" to plain words, e.g. "An open list or
   recipe shows next to the overview." Check the shortcut table against app reports `2026-11-15/040` + `041`.
2. **Chores** — new article `habits-chores` (report `2026-11-14/009`): make a chore, who, the three ways (everyone /
   take turns / first one gets it), when / just once, edit, archive, delete; only parents (admins) add chores.
3. **Rewards** `habits-rewards`: a reward for one person costs stars → **Ask for it** → "Asked — waiting" / **Take
   back**; parents: **Needs your answer** → **Approve** / **Not now**, **Give it now**; the wallet; family rewards stay
   a jar; section "Your buddy" (pick one or "No buddy, just stars"; where it shows: by "Today", the star toast, "All
   done for today!", the reward sheets). `habits-new`: the Stars row (0–20, worth line).
4. **Family** `family-roles`: after someone joins, the OWNER is asked once "Is <name> a parent?" (Yes = admin);
   can be changed any time in Family. Members see one line saying only parents can see the children in Habits.
5. **Notes**: closing saves (x, Back, drag down) with "Saved · Undo"; a draft survives leaving the app; new section
   "Let others edit" (author switch in "Who can see it", what others may and may not do, "Edited by …", two edits at
   once → "Use their version" / "Keep mine as a new note"; adding files needs the Daili cloud).
6. **Lists** `lists-shopping` / `lists-todos` / `lists-edit-list`: "Add with details"; "Edit list" in ⋯.
7. **Widgets** article: To-dos widget "Time span" + "Add to"; Habits widget rows + small ring line; Quick add = Event,
   To-do, Item, Note in every size; Android narrow tall lists.
8. **Calendar** article: the stripes (one per person, up to three; nobody chosen = creator's colour).
   `calendar-linked-event`: an event edited from an "Only me" calendar starts as "Only me".
   The share-your-calendar article (if it says what the link contains): in another family the link never shows
   your private events, except in an "Only me" link you added yourself.
9. **Meal plan** `meals-plan-week`: shopping from the week is scaled to each meal's portions.
10. **Read aloud** `notifications-spoken` (+ `start-read-aloud` if it repeats it): the line "It never speaks while your
    phone is on silent, vibrate or Do Not Disturb" is no longer always true — name the Android switch "Also on silent or
    vibrate" (speaks at media volume); DND, quiet hours and Daili notifications off stay silent.

🔴 Never mention: Outlook, the "free forever" welcome promise, Siri on the watch, iPhone widget background updates,
**two-way Google sync** (dark until Google approves — its help text waits), Minzi or the cat, Nutrition, screen time,
visibility groups / "Circles", web Rewards 2 / web chores / web shared-note editing (not built on the web yet).

## Routes
Run the help route check against the app's HEAD. Every app route added since 1.16.2 without an article goes into the
`routes:` of the article that covers it (chores routes → `habits-chores`; `/calendar/external-edit` → `never` with
reason "two-way Google, dark until the scope is approved" unless the checker needs it elsewhere). The build must end
with an empty `pending` list.

## Translations
Translate every changed and new article into all `HELP_LOCALES`, following
`claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md` (labels from each language's ARB). Pictures: the runner made
them for all locales; a missing locale picture → list it in the report (never invent one). Sub-agents may translate in
parallel, one locale group each — every sub-agent MUST use model claude-opus-5-5.

## Build
`npm run build` must pass (check-help, routes, search tests). A failure not caused by this change → stop, report
`blocked`. Read the built English + German tablet, chores, rewards and notes pages: text, pictures, related links render.

## Commit & push
`docs(help): 1.17.0 — tablets, chores, rewards, buddy, shared notes`; body
`Prompt: claude-prompts/2026-11-16/001-help-sync-1-17-0.md`. Your files only (plus the help pictures and
`help/media*.json`). 🔴 Do NOT stage the untracked `static/assets/img/photos/` folder or anything under `legal/`.
**Push now. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-11-16/001-help-sync-1-17-0.md` (file-write tool, never a heredoc; `wc -c` non-zero), half a page:
articles new / changed (and any fact-list line you left alone, with why), routes added, locales done, missing pictures,
build result, SHA + push. `## Help impact`: this IS the help sync — list the article ids.
