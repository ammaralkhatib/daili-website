# Help sync 1.7.0 (part 5): account, invite, repeating edit, You step, AI consent

## Goal
Everything the app and api reports flagged under `## Help impact` since the
last sync (2026-09-27 lanes + app 2026-09-28/016), in English and every
`HELP_LOCALES` language, plus the re-shot pictures. After this the help is
true for release 1.7.0 (12). Run AFTER app `2026-09-28/016` is pushed and
AFTER Ammar ran the picture commands (see "Pictures").

## Scope
- In: the articles below under every `help/<code>/`, their pictures (already
  produced by the app harness), `npm run build`.
- Out: `site.config.mjs` (no `LIVE_APP_VERSION` bump), the home page / Design
  B files, legal pages, `routes-allowlist.json` (unless the build asks for a
  route).

## Updates (English facts — write them in each article's own voice, 1–3
sentences each; set `updated: 2026-09-28`; `since` stays)

1. **`account-verify-email`**: the link now stays valid for 3 days; an expired
   link's page offers a fresh one. After **Resend** the button waits a minute.
   If the mail could not be delivered, daili says so and lets you change the
   address right there (also Settings → your email). After two resends or a
   bounce, **Didn't get the email?** asks us for personal help (answer within
   a day). A verified address shows a small **Verified** mark. On iPhone,
   **Sign in with Apple** needs no confirmation email at all.
2. **`account-delete`**: Delete account is now a full page. You can pick a
   reason (optional). No password any more — you type the word shown (the
   word "delete" in your language). "I want to start over" shows a tip:
   create a new family or group instead. Within the 30 days, signing in offers
   **Restore my account**.
3. **`family-invite`**: your current code shows under **Invite member** (not
   as a pending invite); **Get a new code** on the Invite members screen
   replaces the old one; each code works for one person; you can share the
   code or link even before your email is verified.
4. **`start-join`**: the join screen says why a code no longer works —
   already used, expired or cancelled — and to ask for a new one.
5. **`calendar-repeating`** + **`calendar-edit-delete`**: replace the "daili
   asks what it should apply to" flow: make your changes first, tap **Save**,
   then choose **This event only**, **This and following events** or **All
   events**. Options that can't hold your change are greyed with a short
   reason (a new time can't go to **All events**; repeat, all-day, private or
   2+ reminders can't be **This event only**). For **delete**, read the app
   code (`../familyplanner-app/lib/features/calendar/`) and describe what it
   does now — do not assume. Rewrite the Note on line ~27 of
   `calendar-repeating` to match.
6. **`start-create-family`** (and one sentence in **`start-sign-in`**): new
   accounts first see a **You** step — pick your picture and check your name
   (you can skip it); then create or join. Add the new picture
   `start-you-step` to `start-create-family` (second picture, after the
   existing one; own-language pictures as usual).
7. **AI consent** — one sentence each in **`calendar-photo`**,
   **`meals-photo`**, **`meals-youtube`**, **`meals-suggest`**: "The first
   time, daili asks whether it may use Google's AI (Gemini) to read it. You
   can switch this off in Settings → AI features." And in
   **`account-preferences`** (or the account article that lists Settings rows
   — pick the one that fits): the **AI features (Google Gemini)** switch and
   what it covers. Use the exact Settings label from app 016's English ARB.

## Pictures
Ammar runs these in his Mac terminal (FLUTTER repo) BEFORE this prompt; the
harness writes the pictures into this repo:
`tool/help-shots.sh --only start-you-step,account-verify-email,account-delete,family-invite,start-join,calendar-repeating,calendar-edit-delete`
then the same with `--all-locales`. Check that every locale now has
`start-you-step` and that the other six changed; list any missing picture in
the report (do not fail the prompt for it; `help/media-gaps.json` rules apply).
Commit the new/changed pictures under `static/help/media/` in this prompt's commit
(only the seven ids above — leave any other uncommitted file alone, e.g.
`changelog/whats-new.*.html`, which the release prompt commits).

## Constraints
- Translate every changed article into all `HELP_LOCALES` following
  `claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md`; use the app's own
  labels per language (read the app's ARB files in
  `../familyplanner-app/lib/l10n/` in place, do not copy them here).
- `npm run build` green, `node tools/check-help.mjs` green.
- Front matter otherwise unchanged; no reordering.

## Verify
- Build; spot-check `de` `calendar-repeating` and `en` `account-delete`,
  `start-create-family` shows two pictures.

## Commit & push
- `docs(help): 1.7.0 part 5 — account, invites, repeating edit, You step, AI consent`;
  body includes `Prompt: claude-prompts/2026-09-28/002-help-sync-1-7-0-part-5.md`.
  Push (Ammar deploys).

## Report
- `claude-reports/2026-09-28/002-help-sync-1-7-0-part-5.md`, half a page:
  articles × locales touched, pictures found/missing, build lines, SHA + push.
