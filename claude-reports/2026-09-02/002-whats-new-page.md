# "What's new" page — EN + DE, fed by the app's CHANGELOG

**Prompt:** `claude-prompts/2026-09-02/002-whats-new-page.md`
**Completed:** 2026-09-02 · **Status:** done

## Summary

daili.app now has a release-notes page in two languages:
`/whats-new.html` (English) and `/neuigkeiten.html` (German). Both are built
from a simple file of `<section class="release">` blocks in the new `changelog/`
folder, so a future release prompt only has to paste one block at the top of two
files — no config, no template, no code. The first block (Daili 1.2.0) is in,
taken from the app's `CHANGELOG.md`. The two pages point at each other as
hreflang alternates, they are in the sitemap, and every locale's footer links to
them. A new guard in `check-build.mjs` makes sure the newest release really does
end up first on the page; I broke it three different ways to prove it works.

## Files touched

- `changelog/whats-new.en.html`, `changelog/whats-new.de.html` — new. The
  release notes themselves. Each starts with a comment saying what the format
  is and where to paste the next version.
- `site.config.mjs` — the `PAGES` entry for the page, plus `WHATS_NEW`, which
  holds the page's own title, description, heading and intro sentence in both
  languages.
- `build.mjs` — two small changes, both allowed by requirement 1 (see
  Decisions), plus the footer link.
- `templates/whats-new.html` — new. A copy of `legal.html` with the heading and
  the one-line intro added above the body.
- `static/assets/style.css` — four rules to separate one release block from the
  next and to grey out the date.
- `tools/check-build.mjs` — the new guard (section 12).

## Decisions

- **Where the release notes live.** The prompt suggested `body:
  'changelog/whats-new.en.html'`, but `build.mjs` read every body as
  `legal/<name>`, so that path would have become `legal/changelog/…`. I made the
  smallest possible change: if a body path contains a `/`, it is used as-is;
  otherwise it still resolves under `legal/`. The four legal pages use bare
  filenames, so nothing about them changed. Requirement 1 explicitly allows
  "extend the resolver minimally and say so" — this is that.
- **Per-language title and description.** The blog pages added a `meta` field to
  a page, but it was a single object. This page is one page in two languages
  that need different titles, so `meta` may now also be a **function of the
  locale**. Pages that pass a plain object are unaffected.
- **Footer label is a literal, no JSON touched.** Requirement 4 offered the
  cheaper option first, and it works: `renderFooterLinks()` in `build.mjs` is
  plain JavaScript, so it just writes "What's new" or, for German,
  "Neuigkeiten". **No `content/*.json` file was changed.** That avoids adding a
  key to 23 files for a page that exists in two languages.
- **The link says which language it goes to.** Every non-German footer link
  carries `hreflang="en" lang="en"`, the same as the Blog link added in prompt
  003. A reader on the Japanese page can see the page is in English before
  clicking.
- **Comment format in the body files.** The prompt asked for a 3-line comment
  stating the contract *and* the exact marker line. I wrote both: a 3-line
  comment describing the format, then the marker line word-for-word as given.

## Verification

```
$ npm run build
content OK · 23 locale(s) · 159 keys each
built 56 pages · 23 locale(s) · 54 sitemap entries
assets: style.0e7f6fe1.css  script.2457bd4f.js
blog: 1 post(s) · /blog/ index · feed.xml
build OK · 56 pages · 52 in hreflang clusters
detector OK · 32 cases · 23 locale(s) built
```

All four steps green. Page count 54 → 56, and the hreflang cluster count 50 → 52
— that is the new en↔de pair and nothing else.

**The hreflang pair is exactly right.** Each page lists `en`, `de` and
`x-default`, and nothing more. `check-build`'s existing reciprocity check
(section 3) confirms they point back at each other.

**Sitemap:** both URLs present at `<priority>0.4</priority>` with the same three
alternates. The `xhtml:link` count went 1116 → 1122, which is exactly 2 pages ×
3 alternates.

**Nothing else moved.** I built the previous commit into a separate folder and
compared: **all 54 existing pages** differ only by the one new footer link.
The only new files are `whats-new.html`, `neuigkeiten.html` and the new CSS.

**Footers:** all 23 locales link to the right language — German to
`/neuigkeiten.html`, the other 22 to `/whats-new.html`.

### The guard, and the three ways I broke it

The guard (section 12) checks two things on both built pages: at least one
`<section class="release">` is there, and the first one on the page is the same
one that is first in the source file.

```
1. Removed {{{ page.legalBody }}} from the template (nothing renders):
   whats-new.html       has no <section class="release"> — the release notes did not reach the page
   neuigkeiten.html     has no <section class="release"> — the release notes did not reach the page

2. Made the build reverse the release blocks (added an older 1.1.0 block first,
   then reversed them on the way to the page):
   whats-new.html       first release block is 'v1-1-0' but changelog/whats-new.en.html
                        starts with 'v1-2-0' — newest-first did not survive the build

3. Replaced the German body with a plain paragraph (off-contract file):
   neuigkeiten.html     has no <section class="release"> — the release notes did not reach the page
```

Everything restored afterwards; the build is clean.

**Note on how I broke it:** my first attempt at test 2 edited the *source* file
to put an old version on top. That did **not** fail, and it should not have —
the guard compares the page against the source, so if both say the same thing
they agree. To test it properly I had to make the *build* reorder the blocks.
That is the real risk the guard covers.

**Browser check.** The Claude Chrome extension is still not connecting, so I
drove the installed Chrome directly for a true 360-pixel-wide phone view and a
real dark-mode check. Both pages: correct heading, correct intro, the 1.2.0
block with a grey date, and **no sideways scrolling**. Screenshots in
`shots/002-*.png`.

Self-correction: none needed — the build was clean on the first run.

## Commit & push

- **Commit:** `842bee2` — `feat(site): what's-new page (en+de) fed by the app changelog`
- **Push:** `origin/main` — ok

## Open items for the owner

- **Run `./deploy.sh` when you want the page live.** I did not run it. Until you
  deploy, the page is built but not visible on daili.app.
- **This turns on requirement 5 of the app repo's `RELEASE-TEMPLATE.md`.** From
  the next release on, the release prompt should paste one new `<section>` block
  at the top of `changelog/whats-new.en.html` and `changelog/whats-new.de.html`.
  The format is written in a comment at the top of both files.
- **Something to fix later, not caused by this change:** on a 360px phone the
  Arabic footer already runs about 60px off the right edge. I measured it at the
  commit *before* any of my three prompts and it was already exactly the same
  60px, so this page did not cause it and did not make it worse — the footer is
  just one line taller now. Worth its own prompt if you want it fixed.

## Deviations from prompt

- **Scope said "Out: `build.mjs` logic", and I changed `build.mjs`.** Two small
  changes, both necessary and both allowed:
  1. the body-path rule (requirement 1 says extend the resolver minimally and
     say so — doing that);
  2. `meta` may be a function of the locale, which requirement 5 needs, because
     the page has a different title and description in each language.
  Neither changes how any existing page is built, and I proved that by diffing
  every page against the previous build.
- **Scope said the footer link goes in `templates/layout.html`; it does not.**
  That file only has `{{{ page.footerLinks }}}`. The footer links are written by
  `renderFooterLinks()` in `build.mjs`, so that is where the link went.
  **`templates/layout.html` was not touched.**
- **The prompt says "24 locales" / "all 24 files"; the site has 23.**
  (`LOCALES` in `site.config.mjs`.) It did not matter here because I added no
  content key at all, but the number in the prompt is off by one.
