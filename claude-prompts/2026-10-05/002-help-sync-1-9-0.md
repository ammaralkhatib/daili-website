# Help sync 1.9.0: Notes (pictures, voice, drawing, new screens), Daili Plus, app colour, account fixes

## Goal
Make the Help center true for release 1.9.0 (15), in English and every
`HELP_LOCALES` language, with the new pictures. Run this AFTER the app prompt
`familyplanner-app/claude-prompts/2026-10-05/004-prerelease-strings-and-help-shots.md` and the all-locales picture
run (the runner script does both first).

**Do not deploy.** Ammar deploys on store day together with the
`LIVE_APP_VERSION` 1.9.0 bump.

## Sources (read in place)
The `## Help impact` section of each report is the full fact list; the list
under "Articles" is the map. When a report says more, follow the report.
- `../familyplanner-app/claude-reports/2026-09-30/008`–`010`,
  `2026-10-01/002`–`012`, `2026-10-02/001`–`015`, `2026-10-04/002`–`012`,
  `2026-10-05/001`, `2026-10-05/004` (picture ids)
- `~/Herd/familyplanner-api/claude-reports/2026-10-01/004`–`005`
Labels come from the app's ARB files (`../familyplanner-app/lib/l10n/`).
Check behaviour in the app code when a report is unclear. Do not guess.
The app's `CHANGELOG.md` `[Unreleased]` is a good one-line summary of each change.

## Scope
- In: articles under every `help/<code>/` named below, `help/<code>/_ui.json`
  only if a new article needs a UI string, `help/media*.json`, pictures under
  `static/help/media/` for the ids in "Pictures", `help/routes-allowlist.json`,
  `npm run build`.
- Out: `site.config.mjs` (no `LIVE_APP_VERSION` bump), legal pages, home page,
  blog, `changelog/whats-new.*.html`. Untracked files that are not yours
  (`claude-reports/2026-10-01/`, `static/assets/img/blog/…`,
  `static/assets/img/photos/`): leave them untracked.

## Articles (English facts; each article's own voice; short sentences)

1. **`notes-notes`** (update, `updated: <today>`, `since` stays, `media:
   notes-list`). Rewrite to match the new screens:
   - Start a note with **+** (on the bottom bar) or one of the bar's buttons:
     Picture, Voice (starts recording at once), Video, Link.
   - A note has a **Title** line and the text below. A title alone is a note.
     Copy and Send start with the title.
   - Bullet lists and checklists (tap a box to tick it). Replace the old "No
     folders, no formatting" line: still no folders.
   - The note row above the keyboard: pin, tags, reminder, who can see it, and
     ⋯ for more. Closing an unsaved note asks first.
   - The list: lighter cards (title, date, first attachment or one line, tag
     colour dots, reminder, small icons for what a note holds). Search + one
     **Filter** button (Type · Tags · Pinned only); active filters show as chips
     you can clear; while you search, Type and Tag chips also show under the
     field; "+ New tag" in the Filter sheet. The top part hides while you scroll.
   - Link / Video sheet: **Paste link** and **Scan link** (photo of a web
     address). Links show their title right away; `https://` is optional.
   - **Recently deleted**: deleted notes wait 30 days; Undo or restore.
   - **Reminder** on a note: only you get it.
   - **Daili Plus in a note** (`notes-ai` picture): Make from this note (events,
     to-dos, shopping items → review screen) and Summarize (a video, web page
     or long note). Each uses one AI action; link to `account-plus`.
   Pictures in the text: `notes-new`, `notes-filter`, `notes-trash`, `notes-ai`
   (keep `notes-tile` if it still fits).
2. **`notes-pictures-voice`** (NEW, `help/<code>/notes/pictures-voice.md`,
   `since: 1.9.0`, `media: notes-pictures`, related `notes-notes`,
   `account-plus`, `vault-where`). Facts:
   - Pictures: camera, photo library, paste, or **Share → daili** from any app
     (up to 10 pictures). A note can be only pictures or a recording.
     Attachments show in the order you added them; tap to open.
   - **Draw**: Photo → Draw, or the pencil in the bar. Six colours, three
     widths, eraser, undo/redo; saved as a picture. **Edit drawing** works on
     the phone it was made on (a cloud drawing needs a connection).
   - **Text in pictures**: daili reads it on your phone ("Text" in the picture
     viewer, **Add to note**); search finds it on that phone.
   - **Voice**: the voice sheet records a file (one button: mic → stop; tap
     outside to leave before recording), up to 10 minutes. The mic next to the
     list buttons types what you say, using **your phone's speech recognition**
     (never write "only on your phone").
   - **Where files live** (Settings → Notes → the app's label for "Pictures and
     recordings"): **On this phone** (free, default; other devices show a small
     "on X's phone" chip; Android backs up only 25 MB of app data, so not every
     picture may be in the phone backup) or **Daili cloud** (Daili Plus; 5 GB
     per family; the family sees the files on every device). Sharing a note
     whose files are on the phone asks: share text only, or move the pictures
     to the cloud. A waiting upload shows a cloud badge; tap to try again.
   Pictures: `notes-pictures`, `notes-voice`, `notes-draw`.
3. **`account-plus`** (NEW, `help/<code>/account/plus.md`, `since: 1.9.0`,
   `media: plus-sheet`). Facts: what Daili Plus is (AI helpers + Daili cloud);
   every family gets **3 AI actions a month free**, Plus gives **30, shared by
   the whole family** (not per person), counted per calendar month; 5 GB Daili
   cloud; yearly price shown in the store currency, no trial; buy in Settings →
   Daili Plus or when the month's free actions are used up; Plus belongs to the
   family open when you buy; one subscription per store account; **Restore
   purchases**; Settings shows "Active", "Bought by a family member" and how many
   AI actions are left; cancel in App Store / Google Play subscriptions —
   deleting the app or the account does NOT cancel; when Plus ends nothing is
   deleted, cloud files stay readable, new cloud files wait until Plus is on
   again. **Founder** families: Plus free (fair use 50 a month), "Founder" chip.
   Link the Terms (`/terms.html#plus`).
4. **AI articles** `calendar-photo`, `meals-photo`, `meals-youtube`,
   `meals-suggest`: add one sentence — every family gets 3 AI actions a month
   free; Daili Plus gives 30 (link `account-plus`).
5. **App colour** — `account-profile` (+ picture `account-profile`): "Use my
   color for the app" under the colour dots; tapping a colour previews it on
   the whole app, Save keeps it, leaving undoes it. `account-preferences` (or
   the article describing Appearance; say which): Appearance → **App colour**
   (daili green / My colour); it tints buttons, links, cards and a faint
   background; it changes only this phone (picture `account-app-colour`).
6. **`account-delete`**: the page shows the name and email of the account you
   are deleting.
7. **`family-groups`** (or the article about switching families): after you
   sign out and back in, the app opens the family you last used on this phone.
8. **`anywhere-watch`**: Siri on the watch — "Add to my Daili list" adds a
   shopping item, "New note in Daili" saves a note.
9. **Turkish**: the help says "etkinlik listesi" where the app says "Etkinlik
   akışı" (activity feed) — use the app's word everywhere in `help/tr/`.
10. Check, fix only if wrong: `lists-*` articles already describe the add-bar
    lock on the RIGHT with an open/closed lock (app report 2026-09-30/005).

Routes: give the new articles the app routes they cover (read
`../familyplanner-app/lib/core/routing/route_names.dart`), and empty
`routes-allowlist.json` → `pending` of every Notes route the legal prompt
(2026-10-05/001) parked there.

## Pictures
Made before this prompt by the harness, written into this repo, en + all
locales: `notes-list, notes-new, notes-filter, notes-pictures, notes-voice,
notes-draw, notes-trash, notes-ai, plus-sheet, account-app-colour,
account-profile`. Add the new ids to `help/media*.json` with alt text that
matches the picture. Commit every changed or new picture for those ids. List
missing ones in the report (`help/media-gaps.json` rules apply; do not fail).

## Constraints
- Translate every new/changed article into all `HELP_LOCALES` following
  `claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md`, with the app's own
  labels per language (pt = Brazilian "você", fr "tu", id "Anda", nb "KI").
- Brand rule: bare "daili" only where the help already writes it that way;
  inside running sentences follow the existing articles.
- `npm run build` green, `node tools/check-help.mjs` green. Front matter
  otherwise unchanged. No reordering of existing articles.

## Verify
Build. Spot-check `en` `notes-pictures-voice`, `de` `account-plus`, `ja`
`notes-notes`, and that `tr` has no "etkinlik listesi" left.

## Commit & push
`docs(help): 1.9.0 — notes pictures/voice/drawing, Daili Plus, app colour`; body
`Prompt: claude-prompts/2026-10-05/002-help-sync-1-9-0.md`.
**Push. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-10-05/002-help-sync-1-9-0.md`, half a page: articles ×
locales, pictures found/missing, routes, build lines, SHA + push, reminder:
deploy on store day with `LIVE_APP_VERSION` 1.9.0. `## Help impact`: n/a.
