# 002 — Privacy + help: "why are you leaving?", the "email me once" yes, and deleting on the web

**Result:** done · **Commit:** `432305ef` docs(legal): what we keep when you delete your account, and the "email me once" yes — pushed to origin/main (54 files: 28 `legal/privacy.*` / `datenschutz.de`, `tools/check-legal.mjs`, 25 `help/*/account/delete.md`). `./deploy.sh` was NOT run: Ammar deploys after Planning Claude's review (and after the web deploy, per the plan).
**Step 0:** `1ddfd64f` docs(plan): sync planning docs (this prompt file), pushed. No commits were held. `static/assets/img/photos/` stayed unstaged.

## Facts and the code that proves them
api at `903f46bc` (has 006 `23e7fac0` + 007 `b18b71b0`), app at `0e3b8b0e` (006 `1ba5f0dc`), web at `1f57311` (001 `cb314cf`).

**1. The "why" answers — confirmed.**
- Optional and never the cause of a failed delete: `DeleteMeRequest.php` `prepareForValidation` (unknown reason → `other`, note cut, unknown platform dropped); all rules `nullable`.
- One reason (`AccountDeletionFeedback::REASONS`), sub-choice only under `family_not_joining` (`REASON_DETAILS`; `DeleteMeRequest` drops it otherwise), note ≤ 500 (`NOTE_MAX = 500`, `AccountDeletionFeedback.php:44`), platform ios/android/web (`:42`).
- Stored in `MeController::recordDeletionFeedback` (`MeController.php:567-597`): reason, reason_detail, note, platform, `locale` (:581), `sign_in` password/social (:582), `account_age_minutes` (:583), `owned_families` (:584), `member_families` (:585).
- Who sees it: the owner mail goes only to `config('dashboard.admin_emails')` (`notifyOwnerOfDeletion`, :775-793; "Never the email address" :674-675), and dashi reads it (`Services/Dashboard/GrowthStats.php`). Written as "Only the operator of Daili (section 1) …", the same words the `#activity` paragraph uses.
- Restore: `AccountRestorer::markFeedbackRestored` sets `restored_at` (`AccountRestorer.php:123-138`).
- Day 30: `AccountPurger.php:236-237` empties `user_id` and `note`; reason, reason_detail and counts stay.
- Legal basis: Art. 6(1)(f), legitimate interest in improving Daili — the same as `#surveys` (also optional answers + note, kept as anonymous counts after deletion). The person can leave every field empty, and nothing is used for anything but learning why people leave.

**2. The yes — confirmed.**
- Four reasons only: `ComebackContact::REASONS` (`ComebackContact.php:42`: missing_feature, other_app, not_working, hard_to_use); a yes counts only as true/1/"true" AND one of those reasons (`DeleteMeRequest`), so off by default. Web: `deleteAccount.ts:317` (`offersComeback`).
- Stored (`MeController::recordComebackContact`, :609-643): email, user_id, locale, platform, reason, `reason_detail` (always null today — "The four box reasons have no sub-choice today", so the text does NOT name a sub-choice for the yes), copy of the note, `consent_version`, `consented_at`, `expires_at` (+12 months, `KEEP_MONTHS = 12` :50), `mailed_at`.
- Apart from the account and not deleted on day 30: `AccountPurger.php:239-244` only empties `user_id`.
- Deleted: (a) stop link — `ComebackStopController::stop`, `$row->delete()` (:58; GET = page, POST = delete; routes `api.php:247-254`); (b) 12 months — `PruneComebackContacts.php:27` (`expires_at < now`); (c) 30 days after mailed — `:31-33` (`MAILED_KEEP_DAYS = 30`, `ComebackContact.php:53`); daily schedule `routes/console.php:281`; (d) restore — `AccountRestorer::forgetComebackContact` (:145-156).
- One mail, by hand, never Brevo: `ComebackContact.php:13-20` ("ONE mail … BY HAND. Never a newsletter, never Brevo, never a queue job"); dashi only sets/clears `mailed_at` (`ComebackList.php:90, 96`; `GrowthComebackTable` "Paste the stop link into your mail"). No Brevo / newsletter call in `recordComebackContact`, `ComebackStopController`, `PruneComebackContacts`, `ComebackList` (grep; the only Brevo hit in `MeController` is PATCH /me, :252).
- Legal basis: consent, Art. 6(1)(a); withdrawal by stop link or a mail to support@daili.app.

**3. Backups — holds, paragraph unchanged.** The backups are whole-server Plesk backups (`scripts/server-check.sh:81-84`); nothing excludes a table, so a deleted `comeback_contacts` row can sit in a backup ~4 weeks, like everything else. The paragraph already says "backups of the server".

**4. The web app — confirmed, no section-3 change.** `daili-web/src/features/profile/deleteAccount.ts:301-323`: same fields, `platform = 'web'`, `comeback_version = 1`. Section 3 does not list what the web sends, so nothing was added there; the new paragraph says "in the app or in the web app" and "(iPhone, Android or web)".
Web door: menu user card → `/profile` (`shell/MenuCards.tsx:99`), Account card (`profile.accountTitle` "Account") → button `accountDelete.button` "Delete account" (`AccountCard.tsx:37, 57`).

## New text — English (`legal/privacy.en.html`)

Section 4, new, right after the Newsletter paragraph:
> **When you delete your account.** When you delete your account, in the app or in the web app, Daili asks "Why are you leaving?". Answering is voluntary. If you answer, we store the reason you pick (for "My family didn't join" also what happened, if you choose it) and an optional note of up to 500 characters, together with the platform (iPhone, Android or web), the app's language, whether you signed in with a password or with Google or Apple, how long your account existed and how many families or groups you owned or were a member of. Only the operator of Daili (section 1) sees these answers, in a short e-mail to us and in an internal overview. If you restore your account, we mark the answer as restored. When your account is deleted for good after 30 days, the note and the link to you are removed; the reason, what happened and the numbers stay only as anonymous statistics. Legal basis: our legitimate interest in improving Daili (Art. 6(1)(f) GDPR). For four reasons ("Something I need is missing", "I use another app", "Something didn't work" and "It's hard to use") you can also tick **"Email me once when this gets better"**; it is off until you tick it. Only then do we keep your e-mail address, your reason, a copy of your note, your language, the platform, the version of the text you agreed to, the date you agreed and the end date — and later the date we sent the e-mail — apart from your account, so that we can write to you **once** when we add or fix what you missed. We write that one e-mail ourselves. It is not the newsletter, and we add you to no list. This yes is not deleted with your account after 30 days. It is deleted at once when you use the stop link in that e-mail or restore your account, 30 days after we sent the e-mail, and at the latest 12 months after you agreed. Legal basis: your consent (Art. 6(1)(a) GDPR), which you can withdraw at any time with the stop link or by writing to support@daili.app.

Section 8, added at the end of the first paragraph:
> If you ticked "Email me once when this gets better", we keep your e-mail address for that one e-mail for up to 12 months after the deletion (see ["When you delete your account"](#leaving) in section 4).

Backup paragraph: unchanged. Dates: all 27 pages already said 22 November 2026 (`datetime="2026-11-22"`, from 001 today), so no date edit was needed.

## New text — German (`legal/datenschutz.de.html`, binding)

> **Wenn du dein Konto löschst.** Wenn du dein Konto löschst, in der App oder in der Web-App, fragt Daili „Warum gehst du?“. Antworten ist freiwillig. Wenn du antwortest, speichern wir den Grund, den du wählst (bei „Meine Familie hat nicht mitgemacht“ auch, was passiert ist, wenn du es auswählst), und eine freiwillige Notiz mit bis zu 500 Zeichen, zusammen mit der Plattform (iPhone, Android oder Web), der Sprache der App, ob du dich mit Passwort oder mit Google oder Apple angemeldet hast, wie lange dein Konto bestand und wie viele Familien oder Gruppen dir gehörten oder in wie vielen du Mitglied warst. Nur der Betreiber von Daili (Abschnitt 1) sieht diese Antworten, in einer kurzen E-Mail an uns und in einer internen Übersicht. Stellst du dein Konto wieder her, markieren wir die Antwort als wiederhergestellt. Wird dein Konto nach 30 Tagen endgültig gelöscht, werden die Notiz und die Verbindung zu dir entfernt; der Grund, was passiert ist, und die Zahlen bleiben nur als anonyme Statistik. Rechtsgrundlage: unser berechtigtes Interesse, Daili zu verbessern (Art. 6 Abs. 1 lit. f DSGVO). Bei vier Gründen („Mir fehlt etwas Wichtiges“, „Ich nutze eine andere App“, „Etwas hat nicht funktioniert“ und „Es ist schwer zu bedienen“) kannst du außerdem **„Schreibt mir einmal, wenn das besser ist“** ankreuzen; das ist aus, bis du es ankreuzt. Nur dann bewahren wir deine E-Mail-Adresse, deinen Grund, eine Kopie deiner Notiz, deine Sprache, die Plattform, die Version des Textes, dem du zugestimmt hast, das Datum deiner Zustimmung und das Enddatum — und später das Datum, an dem wir die E-Mail geschickt haben — getrennt von deinem Konto auf, damit wir dir **einmal** schreiben können, wenn wir das, was dir gefehlt hat, hinzufügen oder reparieren. Diese eine E-Mail schreiben wir selbst. Sie ist nicht der Newsletter, und wir setzen dich auf keine Liste. Diese Zustimmung wird nicht nach 30 Tagen mit deinem Konto gelöscht. Sie wird sofort gelöscht, wenn du den Stopp-Link in dieser E-Mail nutzt oder dein Konto wiederherstellst, 30 Tage nachdem wir die E-Mail geschickt haben, und spätestens 12 Monate nach deiner Zustimmung. Rechtsgrundlage: deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die du jederzeit mit dem Stopp-Link oder mit einer Nachricht an support@daili.app widerrufen kannst.

Abschnitt 8:
> Hast du „Schreibt mir einmal, wenn das besser ist“ angekreuzt, bewahren wir deine E-Mail-Adresse für diese eine E-Mail bis zu 12 Monate nach der Löschung auf (siehe [„Wenn du dein Konto löschst“](#leaving) in Abschnitt 4).

Labels are the app's own (`app_en.arb` / `app_de.arb` `profileDeleteReason*`, `profileDeleteComebackTitle`).

## Help — `account-delete`
First try (only adding the two lines) made the build red: EN body 194 words (limit 150), and 11 translations over theirs. So I tightened the whole English body to exactly 150 words, same facts, minus two small extras: step 3 no longer names **I'd rather not say**, and the owner line no longer says "daili tells you which". The intro, step 1, step 4, step 5, the start-over line, the 30-day line and the note got shorter wording. `updated: 2026-11-22`; translations `translatedFrom: 2026-11-22`. Not hidden.

New EN lines:
> On app.daili.app, click your name in the menu, then **Delete account** under **Account**.
>
> Some reasons let you tick **Email me once when this gets better**: one email when we add or fix it, with a link to stop it.

New DE lines:
> Auf app.daili.app klickst du im Menü auf deinen Namen und dann unter **Konto** auf **Konto löschen**.
>
> Bei manchen Gründen kannst du **Schreibt mir einmal, wenn das besser ist** ankreuzen: eine E-Mail, wenn wir es hinzufügen oder reparieren, mit einem Link zum Stoppen.

## Facts I could not confirm
- **"from our support address"**: the code says only "BY HAND" (`ComebackContact.php:19`); the sender address is in no code (the plan and skill `daili-user-mails` say Ammar sends from Outlook, users write to support@daili.app). So the text says "We write that one e-mail ourselves" and names no sender address or provider. Add "from support@daili.app" if Planning Claude wants it.
- The sub-choice for the yes: the prompt lists it as stored, but `recordComebackContact` always stores `reason_detail = null`, so it is left out of the yes.
- The phone side of the box ships with the NEXT app release (app 006 is not in a live tag yet). The privacy text says "in the app or in the web app" — true for the web at the web deploy, for the phone after the release.

## Locales
- Privacy: 26 other locales translated from English by 7 sub-agents (model Opus 5.5), help bodies re-done by 6 more (Opus 5.5) after the English was shortened; I waited for all of them before the commit. Agents wrote only to `/tmp`; two scripts checked shape and applied: every page has ONE complete `<p id="leaving"><strong>…</p>` right after its Newsletter paragraph and the `#leaving` link sentence at the end of section 8's first paragraph; every privacy diff is +2/−1; box title and the five reason labels match each app ARB verbatim; front matter and image line of each help file byte-for-byte kept.
- ar, hi, ru have no app ARB: their labels and box title were translated by the agents (ru «Напишите мне один раз, когда это станет лучше», ar «راسلوني مرة واحدة عندما يتحسّن هذا», hi «बेहतर होने पर मुझे एक बार ई-मेल करें»). A native check is worth it.
- Agent notes worth a look: cs / tr / ru privacy pages mix formal and informal address (used the formal form of the surrounding sections); es / it say "apartado"/"punto" for "section" (the pages' main form); the fi / fr / bg / el box titles are formal/plural in the app ARB, kept verbatim even where the help article says "du"/"tu".
- Help: many translations kept the old "(the English word delete also works)" in step 4 — it was there before and English never had it; left in.

## Checks
- `npm run build` (foreground): green — `legal OK · 2 document(s) × 28 locale(s)`, `help OK · 117 article(s)`, `build OK · 3759 pages`.
- `npm test` (foreground): green (detector, test-check-help 99 cases, help search, blog i18n).
- Guard: `LEAVING_MUST_CONTAIN` (`id="leaving"` + `href="#leaving"`) with its WHY line in `tools/check-legal.mjs`. On a COPY in `/tmp/leaving-002-guard`, removing `id="leaving"` from `privacy.ja.html` → `1 legal error(s): legal/privacy.ja.html does not contain id="leaving" — …`, exit 1. Repo files untouched by that test.

## Open items for Ammar / Planning Claude
- `help/*/anywhere/web.md` (en: line 22) still says "Documents, Photos, recording voice and the notes' AI helpers stay in the phone app. So does deleting your account." — becomes wrong at the web deploy. Outside this prompt's paths, so not changed; needs a small follow-up prompt.
- Review EN + DE text above, then deploy in the plan's order: api (auto) → web `./deploy.sh` → website `./deploy.sh`.

## Help impact
account-delete: web door + the "email me once" box
