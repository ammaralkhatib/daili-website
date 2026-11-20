# Help route check: Move and Focus routes wait as "pending"

List item #161. Inline-size fix, standard lane. Planning Claude checked it on 2026-11-20
(read-only): `node tools/check-help.mjs` against the app's `main` fails with exactly 5 errors.

## Goal

`npm run build` and `./deploy.sh` are green again. Today they stop in the help route check,
because the app's `main` already has the new Move and Focus screens (not released yet, not in tag
`v1.17.0+25`) and they have no help article yet. The articles come at the next release help sync
(list items #143 Focus and #156 Move). Until then the 5 routes wait under `"pending"`, the same way
`fc0fcf63` did it for `/meal-plan/settings`.

## Scope

- In: `help/routes-allowlist.json` only.
- Out: every article, `tools/**`, `deploy.sh`, `site.config.mjs` (`LIVE_APP_VERSION` stays), the
  app repo (read only).

## Requirements

1. Add these 5 routes to `"pending"` in `help/routes-allowlist.json` (keep `"never"` as it is;
   do NOT put them under `"never"`):
   - `/focus` → reason: `Focus timer (in the app, not released yet) — article at the next release help sync.`
   - `/move` → `Move (in the app, not released yet) — article at the next release help sync.`
   - `/move/routine/:key` → same Move reason
   - `/move/session` → same Move reason
   - `/move/statistics` → same Move reason
2. First run `node tools/check-help.mjs` once BEFORE the change and confirm it fails on exactly
   these 5 routes (it reads `../familyplanner-app/lib/core/routing/route_names.dart`). If the list
   differs (a route was renamed, added or removed since), use the routes the check really names —
   but only routes that belong to Move or Focus. Any other failing route → change nothing, write
   the report and say which route.

## Constraints

- One commit, only this file + the report.
- No CHANGELOG line (internal).
- 🔴 Report trap: the run script stops when any line of the report has the word "status" and then
  the word "blocked" on the same line. Use the word "blocked" ONLY if you really are blocked.

## Verify

- `node tools/check-help.mjs` → `help OK · …`.
- `npm run build` → green (the legal change `762deab6` from earlier today is already in; it must
  still pass).
- `npm test` → green.

## Commit & push

- `docs(help): Move and Focus routes pending until their release`
  Body: `Prompt: claude-prompts/2026-11-20/002-help-pending-move-focus.md`
- **Push now.** (A website push is only a backup; it does not deploy. Do NOT run `./deploy.sh`.)

## Report

- `claude-reports/2026-11-20/002-help-pending-move-focus.md` from the template: the check output
  before and after, the build result, the commit SHA, pushed or not.
- Open item for the release help sync (write it in the report): when the Focus and Move articles
  land, these 5 pending entries must be removed in the same commit, or the build goes red
  ("covered by … remove the stale entry").
- `## Help impact`: none.
