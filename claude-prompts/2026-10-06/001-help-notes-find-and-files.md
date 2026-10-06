# Help 1.9.0 part 2: two small Notes articles (find + restore, where files live)

## Goal
The 1.9.0 help sync (report `claude-reports/2026-10-05/002-help-sync-1-9-0.md`)
had to drop real Notes facts to stay under the 150-word limit. Add two small
articles so nothing important is missing, in English and every `HELP_LOCALES`
language. Run after the app prompt `../familyplanner-app/claude-prompts/2026-10-06/003-…`
and its all-locales picture run (the runner does both first).

**Do not deploy.** Store day only, with `LIVE_APP_VERSION` 1.9.0.

## Sources
Report 002 "Decisions you should know" (the dropped list), the app reports it
names, the app's ARB labels (`../familyplanner-app/lib/l10n/`), and the app code
when unclear. Do not guess.

## Articles (English facts; same voice and limits as the other Notes articles)

1. **`notes-find`** (NEW, `help/<code>/notes/find.md`, `since: 1.9.0`,
   `media: notes-filter`, order after `notes-pictures-voice`, routes `/notes`,
   related `notes-notes`, `notes-files`). Title like "Find, filter and restore
   notes". Facts:
   - **Mine** and **Shared with me** tabs.
   - Search; the **Filter** button (Type · Tags · Pinned only); active filters
     as chips you can clear; while you search, Type and Tag chips show under
     the field; "+ New tag" in the Filter sheet.
   - Cards: title, date, first attachment or one line, tag colour dots,
     reminder, small icons for what a note holds; the top part hides while you
     scroll.
   - **Recently deleted** (⋯ menu): deleted notes wait 30 days; Undo right
     after deleting, or restore from the list. Picture `notes-trash`.
2. **`notes-files`** (NEW, `help/<code>/notes/files.md`, `since: 1.9.0`,
   `media: notes-files`, routes as the app's setting screen route if it has
   one, else `/notes`; related `notes-pictures-voice`, `account-plus`,
   `vault-where`). Title like "Where note pictures and recordings are kept".
   Facts:
   - The setting (app label for "Pictures and recordings"): **On this phone**
     (free, default; only on this phone and in its backup; other people see a
     small chip that the file is on your phone) or **Daili cloud** (Daili Plus,
     5 GB per family, everyone the note is shared with sees the files on every
     device).
   - Android backs up at most 25 MB of app data, so not every picture may be in
     the phone backup — Daili cloud is the safe choice.
   - Sharing a note whose files are only on this phone asks: share the text
     only, or move the pictures to the cloud.
   - A waiting upload shows a cloud badge; tap it to try again.
   - When Plus ends: nothing is deleted, cloud files stay; new files stay on the
     phone ("paused").
   - A drawing can be edited on the phone it was made on; a cloud drawing needs
     a connection.
3. **`notes-notes`**: put back ONE sentence that was dropped — quick capture:
   the Quick note widget, the Action Button (iPhone) and **Share → daili** from
   any app. Trim elsewhere to stay under the limit if needed. Also add
   `notes-find`, `notes-files` to its `related`.
4. **`notes-pictures-voice`**: replace the "where files live" part with one
   sentence + a pointer to `notes-files` via `related` (no inline links — the
   guard forbids them); keep everything else.

## Pictures
Made before this prompt (en + all locales): `notes-files` (new), `notes-tile`
(re-shot). Add `notes-files` to `help/media*.json` with matching alt text;
commit both ids' WebPs for all locales. List gaps; don't fail for them.

## Constraints
- Translate every new/changed article into all `HELP_LOCALES`
  (`claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md`), app labels per
  language from the ARBs (the app's pt is Brazilian, fr "tu", id "Anda").
- `npm run build` green, `node tools/check-help.mjs` green.
- Untracked files that are not yours (`claude-reports/2026-10-01/`,
  `static/assets/img/blog/…`, `static/assets/img/photos/`): leave them. The
  untracked report `claude-reports/2026-10-05/002-help-sync-1-9-0.md` IS a
  planning doc — commit it in step 0.

## Verify
Build; spot-check `en` `notes-find`, `de` `notes-files`, `ja` `notes-notes`.

## Commit & push
`docs(help): 1.9.0 part 2 — notes-find, notes-files`; body
`Prompt: claude-prompts/2026-10-06/001-help-notes-find-and-files.md`.
**Push. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-10-06/001-help-notes-find-and-files.md`, half a page:
articles × locales, word counts of the 4 Notes articles (en), pictures, build,
SHA + push, store-day deploy reminder. `## Help impact`: n/a.
