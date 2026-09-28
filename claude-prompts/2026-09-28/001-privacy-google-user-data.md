# Privacy policy — a "Google user data" section + a security section (Google OAuth verification, round 5)

## Why

Google's Third-Party Data Safety Team rejected the OAuth verification of the
Cloud project `familyplanner-d712e` on 2026-09-28 with two findings:

* "Your privacy policy does not state with whom you share, transfer, or
  disclose Google user data."
* "Your privacy policy does not specify any data protection mechanisms for
  sensitive data."

Both are true: `legal/privacy.en.html` never says the words "Google user data",
never lists who receives Google Calendar data, has no security section, and has
no Limited Use statement. Google's reviewers look for those exact words. This
prompt adds two new sections, word for word as written below, to the English
policy, and the same two sections to every other locale.

This is the fifth rejection. The English text below was checked line by line
against the API code (see "Facts behind the text"). **Do not rephrase, shorten
or "improve" the English text.** If a sentence is not true for the code, stop
and report it — do not quietly change it.

## Scope

Touch only: `legal/privacy.*.html` (all 28 bodies incl. `legal/datenschutz.de.html`),
`tools/check-legal.mjs`, and any CSS the new `<h3>`/`<ul>` need (check first —
`legal.html` may already style them). Nothing else.

🔴 The working tree already has uncommitted changes that are NOT yours
(`changelog/whats-new.*.html`, `claude/…`). Do not touch, stage or commit them.
Commit only your own files. Mention them in the report, because `./deploy.sh`
builds from the working tree and will ship them too.

## 1. English — `legal/privacy.en.html`

a) Date line: `27 September 2026` → `28 September 2026`,
   `<time datetime="2026-09-28">`.

b) Section 4, paragraph **Connected calendars (optional)** — append this
   sentence at the end of that paragraph:

   `How Daili handles Google Calendar data — what it reads, with whom it is shared and how it is protected — is described in section 5.`

c) Section 4 — add this new paragraph right after the **Push notifications**
   paragraph:

```html
<p><strong>Wall display (optional).</strong> If someone in your family connects a TRMNL e-paper display to Daili, our server sends the display a summary of the next few days: events, to-dos, shopping items, meals and birthdays of your family. It is sent to TRMNL, the company that runs the display service, so the display can show it. Private events and calendars that are not shared with the family are never sent. Removing the Daili plugin in TRMNL stops it.</p>
```

d) Insert the two new sections **between section 4 and the current section 5**,
   exactly as below:

```html
<h2 id="google-user-data">5. Google user data</h2>
<p>This section explains how Daili accesses, uses, stores, shares and protects <strong>Google user data</strong>: the data we receive from Google when you connect a Google Calendar, or when you sign in with Google.</p>

<h3>What we access</h3>
<p>Only if you tap "Connect Google Calendar" and agree on Google's consent screen, Daili gets read-only access with these permissions:</p>
<ul>
<li><code>calendar.calendarlist.readonly</code> — the list of your calendars (name and colour), so you can choose which calendars Daili shows;</li>
<li><code>calendar.events.readonly</code> — the events of the calendars you chose;</li>
<li><code>openid</code> and <code>email</code> — the e-mail address of the Google account, so you can see which account is connected.</li>
</ul>
<p>Daili never creates, changes or deletes anything in your Google Calendar. If you sign in with Google (section 4), we receive only your name, e-mail address and a technical user ID, and use them only to sign you in.</p>

<h3>How we use it</h3>
<p>We use Google user data only to show the events of the calendars you chose inside Daili: in the family calendar of the app and the web app, in your home-screen widgets, in the morning and evening summary notifications if you switch them on, and on a family wall display if your family connects one. We do <strong>not</strong> use Google user data for advertising, we do not sell it, we do not use it to build profiles, and we do not use it to develop, improve or train artificial-intelligence or machine-learning models. Google Calendar data is <strong>never sent to the AI features</strong> described in section 4.</p>

<h3>What we store</h3>
<p>For each event: title, location, start and end time, whether it is all-day, and its time zone. For each chosen calendar: its name and colour. For the connection: the Google e-mail address and the access keys (OAuth tokens) that Google gives us. We do not store event descriptions, guests or attachments. This data is stored on the Daili server in the EU (section 7); the app keeps a copy on your device so your calendar also works offline.</p>

<h3>With whom we share, transfer or disclose Google user data</h3>
<p>We do <strong>not sell</strong> Google user data, and we do <strong>not share, transfer or disclose</strong> it to anyone, except in these cases:</p>
<ul>
<li><strong>Your family members</strong> — only the calendars you mark "Share with family". A calendar you keep private is visible only to you.</li>
<li><strong>Service providers that run Daili for us</strong> — Host Europe GmbH (Germany), which hosts our server and database; and Google (Firebase Cloud Messaging), which delivers our notifications. If you switch on the summary notification, it contains the titles of that day's events. These providers process the data only on our behalf, to run Daili.</li>
<li><strong>TRMNL</strong> — only if someone in your family connects a TRMNL e-paper display to Daili: events from calendars shared with the family are sent to TRMNL so the display can show them. Private calendars are never sent.</li>
<li><strong>When the law requires it</strong> — for example a binding order from a court or an authority, and only as far as required.</li>
</ul>
<p>We never give Google user data to advertisers, data brokers or AI companies, and we do not transfer or disclose it to third parties for any purpose other than the ones listed in this section.</p>

<h3>How we protect Google user data</h3>
<ul>
<li><strong>Encryption in transit:</strong> every connection between the app or web app, our server and Google uses HTTPS (TLS).</li>
<li><strong>Encrypted access keys:</strong> the Google access keys (OAuth tokens) are encrypted in our database with AES-256. They never leave our server and are never sent to the app or the browser.</li>
<li><strong>Access control:</strong> every request must be signed in. Before the server returns any event, it checks that you belong to the family and that the calendar is yours or shared with the family.</li>
<li><strong>Least privilege:</strong> Daili asks only for read-only permissions and stores only the fields listed above.</li>
<li><strong>Limited staff access:</strong> only the developer of Daili (section 1) has administrative access to the server and the database.</li>
</ul>
<p>Section 6 describes the security measures that protect all your data.</p>

<h3>How long we keep it and how to delete it</h3>
<ul>
<li>Daili refreshes the chosen calendars regularly. An event you delete in Google also disappears from Daili at the next refresh.</li>
<li>When you disconnect Google in Daili (Calendar → settings → the connected account → Disconnect), we <strong>revoke our access at Google</strong> and immediately delete the access keys, the calendar list and all synced events.</li>
<li>When you delete your Daili account, all Google user data is deleted with it, at the latest after the 30-day grace period (section 8).</li>
<li>You can also remove Daili's access at any time in your Google Account at <a href="https://myaccount.google.com/permissions">myaccount.google.com/permissions</a>. Daili then cannot read your calendar any more; disconnect in Daili as well to delete the copy we stored.</li>
</ul>

<h3>Limited Use</h3>
<p>Daili's use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy">Google API Services User Data Policy</a>, including the Limited Use requirements.</p>

<h2 id="data-protection">6. How we protect your data</h2>
<p>We protect all data in Daili — including Google user data — with these measures:</p>
<ul>
<li><strong>Encryption in transit:</strong> the app, the web app and this website talk to our server only over HTTPS (TLS).</li>
<li><strong>Passwords</strong> are stored only as a secure hash (bcrypt). Nobody, including us, can read them.</li>
<li><strong>Access keys for connected calendar accounts</strong> are encrypted in the database (AES-256) and never leave our server.</li>
<li><strong>Access control:</strong> every request must be signed in, and the server only returns data of your own family. Private items stay visible only to you.</li>
<li><strong>Hosting in the EU:</strong> our server and database are hosted by Host Europe GmbH in a professional data centre in the EU.</li>
<li><strong>Few people, little data:</strong> only the developer of Daili has administrative access, and we collect only what a feature needs — no location, no advertising ID, no tracking.</li>
<li><strong>If something goes wrong:</strong> if a data breach ever happens, we inform the data protection authority and the people affected, as the GDPR requires (Art. 33 and 34 GDPR).</li>
</ul>
```

e) Renumber the old sections 5–10 → **7–12** (headings only; no other text
   changes). The only in-text section references in the file today are
   "section 4" (unchanged) — grep the whole repo (`blog/`, `help/`,
   `content/`, `site.config.mjs`, templates) for any other reference to a
   privacy-policy section number and fix it if one exists.

## 2. German — `legal/datenschutz.de.html` (authoritative, NOT a translation)

Same changes, in the German legal register the file already uses ("Sie",
"Verantwortlicher", "Art. 6 Abs. 1 lit. … DSGVO"). Use these headings:
`5. Google-Nutzerdaten`, `6. Wie wir Ihre Daten schützen`; sub-headings
`Worauf wir zugreifen`, `Wofür wir sie verwenden`, `Was wir speichern`,
`An wen wir Google-Nutzerdaten weitergeben, übermitteln oder offenlegen`,
`Wie wir Google-Nutzerdaten schützen`, `Wie lange wir sie speichern und wie Sie sie löschen`,
`Limited Use (eingeschränkte Nutzung)`. Keep the Limited Use sentence's policy
name in English inside the German sentence:
`Die Nutzung und Übertragung von Informationen, die Daili über Google-APIs erhält, an andere Apps erfolgt gemäß der <a href="…">Google API Services User Data Policy</a>, einschließlich der Anforderungen zur eingeschränkten Nutzung (Limited Use).`
Scope names (`calendar.events.readonly` …), "HTTPS (TLS)", "AES-256",
"bcrypt", "OAuth", "Host Europe GmbH", "Firebase Cloud Messaging", "TRMNL"
and the myaccount URL stay as they are. Same ids on the two `<h2>`.

## 3. The other 26 locales

Translate the same additions into every other `legal/privacy.<loc>.html`
(natural, native register; the house rules of the earlier legal translation
round apply: "Daili" in Latin letters, no transliterated brand, product and
technical names untouched as listed in §2). Same date, same two `<h2 id="…">`
ids (`google-user-data`, `data-protection` — ids are never translated), same
renumbering. Keep each file's existing `<p class="translated">` note.

## 4. Guard — `tools/check-legal.mjs`

a) The `<h2>` counter uses `/<h2>/g`, which does NOT count `<h2 id="…">`.
   Change it to count every `<h2` tag (`/<h2[\s>]/g`), so a section with an id
   is still a section.
b) New check: every `id` on an `<h2>` in the English body must exist on an
   `<h2>` in every other locale's body (the anchor
   `privacy.html#google-user-data` is sent to Google and must work in all
   languages).
c) New check, privacy only, English + German: the body must contain
   `id="google-user-data"`, `id="data-protection"`, the string
   `api-services-user-data-policy` and the phrase `Limited Use`. Failure
   message: "the Google OAuth verification depends on this section — see
   claude-prompts/2026-09-28/001".
d) Prove each new check can fail: temporarily remove the id from one
   translation / the Limited Use link from English, run `node tools/check-legal.mjs`,
   see the named failure, restore. Say in the report that you did.

## 5. Build and verify

`npm run build` must pass (check-content, check-legal, build, check-build,
detector). Then read `dist/privacy.html` and confirm: the new sections render,
`#google-user-data` and `#data-protection` exist, h3 + lists are styled like
the rest of the page (look at it at 360 px and desktop width), numbering runs
1–12 without gaps. Spot-check `dist/datenschutz.html` and two translations
(e.g. `dist/fr/privacy.html`, `dist/ja/privacy.html`).

Commit (your files only), push. **Do not run `./deploy.sh`** — Ammar runs it.

## Facts behind the text (checked in familyplanner-api on 2026-09-28)

- Scopes: calendarlist.readonly + events.readonly + openid + email; no write scope.
- `ConnectedAccount`: `access_token` / `refresh_token` cast `encrypted`
  (APP_KEY, cipher `AES-256-CBC` in config/app.php) and `$hidden`.
- `ExternalEvent` stores title, location_text, start/end, all_day, timezone
  only. `CalendarSubscription` stores name + color_hex (+ ids).
- Disconnect (`CalendarConnectionController::destroy`) revokes at Google, then
  deletes the account row.
- Visibility: `CalendarSubscription::scopeVisibleTo()`; per-calendar
  `share_with_family`.
- Morning/evening digest = FCM push (`DispatchDailyDigests` → `FcmDispatcher`)
  and includes external event titles (`DailyDigestBuilder`).
- TRMNL board (`TrmnlBoardCollector`) includes connected calendars only when
  `share_with_family = true`; private events never.
- No Gemini client reads `ExternalEvent` / `CalendarSubscription`.

## Report

Half a page: files changed, the four guard checks + proof they fail, build
result, the renumbering, the list of uncommitted files that are not yours.
