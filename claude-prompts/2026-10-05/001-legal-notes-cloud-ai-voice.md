# Privacy + Terms: note pictures in Daili cloud (Hetzner), AI in Notes, voice, link previews

## Why

App build 15 (1.9.0) ships Notes with pictures, drawings and voice recordings,
an optional **Daili cloud** for those files (part of Daili Plus, stored at
**Hetzner Online GmbH, Germany**), two AI actions in Notes (make events / to-dos /
shopping items from a note; summarize a note's video, web page or text),
speech-to-text, and link previews fetched by our server. The privacy policy says
none of this yet, and the Terms' Plus section mentions only AI actions. Both must
be true and **deployed before the build goes into App Store review**.

The English and German texts below were written by Planning Claude against the
code (see "Facts behind the text"). **Use them word for word.** If a sentence is
not true for the code, stop and report it — do not quietly change it.

## Scope

- In: `legal/privacy.*.html` (28 bodies incl. `legal/datenschutz.de.html`),
  `legal/terms.*.html` (28 bodies incl. `legal/nutzungsbedingungen.de.html`),
  `tools/check-legal.mjs` (one new check), and `help/routes-allowlist.json`
  ONLY if the build needs it (see 6).
- Out: everything else. 🔴 The working tree has untracked files that are NOT
  yours (`claude-reports/2026-10-01/`, `static/assets/img/blog/…`,
  `static/assets/img/photos/`). Do not touch, stage or commit them.

Date line in every changed file: the day you run this, localised like the
file's existing date.

## 1. Privacy — English (`legal/privacy.en.html`)

a) Section 4, **replace the whole "AI features (optional)" paragraph** with:

```html
<p><strong>AI features (optional).</strong> Some features ask Google's Gemini AI for help, only when you start them: turning a YouTube video, a photo or a screenshot into a recipe, reading dates from a photographed letter, suggesting dinners for your week, and in Notes, making events, to-dos or shopping items from a note and writing a short summary of a note's video, web page or text. For these, the video link, the photo, the note's text or the picture you pick, the text of the linked web page, or — for suggestions — your recipe titles, your recent meals and the wish you typed are sent to Google (Google Ireland Ltd.) once and used only to answer. A photo you send only to be read (for example a letter or a cookbook page) is not stored on our servers; a summary you ask for is saved with the note. Google does not use this data to train its models. Each family has a monthly number of AI actions; we count them, nothing else.</p>
```

b) Insert right **after** that paragraph (before the `id="plus"` paragraph):

```html
<p id="notes-files"><strong>Pictures, drawings and recordings in notes.</strong> Files you add to a note stay on your phone unless you choose <strong>Daili cloud</strong> (Settings → Notes). Files kept on your phone never reach our server. If you choose Daili cloud (part of Daili Plus), we store the files in a private storage space at Hetzner Online GmbH in Germany, which processes them on our behalf. Only the people who can see the note can open its files. A file you delete is removed from the storage within 30 days, and deleted notes wait 30 days in Recently deleted before they and their files are removed. When your account is deleted, its files are deleted too. Daili reads the text in your pictures on your phone; that text reaches our server only if you add it to the note. Legal basis: performance of the contract with you (Art. 6(1)(b) GDPR).</p>
<p id="voice"><strong>Speaking a note.</strong> When you speak a note, your phone's own speech recognition (from Apple or Google) turns your words into text. Depending on your phone and language, Apple or Google may process the audio for this under their own privacy terms. Daili receives only the text you save, and a recording only if you choose to keep one.</p>
<p id="link-previews"><strong>Link previews.</strong> When a note contains a link, our server opens that page once to show its title and picture, and keeps this preview for up to 7 days. The website you link to sees a request from our server, not from you.</p>
```

c) Section "Service providers that run Daili for us" (the `<li>` naming Host
Europe GmbH): after "which hosts our server and database;" add
` Hetzner Online GmbH (Germany), which stores note files in Daili cloud;`

d) Section "Where your data lives": append
` Note files in Daili cloud are stored by Hetzner Online GmbH in Germany.`

## 2. Privacy — German (`legal/datenschutz.de.html`, authoritative, "Sie")

a) Replace the whole KI paragraph with:

```html
<p><strong>KI-Funktionen (optional).</strong> Einige Funktionen bitten die KI Gemini von Google um Hilfe, nur wenn Sie sie starten: aus einem YouTube-Video, einem Foto oder einem Screenshot ein Rezept machen, Termine aus einem fotografierten Brief lesen, Ideen fürs Abendessen der Woche vorschlagen und in Notizen aus einer Notiz Termine, Aufgaben oder Einkaufsartikel machen sowie eine kurze Zusammenfassung des Videos, der Webseite oder des Textes einer Notiz schreiben. Dafür werden der Video-Link, das Foto, der Text der Notiz oder das gewählte Bild, der Text der verlinkten Webseite oder — bei Vorschlägen — Ihre Rezepttitel, Ihre letzten Mahlzeiten und Ihr eingegebener Wunsch einmalig an Google (Google Ireland Ltd.) gesendet und nur für die Antwort verwendet. Ein Foto, das Sie nur zum Lesen senden (zum Beispiel ein Brief oder eine Kochbuchseite), wird nicht auf unseren Servern gespeichert; eine Zusammenfassung, die Sie anfordern, wird mit der Notiz gespeichert. Google verwendet diese Daten nicht zum Trainieren seiner Modelle. Jede Familie hat eine monatliche Zahl an KI-Aktionen; wir zählen sie, sonst nichts.</p>
```

If the file's existing KI paragraph uses a different heading word than
"KI-Funktionen", keep the existing heading word.

b) After it:

```html
<p id="notes-files"><strong>Bilder, Zeichnungen und Aufnahmen in Notizen.</strong> Dateien, die Sie einer Notiz hinzufügen, bleiben auf Ihrem Handy, außer Sie wählen <strong>Daili-Cloud</strong> (Einstellungen → Notizen). Dateien auf Ihrem Handy erreichen unseren Server nie. Wenn Sie die Daili-Cloud wählen (Teil von Daili Plus), speichern wir die Dateien in einem privaten Speicher bei der Hetzner Online GmbH in Deutschland, die sie in unserem Auftrag verarbeitet. Nur Personen, die die Notiz sehen können, können ihre Dateien öffnen. Eine Datei, die Sie löschen, wird innerhalb von 30 Tagen aus dem Speicher entfernt; gelöschte Notizen bleiben 30 Tage unter „Zuletzt gelöscht“, bevor sie samt ihren Dateien entfernt werden. Wenn Ihr Konto gelöscht wird, werden auch seine Dateien gelöscht. Daili liest den Text in Ihren Bildern auf Ihrem Handy; dieser Text erreicht unseren Server nur, wenn Sie ihn der Notiz hinzufügen. Rechtsgrundlage: Erfüllung des Vertrags mit Ihnen (Art. 6 Abs. 1 lit. b DSGVO).</p>
<p id="voice"><strong>Notizen sprechen.</strong> Wenn Sie eine Notiz sprechen, macht die Spracherkennung Ihres Handys (von Apple oder Google) aus Ihren Worten Text. Je nach Handy und Sprache können Apple oder Google dafür die Aufnahme nach ihren eigenen Datenschutzbestimmungen verarbeiten. Daili erhält nur den Text, den Sie speichern, und eine Aufnahme nur, wenn Sie sie behalten.</p>
<p id="link-previews"><strong>Link-Vorschauen.</strong> Wenn eine Notiz einen Link enthält, öffnet unser Server diese Seite einmal, um ihren Titel und ihr Bild zu zeigen, und behält diese Vorschau bis zu 7 Tage. Die verlinkte Website sieht eine Anfrage unseres Servers, nicht von Ihnen.</p>
```

Use the app's German labels: check `familyplanner-app/lib/l10n/app_de.arb` for
the words the app uses for "Daili cloud", "Recently deleted" and the Notes
settings path, and use exactly those (they may differ from the text above —
the app wins; say which you changed in the report).

c) Service providers + "Wo Ihre Daten liegen": the same two additions as 1c/1d
in German (`die Hetzner Online GmbH (Deutschland), die Notiz-Dateien in der
Daili-Cloud speichert;` and ` Notiz-Dateien in der Daili-Cloud speichert die
Hetzner Online GmbH in Deutschland.`).

## 3. Terms — Plus section (`id="plus"`, section 6)

EN (`legal/terms.en.html`), "What it is" paragraph: replace
`It gives the family a larger monthly number of AI actions — for example filling in events from a photo, turning a photo or a YouTube video into a recipe, and dinner ideas for your week.`
with
`It gives the family a larger monthly number of AI actions — for example filling in events from a photo, turning a photo or a YouTube video into a recipe, dinner ideas for your week, and making events, to-dos or shopping items from a note — and 5 GB of Daili cloud storage for the family's note pictures, drawings and recordings.`

Then append to the "Cancelling and refunds" paragraph:
` When Plus ends, nothing is deleted: files already in Daili cloud stay readable and can be downloaded, but new files can only be added to Daili cloud again while Plus is on.`

DE (`legal/nutzungsbedingungen.de.html`, "du"): replace
`Es gibt der Familie mehr KI-Aktionen pro Monat — zum Beispiel Termine aus einem Foto ausfüllen, aus einem Foto oder einem YouTube-Video ein Rezept machen und Ideen fürs Abendessen der Woche.`
with
`Es gibt der Familie mehr KI-Aktionen pro Monat — zum Beispiel Termine aus einem Foto ausfüllen, aus einem Foto oder einem YouTube-Video ein Rezept machen, Ideen fürs Abendessen der Woche und aus einer Notiz Termine, Aufgaben oder Einkaufsartikel machen — sowie 5 GB Daili-Cloud-Speicher für die Bilder, Zeichnungen und Aufnahmen in den Notizen der Familie.`
and append to "Kündigen und Erstattungen":
` Wenn Plus endet, wird nichts gelöscht: Dateien, die schon in der Daili-Cloud sind, bleiben lesbar und können heruntergeladen werden, aber neue Dateien kannst du erst wieder in die Daili-Cloud legen, wenn Plus aktiv ist.`

## 4. The other 26 locales

Translate the same changes into every other `legal/privacy.<loc>.html` and
`legal/terms.<loc>.html` — from the ENGLISH text, natural native register, the
same formal/informal register each file already uses. App words ("Daili cloud",
"Recently deleted", "Settings → Notes") as the app's ARB for that language has
them (`familyplanner-app/lib/l10n/app_<loc>.arb`; no ARB → translate naturally).
"Hetzner Online GmbH", "Google", "Apple", "Gemini" untouched. Same new ids
(`notes-files`, `voice`, `link-previews`) — ids are never translated. Keep each
file's `<p class="translated">` note.

## 5. Guard

Extend `node tools/check-legal.mjs`: every privacy body contains
`id="notes-files"`, `id="voice"`, `id="link-previews"` and the string `Hetzner`.
Prove the check can fail (remove one id from one translation, run, see the named
failure, restore) and say so in the report.

## 6. Build

`npm run build` must pass. If it fails ONLY in `check-help` because app routes
added since 1.8.0 have no help article yet (Notes screens), add exactly those
routes to `help/routes-allowlist.json` → `pending` (the documented holding
place; the help sync for 1.9.0 clears it) and list them in the report. Any other
build failure: stop, report `blocked`.

Read `dist/privacy.html`, the German privacy page, `dist/terms.html` and two
translations (e.g. `dist/fr/privacy.html`, `dist/ja/terms.html`): the new
paragraphs render, `#notes-files` exists.

## Facts behind the text (checked 2026-10-05 against the api repo)

- Bucket: Hetzner Object Storage, Falkenstein `fsn1` (Germany); private; files
  reached only through short-lived pre-signed links after a visibility check
  (`Note::scopeVisibleTo`).
- `php artisan` `PurgeAttachments`: deleted attachments removed after 30 days;
  notes trash 30 days; `AccountPurger` removes the account's attachments.
- Phone-only files never upload; OCR runs on the device (iOS Vision / ML Kit)
  and the text is sent only via "Add to note" (into the note body).
- `NoteAiController::extract` — a phone-only picture is uploaded for the call,
  read into memory, sent once, dropped; a cloud picture is read from storage.
  `summarize` — YouTube metadata/video via Gemini, web page text fetched by
  `LinkPreviewFetcher`, or the note text; the summary is saved on the note.
- Speech: `speech_to_text` with on-device recognition where the OS offers it,
  otherwise the phone's recognizer service (Apple/Google).
- Link previews: `LinkPreviewCache` keeps a ready card 7 days.
- Plus: `storage_gb` 5 for Plus and Founder rows; when Plus ends, uploads answer
  `403 PLUS_REQUIRED`, existing files stay readable (Notes phase-2 plan D7).
  If any of these is not what the code does, stop and report it.

## Commit & push

`docs(legal): note files in Daili cloud (Hetzner), AI in notes, voice, link previews`;
body `Prompt: claude-prompts/2026-10-05/001-legal-notes-cloud-ai-voice.md`.
Your files only. **Push now. Do NOT run `./deploy.sh`** — Ammar deploys right
after this run (the legal pages must be live before App Store review).

## Report

`claude-reports/2026-10-05/001-legal-notes-cloud-ai-voice.md`, half a page:
files changed, ARB words used for de, guard + proof it fails, any routes added
to `pending`, build result, SHA + push, the untracked files that are not yours.
`## Help impact`: none.
