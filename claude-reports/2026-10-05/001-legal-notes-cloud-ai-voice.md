# 001 — Privacy + Terms: note files in Daili cloud (Hetzner), AI in Notes, voice, link previews

Commits: `5cd0413` (step 0: the three 2026-10-05 prompts), `b7825c2` (the work). Both pushed to `origin/main`. `./deploy.sh` **not** run — the legal pages are not live until you deploy.

## Files changed (57, all in `b7825c2`)
- `legal/privacy.*.html` ×27 + `legal/datenschutz.de.html`: AI paragraph replaced; new `<p id="notes-files">`, `<p id="voice">`, `<p id="link-previews">` after it (before `#plus`); Hetzner clause in the §5 service-provider `<li>`; Hetzner sentence at the end of §7; dated 2026-10-06.
- `legal/terms.*.html` ×27 + `legal/nutzungsbedingungen.de.html`: §6 "What it is" (note AI action + 5 GB Daili cloud) and the sentence added to "Cancelling and refunds"; dated 2026-10-06.
- `tools/check-legal.mjs`: `NOTES_MUST_CONTAIN`.

Every privacy diff is +7/−4 and every terms diff is +3/−3. English is the prompt's text word for word.

## German: where I left the prompt's wording — please confirm or revert
- **Register.** The prompt calls `datenschutz.de.html` "Sie", but the file is "du" throughout (same finding as report 2026-10-01/001). I kept the prompt's sentences and changed only the pronouns (du/dein/dir), so the binding German page doesn't mix registers.
- **ARB words** (`app_de.arb` at app HEAD): the app says **"Daili Cloud"** without a hyphen (`settingsNoteFilesCloud`, "Die Daili Cloud gehört zu Daili Plus."), so "Daili-Cloud" became "Daili Cloud" in privacy and terms. "Zuletzt gelöscht" (`notesRecentlyDeleted`) and "Einstellungen → Notizen" already matched. The compound "5 GB Daili-Cloud-Speicher" in the terms keeps its hyphens, because German spelling needs them inside a compound.
- **Punctuation in the provider `<li>`.** The German list used commas ("…hostet, und Google"). With the prompt's clause it now reads "…hostet; die Hetzner Online GmbH (Deutschland), die Notiz-Dateien in der Daili Cloud speichert; und Google…".

## The other 26 locales
Translated by me from the English, in each file's own register, and applied by one script that refused to write unless every anchor matched in all 56 files. No native-speaker review was done.
- App words come from each ARB: `settingsNoteFilesCloud`, `notesRecentlyDeleted`, `settingsTitle` → `notesTitle`. ru, hi and ar have no ARB, so those are natural translations ("облако Daili", "Daili क्लाउड", "سحابة Daili").
- Each file keeps its own AI heading, its own GDPR citation (copied from its `#plus` paragraph) and its `class="translated"` note.
- Storage size is "5 GB" everywhere except fr "5 Go", ru/uk "5 ГБ" and ar "5 غيغابايت".
- Finnish says "(sisältyy Daili Plus -tilaukseen)" for "part of Daili Plus", because the legal file and the ARB inflect "Plus" differently.

## Facts
The api repo is not on this machine, so I could not re-check the server facts (bucket, purge after 30 days, link-preview cache, `storage_gb`). On the app side I confirmed only the speech claim: `pubspec.yaml` uses `speech_to_text` with the phone's own recognizer. Nothing I saw contradicts the text.

## Guard + proof it fails
`node tools/check-legal.mjs` → `legal OK · 2 document(s) × 28 locale(s)`. I removed `id="voice"` from `legal/privacy.fr.html` and ran it again: `1 legal error(s): legal/privacy.fr.html does not contain id="voice" — note files, voice and link previews are in every locale`, exit 1. Restored, and it was OK again.

## Build
`npm run build` passed the whole chain on the first run: `build OK · 2259 pages`, `detector OK · 32 cases · 28 locale(s) built`. `check-help` did not fail, so **no routes were added to `pending`**. Checked in `dist/`: `privacy.html`, `datenschutz.html`, `fr/privacy.html`, `ja/privacy.html`, `ar/privacy.html` (all three new paragraphs, `#notes-files`, Hetzner, new date) and `terms.html`, `nutzungsbedingungen.html`, `fr/terms.html`, `ja/terms.html` (5 GB sentence, "When Plus ends…", new date).

## Not mine, left untouched
- `static/assets/img/blog/what-to-look-for-family-app.webp` and `static/assets/img/photos/` (9 files).
- `claude-reports/2026-10-01/001-legal-daili-plus.md`. The run instructions say to commit pending planning docs, but this prompt says not to touch, stage or commit that folder, so step 0 committed only `claude-prompts/2026-10-05/`. It is still untracked — tell me if the next run should commit it.

Note that `./deploy.sh` builds from the working tree, so the untracked images would be copied into `dist/`.

## Help impact
None.
