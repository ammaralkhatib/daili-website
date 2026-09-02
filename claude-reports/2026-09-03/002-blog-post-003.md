# Post 3 — The Family Document Checklist

Live at `/blog/family-document-checklist/`. The two files the recipe describes,
plus three more the "it has to print" requirement forced: `style.css`,
`build.mjs` and `tools/check-build.mjs`. All three are explained below.

## The `BLOG_POSTS` entry

Appended after post 2, values verbatim from the draft's front-matter:

```js
slug:        'family-document-checklist'
cluster:     'documents'
title:       'The Family Document Checklist: 27 Papers to Have Ready'
h1:          'The Family Document Checklist: 27 Papers Every Household Should Have Ready'
description: 'A room-by-room checklist of the 27 documents every household needs
              to find fast — identity, medical, money, property, school — and
              which need the original.'
published:   '2026-09-04'   updated: '2026-09-04'
body:        'family-document-checklist.en.html'
image:       '/assets/img/blog/family-document-checklist.webp'
imageAlt:    'A hand ticking off items on a handwritten checklist in a notebook'
imageWidth:  1200   imageHeight: 675   // measured with sips, not copied
itemList:    'The family document checklist — 27 documents …'   // new field, below
faq:         [3 questions, verbatim from the draft]
cta:         { h2: 'What daili does with this', html: <3 paragraphs> }
```

Hero checked before shipping, as the template's hard-won note says to: it is
landscape, and it is a hand ticking checkboxes in a handwritten notebook headed
"CHECK LIST". The alt text describes that photo, and it does not resemble post
1's fanned-out passports or post 2's ring binder.

## 1. It prints

`static/assets/style.css` gained a print block at the end of the blog-post
section. `@media print` hides `header` (which carries the nav *and* the language
picker), `footer`, `.skip`, `.post-hero` and `.post-cta`; everything else —
h1, byline, prose, all 27 items, the FAQ — stays. Type is restated in points
because that is the unit a printer actually uses.

Two things that were not in the brief and turned out to matter:

- **The tokens are reset to black-on-white inside the print block.** The
  dark-mode block is a media query, not a class, so a laptop set to dark printed
  the whole checklist as pale grey on near-black. Every rule in the stylesheet
  reads a token, so redefining eight tokens in a block that comes later in the
  file is the entire fix. Verified by rendering with `prefers-color-scheme:
  dark` *and* `media: print` together — `shots/002-post3-print-list.png` is that
  render.
- **Links print as plain text** (`color:inherit;text-decoration:none`). A
  printed link cannot be clicked, and four blue underlines down a checklist are
  noise. The hrefs are not printed after the anchors either — three are internal
  and one is a 130-character German URL.

The checkbox is `content:"☐\00a0\00a0"` on `.doc-checklist li::before`, scoped
to that class rather than to `.post ol` so an ordinary numbered list in a future
post does not print as a to-do list. The `<ol>` marker still supplies the
number; the box sits after it: `1. ☐ Birth certificate`. `break-inside:avoid` on
the items and `break-after:avoid` on the h2s stop a section heading being
stranded at the foot of a page.

Tested in print preview, not by eye: Chrome with
`Emulation.setEmulatedMedia{media:'print'}`, which reports
`header/footer/.post-hero/.post-cta` all computing to `display:none` and the
`::before` content resolving to `"☐  "`. Also rendered to PDF with
`--print-to-pdf`: **4 A4 pages**, page 1 is the h1, byline and the two intro
sections, white ground, no furniture.

## 2. Items 1–27 are a real `<ol>`

Six `<ol class="doc-checklist">` blocks, one per section, continuing with
`start="8"`, `13`, `19`, `23`, `26`. Document name in `<strong>`, the qualifying
clause in plain text. No table anywhere in the post. At 360px item 17 wraps to
four lines and the numbers stay aligned; nothing is clipped.

## 3. Internal links — both ✅, the ⏳ left out

| Where | Anchor | Target |
|---|---|---|
| "How to use this list" | Originals go where they survive a fire or a flood | `/blog/where-to-store-important-family-documents/` |
| three-tier section | the group worth photographing tonight | `/blog/digital-family-emergency-binder/` |

Both root-relative. Item 25's babysitter link (post 6) was **not** added.

## 4. One external link

`Germany's civil protection office` → the BBK `dokumente-sichern` page, with
`rel="noopener"`. It sits on the sentence that credits the BBK with the three
tiers, so the citation is attached to the claim it supports — the same placement
post 2 uses for the same source.

## 5. ItemList — added, and derived rather than typed

**I added it.** Twenty-seven named things in a numbered list is the one case on
this blog where the markup describes the page instead of decorating it, and it
is the post most likely to be excerpted by a search result.

The interesting part is where the 27 names live. Writing them into
`site.config.mjs` would have been the quick version and would have created
exactly the drift the `faq` comment in that file exists to forbid: two copies of
one list, and the JSON-LD quietly going stale the first time a document name is
reworded. So `renderHead` reads the names back out of the body it has just
rendered — the `<strong>` at the head of each `<li>` inside an
`ol.doc-checklist` — and `BLOG_POSTS` declares only the list's *name*, which is
the one string that has no other home. One source, no possible disagreement.

Three JSON-LD blocks now, in order: `Article`, `FAQPage`, `ItemList` (27 items,
positions 1–27, `Birth certificate` … `A list of who has a key`).

Two guards came with it:

- `build.mjs` throws if a post declares `itemList` and the derivation finds
  nothing — a renamed class would otherwise ship an ItemList-less page in
  silence. Negative-tested: renaming the class to `doc-checklistZ` fails the
  build, restoring it passes.
- `tools/check-build.mjs` section 11 check 10 asserts the block exists, that
  `numberOfItems` matches the array, that positions run 1..n in order, and that
  every name is on the *visible* page (the JSON-LD is stripped before that
  search, as check 6 does).

## Guards

`npm run build` clean: `built 58 pages · blog: 3 post(s) · build OK · 58 pages ·
52 in hreflang clusters · detector OK`. The 10 content warnings are the
pre-existing translation length ratios, untouched.

On the new post: one `<h1>`; canonical
`https://daili.app/blog/family-document-checklist/`; **0 `hreflang` in the
`<head>`**; description is the post's own; `og:type` article with its own hero;
FAQ parity holds; hero file present; no duplicate slug; in the sitemap with no
`xhtml:link` alternates; 56 sitemap entries.

Index and feed, both sorted newest-first off `published`:
`family-document-checklist` (4 Sep) → `digital-family-emergency-binder` (3 Sep)
→ `where-to-store-important-family-documents` (2 Sep).

## Word count

Draft article (front-matter and publishing notes excluded; H1, FAQ and CTA
included) 1,196 words · rendered `<article>` 1,187 · **−9 (−0.75%)**. The gap is
the list markers: the draft's `1.`–`27.` are words in the markdown and CSS
counters in the HTML, which is −27, offset by the byline and the `<ol>`
numbering being restated in the section headings. A punctuation-insensitive
scan of the draft against the rendered text finds **0 missing chunks** — every
word of the draft is on the page, in order.

## Prose changes

**None.** Markdown converted mechanically: `**` → `<strong>`, the numbered list
→ `<ol>`/`<li>`, the bold lead-ins ("Find it.", "Original only.", "The
originals") left as `<strong>` inside their paragraphs rather than promoted to
headings, because that is the shape the draft gives them.

## Browser

360px, light and dark, via `Emulation.setDeviceMetricsOverride` (the plain
`--window-size=360` screenshot is a crop of a wider layout on macOS — post 2's
report has the same warning). Measured on the post: `innerWidth` 360,
`documentElement.scrollWidth` 360, and no element inside `.post` extends past
the viewport. Dark mode: `--paper` resolves to `rgb(14,21,18)` and the prose to
`rgb(201,214,206)`, so the post inherits dark mode from the tokens with no rule
of its own, as posts 1 and 2 do.

`shots/002-post3-360.png`, `shots/002-post3-360-dark.png`,
`shots/002-post3-print.png`, `shots/002-post3-print-list.png`.

## Not done

- A PDF of the checklist. The draft calls it a good follow-up, not a blocker.
- `./deploy.sh` — Ammar deploys.
