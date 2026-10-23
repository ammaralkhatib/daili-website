# 002 — Help sync 1.12.0: AI avatar, widgets, budget guests + share, colour default, Edit Home tile

**Prompt:** `claude-prompts/2026-10-23/002-help-sync-1-12-0.md`
**Completed:** 2026-10-23 · **Status:** done

## Summary

The help center now matches app 1.12.0 in English and all 24 other help
languages. There is 1 new article and 4 updated ones, and the 1.12.0 pictures
are committed. The build is green. Step 0 had nothing to commit: the only
uncommitted files were the help pictures, and this prompt commits them.

- **New:** `account-avatar-ai`, "Create your avatar with AI" (`since: 1.12.0`,
  `order: 2`, so it sorts right after `account-profile`). It has two pictures,
  `account-avatar-ai` and `account-avatar-ai-look`. Like every `since` > live
  article, it is not on the web pages until `LIVE_APP_VERSION` is 1.12.0. It is
  already in `help/<locale>.json` for the app, with each language's own picture.
- **Updated** (`updated: 2026-10-23`):
  - `account-profile`: the picture step now has **Create avatar with AI**, and
    your AI avatars are under **Choose an avatar**. The colour step now says
    **Use my color for the app** is on by default; turn it off to keep daili
    green (also in **Appearance** → **App color**). It links to the new article
    in `related`.
  - `anywhere-widgets`: widgets update by themselves when the family changes
    something (iPhone: not after daili was swiped away, then open daili once).
    The calendar widget shows the next days. A locked iPhone hides titles.
  - `budget-split`: guests (add, rename, delete; one still used in entries
    can't be deleted), a guest can pay, and **For whom**. A private budget
    splits only with guests. **Share**: **Send summary**, **Link for guests**
    (the creator or an admin taps **Create link**, then Copy / Share; **Stop
    sharing** turns it off). Pictures: the re-shot `budget-split` and the new
    `budget-share`.
  - `start-edit-home`: the dashed **Edit Home** tile at the end of Home, and
    Family is last until you move it. Picture `start-edit-home-tile` is in the
    text; `media:` is unchanged.
  - `start-home`: the text is unchanged (it never says where Family sits). Its
    re-shot picture is committed.

## Labels checked

Every bold label comes from `app_<arb>.arb` through `{{arbKey}}` placeholders,
which a script fills for each language.

- The report labels match `app_en.arb`: `budgetShareSheetTitle`, the
  `avatarAi*` keys, `homeEditTileTitle`, `profileAccentSwitchTitle`,
  `settingsAppColour`.
- No label mismatch with the reports.
- One mismatch with the prompt: it lists "top colour" among the picker traits.
  That is true, but the picture shows hair colour instead (see app report 002).
  The text says "age, skin tone, hair and more".

## Fact-check (app code beats the prompt)

A fresh fact-check of the English against the code found 3 errors. All are
fixed:

1. **The selfie has no Create avatar button.** Taking or choosing the photo
   starts the drawing. The step now names **Take a selfie** / **Choose a photo**.
2. **A child's picture is not in your profile.** Admins reach it through ⋮ in
   **Family** → **Change picture**.
3. **The guest link needs Create link,** and only the budget's creator or an
   admin can make it.

Also checked: avatars work on free families too. They cost the normal AI
actions (3 free, 30 with Plus) plus a cap of 10 avatars per family per month,
on every plan. So the article uses the same note as `calendar-photo` and
`meals-suggest`; it does not call avatars "Plus only".

## Left out (150-word cap)

- Avatar: the trait list beyond age/skin/hair, "not on other phones or the web"
  (it now says "only on this phone"), the "up to 3" edge case.
- Widgets: events happening now stay, "+N more", Android ticks show at once,
  Android follows dark mode.
- Budget: the "more than suggested" warning, "a payment is not spending", the
  per-guest message icon, the hint row on holiday budgets.

## Locales and pictures

- All 24 languages are done: 5 files each, 120 in total, all
  `translatedFrom: 2026-10-23`. Six translator sub-agents did 4 languages
  each. I checked every file on disk myself and spot-read de.
- Missing pictures: **none**. Every locale has all 4 new ids and the re-shot
  `budget-split` / `start-home`.

## Verification

```
$ npm run build
help OK · 95 article(s) · 25 locales · 74 app routes checked
test-check-help OK · 99 cases
build OK · 3233 pages · detector OK · help search OK
```

None of the 55 build warnings is about these articles. They are older stale
translations and the existing picture gap.

- `dist/help/budget/split/` and `dist/de/help/budget/split/` show the text, the
  local `budget-split` + `budget-share` pictures with translated alt texts, and
  the related links.
- The avatar article is not built as a page (since > live). In
  `dist/help/de.json` it has the German picture URL and alt text, and
  related = profile, plus.
- Self-correction: I cut the English 4 times to get under the 150-word cap.
  There were no build failures.

## Commit & push

- **Commit:** `ec96460`, `docs(help): 1.12.0 — AI avatar, widgets, budget guests + share, colour default, Edit Home tile`
- **Push:** `origin/main` ok. `./deploy.sh` was not run, as the prompt says.
  `static/assets/img/photos/` is still untracked.

## Help impact

This is the help sync: `account-avatar-ai` (new), `account-profile`,
`anywhere-widgets`, `budget-split`, `start-edit-home`. `start-home` got a new
picture only.

## English issues / ARB notes (from translators)

- **pt ARB:** the budget share labels use European "Partilhar"; the rest of
  the app uses Brazilian "compartilhar".
- **id ARB:** `avatarAiTabLook` / `appearanceYourAiAvatars` use informal "-mu";
  the rest of the app uses "Anda".
- **th ARB:** `appearanceCreateWithAi` spells "อวตาร"; the other labels use
  "อวาตาร์".
- **nb ARB:** the labels mix "KI" and "AI".
- **English:** "⋮ in **Family**" doesn't say the ⋮ is on the child's row.
  There was no room under the cap; translators read it correctly.

## Open items for the owner

- Deploy when you choose. When 1.12.0 is live, set `LIVE_APP_VERSION` so the
  avatar page appears.
- Optional: fix the pt / id / th / nb ARB labels above in the app.

## Deviations from prompt

- Widgets: the old note "If one looks out of date, open daili for a moment"
  was replaced. Widgets now refresh themselves; "open daili once" now sits
  next to the iPhone swipe-away case.
