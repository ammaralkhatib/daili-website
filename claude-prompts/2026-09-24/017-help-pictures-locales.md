# Help pictures in every language: check, commit, make them required

## Goal
App prompt `019` shot the Help pictures in all 24 non-English languages into
`static/help/media/<code>/` (untracked). Check them, commit them, and from now
on **require** own-language pictures for every locale in `HELP_LOCALES`
(the English fallback from `008` stays only for listed gaps).

"Done" = the pictures + media sizes are committed; the build uses them; a
locale in `HELP_LOCALES` with a missing picture is an error unless it's in an
explicit gap list; `npm run build` green.

## Requirements
1. Read the app report `familyplanner-app/claude-reports/2026-09-24/019-help-shots-all-locales.md`.
   Every gap it lists goes into a small, visible allowlist (for example
   `help/media-gaps.json`: `{ "de": ["id", …] }` with a reason). Those pages
   keep the English picture. A gap that isn't listed = build error. A listed
   gap that now has a picture = error (stale).
2. **Check** 3 pictures per locale yourself (open them):
   - ring on the right button;
   - the right language;
   - the alt text in `help/<code>/…md` matches what the picture shows (fix
     the alt text if needed; the text only).
3. Size: report the total size of `static/help/media/` per locale and in all.
   If any picture is over 250 KB, say which.
4. The build line per locale should say `0 picture(s) in English` (or the gap
   count).

## Constraints
- `npm run build` green. Self-correct up to 2 tries.
- File-write tool, never heredocs. Leave unrelated uncommitted files alone.

## Commit & push
1. `chore(help): help pictures in 24 languages` (pictures + media sizes; one
   commit, or one per few locales if git complains about size).
2. `feat(help): own-language pictures required per help locale (listed gaps only)`.
   Body: `Prompt: claude-prompts/2026-09-24/017-help-pictures-locales.md`.
- **Push now.**

## Report
`claude-reports/2026-09-24/017-help-pictures-locales.md`:
- the per-locale counts;
- the gaps with reasons;
- alt texts you fixed;
- sizes;
- SHAs.
- **Open item for Ammar:** `./deploy.sh`, then check
  `curl -sI https://daili.app/help/de.json` → 200, and open
  https://daili.app/de/help/.
