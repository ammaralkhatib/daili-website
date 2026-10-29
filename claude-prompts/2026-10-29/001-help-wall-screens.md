# Help: wall screens — rewrite "anywhere-wall" + new "anywhere-wall-tick" (all help languages)

## Goal

The wall board changed a lot on 2026-10-28 (daili-web reports `2026-10-28/001`–`008`). The help article
`anywhere-wall` is now wrong ("English and German only", "sign in with your account", a Today-only board). The app's
Help screens load the same help (`daili.app/help/<lang>.json`), so this fixes both. Done = two true, short articles in
English and every `HELP_LOCALES` language. **Do not deploy** — Ammar runs `./deploy.sh` after checking.

## Sources (facts — do not guess; where the code says otherwise, follow the code and list it in the report)

- daili-web `../daili-web`: reports `claude-reports/2026-10-28/001`–`008`; labels in `src/i18n/<tag>.ts`
  (`board.*`, `wallScreens.*`): **Wall display**, **Start wall mode**, **Use this browser as a family screen**,
  **Connect a screen with a code**, **Set up a family screen** (sign-in page), **Wall screens** (Family page),
  **Remove**, **Approve**, **Hold to leave**, **Who did it?**, **Undo**, the eight tab names and **Night**.
- API `~/Herd/familyplanner-api`: CLAUDE.md §3 "Wall screens" and `claude-prompts/BOARD-PLAN.md` (who may connect,
  what a screen never shows, when a screen stops working).
- **The Daili phone app has no wall-screen settings yet** (they ride the next app release). Describe ONLY the
  app.daili.app paths. In the report, add one line for the next release help sync: "add the app path Settings → Wall
  display once app 2026-10-29/001 is live".

## Article 1 — rewrite `help/en/anywhere/wall.md` (keep `id: anywhere-wall`)

Title: "Put daili on a wall screen or an old tablet". Summary: one line about a family screen on a tablet in the
kitchen or hallway. Front matter: keep `id`, `topic`, `order`; `updated: 2026-10-29`; `since` unchanged; keywords add
`family screen, wall screen, kiosk, pairing code, qr`; keep `mediaPending`; `related: anywhere-wall-tick,
anywhere-web, anywhere-trmnl`. Routes: keep what `check-help` accepts (today `/`).

Body (≤ 260 words, the voice of the other articles, short sentences):
1. What it shows: tabs Home, Week, Month, People, Meals, Lists, Habits, Countdown; a dim Night screen at your quiet
   hours; big letters for across the room.
2. **Connect a tablet with a code** (numbered): on the tablet open app.daili.app/board/pair → a code and a QR appear
   → on your phone or computer scan it or open app.daili.app/board/pair and type the code → **Approve**. The tablet
   needs no password. Only a parent (admin) can approve.
3. One sentence: or, on the tablet itself, sign in and use Profile → Preferences → **Use this browser as a family
   screen**.
4. `> Note:` A family screen never shows anyone's private events, lists, to-dos or habits — not even those of the
   parent who connected it — and never Notes, Budget, Cycle or Documents.
5. Removing: Family page → **Wall screens** → **Remove**; it also stops when the parent who connected it leaves the
   family or stops being an admin. On the tablet: hold **Hold to leave** for two seconds.
6. Tip line: iPad — Add to Home Screen and set Auto-Lock to Never; Android — Chrome → Install app.

## Article 2 — new `help/en/anywhere/wall-tick.md` (`id: anywhere-wall-tick`, order after wall)

Title: "Tick things off on the wall screen". Summary: one line. `since: 1.13.0` (the web feature is live; if the
field must be an app version, use the live one and say so), `updated: 2026-10-29`, no media,
`related: anywhere-wall, habits-tick (only if that id exists — else the nearest habits article), lists-todos (same)`.

Body (≤ 200 words):
1. On a connected family screen, tap a to-do, a shopping item or a habit to tick it.
2. It counts for the person it belongs to. If it belongs to nobody or to several people, faces appear — **Who did
   it?** — tap yours.
3. Children without a login get the credit for their own to-dos and habits.
4. **Undo** shows for a few seconds. Repeating to-dos cannot be undone (they move to their next date at once) — the
   same as in the app.
5. One sentence: a board opened with a normal sign-in (Start wall mode) only shows things; ticking works on a family
   screen.

## Translations

Every `HELP_LOCALES` language, following `claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md`; labels exactly as in
each `daili-web/src/i18n/<tag>.ts` (for `zh-Hans` use `zh.ts`). Keep "app.daili.app" and "QR" as they are.

## Scope

- In: `help/*/anywhere/wall.md`, new `help/*/anywhere/wall-tick.md`, `related` in `help/en/anywhere/web.md` only if
  needed, this prompt file, `npm run build`.
- Out: legal, other articles, `LIVE_APP_VERSION`, home page, blog. Untracked files that are not yours: leave them.

## Verify

`npm run build` green and `node tools/check-help.mjs` green (route check NOT skipped). Spot-check the en, de and ja
pages in `dist/` and that `dist/help/en.json` lists both articles.

## Commit & push

`docs(help): wall screens — connect with a code, tick on the wall`; body
`Prompt: claude-prompts/2026-10-29/001-help-wall-screens.md`. Commit this prompt file with it. **Push. Do NOT run
`./deploy.sh`.**

## Report

`claude-reports/2026-10-29/001-help-wall-screens.md` (file-write tool; `wc -c` > 0), half a page: articles × locales,
labels taken from where, facts corrected against the code, build lines, SHA + push, the release-sync line.
`## Help impact`: anywhere-wall rewritten; new anywhere-wall-tick.
