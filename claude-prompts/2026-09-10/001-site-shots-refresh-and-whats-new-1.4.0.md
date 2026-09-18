# Website 1.4.0: refresh every screenshot, add the six missing languages, commit the What's-New

## Goal

1.4.0 (9) went live on Google Play on 2026-09-10. Three things are owed here,
and they are one job because they all ride the same deploy:

1. **The site's screenshots are stale.** `static/assets/img/shots/` holds 19
   locales captured **7 September** — before the whole polish round (the Home
   week card, the agenda cards' icons, the to-do chips, the lists' member
   circles). The store pipeline recaptured everything on 2026-09-09 with zero
   overflow, so `../store-shots/raw/` is fresh and complete.
2. **Six languages have no screenshots at all** and silently fall back to
   English: `id`, `th`, `ja`, `ko`, `zh-Hans`, `zh-Hant`. `site.config.mjs`
   says so in a comment — "no capture yet … Add the line when
   `../store-shots/raw/<store-locale>/` exists". It exists now. This is the
   `2026-09-08/001` run that came back **blocked** for exactly this reason.
3. **The What's-New blocks are written but uncommitted** in
   `changelog/whats-new.en.html` and `.de.html`: git still holds only 1.2.0,
   while the files on disk carry 1.3.0, 1.4.0 **and 1.5.0** (added
   2026-09-17 by the app repo's release run; 1.5.0 went live on Google Play
   2026-09-18). The live site already shows up to 1.4.0 because deploy.sh
   builds from the working tree — nothing in git.

Done looks like: all 25 shot locales regenerated from today's captures, the six
new ones present instead of falling back to English, the What's-New block
committed, and the build green — **without deploying**.

## Scope

- In: `site.config.mjs` (`SHOT_LOCALE` — six new lines + its stale comment),
  `static/assets/img/shots/**` (regenerated, committed),
  `changelog/whats-new.en.html` + `.de.html` (commit what is already there).
- Out: **`./deploy.sh` — Ammar deploys.** The blog prompts and
  `claude/blog-seo-plan-2026-09.md` that are also uncommitted in this repo are
  someone else's lane: leave them alone and do not commit them.

## Requirements

1. **Add the six `SHOT_LOCALE` lines.** Map each site locale to its store-shot
   folder. Check the folder names against `ls ../store-shots/raw/` rather than
   assuming — the store pipeline's names are not always the site's (the raw
   folders are `id th ja ko zh-Hans zh-Hant`, and the site writes lower-cased
   directories such as `zh-hans`). Update the comment above them, which will be
   wrong the moment you add the lines: it should no longer list those six as
   missing. `ru`, `hi` and `ar` stay missing — Arabic is parked and the other
   two are not app languages.
2. **Regenerate every locale, not just the six.** `python3
tools/make-site-shots.py` with no arguments does all of `SHOT_LOCALE`. Run
   `--check` first and paste what it measures; then the real run. Expect all
   **25** site locales to be written, and say in the report how many files
   changed — if the 19 old ones come back byte-identical, something is wrong
   (they were captured before the UI changed).
3. **Sanity-check three images by eye** and say what you saw: `de` (the longest
   words), `ja` (a new language that used to fall back to English) and `en`.
   The Home shot must show the new week card — no chevron in its corner. If a
   shot still shows the old card, the raw captures are not the ones you think
   and you should stop and report rather than commit.
4. **Commit the What's-New blocks as they stand.** Do not rewrite or re-date
   them; the app repo's release runs wrote them and Planning Claude verified
   them. Only confirm both files carry 1.3.0, 1.4.0 and 1.5.0 sections, newest
   on top, and that the German one is German.
5. **Build must pass.** `npm run build` (that chain is content check → legal
   check → build → build check → detector). Fix nothing outside this prompt's
   scope to make it pass — if it fails for an unrelated reason, report
   `blocked` with the output.
6. **Prettier.** This repo's deploy runs a format check that stops on the first
   unformatted file, and it covers markdown — so run it over this prompt file
   and your report before finishing (`npx prettier --write` on both), the same
   trap that blocked a deploy on 2026-09-02.

## Constraints

- No new dependency; Pillow is already required by the store pipeline.
- The shots are **committed** output — the build must still work on a machine
  with no `../store-shots/` sibling, which is why this script never runs as
  part of `npm run build`. Do not wire it in.
- Do not touch the site's copy, layout, or any locale's content JSON.

## Verify

- `python3 tools/make-site-shots.py --check` output, then the real run's count.
- `npm run build` green.
- The three eyeballed images from requirement 3.
- `git status` shows only: `site.config.mjs`, `static/assets/img/shots/**`, the
  two `whats-new` files, and this prompt + report. The blog files stay
  untouched and uncommitted.

## Commit & push

- Two commits read cleanest: `chore(shots): refresh site screenshots and add six
languages` and `docs(changelog): the 1.3.0–1.5.0 What's-New blocks`. Bodies
  reference `Prompt: claude-prompts/2026-09-10/001-site-shots-refresh-and-whats-new-1.4.0.md`.
- **Push now** to origin/main (GitHub backup only — Ammar deploys with
  `./deploy.sh`). On failure, stop and report; never force.

## Report

- `claude-reports/2026-09-10/001-site-shots-refresh-and-whats-new-1.4.0.md` —
  half a page: how many files the regeneration changed, the six new locales,
  what the three eyeballed images showed, the build result, and the fact that
  the blog files were left alone. Run `npx prettier --write` on it afterwards.
