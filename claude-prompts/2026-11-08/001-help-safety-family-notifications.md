# Help: "How daili keeps your data safe" + "What your family sees and gets told" + security.txt + footer link

## Goal
A Japanese user (support mail 2026-11-08) asked two things: "Does my family get told
what I enter, and what exactly?" and "Is this app safe? There are no reviews yet, I'd
like something that shows it's safe." Today the answers exist only deep inside the
privacy policy. Make them easy to find:

1. NEW help article **`account-safety`** — plain facts about how Daili protects data.
2. NEW help article **`notifications-family`** — what the family sees and which
   notifications they get when you add or change something.
3. NEW `static/.well-known/security.txt` (the standard file that tells security
   researchers how to report a problem — RFC 9116).
4. A **Safety** link in the site footer (every site locale) and one link from the home
   page's privacy section.

The app will link to both articles in a later app prompt — keep the ids exactly
`account-safety` and `notifications-family`.

**Do not deploy.** Ammar runs `./deploy.sh` himself after checking.

## Sources (facts — do not guess, do not add claims that are not here or in the code)
- `legal/privacy.en.html` §6 "How we protect your data" and §7 "Where your data lives".
- API repo `~/Herd/familyplanner-api`: `CLAUDE.md` §3 (private items, Cycle, Budget,
  event assignees, AI adults-only, account deletion), `app/Console/Commands/DispatchBudgetReminders.php`
  (who gets bill reminders).
- App labels: `../familyplanner-app/lib/l10n/app_<locale>.arb` — use the real labels:
  `settingsNotifyEventCreated` (Calendar), `settingsNotifyListChanges` (Shopping),
  `settingsNotifyTodoChanges` (To-dos), `settingsNotifyCelebrationChanges`,
  `settingsNotifyRecipeChanges`, `settingsNotifyMealPlanChanges`, `settingsNotifyInvites`
  (Family), `settingsNotifyHabitChanges` (Habit news), `settingsNotifyAssignedTodos`,
  `settingsNotifyBillReminders`, `settingsNotifyBudgetAlerts`,
  `notificationSettingsGroupFamily`, `listPrivateSwitch` ("Only me"), `budgetsTitle`,
  and the labels for Download my data / Delete account / sign out of all devices (find them).
- Existing articles for the voice and brand spelling: `help/en/notifications/choose.md`,
  `help/en/family/activity.md`, `help/en/account/download-data.md`, `help/en/account/delete.md`.

## Article 1 — `help/en/account/safety.md`
Front matter like the other account articles: `id: account-safety`, `topic: account`,
`routes: /settings`, `since: 1.15.0` (= `LIVE_APP_VERSION`, so it shows now),
`updated:` the day you run this, `order:` after the existing account articles,
**no `media`** (text-only, like `account-tips`),
`related: notifications-family, account-download-data, account-delete, family-roles`
(check each id exists; drop one that doesn't),
keywords incl. `safe, safety, security, secure, privacy, data protection, gdpr, encryption,
https, password, server, europe, eu, trust, hacked, who can see`.

Title: "How daili keeps your family's data safe".
Summary: "What we do to protect your data, what never leaves your phone, and how you stay in control."

Body — short sentences, ≤ 300 words, a few short sections with `##` headings like other
longer articles (check one does it; if no article uses `##`, use bold lead-ins instead):
- **Only your family sees your family's things.** Every request must be signed in, and
  the server only answers with your own family's data. Items marked **Only me** are
  visible to you alone — others can't even see that they exist.
- **Protected on the way and at rest:** the app, the web app and the website talk to our
  server only over HTTPS (encrypted). Passwords are stored only as a one-way hash —
  nobody, us included, can read them. If you sign in with Google or Apple, we have no
  password of yours at all. Access keys for connected Google/Outlook calendars are
  encrypted (AES-256) and never leave our server.
- **Hosted in the EU, under the GDPR:** our server and database are in a professional
  data centre in the EU (Host Europe). Daili follows the European data protection law
  (GDPR).
- **Some things never leave your phone:** Cycle, Documents & photos (the vault) and the
  events of calendars on your phone stay on your device (Documents & photos and Cycle are
  in your phone's own backup). Check `vault-where` / cycle articles for the exact wording.
- **No ads, no tracking, no selling of data.**
- **AI only when you ask:** an AI feature sends data to Google (Gemini) only when you tap
  it; Google does not use it to train its models. AI is for adults (18+).
- **You stay in control:** download a copy of your data, sign out of all devices, or
  delete your account (link the articles). 
- **We check regularly:** we review Daili's security regularly and fix problems right away.
- `> Note:` Good to know: Daili is not end-to-end encrypted. Our server has to read
  shared family items to send reminders, sync your devices and show the web app. Only the
  developer of Daili has administrator access.
- Last line: found a security problem? Email **support@daili.app** with "Security" in
  the subject.

## Article 2 — `help/en/notifications/family.md`
`id: notifications-family`, `topic: notifications`, `routes: /settings/notifications`,
`since: 1.15.0`, `updated:` today, `order:` after `notifications-choose`, no `media`,
`related: notifications-choose, family-activity, calendar-private, account-safety`
(check ids; use the real id of the private-events article if it differs),
keywords incl. `who sees, family sees, does my family know, notified, notify family,
what does my family get, private, only me, budget private, activity`.

Title: "What your family sees and gets told".
Summary: "Which of your entries your family sees, when they get a notification, and what stays private."

Body (≤ 230 words):
1. Short intro: everything shared — calendar, shopping and to-do lists, birthdays,
   recipes, meal plan, habits — is visible to everyone in the family or group.
2. A bullet list "When you add, change or delete something shared, the others get a
   notification for that area": Calendar · Shopping · To-dos · Birthdays & celebrations ·
   Recipes · Meal plan · Family · Habit news (real labels). Several changes made together
   arrive as one notification.
3. "Everyone chooses their own": each person switches these on or off in **Settings →
   Notifications → Family changes (what members do)**, and can set quiet hours. Link
   `notifications-choose`.
4. "Only some people": an event with people chosen notifies only those people; a to-do
   assigned to someone notifies that person (**Assigned to you**). Check `CLAUDE.md` §3
   "Event assignees" for the exact rule and say it simply.
5. "See who changed what": the bell on Home shows the activity list. Link `family-activity`.
6. A bullet list **Never sent to your family**: items marked **Only me** · your
   **Budget** entries (the only budget notifications are **Bill reminders** and **Budget
   alerts**, and they go only to people who can see that budget) · Cycle · Documents &
   photos. Notes: a note shared with the family shows up in the activity list without a
   notification (as `family-activity` says).

## Related links (no other change)
Add `notifications-family` to `related` of `help/en/notifications/choose.md`, and
`account-safety` to `related` of `help/en/account/download-data.md` and
`help/en/account/delete.md`. Do **not** bump their `updated` (translations must not go stale).
Copy the same `related` change into each locale file of those three articles.

## security.txt
Create `static/.well-known/security.txt`:
```
Contact: mailto:support@daili.app
Expires: 2027-11-01T00:00:00.000Z
Preferred-Languages: en, de
Canonical: https://daili.app/.well-known/security.txt
Policy: https://daili.app/help/account/safety/
```
Check `static/.htaccess` (it has a `/.well-known/` rule at line ~26): the file must be
served as `text/plain` and must not be redirected or blocked; adjust the rule only if
needed and say what you changed. Make sure the build copies dot-folders from `static/`
(it already ships other `.well-known` files? check `dist/.well-known/`). If the build
skips dot-folders, fix that in the smallest way.

## Footer + home link
- `content/<loc>.json` → `footer.safety` = "Safety" (translate for all 28 site
  locales; short, one word where the language allows). Render it in the footer next to
  Privacy Policy. Link target: the locale's help article
  `/<loc>/help/account/safety/` when that locale is in `HELP_LOCALES`, else the English
  `/help/account/safety/` (ru, hi, ar). Follow how `legalHref` already picks a target.
- Home page privacy section (`home.privacy.*`, rendered around `PRIVACY_ICONS` in
  `build.mjs`): add ONE small text link "How we keep your data safe →"
  (`home.privacy.safetyLink`, all 28 locales) to the same target. Keep the design as it
  is (same link style already used on the home page — find one).
- `check-content` will fail on any missing/identical string — translate properly.

## Translations
Translate both new articles into every `HELP_LOCALES` language following
`claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md`, with the app's own labels from
each `app_<locale>.arb` (for `zh-Hans` use `app_zh.arb`). Keep "Daili", "Gemini",
"Host Europe", "GDPR" (or the language's usual name for the GDPR, e.g. DSGVO), "HTTPS",
"AES-256" as they are. Japanese must sound natural — this article will be sent to a
Japanese user.

## Scope
- In: the two new articles + translations, the `related` lines above, security.txt
  (+ `.htaccess`/build only if needed), `footer.safety` + `home.privacy.safetyLink` in all
  `content/<loc>.json`, the footer/home templates or `build.mjs` lines that render them.
- Out: legal pages, other articles, `LIVE_APP_VERSION`, blog, feature pages, the app.
  🔴 Untracked files that are not yours (`static/assets/img/photos/`): leave them untracked.

## Verify
`npm run build` green (all guards) and `node tools/check-help.mjs` green. Spot-check
`dist/help/account/safety/index.html`, `dist/ja/help/account/safety/`,
`dist/help/notifications/family/`, `dist/ja/help/notifications/family/`,
`dist/.well-known/security.txt`, the footer on `dist/index.html`, `dist/ja/index.html`
and `dist/ru/index.html` (English target). `dist/help/en.json` and `dist/help/ja.json`
list both articles.

## Commit & push
`docs(help): safety article, what your family gets told, security.txt, footer link`;
body `Prompt: claude-prompts/2026-11-08/001-help-safety-family-notifications.md`.
**Push. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-11-08/001-help-safety-family-notifications.md`, half a page:
articles × locales, any fact you corrected against the code, what you did for
`.well-known`, build lines, SHA + push. `## Help impact`: new articles account-safety,
notifications-family.
