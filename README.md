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
| `legal/` | Privacy, Terms and Impressum bodies. Hand-written, English + German only, deliberately outside the translation pipeline. |
| `static/` | Copied verbatim into `dist/` — CSS, JS, images, and `.htaccess`. |
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
  locales, the detector appears in exactly one file, and the CSP hash matches the
  inline script it authorises.
- **`test-detector.mjs`** — runs the detector that actually ships in
  `dist/index.html` against a stubbed browser. Chrome's `--lang` flag does **not**
  change `navigator.languages`, so this cannot be checked by hand in a browser.

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
  redirects, and `deploy.sh` asserts all three return 200.
- **English is served from `/`, not `/en/`** — that is where the existing search
  ranking lives. `/en/` 301s to `/`.
- **Chinese directories are lowercase** (`/zh-hans/`) while the `hreflang`
  attribute keeps proper casing (`zh-Hans`). Filesystems are case-sensitive;
  Google is not.
- **The language preference is written to `localStorage` only on an explicit
  click**, never on auto-detection. That distinction is what keeps the site
  inside the "strictly necessary" exemption and free of a consent banner.
  `test-detector.mjs` enforces it.

## Known open items

- `stores.ios.url` in `site.config.mjs` is marked `verified: false`. As of
  2026-08-17 that App Store ID returned 404 in every storefront and the iTunes
  lookup API returned no results. The build prints a warning. Change the one line
  and rebuild when the real listing exists.
- `impressum.html` links to the EU ODR platform, which ceased operating on
  20 July 2025. The reference is obsolete and should be removed — flagged rather
  than silently edited, because it is a legal page.
- Native review of the translations has not happened.
