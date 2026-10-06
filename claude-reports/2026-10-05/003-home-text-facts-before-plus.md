# 003 — Home page + support: text facts before the Plus release

Commits: `fc764f3` (step 0: the 001 report), `2c96346` (the work). Both pushed to `origin/main`. `./deploy.sh` **not** run — nothing is live until you deploy (together with 001).

## What changed
12 values × 28 locales = 336 lines, in `content/<locale>.json` only. No new keys, no template, CSS or config change.
- `faq.items[0].a`, `[2].a`, `[6].a`, `[7].a`
- `home.calendars.h3`, `.p`, `.t`, `.s`
- `home.privacy.chips[4]`, `home.members.tiles[0].t`, `home.plus.fine`
- `support.deleteWhat` (one sentence added at the end)

English is the prompt's text word for word. The "stays free" promise is gone in every locale.

## Facts I checked first — nothing stopped me
- 25 languages: `familyplanner-app/lib/l10n/` has exactly the 25 ARB files (language files) on the list, each with 2385 keys.
- Web app: `daili-web/src/i18n/` has only `en.ts` and `de.ts`, so FAQ 1 stays.
- Plus numbers (3 free, 30 with Plus, 5 GB, €9.99 a year, one price per family) match CLAUDE.md §3, the app's Plus strings and the Terms. Germany matches the privacy policy (Host Europe and Hetzner). The api repo is not on this machine, so I could not read the numbers on the server itself.
- One small note: founder families get 50 AI actions, so "every family gets 3" is the minimum, not the exact number for them. It is still true, so I kept it.

## Choices you may want to look at
- **Price format.** I wrote `€9.99` exactly like that in all 28 locales, as the prompt says. German and most European languages normally write "9,99 €". Tell me if you want it the local way.
- **"Not in my language yet" sentence.** id, th, ja, ko, zh-Hans and zh-Hant used to end FAQ 2 with "… is not there yet, the app runs in English". The app now has these languages, so I removed it. ru, ar and hi keep it, because the app still has no Russian, Arabic or Hindi.
- **Card lines made shorter.** The small calendar card does not wrap its text, so I cut four long lines: ro title, and fi / fr / id second line (they say "Next to the family plan" without "Shown").
- **Finnish "5 GB".** The app says "5 Gt"; I used "5 GB" like the Finnish legal page from 001.
- **Left as is, not on the key list:** the note `@calendars` in `en.json` still says "connected-calendar widget (Google Calendar stays as written)", and the second card still says "Apple Calendar · Connected via your iPhone". Both are a little old now. One line each in a later prompt would fix them.

## Translations
Done by me from the English, in each file's own tone (for example German FAQ = "du", home page = "ihr"). No native speaker has read them. App words come from each language's ARB ("Daili cloud", "AI actions", calendar, to-dos, habits, notes, recipes). ru, ar and hi have no ARB, so they use the same words as their legal pages from 001.

## Build and checks
- `npm run build`: green on the first run — `content OK · 28 locale(s) · 305 keys each`, `build OK · 2259 pages`, `detector OK`. `check-help` passed, nothing added to `pending`. The 12 length warnings are old ones; none is on a key I touched.
- Built pages: a script checked `index.html` and `support.html` of **all 28 locales** (so also the four you named). Every new text is on the page, and FAQ 2 lists 25 languages in each.
- Layout: I measured the calendar cards, the €0 tile and the privacy chips in headless Chrome (a browser without a window) at 360 px and 1280 px for all 28 locales. Nothing is cut off and no page scrolls sideways.

## Not mine, left untouched
`claude-reports/2026-10-01/`, `static/assets/img/blog/what-to-look-for-family-app.webp`, `static/assets/img/photos/`. Step 0 committed only the 001 report from 2026-10-05.

## Help impact
None.
