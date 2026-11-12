# 003 — Habits without Minzi on the marketing pages; legal guard 1.16.0

**Status:** done · **Commit:** `4a19a5ff` docs(site): habits without Minzi on the marketing pages; legal guard 1.16.0. Pushed to origin/main. `./deploy.sh` was NOT run: this goes live on store day with the `LIVE_APP_VERSION` bump.
**Step 0:** `16a99c67` docs(plan): sync planning docs (prompt 003 + report 002), pushed. `static/assets/img/photos/` was left unstaged, as the prompt says.

## Pages changed
The home page and `/features/habits/` change in all 28 languages. Both are built from `content/*.json`, `build.mjs`, `site.config.mjs`, `home.css` and `home.js`.
- **Hero, habits scene:** the third card no longer says "Family energy +1"; it says "+1 star for the family", with a star icon instead of the paw. The hero watch no longer switches to a habits screen in this scene (it keeps the previous screen).
- **Members carousel:** the caption "Day 12. Minzi is proud." becomes "Day 12. Another star!". The Minzi tile becomes "A star for every done day", with a star icon. It looks the same as the €0 tile.
- **Feature row, habits card:**
  - New text: "One person at a time, a year of done days on every habit. Every finished day gives a star."
  - The floating card becomes "Cinema trip · 34 / 40 · 6 more stars, then plan it". It is now a normal floating card like on the other features. The special energy card that sat over the screenshot is gone, together with its fixed position (`HABITS_ENERGY`).
- **"See it in action", step 4:** the text becomes "…tick it, and the day is done: one more star for the family reward", and the toast says "+1 star". The habits video showed Minzi, so this step now shows the new screenshot with the drawn tick (on the Stretch circle). The jumping cat is removed.
- **Widgets box:** the drawn habits widget follows the app's new widget: a mint column with today's progress ring (1/3), then the rows. The Minzi image, the energy bar and the "Energy {n}/{max}" string are gone (the key is deleted in all 28 files).
- **`/features/habits/`:**
  - New lead: "Habits for one person at a time, with a year of done days on every habit. Every finished day gives a star toward a family reward."
  - Three benefits: One person at a time · A year of done days · Family rewards ("Set a reward like a cinema trip. When the stars fill it, plan it in the calendar.").
  - Same layout as before: still one phone.
- The translator notes in `en.json` (`@home`, `@cards`, `@tiles`, `@widgets`, `@features`) no longer mention Minzi or energy.
- **Translations:** I wrote the English. Five Opus 5.5 sub-agents translated the other 27 languages, using the app's ARB words for habits, reward and star. A script applied them by key path, so each file's own formatting is kept. I checked every file: all keys present, length limits met, no Minzi, no emoji, no "Plus". The sub-agents found no other Minzi, energy or postcard text in any language.

## Pictures
- **`shot-habits` (all 25 screenshot languages):** this was the 1.15 store capture showing Minzi's room and the energy card. It is now the Help center picture **`habits-what`**: "Your habits" with the person switch and a year of done days. It is made with `make-site-shots.py --from-help` (`HELP_SHOT_SOURCES`). `08-habits` was taken out of `SHOT_SOURCES`, so a later store re-run cannot bring the cat back.
  - The help picture has the Help center's orange ring round the + button, like the budget and cycle shots.
  - The files are 43–48 KB. That is a little over the script's 45 KB target, even at quality 65. It is not a build gate.
  - `habits-rewards` is not used: adding it as a second phone would have changed the page's layout.
- **Deleted (unused Minzi files):**
  - `img/home/minzi_jump.webp` and `minzi_sit.webp`
  - `video/flow-habits.mp4` and `.webp` (the clip shows Minzi)
  - `shots/*/shot-watch-habits.webp` (25 files; the watch screen showed Minzi)
  - The watch box now cycles through 4 screens.
- **Kept on purpose:** `o_cat.webp`, the felt toy cat in the flat-lay, and the `p_teen` photo of a real sleeping cat. Neither is Minzi or part of the Habits story. Say if you want them gone too.
- **CSS/JS removed:** `.energy*`, `.jump` with its keyframes, `.wh-minzi`/`.wh-bar`/`.wh-en`, `.mcard.tile img`, and the jump code in `home.js`.

## Legal guard
`tools/check-legal.mjs` has a new `V116_MUST_CONTAIN` block for the six new privacy anchors in every locale: `id="rewards"`, `"stock-lists"`, `"meal-wishes"`, `"instagram-recipes"`, `"offline"` and `"read-aloud"`. It is checked like the earlier releases' blocks. All 28 privacy pages already have them: `legal OK · 2 document(s) × 28 locale(s)`.

## Checks
- `npm run build` → exit 0. Output: `build OK · 3483 pages`, plus `detector OK` and `help search OK`. The 54 length-ratio warnings are old ones; none is on a changed key.
- `grep -ri minzi dist/` finds only the old changelog pages: `dist/whats-new.html` and `dist/neuigkeiten.html`.
- Headless Chrome stills (English):
  - the habits feature page shows the year view with the "Cinema trip · 34 / 40" card
  - the widgets box shows the 1/3 ring
  - the star tile matches the €0 tile
- **Never-mention list:** the new text mentions none of these. The home page still says "Outlook" in the older, unchanged copy ("Works with" row, calendars card, FAQ, orbit icon). That was outside this prompt, so I left it. Planning Claude should decide whether it needs its own prompt.
- The help center's `habits` category icon is still a paw (`site.config.mjs` help icons). That is help scope and not Minzi, so I did not change it.

## Help impact
none
