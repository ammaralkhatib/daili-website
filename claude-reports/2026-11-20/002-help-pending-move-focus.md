# 002 — Help route check: Move and Focus routes wait as "pending"

**Result:** done · **Commit:** see the last line of this report (one commit: `help/routes-allowlist.json` + this report) — pushed to origin/main. `./deploy.sh` was NOT run (the prompt says so).
**Step 0:** `49d3c39e` docs(plan): sync planning docs (prompts 002 and 003 of today), pushed. No commits were held. `static/assets/img/photos/` stayed untouched and unstaged, as in earlier runs.

## What changed

`help/routes-allowlist.json` — the `"pending"` list was empty. It now has the 5 new app routes, each with the reason the prompt gave:

- `/focus` → "Focus timer (in the app, not released yet) — article at the next release help sync."
- `/move`, `/move/routine/:key`, `/move/session`, `/move/statistics` → "Move (in the app, not released yet) — article at the next release help sync."

`"never"` is unchanged. In plain words: the help check compares the app's list of screens with the help articles. These 5 screens are in the app's `main` but not released, so they have no article yet. "pending" tells the check "an article will come later", so the build no longer stops on them.

## Check before the change

`node tools/check-help.mjs` (reads `../familyplanner-app/lib/core/routing/route_names.dart`; that file has no uncommitted changes in the app, app HEAD `6762a26a`) failed with exactly the 5 expected routes, nothing else:

```
5 help error(s):
help/routes-allowlist.json:1  app route "/focus" has no article — write one, or add it to "pending" (or "never")
help/routes-allowlist.json:1  app route "/move" has no article — write one, or add it to "pending" (or "never")
help/routes-allowlist.json:1  app route "/move/routine/:key" has no article — write one, or add it to "pending" (or "never")
help/routes-allowlist.json:1  app route "/move/session" has no article — write one, or add it to "pending" (or "never")
help/routes-allowlist.json:1  app route "/move/statistics" has no article — write one, or add it to "pending" (or "never")
```

## Verification

- `node tools/check-help.mjs` after the change → `help OK · 116 article(s) · locale(s) en, de, … id · 92 app routes checked`.
- `npm run build` → exit 0, green. It includes `legal OK · 2 document(s) × 28 locale(s)` (so the legal change `762deab6` still passes), `build OK · 3759 pages · 3728 in hreflang clusters`, `detector OK · 32 cases`, `help search OK · 26 cases`.
- `npm test` → exit 0: `detector OK · 32 cases`, `test-check-help OK · 99 cases`, `help search OK · 26 cases`, `test-blog-i18n OK · 48 cases`.

No CHANGELOG line (internal change).

## Open items

- **Release help sync (list items #143 Focus and #156 Move):** when the Focus and Move articles land, remove these 5 `"pending"` entries in the same commit. If they stay, the build goes red ("covered by … remove the stale entry").
- `./deploy.sh` now passes the help route check again; deploying is Ammar's step.

## Help impact

none

**Commit:** `docs(help): Move and Focus routes pending until their release` — SHA in `git log -1` (the report is part of that same commit, so it cannot name its own SHA).
