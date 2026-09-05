# Redesign 2/5 — real screenshots, localized per page

## Goal

The site's phone screenshots show test data ("amm 2h", "fdsfsd", "test real…").
The store-screenshot pipeline already has clean captures of a demo family
("The Bergers") in `../store-shots/raw/<store-locale>/` — 7 screens × 22
languages, plain phone captures, 1320×2868 PNG. This prompt builds a small
converter that turns them into the site's webp screenshots, **one set per site
locale**, and teaches `build.mjs` to pick the right set for each page.

Done = `npm run build` clean; `/de/` shows German screenshots, `/` English,
`/ja/` English (fallback); every `<img>` still carries width/height; the old
test-data files are gone from `static/assets/img/` except the three screens
that have no demo capture yet (see requirement 3).

## Scope

- **In:** `tools/make-site-shots.py` (new — Python + Pillow, the same
  dependency `store-shots/` already uses; Node has no image library and the
  zero-npm rule stands), `static/assets/img/shots/<loc>/*.webp` (generated,
  **committed** — the build must never depend on the sibling folder),
  `site.config.mjs` (`SHOT_LOCALE` map + `FEATURES`/`GALLERY` names),
  `build.mjs` (`imgTag` path resolution), `README.md` (one paragraph).
- **Out:** templates, CSS, content JSON, legal, deploy. **Never run `./deploy.sh`.**

## Requirements

1. **Mapping** in `site.config.mjs`:
   ```js
   export const SHOT_LOCALE = { en:'en-US', de:'de', fr:'fr-FR', es:'es-ES', it:'it', nl:'nl',
     pt:'pt-PT', sv:'sv', da:'da', nb:'nb', pl:'pl', cs:'cs', fi:'fi', tr:'tr' };
   // every other site locale (id, ja, ko, zh-Hans, zh-Hant, th, ru, hi, ar) → 'en-US'
   ```
   and the raw-file → site-name map:
   `01-dashboard→shot-home`, `02-calendar→shot-calendar`,
   `03-shopping→shot-shopping`, `04-todos→shot-todos`,
   `05-mealplan→shot-mealplan`, `06-birthdays→shot-birthdays`,
   `07-family→shot-family` (new name; `ill-family.webp` stays for now).

2. **Converter** `tools/make-site-shots.py`: for each site locale in
   `SHOT_LOCALE` (read the map by regex from `site.config.mjs` or duplicate it
   with a comment naming the source — duplicate is acceptable, say which),
   read the 7 PNGs from `../store-shots/raw/<store-locale>/`, resize to
   **640 px wide** (Lanczos), save as webp quality 80 into
   `static/assets/img/shots/<site-locale>/<name>.webp`. Output size must stay
   under ~45 KB per file; print a table of sizes. Fallback locales get NO
   folder — `build.mjs` resolves them to `en`. Idempotent; run it and commit
   the output. Record the intrinsic size it produced (expect 640×1391) — if
   the raw aspect differs from the old files, update `IMAGE_SIZES['shot-']`
   from the real output, not by assumption.

3. **The three screens without a demo capture** — `shot-recipes`,
   `shot-photos`, `shot-documents` — keep their current files, moved into
   `static/assets/img/shots/en/` so every screenshot lives under one root.
   They stay English on every locale (the resolver's fallback rule covers it
   per file: if `shots/<loc>/<name>.webp` does not exist, use `shots/en/`).
   Note them in the report as an owner action: capture those three with the
   Bergers family in `en-US` and `de`, then re-run the converter.

4. **build.mjs**: `imgTag(name, alt, cls, loc)` resolves `shot-*` names to
   `/assets/img/shots/<SHOT_LOCALE-or-en>/<name>.webp`, checking file
   existence in `static/` at build time and falling back to `en`; a missing
   file in BOTH places throws. Illustrations (`ill-*`) and the logo keep their
   current paths. Every caller passes the locale (hero images in
   `landing.html` are template-literal `src`s today — switch them to a
   `page.heroShots` object rendered by build.mjs, or a small helper, so they
   localize too).

5. **Delete** the old `static/assets/img/shot-*.webp` (the test-data files) —
   nothing may reference them afterwards; `check-build`'s existing link
   resolver proves it.

6. **check-build** addition: `/de/index.html` must reference at least one
   `/assets/img/shots/de/` file and `/ja/index.html` must reference only
   `/assets/img/shots/en/` files. Prove it can fail (temporarily map `de`
   to `en`, run, restore).

## Constraints

- Committed output only; the build must succeed on a machine without
  `store-shots/`.
- `IMAGE_SIZES` must match the generated files (measure with Pillow in the
  converter and print it).

## Verify

- `python3 tools/make-site-shots.py` then `npm run build`; `npm run serve`;
  compare `/` vs `/de/` vs `/ja/` hero + gallery. Screenshots of the three
  heroes into `claude-reports/2026-09-05/shots/`.

## Commit & push

- `feat(site): real demo-family screenshots, localized per page` —
  body `Prompt: claude-prompts/2026-09-05/012-real-screenshots.md`. **Push now.**

## Report

- `claude-reports/2026-09-05/012-real-screenshots.md`: size table, the
  fallback matrix (which locale shows which set), the proven guard failure,
  owner actions (the 3 missing captures; web screenshot for 014 — see the
  lane note in 014).
