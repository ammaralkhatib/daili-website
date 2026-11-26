# Help: Cycle is shown to new users — how to start it, how to hide the tile

Standard lane, website only, small. Goes with app prompt
`../familyplanner-app/claude-prompts/2026-11-26/002-cycle-tile-for-new-phones.md` (plan
`../familyplanner-app/claude-prompts/CYCLE-HOME-TILE-PLAN.md`, Ammar "Approve" 2026-11-26, list #389).
Every sub-agent you start MUST use model claude-opus-5-5. Write the report with the file-write tool.

**Read first:** the app report `../familyplanner-app/claude-reports/2026-11-26/002-cycle-tile-for-new-phones.md`
(its "Help impact" lines and the two new strings) and the app commit it names. If that report is missing or says
the change was not made, stop and say so — do not write help for something that is not in the app.

**This text is for app 1.18.** Do NOT bump `LIVE_APP_VERSION`. Do NOT run `./deploy.sh` (Ammar deploys on the
1.18 store day).

## What changed in the app (short)

- A phone that passes "What do you want to use Daili for?" from 1.18 on: the Cycle card is ticked like the
  others, and Home has a **Cycle** tile (also after **Skip**). The tile shows only the name until Cycle is set up.
- Nothing is set up by itself. A tap on the tile opens Cycle's first screen; **Start** begins the setup.
- New on that first screen: **Not for me — hide Cycle**. It hides the tile; a line says "Cycle is hidden. You
  find it in Settings."
- Home edit mode and **Settings** → **Home screen**: Cycle is a normal tile / a normal switch now. On shows the
  tile, off hides it. They no longer open the setup.
- A phone that used daili before 1.18 has no Cycle tile while Cycle is off — as before. **Settings** → **Cycle**
  still opens it for everyone.
- Unchanged: Cycle itself is off until she finishes the setup; it is private and stays on the phone.

## Scope

- In: `help/<every HELP_LOCALES language>/cycle/start.md`, `…/start/edit-home.md`, `…/start/features.md`.
- Out: every other article, `LIVE_APP_VERSION`, pictures (no re-shoot here), legal and marketing pages.

## Requirements

1. **`cycle/start.md` (id `cycle-start`).** Keep the article and its steps. Change only:
   - the first step so both ways in are true: tap the **Cycle** tile on Home, or open **Settings** and tap
     **Cycle**; then **Start**;
   - one short new paragraph after the picture block or before the note — your pick, where it reads best:
     "Not for you? On Cycle's first screen tap **Not for me — hide Cycle**. The tile leaves Home. You find Cycle
     again in **Settings**, and you can switch the tile back on under **Home screen**."
   - keep the first line's promise ("off until you turn it on … nobody in your family sees your Cycle, or that
     you use it") — it is still true. Add keywords `hide`, `tile`, `not for me`.
2. **`start/edit-home.md` (id `start-edit-home`).** Replace the line "With Cycle off, a faded **Cycle** tile
   shows here. Tap it to set up Cycle." with what is true now, one or two short sentences: Cycle is a tile like
   the others — **×** hides it, **+** brings it back; the tile shows only its name until you set Cycle up, and a
   tap on it opens Cycle. Picture `start-edit-home`: no re-shoot. Read the app report: if the help picture still
   shows a faded Cycle tile with **+**, keep the alt text; if not, make the alt text say only what is sure
   ("Home in edit mode, with an × on each tile.") and name the picture under "Open items" in the report.
3. **`start/features.md`.** Line 14 "Every feature starts on, except Cycle." and the note "Cycle starts off. …"
   are wrong from 1.18 on. New text: every card starts ticked; the note says the Cycle CARD only puts a tile on
   Home — Cycle itself starts when you tap the tile and finish its short setup; it is private, stays only on this
   phone, and nobody in your family can see it. Not for you? Untick the card, or hide the tile later.
4. **Every language** (`HELP_LOCALES`, 25): the same three changes, each file in its own words, by
   `claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md`. Button names in **bold** must match the app EXACTLY:
   take them from `../familyplanner-app/lib/l10n/app_<arb>.arb` (the two new keys from the app report, plus
   `cycleTitle`, `cycleIntroStart`, the Settings and Home screen row names; zh-Hans → `app_zh.arb`, zh-Hant →
   `app_zh_Hant.arb`).
5. Bump `updated:` on the three English articles and `translatedFrom:` / `updated:` in the other languages as
   the rules say.

## Constraints

- Short sentences, easy words, "you". The brand alone is lowercase "daili".
- Never say or hint that daili knows who uses Cycle, counts Cycle users, or that anybody else can see the
  tile's content. Never "safe days", fertile window, or any medical promise. No "free forever".
- Do not promise the tile to people who already use daili ("new accounts" / "if you are new to daili" wording).
- `npm run check:help` and `npm run build` green, FOREGROUND. Self-correct up to 2 tries.

## Verify

- `npm run check:help` · `npm run build`.
- `grep -rn "except Cycle" help/en` → nothing. The old sentence "Tap it to set up Cycle" is gone in every
  language (check the same line position in 5 languages).
- Spot-check 5 languages: the bold button words equal the ARB strings.

## Commit & push

- One commit: `docs(help): Cycle for new users — start from the Home tile, hide button, normal switch`; body:
  #389 + `Prompt: claude-prompts/2026-11-26/002-help-cycle-tile-and-hide.md`.
- **Push now.** Do NOT run `./deploy.sh`.

## Report

`claude-reports/2026-11-26/002-help-cycle-tile-and-hide.md` (mkdir -p), the repo's usual shape: the new English
text of the changed lines word for word, counts per language, the build result, the sha, open items (picture).
In the report, never put the word "status" and the word "blocked" on one line unless you really are stuck.
