# Privacy + terms for app 1.10.0: weather (Apple Weather), weather in the daily summary, Budget, Cycle — and LIVE_APP_VERSION 1.9.0

## Why
App build 16 (1.10.0) adds weather, Budget and Cycle. The privacy policy still
says "No location" and says nothing about money data or Cycle. It must be
true and **deployed before build 16 goes into review**.

This prompt **replaces** `claude-prompts/2026-10-07/001-legal-weather-location.md`
(blocked: its "before anything leaves your phone" sentence was untrue — the
"Use my location" path also asks the phone's map service for the town name
with the unrounded position). Its report's checks still stand; the text
below fixes that sentence, and adds what changed since:
- prod now gets forecasts from **Apple WeatherKit**, MET Norway only as
  fallback (api `0589eb2`, prod `WEATHER_DRIVER=weatherkit` since 2026-10-11);
- **Weather in daily summary** stores a rough place with the account (api
  `4d66bf7`, app `bbfe4439`);
- **Budget** (api `99f61c6` `d618588` `d4233d7`) and **Cycle** (app `402d3f24`…`6971d086`).

The English and German texts below were written by Planning Claude against
the code (see "Facts behind the text"). **Use them word for word.** If a
sentence is not true for the code, stop and report it — do not quietly
change it. Exception: in the Budget and Cycle paragraphs, the LIST of things
stored ("amount, title, date…", "period days, …") may be corrected to the
real fields without stopping — say what you changed.

Also, one unrelated one-liner that must ship with this deploy: the 1.9.0
store day was never finished on the site. **Set `LIVE_APP_VERSION = '1.9.0'`
in `site.config.mjs`** (1.9.0 is live on both stores since 2026-10-07), so
the public help shows the 1.9.0 articles (Plus, note pictures/voice, note
files, meals-find).

## Scope
- In: `legal/privacy.*.html` (28 bodies incl. `legal/datenschutz.de.html`),
  `legal/terms.*.html` (+ `legal/nutzungsbedingungen.de.html`),
  `tools/check-legal.mjs` (new checks), `site.config.mjs` (`LIVE_APP_VERSION` line only).
- Out: help, home page, blog, changelog pages. 🔴 Untracked files that are
  NOT yours (`claude-reports/2026-10-01/`, `static/assets/img/blog/…`,
  `static/assets/img/photos/`): do not touch, stage or commit them.

Date line in every changed legal file: the day you run this, localised like
the file's existing date.

## 1. Privacy — English (`legal/privacy.en.html`)

a) Section 4, insert right **after** the `id="link-previews"` paragraph (before
`id="plus"`), these four paragraphs in this order:

```html
<p id="weather"><strong>Weather (optional).</strong> The Today screen, the Weather screen and the Weather tile on Home can show the weather. Only if you tap "Use my location" does the app ask your phone for your <strong>approximate</strong> location. To show the name of your town, the app then asks your phone's own map service (Apple or Google) for the town at that position. If you choose a city instead, the name you type is looked up by the same map service. Both lookups happen under Apple's or Google's own privacy terms. Before the place goes to our server, the app rounds it to about 1 km. Our server sends only this rounded place and your time zone — without your name, your account or your IP address — to Apple Weather (Apple's WeatherKit service), which provides the forecast. If Apple Weather is not available, our server asks the Norwegian Meteorological Institute (MET Norway) instead, in the same way. We do not save this location with your account (unless you add the weather to your daily summary, see below). Our server keeps the forecast for a rounded place for up to one hour, without any link to you, so the next request is faster. Like every request, the request address (which contains the rounded place) appears in our server's short-lived technical logs, which we keep only for security. Your chosen city and the last forecast are saved only on your phone. You can hide the weather at any time (Settings → Weather on Today) and take back the location permission in your phone's settings. Legal basis: performance of the contract with you (Art. 6(1)(b) GDPR).</p>
<p id="weather-summary"><strong>Weather in your daily summary (optional).</strong> If you switch on "Weather in daily summary", the app sends our server the place of your weather — your chosen city, or the town at your approximate location — rounded to about 10 km, together with its name. We save this rough place with your account while the switch is on, so our server can put one line of weather at the top of your morning and evening summary. For this, our server asks Apple Weather (or MET Norway) for the forecast of the rounded place, without your name or account. Switching it off deletes the place. It is part of your data export. Legal basis: performance of the contract with you (Art. 6(1)(b) GDPR).</p>
<p id="budget"><strong>Budget (optional).</strong> If you use Budget, we store what you enter on our server with your family's data: each budget's name, currency, period and limit, its categories and their limits, and each entry — amount, title, date, category, note, who paid, how it was paid, whether it is shared or a bill, and whether it repeats — as well as settlements between family members. Each budget is visible only to the people its creator chooses: the whole family, chosen members, or only the creator. Daili never connects to your bank and never sees bank or card details. Bill reminders and budget alerts are sent as push notifications; you can switch them off in Settings → Notifications. Amounts never appear on widgets, the watch, wall displays or in the daily summary. The budgets you created are part of your data export. Legal basis: performance of the contract with you (Art. 6(1)(b) GDPR).</p>
<p id="cycle"><strong>Cycle (optional).</strong> If you turn on Cycle, everything you log there — such as period days, symptoms and notes — and its settings are saved <strong>only on your phone</strong>, in a file that is part of your phone's own backup (iCloud or Google) if you use one. Cycle data never goes to our server, so we cannot see it, and nobody in your family can see it or that you use Cycle. Cycle reminders are created on your phone, and the optional lock uses your phone's own Face ID, fingerprint or code — Daili never receives biometric data. You can export your Cycle data yourself as a file, and delete it in Cycle settings ("Delete all cycle data"); deleting your account in the app also deletes it on that phone.</p>
```

b) "What the app does *not* collect" paragraph: replace `No location.` with
`No precise location — only an approximate place, and only if you use the weather (see above). No health data — Cycle stays on your phone.`

c) Section 6, the "Few people, little data" `<li>`: replace `no location,`
with `no precise location, no health data,`.

d) Section 7 "Where your data lives": append
` Weather forecasts come from Apple Weather (Apple) and, as a fallback, from MET Norway in Norway (EEA); both receive only a rounded place, never your name or account.`

## 2. Privacy — German (`legal/datenschutz.de.html`, authoritative, "du")

a) After the `id="link-previews"` paragraph:

```html
<p id="weather"><strong>Wetter (freiwillig).</strong> Der Heute-Bildschirm, der Wetter-Bildschirm und die Wetter-Kachel auf der Startseite können das Wetter zeigen. Nur wenn du auf „Meinen Standort nutzen“ tippst, fragt die App dein Handy nach deinem <strong>ungefähren</strong> Standort. Um den Namen deines Ortes anzuzeigen, fragt die App dann den Kartendienst deines Handys (Apple oder Google) nach dem Ort an dieser Position. Wählst du stattdessen eine Stadt, sucht derselbe Kartendienst den eingegebenen Namen. Beide Abfragen laufen nach den eigenen Datenschutzbestimmungen von Apple bzw. Google. Bevor der Ort an unseren Server geht, rundet die App ihn auf etwa 1 km. Unser Server schickt nur diesen gerundeten Ort und deine Zeitzone — ohne deinen Namen, dein Konto oder deine IP-Adresse — an Apple Wetter (Apples Dienst WeatherKit), das die Vorhersage liefert. Ist Apple Wetter nicht erreichbar, fragt unser Server auf dieselbe Weise beim Norwegischen Meteorologischen Institut (MET Norway) an. Wir speichern diesen Standort nicht bei deinem Konto (außer du fügst das Wetter deiner täglichen Zusammenfassung hinzu, siehe unten). Unser Server behält die Vorhersage für einen gerundeten Ort bis zu einer Stunde, ohne Bezug zu dir, damit die nächste Anfrage schneller geht. Wie bei jeder Anfrage erscheint die Adresse der Anfrage (die den gerundeten Ort enthält) in den kurzlebigen technischen Logs unseres Servers, die wir nur zur Sicherheit aufbewahren. Deine gewählte Stadt und die letzte Vorhersage werden nur auf deinem Handy gespeichert. Du kannst das Wetter jederzeit ausblenden (Einstellungen → Wetter auf Heute) und die Standort-Freigabe in den Einstellungen deines Handys zurücknehmen. Rechtsgrundlage: Erfüllung des Vertrags mit dir (Art. 6 Abs. 1 lit. b DSGVO).</p>
<p id="weather-summary"><strong>Wetter in deiner täglichen Zusammenfassung (freiwillig).</strong> Wenn du „Wetter in der Zusammenfassung“ einschaltest, schickt die App unserem Server den Ort deines Wetters — deine gewählte Stadt oder den Ort an deinem ungefähren Standort —, gerundet auf etwa 10 km, zusammen mit seinem Namen. Diesen groben Ort speichern wir bei deinem Konto, solange der Schalter an ist, damit unser Server eine Zeile Wetter an den Anfang deiner Morgen- und Abend-Zusammenfassung setzen kann. Dafür fragt unser Server Apple Wetter (oder MET Norway) nach der Vorhersage für den gerundeten Ort, ohne deinen Namen oder dein Konto. Schaltest du ihn aus, wird der Ort gelöscht. Er ist Teil deines Datenexports. Rechtsgrundlage: Erfüllung des Vertrags mit dir (Art. 6 Abs. 1 lit. b DSGVO).</p>
<p id="budget"><strong>Budget (freiwillig).</strong> Wenn du Budget nutzt, speichern wir, was du eingibst, auf unserem Server bei den Daten deiner Familie: Name, Währung, Zeitraum und Limit jedes Budgets, seine Kategorien und deren Limits und jeden Eintrag — Betrag, Titel, Datum, Kategorie, Notiz, wer bezahlt hat, wie bezahlt wurde, ob er geteilt oder eine Rechnung ist und ob er sich wiederholt — sowie Ausgleichszahlungen zwischen Familienmitgliedern. Jedes Budget sehen nur die Personen, die sein Ersteller auswählt: die ganze Familie, ausgewählte Mitglieder oder nur der Ersteller. Daili verbindet sich nie mit deiner Bank und sieht nie Bank- oder Kartendaten. Rechnungs-Erinnerungen und Budget-Hinweise kommen als Push-Benachrichtigungen; du kannst sie unter Einstellungen → Benachrichtigungen ausschalten. Beträge erscheinen nie auf Widgets, der Uhr, Wand-Displays oder in der täglichen Zusammenfassung. Die Budgets, die du erstellt hast, sind Teil deines Datenexports. Rechtsgrundlage: Erfüllung des Vertrags mit dir (Art. 6 Abs. 1 lit. b DSGVO).</p>
<p id="cycle"><strong>Zyklus (freiwillig).</strong> Wenn du Zyklus einschaltest, wird alles, was du dort einträgst — etwa Periodentage, Beschwerden und Notizen — samt Einstellungen <strong>nur auf deinem Handy</strong> gespeichert, in einer Datei, die zum eigenen Backup deines Handys gehört (iCloud oder Google), wenn du eines nutzt. Zyklus-Daten gehen nie an unseren Server, wir können sie also nicht sehen, und niemand in deiner Familie sieht sie oder dass du Zyklus nutzt. Zyklus-Erinnerungen werden auf deinem Handy erstellt, und die optionale Sperre nutzt Face ID, Fingerabdruck oder Code deines Handys — Daili erhält nie biometrische Daten. Du kannst deine Zyklus-Daten selbst als Datei exportieren und in den Zyklus-Einstellungen löschen („Alle Zyklusdaten löschen“); wenn du dein Konto in der App löschst, werden sie auf diesem Handy ebenfalls gelöscht.</p>
```

b) "Was die App *nicht* sammelt": replace `Kein Standort.` with
`Kein genauer Standort — nur ein ungefährer Ort, und nur wenn du das Wetter nutzt (siehe oben). Keine Gesundheitsdaten — Zyklus bleibt auf deinem Handy.`

c) "Wenige Personen, wenige Daten": replace `kein Standort,` with
`kein genauer Standort, keine Gesundheitsdaten,`.

d) "Wo deine Daten liegen": append
` Wettervorhersagen kommen von Apple Wetter (Apple) und, als Ersatz, von MET Norway in Norwegen (EWR); beide erhalten nur einen gerundeten Ort, nie deinen Namen oder dein Konto.`

Quoted app labels: check each against the app's German ARB
(`../familyplanner-app/lib/l10n/app_de.arb`): `weatherUseMyLocation`,
`settingsWeatherOnToday`, the "Weather in daily summary" switch (app
2026-10-11/005), the Cycle name (`Zyklus`) and the "Delete all cycle data"
row. Use the app's exact words where they differ from the text above, and
say so in the report. Same for the English labels against `app_en.arb`.

## 3. Terms — Cycle is not medical (English + German)

In section "2. What Daili is" of `terms.en.html`, append this paragraph:

```html
<p id="cycle"><strong>Cycle.</strong> Cycle is a private diary for your period. Its predictions are estimates shown as ranges. It is not a medical device, not a method of contraception or of planning a pregnancy, and not medical advice. If you have health questions, talk to a doctor.</p>
```

German (`nutzungsbedingungen.de.html`, same place):

```html
<p id="cycle"><strong>Zyklus.</strong> Zyklus ist ein privates Tagebuch für deine Periode. Seine Vorhersagen sind Schätzungen und werden als Zeiträume gezeigt. Es ist kein Medizinprodukt, keine Methode zur Verhütung oder zur Planung einer Schwangerschaft und keine medizinische Beratung. Wenn du Fragen zu deiner Gesundheit hast, sprich mit einer Ärztin oder einem Arzt.</p>
```

## 4. The other locales
Translate the privacy changes (1a–1d) and the terms paragraph (3) into every
other `legal/privacy.<loc>.html` and `legal/terms.<loc>.html` — from the
ENGLISH text, natural native register, the same formal/informal register
each file already uses. Quoted app labels as the app's ARB for that language
has them (`app_<loc>.arb`; no ARB, e.g. ar/hi/ru → translate naturally).
"Apple", "WeatherKit", "MET Norway", "Google", "Face ID", "Daili" untouched.
Same ids (`weather`, `weather-summary`, `budget`, `cycle`) — ids are never
translated. Keep each file's `<p class="translated">` note. If a translation
has no exact "No location" sentence, change the sentence that says the app
collects no location, and list those files in the report.

## 5. Guard
Extend `node tools/check-legal.mjs`: every privacy body contains the ids
`weather`, `weather-summary`, `budget`, `cycle` and the strings `MET Norway`
and `Apple`; every terms body contains `id="cycle"`. Prove the check can fail
(remove one id from one translation, run, see the named failure, restore) and
say so in the report.

## 6. Build
`npm run build` must pass (`check-help` included — the `pending` routes in
`help/routes-allowlist.json` stay as they are). Any build failure that is
not caused by this change: stop, report `blocked`. Read `dist/privacy.html`,
the German privacy page, `dist/terms.html` and two translations (e.g.
`dist/fr/privacy.html`, `dist/ja/privacy.html`): the new paragraphs render,
the ids exist, no page still says the app collects no location at all. Then
check that `dist/help/` now lists the 1.9.0 articles (e.g. the Daili Plus
article exists as a page).

## Facts behind the text (checked 2026-10-12 against both repos — re-check)
- Location only after the "Use my location" tap; low accuracy
  (`lib/features/weather/data/weather_location_service.dart`). After a fix,
  `weather_controller.dart` `_fetchAndShow` asks `placeName(lat, lon)` →
  `place_search_service.dart` `placemarkFromCoordinates` (phone geocoder,
  unrounded position) — this is now in the text.
- City search: the phone's own geocoder (`place_search_service.dart`).
- The app rounds to 2 decimals before sending (`roundCoordinate`); the
  server rounds again (`ShowWeatherRequest`).
- Server: `FallbackWeatherProvider` → `WeatherKitWeatherProvider` (rounded
  lat/lon + tz, signed token from our key, no user data; cache 15 min per
  place+tz) → else `MetNoWeatherProvider` (rounded lat/lon, cache ≤ 60 min).
  No coordinates in the Laravel log.
- Digest: `users` gets the switch + place columns (1 decimal + name, ≤ 120
  chars); off → nulls; in `ExportUserDataJob`; `DigestWeatherLine` asks the
  bound provider with the rounded place only.
- Budget: tables per `claude-prompts/BUDGET-PLAN.md` in the api repo
  (`budgets`, `budget_categories`, `budget_entries`, settlements); visibility
  `family|members|private`; `budgetsExport` in `ExportUserDataJob`; no money
  on widgets/watch/TRMNL/web board/digest (CLAUDE.md §3 "Budget").
- Cycle: `lib/features/cycle/` — `cycle_store.dart` (one file
  `vault/u<id>/cycle.json`, in the iOS/Android backup), no network imports
  (guard test), local reminders, `cycle_lock.dart` (local_auth), CSV export
  via the share sheet (`cycle_export.dart`), "Delete all cycle data",
  account deletion erases the vault.
If any of these is not what the code does, stop and report it.

## Commit & push
`docs(legal): 1.10.0 — weather (Apple Weather), daily-summary place, Budget, Cycle; help live at 1.9.0`;
body `Prompt: claude-prompts/2026-10-12/002-legal-1-10-0-weather-budget-cycle.md`.
Your files only. **Push now. Do NOT run `./deploy.sh`** — Ammar deploys right
after Planning Claude has checked the result (before review).

## Report
`claude-reports/2026-10-12/002-legal-1-10-0-weather-budget-cycle.md`, half a
page: files changed, ARB labels used for en/de (and any you corrected),
field-list corrections in Budget/Cycle, translations without an exact "No
location" sentence, guard + proof it fails, build result, the help 1.9.0
check, SHA + push, the untracked files that are not yours. `## Help impact`: none.
