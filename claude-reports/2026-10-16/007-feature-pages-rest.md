# Feature pages for the other ten features

**Prompt:** `claude-prompts/2026-10-16/007-feature-pages-rest.md`
**Completed:** 2026-10-16 · **Status:** done · **Commit:** `5c84b99` (pushed to `origin/main`, **not deployed**)

## Summary

The other ten features now each have their own page in all 28 languages: Calendar, Lists, To-dos, Notes, Recipes, Meal plan, Birthdays, Weather, Documents & photos and Family. That is 10 × 28 = 280 new pages. Every one of the 13 cards on the home page now opens its page in the sheet (the large popup from 006). Step 0 had nothing to do: there were no planning docs waiting to be committed.

- `site.config.mjs`: `page: true` and one icon per benefit for the ten features. I added no `shot2` (second phone). The only spare screenshot is `shot-photos`, and it shows an empty "No photos yet" screen, which adds nothing.
- `content/*.json` (all 28): `features.pages.<slug>` for the ten. Each page has a lead and 3 benefits, and no FAQ: the copy source has none for these pages, so I invented none. Sub-agents translated using the app's ARB words. A script checked their output (shape, no "free"/price/"Plus", nothing left in English), and the same script applied it.
- `tools/check-build.mjs`: a new check fails the build if any feature in the row has no `page: true`. Section 18 now covers all 13 features by itself.

## Copy I corrected (checked against help/en, the app's CHANGELOG and the app code)

- **Calendar:** "the last day of the month" became "a check-up once a year". Events can't repeat on the last day of the month. Only budgets and to-dos have a month-end option.
- **Calendar reminders:** "only those people get the reminder" became "the reminder goes to them". A child without a login can't get a reminder, so in that case it goes to the whole family.
- **Lists lead:** "the things you buy often one tap away" became "the things you bought before suggested as you type". That is how the app works: it suggests items from your family's history while you type.
- **Recipes:** "From a video link" became "From a web page, a YouTube video or a photo". Only YouTube links are read. **Recipe tags are real** (help `meals/find`, since 1.9.0), so I kept the third benefit: "Your own tags".
- **Ingredients to the list / Meal plan:** "One tap" became "in one go". You still pick the list and untick things first. From the meal plan, only meals made from recipes bring ingredients.
- **Notes:** "sort them with tags" became "filter them by tag".
- **Weather:** the second benefit is "The Weather tile says when the rain starts, and the forecast looks 10 days ahead". I added a third: "Today's events show the weather they will get". The lead's "°C or °F" is true in 1.11.0 (new setting).
- **Documents:** "Your files come back with your phone's own backup" became "can bring them back". On Android, photos are not in the Google backup and documents are limited to 25 MB.
- **Family:** I added "up to five with one account".
- **Translations:** the word for the Home screen in "Right on Home" now matches the existing weather card in nl, fi, th, zh-Hans, zh-Hant, cs, sk and it. In Indonesian, "Ubin" (tile) became "Kartu".

## Tested

```
$ npm run build                     → only the 2 help-route errors from 006 (/lists/supplies, /budget/:id/trends — prompt 004's job)
$ HELP_SKIP_ROUTE_CHECK=1 npm run build
content OK · 28 locale(s) · 501 keys each
built 2748 pages · 28 locale(s) · 2746 sitemap entries
build OK · 2748 pages · 2728 in hreflang clusters
detector OK · 32 cases · 28 locale(s) built
$ npm test                          → detector OK · test-check-help OK · 99 cases
```

- **Guard proof:** I took `page: true` off Weather, and check-build failed with "HOME_FEATURES 'weather' has no page: true". I put it back, and the build was green again.
- **Clean check:** I built HEAD plus only my 30 files in a separate git worktree. It was green with the same numbers. The other uncommitted files (`legal/*`, `tools/check-legal.mjs` and the two untracked image paths) are not mine. They are still uncommitted and untracked.
- **Headless Chrome, 60/60 checks passed.** My own server and Chrome ran in one foreground script, and both were stopped. At 1440 and at 390 px, all 13 sheets on `/` open at `/features/<slug>/` with the right number of benefits and every picture loaded. Focus goes to ✕, nothing scrolls sideways, and ✕ goes back to `/`. `/fr/features/recipes/` and `/ja/features/family/` open in the right language, with no broken pictures and no sideways scroll.
- **A note on a race in the 006 sheet code:** clicking a second card within a few milliseconds of closing a sheet can close the new sheet straight away. The old sheet's delayed close event lands on the new one. My script hit this. A person can't click that fast, and a second click always works, so I left the code alone, as the prompt says. If you want it fixed, a one-line guard (`if (dlg.open) return;` in the close handler) would do it.

## Open items for Ammar

- **Run prompt 004 before deploying.** Until then, the plain `npm run build` stops on the 2 help routes. I did not run `./deploy.sh`, as the prompt said.
- **Old local server:** `python3 -m http.server 8080` (pid 79684) is still running. This run didn't start it, so I left it alone.
- **On a real phone and in Safari:** please open a few of the new sheets.

## Help impact

none
