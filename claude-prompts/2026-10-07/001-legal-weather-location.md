# Privacy: weather on the Today screen (approximate location, MET Norway)

## Why

App build 16 adds a weather card to the Today screen (app commit `af7e1065`,
api `bf78001`). It can use the phone's **approximate location** — the first
location use in Daili. The privacy policy says "No location" in two places, so
today it would be false. It must be true and **deployed before build 16 goes
into App Store review**.

The English and German texts below were written by Planning Claude against the
code (see "Facts behind the text"). **Use them word for word.** If a sentence is
not true for the code, stop and report it — do not quietly change it.

## Scope

- In: `legal/privacy.*.html` (28 bodies incl. `legal/datenschutz.de.html`),
  `tools/check-legal.mjs` (one new check).
- Out: terms (weather is free — nothing to add), everything else. 🔴 The
  working tree has untracked files that are NOT yours
  (`claude-reports/2026-10-01/`, `static/assets/img/blog/…`,
  `static/assets/img/photos/`). Do not touch, stage or commit them.

Date line in every changed privacy file: the day you run this, localised like
the file's existing date.

## 1. Privacy — English (`legal/privacy.en.html`)

a) Section 4, insert right **after** the `id="link-previews"` paragraph (before
`id="plus"`):

```html
<p id="weather"><strong>Weather (optional).</strong> The Today screen can show the weather. Only if you tap "Use my location" does the app ask your phone for your <strong>approximate</strong> location. If you choose a city instead, the name you type is looked up by your phone's own map service (Apple or Google) under their privacy terms. Before anything leaves your phone, the app rounds the place to about 1 km. Our server sends only this rounded place — without your name, your account or your IP address — to the Norwegian Meteorological Institute (MET Norway), which provides the forecast. We do not save your location with your account. Our server keeps the forecast for a rounded place for up to one hour, without any link to you, so the next request is faster. Like every request, the request address (which contains the rounded place) appears in our server's short-lived technical logs, which we keep only for security. Your chosen city and the last forecast are saved only on your phone. You can hide the weather at any time (Settings → Weather on Today) and take back the location permission in your phone's settings. Legal basis: performance of the contract with you (Art. 6(1)(b) GDPR).</p>
```

b) "What the app does *not* collect" paragraph: replace `No location.` with
`No precise location — only the approximate place you choose to share for the weather (see above).`

c) Section 6, the "Few people, little data" `<li>`: replace `no location,`
with `no precise location,`.

d) Section 7 "Where your data lives": append
` Weather forecasts come from MET Norway in Norway (EEA).`

## 2. Privacy — German (`legal/datenschutz.de.html`, authoritative, "du")

a) After the `id="link-previews"` paragraph:

```html
<p id="weather"><strong>Wetter (freiwillig).</strong> Der Heute-Bildschirm kann das Wetter zeigen. Nur wenn du auf „Meinen Standort nutzen“ tippst, fragt die App dein Handy nach deinem <strong>ungefähren</strong> Standort. Wählst du stattdessen eine Stadt, sucht der Kartendienst deines Handys (Apple oder Google) den eingegebenen Namen nach dessen eigenen Datenschutzbestimmungen. Bevor etwas dein Handy verlässt, rundet die App den Ort auf etwa 1 km. Unser Server schickt nur diesen gerundeten Ort — ohne deinen Namen, dein Konto oder deine IP-Adresse — an das Norwegische Meteorologische Institut (MET Norway), das die Vorhersage liefert. Wir speichern deinen Standort nicht bei deinem Konto. Unser Server behält die Vorhersage für einen gerundeten Ort bis zu einer Stunde, ohne Bezug zu dir, damit die nächste Anfrage schneller geht. Wie bei jeder Anfrage erscheint die Adresse der Anfrage (die den gerundeten Ort enthält) in den kurzlebigen technischen Logs unseres Servers, die wir nur zur Sicherheit aufbewahren. Deine gewählte Stadt und die letzte Vorhersage werden nur auf deinem Handy gespeichert. Du kannst das Wetter jederzeit ausblenden (Einstellungen → Wetter auf Heute) und die Standort-Freigabe in den Einstellungen deines Handys zurücknehmen. Rechtsgrundlage: Erfüllung des Vertrags mit dir (Art. 6 Abs. 1 lit. b DSGVO).</p>
```

b) "Was die App *nicht* sammelt": replace `Kein Standort.` with
`Kein genauer Standort — nur der ungefähre Ort, den du fürs Wetter freigibst (siehe oben).`

c) "Wenige Personen, wenige Daten": replace `kein Standort,` with
`kein genauer Standort,`.

d) "Wo deine Daten liegen": append
` Wettervorhersagen kommen von MET Norway in Norwegen (EWR).`

The quoted app labels ("Meinen Standort nutzen", "Wetter auf Heute") are the
app's German strings today (`familyplanner-app/lib/l10n/app_de.arb` keys
`weatherUseMyLocation`, `settingsWeatherOnToday`); check them again and use
the app's words if they differ.

## 3. The other 26 locales

Translate the same four changes into every other `legal/privacy.<loc>.html` —
from the ENGLISH text, natural native register, the same formal/informal
register each file already uses. The two quoted app labels as the app's ARB
for that language has them (`app_<loc>.arb` keys `weatherUseMyLocation` and
`settingsWeatherOnToday`; no ARB, e.g. ar/hi/ru → translate naturally).
"MET Norway", "Apple", "Google" untouched. Same id `weather` — ids are never
translated. Keep each file's `<p class="translated">` note. If a translation
has no exact "No location" sentence, change the sentence that says the app
collects no location, and list those files in the report.

## 4. Guard

Extend `node tools/check-legal.mjs`: every privacy body contains `id="weather"`
and the string `MET Norway`. Prove the check can fail (remove the id from one
translation, run, see the named failure, restore) and say so in the report.

## 5. Build

`npm run build` must pass. Any build failure that is not caused by this
change: stop, report `blocked`. Read `dist/privacy.html`, the German privacy
page and two translations (e.g. `dist/fr/privacy.html`, `dist/ja/privacy.html`):
the new paragraph renders, `#weather` exists, no page still says the app
collects no location at all.

## Facts behind the text (checked 2026-10-07 against both repos)

- Location asked only after the "Use my location" tap; low accuracy
  (`lib/features/weather/data/weather_location_service.dart`).
- City search: `geocoding` plugin → the phone's own geocoder (Apple CLGeocoder /
  Android Geocoder) (`place_search_service.dart`).
- The app rounds to 2 decimals before sending
  (`WeatherRepository.roundCoordinate`, `toStringAsFixed(2)`); the server
  rounds again (`ShowWeatherRequest`).
- The server calls `api.met.no` from its own IP with only the rounded lat/lon
  and a Daili User-Agent; no user data (`MetNoWeatherProvider`).
- No coordinates in any account/user table or the Laravel log. The forecast
  is cached per rounded place (the cache key holds the rounded lat/lon; the
  cache store may be the database's cache table — that is why the text says
  "not with your account", not "not in our database"), TTL = MET's `Expires`
  clamped to 10–60 min, no user id in the key. The request URL (with lat/lon) is in the web server's access log
  like every request.
- Place, city and last forecast: SharedPreferences `weather.*` on the device
  only. Hide: card menu or Settings → "Weather on Today".
  If any of these is not what the code does, stop and report it.

## Commit & push

`docs(legal): weather on Today — approximate location, MET Norway`;
body `Prompt: claude-prompts/2026-10-07/001-legal-weather-location.md`.
Your files only. **Push now. Do NOT run `./deploy.sh`** — Ammar deploys
before he submits build 16 (the site also holds undeployed 1.9.0 help pages
that wait for the 1.9.0 store day).

## Report

`claude-reports/2026-10-07/001-legal-weather-location.md`, half a page:
files changed, ARB words used for de, translations without an exact "No
location" sentence, guard + proof it fails, build result, SHA + push, the
untracked files that are not yours. `## Help impact`: none.
