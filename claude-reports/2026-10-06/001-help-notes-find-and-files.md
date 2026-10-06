# Help 1.9.0 part 2: notes-find, notes-files

**Prompt:** `claude-prompts/2026-10-06/001-help-notes-find-and-files.md` · **Status:** done · **Commit:** `065c601` (pushed to `origin/main`; step 0 was `30b629f`, planning docs) · **Not deployed.**

## Articles × locales
4 English articles, each in all 24 other `HELP_LOCALES` = 100 files.
- **New:** `notes-find` (order 3, route `/notes`, picture `notes-filter` + `notes-trash`) and `notes-files` (order 4, route `/settings`, which is the app's Settings screen; the setting is in the "Notes" section there). Both have `since: 1.9.0`.
- **`notes-notes`:** the quick-capture sentence is back (Quick note widget, iPhone Action Button, Share → daili → Save). To stay under 150 words I removed the filter picture and the filter sentence; `notes-find` now covers them. `related` now includes `notes-find` and `notes-files`.
- **`notes-pictures-voice`:** the "where files live" paragraph is now one sentence. `notes-files` is in `related`. Its Note line now says only "Android reads text in Latin script only". The backup part moved to `notes-files`.

**Word counts (en):** notes-notes 149 · notes-pictures-voice 109 · notes-find 112 · notes-files 149 (limit 150).

## Decisions you should know
- 🔴 **The prompt's Android fact was wrong, and the help now says something different.** A fact-check of the app code found that `DailiBackupAgent.kt` sends only the vault's documents (plus photos on a phone-to-phone transfer) to the Android backup. Note pictures, recordings and drawings are **never** in the Android phone backup, whatever their size. So the help says: "Files are only on this phone, and in its backup on iPhone" and "On Android, note pictures and recordings are not in the phone backup. Daili cloud keeps them safe." The 25 MB sentence is gone.
  - **App bug:** the app's own hint `settingsNoteFilesPhoneHint` ("Only on this phone, inside its backup") is wrong on Android. Fix the app (add `note_files.json`, `notes/`, `note_drawings/` to the backup agent, minding the 25 MB cap), or change the hint. If the app gets fixed before release, tell me and I'll change the two help sentences back.
- "Tap a chip to clear it" became "tap its ✕": the code clears a filter only from the ✕.
- **5 GB per family** comes from the server, which isn't on this machine. The app only shows it in comments and an ARB example. I kept it, as the prompt and the 1.9.0 articles say it.
- Left out (not asked, small): the filter sheet's **Reset** button; that the top part stays visible while a search is on; Tag chips and the Tags filter exist only on **Mine**.

## Translations
Done by AI sub-agents, not checked by a native speaker. A script filled every button name from the app's ARB files, and the two old picture captions were reused from each language's article. The Action Button name was written from memory in some languages (they were least sure of el "κουμπί Ενεργειών", bg "бутонът за действие", zh 操作按钮 / 動作按鈕, th, id), so a native check would help there. pt: the old European "Partilhar só o texto" in `notes-pictures-voice` is gone with the rewritten sentence.

## Pictures
`notes-files` (new) and `notes-tile` (re-shot): all 25 locales present. Committed: 25 + 25 WebPs and the 25 `help/media*.json` lists (`notes-files` added). No gaps for these ids. The guard still lists its 5 known hand-made picture gaps (anywhere-*, account-tips), which were already there before this run.

## Build
```
content OK · 28 locale(s) · 305 keys each
legal OK · 2 document(s) × 28 locale(s)
help OK · 76 article(s) · 25 locales · 62 app routes checked
test-check-help OK · 99 cases
build OK · 2259 pages · 2239 in hreflang clusters
detector OK · 32 cases · 28 locale(s) built
```
`node tools/check-help.mjs` green. The page count did not change: the new articles stay hidden until `LIVE_APP_VERSION` is 1.9.0. Spot checks in `dist/help/<code>.json`: en `notes-find`, de `notes-files`, ja `notes-notes`. All read right. Green on the first run.

**Reminder:** deploy on store day together with the `LIVE_APP_VERSION` 1.9.0 bump (`./deploy.sh`). I did not deploy.

## Help impact
n/a
