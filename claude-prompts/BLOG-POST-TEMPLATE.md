# Publishing a blog post — the standing recipe

The blog engine shipped in `claude-prompts/2026-09-02/001-blog-engine.md`
(`4bdaf41`) and got its front door in `003-blog-index-nav-rss.md` (`8591bc1`).
Adding a post is now a two-file change (plus two files per translation, see
"Translations"). This file is the recipe every
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
   **`features` is required**: 1–2 HOME_FEATURES slugs with a page, the
   primary first, taken from the draft's front-matter or the publish prompt.
   It drives the feature page's "From the blog", the CTA line to
   `/features/<primary>/` and "Keep reading" — never hand-write those links;
   the build throws on a missing or unknown slug.
   Planning Claude adds 2 in-prose links FROM existing posts TO every new post
   in the weekly SEO round; the publish prompt says which, if any — add only
   those.

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

## Translations (since `claude-prompts/2026-11-17/001-blog-several-languages.md`)
Every NEW post goes out in six languages: English (the source) plus the other
`BLOG_LOCALES` in `site.config.mjs` — `de`, `nb`, `uk`, `sv`, `nl`. The 27
older posts stay English. A post exists in a language only when BOTH of its
files exist; there is no fallback.

- **The two files per language:**
  1. `blog/<slug>.<loc>.html` — the translated body, same rules as the English
     body (no `<h1>`, no FAQ, no CTA).
  2. `blog/<slug>.<loc>.json` — exactly `title`, `description`, `h1`,
     `imageAlt`, `faq` (`[{q, a}]`, as many as English), `cta` (`{h2, html}`),
     and `itemList` only when the English post has one. Nothing else: slug,
     cluster, features, dates, image and sizes come from the English entry, and
     an unknown key fails the build.
- **Address:** `/<loc>/blog/<slug>/`, the English slug. The build adds the
  hreflang set (its languages + x-default English), the sitemap alternates,
  `/<loc>/blog/`, the Blog link in that language's header/footer and the
  feature page's "From the blog" — never hand-write any of them.
- **Links in a translation:** external links and `#anchors` exactly as in
  English. An internal link goes to the same page as in English, in the
  page's language when that page exists there (`/` → `/de/`,
  `/features/calendar/` → `/de/features/calendar/`, `/privacy.html` →
  `/datenschutz.html`), else the English page (`/blog/<an English-only post>/`
  stays). The CTA's `html` follows the same rule. When an older post gets its
  own translation later, the guard asks for the links to it to be updated.
- **Fixed words** ("Frequently asked questions", the newsletter block, "Keep
  reading", "From the blog", "All articles →", "See how {feature} works in
  daili →", the index words, "More articles in English →") live in
  `blog/ui/<loc>.json`. Do not touch them in a post prompt.
- 🔴 **Never the words for "family planning"** (contraception): Familienplanung,
  familieplanlegging, familjeplanering, gezinsplanning, планування сім'ї. In
  Ukrainian the app is "сімейний органайзер", never "сімейний планувальник".
  Feature names come from `content/<loc>.json` / `content/glossary.md`; German
  says "du".
- **What the guards check** (`tools/blog-i18n.mjs`, check-build sections 11,
  11b, 11c, 19): both files exist and are complete; the body has the same
  number of `<h2> <h3> <p> <li> <table> <tr> <img> <blockquote> <a>` as
  English, the same external links and the right internal ones; the body,
  `title` and `h1` are not the English ones; no English fixed word is left on
  the page; no forbidden word; hreflang, canonical, description, og tags, FAQ
  parity (json ↔ page ↔ JSON-LD) and the hero hold in every language.

## Verify
1. `npm run build` clean — section 11's guards already cover h1 count,
   canonical, description, hreflang, og tags, FAQ parity, the hero file,
   duplicate slugs and the sitemap, in every language of the post. Section 11c
   judges the translation files. They run on the new post automatically.
2. The post appears on `/blog/` and as a new `<item>` in `/blog/feed.xml`
   (English only), and on `/<loc>/blog/` for each translation.
3. hreflang in the `<head>`: an English-only post → 0
   (`/usr/bin/grep -c hreflang` on the head of `dist/blog/<slug>/index.html`).
   A translated post → exactly its languages + `x-default`, on every one of its
   pages (`dist/blog/<slug>/`, `dist/<loc>/blog/<slug>/`).
4. English: word-count the rendered article against the draft; they should be
   within ~2%. A big gap means something was dropped. Translations: the word
   count does not apply; the guard's "same shape" check replaces it.
5. Browser at 360px, light and dark (English, plus one translation).

## Report
`claude-reports/<date>/NNN-blog-post-<n>.md`. Short: the `BLOG_POSTS` entry, the
guards passing on the new post, the word-count comparison (English), and
anything in the prose you had to change (ideally nothing). For a post with
translations: a table with the `title` and the first sentence of each
language, each with an English copy next to it (Ammar cannot read them all;
this is his check).

Commit and push. **Do not run `./deploy.sh`** — Ammar deploys.

## Picking a hero image — learned the hard way

**Open the Pexels photo page before recommending it to Ammar.** Search-result
descriptions are unreliable: `photo/family-sitting-together-6148871/` was
described as "family talking in a bright living room". It is a PORTRAIT shot of
a grandfather with his back to the camera, and Ammar downloaded it twice before
anyone checked. Confirm two things from the photo page itself:

1. **Orientation.** Portrait is wrong for a hero. Blog heroes are landscape,
   ~3:2, resized to 1200px wide.
2. **What is actually in it**, not what the filename says.

Then, after converting, **look at the .webp** before declaring it done — post 2's
first hero was a survival go-bag on an article about paperwork. A contact sheet
(several thumbnails montaged into one PNG, staged and read once) checks a whole
batch cheaply.

**Also check it against its neighbours.** Two posts publishing days apart must
not look alike — that is why post 4 could not be another grandparent shot after
post 6, and why it should not be another white-kitchen-breakfast after post 5.

**Alt text describes the photo, not the post.** "A grandmother drawing with her
grandchildren" was wrong; she is watching them draw. Fix it after you look.
