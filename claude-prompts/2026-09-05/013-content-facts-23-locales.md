# Redesign 3/5 — new copy + fact corrections, all 23 locales

## Goal

The new home page (built in 014) needs a handful of new strings, and several
existing strings on the live site are **wrong**. This prompt makes every
content change in `content/en.json` and mirrors it into the other 22 locale
files, so 014 can be a pure template/CSS prompt. **Nothing is removed here**
(removals happen in 014 together with the template that used them), so the
current site keeps building after this prompt.

Done = `npm run build` clean (check-content passes: same key set, arrays same
length, no untranslated strings), every fact below corrected in all 23 files.

## Scope

- **In:** `content/*.json` (all 23), `site.config.mjs` (`COMPARE_ROWS` only),
  `content/glossary.md` (add "Web app" row). **Out:** everything else.
  **Never run `./deploy.sh`.**

## Requirements — English source (`content/en.json`)

Write these exactly; translate into the other 22 files in the same register
each file already uses (German `du`; feature names from `content/glossary.md`
and the app's own ARB label for that language). `Daili` and `app.daili.app`
stay untranslated (add `app.daili.app` to `@@doNotTranslate`).

1. **Fact fixes (existing keys)**
   - `features.calendar.bullets[3]`: "Public holidays for **35** countries, private events stay private" (was 36 — `Family::HOLIDAY_COUNTRIES` has 35).
   - `faq.items[0].a`: "Nothing. Daili is free — no ads, no data selling. If we ever add paid extras, everything that is free today stays free." (drop "1.0").
   - `faq.items[1].a` (languages): "The app speaks 19 languages, fully — including the reminders it sends: English, German, French, Spanish, Italian, Dutch, Portuguese, Polish, Czech, Slovak, Swedish, Danish, Norwegian, Finnish, Turkish, Romanian, Bulgarian, Greek and Ukrainian."
     **In the 9 locales whose language the app does NOT speak** (id, ja, ko,
     zh-Hans, zh-Hant, th, ru, hi, ar) append one honest sentence in that
     language: "Not yet in <that language> — until then the app runs in English."
   - `faq.items[2].a` (phones): "iPhone and Android, from one shared family account. Everything syncs between them — and with the web app."
   - `faq.items[5].a` (existing calendar): "Daili can show your phone's own calendar next to the family calendar, on your device. Connecting a Google or Outlook calendar is coming soon." (Outlook is not live; Google connect is unverified — Ammar's decision 2026-09-05.)
   - `support.deleteWays[0]`: "<strong>In the app:</strong> Settings &rarr; Profile &rarr; Delete account." (real path; keep the `<strong>` tag parity).
   - `hero.lead`: "One calm place for your family's week: a shared calendar, shopping lists and to-dos everyone can see. On every phone — and on the computer, too."
   - `howItWorks.steps[0].p`: "Free on iPhone and Android — or open app.daili.app on your computer. No credit card, no trial that runs out."

2. **New keys** (add to `en.json` with `@`-descriptions where the meaning is not obvious, then to all 22 others):
   - `hero.kicker`: "iPhone · Android · web browser"
   - `hero.webLink`: "Open in your browser"
   - `hero.notes`: ["Free", "No ads", "Servers in the EU"]  (array of 3 — the old `hero.note` string stays until 014)
   - `features.sectionEyebrow`: "Features"; `features.sectionH2`: "Everything your family juggles, in one app"; `features.sectionLead`: "Calendar, lists, meals and birthdays — shared with the people who need to see them, and nobody else."
   - `web.eyebrow`: "Web app"; `web.h2`: "Also on your computer"; `web.p`: "The same family, the same plans — in a browser window at app.daili.app. Plan the week on a big screen, add the shopping in the kitchen on your phone."; `web.points`: ["Sign in with the same account; everything stays in sync", "Calendar, shopping lists, to-dos, recipes, meal plan, birthdays and family", "Nothing to install — works in any modern browser"]; `web.cta`: "Open app.daili.app"; `web.note`: "Photos and documents live only on your phone, so they are not shown in the browser. The web app is available in English and German."
   - `howItWorks.eyebrow`: "Getting started"
   - `compare.eyebrow`: "Compare"; **insert** a new row label into `compare.rows` at index 7 (before "No ads, nothing sold"): "Works on the phone and in the browser" — and in `site.config.mjs` insert `{ daili: 'y', gcal: 'y', paper: 'n' }` at the same index of `COMPARE_ROWS` (build.mjs zips the two by index).
   - `pricing.eyebrow`: "Pricing"; `pricing.big`: "€0"; `pricing.bigNote`: "per family · no catch"; `pricing.promiseTitle`: "Our promise"; `pricing.promise`: "Every family that joins before we add paid extras keeps everything free forever — including anything we add later." (replaces the "first 1000 families" claim — the old `earlyBird*` keys stay until 014 removes them).
   - `faq.eyebrow`: "FAQ"; **insert** a new FAQ item at index 1: q "Is there a web version?", a "Yes. Open <a href=\"https://app.daili.app\">app.daili.app</a> in any browser on your computer and sign in with the same account. Calendar, lists, meals, birthdays and family are all there; photos and documents stay on your phone. The web app is in English and German." (keep the `<a>` tag parity across locales; `href` untranslated).
   - `meta.description` / `meta.ogDescription`: mention the web version in ≤ 155 chars, e.g. "Daili is the simple way to run family life together: one shared calendar, live shopping lists and family to-dos — on iPhone, Android and the web. Free, no ads." (check the `maxLength` note).

3. **Currency**: `€0` stays `€0` in every locale (it is the launch price in
   the EU; the FAQ says free anyway) — add `pricing.big` to `@@identicalOk`.

## Constraints

- `check-content.mjs` rules: identical key set, same array lengths, placeholder
  and inline-tag parity, no ≥25-char string byte-identical to English, brand
  never transliterated. A new key = 23 file edits — do them all in this run.
- Do not touch templates, CSS, build.mjs, legal, blog.

## Verify

- `npm run build` clean; `grep -c "35" content/*.json` style spot checks;
  `grep -l "1000" content/*.json` must return nothing except possibly numbers
  unrelated to early bird (report what it finds). Diff `de.json` and one
  non-app locale (`ja.json`) in the report for the languages FAQ.

## Commit & push

- `feat(content): redesign copy + fact corrections in 23 locales` — body
  `Prompt: claude-prompts/2026-09-05/013-content-facts-23-locales.md`.
  **Push now.**

## Report

- `claude-reports/2026-09-05/013-content-facts-23-locales.md`: list of keys
  added/changed, the FAQ text in de + ja, and any locale where a term was
  uncertain (name it so Ammar can ask a native speaker).
