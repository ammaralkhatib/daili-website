# Help center: allow the app's own help routes, fix two "?" targets, app privacy paragraph, publish

## Goal
The app now has its own Help screens (app commits `5f6f2929` + `c20fcf18`).
Four things follow on the website side:

1. **The build is red now.** The app added three routes (`/help`,
   `/help/topic/:topicId`, `/help/article/:articleId`), and the guard wants an
   article for every app route. They are the help center itself, so they go
   in `never`.
2. **Two "?" buttons open the wrong article.** The app opens the **first
   article in file order whose `routes` contains the screen's route**
   (app report 014):
   - Family's "?" opens "Add a child" instead of "Invite someone to your
     family";
   - Documents **and** Photos both open "Where your documents and photos are
     kept", instead of their own articles.
3. **The privacy policy's app part** must mention the app's anonymous help
   counts (section 2 only covers the website).
4. **Publish.** The app reads `https://daili.app/help/en.json`, which is 404
   today, so the file must be live before the app build ships. Ammar's
   decision on the public switch is below.

"Done" = `npm run build` green; the two "?" targets fixed; privacy updated in
every locale; `HELP_PUBLIC` set as below; ready for `./deploy.sh`.

## Scope
- **In:** `help/routes-allowlist.json`, `help/en/family/invite.md`,
  `help/en/vault/where.md`, `legal/privacy.*.html` +
  `legal/datenschutz.de.html`, `site.config.mjs` (`HELP_PUBLIC`).
- **Out:** everything else.

## Requirements
1. **Allowlist:** add `/help`, `/help/topic/:topicId` and
   `/help/article/:articleId` to `never`, each with the reason "the help
   center itself". Check the exact strings against the app's
   `route_names.dart`.
2. **Family:** in `family/invite.md`, set `routes: /family, /family/invite`
   and `order: 1` (so it sorts first in its topic). Check that `family-children`
   still comes right after and that nothing else in the topic breaks.
3. **Documents / Photos:** in `vault/where.md`, remove `/documents` and
   `/photos` from `routes`. `vault-documents` and `vault-photos` already cover
   them. `vault-where` needs at least one route: keep `/documents` there
   **only if** removing it breaks the "every article has 1+ route" rule, and in
   that case give `vault-documents` `order: 1` instead so it wins. Afterwards
   the first article for `/documents` must be `vault-documents`, and for
   `/photos` it must be `vault-photos`. Put a one-off check in the report
   (`node -e` over `dist/help/en.json`).
4. **Privacy, app part:** in section **4 (Data the app processes)** of every
   `privacy.*.html` and `datenschutz.de.html`, add one short paragraph with
   this meaning (English binding, German authoritative, the rest faithful
   translations in each file's style):

   > **Help center feedback in the app (optional).** The app's help center
   > loads the help articles from our website (daili.app). If you tap "Was this
   > helpful?" or a help search finds nothing, the app sends an anonymous count
   > to our own server: which article and yes/no, or the search text, plus the
   > app version, the platform (iOS/Android) and the language. It is sent
   > without your account, without a device id and without a login token, so
   > we can't link it to you. We delete it after 180 days. Legal basis: our
   > legitimate interest in useful help (Art. 6(1)(f) GDPR).

   Keep "Last updated" at 24 September 2026 (it's already today's date; check
   every file says it).
5. **`HELP_PUBLIC` stays `false`** (Ammar decides separately when the web
   help goes public). `en.json` is built either way. Just confirm
   `dist/help/en.json` exists and lists every live article.

## Constraints
- `npm run build` green (all guards). Self-correct up to 2 tries.
- File-write tool, never heredocs; check `wc -c`.
- Don't touch `../familyplanner-app`.
- Leave unrelated uncommitted files alone.

## Verify
- `npm run build` (report the help line).
- `node -e` over `dist/help/en.json`: the first article for `/family` is
  `family-invite`, for `/documents` it's `vault-documents`, and for `/photos`
  it's `vault-photos`.
- `grep -c 'noindex' dist/help/index.html` → 0. The sitemap has `/help/`
  URLs. The footer has Help.
- `grep -L "2026-09-24" legal/privacy.*.html legal/datenschutz.de.html` →
  nothing.

## Commit & push
- This prompt, if untracked: `docs(plan): add help routes/privacy/publish prompt`.
- `feat(help): allow the app's help routes, fix Family/Documents/Photos help targets, app privacy paragraph, help center public`.
  Body: `Prompt: claude-prompts/2026-09-24/006-help-app-routes-privacy-publish.md`.
- **Push now.**

## Report
`claude-reports/2026-09-24/006-help-app-routes-privacy-publish.md`:
- the `node -e` output;
- the English and German paragraph;
- the footer/sitemap/noindex checks;
- SHA.
- **Open item for Ammar:** run `./deploy.sh`, then check
  `curl -sI https://daili.app/help/en.json` → `200` with
  `cache-control: public, max-age=300`, and open https://daili.app/help/.
