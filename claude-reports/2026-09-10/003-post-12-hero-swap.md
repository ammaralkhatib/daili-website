# Post 12 — hero swapped, and the two values that did not follow it

Commit `b127ce5`.

Follow-up to `claude-reports/2026-09-05/005-blog-post-012.md`, which shipped the
post with an 🟠 on its hero: two Xiaomi phones, one showing a launcher overlay in
Russian, on an article about *one iPhone and one Android*.

Ammar swapped the photo. The new one is
`https://www.pexels.com/photo/multiethnic-couple-browsing-smartphones-on-couch-6303540/`
— a couple on a sofa, each holding their own phone, the two handsets visibly
different, no legible on-screen text in any language. That is the article's
subject. 78 KB against the old 220 KB, because photographed screens compress
badly and skin and fabric do not.

## 🔴 The swap left `site.config.mjs` behind

The draft's front matter was updated with the swap. `BLOG_POSTS` was not, and
**no guard would have caught it**:

| | was | now |
|---|---|---|
| `imageAlt` | Two smartphones lying side by side on a grey surface, each showing a different screen | A couple sitting together on a sofa at home, each using their own phone |
| `imageHeight` | 900 | 800 |

The alt text described a photo that is no longer on the page — the one failure
mode alt text has, and invisible to anyone not using a screen reader.
`imageHeight: 900` against a 1200×800 file is worse than it looks: it is the
value that reserves the box while the hero loads, so it was reserving 100 CSS px
too many and handing the layout a shift on every first view of the post.

Section 11 check 7 asserts the hero file **exists** and is **referenced**. It
never compares the declared dimensions to the file, and it cannot know what the
photo is of. Both values are the recipe's "measured from the real file, not
guessed", and a swap is exactly when they go stale.

Fixed. `sips` on the file: 1200 × 800. Built page now:

    <img src="/assets/img/blog/mixed-iphone-android-family-calendar.webp"
         alt="A couple sitting together on a sofa at home, each using their own phone"
         width="1200" height="800" fetchpriority="high" decoding="async">

The `/blog/` index card carries the same 1200×800 and its own empty alt (the
card's link text is the title — correct, unchanged).

**Worth considering:** a guard that reads the real pixel dimensions and compares
them to `imageWidth`/`imageHeight` would have caught the height on the build
that shipped it. It needs a WebP header parse — about fifteen lines, no
dependency — and it would cover all thirteen posts. Not done here; this report
is a fix, not a refactor. Say the word.

## The prompt's three 🔴 exclusions, re-checked

The swap does not touch the prose, but the page was rebuilt, so:

- **No claim Apple auto-creates a "Family" calendar.** The single
  "automatically creates" on the page is the *Google* sentence — "Google
  automatically creates a calendar called 'Family'" — cited to
  `support.google.com/families/answer/7157782`. That is the verified one.
- **No refresh-interval number.** `12 hours` → 0 hits. The page still says
  Google does not publish it.
- **No `calendar/syncselect`.** 0 hits.

Apple's read-only sentence is still verbatim: *"People who subscribe to your
public calendar can view it, but can't change it."*

Five external links, all first-party, all `rel="noopener"`: `apple.com/family-sharing`,
`support.apple.com/guide/calendar/…`, `support.google.com/families/answer/7157782`,
`support.google.com/calendar/answer/99358`, `support.google.com/accounts/answer/1350409`.
Three internal: posts 4, 7 and 9.

## Neighbours

Post 10 (11 Sep) is also a couple with a phone, which is the one thing worth
looking at twice. They do not read alike: post 10 is two people standing in a
bright, cool-white public interior leaning over **one** phone; post 12 is two
people sitting on a dark leather sofa in a warm beige room on **two** phones.
Different palette, posture and composition, and the one-phone/two-phone
difference is the post's whole argument. Post 11 (dark wood, signing a document)
sits between them, and post 13 (supermarket) after.

## Guards

`npm run build` clean — `content OK · 28 locale(s)` · `legal OK` ·
`built 130 pages · 128 sitemap entries` · `blog: 13 post(s)` · `build OK` ·
`detector OK`. Section 11 passes on all thirteen posts.

360px, light and dark, Chrome headless over CDP at DPR 2: `scrollWidth` 360
against `clientWidth` 360 in both, no element inside `#main` past 360px, page
height 6,843 CSS px identical in both schemes, both palettes applied.

`shots/003-post12-360-top.png`, `-top-dark.png`, `-mid.png`, `-mid-dark.png`,
`-faq.png`, `-faq-dark.png`.

## Not committed

`claude/blog-drafts/IMAGES-TODO.md` row 12 still pointed at the rejected
flat-lay. I repointed it at the new photo with a dated note, so nobody downloads
the wrong one a third time — the exact mistake the template's "learned the hard
way" section is about. The file is untracked in the repo, so I left it that way:
edited on disk, not staged.
