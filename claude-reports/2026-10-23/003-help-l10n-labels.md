# 003 — Help: pt, id, nb and th pages quote the app's new words

**Prompt:** `claude-prompts/2026-10-23/003-help-l10n-labels.md`
**Completed:** 2026-10-23 · **Status:** done

## Summary

App commit `199fd6b9` changed 129 strings in pt, id, nb and th. I checked every
changed key against the whole help folder of each language (not only the pages
the app report listed). Where a page quoted an OLD label, it now quotes the NEW
one. Nothing else was rewritten. Step 0 committed the prompt file (`714dff9`).

## Pages changed

- **pt (3):**
  - `budget/split.md`: **Partilhar** → **Compartilhar**, **Deixar de partilhar**
    → **Parar de compartilhar**, picture text "Partilhar com convidados" →
    "Compartilhar com convidados".
  - `cycle/supplies.md`: the card's question → "Sua menstruação pode começar
    em breve. Precisa de algo?", **Guardar em** → **Salvar em**, picture text
    "Pensos higiénicos" → "Absorventes".
  - `account/avatar-ai.md`: picture text "Comprido ondulado" → "Longo ondulado".
- **id (3):** `cycle/supplies.md` ("Haidmu" → "Haid Anda"),
  `account/avatar-ai.md` (**Pilih tampilanmu** → **Pilih tampilan Anda**, ×2),
  `calendar/phone-calendars.md` (**Hanya kamu** → **Hanya Anda**; this was the
  "one more kamu").
- **nb (3):** `anywhere/ai-apps.md` (all "AI-app…" → "KI-app…", incl. title,
  summary and **Tilkoblede KI-apper**; I added the keyword `ki` and kept `ai`),
  `account/avatar-ai.md` (**Dine KI-avatarer**), `account/profile.md`
  ("KI-avatarene dine").
- **th (2):** `account/avatar-ai.md` and `account/profile.md`:
  **สร้างอวาตาร์ด้วย AI**. The keywords still list both spellings.

## Recounts

- `help/pt` European `partilh` (not `compartilh`) = **0**.
- `help/id` `kamu` = **0**. `-mu` = **2**, both "Avatar AI-mu" in
  `account/avatar-ai.md`. I left these on purpose: the app ARB **still says**
  `"appearanceYourAiAvatars": "Avatar AI-mu"` (the app sweep missed this key),
  and help must quote the app. 👉 Suggest an app fix to "Avatar AI Anda", then
  change these two places in help.
- `help/nb` user-visible `AI` = **0** (only lowercase `ai` search keywords stay).
- `help/th`: all labels use `อวาตาร์`; the old `อวตาร` is left only in the
  keywords (as asked).

## Pictures

Committed 45 re-made pictures: `static/help/media/{pt,id,nb,th}/**`. The
picture run did not change any `help/media*.json`, so there was none to commit.
`static/assets/img/photos/` stays untracked.

## Build

`npm run build` → `build OK · 3233 pages`, detector OK, help search OK. No
self-correction needed.

## Deviations from prompt

- **Requirement 4 (`updated:` = today) not done.** A translated page may not
  carry `updated:` — only English has it (`tools/help-lib.mjs:47`, the allowed
  list is id/title/summary/keywords/tipTitle/tipBody/translatedFrom). Adding it
  would break the build. `translatedFrom` is untouched, as asked.

## Commit & push

- `714dff9` `docs(plan): sync planning docs` (this prompt), pushed.
- `0d0a5cd` `docs(help): pt, id, nb, th quote the app's new words`, pushed to
  `origin/main`. `./deploy.sh` was NOT run.

## Help impact

none (this is a help fix)
