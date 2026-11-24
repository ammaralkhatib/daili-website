# Privacy + help: Google event colours — privacy names the colour, new hidden help article

Standard lane, website only. Feature "Google event colours" (Daili list item #314). Plan:
`/Users/ammarkhatib/Herd/familyplanner-api/claude-prompts/GOOGLE-EVENT-COLOURS-PLAN.md` v1.0. Ammar 2026-11-24
("Yes, both in this run"): the privacy text gets one short addition and the help gets a "Google colours" part in this
run. The api, app and web prompts of this run come BEFORE this one — read their reports:
`~/Herd/familyplanner-api/claude-reports/2026-11-24/017-google-colours-server.md`,
`../familyplanner-app/claude-reports/2026-11-24/017-google-colours-texts.md` + `018-google-colours-app.md`,
`../daili-web/claude-reports/2026-11-24/007-google-colours-web.md`. If one is missing, write from the plan and list
every fact under "Facts I could not confirm".

What the feature does (for the texts): Daili now also stores, for each event synced from Google, Google's colour
number for that event (one of Google's 11 event colours, or none). Each family can match a Google colour to one of
its Daili event categories in the phone app (Family → Event categories → Google colors, also in Calendar settings →
Other calendars); matched events then show that category's name and colour. Every family member may change the
matching; it counts for the whole family. Daili never changes a colour in Google. The web shows the colours and
categories; the matching is only in the phone app. Outlook events and calendar links are unchanged.

Every sub-agent you start MUST use model claude-opus-5-5. Write the report with the file-write tool.

## 1. Privacy (`legal/privacy.<lang>.html`, every language file, + `legal/datenschutz.de.html`)

Today (`privacy.en.html`, read 2026-11-24 — re-check): ~32 "Connected calendars" says "For events from a Google or
Outlook calendar or a calendar link, we store their title, place, times and notes"; section 5 "What we store" (~89-90)
starts "For each event: title, location, start and end time, whether it is all-day, its time zone, and its
description …".

1. ~32: after the "we store their title, place, times and notes" sentence add one short sentence: for a Google
   event also its colour (one of Google's own event colours), so Daili can show it in that colour.
2. Section 5 "What we store", "For each event: …" list: add "its colour (Google's colour number for the event, if it
   has one)". After the "For each chosen calendar …" sentence add one sentence: for each family, which Google
   colour goes with which of the family's event categories (if anyone set this); every member of the family can see
   and change it; it is deleted with the category or the family. Daili never sends a colour to Google.
3. Same change in every language (each file's own words — read how that file already says "colour", "category",
   "event"; "Google" stays) and in `datenschutz.de.html`. Bump each page's "last updated" date to the day you run,
   the way the files already do it. Run the legal check; extend it only if it checks a list this change touches.

## 2. Help — new article, HIDDEN until the app with the screen is in the stores

Same way as `help/en/calendar/two-way.md` / `shift-plan.md` (prompt `claude-prompts/2026-11-24/001-…` §2): `since:
99.0.0` in the English file, NO `related:` link FROM any other article to it, do NOT bump `LIVE_APP_VERSION`, do
NOT change `calendar-categories` now.

**`help/en/calendar/google-colours.md`, id `calendar-google-colours`.** Front matter like
`help/en/calendar/categories.md`: topic `calendar`, title "Google colours and categories", a one-line summary,
keywords (Google colour, Google color, event colour, colour, color, category, Lavender, Sage, Tomato, Google
Calendar), `routes:` the app's real route (from app 018's report — expected `/family/event-categories/google-colors`;
add it to `help/routes-allowlist.json` if the build needs it), `tryIt:` that route, `since: 99.0.0`, `updated:` the
day you run, `mediaPending:` "the Google colors screen with two matched colours", `order:` after
`calendar-categories`, `related: calendar-categories, calendar-two-way`.

**Check every fact against the code before you write it** (app `lib/l10n/app_en.arb`, keys `googleColors…` and
`googleColorName…`; the app writes "color" in English — the website keeps its own British "colour" in running text,
but button and screen names in **bold** must match the app EXACTLY, e.g. **Google colors**). Short sentences, easy
words, numbered steps, "you", ≤ 220 words. Content:

1. One line: events you coloured in Google Calendar keep that colour in Daili; events without their own colour keep
   their calendar's colour.
2. Numbered: Home → **Family** → under **Calendar** → **Event categories** → **Google colors** (also in Calendar
   settings → Other calendars); you see the colours your Google events use, with how many events; tap one and pick a
   category, **Keep Google color**, or **New category in this color**.
3. Matched events show the category's name and colour; the event shows where it comes from.
4. It counts for the whole family, and anyone in the family can change it.
5. Change the colour in Google, and Daili follows on the next sync. Daili never changes colours in Google.
6. One line: delete the category, and its events get their Google colour back.
7. One line: on the web (app.daili.app) you see the colours and categories; the matching is in the phone app.

## 3. Translations

A new English article breaks the build until it exists in every `HELP_LOCALES` language (`site.config.mjs`).
Translate it into all of them following `claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md`, with
`translatedFrom` = the English `updated`, exactly like `2026-11-24/001` §3. Use each language's REAL app words from
`../familyplanner-app/lib/l10n/app_<arb>.arb` (the `googleColors…` and `googleColorName…` keys; zh-Hans →
`app_zh.arb`, zh-Hant → `app_zh_Hant.arb`). "Google" stays as it is.

## 4. Verify

- `npm run check:help`, the legal check (`node tools/check-legal.mjs` or the npm script that runs it) and
  `npm run build` green (FOREGROUND); spot-check 5 translations against their ARB and 3 privacy languages against the
  English. The new article does NOT show on the built site's index or search (prove it like 2026-11-24/001).

## Commit & push

- `docs(legal,help): privacy names Google event colours; hidden article "Google colours and categories" (#314)`;
  body names `Prompt: claude-prompts/2026-11-24/002-google-colours-privacy-help.md`.
- **Push now.** Do NOT run `./deploy.sh` (Ammar deploys).
- 🔴 Report trap: never put the word "status" and the word "blocked" on one line unless you really are blocked (the
  run script stops on it).

## Report

- `claude-reports/2026-11-24/002-google-colours-privacy-help.md` (file-write tool, `wc -c` > 0). The new privacy
  sentences in en + de word for word; where they sit; facts I could not confirm; the route; the open items for the
  release day (real `since` for the article, a `related` link from `calendar-categories` in all locales, the
  picture). `## Help impact`: new hidden article `calendar-google-colours`; privacy: Google event colours.
- `## Open items for the owner`: deploy the website (`cd ~/development/flutter_projects/familyplanner/daili-website &&
  ./deploy.sh`) right after this run — the api of this run already stores the colour number since its push.
