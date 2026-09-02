# The blog gets a front door: index page, nav link in 23 languages, RSS

## Goal
Prompt 001 built the engine and put post 1 on it, deliberately linked from
nowhere. This prompt makes the blog reachable: an index at `/blog/`, a "Blog"
link in the nav and footer of **all 23 locales**, and an RSS feed.

Done = `/blog/` lists every post in `BLOG_POSTS`, all 23 landing pages carry a
working Blog link, `/blog/feed.xml` is valid RSS, `npm run build` is clean, and
the new guards have each been proven able to fail.

## Scope
- **In:** `site.config.mjs`, `build.mjs`, `templates/layout.html`,
  `templates/blogindex.html` (new), `content/*.json` (all 23 — one key),
  `static/assets/style.css`, `tools/check-build.mjs`.
- **Out:** post 2. `tools/check-content.mjs`. The `stores` block. Anything in
  `blog/`. Do not group the index by cluster — see requirement 3.

## 🔴 Two traps, read before you start

**Trap 1 — the RSS autodiscovery link collides with your own guard 4.**
Section 11 check 4 currently asserts **zero `<link rel="alternate">` anywhere in
the document** on a blog page. RSS autodiscovery is
`<link rel="alternate" type="application/rss+xml" …>` — adding it makes that
guard fail on a page that is perfectly correct.

Do **not** delete the guard and do **not** exempt the blog index by id. Narrow
it to the thing it actually protects: **zero `<link rel="alternate">` that
carries an `hreflang` attribute**, plus the existing zero-`hreflang=`-in-`<head>`
assertion. Then re-run the prompt-001 proof — set a blog page's `cluster` to
`'landing'` and confirm the narrowed guard still fails. A guard that was
loosened without being re-proven is a guard that has quietly stopped working.

**Trap 2 — English-only page copy must NOT go in `content/*.json`.**
`check-content.mjs` enforces key-set equality with English across all 23 files,
so any key added to `en.json` must be added to 22 others. The blog index is
English-only, so its H1, intro and meta live as literals in `site.config.mjs`,
the same way `BLOG_POSTS` holds each post's title. The **one** exception is
`nav.blog`, which renders on all 23 locales and therefore does belong in all 23
content files.

## Requirements

### 1. Fix post 1's title tag (one line)
Ammar's decision. In `BLOG_POSTS[0].title`, replace the 65-character title with:

```
Where to Store Important Family Documents: Safe or Phone?
```

56 characters, so Google shows it whole. The `h1` does **not** change.
Also update `title_tag:` in the draft's front-matter
(`claude/blog-drafts/001-…md`) so the source and the site agree.

### 2. Record each post's cluster — data only, no UI
Add `cluster: 'documents'` to post 1, and a `BLOG_CLUSTERS` map in
`site.config.mjs` giving each cluster id a display name (`documents` → "Family
documents"; add the other four from `claude/blog-seo-plan-2026-09.md`:
`cozi`, `adoption`, `privacy`, `devices`).

Nothing renders it yet. Capturing the field now costs one word per post and
means the index can be regrouped later without editing twenty entries. A
`cluster` id not present in `BLOG_CLUSTERS` must throw.

### 3. `/blog/` — the index page
- New `templates/blogindex.html`, new page entry: `id: 'blogindex'`,
  `locales: ['en']`, `cluster: null`, `out: () => 'blog/index.html'`,
  `priority: () => '0.6'`, `meta` literals from config.
- **Reverse chronological, flat.** Do NOT group by cluster. There is one post;
  a grouped layout with one item under one heading and four empty headings
  looks broken. The data is there for when it is worth doing.
- Each entry: hero image (with `width`/`height`), title linking to the post,
  the post's `description`, and the published date as `<time datetime>`.
- The images are the same 1200px files the posts use. Give them
  `loading="lazy"` and `decoding="async"` — this page will eventually load
  twenty of them.
- `<h1>` and intro text: literals from `site.config.mjs`. Suggested H1
  "The Daili blog", intro one sentence about practical family-organisation
  writing. Keep it short; it is a signpost, not an article.

### 4. The Blog link, all 23 locales
- Add `nav.blog` to **all 23** `content/*.json`. Use exactly these:

  `en` Blog · `de` Blog · `fr` Blog · `es` Blog · `it` Blog · `nl` Blog ·
  `pt` Blog · `sv` Blogg · `da` Blog · `nb` Blogg · `pl` Blog · `cs` Blog ·
  `fi` Blogi · `tr` Blog · `id` Blog · `ja` ブログ · `ko` 블로그 ·
  `zh-Hans` 博客 · `zh-Hant` 部落格 · `th` บล็อก · `ru` Блог · `hi` ब्लॉग ·
  `ar` مدونة

  ("Blog" is 4 characters, so the ≥25-char identical-to-English check does not
  apply and no `@@identicalOk` entry is needed. Confirm that rather than
  assume it.)
- In `templates/layout.html`, add the link after Support and before the
  download button. It always points at `/blog/` and always carries
  `hreflang="en" lang="en"` — the target is English whatever the surrounding
  page is, and saying so is the honest minimum for a reader arriving from
  Arabic or Japanese.
- Footer: add the same link via `renderFooterLinks`, reusing `nav.blog`. No
  new footer key.

🔴 **The nav is already five items wide on mobile** (Features, Pricing,
Support, Download, language picker). This adds a sixth. Check 360px before you
report. If it overflows, fix it in the blog link's own CSS — do not restyle the
existing nav, and do not widen the known `.reveal` overflow.

### 5. `/blog/feed.xml` — RSS 2.0
- Channel: title, `<link>` `https://daili.app/blog/`, description,
  `<language>en</language>`, `<lastBuildDate>`, and an
  `<atom:link rel="self" type="application/rss+xml">`.
- One `<item>` per post, newest first: title, link, `<description>` (the post's
  meta description), `<pubDate>` in **RFC 822** (`Tue, 02 Sep 2026 00:00:00 GMT`
  — not ISO), and `<guid isPermaLink="true">` = the post URL.
- Escape every value. A stray `&` in a title produces a feed no reader will
  open, and nothing else in this build would catch it.
- Autodiscovery `<link rel="alternate" type="application/rss+xml" title="Daili
  blog" href="/blog/feed.xml">` in the `<head>` of the blog index **and** every
  blog post — nowhere else. This is what trips trap 1.
- `feed.xml` is **not** a page: keep it out of `sitemap.xml`.

### 6. `tools/check-build.mjs` — extend section 11
Keep the nine existing checks (check 4 narrowed per trap 1), add:

10. The index lists **every** slug in `BLOG_POSTS`, each as a real `<a href>` to
    that post's URL.
11. All 23 landing pages carry exactly one link to `/blog/` in the nav, and it
    has `hreflang="en"`.
12. `feed.xml` parses as XML, has one `<item>` per post, every `<pubDate>`
    matches an RFC-822 shape, and every `<link>` is an absolute
    `https://daili.app/…` URL.
13. `feed.xml` does not appear in `sitemap.xml`; `/blog/` does.
14. The autodiscovery link is present on the index and on every post, and on
    **no other page**.

🔴 **Prove all five can fail, and re-prove the narrowed check 4.** Break it,
build, confirm the message names what broke, restore. Record what you broke for
each in the report — including the check-4 re-proof, which is the one that
matters most because you changed a guard that was already passing.

## Verify before you report
1. `npm run build` clean.
2. `/usr/bin/grep -c 'href="/blog/"' dist/index.html dist/de/index.html
   dist/ja/index.html dist/ar/index.html` → the same count everywhere.
3. `python3 -c "import xml.dom.minidom,sys;xml.dom.minidom.parse('dist/blog/feed.xml')"`
   → no error. Then print every `<pubDate>` and eyeball the format.
4. `/usr/bin/grep -c 'rss+xml' dist/index.html` → **0**. Autodiscovery belongs
   on the blog only.
5. Build `HEAD` into a separate tree and diff. The 23 landing pages and the
   legal pages should differ **only** by the nav/footer Blog link and the
   asset content hashes. Anything else changing is a finding, not a detail.
6. In a browser at `npm run serve`: `/blog/` and the post, **at 360px**, light
   and dark. Confirm the nav does not overflow or wrap badly with six items,
   on `/`, on `/de/` (longer words) and on `/ar/` (right-to-left). Ammar will
   check again, but a screenshot-level pass from you first saves a round trip.

## Report
`claude-reports/2026-09-02/003-blog-index-nav-rss.md`. Short. Include: the five
new guards and what you broke for each, the check-4 re-proof, the 360px nav
result on `/`, `/de/` and `/ar/`, and the diff summary from check 5.

Commit and push. **Do not run `./deploy.sh`** — Ammar deploys.
