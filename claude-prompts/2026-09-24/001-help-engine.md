# Help center engine: article format, /help pages, en.json for the app, search, guard

## Goal
daili gets a Help center (Ammar, 2026-09-24). **One library of short
articles, written once, shown in three places:** daili.app/help (this repo),
a Help screen in the app, and a tips sheet in the app. The app reads the
same articles from a data file this build writes: `dist/help/en.json`.

This prompt builds the **engine** plus **3 sample articles**, English only:
the article format and its parser, the help pages, `en.json`, a small
search, and a **guard** that fails the build when an app screen has no
article or an article points at a screen that no longer exists. Writing the
other ~40 articles comes in later prompts.

"Done" = `npm run build` is green with the new guard in the chain, and
`dist/help/` holds a working help home, 3 topic pages, 3 articles and
`en.json`. Everything stays `noindex` and out of the footer until the switch
`HELP_PUBLIC` is turned on.

The full plan is `claude-prompts/HELP-PLAN.md` in the **app** repo
(`../familyplanner-app/claude-prompts/HELP-PLAN.md`). Read §2–§3 and §7 if
anything below is unclear. The design reference (app screens, same structure)
is the Claude Design canvas "Daili Help & Tips". You don't need it: the
structure is described in Requirement 6.

## Scope
- **In:** new `help/` folder (sources), new `tools/help-lib.mjs`,
  `tools/check-help.mjs`, `tools/test-check-help.mjs`, three new templates,
  `build.mjs` (help pages + `en.json` + hashed search script),
  `site.config.mjs` (`HELP_TOPICS`, `LIVE_APP_VERSION`, `HELP_PUBLIC`),
  `static/assets/help-search.js` (new), `static/assets/style.css` (help
  styles), `static/.htaccess` (one cache rule for `help/*.json`),
  `package.json` (build chain), `tools/check-build.mjs` (help pages carry no
  hreflang, like blog pages), `content/*.json` (only the new `nav.help` key),
  `README.md` (one short section about the help folder).
- **Out:** the landing page and scroll story, the blog, legal pages, the CSP
  line in `.htaccess`, `deploy.sh`, and the app repo (read it, never write it).
- **Not in this prompt (later ones):** 👍👎 and "search found nothing" counts,
  the privacy-policy sentence, the CSP `connect-src` change, and the rest of the
  articles.

## Requirements

### 1. Source layout
```
help/
  en/<topic>/<slug>.md      one file per article
  media.json                media id → { file, w, h, kind: "image" | "clip", poster? }
  skip-keys.json            the allowed tipSkipIf / checklistDoneIf keys (array of strings)
  routes-allowlist.json     { "never": { "<route>": "<why>" }, "pending": { "<route>": "<why>" } }
static/help/media/en/       the image files named in media.json
```
- `skip-keys.json` starts with: `hasOtherLoginMember`, `hasManagedMember`,
  `hasSecondFamily`, `hasGoogleCalendar`, `hasPhoneCalendars`, `hasHabits`,
  `hasRecipes`, `hasMealPlan`, `hasCelebrations`, `hasCalendarLink`,
  `digestOn`, `notificationsOn`, `hasWidget`, `hasEvent`, `hasListItem`,
  `hasInvitePending`.
- `routes-allowlist.json`: `never` = `/maintenance` and `/dev/assets` (a reason
  each). `pending` = **every other route** of the app that the 3 sample
  articles don't cover, each with the reason `"article not written yet"`. This
  list is the to-do list for the article prompts: it shrinks as articles
  arrive.

### 2. Article format (`help/en/<topic>/<slug>.md`)
Front matter: flat `key: value` lines between `---` lines. **No nesting, no
YAML library** (the repo stays at zero dependencies). Lists are
comma-separated. Keys:

| key | required | rule |
|---|---|---|
| `id` | yes | must equal `<topic>-<slug>` from the path |
| `topic` | yes | a key of `HELP_TOPICS` and the folder name |
| `title` | yes | ≤ 70 chars |
| `summary` | yes | ≤ 140 chars |
| `keywords` | yes | 1–12, comma list, lower case |
| `routes` | yes | 1+ app routes this article explains (comma list), each must exist in the app (Req. 5) |
| `tryIt` | no | one app route with **no `:`** in it |
| `since` | yes | `x.y.z`, the first app version that has this |
| `updated` | yes | `YYYY-MM-DD` |
| `order` | no | integer; sorts articles inside a topic (then by title) |
| `media` | no* | a media id from `media.json` (*the guard warns, not fails, when missing, until phase 2 turns it into a failure; leave a `// TODO(phase 2)` at that spot) |
| `related` | no | comma list of article ids that exist |
| `tipTitle`, `tipBody`, `tipSkipIf`, `tipPriority` | no | all-or-nothing: title ≤ 60, body ≤ 120, skip key from `skip-keys.json`, priority integer 1–100 |
| `checklist`, `checklistDoneIf` | no | both or neither: integer order (unique across all articles), key from `skip-keys.json` |

Body: a **small subset of Markdown on purpose**, so the app renderer stays
small:
- paragraphs (blank-line separated);
- **one** numbered list per article (`1. ` lines), at most **7** steps;
- `![alt text](media-id)` on its own line (one image per article is enough;
  allow at most 2);
- a note: a line starting `> Note: `;
- inline: `**bold**` only (for button names).

Anything else is a **build error with file:line**: `#` headings, `-`/`*`
bullets, `[links](…)`, backticks, `_emphasis_`, raw HTML, a second numbered
list. Body length ≤ 150 words (steps + paragraphs + note).

### 3. `tools/help-lib.mjs` (shared by build and guard)
- `loadHelp({root, locale:'en'})` → `{ topics, articles, errors, warnings }`.
  It parses every article into `{ meta, blocks }`. `blocks` is an ordered array
  of `{type:'p', text}`, `{type:'steps', items:[…]}`,
  `{type:'image', media, alt}`, `{type:'note', text}` (text keeps `**`
  markers). It collects **every** error (file:line + message), not only the
  first.
- `readAppRoutes(appRepoPath)` → the set of route strings from
  `lib/core/routing/route_names.dart`, parsed from the `class RoutePaths`
  block's `static const x = '/…';` lines. The app repo path comes from
  env `DAILI_APP_REPO`, default `../familyplanner-app`.

### 4. `site.config.mjs`
- `HELP_PUBLIC = false`. While false: every help page gets
  `<meta name="robots" content="noindex">`, help pages are **not** in
  `sitemap.xml`, and the footer has no Help link. `en.json` is still built.
- `LIVE_APP_VERSION = '1.6.0'`. The **pages** hide articles whose `since` is
  newer (a page must never explain a feature people can't download yet).
  `en.json` keeps **all** articles; the app filters by its own version.
- `HELP_TOPICS`, in this order: `start` Getting started (icon `start`),
  `family` Family & groups (`people`), `calendar` Calendar (`calendar`),
  `lists` Lists & to-dos (`list`), `meals` Meals & recipes (`meal`),
  `birthdays` Birthdays (`cake`), `habits` Habits & Minzi (`paw`), `vault`
  Documents & photos (`folder`), `anywhere` Widgets, web & wall (`widget`),
  `notifications` Notifications (`bell`), `account` Settings & account
  (`user`). Each gets a one-line English `summary` (write it; ≤ 90 chars). The
  icon names are a fixed vocabulary the app maps to its own icons. Put them in
  one exported array `HELP_ICONS` and have the guard check them.

### 5. The guard: `tools/check-help.mjs` (runs in `npm run build`, before `build.mjs`)
Fails (exit 1, every problem listed with file:line) when:
- any parse error from Req. 2 happens;
- an id is duplicated, or doesn't match its path;
- `routes` or `tryIt` names a route the app doesn't have (**this catches
  renamed or removed screens**), or `tryIt` contains `:`;
- **an app route is covered by no article** and is not in `never` or
  `pending`;
- **a stale allowlist entry:** a route in `pending` that an article now covers,
  or any entry (`never`/`pending`) that is not an app route any more;
- `related`, a skip key or an icon names something unknown; tip or checklist
  fields are half-filled; checklist orders repeat;
- a media id is missing from `media.json`, a `media.json` file is missing on
  disk, a `media.json` entry is referenced by no article (orphan), or `w`/`h`
  are missing.
- When `route_names.dart` can't be found: fail with a clear message naming
  `DAILI_APP_REPO`. Only `HELP_SKIP_ROUTE_CHECK=1` skips the route checks, and
  then it prints a loud warning.

**Prove the guard can fail** (the guard-test rule): `tools/test-check-help.mjs`
builds a temporary fixture folder (a fake `route_names.dart`, topics, a few
articles) and asserts that each failure above is really reported: at least
one planted case per rule, **including the stale `pending` entry and the
renamed route**. It also asserts a clean fixture passes. Add it to the build
chain after `check-help`.

### 6. Pages (English only, like the blog: `locales: ['en']`, `cluster: null`, no hreflang)
Use the site's **own** look (its fonts, colours, card and spacing tokens in
`style.css`, the blog post page as the model). The layout matches the app
design:
- **`/help/`** (`templates/helpindex.html`): h1 "How can we help?", the
  line "Short guides for everything in daili.", Minzi sitting to the right of
  the title and line, vertically centred
  (`static/help/media/minzi-look-right.webp`, 96 px, `alt="Minzi the cat"`;
  stacked under the text on narrow screens), a labelled search field, "New in
  version {LIVE_APP_VERSION}" (articles whose `since` equals it; the section
  is left out when there are none), a 2-column grid of topic cards (icon
  badge, title, "N articles"; a topic with no visible article is not shown),
  and a last dashed card "Still stuck? Write to us" → `mailto:support@daili.app`.
- **`/help/<topic>/`** (`templates/helptopic.html`): topic title + summary,
  then a list of its articles (title + summary, chevron).
- **`/help/<topic>/<slug>/`** (`templates/helparticle.html`): a small topic link
  above the title, h1, summary, the image in a `<figure>` with its alt as
  `<figcaption>` and real `width`/`height`, the numbered steps with round
  number badges, the note as a soft box, "Related" (if any), "Still stuck?
  Write to us", "Updated {date}", and the store badges include. Button names
  (`**bold**`) render as `<strong>`.
- Media URLs carry a cache-buster: `…/help/media/en/<file>?v=<sha8 of the
  file>`. (Images are cached 30 days by `.htaccess`, and help pictures get
  re-shot under the same name.)
- **Search, no fetch:** the help home embeds its index as
  `<script type="application/json" id="help-index">…</script>` (not
  executable, so the CSP is untouched). `static/assets/help-search.js`
  (content-hashed like `script.js`, loaded only on `/help/`) filters as you
  type over title, summary, keywords and body text, and shows matching
  articles as a list above the topics. Without JS the page still shows every
  topic.
- Footer: when `HELP_PUBLIC` is true, add a "Help" link to
  `renderFooterLinks`, English target with `hreflang="en" lang="en"` like the
  blog link. Its label is a new content key `nav.help`: add it to **every**
  `content/<loc>.json` (a real translation of "Help" in each language; `en.json`
  gets an `@help` description). check-content must stay green.
- `tools/check-build.mjs`: extend the blog's "no hreflang" check to every page
  under `/help/`.

### 7. `dist/help/en.json` (the app's data file)
```
{ "schema": 1, "locale": "en", "generated": "<ISO date-time>",
  "liveAppVersion": "1.6.0",
  "topics":   [{ "id", "title", "icon", "summary", "articles": [ids, in order] }],
  "articles": [{ "id", "topic", "title", "summary", "keywords": [],
                 "routes": [], "tryIt": null|"…", "since", "updated",
                 "blocks": [ … as Req. 3, with image blocks expanded to
                             {"type":"image","src":"https://daili.app/help/media/en/<file>?v=<sha8>","alt","w","h"} ],
                 "related": [] }],
  "tips":      [{ "id": "<article id>", "article": "<article id>", "title", "body", "skipIf", "priority", "since", "media": "<src or null>" }],
  "checklist": [{ "order", "article", "title", "doneIf", "tryIt" }] }
```
- Only topics with at least one article. Article order = `order`, then title.
- `.htaccess`: one new `<FilesMatch "\.json$">` block with
  `Cache-Control "public, max-age=300"` (place it with the other caching
  rules, before the hashed-file block).

### 8. The three sample articles
Write these to prove the engine end to end. **Before writing, read the app's
real labels in `../familyplanner-app/lib/l10n/app_en.arb` and the screens, and
fix any button name or step below that doesn't match the app.** Use the
exact English label, and say in the report what you corrected. Media: copy
the files from `claude-prompts/2026-09-24/assets/` into
`static/help/media/en/` (and `minzi-look-right.webp` into
`static/help/media/`). Read their `w`/`h` from the files, or use the values
in brackets.

a. `help/en/family/invite.md`: id `family-invite`, title "Invite someone to
   your family", summary "Share a 6-digit code, a QR code or a link. They join
   in seconds.", routes `/family/invite`, tryIt `/family/invite`, since
   `1.3.0` (the QR/link invite shipped in 1.3.0 per the app CHANGELOG), media
   `family-invite` (`family-invite.webp`, 720×688), related `start-home`.
   Body: "Everyone in your family sees the same calendar, lists and
   birthdays." Steps: open **Family** from Home; tap **Invite member**; share
   the 6-digit code, show the QR code, or share the link; they open daili, tap
   **Join a family or group** and type the code (or scan the QR). Note: a code
   works for a few days; you can make a new one any time. **Check the real
   expiry wording in the code before stating it.** Tip:
   `tipTitle: Plan it together`, `tipBody: Invite your partner. You both see
   the same calendar and lists.`, `tipSkipIf: hasOtherLoginMember`,
   `tipPriority: 90`. Checklist: `checklist: 1`, `checklistDoneIf:
   hasOtherLoginMember`.
b. `help/en/calendar/phone-calendars.md`: id `calendar-phone-calendars`,
   title "Show your phone's calendars in daili", summary "Work, school or
   sports calendars next to family events. Only you see them.", routes
   `/calendar/settings`, tryIt `/calendar/settings`, media
   `calendar-phone-calendars` (720×420). Steps: open **Calendar**; tap the
   settings button (gear) at the top right; under **Phone calendars** tap
   **Connect** and allow access; tap **Choose calendars** and pick the ones
   to show. Note: these calendars stay on this phone; the rest of your family
   doesn't see them. Set `since` from the app CHANGELOG. Tip: title "See your
   phone's calendars in daili", body "Work, school or sports calendars can show
   up next to family events.", skip `hasPhoneCalendars`, priority 70.
c. `help/en/start/home.md`: id `start-home`, title "A quick tour of your
   Home screen", routes `/`, tryIt `/`, media `start-home` (720×1564),
   since `1.0.0`. Write 2–4 steps from the real Home screen code: the week card
   at the top, the tiles that open each area, the **+** button, and where to
   hide or reorder tiles (that page's route is `/settings/home-tiles`: add it
   to `routes` too if the article explains it). Keep it true to the code, and
   short.

## Constraints
- **Zero dependencies stays true.** Node standard library only (no
  markdown/YAML/image packages).
- `npm run build` green (check-content → check-legal → **check-help →
  test-check-help** → build → check-build → test-detector). Self-correct up to
  2 tries.
- The CSP line in `.htaccess` is **not** changed. No inline executable
  script, no fetch, no third-party request, no cookie. The privacy policy's
  promises must stay literally true.
- Brand rule: "daili" lowercase in display text, "Daili" only inside
  sentences where the site already does that.
- Write every file with the file-write tool, never a shell heredoc (in
  Ammar's shell `cat` is `bat`, and heredocs write empty files). Check `wc -c`
  on anything you create from the shell.
- Don't write anything into `../familyplanner-app`.

## Verify
- `npm run build`, then show that `node tools/test-check-help.mjs` really
  fails when you plant one bad article by hand (then remove it).
- `ls dist/help dist/help/*/ dist/help/media/en`, and `node -e` a quick look
  at `dist/help/en.json`: 3 articles, 2 tips, 1 checklist row, image `src`s
  with `?v=`.
- `grep -c noindex dist/help/index.html` → 1 (HELP_PUBLIC is false), and
  no `/help/` URL in `dist/sitemap.xml`.
- `npm run serve` → open `/help/`, type "invite" in search (JS on) and see the
  article; open it at phone width.

## Commit & push
- `feat(help): help center engine, /help pages, en.json, route guard + 3 sample articles`.
  Body: `Prompt: claude-prompts/2026-09-24/001-help-engine.md`.
- First, as its own commit `docs(plan): add help engine prompt`: this prompt
  file and `claude-prompts/2026-09-24/assets/` (Planning Claude wrote them from
  Cowork and can't run git there).
- **Push now.** (This repo has no auto-deploy. `./deploy.sh` is manual, and with
  `HELP_PUBLIC=false` a deploy is harmless: the pages are noindex and
  unlinked.) On push failure, stop and report; never force.

## Report
`claude-reports/2026-09-24/001-help-engine.md` (mkdir -p; file-write tool;
check `wc -c` > 0). Include:
- the final article format table, if you changed anything, and why;
- which sample-article labels or facts you corrected from the app code;
- the `pending` count in `routes-allowlist.json` (how many screens still need
  an article);
- a trimmed `en.json` example (one article, one tip);
- that `test-check-help` covers every rule in Req. 5 (list them);
- SHA, pushed or not.
- Open item for Ammar: nothing to deploy yet. Deploying is optional
  (noindex preview at https://daili.app/help/).
