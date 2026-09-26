# 008 — Help center in 25 languages, part 1: the engine

Status: done · SHA `87e4ab2` (pushed; prompt commit `206f178`) · `npm run build` green

## File layout as built
- `help/en/<topic>/<slug>.md` — the source (unchanged). `help/en/_ui.json` — all page words: hero, search label + placeholder, results, no result (`{email}`), "New in version {version}", browse by topic, `articleCount` (plural forms), still stuck / write to us / stuck line (`{writeToUs}`), crumb, "Note:", related, "Was this helpful?" + Yes/No labels, thanks, updated, `metaTitle`/`metaDescription`, `pageTitle` (`{title} — daili Help`), and the 11 `topics` (title + summary). `HELP_TOPICS` keeps only `icon`.
- `help/<code>/<topic>/<slug>.md` + `help/<code>/_ui.json` — translations (none yet).
- `site.config.mjs` `HELP_LOCALES = ['en']`. Listed locales build pages under `dirFor(code)+'help/'` (`/de/help/`, `/zh-hant/help/`) and `dist/help/<code>.json`.
- `tools/help-lib.mjs`: `loadHelp` (English), `loadTranslation`, `loadAllHelp`, `mediaFor`, `CHAR_LOCALES`. build.mjs, check-help and check-build all use `loadAllHelp`.
- `static/help/.htaccess`: the json allow pattern now accepts `zh-Hans.json`/`zh-Hant.json` (was lower case only). Same cache headers for every `<code>.json`.
- `help-search.js` has no words of its own. It reads the help locale from `<html lang>`, sends it as `locale` on 👍👎 and missed searches, and for `ja ko zh-Hans zh-Hant th` also matches the whole query (spaces dropped) as a substring of the text (spaces dropped). Matching still ignores accents. check-build asserts its list equals `CHAR_LOCALES`.
- Hreflang: a `help` cluster only when `HELP_LOCALES` has more than one locale (x-default = en). With English alone there are no alternates, as before. The footer Help link goes to the reader's own help if that locale has one, otherwise to `/help/` with `hreflang="en" lang="en"`.

## Length caps (translations)
- title 98, summary 196, tipTitle 84, tipBody 168, topic summary 126 (English × 1.4). These are counted in graphemes, so a Thai syllable or an emoji counts as 1.
- Body: 210 words. For the no-space scripts the body is counted in characters instead (graphemes, whitespace and `**` not counted): **ja 600, ko 600, zh-Hans 450, zh-Hant 450, th 900**. An English body is ≤ ~700 non-space characters today.
- Keywords 1–12, lower case via `toLocaleLowerCase(code)`.

## media shape
I kept `help/media.json` as is (English) and added **`help/media.<code>.json`**, which uses the same entry shape. It may only hold ids that are in `help/media.json`, with the same kind and a file that exists in `static/help/media/<code>/`. Any id it doesn't have falls back to English, and the build prints `help de: N picture(s) in English for now`.

## English before/after
- `dist/help/en.json`: identical except `generated`.
- All 210 HTML pages, compared byte for byte: the only difference is the renamed `help-search.<sha8>.js` in the article/index pages, because the script changed. No other differences.
- `dist/help/.htaccess`: the pattern change above.

## Tests (`test-check-help`: 90 cases, was 55)
- New planted cases, each seen going red:
  - a translation with an unknown id, a forbidden key (`routes`), one step fewer, a different image id, or a block too many;
  - a tip missing, or a tip that English doesn't have;
  - `translatedFrom` newer than English;
  - a title over 98 characters, an upper-case keyword, 211 German words;
  - a missing `_ui.json` key / topic summary / file;
  - a dropped placeholder, an unknown ui key, a Polish plural form missing;
  - a listed locale missing an article;
  - a `HELP_LOCALES` code not in `LOCALES`, a folder that isn't a locale;
  - a locale picture with a bad id or a missing file;
  - CJK: a ja title of 99 characters, and a ja body of 601 characters that is one "word".
- Clean cases: German listed, a half-done unlisted German, a ja title of 98 characters, 211 space-separated ja "words", a Thai title of 98 graphemes. The stale warning is checked by its exact text.
- Fixture `tools/fixtures/help-i18n/de/` (2 articles). The test builds it through `build.mjs` with `HELP_TEST_ROOT/LOCALES/DIST` (scratch dist, loud warning). It checks German `<html lang>`, title, note label, its own picture plus the English fallback, the hreflang cluster, the `/de/help/` footer link, and `de.json` (German text over English data, tip, checklist, topic).
- Extra, not committed: a scratch copy with all 64 articles pseudo-translated into de + ja and `HELP_LOCALES = ['en','de','ja']`. check-help, build and check-build all passed: 362 pages, reciprocal hreflang, sitemap, footers, `de.json`/`ja.json` with 64/9/6.

## Notes
- The website pages have no "Try it" hint and no TIPS label: the app draws those, so there was nothing to move.
- A translation's note is still written `> Note:`. The label shown comes from `_ui.json`.

Help impact: none for users.
