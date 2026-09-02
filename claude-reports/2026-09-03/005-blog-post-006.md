# Post 6 — What to Leave with a Babysitter or Grandparent (linkable asset)

Live at `/blog/what-to-leave-with-a-babysitter/`. Two files, exactly as the
recipe describes: the body fragment and one `BLOG_POSTS` entry. **Nothing in
`build.mjs`, `style.css` or the guards needed touching** — including the print
sheet, which is the point of the next section. Fourth post in the `documents`
cluster.

No prose was changed. Not a word.

## 🔴 The print sheet — confirmed, not assumed

Post 3's `@media print` block is already in `static/assets/style.css` (line 483)
and it is written against `.post`, not against post 3. Post 6 renders inside the
same `<article class="post">`, so it inherits it. I did not take that on trust —
measured in headless Chrome with `Emulation.setEmulatedMedia {media:'print'}`
**and `prefers-color-scheme: dark` forced on**, which is the case the block's own
comment says it exists for:

| What the block promises | Measured on post 6 |
|---|---|
| `header` hidden | `display: none` ✅ |
| `footer` hidden | `display: none` ✅ |
| `.skip` hidden | `display: none` ✅ |
| `.post-hero` hidden | `display: none` ✅ |
| `.post-cta` hidden | `display: none` ✅ |
| black on white regardless of scheme | `body` `rgb(255,255,255)`, `h1` `rgb(0,0,0)` ✅ |
| links printed as plain text | `color rgb(26,26,26)`, `text-decoration: none` ✅ |
| body copy at 10.5pt | `.post p` computes to `14px` = 10.5pt ✅ |

The page loads `/assets/style.46065603.css`, and that file contains the
`@media print` block — same stylesheet, one hash, no per-post CSS.

**The ☐ checkboxes do not appear, and that is correct.** `li::before` is scoped
to `.doc-checklist`, which this post does not use (`grep -c doc-checklist` on the
built page → 0). A handover sheet is information to read, not a list to tick, so
I did not add the class. Say the word if you want the boxes.

`shots/005-post6-print.png` is the whole print rendering, top to bottom.

**One number you should know:** printed, the article runs to **4 A4 pages**
(`Page.printToPDF` with `@page{margin:16mm}` → 4 pages; content height 3,101px
against ~1,002px of printable page). The "one-pager" in the draft is the sheet
*the reader writes*, not the article — the article is ~1,250 words and was never
going to fit one side. The print sheet does what the draft asked of it (nav,
footer, hero and CTA gone; headings and lists kept). Flagging it because
"linkable asset that prints as a one-pager" could be read as a promise about
this page. If you want a genuine one-sider, that is the fillable PDF the draft
already parks as a follow-up.

## The legal line

Present, verbatim, in italics, as the last paragraph of "The consent question":

> *General information, not legal advice — rules differ by country.*

Visible in `shots/005-post6-360-cta.png`'s neighbour and in the print shot.
**No claim about what is legally binding in any named country was added.** The
two sentences above it are the draft's own hedged wording ("varies a lot by
country", "a hospital's own policy may matter more than the letter"), unchanged.

## "What to leave OUT" — framing intact

The section's closing paragraph is the draft's, word for word:

> A handover sheet often sits on a kitchen counter for a weekend, and other
> people come and go. Write it as something that could be seen by a visitor,
> because it probably will be.

Nothing was added that reads as distrust of the sitter. The one bullet that
could have tipped that way — "Anything about a child that is not the sitter's
business" — keeps its own explanation ("A carer needs to know what keeps a child
safe and what makes bedtime work") in the same sentence.

## The `BLOG_POSTS` entry

Appended after post 5, values verbatim from the draft's front-matter:

```js
slug:        'what-to-leave-with-a-babysitter'
cluster:     'documents'
title:       'What to Leave with a Babysitter or Grandparent'
h1:          'What to Leave with a Babysitter or Grandparent for a Weekend Away'
description: 'The one-page handover every sitter needs: contacts, medical
              details, routines, house rules and the permissions they need —
              plus what to deliberately leave out.'
published:   '2026-09-07'   updated: '2026-09-07'
body:        'what-to-leave-with-a-babysitter.en.html'
image:       '/assets/img/blog/what-to-leave-with-a-babysitter.webp'
imageAlt:    'A grandmother sitting with two grandchildren as they draw at a
              table'
imageWidth:  1200   imageHeight: 800   // read off the file with sips, not copied
faq:         [3 questions, verbatim from the draft]
cta:         { h2: 'What daili does with this', html: <2 paragraphs + the link> }
```

No `itemList` — this post is a set of sections, not a numbered list of named
things, so ItemList would be decoration.

Hero opened before shipping: landscape 1200×800, a grey-haired woman in a
patterned blouse sitting at a light wooden table, smiling down at two children
who are drawing — the boy's head is down over his page, the girl's back is to
the camera. She is watching, not drawing, and the alt text says
"sitting with two grandchildren **as they draw**", which is what the photo shows.
Against its neighbours: post 5 is a white morning kitchen, post 4 an evening
dinner table; this is a pale daytime living room at a table. Different enough.

## Links

Four `href` in the rendered `.post`, and that is the whole set:

| Anchor | Target | Kind |
|---|---|---|
| "Health insurance details, or the card itself" | `/blog/family-document-checklist/` | internal ✅ |
| "The originals stay where they live" | `/blog/where-to-store-important-family-documents/` | internal ✅ |
| "on your phone next time" (CTA) | `/blog/digital-family-emergency-binder/` | internal ✅ |
| "See how the documents vault works →" | `/` | CTA, root-relative |

**Zero external links.** No `href="http` appears anywhere in the body fragment,
so no `rel="noopener"` was needed and no thin commercial page is cited.

The ⏳ consent link (`/blog/medical-consent-grandparents-babysitting`) is **not**
in the page. The consent section carries no link at all.

One note on link placement: the medical bullet's anchor wraps the whole item,
`<strong>` included, so the anchor text reads "Health insurance details, or the
card itself" rather than clipping mid-phrase. The bold still renders. That is
the only judgement call in the conversion.

## Schema

Two JSON-LD blocks: `Article` (headline = the h1) and `FAQPage` (3 questions).
FAQ parity holds by construction — `faq` exists only in `BLOG_POSTS`, and the
template renders the visible `<h3>`s and `renderHead` builds `mainEntity` from
the same array, so the strings cannot drift.

## Guards

`npm run build` clean:

```
content OK · 23 locale(s) · 159 keys each
built 61 pages · 23 locale(s) · 59 sitemap entries
blog: 6 post(s) · /blog/ index · feed.xml
build OK · 61 pages · 52 in hreflang clusters
detector OK · 32 cases · 23 locale(s) built
```

The 10 content warnings are the pre-existing translation length ratios,
untouched.

On the new post: one `<h1>`; canonical
`https://daili.app/blog/what-to-leave-with-a-babysitter/`; **0 `hreflang` in the
`<head>`** (26 in the whole file — the footer language picker plus the nav and
footer `/blog/` links; posts 4 and 5 have the same 26); its own description;
`og:type` `article` and `og:image` the post's own hero; FAQ parity; hero file
present and referenced; no duplicate slug; in the sitemap once, with no
`xhtml:link` alternates.

It appears on `/blog/` and as a new `<item>` in `/blog/feed.xml` (6 items). Both
sort newest-first off `published`, so at 2026-09-07 it is at the top of each.

## Word count

Draft article (front-matter and publishing notes excluded; H1, FAQ and CTA
included, markdown emphasis and link syntax stripped) **1,260 words** · rendered
`<article>` **1,258** · **−2 (−0.2%)**.

The draft's own front-matter estimates `word_count: ~1,490`; the actual draft
body is 1,260. The estimate is high, the conversion is not lossy — the check
that matters is draft-against-rendered, and that is −0.2%.

## Prose changes

**None.** Mechanical conversion only: `**` → `<strong>`, `*…*` → `<em>`,
paragraphs unwrapped from the draft's 79-column lines, eight `##` → `<h2>`, one
numbered list → `<ol>`, three bulleted lists → `<ul>`. Straight quotes and the em
dashes are the draft's own characters, copied through. No tables, no code, no
inline images. The element vocabulary is `a em li ol p strong ul` — a subset of
what posts 1–5 already use, so nothing new hits the stylesheet.

## Browser

360px, light and dark, via `Emulation.setDeviceMetricsOverride` over CDP —
`--window-size=360` is still a crop of a wider layout on macOS, as posts 2–5
recorded.

Measured on the post, both schemes: `innerWidth` 360, `scrollWidth` 360, and
**no element inside `.post` extends past the viewport**. Light `--paper`
`rgb(252,250,244)` with prose `rgb(15,29,22)`; dark `rgb(14,21,18)` with
`rgb(232,240,234)`. Ten `<h2>` in `.post` — eight section headings plus the
template's FAQ and CTA. The post carries no colour rule of its own.

The H1 wraps to three lines at 360 ("What to Leave with a / Babysitter or
Grandparent / for a Weekend Away") with no clipping. The longest token in the
body is "sixteen-year-old" and it breaks at the hyphen, so nothing forces a
horizontal scroll.

`shots/005-post6-360.png`, `shots/005-post6-360-dark.png`,
`shots/005-post6-360-cta.png`, `shots/005-post6-print.png`.

## Follow-up

- **The ⏳ consent link** goes into "The consent question" when
  `/blog/medical-consent-grandparents-babysitting` publishes. That post is also
  where any jurisdiction-specific authority belongs — not here.
- **The fillable PDF** the draft names as a follow-up is the thing that is
  actually a one-pager. Not a blocker, and it must not sit behind an email form.
- The ☐ print checkboxes are available (`class="doc-checklist"` on a list) if you
  decide the handover sheet should be tickable after all.
- `./deploy.sh` — Ammar deploys.
