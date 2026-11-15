# Privacy policy: Google two-way sync (the new Google permission `calendar.events`)

## Why
Daili can now — for the person who linked a Google calendar and switched it to "Two-way" —
add, change and delete events IN Google Calendar. This needs a new Google permission
(`https://www.googleapis.com/auth/calendar.events`). Google must approve that permission, and
Google's reviewers read our privacy policy first. Today the policy says the opposite ("read-only
access", "Daili never creates, changes or deletes anything in your Google Calendar"). So the
policy must be corrected and **deployed before Ammar submits the permission to Google**.

The feature is built and live on the server (api `2026-11-13/007`–`013`, app
`2026-11-13/001`–`003`) but switched on only for the operator's own account
(`calendar_two_way = allow:<id>`). It is opened for everyone after Google's approval. The text
must be TRUE TODAY for every user: write it as an optional feature that exists only "if you
switch a calendar to Two-way sync", and say once, plainly, that it is being rolled out and may
not be offered to you yet. Never write that Daili changes Google for everybody.

As in `2026-11-12/006`, **you write the sentences** — in the style, tone and section structure
of the existing `legal/privacy.en.html` and `legal/datenschutz.de.html` (German is authoritative,
"du") — **after checking every fact below against the code** in `~/Herd/familyplanner-api` and
`../familyplanner-app`. A fact the code does not confirm → do NOT write it; list it under "Facts
I could not confirm" in the report. Planning Claude reviews English + German before Ammar
deploys. Rule book for the feature: `claude-prompts/CALENDAR-SYNC-2-PLAN.md` in the api repo
(§13 + §14 win over older sections); wire sheet `claude-prompts/CALENDAR-SYNC-2-WIRE.md` there.

## Run rules (this repo has no CLAUDE.md — these replace it)
- First `git status`. Commit pending planning docs only (`claude-prompts/**`, `claude-reports/**`
  — this includes the new `claude-prompts/run-prompt.sh` and `run_watch.py`, commit them too)
  as `docs(plan): sync planning docs` and push. 🔴 Never stage `static/assets/img/photos/`. Any
  OTHER uncommitted source file → stop, report BLOCKED.
- Write to Ammar in plain, simple English (short sentences; explain a technical word once).
- Build in the FOREGROUND; if it fails, fix and retry at most twice, else commit nothing and
  report BLOCKED with the output.
- Never amend, force-push or rebase. Never run `./deploy.sh`.

## The facts to cover (where to check)

Section 5 "Google user data" (`#google-user-data`) — every sub-heading there stays; Google's
policy needs each of them (what we access / how we use it / what we store / with whom we share /
how we protect / how long we keep and how to delete / Limited Use):

1. **What we access.** The first connection is still read-only with the three permissions
   listed today (`GoogleOAuth::SCOPES`). NEW: only when you switch one of your calendars to
   "Two-way" (app: Choose calendars → Sync → Two-way; a sheet explains it first, then Google's
   own page asks) does Daili ask for ONE more permission, `calendar.events` — "view and edit
   events on all your calendars". Check: the write scope constant and `start?write=1` in the api
   OAuth code; a consent that comes back without it stays a normal read-only connection. Say
   honestly that Google grants this permission for all calendars of the account, and that Daili
   itself writes only to calendars you switched to Two-way (check `isWritableBy` /
   `ExternalEventWriteService`).
2. **Replace the sentence "Daili never creates, changes or deletes anything in your Google
   Calendar."** New truth, all to be confirmed in `ExternalEventWriteService`,
   `GoogleCalendarWriter`, the three write controllers and the guard tests of api `012`:
   - Without Two-way: unchanged, Daili only reads.
   - With Two-way: Daili creates, changes or deletes an event at Google ONLY when you yourself
     add, change or delete that event in Daili (app or — later — web app). Daili never changes
     your Google Calendar by itself. (Word it about the user's data, not "no code ever": an
     operator-only test command writes to the operator's own test calendar.)
   - Only the person who linked the calendar can do this. Other family members, a wall screen,
     TRMNL and connected AI apps can never change anything at Google.
   - What is sent to Google: the event's title, place, notes, start, end, all-day flag, time
     zone, for a new repeating event its repeat rule, and for a new event a technical event id
     that Daili makes up (check `GoogleCalendarWriter::INSERTABLE_FIELDS` / `PATCHABLE_FIELDS`;
     a change never sends the repeat rule). Nothing else (no guests, no Daili people, reminders
     or categories — those stay in Daili).
   - Who sees it: an event you save to a Two-way calendar lives in Google, so everyone you
     share that calendar with AT GOOGLE sees it there; in Daili it follows the calendar's
     "Only me" / shared setting. Deleting a linked event "in both" leaves a line in the family's
     activity list (check `ExternalEventWriteService`). One sentence under "With whom we share".
   - Events that have guests, invitations from others and special Google events stay view-only
     in Daili; Daili never sends invitation or update mails to anyone (`sendUpdates=none`).
   - Switching back to "View only", removing the calendar from Daili, disconnecting Google or
     deleting your Daili account deletes NOTHING in your Google Calendar.
3. **How we use it.** Add the new use (saving your own changes to Google at your request). The
   existing "not for advertising / not sold / no profiles / no AI training / never sent to the AI
   features" sentences stay word for word in meaning.
4. **What we store — new items.** Confirm each in the migrations / models of api
   `2026-11-13/003`–`011` (`external_events`, `calendar_subscriptions`, `connected_accounts`):
   per event Google's technical event id, the id of its series, a version stamp (etag), and why
   an event is view-only (for example "has guests" — the FACT only; check that guests' names or
   addresses are still not stored, so "We do not store guests" may need to become "We do not
   store who the guests are"); per calendar whether it is View only or Two-way, whether Google
   lets you edit it, whether it is your default for new events; a few technical flags (the
   notes could not be kept exactly, the time cannot be edited, a refresh was requested) — see
   migration `2026_11_13_100000_add_two_way_sync_columns.php`. Which permissions you gave was
   ALREADY stored for the connection (no new column) — mention it only if the policy does not.
   Daili now LOOKS at whether an event has guests and who organises it to decide "view-only",
   but stores only that reason (check `GoogleEventWriteBlock`). Plus the push-channel data of
   fact 5.
   Also: each change sent to Google leaves one short technical line in the server log (the
   calendar's internal number, the action, the result, the time taken — never a title or notes;
   check around `ExternalEventWriteService` log calls, incl. what is logged when Google refuses).
   Add it where the policy speaks about logs, with the log retention the policy already states.
5. **Change notices from Google (new).** For a Two-way calendar Daili asks Google to tell our
   server when something in that calendar changed (`events.watch`, `GoogleCalendarWatcher`,
   `GoogleCalendarPushController`). Check and describe truthfully: what Google sends (a notice
   that the calendar changed — confirm it carries no event content), what we store for it (a
   channel id, Google's resource id, a hashed token, an expiry), that channels end by themselves
   after a few days and are stopped when you switch to View only, remove the calendar or
   disconnect. Also the refresh rhythm if the policy states one ("regularly": Two-way calendars
   are refreshed more often — only if you can confirm the numbers; otherwise keep "regularly").
6. **How long we keep it / how to delete.** Check each existing bullet is still true. Add:
   an event you delete in Daili from a Two-way calendar is deleted in Google too (that is the
   point of the feature — say it clearly, it cannot be undone from Daili); removing Daili's
   access or only the edit permission in your Google Account → Daili can no longer change
   anything. Say only that. (The code sets a calendar back to View only when you CONNECT AGAIN
   without the edit permission — `dropTwoWayWithoutWriteScope` in the OAuth callback — not at
   the moment access is removed. And Google's permissions page removes all of an app's access
   at once: do NOT write that the edit permission alone can be removed there.)
7. **Sharing / protection / Limited Use.** Check the lists are still complete and true (no new
   recipient: the write goes to Google itself). The Limited Use sentence stays EXACTLY as it is.
   `#google-ai-apps` stays true (check api `013`: `McpAgenda` still leaves linked Google events
   out, and MCP cannot write to Google).
8. **Data export.** Api report `2026-11-13/012` says the export needed no change. Check what
   the export contains for linked calendars and correct the export sentence only if it is untrue.

Section 4 (same facts, shorter):
9. **"Connected calendars (optional)"** and **"Edit in Daili (optional)" (`#copy-to-daili`)**
   say events of a linked calendar "can't be changed in Daili". Correct both: still true for
   phone calendars, `.ics` links, Outlook and Google calendars on "View only"; for a Google
   calendar on Two-way its owner can edit most events directly, and a linked "Edit in Daili"
   event of that owner then also changes Google when they edit or delete it (the delete asks
   "Only in Daili" or "Daili and Google"). Check app `45ac46b4` and api `010` / `013`. Point to
   section 5 for the details instead of repeating them.
10. **New events "Save to".** With a Two-way calendar the New event form can save a new event
    straight to that Google calendar; people, reminders and category you add stay in Daili.
    One or two sentences, in the paragraph where it fits best.

## Two more lines that become untrue (found in review — fix them)
- Section 5, protection list: "Least privilege: Daili asks only for read-only permissions" →
  read-only unless you switch on Two-way; the edit permission is asked only then.
- Section 6 "Access control": the list of requests that need no sign-in ("… messages from our
  payment and e-mail providers …") must also name Google's change notices
  (`GoogleCalendarPushController`: no sign-in, checked with a secret token, carries no family
  data).
Read the WHOLE policy once more for any other sentence this feature makes untrue and fix it;
name each in the report.

## Scope
- `legal/privacy.en.html`, `legal/datenschutz.de.html`, and the same paragraphs in every other
  `legal/privacy.*.html`. Set each page's "last updated" date to today, in the style it uses.
- 🔴 Outlook: nothing changes — Outlook stays read-only; do not write "Google or Outlook" into
  any two-way sentence.
- Do NOT change: the terms pages, help pages, blog, marketing pages, templates. But grep the
  whole site source (not `dist/`) for sentences that now contradict the policy ("read-only",
  "never changes your Google calendar", "nur lesend" and the like, near Google / calendar) and
  LIST them in the report with file + line — Planning Claude decides later (help texts are owed
  when the feature opens for everyone).
- Keep the anchors (`id="…"`) that exist; other pages and the app link to them. New paragraph
  anchor: `id="google-two-way"` on the first paragraph that explains Two-way in section 5.

## The other locales
Translate the changed paragraphs into every other `legal/privacy.*.html` from the ENGLISH text,
informal register where the page uses it; permission names (`calendar.events`) and "Google
Calendar" stay as they are. Use each page's existing words for "Edit in Daili", "Only me" and
the app's labels — for the NEW app labels use the app's own translations: keys
`twoWayModeTwoWay`, `twoWayModeViewOnly`, `twoWaySaveToLabel` in
`../familyplanner-app/lib/l10n/app_<locale>.arb` (site `zh-Hans` = `app_zh.arb`, site
`zh-Hant` = `app_zh_Hant.arb`; the site also has `ar`, `hi` and `ru`, which
the app does not: translate the labels there yourself, and keep the Arabic page right-to-left
as it is). Sub-agents may do locale groups — every
sub-agent MUST use model claude-opus-5-5, and you wait for all of them before committing.

## Guard + build
Keep the legal guard green (`tools/check-legal.mjs`, run by the build): every privacy page must
carry the SAME "last updated" date. Add `id="google-two-way"` to its `MUST_CONTAIN` list for
`privacy`, like earlier legal prompts did. `npm run build` must pass. FOREGROUND.

## Commit & push
`docs(legal): privacy policy for Google two-way sync`; body
`Prompt: claude-prompts/2026-11-15/001-legal-google-two-way.md`. Only `legal/**` and `tools/check-legal.mjs` (plus
the report). 🔴 Do NOT stage `static/assets/img/photos/`. **Push now. Do NOT run `./deploy.sh`** —
Ammar deploys after Planning Claude has read the English and German text.

## Report
`claude-reports/2026-11-15/001-legal-google-two-way.md` (file-write tool, never a heredoc;
`wc -c` > 0). For each of facts 1–10: confirmed where (repo + file:line) · the changed or new
sentence in ENGLISH (quote it in full) · the GERMAN sentence (quote it in full) — or "could not
confirm" and why. Then: the full new English text of section 5's "What we access" block as one
quote (Ammar pastes it into Google's form) · the list of contradicting sentences elsewhere on
the site · locales done · build result · SHA + push. `## Help impact`: `calendar-linked /
calendar-connect: help texts for Two-way owed when the feature opens for everyone`.
