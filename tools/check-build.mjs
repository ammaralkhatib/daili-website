#!/usr/bin/env node
// Guards the built output. Runs AFTER build.mjs as the third link of
// `npm run build`, so a broken tree never reaches deploy.sh.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { BASE_URL, LOCALES, DEFAULT_LOCALE, PAGES, RTL, dirFor, stores } from '../site.config.mjs';

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

if (errors.length) {
  console.error(`\n${errors.length} build error(s):`);
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`build OK · ${htmlFiles.length} pages · ${alternates.size} in hreflang clusters`);
