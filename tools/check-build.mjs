#!/usr/bin/env node
// Guards the built output. Runs AFTER build.mjs as the third link of
// `npm run build`, so a broken tree never reaches deploy.sh.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { BASE_URL, LOCALES, DEFAULT_LOCALE, PAGES, RTL, dirFor, stores, MEMBERS_COUNT, REVIEWS, RATING, HERO_SCENES, DAY_CARDS, FLOW_STEPS, BLOG_POSTS, BLOG_INDEX, SHOT_LOCALE, SHOT_SOURCES, WEB_APP_URL, HELP_PUBLIC, LIVE_APP_VERSION, HELP_TOPICS, HELP_ICONS, HELP_LOCALES } from '../site.config.mjs';
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
  // The path only: a ?v= cache-buster (build.mjs versionAssets) or #anchor
  // after it must not hide the link from this check.
  const refs = [...html.matchAll(/(?:href|src|poster)="(\/[^"#?]*)[^"]*"/g)].map((m) => m[1]);
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
    if (!html.includes(`src="${post.image}"`) && !html.includes(`src="${post.image}?v=`)) {
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
// shot-photos and shot-documents are English everywhere (no demo capture
// exists yet; shot-recipes got its own on 2026-09-28). Every SHOT_SOURCES screen the page shows must come from
// the locale's own folder — one missing file would otherwise fall back to
// English without a word. (Since the 2026-09-28 home page not every one of the
// nine is on the page: shot-family is not.)
const OWN_SHOTS = Object.values(SHOT_SOURCES);
for (const loc of LOCALES) {
  const file = path.join(DIST, dirFor(loc).slice(1), 'index.html');
  if (!fs.existsSync(file)) continue;            // section 1 already reported it
  const out = rel(file);
  const html = read(file);
  const dirs = new Set([...html.matchAll(/\/assets\/img\/shots\/([\w-]+)\//g)].map((m) => m[1]));
  if (!dirs.size) { fail(out, 'references no /assets/img/shots/ file — the screenshots vanished'); continue; }
  const own = loc in SHOT_LOCALE;
  const stray = [...dirs].filter((d) => d !== DEFAULT_LOCALE && d !== (own ? loc : null));
  if (stray.length) {
    fail(out, `shows screenshots from shots/${stray.join('/, shots/')}/ — a ${loc} page may only use shots/${own ? `${loc}/ or shots/` : ''}${DEFAULT_LOCALE}/`);
  }
  if (own && !dirs.has(loc)) {
    fail(out, `SHOT_LOCALE maps ${loc} to '${SHOT_LOCALE[loc]}' but the page uses no shots/${loc}/ file — the set was never generated, or the resolver fell back silently`);
  } else if (own) {
    const mine = new Set([...html.matchAll(new RegExp(`/assets/img/shots/${loc}/([\\w-]+)\\.webp`, 'g'))].map((m) => m[1]));
    const shown = OWN_SHOTS.filter((n) => html.includes(`/${n}.webp`));
    const missing = shown.filter((n) => !mine.has(n));
    if (missing.length) {
      fail(out, `uses ${shown.length - missing.length} of the ${shown.length} own screenshots it shows — ${missing.join(', ')} fell back to shots/${DEFAULT_LOCALE}/ (re-run tools/make-site-shots.py ${loc})`);
    }
  }
}

// --- 15. the landing page is the page the mock describes --------------------
// The home page is the Bevel-style page (claude-prompts/2026-09-28/bevel-mock/
// index.html). Several of its blocks are lists built from content and from
// site.config.mjs that must stay in step, and nothing else in the pipeline
// notices when one falls out: a hero with six cards still validates and still
// builds clean in all 28 locales. So the shape is asserted on every built
// landing page:
//   - the sections, in order: #hero, #features, .day, #plus, #workflows,
//     #screens, #privacy, .care, (#reviews only with REVIEWS.length >= 3),
//     #get, #faq — and the footer after </main>;
//   - the hero's scene loop: 7 scenes × 3 cards and 7 screenshots (round 2);
//     8 member photo cards (the loop's copy is aria-hidden and not counted),
//     6 "Start the day" cards, 2 floating cards on the calendars card,
//     3 Daili Plus cards, 4 workflow buttons / screens / toasts, 5 boxes in
//     "On every screen" and no TRMNL box among them;
//   - the rating row shows RATING.value (formatted for the page's locale),
//     and there is no rating row at all when RATING is null;
//   - no shutter bars (.shut / .shut-rows) anywhere — removed in round 2;
//   - the member number, formatted for the page's locale, and no {count}
//     anywhere in dist/;
//   - with fewer than 3 REVIEWS no reviews section at all; with 3+ every
//     card is one REVIEWS entry, each once; the words "Placeholder" and
//     "Sample" nowhere in dist/ (any text file);
//   - round 4: the hero's note pills sit above the headline, then the lead,
//     then the buttons; one flow <video> per FLOW_STEPS entry with a video:,
//     muted, playsinline, preload="none", never autoplay, its mp4 (≤ 1.6 MB)
//     and poster (≤ 60 KB) exist, and its step has no drawn tap or pill; every /assets/img/home/ and
//     /assets/img/shots/ URL on the page carries ?v=<sha8 of that file>;
//   - the three vendor scripts and home.js on the landing pages and on no
//     other page; every /assets/img/home/ file referenced exists, ≤ 120 KB;
//   - no cloudfront.net and no http(s):// image or script source in any page.
{
  const landing = PAGES.find((pg) => pg.id === 'landing');
  const locs = landing.locales === 'all' ? LOCALES : landing.locales.filter((l) => LOCALES.includes(l));
  const withReviews = REVIEWS.length >= 3;
  const SECTIONS = [
    ['hero', '<section class="hero" id="hero"'],
    ['members', 'id="features"'],
    ['day', '<section class="day"'],
    ['Daili Plus', 'id="plus"'],
    ['workflows', 'id="workflows"'],
    ['screens', 'id="screens"'],
    ['privacy', 'id="privacy"'],
    ['care', '<section class="care"'],
    ...(withReviews ? [['reviews', 'id="reviews"']] : []),
    ['get', 'id="get"'],
    ['faq', 'id="faq"'],
  ];
  const count = (s, needle) => s.split(needle).length - 1;
  // The section that opens at `needle`, up to its own </section> (none nest).
  const sectionAt = (html, needle) => {
    const from = html.indexOf(needle);
    if (from === -1) return '';
    return html.slice(from, html.indexOf('</section>', from));
  };
  const VENDOR = ['/assets/vendor/gsap.min.js', '/assets/vendor/ScrollTrigger.min.js', '/assets/vendor/lenis.min.js'];
  const HOME_JS = /<script src="\/assets\/home\.[0-9a-f]{8}\.js" defer><\/script>/;
  const IMG_MAX = 120 * 1024;

  const VIDEO_MAX = 1.6 * 1024 * 1024;
  const POSTER_MAX = 60 * 1024;
  const videoRefs = new Set();
  const unescapeHtml = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

  const landingOuts = new Set(locs.map((l) => landing.out(l)));
  for (const loc of locs) {
    const file = path.join(DIST, landing.out(loc));
    if (!fs.existsSync(file)) continue;          // section 1 already reported it
    const out = rel(file);
    const html = read(file);

    let at = -1;
    for (const [name, needle] of SECTIONS) {
      const i = html.indexOf(needle, at + 1);
      if (i === -1) { fail(out, `has no ${name} section (${needle}) where the mock puts it — missing or out of order: ${SECTIONS.map((s) => s[0]).join(' → ')}`); break; }
      at = i;
    }
    const mainEnd = html.lastIndexOf('</main>');
    const footerAt = html.indexOf('<footer>');
    if (mainEnd === -1 || footerAt < mainEnd) fail(out, 'the footer is not after </main> — the home page ends with the normal site footer');

    const hero = sectionAt(html, '<section class="hero" id="hero"');
    const nScenes = HERO_SCENES.length;
    const heroShots = count(hero, '<img class="hs" data-scene="');
    if (heroShots !== nScenes) fail(out, `the hero phone has ${heroShots} screenshots, expected ${nScenes} (one per HERO_SCENES scene)`);
    for (let i = 0; i < nScenes; i++) {
      const n = count(hero, `class="fc hcard" data-scene="${i}"`);
      if (n !== 3) fail(out, `hero scene ${i + 1} has ${n} cards, expected 3 (home.hero.scenes[${i}].cards)`);
    }
    const heroCards = count(hero, 'class="fc hcard');
    if (heroCards !== nScenes * 3) fail(out, `the hero has ${heroCards} scene cards, expected ${nScenes} × 3`);
    const ratingRows = count(hero, '<a class="rating"');
    if (!RATING) {
      if (ratingRows) fail(out, 'shows a rating row but RATING is null — set to null means no row');
    } else if (ratingRows !== 1) {
      fail(out, `has ${ratingRows} rating rows, expected 1 (RATING is set)`);
    } else {
      const shown = (hero.match(/<a class="rating"[^>]*data-rating="([^"]*)"[\s\S]*?<span class="rt">([^<]*)<\/span>/) || []);
      const num = new Intl.NumberFormat(loc, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(RATING.value);
      if (shown[1] !== String(RATING.value) || !(shown[2] || '').includes(num)) {
        fail(out, `the rating row shows ${shown[1] ?? 'nothing'} / "${shown[2] ?? ''}", expected RATING.value ${RATING.value} (${num} in ${loc}) — never a number the store does not show`);
      }
    }
    if (/class="[^"]*\bshut(?:-rows)?\b/.test(html)) fail(out, 'has a shutter bar (.shut / .shut-rows) — removed in round 2');
    const daySec = sectionAt(html, '<section class="day"');
    const dayCards = count(daySec, '<article class="fcard ');
    if (dayCards !== DAY_CARDS.length) fail(out, `"Start the day together" has ${dayCards} cards, expected ${DAY_CARDS.length} (home.day.cards)`);
    const calCards = count((daySec.split('id="calendars"')[1] || '').split('</article>')[0], '<div class="fc">');
    if (calCards !== 2) fail(out, `the calendars card has ${calCards} floating cards, expected 2 (Google + Apple)`);
    const screens = sectionAt(html, 'id="screens"');
    const boxes = count(screens, '<article class="bx ');
    if (boxes !== 5) fail(out, `"On every screen" has ${boxes} boxes, expected 5`);
    if (/trmnl|class="eink"/i.test(screens)) fail(out, '"On every screen" still has the TRMNL box — it became "On the wall with any tablet"');
    const members = sectionAt(html, 'id="features"');
    const firstSet = (members.match(/<div class="marq-set">([\s\S]*?)<\/div>\n/) || [, ''])[1];
    const photos = count(firstSet, '<div class="mcard"><img');
    if (photos !== 8) fail(out, `the members track has ${photos} photo cards (first set), expected 8 (home.members.cards)`);
    if (count(members, 'class="marq-set" aria-hidden="true"') !== 1) fail(out, 'the members track has no aria-hidden copy for its loop (or more than one)');
    const flow = sectionAt(html, 'id="workflows"');
    for (const [what, needle] of [['buttons', '<button class="fl'], ['screens', 'data-sx="'], ['toasts', 'class="fc toast']]) {
      const n = count(flow, needle);
      if (n !== 4) fail(out, `"See it in action" has ${n} ${what}, expected 4`);
    }
    const icards = count(sectionAt(html, 'id="plus"'), 'class="icard ');
    if (icards !== 3) fail(out, `the Daili Plus block has ${icards} cards, expected 3`);

    const num = new Intl.NumberFormat(loc).format(MEMBERS_COUNT);
    if (!members.includes(`<span data-count="${MEMBERS_COUNT}">${num}</span>`)) {
      fail(out, `the members headline does not show ${num} (MEMBERS_COUNT formatted for ${loc})`);
    }

    if (!withReviews && /id="reviews"|class="revs"|class="rv"/.test(html)) {
      fail(out, `has reviews markup but REVIEWS has ${REVIEWS.length} entries — the section renders only from 3 real ones`);
    }
    if (withReviews) {
      const revSet = (sectionAt(html, 'id="reviews"').match(/<div class="marq-set">([\s\S]*?)<\/div><div class="marq-set" aria-hidden/) || [, ''])[1];
      const shown = [...revSet.matchAll(/<article class="rv" data-review="([^"]*)">[\s\S]*?<p lang="[^"]*">([^<]*)<\/p><\/article>/g)].map((m) => [unescapeHtml(m[1]), unescapeHtml(m[2])]);
      const want = REVIEWS.map((r) => [r.title, r.text]);
      if (JSON.stringify(shown) !== JSON.stringify(want)) {
        fail(out, `the reviews row shows ${shown.length} card(s) that are not exactly REVIEWS' ${want.length}, in order — only real reviews from site.config.mjs, never invented ones`);
      }
    }

    // round 4: the note pills back on top, above the headline (the lead and
    // the buttons follow in that order).
    const iPills = hero.indexOf('<div class="pills"'), iH1 = hero.indexOf('<h1'), iLead = hero.indexOf('<p class="lead"'), iCta = hero.indexOf('<div class="hero-cta');
    if (!(iPills !== -1 && iPills < iH1 && iH1 < iLead && iLead < iCta)) fail(out, 'the hero\'s note pills are not above the headline, followed by the lead and the buttons (round 4)');

    // round 3: the real clips in "See it in action".
    const videos = [...flow.matchAll(/<video\b[^>]*>/g)].map((m) => m[0]);
    const wantVideos = FLOW_STEPS.map((s, i) => [i, s.video]).filter(([, v]) => v);
    if (videos.length !== wantVideos.length) fail(out, `"See it in action" has ${videos.length} <video>, expected ${wantVideos.length} (FLOW_STEPS with a video)`);
    for (const [i, name] of wantVideos) {
      const tag = videos.find((t) => t.includes(`data-sx="${i}"`));
      if (!tag) { fail(out, `step ${i + 1} has a clip (${name}) but no <video data-sx="${i}">`); continue; }
      for (const need of ['data-flow-video', ' muted', ' playsinline', 'preload="none"', `src="/assets/video/${name}.mp4?v=`, `poster="/assets/video/${name}.webp?v=`]) {
        if (!tag.includes(need)) fail(out, `the step ${i + 1} <video> lacks ${need.trim()}`);
      }
      if (/\sautoplay\b/.test(tag)) fail(out, `the step ${i + 1} <video> has autoplay — home.js plays it only on screen, tab visible, no reduced motion, no Save-Data`);
      if (flow.includes(`class="tap" data-ov="${i}"`) || flow.includes(`class="pillev go" data-ov="${i}"`)) fail(out, `step ${i + 1} plays a clip but still has its drawn overlay`);
      videoRefs.add(`/assets/video/${name}.mp4`); videoRefs.add(`/assets/video/${name}.webp`);
    }

    // round 3: every home picture and screenshot carries ?v=<sha8 of the file>.
    for (const m of html.matchAll(/\/assets\/img\/(?:home|shots)\/[^"'\s?)]+(\?v=([0-9a-f]{8}))?/g)) {
      const f = path.join(DIST, m[0].split('?')[0].slice(1));
      if (!m[1]) { fail(out, `names ${m[0]} without ?v= — a changed file would hide behind the 30-day image cache`); continue; }
      if (fs.existsSync(f) && crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex').slice(0, 8) !== m[2]) {
        fail(out, `names ${m[0]}, but that file's sha8 is not ${m[2]} — a stale cache-buster`);
      }
    }

    for (const src of VENDOR) {
      if (!new RegExp(`<script src="${src.replace(/\./g, '\\.')}\\?v=[0-9a-f]{8}" defer></script>`).test(html)) fail(out, `does not load ${src}?v=<sha8> (defer)`);
    }
    if (!HOME_JS.test(html)) fail(out, 'does not load the hashed home.js (defer)');
  }

  const homeRefs = new Set();
  for (const f of htmlFiles) {
    const out = rel(f);
    const html = read(f);
    if (!landingOuts.has(out)) {
      for (const src of [...VENDOR, '/assets/home.']) {
        if (html.includes(`src="${src}`)) fail(out, `loads ${src} — the home page's scripts belong on the landing pages only`);
      }
    }
    for (const m of html.matchAll(/\/assets\/img\/home\/[\w.-]+/g)) homeRefs.add(m[0]);
    if (html.includes('{count}')) fail(out, 'contains an unfilled {count}');
    if (html.includes('cloudfront.net')) fail(out, 'references cloudfront.net — every image is self-hosted');
    for (const m of html.matchAll(/<(?:img|script|source)\b[^>]*\s(?:src|srcset)="(https?:\/\/[^"]+)"/g)) {
      fail(out, `loads ${m[1]} — images and scripts are self-hosted`);
    }
  }
  for (const ref of homeRefs) {
    const f = path.join(DIST, ref.slice(1));
    if (!fs.existsSync(f)) fail(ref, 'is referenced but does not exist in dist/');
    else if (fs.statSync(f).size > IMG_MAX) fail(ref, `is ${(fs.statSync(f).size / 1024).toFixed(0)} KB — the budget is 120 KB`);
  }
  if (!homeRefs.size) fail('index.html', 'references no /assets/img/home/ file — the home page lost its pictures');
  for (const ref of videoRefs) {
    const f = path.join(DIST, ref.slice(1));
    if (!fs.existsSync(f)) fail(ref, 'is a flow clip or poster the page names, but it is not in dist/');
    else if (ref.endsWith('.mp4') && fs.statSync(f).size > VIDEO_MAX) fail(ref, `is ${(fs.statSync(f).size / 1048576).toFixed(2)} MB — the budget is 1.6 MB`);
    else if (ref.endsWith('.webp') && fs.statSync(f).size > POSTER_MAX) fail(ref, `is ${(fs.statSync(f).size / 1024).toFixed(0)} KB — a clip's poster may be 60 KB`);
  }
  // No placeholder review text anywhere in dist/, in any text file.
  (function scan(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) { scan(f); continue; }
      if (!/\.(html|js|css|json|xml|txt|svg)$/.test(e.name)) continue;
      const txt = read(f);
      for (const w of ['Placeholder', 'Sample']) if (txt.includes(w)) fail(rel(f), `contains "${w}" — no placeholder or sample review text may ship`);
    }
  })(DIST);
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
