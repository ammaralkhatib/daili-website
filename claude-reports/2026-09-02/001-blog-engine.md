# 001 — The blog engine, and the first post on it

**Status:** done. `https://daili.app/blog/where-to-store-important-family-documents/`
builds. `npm run build` clean: 53 pages, 51 sitemap entries, 50 in hreflang
clusters (unchanged — the blog page joins none).

Hero image was present before I started, so the blocked path did not apply.

---

## The shape of `BLOG_POSTS`

`site.config.mjs`, below `PAGES`:

```js
export const BLOG_AUTHOR = { name: 'Ammar Khatib', url: '/impressum.html' };

export const BLOG_POSTS = [
  {
    slug, title, description, h1,        // title 65 chars, h1 differs on purpose
    published: '2026-09-02', updated: '2026-09-02',
    body: 'where-to-store-important-family-documents.en.html',
    image: '/assets/img/blog/…​.webp', imageAlt,
    imageWidth: 1200, imageHeight: 801,  // added — see "judgement calls"
    faq: [ { q, a } × 3 ],               // the only place the questions exist
    cta: { h2, html },                   // added — see "judgement calls"
  },
];
```

`build.mjs` expands these into pages next to `pageById` with
`cluster: null`, `locales: ['en']`, `out: () => 'blog/<slug>/index.html'`,
`priority: () => '0.6'`, `meta`, and the whole `post` object. `renderHead`
builds the `FAQPage` JSON-LD from the same `post.faq` array that
`templates/blogpost.html` renders the visible questions from, so the two are
the same strings by construction and cannot drift.

---

## The nine guards, and what I broke to prove each

Each break was applied on its own, `node build.mjs && node tools/check-build.mjs`
was run, and the file was restored from a snapshot afterwards. Every message
names the post. **13/13 breaks were caught.**

| # | Guard | What I broke | Message |
|---|---|---|---|
| 1 | exactly one `<h1>` | added a second `<h1>` to the body fragment | `has 2 <h1> elements, expected exactly 1` |
| 2 | canonical is `BASE_URL + /blog/<slug>/` | `renderHead` appended `index.html` to the canonical on blog pages | `canonical is …/index.html, expected …/` |
| 3 | its own description, not the landing page's | reverted the `pg.meta ?` arm of the description override in `build.mjs` | `description is the landing page's — the per-page meta override is not applying` |
| 4 | no hreflang declarations | set the blog page's `cluster: null` → `'landing'` | `<head> carries 2 hreflang= declaration(s)` **and** `carries 2 <link rel="alternate">` **and** check 9 fired too |
| 5a | `og:type` is `article` | hard-coded `content="website"` | `og:type is 'website', expected 'article'` |
| 5b | `og:image` is the post's hero | hard-coded the logo | `og:image is …/logo.webp, expected the post's hero …` |
| 6a | every question is in the FAQPage JSON-LD | `post.faq.slice(0, -1)` in the JSON-LD only — page still showed all three | `"Do I need a safe AND…" is visible on the page but missing from the FAQPage JSON-LD` |
| 6b | every question is visible on the page | deleted the `{{# post.faq }}` loop from the template | all three: `is in BLOG_POSTS but not in the visible page` |
| 7a | hero image exists in `static/` | renamed the `.webp` away | `hero image … does not exist in static/` (section 2 also caught the broken link) |
| 7b | built page references the hero | pointed the template's `src` at the logo | `page does not reference its hero image …` |
| 8 | no two posts share a slug | pushed a duplicate entry onto `BLOG_POSTS` | `BLOG_POSTS[1] repeats the slug '…' from BLOG_POSTS[0]` |
| 9a | blog URL is in the sitemap | excluded `w.pg.post` from the sitemap's url list | `… is missing from the sitemap` |
| 9b | sitemap entry has no `xhtml:link` | forced alternates for blog pages | `sitemap entry carries xhtml:link alternates` |

**6a is the one worth noting.** The break left every question visible on the
page and removed one only from the JSON-LD — a substring match against the
file would have passed. It fails because check 6 parses the JSON-LD and reads
the question strings. **6b** is its mirror: the questions were still in the
file (inside the JSON-LD) and it still failed, because the visible-text check
runs against the page with the JSON-LD blocks stripped out.

---

## Verification

1. `npm run build` — clean.
2. `grep -c hreflang` on the built post → **23**, all of them `<a hreflang>` in
   the language picker. In the `<head>`: **0**, and **0** `<link rel="alternate">`.
   `dist/index.html` → still **47**, unchanged. *(See the judgement call below —
   the guard is scoped to the `<head>`, per your answer.)*
3. Both JSON-LD blocks parse: `Article` (headline = the H1) and `FAQPage`
   (3 questions).
4. `grep -c "xhtml:link" dist/sitemap.xml` → **1116**, identical to the HEAD
   build. The blog URL is present with `<priority>0.6</priority>` and no alternates.
5. **Byte-identical:** I built HEAD into a separate tree and compared. All
   **52** pre-existing pages — not just the three named — are byte-identical
   **except for one line each**: `style.31c21cbd.css` → `style.ace53adf.css`.
   That is the content hash of `style.css`, which requirement 5 changes by
   definition. Normalising that one filename, all 52 are byte-identical, so the
   meta-override change is provably inert.
6. **Not done — the Chrome extension is not connected** ("Browser extension is
   not connected"), so I could not view the page at 360px or in dark mode.
   What I could check without a browser:
   - hero renders `width="1200" height="801"` with the global `img{height:auto}`,
     so it reserves its box and does not shift the layout;
   - the blog CSS contains **zero colour literals** — nine `var(--token)`
     references, and all eight colour tokens are redefined in the dark-mode
     block, so dark mode is inherited rather than written;
   - the only fixed dimension in the blog CSS is `.post-table{min-width:500px}`,
     which sits directly inside `.table-wrap{overflow-x:auto}` — it scrolls in
     its own box. Nothing else in the block has a `width:…px` or `min-width`,
     so no second page-level overflow was added.

   **This still needs your eyes at 360px, light and dark.**

---

## Changes to the draft's prose

**None.** I diffed the shipping sections of the draft against the rendered
article word for word: 1,604 draft words vs 1,591 page words, and the only
strings in the draft that are not in the article body are the H1 and
"Frequently asked questions" — both of which the template renders instead.
Nothing appears on the page that is not in the draft. The markdown table
matches the `<table>` cell for cell, all 9 rows.

The two mechanical jobs:
- the table became `<div class="table-wrap"><table class="post-table">` with
  `<th scope="col">` headers and `<th scope="row">` document names;
- **two** external links, not four: `UL Class 350` →
  safeandvaultstore.com/pages/fire-ratings, and `FDIC` → the FDIC safe-deposit-box
  page, both `rel="noopener"`. The prompt said four, but the draft's publishing
  notes list two external links and *four internal* ones — and those four point
  at posts 2, 3, 9 and 10, which do not exist yet. Adding them would break
  `check-build` section 2 (broken internal link), and the draft itself says to
  add each "on the day the target post publishes". So they are not in. **Flagging
  in case you meant something else by "four".**

One more change worth naming: the CTA link was `https://daili.app/` in the
draft; it ships as `href="/"`. Absolute self-links are not validated by
check-build section 2 and would not survive a domain change.

---

## Judgement calls you should look at

**1. Check 4 is scoped to the `<head>`.** You answered this mid-run, recording
it here for the file. Requirement 6 asked for zero occurrences of `hreflang=`
in the whole file; requirement 3b said `renderLangNav` needs no change. Both
cannot hold — the picker writes `hreflang="xx"` on all 23 of its `<a>` tags.
The `<head>` was clean from the first build, which is the part that matters:
an `<a hreflang>` is an advisory hint about a linked page's language and forms
no cluster. Check 4 now asserts zero `hreflang=` in the `<head>` **and** zero
`<link rel="alternate">` anywhere in the document, so it still fails loudly if
a blog page is ever given a cluster (proven above).

**2. `cta: { h2, html }` is a field you did not list.** Requirement 2 says the
"What daili does with this" section ships "as the closing CTA"; requirement 4
puts the CTA block *after* the FAQ, which the body fragment cannot do. So the
section lives on the post object and the template renders it last. It is
per-post prose — it names what this article was about — so hard-coding it into
a template twenty posts share would have been wrong. **If you would rather it
were a second file in `blog/` like `body`, that is a small change.**

**3. `imageWidth` / `imageHeight` are also not in your list.** The hero needs
`width`/`height` attributes or it shifts the layout (your own verify step 6),
and `imageSize()` is keyed by filename prefix so it cannot serve blog images.
They are measured from the file — 1200×801 — the same way `IMAGE_SIZES` records
the screenshot dimensions.

**4. `title` is 65 characters, not the 50–60 you asked for.** It is the
`title_tag` from the draft's front-matter, verbatim. I did not rewrite published
copy. Google will likely truncate it around "…(Safe, Cloud" on desktop.

**5. The CTA heading reads "What daili does with this"** — lowercase brand,
because that is what the draft says. Every other surface on the site says
"Daili". Kept verbatim; say the word and it changes.

---

## Files

- `site.config.mjs` — `BLOG_AUTHOR`, `BLOG_POSTS` (new exports, below `PAGES`)
- `build.mjs` — meta override, `blogPages`/`allPages`, article head + JSON-LD, `page.postBody`
- `templates/blogpost.html` — new
- `blog/where-to-store-important-family-documents.en.html` — new
- `static/assets/style.css` — blog block appended (no new colour literals)
- `tools/check-build.mjs` — section 11, plus blog pages added to section 1's expected set

Out of scope and untouched, as instructed: `/blog/` index, nav and footer links,
RSS, `content/*.json`, `templates/layout.html`, `_storebadges.html`, `script.js`,
`tools/check-content.mjs`, the `stores` block.

Not deployed — `./deploy.sh` not run.
