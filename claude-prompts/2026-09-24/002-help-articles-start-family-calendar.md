# Help articles, batch 1: Getting started, Family & groups, Calendar

## Goal
The help engine exists (`001-help-engine`, commit `345ca9d`). Now the
content. This batch writes the **core articles for three topics** (Getting
started, Family & groups, Calendar), so that **every app route that belongs to
these topics is covered** and leaves the `pending` list in
`help/routes-allowlist.json`.

Text only: pictures come from the app's new help-shots tool in a later run.
Missing `media` is a warning, not an error. That's expected, and the report
counts the warnings.

"Done" = `npm run build` green, about 18 new articles plus the fixes below,
and the `pending` list shorter by exactly the routes listed in Requirement 3.

## Scope
- **In:** `help/en/start/*.md`, `help/en/family/*.md`,
  `help/en/calendar/*.md`, `help/routes-allowlist.json` (remove the covered
  routes), and the existing `help/en/start/home.md` (Requirement 2).
- **Read, never write:** `../familyplanner-app` (the screens, `lib/l10n/app_en.arb`,
  `CHANGELOG.md`).
- **Out:** the engine and tools, templates, CSS, `site.config.mjs` (unless a
  topic summary is plainly wrong), `HELP_PUBLIC` (stays false), `media.json`
  and images, legal pages, the blog.

## Requirements

### 1. How to write every article (the house style)
- **Truth first.** Every step, button name and fact comes from the app code
  and `app_en.arb`, never from memory or this prompt. When this prompt's
  outline below disagrees with the code, the **code wins**: write what the
  app really does, and list the difference in the report.
- **Only features a user can reach in the live app.** If something is hidden,
  "ships dark", or waits for an outside approval (Outlook calendar is dark;
  check whether Google Calendar connect is visible to normal users today),
  **don't write an article for it**. Say in the report what you skipped and
  why.
- Plain, friendly English. Short sentences. "You" voice. Button and screen
  names in `**bold**`, **exactly** as the English ARB string. One idea per
  step. 2–5 steps is normal; 7 is the hard limit.
- `summary` answers "what will this let me do?" in one line.
- A `> Note:` is for the one thing people get wrong (a limit, who can see
  it, what happens after). Not every article needs one.
- `keywords`: the words a real person would type, including plain
  synonyms ("remove" for delete, "kid" for child, "partner", "wife",
  "husband" where it fits).
- `since`: the first **announced** app version from the app `CHANGELOG.md`
  (as `001` did for phone calendars). If an article's steps need something
  newer, use the newer version.
- `updated`: today, `2026-09-24`.
- `related`: 1–3 ids inside this batch or the 3 existing articles.
- Brand rule: "daili" lowercase in display text, "Daili" only mid-sentence
  where the site already does it.

### 2. Fix the existing Home article
`001` flagged it: `start-home` has `since: 1.0.0`, but its step 4 (rearranging
tiles) only exists since 1.6.0. Take tile editing **out** of `start-home`,
drop `/settings/home-tiles` from its `routes`, and keep it a simple tour. Tile
editing gets its own article (`start-edit-home`, below).

### 3. The articles (outline; check each against the code)

**Getting started** (`help/en/start/`)
| id | title (adjust to the app's words) | routes |
|---|---|---|
| `start-create-family` | Create your family | `/onboarding`, `/onboarding/create` |
| `start-join` | Join a family with a code or a QR code | `/onboarding/join`, `/onboarding/join/scan` |
| `start-sign-in` | Sign in: Google, Apple or email | `/welcome`, `/login`, `/register`, `/forgot-password` |
| `start-edit-home` | Edit your Home screen: hide and reorder tiles | `/settings/home-tiles` (+ the long-press edit mode on `/`, if it's there) |
| `start-today` | The Today screen | `/today` |

Notes: Apple sign-in is iPhone-only (CLAUDE.md §3); say so. "Forgot your
password?" belongs in `start-sign-in`.

**Family & groups** (`help/en/family/`)
| id | title | routes |
|---|---|---|
| `family-children` | Add a child without a login | `/family` |
| `family-roles` | Roles: owner, admin and member | `/family` |
| `family-groups` | More than one family or group | `/family` |
| `family-activity` | See who changed what | `/activities` |

Notes: roles come from CLAUDE.md §3 (only the owner deletes or hands over the
family; anyone can edit or delete a **shared** event; private events are
creator-only). Families or groups: up to 5 per account; the active one is
per device; check the real switcher and QR-join wording in the code.

**Calendar** (`help/en/calendar/`)
| id | title | routes |
|---|---|---|
| `calendar-views` | Month, week, day and agenda views | `/calendar` |
| `calendar-add-event` | Add an event | `/calendar/new` |
| `calendar-repeating` | Repeating events | `/calendar/new` |
| `calendar-reminders` | Reminders and the default reminder | `/calendar/new`, `/calendar/settings` |
| `calendar-private` | Private events: only you see them | `/calendar/new` |
| `calendar-edit-delete` | Change or delete an event | `/calendar/edit` |
| `calendar-categories` | Event categories and colours | `/family/event-categories` |
| `calendar-search` | Search the calendar | `/calendar/search` |
| `calendar-google` | Connect Google Calendar (**only if live**, see Req. 1) | `/calendar/settings` |

Notes: "this only / this and future" for repeating events; who may edit
(CLAUDE.md §3 "Who may edit/delete an event"); up to 5 reminders per event if
the form allows it (check). A private event's flag can only be changed by its
creator.

**Routes that must leave `pending`** after this batch:
`/onboarding`, `/onboarding/create`, `/onboarding/join`,
`/onboarding/join/scan`, `/welcome`, `/login`, `/register`,
`/forgot-password`, `/today`, `/family`, `/family/event-categories`,
`/activities`, `/calendar`, `/calendar/new`, `/calendar/edit`,
`/calendar/search`. (`/settings/home-tiles` is covered by
`start-edit-home`.) If one of them really can't get a true article (for
example, it's a technical screen nobody sees), move it to `never` with the
reason, and say so in the report.

### 4. Tips and checklist fields (only where they fit)
Add tip fields to exactly these articles (skip keys from
`help/skip-keys.json`). Titles ≤ 60 chars, bodies ≤ 120, in the app's
friendly voice:
- `family-children`: skip `hasManagedMember`, priority 60.
- `family-groups`: skip `hasSecondFamily`, priority 40.
- `calendar-google`: skip `hasGoogleCalendar`, priority 75 (only if the
  article exists).

Checklist: `calendar-add-event` gets `checklist: 2`,
`checklistDoneIf: hasEvent` (the invite article already has `1`).

## Constraints
- `npm run build` green (all guards). Self-correct up to 2 tries.
- Engine rules stand: body ≤ 150 words, ≤ 7 steps, only the allowed Markdown.
  If an article needs more, split it into two articles; don't bend the rule.
- Write files with the file-write tool, never a shell heredoc. Check `wc -c`
  on anything made from the shell.
- Don't touch `../familyplanner-app`.
- Leave the unrelated uncommitted files that `001` found (blog drafts,
  `BLOG-POST-TEMPLATE.md`, and so on) alone, and don't commit them.

## Verify
- `npm run build` (report the "help OK · N article(s)" line and the warning
  count).
- `node -e` count of `pending` before/after, plus the list of routes removed.
- `npm run serve`: open 3 new articles at phone width, and check that "invite",
  "repeat" and "private" in the help search find the right article.

## Commit & push
- First, if they are still untracked: this prompt file, as
  `docs(plan): add help articles batch 1 prompt`.
- Then `feat(help): articles batch 1 — getting started, family, calendar`.
  Body: `Prompt: claude-prompts/2026-09-24/002-help-articles-start-family-calendar.md`.
- **Push now.** (No auto-deploy here. `HELP_PUBLIC` stays false.)

## Report
`claude-reports/2026-09-24/002-help-articles-start-family-calendar.md`
(file-write tool, `wc -c` > 0):
- a table: article id → `since` → one line on what the code showed, and
  **every place you corrected this prompt's outline**;
- skipped articles and why (dark or unreleased features);
- `pending` before → after, and anything moved to `never`;
- the build's help line and the "missing media" warning count;
- SHA, pushed or not.
