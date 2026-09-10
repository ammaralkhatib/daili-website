# Post 13 — Switch Family Apps Without Losing Your Lists

Live at `/blog/switch-family-app-without-losing-lists/`, published `2026-09-14`.
Commit `50e403b`.
Two files exactly as the recipe describes — the body fragment and one
`BLOG_POSTS` entry. Nothing else touched: no CSS, no template, no `build.mjs`,
no other post. Second post in the `cozi` cluster.

## Prose

Unchanged. Nothing was rewritten, reordered or dropped to make the HTML valid.
The five step leads inside "The two-week overlap plan" stand as their own
paragraphs — `<p><strong>Days 1–2: move the calendar.</strong></p>` — because
that is how the draft has them, on their own line between blank lines. Post 11
already carries a whole-paragraph `<strong>` for its disclaimer, so this is the
house shape, not a new one.

Word count: rendered article **1,009** words against the draft's **1,006**
(front matter, publishing notes and markdown syntax removed, h1 + FAQ + CTA
counted on both sides). **+0.30%**, and the three words are the byline —
"Ammar Khatib · 14 September 2026" — which the template adds and the draft has
no equivalent for. Nothing was lost.

The draft's front matter says `word_count: ~1,460`. That estimate is high; the
draft is 1,006 words as written. Nothing is missing from it — I diffed the
rendered article against the draft section by section.

## 🟠 Two of the four internal links moved to a different anchor

Four internal links, all live, all root-relative, exactly the four the draft
asks for. Two of them could not go where the publishing notes put them:

**"adoption rather than migration" → `/blog/nobody-uses-the-family-calendar-app/`.**
That phrase is in a **FAQ answer**, and FAQ answers cannot carry a link.
`templates/blogpost.html` renders them with `{{ .a }}`, which escapes — an
`<a>` there would ship to the reader as visible angle brackets, and the same
string goes into the FAQPage JSON-LD, where markup would be wrong anyway. (The
landing page's FAQ uses raw `item.a` and *can* carry links; the blog's
deliberately does not.) So the link went to the closest equivalent in the body,
in the intro: **"goes back to asking each other"** — the same failure the
target post is about.

**The free-tier link → `/blog/cozi-free-plan-what-you-get/`.** The notes point
at "the free-tier context", and the final prose has no free-tier sentence to
hang it on. The honest nearest match is the lists step's opening —
**"Shopping lists, to-do lists and recipes"** — which is exactly the inventory
post 5 tells you what the free plan includes and what it does not. It is the
weakest of the four; say so and I will move it.

The other two are where the draft put them:

| Anchor | Target |
|---|---|
| goes back to asking each other | `/blog/nobody-uses-the-family-calendar-app/` |
| read-only feed (an ICS link) | `/blog/mixed-iphone-android-family-calendar/` |
| Shopping lists, to-do lists and recipes | `/blog/cozi-free-plan-what-you-get/` |
| deleting your account deletes the whole family's data | `/blog/family-app-children-data/` |

No external links, as the draft specifies. No Cozi menus, button labels or
export steps anywhere — the post names no competitor's UI, and the blocked
export post keeps its job.

## No HowTo

Article + FAQPage only. The prompt allows `HowTo` and the two-week plan is a
genuine procedure, but **Google removed HowTo rich results from Search in
September 2023** — the markup validates and displays nothing. Emitting it here
would also mean new derivation machinery in `build.mjs` (reading step names back
out of the rendered body, the way `itemList` does) and a matching guard in
`tools/check-build.mjs`, turning a two-file change into a four-file one for no
search benefit. Put to Ammar mid-run; he chose to skip it.

No `itemList` either: this post is a procedure, not a list of named things.

## The `BLOG_POSTS` entry

Every value verbatim from the draft's front matter. `imageWidth`/`imageHeight`
measured from the file with `sips`: **1200 × 800**, which is what the front
matter claims. `faq` is the draft's three questions, `cta` its "What daili does
with this" section.

## The hero

`static/assets/img/blog/switch-family-app-without-losing-lists.webp`, 1200×800,
landscape 3:2. Looked at it: a woman and a young girl at a supermarket chiller,
the girl sitting in the trolley, the woman holding a phone. The alt text — "a
mother and daughter shopping together in a supermarket aisle" — describes the
photo, and the phone in her hand is a quiet bonus on a post whose closing
argument is "move the shopping list first".

Against its neighbours: post 12 is two phones on grey, post 5 is a father in a
kitchen. No clash. No legible on-screen text in any language, which is the
thing post 12's hero got wrong.

## Guards

`npm run build` clean. `content OK · 28 locale(s)` · `legal OK` ·
`built 130 pages · 128 sitemap entries` · `blog: 13 post(s)` · `build OK` ·
`detector OK`. The eight content warnings are the pre-existing locale
length-ratio ones; none is on the blog.

Section 11 on the new post specifically: one `<h1>`; canonical
`https://daili.app/blog/switch-family-app-without-losing-lists/`; its own
description; **0 hreflang in the `<head>`**; `og:type article` with its own hero;
all three FAQ questions both visible and in the FAQPage JSON-LD; hero file
exists and is referenced; in the sitemap with no `xhtml:link`. No duplicate slug.

JSON-LD blocks parse: Article 1 · FAQPage 1 · WebPage 1 · Organization 1 ·
Person 1 · ImageObject 1 · Question 3 · Answer 3. No HowTo, no ItemList.

Front door: on `/blog/` (twice — card link and title link), one `<item>` in
`/blog/feed.xml` titled "Switch Family Apps Without Losing Your Lists", one
`<loc>` in the sitemap.

## Browser — 360px, light and dark

Chrome headless over CDP, 360 CSS px at DPR 2, `prefers-color-scheme` emulated
both ways. Both schemes applied: `rgb(251,249,242)` light, `rgb(14,23,18)` dark.
`scrollWidth` 360 against `clientWidth` 360 in both, and a sweep of every
element inside `#main` for a right edge past 360px returned empty. Page height
5,583 CSS px, identical in both schemes. The post carries only `p`, `h2` and one
`ul` — no table, no blockquote — so nothing new for the stylesheet to cover. The
standalone bold step leads read as sub-headings at phone width, which is what
they are for.

The Claude-in-Chrome extension was not connected this session, so this is the
headless run rather than a live browser.

`shots/002-post13-360-top.png`, `-top-dark.png`, `-mid.png`, `-mid-dark.png`,
`-faq.png`, `-faq-dark.png`.

## Still open

- The free-tier link's anchor (above) is a judgement call, not the draft's.
- The blocked Cozi export post is still blocked, and this post deliberately does
  not do its job.
