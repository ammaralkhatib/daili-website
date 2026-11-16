# Help: new article "Daili on a tablet" (hidden until the tablet release) + one fix

Every sub-agent you start MUST use model claude-opus-5-5. Write the report to
`claude-reports/2026-11-15/002-help-daili-on-a-tablet.md` with the file-write tool.

## Why
The app gets a real tablet layout (iPad + Android tablets). It is finished in the app
repo but switched OFF (`kTabletLayoutEnabled`, `../familyplanner-app/lib/core/flags.dart`);
it goes live in ONE later release whose version number is not decided yet. The Help
center (this repo, `help/<locale>/…`, read by daili.app/help AND by the app) needs one
new article, ready now, shown only from that release on.

## 1. The article must stay hidden until the release prompt sets its version
Read how `since:` and `LIVE_APP_VERSION` hide an article (`build.mjs`, `site.config.mjs`,
`../familyplanner-app/claude-prompts/HELP-PLAN.md`). The new article must NOT appear on
the website, in `help/<locale>.json` for today's apps, in search or in "related" links
until the tablet release. If the repo has a draft/hidden mechanism, use it; else use
`since: 99.0.0` as a clear placeholder. Say in the report which one, and the ONE line the
release prompt must change. Do NOT bump `LIVE_APP_VERSION`.

## 2. The article — `help/en/anywhere/tablet.md`, id `anywhere-tablet`
Follow the front-matter and writing style of the neighbours (`anywhere/web.md`,
`anywhere/widgets.md`): short sentences, easy words, numbered steps, "you", **bold** for
things on screen. Title like "Daili on a tablet (iPad and Android)". Keywords: tablet,
ipad, android tablet, landscape, big screen, keyboard, mouse, trackpad, shortcut, split
view. Related: `anywhere-web`, `anywhere-wall`, `anywhere-widgets`.

**Check every fact against the app code before you write it** (`../familyplanner-app`,
tablet code under `lib/core/layout/` and the reports
`claude-reports/2026-11-13/010`–`021`, `2026-11-14/001`–`002`, `2026-11-15/021`, `022`,
`030`, `040`, `041`, `042`). A fact the code does not confirm → leave it out and list it
under "Facts I could not confirm". Content, in this order:
1. What is different on a tablet (one short paragraph): a menu rail on the left with all
   places; in landscape two things side by side (for example your lists on the left, the
   open list on the right; a recipe list beside the recipe; the day beside the month);
   forms and sheets open as a window in the middle. Same account, same data as the phone.
2. Turning the tablet: both directions work; what you opened and typed stays.
3. Two apps side by side (iPad Split View / Android split screen): works at any size; a
   very narrow window shows the phone layout.
4. Keyboard: the shortcut table from app report `2026-11-15/040-tablet-keyboard.md`
   ("Final shortcut table"), rewritten for users as a simple table (Key | What it does).
   Write "Cmd (iPad) or Ctrl (Android)". Include the sentence that single keys never fire
   while you type in a field. Leave out anything the report lists under "Left for the
   polish round".
5. Mouse or trackpad: hover highlight, right-click = long press, drag an event to another
   day in the month view (only what report `041` says is built).
6. Large text: the app follows the tablet's text size.
7. One `> Note:` — a wall screen is a different thing → link `anywhere-wall`.
No pictures yet: set `mediaPending:` like `web.md` does ("tablet screenshots, landscape
and portrait"), and make sure the build accepts it.

## 3. All help languages
A new English article breaks the build until it exists in every `HELP_LOCALES` language.
Translate it into all of them following
`claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md` (key names like Esc, Enter, Tab,
Cmd, Ctrl and single letters N, T stay as they are; "/" stays "/").

## 4. One fix in an existing article (visible now)
`help/en/anywhere/web.md` ends with: "On a phone or tablet, it asks you to use the app
instead." Since daili-web `a0cb8d3` (2026-11-13, `../daili-web/src/features/shell/appNudge.ts`,
`isPhone()`), only PHONES get that wall; tablets can use the browser version. First
check in `../daili-web` that this commit is on `main`. Then correct the note in English
(e.g. "…made for computers and tablets. On a phone, it asks you to use the app
instead."), set `updated:` to today, and update the same sentence in every help language.
If the commit is not there, skip this point and say so.

## Verify / Commit & push / Report
`npm run build` green (the new article is NOT in the built pages or the built
`help/*.json` shown to today's apps — check and say how you checked). Commit
`docs(help): Daili on a tablet (hidden until the tablet release), web article fix`,
push to `origin/main`. Do NOT run `deploy.sh` — Ammar deploys.
Report: the hidden mechanism + the one line to change at release, the English article
text in full (Planning Claude reviews it), facts you could not confirm, build result, SHA.
