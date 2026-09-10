# Post 12 → post 13: the ⏳ link, now that its target exists

Post 13 published this morning (`50e403b`), so the one link post 12's draft was
holding open could be added. From `claude/blog-drafts/012-…`:

    - ⏳ The lists section → /blog/switch-family-app-without-losing-lists
      (post 13, next day — add it then)

That is the template's rule working as intended: the ⏳ links stay out until
their target exists, because check-build section 2 fails on a link to a page
that is not there.

## The change

One link, in post 12's "The worse problem: lists and reminders" section:

> If your household is mixed, the
> [shopping list is usually the thing worth solving first](/blog/switch-family-app-without-losing-lists/).
> It has an immediate, daily payoff, everyone feels it, and it is the easiest
> habit to start.

The anchor is the sentence post 13 spends its closing section on ("Do the
shopping list first"), so the two posts now make the same argument in the same
words and the link is the seam between them. No prose changed — the `<a>` wraps
text that was already there.

The draft's notes line is flipped from ⏳ to ✅ with the anchor and the date, so
the record says what was done rather than what was intended.

## Both directions now

| From | Anchor | To |
|---|---|---|
| post 12, lists section | shopping list is usually the thing worth solving first | post 13 |
| post 13, calendar step | read-only feed (an ICS link) | post 12 |

Post 12's body now carries four internal links (posts 4, 7, 9, 13), post 13's
four (posts 5, 7, 9, 12). The fifth `/blog/…/` href on each page is the language
picker's own EN entry, `aria-current="true"` — the layout, not the article.

Post 12's other ⏳, the Google-age paragraph → `/blog/family-app-children-data/`,
was already in the page from the original run. Nothing else is outstanding on
either post.

## Guards

`npm run build` clean — `blog: 13 post(s)` · `build OK · 130 pages` ·
`detector OK`. Section 2 resolves the new link. Section 11 passes on all
thirteen posts.

360px, light and dark: `scrollWidth` 360 against `clientWidth` 360 in both, no
element inside `#main` past 360px, page height 6,843 CSS px — unchanged from the
hero-swap run, which is what a link inside an existing paragraph should do. No
new shots committed; the ones in `shots/003-post12-360-*.png` are still accurate
for this page.
