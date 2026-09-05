# 015 — legal pages: corrections, the web app, and 23 languages

Prompt: `claude-prompts/2026-09-05/015-legal-pages-23-locales.md`
Commit: `0cea166`

Prerequisite checked first: 014 `7fbf72d` is on `main`. Nothing was blocked.

## What shipped

Privacy and Terms are now 23-locale documents with corrected bodies and a new
web-app section. The Impressum lost its dead EU-ODR paragraph.

| File | What changed |
|---|---|
| `legal/privacy.en.html`, `legal/datenschutz.de.html` | new section 3 "The web app (app.daili.app)", sections renumbered 4–9, export path corrected, new final section "Language", subtitle now names `app.daili.app` |
| `legal/terms.en.html`, `legal/nutzungsbedingungen.de.html` | §2 names both platforms and the phone-only vault, §6/§8 paths corrected, new §11 "Language" |
| `legal/impressum.de.html` | "Online-Streitbeilegung" paragraph deleted. Nothing else touched |
| `legal/{privacy,terms}.<loc>.html` | **42 new files** — fr es it nl pt sv da nb pl cs fi tr id ja ko zh-Hans zh-Hant th ru hi ar |
| `site.config.mjs` | `PAGES.privacy` / `PAGES.terms` are `locales: 'all'`; new `LEGAL_BODIES(id, deFile)` builds the 23-entry body map; `out` keeps the four flat URLs and puts the rest under `<loc>/` |
| `build.mjs` | `renderFooterLinks` resolves Privacy/Terms through the page objects instead of a two-arm `de`/else ternary |
| `static/assets/style.css` | one rule: `.legal .translated` (muted, .88rem) |
| `tools/check-legal.mjs` | **new** guard, wired in as the second link of `npm run build` |
| `README.md` | `legal/` row, store-URL note, the guard, and the Impressum open question |

`build.mjs` needed no change for body resolution: it already reads `pg.body[loc]`,
so a 23-entry object works as-is, exactly as the prompt preferred.

## The web-app paragraph, as written (EN)

> Daili also runs in a browser at app.daili.app. It sets **no cookies** and uses
> **no analytics**. Fonts are served from our own server, so the web app loads
> **no third-party fonts or scripts** when it starts.
>
> Instead of a cookie, your browser keeps your sign-in token in its own **local
> storage**. That token is what proves to our server that a request is yours, and
> signing out deletes it. Beside it the browser stores a handful of display
> settings so the app looks the same next time: your language and theme, the
> calendar view you last used, which tiles you show on the home screen, whether
> the sidebar is collapsed, and your default reminder time. Those settings stay on
> your device, are never sent to us, and remain until you clear your browser's
> site data. Everything kept here is either strictly necessary to sign you in or a
> preference you set yourself, which is why there is no cookie banner.
>
> **Sign in with Google or Apple (optional).** Only if you choose social sign-in
> does a pop-up run through Firebase Authentication, exactly as in the phone app.
> If you sign in with an e-mail address and password, no Google or Apple code runs
> at all.
>
> **Browser notifications (optional).** Only if you switch them on and your
> browser grants permission does the web app register a service worker and obtain
> a device token from Firebase Cloud Messaging. That token and its device number
> are then kept in local storage, and a copy of your sign-in token is kept in the
> browser's database (IndexedDB) so that the buttons on a notification still work
> when no Daili tab is open. Turning notifications off, or signing out, removes
> all of it.

### The source files it rests on

Read in `~/development/flutter_projects/familyplanner/daili-web`:

| Claim | Source |
|---|---|
| no cookies | `src/api/token.ts` header — Sanctum bearer tokens, `config/cors.php` has `supports_credentials => false`. `grep document.cookie src/ public/` returns nothing |
| sign-in token in local storage, deleted on sign-out | `src/api/token.ts` (`daili.token`, `clearToken()`); `src/auth/AuthProvider.tsx` `signOut` calls `retireDevice()` then `clearToken()` |
| language, theme | `src/i18n/preference.ts` (`daili.language`), `src/theme/ThemeProvider.tsx` (`daili.theme`) |
| calendar view, home tiles, sidebar, reminder time | `src/features/calendar/useCalendarView.ts`, `src/features/dashboard/tilePreferences.ts`, `src/features/shell/sidebarCollapse.ts`, `src/lib/reminderTimePreference.ts` |
| fonts from our own origin | `src/index.css` lines 24–32 — `@fontsource` imports, with the comment that this repo refuses fonts from Google's servers; `CLAUDE.md` §"Fonts are self-hosted" |
| no analytics | `grep -rn 'analytics\|gtag\|plausible\|posthog\|sentry' src public index.html package.json` returns nothing |
| social sign-in only if chosen | `src/auth/socialPopup.ts` (Google and Apple, lazily) |
| push only if allowed, and the service worker is real | `src/push/messaging.ts` registers `/firebase-messaging-sw.js`; `public/firebase-messaging-sw.js` exists and handles the messages; `public/.htaccess` line 60 serves it |
| the IndexedDB copy of the token | `src/push/swStore.ts` — the page mirrors the bearer token into IndexedDB (`daili-push`) because a service worker cannot read `localStorage`; written on device registration, cleared by `retireDevice` |
| push token + device id in local storage | `src/push/deviceStore.ts` (`daili.push.token`, `daili.push.deviceId`) |

### One correction to the prompt's assumption

The prompt asked for "removed on sign-out" about local storage as a whole. The
code does not do that: `signOut` removes the sign-in token and retires the push
device (token, device id, IndexedDB mirror), and **leaves the display
preferences in place**. The paragraph says so — they stay until the reader clears
site data — rather than repeating a promise the code does not keep. Nothing was
dropped from the prompt's list otherwise: every sentence it asked for is
supported by a file above.

Terms §8 keeps "Settings → Profile → Delete account" as written. Worth knowing:
account deletion is **phone-only** — `src/features/profile/AccountCard.tsx`
deliberately has no delete row on web, only a line saying where it lives. The
sentence says "in the app", which is accurate.

## The guard, and the proof it can fail

`tools/check-legal.mjs` runs on sources, before `build.mjs`, and checks per legal
id × 23 locales: the body file exists; the `<h2>` count equals English; it
contains `support@daili.app`; non-en/de bodies carry `class="translated"` and a
link to the English page (and en/de must **not** carry the note); no body contains
`FamCanvas` or any `BRAND_TRANSLITERATIONS` entry; the date matches English.

The date is compared through `<time datetime="2026-09-05">` inside the `.updated`
line — the one deviation from the prompt's wording, and the reason for it: the
visible date is localised ("5 September 2026", "5. September 2026", "2026年9月5日"),
so the printed strings cannot be byte-equal, and a month-name table for 23
languages would have to be rewritten on every update. The `datetime` attribute is
standard HTML, invisible, and identical in all 46 bodies. `grep -c` confirms 46
occurrences of `datetime="2026-09-05"`.

Proven by breaking it — one `<h2>` removed from `legal/privacy.fr.html`, then
restored:

```
$ node tools/check-legal.mjs
1 legal error(s):
legal/privacy.fr.html              has 9 <h2> sections, English has 10 — the translation is not the same document
$ echo $?
1
```

After restoring: `legal OK · 2 document(s) × 23 locale(s)`, exit 0.

## Numbers

```
content OK · 23 locale(s) · 176 keys each
legal OK · 2 document(s) × 23 locale(s)
built 108 pages · 23 locale(s) · 106 sitemap entries
build OK · 108 pages · 94 in hreflang clusters
detector OK · 32 cases · 23 locale(s) built
```

108 pages, up from 66. Sitemap: **46 legal URLs, each with 23 `xhtml:link`
alternates** plus `x-default` (measured from `dist/sitemap.xml`). The language
chip on `/fr/privacy.html` has 23 entries and every one points at a privacy page —
`/datenschutz.html` for German, `/privacy.html` for English, `/<loc>/privacy.html`
for the rest; none falls back to a landing page any more. The footer on
`/fr/privacy.html` now links `/fr/privacy.html` and `/fr/terms.html`.

The eight `check-content` length-ratio warnings are pre-existing and unrelated to
this prompt (they are `content/*.json` strings, untouched here).

## Screenshots

`claude-reports/2026-09-05/shots/015-privacy-390.png` and
`015-ar-terms-390.png`. Captured in headless Chrome through a 390 px iframe: a
plain `--window-size=390` capture clips, and it clips on untouched pages too, so
it is the capture method and not the layout. `/ar/terms.html` renders `dir="rtl"`
correctly — mirrored header, right-aligned prose, `Daili`, `app.daili.app` and
`support@daili.app` staying LTR inside it.

## Translation notes

- Feature vocabulary comes from `content/glossary.md` where the app has a
  translation (11 locales) and from the `features.*.eyebrow` keys in
  `content/*.json` for the twelve that do not.
- The in-app paths ("Settings → Profile → Download my data") are the app's own
  strings, read from `familyplanner-app/lib/l10n/app_<loc>.arb`
  (`profileExportTile`, `profileDeleteTile`, `settingsTitle`, `profileTitle`) for
  the 11 locales the app has, and rendered naturally for the other twelve.
- `Daili`, `app.daili.app`, `support@daili.app` and `dsb.gv.at` are Latin in all
  46 bodies; the guard enforces this against `BRAND_TRANSLITERATIONS`.
- Legal terms use each language's own GDPR wording ("Verantwortlicher",
  "responsable du traitement", "rekisterinpitäjä", "المسؤول عن المعالجة", …).
- Within a translated page, cross-references point at the same locale
  (`/fr/terms.html` → `/fr/privacy.html`); only the binding-language note at the
  top points at the English original. `/impressum.html` is linked as-is
  everywhere — it is German-only by design.

## Owner actions

1. **`./deploy.sh`.** Nothing was deployed. 42 new pages and four rewritten ones
   are waiting in the repo.
2. **Have a lawyer glance at the translated legal pages.** The binding-language
   clause in each one limits the risk but does not remove it: a reader in France
   still reads the French page as the policy. This is not legal advice.
3. **Decide the Impressum business-identity question.** § 5 ECG may require the
   Gewerbe, the WKO membership and the supervising authority (Bezirkshauptmannschaft
   / Magistrat) to be named. Whether it applies depends on whether the operation is
   a registered Gewerbe, which is your fact, not the site's — so nothing was
   guessed and nothing was added. `README.md` now carries it as an open item in
   place of the ODR entry.
