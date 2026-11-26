# 001 — Help for 1.18: six articles open, "two-way" is Google only, Outlook gets its own hidden article

**Result:** done · **Commit:** `e22b4968` docs(help): open six articles for 1.18; two-way is Google only, Outlook in a hidden article. It has 375 files and is pushed to origin/main (`42921201..e22b4968`). This report follows in its own `docs(report)` commit. `./deploy.sh` was NOT run, because Ammar deploys. `LIVE_APP_VERSION` is still 1.17.0.
**Step 0:** `42921201` docs(plan): sync planning docs (this prompt file), pushed. No commits were held, and `main` was equal to `origin/main`. `static/assets/img/photos/` (the old untracked pictures) stayed out of every commit, as in earlier runs.

## 1. D3 — six articles open for 1.18

In `help/en/…` I changed `since: 99.0.0` → `since: 1.18.0` and set `updated: 2026-11-26` for:
`calendar/google-colours`, `calendar/shift-plan`, `lists/steps`, `meals/cook-with`, `meals/import-file`, `meals/meal-times`.

- **Only English carries `since`.** Translations have no `since` key (the guard forbids it), so "in every language" means the English file. In the 24 translations I set `translatedFrom: 2026-11-26`, because their text did not change. Without that, the check would warn "older than English".
- **All six are in the 1.18 code.** I checked `git log v1.17.0+25..HEAD` in the app (385 commits) and `route_names.dart` at HEAD. Shift plan (`/calendar/shifts`, #281/#303/#312), steps in a to-do (`ff105d48`, `7e279c85`, `59c198e3`), cook with (`dae6b7ec`, `bc04f316`, `/recipes/cook`), Paprika import (`15e56e80`, `0fac8221`, 092 fixes), meal times (`69b53ae6`, #287) and Google colours (`4a274860`, `/family/event-categories/google-colors`) are all there. None of them is behind a server switch in the app (I grepped for `…Enabled/Allowed/Flag`; only Vault sharing has one, `vaultSharingOn`). None is left hidden.
- **`vault/sharing.md` stays at `99.0.0`**, as the prompt says.

**`related:` links added** (English front matter only, one per opened article, `updated` bumped, translations' `translatedFrom` bumped):

| From (older article) | To | Why |
|---|---|---|
| `calendar-categories` | `calendar-google-colours` | Google colors is a screen under Event categories |
| `calendar-add-event` | `calendar-shift-plan` | add-event already says "Same event on other days, like shifts?" |
| `lists-todos` | `lists-steps` | steps live inside a to-do |
| `meals-find` | `meals-cook-with` | finding recipes ↔ finding recipes from what you have |
| `meals-import-link` | `meals-import-file` | the other way to bring recipes in |
| `meals-meal-settings` | `meals-meal-times` | the times sit in Meal settings |
| `calendar-phone-calendars` | `calendar-two-way` | that article connects Google; two-way is the next step (last run's open item) |

The last row is beyond the six, but `calendar-two-way` also opens for 1.18. While 1.17 is live, the pages hide links to hidden articles (build.mjs:1448), and I checked that no built page links to any of them.

## 2. D4 — the split

**`help/en/calendar/two-way.md`** (id `calendar-two-way`, `since: 1.18.0`, `updated: 2026-11-26`, 147 words). Word for word:

> title: Change Google events in daili
> summary: Switch a Google calendar to two-way. Then what you add, change or delete in daili is saved in Google too.
> keywords: two-way, two way, sync, edit google event, change google event, google calendar, gmail calendar, write back, save to
> mediaPending: the picker with the Two-way switch; a Google event open for editing
>
> 1. Open **Calendar**, tap the gear, then your Google account under **Other calendars**.
> 2. At a calendar, set **Sync** to **Two-way**.
> 3. Tap **Continue to Google**, allow it once, then tap **Save**.
> 4. Edit, delete or add its events. In a new event, **Save to** picks the calendar.
>
> Only you can change them. Your family can still use **Edit in Daili**.
>
> A new **Private event** for a Google calendar your family sees? daili asks first: **Save in Daili (private)** keeps it private. **Save to** with the calendar's name puts it in Google, where your family sees it.
>
> Repeating? Pick **This day only** or **Whole series**. **Whole series** changes title, place and notes, not the time.
>
> View only, with the reason shown: events with guests, invitations, locked events and special events (like birthdays).
>
> Changes in Google usually show up within seconds, on app.daili.app too. **View only** or disconnecting deletes nothing in Google.

**NEW `help/en/calendar/two-way-outlook.md`** (id `calendar-two-way-outlook`, `since: 99.0.0`, order 13, `related: calendar-two-way, calendar-phone-calendars, calendar-repeating`, 125 words). Word for word:

> title: Change Outlook events in daili
> summary: Switch an Outlook calendar to two-way. Then what you add, change or delete in daili is saved in Outlook too.
> keywords: two-way, two way, sync, edit outlook event, change outlook event, outlook, outlook calendar, microsoft, hotmail, write back, save to
> mediaPending: the picker with the Two-way switch; an Outlook event open for editing
>
> 1. Open **Calendar**, tap the gear, then your Outlook account under **Other calendars**.
> 2. At a calendar, set **Sync** to **Two-way**.
> 3. Tap **Continue to Microsoft**, allow it once, then tap **Save**.
> 4. Edit, delete or add its events. In a new event, **Save to** picks the calendar.
>
> Only you can change them. Your family can still use **Edit in Daili**.
>
> Repeating? Pick **This day only** or **Whole series**. **Whole series** changes title, place and notes, not the time.
>
> View only, with the reason shown: events with guests, invitations, special events (like online meetings) and some repeats (like monthly on the 31st). Outlook can't move one day past its neighbours.
>
> Changes in Outlook usually show up within seconds, on app.daili.app too. **View only** or disconnecting deletes nothing in Outlook.

**Choices and where I differ from the prompt:**
- **The intro line is gone from both** ("Changes you make in daili can be saved in … too"). The new Private line pushed the Google article to 167 words, and the guard allows 150. The summary already says the same thing.
- **The Google view-only list is now Google's real list.** It comes from api `GoogleEventWriteBlock.php`: `special` (birthday, focus time, out of office …), `locked`, `not_organizer`, `guests`. "Online meetings" was an Outlook reason only, so it moved to the Outlook article. "Locked events" is new in the Google article: it is a real Google reason (`twoWayBlockLocked`, "Locked in Google Calendar.").
- **The Private line** follows app `1a649792` (093). It only asks in the **new** event form (`event_create_screen.dart`), for a Google/Outlook calendar the family sees. "Only me" calendars and Private off ask nothing. The labels come from `calendarPrivate` (**Private event**), `eventPrivateSharedCalendarSaveDaili` (**Save in Daili (private)**) and `eventPrivateSharedCalendarSaveTo` ("Save to {calendar}", written as "**Save to** with the calendar's name").
- **The Outlook article has no Private line.** The prompt listed what goes into it (connect, two-way switch, the neighbour rule, repeat limits), and that list does not include it. The rule is true for Outlook too. It fits (125 words), so it can be added on the Outlook switch-on day (see Open items).
- **No article links TO `calendar-two-way-outlook`** (`dist/help/en.json`: empty list). The Outlook article itself links to `calendar-two-way`, which is allowed.
- `help/routes-allowlist.json` and `help/media*.json` did not need changes: the guard and the build passed without them.

## 3. Help-impact lines from the 2026-11-25 run

- **`meals/import-file.md` (app 092): added.** The article was already at 150 words, so I made the English shorter first. I dropped the intro line "Moving from Paprika?…" (the summary says it), "or Downloads", "by version", "for now", and the old note sentence "Importing again skips recipes with the same name and link", because the new line covers it. New line, word for word: "Photos missing after **Stop** or with no internet? Import the same file again later. daili adds them and skips the recipes you already have." (**Stop** = `recipeFileStop`.) The article is now 144 words.
- **`calendar/add-event.md` (app 093): left unchanged.** It does not explain **Save to** (its steps are Title, Start/End, Repeats …, Save). The Private rule is in `calendar-two-way`, where **Save to** is explained.

## 4. Translations

- 24 languages × 3 files: `two-way.md` rewritten, `two-way-outlook.md` new, `import-file.md` edited. All have `translatedFrom: 2026-11-26`.
- **Sub-agents:** 8 of them, 3 languages each, all on Opus 5.5 (`claude-opus-5-5`). I waited for all 8 to finish before any check, build or commit, and checked their files on disk (72 of 72).
- **Stray files:** several translators first wrote one file to a wrong path, `…/familyplanner/familyplanner/daili-website/…`, outside the repo. Each one deleted its own. I checked after all 8 finished: the folder does not exist any more. The real files are all in the repo (my check script below reads them from there).
- **My check script** (`/tmp/d118/check-split.mjs`) covers all 24 languages. Every bold label of the split is the exact ARB value for its key (Sync, Two-way, Continue to Google/Microsoft, Save to, Private event, Save in Daili (private), This day only, Whole series, View only, Stop). Every word of "Save to {calendar}" is there. The front matter has only allowed keys, `translatedFrom` is 2026-11-26, and there is no "family planner" in el/uk/bg. Result: `ALL OK`.
- **"Save to {calendar}" by language:** where the ARB starts with the fixed words, the translators used the English pattern (fr **Enregistrer dans**, es **Guardar en**, pl **Zapisz w:** …). Where the name sits in the middle or at the front, they wrote the label with `…` (de **In … speichern**, ja **…に保存**, ko **…에 저장**, el **Αποθήκευση σε: …**, uk **Зберегти в: …**, bg **Запази в: …**).
- **Translator notes (none blocks anything):**
  - "Locked events" has no ARB label, so it is in plain words, taken from `twoWayBlockLocked` where possible.
  - tr: "special events" was "özel etkinlikler", and "özel" is also the app's word for Private (**Özel etkinlik**). In the Google article it is now "farklı türdeki etkinlikler" so the two don't clash.
  - fi: **Save to** and "Save to {calendar}" are both "Tallenna kalenteriin" in the ARB, so it reads a little doubled.
  - pl/cs/sk/tr keep the colon from the ARB inside the bold label ("Zapisz w:").
  - ja `import-file` is 569 of 600 characters. Any later addition there needs shortening first.

**Body size per language** (counted like the guard: words, or characters for ja/ko/zh/th; translation cap 210 words, ja/ko 600, zh 450, th 900 characters):

| | two-way | two-way-outlook | import-file |
|---|---|---|---|
| en | 147w | 125w | 144w |
| de | 159w | 134w | 167w |
| nl | 162w | 143w | 168w |
| sv | 157w | 140w | 158w |
| da | 155w | 138w | 158w |
| nb | 157w | 139w | 157w |
| fi | 129w | 117w | 131w |
| fr | 170w | 152w | 180w |
| it | 160w | 138w | 168w |
| es | 161w | 145w | 177w |
| pt | 159w | 143w | 178w |
| pl | 153w | 137w | 158w |
| cs | 154w | 136w | 158w |
| sk | 151w | 130w | 155w |
| ro | 160w | 137w | 156w |
| tr | 148w | 128w | 141w |
| el | 176w | 152w | 181w |
| uk | 148w | 126w | 159w |
| bg | 153w | 133w | 161w |
| ja | 491c | 430c | 569c |
| ko | 442c | 390c | 457c |
| zh-Hans | 350c | 313c | 380c |
| zh-Hant | 357c | 318c | 390c |
| th | 608c | 536c | 647c |
| id | 147w | 132w | 164w |

**My spot-check of 5 languages against their ARB:** I read de, fr and pl in full (two-way + the Outlook article's last blocks), plus el and ja `two-way.md` and ja `import-file.md`. The meaning matches the English. Every bold label is the ARB value, for example:
- de: **Synchronisierung** / **Beidseitig** / **Weiter zu Google** / **Privater Termin** / **In Daili speichern (privat)** / **Nur ansehen**
- fr: **Synchronisation** / **Bidirectionnelle** / **Continuer vers Google** / **Événement privé** / **Enregistrer dans Daili (privé)** / **Lecture seule**
- pl: **Synchronizacja** / **Dwukierunkowa** / **Przejdź do Google** / **Prywatne wydarzenie** / **Zapisz w Daili (prywatnie)** / **Tylko podgląd**
- el: **Συγχρονισμός** / **Αμφίδρομος** / **Συνέχεια στη Google** / **Ιδιωτικό γεγονός** / **Αποθήκευση στο Daili (ιδιωτικά)**
- ja: **同期** / **双方向** / **Googleへ進む** / **非公開の予定** / **Dailiに保存（非公開）** / **中止**

## Verify (all in the foreground)

- `npm run check:help` → `help OK · 124 article(s) · 25 locale(s) · 99 app routes checked`, with no warnings (before: 123 articles).
- `npm run build` → exit 0:
  - `help: 115 of 124 article(s) on pages (live 1.17.0) · 14 topic(s) · en.json 124 articles, 16 tips, 6 checklist · PUBLIC` (before this run: 115 of 123, so the new article adds no page)
  - `build OK · 3759 pages · 3728 in hreflang clusters` (same page count as before)
  - `detector OK · 32 cases · 28 locale(s) built`
  - `help search OK · 38 cases · 2 built page(s)`
- **Build proof with `LIVE_APP_VERSION` 1.17.0:**
  - There is no page folder for any of the 8 articles (`dist/help/<path>/` and `dist/<loc>/help/<path>/`, 25 locales): 0 found.
  - All 25 `dist/help/<loc>.json` carry all 8 articles: `calendar-two-way`, `calendar-google-colours`, `calendar-shift-plan`, `lists-steps`, `meals-cook-with`, `meals-import-file` and `meals-meal-times` each have `since 1.18.0` (25 of 25), and `calendar-two-way-outlook` has `since 99.0.0` (25 of 25). `vault-sharing` is still `99.0.0`.
  - A grep over `dist/` for these articles' page paths finds nothing outside the app JSON files: no HTML page, sitemap or search index has them, and no page links to them.
  - No article has `calendar-two-way-outlook` in `related`.
- **Grep:** `grep -il "outlook\|microsoft" help/*/calendar/two-way.md` → no file (exit 1).
- No `CHANGELOG.md` line, because this repo has none.

## Help impact

- Seven articles become visible on the 1.18 store day, when `LIVE_APP_VERSION` goes to 1.18.0: `calendar-two-way` (now Google only, plus the Private-event ask), `calendar-google-colours`, `calendar-shift-plan`, `lists-steps`, `meals-cook-with`, `meals-import-file` (plus "import the same file again for missing photos") and `meals-meal-times`.
- New hidden article `calendar-two-way-outlook` (`since: 99.0.0`).
- `calendar-add-event` is unchanged.

## Open items for the owner

- **Deploy is not needed now.** Nothing here shows before 1.18. On the store day, the usual step (`LIVE_APP_VERSION` → 1.18.0, then `./deploy.sh`) opens the seven articles.
- **On the Outlook switch-on day:** set `since` in `help/en/calendar/two-way-outlook.md` to the real version, and add a `related` link to it from `calendar-two-way` (and perhaps `calendar-phone-calendars`). Consider adding the Private-event line there too (it fits: 125 of 150 words). Also replace `mediaPending` with pictures.
- `calendar-two-way` still has `mediaPending` (no Google picture yet).
- Small point in `meals-import-file`, step 2: "Recipes already in daili start unticked". Since app 092, a recipe that daili has WITHOUT a photo stays ticked if the file has a photo for it. The step is still true for most recipes, so I left it alone (the cap is tight).

DONE
