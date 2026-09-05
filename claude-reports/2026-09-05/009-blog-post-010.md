# Post 10 — How to Get Your Partner to Actually Use the Family Calendar

Live at `/blog/get-partner-to-use-family-calendar/`. Commit `f0efcc2`. Two files as the recipe
describes, **plus the two ⏳ backlinks in posts 4 and 7 that this publish
unblocks** — the recipe says to add each when its target publishes, and post 10
is the target both were waiting on. Second post in the `adoption` cluster.

## The 🔴 section is intact

"When it is not really about the calendar" shipped **word for word**, all three
paragraphs, as the last section before the FAQ. The sentence the prompt was
protecting — *"the calendar is not the problem — it is where the problem is
visible. The load was already unequal; the app just made it countable"* — is
there. Nothing was softened and nothing was moved below the CTA.

Nothing else in the prose was touched either; see the fidelity measurement
below.

## Prose fidelity — measured, not asserted

Draft body against the shipped fragment, tokenised and diffed:

| | words |
|---|---|
| Draft body | 898 |
| Fragment | 900 |

**Two differences, both punctuation splitting off at a tag boundary**
(`one` + `,` and `together` + `.`), which is what wrapping an anchor around a
phrase does to a word list. Zero word changes.

FAQ and CTA: **byte-for-byte the draft**, 174 words each side, empty diff.

## Links

**Two live, one deliberately not added.**

| Anchor | Target | Where |
|---|---|---|
| "muted it in week one" | `/blog/nobody-uses-the-family-calendar-app/` | point 4 |
| "looking at the next fortnight together" | `/blog/shared-family-calendar-rules/` | point 6 |

The ⏳ link in "When it is not really about the calendar" →
`/blog/family-app-month-three-cleanup` (post 17) is **not** in the file. It does
not exist yet and would fail check-build section 2.

**No external links.** `grep -c 'href="http'` on the fragment → 0. No
household-labour study was added, as the prompt and the draft both asked.

Screenshot: `shots/009-post10-360-link-post7.png`.

## The two backlinks this publish unblocks

No words changed in either post — existing text wrapped in an anchor.

1. `blog/nobody-uses-the-family-calendar-app.en.html:11` — "there is
   <ins>a human API that is quicker</ins>". That clause is post 10's whole
   thesis, so the anchor names the destination rather than saying "read more".
   `shots/009-post7-360-post10-link.png`.
2. `blog/shared-family-calendar-rules.en.html:27` — rule 3, "That person is now
   <ins>a human data-entry service</ins>". `shots/009-post4-360-post10-link.png`.

Both were listed as ⏳ in their drafts' publishing notes pointing at this slug.
Post 7's ⏳ list is now down to posts 13 and 17; post 4's to post 17 (plus the
rule-5 item below).

## `BLOG_POSTS` entry

```js
slug:        'get-partner-to-use-family-calendar'
cluster:     'adoption'
title:       'How to Get Your Partner to Use the Family Calendar'
h1:          'How to Get Your Partner to Actually Use the Family Calendar'
published:   '2026-09-11'   updated: '2026-09-11'
image:       '/assets/img/blog/get-partner-to-use-family-calendar.webp'  1200×800
faq:         3 questions
cta:         'What daili does with this'
```

Appended last; the index and the feed sort by `published`, so it lands first in
both.

## Hero — and an alt-text fix

Opened the `.webp` before shipping. Landscape 1200×800, measured not guessed. A
man in a pale blue polo stands holding a phone; a woman in a striped pinafore
leans against his shoulder with one hand and points at his screen with the
other. Bright, blurred lobby-ish interior behind them. Both faces visible, both
looking down at the one phone — which is the article's photo, two adults and one
calendar.

The draft's alt text was *"Two adults indoors leaning in together over one phone
screen."* **I changed it to "A couple standing indoors looking at one phone
together, one of them pointing at the screen"** — the recipe says to fix alt
text after looking, and the pointing hand is the thing actually happening in the
frame; "leaning in together" describes a mood rather than the picture.

Against its neighbours: post 8 is a tight portrait of a woman on a phone call,
post 9 a headless crop of an adult and a child with a tablet. This is a wide
two-adult frame in a public interior. No repeat.

## Guards

`npm run build` clean: **65 pages, 10 posts, 63 sitemap entries**, detector 32
cases. Only the ten pre-existing translation length-ratio warnings.

| Check | Result |
|---|---|
| `<h1>` count | 1 |
| canonical | `https://daili.app/blog/get-partner-to-use-family-calendar/` |
| hreflang **in `<head>`** | 0 |
| og tags | `og:image` is the post's own hero; type/url/title/description present |
| FAQ parity | 3 questions, visible **and** in FAQPage JSON-LD, identical |
| JSON-LD | Article + FAQPage, both parse |
| internal links resolve | both targets exist in `dist` |
| hero file | present, 1200×800 measured from the file |
| sitemap | 1 entry |
| `/blog/` index and `feed.xml` | card and `<item>` present, `Fri, 11 Sep 2026` |

## Word count

Rendered article (`innerText`, hero caption to CTA) **1,175 words** against
**1,182** for the draft's body + FAQ + CTA counted as markdown — a **0.6%**
gap, and all of it is markdown syntax (`##`, `**`, link brackets) that does not
render. Well inside the ~2% rule.

## Browser — 360px, light and dark

Chrome 152 headless over CDP, 360 CSS px at DPR 2, `prefers-color-scheme`
emulated in both directions. Both schemes applied — `rgb(252,250,244)` light,
`rgb(14,21,18)` dark.

**`scrollWidth` 360 against `clientWidth` 360 in both**, and a sweep of every
element in `body` for a right edge past 360px returned an empty list. Page
height 6,612 CSS px, identical in both schemes. 10 `<h2>` (8 body, FAQ, CTA).

`shots/009-post10-360-top.png`, `-360.png`, `-360-dark.png`,
`-360-faq-cta.png`, `-360-dark-faq-cta.png`.

## Still open from earlier posts

- Post 4's FAQ link to post 7 still needs your decision on the `{{ .a }}`
  escaping (report 006, section 1).
- Post 4 still owes its rule-5 ✅ link to post 6.
