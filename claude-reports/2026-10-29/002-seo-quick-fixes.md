# 002 — SEO quick fixes

**Status: done.** Commit `03872e1`, pushed to `origin/main`. **Not deployed:** run `./deploy.sh` after checking.

**Build:** `npm run build` is green, and the route check ran (78 app routes, not skipped). The last line was `build OK · 3283 pages · 3253 in hreflang clusters`.

## What changed, per part

**0. Route allowlist.** The four `/settings/wall-display*` routes are now in `"pending"`, with the reason from the prompt. Nothing else in `help/` changed.

**1. Legal titles.**
- Privacy and Terms (28 locales each) now take their `<title>` and `og:title` from the body's own `<h1>` plus " — Daili". If a body has no `<h1>`, or an empty one, the build throws (`legalH1` in `build.mjs`).
- Examples: "Privacy Policy — Daili", "Datenschutzerklärung — Daili", "プライバシーポリシー — Daili".
- New keys `meta.privacyDescription` and `meta.termsDescription` are in all 28 files. en.json has the `@` entries with maxLength 155. The longest text is el at 129 characters.
- Impressum gets a German literal in `PAGES`: "Impressum — Daili", with the description "Wer hinter Daili steht: Medieninhaber, Anschrift und Kontakt nach § 5 ECG und § 25 MedienG."
- The English descriptions:
  - Privacy: "How Daili handles your family's data: what is stored, why, for how long, and your rights."
    - This matches §4 (what is stored), the legal bases (why), §8 "How long we keep data" and §10 "Your rights".
  - Terms: "The rules for using Daili: your account, your family's content and Daili Plus."
    - This matches §3, §4 and §6 of the terms.

**2. Schema.**
- The root `index.html` has a `WebSite` block (`#website`, alternateName `daili.app`) and an `Organization` block (`#organization`, logo ImageObject 512×512).
- `sameAs` uses the same available-store filter as `installUrl`; both read one shared list.
- Every landing page's SoftwareApplication now has `publisher: {"@id": "https://daili.app/#organization"}`. There is still no aggregateRating.

**3. Screenshot alt.**
- The 7 hero shots (`img.hs`) now use `home.alt.<shot>`, and so does the `img.sx` path.
- The prompt's count of 19 included the 10 watch shots. The flow steps are all videos, so no `img.sx` is rendered today.
- Guard 22 also covers the two phones in the bento "phones" box (`shot-birthdays`, `shot-notes`), which passed `alt: ''`. They now use their `home.alt` text as well and stay `aria-hidden`.
- Watch screens, photos, Minzi and avatars keep `alt=""`. A missing key throws through `h()`.

**5. Breadcrumbs.**
- There is one `BreadcrumbList` in the `<head>` of every help page (home, topic and article, in 25 locales) and every feature page. It is never placed in the sheet.
- The names are "Daili", `ui.crumbHelp`, the topic title, the article title, and the feature `h3`, which is the page's H1.
- The build throws if the last item is not the canonical.

**6. Guards (check-build sections 20–23).**
- Section 13 now accepts a `@font-face` whose `src` is `local()` only.
- There is one line in the README under "The guards".

## 4. Layout shift (CLS)

**What I changed:**
- One preload, `figtree-latin-700-normal.woff2`, on the landing pages, but not on ja, ko, zh-*, th, hi or ar.
- `"Figtree Fallback"` faces right after Figtree in `--sans`. They use local Arial, Liberation Sans or Arimo, one face per Figtree weight. `size-adjust` and the ascent/descent overrides were measured in Chrome over every Figtree locale's hero text.
- Each face's `unicode-range` is exactly what its Figtree weight covers.

**Reproducing it:**
- Plain Lighthouse on this Mac cannot show the problem. Its fallback is SF, which is close to Figtree, so CLS was 0.002 before the change.
- I used a test server that removes the Mac's system fonts from `--sans`, leaving Arial (like Liberation on Linux) or Verdana (like DejaVu, which `local()` does not match). With real network throttling (`--throttling-method=devtools`), that reproduced PageSpeed's pattern. The English h1 goes to 3 lines in the fallback, and `div.stage` shifts by 0.22 when Figtree 700 swaps in.

**Lighthouse 13, mobile, median of 3 runs (CLS / LCP):**

| Scenario | Before | After |
|---|---|---|
| Mac, simulated throttling (the prompt's command) | 0.002 / 5734 ms | 0.004 / 5024 ms |
| Mac, devtools throttling | 0.001 / 2877 ms | 0.004 / 2771 ms |
| Arial-only machine | **0.220** / 3800 ms | **0.004** / 2762 ms |
| Verdana-only machine, no fallback face matches | **0.227** / 2808 ms | **0.007** / 3746 ms |

**About the LCP numbers:**
- LCP switches between two elements: the h1 text (about 2.75–2.9 s) and the hero screenshot (about 3.7–4.8 s). So a median of 3 mostly shows which mode won, not a real change.
- In text mode, after is slightly faster than before: about 2.75 s against 2.88 s.
- **Why only one preload:** preloading all four weights cost about +550 ms LCP (8 runs: median 2883 → 3447 ms), because the font requests held back the stylesheets.
- **Why both halves are needed:**
  - With no preload, the Verdana-only machine stays at 0.227.
  - With the fallback face alone, an Arial-only machine reaches 0.005.
- **No visible change after load:** once Figtree has loaded, the hero measures the same before and after on 15 locales at 412 px. Stage offset, pills, h1, lead, CTA and rating are byte-identical in the diff.
- **Please check PageSpeed after the deploy.**

## Guard proofs (bug planted in `dist/`, check-build, restore)

- **20 — unique titles:** gave `terms.html` the Privacy title → exit 1, "privacy.html shares its <title> … with terms.html". Restored → green.
- **21 — JSON-LD:** pointed the last breadcrumb of `de/features/calendar/` at `/de/features/lists/` → exit 1, "the last breadcrumb … is not the page's canonical". Restored → green.
- **22 — screenshot alt:** emptied the alt of hero shot 0 in `de/index.html` → exit 1, "screenshot /assets/img/shots/de/shot-calendar.webp has an empty alt". Restored → green.
- **23 — legal titles:** put the home title on `privacy.html` → exit 1, "<title> … does not start with its own <h1> "Privacy Policy"". Section 20 caught the same file too.

After restoring everything, check-build exits 0. `git diff` before the commit showed only the intended files; the untracked `static/assets/img/photos/` was not touched.

## For Ammar

- **README "Fonts" is wrong** about ja, ko, zh-*, th, hi and ar loading no Figtree. In headless Chrome, `/ja/`, `/ar/` and `/hi/` load Figtree latin 400–700, for digits, "Daili" and punctuation. The preload still skips them, as the prompt asked, because their hero text is not Figtree. The README line was out of scope, so I left it.
- **Real Android phones:** `local()` does not match Roboto. On Android only the preload helps.

## Help impact

None.
