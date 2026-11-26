# Help for 1.18: open six hidden articles, make "two-way" Google-only, two small help lines

Standard lane, website only. From the full 1.18 recheck (2026-11-25, group D: D3 + D4; detail in
`/Users/ammarkhatib/Claude/Projects/Family Planner/releases/1.18.0/recheck-2026-11-25.md`). Ammar 2026-11-26:
"Yes, write them". Every sub-agent you start MUST use model claude-opus-5-5. Write the report with the file-write
tool.

**Nothing here goes live before the 1.18 store day:** `since: 1.18.0` hides an article until `LIVE_APP_VERSION` is
1.18.0 (build.mjs ~312/359), and the app hides it below app 1.18. Do NOT bump `LIVE_APP_VERSION`. Do NOT run
`./deploy.sh` (Ammar deploys).

## Scope

- In: `help/<every HELP_LOCALES language>/…` for the articles named below, `help/routes-allowlist.json` only if the
  build asks for it, `help/media*.json` only if a renamed/new id needs it.
- Out: `LIVE_APP_VERSION`, legal pages, the marketing pages, `help/*/vault/sharing.md` (stays hidden, see 1).

## Requirements

1. **D3 — open six articles for 1.18.** In EVERY language, change `since: 99.0.0` → `since: 1.18.0` in:
   `calendar/google-colours.md`, `calendar/shift-plan.md`, `lists/steps.md`, `meals/cook-with.md`,
   `meals/import-file.md`, `meals/meal-times.md`. **Keep `vault/sharing.md` at `99.0.0`** (Vault 2 sharing is a
   server switch that stays OFF in 1.18). Before you change one, check in the app that its screen is in the 1.18
   code (`../familyplanner-app`, `git log v1.17.0+25..HEAD`): if one is NOT, leave it hidden and say why.
   Then: should other articles now link to them (`related:`)? Add a `related:` link FROM an older article only where it
   clearly helps (at most one per opened article), and say which ones in the report. The build must still pass in
   every language.

2. **D4 — `calendar-two-way` becomes Google only; Outlook moves to its own hidden article.**
   The site can only hide WHOLE articles, and Outlook two-way is behind a server switch (`allow` for the owner only)
   that stays off for 1.18. Today `help/en/calendar/two-way.md` mixes both.
   - `calendar/two-way.md` (id stays `calendar-two-way`, `since: 1.18.0`): Google only. Title like "Change Google
     events in daili", summary, keywords, steps, the "view only" list and `mediaPending` (no Outlook event picture)
     with every Outlook word taken out. Keep the facts that are true for Google (check them in the app's ARB +
     `lib/features/calendar/…`; button names in **bold** must match the app EXACTLY). Add one short line for the new
     rule from app `2026-11-25/093`: an event marked Private, saved to a Google calendar your family can see, asks
     first — **Save in Daili (private)** keeps it private in Daili; **Save to <calendar>** puts it there where the
     family sees it (take the real button words from `app_en.arb`, keys added by app commit `1a649792`).
   - NEW `calendar/two-way-outlook.md`, id `calendar-two-way-outlook`, `since: 99.0.0` (hidden): the Outlook
     part of today's text (connect + two-way switch + "Outlook can't move one day past its neighbours" + the Outlook
     repeat limits). NO `related:` link FROM any other article to it.
   - Every language: same split, each file's own words; translate the new article per
     `claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md` with `translatedFrom` = the English `updated`, using each
     language's real app words from `../familyplanner-app/lib/l10n/app_<arb>.arb` (zh-Hans → `app_zh.arb`, zh-Hant
     → `app_zh_Hant.arb`).

3. **Two help-impact lines from the 2026-11-25 recheck run** (app reports in
   `../familyplanner-app/claude-reports/2026-11-25/`):
   - `meals/import-file.md` (092): add one sentence like "If some photos were not added (for example after Stop or
     with no internet), import the same file again later — daili adds the missing photos and skips the recipes you
     already have."
   - `calendar/add-event.md` (093): if this article explains **Save to**, add the same Private rule as in 2 (one
     line). If it does not explain Save to, leave it and say so.
   Every language.

4. Bump `updated:` (and `translatedFrom:` where the rules say so) on every article you change.

## Constraints

- Short sentences, easy words, "you" (the help's own style). The brand alone is lowercase "daili".
- Never in help texts: Outlook two-way as something you can use now, free forever, Minzi, Siri on the watch.
- `npm run check:help` and `npm run build` green, FOREGROUND. Self-correct up to 2 tries.

## Verify

- Prove in the built output (like `claude-reports/2026-11-24/001-…` did) that with `LIVE_APP_VERSION` 1.17.0
  none of the seven `1.18.0` articles has a page and `calendar-two-way-outlook` has none either, and that
  `dist/help/<loc>.json` carries all of them with their `since`.
- Grep: no "Outlook" left in any `calendar/two-way.md` (every language).
- Spot-check 5 languages of the split against their ARB.

## Commit & push

- One commit: `docs(help): open six articles for 1.18; two-way is Google only, Outlook in a hidden article`, body:
  recheck D3 + D4, `Prompt: claude-prompts/2026-11-26/001-help-open-for-1-18-two-way-google-only.md`.
- **Push now.** Do NOT run `./deploy.sh`.

## Report

`claude-reports/2026-11-26/001-help-open-for-1-18-two-way-google-only.md` (mkdir -p), the repo's usual shape:
which articles opened (and any left hidden, why), the `related:` links added, the split (English text of both
articles, word for word), counts per language, the build proof, the sha. In the report, never put the word "status"
and the word "blocked" on one line unless you really are stuck.
