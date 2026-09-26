# Help sync 1.7.0 (part 1): new articles — Notes, Fill an event from a photo, Tips on/off

## Goal
Build 12 (version 1.7.0) adds three things the help center does not cover
yet: **Quick Notes** (a new topic), **Fill an event from a photo** (calendar)
and the **tips sheet** (turn tips on/off). Write the three articles in
English and in every `HELP_LOCALES` language, with tips-sheet front matter,
and take `/notes` + `/notes/new` out of `routes-allowlist.json` `pending`.
Pictures are shot by Ammar with the app's `tool/help-shots.sh` (ids
`notes-list`, `notes-new`, `notes-tile`, `calendar-photo`) and sit in
`static/help/media/<code>/` with `help/media*.json` updated; this prompt
only writes text. If a picture is missing, reference it anyway — the build
lists it in `media-gaps.json`.

## Scope
- In: `help/en/_ui.json` (new topic), `help/en/notes/notes.md` (new),
  `help/en/calendar/photo.md` (new), `help/en/account/tips.md` (new), the
  same under every other `help/<code>/`, `_ui.json` topic line in every
  locale, `help/routes-allowlist.json`, `npm run build` output.
- Out: `site.config.mjs` (`LIVE_APP_VERSION` stays 1.6.0 — the release
  prompt bumps it), every existing article (part 2 = prompt 003), pictures.

## Requirements

1. **New topic `notes`** in `_ui.json` → `topics`, between `meals` and
   `birthdays`: `title: Notes`, `summary: Save a thought or a link in two
   taps, from anywhere — private by default.` Translate the line in every
   locale's `_ui.json`. If topic order comes from somewhere else (a list in
   `tools/help-lib.mjs` or the templates), put `notes` there too.

2. **Article `help/en/notes/notes.md`** — the app's "?" on the Notes screen
   opens article id **`notes`** (exactly, no topic prefix — keep it), so:
   `id: notes`, `topic: notes`, `title: Notes: save thoughts and links in
   two taps`, `summary: Write a note or share a link from any app. Notes
   are private unless you share them.`, `keywords: note, notes, quick note,
   link, save link, share, youtube, tag, pin, search, action button,
   widget, lock screen, offline`, `routes: /notes, /notes/new`,
   `tryIt: /notes`, `since: 1.7.0`, `updated: 2026-09-26`,
   `media: notes-list`, `order: 1`, `related: anywhere-widgets,
   start-edit-home, family-activity`, tip: `tipTitle: Share any link to
   daili to keep it`, `tipBody: Share a video, post or page from any app to
   daili and it becomes a note — private unless you share it.`,
   `tipPriority: 45`, no `tipSkipIf` (there is no notes skip key yet).
   Body, in this order, short paragraphs and numbered steps like the other
   articles:
   - Intro: what a note is — a short text and/or one link; a link gets a
     preview (title, picture, site) after a moment. Not a big notes app:
     no folders, no formatting.
   - **Write a note** — Home → **Notes** tile (or Quick add **+** → **Note**)
     → write → **Save**. The first line is the title. Picture `notes-new`.
   - **Save from other apps** — in any app (YouTube, Facebook, a browser)
     tap Share → **daili** → **Save**. Only you see it unless you change
     that in the sheet. Photos and files are not supported yet.
   - **Even faster** — the **Quick note** widget on the home screen
     (iPhone + Android; iPhone also a lock-screen button — see the widgets
     article); iPhone 15 Pro or newer: Settings → Action Button → Shortcut
     → **New daili note**, or "Hey Siri, new note in daili"; Android: pull
     down Quick Settings → pencil → drag **New note** into your tiles.
   - **Who can see a note** — Only me (default) · Whole family · Pick
     members (single people; kids without a login can't be picked). A note
     shared with the whole family shows once in the activity feed ("Note
     shared"); nobody gets a notification. Notes belong to you, not the
     family: a private note follows you into every group you are in.
   - **Find it again** — search (text, link title), tags (yours only, up to
     30, tap a chip to filter), pin to top. Tabs **Mine** and **Shared with
     me**. Picture `notes-list`.
   - **No internet?** — writing or sharing a note still works; it waits on
     the phone ("Waiting for network") and is sent by itself later. Changing
     a saved note needs the internet.
   - Note box: deleting a note is final (no trash).

3. **Article `help/en/calendar/photo.md`** — `id: calendar-photo`,
   `topic: calendar`, `title: Fill an event from a photo`, `summary: Snap a
   school letter, invitation or flyer — daili picks out the dates for you.`,
   `keywords: photo, scan, letter, invitation, flyer, dates, ai, camera,
   school, read photo`, `routes: /calendar/new`, `tryIt: /calendar/new`,
   `since: 1.7.0`, `updated: 2026-09-26`, `media: calendar-photo`,
   `order: 2` (right after add-event; shift later `order`s in the calendar
   topic if they collide), `related: calendar-add-event,
   calendar-edit-delete, meals-youtube`, tip: `tipTitle: Turn a school
   letter into events`, `tipBody: Tap the scan icon in New event, photograph
   the letter, and daili fills in the dates.`, `tipPriority: 48`, no
   `tipSkipIf`. Body:
   - Intro + picture: New event → the **scan icon** at the top right.
   - Steps: 1. Calendar → **+** (New event) → scan icon. 2. **Take photo** or
     **Choose from library**. 3. A library photo is shown first — check the
     dates are readable, then **Read this photo** (or **Choose another**).
     4. A few seconds later: **one** date found → the form is filled, check
     it and tap Save; **several** → "We found N events": untick what you
     don't need, tap a date or time to change it, then **Add N events**.
     Dates that already passed start unticked.
   - Works best with printed text (letters, flyers, invitations). Handwriting
     is hit-and-miss. PDFs are not supported yet — photograph the page.
   - Privacy box: the photo is sent to Google's AI to be read and is deleted
     right away; daili never stores it and strips the camera data (like
     location) before sending.
   - Note box: every family gets a few free photo reads each month (shared
     with video reads). Daili Plus has more — and if your family joined
     early, reads are free for life.

4. **Article `help/en/account/tips.md`** — `id: account-tips`,
   `topic: account`, `title: Tips: turn them on or off`, `summary: daili
   shows a short tip now and then about something you haven't tried.
   Here's how to stop or restart them.`, `keywords: tips, tip, turn off
   tips, hints, help`, `routes: /settings/help` (check the real route of
   Settings → Help in the app's `route_names.dart` mirror in this repo's
   allowlist; use the one the allowlist knows), `since: 1.7.0`,
   `updated: 2026-09-26`, no media, `order` last in `account`, no tip
   (a tip about tips is silly). Body: what a tip is (a card at the bottom,
   at most every 3 days, only about things you haven't used), **Turn off
   tips** inside the card, or Settings → **Help** → **Show tips**; turning
   them back on the same way; the Help screen has every guide anyway.

5. **Translations**: every locale gets all three articles + the topic
   line, same rules as prompt 001 (natural, short, the app's own labels in
   that language — take labels from the app ARB snapshot this repo uses for
   help, not literal translations of the English label).

6. **Allowlist**: remove `/notes` and `/notes/new` from `pending` (the
   `notes` article now lists them in `routes`). `tools/check-help.mjs` must
   pass.

## Constraints
- `npm run build` green, `node tools/check-help.mjs` green, no new
  `media-gaps` beyond the four picture ids named above.
- Don't touch `LIVE_APP_VERSION`; the `since: 1.7.0` gate hides all three
  pages until the release bumps it.

## Verify
- `npm run build && node tools/check-help.mjs`; open `dist/help/en/notes/`
  with a temporary `LIVE_APP_VERSION=1.7.0` build if that is how prompt 001
  verified it, then rebuild normally.

## Commit & push
- `feat(help): Notes topic, Fill from a photo, Tips on/off — 1.7.0 part 1`;
  body includes `Prompt: claude-prompts/2026-09-26/002-help-new-articles-1-7-0.md`.
  Push (Ammar deploys).

## Report
- `claude-reports/2026-09-26/002-help-new-articles-1-7-0.md`, half a page,
  with the list of picture ids still missing per `media-gaps.json`.
