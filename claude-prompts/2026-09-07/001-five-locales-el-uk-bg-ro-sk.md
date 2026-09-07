# Add five languages to the website: Greek, Ukrainian, Bulgarian, Romanian, Slovak

## Goal
The site speaks 23 languages. Five languages the **app already speaks perfectly**
are missing from it: `el`, `uk`, `bg`, `ro`, `sk`. A Greek family finds an
English marketing page and then a fully Greek app — the wrong way round.
Done = the site builds green at **28 locales**, `/el/ /uk/ /bg/ /ro/ /sk/` exist
with real content, real legal pages and real screenshots, and the picker shows
all 28.

🔴 **Read `README.md` first** — the sections "Adding a language" and "Things that
will bite you" are the spec for this prompt. Read `content/de.json` and
`legal/privacy.cs.html` as the shape to copy.

## Scope
- In: `site.config.mjs` · `content/{el,uk,bg,ro,sk}.json` (new) ·
  `legal/privacy.<loc>.html` and `legal/terms.<loc>.html` for those five (10 new
  files) · `static/assets/img/shots/<loc>/` (generated, committed).
- Out: `content/en.json`, every other locale, `templates/`, `static/` beyond the
  generated shots, `deploy.sh` (**Ammar deploys, never you**).

## Requirements

1. **`site.config.mjs`** — add the five codes to `LOCALES` and to
   `PLANNED_LOCALES`, and add each endonym. **None of the five is RTL** — do not
   touch the RTL set.
   ```
   el: 'Ελληνικά'   uk: 'Українська'   bg: 'Български'
   ro: 'Română'     sk: 'Slovenčina'
   ```
   🔴 These must be **byte-identical** to `languageEndonyms` in the app repo's
   `lib/core/localization/language_names.dart`. Endonyms are never translated.

2. **`SHOT_LOCALE`** — add all five. Raw captures already exist in
   `../store-shots/raw/`, so all five get real screenshots:
   `el: 'el', uk: 'uk', bg: 'bg', ro: 'ro', sk: 'sk'`.
   ⚠️ `ro` and `sk` were **forgotten in an earlier round** — their captures have
   been sitting there unused. Adding them here is part of the job, not scope
   creep.

3. **`content/<code>.json`** — one per locale, mirroring **`de.json`'s** shape,
   not `en.json`'s. `en.json` is the only file that carries the `@`-description
   blocks; the translations do not. Same keys, same types, same array lengths,
   same placeholders, same inline HTML tags.

4. 🔴 **`check-content.mjs` fails on a string left byte-identical to English.**
   Every string must be genuinely translated. If a term is legitimately the same
   word in that language, choose the natural native form; if there truly is
   none, stop and report it rather than shipping a copy of the English.

5. **Brand:** never transliterate **daili** (the checker fails on that), and the
   string `FamCanvas` must not appear anywhere.

6. **Legal pages** — `legal/privacy.<loc>.html` and `legal/terms.<loc>.html` for
   each of the five, copied structurally from `privacy.en.html` / `terms.en.html`.
   `tools/check-legal.mjs` runs before the build and fails unless each body has:
   - the **same `<h2>` count** as English,
   - the **binding-language note** (English is the binding version),
   - the **identical `<time datetime="…">` value** — the visible date is
     localised, that attribute is the one value identical in all locales.
   Do not touch the flat German files or `impressum.de.html`.

7. **Screenshots** — after the content lands, run
   `python3 tools/make-site-shots.py` and commit what it writes under
   `static/assets/img/shots/<loc>/`. The build never reads `../store-shots/`, so
   the output must be committed.

8. **Tone** — match `de.json`: warm, plain, short sentences. Address the reader
   **informally** in every one of these languages (el `εσύ`, uk `ти`, bg `ти`,
   ro `tu`, sk `ty`). A family app, not a bank.

9. 🔴 **Language traps — each of these is a visible giveaway of machine output.**
   - **Greek:** final sigma is `ς` at the end of a word and `σ` everywhere else.
     The Greek question mark is **`;` (U+003B), not `?`** — every question ends
     with it. Every polysyllabic word carries exactly one tonos. Quotes are `«»`.
   - **Ukrainian:** `і ї є ґ` exist and are not Russian letters; the apostrophe
     is `’`. Never write Russian spellings.
   - **Bulgarian:** Bulgarian is **not Russian.** There is no `ы`, no `э`, no `ё`.
     Bulgarian has no infinitive — use the `да` construction.
   - **Romanian:** `ș` and `ț` use the **comma below** (U+0219 / U+021B), never
     the cedilla forms `ş`/`ţ`. Also `ă â î`.
   - **Slovak:** `ľ ĺ ŕ ô ä` are real letters, and Slovak is **not Czech** — do
     not translate from `cs.json`, translate from English.

10. **Method** — one locale at a time: write its JSON, write its two legal
    pages, run `npm run build`, fix what the checker names, then move on. The
    build is `check-content → check-legal → build → check-build → test-detector`
    chained with `&&`, so a failure names exactly what is wrong.

## Constraints
- `npm run build` must pass every guard. Do not weaken or edit `tools/*.mjs`.
- No changes to `content/en.json`, `legal/*.en.html`, or any existing locale.
- 🔴 **Do not run `./deploy.sh`.** Ammar deploys.
- `dist/` is gitignored — do not commit it.

## Verify
- `npm run build` green.
- Report the key count per new locale and confirm it equals `de.json`'s.
- Confirm 10 new legal files exist and `check-legal.mjs` passed.
- Confirm `static/assets/img/shots/{el,uk,bg,ro,sk}/` were written.

## Commit & push
- Conventional Commit; body includes
  `Prompt: claude-prompts/2026-09-07/001-five-locales-el-uk-bg-ro-sk.md`.
- **Push now.**

## Report
`claude-reports/2026-09-07/001-five-locales-el-uk-bg-ro-sk.md` from the template.
Record: key count per locale, any string you could not translate away from
English, the language-specific choices you locked (informal address, quote
marks), whether `ro`/`sk` screenshots rendered cleanly, verification output, SHA.
🔴 Write the report with the file-write tool, never a shell heredoc — `cat` is
aliased to `bat` on this machine and silently writes a 0-byte file. Check
`wc -c` before committing.
