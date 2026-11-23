# 003 — Help: new article "Share folders and albums with your family" (hidden, since 99.0.0)

**Prompt:** `claude-prompts/2026-11-23/003-help-share-folders-albums.md`
**Completed:** 2026-11-23 · **Result:** done · **Commit:** `9cb94a56`, pushed to origin/main together with this report's commit. `./deploy.sh` was NOT run.

## Summary

I wrote the new help article `vault-sharing` (`help/en/vault/sharing.md`) and translated it into all 24 other help languages. It is hidden like `lists-steps`: `since: 99.0.0`, no `related:` link from any other article, `LIVE_APP_VERSION` unchanged, and `documents.md` / `photos.md` / `where.md` untouched in every language. Every fact was checked against the app code at HEAD (ARB + app reports 014–017, all present) and the api (`config/vault.php`, `VaultFolderController.php`, `VaultRelayItem.php`). Then a fresh fact-check sub-agent checked it again (see Decisions). `check:help` and `npm run build` pass.

**Step 0:** I committed and pushed prompts 003 and 004 first (`44ae89e4 docs(plan): sync planning docs`). Nothing was held. `static/assets/img/photos/` was left untracked, as earlier runs did (it has been there since September; it is not a planning doc and not mine). The other `claude -p` run at the time was in `daili-web`, a different repo.

## Files touched

- `help/en/vault/sharing.md`: the new article. Front matter as the prompt says. `routes: /documents/deleted, /photos/deleted` (the two new app routes from 016 and 017), `tryIt: /documents`, `order: 4` (after `vault-photos` = 3), `related: vault-documents, vault-photos, vault-where`, `mediaPending` set.
- `help/<24 locales>/vault/sharing.md`: the translations, `translatedFrom: 2026-11-23`.

## Decisions

- **The article is 150 words, not the prompt's "≤ 220".** The guard (`tools/help-lib.mjs` LIMITS) allows 150 words in English and 12 keywords, and it fails the build above that. I changed no tooling. I left out the lowest-value facts (listed below) instead.
- **12 keywords, not 13.** I dropped "other phone"; the body says "phone" anyway. "iPad" became `ipad` because keywords must be lower case.
- **Routes: no allowlist change needed.** Before my change `check:help` was RED on exactly these two routes ("app route … has no article"). The new article lists them, so the guard is green again. `help/routes-allowlist.json` is untouched.
- **"Share with …".** The menu label is "Share with {family}", and the family name sits in a different place in each language (de "Mit {family} teilen", ja "{family}と共有"). So all languages show the ARB label with `…` for the name.
- **The fact-check fixed 3 sentences** (a fresh claude-opus-5-5 sub-agent, read-only):
  1. "Anyone can add, rename and delete": single photos can't be renamed. It now says "add, delete and rename files".
  2. The exact "Waiting for a family phone to open Daili" text shows only on file rows. A new phone shows a grey card tagged "Waiting for a family phone". It now says "…means just that. A new phone waits too."
  3. Stop sharing: people keep only "what they have" now, and an album becomes a private album. It now says "as a private folder or album".

  I did not follow its advice to capitalise "Daili" in running text. The help style is lowercase "daili" (HELP-TRANSLATION-RULES). App labels keep the app's "Daili".
- **Two English clarifications after the translators flagged them:** "If you leave" → "If you leave the family", and "in its sheet" → "under **Edit**" (`vaultItemMenuEdit`). The translations already said "leave the family" and "when you create or edit it", so no translation needed a second round.
- **Translation pipeline:** one English template with `{{arbKey}}` placeholders. A script (`/tmp/help-vs/fill.mjs`) filled every bold label from `app_<arb>.arb` and ran `parseArticle` per locale. First I checked that the template rebuilds the English body byte for byte. Six claude-opus-5-5 translators ran in the foreground (4 languages each), and all 24 came back `ok` on the first try. I waited for all of them before committing. Sizes: 137–190 words (cap 210); ja 478 / ko 372 / zh 329–331 / th 824 characters (all under their caps).

### Prompt facts left out (word cap)

- On mobile data, daili asks before a download over 20 MB (true: `config/vault.php` `metered_ask_bytes`). The app's own dialog "Download … on mobile data?" explains it.
- "One family" is not stressed as a rule in the body; the summary says it.
- "Everyone in one family" is written as "Everyone with a login … on all their phones" (D6). "An iPad counts" is only a keyword, not a sentence.

## Facts I could not confirm

None. All four app reports (014–017) were there, and every sentence matches the code:

- the labels: `app_en.arb` 8339–8513;
- 25 MB, 30 days, 20 MB: `config/vault.php`;
- the server deletes a file once every phone has it, after 30 days at the latest: `VaultRelayItem.php`;
- any login member may stop sharing: `VaultFolderController::destroy`, D3;
- files move only while daili is open: plan "Traps", `vault_sync_triggers.dart`;
- you keep a copy when you leave: `vaultLeaveDialogLine`.

## Verification

```
$ npm run check:help          (before my change)
2 help error(s): app route "/documents/deleted" / "/photos/deleted" has no article

$ npm run check:help          (after, foreground)
help OK · 119 article(s) · locale(s) en … id (25) · 96 app routes checked

$ npm run build               (foreground)
help: 115 of 119 article(s) on pages (live 1.17.0) …
build OK · 3759 pages · 3728 in hreflang clusters
detector OK · 32 cases · help search OK · 38 cases
```

**Hidden, proven the way 2026-11-21/002 did it:**

- "115 of 119 article(s) on pages", and the page count is still 3759;
- no `dist/help/vault/sharing` page, and the sitemap has 0 hits for "sharing";
- `vault-sharing` appears only in the 25 `dist/help/<loc>.json` app feeds, with `since 99.0.0`. That is the same 25 files as the hidden `lists-steps`, and the app's version filter hides it there;
- no other `help/**` file names `vault-sharing`.

**Spot check against the ARB (5):**

- de, fr, el, ja, zh-Hant: every bold label equals the ARB value. I checked ja and zh-Hant key by key: `vaultShareMenuShare`, `vaultShareSwitchTitle`, `vaultShareButton`, `vaultPutBack`, `vaultRecentlyDeletedTitle`, `vaultShareMenuStop`, `vaultWaitingForPhone`, `documentsTitle`, `photosTitle`.
- The sentences read naturally around the labels.
- Greek never says "family planner".

Self-correction: the English went from 205 to 164, 156, 152 and finally 150 words before any translation. No gate failed after that.

## Translator notes (not errors)

- **fi:** the app's menu label `vaultShareMenuShare` says "Jaa ryhmälle …" ("Share with group …"). The switch and button say "Jaa perheelle". That is the app's own ARB text, and I used it as is. The app may want to align it.
- **pt:** the quotes are “ ” as in the other pt help articles (the app uses « »).
- **el:** the ARB waiting text says "τηλέφωνο", while the Greek help articles say "κινητό". Both read fine.

## Help impact

New hidden article `vault-sharing` ("Share folders and albums with your family", since 99.0.0). It covers the new screens `/documents/deleted` and `/photos/deleted`.

## Open items for the owner (the release help sync)

- Set the real `since:` in `help/en/vault/sharing.md` when the release version is known.
- `vault-documents`, `vault-photos`, `vault-where` in ALL 25 locales:
  - add a line about sharing and a `related: vault-sharing` link;
  - change "Share" → **Send to another app** (`documents.md` step 4 + the "Share sends a copy…" paragraph; `photos.md` step 4);
  - mention the share switch, the "Shared" tag, the new privacy line and Recently deleted;
  - `where.md`: its summary says Documents "never" go to the family. That needs a "unless you share a folder" line.
- Shoot the pictures (`mediaPending`): a shared folder with the green "Shared with …" card, and the "Share with family" sheet.
- Deploy: whenever you like. Nothing changes on the live site.

## Deviations from prompt

- 150 words and 12 keywords instead of ≤ 220 and 13 (the guard's hard caps).
- The mobile-data line was left out (see above).
- Step 1 says "under **Edit**" for the switch. The switch is also in the New folder / New album sheet; the translations say "when you create or edit it".
