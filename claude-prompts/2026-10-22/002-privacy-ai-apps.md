# Privacy policy: AI apps you connect (MCP connector)

## Why
Since 2026-10-22 a user can connect an AI app (Claude, ChatGPT …) to Daili
through `https://api.daili.app/mcp`. The privacy policy does not say this yet.
Facts (API repo `~/Herd/familyplanner-api`, read them before writing):
- Sign-in window on api.daili.app (`resources/views/mcp/login.blade.php`,
  `McpLoginController`): Laravel web session cookie only for the sign-in;
  loads Firebase sign-in code from `www.gstatic.com` for Google/Apple.
- One family or group per connection, chosen on the consent page.
- Tools (`app/Mcp/Tools/*`): read events, lists + items, meals, notes,
  birthdays, member names + roles; add events, to-dos, shopping items,
  meals, notes; tick items. No edit, no delete.
- Never: Budget, Vault, Cycle (`McpNoPrivateAreasTest`), others' private
  items, and — since api `2026-10-22/003` — events synced from Google or
  Outlook (ICS subscriptions only).
- Stored: `oauth_clients` (the name the AI app gives itself), access tokens
  with `family_id`, `created_at`, `last_used_at`; in the data export
  (`ai_connections`); revoked at leave/remove/family delete/account delete
  start; rows deleted at the account hard delete (`AccountPurger`).

🔴 **Preconditions (re-run 2026-10-22 after the first run blocked):** the
daili-web repo must have the `feat(profile): Connected AI apps card` commit
(prompt `daili-web/claude-prompts/2026-10-22/001`) — check `git log` in
`../daili-web`; if missing, stop and report `blocked`. Overwrite the earlier
blocked report. Also: this text says Google/Outlook events never reach an AI
app. Check `git log` in the API repo shows the `fix(mcp): never pass Google-
or Outlook-synced events` commit (prompt 2026-10-22/003). If it is missing,
stop and report `blocked`.

The English and German texts below were written by Planning Claude against
the code. **Use them word for word.** If a sentence is not true for the
code, stop and report it — do not quietly change it. One exception: if you
find a scheduled purge of Passport tokens, correct "we keep it until you
delete your account" to the real rule and say so.

## Scope
- In: `legal/privacy.*.html` (all bodies incl. `legal/datenschutz.de.html`),
  `tools/check-legal.mjs`, this prompt file.
- Out: terms, help, home page, blog. 🔴 Untracked files that are NOT yours
  (`claude-prompts/2026-10-21/`, `claude-prompts/MARKETING-WEEKLY.md`,
  `static/assets/img/photos/`): do not touch, stage or commit them.

Date line in every changed file: today, localised like the file's existing
date.

## 1. English (`legal/privacy.en.html`)

a) Section 4: insert right **after** the "Wall display (optional)" paragraph:

```html
<p id="ai-apps"><strong>AI apps you connect (optional).</strong> You can connect an AI app, such as Claude or ChatGPT, to your Daili account. You sign in to Daili in a window on api.daili.app and pick one family or group. After that, whenever you ask the AI app, it can read what you can see in that family or group — events, lists and their items, meals, notes, birthdays and the names and roles of its members — and add events, to-dos, shopping items, meals and notes, or tick items off. It cannot change or delete anything. What it reads is sent to the company that runs the AI app and is handled under your own account with that company and its privacy terms; we do not choose that company and have no say over it. Budget, Cycle, the photos &amp; documents vault, other members' private items and events from connected Google or Outlook calendars never reach an AI app. We store which AI app is connected (the name it gives itself), to which family or group, when you connected it and when it was last used; this is part of your data export, and we keep it until you delete your account. The sign-in window sets one short-lived session cookie, needed only for signing in, and loads Google's Firebase sign-in code for the Google and Apple buttons. You can disconnect an AI app at any time in the app under Settings → Connected AI apps, or in the web app under Profile &amp; settings; leaving the family or group or deleting your account disconnects it too. Legal basis: providing the service you asked for (Art. 6(1)(b) GDPR).</p>
```

b) Section 5 (Google user data): right **after** the "With whom we share,
transfer or disclose Google user data" list (`</ul>`), insert:

```html
<p id="google-ai-apps">AI apps you connect to Daili (see "AI apps you connect" in section 4) never receive data from your connected Google calendars.</p>
```

c) Section 7 "Where your data lives": append at the end of its paragraph
` If you connect an AI app, what it reads is processed wherever the company behind that app processes data, under your agreement with that company.`

## 2. German (`legal/datenschutz.de.html`, authoritative, "du")

a) Abschnitt 4, direkt **nach** dem Absatz „Wand-Display (optional)“:

```html
<p id="ai-apps"><strong>KI-Apps, die du verbindest (freiwillig).</strong> Du kannst eine KI-App wie Claude oder ChatGPT mit deinem Daili-Konto verbinden. Dazu meldest du dich in einem Fenster auf api.daili.app bei Daili an und wählst eine Familie oder Gruppe. Danach kann die KI-App, immer wenn du sie darum bittest, lesen, was du in dieser Familie oder Gruppe siehst – Termine, Listen und ihre Einträge, Mahlzeiten, Notizen, Geburtstage sowie Namen und Rollen der Mitglieder – und Termine, To-dos, Einkaufsartikel, Mahlzeiten und Notizen hinzufügen oder Einträge abhaken. Ändern oder löschen kann sie nichts. Was sie liest, wird an das Unternehmen gesendet, das die KI-App betreibt, und dort unter deinem eigenen Konto bei diesem Unternehmen und nach dessen Datenschutzbestimmungen verarbeitet; wir wählen dieses Unternehmen nicht aus und haben keinen Einfluss darauf. Budget, Zyklus, der Foto- &amp; Dokumenten-Tresor, private Einträge anderer Mitglieder und Termine aus verbundenen Google- oder Outlook-Kalendern erreichen eine KI-App nie. Wir speichern, welche KI-App verbunden ist (den Namen, den sie selbst angibt), mit welcher Familie oder Gruppe, wann du sie verbunden hast und wann sie zuletzt genutzt wurde; das ist Teil deines Datenexports, und wir behalten es, bis du dein Konto löschst. Das Anmeldefenster setzt ein kurzlebiges Sitzungs-Cookie, das nur für die Anmeldung nötig ist, und lädt Googles Firebase-Anmeldecode für die Google- und Apple-Buttons. Du kannst eine KI-App jederzeit trennen: in der App unter Einstellungen → Verbundene KI-Apps oder in der Web-App unter Profil &amp; Einstellungen. Verlässt du die Familie oder Gruppe oder löschst du dein Konto, wird sie ebenfalls getrennt. Rechtsgrundlage: die Bereitstellung des Dienstes, den du angefordert hast (Art. 6 Abs. 1 lit. b DSGVO).</p>
```

b) Abschnitt 5, direkt nach der Liste „Mit wem wir Google-Nutzerdaten …“:

```html
<p id="google-ai-apps">KI-Apps, die du mit Daili verbindest (siehe „KI-Apps, die du verbindest“ in Abschnitt 4), erhalten nie Daten aus deinen verbundenen Google-Kalendern.</p>
```

c) „Wo deine Daten liegen“: am Ende des Absatzes anhängen
` Verbindest du eine KI-App, wird, was sie liest, dort verarbeitet, wo das Unternehmen hinter dieser App Daten verarbeitet – nach deiner Vereinbarung mit diesem Unternehmen.`

App labels: check "Connected AI apps" / "Verbundene KI-Apps" and "Settings"
against `../familyplanner-app/lib/l10n/app_en.arb` / `app_de.arb` (`aiAppsTitle`)
and the web's Profile label in `../daili-web/src/i18n/en.ts` / `de.ts`. Use
the exact words where they differ and say so in the report. If the German
file has no `legal/privacy.de.html` twin, only `datenschutz.de.html` changes.

## 3. The other locales
Translate 1a–1c into every other `legal/privacy.<loc>.html` — from the
ENGLISH text, natural native register, the same formal/informal register the
file already uses. App labels as that language's ARB has them (no ARB, e.g.
ar/hi/ru → translate naturally). "Claude", "ChatGPT", "Daili", "api.daili.app",
"Firebase", "Google", "Outlook", "GDPR" article numbers untouched. Same ids
(`ai-apps`, `google-ai-apps`). Keep each file's `<p class="translated">` note.

## 4. Guard
Extend `node tools/check-legal.mjs`: every privacy body contains the ids
`ai-apps` and `google-ai-apps`. Prove the check can fail (remove one id from
one translation, run, see the named failure, restore) and say so in the
report.

## Verify
`npm run build` green, `node tools/check-legal.mjs` green. Spot-check
`dist/privacy/` (en), the German page and one CJK page.

## Commit & push
`docs(legal): privacy — AI apps you connect`; body
`Prompt: claude-prompts/2026-10-22/002-privacy-ai-apps.md`. Commit this prompt
file with it. **Push. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-10-22/002-privacy-ai-apps.md`, half a page: files ×
locales, labels checked, any sentence you found untrue (and stopped on),
guard proof, build lines, SHA + push. `## Help impact`: none.
