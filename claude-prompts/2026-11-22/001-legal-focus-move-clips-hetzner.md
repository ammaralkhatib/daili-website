# Privacy policy: Focus and Move videos and music load from our Hetzner storage

## Why
List item one-hundred-forty-four. The app's `[Unreleased]` section ships two new features, Focus
(focus timer with buddy clips) and Move (home workouts with the sloth, demo videos and music).
Both load their files from our public storage bucket at Hetzner. Today the privacy policy names
Hetzner only for note files in Daili cloud and for server backups (`legal/privacy.en.html`
:38, :94, :137, :141). The policy must say this before the release that carries Focus and Move.

As in `2026-11-20/001`, **you write the sentences** — in the style, tone and section structure
of the existing `legal/privacy.en.html` and `legal/datenschutz.de.html` (German is
authoritative, "du") — **after checking every fact below against the code** in
`../familyplanner-app` (and `../daili-web`, `~/Herd/familyplanner-api` where named). A fact the
code does not confirm → do NOT write it; list it under "Facts I could not confirm" in the report.
Planning Claude reviews English + German before Ammar deploys.

## The facts to check, then cover
Planning Claude read these on 2026-11-22 (read-only); check each one:
1. **Where the files come from.** `lib/features/focus/data/focus_clips_client.dart:16-19` and
   `lib/features/workout/data/move_clips_client.dart:16-19`: base
   `https://daili-buddy-clips.fsn1.your-objectstorage.com/`, list files `manifest.json` (Focus)
   and `workout.json` (Move). `fsn1` = Hetzner, Falkenstein, Germany.
2. **What the request holds.** Check both clients (and the HTTP client they use): no sign-in
   token, no account or family id, no user-made text in the URL or headers. Move uses its own
   client without the sign-in token (app commit `02db0e72` — check it). Say in the report exactly
   which headers are sent. Like any web request, the phone's IP address reaches Hetzner.
3. **What stays on the phone.** Check whether the clips, the music and the list files are kept
   (cached) on the phone, and whether Move's progress / week goal is stored on the phone only
   (the CHANGELOG line says "Everything stays on your phone" — confirm in code, do not copy it
   blindly).
4. **Web / wall screen.** Grep `../daili-web/src` for `daili-buddy-clips` /
   `your-objectstorage`. If the web app or the wall screen also loads these files, say so in the
   same sentence; if not, the text speaks of the app only.
5. **When.** Files load only when the person opens Focus or Move (or picks a buddy / an
   exercise) — check whether anything loads earlier (e.g. at app start or in the background) and
   write what is true.

## Where the text goes
- A short new paragraph `id="focus-move-media"` in the part of the page that describes app
  features (near `#notes-files` is fine), with a bold lead like the others
  (**Focus and Move videos and music.**). Content: the files come from our storage at Hetzner
  Online GmbH in Germany; the request holds no account data (only what fact 2 confirms); Hetzner
  sees the phone's IP address as with any download; what stays on the phone (fact 3); legal
  basis: performance of the contract with you (Art. 6(1)(b) GDPR), as the neighbouring
  paragraphs do.
- The service-providers list item (EN :94): Hetzner "stores note files in Daili cloud and server
  backups" → also the videos and music of Focus and Move.
- The where-data-is-processed paragraph (EN :137): same addition in one short phrase.
- Do NOT change the backup paragraph (:141).

## Requirements
1. `legal/privacy.en.html`, `legal/datenschutz.de.html`, and the same three changes in every
   other `legal/privacy.*.html` (28 locales). Set each page's "last updated" date (text and
   `datetime`) to the day of this run.
2. You write English and German yourself. The other 26 locales: translate from the English
   (sub-agents allowed, each MUST use model claude-opus-5-5; wait for all of them before the
   commit). Check every file on disk: same diff shape, the new date, complete `<p>…</p>`.
3. Guard `tools/check-legal.mjs`: add `id="focus-move-media"` to the newest MUST_CONTAIN block
   (or a new block with its WHY line, the same way as the 1.16.2 block), so a locale without it
   fails the build.
4. Only `legal/**` and `tools/check-legal.mjs` change. Terms pages: no change.
5. 🔴 Report trap: the run script stops when any line of the report contains the word "status"
   and the word "blocked" together. Use the word "blocked" ONLY if you really are blocked.

## Build
`npm run build` passes (`legal OK · … 28 locale(s)`). Check that the guard would fail without the
new id (on a COPY in a temp folder, or by reading the code) — do not commit a broken file.

## Commit & push
`docs(legal): Focus and Move videos and music load from our Hetzner storage`; body
`Prompt: claude-prompts/2026-11-22/001-legal-focus-move-clips-hetzner.md`. 🔴 Do NOT stage
`static/assets/img/photos/`. **Push now. Do NOT run `./deploy.sh`** — Ammar deploys after
Planning Claude's review.

## Report
`claude-reports/2026-11-22/001-legal-focus-move-clips-hetzner.md` (file-write tool; `wc -c` > 0),
short: each fact with the code line that proves it (and the headers sent), the new EN + DE
sentences in full (quote blocks), facts not confirmed, locales done, build result, SHA + push.
`## Help impact`: none.
