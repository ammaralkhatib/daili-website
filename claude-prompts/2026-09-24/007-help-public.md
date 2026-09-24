# Help center goes public on daili.app

## Goal
Ammar decided (2026-09-24): **daili.app/help is public now.** The pages only
show articles whose `since` is at most `LIVE_APP_VERSION` (1.6.0, live on both
stores), so nothing describes a feature people can't use yet.

"Done" = `HELP_PUBLIC = true`, `npm run build` green, and the help pages are
indexable, in the sitemap and linked from the footer.

## Scope
- **In:** `site.config.mjs` (`HELP_PUBLIC` only). Anything else only if a
  guard fails because of the switch. Then say what you changed and why.
- **Out:** articles, the app, the api, the privacy files.

## Requirements
1. `export const HELP_PUBLIC = true;`
2. Update the comment above it in one line if it no longer fits (for example
   "public since 2026-09-24").

## Constraints
- `npm run build` green (all guards). Self-correct up to 2 tries.
- Leave unrelated uncommitted files alone.

## Verify
- `npm run build`: the help line ends with `PUBLIC`.
- `grep -c noindex dist/help/index.html` → 0 (and 0 on one topic page and one
  article page).
- The number of `/help/` URLs in `dist/sitemap.xml` (it should be 1 + 11
  topics + 64 articles, or say why not).
- The footer Help link in `dist/index.html` and in one other locale's home
  page, e.g. `dist/de/index.html` (`href="/help/" hreflang="en" lang="en"`).

## Commit & push
- This prompt, if untracked: `docs(plan): add help-public prompt`.
- `feat(help): the help center is public (indexable, sitemap, footer link)`.
  Body: `Prompt: claude-prompts/2026-09-24/007-help-public.md`.
- **Push now.**

## Report
`claude-reports/2026-09-24/007-help-public.md`, short (a few lines): the
checks above, and the SHA.
- **Open item for Ammar:** run `./deploy.sh` (this also ships 006: the
  allowlist, the "?" fixes and the privacy paragraph). Then check:
  - `curl -sI https://daili.app/help/en.json` → `200` with
    `cache-control: public, max-age=300`;
  - https://daili.app/help/ opens.
