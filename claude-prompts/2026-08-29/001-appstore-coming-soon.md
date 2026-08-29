# App Store badge → "coming soon" (site-wide, all 23 locales)

## Goal
The iOS build was rejected by Apple review and a new build has not been
submitted yet, so `https://apps.apple.com/app/id6800427546` is a 404 in every
storefront. Today the site still renders that URL as a real link in three
places, and on an iPhone the sticky bottom CTA points at it too — so every
iPhone visitor who taps "Download" lands on an Apple error page.

Replace the App Store **link** with a **non-link "coming soon" chip** that,
when tapped, reveals one short sentence under the badges. Google Play is
untouched and stays a normal working link.

Done = `apps.apple.com` appears **nowhere** in `dist/`, the badge row still
looks balanced on every page and in every one of the 23 locales, and a
build-time guard fails if the dead URL ever creeps back in.

## Scope
- In: `site.config.mjs` (the `stores` block), `templates/_storebadges.html`,
  `build.mjs` (the `site:` view object + the unverified warning),
  `static/assets/script.js`, `static/assets/style.css`,
  `tools/check-build.mjs` (new guard), and all 23 `content/*.json`.
- Out: everything else. **No** changes to the Google Play URL, the legal
  pages, `tools/check-content.mjs`, the language detector, the sitemap, or the
  `daili-web` / `familyplanner-app` repos.

## Requirements

### 1. One switch in `site.config.mjs`
Add an `available` flag to both stores and set iOS to `false`:

```js
export const stores = {
  ios: {
    url: 'https://apps.apple.com/app/id6800427546',
    // 2026-08-29: the build was REJECTED by App Review; a new build has not
    // been submitted. `available: false` is the switch — the badge renders as
    // a non-link "coming soon" chip and this URL is never written into the
    // HTML. Flip to true (and re-check the URL resolves) when the listing is
    // actually public.
    available: false,
    verified: false,
  },
  android: {
    url: 'https://play.google.com/store/apps/details?id=app.daili',
    available: true,
    verified: true,
  },
};
```

Flipping `available` back to `true` must be the **only** edit needed to
restore the working link (plus the guard's expectation, see §6).

### 2. Badge markup — `templates/_storebadges.html`
The engine has `{{? cond }} … {{/}}` sections but **no inverted section**.
Do **not** add one and do **not** move markup into `build.mjs`. Instead pass
two booleans from `build.mjs` into the view object and use two `{{? }}`
blocks:

- `site.iosAvailable` → the existing `<a href="{{ site.iosUrl }}">` badge,
  byte-identical to today.
- `site.iosSoon` → a `<button type="button" class="store-badge soon"
  data-store="ios" aria-expanded="false">` with the **same Apple SVG** and
  `<span><small>{{ store.appleSoon }}</small>App&nbsp;Store</span>`.

When iOS is unavailable, `site.iosUrl` must not be emitted anywhere — do not
render it into a `data-` attribute "for later".

Also:
- Add `data-store="ios"` / `data-store="android"` to **both** badges in both
  branches. `script.js` currently identifies the Apple badge by sniffing
  `href` for `apps.apple.com`; that string is about to disappear, so the data
  attribute becomes the identifier (see §4).
- After the two badges, inside the same partial, add the note:
  `<p class="store-soon" role="status">{{ store.iosSoon }}</p>` — rendered
  **only** inside the `{{? site.iosSoon }}` branch.

### 3. The note is visible without JavaScript
`.store-soon` renders **visible by default** in the HTML. `script.js` hides it
on load and shows it when the chip is tapped (progressive enhancement). With
JS off, the sentence is simply always there — never a dead button with no
feedback.

The partial is included **three times** per page (nav download menu, hero,
bottom CTA), so the note must be found relative to its own `.badges` /
`.dl-menu` container — **no `id` attributes**, they would be duplicated.

### 4. `static/assets/script.js`
- Replace both `a.href.indexOf("apps.apple.com") > -1` checks with
  `el.dataset.store === "ios"`, and widen the selectors so they match the
  `<button>` chip as well as `<a>` badges.
- The unavailable store is **never** marked `.primary`. On an iPhone, mark
  neither badge primary (the Play badge must not be promoted to an iPhone
  either) — just leave both neutral.
- On load: hide every `.store-soon`. On click of a `.store-badge.soon`:
  toggle the nearest `.store-soon` inside the same container, and keep
  `aria-expanded` in step.
- **Sticky CTA on iOS:** today it copies the first badge's `href`, which on an
  iPhone would now silently become the Google Play link. Instead, when the
  platform is `ios`, replace the CTA link with a plain non-interactive element
  carrying the coming-soon sentence — read the text from the hero's
  `.store-soon` node, so no new string and no template change is needed. The
  close button keeps working. On Android and desktop the sticky CTA is
  unchanged.

### 5. Two new content keys, in all 23 locales
Under `store` in every `content/*.json`, in the same key order as English:

- `appleSoon` — the small line above "App Store". English: `"Coming soon to the"`
- `iosSoon` — the note. English: `"Daili is coming to the App Store very soon."`

Rules that `tools/check-content.mjs` already enforces and that will fail the
build if broken: identical key set in every locale, "Daili" must survive into
every translation, no transliterated brand name, and a string ≥25 characters
must not be byte-identical to English. Keep `appleSoon` short — it sits above
`App Store` in a small chip and must not wrap on a 360px screen. Match each
locale's existing register (German is informal **du**), and reuse the wording
already used for `appleSmall` in that language where it fits.

### 6. Build guard — `tools/check-build.mjs`
Add a numbered section: when `stores.ios.available === false`, **no file in
`dist/`** may contain `apps.apple.com` (scan HTML **and** the built JS/CSS,
not just HTML). When it is `true`, require the opposite — the URL must appear
in the landing pages — so the guard cannot go stale and silently pass after
the flag flips back.

Before you finish, **prove the guard can fail**: temporarily put the Apple URL
back in one template, run `npm run build`, confirm the guard errors, revert.
Show that run in the report.

### 7. `build.mjs` warning
The `!stores.ios.verified` warning at ~line 486 now fires on a state that is
deliberate and permanent-for-now. Warn only when a store is `available` but
not `verified`; when `available: false`, print a one-line INFO instead saying
the badge is rendering as "coming soon".

### 8. Styling — `static/assets/style.css`
- `.store-badge.soon`: same size, shape and spacing as a real badge (the row
  must not shift), visibly dimmed (~55–65% opacity), `cursor: pointer`, no
  hover lift. It must never pick up the `.primary` outline.
- `.store-soon`: small, muted, full width under the badge row, a little top
  margin. Must read correctly in the dark-mode block (~line 325) and in RTL
  (`ar`) — use logical properties, not `left`/`right`.
- Check the nav `.dl-menu` variant too (badges are full-width there).

## Verify before you report
1. `npm run build` clean (content check + build + build check + detector test).
2. `/usr/bin/grep -rn "apps.apple.com" dist/` → **no matches**.
3. `npm run serve`, then look at the real thing in a browser at 360px and at
   desktop width: `/` (English), `/de/`, and `/ar/` (RTL). Confirm the chip is
   dimmed, tapping it reveals the sentence, tapping again hides it, and the
   Play badge still opens the Play listing.
4. On a narrow viewport with an iPhone user agent, confirm the sticky bottom
   bar shows the sentence and is **not** a link. On Android UA, confirm it
   still links to Play.
5. With JavaScript disabled, confirm the sentence is visible under the badges.
6. The guard-fails-on-purpose run from §6.

## Report
`claude-reports/2026-08-29/001-appstore-coming-soon.md` — half a page:
what changed per file, the English + German strings you wrote, the guard's
failing run, anything you decided differently and why. Commit and push.
**Do not run `./deploy.sh`** — Ammar deploys.
