# 001 — Website + help: Daili Plus gives 50 AI actions a month, not 30

**Result:** done · **Commit:** `f5fc118f` docs(site,help): Daili Plus gives 50 AI actions a month (was 30) — pushed to origin/main (`dc45a4ef..f5fc118f`, 203 files, 431 lines changed, 431 removed). `./deploy.sh` was NOT run: Ammar deploys the website after Planning Claude's check, once the api change is live.
**Step 0:** `dc45a4ef` docs(plan): sync planning docs (prompts 001 + 002 of today), pushed. No commits were held. `static/assets/img/photos/` (9 untracked pictures) stayed out of every commit.
**Sub-agents:** none. The change is the same number in the same sentences everywhere, so one small script did it (below).

## What changed

Only the Plus number, 30 → 50. Free stays 3, storage stays 5 GB, the price is unchanged.

**Website texts (`content/<lang>.json`), 2 lines in each of the 28 files:**
- the FAQ answer "Is Daili free?" (en `:380`, other languages `:330`): "… gives you **50** AI actions a month and 5 GB …"
- the small print under the AI section, key `fine` (en `:255`, other languages `:219`): "… Daili Plus gives **50**, plus 5 GB of Daili cloud, for €9.99 a year." The prompt named only the FAQ, but this line says the same number on the home page, so it changed too.

**Help (`help/<lang>/…`), 7 files and 8 lines in each of the 25 help languages:**
- `calendar/photo.md`, `meals/photo.md`, `meals/instagram.md`, `meals/youtube.md`, `meals/suggest.md`, `account/avatar-ai.md`: the note "… Daili Plus gives **50**." (1 line each)
- `account/plus.md`: the `summary` line and the first body line (2 lines)
- `notes/notes.md`, `meals/cook-with.md`, `meals/share-sheet.md` name AI actions but give no Plus number, so nothing changed there.

**Front matter:** the 7 English files got `updated: 2026-11-23`. The 168 translated files (24 × 7) got `translatedFrom: 2026-11-23`. Nothing else in the front matter changed (`since`, `mediaPending` and the rest untouched).

**Lines changed per language** (number lines + date lines):

| Language | content | help number lines | help date lines |
|---|---|---|---|
| en | 2 | 8 | 7 |
| bg, cs, da, de, el, es, fi, fr, id, it, ja, ko, nb, nl, pl, pt, ro, sk, sv, th, tr, uk, zh-Hans, zh-Hant (each) | 2 | 8 | 7 |
| ar, hi, ru (no help in these languages) | 2 | 0 | 0 |

Total: 56 content lines + 200 help number lines + 175 help date lines = 431.

**Grammar:** in every language here, 30 and 50 take the same word form (e.g. Russian/Ukrainian/Polish/Czech genitive plural, Arabic singular after both, Finnish partitive, Romanian "de" after both). So only the digits changed, no word around them.

## How I did it

A small Node script in `/tmp/ai50/` (outside the repo):
- content: changed the one "30" (not part of a time like 16:30) on the two lines that also hold the price (9.99 / 9,99). It stopped if a file did not have exactly 2 such lines, or a line held more than one "30".
- help: in the 7 files, changed the "30" on lines with "Plus" (plus the `summary` line of `plus.md`). It stopped unless each file had exactly 1 such line (2 in `plus.md`). A dry run first: no problems. Then the real run: no problems.
- Before that, I compared every help file's count of "30"s with the English file: every language matches English, so no language says the Plus number in a different place or in words.

## What still says "30" next to AI, and why it stays

- `help/<lang>/account/avatar-ai.md`: "newest **30** per person" = how many avatars the phone keeps, not the Plus number.
- `help/<lang>/meals/suggest.md`: "Quick (under **30** min)" = a filter name.
- `content/*.json` `deleteWhat` / account-delete FAQ: "**30** days" to change your mind (they sit near the words "Daili Plus" only because of the "cancel Plus first" sentence).
- `changelog/whats-new.en.html:144` and `whats-new.de.html:144`: the 1.9.0 entry "30 AI actions a month". That is history; kept as the prompt says.
- `blog/`: no post names the Plus number.
- `legal/`: no legal text names the number of AI actions. `legal/terms.*.html` (e.g. `terms.zh-Hans.html:30`) only says we may "adjust the number of AI actions per month" without a number, and its "30" is "end the subscription within 30 days after a change". All other "30"s in `legal/` are the 30-day deletion period. Nothing to decide for Ammar here.
- `templates/`, `site.config.mjs`, `build.mjs`, `tools/`, `marketing/`, `wall/`: no Plus "30".

## Checks (all in the foreground)
- `npm run check:help`: `help OK · 118 article(s) · 25 locale(s) · 94 app routes checked`.
- `npm run build`: green — `content OK · 28 locale(s) · 527 keys each`, `legal OK · 2 document(s) × 28 locale(s)`, `test-check-help OK · 99 cases`, `build OK · 3759 pages`, `detector OK · 32 cases`, `help search OK · 38 cases`.
- `npm test`: green (detector, test-check-help, help search, blog i18n).
- Last grep over `content/` and `help/` for "30" near AI / KI / IA / ИИ / ШІ / YZ / Plus: only the "keep" lines above are left.
- `git status` after the build: only the 203 files above changed (plus the untouched photos folder).

## Open items for Ammar / Planning Claude
- Deploy the website (`./deploy.sh`) only after the api change (`familyplanner-api 2026-11-23/005`) is live, so the site never promises 50 while the server still gives 30.
- The app and the web change their own texts in their own runs. The help files built here (`dist/help/<lang>.json`) say 50 after this deploy.

## Help impact
account-plus, calendar-photo, meals-photo, meals-instagram, meals-youtube, meals-suggest, account-avatar-ai: Daili Plus now gives 50 AI actions a month (was 30), in all 25 help languages.
