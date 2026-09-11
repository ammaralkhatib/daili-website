# Post 16 — How to Share a Calendar With Someone on Android

Live at `/blog/share-calendar-with-android-family-member/`, published
`2026-09-17`. Commit `4d78a1e`. Two files as the recipe describes. Second post in the `devices`
cluster and post 12's spoke.

## 🟠 The hero is a phone running Android 11

The file is there, 1200×800, landscape, 44 KB: a hand holding an Android phone,
screen filled with the big green dot and an orange **11**. That is the Android
version screen, and Android 11 shipped in 2020.

So the single most legible thing in the hero is a **six-year-old version
number**, on an evergreen how-to that is meant to rank for years. This is the
same class of problem as post 12's original hero — the photo is fine, it is just
carrying a fact the article does not want to assert. A reader who notices it
reads the post as written in 2020 and stops trusting the Google-Calendar steps.

**Shipped rather than blocked**, because the recipe only makes a *missing* hero
a blocker and you deploy by hand — so you see this before anyone else does. I
would swap it. What this post wants is a hand holding an Android phone with
**no legible OS branding**: a lock screen, a calendar grid, or a screen at an
angle where the version dot is not readable.

**Alt text is not the draft's.** The front matter said "showing a setup screen";
it is the version screen, on a patterned tiled floor. Shipped as:

> A hand holding an Android phone showing the Android version screen, over a
> patterned tiled floor

That is the fourth hero in a row whose front-matter alt did not survive looking
at the file — see the note at the end.

Neighbours are fine: post 15 is a woman with papers in a cool-grey kitchen, post
14 a teenager's room. This is the first close-up object shot in a week, so it
stands out on the index for the right reason.

## 🔴 The three omissions, checked on the built page

- **No refresh-interval number.** `12 hours` → 0 hits, `12-hour` → 0. The "Why
  it takes so long to update" section says Google does not publish the interval
  and that people report delays of many hours, which is true without a number.
- **No `calendar/syncselect`.** 0 hits.
- **No Apple "Family" auto-create claim.** The phrase does not appear; this post
  never discusses Apple's family group at all.

Apple's read-only sentence is quoted verbatim, and is the line the competing
pages get wrong:

> "People who subscribe to your public calendar can view it, but can't change
> it."

## 🔴 The public-link privacy warning

Intact, in Method 1, in its own paragraph:

> a public calendar link is public. Anyone who has the URL can see it. Do not
> put a public link somewhere it can be found, and do not use this method for a
> calendar containing things you would not want a stranger to read.

It is also the last row of the "Which to choose" table — *Something confidential
is on the calendar → Not method 1* — so a reader who only skims the table still
meets it.

## Links

**Four external**, all first-party, all `rel="noopener"`, all 200 when I checked
them:

| Anchor | Target |
|---|---|
| iCloud.com | `support.apple.com/guide/icloud/share-a-calendar-mm6b1a9479/icloud` |
| Apple's own words | `support.apple.com/guide/calendar/share-icloud-calendars-icl32362/mac` |
| in their own words | `support.google.com/calendar/answer/99358` |
| any ICS link you add on an iPhone | `support.apple.com/en-us/102301` |

**Three internal**, all live:

| Anchor | Target |
|---|---|
| an Apple account they do not have | `/blog/mixed-iphone-android-family-calendar/` |
| a family app where iPhone and Android are both first-class | `/blog/mixed-iphone-android-family-calendar/` |
| everyone has to actually open it | `/blog/nobody-uses-the-family-calendar-app/` |
| shopping lists and to-dos | `/blog/switch-family-app-without-losing-lists/` |

The pillar gets two of them, as the draft's notes ask — once in the intro, once
in method 3.

**One thing I did and undid, worth telling you.** The draft's note says the
intro should link the pillar, and the intro has no sentence about mixed
households to hang it on, so I wrote one: *"This is the narrow version of a
bigger question: what works in a mixed iPhone and Android household."* Then I
deleted it. Adding a sentence is editing the prose, which the recipe forbids and
which is not my call. The link went instead on "an Apple account they do not
have", which is already in the first paragraph and is exactly what post 12's
first section explains. Nothing invented reached the build.

## Prose, table, schema

Prose otherwise unchanged. Rendered article **1,122** words against the draft's
**1,108** — **+1.26%**. Larger than this week's other posts because the table
renders its cells as words on both sides of the comparison and the em-dashed
cells split differently; within the ~2% the recipe asks for.

The "Which to choose" table is in `<div class="table-wrap"><table
class="post-table">`, as instructed, with `<thead>`/`<tbody>` and `scope`
attributes matching post 1's.

JSON-LD: Article 1 · FAQPage 1 · WebPage 1 · Organization 1 · Person 1 ·
ImageObject 1 · Question 3 · Answer 3. Article + FAQPage, as the draft
specifies. No `itemList` — the table is a comparison, not a list of named
things.

## Guards

`npm run build` clean — `built 133 pages` · `blog: 16 post(s)` · `build OK` ·
`detector OK`. On the new post: one `<h1>`; own canonical and description; **0
hreflang in the `<head>`**; `og:type article` with its own hero; three FAQ
questions visible and in the FAQPage JSON-LD; hero exists and is referenced; in
the sitemap with no `xhtml:link`; no duplicate slug. On `/blog/`, one `<item>`
in the feed.

Nothing in the other fifteen drafts points at this post, so there is no ⏳ to
close behind it.

## Browser — 360px, light and dark

`rgb(251,249,242)` light, `rgb(14,23,18)` dark, page height 6,178 CSS px
identical in both. Document `scrollWidth` 360 against `clientWidth` 360 — **the
page does not scroll sideways**.

The element sweep does report the table and its cells at 519px. That is correct
and intended: `.post-table` carries `min-width:500px` and `.table-wrap` is
`overflow-x:auto`, so the table scrolls inside its own box exactly as the
stylesheet comment describes. At 360px the Method column is cut off until you
swipe it — same as post 1's table, and the reason the last row's warning is also
in the prose above.

`shots/001-post16-360-top.png`, `-top-dark.png`, `-mid.png`, `-mid-dark.png`,
`-faq.png`, `-faq-dark.png`.

## The alt-text pattern is now four for four

Post 12's alt went stale on a hero swap; post 14 said "living room … standing
behind her" for a bedroom and a woman across the room; post 15 said "desk" for a
kitchen table; post 16 says "setup screen" for a version screen. Every one was
written from the Pexels description rather than from the file.

`IMAGES-TODO.md` is where the descriptions come from, and it is still untracked,
so I have not restructured it. The cheap fix is to treat its last column as a
*search note*, not as alt text, and write alt at publish time from the file —
which is what the template already says under "learned the hard way". A line
under the front-matter list saying `imageAlt` is provisional until someone has
opened the .webp would make that explicit.
