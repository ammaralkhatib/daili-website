# 002 — Privacy names Google event colours; new hidden help article "Google colours and categories" (#314)

**Result:** done · **Commit:** `9138ad23` docs(legal,help): privacy names Google event colours; hidden article "Google colours and categories" (#314). 53 files, pushed to origin/main (`c2e7d15a..9138ad23`). This report follows in its own `docs(report)` commit. `./deploy.sh` was NOT run, because Ammar deploys.
**Step 0:** `dc157596` docs(plan): sync planning docs (this prompt + `003-help-meal-times.md`). No commits were held. The first two pushes failed with a GitHub "Internal Server Error" (their side, not ours), so `dc157596` went out together with `9138ad23` in the final push. `static/assets/img/photos/` (the old untracked pictures) stayed out of every commit, as in earlier runs.

All four upstream reports were there and I read them: api `017-google-colours-server`, app `017-google-colours-texts` + `018-google-colours-app`, web `007-google-colours-web`. The app repo was committed and clean at `f063fe13` when I checked facts against it.

## 1. Privacy

**Where it sits:** two places, in all 28 pages (26 `privacy.<lang>.html` + English + `datenschutz.de.html`):
- Section 4, the "Connected calendars" paragraph: one new sentence right after "…we store their title, place, times and notes; … shown only to the people who can see that calendar."
- Section 5, "What we store": the colour is added to the "For each event" list. Two new sentences come right after "For each chosen calendar: its name and colour."

**English, word for word:**
> For a Google event we also store its colour (one of Google's own event colours), so Daili can show the event in that colour.

> For each event: title, location, start and end time, whether it is all-day, its time zone, **its colour (Google's colour number for the event, if it has one),** and its description …

> For each family: which Google colour goes with which of the family's event categories, if anyone in the family set this; every member of the family can see and change it, and it is deleted with the category or the family. Daili never sends a colour to Google.

**German (`datenschutz.de.html`), word for word (I wrote it myself):**
> Für einen Google-Termin speichern wir außerdem seine Farbe (eine der eigenen Terminfarben von Google), damit Daili den Termin in dieser Farbe zeigen kann.

> Für jeden Termin: Titel, Ort, Beginn und Ende, ob er ganztägig ist, seine Zeitzone, **seine Farbe (die Farbnummer von Google für den Termin, falls er eine hat)** und seine Beschreibung …

> Für jede Familie: welche Google-Farbe zu welcher Terminkategorie der Familie gehört, falls jemand in der Familie das festgelegt hat; jedes Mitglied der Familie kann das sehen und ändern, und es wird mit der Kategorie oder der Familie gelöscht. Daili sendet nie eine Farbe an Google.

**Facts checked (api 017 report):**
- The `color_id` column is on synced rows; the mapper stores it only for Google, and Outlook and .ics rows stay null.
- The `google_color_categories` table cascades on both the family and the category.
- There is no admin check, so every member can see and change it.
- `TwoWayGoogleColorTest` proves that a two-way PATCH or insert never sends `colorId`.

**Date:** every page already said "Last updated 2026-11-24" (from run 001 today), so nothing needed a bump.

**Legal check:** `tools/check-legal.mjs` only checks anchors (`id="…"`) and a few words. This change adds sentences inside paragraphs that already exist and adds no new anchor, so the check checks no list this change touches. I did not extend it.

**Only added, nothing removed:** a character-by-character diff of all 56 changed lines (28 files × 2 lines) finds no removed character in any file.

## 2. Help article (hidden)

`help/en/calendar/google-colours.md`, id `calendar-google-colours`:
- topic `calendar`, title "Google colours and categories", 10 keywords.
- `routes:` and `tryIt:` are `/family/event-categories/google-colors`.
- `since: 99.0.0`, `updated: 2026-11-24`, `mediaPending: the Google colors screen with two matched colours`.
- `order: 8`, `related: calendar-categories, calendar-two-way`.

> Events you coloured in Google Calendar keep that colour in daili. Events without their own colour keep their calendar's colour.
>
> 1. On Home, tap **Family**.
> 2. Under **Calendar**, tap **Event categories**, then **Google colors**. It's also in **Calendar** → the gear → **Other calendars**.
> 3. You see the colours your Google events use, and how many events have each one.
> 4. Tap a colour. Pick a category, **Keep Google color** or **New category in this color**.
>
> Matched events show the category's name and colour. Open one to see which Google colour it comes from.
>
> This counts for the whole family, and anyone in the family can change it.
>
> Change a colour in Google, and daili follows on the next sync. daili never changes colours in Google. Delete a category, and its events get their Google colour back.
>
> On app.daili.app you see the colours and categories. You match them in the phone app.

**The route:** `/family/event-categories/google-colors`. That is `RoutePaths.familyGoogleColors` in the app's `route_names.dart:304` (app 018). The new article covers it, so `help/routes-allowlist.json` needed no entry. `check:help` now says "99 app routes checked" (it was 98).

**Where I went against the prompt (the guard or house style wins):**
- **148 words, not up to 220.** The guard allows 150 English words (`LIMITS.words` in `tools/help-lib.mjs`). All 7 points are in.
- **`order: 8`, the same number as `calendar-categories`.** Orders must be whole numbers, and 9 belongs to `calendar-search`. Equal orders sort by title, and "Event categories…" comes before "Google colours…". So the new article sits right after `calendar-categories` and no other article moved.
- **Keywords in lower case** (`google colour`, `lavender` …). The guard refuses capital letters in keywords.
- **"daili" in lower case** in the summary and running text, as the help center does (see report 001). The bold labels match the app exactly: **Google colors**, **Keep Google color**, **New category in this color**.

**Facts checked in the code:**
- The labels come from `app_en.arb`: `googleColorsTitle`, `googleColorsKeep`, `googleColorsNewCategory`, `eventCategoriesTitle`, `calendarSettingsOtherSection`.
- The two ways in are the Event categories card and the row in Calendar settings → Other calendars (app 018, Req 9).
- The screen lists only the colours that are used, with a count for each (Req 5).
- The picker offers Keep, every category, and New category in this color (Req 6).
- The event sheet row says "From the Google color …" (Req 10).
- Every member may change it (Req 12).
- When a category is deleted, its events go back to their Google colour (`eventCategoriesDeleteGoogleNote`, api `GoogleColorsTest`).
- The web only shows the colours (web 007).
- "Daili follows on the next sync": the mapper sets `color_id` on every refresh (api 017, Req 3).

**How it stays hidden** (proved like 001):
- `since: 99.0.0` is in the English file only. `LIVE_APP_VERSION` is unchanged.
- No other article lists `calendar-google-colours` in `related` (checked in `dist/help/en.json`: none). `calendar-categories` was not touched.
- Build: "115 of 122 article(s) on pages". Before this run it was 115 of 121. The page count stays at 3759.
- There is no `dist/help/calendar/google-colours/` and no `dist/de/help/calendar/google-colours/`.
- `grep -rl google-colours dist` finds only the 25 app files `dist/help/<loc>.json` (with `since 99.0.0`, so the app hides it too). It is in no HTML page, no sitemap and no search index.

**True, but left out because of the 150-word cap:**
- The "Google colors" rows only show when the family has a Google calendar in Daili (`hasGoogle`).
- "New category in this color" locks the colour to the Google colour. You only type a name.
- At 30 categories, "New category" is turned off.
- When you delete a category that has a Google colour, the delete dialog says so.

## 3. Translations

- **Help:** 24 languages. I wrote German myself; 8 sub-agents wrote the other 23.
- **Privacy:** 26 languages, done by the same 8 sub-agents (ar, hi and ru have privacy only).
- **Sub-agents:** all 8 ran on Opus 5.5 (`claude-opus-5-5`). I started them together in the foreground and waited for all 8 before any check, build or commit. Then I checked their files on disk: 24 help files, 26 privacy pages.
- **Labels:** the bold labels come from each language's ARB at app HEAD (zh-Hans → `app_zh.arb`, zh-Hant → `app_zh_Hant.arb`). My script compared all 8 bold labels with the ARB values in **all 24** languages. All 24 pass. In da, nb, sv and fi, "Event categories" comes before "Calendar" in step 2 ("tap X under Calendar"), the same order as their checked `categories.md`. It also checks `translatedFrom: 2026-11-24`, the app.daili.app line, the ARB names for Lavender, Sage and Tomato in the keywords, and no "family planner" in el, uk or bg.

**My spot-check, 5 help translations against their ARB:** I read fr, pl, el, ja and zh-Hant in full. The meaning matches the English and every bold label is the ARB value.
- fr: **Famille** / **Catégories d'événements** / **Couleurs Google** / **Garder la couleur Google** / **Nouvelle catégorie dans cette couleur**
- pl: **Rodzina** / **Kategorie wydarzeń** / **Kolory Google** / **Zachowaj kolor Google** / **Nowa kategoria w tym kolorze**
- el: **Οικογένεια** / **Κατηγορίες γεγονότων** / **Χρώματα Google** / **Διατήρηση χρώματος Google** / **Νέα κατηγορία σε αυτό το χρώμα**
- ja: **家族** / **予定のカテゴリ** / **Googleの色** / **Googleの色のままにする** / **この色で新しいカテゴリを作成**
- zh-Hant: **家庭** / **行程分類** / **Google顏色** / **保留Google顏色** / **用這個顏色新增分類**

One fix of my own: in zh-Hant, "its calendar's colour" said 所屬日曆. I changed it to 所屬行事曆, the app's word for a calendar. 日曆 stays only in "Google 日曆", which is Google's own name for its app.

**My spot-check, 3 privacy languages against the English:** I read the new fr, pl and ja sentences in full, plus ar and es. In each, the three additions are in the right places and every fact is there: the colour is stored so Daili can show it; the colour number is in the list; the family matching, who can see and change it, and that it is deleted with the category or family; never sent to Google. Each page keeps its own words and its own way of saying "you".

**Translator notes (none blocks anything):**
- Some privacy pages use a different word for "event" than the app (sk "termín", el "ραντεβού", nb "oppføring", zh "事件/活動"). Each file kept its own word. The help articles use the app's word.
- Japanese: the help article says カテゴリ (the app's spelling), and the privacy page says カテゴリー (that page's spelling).
- ro: the app's name for Tomato is "Roșie", which also just means "red" in Romanian. That is app 017's choice; app 017 already lists the colour names to check on a phone.
- zh: the ARB labels **Google颜色** / **Google顏色** have no space before the Chinese word. The running text puts a space around "Google". The bold labels stay exactly as the app shows them.
- One sub-agent ran a read-only `git diff` to check its own work. Nothing else was touched.

## Facts I could not confirm
- **"Daili follows on the next sync" after a colour change in Google.** The code says so (the mapper writes `color_id` on every refresh). But no phone test on prod has shown it yet. The phone test in app 018 checks it.
- **That the deploy of api 017 ran its migration.** That is api 017's open item, not checked here.
- Everything else was checked in the code or the reports (see §1 and §2).

## Verify (all in the foreground)
- `npm run check:help` → `help OK · 122 article(s) · 25 locale(s) · 99 app routes checked`.
- `node tools/check-legal.mjs` → `legal OK · 2 document(s) × 28 locale(s)`.
- `npm run build` → exit 0. I ran it twice; the second run was after the zh-Hant fix:
  - `help: 115 of 122 article(s) on pages (live 1.17.0) · … PUBLIC`
  - `build OK · 3759 pages · 3728 in hreflang clusters`
  - `detector OK · 32 cases · 28 locale(s) built`
  - `help search OK · 38 cases · 2 built page(s)`
- There is no `CHANGELOG.md` line, because this repo has none.

## Help impact
New hidden article `calendar-google-colours` ("Google colours and categories", `since: 99.0.0`). Privacy: Google event colours (sections 4 and 5, all 28 pages).

## Open items for the owner
- **Deploy the website right after this run:** `cd ~/development/flutter_projects/familyplanner/daili-website && ./deploy.sh`. The api of this run already stores the colour number since its push, so the privacy text should be live now. The help article stays hidden after the deploy.
- **On release day (the app build with app 017–018 is in the stores), in the help sync prompt:**
  1. In `help/en/calendar/google-colours.md`, set `since: 99.0.0` to the real app version.
  2. Add a `related` link to `calendar-google-colours` from `calendar-categories`: the English `related:` and, if there is room, one body line in all 25 locales. `calendar-categories` has room: it is about 100 words.
  3. Picture: replace `mediaPending` with `media` (the Google colors screen with two matched colours) and add the image line in all 25 languages.
  4. Optional, if the word cap allows: the rows only show when the family has a Google calendar.
