# Home page: real Apple Watch screens + six new FAQ questions

Load the **frontend-design:frontend-design** skill first and use it inside
this site's existing tokens, fonts, colours and card style.

Run AFTER `004-home-motion-polish.md` (same files).

## Goal
The two watches on the home page (hero `.hwatch`, bento card
`.bx-watch`) show a DRAWN face with three fake rows. The watch app can do
much more, and real screenshots exist in 28 store languages. Show the real
screens. Then add FAQ questions people ask that the FAQ does not answer yet.

## Part A — real watch screens

Source: `../store-listings/watch-shots/<store-locale>/` (repo-relative from
`daili-website`), five PNGs, 416 × 496, black background:
`1-up-next.png`, `2-shopping.png`, `3-todos.png`, `4-habits.png`,
`5-quick-note.png`. Store-locale folder names match `SHOT_LOCALE` values
(`en-US`, `fr-FR`, `es-ES`, `pt-PT`, `zh-Hans`, …).

1. **Convert** them to webp under `static/assets/img/shots/<site-locale>/`
   as `shot-watch-upnext`, `shot-watch-shopping`, `shot-watch-todos`,
   `shot-watch-habits`, `shot-watch-note` (≈ 320 px wide is enough for a
   158 px watch at 2×; keep each file small). Use the same site-locale ←
   store-locale mapping as `SHOT_LOCALE`, so `imgSrc()` finds them and
   ru/hi/ar fall back to `en`. If `tools/make-site-shots.py` (or the
   `SHOT_NAMES`-style list next to `SHOT_LOCALE`) is the place that knows
   which raw file becomes which site shot, add the watch files there so a
   re-run regenerates them — say which you did.
2. **The watch shows a screenshot, not drawn rows.** In `build.mjs`
   `watch()`, the `.face` holds an `<img>` (the case's aspect .83 already
   matches 416 × 496 — check the screenshot fills the face with no stretch
   and no black bars, rounded by the face's corners). Both watches stay
   `aria-hidden`.
   - **Hero watch:** the `Up next` screen, still.
   - **Bento watch card:** the five screens in turn — Up next, Shopping,
     To-dos, Habits, Quick note — about 2.5 s each. The change looks like
     turning the watch's crown: the next screen slides UP into the face
     (short, ~0.45 s, ease-out). Only while the card is on screen and the
     tab visible. No JS or reduced motion: the Up next screen, still. Load
     screens 2–5 only when the card comes near (not on page load).
3. **Bento card text** (`home.screens.watch.p`) now says what it does:
   "What's next, tonight's dinner and your lists — tick off shopping,
   to-dos and habits right on your wrist." (keep `h3` "Apple Watch").
4. Remove the drawn-face strings that are no longer used
   (`home.watch.upNext`, `ev`, `evs`, `list`, and their CSS rules) from
   every locale — only if nothing else uses them.

## Part B — FAQ (`faq.items`)

Every answer must be TRUE: check each sentence against the help article
named in brackets (`help/en/…`) and the API repo's CLAUDE.md §3. If a
sentence is not backed, change it to what the help says — report it.
Brand: capital "Daili" inside sentences.

Change one answer:
- **"Which phones does it run on?"** → add at the end: "There are
  home-screen widgets on both, and an Apple Watch app." [anywhere/widgets,
  anywhere/watch]

Add six (final order shown, existing items unchanged):

1. What does Daili cost? *(existing)*
2. Is there a web version? *(existing)*
3. Which languages does it speak? *(existing)*
4. Which phones does it run on? *(changed, above)*
5. **NEW — "Is there an Apple Watch app?"** — "Yes. See what's next,
   tonight's dinner and the next birthday, tick off shopping, to-dos and
   habits, and add a shopping item or a quick note by voice. The watch needs
   a paired iPhone with Daili." [anywhere/watch]
6. Can my kids use it? *(existing)*
7. **NEW — "How do I invite my family?"** — "Open Family and tap Invite
   members. Share the 6-digit code, the QR code or the link — whoever gets
   it joins your family. Little ones without a phone can be added as a
   child profile instead." [family/invite, family/children]
8. **NEW — "Can I be in more than one family?"** — "Yes. One account can
   be in up to 5 families or groups — your home, the grandparents, the
   sports club or the school class. Each has its own calendar and lists,
   and you switch in one tap." [family/groups]
9. **NEW — "Can I keep things private?"** — "Yes. Make an event private, or
   set a list or a to-do to Only me, and only you can see it. Private items
   never show up for the rest of the family — not in the calendar, the
   lists or the activity feed." [calendar/private + the lists help that
   covers private lists/to-dos; use the app's real switch names]
10. Does it work offline? *(existing)*
11. Can I bring my existing calendar? *(existing)*
12. **NEW — "Is there a family budget and a cycle tracker?"** — "Yes, both
    free. Budget keeps track of shared spending and bills and splits costs
    fairly — no bank connection needed. Cycle is just for you: it stays on
    your phone, never on our servers, and nobody else in the family can see
    it." [budget/start, cycle/privacy]
13. Does Daili work with AI apps like Claude? *(existing)*
14. Where is my data stored? *(existing)*
15. **NEW — "How do I delete my account?"** — "In the app, open Profile and
    tap Delete account. You have 30 days to change your mind — just sign in
    again. After that, your account and data are deleted for good. You can
    download a copy of your data first." [account/delete,
    account/download-data — use the real menu path from the help]

Each NEW answer ends with a short link to its help article in the page's
language, the same way the AI item does (`{aiHelp}` → generalize to a
placeholder that names the article id, e.g. `{help:anywhere-watch}`, and
make `check-content.mjs` placeholder parity cover it). Link text: short,
like the AI item's "How to connect" (e.g. "How it works" / "More in Help").
The FAQPage JSON-LD must carry all 15 items.

## Translations
New and changed keys into every `content/<locale>.json` (all 28 site
locales incl. ar/hi/ru), following `content/glossary.md` and each file's
register. Use the app's own words for UI names (Family, Invite members,
Only me, Profile, Delete account, Budget, Cycle) from
`../familyplanner-app/lib/l10n/app_<loc>.arb` where the app has the
language. "Daili", "Apple Watch", "QR" untouched.

## Scope
- In: `content/*.json`, `build.mjs`, `site.config.mjs` (shot list only),
  `tools/*` (shot tool + checks), `static/assets/home.css`,
  `static/assets/home.js`, `static/assets/img/shots/*/shot-watch-*.webp`,
  this prompt file.
- Out: help articles, legal, blog, feature pages, `deploy.sh`.
  🔴 Untracked files that are NOT yours (`claude-prompts/2026-10-21/`,
  `claude-prompts/MARKETING-WEEKLY.md`, `static/assets/img/photos/`): do not
  touch, stage or commit them.

## Verify
`npm run build` green (all its checks). Look at `dist/index.html`,
`dist/de/` and `dist/ja/` at 1440, 768 and 390 px: hero watch shows the
real Up next screen in that language (ja → Japanese screen, ru → English),
the bento watch turns through five screens and stops when scrolled away,
no stretched screenshot, FAQ has 15 items and the new links open the right
help article.

## Commit & push
`feat(home): real Apple Watch screens + six new FAQ answers`; body
`Prompt: claude-prompts/2026-10-22/005-home-watch-screens-faq.md`. Commit
this prompt file with it. **Push. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-10-22/005-home-watch-screens-faq.md`, half a page:
files added (count, total size), how the watch cycles, which FAQ sentences
you changed for truth and why, locales × keys, build lines, SHA + push.
`## Help impact`: none.
