# Help sync 1.7.0 (part 2): update existing articles + relabel table

## Goal
Everything the app reports since 2026-09-24 flagged under `## Help impact`
for EXISTING articles, in English and every `HELP_LOCALES` language. Each
item below names the article id and the fact; write it in the article's
own voice, one to three sentences, no new pictures (existing picture ids
stay). Set `updated: 2026-09-26` on every touched article; `since` stays.

## Scope
- In: the articles listed below under every `help/<code>/`, `npm run build`.
- Out: new articles (prompt 002), `site.config.mjs`, pictures, the
  allowlist.

## Updates

1. **`start-home`** (Home tour): the tile list gains **Notes** (after
   To-dos; shows "N shared with you" or "Quick thoughts"). The week card at
   the top no longer rotates — it shows the **next** event; tap it to see the
   whole week. New accounts get a **Get started** card (invite someone, add
   an event, turn on notifications, …) that ticks itself; **Hide this list**
   removes it for good.
2. **`start-edit-home`**: Notes is a tile like the others — hide-able and
   movable.
3. **`family-activity`**: new row **Note shared** when someone shares a
   note with the whole family — feed only, no notification.
4. **`anywhere-widgets`**: new **Quick note** widget (small, iPhone +
   Android): opens a new note in one tap and shows how many notes you wrote
   this week; on iPhone you can also add a **New note** button to the lock
   screen (Customize lock screen → add widget → daili). Link to article
   `notes`.
5. **`meals-search-online`**: needs a verified email — if it isn't, the
   screen says so and has a **Resend** button.
6. **`vault-where`**: replace the backup paragraph with the app's own
   wording — iPhone: documents and photos stay on the phone, daili never
   uploads them; they are part of the iPhone's iCloud Backup and come back
   on a new iPhone set up from that backup (if iCloud has space). Android:
   documents are part of the phone's Google backup (Android keeps up to
   25 MB for daili) and come back on a new phone from that backup; photos
   are NOT in the Google backup — they only move with a direct
   phone-to-phone transfer (cable / Wi-Fi).
7. **`calendar-add-event`**: one sentence + link: "Have the dates on paper?
   See *Fill an event from a photo*" (`calendar-photo`).
8. **`meals-import-link`** / **`meals-youtube`**: no change (done in 001).
9. **Relabel table**: the app renamed some labels on 2026-09-25. Apply
   `../familyplanner-app/claude-reports/2026-09-25/001-label-changes.json`
   (sibling repo, 235 rows: locale, key, old → new; read it in place, do
   not copy it here). For each row, find the OLD label in that locale's help articles
   (bold labels like `**Tagebuch**` and plain mentions) and replace it with
   the NEW one; touch only the locale of the row. Report how many
   replacements per locale, and list rows whose old label was not found
   (that is fine — many keys never appear in help).

## Constraints
- `npm run build` green, `node tools/check-help.mjs` green.
- Keep every article's front matter otherwise unchanged; do not reorder.

## Verify
- Build; spot-check `de` `calendar-views` shows "Liste", `start-home` in
  `en` mentions Notes.

## Commit & push
- `docs(help): 1.7.0 part 2 — Notes touchpoints, backup wording, relabels`;
  body includes `Prompt: claude-prompts/2026-09-26/003-help-updates-1-7-0.md`.
  Push (Ammar deploys).

## Report
- `claude-reports/2026-09-26/003-help-updates-1-7-0.md`, half a page +
  the per-locale replacement counts.
