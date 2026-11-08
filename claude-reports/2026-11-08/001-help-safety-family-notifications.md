# 001 — Help: safety article, what your family gets told, security.txt, footer link

**Status: done and pushed, not deployed.** Commit `1e03c146` is on `origin/main`. `./deploy.sh` was not run.

🔴 **Plain `npm run build` is still red, and it was red before this work started.** So `./deploy.sh` will stop too (see "For Ammar", item 1).

## What was added
- **2 new articles × 25 languages:** `account-safety` and `notifications-family`, in English plus 24 translations.
- **`related` lines:** added to `notifications-choose`, `account-download-data` and `account-delete`. `updated` was not changed.
- **`static/.well-known/security.txt`:** exactly the prompt's text.
- **Footer link and home page link, all 28 languages:** `footer.safety` and `home.privacy.safetyLink`. ru, hi and ar point to the English article, marked `hreflang="en"`.

## Where the prompt could not be followed as written
The help guard (the check that fails the build on bad articles) is stricter than the prompt. I did not change the guard.
- **150 words, not 300 or 230.** Both articles fit: 150 and 148 words.
- **No headings, bullets or body links are allowed.** I used bold lead-ins and the `related` line.
- **At most 12 keywords.** I dropped `https, server, europe, eu`; those words are in the article text anyway.
- **"No media" is not allowed.** Each article needs a picture or `mediaPending`, so I used `mediaPending` (`account-tips` does the same).
- **Translations cannot have a `related` line.** They take it from English, so only the 3 English files changed.
- **`order`:** `notifications-family` uses 2, the same as `notifications-choose`. It sorts straight after it, so no other article moved.

## Facts I corrected against the code
A separate sub-agent checked the English against the code before translation. I re-checked the main findings myself.
- **"Sign out of all devices":** this button does not exist in the app or the web app. Only the server has it (`auth/logout-all`), so I removed it from the article.
- **"Every request must be signed in":** not true for everything. A calendar feed link, a budget guest link, a wall screen and a connected AI app can all show family data. It now says "Only your family sees your data, plus links, screens or apps you add."
- **"Never leave your phone":** now "reach us only if you copy something into daili" (Edit in Daili and Cycle supplies do copy). The summary says "stays on your phone".
- **Family notifications:**
  - **Family** fires only when a new member joins or a child is added.
  - **Habit news** is not "add, change, delete", so it has its own sentence.
  - "As one notification" was wrong: the first comes at once and the rest are bundled.
  - An event notifies only its chosen people if they have a login.
  - I added that the notification shows the name and the title, because the user asked "what exactly".
- **"Anytime" removed:** a family owner with other members cannot delete their account until they hand the family over.
- **Habit news wording:** the live server also sends Minzi trips. I wrote "things like…" and did not name the cat, so this stays true after 1.16.0.

**Left out to fit 150 words:** AES-256 for calendar keys, no Google or Apple password, the phone's own backup, the data centre wording, "or group".

## `.well-known`
No `.htaccess` or build change was needed. Rule 1 already lets `/.well-known/` through, the deny rule does not match `.txt`, and the build copies dot-folders (`dist/.well-known/security.txt`, mode 644). The `text/plain` header can only be tested live, after a deploy.

## Other changes
`home.css` got 2 small rules: the home link style is dark green, which disappears on the dark privacy box, so it is white there.

## Verification
All of these ran with `DAILI_APP_REPO=/tmp/help-safety/liveapp`, which holds the route file from the live tag `v1.15.0+21`:
```
help OK · 105 article(s) · 25 locale(s) · 81 app routes checked
build OK · 3508 pages · 3478 in hreflang clusters
detector OK · 32 cases · 28 locale(s) built
help search OK · 26 cases · 2 built page(s)
```
`npm test` also passed (no special setting): `test-check-help OK · 99 cases`.

- **Spot checks passed:** the 4 article pages, `security.txt`, the footer and home link on `index`, `ja`, `ru`, `ar` and `de`, and `help/en.json` + `help/ja.json`.
- **Browser check:** the link fits in the dark box in 10 language and screen-size checks. Tightest: French at 320 px, 3 px spare.
- **Not fully checked:** I read the Japanese myself and changed one phrase. The other 23 languages passed the script, and their translators read them, but no native speaker has checked them.

## For Ammar
1. **Deploying.** App commit `b64a9a9c` (Minzi removed, not released yet) makes `help/en/habits/minzi.md` fail the guard, so plain `npm run build` and `./deploy.sh` stop.
   - **Recommended:** `DAILI_APP_REPO=/tmp/help-safety/liveapp ./deploy.sh`. This still checks routes against the live app. If `/tmp` was cleared, make a new folder with the route file from `v1.15.0+21`.
   - **Do not** delete the Minzi article: it is true until 1.16.0 is live.
2. **Privacy policy (out of scope, not changed).** §6 still says "every request must be signed in", which the feed and guest links contradict, and the policy never mentions the outgoing calendar feed link. I suggest a legal prompt.
3. **Please check two claims the code cannot prove:**
   - "Never for training": the sub-agent believes Google promises this only on paid Gemini keys. Please check that the live key is on a paid plan.
   - "We review security regularly and fix problems right away": this comes from the prompt and is a promise.
4. **Report not committed yet:** it will go in with the next run's step 0. This repo has no `CHANGELOG.md`, so no changelog line was added.

## Help impact
New articles: `account-safety`, `notifications-family`.
