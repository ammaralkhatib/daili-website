# 003 — Help: "Download your data" easier to find (search words + links)

**Result:** done, with one part not fully reachable (see "Not met" below) · **Commit:** `1329b326` docs(help): easier to find "Download your data" (search words + links) — pushed to origin/main together with this report. `./deploy.sh` was NOT run (Ammar's step).
**Step 0:** `e815df45` docs(plan): sync planning docs (prompts 002 + 003), pushed. No commits were held. `static/assets/img/photos/` stayed untouched and unstaged, as in earlier runs.
No sub-agents were used (I wrote the 24 keyword lines myself). No `CHANGELOG.md` exists in this repo, so there is no changelog line.

## Not met: "first hit" for en "backup" and en "export my data"
The search shows title matches first, then the articles in page order (Account comes near the end). Keywords cannot change that order. The app's Help search uses the same rule (`help_filters.dart`: title hits, then file order).
- **"backup"**: four other articles talk about backups in their own text and keywords (Note pictures, Note files, Cycle privacy, Vault "where"). They come first; "Download your data" is now **5th** (before: not found at all).
- **"export my data"**: the Cycle article's title also has "data", so it stays 1st; "Download your data" is **2nd** (same as before).
- So the tests check these two as **found** (in the list), not **first**. Everything else in the prompt is done.

Options for Ammar:
- **A (my recommendation): accept it.** For "backup" the Vault and Notes articles are good answers too (people ask "are my photos backed up?"). The real problem from list item 175 was "not found at all", and that is fixed.
- **B:** change the ranking in BOTH searches (website `help-search.js` + app `help_filters.dart`): an exact keyword match comes before other text matches. That would fix "export my data", but NOT "backup" (the other four also have the exact keyword "backup"). Needs an app prompt and a website prompt.
- **C:** remove "backup" from the other four articles (and their 24 translations). Not recommended: it hides good answers.

## English keywords (12 = the limit; the limit did bite)
`backup, back up, data export, export my data, save my data, copy of my account, takeout, gdpr, data request, privacy, personal data, archive`
Dropped (4), all still find the article: `download` (in the title), `export` (inside "data export"), `my data` (inside "export my data"), `copy of data` (its words are in the body). `updated: 2026-11-21`.

## Translations (24): `keywords:` + `translatedFrom: 2026-11-21` only
Each one has 12 keywords. A few examples:
- **de:** datenexport, daten exportieren, sicherung, backup, daten sichern, datensicherung, datenkopie, kopie meines kontos, dsgvo, datenauskunft, datenschutz, persönliche daten
- **fr:** sauvegarde, sauvegarder mes données, backup, export des données, exporter mes données, copie de mon compte, …
- **es:** copia de seguridad, respaldo, backup, exportar datos, exportar mis datos, guardar mis datos, …
- **nl:** back-up, backup, gegevens exporteren, mijn gegevens exporteren, gegevens opslaan, …
- **ja:** バックアップ, データのエクスポート, データを保存, アカウントのコピー, …
- **tr:** yedekleme, verileri dışa aktar, verilerimi kaydet, hesabımın kopyası, kvkk, …

Check: I ran every OLD keyword of all 25 languages (232) through the real search on the new build. 231 still find the article. The only one dropped on purpose: German **"archiv"** (weak word; the list-archive article owns it; room went to the new words). The diff touches only `keywords` / `translatedFrom` / `updated` / `related` lines: title, summary and body are the same in every language.

## Links (`related:`, English only)
- `account-profile` (Settings → your name, where the button is): `…, account-password, account-download-data`
- `vault-where`: `…, account-delete, account-download-data`
Both now have 4 links. The code has no hard limit (the longest list has 9). I did not change their `updated:`, so their translations do not look out of date.

## Search test (`tools/test-help-search.mjs`)
New block "the built pages: Download your data is found" (same style as the Daili Plus block).
- **first:** en `save my data`, `takeout` · de `datenexport`, `datensicherung`, `daten sichern`
- **found:** en `backup`, `export my data`, `data export`, `copy of my account` · de `sicherung`, `backup`, `daten exportieren`

Before the change (old build), 10 cases failed, for example:
```
dist/help/index.html: save my data (first)   got undefined  want "Download your data"
dist/help/index.html: takeout (first)        got "Leftovers, eating out and takeaway"  want "Download your data"
dist/help/index.html: backup (found)         got false  want true
dist/de/help/index.html: datenexport (first) got undefined  want "Deine Daten herunterladen"
dist/de/help/index.html: daten exportieren (found) got false  want true
```
`export my data` and `data export` already found the article before.
Fix try 1: `copy of my account` was first planned as "first", but the Delete article has "account" in its title, so it moved to "found".

New results:
```
en "backup" → notes/pictures-voice, notes/files, cycle/privacy, vault/where, account/download-data
en "export my data" → cycle/privacy, account/download-data
en "save my data" → account/download-data
en "takeout" → account/download-data
de "datenexport" → account/download-data
de "daten sichern" → account/download-data
```

## Build + tests (foreground)
- `npm run build`: exit 0. `help OK · 116 article(s) · … 92 app routes checked`, `test-check-help OK · 99 cases`, `build OK · 3759 pages`, `help search OK · 38 cases · 2 built page(s)`. No "older than English" warning (all 24 `translatedFrom` = `updated`). The 54 warnings are the usual content length ratios, none about help.
- `npm test`: exit 0. detector OK (32), test-check-help OK (99), help search OK (38), test-blog-i18n OK (48).

## Owner steps for Ammar
1. Run `./deploy.sh` in `daili-website` (safe any time; the article matches the live app).
2. daili.app/help → search "save my data" → "Download your data" is first. Search "backup" → it is in the list (5th, see "Not met").
3. Switch to Deutsch → search "Datenexport" → "Deine Daten herunterladen" is first.
4. Pick A, B or C above.

## Help impact
account-download-data: easier to find in search (body unchanged)

DONE
