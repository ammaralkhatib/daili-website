# Help sync 1.8.0

**Prompt:** `claude-prompts/2026-09-30/001-help-sync-1-8-0.md` · **Status:** done · **Commit:** `c1ab8c1` (pushed; prompt `3fcf54b`) · **Not deployed.**

## Articles × locales
16 English articles, each translated into all 24 other `HELP_LOCALES` (`updated` / `translatedFrom: 2026-09-30`), 400 files in total:
calendar-add-event (**For** row), calendar-repeating (people belong to the series, so **This event only** is greyed), calendar-views (children under **People**, event follows its people or its creator, stripe colour, Filter note), **family-groups** (family photo; picked over family-roles because the photo also shows in the family switcher, which is described there), habits-tick (**Coming up**), lists-edit-list (**Only me**, side channels, private tasks kept when a shared list is deleted), lists-shopping and lists-todos (one **Only me** sentence each; todos also covers the add-bar lock), lists-assign (**Private task** switch and who a private task can go to), lists-all-mine (lock in **Mine**), account-password + family-invite (iCloud mail), account-verify-email (iCloud counts as verified), account-delete (restore link verifies), notifications-turn-on (new warning text), anywhere-watch (3 pictures back).
notifications-help needed no change, because it doesn't quote the warning. fr / pt / id label sweep (report 019): pt notes, activity, verify-email and meals-suggest labels are now Brazilian; fr **Ta semaine, proposée**; id **Minggu Anda, disarankan** and **Halo! Siapa Anda?**. nb had no label change.

## Deviations
- **Image cap raised from 2 to 5** (`tools/help-lib.mjs`, its test, README). anywhere-watch needs 5 pictures, and the app's `help_article_screen.dart` renders any number.
- English got shorter in places to stay ≤ 150 words: the edit-list, todos and verify-email wording. In verify-email, "iCloud address" stands for icloud.com, me.com and mac.com.
- "others' suggestions" is now "others' **typing** suggestions" (from api report 002), because 5 translators flagged the original as unclear.

## Pictures
All present, none missing, no media gaps. The 8 re-shot ids × 25 locales plus the full sets for pt / fr / id / nb are committed. Some of them came out byte-identical, and git records no change for those (e.g. lists-todos, lists-all-mine, lists-edit-list). watch-todos, watch-habits and watch-quick-note (75 WebPs, 416×496) are back in all `help/media*.json`. `help/media.nb.json` gets the new size of notifications-turn-on. All `w`/`h` values match the files.

## Build
```
help OK · 72 article(s) · 25 locales · 62 app routes checked
test-check-help OK · 99 cases
build OK · 2234 pages · 2214 in hreflang clusters
detector OK · 32 cases · 28 locale(s) built
```
I spot-checked de lists-todos (ARB labels), en calendar-add-event (the **For** paragraph is in `dist/help/en.json`) and pt lists-shopping (Brazilian: Salvar, Excluir, tela, **Só eu**).

## Open points
- App ARB: `app_id.arb` `forgotPasswordAppleSignInHint` still says "kamu"; zh/zh-Hant use one word (成员/成員) for both **For** and **People**; it "In arrivo" is both the habits **Coming up** and the watch **Up next**; tr: the help says "etkinlik listesi" but the app title is "Etkinlik akışı".
- "TRMNL wall screen", "morning summary" and the Junk folder name are new wording in each language. Apple's "Share My Email" comes from the ARB and was not checked on a device.
- Untracked `static/assets/img/blog/…` and `static/assets/img/photos/` were left alone.

**Reminder:** deploy on store day together with the `LIVE_APP_VERSION` 1.8.0 bump (`./deploy.sh`), not before.
