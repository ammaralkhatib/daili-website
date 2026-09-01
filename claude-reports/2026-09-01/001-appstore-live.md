# App Store listing is live — switch flipped back on

Apple approved and released **v1.2.0 on 2026-09-01**. Re-confirmed independently
before touching anything: `itunes.apple.com/lookup?id=6800427546&country=de`
→ `resultCount: 1`, "Daili: Familienplaner", `currentVersionReleaseDate`
`2026-09-01T16:46:41Z`, seller Ammar Khatib.

## The diff

One file, one block, six lines — `site.config.mjs`:

```diff
   ios: {
     url: 'https://apps.apple.com/app/id6800427546',
-    // 2026-08-29: the build was REJECTED by App Review; a new build has not
-    // been submitted. `available: false` is the switch — the badge renders as
-    // a non-link "coming soon" chip and this URL is never written into the
-    // HTML. Flip to true (and re-check the URL resolves) when the listing is
-    // actually public.
-    available: false,
-    verified: false,
+    // 2026-09-01: the listing went public — v1.2.0 approved and released.
+    // Confirmed via itunes.apple.com/lookup?id=6800427546&country=de
+    // (`resultCount: 1`). The `available: false` arm stays wired up as the
+    // tested off-switch should the listing ever go away again.
+    available: true,
+    verified: true,
   },
```

Nothing else changed. The chip, the popover, the `store.appleSoon` /
`store.iosSoon` strings, the `available: false` guard arm and the `sticky-soon`
CSS/JS are all still there and all now dormant — `git diff --stat` is
`site.config.mjs | 13 ++++-----`, one file.

## The guard's `available: true` arm

`npm run build` is clean: `content OK · 23 locale(s)` → `built 52 pages` →
`build OK · 52 pages · 50 in hreflang clusters` → `detector OK · 32 cases`.
(The 10 content warnings are the pre-existing translation length-ratio ones,
untouched by this change.) The `INFO stores.ios.available is false` line is
gone, as expected.

Section 10 is not passing vacuously — proved by breaking it on purpose. With
the href stripped from `dist/de/index.html` only:

```
de/index.html   has no href="https://apps.apple.com/app/id6800427546" but
                stores.ios.available is true — the App Store badge is not
                linking anywhere
exit=1
```

Restored → `build OK`, `exit=0`. The arm bites.

## The four checks

1. **All 23 landing pages carry the href.** 3 occurrences each (nav menu, hero,
   footer) × 23 pages = **69**, no page short.
2. **`grep -c 'store-badge soon'` on `/`, `/de/`, `/ar/` → 0, 0, 0.** Widened to
   `store-badge soon|class="store-soon"|sticky-soon` across *every* HTML file in
   `dist/`: **0 matches**. The two files that still contain those strings are
   `assets/script.<hash>.js` and `assets/style.<hash>.css` — the dormant
   off-switch machinery, which is meant to stay.
3. **JSON-LD carries Apple again:**
   `installUrl":["https://apps.apple.com/app/id6800427546","https://play.google.com/store/apps/details?id=app.daili"]`
4. **Rendered behaviour** — `/` and `/de/`, iPhone UA vs desktop UA, JS actually
   executed:

   | | soon markup | ios badges | iPhone promotion | sticky CTA |
   |---|---|---|---|---|
   | `/` iPhone | 0 | 3 × `<a>` | `.primary` ios / `.secondary` android | `<a class="dl-btn" href="…id6800427546" target="_blank" rel="noopener">` |
   | `/de/` iPhone | 0 | 3 × `<a>` | `.primary` ios / `.secondary` android | same `<a>` |
   | `/` desktop | 0 | 3 × `<a>` | none (correct — `plat` is null) | same `<a>` |
   | `/de/` desktop | 0 | 3 × `<a>` | none | same `<a>` |

   The sticky bar is a real `<a>` pointing at the App Store in every case — the
   `sticky-soon` span from prompt 001 is gone.

5. **The live URL is real.** `https://apps.apple.com/app/id6800427546` → 301 →
   `/us/app/daili-family-organizer/id6800427546`, HTTP 200, title
   "Daili: Family Organizer App - App Store", no 404 marker. German storefront
   `/de/app/id6800427546` → 200, "Daili: Familienplaner‑App".

## Caveats on how check 4 was run

The Claude Chrome extension was **not connected** this session (two attempts,
"Browser extension is not connected"), so I could not drive `npm run serve` in
the real browser. Substituted headless Chrome from the CLI against
`localhost:8080`, which does execute `script.js` for real — that is where the
DOM facts in the table above come from, and they are the substance of the check.

Two things that substitution does *not* cover, flagged rather than glossed:

- **The 360px check is DOM-level, not pixel-level.** Headless `--window-size`
  does not apply mobile-viewport emulation, so the 360px screenshots came out
  in desktop layout. Badge *state* at iPhone UA is verified; narrow-width
  *layout* was not visually confirmed. No CSS changed, and both branches share
  the `.store-badge` styling, so the risk is low — but it is unverified.
- **No German IP.** Checked the German storefront by URL and by
  `country=de` on the lookup API instead; both return the German listing.

First pass also silently redirected `/` → `/de/` on all four renders — that is
the locale detector doing its job against this machine's German
`Accept-Language`, not a regression. Re-run with `--accept-lang` pinned per
locale.

## One finding, no action taken

The section-10 comment header in `tools/check-build.mjs` still opens "The App
Store listing is not public" — stale as of today, but the code beneath it is
availability-agnostic and correct in both arms. Out of scope for this prompt and
not needed for the build to pass, so left alone. Worth a one-line fix next time
someone is in that file.

Committed and pushed. **Not deployed** — `./deploy.sh` is Ammar's to run.
