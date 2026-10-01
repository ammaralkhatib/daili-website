# Terms + Privacy: Daili Plus (optional yearly subscription) and RevenueCat

## Why

Daili Plus is built and tested (sandbox, both stores, 2026-10-01). It ships
with app build 15. Before it can be sold, the legal pages must say:
- in the **Terms**: what Plus is, price/renewal, how to cancel, refunds, AI
  actions and fair use, changes, Founders;
- in the **Privacy Policy**: purchases run through Apple/Google, and
  **RevenueCat, Inc. (USA)** processes purchase data for us.

The English and German texts below were written by Planning Claude against the
code (see "Facts behind the text"). **Use them word for word.** If a sentence
is not true for the code or the site, stop and report it — do not quietly
change it.

## Scope

Touch only: `legal/terms.*.html` (28 bodies incl. `legal/nutzungsbedingungen.de.html`),
`legal/privacy.*.html` (28 bodies incl. `legal/datenschutz.de.html`), and
`tools/check-legal.mjs` only if a check needs it. Nothing else.

🔴 The working tree has uncommitted files that are NOT yours
(`claude-reports/2026-09-30/`, `static/assets/img/blog/…`, `static/assets/img/photos/`).
Do not touch, stage or commit them. Commit only your own files, and list them in
the report (`./deploy.sh` builds from the working tree).

Date line in every changed file: the day you run this, e.g.
`<time datetime="2026-10-01">1 October 2026</time>` (localised like the file's
existing date).

## 1. Terms — English (`legal/terms.en.html`)

a) Intro paragraph — replace the sentence
`Daili is currently <strong>free</strong>, and we have tried to keep these terms as plain as the app itself.`
with:
`Daili is <strong>free</strong> to use. An optional paid subscription, <strong>Daili Plus</strong>, adds extra AI helpers (section 6). We have tried to keep these terms as plain as the app itself.`

b) Insert a new section **after "5. Fair use"**, and renumber the old 6–11 → **7–12**:

```html
<h2 id="plus">6. Daili Plus (optional subscription)</h2>
<p><strong>What it is.</strong> Daili Plus is an optional subscription for a family. It gives the family a larger monthly number of AI actions — for example filling in events from a photo, turning a photo or a YouTube video into a recipe, and dinner ideas for your week. Everything else in Daili stays free. The app shows which features use AI actions and how many your family has each month (Settings → Daili Plus).</p>
<p><strong>Who gets it.</strong> You buy Daili Plus in the Daili app, through the Apple App Store or Google Play. Plus belongs to the family that is open in the app when you buy it, and every member of that family can use it. One subscription covers one family. If you leave that family, Plus stays with it until the paid period ends; when the subscription renews, it moves to your main family in Daili.</p>
<p><strong>Price and renewal.</strong> Daili Plus is billed once a year. The app shows the price in your currency before you buy; it includes VAT where VAT applies. The subscription renews automatically every year until you cancel it. Apple or Google take the payment under their own terms. We never see your payment details.</p>
<p><strong>Cancelling and refunds.</strong> You can cancel at any time in the subscription settings of the App Store or Google Play. Cancel at least 24 hours before the renewal date to avoid the next charge. After you cancel, Plus stays on until the end of the period you already paid for. Deleting the Daili app or your Daili account does <strong>not</strong> cancel the subscription — please cancel it in the store. Refunds, and your rights as a consumer such as a right of withdrawal, are handled by Apple or Google under their terms.</p>
<p><strong>AI actions and fair use.</strong> AI actions are counted per family and per calendar month, and start again on the 1st of each month (UTC). Unused actions do not carry over to the next month. The AI features use an outside AI service, as described in the <a href="/privacy.html">Privacy Policy</a>. AI answers can be wrong — please check them, for example dates read from a letter, before you rely on them.</p>
<p><strong>Changes to Daili Plus.</strong> We may change the price for future subscription periods. Apple or Google will tell you before a new price applies and, where the law requires it, ask for your consent; you can cancel before then. We may also add, change or replace AI features, or change the monthly number of AI actions, for good reasons such as changes in the AI service or its costs. If a change affects you more than slightly during a period you have paid for, we will tell you in good time, and you can end the subscription free of charge within 30 days of the change; you then get back the part of the price for the paid time that is left.</p>
<p><strong>Founders.</strong> Families created in Daili before our Founder program closed on 1 October 2026 have Daili Plus free of charge, with a fair-use limit shown in the app. This is our thank-you to our first families; they do not need a subscription.</p>
```

c) Old section 6 "Availability" (now **7**): replace
`We run Daili with care, but it is a free service and we cannot promise it will always be available or error-free.`
with
`We run Daili with care, but we cannot promise it will always be available or error-free.`

d) Old section 7 "Liability" (now **8**): replace the first sentence
`Daili is provided free of charge.` with
`The free features of Daili are provided free of charge. For Daili Plus, the statutory warranty rights for digital services apply.`
(rest of the paragraph unchanged).

e) Old section 8 "Ending things" (now **9**): append to the paragraph:
` If you have Daili Plus, please cancel it in the App Store or Google Play first — deleting your account does not cancel it.`

f) No other text changes. Grep the repo (`legal/`, `help/`, `blog/`, `templates/`, `content/`)
for links or text that point at a terms section by number (e.g. "section 9") and fix
them to the new numbers.

## 2. Terms — German (`legal/nutzungsbedingungen.de.html`, authoritative, "du")

a) Intro: replace `Daili ist derzeit <strong>kostenlos</strong>, und wir haben versucht, diese Bedingungen so einfach zu halten wie die App selbst.`
with:
`Daili ist <strong>kostenlos</strong> nutzbar. Ein optionales kostenpflichtiges Abo, <strong>Daili Plus</strong>, bringt zusätzliche KI-Helfer (Abschnitt 6). Wir haben versucht, diese Bedingungen so einfach zu halten wie die App selbst.`

b) New section after "5. Faire Nutzung", renumber 6–11 → 7–12:

```html
<h2 id="plus">6. Daili Plus (optionales Abo)</h2>
<p><strong>Was es ist.</strong> Daili Plus ist ein optionales Abo für eine Familie. Es gibt der Familie mehr KI-Aktionen pro Monat — zum Beispiel Termine aus einem Foto ausfüllen, aus einem Foto oder einem YouTube-Video ein Rezept machen und Ideen fürs Abendessen der Woche. Alles andere in Daili bleibt kostenlos. Die App zeigt, welche Funktionen KI-Aktionen verwenden und wie viele deine Familie pro Monat hat (Einstellungen → Daili Plus).</p>
<p><strong>Wer es bekommt.</strong> Du kaufst Daili Plus in der Daili-App, über den Apple App Store oder Google Play. Plus gehört zu der Familie, die beim Kauf in der App geöffnet ist, und alle Mitglieder dieser Familie können es nutzen. Ein Abo gilt für eine Familie. Wenn du diese Familie verlässt, bleibt Plus dort, bis der bezahlte Zeitraum endet; bei der nächsten Verlängerung wechselt es zu deiner Hauptfamilie in Daili.</p>
<p><strong>Preis und Verlängerung.</strong> Daili Plus wird einmal pro Jahr abgerechnet. Die App zeigt dir den Preis in deiner Währung vor dem Kauf; er enthält die Umsatzsteuer, wo sie anfällt. Das Abo verlängert sich automatisch jedes Jahr, bis du es kündigst. Apple oder Google ziehen die Zahlung nach ihren eigenen Bedingungen ein. Deine Zahlungsdaten sehen wir nie.</p>
<p><strong>Kündigen und Erstattungen.</strong> Du kannst jederzeit in den Abo-Einstellungen des App Store oder von Google Play kündigen. Kündige spätestens 24 Stunden vor dem Verlängerungsdatum, damit nicht erneut abgebucht wird. Nach der Kündigung bleibt Plus bis zum Ende des bereits bezahlten Zeitraums aktiv. Das Löschen der Daili-App oder deines Daili-Kontos kündigt das Abo <strong>nicht</strong> — bitte kündige es im Store. Erstattungen und deine Rechte als Verbraucher, etwa ein Rücktrittsrecht, wickeln Apple oder Google nach ihren Bedingungen ab.</p>
<p><strong>KI-Aktionen und faire Nutzung.</strong> KI-Aktionen werden pro Familie und Kalendermonat gezählt und beginnen am 1. jedes Monats (UTC) neu. Nicht genutzte Aktionen verfallen am Monatsende. Die KI-Funktionen nutzen einen externen KI-Dienst, wie in der <a href="/datenschutz.html">Datenschutzerklärung</a> beschrieben. KI-Antworten können falsch sein — bitte prüfe sie, zum Beispiel Termine aus einem Brief, bevor du dich darauf verlässt.</p>
<p><strong>Änderungen an Daili Plus.</strong> Wir können den Preis für künftige Abo-Zeiträume ändern. Apple oder Google informieren dich, bevor ein neuer Preis gilt, und holen, wo das Gesetz es verlangt, deine Zustimmung ein; du kannst vorher kündigen. Wir können außerdem KI-Funktionen hinzufügen, ändern oder ersetzen oder die Zahl der KI-Aktionen pro Monat ändern, wenn es dafür gute Gründe gibt, etwa Änderungen beim KI-Dienst oder bei dessen Kosten. Beeinträchtigt dich eine Änderung während eines bezahlten Zeitraums mehr als nur geringfügig, informieren wir dich rechtzeitig, und du kannst das Abo innerhalb von 30 Tagen nach der Änderung kostenlos beenden; du bekommst dann den Teil des Preises für die restliche bezahlte Zeit zurück.</p>
<p><strong>Gründer.</strong> Familien, die in Daili angelegt wurden, bevor unser Gründer-Programm am 1. Oktober 2026 endete, haben Daili Plus kostenlos, mit einer fairen Nutzungsgrenze, die die App anzeigt. Das ist unser Dankeschön an unsere ersten Familien; sie brauchen kein Abo.</p>
```

c) Old 6 "Verfügbarkeit": replace `aber es ist ein kostenloser Dienst und wir können nicht versprechen` with `aber wir können nicht versprechen`.

d) Old 7 "Haftung": replace `Daili ist kostenlos.` with
`Die kostenlosen Funktionen von Daili stellen wir unentgeltlich bereit. Für Daili Plus gelten die gesetzlichen Gewährleistungsrechte für digitale Leistungen.`

e) Old 8 "Beenden": append
` Wenn du Daili Plus hast, kündige es bitte zuerst im App Store oder bei Google Play — das Löschen deines Kontos kündigt es nicht.`

The app calls Founders "Founder" in English; check the German ARB (`familyplanner-app/lib/l10n/app_de.arb`, keys with "founder") and use the SAME German word the app uses for "Founder" if it differs from "Gründer".

## 3. Privacy — English (`legal/privacy.en.html`)

a) Section 4 — insert this paragraph **right after** the **AI features (optional)** paragraph:

```html
<p id="plus"><strong>Daili Plus purchases (optional).</strong> If you buy Daili Plus, the purchase runs through the Apple App Store or Google Play. Apple or Google take the payment; we never see your payment details. To check the purchase we use RevenueCat (RevenueCat, Inc., USA), which processes this data on our behalf. The app sends RevenueCat a technical user ID (for example <code>user_123</code>), the ID of the family the purchase is for, the store's purchase receipt, and technical data such as the app version, the platform and the store country (and, as with any internet connection, your IP address). The app does this only after you sign in. RevenueCat tells our server which product was bought, in which store, when the paid period ends, whether it will renew, and whether there is a payment problem. We store this with your account and the family that has Plus, and use it only to give that family Daili Plus — never for advertising or tracking. Legal basis: performance of the contract with you (Art. 6(1)(b) GDPR).</p>
```

b) Section "Where your data lives" (now 7) — append:
` RevenueCat processes purchase data on servers in the USA under the EU standard contractual clauses.`

c) Section "How long we keep data" (now 8) — append:
` When your account is deleted, we also delete our record of your Daili Plus subscription and ask RevenueCat to delete its record of you. Apple and Google keep their own records of your purchases under their privacy policies.`

d) Section 5 "Google user data" — no change (Google data never goes to RevenueCat).

## 4. Privacy — German (`legal/datenschutz.de.html`, authoritative, "Sie")

a) After the KI paragraph in section 4:

```html
<p id="plus"><strong>Käufe von Daili Plus (optional).</strong> Wenn Sie Daili Plus kaufen, läuft der Kauf über den Apple App Store oder Google Play. Apple oder Google wickeln die Zahlung ab; Ihre Zahlungsdaten sehen wir nie. Um den Kauf zu prüfen, nutzen wir RevenueCat (RevenueCat, Inc., USA), das diese Daten in unserem Auftrag verarbeitet. Die App übermittelt RevenueCat eine technische Nutzer-ID (zum Beispiel <code>user_123</code>), die ID der Familie, für die der Kauf gilt, den Kaufbeleg des Stores sowie technische Daten wie App-Version, Plattform und Store-Land (und, wie bei jeder Internetverbindung, Ihre IP-Adresse). Die App tut das erst, nachdem Sie sich angemeldet haben. RevenueCat teilt unserem Server mit, welches Produkt in welchem Store gekauft wurde, wann der bezahlte Zeitraum endet, ob er sich verlängert und ob es ein Zahlungsproblem gibt. Wir speichern diese Angaben zu Ihrem Konto und zu der Familie, die Plus hat, und verwenden sie nur, um dieser Familie Daili Plus bereitzustellen — nie für Werbung oder Tracking. Rechtsgrundlage: Erfüllung des Vertrags mit Ihnen (Art. 6 Abs. 1 lit. b DSGVO).</p>
```

b) "Wo Ihre Daten liegen" (or the file's equivalent heading) — append:
` RevenueCat verarbeitet Kaufdaten auf Servern in den USA auf Grundlage der EU-Standardvertragsklauseln.`

c) Retention section — append:
` Wenn Ihr Konto gelöscht wird, löschen wir auch unseren Eintrag zu Ihrem Daili-Plus-Abo und beauftragen RevenueCat, seinen Eintrag zu Ihnen zu löschen. Apple und Google bewahren eigene Aufzeichnungen über Ihre Käufe nach ihren Datenschutzbestimmungen auf.`

## 5. The other 26 locales

Translate the same additions and edits into every other `legal/terms.<loc>.html`
and `legal/privacy.<loc>.html` — from the ENGLISH text, natural native register,
the same register (formal/informal) each file already uses. House rules of the
earlier legal rounds apply: "Daili", "Daili Plus", "Founder"-word as the app's
ARB for that language uses it (check `familyplanner-app/lib/l10n/app_<loc>.arb`;
if the app has no such language, translate naturally), "App Store", "Google
Play", "RevenueCat, Inc.", "GDPR" article numbers as the file already writes
them, `user_123` untouched. Same new `id="plus"` on the new `<h2>` (terms) and
`<p>` (privacy) — ids are never translated. Same renumbering. Keep each file's
existing `<p class="translated">` note.

## 6. Guard + build

- Run `node tools/check-legal.mjs`. If it compares section counts across
  locales it must pass with the new section. Add one check: every terms body
  contains `id="plus"`; every privacy body contains `id="plus"` and the string
  `RevenueCat`. Prove the new check can fail (remove the id from one
  translation, run, see the named failure, restore) and say so in the report.
- `npm run build` must pass. Read `dist/terms.html`, `dist/nutzungsbedingungen.html`
  (or however German is emitted), `dist/privacy.html`, and two translations
  (e.g. `dist/fr/terms.html`, `dist/ja/privacy.html`): the new text renders,
  numbering of terms runs 1–12 without gaps, `#plus` exists.

Commit (your files only), push. **Do not run `./deploy.sh`** — Ammar runs it.

## Facts behind the text (checked 2026-10-01)

- `claude-prompts/PLUS-PLAN.md` (api repo) §1: €9.99/yr per family, no trial,
  Plus 30 AI actions/month/family, free 3, Founder 50; Plus belongs to the
  family active at purchase; buyer leaves → stays until period end, moves to
  the default family at renewal (`PlusSyncer::familyForExistingRow`).
- Counter resets at the start of the next UTC month (`resets_at`).
- AI features = Gemini (privacy §4 "AI features").
- App: `Purchases.logIn('user_<id>')` after sign-in, attribute
  `daili_family_id` before purchase (`purchases_service.dart`); server reads
  `GET /v1/subscribers/{id}`; stored: product, store, expires_at, will_renew,
  billing_issue, family (`plus_subscriptions`).
- RevenueCat DPA: RevenueCat, Inc., transfers under SCCs (revenuecat.com/dpa).
- Account purge deletes our row and (api prompt 2026-10-01/002) the
  RevenueCat subscriber.
- Founder cutoff: 2026-10-01 04:43:42 UTC.
- Apple/Google are the sellers; refunds and withdrawal go through them.

## Report

`claude-reports/2026-10-01/001-legal-daili-plus.md`, half a page: files
changed, guard check + proof it fails, build result, any section-number links
fixed, the uncommitted files that are not yours. `## Help impact`: none.
