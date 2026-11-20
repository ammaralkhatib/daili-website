# 004 — Privacy policy: say how long server backups are kept

**Result:** done · **Commit:** `36f0c824` docs(legal): privacy policy says how long server backups are kept — pushed to origin/main (28 files: `legal/datenschutz.de.html` + 27 `legal/privacy.*.html`). `./deploy.sh` was NOT run.
**Step 0:** `ad602c2a` docs(plan): sync planning docs (this prompt file), pushed. No commits were held. `static/assets/img/photos/` stayed untouched and unstaged, as in earlier runs.

## "Encrypted": not used
The api repo's `DEPLOY.md` "Backups" says in so many words: "The backups are not encrypted". Plesk "password protection" is off on purpose, and it would only encrypt the passwords inside the backup anyway. `SERVER-CHECK-PLAN.md` §7 says the same ("the backup data is NOT encrypted"). So every page says "server backups", never "encrypted server backups".

## What changed (the same 3 spots in every file)
1. **Processors list** (section 4, the service-providers `<li>`): Hetzner Online GmbH now "stores note files in Daili cloud and server backups". Host Europe stays the server host.
2. **Section 7:** "Note files in Daili cloud and server backups are stored by Hetzner Online GmbH in Germany."
3. **Section 8:** one new `<p>` right after the section's existing paragraph (which holds the 30-day sentence). No `<strong>`, no new `<h2>`.

The date: every privacy body already said `2026-11-20` (from today's prompt 001), so it did not need to change. check-legal confirms they all carry the same date.

## New paragraph — English (binding text)
> We keep backups of the server for about 4 weeks (weekly full backups plus the daily changes), on the server and in Hetzner storage in Germany. So after your account is deleted, its data can stay in a backup for up to about 4 more weeks; then it is gone for good. We use backups only to bring Daili back after a failure, never to restore or look at single accounts.

## New paragraph — German (`datenschutz.de.html`, "du" as on the rest of the page)
> Sicherungen des Servers (Backups) bewahren wir etwa 4 Wochen auf (wöchentliche Vollsicherungen plus die täglichen Änderungen), auf dem Server und in einem Speicher bei Hetzner in Deutschland. Nach der Löschung deines Kontos können seine Daten deshalb noch bis zu etwa 4 weitere Wochen in einer Sicherung liegen; danach sind sie endgültig gelöscht. Wir nutzen Sicherungen nur, um Daili nach einem Ausfall wiederherzustellen — nie, um einzelne Konten wiederherzustellen oder einzusehen.

German sections 4 and 7 now say: "die Notiz-Dateien in der Daili Cloud und die Sicherungen des Servers speichert" and "Notiz-Dateien in der Daili Cloud und die Sicherungen des Servers speichert die Hetzner Online GmbH in Deutschland."

## Languages
- **28 files changed:** en and de (by me) plus 26 more (ar bg cs da el es fi fr hi id it ja ko nb nl pl pt ro ru sk sv th tr uk zh-Hans zh-Hant). Four sub-agents did them, all on model claude-opus-5-5, and I waited for all four before committing.
- Each file changed in exactly 3 lines (3 added, 2 replaced). A character-level diff shows that nothing was taken out except small grammar rewordings: ja, ko, zh-Hans and zh-Hant reordered the Hetzner clause in section 4 so "and server backups" fits, and hi changed one verb ending (बैकअप is masculine).
- Each page keeps its own form of address (formal: cs, fr, hi, ja, ko, ru, tr; informal: all the others, the same as before).
- Small choices the agents made: id adds "(backup)" because "cadangan" already means "fallback" on that page; es and it use a comma, not a dash, to match their section 8; fi uses the case forms "Hetznerin" and "Dailin", as that page already does with "Dailin"; th now has "และ" twice in the processors list item. That is correct Thai, just a bit heavy.

## Verification
- `npm run build` (check-content, check-reviews, check-legal, check-help, test-check-help, test-blog-i18n, build, check-build, test-detector, test-help-search), run in the foreground: all passed — "build OK · 3759 pages".
- `node tools/check-legal.mjs`: `legal OK · 2 document(s) × 28 locale(s)` (same `<h2>` count, binding-language note, one date).
- `npm test`: detector OK, test-check-help OK (99 cases), help search OK, test-blog-i18n OK (48 cases).
- `git diff --stat` before the commit: only `legal/privacy.*.html` and `legal/datenschutz.de.html`.

## Open items for the owner
- Deploy the website (`./deploy.sh`) when it suits. The app shows the policy from the website.

## Help impact
none
