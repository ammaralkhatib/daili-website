# Post 14 — Should Teenagers Have Private Events on the Family Calendar?

Live at `/blog/teenagers-private-events-family-calendar/`, published
`2026-09-15`. Commit `2803327`. Two files as the recipe describes — the body fragment and one
`BLOG_POSTS` entry. Nothing else touched. Third post in the `adoption` cluster.

## The two sentences that carry the tone

Both survive, untouched, and I checked them in the built page rather than in the
file I wrote:

- *"The second list is not illegitimate — you are their parent and you care"* —
  1 hit, in the body where the draft has it.
- *"a teenager wanting privacy about an ordinary evening is developmentally
  normal, not evidence of a problem"* — 2 hits, which is correct: the visible
  FAQ and the FAQPage JSON-LD are the same string by construction.

No prose was edited anywhere in the post. Rendered article **1,258** words
against the draft's **1,252** — **+0.48%**, the six words being the byline.

## The account-age list is exactly the verified one

> 13 in many places, 14 in Austria, 15 in France, 16 in Germany, Ireland and the
> Netherlands among others.

Not extended, not reworded, no country added. One external link, on that
sentence, `rel="noopener"`:
`https://support.google.com/accounts/answer/1350409`. It is the only external
link on the page.

## 🟠 The hero is a parent standing over her, arms on hips

The file is there, 1200×800, landscape, 56 KB, and it is genuinely about this
article: a teenage girl on her phone, an adult in the room. Shipped.

But look at the adult. She is standing at a distance with **both hands on her
hips**, watching. At hero size it is small, and the girl reads relaxed — almost
smiling — which pulls it back. Still, on a post whose stated 🔴 risk is that it
"must not take the parent's side against the teenager or the reverse", the
picture at the top has the parent standing over the teenager in the posture of
someone about to say something. The article's own argument is that monitoring
costs you.

It is arguable, not clear-cut, which is why this is 🟠 and shipped rather than
blocked. If you want it swapped, what this post wants is either the teenager
alone with her phone, or the two of them talking as equals — the conversation
the article recommends, not the standoff it warns about.

**The alt text I changed.** The draft's front matter said *"A teenage girl
looking at her phone in a living room with her mother standing behind her"*.
Looking at the file: the woman is across the room facing her, not behind her,
and the room has a bed, blankets and clothes on the floor. Relationship is not
visible either. Shipped as:

> A teenage girl sitting on a bed looking at her phone, with a woman standing
> across the room watching her

This is the one place I departed from "front-matter values verbatim", and it is
the departure the recipe asks for — *"Alt text describes the photo, not the
post. Fix it after you look."* Post 12 spent a commit this morning on exactly
this going stale, so I would rather flag it twice than let it ship wrong.

**Neighbours:** post 13 (14 Sep) is also a woman and a girl in a warm-toned
frame, which is the only pairing worth a second look. They separate on setting
and scale — a tight supermarket chiller aisle versus a wide domestic interior,
and a small child in a trolley versus a teenager — so at index size they do not
read as a pair. Post 15's hero is papers and a laptop, so the run breaks after
this.

## Links

Two internal, both live, both where the draft's notes put them:

| Anchor | Target |
|---|---|
| Most family apps let an event be visible only to its creator | `/blog/shared-family-calendar-rules/` (rules 4 and 5) |
| Worth knowing if you are choosing an app for this | `/blog/family-app-children-data/` |

The account-age paragraph carries both the internal link (on the lead-in) and
the external one (on the age sentence), so they do not sit on top of each other.

The draft's third note — *"live location tracking … deserves its own
conversation"* — stays **unlinked**, as instructed. There is no target and
pointing it at something loosely related would be worse than leaving it.

The third `/blog/…/` href in the page is the language picker's own EN entry,
`aria-current="true"` — layout, not article.

## The CTA states a feature and stops

One paragraph plus the link, exactly as the draft has it. I left a comment above
it in `site.config.mjs` saying not to expand it, because the next person editing
this file will not have read the prompt.

## Guards

`npm run build` clean — `content OK · 28 locale(s)` · `legal OK` ·
`built 131 pages · 129 sitemap entries` · `blog: 14 post(s)` · `build OK` ·
`detector OK`. The eight content warnings are the pre-existing locale
length-ratio ones.

On the new post: one `<h1>`; canonical
`https://daili.app/blog/teenagers-private-events-family-calendar/`; its own
description; **0 hreflang in the `<head>`**; `og:type article` with its own hero;
all three FAQ questions visible and in the FAQPage JSON-LD; hero exists and is
referenced; in the sitemap with no `xhtml:link`; no duplicate slug.

JSON-LD: Article 1 · FAQPage 1 · WebPage 1 · Organization 1 · Person 1 ·
ImageObject 1 · Question 3 · Answer 3. No HowTo, no ItemList — Article + FAQPage
is what the draft specifies.

Front door: on `/blog/`, one `<item>` in `/blog/feed.xml`, one `<loc>` in the
sitemap.

## Browser — 360px, light and dark

Chrome headless over CDP at DPR 2, `prefers-color-scheme` emulated both ways.
`rgb(251,249,242)` light, `rgb(14,23,18)` dark. `scrollWidth` 360 against
`clientWidth` 360 in both, no element inside `#main` past 360px, page height
6,721 CSS px identical in both schemes. The `<em>` block quote and the bold tier
lead-ins hold their shape at phone width.

`shots/005-post14-360-top.png`, `-top-dark.png`, `-mid.png`, `-mid-dark.png`,
`-faq.png`, `-faq-dark.png`.

## Still open

- The hero, above.
- **Post 7 owes this post a link it cannot give.** Its draft holds
  `⏳ The teenager FAQ → /blog/teenagers-private-events-family-calendar`, but
  post 7's teenager passage is a **FAQ answer**, and FAQ answers render through
  `{{ .a }}`, which escapes — an `<a>` there ships as visible angle brackets.
  Post 7's body never mentions privacy or a teenager's resistance, so there is
  no honest anchor to move it to. Left unlinked; see the note below.
- Post 9's `⏳ Question 5 → post 14` **is** on a body paragraph and is being
  added in the next commit.

## Worth fixing in the recipe

This is the third planned link this week that landed on a FAQ answer and could
not be rendered — post 13's "adoption rather than migration", post 7's teenager
FAQ, and post 12's earlier one that did work only because it happened to be in
the body. Drafts keep planning links into the one part of a post that cannot
carry them.

One line in `BLOG-POST-TEMPLATE.md` under the internal-links rule would stop it:
*links can only go in the body — `faq` answers are escaped, so plan anchors in
the prose.* I have not added it, because you have that file open with your own
changes.
