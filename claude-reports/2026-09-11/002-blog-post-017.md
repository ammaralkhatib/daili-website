# Post 17 — Month Three: When the Family App Is Full of Dead To-Dos

Live at `/blog/family-app-month-three-cleanup/`, published `2026-09-18`. Commit `e4c3c3b`. Two
files as the recipe describes, **plus one deliberate edit to a published post** —
post 10's ⏳ link, which the prompt asks for and which is described below.

This completes cluster C. The interlink audit the prompt asks for is at the end,
and **the answer is no, not yet** — two of the five are thinly connected, for a
reason worth knowing.

## Prose and the closing line

Unchanged. Rendered article **1,042** words against the draft's **1,035** —
**+0.68%**, the byline.

The CTA's last line survives exactly as written:

> None of that removes the need for the ten minutes a month. No app does.

I put a comment above the `cta` in `site.config.mjs` saying why it stays, since
it is the kind of sentence a later editor trims for being "negative" without
realising it is the point.

## No external links, and no habit study

The article carries **zero** external links — I parsed the `<article>` element
rather than grepping the page, so the store badges and nav in the layout could
not mask a miss. `21 days` appears 0 times, and the word "study" 0 times. The
folklore stayed out.

## Links

Three internal, all live, all where the draft's notes put them:

| Anchor | Target |
|---|---|
| people quietly stop opening the app | `/blog/nobody-uses-the-family-calendar-app/` |
| private parallel system | `/blog/get-partner-to-use-family-calendar/` |
| One ten-minute sweep a month | `/blog/shared-family-calendar-rules/` |

The third sits inside the bold lead-in of the first habit, because that is the
phrase the note names and post 4's rule 7 is exactly that habit.

## The edit to post 10

Post 10's draft has held this since it published:

    - ⏳ "When it is not really about the calendar" → /blog/family-app-month-three-cleanup

That section is about the household load being unequal, not about list decay, so
the link went on its **opening sentence** rather than anywhere deeper:

> [Sometimes none of this works](/blog/family-app-month-three-cleanup/), and it
> is worth naming why.

Post 17 is a second answer to "none of this works" — the app decayed until
looking at it felt bad — so the anchor promises what the target delivers. The
alternative anchor in that section, "a list you can both look at", would have
pointed a reader expecting a household conversation at a cleanup procedure.

No prose changed; the `<a>` wraps text already there. Draft note flipped to ✅
with the anchor and date.

## 🔴 Cluster C does not fully interlink. Two gaps.

Outbound links between the five cluster-C posts, read out of the built pages:

| | → 4 | → 7 | → 10 | → 14 | → 17 |
|---|---|---|---|---|---|
| **post 4** | — | ✅ | ✅ | ✗ | ✗ |
| **post 7** | ✅ | — | ✅ | ✗ | ✗ |
| **post 10** | ✅ | ✅ | — | ✗ | ✅ |
| **post 14** | ✅ | ✗ | ✗ | — | ✗ |
| **post 17** | ✅ | ✅ | ✅ | ✗ | — |

Inbound count within the cluster: **post 4 → 4 links, post 7 → 3, post 10 → 3,
post 17 → 1, post 14 → 0.**

**Post 14 has no inbound link from anywhere in its own cluster.** Its only
in-links are from posts 9 and 15, both cluster D. That is not an oversight in
this run — the only cluster-C link ever planned to it was post 7's
`⏳ The teenager FAQ`, and that passage is a **FAQ answer**, which the template
renders through `{{ .a }}` and escapes, so it cannot carry an `<a>`. I reported
that yesterday and left the ⏳ open rather than flipping it.

**Post 17 has one inbound**, the post 10 link added above. Nothing in posts 4, 7
or 14's drafts points here.

So the chain the prompt names — 4 ↔ 7 ↔ 10 ↔ 14 ↔ 17 — holds for 4, 7, 10 and
now 17, and **breaks at 14 in both directions** (it links out only to the
pillar, and nothing in the cluster links in).

**What would fix it, none of which I did, because all three need prose you own:**

1. **Post 7 → post 14.** Its body has one teenager sentence, about calendar
   sprawl rather than privacy. Either add a clause to post 7's body, or accept
   that the link lives only in the FAQ answer where it cannot be a link.
2. **Post 14 → post 7 or 10.** Post 14's "Setting it up so the argument happens
   once" is one sentence away from the adoption posts, but there is no existing
   phrase that honestly points at either.
3. **Post 4 or 7 → post 17.** Post 4's rule 7 (the weekly review) is the natural
   parent of the monthly sweep, and post 17 already links *up* to it. A single
   anchor on post 4's rule 7 would make that reciprocal and give post 17 a
   second inbound.

Each is a one-anchor edit to a published post, the same shape as the post 10
edit above. Say the word and I will do them; I did not add them unasked because
the recipe's rule is that only links marked ✅ in a draft get added.

## Hero

1200×725, 44 KB, landscape: a cluttered white desk, a laptop, an open notebook
with a handwritten checklist, and a pink sticky note reading **DONE** near the
middle of the frame. On an article about a list that has stopped being trusted,
the clutter *is* the subject, and the one legible word on it is the right one.

**The alt text is the draft's, verbatim** — "A desk covered in colourful sticky
notes, checklists and notebooks around a laptop". First hero in five where the
front-matter alt survived looking at the file, so the note I left on post 16
stands but is not urgent.

Neighbours: post 16 is a phone over tiles, post 15 a woman with papers in a grey
kitchen. Post 15 and this one are both "paper and a laptop", two days apart with
post 16 between them, but one is a person in a kitchen and this is an object
still-life at close range, so they do not read as a pair on the index.

## Guards

`npm run build` clean — `built 134 pages` · `blog: 17 post(s)` · `build OK` ·
`detector OK`. On the new post: one `<h1>`; own canonical and description; **0
hreflang in the `<head>`**; `og:type article` with its own hero; three FAQ
questions visible and in the FAQPage JSON-LD; hero exists and is referenced; in
the sitemap with no `xhtml:link`; no duplicate slug. JSON-LD: Article 1 ·
FAQPage 1 · WebPage 1 · Organization 1 · Person 1 · ImageObject 1 · Question 3 ·
Answer 3.

On `/blog/`, one `<item>` in the feed, one `<loc>` in the sitemap. Section 2
resolves the new link in post 10.

## Browser — 360px, light and dark

`rgb(251,249,242)` light, `rgb(14,23,18)` dark. `scrollWidth` 360 against
`clientWidth` 360 in both, nothing inside `#main` past 360px, page height 5,841
CSS px identical in both schemes. No table, no list markup beyond the bold
lead-in paragraphs, so nothing new for the stylesheet.

`shots/002-post17-360-top.png`, `-top-dark.png`, `-mid.png`, `-mid-dark.png`,
`-faq.png`, `-faq-dark.png`.
