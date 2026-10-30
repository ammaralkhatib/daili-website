# Commit the 1.14.0 privacy edits (finish of prompt 003)

**Prompt:** `claude-prompts/2026-10-29/005-legal-1-14-0-commit.md`
**Completed:** 2026-10-30 · **Status:** done

## Summary

Prompt 003's privacy edits are now committed and pushed. Before that, I made
the one small text change this prompt asked for. Step 0 had nothing to do:
no planning docs were waiting.

## Files committed (29)

- `legal/privacy.*.html` (27 files) and `legal/datenschutz.de.html`: 003's
  edits (unchanged), plus the one new sentence below.
- `tools/check-legal.mjs`: 003's guard (every privacy body must have
  `id="wall-screens"`).
- Not committed: `static/assets/img/photos/` (not mine, left alone).

## The changed sentence

The sentence sits in the `wall-screens` paragraph, in all 28 bodies. I
translated it myself and used no sub-agents. A small script swapped the
sentence and checked that the old one appeared exactly once in each file,
inside `wall-screens`.

- en: "Unused set-up codes are deleted within a day." → "Set-up codes are
  deleted after about a day."
- de: „Nicht benutzte Einrichtungs-Codes werden innerhalb eines Tages
  gelöscht." → „Einrichtungs-Codes werden nach etwa einem Tag gelöscht."
- Examples from the others: fr "Les codes de configuration sont supprimés au
  bout d'environ une journée.", ja "設定用のコードは約1日後に削除されます。", ru
  "Коды настройки удаляются примерно через сутки.". The Nordic languages,
  pl, ru and uk use their usual word for 24 hours (døgn/dygn/doba/сутки/доба),
  the same word the old sentence used.

Reason: the hourly clean-up deletes every set-up code older than 24 hours,
used or not. So "unused … within a day" was not exact.

## Verification

```
$ node tools/check-legal.mjs
legal OK · 2 document(s) × 28 locale(s)

$ npm run build            (no HELP_SKIP_ROUTE_CHECK)
build OK · 3283 pages · 3253 in hreflang clusters
detector OK · 32 cases · 28 locale(s) built
help search OK · 26 cases · 2 built page(s)
exit=0
```

The help route check is green now, because prompt 004 added the
`/lists/archived` + `/lists/templates` article. The app repo's routing
folder had no uncommitted changes, so the build checked the committed app
routes. Self-correction: none needed.

Built pages: `dist/privacy.html`, `dist/datenschutz.html`,
`dist/fr/privacy.html` and `dist/ja/privacy.html` each have exactly one
`id="wall-screens"` paragraph. In en and de the new sentence reads well and
leads smoothly into "A parent can remove a screen…" / „Ein Elternteil kann
einen Bildschirm jederzeit entfernen…". Both pages carry
`datetime="2026-10-30"`.

## Commit & push

- **Commit:** `c6d837d` `docs(legal): 1.14.0 — language per device, family wall screens` (29 files)
- **Push:** pushed to `origin/main` (`7b01f5f..c6d837d`). `./deploy.sh` was NOT run.

## Help impact

none

## Open items for the owner

- Run `./deploy.sh` when you want the new privacy policy live on daili.app.
