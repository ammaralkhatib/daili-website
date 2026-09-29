# Help center: "daili on your Apple Watch" article

## Goal
The Apple Watch app is announced with the next build (app prompt
2026-09-29/012). Add one Help article so users (web + the app's Help screen,
which downloads `help/en.json`) learn what the watch does and how to set it
up. Done = the article exists in English and all 24 translations, with the
watch screenshots the app's `tool/watch-shots.sh` produced.

## Scope
- In: `help/en/anywhere/apple-watch.md` + `help/<code>/anywhere/apple-watch.md`
  for every help locale, `help/media.json`, `static/help/media/**/watch-*.webp`
  (already written by the app tool — commit them), `help/routes-allowlist.json`
  only if needed.
- Out: other articles (except one `related:` link from
  `anywhere-widgets` to this one), site pages, the app.

## Requirements
1. Front matter like `help/en/anywhere/wall.md`: `id: anywhere-watch`,
   `topic: anywhere`, title "daili on your Apple Watch", a one-line summary,
   keywords (apple watch, watch, wrist, complication, watch face, smart
   stack, shopping list, voice…), `since:` = the next app version (read the
   latest cut in `../familyplanner-app/CHANGELOG.md`; next minor after
   1.7.0 → `1.8.0` unless PLAN.md says otherwise — say which), `order`
   after widgets, `media: watch-up-next` (+ one more image allowed:
   `watch-shopping`), `related: anywhere-widgets, lists-…` (real ids).
2. Body (short, plain, like the other articles — rules in
   `tools/help-lib.mjs`):
   - What you see: Up next (with tonight's dinner and the next birthday),
     Shopping, My to-dos, Habits with Minzi — tap to tick, tap again within
     3 seconds to undo.
   - Set up: numbered list — 1. On your iPhone open the **Watch** app →
     Available Apps → **Install** next to daili. 2. Open daili on your
     iPhone once, so the watch gets your sign-in. 3. Open daili on the watch.
   - Voice: the pencil on Up next for a quick note; "+ Add item" on Shopping.
   - Watch face: long-press the face → **Edit** → Complications → daili
     (next event, or Quick note).
   - `> Note:` the watch needs a paired iPhone with daili; after an update,
     open daili on the iPhone once. Do NOT mention Siri.
   - A `tipTitle`/`tipBody` for the tips sheet with `tipSkipIf` if a fitting
     key exists in `help/skip-keys.json` (e.g. "no paired watch" — if no key
     fits, no tip; don't invent a key).
3. Translations for every help locale, natural wording, `translatedFrom` =
   the English `updated`. Use the localized watch pictures where the tool
   produced them; the build rules decide the fallback — follow them.
4. `npm run build` (the full guard chain: check-help etc.) passes.

## Commit & push
- `docs(help): daili on your Apple Watch`
- Body includes `Prompt: claude-prompts/2026-09-29/001-help-apple-watch.md`.
- **Push now**. Never deploy (Ammar runs `./deploy.sh`).

## Report
- `claude-reports/2026-09-29/001-help-apple-watch.md`, max ~a third of a page;
  owner step: `./deploy.sh` (website).
