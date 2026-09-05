# Post 8 — When the School Calls: The 6 Documents to Keep on Your Phone

Live at `/blog/documents-to-keep-on-your-phone/`. Commit `PENDING`. Two files,
exactly as the recipe describes: the body fragment and one `BLOG_POSTS` entry.
**Nothing else was touched** — no `build.mjs`, no `style.css`, no guards, and no
edit to any already-published post this time. Fifth post in the `documents`
cluster, and the one that finally gives cluster A its phone-side pillar.

No prose was changed. Proved below, not asserted.

## The legal line — present, unmoved, unqualified

Verbatim, in italics, as the last paragraph of section 4 and nowhere else:

> *General information, not legal advice — rules differ by country.*

`grep -c` on the built page → exactly 1. It sits directly under the paragraph
that already hedges the claim ("varies by country, and a hospital's own policy
often matters more than the paper"), which is where the draft put it.

**No country-specific claim was added anywhere in the post.** The two sentences
about what a consent letter is worth are the draft's own, unchanged. Checked
in dark as well as light, because an italic grey line is the kind of thing that
disappears against a dark ground — it does not:
`shots/007-post8-360-dark-legal-line.png`.

## Prose fidelity — measured

Same method as post 7. Tags stripped out of the body fragment, markdown stripped
out of the draft between the H1 and "## Frequently asked questions", the two word
streams diffed. **Two differences, both punctuation splitting off a word at a tag
boundary** (`<strong>What was already given today</strong>,` → `today` + `,`;
`...separate and named</a>.` → `named` + `.`). **Zero word differences.**

That covers the allergy bullet's exact wording, which is the one place in this
post where a rewrite would do harm: *"Nuts — swelling, adrenaline pen in the
green bag, then call an ambulance" is usable by a stranger. "Nut allergy" is
not.* It is the draft's sentence, character for character.
`shots/007-post8-360-list.png`.

## Word count

| | words |
|---|---|
| Draft, H1 through the CTA, publishing notes excluded | 1,223 |
| Rendered `<article class="post">` | 1,228 |

**+0.4%** — the five extra words are the byline the template adds. Nothing was
dropped.

As with post 7, the draft's front-matter estimate (`~1,470`) runs high; the real
figure is ~1,230. Two posts in a row, so the estimates in drafts 9–17 are
probably all about 15% optimistic. Not a problem, just worth knowing before you
size a post against them.

## The `BLOG_POSTS` entry

Appended after post 7, values verbatim from the draft's front-matter:

```js
slug:        'documents-to-keep-on-your-phone'
cluster:     'documents'
title:       'The 6 Documents to Keep on Your Phone for Your Kids'
h1:          'When the School Calls: The 6 Documents to Keep on Your Phone'
description: 'Six documents worth having on your phone before you need them —
              insurance card, vaccination record, consent letter and three
              more. Plus three to never keep there.'
published:   '2026-09-09'   updated: '2026-09-09'
body:        'documents-to-keep-on-your-phone.en.html'
image:       '/assets/img/blog/documents-to-keep-on-your-phone.webp'
imageAlt:    'A woman standing in a kitchen taking a phone call, one hand to
              her chest, looking concerned'
imageWidth:  1200   imageHeight: 800   // sips, read off the file
faq:         [3 questions, verbatim from the draft]
cta:         { h2: 'What daili does with this', html: <2 paragraphs + the link> }
```

**No `itemList`, deliberately** — and this is the post where that decision is
least obvious, because it is literally "6 documents". But `build.mjs` derives
ItemList names from `ol.doc-checklist` blocks in the rendered body, and this
post's six items are `<h2>` sections with two paragraphs each, not a checklist.
Declaring `itemList` would produce a block that disagrees with the page. The
draft's own notes say Article + FAQPage, which is what shipped.

The title tag and the H1 differ on purpose — the title carries the keyword, the
H1 carries the hook. The draft flags this; the guards allow it.

## Links — the whole set

| Anchor | Target |
|---|---|
| a safe at home *(intro)* | `/blog/where-to-store-important-family-documents/` |
| a grandparent, an au pair, a neighbour doing the school run *(§4)* | `/blog/what-to-leave-with-a-babysitter/` |
| somewhere separate and named *(camera roll)* | `/blog/digital-family-emergency-binder/` |
| See how the documents vault works → *(CTA)* | `/` |

All three ✅ links are in, each wrapping words the draft already had — no anchor
text was invented and no sentence was reworded to make room.

**Zero external links** — `grep -c 'href="http'` on the fragment → 0, so no
`rel="noopener"` was needed. This is practical advice, not a facts post, so
nothing is cited.

**The ⏳ post-9 link is not in.** "Handing your phone to a nurse" wants
`/blog/family-app-children-data/`, which publishes tomorrow. Adding it now would
fail check-build section 2. **That is the first job of the post-9 prompt** — it
is a one-line edit to `blog/documents-to-keep-on-your-phone.en.html`, and unlike
post 4's FAQ problem it is in the body fragment, so it is genuinely one line.

## Guards

`npm run build` clean: **63 pages, 8 posts, 61 sitemap entries**, detector 32
cases. Only the ten pre-existing translation length-ratio warnings, unchanged.

| Check | Result |
|---|---|
| `<h1>` count | 1 |
| canonical | `https://daili.app/blog/documents-to-keep-on-your-phone/` |
| hreflang **in `<head>`** | 0 |
| og:type / og:url / og:image | `article` / the post URL / the post's own hero |
| FAQ parity | 3 questions, visible **and** in FAQPage JSON-LD, byte-identical |
| JSON-LD | Article + FAQPage, both parse |
| hero file | present, 1200×800 measured with `sips` |
| sitemap | 1 entry |
| `/blog/` index | card present, first (sorted by `published`) |
| `feed.xml` | new `<item>`, `Wed, 09 Sep 2026` |

## Browser — 360px, light and dark

Chrome 152 headless over CDP: 360 CSS px, DPR 2, mobile, with
`Emulation.setEmulatedMedia` forcing `prefers-color-scheme`. Both schemes really
applied — body computes to `rgb(252,250,244)` light, `rgb(14,21,18)` dark.

**`scrollWidth` 360 against `clientWidth` 360 in both schemes.** No horizontal
overflow, including the long allergy bullet, which is the widest unbreakable run
of text in the post.

`shots/007-post8-360.png` and `-dark.png` (full page, 7,081 CSS px), plus
`-legal-line.png`, `-dark-legal-line.png`, `-list.png`, `-link-section4.png`
and `-dark-cta.png`.

## Hero

Opened the `.webp` before shipping. Landscape 1200×800: a close-up of a woman
with long curly hair and black-framed glasses, white blazer over a black top,
one hand flat on her chest and the other holding a phone to her ear, mouth
slightly open, looking down and away. Behind her a white marble splashback and
the edge of a sink and tap. The alt text — "a woman standing in a kitchen taking
a phone call, one hand to her chest, looking concerned" — is what the photo
shows, so it shipped as the front-matter had it.

**Two things worth knowing.**

`IMAGES-TODO.md` describes row 8 as "woman at a home desk, worried, phone to her
ear". It is a **kitchen**, not a desk — there is no desk in the frame. The
draft's alt text is right and the TODO row is not, which is one more instance of
exactly what the recipe's hero section warns about. Nothing needs fixing on the
page; flagging it so the row does not get trusted later.

**Against its neighbours, this is the closest call so far.** Post 5 (cozi, 6 Sep)
is also a white kitchen. They do not read alike on the index — post 5 is a wide,
cool, grey-and-white establishing shot with three calm people at a table across
the full frame; post 8 is a tight warm portrait, one face filling the middle
third, alarm on it. Different distance, different temperature, different
emotional register, and three cards apart. I think it holds, but it is the one
I would look at if you are scanning `/blog/` for repetition.
