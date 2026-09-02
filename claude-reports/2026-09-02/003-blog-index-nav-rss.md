# 003 — The blog gets a front door: index, nav link, RSS

**Status:** done. `/blog/` lists post 1, all 23 landing pages carry a Blog link
in nav and footer, `/blog/feed.xml` is valid RSS 2.0. `npm run build` clean:
54 pages, 52 sitemap entries, 50 in hreflang clusters (unchanged — neither the
index nor the post joins one).

**One thing needs your eye:** the sixth nav item *did* overflow, in Arabic only,
and I fixed it by hiding the nav Blog link below 560px. Details below.

---

## The five new guards, and what I broke for each

Applied one at a time, `node build.mjs && node tools/check-build.mjs`, then
restored from a snapshot. **12/12 breaks caught by the intended guard.**

| # | Guard | What I broke | Message |
|---|---|---|---|
| 10 | index lists every post | `posts: blogList.slice(1)` | `does not link to /blog/where-to-store-… — every post in BLOG_POSTS must be listed on the index` |
| 11a | landing pages carry the Blog link | deleted the `<a>` from `layout.html` | `nav has 0 links to /blog/, expected exactly 1` (all 23) |
| 11b | …and it says `hreflang="en"` | dropped the attribute | `nav Blog link has no hreflang="en"` (all 23) |
| 12a | feed is well-formed XML | emitted `<title>${post.title} & more</title>` — a raw `&` | `is not well-formed XML: unescaped '&' in element text` |
| 12b | `pubDate` is RFC 822 | emitted `post.published` (ISO) | `date "2026-09-02" is not RFC 822 (want e.g. "Wed, 02 Sep 2026 00:00:00 GMT")` |
| 12c | one `<item>` per post | `blogList.slice(1).map` | `has 0 <item> element(s), expected 1` |
| 12d | feed links are absolute | `post.url` instead of `post.absUrl` | `<link>/blog/where-to-store-…</link> is not an absolute https://daili.app URL` |
| 13a | feed.xml stays out of the sitemap | appended a `<url><loc>…/feed.xml</loc></url>` | `lists blog/feed.xml — a feed is not a page` |
| 13b | …and `/blog/` stays in it | filtered `blogindex` out of the sitemap | `does not list https://daili.app/blog/` |
| 14a | autodiscovery only on the blog | `if (isBlog)` → `if (true)` | `404.html … has an RSS autodiscovery link but is not a blog page` (all 52) |
| 14b | …and on every blog page | restricted it to the index | `has no RSS autodiscovery link — every blog page must advertise the feed` |

### The check-4 re-proof (the one that matters)

Trap 1 was real: RSS autodiscovery is a `<link rel="alternate">`, and the old
guard asserted **zero** of those anywhere on a blog page. Narrowed as instructed
to alternates that carry an `hreflang`, keeping the zero-`hreflang=`-in-`<head>`
assertion:

```js
const alternates = (html.match(/<link rel="alternate"[^>]*hreflang=/g) || []).length;
```

**Re-proof:** set the blog page's `cluster: null` → `'landing'`, rebuilt. Both
arms still fire:

```
<head> carries 2 hreflang= declaration(s) — the blog is English-only and must claim no alternates
carries 2 <link rel="alternate" … hreflang=> — a blog page must never join an hreflang cluster
```

The guard was loosened and re-proven, not just loosened.

---

## 🔴 The nav at 360px — it overflowed, and the fix

The Chrome extension is still not connected, so I drove the installed Chrome
over CDP (`Emulation.setDeviceMetricsOverride` for a true 360 CSS-px viewport,
`setEmulatedMedia` for dark mode). Worth saying plainly: **`--window-size` alone
is not a 360px test.** macOS clamps the window to ~500px wide, so a
`--screenshot --window-size=360,800` run lays the page out at 500px and then
crops it — which looks like clipping that isn't there, and hides clipping that
is. The first two passes I did that way were wrong in both directions.

Measured across all 23 locales, HEAD (5 items) vs this branch (6):

- **22 locales were fine.** Six items fit; the language picker already wrapped
  to its own row before this change and still did.
- **Arabic overflowed by 32px.** RTL, so the nav runs off the *right* edge —
  `المزايا` (Features) was clipped. HEAD had 7px of room; six items needed 32
  more than there was. Arabic first fits six items at **400px**.
- **Five locales (th, tr, ko, hi, zh-Hant) gained a third nav row**, making the
  header ~45px taller than it is today.

`shots/003-HEAD-ar-360.png` vs `shots/003-NOW-ar-360.png` shows the clipping.

**Fix, in the blog link's own CSS only** — no existing nav rule touched:

```css
@media(max-width:560px){ .nav-blog{display:none} }
```

Verified after the fix, all 23 locales:

| viewport | Blog link in nav | `<a>` in the markup | nav fits | header height vs HEAD |
|---|---|---|---|---|
| 360px | hidden | yes, all 23 | yes, all 23 | **identical, all 23** |
| 560px | hidden | yes, all 23 | yes, all 23 | **identical, all 23** |
| 561px | visible | yes, all 23 | yes, all 23 | — |
| 900px | visible | yes, all 23 | yes, all 23 | — |

So on a phone the header keeps exactly the shape it has today, and the **footer**
Blog link is present at every width in every locale — the blog is still one tap
away. The `<a>` stays in the markup regardless, which is what check 11 asserts,
so the guard is unaffected by the CSS.

`shots/003-fixed-ar-360.png` — Arabic back to the HEAD layout.

**Worth knowing:** the nav's right edge sits flush at the viewport edge on the
tightest locales at 360px, and that is pre-existing (HEAD is the same). The nav
has no room for a seventh item on a phone.

### Other 360px results
- `/blog/` and the post: **0px horizontal overflow** at 360px, light and dark.
  I did not add a second overflow.
- The landing pages' known ~114px overflow (`figure.gallery-item.shot`) is
  unchanged — same element, same width. Out of scope, untouched.
- Dark mode: `shots/003-blog-360-dark.png`, `shots/003-post-360-dark.png`.

---

## Verification

1. `npm run build` — clean, all four steps.
2. `grep -c 'href="/blog/"'` → **2** on every one of the 23 landing pages
   (nav + footer), identical everywhere.
3. `python3 … xml.dom.minidom.parse('dist/blog/feed.xml')` → parsed OK.
   `pubDate` and `lastBuildDate` both `Wed, 02 Sep 2026 00:00:00 GMT`.
   (2026-09-02 is a Wednesday.)
4. `grep -c 'rss+xml' dist/index.html` → **0**. Exactly two pages carry it:
   `blog/index.html` and the post.
5. **52 of 53** pre-existing pages differ from a HEAD build *only* by the
   nav+footer Blog link (asset content hashes normalised). The one exception is
   post 1, which differs by exactly three lines — the new `<title>`, the new
   `og:title`, and the autodiscovery link — i.e. requirements 1 and 5 and
   nothing else. New files: `blog/index.html`, `blog/feed.xml`, the new CSS.
6. Browser pass done over CDP as described. Screenshots in `shots/`.

---

## Notes

- **Requirement 1:** the new title is **57** characters, not the 56 the prompt
  says. Still inside 50–60. Updated in `BLOG_POSTS[0].title` and in the draft's
  `title_tag:` front-matter, so source and site agree.
- **`@@identicalOk` confirmed unnecessary, not assumed.** `check-content.mjs:122`
  gates the byte-identical-to-English check on `b.value.length >= 25`; "Blog" is
  4, so both that check and the length-ratio warning are skipped. Content check
  passes at 159 keys per locale (was 158).
- **`BLOG_CLUSTERS`** carries all five ids from the plan: `documents`, `cozi`,
  `adoption`, `privacy`, `devices`. Post 1 is `documents`. Nothing renders it;
  `build.mjs` throws on an id that is not a key, so an unrendered typo cannot
  sit there until the day `/blog/` starts grouping.
- **Index is flat and reverse-chronological**, as instructed — not grouped.
- **English-only copy stayed out of `content/*.json`**: `BLOG_INDEX` in
  `site.config.mjs` holds the index's title, description, H1 and intro, and
  doubles as the RSS channel title/description. `nav.blog` is the only key added
  to the 23 content files.
- **`feed.xml` is not a page** — it is written next to the sitemap and never
  enters `written`, so it cannot reach `sitemap.xml` by construction.
- `lastBuildDate` is the newest post's `updated`, not the build date: a feed
  whose timestamp moves on every rebuild tells a reader nothing.
- **XML well-formedness is checked without a dependency.** Node ships no XML
  parser and this repo has none on purpose, so `xmlProblems()` in
  `check-build.mjs` scans for the things that actually break a feed — an
  unescaped `&`, a stray `<`, unbalanced tags. Verify step 3 parses the same
  file with python3's minidom as an independent second opinion.

## Files

- `site.config.mjs` — `BLOG_CLUSTERS`, `BLOG_INDEX`, post 1's `cluster` and new `title`
- `build.mjs` — cluster validation, `blogIndexPage`, `blogList`, `rfc822()`, RSS output, autodiscovery, footer link
- `templates/blogindex.html` — new
- `templates/layout.html` — the nav Blog link
- `content/*.json` — `nav.blog`, one line each, 23 files
- `static/assets/style.css` — blog index styles, `.nav-blog` breakpoint
- `tools/check-build.mjs` — check 4 narrowed, section 11b (checks 10–14), `xmlProblems()`
- `claude/blog-drafts/001-…md` — `title_tag:` kept in step with the config

Out of scope and untouched: post 2, `tools/check-content.mjs`, the `stores`
block, anything in `blog/`.

Not deployed — `./deploy.sh` not run.
