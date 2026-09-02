# Post 2 — The Digital Family Emergency Binder

Live at `/blog/digital-family-emergency-binder/`. Commit `d42305c`. Two files changed as the
recipe describes, plus one CSS rule (below).

## The `BLOG_POSTS` entry

Appended after post 1, values taken verbatim from the draft's front-matter:

```js
slug:        'digital-family-emergency-binder'
cluster:     'documents'
title:       'The Digital Family Emergency Binder: What Goes In It'
h1:          'The Digital Family Emergency Binder'
published:   '2026-09-03'   updated: '2026-09-03'
body:        'digital-family-emergency-binder.en.html'
image:       '/assets/img/blog/digital-family-emergency-binder.webp'
imageWidth:  1200   imageHeight: 800   // measured: RIFF WebP, 1200x800, 43 KB
faq:         [3 questions, verbatim from the draft]
cta:         { h2: 'What daili does with this', html: <3 paragraphs> }
```

`cluster_id` in the draft maps to the key `cluster`, as post 1 does.

## The three specifics

**1. First internal link.** In the intro, "The paper binder protects the
originals" links to `/blog/where-to-store-important-family-documents/`,
root-relative. The two ⏳ links (post 3, post 6) were not added.

**2. Two external links, both `rel="noopener"`, both in the prose:**

| Anchor | Target |
|---|---|
| Emergency Financial First Aid Kit | `ready.gov/emergency-financial-first-aid-kit` |
| German civil protection office (BBK) | `bbk.bund.de/…/dokumente-sichern.html` |

The BBK link sits on the sentence that credits it with the three tiers, so the
citation is attached to the claim it supports rather than to the passing mention
in the intro.

**3. The three tiers are three `<h3>` subheadings**, each with its own
paragraph:

- Originals only — a copy will not do.
- Original or a certified copy.
- A simple copy is fine.

`.post h3` was already styled, so this needed no new CSS. The trailing full
stops are kept because the draft has them and the prose is not to be edited — a
heading ending in a period is unusual but it is the author's sentence.

## Ordering with two posts — the thing that had never run

Both surfaces sort newest-first off `published`, and both are correct now that
there is something to sort:

- `/blog/` index: `digital-family-emergency-binder` (3 September 2026), then
  `where-to-store-important-family-documents` (2 September 2026).
- `/blog/feed.xml`: two `<item>`s, `Thu, 03 Sep 2026` before `Wed, 02 Sep 2026`.

Both come from the single `blogList` in `build.mjs`, so page and feed cannot
disagree.

## Guards

`npm run build` clean: `built 57 pages · blog: 2 post(s) · build OK · 57 pages ·
52 in hreflang clusters · detector OK`. The 10 content warnings are the
pre-existing translation length ratios, untouched by this change.

On the new post specifically: one `<h1>`; canonical
`https://daili.app/blog/digital-family-emergency-binder/`; **zero `hreflang` in
the `<head>`** (26 in the body, the language picker — identical to post 1); FAQ
parity holds, the three `<h3>` questions on the page are the same three `name`
values in the FAQPage JSON-LD; hero file present, so the missing-hero guard
never fired; no duplicate slug; sitemap has 55 entries.

## Word count

Draft body (front-matter and publishing notes excluded, FAQ and CTA included)
1,516 words · rendered `<article>` 1,523 · **+7 (+0.46%)**. A word-level diff of
the two streams shows the only insertion is the byline "Ammar Khatib · 3
September 2026"; nothing was dropped.

## Prose changes

**None.** Every sentence is the draft's. Markdown was converted mechanically:
`**` → `<strong>`, `*Dokumentenmappe*` → `<em>`, backticked filenames →
`<code>`, the three bold tier lead-ins → `<h3>`.

## The one thing outside the two files

`static/assets/style.css` gained a `.post code` rule. The draft names files
inline (`emma-vaccinations`, `IMG_4471`, `household`) and nothing had ever put
`<code>` in a post before, so the browser default applied — which shrinks
monospace text mid-sentence. The rule is three properties: monospace stack,
`.9em`, `color:var(--ink)`.

I first tried a boxed chip (background, border, padding). Rendered at 360px it
was wrong twice over: five chips in one paragraph made a family-advice post look
like developer docs, and the padding pushed the following full stop visibly away
from the word — "who-what ." Monospace alone marks a filename in prose and
leaves the punctuation tight. Both versions are in the commit history of this
session only; the shipped rule is the plain one.

## Browser

360px, light and dark, via headless Chrome with device-metrics emulation
(`Emulation.setDeviceMetricsOverride` + `prefers-color-scheme`). Measured on the
post: `innerWidth` 360, `documentElement.scrollWidth` 360, and no element inside
`.post` extends past the viewport — no sideways scroll. Checked by eye: hero,
h1, byline, the three-tier `<h3>`s, the filename run, the FAQ, and the mint CTA
block, all correct in both themes.

Note: a plain `--headless --window-size=360,…` screenshot is misleading on
macOS — Chrome enforces a minimum window width, so the page lays out wider than
360 and the image is just a crop. Post 1 shows the identical artefact. The
device-metrics override is the one that actually tests the breakpoint.

## Not done

`./deploy.sh` — Ammar deploys.
