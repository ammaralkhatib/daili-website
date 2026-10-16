# Finish the 1.11.0 privacy text (prompt 001 was blocked) — 3 corrections + park 2 routes + commit

## Why
Prompt `2026-10-16/001-legal-1-11-0` did all the work but could not commit:
`npm run build` fails in `check-help` because the app already has two new
screens (`/lists/supplies`, `/budget/:id/trends`) whose help articles come
later (prompts 002/003). Its report also found three points where the text
was not exact. Planning Claude decided all of them on 2026-10-16. Read
`claude-reports/2026-10-16/001-legal-1-11-0.md` first.

## 🔴 Step 0 exception
The uncommitted changes in `legal/*.html` (28 files) and
`tools/check-legal.mjs` are **this lane's own work from prompt 001 —
expected**. Do NOT stop as `blocked` because of them. Commit pending planning
docs as usual, then continue on top of those changes. Other untracked files
that are not yours (`claude-reports/2026-10-01/`, `static/assets/img/blog/…`,
`static/assets/img/photos/`) stay untouched.

## 1. Park the two routes (unblocks the build)
In `help/routes-allowlist.json` → `"pending"`, add:
- `"/lists/supplies": "Cycle supplies screen (app 1.11.0) — article cycle-supplies comes in help sync 2026-10-16/003."`
- `"/budget/:id/trends": "Budget Compare months (app 1.11.0) — article budget-trends comes in help sync 2026-10-16/002."`
Nothing else in that file.

## 2. The activity paragraph — exact text (all 28 bodies)
Prompt 001 kept the corrected source list (no TRMNL, "the app in the
background" added) — keep that. Now replace, in `id="activity"`:

English — the sentence starting `To know how many people use Daili each day`
becomes:
`To know how many people use Daili each day, our server notes one short line for each day and each way you used Daili: the date, the time of your first use that day, where you used it (the iPhone or Android app, the web app, a widget, the watch, a wall display, or the app in the background) and the app version.`
and right after `It does not note what you did.` insert:
`For the days before we started counting (October 2026), these lines may be estimated from the dates of your earlier activity in Daili.`

German — the sentence starting `Damit wir wissen, wie viele Menschen Daili jeden Tag nutzen` becomes:
`Damit wir wissen, wie viele Menschen Daili jeden Tag nutzen, notiert unser Server für jeden Tag und jede Art, wie du Daili genutzt hast, eine kurze Zeile: das Datum, die Uhrzeit deiner ersten Nutzung an diesem Tag, womit du Daili genutzt hast (die iPhone- oder Android-App, die Web-App, ein Widget, die Uhr, ein Wand-Display oder die App im Hintergrund) und die App-Version.`
and after `Was du gemacht hast, wird nicht notiert.` insert:
`Für die Tage, bevor wir mit dem Zählen begonnen haben (Oktober 2026), können diese Zeilen aus den Daten deiner früheren Aktivität in Daili geschätzt sein.`

Other 26 locales: translate both changes from the ENGLISH, in each file's
own register, same way as prompt 001 did.

## 3. Brazilian Portuguese
`legal/privacy.pt.html` is Brazilian. Use the Brazilian word for the
supplies example ("Absorventes") instead of the European ARB label, and
say so in the report.

## 4. Build + checks
- `node tools/check-legal.mjs` → OK.
- `npm run build` → must pass now (help check sees the two `pending` routes).
- Read `dist/privacy.html`, `dist/datenschutz.html`, `dist/pt/privacy.html`:
  the new sentences render.

## Commit & push
ONE commit with everything from prompt 001 + this prompt:
`git add legal/ tools/check-legal.mjs help/routes-allowlist.json` (your files
only) →
`docs(legal): 1.11.0 — daily activity count, Cycle supplies + import, web place search`;
body:
```
Prompt: claude-prompts/2026-10-16/001-legal-1-11-0.md
Prompt: claude-prompts/2026-10-16/004-legal-1-11-0-finish.md
```
**Push now. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-10-16/004-legal-1-11-0-finish.md`, short: the two
pending entries, the exact EN/DE sentences now live in the files, locales
updated, pt word, check-legal + build lines, SHA + push.
`## Help impact`: none.
