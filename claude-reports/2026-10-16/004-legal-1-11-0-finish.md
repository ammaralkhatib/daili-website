# Finish the 1.11.0 privacy text

**Prompt:** `claude-prompts/2026-10-16/004-legal-1-11-0-finish.md`
**Completed:** 2026-10-16 · **Status:** done

## Summary

The work from prompt 001 and this prompt is in one commit, and it is pushed. The build passes again. `./deploy.sh` was not run.

## Step 0

There were no planning docs to commit. The prompts were already committed in `dbdda7a`. The uncommitted `legal/` files and `tools/check-legal.mjs` were prompt 001's work, as the prompt said.

## 1. Two routes parked (`help/routes-allowlist.json` → `"pending"`)

- `"/lists/supplies": "Cycle supplies screen (app 1.11.0) — article cycle-supplies comes in help sync 2026-10-16/003."`
- `"/budget/:id/trends": "Budget Compare months (app 1.11.0) — article budget-trends comes in help sync 2026-10-16/002."`

## 2. Activity paragraph (`id="activity"`, all 28 bodies)

English, now in `legal/privacy.en.html`:
> To know how many people use Daili each day, our server notes one short line for each day and each way you used Daili: the date, the time of your first use that day, where you used it (the iPhone or Android app, the web app, a widget, the watch, a wall display, or the app in the background) and the app version. It does not note what you did. For the days before we started counting (October 2026), these lines may be estimated from the dates of your earlier activity in Daili.

German, now in `legal/datenschutz.de.html`:
> Damit wir wissen, wie viele Menschen Daili jeden Tag nutzen, notiert unser Server für jeden Tag und jede Art, wie du Daili genutzt hast, eine kurze Zeile: das Datum, die Uhrzeit deiner ersten Nutzung an diesem Tag, womit du Daili genutzt hast (die iPhone- oder Android-App, die Web-App, ein Widget, die Uhr, ein Wand-Display oder die App im Hintergrund) und die App-Version. Was du gemacht hast, wird nicht notiert. Für die Tage, bevor wir mit dem Zählen begonnen haben (Oktober 2026), können diese Zeilen aus den Daten deiner früheren Aktivität in Daili geschätzt sein.

The other 26 locales were translated from the English: ar bg cs da el es fi fr hi id it ja ko nb nl pl pt ro ru sk sv th tr uk zh-Hans zh-Hant. Each file keeps its own way of addressing the reader (formal or informal) and its own punctuation (no spaces in ja, no full stops in th). The corrected source list from 001 is kept (no TRMNL, "the app in the background" included). A script outside the repo made the changes. It changes nothing if any old sentence is missing or appears twice. All 28 matched on the first run.

## 3. Brazilian Portuguese

In `legal/privacy.pt.html`, the supplies example now says “Absorventes” (Brazilian) instead of the European ARB label “Pensos higiénicos”. This file is written in Brazilian Portuguese, but the app's pt ARB file uses European Portuguese, so here the privacy text and the app label are different on purpose.

## Verification

```
$ node tools/check-legal.mjs
legal OK · 2 document(s) × 28 locale(s)

$ npm run build
build OK · 2748 pages · 2728 in hreflang clusters
detector OK · 32 cases · 28 locale(s) built
```

Rendered check: `dist/privacy.html` has "the time of your first use that day" and "before we started counting (October 2026)". `dist/datenschutz.html` has "Uhrzeit deiner ersten Nutzung" and "bevor wir mit dem Zählen begonnen haben (Oktober 2026)". `dist/pt/privacy.html` has "horário do seu primeiro uso", "início da contagem (outubro de 2026)" and “Absorventes”.

## Commit & push

- `8a077d2`: `docs(legal): 1.11.0 — daily activity count, Cycle supplies + import, web place search` (30 files: 28 legal bodies, `tools/check-legal.mjs`, `help/routes-allowlist.json`). Pushed (`9f3af2d..8a077d2`).
- `./deploy.sh` was not run.
- Untracked files that are not mine were left alone: `static/assets/img/blog/what-to-look-for-family-app.webp` and `static/assets/img/photos/`.

## Second run (same day)

The prompt was given again. `8a077d2` was already pushed (`main` = `origin/main`), so nothing was redone. Checked again: all 4 exact sentences/words are in the files, both `pending` entries are there, `node tools/check-legal.mjs` → `legal OK · 2 document(s) × 28 locale(s)`, `npm run build` → `build OK · 2748 pages` + `detector OK · 32 cases`, and the new sentences render in `dist/privacy.html`, `dist/datenschutz.html` and `dist/pt/privacy.html`. The first run had not committed this report, so it is committed now on its own (`docs(report)`).

## Open items for the owner

- Deploy when ready. After help syncs 002/003 add their articles, remove the two `pending` entries.

## Help impact

none
