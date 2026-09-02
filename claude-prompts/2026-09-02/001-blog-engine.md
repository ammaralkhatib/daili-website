# The blog engine, and the first post on it

## Goal
daili.app is getting an English-language blog: 20 SEO posts, one per day. This
prompt builds the machinery and publishes post 1 on it, so the pipeline is
proven end to end before nineteen more posts are written on top of it.

The plan the posts come from is `claude/blog-seo-plan-2026-09.md` (read it for
context, do not edit it). Post 1's finished text is
`claude/blog-drafts/001-where-to-store-important-family-documents.md`.

Done = `https://daili.app/blog/where-to-store-important-family-documents/`
builds as a real page with its own title, description, canonical, Article +
FAQPage JSON-LD and **no hreflang tags at all**, `npm run build` is clean, and
the new guards in `check-build.mjs` have each been proven able to fail.

**The design already exists in this repo — reuse it, do not invent.** A blog
post is shaped exactly like a legal page: a body HTML file plus a template plus
a `PAGES` entry. `legal/privacy.en.html` + `templates/legal.html` +
`PAGES.privacy` is the pattern to copy.

## Scope
- **In:** `site.config.mjs`, `build.mjs`, `tools/check-build.mjs`,
  `templates/blogpost.html` (new), `blog/` (new folder), `static/assets/style.css`,
  `static/assets/img/blog/` (new folder).
- **Out:** the `/blog/` index page, the "Blog" nav link, the footer link, the RSS
  feed, and any `content/*.json` change. Those are prompt 002 — do not start
  them. Do not touch `templates/layout.html`, `_storebadges.html`,
  `script.js`, `tools/check-content.mjs`, or the `stores` block.

## Before you start
`static/assets/img/blog/where-to-store-important-family-documents.webp` must
already exist (Ammar adds it). If it is missing, **stop and report `blocked`** —
do not substitute a placeholder image and do not weaken the guard that requires
it. A blog post whose hero image 404s is worse than a blog post that did not
ship.

## Requirements

### 1. `site.config.mjs` — the post manifest
Add two exports below `PAGES`:

```js
export const BLOG_AUTHOR = { name: 'Ammar Khatib', url: '/impressum.html' };

export const BLOG_POSTS = [ /* one object per post */ ];
```

Each post object carries everything that is unique to it — this is the single
place a post is defined, the same way `site.config.mjs` is already the single
source of truth for pages and features:

- `slug` — URL segment, lowercase-hyphen. **Never changes once published.**
- `title` — the `<title>` tag (50–60 chars).
- `description` — the meta description (140–158 chars).
- `h1` — the on-page heading. Deliberately allowed to differ from `title`.
- `published` / `updated` — `YYYY-MM-DD`.
- `body` — filename in `blog/`.
- `image` / `imageAlt` — hero image path under `/assets/img/blog/` and its alt text.
- `faq` — array of `{ q, a }`.

Post 1's values are in the front-matter of the draft file named above.
Use `published: '2026-09-02'`, `updated: '2026-09-02'`.

🔴 **`faq` lives here and nowhere else.** The template renders the visible FAQ
section from this array AND `renderHead` builds the FAQPage JSON-LD from the
same array. Google requires FAQ markup to match the visible text exactly, and
`build.mjs` already makes that guarantee structurally for the landing page's
FAQ — do it the same way here. Never let the questions be typed twice.

### 2. `blog/where-to-store-important-family-documents.en.html`
Convert the draft markdown to a body fragment, the same shape as
`legal/privacy.en.html`: content only, no `<html>`, no `<head>`, **no `<h1>`**
(the template renders the H1 from `h1`), **and no FAQ section** (the template
renders it from `faq`).

Keep the prose exactly as written — this is published copy, not something to
improve. Two mechanical jobs only:
- The markdown table becomes a real `<table>` wrapped in
  `<div class="table-wrap">` so it can scroll on a phone.
- The four external links in the draft's publishing notes are already named in
  the prose; make them real `<a href>` with `rel="noopener"`.

Drop everything below the `---` before "What daili does with this". The
"PUBLISHING NOTES" block is instructions to us, not content — it does not ship.
The "What daili does with this" section DOES ship, as the closing CTA.

### 3. `build.mjs` — four surgical changes

**(a) Per-page meta override.** Right now the title/description key is picked by
a ternary chain on `pg.id` (`'support' ? 'supportTitle' : …`). Adding twenty
blog posts to that chain is not viable. Give a page the option of carrying its
own literal meta:

```js
title:       pg.meta ? pg.meta.title       : (pg.id === 'landing' ? … existing chain …),
description: pg.meta ? pg.meta.description : c.meta[descKey],
```

The existing pages keep their current behaviour byte for byte.

**(b) Expand `BLOG_POSTS` into `PAGES` entries.** Build them once, near where
`pageById` is created, and append to the page list the build loops over. Each
blog page:
- `id: 'blog:' + post.slug`
- `template: 'blogpost.html'`
- `locales: ['en']`
- `cluster: null` — 🔴 **this is the load-bearing line.** The blog is English
  only and has no translations. A blog page must never claim a landing-page
  alternate; that is precisely the "hreflang has no return tag" trap the
  comment above `renderHead`'s hreflang block already warns about.
- `out: () => 'blog/<slug>/index.html'`
- `priority: () => '0.6'`
- `meta: { title, description }` from the post
- `post` — the whole post object, so the template and head can reach it

`renderLangNav` needs no change: it already falls back to a locale's landing
page when the page does not exist in that locale, so the picker on a blog post
correctly offers 23 homepages and never a 404.

**(c) `renderHead` — article-shaped head for blog pages.** For a blog page only:
- `og:type` is `article`, not `website`
- `og:image` is the post's hero image (absolute URL), not the logo
- add `<meta property="article:published_time" …>` and `article:modified_time`
- emit two JSON-LD blocks built from the post object: `Article` (headline,
  description, image, datePublished, dateModified, author from `BLOG_AUTHOR`,
  publisher Daili, mainEntityOfPage = the canonical) and `FAQPage` from
  `post.faq`.

Everything else in `renderHead` — canonical, the `pg.cluster` hreflang guard,
twitter:card — already does the right thing unchanged.

**(d) `page.postBody`.** Read `blog/<post.body>` the way `legalBody` is read.

### 4. `templates/blogpost.html`
The page skeleton, in this order: hero `<figure>` (image + `imageAlt`), `<h1>`,
a byline line (author + published date, `<time datetime>`), `{{{ page.postBody }}}`,
the FAQ section rendered from `{{# post.faq }}`, then the CTA block.

Wrap the article in `<article class="post" id="main">` so the skip link keeps
working. Use `{{{ }}}` for the body (it is HTML) and `{{ }}` for everything
else (it must be escaped).

### 5. `static/assets/style.css`
Blog styles at the end of the file, using the tokens that already exist
(`--paper`, `--card`, `--ink`, `--body`, `--muted`, `--forest`, `--line`,
`--mint`, `--cream`). Do not introduce new colour literals — the dark-mode
block near the bottom of the file redefines the tokens, so anything built on
them gets dark mode for free. Cover: measure around 68ch, the h2/h3 scale,
lists, the scrolling table, the figure, a distinct FAQ section, and the CTA
box. Check the 360px width — the known `.reveal` overflow is pre-existing and
out of scope, but do not add a second one.

### 6. `tools/check-build.mjs` — section 11, "blog"
Every check reads `dist/`, like the rest of the file. For each built blog page:

1. Exactly one `<h1>`.
2. A `<link rel="canonical">` matching `BASE_URL + '/blog/<slug>/'`.
3. A non-empty `<meta name="description">` that is **not** the landing page's
   description (catches the meta override silently not applying).
4. 🔴 **Zero occurrences of `hreflang=`.** This is the guard that protects the
   cluster decision. A future refactor that gives blog pages a cluster must
   fail here loudly.
5. `og:type` is `article`, and the `og:image` is the post's own image, not the
   logo.
6. Every question in `post.faq` appears **both** in the visible HTML and inside
   the `FAQPage` JSON-LD. Assert the JSON-LD by parsing it and reading the
   question strings — not by substring-matching the page, which would pass on
   the visible copy alone.
7. The file `static/assets/img/blog/<image>` exists, and the built page
   references it.
8. No two entries in `BLOG_POSTS` share a `slug`.
9. The blog page appears in `sitemap.xml` with **no** `xhtml:link` alternates.

🔴 **Prove each of the nine can fail.** Break the thing it watches, run the
build, confirm the guard fails with a message that names the post, put it back.
A guard that has never failed is not a guard — check 4 and check 6 especially,
because both would pass trivially against a page that is already broken in the
way they are meant to catch. Record in the report what you broke for each one.

## Verify before you report
1. `npm run build` clean.
2. `/usr/bin/grep -c hreflang dist/blog/where-to-store-important-family-documents/index.html`
   → **0**. Then the same grep on `dist/index.html` → still non-zero. The
   landing page must not have lost its hreflang set.
3. `node -e` parse both JSON-LD blocks out of the built post and print the
   `@type`s → `Article` and `FAQPage`.
4. `/usr/bin/grep -c "xhtml:link" dist/sitemap.xml` — the count must be exactly
   what it was before this change. The blog URL is present, with no alternates.
5. Diff the built `dist/index.html`, `dist/de/index.html` and
   `dist/privacy.html` against a build from `HEAD` — they must be **byte
   identical**. The meta-override change is supposed to be inert for existing
   pages, and this is how you prove it.
6. In a browser at `npm run serve`: the post at 360px and at desktop, in light
   and dark mode. The table scrolls rather than pushing the page sideways, the
   hero image has width/height and does not shift the layout, and the FAQ
   section reads as part of the article.

## Report
`claude-reports/2026-09-02/001-blog-engine.md`. Short. Include: the shape you
gave `BLOG_POSTS`, the nine guards and **what you broke to prove each one**,
the byte-identical result from check 5, and anything in the draft's prose you
had to change to make it valid HTML (there should be nothing, and if there is,
Ammar wants to know).

Commit and push. **Do not run `./deploy.sh`** — Ammar deploys.
