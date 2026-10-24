# 001 — Full app check S0: baseline scans (daili-website)

Measured only. No fixes, nothing installed, no source or content changed. `dist/` was rebuilt, but it is git-ignored.

## 🔴 Look at this first
Nothing critical.

## Versions
- node v24.15.0, npm 11.12.1
- Direct dependencies: **none**. `package.json` has no `dependencies` or `devDependencies` ("Zero dependencies on purpose"), and there is **no `package-lock.json`**. `static/assets/vendor/gsap.min.js` is a vendored file, so npm doesn't track it.

## npm audit
`npm audit --json` → `ENOLOCK` (needs a lockfile). With zero dependencies there is nothing to audit. Counts: 0 critical / 0 high / 0 moderate / 0 low.

## npm outdated
`npm outdated --json` → `{}`. No direct dependencies, so no major jumps.

## osv-scanner / gitleaks
- osv-scanner 2.7.0 is installed. `scan --lockfile package-lock.json` fails because the file doesn't exist. `scan source -r .` → "No package sources found". 0 findings.
- gitleaks 8.30.1 is installed. `detect --no-banner --redact -v` → 311 commits, ~12.6 MB scanned, **no leaks found** (0 findings).

## Build
`node build.mjs` exit 0. Last line: `help id: 1 picture(s) in English (listed gaps, help/media-gaps.json)`. I ran `build.mjs` directly, not the full `npm run build` chain with its checks.
- `dist/`: **3258 HTML pages**, **205M** total.

## Counts
- Help: `help/en` has 95 article `.md` files (plus `_ui.json`). All 25 language folders (bg cs da de el en es fi fr id it ja ko nb nl pl pt ro sk sv th tr uk zh-Hans zh-Hant) have 95, so none differ.
- Blog: 27 source posts (`blog/*.en.html`). `dist/blog/` has 28 `index.html` files (27 posts + the index).
- HTML pages in `dist/` with plain `http://` links (w3.org and schema.org excluded): **0**. Non-HTML files with `http://` are namespace or licence URLs only: sitemaps.org schema (sitemap.xml), scripts.sil.org/OFL (fonts LICENSE.txt), c2pa.org/manifest (inside qr.svg), plus w3.org in feed.xml and gsap.min.js.
- Pages without `<meta name="description"`: **0**.
- `<img` tags without `alt=`: **0** of 9590.

## Security headers (fact only)
They are set in `static/.htaccess`, which is copied to `dist/.htaccess`. There is no `_headers` file and no CSP `<meta http-equiv>` in the templates.
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: SAMEORIGIN`
- `Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=(), usb=()`
- `Strict-Transport-Security: max-age=31536000` (no includeSubDomains/preload)
- `Content-Security-Policy`: `default-src 'self'`. `script-src` is `'self'` plus a build-time sha256 hash (placeholder `__CSP_SCRIPT_HASHES__`). Also `style-src 'self' 'unsafe-inline'`, `img-src 'self' data:`, `font-src 'self'`, `connect-src https://api.daili.app`, `frame-src 'none'`, `object-src 'none'`, `base-uri 'self'`, `form-action https://api.daili.app`, `frame-ancestors 'self'` and `upgrade-insecure-requests`.
- Cache-Control rules: no-cache, 300 s, 1 h, 7 d, 30 d, and 1 y immutable.
- `static/help/.htaccess` only grants access to the `<lang>.json` files and sets no headers.

## Big files (>1 MB, input for S18)
- `dist/sitemap.xml` 8.3M (3256 URLs). This is the only file over 1 MB in `static/` or `dist/`. It is under the 50 MB / 50k URL sitemap limit.

## Help impact
none.

## SHA
See the commit `docs(report): S0 baseline scan (website)` (pushed to origin/main).
