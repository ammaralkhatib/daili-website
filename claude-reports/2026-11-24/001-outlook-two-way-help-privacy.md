# 001 — Privacy names Outlook two-way; new hidden help article "Change Google and Outlook events in daili"

**Result:** done · **Commit:** `140d756d` docs(legal,help): privacy names Outlook two-way; hidden article "Change Google and Outlook events in Daili". It has 55 files and is pushed to origin/main (`03837cfa..140d756d`). This report follows in its own `docs(report)` commit. `./deploy.sh` was NOT run, because Ammar deploys.
**Step 0:** `03837cfa` docs(plan): sync planning docs (this prompt file), pushed. No commits were held, and `main` was equal to `origin/main`. `static/assets/img/photos/` (the old untracked pictures) stayed out of every commit, as in earlier runs.

All upstream reports were there and I read them: api 009–013, app 009–010, web 004–005. I checked every fact against the code as well (api `MicrosoftEventWriteBlock.php`, `MicrosoftEventFields.php`, `MicrosoftOAuth.php`, `MicrosoftCalendarWatcher.php`; app ARB + picker screen; web `en.ts`).

## 1. Privacy

**Where it sits:** the new paragraph `id="outlook-two-way"` is in **section 4**, right after "Edit in Daili" (`id="copy-to-daili"`), not inside section 5. Section 5 is "Google user data", the text Google's reviewers read. An Outlook paragraph there would read oddly and could confuse that review. In section 4 it sits next to the other connected-calendar text, which already names Outlook.

**Changed sentences (every language, each file's own words):**
- "Connected calendars": "unless you switch one of your **Google or Outlook** calendars to Two-way". It now says "most events of **that calendar** … saved in **Google or Outlook**" and "saved straight in **Google or Outlook**". The pointer now reads "Section 5 explains the details for Google, and "Two-way sync with Outlook" below explains them for Outlook."
- "Edit in Daili": "from a calendar link or from a **Google or Outlook** calendar on View only can't be changed". The linked-event exception now covers a Google **or Outlook** calendar on Two-way, with "Daili and Google" (or "Daili and Outlook").
- Section 6 (no sign-in requests): "Google's **and Microsoft's** notices that a Two-way calendar has changed". The prompt did not list this one. But Outlook's push address (api 012) is live, so without it the sentence would be untrue.
- Every Google sentence is unchanged or only widened. No Google promise is weaker.
- The "Last updated" date is 2026-11-24 on all 28 pages.
- `tools/check-legal.mjs` now requires `id="outlook-two-way"` in every locale, next to `google-two-way`. I watched it fail on the 26 untranslated files before the translations went in.

**New paragraph, English, word for word:**

> **Two-way sync with Outlook (optional).** Two-way sync for Outlook is being rolled out step by step, so it may not be offered to you yet. Without it, Daili only reads your Outlook calendars. Only if you switch one of your Outlook calendars to "Two-way" (in the app: Choose calendars → Sync → Two-way; the app first explains what this means, then Microsoft's own page asks you) does Daili ask Microsoft for one more permission: `Calendars.ReadWrite` — read and change your calendar events. Microsoft gives this permission for all calendars of your account, but Daili writes only to the calendars you switched to Two-way, and only to calendars Outlook lets you edit. If you do not allow it on Microsoft's page, your connection stays read-only. With Two-way sync, Daili changes, deletes or adds an event in Outlook only when you yourself change, delete or add that event in Daili, and only in that calendar. Daili never changes your Outlook calendar by itself: a background job never writes to it. Only the person who linked the calendar can do this: other family members, a family wall screen, a TRMNL display and connected AI apps can never change anything in Outlook. For this, Daili sends Microsoft only the event's title, place, notes, start and end, whether it is all-day and its time zone — for a new repeating event also its repeat rule, and for a new event a technical event ID that Daili makes up. People, reminders and categories stay in Daili. Daili never sends invitations and never adds guests: events that have guests, invitations from other people, online meetings and other special Outlook events, and a few repeating events that Outlook counts differently stay view-only in Daili. So that Two-way sync can work, we store for each Outlook event the same kind of technical details as for Google (section 5, "What we store"): Microsoft's IDs for the event and its series, a version stamp, a few flags and, if it must stay view-only, only the reason. For a calendar on Two-way, Daili also asks Microsoft to tell our server when that calendar has changed; such a notice says only that it changed and contains no event details. For it we store Microsoft's ID for the notice, a secret token (only as a hash) and when it ends; it is stopped when the calendar leaves Two-way, when you remove it from Daili, disconnect Outlook or delete your account. Switching a calendar back to "View only", removing it from Daili, disconnecting Outlook or deleting your Daili account deletes nothing in your Outlook calendar. Events from Outlook calendars never reach an AI app you connect (see "AI apps you connect" below). You can take Daili's access back at any time: for a personal Microsoft account at [account.live.com/consent/Manage](https://account.live.com/consent/Manage), and for a work or school account on the page your organisation offers for this (ask its IT administrator). Daili then can no longer read or change your Outlook calendar; disconnect in Daili as well to delete the copy we stored. Legal basis: performance of the contract with you (Art. 6(1)(b) GDPR).

**German (`datenschutz.de.html`), word for word (I wrote it myself):**

> **Beidseitige Synchronisierung mit Outlook (freiwillig).** Die beidseitige Synchronisierung für Outlook wird nach und nach eingeführt und wird dir vielleicht noch nicht angeboten. Ohne sie liest Daili deine Outlook-Kalender nur. Nur wenn du einen deiner Outlook-Kalender auf „Beidseitig“ stellst (in der App: Kalender auswählen → Synchronisierung → Beidseitig; die App erklärt zuerst, was das bedeutet, dann fragt dich die eigene Seite von Microsoft), bittet Daili Microsoft um eine weitere Berechtigung: `Calendars.ReadWrite` — deine Kalendertermine lesen und ändern. Microsoft erteilt diese Berechtigung für alle Kalender deines Kontos, aber Daili schreibt nur in die Kalender, die du auf „Beidseitig“ gestellt hast, und nur in Kalender, die du laut Outlook bearbeiten darfst. Wenn du es auf der Seite von Microsoft nicht erlaubst, bleibt deine Verbindung lesend. Mit beidseitiger Synchronisierung ändert, löscht oder erstellt Daili einen Termin in Outlook nur dann, wenn du selbst diesen Termin in Daili änderst, löschst oder hinzufügst, und nur in diesem Kalender. Daili verändert deinen Outlook-Kalender nie von sich aus: Ein Hintergrundprozess schreibt nie hinein. Das kann nur die Person, die den Kalender verbunden hat: Andere Familienmitglieder, ein Familien-Wandbildschirm, ein TRMNL-Display und verbundene KI-Apps können in Outlook nie etwas ändern. Dafür sendet Daili an Microsoft nur Titel, Ort, Notizen, Beginn und Ende des Termins, ob er ganztägig ist, und seine Zeitzone — bei einem neuen wiederkehrenden Termin auch seine Wiederholungsregel und bei einem neuen Termin eine technische Termin-ID, die Daili selbst erzeugt. Personen, Erinnerungen und Kategorien bleiben in Daili. Daili verschickt nie Einladungen und fügt nie Gäste hinzu: Termine mit Gästen, Einladungen von anderen, Online-Besprechungen und andere besondere Outlook-Termine sowie einige wiederkehrende Termine, die Outlook anders zählt, kannst du in Daili nur ansehen. Damit die beidseitige Synchronisierung funktioniert, speichern wir für jeden Outlook-Termin dieselbe Art technischer Angaben wie für Google (Abschnitt 5, „Was wir speichern“): die IDs von Microsoft für den Termin und seine Serie, einen Versionsstempel, einige Merker und, wenn er nur zum Ansehen bleiben muss, nur den Grund. Für einen Kalender auf „Beidseitig“ bittet Daili Microsoft außerdem, unserem Server Bescheid zu geben, wenn sich dieser Kalender geändert hat; so eine Meldung sagt nur, dass er sich geändert hat, und enthält keine Termindaten. Dafür speichern wir die ID der Meldung bei Microsoft, ein geheimes Token (nur als Hash) und wann sie endet; sie wird beendet, wenn der Kalender nicht mehr auf „Beidseitig“ steht, wenn du ihn aus Daili entfernst, Outlook trennst oder dein Konto löschst. Wenn du einen Kalender wieder auf „Nur ansehen“ stellst, ihn aus Daili entfernst, Outlook trennst oder dein Daili-Konto löschst, wird in deinem Outlook-Kalender nichts gelöscht. Termine aus Outlook-Kalendern erreichen nie eine KI-App, die du verbindest (siehe „KI-Apps, die du verbindest“ unten). Du kannst Daili den Zugriff jederzeit entziehen: bei einem privaten Microsoft-Konto unter [account.live.com/consent/Manage](https://account.live.com/consent/Manage), bei einem Arbeits- oder Schulkonto auf der Seite, die deine Organisation dafür anbietet (frag deren IT-Verwaltung). Daili kann deinen Outlook-Kalender dann nicht mehr lesen oder ändern; trenne die Verbindung auch in Daili, damit die bei uns gespeicherte Kopie gelöscht wird. Rechtsgrundlage: Erfüllung des Vertrags mit dir (Art. 6 Abs. 1 lit. b DSGVO).

**What I added beyond the prompt's list, and why:** the prompt asked for a short paragraph. I also put in what is sent to Microsoft, what we store, and the change notices (push). These mirror the Google paragraph. Without them, the page would not say what data Microsoft gets or what we keep for push (api 010/012 do both). The paragraph is longer than "short" because of this. If you want it shorter, the stored-data sentence is the easiest one to move into a separate sentence or drop.

**Facts checked in the code:**
- `Calendars.ReadWrite` is asked for only on the write upgrade (`MicrosoftOAuth::WRITE_SCOPE`).
- What is sent comes from `MicrosoftEventFields`: subject, body, location, start/end + time zone, isAllDay, recurrence on create, `transactionId` + `DailiClientId`, `responseRequested: false`. Never attendees, organizer or online meeting.
- The view-only reasons come from `MicrosoftEventWriteBlock`: `special` (online meeting or an unknown type), `not_organizer`, `guests`, `repeat` (monthly on day 29–31, yearly on 29 Feb, or a rule it can't read).
- Push: `clientState` is stored only as a sha256 hash, plus the subscription id and expiry (`MicrosoftCalendarWatcher`). It is stopped on deselect, one-way, disconnect and purge (api 013 report).
- MCP: privacy line `ai-apps` already says Outlook events never reach AI apps.
- The link `https://account.live.com/consent/Manage` opens: it goes to the Microsoft sign-in page (302 → login.live.com, 200). I did not sign in.

## 2. Help article (hidden)

`help/en/calendar/two-way.md`, id `calendar-two-way`:
- topic `calendar`, title "Change Google and Outlook events in daili", 10 keywords.
- `routes: /calendar/settings, /calendar/external-edit`, `tryIt: /calendar/settings`.
- `since: 99.0.0`, `updated: 2026-11-24`, `mediaPending`, `order: 12`.
- `related: calendar-phone-calendars, calendar-repeating, calendar-add-event`.

> Changes you make in daili can be saved in Google or Outlook too.
>
> 1. Open **Calendar**, tap the gear, then your account under **Other calendars**.
> 2. At a calendar, set **Sync** to **Two-way**.
> 3. Tap **Continue to Google** or **Continue to Microsoft**, allow it once, then tap **Save**.
> 4. Edit, delete or add its events. In a new event, **Save to** picks the calendar.
>
> Only you can change them. Your family can still use **Edit in Daili**.
>
> Repeating? Pick **This day only** or **Whole series**. **Whole series** changes title, place and notes, not the time.
>
> These stay view only, with the reason shown: events with guests, invitations, special events (like birthdays or online meetings) and some Outlook repeats (like monthly on the 31st). Outlook can't move one day past its neighbours.
>
> Changes in Google or Outlook usually show up within seconds. Same on app.daili.app. **View only** or disconnecting deletes nothing there.

**Routes (from the app, `route_names.dart` + reports):**
- The calendar picker (`ProviderCalendarPickerScreen`) has **no route of its own**. It opens with `MaterialPageRoute` from Calendar settings → Other calendars → the account row (`other_calendars_section.dart:198-207, 712`). So the article uses `/calendar/settings`, and `tryIt` is `/calendar/settings`.
- The synced-event edit form is `/calendar/external-edit`.
- `help/routes-allowlist.json`: the prompt said to "update the note" of `/calendar/external-edit`. But `check:help` refuses a "never" entry that an article covers ("remove the stale entry"), so I **removed** it instead.

**Where I went against the prompt (the guard or house style wins):**
- **About 150 words, not 260.** The guard allows 150 English words (`LIMITS.words`), the same as in 2026-11-23/003 and 004. I kept all 9 points, made shorter. The facts I left out are listed below.
- **"daili" in lower case** in the title, summary and running text. The prompt's title had "Daili". The help center writes the brand in lower case (220 times against 51, and the 51 are mostly labels such as **Edit in Daili**). The translation rules say the same.
- **"usually" within seconds.** Push is fast, but the privacy text itself says the 15-minute refresh is the floor. "Within seconds" alone could be wrong when a notice is late.
- **Outlook repeats:** the example is "monthly on the 31st". The real rule is day 29, 30 or 31 of the month, and 29 February each year.
- **mediaPending** is shortened to fit the 80-character cap: "the picker with the Two-way switch; an Outlook event open for editing".

**How it stays hidden** (proved like 2026-11-23/004):
- `since: 99.0.0` is in the English file. Translations carry no `since`, and `LIVE_APP_VERSION` is unchanged.
- No article lists `calendar-two-way` in `related` (checked in `dist/help/en.json`: empty). No other article was changed.
- Build: "115 of 121 article(s) on pages". Before, it was 115 of 120. The page count stays 3759.
- There is no `dist/help/calendar/two-way/` and no `dist/de/help/calendar/two-way/`.
- A grep over `dist/` finds it only in the 25 app files `dist/help/<loc>.json`, with `since 99.0.0`, so the app hides it too. It is in no HTML page, no sitemap and no search index.

**True, but left out because of the 150-word cap:**
- On the web the switch is somewhere else: **Family** → the Google/Outlook card → **Manage** (web 005). The article only says "Same on app.daili.app".
- With **Whole series**, Outlook **keeps** the days you changed one by one. Google gives them the new title, place and notes too (app 009, `twoWayScopeSeriesReplacesHint…`).
- To move a whole series' time, change it day by day or in Google/Outlook (`twoWayScopeTimeMovedHint`).
- People, reminders and category stay in Daili and never go to Google/Outlook. A repeating event saved to Google/Outlook has none of them yet.
- Notes that are formatted or very long can only be changed in Google/Outlook, and so can a time whose zones differ.
- A new repeat that Google/Outlook can't save is refused, with **Save to Daili instead**.
- "Changed in Google/Outlook" while you were editing → **Discard my changes** / **Edit again**.
- Google special events also include focus time and out of office. Google can also lock an event.
- Linked Daili events (**Edit in Daili**) send title, place and time back, and delete asks **Only in Daili** / **Daili and Outlook**.

## 3. Translations

- **Help:** 24 languages. I wrote German myself; 8 sub-agents wrote the other 23 (3 each).
- **Privacy:** 26 languages. 8 sub-agents (3–4 each) wrote a replacement sheet per language. My script applied the sheets: every "old" text must appear exactly once, the paragraph goes right after `copy-to-daili`, and the date moves to 2026-11-24. All 26 were applied on the first try.
- **Sub-agents:** all 8 ran on Opus 5.5 (`claude-opus-5-5`), started together in the foreground. I waited for all 8 before any check, build or commit, and checked their files on disk: 25 help files, 26 sheets.
- **Labels:** the bold labels come from each language's ARB at app HEAD (the feature is not released yet). zh-Hans uses `app_zh.arb` and zh-Hant uses `app_zh_Hant.arb`. My check script compares the bold set with the ARB values for **all 24** languages. It also checks the block shape, `translatedFrom: 2026-11-24`, app.daili.app, the guard, and no "family planner" in el/uk/bg. All 24 pass.
- **Address form:** ar, hi and ru have no help article and no ARB, so they use the words their privacy files already use. Where a privacy page uses a formal "you" (fr vous, cs vy, tr siz, ru вы, pl Ty, id kamu), the new paragraph uses the same form. The help articles use the app's informal form.

**My spot-check, 5 help translations against their ARB:** I read fr, pl, el, ja and zh-Hant in full. The meaning matches the English and every bold label is the ARB value. For example:
- fr: **Synchronisation** / **Bidirectionnelle** / **Continuer vers Microsoft** / **Enregistrer dans** / **Toute la série**
- pl: **Synchronizacja** / **Dwukierunkowa** / **Przejdź do Microsoft** / **Zapisz w** / **Cała seria**
- el: **Συγχρονισμός** / **Αμφίδρομος** / **Συνέχεια στη Microsoft** / **Αποθήκευση σε** / **Όλη η σειρά**
- ja: **同期** / **双方向** / **Microsoftへ進む** / **保存先** / **シリーズ全体**
- zh-Hant: **同步** / **雙向** / **前往Microsoft** / **儲存到** / **整個系列**

**My spot-check, 3 privacy languages against the English:** I read the fr, pl and ja paragraphs in full, plus the es word diff. All facts are there, in the same order: the permission, "only that calendar", no background job, what is sent, the view-only cases, storage, notices, nothing deleted, no AI apps, the link, and the legal basis. Each uses its file's own words for "Two-way" and "View only" and its own section headings.

**Translator notes (none blocks anything):**
- fi: the "Save to" label is "Tallenna kalenteriin", so step 4 reads a little doubled.
- tr: the "Save to" label "Kaydedileceği yer" is stiff, so the step says "in the Save to field".
- ko: "Whole series" = "반복 전체" (literally "whole repeat").
- th: "This day only" = "only the selected day". Both are the app's own words.
- nb and el privacy pages use another word for "event" than the app ("oppføring", "ραντεβού"). Each file kept its own word.
- The ar privacy page writes the legal basis without "GDPR", as everywhere in that file.
- Two translators found "it is stopped" in the English notice sentence vague. They made it explicit ("the notice"). The meaning is the same.

## Facts I could not confirm
- **That a non-owner still sees "Edit in Daili" on a two-way event.** I took it from the prompt and app 010 (view-only rows keep "Edit in Daili"). I did not trace the detail sheet for a family member's view line by line.
- **"Usually within seconds" for Outlook.** The push watcher is built (api 012), but no end-to-end push on prod is proven yet. The phone test checks it.
- **The work/school consent page.** The text says "the page your organisation offers (ask its IT administrator)", with no link, as the prompt asked.
- Everything else was checked in the code or the reports (see §1 and §2).

## Verify (all in the foreground)
- `npm run check:help` → `help OK · 121 article(s) · 25 locale(s) · 98 app routes checked`.
- `node tools/check-legal.mjs` → `legal OK · 2 document(s) × 28 locale(s)`.
- `npm run build` → exit 0:
  - `help: 115 of 121 article(s) on pages (live 1.17.0) · … PUBLIC`
  - `build OK · 3759 pages · 3728 in hreflang clusters`
  - `detector OK · 32 cases · 28 locale(s) built`
  - `help search OK · 38 cases · 2 built page(s)`
- `id="outlook-two-way"` is on all 28 built privacy pages in `dist/`.
- No `CHANGELOG.md` line, because this repo has none.

## Help impact
New hidden article `calendar-two-way` ("Change Google and Outlook events in daili", `since: 99.0.0`). Privacy: Outlook two-way (new paragraph `outlook-two-way` + the connected-calendars and "Edit in Daili" sentences, all 28 pages).

## Open items for the owner
- **Deploy the website** (`./deploy.sh` in `daili-website`). The privacy change should be live before anyone but you gets the Outlook switch. The help article stays hidden after the deploy.
- **On the Outlook switch-on day** (`calendar:two-way on --provider=microsoft`, the help sync prompt):
  1. In `help/en/calendar/two-way.md`, set `since: 99.0.0` to the real app version that has app 009–010.
  2. Add `related` links to `calendar-two-way` from `calendar-phone-calendars` and `calendar-repeating`: the English `related:`, and one body line in all 25 locales if there is room. Both articles are near the word cap.
  3. Pictures: replace `mediaPending` with `media` (the picker with the Two-way switch; an Outlook event open for editing) and add the image lines in all 25 languages.
  4. Optional, if the cap allows: the web place (**Family** → **Manage**), and that Outlook keeps the days you changed one by one.
- The privacy text says "being rolled out step by step" for Outlook. When Outlook is on for everyone, that sentence (and Google's, which has been on for everyone since 2026-11-18) can go.
- A native speaker could look at the new privacy paragraph some time, mainly pl/cs/sk (brand names take endings) and el (article gender for Google/Outlook).

DONE
