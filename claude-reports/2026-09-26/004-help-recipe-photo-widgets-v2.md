# Help 1.7.0 part 3: "Save a recipe from a photo" + widgets v2 — 25 languages

**Prompt:** `claude-prompts/2026-09-26/004-help-recipe-photo-widgets-v2.md`
**Completed:** 2026-09-26 · **Status:** done (three fact fixes against the prompt, see below)

## What changed
- **New `meals/photo.md`** (`meals-photo`, `since: 1.7.0`, tip priority 47, frontmatter as in the prompt). Labels come from `app_en.arb` at app `578c964f`: **From a photo**, **Take photo** / **Choose from library** (the shared photo sheet), **Read this photo**, **New recipe**, **Create**. Privacy note and free-reads note like `calendar-photo`.
- **Meals order**: photo 4, paste 5, search-online 6, plan-week 7, to-shopping 8, copy-week 9.
- **`anywhere/widgets.md` rewritten for widgets v2**: all 9 widgets by their real names (from the widget string files), tick on the widget, the **+**, iPhone lock screen, "Android has no lock-screen widgets". `mediaPending` and the tip are kept.
- **Split**: it didn't fit in 150 words, so there is a new **`anywhere/widgets-settings.md`** ("Choose what a widget shows", `since: 1.7.0`, `mediaPending`). To keep it next to the widgets article, I moved **web → 3** and **wall → 4** (only the `order` line).
- **24 translations** of all three. Button names come from each language's ARB. The privacy note is copied from that language's `calendar-photo`.

## Fact fixes (the prompt said something the code doesn't do — please check)
1. **Lock screen.** The prompt said "Next up, Quick note, Quick add". In the code (`FamCanvasWidgetsBundle.swift`, `LockWidgets.swift`), the lock screen has **Next up**, **New note**, and small counters for **to-dos, shopping and habits**. **Quick add is home screen only.** I wrote what the code does.
2. **No family choice per widget.** The prompt said "choose family/group". CLAUDE.md §3 locks "no per-widget family picker", and the settings only have List / Mine–Everyone / Family–Only mine. The article says a widget always follows the active family or group.
3. **The recipe form's button is "Create"** (`recipeCreateSave`), not "Save". Same as the paste article.

## Worth knowing
- **The widget settings screen is only in English and German** (iOS `Localizable.strings` and Android `strings.xml` have en + de only). So the other 23 languages show **List / Most recent / Show / Mine / Everyone / Family / Only mine / Done** in English on the phone. Their articles use those English words and say "these settings are in English for now". If the widget strings get translated later, those articles need a small update.
- iOS's own "Edit Widget" menu item is written as plain words (not bold) in the translations, because I don't have Apple's exact wording in every language. German uses **Widget bearbeiten**.
- Settings and ticking on iPhone need iOS 17+ (report 2026-09-24/004). The settings article says so.

## Pictures (`media-gaps.json`)
**No gaps — it stays `{}`.** All 25 languages have the new `meals-photo` shot and the four re-shot chooser shots (`meals-add-recipe`, `meals-import-link`, `meals-paste`, `meals-youtube`). I committed them (125 `.webp` files + 25 manifests). I looked at the English `meals-photo`: **From a photo** is circled.

## Verification
- `node tools/check-help.mjs`: help OK, 70 articles, 25 locales, 60 app routes.
- `npm run build`: build OK, 2034 pages, 70 articles / 13 tips / 6 checklist rows in every locale, "0 picture(s) in English" everywhere.
- `npm test`: detector OK, test-check-help OK (99 cases).
- `dist/help/en.json`: `meals-photo` tip (priority 47, skipIf hasRecipes) is there, with its picture. The 1.7.0 pages appear on the website only after the release bumps `LIVE_APP_VERSION`.
- The step-0 commit found a 50-minute-old `.git/index.lock` with no git process running. I removed it.

## Not committed (other lanes)
`changelog/whats-new.{en,de}.html`, `claude/blog-seo-plan-2026-09.md`, `claude/blog-drafts/*`, `claude/website-scroll-story-2026-09-18.md`, `static/assets/img/blog/what-to-look-for-family-app.webp`, `static/assets/img/photos/`.

## SHAs
- `ca0a0dc` docs(plan): sync planning docs
- feat(help): recipe from a photo + widgets v2 — see `git log` (this report is part of it). Pushed to `origin/main`.

## Help impact
meals-photo, anywhere-widgets-settings: new articles (1.7.0). anywhere-widgets: rewritten for widgets v2.

## Open items for Ammar
- Optional app follow-up: translate the widget settings strings (12 on Android, 11 on iOS) into the other 23 languages, then update the settings articles.
- Pictures for `anywhere-widgets` and `anywhere-widgets-settings` are still `mediaPending` (hand-made).
- After the release bump: `./deploy.sh`.
