# Help center: batch-3 pictures, 👍👎 + missed-search counts, privacy paragraph, required pictures

**Prompt:** `claude-prompts/2026-09-24/005-help-pictures-feedback-privacy.md`
**Completed:** 2026-09-24 · **Status:** done

## Summary

- Every article now has a picture, except 3 that are exempt with a visible `mediaPending` note.
- The website sends the two anonymous Help counts: 👍/👎 per article, and searches that found nothing.
- Every privacy file says so.
- `npm run build` is green. The help line lists **0 missing and 3 pending** (hand-made).

**Order of events.** When this run started, app prompt 011 had not written its pictures yet. So I did Parts B–E first. To keep the build green in the meantime, the 14 articles got a temporary `mediaPending: help-shots batch 3 (app prompt 011) has not run yet`. That version was committed and pushed as `5f0b5f2`. Then 011 finished while I was still in the session, so I did Part A and took the 14 temporary exemptions out again (`2161151`, `9057338`). The 3 `anywhere-*` exemptions are the only ones left.

## Part A: pictures wired (id + alt)

I looked at every picture. All of them show only demo data: Lena, lena@example.com, The Bergers, and the made-up vault files "Passport Lena.pdf", "Insurance card.jpg" and "Rental contract.pdf". The photos are the app's own illustrations.

| id | alt |
|---|---|
| `vault-where` | The Documents screen with five folders: Important papers, Insurance, School, Car and Receipts. |
| `vault-documents` | The Important papers folder with three files. The + button at the bottom right is circled. |
| `vault-photos` | The Family album with four pictures. The add-photo button at the bottom right is circled. |
| `notifications-turn-on` | The top of the Notifications screen with a note that notifications are off. Turn on notifications is circled. |
| `notifications-choose` | The Notifications screen. The Reminders (for you) group with its five switches is circled. |
| `notifications-help` | Further down the Notifications screen. The Quiet hours switch is circled. |
| `account-profile` | The Profile screen with the name, colours and account rows. Change picture is circled. |
| `account-preferences` | The Settings screen. The Preferences card with Language, Time format, Appearance, Home screen and Vibration is circled. |
| `account-password` | The Profile screen. Change password, under Account, is circled. |
| `account-verify-email` | The top of Settings. The Email not verified card with its Resend button is circled. |
| `account-download-data` | The Profile screen. Download my data, under Account, is circled. |
| `account-delete` | The Profile screen. Delete account, the last row under Account, is circled. |
| `account-newsletter` | The bottom of the Notifications screen. The daili newsletter switch, under Email, is circled. |
| `account-feedback` | The Settings screen. Send feedback, under About, is circled. |

- **16 older pictures not committed.** The 011 run also re-shot 16 older pictures. Its report says they differ only by clock drift ("Dentist, Tomorrow" instead of "Piano lesson", birthday countdowns). Their alt texts were written for the committed versions, so I **restored** those 16 with `git checkout` and committed only the 14 new files plus `media.json`.
- **Small flaw in one picture.** In `notifications-turn-on`, the ring slightly overlaps the line above it ("Reminders won't ring…"). It's still readable, so I didn't block on it.

## Part B: the copy sentence

- **vault-documents:** new paragraph: "daili keeps its own copy of each file. Deleting it here doesn't delete the original on your phone, and deleting the original doesn't delete it here." (149 of 150 words)
- **vault-photos:** the existing note now reads: "daili keeps its own copy of each photo. Deleting it here doesn't delete the original in your camera roll, and deleting the original doesn't delete it here."
- **vault-where:** "daili keeps its own copy, so deleting a file here never deletes the original." This goes before "Keep the original of anything important somewhere else too…". The article is at 149 words. The backup wording (step 2) is unchanged.

## Part C: pictures are required

- **The rule, in `help-lib.mjs`:**
  - A missing `media` is now an error. The `TODO(phase 2)` warning is gone.
  - There's a new key, `mediaPending` (up to 80 chars). Having both `media` and `mediaPending` is an error.
- **Build output.** `check-help` prints `help: N article(s) waiting for a picture:` and then one line per article with its reason. I dropped "hand-made" from the header because it was false while the 14 batch-3 articles were pending.
- **The 3 exempt articles:**
  - `anywhere-widgets`: hand-made screenshot of the phone home screen with daili widgets
  - `anywhere-web`: hand-made screenshot of daili in a computer browser
  - `anywhere-wall`: hand-made photo or screenshot of the wall board on a tablet
- **test-check-help: 59 cases, all green.** New cases:
  - missing media → error
  - media + mediaPending → error
  - mediaPending over 80 chars → error
  - a clean fixture where `mediaPending` replaces `media` → passes

## Part D: 👍👎 and missed searches

- **Article page.** The "Was this helpful?" row sits after the body (under the note) and before Related.
  - Two `<button>`s with inline SVG thumbs, labelled "Yes, helpful" / "No, not helpful". They're outlined mint pills.
  - The row is rendered `hidden`, and the script un-hides it.
  - One tap disables both buttons and shows "Thanks!" (`role="status"`).
  - The answer is remembered per article in `localStorage` (try/catch).
- **Search.** A search of 3+ characters with 0 results sends `search_miss` after 2 s without typing, or when the field loses focus. It's sent at most once per trimmed text per page view.
- **Code.** Everything is in `static/assets/help-search.js`, which is now loaded on `/help/` and on every article. It's still external and content-hashed.
  - Each event is one `fetch` with `credentials: "omit"`, `referrerPolicy: "no-referrer"` and `keepalive`, and `.catch(() => {})`.
  - No retry, no error shown.
- **Endpoint.** `build.mjs` substitutes the URL before hashing. `HELP_EVENTS_URL=<url>` overrides it, with a loud `!!` warning.
  - `check-build` section 16 now fails if the shipped script doesn't contain `https://api.daili.app/v1/help/events`. So a mock build can't pass `npm run build` or `deploy.sh`.
  - It also fails if `connect-src` isn't exactly `https://api.daili.app`.

**The CSP line in `static/.htaccess`** (only this directive changed; `dist/.htaccess` checked with grep):
```
before: connect-src 'none';
after:  connect-src https://api.daili.app;
```
`check-build` didn't check the old value before. The two new checks above are additions.

## Mock proof

- **Setup:**
  - `HELP_EVENTS_URL=http://127.0.0.1:8788/v1/help/events node build.mjs`. The following `check-build` correctly failed on it: *"does not post to https://api.daili.app/v1/help/events — a HELP_EVENTS_URL test build must not ship"*.
  - A Node server served `dist/` on `:8787` and set a `probe` cookie on 127.0.0.1. Cookies ignore the port, so the browser would send it to `:8788` if credentials leaked.
  - A mock on `:8788` answered the CORS preflight and logged each POST.
  - A harness page in headless Chrome did this:
    - tapped 👍 twice on `/help/start/home/`, then reloaded the page;
    - typed z→zebra on `/help/`, then waited, blurred the field, typed "zebra " again, then typed "ab".
- **What the mock received: exactly two requests:**
```
POST /v1/help/events cookie=(none) referer=(none) body={"events":[{"kind":"helpful","subject":"start-home","value":1,"source":"web","platform":"web","locale":"en"}]}
POST /v1/help/events cookie=(none) referer=(none) body={"events":[{"kind":"search_miss","subject":"zebra","source":"web","platform":"web","locale":"en"}]}
```
- **What the page reported:** `{"rowHiddenAfterJs":false,"disabledAfterTap":[true,true],"thanksShown":true,"disabledAfterReload":[true,true]}`
- **Gap:** I didn't separately check that the probe cookie was actually in the browser's cookie jar.
- **Cleanup:** afterwards I rebuilt for real. The real endpoint is in `dist/`, and the harness page is gone.

## Part E: privacy policy

This changed in all 23 `privacy.*.html` files and in `datenschutz.de.html`:
- **Section 2, the newsletter paragraph:** it now opens with a sentence that stays literally true.
- **Section 2:** the new paragraph comes after it.
- **The date:** 24 September 2026 (`datetime="2026-09-24"`), in each file's own format.
- `grep -L "2026-09-24" …` prints nothing. check-legal and check-content are green (the content warnings were already there).

**English:**
> Apart from loading its pages, this site sends nothing on its own. Only two optional things you use yourself do: the newsletter form and the help center feedback below. *(then the unchanged newsletter sentence)*
>
> **Help center feedback (optional).** If you tap "Was this helpful?" on a help article, or a search in the help center finds nothing, your browser sends an anonymous count to our own server (api.daili.app): which article and yes/no, or the search text. It contains no name, no account, no cookie and no device id. We don't store your IP address with it, only the date. We drop search texts that look like an e-mail address or a phone number, and we delete everything after 180 days. We use it only to improve the help articles. Legal basis: our legitimate interest in useful help pages (Art. 6(1)(f) GDPR).

**German:**
> Abgesehen vom Laden ihrer Seiten sendet diese Website von sich aus nichts. Das tun nur zwei freiwillige Dinge, die du selbst nutzt: das Newsletter-Formular und das Feedback im Hilfe-Center weiter unten.
>
> **Feedback im Hilfe-Center (freiwillig).** Wenn du bei einem Hilfe-Artikel auf „Was this helpful?“ tippst oder eine Suche im Hilfe-Center nichts findet, sendet dein Browser eine anonyme Zählung an unseren eigenen Server (api.daili.app): welcher Artikel und ja/nein, oder den Suchtext. Sie enthält keinen Namen, kein Konto, kein Cookie und keine Geräte-ID. Deine IP-Adresse speichern wir dazu nicht, nur das Datum. Suchtexte, die wie eine E-Mail-Adresse oder Telefonnummer aussehen, verwerfen wir, und nach 180 Tagen löschen wir alles. Wir nutzen das nur, um die Hilfe-Artikel zu verbessern. Rechtsgrundlage: berechtigtes Interesse an hilfreichen Hilfe-Seiten (Art. 6 Abs. 1 lit. f DSGVO).

**Translation notes:**
- **"Was this helpful?"** stays in English in every language, because that is the button's actual label (the help center is English-only).
- **"Apart from loading its pages"** isn't in the prompt's wording. "Sends nothing to any server" alone would be false, because loading a page is a request, so I added the qualifier in every language.
- **Unsure, worth a native look:**
  - **fi** "laskurimerkintä" (for "count")
  - **th** the lead sentence
  - **hi** "गुमनाम गिनती"
  - **ar** "عدًّا مجهول الهوية"

  All the others follow each file's own tone (du/tu/ty vs vous) and its own GDPR citation.

## Verification
```
$ npm run build
content OK · legal OK · help: 3 article(s) waiting for a picture · help OK · 64 article(s)
test-check-help OK · 59 cases · build OK · 210 pages · detector OK
$ grep -L "2026-09-24" legal/privacy.*.html legal/datenschutz.de.html
(nothing)
$ grep -o "connect-src[^;]*;" dist/.htaccess
connect-src https://api.daili.app;
```
I also took a screenshot of `/help/vault/documents/`. The row sits under the note and above Related.

## Commits
- `2810589` docs(plan): add help pictures/feedback/privacy prompt
- `5f0b5f2` feat(help): pictures required (hand-made exemption), copy note in vault articles, 👍👎 + missed-search counts, privacy paragraph in all locales
- `2161151` chore(help): help-shots pictures (batch 3)
- `9057338` feat(help): wire the batch-3 pictures into their 14 articles

**Order and push.** The pictures commit came after the feature commit, not before it, because 011 finished mid-run. The first two commits were pushed then; the last two are pushed together with this report.

## Deviations
- **Commit order and 4th commit:** see above, plus an extra 4th commit for the wiring.
- **Build line:** the header reads "waiting for a picture", with one line per article and its reason (not "hand-made picture").
- **Endpoint constant:** it lives in `build.mjs`, and `check-build` hard-codes the same URL. `site.config.mjs` was not in scope.

## Open items for Ammar
- **Before the website sends real counts:** add `https://daili.app` to `CORS_ALLOWED_ORIGINS` in the api's prod `.env`, then run `php artisan config:clear && php artisan config:cache`. Until then the browser blocks the request silently, and nothing breaks.
- **The 3 hand-made pictures** (`anywhere-widgets`, `anywhere-web`, `anywhere-wall`): when you add them, add `media:` and delete the `mediaPending:` line.
- **The 16 re-shot older pictures:** I restored them to the committed versions. The next full help-shots run will write them again. It's clock drift only, so commit or discard them as you like.
