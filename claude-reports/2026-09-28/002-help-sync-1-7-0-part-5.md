# Help sync 1.7.0 (part 5): account, invite, repeating edit, You step, AI consent

**Prompt:** `claude-prompts/2026-09-28/002-help-sync-1-7-0-part-5.md`
**Completed:** 2026-09-28 · **Status:** done · **Commit:** `11b4d2d`, pushed to `main` (Ammar deploys)
Pre-step: pending planning docs committed as `bf35b70` (docs only).

## Articles × locales
13 articles × 25 locales = 325 files. Every English one has `updated: 2026-09-28`, and every translation has `translatedFrom: 2026-09-28`.
- **account-verify-email:** the link lasts 3 days, and an expired one offers a fresh one. **Resend** waits a minute. The bounce text has **Change email address** and **Didn't get the email?** (help within a day). A **Verified** mark shows when done.
- **account-delete:** 5 steps: an optional reason, then type the word (**DELETE** or the ARB word for each locale). New paragraph: **I want to start over** → make a new family or group instead. **Restore my account** at sign-in. The summary now says signing in also brings the account back.
- **account-preferences:** step 5 is the **AI features (Google Gemini)** switch (the Preferences card, under Vibration). The summary changed and the keywords gained `ai, gemini`.
- **family-invite:** the code shows under **Invite member**. One person per code. **Get a new code** is on **Invite members**. Sharing works before the email is verified. New alt text for the re-shot picture.
- **start-join:** the note now says a code works for one person and can be already used, expired or cancelled.
- **calendar-repeating / calendar-edit-delete:** choose the scope after **Save**. A greyed choice says why: a new time can't apply to All events, and repeats, all-day, private or extra reminders can't be This event only. Delete read from `delete_event_dialog.dart`: unchanged, the three choices come right away and none are greyed. The Note was rewritten.
- **start-create-family:** new You-step paragraph plus the second picture `start-you-step`. **start-sign-in** got one sentence.
- **calendar-photo / meals-photo / meals-youtube / meals-suggest:** a consent sentence pointing to **Settings** → **AI features (Google Gemini)**.

## English trims (150-word cap)
Each of the four AI articles was already at 140–149 words, so adding consent meant cutting elsewhere:
- **calendar-photo:** dropped "Past dates start unticked." and "PDFs don't work yet" became "For a PDF, photograph the page".
- **meals-youtube:** dropped the "a link to a recipe page" detail.
- **meals-suggest:** dropped "ready for the shopping list" and shortened the Try again line.
- **account-verify-email:** steps 1 and 4 were tightened.

## Pictures
- **Changed** (`account-verify-email`, `calendar-repeating`, `family-invite`): 25/25 locales each. `start-you-step` is new in 25/25 locales. All four are committed with their `help/media*.json` sizes.
- **Unchanged:** `account-delete`, `start-join` and `calendar-edit-delete` came out byte-identical after the re-shoot (mtime 11:03, no git diff). Nothing to commit, and none are missing. `media-gaps.json` is still `{}`.
- **Left uncommitted, as the prompt says:** `static/help/media/en/calendar-photo.webp` (changed, not one of the seven ids), `changelog/whats-new.*.html`, and blog/photos images.

## Build
```
help OK · 71 article(s) · locale(s) en … id · 62 app routes checked
test-check-help OK · 99 cases
help: 64 of 71 article(s) on pages (live 1.6.0) · … en.json 71 articles, 14 tips, 6 checklist · PUBLIC
help <each of 24 locales>: pages + <code>.json 71 articles, 14 tips, 6 checklist · 0 picture(s) in English
build OK · 2034 pages · 2014 in hreflang clusters
detector OK · 32 cases · 28 locale(s) built
```
No WARN lines. Spot checks:
- `de` calendar-repeating reads right: the new scope-after-Save text, with the ARB labels.
- `en` account-delete has 5 steps with **DELETE**.
- `start-create-family` renders both pictures in en and de.

## Notes for the app / English
- **pt ARB:** `verifyHelpButton` "Não recebeste o e-mail?" is European "tu", but the app otherwise uses Brazilian "você". The meal-suggest labels mix the same way.
- **fr ARB:** `aiConsentBody` uses "vous", while the rest of the app uses "tu".
- **id ARB:** `youStepTitle` "Hai! Siapa kamu?" doesn't use the Anda form.
- **nb:** the app says "KI". The older help text says "AI", and some nb files now have both.
- **Same label twice:** tr, zh-Hans, zh-Hant, th and id use the same text for "Invite member" and "Invite members", so the invite note repeats the name.
- **English:** the account-preferences title doesn't mention AI features. I left it as is because the prompt said front matter otherwise stays unchanged.
