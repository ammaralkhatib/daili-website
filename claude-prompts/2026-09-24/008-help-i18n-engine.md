# Help center in 25 languages, part 1: the engine

## Goal
The Help center is English only: `help/en/**` → daili.app/help + `help/en.json`
for the app. Ammar decided (2026-09-24) to translate it into **all 24 other
app languages**, with **own-language pictures**. Only the 25 app languages;
the website-only languages `ru`, `hi` and `ar` keep linking to the English help.

This prompt builds the **multi-language engine only**, and adds no
translations. Prompts `009`–`016` then add 3 languages each, and the app and
the pictures follow.

"Done" =
- the build can make help pages + a data file for every locale in a new list
  `HELP_LOCALES` (today only `['en']`);
- a translation is a **text-only** copy of an English article, checked by a
  parity guard;
- pages fall back to the English picture while a locale has no own pictures;
- nothing visible changes for English.

`npm run build` is green.

## Design (locked, follow it)
- **Locale codes = the website's codes:** `de fr es it nl pt sv da nb pl cs
  fi tr id ja ko zh-Hans zh-Hant th el uk bg ro sk` (+ `en`). Folder
  `help/<code>/`, data file `dist/help/<code>.json`, pictures
  `static/help/media/<code>/`, pages under `dirFor(code) + 'help/'` (e.g.
  `/de/help/`, `/zh-hant/help/`). English stays at `/help/` and `help/en.json`.
- **English is the single source of all non-text data.** A translation file
  `help/<code>/<topic>/<slug>.md` has **only** these front-matter keys:
  - `id` (must match an English article);
  - `title`, `summary`, `keywords`;
  - `tipTitle` + `tipBody` (only if the English article has a tip);
  - `translatedFrom` (the English `updated` date it was translated from).

  Everything else (`topic`, `routes`, `tryIt`, `since`, `updated`, `order`,
  `media`, `mediaPending`, `related`, tip priority/skip, checklist) is taken
  from the English article. Any other key in a translation = error.
- **Body parity:** a translation has the same blocks in the same order as the
  English article: the same number of paragraphs, steps, notes and images. The
  image lines keep the same media id, with the alt text translated. `**bold**`
  count may differ. Parity breaks = error with file:line.
- **Length limits for translations:** the English limits × 1.4 for
  title/summary/tip texts. No word count for `ja ko zh-Hans zh-Hant th`: use
  characters, with a sensible cap that you choose and state in the report.
  Keywords: 1–12, lower case where the script has case.
- **Stale check:** if English `updated` is newer than a translation's
  `translatedFrom`, the build prints one line per locale:
  `help de: 2 article(s) older than English: …`. This is a warning, not an
  error (the release help sync fixes them).
- **UI text per locale:** move every visible English string of the help
  templates and `help-search.js` into one file per locale,
  `help/<code>/_ui.json`. That covers:
  - search hint, no result, "Was this helpful?", Yes/No labels, Thanks, Still
    stuck, Write to us, Updated, Try it hint, topic N articles, TIPS,
    breadcrumbs, `<title>` suffix, etc.;
  - **the 11 topic titles + summaries** (move them out of `HELP_TOPICS` in
    `site.config.mjs`; keep `icon` there).

  Create `help/en/_ui.json` now. A locale in `HELP_LOCALES` without a complete
  `_ui.json` (same keys as `en`) = error. The script gets its strings from the
  page (for example a `data-` attribute or a small JSON block), still no
  inline executable script.
- **`HELP_LOCALES`** in `site.config.mjs` = the locales that are complete.
  Today it's `['en']`. A locale in the list with a missing article or a parity
  error = build error. A folder `help/<code>/` **not** in the list is still
  checked (so a half-done language gets caught), but not built. Every code in
  the list must be in `LOCALES`.
- **Pictures:** a page and a data file use
  `static/help/media/<code>/<id>.webp` if it exists, otherwise the English one.
  The build prints `help de: 61 picture(s) in English for now`. Media sizes
  come from `help/media.json` per locale: make it `{ "en": {...}, "de":
  {...} }`, or add `help/media.<code>.json`; your choice, say which. The app
  harness will write there later.
- **Data file per locale:** `dist/help/<code>.json` has the same schema 1 as
  `en.json`, with `locale: "<code>"`, and articles, tips and checklist rows in
  that language (tip and checklist titles from the translation). The same
  `.htaccess` headers as `en.json`.
- **Pages:**
  - Help pages for each `HELP_LOCALES` locale, in that locale's layout
    (`<html lang>`, direction);
  - an **hreflang cluster** over the help locales, and `x-default` = en;
  - the sitemap lists every locale's help pages (while `HELP_PUBLIC`);
  - the footer **Help** link goes to the reader's own help if that locale is
    in `HELP_LOCALES`, otherwise to `/help/` with `hreflang="en" lang="en"`
    (as today).
- **Search** (`help-search.js`) must work for scripts without spaces: for
  `ja ko zh-Hans zh-Hant th`, match by substring over the normalized text (not
  by words). Keep accent-insensitive matching.
- **Events:** 👍👎 and missed searches send `locale` = the page's help locale.

## Scope
- **In:** `tools/help-lib.mjs`, `tools/check-help.mjs`,
  `tools/test-check-help.mjs`, `build.mjs`, `site.config.mjs`, the three help
  templates, `static/assets/help-search.js` (+ any help script),
  `help/en/_ui.json`, `help/media.json` (shape), `static/.htaccess` (only if
  the json header rule needs a pattern), `tools/check-build.mjs`, `README.md`
  (help section).
- **Out:** article texts, other content files, the app, the api.

## Tests (`test-check-help`), planted cases, each must go red
- a translation with an unknown id; with a forbidden key (`routes`); with one
  step fewer; with a different image id;
- a missing `_ui.json` key;
- a locale in `HELP_LOCALES` missing an article;
- CJK length measured in characters.

Add one **tiny fixture translation** under the test fixtures (not in
`help/`), e.g. German for 2 articles, to prove the page + json path builds.
Keep every old case green.

## Constraints
- `npm run build` green; English output **unchanged** except for what the
  move of strings requires. Diff `dist/help/en.json` and one English article
  page before/after, and report the differences (ideally none).
- Node standard library only. File-write tool, never heredocs; check `wc -c`.
- Leave unrelated uncommitted files alone.

## Commit & push
- This prompt + `HELP-TRANSLATION-RULES.md`, if untracked: `docs(plan): add help i18n prompts`.
- `feat(help): multi-language help engine (text-only translations, parity guard, per-locale UI, json and pictures)`.
  Body: `Prompt: claude-prompts/2026-09-24/008-help-i18n-engine.md`.
- **Push now.** No deploy needed.

## Report
`claude-reports/2026-09-24/008-help-i18n-engine.md`, half a page:
- the file layout as built;
- the length caps;
- the `media.json` shape;
- the before/after English diff;
- the tests;
- SHA.
- `Help impact: none` for users.
