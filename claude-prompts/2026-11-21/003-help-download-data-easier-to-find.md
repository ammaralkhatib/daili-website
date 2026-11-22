# Help: make "Download your data" easier to find (search words + links)

Standard lane, website only. List item one-hundred-seventy-five: a person who deleted their account
(2026-11-20) asked for a copy of their data — the export already exists (Settings → your name →
**Download my data**), they just did not find it. Planning Claude checked the help on 2026-11-21
(read-only).

Every sub-agent you start MUST use model claude-opus-5-5. Write the report with the file-write tool.

## What is NOT in this prompt (on purpose)

- **Do not change the steps or the body text** of `help/*/account/download-data.md`. Today's app
  commit `9036de00` (a "What should we send you?" sheet with parts and **Send to my email**) is NOT in
  the live app 1.17.0 — the release help sync describes it later. Body = unchanged in every language.
- No `since` / `LIVE_APP_VERSION` change. No new article. No picture.

## Goal

Someone who searches the Help center (daili.app/help and the app's Help screen) for "backup",
"export", "save my data", "Datenexport", "Sicherung" … finds **Download your data** first.

## Requirements

1. **English keywords** (`help/en/account/download-data.md`, front matter `keywords:`; rules in
   `tools/help-lib.mjs:25-41` — lower case, comma list; respect the key-count limit, say if it bit):
   keep the useful ones, add: `backup`, `back up`, `data export`, `export my data`, `save my data`,
   `copy of my account`, `takeout`. Drop the weakest old ones if the limit needs room (say which).
   Set `updated:` to `2026-11-21`.
2. **All 24 translations** (`help/<loc>/account/download-data.md`): only the `keywords:` line and
   `translatedFrom: 2026-11-21` change. Real words people TYPE in that language for "backup /
   data export / save my data" (de: `datenexport`, `daten exportieren`, `sicherung`, `backup`,
   `daten sichern`; keep the existing good ones). Follow
   `claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md`. Body, title, summary unchanged (the block
   parity check must stay green).
3. **Links that lead there:** `related:` already points to it from `account-verify-email`,
   `account-safety`, `account-delete`, `account-help-improve`. Add `account-download-data` to the
   `related:` of the article(s) where a person who wants a backup or to leave would land — at least
   the main Settings/Profile article if one exists (`grep -rl "routes: /settings" help/en`) and the
   `vault-where` article (it explains where files are). English only (`related:` is not in
   translations). Never more than the build's `related:` limit.
4. **Search test:** add cases to `tools/test-help-search.mjs` (copy its style): en "backup" →
   `account-download-data` is the first hit; en "export my data" → first hit; de "datenexport" →
   first hit. They must fail before step 1–2.

## Constraints

- `npm run build` green (it runs check-help, test-check-help, test-help-search, …) and `npm test`
  green — self-correct up to 2 tries.
- "older than English" warnings: none for this article after the change (all 24 `translatedFrom`
  = the new `updated`).
- 🔴 Report trap: never put the word "status" and the word "blocked" on one line unless you really
  are blocked.

## Verify

- `npm run build` and `npm test`, in the FOREGROUND. Paste the search-test lines into the report.

## Commit & push

- `docs(help): easier to find "Download your data" (search words + links)`
  Body: `Prompt: claude-prompts/2026-11-21/003-help-download-data-easier-to-find.md`
- **Push now.** (Pushing does not deploy — open item for Ammar: `./deploy.sh`; safe any time, it is
  true for the live app.)

## Report

- `claude-reports/2026-11-21/003-help-download-data-easier-to-find.md`: the new English keyword list,
  a few examples per language (not all), which `related:` lines got the link, build + test result,
  SHA, pushed or not.
- Check for Ammar after `./deploy.sh`: daili.app/help → search "backup" → "Download your data" is
  first; switch to Deutsch → search "Datenexport" → first.
- `## Help impact`: `account-download-data: easier to find in search (body unchanged)`.
