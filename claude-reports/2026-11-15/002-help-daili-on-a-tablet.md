# 002 — Help: "daili on a tablet" (hidden until the tablet release) + web note fix

**Status:** done · **Commit:** `10e4203b` docs(help): Daili on a tablet (hidden until the tablet release), web article fix (50 files: 25 new `anywhere/tablet.md`, 25 `anywhere/web.md`). Pushed to origin/main with this report. `./deploy.sh` was NOT run — Ammar deploys.
**Step 0:** `29c6965a` docs(plan): sync planning docs (this prompt file), pushed. `static/assets/img/photos/` was left untouched (another lane).

## 1. How the article stays hidden
There is no draft or hidden switch in this repo. The front-matter keys are fixed (`tools/help-lib.mjs` KEYS), and `since` is the only gate. So the article has **`since: 99.0.0`**, a clear placeholder.
- Website pages, the sitemap, site search and "related" links show only articles with `since` ≤ `LIVE_APP_VERSION` (1.16.2, not changed) (`visibleHelp`, `tools/help-lib.mjs:730`).
- `help/<locale>.json` carries every article (that is by design). The app drops any article newer than itself in `filterHelpForVersion` (`familyplanner-app/lib/features/help/domain/help_filters.dart:44`). This runs in `help_providers.dart:34/48/65` before search, topics, related links, tips and the checklist see the content. So for every app before 99.0.0 the article does not exist.
- No other article lists `anywhere-tablet` in `related`, and it has no tip or checklist row.

**The ONE line the release prompt must change:** in `help/en/anywhere/tablet.md`, `since: 99.0.0` → `since: <tablet release version>`. (Translations carry no `since`. Also drop `mediaPending:` and add `media:` once the pictures exist.)

## 2. The English article (in full, for review)
Front matter: `id: anywhere-tablet`, topic `anywhere`, title "daili on a tablet (iPad and Android)" (brand in lower case, like "daili on your Apple Watch"), summary "A bigger layout for iPad and Android tablets, with keyboard shortcuts and mouse or trackpad support.", the 10 keywords from the prompt, `routes: /` (like web.md), `order: 3`, `mediaPending: tablet screenshots, landscape and portrait`, related `anywhere-web, anywhere-wall, anywhere-widgets`.

> A menu on the left holds your places. Lists and recipes open beside their list, and a day beside or under the month. Most forms and panels open as a window. Same account, same data.
>
> Turn the tablet either way, or split the screen at any size: what you opened and typed stays. A very narrow window shows the phone layout.
>
> Shortcuts, with Cmd (iPad) or Ctrl (Android):
>
> 1. **N** or **Cmd/Ctrl+N**: add something new.
> 2. **/** or **Cmd/Ctrl+F**: search Recipes, Notes, Birthdays or Help.
> 3. **T**: today. Arrows: move in the calendar.
> 4. **Cmd/Ctrl+Enter**: save (most forms).
> 5. **Cmd/Ctrl+1** to **9**: menu places. **Cmd/Ctrl+,**: **Settings**.
> 6. **Esc**: close a window.
>
> Single keys never fire while you type in a field.
>
> Mouse or trackpad: hover lights up, right-click opens long-press actions, and you can drag events in the month.
>
> daili follows your tablet's text size.
>
> > Note: A wall screen is different: a family board on a tablet.

**Where I had to go against the prompt (the guard wins; I did not widen it):**
- **No table.** Help articles cannot hold a table. They allow only paragraphs, ONE numbered list (≤ 7 items), pictures and `> Note:` lines. So the shortcut table became the one numbered list, one row per item ("Key: what it does").
- **150 words maximum** (the body is exactly 150). So the table is shortened. Left out to fit: PageUp/PageDown, Enter on a Month day, ↑/↓ = week, Tab/Shift+Tab, Esc on the quick-add fan, and the exact list of screens for N.
- **Two panes in BOTH orientations.** The prompt says "in landscape two things side by side". The code shows Lists and Recipes side by side in portrait too (panes 250/260 wide). Only the calendar day goes beside the month in landscape and under it in portrait. The text says this.
- The rail does not hold "all places". It has 9 main places plus Settings and your picture. Places hidden on Home are left out, and Cycle never shows. So the text says "your places".

**Fact-check:** one fresh Opus 5.5 agent checked every sentence against the app code before translating. It found nothing wrong, but 4 misleading points, and I fixed them:
- "Forms open as a window": sheets open as windows too, and some forms stay full pages (Profile, Budget) → "Most forms and panels".
- "Cmd/Ctrl+Enter: save": only forms with the round Save button have it; the habit, chore and reward forms do not → "(most forms)".
- "right-click is a long press": long-press DRAGS still need a long press (reordering lists, moving meals, Day/Week events) → "right-click opens long-press actions".
- "Esc: close a window or menu": shortened to "close a window" for the word budget (menus close on Esc too).

## 3. All help languages
Eight Opus 5.5 translators (3 locales each, foreground) wrote all 24 locales with `/tmp/helptab/BRIEF.md`, the app's own words (`labels.mjs`: Settings, Recipes, Notes, Birthdays, Help from each ARB) and a per-locale guard check. I waited for all eight. All 24 were clean on the first report. I checked on disk: all 25 `tablet.md` exist, and each `web.md` diff is 2 lines (note + `translatedFrom: 2026-11-16`).
My own review: I read the German in full. I fixed "all areas" → "main areas" in de, da, nb, nl and fi (the rail does not show all places).
Translators' "English issues" (none blocking): the phrase "open beside their list" is hard to read on its own; "Split View" appears only in the keywords; and the letter T only works as a memory aid in English.

## 4. Web article fix (live now)
daili-web `a0cb8d3` is on `main` (`git branch --contains` → main, origin/main). It adds `isPhone()`: only phones get the app wall, and tablets can use the browser. English is now: "> Note: The browser version is made for computers and tablets. On a phone, it asks you to use the app instead." and `updated: 2026-11-16`. The same sentence is changed in all 24 languages (`translatedFrom: 2026-11-16`).

## Facts I could not confirm (left out)
- **Single-letter shortcuts on a non-Latin keyboard** (Greek, Cyrillic, …): it is not clear that N / T / / fire when the tablet's keyboard layout is not Latin. The shortcuts use Flutter's logical keys. I could not test this, so the article does not say either way. The el/uk/bg translator raised this — worth a check on a real iPad.
- "Large text" is not tablet-only: the app follows the system text size on phones too (no clamp). The sentence is true, so I kept it. Above 1.3× text, the wide rail shows icons only — left out.
- Below 600 pt the phone layout shows; from 600 to 671 pt the small rail sits next to the phone layout. Simplified to "a very narrow window shows the phone layout".
- After a window has been phone-narrow and comes back, Home's week card, the Habits board and an open Settings page start fresh (report 042, polish list). The address, chosen day, list, recipe and typed text stay. The article keeps the general "what you opened and typed stays".

## Verify
- `npm run build` (foreground) → exit 0. `help: 111 of 112 article(s) on pages (live 1.16.2) · en.json 112 articles` · `build OK · 3659 pages` · `detector OK` · `help search OK`. The build accepts `mediaPending` (it is listed under "13 article(s) waiting for a picture: anywhere-tablet — tablet screenshots, landscape and portrait"). The 54 content-length warnings were there before and are not from this change.
- **How I checked it is hidden:** `grep -rl "anywhere-tablet\|tablet (iPad and Android)" dist --exclude="*.json"` → no file (no page, sitemap or search file). `find dist -path "*anywhere/tablet*"` → nothing. It appears only in the 25 `dist/help/<loc>.json` files, with `since: 99.0.0`, and no other article relates to it. The app's `filterHelpForVersion` removes it for every app below 99.0.0 (see §1).
- Built en.json web note = the new sentence.

## Help impact
`anywhere-tablet`: new article, hidden until the tablet release (since 99.0.0). `anywhere-web`: the note now says the browser version works on tablets; only phones are asked to use the app.

## Open items for Ammar
- Deploy (`./deploy.sh`) so the web note fix goes live. The tablet article stays hidden after deploy.
- Release prompt: set `since:` in `help/en/anywhere/tablet.md` to the tablet version, and add the tablet pictures (landscape + portrait) in place of `mediaPending`.
- Optional: try N / T on an iPad with a Greek or Russian keyboard layout.
