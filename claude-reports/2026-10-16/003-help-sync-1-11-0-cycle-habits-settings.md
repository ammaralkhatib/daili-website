# Help sync 1.11.0 — part 2: Cycle, Habits, Settings (+ sign-in line)

**Prompt:** `claude-prompts/2026-10-16/003-help-sync-1-11-0-cycle-habits-settings.md`
**Completed:** 2026-10-16 · **Status:** done

## Summary

The Cycle and Habits topics, the Preferences article and the Sign-in article now match app 1.11.0, in English and all 24 other help languages. `pending` in the routes allowlist is now empty, and every app route has an article. The commit is pushed. `./deploy.sh` was **not** run, and `LIVE_APP_VERSION` is unchanged.

Step 0: there were no planning docs to commit.

## Articles × locales (14 × 25 = 350 files)

| id | kind | media | routes |
|---|---|---|---|
| cycle-start | updated (order 1) | cycle-start (re-shot) | /cycle |
| cycle-calendar | NEW, since 1.11.0 (order 2) | cycle-calendar + cycle-day in the text | /cycle |
| cycle-privacy | updated (order 3); `mediaPending` replaced | cycle-settings | /cycle |
| cycle-supplies | NEW, since 1.11.0 (order 4) | cycle-supplies | /lists/supplies |
| habits-what, -tick, -streaks, -minzi, -private, -reminders | updated (orders moved down by one) | re-shot pictures | unchanged |
| habits-create | updated | habits-create + habits-icons in the text | unchanged |
| habits-categories | NEW, since 1.11.0 (order 3) | habits-categories | /habits (borrowed, see below) |
| account-preferences | updated; title now says "temperature" | account-preferences + account-temperature | /settings |
| start-sign-in | updated: one consent sentence + password typed twice | start-sign-in | unchanged |

- No Cycle article has a tip. No Calendar or Lists article mentions Cycle.
- **How it was done:** I wrote the English first, with `{{arbKey}}` placeholders, and kept every article under the 150-word limit. A sub-agent then checked the English against the app code. After that, 6 sub-agents translated (4 languages each), and a script filled in each language's own app labels.
- **Pictures:** all 23 pictures exist for every language, and nothing is missing. All the cycle, habits and account ids in `help/media*.json` and `static/help/media/**` are now committed, so nothing is orphaned.

## Routes and `pending`

- `/lists/supplies` was removed from `pending`, which is now `{}`. That route resolves to `cycle-supplies`.
- **`/cycle/history` is not in the app's `RoutePaths`.** It is a child route, so `check-help` refuses it. `cycle-calendar` uses `/cycle` instead.
- **The Categories screen has no route.** It opens with `Navigator.push` on top of the "Start a habit" sheet. The guard needs at least one route per article, so `habits-categories` borrows `/habits`.

## Facts corrected against the code

The fact-check found 8 problems in my English. I fixed all of them before translating:

1. **Rest day, Fill in yesterday and Pause:** pressing and holding a **counter** opens the counter sheet, not the menu. These articles now say "open the habit and tap ⋯, or hold a yes/no habit".
2. **The Family tab** shows ONE bar with a part for each person, not one bar per person.
3. **Only an admin** can rename the cat.
4. **Reminder times:** in an "Each of us" habit, only the habit's maker or an admin can change their own time. A normal member can't, because the edit form is read-only for them.
5. **Who can change a habit:** the person who made it. An admin can also change shared habits, but not another adult's "Just me" habit. The old note was wrong about this.
6. **The app switcher:** on iPhone it shows only the daili logo, and on Android it shows a blank card. The article says "the app switcher then hides Cycle".
7. **Preferences:** the language is also saved to your account. The article now says "Except the language, these settings are for this phone only".
8. **Sign-up** asks for the password twice.

**Left out to stay under 150 words:**
- the "Show clear text on the lock screen" switch. The article now says the lock screen "only shows" the short text, which is the default.
- the Cycle Home tile
- the "Period may start" row in the calendar's day sheet
- the Home screen row in Preferences (the article `start-edit-home` is linked)
- that the icon search understands English and German words

## Translator notes

- **pt:** the app's own Cycle supplies text and the pt pictures use European Portuguese ("A tua menstruação… Precisas de algo?", "telemóvel"). The article text is Brazilian. Also, Minzi is "o Minzi" in these articles but "a Minzi" in the app.
- **id:** the supplies card text in the ARB uses the informal "-mu".
- **fr:** the old tipTitle and tipBody in `habits-what` still use "vous". I left them because their English did not change.
- I fixed one pt sentence myself: "Sair da conta **interrompe** os lembretes".

## Verification

Run in the repo, and again in a clean worktree (HEAD + my staged changes only):

```
$ node tools/check-help.mjs
help OK · 92 article(s) · locale(s) en, de, … id · 73 app routes checked
$ npm run build
build OK · 2748 pages · 2728 in hreflang clusters
detector OK · 32 cases · 28 locale(s) built
```

- `dist/help/en.json` has 4 Cycle articles (start, calendar, privacy, supplies) and `habits-categories`. `/lists/supplies` resolves to `cycle-supplies`.
- I spot-read these articles: en `cycle-calendar` and `habits-create`, de `cycle-supplies` and `account-preferences`, ja `habits-minzi`, pt `cycle-privacy` (Brazilian).

## Commit & push

- `2a4a69f` `docs(help): 1.11.0 part 2 — Cycle, Habits, settings` (776 files). Pushed `83d3ed9..2a4a69f`.
- `./deploy.sh` was not run.
- The untracked `static/assets/img/blog/…` and `static/assets/img/photos/` files are not mine and were left untracked.

## Open items for the owner

- App text, worth a later app prompt: the pt ARB uses European Portuguese for Cycle supplies (`cycleSuppliesCardText`, supplies items), and Minzi's gender in pt (o/a) is not the same everywhere.

## Help impact

n/a
