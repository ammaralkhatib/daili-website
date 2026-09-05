# Redesign 2/5 — real screenshots, localized per page

Prompt: `claude-prompts/2026-09-05/012-real-screenshots.md`.
Commit `9205975`.
Build clean: `content OK · 23 locale(s) · 160 keys each` → `built 66 pages` →
`build OK · 66 pages · 52 in hreflang clusters` → `detector OK · 32 cases`.

**Nothing to deploy yet.** The landing body is still the old one; deploy after
014, as 011 said.

## What changed

The site's phone screenshots were test data — "amm 2h", "fdsfsd", "test real…"
— in one English set. They are now the store pipeline's demo family (The
Bergers / Familie Berger) in **14 languages**, resolved per page.

**`tools/make-site-shots.py`** (new, ~150 lines, Pillow) reads
`../store-shots/raw/<store-locale>/{01-dashboard…07-family}.png` at 1320×2868,
resizes to 640 px wide with Lanczos and writes webp q80 (method 6) into
`static/assets/img/shots/<site-locale>/`. It reads both maps —
`SHOT_LOCALE` and `SHOT_SOURCES` — **out of `site.config.mjs` by regex**, so
there is one copy of each and no duplicate to drift; if the regex ever stops
matching it exits with a message naming the map rather than converting nothing.
The captures are RGBA and opaque, so it flattens to RGB (a few KB, and it
matches every other image on the site). Idempotent: re-running rewrites the same
98 files.

Python rather than a step in `build.mjs`, and the output **committed** rather
than generated: Node's standard library has no image support, the zero-npm rule
stands, and the build must succeed on a clone that has no `store-shots/`
sibling. `npm run build` never touches that folder.

**`site.config.mjs`** gained `SHOT_LOCALE` (site locale → store locale, 14
entries) and `SHOT_SOURCES` (raw name → site name). `IMAGE_SIZES['shot-']` was
**not** changed: the converter measures and prints what it produced, and
1320×2868 → 640 px wide lands on **640×1391**, byte-identical geometry to the
files it replaces. `FEATURES` and `GALLERY` needed no edit either — the site
names in the prompt's map are the names those arrays already use.

**`build.mjs`** has a new `imgSrc(name, loc)`. A `shot-*` name resolves to
`/assets/img/shots/<loc>/<name>.webp` when that file exists in `static/`,
`shots/en/` when it does not, and **throws** when neither does. `ill-*` and the
logo keep their old paths. `imgTag` is now `(name, alt, cls, loc)` and all three
callers pass the locale. The two hero phones were template-literal `src`s in
`landing.html`; they now read `page.heroShots`, an object built by
`renderHeroShots(loc)` carrying `calendar`, `home`, `width` and `height`. They
stay written out in the template rather than going through `imgTag` because they
are the largest contentful paint and keep `fetchpriority="high"` with no
`loading="lazy"` — but their width/height now come from `IMAGE_SIZES` instead of
being typed twice.

**Deleted:** the six test-data files `static/assets/img/shot-{home,calendar,
shopping,todos,mealplan,birthdays}.webp`. The three with no demo capture moved
into `shots/en/` (`git mv`, same bytes), so every screenshot on the site now
lives under one root and `static/assets/img/` holds only illustrations and the
logo. Nothing in `dist/` references `/assets/img/shot-*.webp` any more, which
check-build's link resolver (section 2) would fail on if it did.

## Size table

Per file, across the 14 generated locales. Budget was ~45 KB; the largest file
is 33.4 KB.

| file | min | median | max |
|---|---:|---:|---:|
| `shot-home` | 31.3K | 32.5K | 33.4K |
| `shot-calendar` | 30.8K | 31.5K | 32.1K |
| `shot-shopping` | 15.8K | 16.6K | 17.5K |
| `shot-todos` | 29.2K | 30.7K | 31.9K |
| `shot-mealplan` | 24.9K | 26.3K | 28.8K |
| `shot-birthdays` | 22.5K | 23.8K | 26.0K |
| `shot-family` | 23.5K | 24.5K | 25.3K |

Per locale: 182K (cs, en) – 190K (pt) for the seven files. Kept from the old
set, English on every page: `shot-recipes` 28.0K, `shot-photos` 22.6K,
`shot-documents` 20.3K.

**Total committed: 2.61 MB in 101 files.** That is the price of translating the
screenshots — the repo carries 14 sets instead of one. A reader still downloads
the same number of images as before, all under 34 KB.

Intrinsic size the converter reported: **640×1391**, one aspect ratio across all
98 files, matching `IMAGE_SIZES['shot-']` exactly.

## Fallback matrix

| site locale | screenshots from | why |
|---|---|---|
| en | `shots/en/` ← `raw/en-US/` | own set |
| de | `shots/de/` ← `raw/de/` | own set |
| fr | `shots/fr/` ← `raw/fr-FR/` | own set |
| es | `shots/es/` ← `raw/es-ES/` | own set |
| it, nl, sv, da, nb, pl, cs, fi, tr | `shots/<loc>/` ← `raw/<loc>/` | own set |
| pt | `shots/pt/` ← `raw/pt-PT/` | own set |
| id, ja, ko, zh-Hans, zh-Hant, th, ru, hi, ar | `shots/en/` | no capture set — absent from `SHOT_LOCALE` |

And per file, cutting across that: `shot-recipes`, `shot-photos` and
`shot-documents` come from `shots/en/` in **every** locale including German,
because the demo family has no capture of those three screens yet. `/de/` shows
six German screenshots and three English ones; `/ja/` shows nine English ones.

Verified in the built tree:

```
/de/index.html  → shots/de/{home,calendar,shopping,todos,mealplan,birthdays}
                  shots/en/{recipes,photos,documents}
/ja/index.html  → shots/en/  ×9, nothing else
/index.html     → shots/en/  ×9
```

The screenshot fallback is deliberate and is the **only** fallback on this site:
a missing content string is still a hard error in check-content, because a
silently English sentence rots unnoticed. A silently English screenshot is a
screenshot of an app the reader is about to open in English anyway.

## The guard, proven failing

New **check-build section 14**. It asserts from both sides, because either half
alone lets a real regression ship:

1. a locale that **has** its own set must actually use it;
2. a locale must show **only** its own set or English, never a third locale's.

*Half 1.* `mv static/assets/img/shots/de /tmp` — i.e. the converter was never
re-run after a language was added to `SHOT_LOCALE` — then `npm run build`:

```
1 build error(s):
de/index.html    SHOT_LOCALE maps de to 'de' but the page uses no shots/de/
                 file — the set was never generated, or the resolver fell back
                 silently
```

The build otherwise succeeded: 66 valid pages, every image resolving, German
copy — and English screenshots. That is exactly the failure that is invisible
without this check. Folder restored, build green.

*Half 2.* This one cannot be produced through the current resolver (`imgSrc`
only ever emits `shots/<loc>/` or `shots/en/`), so it was proven against the
built tree directly: one `src` in `dist/ja/index.html` rewritten from
`shots/en/` to `shots/fr/`, then `node tools/check-build.mjs`:

```
1 build error(s):
ja/index.html    shows screenshots from shots/fr/ — a ja page may only use
                 shots/en/
```

It is worth keeping despite being unreachable today: the hero images were
hard-coded `src`s until this prompt, and a future hard-coded `src` is precisely
the regression it catches. Rebuilt clean afterwards.

## Verified

`python3 tools/make-site-shots.py` → 98 files, 0 over budget, one intrinsic
size. `npm run build` → clean (the 10 content length-ratio warnings are
pre-existing and unrelated). `npm run serve` + headless Chrome at 1440×1100,
screenshots in `claude-reports/2026-09-05/shots/`:

- `012-hero-en.png` — "The Bergers", Shopping / To-dos / Recipes / Meal plan.
- `012-hero-de.png` — "Familie Berger", Einkaufen / Aufgaben / Rezepte /
  Essensplan, German month grid.
- `012-hero-ja.png` — Japanese copy, English screenshots. The fallback, working.

No test data anywhere on the three pages.

One note for whoever repeats this: `/` had to be captured as `/?hl=en`. This
machine's Chrome reports German first, so the detector redirected the root to
`/de/` and the first "English" capture was the German page — which is the
detector doing its job, and a reminder that `/` cannot be eyeballed for English
on a non-English machine without the `hl` override.

## Owner actions

1. **Capture the three missing screens** with the Bergers family: `recipes`,
   `photos`, `documents` — at least `en-US` and `de`. They need names the
   converter knows, so add them to `SHOT_SOURCES` in `site.config.mjs`
   (`08-recipes → shot-recipes`, and so on), drop the PNGs into
   `../store-shots/raw/<locale>/`, re-run `python3 tools/make-site-shots.py`,
   rebuild, commit. Until then those three are English on every page.
2. **`web-calendar.webp` for 014.** Prompt 014's hero puts a browser frame
   behind the phone showing a real capture of `app.daili.app`. That file does
   **not** exist in `static/assets/img/` today, so 014 will generate a mint
   placeholder and list replacing it as its own first owner action — a real
   capture beforehand (app.daili.app/calendar, week view, Bergers family,
   1600×1000, webp) removes that placeholder from the chain.
3. **Nine locales still show English screenshots** (id, ja, ko, zh-Hans,
   zh-Hant, th, ru, hi, ar). Neither `store-shots/raw/` nor the site has
   captures for them. Adding one is one line in `SHOT_LOCALE` plus a converter
   run; section 14 will fail the build if the line is added and the run is
   forgotten.
4. `shot-family` is generated for all 14 locales but referenced by nothing —
   the `family` feature still uses `ill-family.webp`, as the prompt specified.
   ~330 KB of committed weight waiting on 014 to decide whether the
   illustration or the screenshot belongs there.
