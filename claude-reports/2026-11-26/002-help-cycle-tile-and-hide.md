# 002 — Help: Cycle for new users (Home tile, hide button, normal switch)

**Result:** done · **Commit:** `73e6af54` docs(help): Cycle for new users — start from the Home tile, hide button, normal switch. It has 75 files (3 articles × 25 languages) and is pushed to origin/main (`d6eedb01..73e6af54`). This report follows in its own `docs(report)` commit. `./deploy.sh` was NOT run. `LIVE_APP_VERSION` is unchanged.
**Step 0:** `d6eedb01` docs(plan): sync planning docs (prompts 002 and 003 of 2026-11-26), pushed. No commits were held, and `main` was equal to `origin/main`. `static/assets/img/photos/` (the old untracked pictures) stayed out of every commit, as in earlier runs.
**App side:** I read the app report `familyplanner-app/claude-reports/2026-11-26/002-cycle-tile-for-new-phones.md` (done, commit `d3f5d036`). I also checked `cycle_intro_flow.dart` at that commit: the hide button sits right under **Start** on the first screen, and it shows only while the tile is on Home.

## New English text (word for word)

**`help/en/cycle/start.md`** (id `cycle-start`, `updated: 2026-11-26`, 149 words)
- keywords: `cycle, period, menstruation, log, prediction, next period, period started, flow, private, hide, tile, not for me`
- step 1: `Tap **Cycle** on Home or in **Settings**, then **Start**.`
- step 4: `During your period, tap **Light**, **Medium** or **Heavy**. **Symptoms & mood** opens the day.`
- paragraph: `Until you tap **It ended**, Cycle counts your usual period length. The next period shows as a date range, never one exact day.`
- new paragraph, before the note: `Not for you? Tap **Not for me — hide Cycle** under **Start**. **Settings** → **Home screen** brings the tile back.`
- The first line ("Cycle is off until you turn it on, and it's free. Nobody in your family sees your Cycle, or that you use it.") and the note are unchanged.

**`help/en/start/edit-home.md`** (id `start-edit-home`, `updated: 2026-11-26`, 149 words)
- `With Cycle off, a faded **Cycle** tile shows here. Tap it to set up Cycle.` → `**Cycle** works like any tile. Before setup it shows only its name; a tap opens Cycle.`
- step 1: `…until the tiles start to wiggle.` → `…until the tiles wiggle.`

**`help/en/start/features.md`** (id `start-features`, `updated: 2026-11-26`, 124 words)
- first line ends: `Every card starts ticked.` (was "Every feature starts on, except Cycle.")
- note: `> Note: The Cycle card only puts a tile on Home. Cycle itself starts when you tap the tile and finish its short setup. It is private: it stays only on this phone, and nobody in your family can see it. Not for you? Untick the card, or hide the tile later.`

## Where I differ from the prompt

- **The 150-word cap.** `cycle-start` already had 149 words, and `start-edit-home` had 150. With the prompt's wording they came to 193 and 165 words. To fit, I shortened as follows:
  - **cycle-start:**
    - The new paragraph is shorter. "The tile leaves Home" and "You find Cycle again in Settings" are gone. Step 1 already names Settings.
    - Step 1 is one short line.
    - The sentence "The ring shows one dot per cycle day; today's log shows on the card." is gone. The picture's alt text still describes the ring.
    - "on the card" is gone from step 4.
    - The "Until you say it ended…" sentence is shorter.
  - **edit-home:**
    - The new line is 16 words. It does not repeat "× hides it, + brings it back", because step 3 right above already says that for every tile.
    - "start to wiggle" is now "wiggle".
- **Keywords.** The guard allows 12 at most. `cycle-start` had 10, so adding `hide`, `tile` and `not for me` meant one had to go. I dropped `it ended` (it is a button name in step 5). Translations that had no "it ended" word dropped their weakest duplicate instead (es `predicción`, pl `zapis`, tr `adet dönemi`, de `periode hat begonnen`, ja/ko the extra "period day" word, zh `经量`/`經量`).
- **Translations carry no `updated:`.** The guard allows only `translatedFrom` in a translation, so all 72 files have `translatedFrom: 2026-11-26`.
- **Not promising the tile to existing users.** Step 1 says "on Home **or** in Settings", so people with no tile still have a way in. The hide paragraph only applies where the button is shown, which is when the tile is on Home.

## Languages

All 24 translations were edited by 8 foreground sub-agents (model claude-opus-5-5, 3 languages each). All of them had finished before I checked and committed. Each language changed the same 3 files, with 11–12 lines changed per language. Body size per language (cycle-start / edit-home / features; the cap is 210 words, ja/ko 600, zh 450, th 900 characters):

de 161/155/138 · nl 160/154/137 · sv 158/157/140 · da 162/150/139 · nb 165/148/134 · fi 132/114/103 · fr 176/172/136 · it 162/152/128 · es 165/160/133 · pt 171/157/136 · pl 148/138/115 · cs 145/138/116 · sk 147/143/123 · ro 166/151/125 · tr 142/122/105 · el 161/159/141 · uk 146/139/113 · bg 150/150/129 · id 145/135/115 (words) · ja 416/409/369 · ko 371/311/274 · zh-Hans 296/257/230 · zh-Hant 298/268/229 · th 602/490/427 (characters)

In el, uk and bg the edit-home line starts with "The **Cycle** tile" ("Το πλακίδιο **Κύκλος**", "Плитка **Цикл**", "Плочката **Цикъл**"), so the grammar fits the word "tile". None of them says "family planner".

## Verification

- `npm run check:help` → `help OK · 124 article(s) · locale(s) en, de, … id · 99 app routes checked`.
- `npm run build` (foreground) → `build OK · 3759 pages · 3728 in hreflang clusters`, `detector OK · 32 cases`, `help search OK · 38 cases`.
- `grep -rn "except Cycle" help/en` → nothing (exit 1).
- **The old line is gone in all 25 languages, not just 5.** A script compared each language's HEAD paragraph after the `start-edit-home-tile` picture (the old "Tap it to set up Cycle" line) and the old first line of `start-features` with the new files. Every language printed `eh-old-gone fe-old-gone`.
- **The bold words equal the ARB in all 25 languages.** The same script checked that each `cycle-start` has these as **bold**, exactly as in `app_<arb>.arb`: `cycleIntroHide`, `cycleIntroStart`, `settingsTitle`, `settingsHomeTilesTitle`, `cycleItEnded` and `cycleTitle`. It also checked that each `edit-home` has `dashboardTileCycleBreak` in bold. There were no misses. Spot examples:
  - de **Nichts für mich – Zyklus ausblenden** / **Los geht's**
  - fr **Pas pour moi — masquer Cycle** / **Commencer**
  - ja **使わない — 生理周期を非表示にする** / **はじめる**
  - pl **Nie dla mnie — ukryj Cykl** / **Zaczynamy**
  - uk **Не для мене — сховати Цикл** / **Почати**
- I read the full de and el diffs myself.

## Help impact

- `cycle-start`: start from the Cycle tile on Home or from Settings; the new **Not for me — hide Cycle** button; how to get the tile back.
- `start-edit-home`: Cycle is a normal tile (it shows only its name before setup, and a tap opens Cycle).
- `start-features`: every card starts ticked; the Cycle card only adds a tile.

## Open items

- **Picture `start-edit-home`: no re-shoot, alt text kept.** The shot still shows Home in edit mode with a faded Cycle tile and a **+** badge, circled. That is still true: a hidden tile in edit mode looks like that, and **+** brings it back. Several translators asked about it. It is still worth a look on the next help-shots run, because circling Cycle now points at a detail the text no longer explains on its own.
- **App picker text `featureInfoCycleSkipNote` is wrong from 1.18 on** (the app report says so too). It says "The Cycle tile only appears on Home when you turn it on." This help text now says the card starts ticked. That needs an app prompt.
- **The first line of `cycle-start`** ("Cycle is off until you turn it on") was kept as the prompt asked. Three translators said that, now that the tile is on Home before setup, the line may read as unclear. It is still true: Cycle only starts after the setup.
- Ammar deploys this on the 1.18 store day (`./deploy.sh` was not run).
