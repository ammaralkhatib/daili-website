# Redesign 5/5 — legal pages: corrections, the web app, and 23 languages

## Goal

Privacy Policy and Terms are English + German only and both contain wrong or
missing information. This prompt (a) corrects the English and German bodies,
(b) adds the web app (app.daili.app) to both, (c) removes the dead EU-ODR
reference from the Impressum, and (d) publishes Privacy + Terms in **all 23
site locales**, each translation carrying a note that the English version is
the binding one (Ammar's decision 2026-09-05; the what's-new page stays EN+DE
by locked decision — do not touch it).

Done = `npm run build` clean; `/privacy.html`, `/datenschutz.html`,
`/terms.html`, `/nutzungsbedingungen.html` unchanged in URL (they are printed
in the store listings) and corrected; `/<loc>/privacy.html` + `/<loc>/terms.html`
exist for the other 21 locales; the hreflang clusters for `privacy` and `terms`
have 23 members each; the language chip on a legal page links to the same page
in every language (never to the landing page any more); a guard proves every
translation is structurally complete.

## Scope

- **In:** `legal/*.html` (edit 4, add 42), `site.config.mjs` (`PAGES.privacy`,
  `PAGES.terms`), `build.mjs` only if body resolution needs a function
  (`body: (loc) => …` — the current code indexes `pg.body[loc]`, so an object
  with 23 entries works without code changes; prefer that), `templates/legal.html`
  (one conditional for the translation note), `tools/check-build.mjs` (guard),
  `README.md` (legal section). **Out:** content JSON, landing page, blog,
  what's-new, `.htaccess`, deploy. **Never run `./deploy.sh`.**

## Requirements

1. **Read the web app first** (`~/development/flutter_projects/familyplanner/daili-web/src`):
   confirm what it stores in the browser (sign-in token / language / theme in
   `localStorage`?), whether it registers web push (`public/firebase-messaging-sw.js`
   exists — check it is actually used), and that it loads fonts from its own
   origin. Write the privacy paragraph from what the code does, not from this
   prompt's assumption; quote the file names in the report.

2. **Privacy (`privacy.en.html` + `datenschutz.de.html`)**
   - Subtitle line: "Daili app, app.daili.app and daili.app · Last updated: <today's date>".
   - New section after "2. This website": **"The web app (app.daili.app)"** —
     no cookies; what is kept in local storage and why (strictly necessary,
     removed on sign-out); fonts from our own server; no analytics; social
     sign-in pop-up via Firebase Authentication only if chosen; browser push
     via Firebase Cloud Messaging only if allowed (drop any sentence the code
     does not support). Renumber the sections.
   - "3. Data the app processes": leave the **Connected calendars** paragraph
     word-for-word (Google's OAuth reviewers are reading it right now). Add to
     "What the app does not collect" nothing new.
   - "5. How long we keep data": export path is "Settings → Profile → Download my data".
   - Add a final short section **"Language"**: "This policy is written in English and German. Translations into other languages are provided for convenience; if they differ, the English version applies." (German: same meaning, `du`-register as the rest of the page.)
   - German mirrors every change (same sections, same order).

3. **Terms (`terms.en.html` + `nutzungsbedingungen.de.html`)**
   - Subtitle as above with today's date.
   - "2. What Daili is": "… Daili is available as an app for iPhone and Android and as a web app at app.daili.app; photos and documents are a phone-only feature." (keep the rest).
   - "6. Availability" and "8. Ending things": paths are "Settings → Profile → Download my data" and "Settings → Profile → Delete account".
   - New "11. Language" section with the same binding-language sentence.

4. **Impressum (`impressum.de.html`)**: delete the "Online-Streitbeilegung"
   paragraph (the EU ODR platform closed on 20 July 2025; README already flags
   it). Change nothing else — whether the business identity (Gewerbe, WKO,
   Behörde per § 5 ECG) must be added is Ammar's decision; put it in the
   report as an open question, do not guess.

5. **21 translations each** of the corrected privacy and terms bodies:
   `legal/privacy.<loc>.html` and `legal/terms.<loc>.html` for
   fr es it nl pt sv da nb pl cs fi tr id ja ko zh-Hans zh-Hant th ru hi ar.
   Rules: identical section structure (same number of `<h2>`, same order, same
   links, same `<strong>` emphasis), plain language, the app's feature names
   from `content/glossary.md`, `Daili` / `app.daili.app` / `support@daili.app`
   / `dsb.gv.at` never translated or transliterated (`BRAND_TRANSLITERATIONS`
   applies), legal terms rendered in the usual local wording (e.g. "Verantwortlicher"
   → each language's GDPR term), `dir="rtl"` handled by the layout as today.
   Each translated body starts with
   `<p class="translated">` + that language's version of: "This is a
   translation for your convenience. The English version is the binding one:"
   + link to `/privacy.html` (or `/terms.html`). German has no such note (it
   is an authoritative version).

6. **`site.config.mjs`**: `PAGES.privacy` and `PAGES.terms` become
   `locales: 'all'` with a 23-entry `body` map and
   `out: (loc) => loc === 'en' ? 'privacy.html' : loc === 'de' ? 'datenschutz.html' : \`${loc.toLowerCase()}/privacy.html\``
   (terms: `terms.html` / `nutzungsbedingungen.html` / `<loc>/terms.html`).
   Cluster names unchanged → the hreflang set grows to 23 automatically;
   `renderLangNav`'s "page exists in locale" rule now links legal pages
   across languages; footer links resolve per locale (check
   `renderFooterLinks` picks the locale's own page).

7. **Guard** (`check-build.mjs` or a new `tools/check-legal.mjs` wired into
   `npm run build`): for each of the two legal ids and each of the 23 locales:
   body file exists; `<h2>` count equals the English count; contains
   `support@daili.app`; non-en/de bodies contain `class="translated"` and a
   link to the English page; no body contains `FamCanvas` or a brand
   transliteration; the "Last updated" date string is the same in all 23.
   **Prove it can fail** (drop one `<h2>` in `privacy.fr.html`, run, restore).

## Constraints

- The four flat legal URLs never move. `/impressum.html` stays German-only,
  `noindex`, no cluster.
- What's-new stays EN+DE. Blog untouched.
- Do not restyle the legal pages beyond what 014's shared CSS already did;
  if `.translated` needs a rule, add one (muted, small, top of the body).
- Self-correct up to 2 attempts, then `blocked`.

## Verify

- `npm run build`; open `/privacy.html`, `/datenschutz.html`, `/fr/privacy.html`,
  `/ar/terms.html`, `/ja/privacy.html`; confirm the chip on `/fr/privacy.html`
  lists 23 entries all pointing at a privacy page; sitemap contains 46 legal
  URLs with 23 alternates each; screenshots of `/ar/terms.html` (rtl) and
  `/privacy.html` at 390 px.

## Commit & push

- `feat(legal): corrected privacy + terms with the web app, in 23 languages`
  — body `Prompt: claude-prompts/2026-09-05/015-legal-pages-23-locales.md`.
  **Push now.**

## Report

- `claude-reports/2026-09-05/015-legal-pages-23-locales.md`: the web-app
  paragraph as written (EN) with the source files it rests on, the proven guard
  failure, the sitemap count, and owner actions: (1) `./deploy.sh`; (2) have a
  lawyer glance at the translated legal pages — the binding-language clause
  limits the risk but does not remove it (this is not legal advice); (3) the
  Impressum business-identity question.
