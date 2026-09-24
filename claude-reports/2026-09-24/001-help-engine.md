# 001 — Help center engine: report

Prompt: `claude-prompts/2026-09-24/001-help-engine.md`
Commits: `10f369d` docs(plan): add help engine prompt · `345ca9d` feat(help): help center engine, /help pages, en.json, route guard + 3 sample articles
**Pushed** to `origin/main`. Nothing deployed.

## Result

`npm run build` is green. The chain is now check-content → check-legal → **check-help → test-check-help** → build → check-build → test-detector.

```
help OK · 3 article(s) · 54 app routes checked
test-check-help OK · 55 cases (1 clean fixture + every guard rule planted and caught)
built 141 pages · 28 locale(s) · 132 sitemap entries
help: 3 of 3 article(s) on pages (live 1.6.0) · 3 topic(s) · en.json 3 articles, 2 tips, 1 checklist · noindex preview
build OK · 141 pages · 114 in hreflang clusters
```

`dist/help/` has `index.html`, three topic pages (`start/`, `family/`, `calendar/`), three article pages, `en.json`, `media/en/*.webp`, `media/minzi-look-right.webp` and `.htaccess`.
`grep -c noindex dist/help/index.html` → 1. No `/help/` URL in `dist/sitemap.xml`. No footer links to `/help/`.

## Article format

The format table is unchanged from the prompt. Some small rules I added, all in `tools/help-lib.mjs`:
- Steps must be numbered 1, 2, 3, … in order, and each step fits on one line. A line of text right after a step is an error, not a hidden continuation.
- An image needs non-empty plain alt text.
- A `>` line that isn't `> Note: …` is an error.
- A single `*` (not `**…**`) is an error.
- Unknown and repeated front-matter keys are errors.
- `related` can't point at the article itself.
- An allowlist entry needs a reason, and a route can't be in both `never` and `pending`.
- A missing `media` is a **warning** with `// TODO(phase 2)`, as asked.

## Corrections from the app code (`../familyplanner-app`)

- **Invite, step 1:** "open Family from Home" became "On Home, tap **Family**". The Home tile is labelled `Family` (`dashboardTileFamily`).
- **Invite, step 3:** the tabs on the invite screen are **Code** and **QR code**, and the button is **Share link** (`familyInviteTabCode`, `familyInviteTabQr`, `familyInviteShareButton`).
- **Invite, step 4:** added **Scan QR code**, the real button on the join screen (`joinFamilyScanButton`). **Join a family or group** is correct.
- **Invite, note (expiry):** the prompt said "a few days". The server's invite lifetime is **7 days**: `InviteLinkStore.maxAge = Duration(days: 7)`, which the code says "matches the server's invite lifetime". The invite screen shows "Valid until {date}". There is no "new code" button. Opening **Invite member** again shows a new code when the old one has expired (or has less than 24 hours left; see `pickShareableInvite`). The note now says: "A code works for 7 days, and the screen shows until when. After that, tap **Invite member** again for a new one."
- **Invite `since` 1.3.0:** confirmed. "Invite members with a QR code or a share link" is in the 1.3.0 CHANGELOG section.
- **Phone calendars, step 4:** **Choose calendars** only appears while the **Show phone calendars** switch is on (`calendar_settings_screen.dart`, `if (selection.enabled)`), so the step now says to check that first. The other labels are exact: the gear top right (tooltip "Calendar settings"), **Phone calendars**, **Connect**, **Choose calendars**.
- **Phone calendars `since` 1.3.0:** the feature was already in the 1.2.0 build but held back and not announced. The CHANGELOG first announces it in 1.3.0, and the separate "choose calendars" screen the steps describe arrived there too. Using 1.2.0 would have described a UI that app version may not have.
- **Home:** four steps written from `home_dashboard_view.dart`, `week_strip_hero.dart`, `dashboard_quick_add_fab.dart` and the edit mode:
  - the week card (tap it to see each day and add an event);
  - tiles with the small arrow (`Show summary`);
  - the round **+** (Add event / Add shopping list / Add to-do list / Open meal plan);
  - press and hold to drag, or tap **×**, then **Done**.
  The note adds Settings → **Home screen** (`settingsHomeTilesTitle`), opened by tapping your picture on Home. So `routes: /, /settings/home-tiles`.
  - **Open point:** `since: 1.0.0` as the prompt asked. But long-press rearranging arrived in 1.6.0 and choosing tiles in 1.2.0. So app versions 1.0–1.5 will show a step 4 they can't do. When the app starts filtering by version, you may want this at 1.6.0, or step 4 split into its own article.

## Allowlist

`help/routes-allowlist.json`: **48 `pending`** routes still need an article. `never` has 2: `/maintenance` and `/dev/assets`. The app has 54 routes (parsed from `class RoutePaths`, including `/lists` and the `:id` templates). The 3 articles cover `/`, `/settings/home-tiles`, `/family/invite` and `/calendar/settings`.

## Trimmed `en.json` example

```json
{
  "schema": 1, "locale": "en", "liveAppVersion": "1.6.0",
  "articles": [{
    "id": "family-invite", "topic": "family",
    "title": "Invite someone to your family",
    "summary": "Share a 6-digit code, a QR code or a link. They join in seconds.",
    "keywords": ["invite", "add member", "partner", "code", "qr", "join", "link", "share"],
    "routes": ["/family/invite"], "tryIt": "/family/invite",
    "since": "1.3.0", "updated": "2026-09-24",
    "blocks": [
      { "type": "p", "text": "Everyone in your family sees the same calendar, lists and birthdays." },
      { "type": "steps", "items": ["On Home, tap **Family**.", "Tap **Invite member**.", "…"] },
      { "type": "image", "src": "https://daili.app/help/media/en/family-invite.webp?v=ddc68bce",
        "alt": "The Family screen with the Invite member button", "w": 720, "h": 688 },
      { "type": "note", "text": "A code works for 7 days, and the screen shows until when. After that, tap **Invite member** again for a new one." }
    ],
    "related": ["start-home"]
  }],
  "tips": [{
    "id": "family-invite", "article": "family-invite", "title": "Plan it together",
    "body": "Invite your partner. You both see the same calendar and lists.",
    "skipIf": "hasOtherLoginMember", "priority": 90, "since": "1.3.0",
    "media": "https://daili.app/help/media/en/family-invite.webp?v=ddc68bce"
  }],
  "checklist": [{ "order": 1, "article": "family-invite", "title": "Invite someone to your family",
                  "doneIf": "hasOtherLoginMember", "tryIt": "/family/invite" }]
}
```

## `test-check-help` covers every rule in Req. 5

It plants at least one case per rule in a temporary fixture (fake `route_names.dart`, 2 topics, 2 articles, media files) and checks that the guard reports it. It also checks that the clean fixture passes. 55 cases:
- **Parse errors:** `#` heading, `-` and `*` bullets, `[link]()`, backticks, `_emphasis_`, raw HTML, a stray `*`, a second numbered list, 8 steps, wrong step numbering, 3 images, an image inside a paragraph, a non-note quote, 151 words, an unknown key, a missing required key, title > 70, summary > 140, 13 keywords, an upper-case keyword, bad `since`, an impossible `updated` date, a non-integer `order`, unclosed front matter.
- **IDs:** id doesn't match the path, duplicate id, topic folder not in `HELP_TOPICS`, `topic` doesn't match the folder.
- **Routes:**
  - **renamed app route** (the article still names the old route);
  - removed route used by `tryIt`;
  - `tryIt` containing `:`;
  - an app route with no article;
  - **stale `pending` entry now covered by an article**;
  - stale `pending` entry whose route is gone;
  - stale `never` entry whose route is gone;
  - an allowlist entry with no reason;
  - `route_names.dart` missing (the message names `DAILI_APP_REPO`).
- **References:** unknown `related`, unknown tip skip key, unknown checklist skip key, unknown icon, tip half-filled, tip priority out of range, tip title > 60, checklist half-filled, a repeated checklist order.
- **Media:** front-matter id missing from `media.json`, body image id missing, file missing on disk, orphan entry, missing `w`/`h`.
- **The CLI itself:** with no app repo it exits 1 and names `DAILI_APP_REPO`. With `HELP_SKIP_ROUTE_CHECK=1` it exits 0 and prints the loud warning.

Proof that it really fails:
1. I planted `help/en/family/bad.md` by hand. `check-help` exited 1 and listed 8 errors with file:line: heading, backticks, link, bullet, upper-case keyword, `tryIt` with `:`, bad `since`, and the renamed route `/family/invite-members`. After I removed the file it exited 0.
2. I turned off the stale-`pending` rule in `help-lib.mjs`. `test-check-help` then exited 1 with `stale pending entry (now covered): … (no errors — the guard let it through)`. After I put the rule back it passed.

## Pages

I checked them in headless Chrome at 390 px (iframe harness) and at 1100 px.
- **Help home:** Minzi sits to the right of the title, and stacks under it below 380 px. Typing "invite" shows the article under "Results", above the topics. The 2-column topic cards show an icon badge and "1 article". The dashed "Still stuck?" card is a `mailto:` link.
- **Article:** round green step numbers, `**bold**` rendered as `<strong>`, the figure with its caption, the note in a mint box, Related, Still stuck, "Updated 24 September 2026", and the store badges.
- There is no "New in version 1.6.0" section, because no article has `since: 1.6.0`.
- `help-search.js` is content-hashed (`help-search.<sha8>.js`) and loaded only on `/help/`. The index is `<script type="application/json" id="help-index">`. There is no fetch and no inline executable script. check-build section 16 now fails any help page with an inline script that isn't JSON.

## Things to know

- **`.htaccess` needed one more file than the prompt planned.** The last rule in the root `.htaccess` denies every `*.json` file (so `package.json` can never be served). Without a fix, `/help/en.json` would return **403** in production. I did **not** touch that rule or the CSP. I added `static/help/.htaccess`, which allows files named like `en.json` / `de.json` in `/help/` only. The JSON cache rule (`max-age=300`) is in the root file next to the other caching rules, as asked. **After the first deploy, check it:** `curl -sI https://daili.app/help/en.json` should give 200 with `cache-control: public, max-age=300`. `npm run serve` can't test Apache rules.
- `nav.help` is in all 28 content files. Dutch is "Hulp" rather than "Help", because check-content fails strings that are identical to English. `zh-Hant` is "說明" and `sk` is "Pomocník".
- Copied files arrived as mode 600, so I set them to 644 like the rest of `static/`.
- `README.md` has a short "Help center" section, and its guard-chain line is updated.
- I didn't commit the unrelated edits that were already in the working tree (changelog, `BLOG-POST-TEMPLATE.md`, `blog-seo-plan-2026-09.md`, blog drafts).

## Open item for Ammar

Nothing to deploy yet. Deploying is optional: with `HELP_PUBLIC = false` the pages are a noindex preview at https://daili.app/help/, linked from nowhere. If you do deploy, run the `curl -sI https://daili.app/help/en.json` check above.

Help impact: new help center. 48 routes are pending articles (`help/routes-allowlist.json`).
