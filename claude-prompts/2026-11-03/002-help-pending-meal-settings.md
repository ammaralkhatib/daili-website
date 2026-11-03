# Unblock the build — Meal settings route is pending

## Goal

`npm run build` (and so `./deploy.sh`) is red: `help/routes-allowlist.json:1 app route "/meal-plan/settings" has no
article`. The route is in app HEAD (`d03bba43`, Meals 2.0) but not in any release yet. Its help article comes with the
release help sync. Done = the build is green with NO `DAILI_APP_REPO` override.

## Change

`help/routes-allowlist.json` → `"pending"` gets ONE entry:

```json
"/meal-plan/settings": "Meals 2.0 meal settings (in the app, not released yet) — article at the next release help sync."
```

Nothing else in `help/`. Also commit the untracked report `claude-reports/2026-11-03/001-reviews-and-member-count.md`
(and its `001-shots/` folder) with this change. The untracked `static/assets/img/photos/` is not yours — leave it and
do not let it block step 0.

## Verify

Plain `npm run build` green (route check NOT skipped, no override). Paste the last build line in the report.

## Commit & push

`docs(help): /meal-plan/settings pending until the Meals release` — body
`Prompt: claude-prompts/2026-11-03/002-help-pending-meal-settings.md`. Commit this prompt file with it. **Push. Do NOT
run `./deploy.sh`.**

## Report

`claude-reports/2026-11-03/002-help-pending-meal-settings.md` (file-write tool; `wc -c` > 0), 3 lines: change, build
line, SHA + push. `## Help impact`: none.
