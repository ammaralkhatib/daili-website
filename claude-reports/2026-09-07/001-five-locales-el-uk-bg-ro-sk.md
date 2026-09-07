# 001 — five languages: Greek, Ukrainian, Bulgarian, Romanian, Slovak

Prompt: `claude-prompts/2026-09-07/001-five-locales-el-uk-bg-ro-sk.md`
Commit: `PENDING`

The site was 23 locales. It is now **28**. `/el/ /uk/ /bg/ /ro/ /sk/` exist with
translated content, translated Privacy and Terms, and their own screenshots.

## What shipped

| File | What changed |
|---|---|
| `site.config.mjs` | 5 codes added to `LOCALES` and `PLANNED_LOCALES` (comment now says 28), 5 endonyms, 5 `SHOT_LOCALE` lines. `RTL` untouched — none of the five is RTL |
| `content/{el,uk,bg,ro,sk}.json` | **5 new files**, 176 checker keys each |
| `legal/privacy.{el,uk,bg,ro,sk}.html` | **5 new files** |
| `legal/terms.{el,uk,bg,ro,sk}.html` | **5 new files** |
| `static/assets/img/shots/{el,uk,bg,ro,sk}/` | **35 new `.webp`**, 7 per locale, generated and committed |

Nothing else was touched: no `content/en.json`, no `legal/*.en.html`, no existing
locale, no `templates/`, no `tools/`, no `deploy.sh`. `deploy.sh` was not run.

## Key count per locale

`de.json` is the shape the five were built against — `en.json` is the only file
carrying the `@`-description blocks, and the translations do not.

| file | JSON string/object nodes | keys as `check-content.mjs` counts them | key set identical to `de.json` |
|---|---|---|---|
| `de.json` (yardstick) | 165 | 176 | — |
| `el.json` | 165 | 176 | yes |
| `uk.json` | 165 | 176 | yes |
| `bg.json` | 165 | 176 | yes |
| `ro.json` | 165 | 176 | yes |
| `sk.json` | 165 | 176 | yes |

The two columns differ because the checker also emits one key per array
(`hero.notes`, `compare.rows`, …) alongside its elements. Both numbers match
`de.json` exactly for all five.

## Strings that could not be translated away from English

**None.** Every string is genuinely translated in all five languages. Nothing
needed adding to `@@identicalOk`, and no string came back byte-identical to
English except the five already exempted there (`footer.copyright`,
`nav.support`, `nav.download`, `support.h1`, `pricing.big` — and of those, only
`pricing.big` `€0` and `footer.copyright` are actually identical in these five).

One near-miss worth naming: Romanian `features.calendar.eyebrow` is
**`Calendar`**, the same word as English. It is the app's own label
(`dashboardTileCalendar` in `app_ro.arb`) and the correct Romanian word, and at
8 characters it sits under the checker's 25-character threshold, so it never
reached the identical-to-English rule. It is the right word, not an untranslated
one.

## The language-specific choices, locked

**Address is informal in all five**, matching `de.json`'s `du` and — checked
against the app — matching what the app itself already says to these readers:

| locale | informal form | app's own wording, for the same sentence |
|---|---|---|
| el | `εσύ` | `Δεν έχεις λογαριασμό;` |
| uk | `ти` | `Ще немає акаунта?` |
| bg | `ти` | `Нямаш профил?` |
| ro | `tu` | `Nu ai cont?` |
| sk | `ty` | `Nemáš účet?` |

**Quote marks**, per locale convention:

| locale | quotes | example in the file |
|---|---|---|
| el | `« »` | `Πρόσθεσε «γάλα» στο κινητό σου` |
| uk | `« »` | `Додаєш «молоко» на своєму телефоні` |
| bg | `„ “` | `Добави „мляко“ на своя телефон` |
| ro | `„ ”` | `Adaugi „lapte” pe telefonul tău` |
| sk | `„ “` | `Napíšeš „mlieko“ na svojom telefóne` |

**Feature vocabulary is the app's, not invented here** — pulled from
`familyplanner-app/lib/l10n/app_{el,uk,bg,ro,sk}.arb` with the same key list
`tools/glossary.mjs` uses, so the page and the tab say the same word:

| locale | Calendar | Shopping | To-dos | Meal plan | Recipes | Birthdays | Family |
|---|---|---|---|---|---|---|---|
| el | Ημερολόγιο | Ψώνια | Εργασίες | Γεύματα | Συνταγές | Γενέθλια | Οικογένεια |
| uk | Календар | Покупки | Завдання | Меню | Рецепти | Дні народження | Родина |
| bg | Календар | Покупки | Задачи | Меню | Рецепти | Рождени дни | Семейство |
| ro | Calendar | Cumpărături | Sarcini | Meniu | Rețete | Zile de naștere | Familie |
| sk | Kalendár | Nákupy | Úlohy | Jedálniček | Recepty | Narodeniny | Rodina |

`content/glossary.md` was **not** regenerated — it is outside this prompt's scope.
Running `node tools/glossary.mjs` will now pick these five up, and its hard-coded
"locales missing below" sentence will need editing when someone does.

### The traps, and how each was checked

Every one of these was verified mechanically over the finished files, not by eye.

**Greek.** Zero `?` anywhere in the prose — every question ends in `;` (U+003B):
`Πόσο κοστίζει το Daili;`, `Γιατί όχι απλώς ένα κοινόχρηστο ημερολόγιο;`, and the
six other FAQ questions. A word-by-word sigma scan found **0** medial `ς` and
**0** final `σ`. A tonos audit over every polysyllabic Greek word flagged only
correct forms: the enclitic double accents (`οικογένειάς σου`, `υπόσχεσή μας`,
`δικαιώματά σου`), the synizesis monosyllables (`για`, `μια`, `μιας`, `ποια`,
`Ποιες`), and the abbreviation `ΕΕ`.

**Ukrainian.** Scan for `ы э ё` across `uk.json` and both legal bodies: **none**.
`і`, `ї` and `є` all present and used as Ukrainian letters. The apostrophe is
`’` (U+2019) in all 13 places it occurs — `з’являється`, `комп’ютері`, `ім’я`,
`пам’ятають`, `пов’язані`, `зв’язку`, `необов’язково`, `під’єднаєш` — and there
is no straight `'`, no `ʼ` and no backtick anywhere. `ґ` does not appear; it is a
rare letter and none of these words takes it, so forcing it in would have been
the error.

**Bulgarian.** Scan for `ы э ё` across `bg.json` and both legal bodies: **none**.
No infinitives — every complement is a `да` construction (`да организираш`,
`Няма какво да затваряш`, `да четеш`, `да прибереш`, `Можеш да изтриеш`).

**Romanian.** `ș`/`ț` use the comma-below forms **U+0219 / U+021B** everywhere —
95 + 4 + 68 occurrences in `ro.json`, 69 + 66 in the privacy body, 36 + 2 + 43 + 2
in the terms body. A scan for the cedilla forms `ş ţ Ş Ţ` (U+015F / U+0163 /
U+015E / U+0162) across all three files returns **nothing**. `ă â î` are used
throughout.

**Slovak.** Translated from English, not from `cs.json`. The proof: of 176 keys,
**not one sentence** is byte-identical to the Czech file. The only overlaps are
single words that genuinely are the same in both languages — `Podpora`, `Cena`,
`Jazyk`, `Blog`, `Rodina`, `Nákupy`, `Oslavy`, `Otázky`, `Tiráž`, `Trezor na
dokumenty` — plus the brand line. Where Czech and Slovak diverge, the Slovak
file is Slovak: `aplikácia` not `aplikace`, `týždeň` not `týden`, `nastavenia`
not `nastavení`, `narodeniny` not `narozeniny`, `rodičia` not `rodiče`,
`zariadenie` not `zařízení`, `spoločný` not `společný`, `súbory` not `soubory`.
`ľ ĺ ŕ ô ä` appear where they belong — `ľuďmi`, `ľubovoľného`, `tabuľa`,
`spôsob`, `môžeš`, `pôjde`, `pamätá`, `najmenší`.

## Legal pages

Ten new files, structurally identical to English and checked by
`tools/check-legal.mjs` before every build:

| | `<h2>` count | binding note | `<time datetime>` |
|---|---|---|---|
| `privacy.{el,uk,bg,ro,sk}.html` | 10 each — English has 10 | `<p class="translated">` + `href="/privacy.html"` | `2026-09-05` |
| `terms.{el,uk,bg,ro,sk}.html` | 11 each — English has 11 | `<p class="translated">` + `href="/terms.html"` | `2026-09-05` |

The visible date is localised per locale (`5 Σεπτεμβρίου 2026`,
`5 вересня 2026 року`, `5 септември 2026 г.`, `5 septembrie 2026`,
`5. septembra 2026`); the `datetime` attribute is the identical value in all 28,
which is what the guard compares. The binding-language link text stays English
(`Privacy Policy`, `Terms of Use`, with `hreflang="en" lang="en"`) exactly as the
other 20 translations do — it is the name of the document it points at.

The legal bodies are informal too, matching `datenschutz.de.html`, which is `du`
throughout. The flat German files and `impressum.de.html` were not touched.

`legal OK · 2 document(s) × 28 locale(s)`

## Screenshots

`ro` and `sk` were the two forgotten in the earlier round — their captures had
been sitting unused in `../store-shots/raw/`. All five are now generated:

```
python3 tools/make-site-shots.py el uk bg ro sk
35 files · 946K total · largest 35.6K · budget 45K each
Intrinsic size produced: 640x1391
```

Every file is under the 45 K budget, and all 35 came out at exactly 640×1391 —
the one size `IMAGE_SIZES['shot-']` carries, so that line needed no change.

**`ro` and `sk` rendered cleanly.** Both were opened and looked at, not just
counted. Romanian shows `Cumpărături`, `Rețete`, `Zile de naștere`, `Ține
fișierele…` with correct comma-below `ț` in the rendered pixels; Slovak shows
`Jedálniček`, `Úlohy`, `Jedlá na tento týždeň`, `Členovia a pozvánky` with `ľ ô
ä` intact. No tofu boxes, no clipped diacritics, no fallback font in either.

`check-build.mjs` section 14 confirms each of the five pages actually uses its
own set rather than silently falling back:

```
el → /assets/img/shots/el/    uk → /assets/img/shots/uk/    bg → /assets/img/shots/bg/
ro → /assets/img/shots/ro/    sk → /assets/img/shots/sk/
```

## Fonts — no change needed, and why

Sofia Sans Condensed (the display face) already ships `greek` and `cyrillic`
subsets, so `/el/`, `/uk/` and `/bg/` headlines get the real brand face:
`sofia-sans-condensed-greek-700-normal.woff2` and `-800-` are in
`dist/assets/fonts/`. `/ro/` and `/sk/` are covered by the existing `latin-ext`
range (U+0100–02BA takes in `ș ț ľ ĺ ŕ`; `ô ä` are Latin-1). Figtree is
Latin-only, so Greek and Cyrillic body text falls to the system stack — exactly
what `/ru/` has always done, which is why nothing in `static/` changed.

The per-language line-height rules in the stylesheet key on `[lang="ar"]`,
`[lang="th"]` and CJK only. None of the five needs one; their metrics are the
Latin defaults.

## Verification

```
content OK · 28 locale(s) · 176 keys each
legal OK · 2 document(s) × 28 locale(s)
built 128 pages · 28 locale(s) · 126 sitemap entries
assets: style.f9c5d5c4.css  script.eb854aaf.js
blog: 11 post(s) · /blog/ index · feed.xml
build OK · 128 pages · 114 in hreflang clusters
detector OK · 32 cases · 28 locale(s) built
```

All five guards pass. Page count went 108 → 128 (four pages × five locales),
sitemap 106 → 126, hreflang cluster members 94 → 114.

`check-content.mjs` prints **8 warnings, all pre-existing** — the same de×2,
pl×1, th×2, ru×2, ar×1 length-ratio notes that were there before this prompt
started. **The five new locales contributed zero warnings.** One did appear
during the run: `bg faq.items[2].q` came in at ratio 0.63 as
`Какви езици говори?`; it is now `Какви езици говори приложението?` (ratio 1.03),
which is also the clearer sentence.

Spot checks on the built tree:

- `dist/{el,uk,bg,ro,sk}/` each contain `index.html`, `privacy.html`,
  `terms.html`, `support.html`.
- `<html lang>` is `el` / `uk` / `bg` / `ro` / `sk` respectively; `dir="rtl"`
  appears in none of them.
- The root picker renders **28** entries and carries all five endonyms;
  29 distinct `hreflang` values (28 locales + one `x-default`).

### Endonyms are byte-identical to the app

Compared as bytes against `languageEndonyms` in
`familyplanner-app/lib/core/localization/language_names.dart`:

```
el "Ελληνικά"   IDENTICAL      uk "Українська"  IDENTICAL
bg "Български"  IDENTICAL      ro "Română"      IDENTICAL
sk "Slovenčina" IDENTICAL
```

## What a native reader still owes this

`README.md` already says native review of the translations has not happened, and
that stays true for these five. Everything above is structural and mechanical:
the guards prove the shape, the scans prove the orthography, the ARB files prove
the vocabulary. Whether `Το βραδινό, αποφασισμένο από την Κυριακή` is the
sentence a Greek parent would actually write is a question only a Greek parent
can answer.

One judgement call worth a second opinion: `web.note` and the `faq` web answer
say the **web app** is available in English and German only, which is true today
but reads oddly on a page that is otherwise fully in the reader's language. That
is the English source's claim, faithfully carried over, not a translation
decision — but it is the sentence most likely to prompt a support e-mail from
these five audiences.
