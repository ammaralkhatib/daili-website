# Privacy: the paragraph "Tips & suggestions" — a yes first, adults only, no hold-out group, legal basis consent

Standard lane, website only. Feature "Tips opt-in" (Daili list items #398 done, #409 this text). Plan:
`/Users/ammarkhatib/Herd/familyplanner-api/claude-prompts/TIPS-OPT-IN-PLAN.md`, section "Privacy text — draft".
Ammar 2026-11-26: "yes" to that draft (en + de) — the two texts below are his approved wording.

Why: since api `8764721b` (live on the server 2026-11-26) Daili's tip pushes are opt-in. The privacy page still
says the old thing in its paragraph `<p id="tips">`: tips "may" come without a yes, "about one account in ten …
gets no tips" (that hold-out group is off now), and "Legal basis: our legitimate interest … the switch is your
objection". All three are wrong now. Tips are switched off on the server until the app 1.18.0 is in both stores;
this text must be live before they go on again.

Every sub-agent you start MUST use model claude-opus-5-5. Write the report with the file-write tool.

## What is true now (for the text — checked against the code 2026-11-26)

- A tip push goes out only when ALL hold: the switch "Tips & suggestions" is on, a yes is stored, the person is an
  adult (confirmed 18+ once, or an admin = parent of the family). api `app/Services/Nudges/TipsConsent.php`.
- The yes comes from a one-time question in the phone app (from 1.18.0: "Get short tips about Daili?" — Yes /
  No thanks), or from turning the switch on by hand (app, web app). The question and the app's switch are shown to
  adults only.
- Stored as proof: the time of the yes, the version of the question text, the source (question or switch). Also:
  when the person was asked, and when they closed the question without an answer (so the app asks only once).
  All of it is in the data export. api migration `2026_11_26_180000_make_tips_opt_in.php`.
- No hold-out group any more (`config/nudges.php` `holdout_enabled` default `false`; prod says "Hold-out: off").
- Turn off: the switch (app: Settings → Notifications → Tips & suggestions; web app: Profile & settings); on an
  iPhone the button "Turn off tips" on a tip; on Android the phone's own notification category "Tips & suggestions"
  (that one stops tips on that phone only).
- Unchanged, keep as it is: how often (one a day, two a week, not on a day Daili was used, early evening, never in
  quiet hours, welcome tips / reminder tips, same tip not more than every six months), which facts choose the tip,
  and that the server stores which tip was sent when and whether it was opened.

## Scope

- In: the ONE paragraph `<p id="tips">` in every `legal/privacy.<lang>.html` (27 files) and in
  `legal/datenschutz.de.html`; each page's "last updated" date; `tools/check-legal.mjs` only if it must change.
- Out: every other paragraph (also "Push notifications" and "Newsletter"), the terms pages, the help articles
  (they ride the release help sync, list #47), the blog, `LIVE_APP_VERSION`, `./deploy.sh`.
- Another prompt of today, `003-contacts-help-privacy.md`, also edits the privacy files (another paragraph). It may
  or may not have run before you. Work on the files as they are on disk; do not undo its change.

## Requirements

1. **English — replace the whole paragraph with exactly this** (keep `<p id="tips">`, the `<strong>` title and the
   file's own HTML escapes such as `&amp;`):

   > **Tips & suggestions (optional, adults only).** Only if you say yes — in a one-time question in the app, or by
   > switching on "Tips & suggestions" yourself — does Daili send you, now and then, one short notification about a
   > Daili feature your family has not tried yet, for example how to invite your partner. Without your yes we send
   > no tips. The question and the switch are shown to adults only (you confirmed that you are 18 or older, or you
   > are a parent who manages the family). You get at most one tip a day and two a week, only on a day you have not
   > used Daili, in the early evening and never during your quiet hours: a few welcome tips in your first weeks, and
   > after a longer pause at most one reminder tip now and then (the same tip not more than every six months). To
   > choose the tip, our server uses only facts it already holds, such as how long you have used Daili, when you
   > last used it, which features your family uses, whether an invite is still waiting, whether a phone of yours
   > still receives notifications, your role in the family and its size, your daily-summary setting and which tips
   > you already got. It then stores which tip was sent to you when, and whether you opened it. As proof of your
   > consent we store when you said yes, which version of the question text you saw and whether you said yes in the
   > question or with the switch; we also store when you were asked or closed the question, so the app asks only
   > once. You can take your yes back at any time: switch tips off under Settings → Notifications → Tips &
   > suggestions in the app or under Profile & settings in the web app; on an iPhone also with the button "Turn off
   > tips" on a tip. On Android you can also turn off the notification category "Tips & suggestions" in the phone's
   > settings; that stops tips on that phone. After that we send no more tips. The switch, the consent details and
   > the tip history are part of your data export. Legal basis: your consent (Art. 6(1)(a) GDPR, § 174 TKG 2021).

2. **German (`datenschutz.de.html`) — exactly this:**

   > **Tipps & Vorschläge (freiwillig, nur für Erwachsene).** Nur wenn du Ja sagst — in einer einmaligen Frage in
   > der App oder indem du „Tipps & Vorschläge“ selbst einschaltest — schickt dir Daili ab und zu eine kurze
   > Benachrichtigung zu einer Daili-Funktion, die deine Familie noch nicht ausprobiert hat, zum Beispiel, wie du
   > deinen Partner einlädst. Ohne dein Ja schicken wir keine Tipps. Die Frage und der Schalter werden nur
   > Erwachsenen gezeigt (du hast bestätigt, dass du 18 oder älter bist, oder du verwaltest als Elternteil die
   > Familie). Du bekommst höchstens einen Tipp am Tag und zwei pro Woche, nur an einem Tag, an dem du Daili nicht
   > benutzt hast, am frühen Abend und nie in deinen Ruhezeiten: ein paar Willkommens-Tipps in deinen ersten Wochen
   > und nach einer längeren Pause höchstens ab und zu einen Erinnerungs-Tipp (derselbe Tipp nicht öfter als alle
   > sechs Monate). Um den Tipp auszuwählen, nutzt unser Server nur Fakten, die er ohnehin hat, etwa wie lange du
   > Daili schon nutzt, wann du es zuletzt genutzt hast, welche Funktionen deine Familie nutzt, ob noch eine
   > Einladung offen ist, ob eines deiner Handys noch Benachrichtigungen empfängt, deine Rolle in der Familie und
   > ihre Größe, deine Einstellung zur Tageszusammenfassung und welche Tipps du schon bekommen hast. Er speichert
   > dann, welcher Tipp dir wann geschickt wurde und ob du ihn geöffnet hast. Als Nachweis deiner Einwilligung
   > speichern wir, wann du Ja gesagt hast, welche Fassung des Fragetexts du gesehen hast und ob du in der Frage
   > oder mit dem Schalter Ja gesagt hast; außerdem speichern wir, wann du gefragt wurdest oder die Frage
   > geschlossen hast, damit die App nur einmal fragt. Du kannst dein Ja jederzeit zurücknehmen: Schalte die Tipps
   > aus — in der App unter Einstellungen → Benachrichtigungen → Tipps & Vorschläge, in der Web-App unter Profil &
   > Einstellungen; auf dem iPhone auch mit der Schaltfläche „Tipps ausschalten“ direkt an einem Tipp. Auf Android
   > kannst du außerdem die Benachrichtigungs-Kategorie „Tipps & Vorschläge“ in den Einstellungen des Handys
   > ausschalten; dann kommen auf diesem Handy keine Tipps mehr. Danach schicken wir keine Tipps mehr. Der Schalter,
   > die Angaben zur Einwilligung und die Tipp-Historie sind Teil deines Datenexports. Rechtsgrundlage: deine
   > Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 174 TKG 2021).

3. **The other 26 languages:** the same paragraph, sentence for sentence, in each file's own words. Keep every
   sentence of the old paragraph that is unchanged in English as that file already has it (do not re-translate it).
   App words must be the REAL ones: the switch name = `settingsNotifyTips`, the iPhone button = `tipTurnOffAction`,
   Settings / Notifications = `settingsTitle` / `settingsSectionNotifications` in
   `../familyplanner-app/lib/l10n/app_<arb>.arb` (zh-Hans → `app_zh.arb`, zh-Hant → `app_zh_Hant.arb`). The app has
   no `ar`, `hi`, `ru`: there use the words that file's old paragraph already uses for the switch, and translate
   the button name plainly. Write "GDPR" and the article the way that file already cites a consent basis (see its
   "Newsletter" or "Help improve Daili" paragraph); "§ 174 TKG 2021" stays as it is in every language.

4. **Gone in every file:** the hold-out sentence ("about one account in ten …"), "legitimate interest" as the basis
   of tips, and "the switch is your objection". No file may keep a translated rest of them inside `id="tips"`.

5. **"Last updated" date** of each page → the day you run, the way the files already do it.

## Constraints

- Do not change the anchor `id="tips"` (links point to it). Do not move the paragraph.
- No new promise: do not write a number of tips, a time or a rule that the English text above does not have.
- Do NOT run `./deploy.sh` (Ammar deploys).
- 🔴 Report trap: never put the word "status" and the word "blocked" on one line unless you really are blocked (the
  run script stops on it).

## Verify

- `node tools/check-legal.mjs` and `npm run build` green (FOREGROUND).
- `grep -c 'id="tips"' legal/privacy.*.html legal/datenschutz.de.html` → 1 in each of the 28 files.
- `grep -il "one account in ten\|legitimate interest in helping families get started\|jedes zehnte Konto" legal/`
  → nothing. For the other languages: read the paragraph in 5 of them (one of ar / hi / ru, one of zh, three
  others) against the English, sentence by sentence, and say which in the report.

## Commit & push

- `docs(legal): privacy — tips need a yes first, adults only, no hold-out group, legal basis consent (#409)`; body
  names `Prompt: claude-prompts/2026-11-26/004-privacy-tips-opt-in.md`.
- **Push now.** Do NOT deploy.

## Report

- `claude-reports/2026-11-26/004-privacy-tips-opt-in.md` (file-write tool, `wc -c` > 0). Say: the 28 files changed;
  the en + de paragraphs as they stand now; which 5 languages you read against the English; every place where a
  language could not follow the English sentence for sentence, and why; facts you could not confirm.
- `## Help impact`: `none` (the help line rides list #47).
- `## Open items for the owner`: deploy the website
  (`cd ~/development/flutter_projects/familyplanner/daili-website && ./deploy.sh`) — it may go live right away (the
  text is already true: tips are off and need a yes), and it MUST be live before tips are turned on again (#408).
