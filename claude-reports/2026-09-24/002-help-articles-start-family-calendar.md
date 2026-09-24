# 002 — Help articles, batch 1: report

Prompt: `claude-prompts/2026-09-24/002-help-articles-start-family-calendar.md`
Commits: `07e103e` docs(plan): add help articles batch 1 prompt · `d5b3423` feat(help): articles batch 1 — getting started, family, calendar
**Pushed** to `origin/main`. Nothing deployed. `HELP_PUBLIC` is still false.

## Result

`npm run build` is green:

```
help OK · 20 article(s) · 54 app routes checked
test-check-help OK · 55 cases (1 clean fixture + every guard rule planted and caught)
built 158 pages · 28 locale(s) · 132 sitemap entries
help: 20 of 20 article(s) on pages (live 1.6.0) · 3 topic(s) · en.json 20 articles, 4 tips, 2 checklist · noindex preview
build OK · 158 pages · 114 in hreflang clusters
```

**Missing-media warnings: 17.** That's one for each new article, as expected. The build log shows 34 lines because each warning prints twice.

There are 17 new articles plus the fixed `start-home`. The prompt estimated "about 18". The difference is `calendar-google`, which I skipped (see below).

## Articles

Every button name is the exact English ARB string. "Code" in this table means `../familyplanner-app` at `da5dbe70`.

| id | since | what the code showed / corrections to the outline |
|---|---|---|
| `start-home` (fixed) | 1.0.0 | Step 4 (long-press edit) removed, `/settings/home-tiles` dropped from `routes`. The note now only says that tapping your picture opens **Settings**. `related` gained `start-edit-home` and `start-today`. |
| `start-sign-in` | 1.0.0 | **Correction:** `/welcome` is a 4-slide intro whose **Get started** button goes to **Sign in** (`/login`), not to a choice of methods. The buttons are **Continue with Google** and **Continue with Apple**. Apple only shows on iOS (`defaultTargetPlatform == TargetPlatform.iOS`). Register: **Sign up** → **Create account**. Forgot password: **Forgot password?** → **Send reset link**. The password needs at least 8 characters. Title is now "Sign in with Google, Apple or email". |
| `start-create-family` | 1.0.0 | **Correction:** the app says "family **or group**" everywhere. The button is **Create a family or group**, the fields are **Family or group name** and **Color**, and the button at the end is **Create**. Title is now "Create your family or group". |
| `start-join` | **1.6.0** | **Join a family or group** → type the **Invite code** → **Lookup** → a preview (name, members, expiry) → **Join {family}**. **Scan QR code** only arrived in 1.6.0, and the steps use it, so `since` is 1.6.0. Invite links open the same screen (the `/onboarding/join` redirect in `app_router.dart`). |
| `start-edit-home` | 1.6.0 | Long-press → tiles shake → drag, **×** hides, **+** brings back, **Done** at bottom right (`homeEditModeProvider`, `_HomeEditDoneButton`). There's also Settings → **Home screen**, which has switches and drag handles. Layout is saved per device and per member (`HomeTilePreferences`). Settings reordering is also 1.6.0 (CHANGELOG), so the whole article is 1.6.0. |
| `start-today` | **1.1.0** | **Correction/detail:** the **Today** button sits in the Home header at the **top right, next to the bell**. Sections: Events, **To-dos**, **Shopping**, **Meals today**, Birthdays, Habits. Empty sections are hidden, and an empty day shows **Nothing on for today**. The screen became its own route on 2026-08-12, after the 1.0.0+4 build (08-11) and before 1.1.0 (08-19). The CHANGELOG only starts at 1.2.0, so 1.1.0 is the first build that had it. |
| `family-children` | 1.0.0 | **Children** → **Add child** → **Name** + **Color** → **Add**. **Correction:** the prompt/CLAUDE.md say admins create children, but the app shows **Add child** to **every** member (code comment: "shown to every family member"). The ⋮ menu (**Edit**, **Change picture**, **Convert to account…**, **Delete**) is admin-only. The article says that. Children can be picked as to-do assignees (`assignee_picker.dart`). |
| `family-roles` | **1.4.0** | The app labels are **Owner**, **Admin**, **Member** (role change offers Admin / Member). Owner only: **Change role…** and **Transfer ownership** (under **Ownership**). Admins: **Remove from family**. Non-owners: **Leave family** on their own row. **Correction:** CLAUDE.md says "only the owner deletes the family", but **the app has no delete-family UI**, so the article doesn't mention deleting. The transfer needs the new owner to be an admin first (`familyTransferOwnershipEmptyState`), and the old owner becomes an admin. `since` is 1.4.0 because the intro says anyone can edit shared events (changed in 1.4.0). |
| `family-groups` | 1.6.0 | Switcher = **Your families & groups** sheet. It opens from the family name under the Home greeting, or from **Switch family or group** (the app-bar icon and a button at the bottom of the Family screen). Below the list: **Create a family or group** and **Join with a code**. **Make default** sits behind **⋮** on a row. The limit is 5 (`familyLimitReached`). The active family is per device. |
| `family-activity` | **1.1.0** | Bell top right on Home (tooltip **What's new**, with an unread count). Rows are grouped **Today** / **Yesterday** / date, and unread rows are tinted. Tapping a row opens the item. Feed added 2026-08-12, so 1.1.0 (same reasoning as Today). I wanted a note that private events don't show in others' feeds, but I dropped it: that's server behaviour, and the api repo isn't on this machine to check. |
| `calendar-views` | 1.0.0 | **Correction:** there are **five** views, not four: **Month**, **Week**, **3 days**, **Day**, **Agenda**. They're picked from **View** in the **bottom bar**, next to **Today** and **Search**. The choice is remembered on the device. **Filter** (people + categories) only shows up when there's more than one login member or at least one category. |
| `calendar-add-event` | **1.3.0** | Calendar **+** (bottom right) → **Title**, **Start**/**End**, **All day**, **Repeats**, **Reminder**, **Private event**, **Category**, **Location** → **Save**. After saving, daili opens the event so you can attach things. Categories and open-after-save both arrived in 1.3.0, so `since` is 1.3.0. Checklist 2, `doneIf: hasEvent`. |
| `calendar-repeating` | 1.0.0 | **Correction:** editing and deleting offer **three** scopes, not two: **This event only**, **This and following events**, **All events** (`calendarEditScope*`, `calendarDeleteScope*`, section "Apply to"). **Repeat on** (weekdays) only shows for **Weekly**. **Ends**: **Never** / **On date**. All-day, repeats and private can't change for a single event (`calendarEditDisabledBody`). |
| `calendar-reminders` | 1.0.0 | **Add reminder** opens a checklist with presets and **Custom…**. **Up to 5** is confirmed (`calendarRemindersAtCap`: "Maximum 5 reminders", server `max:5`). A single edited occurrence can have only 1. The default reminder is in the calendar gear → **Reminders** → **Default reminder**: "Pick up to 5", saved on this device only. The **Event reminders** switch is on the same screen. Shared events remind the whole family, private ones only you. Multiple reminders (07-21) and the default (07-31) both came before 1.0.0. |
| `calendar-private` | 1.0.0 | **Private event** switch, subtitle **Only you can see this**. Only the creator can flip it (`calendarPrivateCreatorOnlyHint`). I left out the lock icon on event cards, because that icon only arrived in 1.4.0. |
| `calendar-edit-delete` | **1.4.0** | Tap the event → sheet with **Edit event** and **Delete**. Repeating events get the three scopes. Anyone can edit or delete a shared event, and private events are creator-only. That rule is 1.4.0 in the CHANGELOG, so `since` is 1.4.0. `tryIt: /calendar` because `/calendar/edit` needs an event id. |
| `calendar-categories` | 1.3.0 | **Family** → under **Calendar** → **Event categories** → **Add category** (**Name**, **Color**, **Add**). Tap a category to edit it, or use **⋮** to delete. It's also reachable from the event form's **Manage categories**. Six starter categories, up to 30, and anyone may edit. Deleting keeps the colour on existing events. |
| `calendar-search` | 1.0.0 | Bottom bar **Search**. It matches the **title and location**, ignores case and accents, and covers **12 months back and ahead**. Results are split into **Upcoming**/**Past**, and a repeating event shows once. It ignores the member filter on purpose. |

`related` only links ids inside this batch or the 3 existing articles. `keywords` are 12 or fewer, all lower case.

**Tips:** `family-children` (skip `hasManagedMember`, 60) and `family-groups` (skip `hasSecondFamily`, 40). **Checklist:** `calendar-add-event` = 2. `en.json` now has 4 tips and 2 checklist entries.

## Skipped

- **`calendar-google`: not written.** The connect screen is in the app, and the Google row shows whenever the server lists Google in `available_providers`. But the feature is still **not announced**: the app CHANGELOG keeps "connect a Google or Outlook calendar" under "In this build, not announced yet". PLAN.md and CLAUDE.md §4 still say they're waiting on Google OAuth verification (video sent 2026-09-01). Outlook is hidden (`available_providers`). That also means no `hasGoogleCalendar` tip. When Google verifies, write it for `/calendar/settings`, which is already covered by `calendar-phone-calendars`, so no allowlist change is needed.

## Allowlist

`pending`: **48 → 32**. These 16 routes were removed, which is exactly the prompt's list:
`/onboarding`, `/onboarding/create`, `/onboarding/join`, `/onboarding/join/scan`, `/welcome`, `/login`, `/register`, `/forgot-password`, `/today`, `/family`, `/family/event-categories`, `/activities`, `/calendar`, `/calendar/new`, `/calendar/edit`, `/calendar/search`.
`/settings/home-tiles` was never in `pending`. It's now covered by `start-edit-home`. Nothing was moved to `never`.

## Checks

- Headless Chrome, with each page in a 390 px iframe: `calendar/repeating`, `family/roles`, `start/sign-in` and `/help/` all have **0 px** horizontal overflow. Steps render as green numbered circles, and notes, Related and Still stuck look right.
- Help search, top result: "invite" → `/help/family/invite/`, "repeat" → `/help/calendar/repeating/`, "private" → `/help/calendar/private/`.
- "New in version 1.6.0" on the help home now lists `start-join`, `start-edit-home` and `family-groups`.

## Things to know

- **Someone else changed the help pictures during this run.** At 11:49:39–43, six seconds before my commit, another process rewrote `static/help/media/en/{family-invite,calendar-phone-calendars,start-home}.webp` and `help/media.json` with new sizes (probably the app's new help-shots tool). My first commit picked up `media.json` by accident. It wasn't pushed yet, so I amended it back out: the pushed commit has none of those four files. They are **still modified and uncommitted in your working tree**, so commit them with the run that made them.
- I left the unrelated uncommitted files alone (blog drafts, `BLOG-POST-TEMPLATE.md`, changelog pages and so on).
- `tryIt` is left out on the sign-in, create and join articles, because those screens are for signed-out or new users.

Help impact: 17 new help articles plus a fixed Home article. 32 routes are still pending articles (`help/routes-allowlist.json`).
