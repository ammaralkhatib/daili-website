#!/usr/bin/env node
// Guards the built output. Runs AFTER build.mjs as the third link of
// `npm run build`, so a broken tree never reaches deploy.sh.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { BASE_URL, LOCALES, DEFAULT_LOCALE, PAGES, RTL, dirFor, stores, FEATURES, BLOG_POSTS, BLOG_INDEX, SHOT_LOCALE, WEB_APP_URL, HELP_PUBLIC, LIVE_APP_VERSION, HELP_TOPICS, HELP_ICONS, HELP_LOCALES } from '../site.config.mjs';
import { loadAllHelp, visibleHelp, CHAR_LOCALES } from './help-lib.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DIST = path.join(ROOT, 'dist');
const errors = [];
const fail = (file, msg) => errors.push(`${file.padEnd(34)} ${msg}`);

if (!fs.existsSync(DIST)) { console.error('dist/ does not exist — run the build first'); process.exit(1); }

const htmlFiles = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f);
    else if (e.name.endsWith('.html')) htmlFiles.push(f);
  }
})(DIST);

const rel = (f) => path.relative(DIST, f);
/**
 * Minimal XML well-formedness scan. Node ships no XML parser and this repo has
 * no dependencies on purpose, so rather than pull one in, this checks the
 * things that actually break a feed: an unescaped &, a stray < in text, and
 * elements that do not nest. Returns a list of problems, empty when clean.
 */
function xmlProblems(src) {
  const problems = [];
  const s = src.replace(/^<\?xml[^>]*\?>/, '').replace(/<!--[\s\S]*?-->/g, '');
  const amp = /&(#\d+|#x[0-9a-fA-F]+|[A-Za-z][\w.-]*)?;?/g;
  const badAmps = (text, where) => {
    for (const m of text.matchAll(amp)) {
      if (!m[1] || !m[0].endsWith(';')) problems.push(`unescaped '&' in ${where}`);
    }
  };
  const stack = [];
  const tag = /<(\/?)([A-Za-z_][\w.:-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>/g;
  let last = 0, m;
  while ((m = tag.exec(s))) {
    const text = s.slice(last, m.index);
    if (text.includes('<')) problems.push("unescaped '<' in element text");
    badAmps(text, 'element text');
    last = tag.lastIndex;
    const [, close, name, attrs, selfClose] = m;
    badAmps(attrs, `an attribute of <${name}>`);
    if (close) {
      const open = stack.pop();
      if (open !== name) problems.push(`</${name}> closes ${open ? `<${open}>` : 'nothing'}`);
    } else if (!selfClose) {
      stack.push(name);
    }
  }
  const tail = s.slice(last);
  if (tail.includes('<')) problems.push("unescaped '<' in element text");
  badAmps(tail, 'element text');
  if (stack.length) problems.push(`unclosed element(s): ${stack.map((n) => `<${n}>`).join(', ')}`);
  return [...new Set(problems)];
}

const read = (f) => fs.readFileSync(f, 'utf8');

// --- 1. manifest completeness ----------------------------------------------
const expected = new Set();
for (const pg of PAGES) {
  const locs = pg.locales === 'all' ? LOCALES : pg.locales.filter((l) => LOCALES.includes(l));
  for (const loc of locs) expected.add(pg.out(loc));
}
// Blog pages are expanded out of BLOG_POSTS by build.mjs rather than listed in
// PAGES, so the expected set has to be expanded the same way here.
expected.add('blog/index.html');
for (const post of BLOG_POSTS) expected.add(`blog/${post.slug}/index.html`);
// The help pages, from the same parser and the same since-filter build.mjs
// uses, once per HELP_LOCALES locale under dirFor(loc) + 'help/'.
const helpShown = visibleHelp(loadAllHelp({ root: ROOT, topics: HELP_TOPICS, icons: HELP_ICONS, helpLocales: HELP_LOCALES, locales: LOCALES }).en, LIVE_APP_VERSION);
const helpOutsFor = (loc) => {
  const d = `${dirFor(loc).slice(1)}help/`;
  return [`${d}index.html`,
    ...helpShown.topics.map((t) => `${d}${t}/index.html`),
    ...helpShown.articles.map((a) => `${d}${a.topic}/${a.slug}/index.html`)];
};
const helpOuts = new Set(HELP_LOCALES.flatMap(helpOutsFor));
for (const h of helpOuts) expected.add(h);
for (const e of expected) {
  if (!fs.existsSync(path.join(DIST, e))) fail(e, 'MISSING from dist/');
}
for (const f of htmlFiles) {
  if (!expected.has(rel(f))) fail(rel(f), 'unexpected file in dist/ — a renamed page must not silently vanish');
}
for (const extra of ['sitemap.xml', 'robots.txt', '.htaccess']) {
  if (!fs.existsSync(path.join(DIST, extra))) fail(extra, 'MISSING from dist/');
}
// English lives at the root; an /en/ directory would be a second canonical URL
if (fs.existsSync(path.join(DIST, 'en'))) fail('en/', 'exists — English is served from the root, there must be no /en/');

// --- 2. internal links resolve ---------------------------------------------
for (const f of htmlFiles) {
  const html = read(f);
  const refs = [...html.matchAll(/(?:href|src)="(\/[^"#?]*)"/g)].map((m) => m[1]);
  for (const r of new Set(refs)) {
    let target = path.join(DIST, r);
    if (r.endsWith('/')) target = path.join(target, 'index.html');
    if (!fs.existsSync(target)) fail(rel(f), `broken internal link -> ${r}`);
  }
}

// --- 3. hreflang reciprocity -----------------------------------------------
const alternates = new Map(); // url -> Set(url)
const xdefault = new Map();   // url -> url
for (const f of htmlFiles) {
  const html = read(f);
  const url = BASE_URL + '/' + rel(f).replace(/index\.html$/, '').replace(/^index\.html$/, '');
  const links = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)];
  if (!links.length) continue;
  const set = new Set();
  for (const [, lang, href] of links) {
    if (lang === 'x-default') { xdefault.set(url, href); continue; }
    set.add(href);
  }
  alternates.set(url, set);
  if (!set.has(url)) fail(rel(f), `hreflang set does not include itself (${url}) — Google requires a self-reference`);
  if (!xdefault.has(url)) fail(rel(f), 'has hreflang alternates but no x-default');
}
for (const [url, set] of alternates) {
  for (const other of set) {
    if (other === url) continue;
    const back = alternates.get(other);
    if (!back) { fail(url, `points at ${other} which declares no alternates — "no return tag"`); continue; }
    if (!back.has(url)) fail(url, `points at ${other} but ${other} does not point back — "no return tag"`);
  }
}

// --- 4. canonical -----------------------------------------------------------
for (const f of htmlFiles) {
  const html = read(f);
  const cs = [...html.matchAll(/<link rel="canonical" href="([^"]+)">/g)];
  if (cs.length !== 1) { fail(rel(f), `has ${cs.length} canonical links, expected exactly 1`); continue; }
  const want = BASE_URL + '/' + rel(f).replace(/(^|\/)index\.html$/, '$1');
  if (cs[0][1] !== want) fail(rel(f), `canonical is ${cs[0][1]}, expected ${want}`);
}

// --- 5. <html lang> matches the directory ----------------------------------
for (const f of htmlFiles) {
  const r = rel(f);
  const seg = r.includes('/') ? r.split('/')[0] : null;
  const expectLoc = seg ? LOCALES.find((l) => l.toLowerCase() === seg) : null;
  const m = read(f).match(/<html lang="([^"]+)"/);
  if (!m) { fail(r, 'no <html lang>'); continue; }
  if (seg && expectLoc && m[1] !== expectLoc) fail(r, `<html lang="${m[1]}"> but lives in /${seg}/`);
  if (!seg && !['en', 'de'].includes(m[1]) && !LOCALES.includes(m[1])) fail(r, `<html lang="${m[1]}"> at the root`);
}

// --- 6. RTL scoping ---------------------------------------------------------
for (const f of htmlFiles) {
  const r = rel(f);
  const isRtlDir = [...RTL].some((l) => r.startsWith(`${l.toLowerCase()}/`));
  const hasRtl = /<html [^>]*dir="rtl"/.test(read(f));
  if (isRtlDir && !hasRtl) fail(r, 'is an RTL locale but has no dir="rtl"');
  if (!isRtlDir && hasRtl) fail(r, 'has dir="rtl" but is not an RTL locale');
}

// --- 7. detector scoping ----------------------------------------------------
const withDetector = htmlFiles.filter((f) => read(f).includes('DAILI-LANG-DETECTOR')).map(rel);
if (withDetector.length !== 1 || withDetector[0] !== 'index.html') {
  fail('(detector)', `must appear in exactly index.html, found in: ${withDetector.join(', ') || 'nothing'} — anywhere else risks a redirect loop`);
}

// --- 7b. the CSP hash actually matches the inline detector -------------------
// If these drift, the browser silently refuses to run the detector and language
// detection just stops working, with nothing in the page to say why.
{
  const idx = path.join(DIST, 'index.html');
  const ht = path.join(DIST, '.htaccess');
  if (fs.existsSync(idx) && fs.existsSync(ht)) {
    const m = read(idx).match(/<script>(\/\* DAILI-LANG-DETECTOR \*\/[\s\S]*?)<\/script>/);
    const declared = (read(ht).match(/sha256-[A-Za-z0-9+/=]+/) || [null])[0];
    if (!m) fail('index.html', 'no inline detector script found');
    else {
      const actual = 'sha256-' + crypto.createHash('sha256').update(m[1]).digest('base64');
      if (actual !== declared) {
        fail('.htaccess', `CSP script hash ${declared} does not match the inline detector (${actual}) — the browser would block it`);
      }
    }
  }
}

// --- 8. no unrendered template tags ----------------------------------------
for (const f of [...htmlFiles, path.join(DIST, 'sitemap.xml')]) {
  if (!fs.existsSync(f)) continue;
  const html = read(f);
  // JSON-LD legitimately contains }} at the end of nested objects, so only look
  // for the opening form, which the engine would always have consumed.
  if (html.includes('{{')) fail(rel(f), 'contains an unrendered {{ tag');
}

// --- 9. no forbidden strings in output -------------------------------------
for (const f of htmlFiles) {
  if (/famcanvas/i.test(read(f))) fail(rel(f), 'contains "FamCanvas"');
}

// --- 10. store availability matches the built output ------------------------
// The App Store listing is not public (site.config.mjs: stores.ios.available).
// A dead link in a badge is worse than no badge, so the URL must not survive
// into dist/ AT ALL — not in the HTML, not in the hashed JS or CSS, not in the
// JSON-LD. Files are read as buffers so this covers every artefact, whatever
// its type. The `available: true` arm is not decoration: without it this
// section would quietly pass forever once the flag flips back, which is
// exactly when you want it checking again.
{
  const APPLE = 'apps.apple.com';
  const allFiles = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) walk(f); else allFiles.push(f);
    }
  })(DIST);

  if (stores.ios.available === false) {
    for (const f of allFiles) {
      if (fs.readFileSync(f).includes(APPLE)) {
        fail(rel(f), `contains ${APPLE} but stores.ios.available is false — that URL 404s, and the badge is supposed to render as a non-link "coming soon" chip`);
      }
    }
  } else {
    const landing = PAGES.find((pg) => pg.id === 'landing');
    const locs = landing.locales === 'all' ? LOCALES : landing.locales.filter((l) => LOCALES.includes(l));
    for (const loc of locs) {
      const f = path.join(DIST, landing.out(loc));
      if (!fs.existsSync(f)) continue; // section 1 already reported it
      // Specifically as an href: the same URL also appears in the JSON-LD
      // installUrl, and a bare substring check would be satisfied by that
      // while the visible badge was still an inert "coming soon" chip.
      if (!read(f).includes(`href="${stores.ios.url}"`)) {
        fail(landing.out(loc), `has no href="${stores.ios.url}" but stores.ios.available is true — the App Store badge is not linking anywhere`);
      }
    }
  }
}

// --- 11. blog ---------------------------------------------------------------
// The blog is English-only and deliberately outside every hreflang cluster.
// Check 4 below is what keeps it there: if a refactor ever gives blog pages a
// `cluster`, they emit alternates pointing at 23 landing pages that never point
// back, and Search Console starts reporting "no return tag" across the site.
// None of that is visible in a browser, so it has to be visible here.
{
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const landingDesc = (() => {
    const f = path.join(DIST, 'index.html');
    if (!fs.existsSync(f)) return null;
    const m = read(f).match(/<meta name="description" content="([^"]*)">/);
    return m ? m[1] : null;
  })();

  const sitemapPath = path.join(DIST, 'sitemap.xml');
  const sitemap = fs.existsSync(sitemapPath) ? read(sitemapPath) : '';

  // 8. no two posts share a slug — two posts writing to one URL means the
  // second silently overwrites the first, and neither the build nor section 1
  // would say a word.
  const slugAt = new Map();
  for (const [i, post] of BLOG_POSTS.entries()) {
    if (slugAt.has(post.slug)) {
      fail('site.config.mjs', `BLOG_POSTS[${i}] repeats the slug '${post.slug}' from BLOG_POSTS[${slugAt.get(post.slug)}] — two posts cannot share a URL`);
    } else {
      slugAt.set(post.slug, i);
    }
  }

  for (const post of BLOG_POSTS) {
    const out = `blog/${post.slug}/index.html`;
    const file = path.join(DIST, out);
    if (!fs.existsSync(file)) continue; // section 1 already reported it
    const html = read(file);
    // The visible page, with the JSON-LD removed. Every "is it on the page"
    // check below runs against this: searching the whole file would be
    // satisfied by the machine-readable copy of the very same string.
    const visible = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');

    // 1. exactly one <h1>
    const h1s = (html.match(/<h1[\s>]/g) || []).length;
    if (h1s !== 1) fail(out, `${post.slug}: has ${h1s} <h1> elements, expected exactly 1`);

    // 2. canonical is the post's own URL
    const wantCanonical = `${BASE_URL}/blog/${post.slug}/`;
    const canonical = (html.match(/<link rel="canonical" href="([^"]+)">/) || [])[1];
    if (canonical !== wantCanonical) {
      fail(out, `${post.slug}: canonical is ${canonical || '(none)'}, expected ${wantCanonical}`);
    }

    // 3. its own description, not the landing page's. A meta override that
    // silently stops applying leaves a valid-looking page describing the app.
    const desc = (html.match(/<meta name="description" content="([^"]*)">/) || [])[1];
    if (!desc) fail(out, `${post.slug}: has no <meta name="description">`);
    else if (desc === landingDesc) {
      fail(out, `${post.slug}: description is the landing page's — the per-page meta override is not applying`);
    } else if (desc !== esc(post.description)) {
      fail(out, `${post.slug}: description does not match the post's own description in BLOG_POSTS`);
    }

    // 4. no hreflang declarations, at all. See the note at the top of this
    // section. Scoped to the <head>, because that is where an hreflang set is
    // declared and where the damage is done. The hreflang= attributes lower
    // down are on <a> tags — the language picker's, and the nav and footer
    // links to /blog/ — an advisory hint about the language of a linked page,
    // which forms no cluster and asks for no return tag.
    //
    // The second assertion is about alternates that carry an hreflang, not
    // alternates as such: RSS autodiscovery is a <link rel="alternate"> too,
    // and it belongs on this page. Narrowing it that way keeps the guard on
    // the only kind of alternate that can join an hreflang cluster.
    const head = html.slice(0, html.indexOf('</head>'));
    const hreflangs = (head.match(/hreflang=/g) || []).length;
    if (hreflangs !== 0) {
      fail(out, `${post.slug}: <head> carries ${hreflangs} hreflang= declaration(s) — the blog is English-only and must claim no alternates`);
    }
    const alternates = (html.match(/<link rel="alternate"[^>]*hreflang=/g) || []).length;
    if (alternates !== 0) {
      fail(out, `${post.slug}: carries ${alternates} <link rel="alternate" … hreflang=> — a blog page must never join an hreflang cluster`);
    }

    // 5. article-shaped Open Graph, with the post's own hero image
    const ogType = (html.match(/<meta property="og:type" content="([^"]*)">/) || [])[1];
    if (ogType !== 'article') fail(out, `${post.slug}: og:type is '${ogType || '(none)'}', expected 'article'`);
    const ogImage = (html.match(/<meta property="og:image" content="([^"]*)">/) || [])[1];
    const wantOgImage = BASE_URL + post.image;
    if (ogImage !== wantOgImage) {
      fail(out, `${post.slug}: og:image is ${ogImage || '(none)'}, expected the post's hero ${wantOgImage}`);
    }

    // 6. every FAQ question is BOTH visible on the page and in the FAQPage
    // JSON-LD — parsed, not substring-matched, so a page carrying only the
    // visible copy cannot pass.
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    let faqLd = null;
    for (const [, raw] of blocks) {
      let obj;
      try { obj = JSON.parse(raw); } catch { fail(out, `${post.slug}: a JSON-LD block does not parse`); continue; }
      if (obj['@type'] === 'FAQPage') faqLd = obj;
    }
    if (!faqLd) fail(out, `${post.slug}: has no FAQPage JSON-LD block`);
    const ldQuestions = new Set((faqLd?.mainEntity || []).map((q) => q.name));
    for (const item of post.faq) {
      if (!visible.includes(esc(item.q))) {
        fail(out, `${post.slug}: FAQ question "${item.q}" is in BLOG_POSTS but not in the visible page`);
      }
      if (faqLd && !ldQuestions.has(item.q)) {
        fail(out, `${post.slug}: FAQ question "${item.q}" is visible on the page but missing from the FAQPage JSON-LD — Google requires the two to match`);
      }
    }

    // 10. a post that declares `itemList` carries an ItemList block, and every
    // name in it is on the visible page. build.mjs derives the names from the
    // rendered body, so this is not checking a copy against a copy — it is
    // checking that the derivation still finds the list. Rename the class on
    // the <ol>, or drop the <strong>, and the markup would quietly describe a
    // shorter list than the page shows; that is the failure this catches.
    if (post.itemList) {
      let itemLd = null;
      for (const [, raw] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
        let obj;
        try { obj = JSON.parse(raw); } catch { continue; } // check 6 already reported it
        if (obj['@type'] === 'ItemList') itemLd = obj;
      }
      if (!itemLd) {
        fail(out, `${post.slug}: declares itemList in BLOG_POSTS but the page has no ItemList JSON-LD block`);
      } else {
        const els = itemLd.itemListElement || [];
        if (els.length !== itemLd.numberOfItems) {
          fail(out, `${post.slug}: ItemList says numberOfItems ${itemLd.numberOfItems} but carries ${els.length} items`);
        }
        els.forEach((el, i) => {
          if (el.position !== i + 1) {
            fail(out, `${post.slug}: ItemList item ${i + 1} has position ${el.position} — the positions must run 1..n in order`);
          }
          if (!visible.includes(esc(el.name))) {
            fail(out, `${post.slug}: ItemList names "${el.name}", which is not on the visible page`);
          }
        });
      }
    }

    // 7. the hero image is a real file, and the page actually points at it
    const src = path.join(ROOT, 'static', post.image.replace(/^\//, ''));
    if (!fs.existsSync(src)) {
      fail(out, `${post.slug}: hero image ${post.image} does not exist in static/ — a post whose hero 404s must not ship`);
    }
    if (!html.includes(`src="${post.image}"`)) {
      fail(out, `${post.slug}: page does not reference its hero image ${post.image}`);
    }

    // 9. in the sitemap, with no alternates — the mirror of check 4
    const at = sitemap.indexOf(`<loc>${wantCanonical}</loc>`);
    const entry = at < 0 ? null
      : sitemap.slice(sitemap.lastIndexOf('<url>', at), sitemap.indexOf('</url>', at));
    if (!entry) fail('sitemap.xml', `${post.slug}: ${wantCanonical} is missing from the sitemap`);
    else if (entry.includes('xhtml:link')) {
      fail('sitemap.xml', `${post.slug}: sitemap entry carries xhtml:link alternates — the blog has no translations`);
    }
  }
}

// --- 11b. blog front door: index, nav link, feed --------------------------
{
  const INDEX_OUT = 'blog/index.html';
  const indexFile = path.join(DIST, INDEX_OUT);
  const indexHtml = fs.existsSync(indexFile) ? read(indexFile) : null;
  const feedRel = 'blog/feed.xml';
  const feedFile = path.join(DIST, feedRel);
  const feed = fs.existsSync(feedFile) ? read(feedFile) : null;
  const sitemapPath = path.join(DIST, 'sitemap.xml');
  const sitemap = fs.existsSync(sitemapPath) ? read(sitemapPath) : '';

  // 10. the index links to every post there is. A post that builds but is
  // listed nowhere is a post nobody will read.
  if (!indexHtml) fail(INDEX_OUT, 'MISSING — the blog index did not build');
  else {
    for (const post of BLOG_POSTS) {
      if (!indexHtml.includes(`href="/blog/${post.slug}/"`)) {
        fail(INDEX_OUT, `does not link to /blog/${post.slug}/ — every post in BLOG_POSTS must be listed on the index`);
      }
    }
  }

  // 11. every landing page carries the Blog link in its nav, exactly once, and
  // says the target is English. 23 locales, so a template edit that only works
  // in English gets caught here rather than by a reader in Arabic.
  {
    const landing = PAGES.find((pg) => pg.id === 'landing');
    const locs = landing.locales === 'all' ? LOCALES : landing.locales.filter((l) => LOCALES.includes(l));
    for (const loc of locs) {
      const out = landing.out(loc);
      const file = path.join(DIST, out);
      if (!fs.existsSync(file)) continue; // section 1 already reported it
      const html = read(file);
      const nav = (html.match(/<nav class="links">[\s\S]*?<\/nav>/) || [])[0];
      if (!nav) { fail(out, 'has no <nav class="links"> — cannot check the Blog link'); continue; }
      const links = [...nav.matchAll(/<a\b[^>]*href="\/blog\/"[^>]*>/g)].map((m) => m[0]);
      if (links.length !== 1) {
        fail(out, `nav has ${links.length} links to /blog/, expected exactly 1`);
      } else if (!/hreflang="en"/.test(links[0])) {
        fail(out, 'nav Blog link has no hreflang="en" — the blog is English whatever locale links to it');
      }
    }
  }

  // 12. the feed is well-formed, complete, and shaped the way a reader expects
  if (!feed) fail(feedRel, 'MISSING from dist/');
  else {
    for (const p of xmlProblems(feed)) fail(feedRel, `is not well-formed XML: ${p}`);

    const items = [...feed.matchAll(/<item>[\s\S]*?<\/item>/g)].map((m) => m[0]);
    if (items.length !== BLOG_POSTS.length) {
      fail(feedRel, `has ${items.length} <item> element(s), expected ${BLOG_POSTS.length} — one per post in BLOG_POSTS`);
    }
    // RFC 822, not ISO 8601. A feed dated "2026-09-02" sorts to the bottom of
    // every reader that manages to parse it at all.
    const RFC822 = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), \d{2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4} \d{2}:\d{2}:\d{2} (GMT|[+-]\d{4})$/;
    const dates = [...feed.matchAll(/<(?:pubDate|lastBuildDate)>([^<]*)<\/(?:pubDate|lastBuildDate)>/g)];
    if (!dates.length) fail(feedRel, 'has no <pubDate> at all');
    for (const [, d] of dates) {
      if (!RFC822.test(d)) fail(feedRel, `date "${d}" is not RFC 822 (want e.g. "Wed, 02 Sep 2026 00:00:00 GMT")`);
    }
    for (const [, href] of feed.matchAll(/<link>([^<]*)<\/link>/g)) {
      if (!href.startsWith(`${BASE_URL}/`)) {
        fail(feedRel, `<link>${href}</link> is not an absolute ${BASE_URL} URL — a feed is read away from the site, so relative links resolve nowhere`);
      }
    }
  }

  // 13. the feed is not a page, and the index is
  if (sitemap.includes('feed.xml')) {
    fail('sitemap.xml', 'lists blog/feed.xml — a feed is not a page and must not be submitted as one');
  }
  if (!sitemap.includes(`<loc>${BASE_URL}/blog/</loc>`)) {
    fail('sitemap.xml', `does not list ${BASE_URL}/blog/ — the index is a page and belongs in the sitemap`);
  }

  // 14. autodiscovery on the blog and nowhere else. On the wrong page it tells
  // a reader that /support.html has a feed, which it does not.
  {
    const wantsFeed = new Set([INDEX_OUT, ...BLOG_POSTS.map((p) => `blog/${p.slug}/index.html`)]);
    for (const f of htmlFiles) {
      const r = rel(f);
      const has = /<link rel="alternate" type="application\/rss\+xml"/.test(read(f));
      if (wantsFeed.has(r) && !has) fail(r, 'has no RSS autodiscovery link — every blog page must advertise the feed');
      if (!wantsFeed.has(r) && has) fail(r, 'has an RSS autodiscovery link but is not a blog page — it advertises a feed that does not cover it');
    }
  }
}

// --- 12. what's new -------------------------------------------------------
// The release notes are prepended to by a release prompt, one <section> at a
// time, and nothing else in the build looks at that file. These two checks are
// what stand between "the prompt prepended a block" and "the block is on the
// page, at the top". Newest-first is the whole contract: a release note that
// silently renders second is worse than one that fails to render at all.
{
  const wn = PAGES.find((pg) => pg.id === 'whats-new');
  if (!wn) fail('site.config.mjs', "no PAGES entry with id 'whats-new'");
  else {
    const firstId = (html) => (html.match(/<section class="release" id="([^"]+)"/) || [])[1];
    for (const loc of wn.locales) {
      const out = wn.out(loc);
      const file = path.join(DIST, out);
      if (!fs.existsSync(file)) continue; // section 1 already reported it
      const html = read(file);

      const n = (html.match(/<section class="release"/g) || []).length;
      if (n < 1) {
        fail(out, 'has no <section class="release"> — the release notes did not reach the page');
        continue;
      }
      const src = path.join(ROOT, wn.body[loc]);
      if (!fs.existsSync(src)) { fail(out, `source body ${wn.body[loc]} does not exist`); continue; }
      const want = firstId(read(src));
      const got = firstId(html);
      if (!want) fail(wn.body[loc], 'has no <section class="release" id="…"> — the body file is empty or off-contract');
      else if (got !== want) {
        fail(out, `first release block is '${got}' but ${wn.body[loc]} starts with '${want}' — newest-first did not survive the build`);
      }
    }
  }
}

// --- 13. the brand fonts are ours ------------------------------------------
// Self-hosting the two fonts is a privacy promise, not a performance tweak:
// this site has no analytics and no cookie banner, and a <link> to Google would
// hand every reader's IP address to a third party on every page view anyway.
// It is also a one-line regression — a stray @import, a copied snippet from the
// mock, a "quick fix" for a missing weight — so it is checked rather than
// trusted. Two halves: every @font-face the pages actually load points at a
// file that is really in dist/assets/fonts/, and nothing in the built tree
// mentions Google Fonts at all.
{
  const GOOGLE = ['fonts.googleapis.com', 'fonts.gstatic.com'];
  const checked = new Set();

  for (const f of htmlFiles) {
    const href = (read(f).match(/<link rel="stylesheet" href="([^"]+)">/) || [])[1];
    if (!href) { fail(rel(f), 'has no stylesheet <link> — cannot verify the fonts are self-hosted'); continue; }
    if (!href.startsWith('/')) { fail(rel(f), `stylesheet href "${href}" is not site-absolute`); continue; }
    const cssPath = path.join(DIST, href.slice(1));
    if (!fs.existsSync(cssPath)) { fail(rel(f), `stylesheet ${href} does not exist in dist/`); continue; }
    if (checked.has(cssPath)) continue;   // one hashed stylesheet, 40-odd pages
    checked.add(cssPath);

    const where = rel(cssPath);
    const faces = read(cssPath).match(/@font-face[^{]*\{[^}]*\}/g) || [];
    if (!faces.length) { fail(where, 'declares no @font-face — the brand fonts did not reach the build'); continue; }
    for (const face of faces) {
      const urls = [...face.matchAll(/url\(\s*['"]?([^'")\s]+)['"]?\s*\)/g)].map((m) => m[1]);
      if (!urls.length) { fail(where, '@font-face has no src url()'); continue; }
      for (const u of urls) {
        if (!u.startsWith('/assets/fonts/')) {
          fail(where, `@font-face src "${u}" is not under /assets/fonts/ — the brand fonts are self-hosted, never fetched from anywhere else`);
        } else if (!fs.existsSync(path.join(DIST, u.slice(1)))) {
          fail(where, `@font-face src "${u}" does not exist in dist/ — the face is declared but the file was never copied`);
        }
      }
    }
  }

  // Buffers, so this covers the HTML, the hashed CSS and JS, the sitemap and
  // anything else a future step writes.
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) { walk(f); continue; }
      const buf = fs.readFileSync(f);
      for (const host of GOOGLE) {
        if (buf.includes(host)) fail(rel(f), `references ${host} — the fonts are served from /assets/fonts/, and the CSP is font-src 'self'`);
      }
    }
  })(DIST);
}

// --- 14. the screenshots are the reader's language --------------------------
// The whole point of shots/<loc>/ is that /de/ shows German screenshots. That
// is invisible in a diff and invisible in a build log — the wrong set still
// renders a perfectly valid page — so it is asserted here from both sides:
// a locale that HAS its own capture set must actually use it, and a locale that
// does not must show English and nothing else. Without the second half, a typo
// in SHOT_LOCALE that points ja at a folder of German screenshots would ship.
//
// shot-recipes, shot-photos and shot-documents are English everywhere (no demo
// capture exists yet), which is why the first half asks for "at least one".
for (const loc of LOCALES) {
  const file = path.join(DIST, dirFor(loc).slice(1), 'index.html');
  if (!fs.existsSync(file)) continue;            // section 1 already reported it
  const out = rel(file);
  const dirs = new Set([...read(file).matchAll(/\/assets\/img\/shots\/([\w-]+)\//g)].map((m) => m[1]));
  if (!dirs.size) { fail(out, 'references no /assets/img/shots/ file — the screenshots vanished'); continue; }
  const own = loc in SHOT_LOCALE;
  const stray = [...dirs].filter((d) => d !== DEFAULT_LOCALE && d !== (own ? loc : null));
  if (stray.length) {
    fail(out, `shows screenshots from shots/${stray.join('/, shots/')}/ — a ${loc} page may only use shots/${own ? `${loc}/ or shots/` : ''}${DEFAULT_LOCALE}/`);
  }
  if (own && !dirs.has(loc)) {
    fail(out, `SHOT_LOCALE maps ${loc} to '${SHOT_LOCALE[loc]}' but the page uses no shots/${loc}/ file — the set was never generated, or the resolver fell back silently`);
  }
}

// --- 15. the landing page is the page the mock describes --------------------
// The home page is the scroll story: six blocks in a fixed order, and the first
// of them is assembled from three lists that must stay in step — one chapter,
// one screenshot and one group of three cards per FEATURES entry, plus the hero.
// Nothing else in the pipeline notices if they fall out of step: a story with
// seven chapters and eight screens still validates, still carries every content
// key and still builds clean in all 28 locales — the phone simply shows the
// wrong screen from chapter three onwards, which no content check can see.
//
// So the shape is asserted here, on all 28 built pages:
//   - the six blocks exist, in the mock's order;
//   - the story has exactly FEATURES.length + 1 chapters, the same number of
//     screens and of card groups, and every group has exactly three cards;
//   - the web slide exists once and actually links to the web app. The header,
//     the hero and one FAQ answer all mention app.daili.app too, so the link is
//     looked for INSIDE that slide;
//   - the footer is inside the last slide. With `scroll-snap-type: y mandatory`
//     a footer after </main> is a snap target that cannot be reached;
//   - nothing is left of the bento grid the story replaced.
{
  const landing = PAGES.find((pg) => pg.id === 'landing');
  const locs = landing.locales === 'all' ? LOCALES : landing.locales.filter((l) => LOCALES.includes(l));
  // In DOM order, as the mock lays them out.
  const BLOCKS = [
    ['story', '<section class="story"'],
    ['web app', 'id="web"'],
    ['steps', 'id="how"'],
    ['comparison', 'id="compare"'],
    ['pricing', 'id="pricing"'],
    ['faq', 'id="faq"'],
  ];
  const count = (s, needle) => s.split(needle).length - 1;

  for (const loc of locs) {
    const file = path.join(DIST, landing.out(loc));
    if (!fs.existsSync(file)) continue;          // section 1 already reported it
    const out = rel(file);
    const html = read(file);

    let at = -1;
    for (const [name, needle] of BLOCKS) {
      const i = html.indexOf(needle, at + 1);
      if (i === -1) { fail(out, `has no ${name} block (${needle}) — the landing page is missing a section`); break; }
      if (i < at) { fail(out, `${name} block (${needle}) is out of order — the sections must follow the mock: ${BLOCKS.map((b) => b[0]).join(' → ')}`); break; }
      at = i;
    }

    // The three lists that have to agree: chapters, screens, card groups.
    const want = FEATURES.length + 1;            // the seven features plus the hero
    const chapters = count(html, 'data-chapter="');
    if (chapters !== want) {
      fail(out, `has ${chapters} story chapters, expected ${want} (FEATURES + the hero) — a chapter was dropped`);
    }
    const storyFrom = html.indexOf('<section class="story"');
    const storyTo = html.indexOf('</section>', storyFrom);
    const storyHtml = storyFrom === -1 ? '' : html.slice(storyFrom, storyTo);
    // `--k` is the stack position, and only the eight images inside the sticky
    // phone carry it — the per-chapter copies shown on a phone do not.
    const screens = count(storyHtml, 'style="--k:');
    if (screens !== want) {
      fail(out, `has ${screens} phone screenshots in the story stage, expected ${want} — the phone and the chapters are out of step`);
    }
    const groups = storyHtml.split('<div class="floats"').slice(1);
    if (groups.length !== want) {
      fail(out, `has ${groups.length} groups of floating cards, expected ${want} — one per chapter`);
    }
    // Each split segment runs to the next group, so the cards it contains are
    // its own. The last one also holds the progress dots, which are not cards.
    groups.forEach((group, i) => {
      const cards = count(group, '<div class="fc');
      if (cards !== 3) fail(out, `floats group ${i} has ${cards} cards, expected 3 from story.cards`);
    });

    const webFrom = html.indexOf('id="web"');
    if (webFrom !== -1) {
      const webTo = html.indexOf('</section>', webFrom);
      if (!html.slice(webFrom, webTo).includes(`href="${WEB_APP_URL}"`)) {
        fail(out, `the web slide does not link to ${WEB_APP_URL} — that link is the only reason the slide exists`);
      }
    }

    const faqFrom = html.indexOf('id="faq"');
    const footerAt = html.indexOf('<footer>');
    if (faqFrom !== -1 && !(footerAt > faqFrom && footerAt < html.lastIndexOf('</main>'))) {
      fail(out, 'the footer is not inside the last slide — with mandatory scroll-snap a footer after </main> can never be scrolled to');
    }

    for (const dead of ['class="bento"', 'class="tile"']) {
      if (html.includes(dead)) fail(out, `still contains ${dead} — the bento grid was replaced by the story`);
    }
  }
}

// --- 16. help center ------------------------------------------------------
// The help pages exist in the HELP_LOCALES locales. With English alone they
// follow the blog's rule — no hreflang in the <head>, ever; with more, each
// page carries exactly the help cluster (every help locale + x-default), and
// section 3 checks the return tags. Plus the HELP_PUBLIC switch: while it is
// false every page is noindex, none is in the sitemap and no footer links to
// /help/. And the one inline <script> a help page may carry is the search
// index, which must be data (type="application/json"), never code: the CSP
// allows exactly one inline script hash, the language detector's.
{
  const sitemapPath = path.join(DIST, 'sitemap.xml');
  const sitemap = fs.existsSync(sitemapPath) ? read(sitemapPath) : '';
  // A noindex page claims no alternates (renderHead), so the preview has none.
  const wantHreflang = HELP_PUBLIC && HELP_LOCALES.length > 1 ? HELP_LOCALES.length + 1 : 0;
  const helpOutLoc = new Map(HELP_LOCALES.flatMap((l) => helpOutsFor(l).map((o) => [o, l])));
  for (const out of helpOuts) {
    const file = path.join(DIST, out);
    if (!fs.existsSync(file)) continue; // section 1 already reported it
    const html = read(file);
    const head = html.slice(0, html.indexOf('</head>'));
    const n = (head.match(/hreflang=/g) || []).length;
    if (n !== wantHreflang) {
      fail(out, `<head> carries ${n} hreflang= declaration(s), expected ${wantHreflang} — ${wantHreflang ? 'one per HELP_LOCALES locale plus x-default' : 'English alone claims no alternates'}`);
    }
    const loc = helpOutLoc.get(out);
    if (!html.includes(`<html lang="${loc}"`)) fail(out, `is a ${loc} help page without <html lang="${loc}"`);
    const noindex = head.includes('<meta name="robots" content="noindex">');
    if (!HELP_PUBLIC && !noindex) fail(out, 'has no noindex, but HELP_PUBLIC is false — the preview must not be indexed');
    if (HELP_PUBLIC && noindex) fail(out, 'is noindex, but HELP_PUBLIC is true');
    const url = `${BASE_URL}/${out.replace(/index\.html$/, '')}`;
    const inMap = sitemap.includes(`<loc>${url}</loc>`);
    if (!HELP_PUBLIC && inMap) fail('sitemap.xml', `lists ${url} while HELP_PUBLIC is false`);
    if (HELP_PUBLIC && !inMap) fail('sitemap.xml', `does not list ${url} although HELP_PUBLIC is true`);
    for (const [tag] of html.matchAll(/<script\b[^>]*>/g)) {
      if (!/\ssrc="/.test(tag) && !/type="application\/(ld\+)?json"/.test(tag)) {
        fail(out, `has an inline executable ${tag} — the CSP would block it`);
      }
    }
  }
  if (!HELP_PUBLIC) {
    for (const f of htmlFiles) {
      if (/<footer>[\s\S]*href="(\/[a-z-]+)?\/help\/"/.test(read(f))) fail(rel(f), 'footer links to the help while HELP_PUBLIC is false');
    }
  } else {
    // Each locale's landing page footer: its own help if it has one, else the
    // English help marked as English.
    for (const loc of LOCALES) {
      const out = `${dirFor(loc).slice(1)}index.html`;
      if (!fs.existsSync(path.join(DIST, out))) continue;
      const footer = read(path.join(DIST, out)).split('<footer>')[1] || '';
      const want = HELP_LOCALES.includes(loc) && loc !== DEFAULT_LOCALE
        ? `<a href="${dirFor(loc)}help/">`
        : '<a href="/help/" hreflang="en" lang="en">';
      if (!footer.includes(want)) fail(out, `footer has no Help link ${want}`);
    }
  }

  // The search script's no-spaces list is help-lib's CHAR_LOCALES.
  const helpSrc = read(path.join(ROOT, 'static/assets/help-search.js'));
  const noSpaces = (helpSrc.match(/NO_SPACES = \[([^\]]*)\]/) || [, ''])[1].match(/"[^"]+"/g)?.map((s) => s.slice(1, -1)).sort().join(',');
  if (noSpaces !== Object.keys(CHAR_LOCALES).sort().join(',')) {
    fail('assets/help-search.js', `NO_SPACES (${noSpaces}) is not help-lib CHAR_LOCALES (${Object.keys(CHAR_LOCALES).join(',')})`);
  }

  // The help counts: the shipped script posts to the real endpoint (a
  // HELP_EVENTS_URL test build must never pass), and the CSP lets it.
  const helpJsFiles = fs.readdirSync(path.join(DIST, 'assets')).filter((f) => /^help-search\.[0-9a-f]{8}\.js$/.test(f));
  if (helpJsFiles.length !== 1) fail('assets/', `expected one hashed help-search.*.js, found ${helpJsFiles.length}`);
  else if (!read(path.join(DIST, 'assets', helpJsFiles[0])).includes('"https://api.daili.app/v1/help/events"')) {
    fail(`assets/${helpJsFiles[0]}`, 'does not post to https://api.daili.app/v1/help/events — a HELP_EVENTS_URL test build must not ship');
  }
  const htFile = path.join(DIST, '.htaccess');
  if (fs.existsSync(htFile) && !/connect-src https:\/\/api\.daili\.app;/.test(read(htFile))) {
    fail('.htaccess', "CSP connect-src is not exactly https://api.daili.app — the help counts would be blocked, or more is allowed than needed");
  }

  // help/<locale>.json: parses, is shaped for the app, and every image has a
  // cache-buster and is the locale's own picture or the English one.
  let enShape = null;
  for (const loc of HELP_LOCALES) {
    const jsonRel = `help/${loc}.json`;
    const jsonFile = path.join(DIST, jsonRel);
    if (!fs.existsSync(jsonFile)) { fail(jsonRel, 'MISSING — the app reads this file'); continue; }
    let j = null;
    try { j = JSON.parse(read(jsonFile)); } catch (e) { fail(jsonRel, `does not parse: ${e.message}`); }
    if (!j) continue;
    if (j.schema !== 1 || j.locale !== loc) fail(jsonRel, `schema/locale is ${j.schema}/${j.locale}, expected 1/${loc}`);
    for (const k of ['topics', 'articles', 'tips', 'checklist']) if (!Array.isArray(j[k])) fail(jsonRel, `"${k}" is not an array`);
    const ids = new Set((j.articles || []).map((a) => a.id));
    for (const t of j.topics || []) for (const id of t.articles) if (!ids.has(id)) fail(jsonRel, `topic ${t.id} lists unknown article ${id}`);
    const src = new RegExp(`^https://daili\\.app/help/media/(en|${loc})/[^?]+\\?v=[0-9a-f]{8}$`);
    for (const a of j.articles || []) {
      for (const b of a.blocks) {
        if ((b.type === 'image' || b.type === 'clip') && !src.test(b.src)) {
          fail(jsonRel, `${a.id}: image src "${b.src}" is not an absolute help media URL (en or ${loc}) with ?v=`);
        }
      }
    }
    // Every locale carries the same articles, tips and checklist rows as English.
    const shape = (x) => JSON.stringify([(x.articles || []).map((a) => a.id), (x.tips || []).map((t) => t.id), (x.checklist || []).map((c) => c.article)]);
    if (loc === 'en') enShape = shape(j);
    else if (enShape !== null && shape(j) !== enShape) fail(jsonRel, 'does not have the same articles, tips and checklist rows as help/en.json');
  }
}

if (errors.length) {
  console.error(`\n${errors.length} build error(s):`);
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`build OK · ${htmlFiles.length} pages · ${alternates.size} in hreflang clusters`);
