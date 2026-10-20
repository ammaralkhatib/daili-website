# Help: new article "Show daili on a TRMNL display" (all help languages)

## Goal
Daili is about to go public as a plugin on the TRMNL marketplace (TRMNL =
an e-ink wall display, trmnl.com). TRMNL wants a help link on the plugin
listing, and users need one place that explains install, screens and
privacy. Add one new article to the **anywhere** topic, in English and every
`HELP_LOCALES` language, with one picture. Its address will be
`https://daili.app/help/anywhere/trmnl/` — that link goes on the TRMNL
listing, so keep the slug `trmnl`.

**Do not deploy.** Ammar runs `./deploy.sh` himself after checking.

## Sources (facts — do not guess)
- The plugin lives in the API repo `~/Herd/familyplanner-api`:
  `lang/en/trmnl.php` (`install.*`, `manage.*` = the exact labels the user
  sees), `resources/views/trmnl/install/*`, `resources/views/trmnl/manage/show.blade.php`
  (which fields the settings page really shows today — check, some keys are
  older), `claude-prompts/TRMNL-SCREENS-PLAN.md` (§1 screens, §2 weather,
  §6 privacy), CLAUDE.md §3 "TRMNL plugin".
- Translations of the labels: `lang/<locale>/trmnl.php` in the API repo
  (use them so the article matches what users see in their language).

## Article (English, `help/en/anywhere/trmnl.md`)
Front matter as the other `anywhere` articles:
`id: anywhere-trmnl`, `topic: anywhere`, `routes: /`, `since: 1.11.0`
(= `LIVE_APP_VERSION`, so the page shows now), `updated: 2026-10-20`,
`order: 5`, `media: anywhere-trmnl`,
`related: anywhere-wall, anywhere-widgets, calendar-private`
(check each id exists; drop one that doesn't),
keywords incl. `trmnl, e-ink, eink, e-paper, wall display, wall calendar,
kitchen, fridge, dashboard, plugin`.

Title: "Show daili on a TRMNL display".
Summary (one line): your family's calendar, to-dos and lists on a calm
e-ink screen on the wall.

Body — short sentences, the voice of the existing articles, ≤ 210 words:
1. A first paragraph: what TRMNL is in a few words (an e-ink screen you hang
   on the wall; it shows one screen at a time and refreshes on its own),
   and that daili is a free plugin for it.
2. One numbered list (the install):
   1. In TRMNL, open **Plugins**, find **Daili** and install it.
   2. Enter the email of your daili account, then the 6-digit code we email
      you. (Use the real labels from `install.*`.)
   3. Pick your family or group and a **Screen**: Today, 3 days, Week, Month
      or List. Turn on weather if you like. Press **Save and update screen**.
3. A paragraph: to show several screens, add Daili more than once — TRMNL's
   playlist rotates them. Daili also fits half or a quarter of the screen
   (TRMNL "mashups"). Settings later: open the plugin's settings in TRMNL.
4. `![alt](anywhere-trmnl)` — alt: "The Today screen on a TRMNL display:
   the day's events, to-dos, dinner and weather."
5. `> Note:` Private events and private lists never appear on the display.
   Budget, Cycle, Habits and Notes are not shown at all.
6. `> Note:` After you turn the display upright (or back), the screen fits
   itself at the next refresh — or press **Save and update screen**.
7. One sentence on stopping: the plugin settings have **Disconnect**; then
   also remove the plugin in TRMNL. (Check `manage.disconnect*`.)

If the install needs a confirmed email (`install.unverified_*`), say it in
step 2 in half a sentence.

## Picture
- Source: `~/Downloads/Neuer Ordner 3/plugin-750981.png` (Ammar's TRMNL X
  export, 1872×1404, the Today screen). Convert to
  `static/help/media/en/anywhere-trmnl.webp`, 720 px wide, keep the aspect
  ratio, the same quality settings as the other help pictures. Add it to
  `help/media.json`.
- The screen text is English. Add `anywhere-trmnl` to `help/media-gaps.json`
  for every other `HELP_LOCALES` code with the reason
  `"TRMNL screen export, English only"`. No per-locale pictures.

## Also
- `help/en/anywhere/wall.md`: add `anywhere-trmnl` to its `related` (no other
  change; do not bump its `updated`, so translations don't go stale).

## Translations
Translate the new article into every `HELP_LOCALES` language following
`claude-prompts/2026-09-24/HELP-TRANSLATION-RULES.md`, using the plugin's own
labels from `lang/<locale>/trmnl.php` (screen names, **Save and update
screen**, **Disconnect**) and the app's terms for "family or group". Keep
"TRMNL" and "Daili" (plugin name in TRMNL) as they are.

## Scope
- In: `help/en/anywhere/trmnl.md` + its 24 translations,
  `help/en/anywhere/wall.md` (`related` only), `help/media.json`,
  `help/media-gaps.json`, `static/help/media/en/anywhere-trmnl.webp`,
  `npm run build`.
- Out: the API repo (read only), other articles, `LIVE_APP_VERSION`, legal,
  home page, blog, feature pages (prompts 2026-10-16/005–007 are another
  lane). 🔴 Untracked files that are not yours
  (`static/assets/img/blog/…`, `static/assets/img/photos/`): leave them
  untracked.

## Verify
`npm run build` green and `node tools/check-help.mjs` green. Spot-check
`dist/help/anywhere/trmnl/index.html` (en), `dist/de/help/anywhere/trmnl/`
and `ja`. `dist/help/en.json` lists the article. The picture loads.

## Commit & push
`docs(help): TRMNL display article`; body
`Prompt: claude-prompts/2026-10-20/001-help-trmnl.md`.
**Push. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-10-20/001-help-trmnl.md`, half a page: articles ×
locales, labels you took from the plugin, facts you corrected against the
code, build lines, SHA + push. `## Help impact`: new article anywhere-trmnl.
