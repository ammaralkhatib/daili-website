# 001 — reviews-and-member-count — DONE

**Commit:** `fecd705` feat(home): real store reviews + 2,000+ members — pushed to `main`. Not deployed (`./deploy.sh` is yours).

## What changed
- `site.config.mjs`: `MEMBERS_COUNT` 1500 → 2000; `REVIEWS` = the 7 entries from the prompt, in that order (checked: they deep-equal the prompt's code block); the doc comment now says title is optional (Google Play has none, so leave it out, never invent one) and an excerpt is OK only when the cut is marked "…".
- `build.mjs`: `title` is no longer required. With no title (missing or empty) there is no `<b>` line. `data-review` = `${name}|${date}`. Error messages use the same key.
- `tools/check-build.mjs` §15: cards are matched to `REVIEWS` by `[title || '', text]`, in order. The message still says "only real reviews … never invented ones".
- `static/assets/home.css`: `.rv .st+.who{margin-top:12px}`. Without it a card with no title had only 3 px between the stars and the who-line.
- README: no change (it doesn't describe the review shape). No `content/*.json` touched. Step 0: nothing to commit (the only pending planning doc was this prompt, which went into the feature commit).

## Verify
- Build: `build OK · 3308 pages · 3278 in hreflang clusters`, plus detector OK and help search OK. The whole `npm run build` chain is green, **with one caveat (owner item):**
- **Owner item:** plain `npm run build` is red on the help route check: `app route "/meal-plan/settings" has no article`. That route is committed in app HEAD (d03bba43, "one Meals place…") but isn't in any release tag yet. So website HEAD is red without my change too. I ran the full gate as `DAILI_APP_REPO=<scratch>` using the **live release's** (v1.14.0+20) `route_names.dart`, so the route check still ran against what's live. The next help-sync for the Meals release has to add the article (or a `pending` entry) before an unmodified `npm run build` turns green again.
- dist: `index.html` shows `2,000`, `de/index.html` shows `2.000` (`it` shows `2000`, Italian Intl doesn't group 4 digits). `#reviews` comes right after `.care` (its previous sibling). 7 cards in prompt order, ×2, the second set `aria-hidden="true"`. The 3 Google Play cards (Valentino R., Google Play user, Marc A.) have no `<b>`. Every `<p>` has its own `lang` (it/en/de/cs/de/en/de).
- Guard proof: in built `dist/index.html` I changed "No fluff." to "No fluff!" in the first card set, then ran check-build. It went **red**: `index.html  the reviews row shows 7 card(s) that are not exactly REVIEWS' 7, in order — only real reviews…`. Restored the file and it was **green** again: `build OK · 3308 pages`.
- Shots (CDP, en + de, marquee paused, transitions off): `001-shots/reviews-1440.png`, `001-shots/reviews-390.png`. At both 1440 and 390 px every card measures **340 × 319 px**: the flex row stretches all of them to the tallest, which is the willoo98 card. All tops align, no card overflows, and there is no horizontal page overflow. The stars → who-line gap is 12 px without a title and 34 px with one. Short cards (Cordis23, Marc A.) leave some empty space at the bottom, which is expected with equal heights.

## Help impact
none
