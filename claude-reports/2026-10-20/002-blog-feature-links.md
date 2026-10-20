# 002 — Internal links: feature pages ↔ blog posts

**Commit:** `82a263f` feat(blog): link feature pages and blog posts — pushed to `origin/main`.
(Step 0: the pending prompts 002–004 went in first as `2c2d64c`.) Not deployed.

## The field
`BLOG_POSTS[].features: ['<slug>', …]`, 1–2 entries, the first is the primary.
All 17 live posts are tagged from the prompt's table. The field is described in the
BLOG_POSTS doc comment. `build.mjs` throws if the field is missing, has more than 2
entries, or names a slug that is not a `HOME_FEATURES` entry with `page: true`. This
works the same way as the `cluster` check.

## The three blocks (all English literals, no `content/*.json` change)
1. **"From the blog"** (`section.fs-blog` in `_featuresheet.html`, after the FAQ and
   before the store badges): shows the 3 newest posts tagged with the feature, each
   with its title link and description, then "All articles →" `/blog/`. It renders
   only when `loc === 'en'`. If no post is tagged, nothing renders. Results:
   `/features/documents/` shows 3 of its 6 tagged posts, `/features/weather/` shows
   no block and `/de/features/documents/` shows no block. In the home sheet, `/`
   shows it in the Documents sheet and `/de/` does not.
2. **CTA line**: "See how <English h1 name> works in daili →" links to
   `/features/<primary>/`. It is added as a second `post-cta-link` under the
   post's own CTA. For month-three-cleanup it reads "See how To-dos works in daili",
   using the `<h1>` name exactly as it is.
3. **Keep reading** (`section.post-more`, between the FAQ and the CTA): shows 2 posts.
   Posts sharing the primary feature come first, then posts in the same cluster,
   newest first in each group, never the post itself. month-three-cleanup gets
   switch-family-app-without-losing-lists and teenagers-private-events-family-calendar.

Looks: checked with headless Chrome over CDP on `/features/documents/` (1280 and
360), the post (1280 and 360, light and dark), and the home sheet on `/` and `/de/`
(1280 and 360). `scrollWidth === innerWidth` everywhere, and no element sticks out
past the viewport. Feature pages are light-only as before.

## Guards — `check-build.mjs` section 19
- An English feature page with at least one tagged post has the block, and every
  link in it is a built page. An untagged feature has no block.
- No non-English feature sheet contains `href="/blog/`. This check covers the
  `[data-feature-sheet]` article only, because the header and footer Blog link is on
  every page by design (`hreflang="en"`).
- Every post links to `/features/<primary>/`.
- No post links to itself. This check covers the `<article>` only, because the
  language picker's current entry links to the page itself.

**Broken on purpose:** I changed `blog: loc === 'en' ? …` to `blog: true ? …`. The
non-English guard then failed **135 times** (27 locales × 5 tagged features).
Reverted, and the build is green again.

## Build
```
build OK · 3198 pages · 3178 in hreflang clusters
detector OK · 32 cases · 28 locale(s) built
```
Section 11 (FAQPage JSON-LD = visible FAQ, zero `hreflang` on blog pages) still passes.

## Template rule
`BLOG-POST-TEMPLATE.md` → "The two files": `features` is required (from the
front-matter or the publish prompt), and those links are never written by hand.
Planning Claude adds 2 in-prose links FROM existing posts during the weekly SEO
round, and the publish prompt names them.

## Help impact
None.
