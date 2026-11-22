# Privacy + help: "why are you leaving?", the "email me once" yes, and deleting on the web

## Why
List items #130 + #231, plan `~/Herd/familyplanner-api/claude-prompts/DELETE-SCREEN-COMEBACK-PLAN.md`
(Ammar 2026-11-22). Three changes landed today in the other repos (all run before this prompt):
- api `2026-11-22/006` + `007`: when someone deletes the account and picks one of four reasons, they may
  tick **"Email me once when this gets better"**. Then the server keeps their email address, the reason and
  what they told us in its own table `comeback_contacts` for at most 12 months, for ONE mail that Ammar sends
  himself. A stop link in that mail deletes it. Also a new optional sub-choice `reason_detail` under "My
  family didn't join".
- app `2026-11-22/006`: the box, tips and new choices on the phone's delete page.
- web `2026-11-22/001`: the web app can now delete an account (Profile → Account → Delete account), with the
  same box.

The privacy policy today says NOTHING about the optional "why are you leaving?" answers (they exist since
2026-09-27) and nothing about this new yes. It must say both before the web deploy that turns the box on.
The help article `account-delete` must name the web door and the box.

As in `2026-11-22/001`, **you write the sentences** — in the style, tone and section structure of the
existing `legal/privacy.en.html` and `legal/datenschutz.de.html` (German is authoritative, "du") — **after
checking every fact below against the code** in `~/Herd/familyplanner-api` (and `../familyplanner-app`,
`../daili-web` where named). A fact the code does not confirm → do NOT write it; list it under "Facts I could
not confirm" in the report. Planning Claude reviews English + German before Ammar deploys.

## The facts to check, then cover
1. **The "why" answers** (`app/Http/Requests/DeleteMeRequest.php`, `MeController::recordDeletionFeedback`,
   `app/Models/AccountDeletionFeedback.php`, `AccountPurger` ~:232): optional; one reason, an optional
   sub-choice, an optional note (≤ 500 characters), the platform, the app language, how the account signed
   in, how long it existed, how many families it owned / was a member of. Who sees it: only the operator
   (owner mail + dashi). On the final deletion (day 30) the link to the person and the note are removed; the
   reason, sub-choice and counts stay as anonymous statistics. A restore marks the row as restored. Legal
   basis: check what fits and say why in the report — likely our legitimate interest in improving Daili
   (Art. 6(1)(f) GDPR), as the "One question now and then" paragraph does.
2. **The yes** (`ComebackContact`, `MeController::destroy`, `comeback:prune`, the stop routes,
   `AccountRestorer`, `AccountPurger`): shown only for four reasons, off by default; what is stored (email
   address, reason, sub-choice, a copy of the note, language, platform, consent text version, date of the
   yes, end date, date mailed); kept apart from the account and NOT deleted with it on day 30; deleted (a) at
   once with the stop link in the mail, (b) 12 months after the yes at the latest, (c) 30 days after the mail
   was sent, (d) when the person restores the account. ONE mail only, sent by us by hand from our support
   address — **check how the existing policy describes mails from support@daili.app and match it; do not
   name a mail provider the page does not already name**. Never the newsletter, never Brevo (check: no Brevo
   call in this path). Legal basis: consent (Art. 6(1)(a) GDPR), withdrawn with the stop link or by writing
   to support@daili.app.
3. **Backups:** the existing backup paragraph (EN :141) already covers server backups — check it also holds
   for this table; do NOT change that paragraph.
4. **The web app** (`../daili-web/src/features/profile/DeleteAccountDialog.tsx`): the web sends the same
   fields with `platform: web`. If section 3 ("The web app") lists what the web sends, add one short phrase.

## Where the text goes
- Privacy: ONE new paragraph `id="leaving"` in section 4 ("Data the app processes"), bold lead like the
  others (e.g. **When you delete your account.**), covering fact 1 and fact 2 in plain words. Section 8 ("How
  long we keep data", EN :141): one short sentence pointing to `#leaving` for the yes (kept up to 12 months
  after the deletion).
- Help: `help/<lang>/account/delete.md` in every help language where the article exists — add (a) the web
  door: on the web, Profile → Account → **Delete account**; (b) one short line: for some reasons you can tick
  **Email me once when this gets better** — we then write to you once when we add or fix it, and you can stop
  it with the link in the mail. Use the exact box title the app ARB has for that language
  (`../familyplanner-app/lib/l10n/app_<lang>.arb`, key added by app 006 — find it by the English text). Set
  `updated:` to today. Do not hide the article (the web box is live at the web deploy).

## Requirements
1. `legal/privacy.en.html`, `legal/datenschutz.de.html`, and the same changes in every other
   `legal/privacy.*.html`. Set each page's "last updated" date (text and `datetime`) to the day of this run.
2. You write English and German yourself. The other locales: translate from the English (sub-agents
   allowed, each MUST use model claude-opus-5-5; wait for all of them before the commit). Check every file on
   disk: same diff shape, the new date, complete `<p>…</p>`.
3. Guard `tools/check-legal.mjs`: add `id="leaving"` to the newest MUST_CONTAIN block (or a new block with
   its WHY line), so a locale without it fails the build.
4. Help: the article change in every help language (same facts, the box title from that language's ARB).
5. Only `legal/**`, `tools/check-legal.mjs` and `help/*/account/delete.md` change. Terms pages: no change.
6. 🔴 Report trap: the run script stops when any line of the report contains the word "status" and the word
   "blocked" together. Use the word "blocked" ONLY if you really are blocked.

## Build
`npm run build` passes (`legal OK · …`). Check that the guard would fail without the new id (on a COPY in a
temp folder, or by reading the code) — do not commit a broken file.

## Commit & push
`docs(legal): what we keep when you delete your account, and the "email me once" yes`; body
`Prompt: claude-prompts/2026-11-22/002-legal-help-delete-comeback.md`. 🔴 Do NOT stage
`static/assets/img/photos/`. **Push now. Do NOT run `./deploy.sh`** — Ammar deploys after Planning
Claude's review.

## Report
`claude-reports/2026-11-22/002-legal-help-delete-comeback.md` (file-write tool; `wc -c` > 0), short: each
fact with the code line that proves it, the new EN + DE privacy sentences in full (quote blocks), the new
EN + DE help lines, facts not confirmed, locales done, build result, SHA + push.
`## Help impact`: `account-delete: web door + the "email me once" box`.
