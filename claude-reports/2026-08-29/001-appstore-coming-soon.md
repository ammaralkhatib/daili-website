# App Store badge → "coming soon" (site-wide, all 23 locales)

`apps.apple.com` now appears nowhere in `dist/` — not in the 52 HTML pages, not
in the hashed JS/CSS, not in the JSON-LD. The Apple badge renders as a dimmed,
non-link chip that reveals one sentence when tapped. Google Play is untouched.

## What changed, per file

**`site.config.mjs`** — `available` on both stores, iOS `false`, with the
rejection note. Flipping that one line back to `true` restores everything
(verified below).

**`templates/_storebadges.html`** — two `{{? }}` blocks, no inverted section
added. `site.iosAvailable` keeps today's `<a>`; `site.iosSoon` renders a
`<button class="store-badge soon" data-store="ios" aria-expanded="false">` with
the same Apple SVG, followed by `<p class="store-soon" role="status">`. Both
badges carry `data-store` in both branches.

**`build.mjs`** — the `site:` view object gains `iosAvailable` / `iosSoon`, and
`iosUrl` is spread in *only* when available, so a stray `{{ site.iosUrl }}`
throws instead of quietly writing a dead link. The `!verified` warning now
fires only when a store is `available && !verified`; otherwise a one-line INFO.

**`static/assets/script.js`** — both `href.indexOf("apps.apple.com")` sniffs
replaced with `dataset.store === "ios"`. Availability is read from the markup
(`.store-badge.soon`), which is the only signal left once the URL is gone. The
unavailable store is never `.primary`, and on an iPhone neither badge is. Notes
are hidden on load and toggled by the nearest chip within the same
`.badges`/`.dl-menu` container, `aria-expanded` in step. The sticky CTA on iOS
is replaced with a `<span class="sticky-soon">` carrying the hero note's text.

**`static/assets/style.css`** — `.store-badge.soon` at `opacity:.6` (`.62` in
dark), same box, `cursor:pointer`, no hover lift, `.soon.primary{outline:none}`
as a belt to that braces. A `button.store-badge` reset zeroes the UA border and
margin but deliberately avoids `font:inherit` — that shorthand also sets
`line-height` and, at higher specificity than `.store-badge`, would have made
the chip a different height from the Play badge beside it. `.store-soon` uses
`margin-block-start` / `flex-basis`, no `left`/`right`. Dark-mode block
re-asserts the border for the `<button>` and re-dims the chip.

**`tools/check-build.mjs`** — new section 10 (below).

**`content/*.json`** (23) — `appleSoon` and `iosSoon` under `store`, key order
`appleSmall, appleSoon, googleSmall, iosSoon` everywhere.

## The strings

| | English | German |
|---|---|---|
| `appleSoon` | `Coming soon to the` | `Bald im` |
| `iosSoon` | `Daili is coming to the App Store very soon.` | `Daili kommt schon bald in den App Store.` |

German is informal by construction (no pronoun needed), and `Bald im` mirrors
the existing `Laden im`. Every locale reuses its own `appleSmall` register the
same way (`Bientôt sur l'`, `Скоро в`, `即将上架`, `قريبًا على`, …). All 23
`appleSoon` values render on one line in the chip at 360px. `check-content`
reports 0 errors and the same 10 pre-existing length warnings as before — none
on the new keys.

## The guard (§6) and its failing run

Section 10 reads every file in `dist/` as a **buffer**, so it covers HTML, the
hashed JS and CSS, and anything else the build emits.

Proof it fails, run 1 — Apple URL put back in the partial as `data-url`:

```
52 build error(s):
index.html    contains apps.apple.com but stores.ios.available is false — that URL
              404s, and the badge is supposed to render as a non-link "coming soon" chip
…52 pages…                                                      npm run build → exit 1
```

Proof it fails, run 2 — URL put into `static/assets/script.js` instead, to show
the scan is not HTML-only:

```
1 build error(s):
assets/script.342bf843.js   contains apps.apple.com but stores.ios.available is false …
```

Both reverted; `script.js` hashes back to `f8ba7223`, byte-identical to the
clean build.

The `available: true` arm was also exercised: with the flag flipped to `true`
but the badge still rendering as a chip, the guard fails on all 23 landing
pages (`has no href="https://apps.apple.com/…"`), and with the real templates
it passes.

## Decided differently

1. **The `available: true` arm checks for `href="<url>"`, not the bare URL.**
   My first version used a substring check and it *passed* the deliberate
   failure test — because `installUrl` in the JSON-LD contains the same URL. A
   guard that green-lights an inert chip is worse than no guard, so it now
   requires the URL as an actual `href` on the landing pages.

2. **`build.mjs`'s JSON-LD `installUrl` also had to change** (out of the scope
   list, which named only the `site:` object and the warning). It emitted
   `stores.ios.url` into every landing page, so "nowhere in `dist/`" was
   unreachable without it. It now filters to available stores. It is also the
   right call independently: `installUrl` is a promise to Google that the app
   installs from there.

3. **`data-store` on the iOS `<a>` breaks "byte-identical to today"** — as
   §2's own "Also" clause requires. The `<a>` is otherwise unchanged.

4. **On Android the iOS chip gets no `.secondary`**, only `.soon`. `.secondary`
   carries `:hover{opacity:1}`, which would un-dim the chip on hover and
   contradict §8.

## Verified

1. `npm run build` clean: content OK · 23 locales · 158 keys each → 52 pages →
   build OK → detector OK · 32 cases.
2. `grep -rn "apps.apple.com" dist/` → no matches.
3. Browser checks ran against `npm run serve` in headless Chrome over the
   DevTools protocol (the Claude-in-Chrome extension was not connected):
   - `/`, `/de/`, `/ar/` at 360px and 1280px. Chip and Play badge identical
     height (50px inline, 53px in the nav menu) and on the same row; chip
     `opacity .6` vs Play `1`; `appleSoon` on one line in all three.
   - Tap reveals the sentence, tap again hides it, `aria-expanded` follows —
     independently for all **three** includes (nav `.dl-menu`, hero, bottom
     CTA), in all three locales, with the other two notes untouched. The nav
     menu stays open when the chip is tapped.
   - `/ar/`: `dir=rtl` honoured, note `direction: rtl`, `margin-block-start`
     resolves correctly.
   - Play badge is still `href="https://play.google.com/…" target="_blank"` in
     all three places.
   - Dark mode: chip `#000` + `1px` border like the real badge, `opacity .62`,
     note `#9BAEA3` on `#0E1512`.
4. Narrow viewport + iPhone UA: sticky bar is
   `<span class="sticky-soon">Daili is coming to the App Store very soon.</span>`
   — no `<a>`, no href — and the close button still dismisses it. Android UA:
   still `<a href="https://play.google.com/…">Get Daili — free</a>`, close still
   works. Desktop: unchanged.
5. JavaScript disabled (`Emulation.setScriptExecutionDisabled`): all 3 notes
   visible, chip has no `href`, sticky bar stays hidden.

**Pre-existing, not touched:** at 360px the page has ~116px of horizontal
overflow from the `.reveal.from-left/.from-right` scroll-in transforms on the
feature sections. Measured identical (`scrollWidth 476`, hero badges at the
same offsets) with and without this change, by stashing it and rebuilding.
Unrelated to the badges and out of scope here.

Not deployed — `./deploy.sh` not run.
