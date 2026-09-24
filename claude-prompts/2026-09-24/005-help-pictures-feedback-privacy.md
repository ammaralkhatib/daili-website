# Help center: batch-3 pictures, 👍👎 + missed-search counts on the website, privacy sentence, strict pictures

> **Run this AFTER app prompt `2026-09-24/011-help-shots-batch-3`.** That
> run writes the 14 pictures Part A wires in. If it hasn't run, do Part A with
> whatever exists and say so.

## Goal
1. **Part A.** Wire the batch-3 pictures into their articles (same rules as
   003/004 Part B) and commit them.
2. **Part B.** One sentence in the Documents and Photos articles: daili keeps
   its **own copy**, so deleting in daili never deletes the original, and the
   other way round. (Checked in the app: `VaultStore`/`PhotoStore` "copy the
   bytes… the source is never moved or deleted".)
3. **Part C.** From now on **every article needs a picture**. The last 3 (the
   phone home screen and the browser) get an explicit, visible exemption
   until Ammar's hand-made pictures exist.
4. **Part D.** The website sends the anonymous Help counts to the api
   endpoint that is already live (`POST https://api.daili.app/v1/help/events`,
   api commit `a19d079`): 👍/👎 per article, and searches that found
   nothing.
5. **Part E.** The privacy policy says so, in every language file, before
   anything is sent.

"Done" = `npm run build` green; no article without a picture unless
exempted; 👍👎 and missed-search sending work against the api (proven with a
local mock, see Verify); privacy policy updated everywhere.

## Scope
- **In:** `help/en/**`, `help/media.json` + `static/help/media/en/*` (commit
  only, don't edit), `tools/help-lib.mjs` + `tools/check-help.mjs` +
  `tools/test-check-help.mjs` (Part C), `templates/helparticle.html`,
  `static/assets/help-search.js` and one new small script for 👍👎 (or both in
  one file), `static/assets/style.css`, `static/.htaccess` (CSP
  `connect-src` only), `build.mjs` (hash any new script like `script.js`),
  `legal/privacy.*.html` + `legal/datenschutz.de.html`, `README.md` (the
  help section).
- **Out:** the api (done), the app, the blog, `HELP_PUBLIC` (stays false).

## Requirements

### Part A: pictures
For every `media.json` id equal to an article id without a picture: add
`media: <id>` and one image line after the first paragraph. **Look at the
picture** and write an honest alt text (what it shows + what's circled).
Check that it shows only made-up demo files. Commit the pictures + `media.json`
first, as `chore(help): help-shots pictures (batch 3)`.

### Part B: the copy sentence
In `vault-documents` and `vault-photos` (and `vault-where` if it fits),
add one plain sentence, for example: "daili keeps its own copy. Deleting it
here doesn't delete the original on your phone, and deleting the original
doesn't delete it here." Stay within the word limit. **Don't change the
backup wording** in `vault-where`: the backup change (app prompt 012) ships
with the next build, and the release help sync updates that text then.

### Part C: pictures become required
- In `help-lib.mjs`, a missing `media` becomes an **error** (remove the
  `TODO(phase 2)` warning).
- New front-matter key `mediaPending: <reason>` (free text, ≤ 80 chars) is
  the only way to skip a picture. It's an error to have both `media` and
  `mediaPending`. The build prints one visible line per pending article
  (`help: 3 article(s) waiting for a hand-made picture: …`).
- Set `mediaPending: hand-made screenshot of the phone home screen` (or
  similar) on `anywhere-widgets`, `anywhere-web` and `anywhere-wall`.
- `test-check-help`: add planted cases for "missing media → error" and
  "media + mediaPending → error"; keep every old case green.

### Part D: 👍👎 and missed searches on the website
- **Article page:** under the note, a "Was this helpful?" row with two real
  `<button>`s (👍 / 👎 as inline SVG, `aria-label`s "Yes, helpful" / "No, not
  helpful"), in the style of the app design (outlined pill buttons). One tap
  → both buttons disabled, text "Thanks!". It's remembered **per article in
  this browser** with `localStorage` (wrapped in try/catch; without storage it
  just works for this page view). Without JS the row is hidden (render it
  with the `hidden` attribute and let the script un-hide it).
- **Search:** when a search of **3+ characters** shows 0 results and the
  person stops typing for 2 seconds (or leaves the field), send one
  `search_miss` with the typed text. Send at most once per distinct text per
  page view. The server cleans and drops unsafe text itself, so send it as
  typed.
- **Sending:** `fetch('https://api.daili.app/v1/help/events', {method:'POST',
  headers:{'Content-Type':'application/json','Accept':'application/json'},
  body: JSON.stringify({events:[…]}), keepalive: true})`. Each event:
  `{kind, subject, value?, source:'web', platform:'web', locale:'en'}`
  (`helpful` → `subject` = article id, `value` 1/0). No app_version.
  **Fire and forget:** never show an error, never retry, never block the
  page.
- **No cookies, no identifiers, no third-party anything.** The request must
  carry nothing but the event.
- **CSP** in `static/.htaccess`: change `connect-src 'none'` to
  `connect-src https://api.daili.app`. Change nothing else. `check-build`
  must still pass (update its expectation if it asserts the old value, and say
  so).
- Scripts stay external and content-hashed (no inline executable script;
  `check-build` section 16 stays green).

### Part E: privacy policy (every `legal/privacy.*.html` + `legal/datenschutz.de.html`)
In **section 2 (This website)**, one short paragraph with this meaning
(English is binding; German is authoritative too; the rest are faithful
translations in each file's own style):

> **Help center feedback (optional).** If you tap "Was this helpful?" on a
> help article, or a search in the help center finds nothing, your browser
> sends an anonymous count to our own server (api.daili.app): which article
> and yes/no, or the search text. It contains no name, no account, no cookie
> and no device id. We don't store your IP address with it, only the date. We
> drop search texts that look like an e-mail address or a phone number, and we
> delete everything after 180 days. We use it only to improve the help
> articles. Legal basis: our legitimate interest in useful help pages
> (Art. 6(1)(f) GDPR).

Also update the sentence in section 2 that says the site makes **no**
requests to other servers (or similar), so it stays literally true: the
site still sends nothing on its own, only these optional counts and the
newsletter form. The "no cookies / no analytics / no tracking" claims stay
true; don't add any tracking. Bump "Last updated" to **24 September 2026**
(`datetime="2026-09-24"`) in every file, in each file's date format.
check-legal and check-content must stay green.

## Constraints
- `npm run build` green (all guards). Self-correct up to 2 tries.
- File-write tool, never heredocs; check `wc -c`.
- Don't touch `../familyplanner-app` or `../familyplanner-api`.
- Leave unrelated uncommitted files alone.

## Verify
- `npm run build`: the help line says 0 missing, 3 hand-made-pending.
- **Sending, proven locally:** serve `dist/`. Temporarily point the endpoint
  at a tiny local Node mock (a `HELP_EVENTS_URL` build-time override, or a
  test-only query switch; your choice, but the shipped build must use the
  real URL). Tap 👍, and search "zebra": the mock receives exactly the two
  expected bodies, with no cookie header. Say how you did it and show the
  bodies.
- `grep -L "2026-09-24" legal/privacy.*.html legal/datenschutz.de.html` →
  prints nothing.
- `curl`-free check of the CSP line in `dist/.htaccess`.

## Commit & push
1. This prompt, if untracked: `docs(plan): add help pictures/feedback/privacy prompt`.
2. `chore(help): help-shots pictures (batch 3)`.
3. `feat(help): pictures required (hand-made exemption), copy note in vault articles, 👍👎 + missed-search counts, privacy paragraph in all locales`.
   Body: `Prompt: claude-prompts/2026-09-24/005-help-pictures-feedback-privacy.md`.
- **Push now.** No deploy needed yet (`HELP_PUBLIC` stays false). The
  privacy paragraph is harmless to deploy early.

## Report
`claude-reports/2026-09-24/005-help-pictures-feedback-privacy.md`:
- pictures wired (id + alt);
- the exact English and German privacy paragraph, plus any translation you
  were unsure of;
- the CSP line before/after;
- the mock proof (the two JSON bodies);
- SHAs.
- **Open item for Ammar, before the website sends real counts:** add
  `https://daili.app` to `CORS_ALLOWED_ORIGINS` in the api's prod `.env`, then
  `php artisan config:clear && php artisan config:cache`. Until then the
  browser blocks the request silently. Nothing breaks.
