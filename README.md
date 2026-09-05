# daili.app — the marketing site

A static site built from templates plus one content file per language. No
runtime, no framework, and **zero npm dependencies** — `build.mjs` uses only the
Node standard library, so `git checkout <sha> && npm run build` reproduces any
past deploy years from now.

## Everyday use

```bash
npm run build     # check content -> build -> check output -> test the detector
npm run serve     # http://localhost:8080
./deploy.sh       # build, snapshot, upload, chown, smoke-test
```

`dist/` is gitignored. It is generated, and committing it would bury every
one-line copy change under a 20-file diff.

## Layout

| Path | What it is |
|---|---|
| `site.config.mjs` | Locales, endonyms, RTL set, store URLs, page manifest, feature/gallery/comparison structure. **The one file you edit to add a language.** |
| `content/<loc>.json` | Every translatable string. `en.json` is the source of truth and carries the `@`-descriptions. |
| `templates/` | The page shells. `{{ }}` escapes, `{{{ }}}` does not, `{{# }}` loops, `{{? }}` conditionals, `{{> }}` includes. |
| `legal/` | Privacy, Terms and Impressum bodies. Privacy and Terms exist in all 23 locales (`privacy.<loc>.html`, `terms.<loc>.html`); English is the binding version and every translation says so. German keeps its own filenames (`datenschutz.de.html`, `nutzungsbedingungen.de.html`) because it is an authoritative version, not a translation. Impressum stays German-only. |
| `static/` | Copied verbatim into `dist/` — CSS, JS, images, fonts, and `.htaccess`. |
| `static/assets/fonts/` | The two brand faces, self-hosted. See below. |
| `static/assets/img/shots/<loc>/` | The app screenshots, one set per language. Generated, committed. See below. |
| `tools/` | The three guards described below. |

## The guards

The build is `check-content → build → check-build → test-detector`, chained with
`&&`, so nothing broken can reach `deploy.sh`.

- **`check-content.mjs`** — every locale must have exactly English's keys, the
  same types, the same array lengths, the same placeholders and the same inline
  HTML tags. It also fails on a string left byte-identical to English, on a
  transliterated brand name, and on the string `FamCanvas`.
  A missing key is an **error**, never a silent fallback to English — silent
  fallback is how translations rot unnoticed.
- **`check-build.mjs`** — every internal link resolves, every `hreflang` pair is
  reciprocal with exactly one `x-default` per cluster, canonicals match their own
  path, `<html lang>` matches the directory, `dir="rtl"` appears only in RTL
  locales, the detector appears in exactly one file, the CSP hash matches the
  inline script it authorises, and every `@font-face` in the stylesheet the pages
  load points at a file that really exists under `dist/assets/fonts/` with
  nothing in the built tree mentioning Google Fonts.
- **`test-detector.mjs`** — runs the detector that actually ships in
  `dist/index.html` against a stubbed browser. Chrome's `--lang` flag does **not**
  change `navigator.languages`, so this cannot be checked by hand in a browser.

## Fonts

Two families, both self-hosted from `static/assets/fonts/`: **Sofia Sans
Condensed** for display (headlines, the `daili` wordmark, the language codes)
and **Figtree** for text. They are the same faces the app and the web app use.

The `.woff2` files are copied verbatim out of the `@fontsource` packages
(`figtree`, `sofia-sans-condensed`) in the web app's `node_modules`; both SIL
OFL licence texts are in `static/assets/fonts/LICENSE.txt`. Copied files, not a
dependency — this repo still has none.

Each `@font-face` in `static/assets/style.css` carries the `unicode-range` of
its subset, taken verbatim from the package's own CSS, so a Russian page fetches
the Cyrillic cut of the display face and nothing else. **Neither family has
Arabic, Thai, Devanagari or CJK glyphs**, so `/ar/`, `/th/`, `/hi/`, `/ja/`,
`/ko/` and the two Chinese builds match no range, download no font at all and
fall through to the system stack at the end of `--display` / `--sans`. That is
intended, and it is why the per-language line-height rules near the top of the
stylesheet still matter.

Never link Google Fonts back in. The CSP in `static/.htaccess` is
`font-src 'self'`, so it would fail silently in production, and check-build
section 13 fails it loudly here first. To add a weight or a subset, copy the
file in and add the `@font-face` with the range from the package.

## Screenshots

The phone screenshots are translated like everything else: `/de/` shows German
screens, `/ja/` shows English ones. They are generated from the store-screenshot
pipeline's plain captures in `../store-shots/raw/<store-locale>/` by
`python3 tools/make-site-shots.py` (Pillow, the one dependency that folder
already has — Node's standard library has no image support and this repo still
has no npm dependencies), which writes `static/assets/img/shots/<site-locale>/`
at 640 px wide. **The output is committed and the build never touches
`store-shots/`**, so a clone without the sibling folder still builds. `build.mjs`
resolves each `shot-*` name per file: the reader's locale if that file exists,
`shots/en/` if it does not, and an error if neither — which is what makes
`SHOT_LOCALE` in `site.config.mjs` the only thing to edit when a language gains
its own captures, and check-build section 14 the thing that notices when one
silently loses them. `shot-recipes`, `shot-photos` and `shot-documents` have no
demo-family capture yet and are English in every locale.

## Adding a language

1. `site.config.mjs` — add the code to `LOCALES`, its endonym to `endonyms`, and
   the code to `RTL` if it is right-to-left.
2. `content/<code>.json` — copy `en.json` and translate it.
3. `npm run build` — the checker names anything missed. Fix, rebuild.
4. `./deploy.sh`

Everything else is derived: the directory, the picker row, all hreflang clusters
(existing pages regain reciprocal links automatically), the sitemap, and the
detector's supported list. `.htaccess` needs no change — no rule names a locale
except the two Chinese lowercase fixes.

Below three locales the picker renders as a single pill, as it always did; at
three or more it becomes a `<details>` disclosure that works with no JavaScript.

## Things that will bite you

- **Plesk git deployment is set to `manual` on purpose.** It used to be `auto`,
  which checked the repo root out into `httpdocs` on every push and would
  overwrite everything `deploy.sh` uploads. If the live site ever mysteriously
  reverts after a push, check:
  `plesk ext git --info -domain daili.app -name daili.git`
- **`mod_expires` is not loaded** on this server. Cache headers must use
  `Header always set Cache-Control`, never `ExpiresByType`.
- **If Plesk's "serve static files directly by nginx" is switched on**, every
  `Header` rule in `.htaccess` silently stops applying. `deploy.sh` checks for
  this after every deploy; by hand it is
  `curl -sSI https://daili.app/assets/style.*.css | grep -i cache-control`.
- **These three URLs are printed in live store listings** and must never move:
  `/privacy.html`, `/datenschutz.html`, `/support.html`. They are real files, not
  redirects, and `deploy.sh` asserts all three return 200. `/terms.html` and
  `/nutzungsbedingungen.html` are flat for the same reason. Every other locale's
  legal pages live under its directory (`/fr/privacy.html`, `/ar/terms.html`).
- **English is served from `/`, not `/en/`** — that is where the existing search
  ranking lives. `/en/` 301s to `/`.
- **Chinese directories are lowercase** (`/zh-hans/`) while the `hreflang`
  attribute keeps proper casing (`zh-Hans`). Filesystems are case-sensitive;
  Google is not.
- **The language preference is written to `localStorage` only on an explicit
  click**, never on auto-detection. That distinction is what keeps the site
  inside the "strictly necessary" exemption and free of a consent banner.
  `test-detector.mjs` enforces it.
- **A legal translation is checked structurally, not linguistically.**
  `tools/check-legal.mjs` runs before the build and fails if any of the 46 legal
  bodies has a different `<h2>` count from English, is missing the binding-language
  note, or carries a different date. The date is compared through the
  `<time datetime="…">` inside the `.updated` line — the visible date is localised,
  that attribute is the one value that is identical in all 23. A translation with a
  section quietly missing does not look broken; it looks like a different policy,
  which is exactly what this guard exists to catch.

## Known open items

- `stores.ios.url` in `site.config.mjs` is marked `verified: false`. As of
  2026-08-17 that App Store ID returned 404 in every storefront and the iTunes
  lookup API returned no results. The build prints a warning. Change the one line
  and rebuild when the real listing exists.
- **Whether the Impressum has to name the business identity** (Gewerbe, WKO
  membership, supervising authority per § 5 ECG) is undecided. It is a legal
  question about the operator, not something the site can settle; the page ships
  without those lines until Ammar decides.
- Native review of the translations has not happened.
