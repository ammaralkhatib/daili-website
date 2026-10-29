# 001 — Help: wall screens

**Status: done.** Commit `8ec2105`, pushed to `origin/main`. **Not deployed:** run `./deploy.sh` after checking.

## Articles × locales

- `anywhere-wall` was rewritten in en plus all 24 `HELP_LOCALES` translations.
  - It covers the code and QR on `/board/pair`, **Approve** (parents only), and "use this browser" on a computer.
  - It says what a screen never shows, how to remove one or stop it, and gives an iPad and Android tip.
- `anywhere-wall-tick` is new in all 25 locales: `since: 1.13.0` (the live version), `order: 4`, sorted after wall by title.
- `related` for wall-tick: `anywhere-wall, habits-tick, lists-todos`. Both ids exist.
- `web.md` did not need a change, because it already links `anywhere-wall`.
- `dist/help/en.json` lists both articles, and so does every locale's json (96 articles each).
- Spot-checked the built pages in en, de and ja.

## Where the labels come from

- **Web labels:** `daili-web/src/i18n/<tag>.ts`, with `zh.ts` for zh-Hans. Keys: `board.views.*`, `board.exit`, `board.tick.whoTitle`/`undo`, `profile.preferencesTitle`/`wallDisplayStart`, `nav.family`, and `wallScreens.useThisBrowser`/`setUpScreenLink`/`cardTitle`/`remove`/`approve`/`stop`.
- **Feature names:** Notes and Budget come from web `nav.*`. Cycle and Documents come from the app ARB keys `cycleTitle` and `documentsTitle`.
- **How it was done:** a script (`/tmp/helpwall/labels.mjs`) read all 25 tables. Translators wrote `{{key}}` placeholders, and `fill.mjs` filled them in, so none of the labels were typed by hand.
- **iPadOS and Chrome menu words** are each translator's best knowledge. Nobody checked them on a device.

## Facts corrected against the code

1. **Length cap:** the guard allows 150 words of English body, but the prompt allowed 260 and 200. The articles are 150 and 141 words.
2. **Pictures:** the guard requires a picture or `mediaPending`, so wall-tick has `mediaPending` instead of no media.
3. **Quiet hours:** Night follows the connecting parent's quiet hours, copied once at connect time (`BoardScreen::SETTINGS_FIELDS`). It does not follow the reader's own quiet hours.
4. **Opening Profile:** the side menu shows your **name**. "Profile & settings" is only its hover title (`MenuCards.tsx`), so the article says "your name → **Preferences**".
5. **"Use this browser" on the tablet itself** (prompt step 3) does not work on an iPad or Android tablet. The phone wall (`appWall.ts`) blocks Profile there. It works on a computer, where it makes that computer the screen, so the article says so.
6. **iPad:** a Home Screen web app keeps its own storage and opens `/`. So the tip says: add to Home Screen, open it, then tap **Set up a family screen**.
7. **Children's to-dos:** the server signs the tick as the parent who connected the screen. Only the activity meta (`for_child`) names the child, and only the website shows that. So the article says children get the credit for **habits**, and the website's activity names them on to-dos. The phone app 1.13.0 doesn't read `for_child`.
8. **After Undo:** Undo lasts 5 s. After that, the wall cannot untick, so the article tells you to untick on a computer or in the app.
9. **Repeating to-dos:** "No Undo, the same as in the app" is confirmed at `v1.13.0+19`, `list_detail_screen.dart`.
10. **The screen also stops** when the parent who connected it is removed, deletes their account or resets their password, or when the family is deleted. These were left out because of the word cap; the article keeps only "leaves the family or loses admin".

## Translator notes

- **"Tap your face"** was written as "photo/picture" in most languages. If a face is initials only, that still reads OK.
- **Hold to leave:** the label already contains "hold" in many languages, so translators wrote "press/keep a finger on **[label]**".
- **ko:** 549 visible characters; the guard passed.

## Build

- `npm run build` is green: help OK, 96 articles, 25 locales, **74 app routes checked**, and 3283 pages built.
- `node tools/check-help.mjs` is green, with the route check **not** skipped.
- **Owner item:** both were run with `DAILI_APP_REPO` pointed at the app's **HEAD** `route_names.dart`. The app working tree holds uncommitted app work from 2026-10-29/001: `route_names.dart` modified and `lib/features/wall_screens/` untracked. That adds `/settings/wall-display`, `/connect`, `/connect/scan` and `/screens`. Against the working tree, check-help fails with "app route has no article" for those 4 routes, and a plain `npm run build` would fail too until that app work is committed.
- **Before the next deploy:** commit the app work, then add an article or `pending` entries for those routes, or build with `DAILI_APP_REPO` pointed at HEAD.

## Release-sync line

For the next release help sync: add the app path Settings → Wall display once app 2026-10-29/001 is live.

## Help impact

anywhere-wall rewritten; new anywhere-wall-tick.
