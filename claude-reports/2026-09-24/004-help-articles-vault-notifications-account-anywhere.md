# 004 — Help articles, batch 3 + batch-2 pictures: report

Prompt: `claude-prompts/2026-09-24/004-help-articles-vault-notifications-account-anywhere.md`
Commits: `4f7ad46` docs(plan): add help articles batch 3 prompt · `ddddb06` chore(help): help-shots pictures (batch 2) · `a0f3e98` feat(help): articles batch 3 — documents, notifications, account, widgets/web/wall; every screen covered
**Pushed** to `origin/main` (with this report's commit). Nothing deployed. `HELP_PUBLIC` is still false.

The app's help-shots batch 2 (009) had already run: all 27 batch-2 pictures were on disk and in `media.json`, so Part B is complete. 009 also re-shot `start-home`, `start-edit-home`, `calendar-repeating` and `family-groups`. Those 4 are in the pictures commit too.

## Result

`npm run build` is green on the first try:

```
help OK · 64 article(s) · 54 app routes checked
test-check-help OK · 55 cases (1 clean fixture + every guard rule planted and caught)
built 210 pages · 28 locale(s) · 132 sitemap entries
help: 64 of 64 article(s) on pages (live 1.6.0) · 11 topic(s) · en.json 64 articles, 9 tips, 6 checklist · noindex preview
build OK · 210 pages · 114 in hreflang clusters
```

**Missing-media warnings: 27 → 17.** All 27 batch-2 warnings are gone. The 17 left are exactly the 17 new batch-3 articles. (The log prints each warning twice.)

**No orphan media.** Every id in `media.json` is used by an article.

## Where the facts come from

"Code" means `../familyplanner-app` at the **`v1.6.0+11` tag**, not the working tree. The app repo has uncommitted work going on right now: for example, `settingsEmailUnverifiedBody` already says "…and search recipes online" there, but the live 1.6.0 string doesn't. I checked that `lib/features/settings`, `documents`, `photos` and `newsletter` haven't changed between the tag and `HEAD`. The web facts come from `../daili-web` at `3d13d47`. `../familyplanner-api` **isn't on this machine**, so I couldn't check any server rule directly (see account-delete below).

For `since`: 1.0.0 = 08-11, 1.1.0 = 08-19, 1.2.0 = 09-01, 1.3.0 = 09-04, 1.4.0 = 09-09. For anything older than the CHANGELOG, I used the date the ARB string first appeared (`git log -S`).

## Articles

### Documents & photos (`help/en/vault/`)

| id | since | what the code showed / corrections |
|---|---|---|
| `vault-where` | 1.0.0 | See the next section. It's a numbered list of four plain facts: only you see them, no backup, sign-out keeps them, deleting the account removes them. The note quotes **Only on this device**, the caption on event attachments. |
| `vault-documents` | 1.0.0 | Folder button at the bottom right (tooltip **New folder**) → **Folder name**, **Color**, **Save**. In a folder, **+** (**Add a file**) → **File** / **From camera roll** / **Take photo**. The **⋮** on a file → **Rename** / **Move** (only when there's another folder) / **Share** / **Delete**. Long-press a folder → **Rename** / **Delete**, and the delete also removes its files ("can't be undone"). I didn't mention the ready-made folders from 1.5.0, so `since` stays 1.0.0. |
| `vault-photos` | 1.0.0 | Button at the bottom right (tooltip **New album**) → **Album name** → **Save**. In an album, **+** → **From camera roll** / **Take photo**. Tap a photo for the viewer, which has **Share** / **Delete** at the top. There's an **All photos** card. Long-press an album → **Rename** / **Delete**. **Detail:** photos don't move between albums, because there's no Move for photos. Imports are copies, so the camera roll is untouched. |

### Notifications (`help/en/notifications/`)

| id | since | what the code showed / corrections |
|---|---|---|
| `notifications-turn-on` | 1.1.0 | Checklist 3, `notificationsOn`. The screen `/settings/notifications` has been there since 08-12. While the OS permission is missing, a warning row sits at the top. Its button is **Turn on notifications** (it asks the OS) or **Open settings** once the OS prompt has been used up. The row hides itself when you come back with permission. The automatic ask (**Turn on notifications** sheet, from the second app open) and the after-reminder ask are in the note. |
| `notifications-choose` | 1.1.0 | Two groups: **Reminders (for you)** and **Family changes (what members do)**. **Quiet hours** starts at 21:00–07:00 (`kQuietHoursDefaultStart/End`), with **From** / **Until** in 15-minute steps. **Correction:** the app's hint says "Reminders you set still come through", but the **Habit reminders** and **Habit news** hints both say "Quiet hours apply". So the article says habit notifications are held back too, and only event, to-do and birthday reminders come through. Family changes arrive together when quiet hours end (`quiet_hours.dart`: "sends one catch-up when it ends"). Everything here is stored on the account on the server, so the note says "belong to your account". |
| `notifications-help` | 1.1.0 | Five checks: OS permission (the warning row), the switch for that kind, quiet hours, Focus / Do Not Disturb, Android battery limits. The last two are OS features. The app has no screen for them, so the article just names them. The note gives the to-do rule from batch 2: a due date plus a **Reminder**. |

### Settings & account (`help/en/account/`)

| id | since | what the code showed / corrections |
|---|---|---|
| `account-profile` | 1.1.0 | Settings → tap the profile card at the top. **Change picture** → **Take photo** / **Choose from library** / avatar grid (**Adults** / **Kids**). The picture is saved right away. **Display name**, **Your color** (hint "Used for your avatar and your events"), then **Save**. A colour another member has is "faded with a cross and can't be picked". `since` is 1.1.0 because the avatars came on 08-17. |
| `account-preferences` | 1.3.0 | **Preferences** card: **Language** (**System default** + endonyms), **Time format** (**24-hour** / **12-hour** / **System**, from 09-04 = 1.3.0), **Appearance** (**Light** / **Dark** / **System**), **Home screen**, **Vibration**. Time format, appearance and vibration are device-only. Language is device-only too, but it is also sent to the server so emails and pushes use it, and the note says so. |
| `account-password` | 1.0.0 | **Account** section on the profile: **Change password** → **Current password**, **New password**, **Confirm new password** (at least 8 characters) → **Save**. After that, "Other devices were signed out." Password-less (Google/Apple) accounts see **Set password** instead, and it emails a reset link. The note covers **Forgot password?** on sign-in. |
| `account-verify-email` | 1.0.0 | It lists the three things the prompt asked for. The 1.6.0 card only says two of them: "…to invite family members by email and to give a child their own login". Online recipe search is in CLAUDE.md §3 and in the unreleased string, so I kept it. Invite by email is real (`familyInviteEmailLabel`, "Verify your email to send invites by email"). The **Email not verified** card in Settings has **Resend**. **Addition:** Google/Apple accounts count as verified (CLAUDE.md, social sign-in). The note says joining with a code doesn't need it. |
| `account-download-data` | 1.0.0 | **Download my data** → message "We'll email you when your export is ready." **Addition:** the note says documents and photos aren't in the export, because they're never on the server. |
| `account-delete` | 1.0.0 | **Delete account** → **Password** → **Delete my account**. Password-less accounts get no field (`hasPassword: false`, and the server skips the check). Then **Account scheduled for deletion**, and you're signed out. **Cancelling:** the app only ever talks about the **email link** ("We'll email you a cancellation link — until then you can restore your account with it"). Nothing in the app handles signing in to a scheduled account, and the api repo isn't here to check. So the article **only** gives the email link, and doesn't say signing in again cancels it. Owners must transfer ownership or delete the family first (`profileDeleteOwnerMustTransfer`). **Important addition:** `ProfileScreen._openDeleteAccount` erases the on-device vault right after the DELETE succeeds, so cancelling does **not** bring the documents and photos back. That's the note. |
| `account-newsletter` | 1.6.0 | **Correction:** the switch isn't in Settings' main list. It's on the **Notifications** screen, in its own **Email** group, as **daili newsletter**. It's opt-in. For an unverified address, the server sends a confirm email first ("We sent you an email — tap the link in it to confirm."). The note covers the one-time **Get daili news?** sheet (**Yes, sign me up** / **Not now**). |
| `account-feedback` | 1.1.0 | **About** → **Send feedback** opens a `mailto:` with app version, platform and language already filled in. **Rate Daili** opens the store listing. Without a mail app you see support@daili.app. **Style clash:** the ARB string is **Rate Daili** with a capital D. I quoted it exactly, because the bold strings must match the app. Everywhere else it's "daili". |

### Widgets, web & wall (`help/en/anywhere/`)

These have `routes: /` and no `tryIt`.

| id | since | what the code showed / corrections |
|---|---|---|
| `anywhere-widgets` | 1.4.0 | At the tag, there are **three** widgets on iOS and Android: **Up next** (calendar: small/medium/large), **Shopping** (the most recently updated list: small/medium) and **To-dos** (from 09-08 = 1.4.0, so `since` is 1.4.0; small/medium/large). They have no settings, nothing to tick and no lock-screen versions. The descriptions are the gallery strings word for word. Tap = open that area (`daili://widget/...`). Widgets are updated when the app writes, so the note says "open daili for a moment". Checklist 6, `hasWidget`. Tip "Your plan on your home screen" / "Add a daili widget and see what's next without opening the app.", skip `hasWidget`, 80. The add-widget steps are iOS 17+/Android launcher wording. The difference between the two sits in steps 2 and 4. |
| `anywhere-web` | 1.1.0 | The web app works on computers only. **Correction to the idea behind the outline:** since 2026-09-01, phones **and tablets** (any iOS or Android browser) get a blocking "get the app" sheet on every route except invite/join and `/board` (`appWall.ts`). The article says that. The sidebar has calendar, shopping, to-dos, habits, recipes, meal plan, birthdays and family. Documents/photos and the two irreversible deletes are phone-only (daili-web CLAUDE.md §1). Sign-in has **Continue with Google** / **Continue with Apple**. `since`: the web has no version numbers. It went live on 08-14, so I used the first app release after that (1.1.0). There's no link in the body, because the guard forbids links, so the address is plain text. |
| `anywhere-wall` | 1.2.0 | `app.daili.app/board` is read-only (`BoardPage.tsx`). It shows Today, Tomorrow, **To-dos due today**, **Meals today** and **Birthdays** (the next 7 days). It refreshes every 20 s and keeps the screen awake where the browser supports it (`useWakeLock`, but older iOS Safari doesn't). It has no sidebar. You leave with a 2-second hold on **Hold to leave**. A signed-out tablet gets the sign-in form right on `/board`, which is exempt from the phone wall, so step 2 works on a tablet. I left out `?family=<id>` because it's too technical for this article. `since`: the board came on 08-21, so 1.2.0. |

`related` only links ids that exist. `keywords` are 12 or fewer, all lower case. Every body is 150 words or fewer, and the guard checks that.

## "On this phone": what it really means

The Home tiles' "Save files on this phone" / "Keep photos on this phone" are literally true. `VaultStore` is "the offline Documents vault's store — folders + files, device-only, no wire", and `PhotoStore` says the same ("albums + photos, device-only, no wire"). Both sit under the app's documents directory in a per-account folder `vault/u<userId>/` (`vault_scope.dart`). Nothing is uploaded, and nothing is shared with the family. Event attachments are only local links, and the event sheet labels them **Only on this device** ("other family members never see them"). daili doesn't back anything up. Sign-out "deliberately erases nothing: the vault is device-only with no server copy, so deleting on sign-out would destroy files that exist nowhere else". Account deletion erases it (`VaultEraser`). Deleting the app removes it, like any app data. The one grey area is the phone's **own** backup. The app sets no backup exclusion: no `isExcludedFromBackup` on iOS, and no `allowBackup`/`dataExtractionRules` in the Android manifest, so Android's default auto-backup applies. So iCloud or Android backups *may* include the files. The article says exactly that: "may have saved them, but don't count on it". The data export doesn't include them either.

## Skipped or unreleased

- **Widgets v2** (everything under `[Unreleased]`): ticking from the widget, Quick add, Habits/Minzi, Next up with countdown, Meals, the widget settings sheet, lock-screen widgets, and the bigger Shopping widget. None of it is in 1.6.0, so none of it is written. So there's **no lock-screen article**, because 1.6.0 has no lock-screen widgets.
- **Outlook / connect-a-calendar**: not touched (unannounced).
- The **Home screen** row under Preferences is covered by `start-edit-home`, not here.
- Nothing merged. Nothing moved to `never`.

## Allowlist: `pending` = 0

```
$ node -e 'const a=require("./help/routes-allowlist.json");console.log("pending =",Object.keys(a.pending).length)'
pending = 0
```

These were removed: `/documents`, `/documents/:folderId`, `/photos`, `/photos/all`, `/photos/:albumId`, `/settings`, `/settings/profile`, `/settings/notifications`. `never` is unchanged (`/maintenance`, `/dev/assets`). The guard passes with every one of the 54 app routes covered.

## Search

This is the page's own search (`help-search.js` logic, run in Node against the index in `dist/help/index.html`), top 3:

- "dark mode" → account-preferences
- "delete account" → account-delete, family-children, vault-where
- "widget" → anywhere-widgets, anywhere-web, anywhere-wall
- "backup" → vault-where
- "quiet hours" → notifications-choose, notifications-help

## Pictures (Part B)

I looked at each picture before writing its alt text. Each one got `media: <id>` after `updated:` and one image line after the first paragraph. The exception is `habits-what`: its first paragraph ends in "…picked under **Who**:" and leads into the list, so the picture goes right after the list.

| id | alt text |
|---|---|
| `lists-shopping` | The Groceries list with open items and two ticked ones under Completed. The Add item bar at the bottom is circled. |
| `lists-categories` | The ⋯ menu of the Groceries list. The Group by category switch and the Categories row are circled. |
| `lists-move-items` | The Edit item sheet for Milk. The Move to list… row is circled. |
| `lists-todos` | The To-dos screen with one list. The Household list card is circled. |
| `lists-assign` | The Edit item sheet for a to-do. The Assignee field, set to Lena, is circled. |
| `lists-due-reminders` | The Edit item sheet for a to-do with a due date and time. The Reminder field is circled. |
| `lists-repeating` | The Edit item sheet for a to-do. The Repeat choices None, Daily, Every few days, Weekly and Monthly are circled. |
| `lists-all-mine` | The top of the To-dos screen. The family circle and your own picture at the top right are circled. |
| `lists-edit-list` | The Shopping screen with a list's ⋯ menu open. Edit is circled, with Delete under it. |
| `meals-add-recipe` | The Recipes screen with the + menu open. New recipe is circled. |
| `meals-import-link` | The Recipes screen with the + menu open. Import from link is circled. |
| `meals-paste` | The Recipes screen with the + menu open. Paste recipe text is circled. |
| `meals-search-online` | The Search online screen. The What would you like to cook? field is circled. |
| `meals-plan-week` | The Meal plan for one week. The + next to Monday is circled. |
| `meals-to-shopping` | A recipe with its ingredients. The shopping cart button at the top is circled. |
| `meals-copy-week` | The top of the Meal plan. The copy button next to the shopping cart is circled. |
| `birthdays-add` | The Birthdays screen with the next birthday and a countdown. The + button at the bottom right is circled. |
| `birthdays-import` | The Birthday settings sheet. The Import from contacts row is circled. |
| `birthdays-reminders` | The Edit celebration screen with two reminders. The Add reminder button is circled. |
| `birthdays-comments` | A birthday with a heart and two comments. The Add a comment… field at the bottom is circled. |
| `habits-what` | The Habits screen with Minzi in her room, the Family energy bar and three habits. The + button in the bottom bar is circled. |
| `habits-create` | The New habit form. The Who choices Just me, Each of us and Together are circled. |
| `habits-tick` | The Habits screen. The round tick button next to Stretch is circled. |
| `habits-streaks` | A habit's own page with this week's ticks and a calendar. The Current streak card is circled. |
| `habits-minzi` | The Habits screen with Minzi in her room. The Family energy bar is circled. |
| `habits-private` | The More part of the New habit form. The Private switch is circled. |
| `habits-reminders` | The More part of the New habit form. The Reminder switch is circled. |

**Re-shots:** `start-edit-home` now shows Home in wiggle mode (× on every tile, **Done** circled), which is what step 1 describes. Its alt text is now "The Home screen in edit mode, with an × on each tile. The Done button at the bottom right is circled." `start-home`, `calendar-repeating` and `family-groups` were re-shot too, but they show the same thing as before, so their alt texts still fit and I left them alone.

**Still without a picture (17):** the whole of batch 3. The three `anywhere-*` articles need hand-made pictures or clips, as the prompt expected. The other 14 (vault ×3, notifications ×3, account ×8) can come from the help-shots tool in a batch 3.

## Totals

- Articles: **64** (47 → 64), in 11 topics.
- Tips: **9** (+ `anywhere-widgets`).
- Checklist rows: **6**: 1 invite, 2 add event, 3 notifications on, 4 shopping item, 5 birthday, 6 widget.

## Things to know

- **Commit `ddddb06` can't build on its own**, just like batch 2's pictures commit. It adds 27 `media.json` ids that no article uses yet (orphans), and `a0f3e98` fixes that. The prompt asked for this order. The pushed tip is green.
- **App follow-ups, not done here:**
  - The 1.6.0 **Email not verified** card doesn't mention online recipe search. The uncommitted work in the app repo seems to fix exactly that.
  - The quiet-hours hint ("Reminders you set still come through") and the habit hints ("Quiet hours apply") disagree. One of them should change.
- **Can't check (api not on this machine):** whether signing in during the 30-day grace also cancels a deletion, and what format the data export is in. The articles don't claim either one.
- I left the unrelated uncommitted files alone (blog drafts, changelog pages, `BLOG-POST-TEMPLATE.md` and so on).

Help impact: 17 new help articles and 27 batch-2 pictures wired in. Every app route now has an article (`pending` is empty).
