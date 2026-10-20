# Internal links — feature pages ↔ blog posts

## Goal
Google ranks a new page faster when pages that already get visits link to
it. Today no feature page links to the blog, and a blog post only links to
other posts where the prose happens to. This prompt adds three link blocks,
all driven by ONE new field per post, so nobody hand-edits links again:

1. **English feature page** (`/features/<slug>/`, and the same fragment in
   the home sheet): a small "From the blog" block with the **3 newest posts**
   tagged with that feature, plus "All articles →" (`/blog/`).
2. **Blog post**: inside the CTA box, one extra line under the existing CTA:
   "See how <Feature name> works in daili →" to `/features/<primary>/`.
3. **Blog post**: a "Keep reading" block (after the FAQ, before the CTA) with
   **2 other posts**: first those sharing the post's primary feature, then the
   same `cluster`, newest first, never itself.

## Scope
- In: `site.config.mjs` (new field + its doc comment), `build.mjs`,
  `templates/blogpost.html`, `templates/_featuresheet.html` (or a new partial),
  the blog/feature CSS, `tools/check-build.mjs`,
  `claude-prompts/BLOG-POST-TEMPLATE.md` (one new rule), `npm run build`.
- Out: post prose (`blog/*.en.html` — do not edit), `content/*.json`
  (the strings here are English-only literals, like "Frequently asked
  questions" in blogpost.html — 🔴 never add them to the 28 content files),
  help pages, landing page, deploy.
  🔴 Ten untracked `static/assets/img/blog/*.webp` files are expected — they
  are the heroes for prompt 003. They do NOT block step 0; leave them
  untracked and out of this commit.

## Requirements
1. **The field.** Each `BLOG_POSTS` entry gets `features: ['<slug>', …]`
   (1–2 entries; the FIRST is the primary). Values must be a `slug` in
   `HOME_FEATURES` with `page: true` — `build.mjs` throws otherwise, exactly
   like it does for an unknown `cluster`. Document it in the BLOG_POSTS doc
   comment. Tag the 17 live posts with this table (posts 18–27 come with
   their publish prompt 003 and use the same table):

   | Post slug | features |
   |---|---|
   | where-to-store-important-family-documents | documents |
   | digital-family-emergency-binder | documents |
   | family-document-checklist | documents |
   | shared-family-calendar-rules | calendar |
   | cozi-free-plan-what-you-get | calendar |
   | what-to-leave-with-a-babysitter | documents |
   | nobody-uses-the-family-calendar-app | calendar |
   | documents-to-keep-on-your-phone | documents |
   | family-app-children-data | family |
   | get-partner-to-use-family-calendar | calendar |
   | medical-consent-grandparents-babysitting | documents |
   | mixed-iphone-android-family-calendar | calendar |
   | switch-family-app-without-losing-lists | lists, todos |
   | teenagers-private-events-family-calendar | calendar, family |
   | family-organiser-apps-gdpr | family |
   | share-calendar-with-android-family-member | calendar |
   | family-app-month-three-cleanup | todos, lists |

2. **Feature page block (English only).** Rendered ONLY on the English
   feature pages (root `/features/<slug>/`). 🔴 No `/blog/` link on any
   `/<loc>/features/…` page — the blog is English-only and a German reader
   must not be sent to English articles without being told. A feature with
   no tagged post renders no block at all (no empty heading). Each item:
   post title (link), one-line `description`. Root-relative hrefs. The block
   sits after the FAQ, before the store badges. Because the home sheet
   reuses this fragment, check that the sheet still opens and looks right on
   `/` (English) and `/de/`.
3. **CTA line.** Feature name = the same name the feature page's `<h1>`
   shows in English. Arrow style like the existing CTA links.
4. **Keep reading.** Exactly 2 links when 2 candidates exist, fewer if not,
   none (no heading) if zero. Title + description, like the blog index.
5. **Guards in `check-build.mjs`** (new section): every English feature page
   with ≥1 tagged post has the block and every link in it resolves to a
   built blog page; no non-English feature page contains `href="/blog/`;
   every blog post page links to `/features/<its primary>/`; no post links
   to itself. Prove one guard can fail (break it once, then revert) and say
   which in the report.
6. **Template rule.** Add to `BLOG-POST-TEMPLATE.md`, under "The two files":
   the `features` field is required, taken from the draft's front-matter or
   the publish prompt; and a note that Planning Claude adds 2 in-prose links
   FROM existing posts to every new post in the weekly SEO round (the
   publish prompt says which, if any).
7. Looks: quiet, small, matches the existing blog index list and the feature
   sheet's type sizes; light + dark; 360 px wide without overflow.

## Constraints
- Zero npm dependencies. `npm run build` green.
- The FAQPage JSON-LD and the visible FAQ must stay identical (section 11).
- No `hreflang` added to any blog page head.

## Verify
Build, serve `dist/`. Check `/features/documents/` (6 posts tagged → 3
newest shown), `/features/weather/` (none tagged → no block), `/de/features/documents/`
(no block), `/blog/family-app-month-three-cleanup/` (CTA line → `/features/todos/`,
Keep reading = 2 posts), home `/` → open Documents sheet. Light, dark, 360 px.

## Commit & push
`feat(blog): link feature pages and blog posts`; body
`Prompt: claude-prompts/2026-10-20/002-blog-feature-links.md`.
**Push. Do NOT run `./deploy.sh`.**

## Report
`claude-reports/2026-10-20/002-blog-feature-links.md`, half a page: the
field, the three blocks, which guard you broke on purpose, build lines,
SHA + push. `## Help impact`: none.
