# Help articles, batch 3 (Documents & photos, Notifications, Settings & account, Widgets/web/wall) + wire in the batch-2 pictures

> **Run this AFTER app prompt `2026-09-24/009-help-shots-batch-2`.** That
> run writes the batch-2 pictures this prompt wires in and commits. If it
> hasn't run, do Part B with whatever pictures exist and say so.

## Goal
**Part A.** Write the last batch of articles, so that the **8 routes still in
`pending`** (`/documents`, `/documents/:folderId`, `/photos`, `/photos/all`,
`/photos/:albumId`, `/settings`, `/settings/profile`,
`/settings/notifications`) are covered and **`pending` becomes empty**. Also
write the "Widgets, web & wall" topic, which has no app routes of its own.

**Part B.** Wire every new batch-2 picture into its article (same rules as
prompt 003 Part B) and commit the pictures.

"Done" = `npm run build` green, `pending` = 0, no orphan media, pictures
committed.

## Scope
- **In:** new `help/en/{vault,notifications,account,anywhere}/*.md`, the
  `media` line + one image line on articles that got a picture,
  `help/routes-allowlist.json`, and committing the pictures + `media.json`.
- **Read, never write:** `../familyplanner-app` (screens, ARB, CHANGELOG,
  CLAUDE.md, the widget code under `ios/` and `android/`), `../daili-web`
  (the web companion and its `/board` wall view), `../familyplanner-api` if a
  rule needs checking.
- **Out:** engine/tools/templates/CSS, `HELP_PUBLIC` (stays false), legal,
  blog.

## Requirements

### Part A: house style (unchanged from 002/003)
The **code wins** over this outline, and every difference goes in the report.
**Only what users can reach in the live app (1.6.0)**, so no articles for
merged-but-unreleased features. Widgets v2 (habit ticks, next-up, meals,
quick add, widget settings, lock-screen widgets) was built **after** 1.6.0
went live, so check the 1.6.0 CHANGELOG section and write only what 1.6.0
(or older) has. Everything newer is added by the release help sync later.

Plain friendly English, "you" voice, exact English ARB strings in
`**bold**`, 2–5 steps (7 max), ≤ 150 words, one `> Note:` only when it helps,
real-people `keywords`, `since` from the CHANGELOG, `updated: 2026-09-24`,
1–3 `related`. "daili" lowercase in display text. Split rather than bend a
limit.

### Part A: the articles (outline)

**Documents & photos** (`help/en/vault/`)
| id | title | routes |
|---|---|---|
| `vault-where` | Where your documents and photos are kept | `/documents`, `/photos` |
| `vault-documents` | Documents: folders and adding files | `/documents`, `/documents/:folderId` |
| `vault-photos` | Photos and albums | `/photos`, `/photos/all`, `/photos/:albumId` |

Say **plainly** what the code does. The Home tiles say "Save files on this
phone" and "Keep photos on this phone", so check whether anything is shared
with the family or backed up, and write exactly that. People must not believe
their files are backed up when they aren't.

**Notifications** (`help/en/notifications/`)
| id | title | routes |
|---|---|---|
| `notifications-turn-on` | Turn notifications on | `/settings/notifications` |
| `notifications-choose` | Choose which notifications you get, and quiet hours | `/settings/notifications` |
| `notifications-help` | Not getting notifications? Things to check | `/settings/notifications` |

`notifications-turn-on` gets `checklist: 3`, `checklistDoneIf:
notificationsOn`. `notifications-help` is a short, honest checklist (phone
setting, the app's switches, quiet hours, battery savers on Android): only
things the app or the OS really has.

**Settings & account** (`help/en/account/`)
| id | title | routes |
|---|---|---|
| `account-profile` | Your profile: name, photo, avatar and colour | `/settings/profile` |
| `account-preferences` | Light or dark, language, time format, vibration | `/settings` |
| `account-password` | Change or set a password | `/settings/profile` |
| `account-verify-email` | Verify your email, and why it matters | `/settings` |
| `account-download-data` | Download your data | `/settings/profile` |
| `account-delete` | Delete your account (and change your mind within 30 days) | `/settings/profile` |
| `account-newsletter` | The newsletter: on or off | wherever the switch lives |
| `account-feedback` | Send feedback or rate daili | `/settings` |

`account-verify-email`: list exactly what verification unlocks (invite by
email, convert a child, online recipe search). Don't list joining with a code:
that **no longer** needs it (CLAUDE.md §3). `account-delete`: the 30-day
grace, and how to cancel (the email link and/or signing in again: check what
the code and the api really do). Password-less (Google/Apple) accounts: say
what they see instead of a password field.

**Widgets, web & wall** (`help/en/anywhere/`). These are not app screens, so
use `routes: /` and no `tryIt`.
| id | title |
|---|---|
| `anywhere-widgets` | Add a daili widget to your home screen (one article; steps that work on iPhone and Android, with the difference in one step or a note) |
| `anywhere-web` | Use daili in your browser (app.daili.app) |
| `anywhere-wall` | Put daili on a wall screen or an old tablet (the `/board` view of the web app: check `../daili-web`) |

`anywhere-widgets`: `checklist: 6`, `checklistDoneIf: hasWidget`; tip
title/body in the app's voice, skip `hasWidget`, priority 80. Describe only
the widgets 1.6.0 ships. Lock-screen widgets get their own article later,
only if 1.6.0 has them. These three articles will get **hand-made**
pictures or clips later (the tool can't photograph the phone's home screen),
so no picture now is expected.

**Allowlist:** remove the 8 routes from `pending`; it must be **empty**
afterwards. If a route can't get a true article, move it to `never` with a
reason and report it.

### Part B: wire in the batch-2 pictures
Exactly as 003 Part B:
- for every id in `media.json` equal to an article id, set `media: <id>` and
  add one image line after the first paragraph;
- **look at each picture** before writing its alt text (what it shows + what
  is circled);
- no orphan media;
- commit pictures + `media.json` first, as `chore(help): help-shots pictures (batch 2)`.

If 009 re-shot `start-edit-home` (Home wiggle mode), update that article's
alt text to match the new picture.

## Constraints
- `npm run build` green (all guards). Self-correct up to 2 tries.
- File-write tool, never heredocs; check `wc -c`.
- Don't write into `../familyplanner-app`, `../daili-web`, or
  `../familyplanner-api`.
- Leave the unrelated uncommitted files alone.

## Verify
- `npm run build` (help line + missing-media warning count; which articles
  still lack a picture).
- `pending` = 0 (show it).
- Search finds "dark mode", "delete account", "widget", "backup" and "quiet
  hours" in the right articles.

## Commit & push
1. This prompt, if untracked: `docs(plan): add help articles batch 3 prompt`.
2. `chore(help): help-shots pictures (batch 2)`.
3. `feat(help): articles batch 3 — documents, notifications, account, widgets/web/wall; every screen covered`.
   Body: `Prompt: claude-prompts/2026-09-24/004-help-articles-vault-notifications-account-anywhere.md`.
- **Push now.** `HELP_PUBLIC` stays false.

## Report
`claude-reports/2026-09-24/004-help-articles-vault-notifications-account-anywhere.md`:
- the article table (id → `since` → what the code showed / corrections);
- what "on this phone" really means for documents and photos (one paragraph,
  quoting the code);
- skipped/unreleased features;
- `pending` = 0 proof;
- pictures wired (id + alt) and articles still without a picture;
- totals: articles, tips, checklist rows;
- SHAs, pushed or not.
