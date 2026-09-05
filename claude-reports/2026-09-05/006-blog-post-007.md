# Post 7 — Nobody in My Family Uses the Calendar App

Live at `/blog/nobody-uses-the-family-calendar-app/`. Commit `36cc4c4`. Two new
files as the recipe describes (body fragment + one `BLOG_POSTS` entry), **plus
one deliberate edit to post 4**, which the prompt asked for and which is written
up in its own section below. Second post in the `adoption` cluster.

No prose was changed. Proved, not asserted — see "Prose fidelity".

## 🔴 One of the two post-4 links could not be added — read this first

The prompt asked for two links into post 7 from post 4: one in rule 2, one in
the "what if one person refuses" FAQ.

**Rule 2 is done. The FAQ one is not, and it is not a thing I can do without
changing the engine.** Post 4's FAQ answers do not live in
`blog/shared-family-calendar-rules.en.html` — they live in `BLOG_POSTS`, and
`templates/blogpost.html` renders the answer as `{{ .a }}`, which `build.mjs:53`
puts through `escapeHtml`. An `<a>` in that string renders as visible
`&lt;a href=...&gt;` on the page. Confirmed against the built page, not inferred
from reading the template.

Three ways forward, none of which I took on my own judgement:

1. **Leave it.** Rule 2 already carries the pair link, one paragraph of prose
   above where the FAQ sits. The FAQ answer's last four sentences are post 7's
   reason 4 in miniature, so the reader who wants more is already pointed there.
2. **Change the template to `{{{ .a }}}`.** One character. It un-escapes every
   FAQ answer on every blog post, and the same raw string then goes into the
   `acceptedAnswer.text` of the FAQPage JSON-LD. Google does allow `<a>` inside
   an answer, so the structured data stays valid — but the escaping is currently
   a real guard and I am not removing it in a post-publishing commit.
3. **Add an `aHtml` field** alongside `a`, rendered raw for the visible page
   while `a` stays the plain-text JSON-LD value. Cleanest, biggest change, and
   it puts the answer in two places, which is exactly what the recipe's 🔴 rule
   about `faq` exists to prevent.

My preference is 1, then 3. Say which and I will do it.

**Separately:** post 4 still has no link to post 6. Its draft's publishing notes
mark rule 5 ("something a grandparent can act on") → `/blog/what-to-leave-with-
a-babysitter/` as ✅ **only once post 6 is live**, and post 6 went live yesterday.
Out of scope for this prompt so I left it, but it is now an owed link.

## The edit to post 4 — deliberate, one line

`blog/shared-family-calendar-rules.en.html:21`, rule 2's third paragraph. No
words changed; existing text was wrapped in an anchor:

> That sounds harsh. It is far kinder than the alternative, which is
> <ins>one person carrying every arrangement in their head</ins> and being
> blamed when they drop one.

That phrase is chosen because it *is* post 7's opening section ("The pattern:
one person becomes the interface"), so the anchor text describes the
destination rather than saying "read more". `shots/006-post4-360-rule2-link.png`.

Post 4 now has exactly two links in its article: this one and its own CTA to `/`.

## The `BLOG_POSTS` entry

Appended after post 6, values verbatim from the draft's front-matter:

```js
slug:        'nobody-uses-the-family-calendar-app'
cluster:     'adoption'
title:       'Nobody in My Family Uses the Calendar App — 5 Reasons Why'
h1:          'Nobody in My Family Uses the Calendar App'
description: 'You installed it, added everything, and you are still the only
              one who opens it. The five reasons family apps get abandoned,
              and the fix for each one.'
published:   '2026-09-08'   updated: '2026-09-08'
body:        'nobody-uses-the-family-calendar-app.en.html'
image:       '/assets/img/blog/nobody-uses-the-family-calendar-app.webp'
imageAlt:    'A tired mother working at a laptop while her children play
              around her'
imageWidth:  1200   imageHeight: 800   // sips, read off the file
faq:         [3 questions, verbatim from the draft]
cta:         { h2: 'What daili does with this', html: <2 paragraphs + the link> }
```

No `itemList` — five reasons written as prose sections, not a list of named
things.

## Prose fidelity — measured

Stripped the tags out of the body fragment, stripped the markdown out of the
draft between the H1 and "## Frequently asked questions", and diffed the two
word streams. **Seven differences, all of them punctuation splitting off from a
word at a tag boundary** (`<em>you</em>,` → `you` + `,`; `<strong>The fix</strong>:`
→ `fix` + `:`). Zero word differences. Nothing was rewritten, softened or
dropped.

**Reason 4 is intact, both halves.** "Then let one small thing be missed. Not a
hospital appointment. A swimming lesson, a non-critical thing with a survivable
consequence." The hedge is in the same paragraph as the advice, as the draft
had it.

## Word count

| | words |
|---|---|
| Draft, H1 through the CTA, publishing notes excluded | 1,301 |
| Rendered `<article class="post">` | 1,305 |

**+0.3%.** The four extra words are the byline the template adds
("Ammar Khatib · 8 September 2026"). Nothing was dropped.

Worth knowing: the draft's front-matter says `word_count: ~1,520`. The real
figure is ~1,300. The article is not short — that estimate was just high.

## Links — the whole set

| Post | Anchor | Target |
|---|---|---|
| 7, reason 5 | decide what "the calendar" is for | `/blog/shared-family-calendar-rules/` |
| 7, day 14 | Ten minutes together, looking at the next fortnight | `/blog/shared-family-calendar-rules/` |
| 7, CTA | See how the family calendar works → | `/` |
| 4, rule 2 | one person carrying every arrangement in their head | `/blog/nobody-uses-the-family-calendar-app/` |

**Zero external links** — `grep -c 'href="http'` on the body fragment → 0. No
habit-formation citation was added; the "21 days" claim is folklore and the FAQ
answers the question honestly ("two weeks of daily use is the realistic marker")
without pretending to a study. No `rel="noopener"` was needed because nothing
leaves the site.

The three ⏳ links (posts 10, 14, 17) were left out. They still point at
unpublished slugs.

## Guards

`npm run build` clean: **62 pages, 7 posts, 60 sitemap entries**, detector 32
cases. The only warnings are the ten pre-existing translation length-ratio ones,
unchanged from before this commit.

| Check | Result |
|---|---|
| `<h1>` count on the post | 1 |
| canonical | `https://daili.app/blog/nobody-uses-the-family-calendar-app/` |
| hreflang **in `<head>`** | 0 (the 25 page-wide hits are the nav language switcher — post 6 has the same 25) |
| og:image | the post's own hero |
| FAQ parity | 3 questions, visible **and** in the FAQPage JSON-LD, byte-identical |
| JSON-LD blocks | Article + FAQPage, both parse |
| hero file present | 1200×800, measured |
| sitemap | 1 entry |
| `/blog/` index | card present, first (sorted by `published`) |
| `feed.xml` | new `<item>`, `Tue, 08 Sep 2026` |

## Browser — 360px, light and dark

Chrome 152 headless over CDP, `Emulation.setDeviceMetricsOverride`
(360 CSS px, DPR 2, mobile) and `Emulation.setEmulatedMedia` forcing
`prefers-color-scheme`. Both schemes really applied — body computes to
`rgb(252,250,244)` light and `rgb(14,21,18)` dark.

**`documentElement.scrollWidth` is 360 against a `clientWidth` of 360 in both
schemes.** No horizontal overflow anywhere in the article.

`shots/006-post7-360.png`, `-dark.png` (full page, 7,142 CSS px tall), plus
`-top.png`, `-faq.png`, `-dark-cta.png` and the two link paragraphs.

## Hero

Opened the `.webp` before shipping. Landscape 1200×800: a woman with dark hair
tied back, chin on her hand, looking flatly at a laptop on a dark wooden table;
behind her a girl in dungarees is mid-shout and a small boy in red is climbing
on the sofa. The alt text — "a tired mother working at a laptop while her
children play around her" — is what the photo shows, so it stayed as the
front-matter had it.

Against its neighbours: post 5 is a bright white kitchen, post 6 a warm close-up
of a grandmother at a pale table, post 4 an evening dinner table. **Post 6 is the
closest** — both have an adult and children at a table — but the two read
differently on a page: post 6 is a tight, warm, smiling close-up in beech and
cream; post 7 is a wide, cool, weary frame on dark walnut with the children
behind rather than beside the adult. Publishing a day apart, I think that holds.
Flagging it because it is the one pairing I would not call obviously distinct.
