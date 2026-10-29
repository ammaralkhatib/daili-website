# SEO quick fixes — legal titles, site-name schema, screenshot alt text, hero layout shift, breadcrumbs

## Goal

Small technical SEO fixes from the 2026-10-29 SEO check (Project doc `claude/seo-check-2026-10-29.md`; Search
Console + PageSpeed + a scan of `dist/`). Done = parts 0–6 below, `npm run build` green, every new guard proven to
fail. **Do not deploy** — Ammar runs `./deploy.sh` after Planning Claude checks the result.

## 0. Unblock the build first

`node tools/check-help.mjs` is red today: the app's HEAD has four routes with no help article —
`/settings/wall-display`, `/settings/wall-display/connect`, `/settings/wall-display/connect/scan`,
`/settings/wall-display/screens` (the app's wall-screen settings, they ride the next app release). Add these four to
`"pending"` in `help/routes-allowlist.json`, reason: "wall display in the app — article at the next release help
sync". Nothing else in `help/`.

## 1. Legal pages get their own title and description

Today Privacy and Terms (all 28 locales, incl. `/datenschutz.html` and `/nutzungsbedingungen.html`) and the Impressum
print the HOME page's `<title>`, meta description, og:title and og:description (`build.mjs` ~1490: `titleKey` falls
back to `'title'`). Google sees 50+ pages with the home title.

- **Title** = the legal body's own `<h1>` text + ` — Daili` ("Privacy Policy — Daili", "Datenschutzerklärung —
  Daili", "プライバシーポリシー — Daili"). Read it from the body file; the build throws if a body has no `<h1>`. No new
  translations for titles.
- **Description:** two new keys `meta.privacyDescription` and `meta.termsDescription` in all 28 `content/<loc>.json`
  (en.json gets `@`-descriptions, maxLength 155, like `meta.description`). One plain sentence each, e.g. en "How Daili
  handles your family's data: what is stored, why, for how long, and your rights." / "The rules for using Daili: your
  account, your family's content and Daili Plus." Every claim must be true of `legal/privacy.en.html` /
  `terms.en.html` — read them first and adjust. Translations follow the content rules (check-content enforces them).
- **Impressum** (German only, noindex): a German literal on its PAGES entry (title "Impressum — Daili" + one short
  German description) — not content keys, it renders in one locale only.
- og:title / og:description use the same values. Bodies, URLs and `check-legal` stay untouched.

## 2. Site name + organization schema (home)

On the ROOT landing page only (`https://daili.app/`), add two JSON-LD blocks next to the existing
SoftwareApplication + FAQPage (`build.mjs` ~1340):

- `WebSite`: `@id` `https://daili.app/#website`, name `Daili`, alternateName `daili.app`, url `https://daili.app/`,
  publisher `{ "@id": "https://daili.app/#organization" }`.
- `Organization`: `@id` `https://daili.app/#organization`, name `Daili`, url, logo as an ImageObject
  (`/assets/img/logo.webp`, 512×512), `sameAs` = the store URLs that are `available` (same filter as `installUrl`).
- The existing SoftwareApplication on EVERY landing page gets `publisher: { "@id": "https://daili.app/#organization" }`.
  Still no aggregateRating (the comment there stays true).

Why: helps Google show "Daili" as the site name. Google reads site names from the domain root only, so the locale
homes do not need the WebSite block.

## 3. Alt text on the home page's app screenshots

The hero phone (`img.hs`, `build.mjs` ~691) and the flow phone (`img.sx`, ~828) print `alt=""` on 19 app screenshots
per page. Use the existing `home.alt.<shot>` strings (every locale has them — no new translations). The phones stay
`aria-hidden="true"` (screen readers keep skipping them; this is for Google Images). Watch screenshots (`img.ws`),
photos, Minzi and avatars stay `alt=""`. A missing `home.alt.<shot>` key is a build error, never an empty fallback.

## 4. Home page layout shift (CLS)

PageSpeed mobile, 2026-10-29: CLS **0.16** (good is < 0.1). Culprits: the hero `div.stage[data-stage]` (0.155) and
`p.lead` (0.005); the requests listed are the Figtree woff2 files (latin 400/500/600/700, `font-display: swap`). The
stage has a fixed height (`home.css` ~127/564), so it most likely moves because the text ABOVE it re-wraps when
Figtree swaps in. Get CLS under 0.1 with no visible change once the page has loaded. Tools to choose from — keep what
the numbers prove:

- `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the Figtree files used above the fold, only on
  locales that render Figtree latin (README "Fonts": ja, ko, zh-*, th, hi, ar load no Figtree — no preload there);
- a metric-matched fallback face (`size-adjust` / `ascent-override` / `descent-override` on a `local()` system font)
  placed in `--sans` right after Figtree;
- reserving height for the hero text block.

Rules: fonts stay self-hosted, unversioned paths that match the `@font-face` URLs exactly; `font-src 'self'` and
check-build section 13 stay green; no Google Fonts.

Measure before and after against `npm run serve`, e.g.
`npx --yes lighthouse@13 http://localhost:8080/ --only-categories=performance --output=json --quiet
--chrome-flags="--headless=new"` → `audits["cumulative-layout-shift"].numericValue`; 3 runs each, report the median
(also LCP). If Lighthouse cannot run on this Mac, say so in the report — Ammar checks PageSpeed after the deploy.

## 5. Breadcrumb schema on help and feature pages

One `BreadcrumbList` JSON-LD block in `<head>`, built from the same strings the page shows:

- help article: Daili (that locale's home) › Help (`ui.crumbHelp`) › topic title › article title;
- help topic page: Daili › Help › topic; help home: Daili › Help;
- feature page: Daili › feature name (its H1).

Every `item` is an absolute URL; the last one equals the page's own canonical. 🔴 Never put it inside
`[data-feature-sheet]`: `home.js` fetches that element into the home page's popup.

## 6. Guards (`tools/check-build.mjs`, new numbered sections)

a. **Unique titles:** among indexable pages of one locale, no two share a `<title>`. If a real case needs an
   exception (expected: none), allowlist it by file path with a one-line reason; a stale entry fails too.
b. **JSON-LD:** every `<script type="application/ld+json">` parses and has `@context` + `@type`; every help and
   feature page has exactly one `BreadcrumbList` whose last item is its canonical; root `index.html` has exactly one
   `WebSite` and one `Organization`; no other page has a `WebSite` block.
c. **Screenshot alt:** on every page, an `<img>` whose src is under `/assets/img/shots/` and is not `shot-watch-*`
   has a non-empty `alt`.
d. **Legal titles:** each legal page's `<title>` starts with the text of its own `<h1>`.

Prove each guard can fail: put the bug back (an empty alt on one hero shot, a duplicate title, a wrong last
breadcrumb URL, the home title on privacy), see check-build go red, restore, and confirm `git diff` shows only your
intended changes. One line per guard in the report.

## Scope

- In: `build.mjs`, `templates/*` if needed, `static/assets/style.css` / `home.css` (part 4), `content/*.json` (the
  two meta keys only), `site.config.mjs` (Impressum literal), `tools/check-build.mjs`, `help/routes-allowlist.json`
  (part 0 only), `README.md` (one line under "The guards" for the new sections), this prompt file.
- Out: feature page words and titles (a later lane rewrites them), the home H1, blog, help articles, legal bodies,
  URLs and slugs, `.htaccess`, `deploy.sh`. The untracked `static/assets/img/photos/` is not yours — leave it.

## Verify

`npm run build` green, route check NOT skipped. In `dist/`, spot-check en + de + ja: the privacy/terms titles and
descriptions (`privacy.html`, `datenschutz.html`, `ja/privacy.html`), the root `index.html` JSON-LD, one help article's
and one feature page's breadcrumb, the hero alt in `de/index.html`. Lighthouse CLS + LCP before/after.

## Commit & push

`fix(seo): legal titles, site-name schema, screenshot alt, breadcrumbs, hero layout shift` — body
`Prompt: claude-prompts/2026-10-29/002-seo-quick-fixes.md`. Commit this prompt file with it. **Push. Do NOT run
`./deploy.sh`.**

## Report

`claude-reports/2026-10-29/002-seo-quick-fixes.md` (file-write tool; `wc -c` > 0), half a page: what changed per part,
the two new description sentences (en), CLS/LCP before → after, the guard proofs (red → green), the build line, SHA +
push. `## Help impact`: none.
