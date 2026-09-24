# 006 — App help routes, "?" targets, app privacy paragraph

Prompt: `claude-prompts/2026-09-24/006-help-app-routes-privacy.md`
(the prompt's commit body and report path say `…-privacy-publish.md`, but the file is
`…-privacy.md`, so the commit and this report use the real name).

Commits: `docs(plan)` prompt, then **`d19b39e`** `feat(help): …`. Pushed to `main`.

## What changed

- **Allowlist:** `/help`, `/help/topic/:topicId`, `/help/article/:articleId` are now in
  `never`, each with "The help center itself." I checked the strings against `RoutePaths` in
  the app's `route_names.dart` (`help`, `helpTopicTemplate`, `helpArticleTemplate`).
- **Family:** `family-invite` now has `routes: /family, /family/invite` and `order: 1`. The
  other family articles have no `order`, so they sort by title after it:
  `family-invite, family-children, family-groups, family-roles, family-activity`.
  `family-children` comes right after it, as required.
- **Documents / Photos:** `routes` is a required key, and an empty value is an error
  (`help-lib.mjs:25` and `:263`), so `vault-where` can't lose both routes. It keeps
  `/documents` and drops `/photos`. `vault-documents` now has `order: 1`, and `vault-where`
  moved from 1 to 2, because two articles with `order: 1` would fall back to sorting by title.
  `vault-photos` stays 3. The Vault topic now reads
  `vault-documents, vault-where, vault-photos`.
- **Privacy:** added one paragraph to section 4, after "Newsletter" and before "What the app
  does not collect", in all 27 `privacy.*.html` files and in `datenschutz.de.html`. Each
  translation quotes the app's own "Was this helpful?" label from that locale's
  `app_*.arb`. The app has no ar, hi or ru strings, so it shows English there, and those
  three files quote "Was this helpful?". The citation style and quote marks match each
  file's existing website help-feedback paragraph.
- **`HELP_PUBLIC` stays `false`** (requirement 5). `site.config.mjs` wasn't touched.

## Verify

`npm run build` → green. The help lines:

```
help OK · 64 article(s) · 57 app routes checked
test-check-help OK · 59 cases (1 clean fixture + every guard rule planted and caught)
help: 64 of 64 article(s) on pages (live 1.6.0) · 11 topic(s) · en.json 64 articles, 9 tips, 6 checklist · noindex preview
build OK · 210 pages · 114 in hreflang clusters
```

(The only other output is the existing content length-ratio warnings, which I didn't change.)

`node -e` over `dist/help/en.json` (first article in file order whose `routes` contains the route):

```
/family -> family-invite
/documents -> vault-documents
/photos -> vault-photos
family topic: family-invite, family-children, family-groups, family-roles, family-activity
vault topic: vault-documents, vault-where, vault-photos
articles: 64
```

`dist/help/en.json` exists and lists all 64 articles (64 `.md` files in `help/en`).

`grep -L "2026-09-24" legal/privacy.*.html legal/datenschutz.de.html` → nothing. Every file
still says 24 September 2026.

### Footer / sitemap / noindex: not public, as decided

The prompt conflicts with itself here. Requirement 5 says `HELP_PUBLIC` **stays `false`**,
but the Verify section, the commit subject ("help center public") and the "open
https://daili.app/help/" item all assume it's `true`. I followed requirement 5. So, as
expected:

- `grep -c noindex dist/help/index.html` → **1** (not 0)
- `/help/` URLs in `dist/sitemap.xml` → **0**
- footer Help link → **none**

I left "help center public" out of the commit subject. Making it public is one line:
`HELP_PUBLIC = true` in `site.config.mjs`, then build and deploy.

## The paragraph

**English (binding):**

> **Help center feedback in the app (optional).** The app's help center loads the help
> articles from our website (daili.app). If you tap "Was this helpful?" or a help search finds
> nothing, the app sends an anonymous count to our own server: which article and yes/no, or
> the search text, plus the app version, the platform (iOS/Android) and the language. It is
> sent without your account, without a device id and without a login token, so we can't link
> it to you. We delete it after 180 days. Legal basis: our legitimate interest in useful help
> (Art. 6(1)(f) GDPR).

**German (authoritative, `datenschutz.de.html`):**

> **Feedback im Hilfe-Center der App (freiwillig).** Das Hilfe-Center der App lädt die
> Hilfe-Artikel von unserer Website (daili.app). Wenn du auf „War das hilfreich?“ tippst oder
> eine Suche in der Hilfe nichts findet, sendet die App eine anonyme Zählung an unseren eigenen
> Server: welcher Artikel und ja/nein, oder den Suchtext, dazu die App-Version, die Plattform
> (iOS/Android) und die Sprache. Sie wird ohne dein Konto, ohne Geräte-ID und ohne
> Anmelde-Token gesendet, deshalb können wir sie dir nicht zuordnen. Nach 180 Tagen löschen
> wir sie. Rechtsgrundlage: berechtigtes Interesse an einer nützlichen Hilfe (Art. 6 Abs. 1
> lit. f DSGVO).

## Open items for Ammar

1. **Run `./deploy.sh`.** The app build needs `https://daili.app/help/en.json` to be live
   before it ships, and `en.json` is built whether `HELP_PUBLIC` is true or false. Then check
   `curl -sI https://daili.app/help/en.json` → `200` with
   `cache-control: public, max-age=300`.
2. **Decide on `HELP_PUBLIC`.** While it's `false`, https://daili.app/help/ opens but is
   `noindex`, with no footer link and no sitemap entries.
