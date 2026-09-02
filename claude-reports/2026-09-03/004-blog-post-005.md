# Post 5 — What Cozi's Free Plan Actually Includes in 2026 (pillar B)

Live at `/blog/cozi-free-plan-what-you-get/`. Two files, as the recipe describes:
the body fragment and one `BLOG_POSTS` entry. Nothing in `build.mjs`,
`style.css` or the guards needed touching. First post in the `cozi` cluster.

**One sentence was cut from the prose, on the prompt's instruction. Read the
next section before publishing.**

## 🔴 The two facts

### 1. The Google Play quote — CONFIRMED, verbatim

Retrieved from
`https://play.google.com/store/apps/details?id=com.cozi.androidfree&hl=en_US&gl=US`
today. The listing's own description reads:

> Cozi also offers an optional ad-free premium subscription called Cozi Gold
> which gives you additional features, including access to add, edit and view
> events **more than 30 days ahead**, more reminders, mobile month view, change
> notifications, and birthday tracker.

The draft quotes `"add, edit and view events more than 30 days ahead."` — that
is word-for-word the source, so it stands unchanged. (The full stop sits inside
the quotation marks where the source has a comma; that is the sentence's own
punctuation, not a claim about the source, and it is how the other posts quote.)

### 2. Cozi Max is a 2025 launch, not 2026 — SENTENCE CUT

`https://www.cozi.com/blog/introducing-cozi-max/` does open. It has no visible
date, but its JSON-LD does, and it is Cozi's own page:

```
"headline":"Introducing Cozi Max: Organize Automatically",
"datePublished":"2025-11-10T16:55:28+00:00",
"dateModified":"2025-11-10T22:49:23+00:00"
```

The hero image is served from `/wp-content/uploads/2025/11/`, which agrees.

So the claim was not merely unconfirmed — **it is wrong**. Cozi Max launched
**10 November 2025**. Per the prompt ("if either cannot be confirmed, cut that
sentence… do not soften it into a vaguer claim"), the closing paragraph of
"What actually changed, and when" is **not in the published post**:

> ~~What is genuinely new in 2026 is Cozi Max, the AI tier. That is an addition,
> not a removal.~~

Both sentences went, not just the first — "That is an addition, not a removal"
has no antecedent on its own. The section now ends on "That absence of notice is
most of what made people angry", which is a stronger close anyway.

Nothing else in the post depends on it. Max is still described in "Cozi now has
three tiers, not two", with no date attached, and that section is sourced from
`/compare-plans/`.

**Your call, Ammar.** If you want the point back, it is now a verified fact and
a drop-in replacement would be:

> What is genuinely new — Cozi Max, the AI tier, announced on Cozi's blog on 10
> November 2025 — is an addition, not a removal.

I did not add it, because the prompt said cut rather than rewrite. Say the word
and it goes in with the blog post as its link.

## The `BLOG_POSTS` entry

Appended after post 4, values verbatim from the draft's front-matter:

```js
slug:        'cozi-free-plan-what-you-get'   // pillar — never change it
cluster:     'cozi'
title:       'What Cozi\'s Free Plan Actually Includes in 2026'
h1:          'What Cozi\'s Free Plan Actually Includes in 2026'
description: 'Cozi now has three tiers, not two. What free really gives you,
              what the 30-day calendar limit is, and why so many 2026 blog
              posts get the timeline wrong.'
published:   '2026-09-06'   updated: '2026-09-06'
body:        'cozi-free-plan-what-you-get.en.html'
image:       '/assets/img/blog/cozi-free-plan-what-you-get.webp'
imageAlt:    'A father checking his phone in the kitchen while his children eat
              breakfast'
imageWidth:  1200   imageHeight: 801   // read off the file, not copied
faq:         [3 questions, verbatim from the draft]
cta:         { h2: 'What daili does with this', html: <2 paragraphs + the link> }
```

`title` and `h1` are the same string here — the draft gives them as the same and
the title is already the query.

Hero opened before shipping: landscape 1200×801, a bearded man in grey leaning
on a pale kitchen counter with a mug in one hand and his phone in the other
while two children eat cereal at a white table. The alt text describes that.
Against its neighbours it is fine — post 4 is a crowded dinner table shot at
evening warmth, this is an empty-toned white kitchen in the morning.

## The three honesty guardrails — all intact

| Guardrail | Where | Present |
|---|---|---|
| The reviews section (14 Trustpilot vs ~397,000 App Store) | `<h2>A word about the reviews</h2>`, 3 paragraphs | ✅ |
| "Paying $39 solves all of it… pay it and stop reading blog posts about alternatives" | last paragraph of the article | ✅ |
| "treat this as interested rather than neutral" | first sentence of the CTA | ✅ |

None trimmed, none reworded. The CTA sentence is in the screenshot below.

## Links

Six `href` in the body fragment. Every outbound one is on the allowed list —
cozi.com, the Google Play listing, Trustpilot — and each hangs off a phrase the
draft already wrote, so no prose moved to make room for a link.

| Anchor | Target | Kind |
|---|---|---|
| "Cozi's own comparison page" | `https://www.cozi.com/compare-plans/` | external |
| "Cozi's US site" (the $39 note) | `https://www.cozi.com/cozi-gold/` | external |
| "Google Play store listing" | the `com.cozi.androidfree` listing | external |
| "Trustpilot reviewers" | `https://www.trustpilot.com/review/cozi.com` | external |
| "see the collision coming" | `/blog/shared-family-calendar-rules/` | internal ✅ |

All four external links carry `rel="noopener"`. **`mycozi.zendesk.com` appears
nowhere** in the rendered page, and no rival listicle is cited.

The internal link is the one the draft marks ✅ *once post 4 publishes*. Post 4
is live (`19b2895`, published 2026-09-05), so it went in, pointing at rule 6 —
"two weeks ahead, minimum", which is exactly the claim the sentence makes.

Still ⏳, not added:

- "posts about alternatives" → `/blog/switch-family-app-without-losing-lists`
- the 30-day section → `/blog/cozi-30-day-calendar-limit`

## Schema

Two JSON-LD blocks: `Article` and `FAQPage`. No `ItemList` — this post is an
argument, not a list of named things. FAQ parity holds: the three visible `<h3>`
strings and the three `mainEntity[].name` strings are the same strings by
construction, because `faq` exists only in `BLOG_POSTS`.

## Guards

`npm run build` clean:

```
content OK · 23 locale(s) · 159 keys each
built 60 pages · 23 locale(s) · 58 sitemap entries
blog: 5 post(s) · /blog/ index · feed.xml
build OK · 60 pages · 52 in hreflang clusters
detector OK · 32 cases · 23 locale(s) built
```

The 10 content warnings are the pre-existing translation length ratios,
untouched.

On the new post: one `<h1>`; canonical
`https://daili.app/blog/cozi-free-plan-what-you-get/`; **0 `hreflang` in the
`<head>`** (the 25 that `grep -c` finds in the whole file are the footer
language picker, and post 4 has the same 25); its own description and `og` hero;
FAQ parity; hero file present; no duplicate slug; in the sitemap with no
`xhtml:link` alternates.

It appears on `/blog/` and as a new `<item>` in `/blog/feed.xml` (5 items), both
sorted newest-first off `published`, so it is at the top.

## Word count

Draft article (front-matter and publishing notes excluded; H1, FAQ and CTA
included, markdown emphasis and link syntax stripped) 1,151 words · rendered
`<article>` 1,147 · **−4 (−0.3%)**.

A word-level diff of the draft against the rendered text finds exactly two
differences in the whole article:

1. the rendered byline "Ammar Khatib · 6 September 2026", which the draft has as
   a front-matter line; and
2. the deleted Cozi Max sentence, 18 words.

Every other word matches, in order.

## Prose changes

**One deletion, on instruction** — the Cozi Max sentence above. Otherwise
mechanical conversion only: `**` → `<strong>`, `*is*` → `<em>`, paragraphs
unwrapped from the draft's 79-column lines, five `##` → `<h2>`. Straight quotes
and the em dashes are the draft's own characters, copied through. No tables, no
lists, no inline images in this post.

## Browser

360px, light and dark, via `Emulation.setDeviceMetricsOverride` over CDP —
`--window-size=360` is still a crop of a wider layout on macOS, as posts 2, 3
and 4 recorded.

Measured on the post, both schemes: `innerWidth` 360, `scrollWidth` 360, and
**no element inside `.post` extends past the viewport**. Light `--paper`
`#FCFAF4` with prose `rgb(15, 29, 22)`; dark `#0E1512` with `rgb(232, 240, 234)`.
Seven `<h2>` in `.post` — five section headings plus the template's FAQ and CTA.
The post carries no colour rule of its own.

The H1 wraps to two lines at 360 ("What Cozi's Free Plan / Actually Includes in
2026") with no clipping, and the longest token in the body is
"notifications," at 14 characters, so nothing forces a horizontal scroll.

`shots/004-post5-360.png`, `shots/004-post5-360-dark.png`,
`shots/004-post5-360-cta.png`.

## Follow-up

- **Decide on the Cozi Max sentence.** Replacement text is above; it is now
  sourced.
- Two ⏳ internal links go in when `cozi-30-day-calendar-limit` and
  `switch-family-app-without-losing-lists` publish.
- The August-2026 Google Play reviewer complaint and Cozi's next-day reply were
  verified on 2026-09-02 and were not on today's re-check list. The listing's
  default review sample no longer surfaces that thread, so if you want it
  belt-and-braces, it wants a screenshot rather than another fetch.
- Google Play now shows **120K reviews**; the post says "about 119,000" ratings.
  Ratings and reviews are different counts and "about" covers it, so I left it.
- `./deploy.sh` — Ammar deploys.
