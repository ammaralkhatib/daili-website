# Real app screenshots on the site for Indonesian, Thai, Japanese, Korean and both Chinese

## Goal
The site has spoken these six languages since August, but their pages show
**English** app screenshots — `site.config.mjs` says so in the `SHOT_LOCALE`
comment: *"no capture yet, so they resolve to en."* The app now speaks all six
and real captures exist in `../store-shots/raw/`. Done = the six pages show
the app in their own language, like the other 22.

⚠️ Requires the app-repo run `claude-prompts/2026-09-07/016-capture-and-render-six-languages.md`
to have landed — check `../store-shots/raw/{id,th,ja,ko,zh-Hans,zh-Hant}/`
each hold 7 PNGs before starting; if not, `blocked`.

## Scope
- In: `site.config.mjs` (`SHOT_LOCALE`, six lines) ·
  `static/assets/img/shots/{id,th,ja,ko,zh-hans,zh-hant}/` (generated,
  committed).
- Out: everything else. **Do not run `./deploy.sh`** — Ammar deploys.

## Requirements
1. Add to `SHOT_LOCALE`: `id: 'id'`, `th: 'th'`, `ja: 'ja'`, `ko: 'ko'`,
   `'zh-Hans': 'zh-Hans'`, `'zh-Hant': 'zh-Hant'`. Update the comment so it
   lists only what is still English (`ru`, `hi`, `ar`).
2. Run `python3 tools/make-site-shots.py`; commit what it writes under
   `static/assets/img/shots/`. Check the output directory names are
   **lowercase** for Chinese (`zh-hans`, `zh-hant`) — the README says
   directories are lowercase on disk while hreflang keeps the case; follow
   whatever the tool already does for the existing locales and say which.
3. `npm run build` — `check-build` section 14 is the guard that notices a
   locale losing its captures; it must pass.

## Constraints
- `npm run build` green. Nothing else changes.

## Verify
- `npm run build`; list the six new shot folders and their file counts.

## Commit & push
- Conventional Commit; body includes
  `Prompt: claude-prompts/2026-09-08/001-site-shots-six-languages.md`.
- **Push now.**

## Report
`claude-reports/2026-09-08/001-site-shots-six-languages.md`. Remind Ammar to run
`./deploy.sh`.
🔴 File-write tool, never a shell heredoc. `wc -c` before commit.
