# The blog in several languages — the engine only (no post is translated in this run)

Every sub-agent you start MUST use model claude-opus-5-5. Write the report to
`claude-reports/2026-11-17/001-blog-several-languages.md` with the file-write tool.

⚠️ The run script stops the whole run when the report holds a line that matches
`status.*blocked` (upper or lower case). Write your status line as `Status: done` (or
`Status: partly done`). Use the word "blocked" on a status line ONLY when you really stop.

## Why
Ammar decided on 2026-11-17 that every NEW blog post goes out in six languages: English
(the source), German, Norwegian, Ukrainian, Swedish and Dutch. Today the blog is English-only
by design, and the build enforces that in many places. This run teaches the blog engine the
other five languages. It publishes nothing new: the first translated post comes later, from
the weekly "SEO round" (a publish prompt that follows `claude-prompts/BLOG-POST-TEMPLATE.md`).

Plan and decisions: `~/Herd/familyplanner-api/claude-prompts/SKILL-SEO-BLOG-PLAN.md`.

## What exists today (Planning Claude read it on 2026-11-17 — check it again, line numbers move)
- `site.config.mjs`: `LOCALES` (28), `BLOG_POSTS` (27 entries: slug, cluster, features, title,
  description, h1, published, updated, body, image, imageAlt, imageWidth, imageHeight, faq[],
  cta{h2, html}, sometimes itemList), `BLOG_INDEX`, `BLOG_AUTHOR`, `BLOG_CLUSTERS`.
- Bodies: `blog/<slug>.en.html` (27 files).
- `build.mjs`: `blogPages` (`locales: ['en']`, `cluster: null`, out `blog/<slug>/index.html`),
  `blogIndexPage`, `blogList`, `featureBlogBlock` ("From the blog", English feature pages
  only), `postFeatureLink`, `postKeepReading`, the header and footer "Blog" link
  (`href="/blog/" hreflang="en" lang="en"` in every locale), `renderHead` (RSS autodiscovery
  on blog pages, hreflang only when `pg.cluster`), the render loop (`postBody`), the sitemap
  (alternates only when `pg.cluster`), the RSS feed (`blog/feed.xml`, `<language>en`).
  The language picker (`renderLangNav`) already sends a locale that does not have the page to
  that locale's landing page.
- `templates/blogpost.html` and `templates/blogindex.html` hold English words inline
  ("Frequently asked questions", the newsletter block, …); `build.mjs` holds more ("Keep
  reading", "From the blog", "All articles →", "See how … works in daili →").
- `tools/check-build.mjs`: section 1 (manifest), 11 (blog: zero hreflang, canonical,
  description, FAQ parity, hero, sitemap without alternates), 11b (index, nav link must carry
  `hreflang="en"`, feed, autodiscovery), 17 (share card), 19 (blog ↔ feature pages: "no other
  locale's feature page links into the English-only blog"), 20 (no two pages of one locale
  share a title), 21 (JSON-LD).
- `tools/check-content.mjs` demands the same keys in all `content/<loc>.json` files.
- The api's newsletter form accepts a `lang` field and falls back to English for a language
  it does not know (`~/Herd/familyplanner-api/app/Http/Controllers/Web/NewsletterController.php`,
  `pageLocale`). Read it; do not change the api.

## Decisions that are fixed (do not change them; a problem with one → say it in the report)
1. `BLOG_LOCALES = ['en', 'de', 'nb', 'uk', 'sv', 'nl']` — a new export in `site.config.mjs`.
   `en` is the source and always exists. Every entry must be in `LOCALES`.
2. **A post exists in a language only when its translation files exist.** No fallback: never
   English text on a translated address, never a machine-made page.
3. **Addresses.** English stays exactly where it is: `/blog/<slug>/`. A translation lives at
   `/<loc>/blog/<slug>/` with the SAME slug (a slug is never translated and never changes).
4. **No post is translated in this run.** The commit holds no translation of a real post.
   The 27 old posts stay English (Ammar: "Only new posts").
5. **With zero translations the built site is the same as before this run** — proven with a
   diff (Verify 1).
6. **No new look.** Same templates, same CSS classes, same blocks. If a requirement seems to
   need a new visual piece, do not invent one: leave that part out and say so in the report
   (it becomes a design task).
7. Zero npm dependencies, as always.

## Requirements

### 1. Translation files
A translation of post `<slug>` into `<loc>` is exactly two files:
- `blog/<slug>.<loc>.html` — the body, same rules as the English body (content only, no
  `<h1>`, no FAQ section, no CTA).
- `blog/<slug>.<loc>.json` — the words that are in `BLOG_POSTS` for English:
  `title`, `description`, `h1`, `imageAlt`, `faq` (`[{q, a}]`), `cta` (`{h2, html}`), and
  `itemList` when the English post has one.
Everything else (slug, cluster, features, published, updated, image, sizes) is taken from the
English entry — it is never repeated in the json. An unknown key in the json fails the build.
The build throws with a clear message when: only one of the two files exists · `<loc>` is
`en` or not in `BLOG_LOCALES` · `<slug>` is not in `BLOG_POSTS` · a needed key is missing or
empty · `faq` has another number of questions than the English post.

### 2. The fixed words of a blog page, per language
Every English word that the blog templates and `build.mjs` put on a blog page moves into ONE
per-language place for the six `BLOG_LOCALES` (your choice: an export like `BLOG_UI` in
`site.config.mjs`, or `blog/ui/<loc>.json` — NOT `content/<loc>.json`, whose keys must exist
in all 28 languages). That is at least: "Frequently asked questions" · "Keep reading" · "From
the blog" · "All articles →" · "See how {feature} works in daili →" · the whole newsletter
block (heading, sentence, label, placeholder, button, "Leave this field empty", "Unsubscribe
any time.", "Privacy policy") · the blog index `title`, `description`, `h1`, `intro` · a new
line "More articles in English →" · the feed title stays English.
- English must come out letter for letter as today.
- Write the five other languages now (de, nb, uk, sv, nl). Take feature names and the way
  the site names Daili from `content/<loc>.json` and `content/glossary.md`; follow the tone of
  that language's home page (German: "du").
- 🔴 Never the words for "family planning" (it means contraception): Familienplanung ·
  familieplanlegging · familjeplanering · gezinsplanning · планування сім'ї. In Ukrainian the
  site says "сімейний органайзер" for the app — never a word that reads as "family planner".
- A missing string for a `BLOG_LOCALES` language throws at build time.
- The report lists every new string in all five languages with its English source (Ammar
  cannot read them; this list is his proof).

### 3. Post pages
For every post and every language it exists in, build `/<loc>/blog/<slug>/` from
`templates/blogpost.html`: translated title, description, h1, alt text, body, FAQ, CTA; the
fixed words of requirement 2; the date in that language (`formatDate(iso, loc)`); the CTA
link goes to that language's feature page with that language's feature name; the newsletter
form sends `lang` = the page's language and links that language's privacy page; "Keep
reading" lists only posts that exist in the SAME language (none → no block). `<html lang>`,
`og:locale` and the JSON-LD `inLanguage` are the page's language; Article + FAQPage JSON-LD
are built from the translated words (FAQ from the json's `faq`, the same list the page shows).

### 4. hreflang (the part Google needs)
- A post that exists in English only: exactly as today — NO hreflang, `cluster: null`.
- A post with at least one translation: its pages form their own cluster. Every page of it
  carries one `hreflang` link per language the post exists in, plus `x-default` = the English
  page. Never a language the post does not exist in. Never a link to another post or to a
  landing page.
- The sitemap follows the same rule (alternates only for posts with a translation).

### 5. A blog index per language
`/<loc>/blog/` is built only for a language that has at least one translated post. It uses
`templates/blogindex.html`, lists only the posts that exist in that language (newest first),
and ends with the link "More articles in English →" to `/blog/` (marked `hreflang="en"
lang="en"`, an existing link style — no new look). The index pages of the languages that have
one form their own hreflang cluster together with `/blog/` (x-default = `/blog/`); while only
English exists, `/blog/` carries no hreflang, as today.

### 6. Links into the blog
- Header and footer "Blog" link: a language with its own index links to `/<loc>/blog/`
  (without `hreflang="en" lang="en"`); every other language keeps today's link to `/blog/`.
- Feature pages: "From the blog" appears on the feature page of language L when a post that
  exists in L is tagged with that feature (the 3 newest, linked to `/<loc>/blog/<slug>/`,
  heading and "All articles →" in L, the latter to `/<loc>/blog/`). No such post → no block,
  as today. A feature page never links to a post in another language.
- The language picker on a post: a language that has the post → the translated post; a
  language that does not → what it does today. Confirm this works with no change to its look.

### 7. Feed
`blog/feed.xml` stays English-only (English posts, `<language>en`). The RSS autodiscovery
link stays on the English blog pages only; a translated page does not carry it.

### 8. Guards — `tools/check-build.mjs` (and what it shares with a test)
Keep every guard that protects the English blog today. Change each "the blog is
English-only" assertion into the new rule, never into "anything goes":
- section 1: the expected pages include every translated post and every language index.
- section 11: English-only post → zero hreflang (unchanged). Translated post → the hreflang
  set is EXACTLY its languages + x-default, on every page of the post, and every alternate is
  a built page that points back. Canonical = the page itself. Description, og tags, FAQ
  parity (json ↔ visible page ↔ JSON-LD) and the hero file hold for every language.
- section 11b: the nav rule of requirement 6; the index of a language lists exactly the posts
  of that language; the feed and autodiscovery rules of requirement 7.
- section 19: the rule of requirement 6 for feature pages; a translated post links to its
  primary feature page IN ITS LANGUAGE and not to itself.
- sections 17, 20, 21 must hold for the new pages (share card: a post keeps its hero; no two
  pages of one language share a `<title>`; JSON-LD parses and points at the page's own URL).
- NEW, for every translation:
  a. **Same shape as the English post:** the same number of `<h2>`, `<h3>`, `<p>`, `<li>`,
     `<table>`, `<tr>`, `<img>`, `<blockquote>` and `<a>` in the body; the same external link
     addresses; every internal link goes to the same page as in English — in the page's
     language when that page exists there, else the English one. (The word-count rule of the
     recipe fits English only; this replaces it for translations.)
  b. **Not a copy:** the body, `title` and `h1` differ from the English ones.
  c. **No English left over:** none of the English fixed words of requirement 2 appears on a
     translated blog page.
  d. **Forbidden words:** a per-language list (the words of requirement 2, plus `en:
     'family planning'`) is searched, without regard to upper/lower case, in every
     translation file and in the fixed words. If an existing ENGLISH post holds the English
     phrase, do not change the post: leave `en` out of the list and name the post in the
     report.
- Put the checks that judge translation files into a small module that both `check-build.mjs`
  and a new test import, so they can be tested without a full site build.

### 9. A test with fixtures
`tools/test-blog-i18n.mjs`, in the style of `tools/test-check-help.mjs` + `tools/fixtures/`:
a made-up translated post under `tools/fixtures/` that passes, and one failing case per rule
of requirement 1 and of 8 a–d, each asserting the message. Add it to `npm test` and to the
`npm run build` chain. Fixtures live only under `tools/fixtures/` and never reach `dist/`.

### 10. Docs
- `claude-prompts/BLOG-POST-TEMPLATE.md`: add a section "Translations" — the two files, where
  the fixed words live, which languages (`BLOG_LOCALES`), what the guards check, and the
  changed Verify steps (hreflang: 0 for an English-only post, else the exact set; word count
  for English, same shape for translations; the report shows title + first sentence of each
  language with an English copy). Keep the rest of the recipe as it is.
- `README.md` and the comments in `build.mjs`, `site.config.mjs`, `tools/check-build.mjs`
  and the two templates that say "the blog is English-only": make them true.

## Out of scope
- Translating any real post. Changing the prose, address or meta of an English post.
- `./deploy.sh`. The api. The help center. `content/<loc>.json` (no new key).
- The untracked folder `static/assets/img/photos/` — it is not yours: do not add, commit,
  move or delete it, and it is no reason to stop.

## Verify (all in the foreground; show the output in the report)
1. **Nothing changed for today's site.** BEFORE your first edit: `npm run build`, then copy
   `dist/` to a folder outside the repo. AFTER your last edit, with no translation files in
   `blog/`: `npm run build` again and `diff -r` the two folders. The diff must be empty. Every
   line that differs is explained in the report, one by one (a changed asset hash counts).
2. `npm run build` and `npm test` are green, with the new test in both.
3. **A dry run with one real translation — NOT committed.** Translate the shortest existing
   post into German and Ukrainian by hand (two files each, requirement 1), build, and check:
   `/de/blog/<slug>/`, `/uk/blog/<slug>/`, `/de/blog/`, `/uk/blog/`, the English post, a
   German feature page tagged with it, the sitemap entries, the header "Blog" link on `/de/`
   and on `/sv/` (no index there → still `/blog/`), and `hreflang` in the three post pages
   (`/usr/bin/grep -c hreflang`): en, de, uk, x-default on each. Look at the German post and
   the German index in a browser at 360 px, light and dark, and save four pictures to
   `claude-reports/2026-11-17/001-shots/` (no browser → say so, do not skip silently).
   Then DELETE the four translation files, build again, and show that the diff of step 1 is
   empty again and that `git status --short` shows none of them.
4. Break things on purpose once each (and put them back): delete one of the two files of the
   dry-run translation → the build names the missing file; add a forbidden word → the guard
   names the file and the word; remove one `<p>` from the translation → the shape guard names
   the difference.

## Commit & push
- Conventional Commit(s); the body holds
  `Prompt: claude-prompts/2026-11-17/001-blog-several-languages.md`.
- The commit holds NO file `blog/<slug>.<loc>.html` / `.json` for a language other than `en`
  (fixtures under `tools/fixtures/` are fine).
- **Push now.** A push does not publish this site. **Do NOT run `./deploy.sh` — Ammar deploys.**

## Report
`claude-reports/2026-11-17/001-blog-several-languages.md`, short and in easy English:
what a translation needs now (the two files, in three lines) · where the fixed words live ·
the table of the new strings (five languages + English source) · the guards, old and new, one
line each · the output of Verify 1–4 · the pictures · anything you could not do and why ·
"Decisions I had to make" (each with one line why) · the commit SHA and the push result ·
`## Help impact`: none · `## For the next publish prompt`: the exact steps to add a post in
six languages.
