# Help: new article "Share folders and albums with your family" (hidden until the release)

Standard lane, website only. Feature "Vault 2 — share Documents folders and Photos albums, encrypted"
(Daili list item #64). Plan: `/Users/ammarkhatib/development/flutter_projects/familyplanner/familyplanner-app/claude-prompts/VAULT-SHARING-PLAN.md`
(**Decisions** D1–D7). Design words: `/Users/ammarkhatib/development/flutter_projects/familyplanner/design-handovers/2026-11-23-vault-sharing-RESULT.md`.
It ships in its OWN app release behind a server switch (not decided when). The Help center needs the
article now, hidden.

Every sub-agent you start MUST use model claude-opus-5-5. Write the report with the file-write tool.

## 1. Keep it hidden

Same way as `help/en/lists/steps.md` (prompt `claude-prompts/2026-11-21/002-help-steps-inside-a-todo.md`
§1): `since: 99.0.0` in the English file, NO `related:` link FROM any other article to it, do NOT bump
`LIVE_APP_VERSION`. Do NOT change `help/*/vault/documents.md`, `photos.md` or `where.md` now (translations
carry no `since`, so a change would go live at once) — the release help sync changes them (the word
**Send to another app**, the share switch, Recently deleted, the link to this article).

## 2. The article — `help/en/vault/sharing.md`, id `vault-sharing`

Front matter like `help/en/vault/documents.md`: topic `vault`, title "Share folders and albums with your
family", a one-line summary, keywords (share, family folder, shared folder, shared album, encrypted,
end-to-end, locked, other phone, iPad, recently deleted, put back, stop sharing, waiting), `routes:` the
app's new routes (Recently deleted for Documents and Photos — take the exact paths from the app report
`claude-reports/2026-11-23/016-…` / `017-…` in `../familyplanner-app`; add them to
`help/routes-allowlist.json` if the build's `check-help` needs it), `tryIt: /documents`, `since: 99.0.0`,
`updated:` today, `mediaPending:` "a shared folder with the green 'Shared with …' card, and the 'Share
with family' sheet", `order:` after `vault-photos`, `related: vault-documents, vault-photos, vault-where`.

**Check every fact against the app code before you write it** (`../familyplanner-app`: the en texts in
`lib/l10n/app_en.arb` — search `vaultShare`, `vaultCard`, `vaultWho`, `vaultRecentlyDeleted`,
`vaultWaiting` — and the app reports `claude-reports/2026-11-23/014-…` to `017-…`). The app prompts run
BEFORE this one; if a report is missing, write from the RESULT and list every fact under "Facts I could not
confirm". Use the app's EXACT button names in **bold**. Words: "phone" = the device (an iPad counts);
"locked" for encrypted (one sentence may say "end-to-end encrypted"). Style: short sentences, easy words,
numbered steps, "you", ≤ 220 words. Content:

1. One line: share one Documents folder or Photos album with everyone in one family; the files go onto
   their phones.
2. Numbered: tap **⋮** on a folder → **Share with <family>** (or the **Share with family** switch in the
   folder sheet) → check who gets it → **Share with family**.
3. Who gets it: every family member with their own login, on all their phones. Children without their own
   login don't get it.
4. Anyone can add, rename and delete. Deleted files go to **Recently deleted** on every family phone; **Put
   back** works for 30 days.
5. `> Note:` Files are locked on your phone. Our server only passes them on, can't open them, and deletes
   them as soon as every phone has them (at most 30 days). A file can be at most 25 MB.
6. Waiting: phones get files only when Daili is open; "Waiting for a family phone to open Daili" means just
   that. On mobile data Daili asks before a download over 20 MB. A new phone gets the shared folders when a
   family phone opens Daili.
7. **Stop sharing** (anyone): everyone keeps the files they have, as a private folder. Leaving the family:
   you keep a copy; new files no longer come.

## 3. Translations

A new English article breaks the build until it exists in every `HELP_LOCALES` language (`site.config.mjs`).
Translate it into all of them following `claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md`, with
`translatedFrom` = the English `updated` — exactly as `claude-prompts/2026-11-21/002-help-steps-inside-a-todo.md`
§3 did. Use each language's REAL app words from `../familyplanner-app/lib/l10n/app_<arb>.arb` (the `vault…`
keys; zh-Hans → `app_zh.arb`, zh-Hant → `app_zh_Hant.arb`). 🔴 No real user's names in examples (made-up
family "Papadopoulou-Schneider family" is fine, like the design boards).

## 4. Verify

- `npm run check:help` and `npm run build` green (FOREGROUND); spot-check 5 translations against their ARB. The article does NOT show on the built site's index or
  search (prove it: grep `dist/` for the id outside its own page, or how 2026-11-21/002 proved it).

## Commit & push

- `docs(help): article "Share folders and albums with your family" (hidden, since 99.0.0)`; body names
  `Prompt: claude-prompts/2026-11-23/003-help-share-folders-albums.md`.
- **Push now.** Do NOT run `./deploy.sh` (Ammar deploys; nothing changes on the live site anyway).

## Report

- `claude-reports/2026-11-23/003-help-share-folders-albums.md` (file-write tool, `wc -c` > 0). Facts I
  could not confirm; the routes added; the open items for the release help sync (real `since`, the lines +
  `related` link in `vault-documents` / `vault-photos` / `vault-where` in all locales, "Share" → **Send to
  another app** there, the pictures). `## Help impact`: new hidden article `vault-sharing`.
