# Home page + support: text fixes before the Plus release (cost, languages, calendars, data, Plus)

## Why

A review of the live home page (2026-10-06) found text that is wrong today or
becomes wrong when Daili Plus ships with app 1.9.0 (15):
- The FAQ promises "Daili is free … if we ever add paid extras, everything that
  is free today stays free". Plus is a paid extra, and Ammar decided (2026-09-30)
  there is **no public "stays free forever" promise** — that sentence must go.
- The FAQ says **19 languages**; the app has **25**.
- The calendar card says Google + Outlook are **connected and synced**, but the
  FAQ says that is "coming soon" — and direct Google/Outlook connect is NOT
  announced (Google verification pending, Outlook hidden). What is true today:
  Daili shows the calendars already **on your phone** (Google, Outlook, iCloud …).
- "Documents & photos stay on your phone" is no longer the whole story: note
  pictures may go to Daili cloud (opt-in, Plus).
- The support page doesn't say that deleting the account does **not** cancel a
  Plus subscription (the Terms already say it).

This prompt changes VALUES of existing keys only — no new keys, no layout change.
It deploys together with the legal update (website 001), before App Store review.

## Scope

- In: `content/<locale>.json` (all 28 site locales), only the keys below.
- Out: templates, CSS, `site.config.mjs`, legal pages, help, blog. Untracked
  files that are not yours (`claude-reports/2026-10-01/`,
  `static/assets/img/blog/…`, `static/assets/img/photos/`): don't touch.

## English (`content/en.json`) — use word for word

1. `faq.items[0].a` (What does Daili cost?):
   `Daili is free to use — calendar, lists, to-dos, habits, notes, recipes and more, with no ads and no data selling. Daili Plus is optional: one yearly price for the whole family (€9.99 in the euro area; the app shows the price in your currency) gives you 30 AI actions a month and 5 GB of Daili cloud for note pictures and recordings. Every family gets 3 AI actions a month for free.`
2. `faq.items[2].a` (languages):
   `The app speaks 25 languages, fully — including the reminders it sends: English, German, French, Spanish, Italian, Dutch, Portuguese, Polish, Czech, Slovak, Swedish, Danish, Norwegian, Finnish, Turkish, Romanian, Bulgarian, Greek, Ukrainian, Indonesian, Thai, Japanese, Korean and Chinese (Simplified and Traditional).`
3. `faq.items[6].a` (existing calendar):
   `Yes. Daili shows the calendars already on your phone — Google, Outlook, iCloud and others — next to the family calendar, on your device only. You can also add the public holidays for your country.`
4. `faq.items[7].a` (where data is stored):
   `Your calendar, lists and family data live on our servers in Germany (EU). Photos and documents in the vault never leave your phone. Note pictures and recordings stay on your phone too, unless you choose Daili cloud (part of Daili Plus), which also stores them in Germany. Details in the <a href="/privacy.html">privacy policy</a>.`
5. `home.calendars.p`:
   `See the calendars already on your phone — Google, Outlook, iCloud — next to the family plan. Add public holidays for your country.`
   `home.calendars.t`: `Calendars on this phone` · `home.calendars.s`: `Shown next to the family plan`
   `home.calendars.h3`: `Your calendars, together` (was "Connect your calendars").
6. `home.privacy.chips[4]`: `Your vault stays on your phone`
7. `home.members.tiles[0].t`: `Free to use. No ads, no catch.` (`big` stays €0)
8. `home.plus.fine`:
   `Daili Plus features use Google Gemini, and only when you use them. Every family gets 3 AI actions a month for free; Daili Plus gives 30, plus 5 GB of Daili cloud, for €9.99 a year.`
9. `support.deleteWhat`: append one sentence at the end:
   ` If you have Daili Plus, cancel it in the App Store or Google Play first — deleting your account does not cancel the subscription.`

Check before writing: the app really is in these 25 languages
(`../familyplanner-app/lib/l10n/app_*.arb`), and the web app is still English +
German only (FAQ 1 stays as it is). If a sentence above is not true, stop and
report it.

## Other locales

Translate the same 9 changes into every other `content/<locale>.json` — from the
English, natural native register, the register each file already uses. Follow
`content/glossary.md` (feature words come from the app's ARB for that language;
"Daili", "Daili Plus", "Daili cloud" as the app's ARB writes "Daili cloud" in
that language; no ARB (ar, hi, ru) → translate naturally). Language names in
FAQ 2 in that locale's language. Price: keep "€9.99" and the euro-area wording
in every locale. Respect each key's `maxLength` / description.

## Build

`npm run build` green (`check-content` catches untranslated or missing keys).
If it fails only in `check-help` on new Notes routes, website 001 already parks
them in `pending` — run after 001; if it still fails, stop and report.
Spot-check `dist/index.html`, `dist/de/index.html`, `dist/ja/index.html`,
`dist/support.html`: the changed texts show, FAQ 2 lists 25 languages.

## Commit & push

`docs(home): cost, 25 languages, phone calendars, data location, Plus line`;
body `Prompt: claude-prompts/2026-10-05/003-home-text-facts-before-plus.md`.
Your files only. **Push now. Do NOT run `./deploy.sh`** (Ammar deploys after
the run, together with 001).

## Report

`claude-reports/2026-10-05/003-home-text-facts-before-plus.md`, half a page:
keys × locales changed, any sentence you stopped on, build result, SHA + push.
`## Help impact`: none.
