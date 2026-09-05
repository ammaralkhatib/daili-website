# Post 11 — Medical Consent for Grandparents Babysitting

Live at `/blog/medical-consent-grandparents-babysitting/`. Commit `b6518b6`. Fourth post in the
`documents` cluster. Two files as the recipe describes, **plus post 6's ⏳
backlink that this publish unblocks**, and **two CSS rules** — post 11 is the
first post on the blog to carry a `<blockquote>`, and there was no rule for one.

## 🔴 Read this first — the hero photo is wrong

The file was there, 1200×800, landscape, and it matches the alt text: hands
signing a printed form on a dark wooden table. So it passes every guard and it
looks right in the page.

**Then I zoomed in on the form.** It is a *Births and Deaths Registration*
**"FORM 5 — PARTICULARS OF STILL-BIRTH"**, with the visible field captions
"Cause of death and nature of evidence that child was still-born" and a
completed CHILD / FATHER / MOTHER block.

That is a still-birth registration certificate, on an article about leaving your
children with their grandparents for the weekend.

It is illegible at hero size on a phone and most readers will never notice. But
it is legible if anyone opens the image, this is a post about children and
medical risk, and the failure mode if someone does notice is not a small one.
This is the go-bag-on-the-paperwork-article problem from the recipe, one layer
down.

**I shipped it rather than blocking** — the recipe only makes a *missing* hero a
blocker, and swapping it is a one-file change that does not touch the post. But
I would swap it before you deploy. What the article wants is an ordinary signed
letter or a blank form on a table, nothing officially printed.

Nothing else in this report is a concern.

## The three 🔴 instructions

**1. Disclaimer above the fold.** It is the third paragraph, immediately after
"Here is the honest version", **before the first `<h2>`** — verified structurally
(`compareDocumentPosition` against the first heading), not by eye. Rendered as a
single `<p>` that is **wholly** wrapped in `<strong>`, so it is bold end to end
including the em-dashed clause. Nowhere near the footer.

**2. No country-specific legal claims.** The Austria/Germany/UK/US paragraph
shipped **verbatim**, byte-for-byte against the draft, including the closing
pointer to the reader's own GP practice. No jurisdiction is named anywhere
except inside that refusal. Zero external links on the page
(`href="http` → 0), for the reason the draft gives.

**3. Article + FAQPage only.** JSON-LD types on the page:

```
1 Article   1 FAQPage   1 WebPage   1 Organization   1 Person   1 ImageObject
3 Question  3 Answer
```

**No `HowTo`, no `ItemList`.** `itemList` is deliberately not declared in the
`BLOG_POSTS` entry — build.mjs only emits an ItemList block for a post that asks
for one — and there is a comment on the entry saying why, so the next person
adding a "steps" post does not add one here.

## The template — and the two CSS rules it needed

The template renders as `<blockquote class="post-template">`, **six `<p>`, 15
`<strong>`**, wording identical to the draft. The three GP/allergies/medication
lines are one paragraph with `<br>` between them, which is what the draft's
consecutive `>` lines mean.

There was **no `blockquote` rule in `style.css`** — no post had used one — so it
would have rendered as UA default: no ground, no edge, 40px of margin eating the
measure on a phone. Two rules added, both token-only so dark mode comes free:

- `static/assets/style.css` — `.post blockquote`: cream ground, 3px rule on the
  **inline** start edge, `padding` instead of the UA margin.
- the `@media print` block — transparent ground, a real 1px border, and
  **`break-inside: avoid`**. Both matter: the print block resets every token to
  white, which would otherwise leave the cream panel invisible and the letter
  indistinguishable from the prose; and half a consent letter on each sheet is
  not a consent letter.

## Print — confirmed, not assumed

Post 3's `@media print` block covers this page as-is. Measured in headless
Chrome with **print media emulated and `prefers-color-scheme: dark` forced**, to
prove the token reset still wins:

| | |
|---|---|
| `body` background | `rgb(255,255,255)` |
| `header` / `.post-hero` / `.post-cta` | `display: none` |
| link colour / decoration | `rgb(26,26,26)` / `none` |
| blockquote ground | transparent |
| blockquote border | `1px rgb(185,185,185)` |
| blockquote `break-inside` | `avoid` |

`shots/010-post11-print-top.png`, `-print-template.png`, and the PDF itself at
`shots/010-post11-print.pdf`.

## Links

**Three internal, all ✅ in the draft. No external.**

| Anchor | Target |
|---|---|
| "where that information is" | `/blog/documents-to-keep-on-your-phone/` |
| "With the carer" | `/blog/what-to-leave-with-a-babysitter/` |
| "the annual document check" | `/blog/family-document-checklist/` |

**One judgement call.** The draft's third link is noted only as "Intro / the
carer context", and the intro carries no phrase that could take an anchor
without editing prose. I put it on **"With the carer"**, item 1 of the
three-copies list — the point where the post hands the document to the carer is
also the point where "what else to leave with them" is the reader's next
question. Say the word if you want it moved.

## The backlink this publish unblocks

`blog/what-to-leave-with-a-babysitter.en.html`, "The consent question" section:
"it is worth leaving <ins>a short written note</ins> saying who is caring for
your children". Post 6's publishing notes listed this as ⏳ against this exact
slug. **No words changed** — existing text wrapped in an anchor.

## Prose fidelity

Nothing in the prose was changed. The one thing worth naming: the markdown's
three consecutive `>` lines became one `<p>` with `<br>`, because that is the
only way to keep them as three lines. No wording, order or emphasis was touched
anywhere in the post.

Draft body (front-matter, H1 and publishing notes stripped) **1,121 words**
against the rendered article's **1,133** — a **+1.1%** gap, all of it the byline
and date the template adds. Inside the ~2% rule.

## `BLOG_POSTS` entry

```js
slug:        'medical-consent-grandparents-babysitting'
cluster:     'documents'
title:       'Medical Consent for Grandparents Babysitting: What You Need'
h1:          'Medical Consent for Grandparents Babysitting: What You Actually Need'
published:   '2026-09-12'   updated: '2026-09-12'
image:       '/assets/img/blog/medical-consent-grandparents-babysitting.webp'  1200×800
faq:         3 questions        cta: 'What daili does with this'
itemList:    (absent, deliberately)
```

Appended last; index and feed sort by `published`, so it lands first in both.

## Guards

`npm run build` clean: **66 pages, 11 posts, 64 sitemap entries**, detector 32
cases. Only the ten pre-existing translation length-ratio warnings, none of them
blog.

| Check | Result |
|---|---|
| `<h1>` count | 1 |
| canonical | `https://daili.app/blog/medical-consent-grandparents-babysitting/` |
| hreflang **in `<head>`** | 0 |
| og tags | `og:type` article, `og:image` the post's own hero |
| FAQ parity | 3 questions, visible **and** in FAQPage JSON-LD, identical |
| JSON-LD | Article + FAQPage, both parse; no HowTo, no ItemList |
| internal links resolve | all three targets exist in `dist` |
| hero file | present, 1200×800 measured from the file |
| sitemap | 1 entry, no `xhtml:link` |
| `/blog/` index | card present, "12 September 2026" |
| `feed.xml` | `<item>` present, `Sat, 12 Sep 2026 00:00:00 GMT` |

## Browser — 360px, light and dark

Chrome 152 headless over CDP, 360 CSS px at DPR 2, `prefers-color-scheme`
emulated both ways. Both schemes applied: `rgb(252,250,244)` light,
`rgb(14,21,18)` dark.

**`scrollWidth` 360 against `clientWidth` 360 in both**, and a sweep of every
element in `body` for a right edge past 360px returned an empty list — the new
blockquote is 324px wide inside the 360px column, padding not margin. Page
height 7,150 CSS px, identical in both schemes.

`shots/010-post11-360-top.png`, `-top-dark.png`, `-template.png`,
`-template-dark.png`.

## Still open from earlier posts

- Post 4's FAQ link to post 7 still needs your decision on the `{{ .a }}`
  escaping (report 006, section 1).
- Post 4 still owes its rule-5 ✅ link to post 6.
