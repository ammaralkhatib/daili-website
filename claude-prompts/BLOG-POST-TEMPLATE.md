# Publishing a blog post — the standing recipe

The blog engine shipped in `claude-prompts/2026-09-02/001-blog-engine.md`
(`4bdaf41`) and got its front door in `003-blog-index-nav-rss.md` (`8591bc1`).
Adding a post is now a two-file change. This file is the recipe every
`NNN-blog-post-<n>.md` prompt points at, so those prompts stay four lines long.

## What Ammar does first
Download the hero photo from the Pexels link in the draft's front-matter,
convert to WebP at ~1200px wide (Planning Claude does this for him), and save it
as `static/assets/img/blog/<slug>.webp`. **If it is missing, stop and report
`blocked`** — never substitute a placeholder, never weaken the guard that
requires it.

## The two files
1. **`blog/<slug>.en.html`** — the body fragment. Content only: no `<html>`,
   no `<head>`, **no `<h1>`**, **no FAQ section**, **no CTA**. The template
   renders all four. Copy post 1's file for the house shape.
2. **`site.config.mjs`** — one entry appended to `BLOG_POSTS`, using the values
   in the draft's front-matter verbatim, plus `faq` and `cta` from the draft's
   FAQ and "What daili does with this" sections.

## Rules that are easy to get wrong
- 🔴 **`faq` lives in `BLOG_POSTS` and nowhere else.** The template renders the
  visible questions and `renderHead` builds the FAQPage JSON-LD from the same
  array. Never type a question twice — Google requires them to match exactly.
- 🔴 **Never edit the prose.** The draft is published copy. Converting markdown
  to HTML is mechanical. If something *must* change to be valid HTML, do it and
  say so in the report — Ammar wants to know.
- **Only add internal links marked ✅ in the draft's publishing notes.** The ⏳
  ones point at posts that do not exist yet and would fail check-build
  section 2. Add each when its target publishes.
- **Links to daili's own pages are root-relative** (`href="/"`), never absolute.
- `imageWidth` / `imageHeight` are measured from the real file, not guessed.
- Tables go in `<div class="table-wrap"><table class="post-table">`.
- External links get `rel="noopener"`.
- Newest post goes **first** in `BLOG_POSTS`? No — order does not matter;
  the index and the feed sort by `published`. Append.

## Verify
1. `npm run build` clean — section 11's guards already cover h1 count,
   canonical, description, hreflang, og tags, FAQ parity, the hero file,
   duplicate slugs and the sitemap. They run on the new post automatically.
2. The post appears on `/blog/` and as a new `<item>` in `/blog/feed.xml`.
3. `/usr/bin/grep -c hreflang dist/blog/<slug>/index.html` in the `<head>` → 0.
4. Word-count the rendered article against the draft; they should be within
   ~2%. A big gap means something was dropped.
5. Browser at 360px, light and dark.

## Report
`claude-reports/<date>/NNN-blog-post-<n>.md`. Short: the `BLOG_POSTS` entry, the
guards passing on the new post, the word-count comparison, and anything in the
prose you had to change (ideally nothing).

Commit and push. **Do not run `./deploy.sh`** — Ammar deploys.
