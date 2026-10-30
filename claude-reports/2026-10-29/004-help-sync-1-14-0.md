# 004 — Help sync 1.14.0

**Status: done.** Commit `2c72634`, pushed to `origin/main`. **Not deployed** (no `./deploy.sh`). `LIVE_APP_VERSION` is still 1.13.0.
Step 0: the planning docs went first as `7fefcac` (prompts 004 + 005 and report 003).

## Articles

**New:** `lists-archive-templates` (`since: 1.14.0`, order 10). It covers archive from the card ⋯ or the list's ⋯, Undo, **Archived · N**, read-only, Restore/Delete, **Save as template**, **Start from a template**, ⋯ → **Templates**, and private templates. Routes `/lists/archived`, `/lists/templates`. It is linked from `lists-edit-list` and `lists-shopping` (`related` only, no text change).

**Updated** (`updated: 2026-10-30`, `since` unchanged):
- `calendar-views`: People + Year views, keys P/Y, Week numbers.
- `calendar-phone-calendars`: Belongs to, "already linked", Disconnect for Google.
- `anywhere-wall`: the app path, admins only. Its `routes:` now lists the 4 `/settings/wall-display*` routes, and the `pending` list in `routes-allowlist.json` is empty.
- `start-sign-in`: the new order, the bottom bar, new phones open Create account.
- `start-edit-home` + `cycle-start`: the faded Cycle tile, and Settings → Home screen → Cycle.
- `habits-create`: Some days, Repeat every 2–8 weeks, First/Next time.
- `family-activity`: **Clear**, 90 days, archive/restore wording.
- `vault-documents` + `vault-photos`: ⋮ → Edit/Delete, **Show in**, the family tag, the privacy line.
- `account-preferences`: push language per phone, emails in the last-picked language.
- `account-download-data`: **Send link**.

**Also changed, not in the prompt:** `calendar-import`. Its body picture was the shared `calendar-other-calendars`, which is now re-shot as the Edit calendar sheet. I removed that image line in all 25 locales, because the picture no longer fits import.

**Left alone:**
- `vault-where`: still true (Show in only changes which family shows a folder; it is still only on the phone, only you).
- `anywhere-wall-tick`: it does not describe the app path.
- No in-article version gate exists (1.13.0 did not use one), so the new text is simply written in.

**Facts left out to stay under 150 words:**
- the "W 44" in the Week/3-day/Day headers;
- "daili remembers your view", and the Filter-only-shows-up note;
- Belongs-to details: Google needs **Share with family** first, the "For Mia, Leo" line in the list;
- the counter hint in habits;
- "Not sure — Daili learns it" in Cycle;
- "the tablet needs no password" on the wall.

## Labels checked
New and changed labels are `{{arbKey}}` placeholders, filled from each `app_<lang>.arb` by a script (`/tmp/help114/fill.mjs`). Nothing was typed by hand.

A fresh Opus fact-check of the English against the app code found:
- Google's ⋮ says **Disconnect**, not Remove;
- Connect a screen is admin-only;
- a new phone lands on Create account, so the bar step had to come before Sign in;
- "holidays" in Year means the family's own events (now "school holidays"), not public holidays;
- the Cycle switch sits on the **Cycle** row.

All of these are fixed. No label mismatched a report. Report 001 listed 3 wall routes; the app has 4 (`…/connect/scan` too).

## Locales
All 24 `HELP_LOCALES`, done by 6 Opus translators (4 locales each), plus one round of English clarity fixes sent back to them. All finished before the commit. I re-filled all 325 files myself.

## Missing pictures
None. All 25 locales have the 5 new and 7 re-shot pictures.

## Build
- `npm run build` is green: 97 articles per locale, help search OK, 80 app routes checked.
- I read the built en + de `calendar/views` and `anywhere/wall` pages: text, 3 pictures and related links all render.
- The new lists article has no page while live = 1.13.0. It is in `dist/help/en.json` and `de.json` with both pictures and related links.

## Open items for Ammar
- **Tip picture:** the `calendar-phone-calendars` tip ("See your phone's calendars") now shows the re-shot Edit calendar picture. A better-fitting picture would need a new shot.
- **Korean, Indonesian and Thai ARB:** Wall display and Wall screens have the same name there, so the remove path reads "X → X → Remove".
- **Pictures by locale:** the habits-create pictures show Thursday in English but Friday in nb/fi/fr/it (shot on another day). Each alt text matches its own picture.

## Help impact
This IS the help sync: `lists-archive-templates` (new), `calendar-views`, `calendar-phone-calendars`, `calendar-import`, `anywhere-wall`, `start-sign-in`, `start-edit-home`, `cycle-start`, `habits-create`, `family-activity`, `vault-documents`, `vault-photos`, `account-preferences`, `account-download-data`.
