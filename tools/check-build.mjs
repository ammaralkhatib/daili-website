#!/usr/bin/env node
// Guards the built output. Runs AFTER build.mjs as the third link of
// `npm run build`, so a broken tree never reaches deploy.sh.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { BASE_URL, LOCALES, DEFAULT_LOCALE, PAGES, RTL, dirFor, stores, BLOG_POSTS } from '../site.config.mjs';

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
const read = (f) => fs.readFileSync(f, 'utf8');

// --- 1. manifest completeness ----------------------------------------------
const expected = new Set();
for (const pg of PAGES) {
  const locs = pg.locales === 'all' ? LOCALES : pg.locales.filter((l) => LOCALES.includes(l));
  for (const loc of locs) expected.add(pg.out(loc));
}
// Blog pages are expanded out of BLOG_POSTS by build.mjs rather than listed in
// PAGES, so the expected set has to be expanded the same way here.
for (const post of BLOG_POSTS) expected.add(`blog/${post.slug}/index.html`);
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
    // declared and where the damage is done. The 23 hreflang= attributes lower
    // down are the language picker's <a> tags — an advisory hint about the
    // language of a linked page, which forms no cluster and asks for no return
    // tag. `<link rel="alternate"` is checked across the whole document so it
    // cannot reappear below the head either.
    const head = html.slice(0, html.indexOf('</head>'));
    const hreflangs = (head.match(/hreflang=/g) || []).length;
    if (hreflangs !== 0) {
      fail(out, `${post.slug}: <head> carries ${hreflangs} hreflang= declaration(s) — the blog is English-only and must claim no alternates`);
    }
    const alternates = (html.match(/<link rel="alternate"/g) || []).length;
    if (alternates !== 0) {
      fail(out, `${post.slug}: carries ${alternates} <link rel="alternate"> — a blog page must never join an hreflang cluster`);
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

if (errors.length) {
  console.error(`\n${errors.length} build error(s):`);
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`build OK · ${htmlFiles.length} pages · ${alternates.size} in hreflang clusters`);
