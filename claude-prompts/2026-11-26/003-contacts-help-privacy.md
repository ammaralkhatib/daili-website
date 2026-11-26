# Help + privacy: Contacts — a new hidden help topic (25 languages), a privacy part (28 languages) — PUSH, NO DEPLOY

Standard lane, website only. Feature "Contacts" (Daili list item #385). Plan:
`../familyplanner-app/claude-prompts/CONTACTS-PLAN.md` v1.0 ("Design → 4. Website + legal"). Rule: the api repo's
`CLAUDE.md` §3 "Contacts". Design picks + every word of the screens:
`../design-handovers/2026-11-26-contacts-RESULT.md`; pictures `../ux-shots/2026-11-26-contacts/`.

The api and app prompts of this run come BEFORE this one — read their reports:
`~/Herd/familyplanner-api/claude-reports/2026-11-26/001-…`, `002-…`, `003-…` and
`../familyplanner-app/claude-reports/2026-11-26/030-…` to `033-…` (034 may not be there yet). If one is missing,
write from the plan and list every such fact under "Facts I could not confirm".

Why now: the app got the routes `/contacts…` (app 031 / 032, in the local app repo). `tools/check-help.mjs` reads
the app's `lib/core/routing/route_names.dart`, so **`npm run build` is RED until an article covers these routes** —
this prompt makes it green again. And the privacy text must name the new data (names, phone numbers, addresses of
third persons on our server) before any user can save one.

Every sub-agent you start MUST use model claude-opus-5-5. Write the report with the file-write tool.

## 1. Help — a new topic `contacts`, hidden until the release

1. **Topic:** add `contacts` to `HELP_TOPICS` in `site.config.mjs` (~:1365) with an EXISTING icon name from
   `HELP_ICONS` (~:1359) — use `people` (the app maps icon names itself; a new name would need an app change).
   Place it after `birthdays`. Every help locale's `help/<code>/_ui.json` gets `topics.contacts.{title, summary}`
   (en: "Contacts" / "The numbers your family needs: doctor, school, babysitter."; de: "Kontakte" / "Die Nummern,
   die eure Familie braucht: Arzt, Schule, Babysitter.").

2. **Three English articles** in `help/en/contacts/` — all `since: 99.0.0` (hidden; the release help sync sets the
   real version), `updated:` today, `mediaPending:` (pictures come with the release help sync via the app's
   `tool/help-shots.sh`), within the limits of `tools/help-lib.mjs` (title 70, summary 140, ≤ 12 keywords, ≤ 7
   steps, ≤ 150 words). Easy words, "you", the screen words EXACTLY as in the RESULT file:
   - `contacts-basics` (`add.md` or the naming the folder uses) — "Keep your family's contacts in one place":
     where it is (Home tile "Contacts"), add one by hand (name + number is enough, "More fields"), the type, "for
     whom", the star, call / message / mail / route / share from the contact, the whole family sees it, at most 300
     per family. `routes: /contacts, /contacts/new, /contacts/:id, /contacts/:id/edit` · `tryIt: /contacts`.
   - `contacts-from-phone` — "Take contacts from your phone": "From your phone" opens the PHONE's own contact
     picker; Daili gets only the people you pick and never asks for your whole address book; several at once on
     iPhone and on Android 17, one person at a time + "Add another" on older Android; the check screen (type,
     untick, "Already saved", the one "Only me" switch); a taken contact is a COPY — changing it in Daili does not
     change your phone and the other way round. `routes: /contacts/import` · `tryIt: /contacts`.
   - `contacts-only-me-and-events` — "Only me, birthdays and calendar events": "Only me" (only you see it; only the
     person who made it can switch it), a birthday on a contact + "Also in Birthdays", a contact on a calendar
     event (the Contact row; Location fills in by itself; Call and Route on the event; an "Only me" contact fits
     only your own private events), where contacts never show (wall screen, widgets, watch, AI apps), works without
     internet for looking and calling. `routes:` none new (or the calendar route the folder's event articles use —
     only if `check-help` accepts it) · `tryIt: /contacts`.
   - `related:` each names the other two; the third also names the existing private-list and birthday-reminder
     article ids if they exist (look them up; do not invent ids).
   - **Route check:** the app's real `RoutePaths` decide — open `../familyplanner-app/lib/core/routing/route_names.dart`
     and cover EVERY `/contacts…` path that is there, exactly as spelled; put none in `help/routes-allowlist.json`
     (a route that an article covers must not be in the allow-list).

3. **Translations:** every article in all `HELP_LOCALES` (25; `site.config.mjs` ~:1391) by the rules in
   `claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md` (front matter of a translation: only `id, title, summary,
   keywords, translatedFrom`; ≤ ×1.4 length; character caps for ja / ko / zh / th). The screen words in each
   language come from the app's ARB files (`../familyplanner-app/lib/l10n/app_<tag>.arb`, keys `contacts…`) so help
   and app say the same — German type words are the short ones (Arzt, Zahnarzt, Tierarzt, Handwerker).

## 2. Privacy (`legal/privacy.<lang>.html`, 27 files, + `legal/datenschutz.de.html` = 28)

Today (`privacy.en.html`, read 2026-11-26 — re-check the lines): section 4 "Data the app processes" has a paragraph
`<p><strong>Contacts (optional).</strong> …` (~:54, no id) that covers ONLY the birthday import from the address
book. Check each fact below in the code (api + app repos) BEFORE writing; a fact you cannot confirm is not written
and goes under "Facts I could not confirm".

1. Keep that paragraph true and give it the id `contacts-birthday-import` (same text; only if the birthday import
   really still works as it says).
2. Add right after it a new paragraph `<p id="contacts-you-save"><strong>Contacts you save (optional).</strong> …</p>`
   — short, plain, these facts:
   - What: the contacts you add to your family's Contacts — name, company or place, type, phone numbers, e-mail
     addresses, address, birthday, note, picture, and for which family members it is.
   - Who sees it: the members of your family; a contact marked "Only me" only you.
   - From your phone: Daili uses the phone's own contact picker; it gets only the people you pick and never reads
     or uploads your address book for this.
   - What Daili does NOT do: it never contacts these people, never uses the data for advertising, never matches
     them with Daili accounts, never shows them on wall screens, in connected AI apps or in calendar feeds.
   - Where / how long: stored on our server (same place as the rest of the family content — use the wording of the
     "Where your data lives" section, do not restate a provider differently); in your data export; deleted when you
     delete the contact, and with the family or the account (the 30-day rule the text already describes).
   - A one-clause pointer for third persons: someone whose number a family saved can write to the contact address
     the policy already names.
3. Add "contacts" to the "Family content" list (~:26) if that list names the content kinds.
4. Write EN and DE yourself (German is the authoritative version and uses "du"); translate the other 26 with
   sub-agents, same structure and ids. Bump the "Last updated" line — text AND `datetime` — in every file to today.
5. `tools/check-legal.mjs`: a new `CONTACTS_MUST_CONTAIN` block (`id="contacts-you-save"`) + its `*_WHY` line
   naming this prompt, like the blocks at ~:185–201, so a locale without it fails the build.

## Constraints

- 🔴 Nothing here becomes visible in the Help center before the release: every new article `since: 99.0.0`; do NOT
  touch `LIVE_APP_VERSION`. The privacy text IS visible after the next deploy — that is wanted.
- 🔴 No promise the code does not keep. No "encrypted end-to-end" (Contacts is not), no accuracy or legal claims.
- No store-listing, blog or marketing page change. No app or api file change.
- `npm run build` AND `npm run check:help` green, FOREGROUND.
- In the report, never put the word "status" and the word "blocked" on one line unless you really are blocked.

## Commit & push

- `docs(help,legal): Contacts — hidden help topic (25 languages) + privacy part "Contacts you save" (28) (#385)`;
  body + `Prompt: claude-prompts/2026-11-26/003-contacts-help-privacy.md`.
- **Push now.** Do NOT run `./deploy.sh` (Ammar's step).

## Report

- `claude-reports/2026-11-26/003-contacts-help-privacy.md` (file-write tool, `wc -c` > 0): the article ids + routes
  each covers; the privacy facts with the code file that proves each; "Facts I could not confirm"; the build output
  lines of `check-help` and `check-legal`; the push result.
- `## Open items for the owner`: `./deploy.sh` (privacy text goes live; help stays hidden) · at the 1.19.0 release
  help sync: `since: 1.19.0` + pictures for the three articles · the two store privacy forms get "Contacts"
  (App Store privacy label, Play Data safety) at the 1.19.0 release.
- `## Help impact`: new topic `contacts` (3 articles, hidden).
