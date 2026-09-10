# Post 9 → post 14: the ⏳ link, now that its target exists

Commit `bd828e8`.

Post 14 published this morning, so post 9's held-open link goes in. From
`claude/blog-drafts/009-…`:

    - ⏳ Question 5 → /blog/teenagers-private-events-family-calendar

## The change

One link, at the end of post 9's "Question 5: What happens to a child's profile
when they grow up?":

> Related and worth knowing: in most of the EU a child can manage their own
> account from a country-specific age — 14 in Austria, 16 in Germany, 13 in much
> of the world. So
> [this stops being hypothetical sooner than parents expect](/blog/teenagers-private-events-family-calendar/).

The anchor points forward to exactly the years post 14 is about, which is what
Question 5 leaves hanging. No prose changed — the `<a>` wraps text already
there. Draft note flipped to ✅ with the anchor and date.

## Both directions now

| From | Anchor | To |
|---|---|---|
| post 9, Question 5 | this stops being hypothetical sooner than parents expect | post 14 |
| post 14, account-age paragraph | Worth knowing if you are choosing an app for this | post 9 |

## Post 7's ⏳ stays open, and cannot be closed as written

`claude/blog-drafts/007-…` holds
`⏳ The teenager FAQ → /blog/teenagers-private-events-family-calendar`. That
passage is a **FAQ answer** — `site.config.mjs` line 509, "Usually a teenager,
and usually about privacy rather than the app" — and the blog template renders
FAQ answers through `{{ .a }}`, which escapes. An `<a>` there reaches the reader
as visible angle brackets, and the same string is the FAQPage JSON-LD.

Post 7's body has one teenager sentence, "A teenager lives in their phone's
default calendar", and it is about calendar sprawl, not privacy. Linking post 14
from it would promise the wrong article. Left unlinked, and the ⏳ left in the
draft rather than quietly flipped, so the decision is visible.

If you want the link, the honest fix is a sentence in post 7's body — which is
an edit to published prose, and therefore yours to make, not mine.

## Guards

`npm run build` clean — `blog: 14 post(s)` · `build OK · 131 pages` ·
`detector OK`. Section 2 resolves the new link; section 11 passes on all
fourteen posts. No re-shoot: a link inside an existing paragraph, and post 9's
360px run is unchanged.
