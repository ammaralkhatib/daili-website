# Post 12 — The Mixed iPhone and Android Household (PILLAR E)

Live at `/blog/mixed-iphone-android-family-calendar/`. Commit `8d89fbc`. First post in the
`devices` cluster and its pillar. Two files as the recipe describes, nothing
else touched — no CSS, no template, no other post.

## 🟠 The hero is two Android phones

The file was there, 1200×900, landscape, and it matches its alt text exactly
("two smartphones lying side by side on a grey surface, each showing a different
screen"), so every guard passes and the page looks right.

**But both phones are Xiaomi**, one showing the recents screen with
"Xiaomi HyperOS" legible in two cards, the other a launcher search overlay
**in Russian** (Cyrillic keyboard, "Закрыть все"). On an article whose entire
subject is *one iPhone and one Android in the same house*, the hero is two
Androids, and the only readable UI text on it is in a language the post is not
written in.

At hero size on a phone the Cyrillic is small but the keyboard is recognisably
not-Latin, and the HyperOS wordmark is readable if anyone looks. This is the
same class of problem as post 11's still-birth form and post 2's go-bag: the
photo is fine, it is just not a photo of what the article is about.

**I shipped it rather than blocking** — the recipe makes only a *missing* hero a
blocker, and swapping it is a one-file change that does not touch the post. I
would swap it before you deploy. What this article wants is visibly one iPhone
and one Android, or two phones with no legible on-screen text at all.

Nothing else in this report is a concern.

## The three 🔴 facts that must NOT appear

Checked against the built page, not the source.

| Must not appear | Result |
|---|---|
| Apple auto-creates a "Family" calendar | **absent.** The only "automatically creates a calendar called 'Family'" sentence on the page is the **Google** one, sourced to `support.google.com/families/answer/7157782`. Every Apple sentence stops at "Family Sharing needs an Apple Account". |
| A refresh-interval number for subscriptions | **absent.** `grep -i "12 hours"` → 0. The post says Google does not publish an interval and people report many hours, in both the body and FAQ 2. |
| `calendar/syncselect` | **absent.** `grep -i syncselect` → 0, in the body, the FAQ and the JSON-LD. |

## Apple's read-only sentence — verbatim

Rendered as `<strong>"People who subscribe to your public calendar can view it,
but can't change it."</strong>`, byte-identical to the draft, straight quotes to
match house style, immediately after the link to Apple's own Calendar guide. It
is the visual anchor of Option 2 in both schemes — see
`shots/005-post12-360-quote.png` and `-quote-dark.png`.

## Links

**Five external, all first-party, all `rel="noopener"`** — the five from the
draft's verified-sources list and no others:

| Anchor | Target |
|---|---|
| "Apple's own requirements" | `apple.com/family-sharing/` |
| "create a family on Google" | `support.google.com/families/answer/7157782` |
| "in Google's own words" | `support.google.com/calendar/answer/99358` |
| "Google's minimum age" | `support.google.com/accounts/answer/1350409` |
| "Apple states plainly" | `support.apple.com/guide/calendar/share-icloud-calendars-icl32362/mac` |

**Three internal, root-relative**, which is the two ✅ plus post 9 as the prompt
asked:

| Anchor | Target |
|---|---|
| "the hard part regardless of platform" | `/blog/nobody-uses-the-family-calendar-app/` (post 7) |
| "school term dates" | `/blog/shared-family-calendar-rules/` (post 4) |
| "including children" | `/blog/family-app-children-data/` (post 9) |

The post-9 anchor is a judgement call: the draft notes say "the Google-age
paragraph" without naming a phrase. "everyone needs a Google account, including
children" is the point where the reader first has to think about a child having
an account, which is what post 9 answers. Say the word if you want it on
"parental consent through Family Link" instead.

**Post 13 was left out**, per the draft — its ⏳ link into the lists section goes
in when `switch-family-app-without-losing-lists` publishes tomorrow.

## Prose fidelity

Nothing in the prose was changed — no wording, order or emphasis. Two mechanical
notes:

- The bullet list under "Which option fits which household" keeps its `→`
  characters as literal arrows, as the draft has them.
- **FAQ 2 loses one italic.** The draft has "*subscribed* calendar"; `faq[].a`
  is a plain string rendered both as visible text and as FAQPage JSON-LD, so it
  cannot carry markup without the two copies diverging. Emphasis dropped, words
  identical. Every other post's FAQ answers are plain strings for the same
  reason.

Draft body (front-matter and publishing notes stripped) **1,210 words** against
the rendered article's **1,197** — a **−1.1%** gap, inside the ~2% rule.

## `BLOG_POSTS` entry

```js
slug:        'mixed-iphone-android-family-calendar'
cluster:     'devices'
title:       'The Mixed iPhone and Android Household: What Works'
h1:          'The Mixed iPhone and Android Household'
published:   '2026-09-13'   updated: '2026-09-13'
body:        'mixed-iphone-android-family-calendar.en.html'
image:       '/assets/img/blog/mixed-iphone-android-family-calendar.webp'  1200×900
faq:         3 questions        cta: 'What daili does with this'
itemList:    (absent)
```

Appended last; index and feed sort by `published`, so it lands first in both.
`imageWidth`/`imageHeight` measured from the file with `sips`, not copied.

## Guards

`npm run build` clean: **129 pages · 28 locales · 127 sitemap entries · 12
posts**, detector 32 cases. Only the eight pre-existing translation
length-ratio warnings, none of them blog.

| Check | Result |
|---|---|
| `<h1>` count | 1 |
| canonical | `https://daili.app/blog/mixed-iphone-android-family-calendar/` |
| description | the post's own, not the landing page's |
| hreflang **in `<head>`** | 0 (the 31 in the file are the footer language switcher's `hreflang` attributes, same as every other post) |
| og tags | `og:type` article, `og:image` the post's own hero |
| FAQ parity | 3 questions, visible **and** in FAQPage JSON-LD, identical strings |
| JSON-LD | Article 1 · FAQPage 1 · WebPage 1 · Organization 1 · Person 1 · ImageObject 1 · Question 3 · Answer 3. No HowTo, no ItemList |
| internal links resolve | all three targets exist in `dist` (check-build §2) |
| hero file | present, 1200×900 |
| sitemap | 1 entry, no `xhtml:link` |
| `/blog/` index | card present, "13 September 2026" |
| `feed.xml` | `<item>` present |

## Browser — 360px, light and dark

Chrome 152 headless over CDP, 360 CSS px at DPR 2, `prefers-color-scheme`
emulated both ways. Both schemes applied: `rgb(251,249,242)` light,
`rgb(14,23,18)` dark.

`scrollWidth` 360 against `clientWidth` 360 in both, and a sweep of every element
in `body` for a right edge past 360px returned an empty list. Page height 6,870
CSS px, identical in both schemes. The post carries only `p`, `h2` and one `ul`
— no table, no blockquote — so there was nothing new for the stylesheet to
cover.

`shots/005-post12-360-top.png`, `-top-dark.png`, `-quote.png`, `-quote-dark.png`,
`-faq.png`, `-faq-dark.png`.

## Still open

- **The hero.** See the top of this report.
- Post 13 publishes tomorrow and owes this post the lists-section backlink.
