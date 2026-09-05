#!/usr/bin/env node
// Builds the whole site into dist/. Node standard library only — no npm
// dependencies, no node_modules, nothing to audit or upgrade. That is a
// deliberate constraint: it is what makes `git checkout <sha> && npm run build`
// still work years from now, which in turn is what makes gitignoring dist/ safe.
//
// The one rule that matters: a missing content key THROWS. It never falls back
// to English and never renders an empty string. Silent fallback is how
// translations rot unnoticed, and avoiding it is the reason this file exists
// instead of an off-the-shelf static site generator.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import {
  BASE_URL, LOCALES, DEFAULT_LOCALE, dirFor, endonyms, RTL, stores, contact,
  PAGES, FEATURES, TRUST_ICONS, GALLERY, COMPARE_ROWS, COMPARE_MARKS, imageSize,
  BLOG_POSTS, BLOG_AUTHOR, BLOG_CLUSTERS, BLOG_INDEX, WHATS_NEW,
} from './site.config.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');
const p = (...s) => path.join(ROOT, ...s);

const BUILD_DATE = new Date().toISOString().slice(0, 10);

// ---------------------------------------------------------------------------
// tiny template engine
// ---------------------------------------------------------------------------

const escapeHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** Resolve a dotted path. Throws — never returns undefined. */
function lookup(data, dotted, where) {
  let cur = data;
  for (const part of dotted.split('.')) {
    if (cur === null || typeof cur !== 'object' || !(part in cur)) {
      throw new Error(`missing key '${dotted}' in ${where}`);
    }
    cur = cur[part];
  }
  if (cur === undefined) throw new Error(`key '${dotted}' is undefined in ${where}`);
  return cur;
}

/** Substitute {{{ raw }}} then {{ escaped }} against a resolver. */
function substitute(tpl, resolve) {
  return tpl
    .replace(/\{\{\{\s*([\w.$]+)\s*\}\}\}/g, (_m, key) => String(resolve(key)))
    .replace(/\{\{\s*([\w.$]+)\s*\}\}/g, (_m, key) => escapeHtml(resolve(key)));
}

function render(tpl, data, includes, where) {
  // 1. includes — one level, resolved before anything else
  tpl = tpl.replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_m, name) => {
    if (!(name in includes)) throw new Error(`unknown include '${name}' in ${where}`);
    return includes[name];
  });

  // 2. conditionals — {{? path }}…{{/}} keeps the block only if truthy/non-empty
  tpl = tpl.replace(/\{\{\?\s*([\w.]+)\s*\}\}([\s\S]*?)\{\{\/\}\}/g, (_m, key, inner) => {
    let v;
    try { v = lookup(data, key, where); } catch { v = false; }
    const keep = Array.isArray(v) ? v.length > 0 : Boolean(v);
    return keep ? inner : '';
  });

  // 3. loops — {{# path }}…{{/}} with {{ . }} for scalars and {{ .field }} for objects
  tpl = tpl.replace(/\{\{#\s*([\w.]+)\s*\}\}([\s\S]*?)\{\{\/\}\}/g, (_m, key, inner) => {
    const arr = lookup(data, key, where);
    if (!Array.isArray(arr)) throw new Error(`'${key}' is not an array in ${where}`);
    return arr.map((item, i) => substitute(inner, (k) => {
      if (k === '.') return item;
      if (k.startsWith('.')) {
        const f = k.slice(1);
        if (item === null || typeof item !== 'object' || !(f in item)) {
          throw new Error(`missing field '${f}' in ${key}[${i}] in ${where}`);
        }
        return item[f];
      }
      return lookup(data, k, where);
    })).join('');
  });

  // 4. plain substitution
  return substitute(tpl, (k) => lookup(data, k, where));
}

// ---------------------------------------------------------------------------
// load inputs
// ---------------------------------------------------------------------------

const read = (rel) => fs.readFileSync(p(rel), 'utf8');

const content = Object.fromEntries(
  LOCALES.map((loc) => {
    const file = `content/${loc}.json`;
    if (!fs.existsSync(p(file))) {
      throw new Error(`locale '${loc}' is in LOCALES but ${file} does not exist`);
    }
    return [loc, JSON.parse(read(file))];
  }),
);

const templates = Object.fromEntries(
  fs.readdirSync(p('templates')).filter((f) => f.endsWith('.html'))
    .map((f) => [f, read(`templates/${f}`)]),
);

const includes = { storebadges: templates['_storebadges.html'] };

// ---------------------------------------------------------------------------
// per-locale/page helpers
// ---------------------------------------------------------------------------

const pageById = Object.fromEntries(PAGES.map((pg) => [pg.id, pg]));

/** A page's own literal meta, if it carries any. Plain object, or a function of
 *  locale for a page that exists in more than one language. */
const metaFor = (pg, loc) => (typeof pg.meta === 'function' ? pg.meta(loc) : pg.meta);

/**
 * Blog posts become pages here rather than being hand-written into PAGES.
 * Twenty posts is twenty near-identical entries, and the one thing that must be
 * identical across all of them is the line below.
 *
 * `cluster: null` is load-bearing. The blog is English-only; the landing page
 * has 23 translated alternates. A blog page that carried a cluster would emit
 * hreflang links to pages that never point back — exactly the "hreflang has no
 * return tag" trap the comment above renderHead's hreflang block warns about.
 * tools/check-build.mjs section 11 asserts zero `hreflang=` on every built blog
 * page, so a refactor cannot quietly undo this.
 */
const blogPages = BLOG_POSTS.map((post) => ({
  id: `blog:${post.slug}`,
  template: 'blogpost.html',
  locales: ['en'],
  cluster: null,
  out: () => `blog/${post.slug}/index.html`,
  priority: () => '0.6',
  meta: { title: post.title, description: post.description },
  post,
}));

/**
 * A post's cluster has to be one of the five in BLOG_CLUSTERS. Nothing renders
 * clusters yet, which is exactly why this throws: an unrendered typo is
 * invisible until the day /blog/ starts grouping by it, and then it is a silent
 * sixth cluster containing one post.
 */
for (const post of BLOG_POSTS) {
  if (!(post.cluster in BLOG_CLUSTERS)) {
    throw new Error(`BLOG_POSTS '${post.slug}' has cluster '${post.cluster}', which is not a key in BLOG_CLUSTERS (${Object.keys(BLOG_CLUSTERS).join(', ')})`);
  }
}

/** The blog index. English-only and outside every cluster, like the posts. */
const blogIndexPage = {
  id: 'blogindex',
  template: 'blogindex.html',
  locales: ['en'],
  cluster: null,
  out: () => 'blog/index.html',
  priority: () => '0.6',
  meta: { title: BLOG_INDEX.title, description: BLOG_INDEX.description },
};

/** Everything the build loops over: the manifest, the index, one page per post. */
const allPages = [...PAGES, blogIndexPage, ...blogPages];

/** "2 September 2026" — the byline's readable half. The machine-readable half
 *  is the raw ISO string in <time datetime>. */
const formatDate = (iso) => new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
}).format(new Date(`${iso}T00:00:00Z`));

/** RFC 822, which is what RSS requires — not ISO 8601. Built by hand from UTC
 *  parts rather than toUTCString() so the format cannot drift with the locale
 *  or the host's clock: 'Wed, 02 Sep 2026 00:00:00 GMT'. */
const RFC822_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const RFC822_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const rfc822 = (iso) => {
  const d = new Date(`${iso}T00:00:00Z`);
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${RFC822_DAYS[d.getUTCDay()]}, ${dd} ${RFC822_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()} 00:00:00 GMT`;
};

/**
 * Posts newest first, with the derived fields the index and the feed both need.
 * One list, so the page and the feed can never disagree about what exists or
 * what order it is in.
 */
const blogList = [...BLOG_POSTS]
  .sort((a, b) => b.published.localeCompare(a.published) || a.slug.localeCompare(b.slug))
  .map((post) => ({
    ...post,
    url: `/blog/${post.slug}/`,
    absUrl: `${BASE_URL}/blog/${post.slug}/`,
    publishedLabel: formatDate(post.published),
    pubDate: rfc822(post.published),
  }));

const localesFor = (pg) => (pg.locales === 'all' ? LOCALES : pg.locales.filter((l) => LOCALES.includes(l)));
const urlFor = (pg, loc) => {
  const out = pg.out(loc);
  return '/' + (out.endsWith('/index.html') ? out.slice(0, -'index.html'.length) : out === 'index.html' ? '' : out);
};
const absUrl = (pg, loc) => BASE_URL + urlFor(pg, loc);

/** Pages that exist in a given locale, used by the language picker. */
const pageExistsIn = (pg, loc) => localesFor(pg).includes(loc);

/** The chip's label. Both Chinese builds read ZH — 3.5 characters of "简体中文"
 *  in a pill is unreadable, and the menu underneath is where 简体 and 繁體 are
 *  told apart. */
const langCode = (loc) => loc.split('-')[0].toUpperCase();

/**
 * The language navigation.
 *
 * With two locales a dropdown is worse than a single pill, so this renders the
 * toggle the hand-written site had. Past two it becomes a <details> disclosure —
 * the only widget that gives a real popover with zero JavaScript, keyboard
 * accessible for free and no focus-trap code.
 *
 * Either way every entry is a real <a href> to a real URL, so the picker doubles
 * as 23 crawlable internal links reinforcing the hreflang cluster. And every
 * label is an endonym: a picker written in the current page's language is
 * unreadable to the person trying to escape it.
 */
function renderLangNav(pg, loc) {
  // A locale that does not have this page falls back to its landing page, so
  // the picker can never link to a 404.
  const target = (other) => (pageExistsIn(pg, other) ? urlFor(pg, other) : dirFor(other));
  const others = LOCALES.filter((l) => l !== loc);

  if (LOCALES.length === 2) {
    const other = others[0];
    return `      <a class="lang" href="${target(other)}" hreflang="${other}" lang="${other}" data-lang="${other}">${endonyms[other]}</a>`;
  }

  const rows = [...LOCALES]
    .sort((a, b) => new Intl.Collator('en').compare(endonyms[a], endonyms[b]))
    .map((l) => {
      const current = l === loc ? ' aria-current="true"' : '';
      // <bdi>, not dir="rtl" on the row. The row is a flex line — code, then
      // endonym — and dir on the <a> reverses that line, so on an LTR page the
      // Arabic row alone came out mirrored and fell out of the column. <bdi>
      // isolates the name's own direction without touching the layout, and it
      // needs no attribute: it detects RTL from the text itself.
      return `          <li><a href="${target(l)}" hreflang="${l}" lang="${l}" data-lang="${l}"${current}><small>${langCode(l)}</small><bdi>${endonyms[l]}</bdi></a></li>`;
    }).join('\n');

  // The summary is the code, not the endonym: at 23 locales the chip has to fit
  // beside a burger on a 390px phone, and "Bahasa Indonesia" does not. The
  // aria-label stays the translated word for "Language", so what a screen
  // reader announces is a sentence rather than two letters.
  return `      <details class="langpicker">
        <summary aria-label="${escapeHtml(content[loc].nav.language)}"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18"/></svg>${langCode(loc)}<svg class="chev" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></summary>
        <div class="langpicker-menu">
          <ul>
${rows}
          </ul>
        </div>
      </details>`;
}

/** One consistent footer everywhere. The hand-written pages each had a
 *  different one; generating it is how they stop drifting. */
function renderFooterLinks(loc) {
  const c = content[loc];
  const support = loc === DEFAULT_LOCALE ? '/support.html' : `${dirFor(loc)}support.html`;
  const whatsNew = loc === 'de' ? '/neuigkeiten.html' : '/whats-new.html';
  const whatsNewLang = loc === 'de' ? 'de' : 'en';
  const whatsNewLabel = loc === 'de' ? 'Neuigkeiten' : "What's new";
  const privacy = loc === 'de' ? '/datenschutz.html' : '/privacy.html';
  const terms = loc === 'de' ? '/nutzungsbedingungen.html' : '/terms.html';
  const parts = [
    // Absolute, because the web app is a different host. Same tab and the same
    // account, so it is not marked up as leaving the site — only rel=noopener,
    // which costs nothing and is the right default for any cross-origin link.
    `<a href="https://app.daili.app" rel="noopener">${escapeHtml(c.nav.webApp)}</a>`,
    `<a href="${support}">${escapeHtml(c.nav.support)}</a>`,
    // Same target and same attributes as the header link: the blog is English
    // whatever locale the footer around it is written in, and hreflang/lang say
    // so rather than leaving a reader to find out by clicking.
    `<a href="/blog/" hreflang="en" lang="en">${escapeHtml(c.nav.blog)}</a>`,
    // The release notes exist in English and German only. Every other locale's
    // footer points at the English page and says so, the same way the blog link
    // does. The label is a literal rather than a content key: adding one to all
    // 23 files for a two-language page would be 23 untranslated entries.
    `<a href="${whatsNew}" hreflang="${whatsNewLang}" lang="${whatsNewLang}">${escapeHtml(whatsNewLabel)}</a>`,
    `<a href="${privacy}">${escapeHtml(c.footer.privacy)}</a>`,
    `<a href="${terms}">${escapeHtml(c.footer.terms)}</a>`,
    `<a href="/impressum.html">${escapeHtml(c.footer.imprint)}</a>`,
  ];
  // No separator: .flinks is a flex row with its own gaps, so a wrapped line
  // never ends on a stranded "·".
  return parts.join('\n      ');
}

function renderTrustPills(loc) {
  const pills = lookup(content[loc], 'trust.pills', `content/${loc}.json`);
  if (pills.length !== TRUST_ICONS.length) {
    throw new Error(`content/${loc}.json: trust.pills has ${pills.length} entries, expected ${TRUST_ICONS.length}`);
  }
  return pills.map((pill, i) => `      <div class="pill">
        <span class="pill-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${TRUST_ICONS[i]}</svg></span>
        <strong>${escapeHtml(pill.strong)}</strong>
        <span>${escapeHtml(pill.span)}</span>
      </div>`).join('\n');
}

/** Everything below the fold is lazy; width/height on every image so the page
 *  stops shifting layout while they load. */
const imgTag = (name, alt, cls = '') => {
  const { width, height } = imageSize(name);
  return `<img${cls ? ` class="${cls}"` : ''} src="/assets/img/${name}.webp" alt="${escapeHtml(alt)}" width="${width}" height="${height}" loading="lazy" decoding="async">`;
};

function renderFeatures(loc) {
  const where = `content/${loc}.json`;
  return FEATURES.map((f, i) => {
    const c = lookup(content[loc], `features.${f.key}`, where);
    for (const k of ['eyebrow', 'h2', 'p', 'bullets', 'alt']) {
      if (!(k in c)) throw new Error(`missing key 'features.${f.key}.${k}' in ${where}`);
    }
    const alt = i % 2 === 1 ? ' alt' : '';
    const img = imgTag(f.img, c.alt);
    const art =
      f.art === 'ill' ? `    <div class="art">${imgTag(f.img, c.alt, 'ill')}</div>`
      : f.art === 'duo' ? `    <div class="art duo">\n      <div class="phone small">${img}</div>\n    </div>`
      : `    <div class="art phone small">${img}</div>`;
    const bullets = c.bullets.length
      ? `      <ul>\n${c.bullets.map((b) => `        <li>${escapeHtml(b)}</li>`).join('\n')}\n      </ul>\n`
      : '';
    return `  <section class="feature${alt}">
    <div class="txt">
      <span class="eyebrow">${escapeHtml(c.eyebrow)}</span>
      <h2>${escapeHtml(c.h2)}</h2>
      <p>${escapeHtml(c.p)}</p>
${bullets}    </div>
${art}
  </section>`;
  }).join('\n\n');
}

function renderGallery(loc) {
  const where = `content/${loc}.json`;
  const caps = lookup(content[loc], 'gallery.captions', where);
  if (caps.length !== GALLERY.length) {
    throw new Error(`${where}: gallery.captions has ${caps.length} entries, GALLERY has ${GALLERY.length}`);
  }
  return GALLERY.map((name, i) => {
    const shot = name.startsWith('shot-');
    return `      <figure class="gallery-item${shot ? ' shot' : ''}">
        ${imgTag(name, caps[i])}
        <figcaption>${escapeHtml(caps[i])}</figcaption>
      </figure>`;
  }).join('\n');
}

function renderCompareTable(loc) {
  const where = `content/${loc}.json`;
  const cmp = lookup(content[loc], 'compare', where);
  if (cmp.rows.length !== COMPARE_ROWS.length) {
    throw new Error(`${where}: compare.rows has ${cmp.rows.length} labels, COMPARE_ROWS has ${COMPARE_ROWS.length} mark sets`);
  }
  const cell = (mark) => {
    const glyph = COMPARE_MARKS[mark];
    const cls = mark === 'y' ? 'yes' : mark === 'p' ? 'partly' : 'no';
    return `<td class="mark ${cls}"><span aria-hidden="true">${glyph}</span></td>`;
  };
  const head = `        <tr><th scope="col">${escapeHtml(cmp.cols.feature)}</th><th scope="col" class="us">${escapeHtml(cmp.cols.daili)}</th><th scope="col">${escapeHtml(cmp.cols.gcal)}</th><th scope="col">${escapeHtml(cmp.cols.paper)}</th></tr>`;
  const body = COMPARE_ROWS.map((r, i) =>
    `        <tr><th scope="row">${escapeHtml(cmp.rows[i])}</th>${cell(r.daili)}${cell(r.gcal)}${cell(r.paper)}</tr>`).join('\n');
  return `      <table class="compare-table">\n        <thead>\n${head}\n        </thead>\n        <tbody>\n${body}\n        </tbody>\n      </table>`;
}

// ---------------------------------------------------------------------------
// head: canonical, hreflang, Open Graph, JSON-LD
// ---------------------------------------------------------------------------

function renderHead(pg, loc, cssHref, detector, postBody) {
  const c = content[loc];
  const out = [];
  const canonical = absUrl(pg, loc);
  // A blog page carries its own meta (pg.meta) and, for a post, its own hero
  // image; every other page still reads both out of content/<loc>.json exactly
  // as before.
  const post = pg.post;
  const isBlog = Boolean(post) || pg.id === 'blogindex';

  out.push(`<link rel="canonical" href="${canonical}">`);

  if (pg.noindex) out.push('<meta name="robots" content="noindex">');

  // RSS autodiscovery, on the index and every post and NOWHERE else — it is a
  // feed of the blog, not of the site. This is a <link rel="alternate">
  // without an hreflang, which is why check-build's section 11 check 4 asks
  // about alternates carrying hreflang rather than about alternates at all.
  if (isBlog) {
    out.push(`<link rel="alternate" type="application/rss+xml" title="Daili blog" href="/blog/feed.xml">`);
  }

  // hreflang — only within this page's own cluster. Letting a locale claim a
  // page from a different cluster as its alternate is the classic route to
  // Search Console's "hreflang has no return tag".
  if (pg.cluster && !pg.noindex) {
    for (const l of localesFor(pg)) {
      out.push(`<link rel="alternate" hreflang="${l}" href="${absUrl(pg, l)}">`);
    }
    out.push(`<link rel="alternate" hreflang="x-default" href="${absUrl(pg, DEFAULT_LOCALE)}">`);
  }

  const pgMeta = metaFor(pg, loc);
  const ogTitle = pgMeta ? pgMeta.title : pg.id === 'landing' ? c.meta.ogTitle : c.meta.title;
  const ogDesc = pgMeta ? pgMeta.description : pg.id === 'landing' ? c.meta.ogDescription : c.meta.description;
  out.push(`<meta property="og:type" content="${post ? 'article' : 'website'}">`);
  out.push(`<meta property="og:url" content="${canonical}">`);
  out.push(`<meta property="og:title" content="${escapeHtml(ogTitle)}">`);
  out.push(`<meta property="og:description" content="${escapeHtml(ogDesc)}">`);
  out.push(`<meta property="og:image" content="${BASE_URL}${post ? post.image : '/assets/img/logo.webp'}">`);
  out.push(`<meta property="og:locale" content="${loc.replace('-', '_')}">`);
  if (post) {
    out.push(`<meta property="article:published_time" content="${post.published}">`);
    out.push(`<meta property="article:modified_time" content="${post.updated}">`);
  }
  out.push(`<meta name="twitter:card" content="summary">`);

  if (post) {
    // headline is post.h1, not post.title: Google wants the headline to be the
    // heading the reader actually sees, and the two are deliberately allowed to
    // differ. The FAQPage below is built from the same post.faq array that
    // templates/blogpost.html renders the visible questions from — the markup
    // and the visible text cannot drift because they are the same strings.
    const ld = [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.h1,
        description: post.description,
        image: `${BASE_URL}${post.image}`,
        datePublished: post.published,
        dateModified: post.updated,
        inLanguage: loc,
        author: { '@type': 'Person', name: BLOG_AUTHOR.name, url: BASE_URL + BLOG_AUTHOR.url },
        publisher: {
          '@type': 'Organization',
          name: 'Daili',
          logo: { '@type': 'ImageObject', url: `${BASE_URL}/assets/img/logo.webp` },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faq.map((it) => ({
          '@type': 'Question',
          name: it.q,
          acceptedAnswer: { '@type': 'Answer', text: it.a },
        })),
      },
    ];

    // A third block, only for a post that declares `itemList` — and only a post
    // that IS a list of named things should. The names are read back out of the
    // body that was just rendered, never taken from a second copy in
    // site.config.mjs: the same reasoning that keeps `faq` in one place.
    // Structured data that disagrees with the visible page is worse than none,
    // and the only way to guarantee they agree is to have one source.
    if (post.itemList) {
      const names = [];
      for (const [, block] of postBody.matchAll(/<ol class="doc-checklist"[^>]*>([\s\S]*?)<\/ol>/g)) {
        for (const [, name] of block.matchAll(/<li>\s*<strong>([^<]+)<\/strong>/g)) names.push(name.trim());
      }
      if (names.length === 0) {
        throw new Error(`BLOG_POSTS '${post.slug}' declares itemList, but blog/${post.body} has no <ol class="doc-checklist"> items to build it from`);
      }
      ld.push({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: post.itemList,
        itemListOrder: 'https://schema.org/ItemListOrderAscending',
        numberOfItems: names.length,
        itemListElement: names.map((name, i) => ({ '@type': 'ListItem', position: i + 1, name })),
      });
    }

    for (const obj of ld) {
      out.push(`<script type="application/ld+json">${JSON.stringify(obj)}</script>`);
    }
  }

  if (pg.id === 'landing') {
    // Built from the same content that renders the visible FAQ, so the two can
    // never drift — Google requires FAQ markup to match visible text exactly.
    // aggregateRating is deliberately absent: there are no real ratings, and
    // inventing one is both a manual-action risk and a lie on a site whose
    // whole pitch is "no tracking, no data selling".
    const ld = [
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Daili',
        applicationCategory: 'https://schema.org/LifestyleApplication',
        operatingSystem: 'iOS, Android',
        inLanguage: loc,
        url: canonical,
        description: c.meta.description,
        // Only stores the app can actually be installed from. A rejected
        // build is not an installUrl, and schema.org markup is exactly the
        // wrong place to promise a 404.
        installUrl: [stores.ios, stores.android].filter((st) => st.available).map((st) => st.url),
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: c.faq.items.map((it) => ({
          '@type': 'Question',
          name: it.q,
          acceptedAnswer: { '@type': 'Answer', text: it.a },
        })),
      },
    ];
    for (const obj of ld) {
      out.push(`<script type="application/ld+json">${JSON.stringify(obj)}</script>`);
    }
  }

  if (detector) out.push(detector);
  return out.join('\n');
}

// ---------------------------------------------------------------------------
// the language detector — inlined into the root index.html ONLY
// ---------------------------------------------------------------------------

function buildDetector() {
  const supported = JSON.stringify(LOCALES.map((l) => l.toLowerCase()));
  const dirs = JSON.stringify(Object.fromEntries(LOCALES.map((l) => [l.toLowerCase(), dirFor(l)])));
  // DAILI-LANG-DETECTOR is the marker check-build.mjs greps for to prove this
  // script exists in exactly one output file. If it ever appears in a localized
  // page, redirects could bounce.
  return `<script>/* DAILI-LANG-DETECTOR */
(function(){var S=${supported},D=${dirs};
function go(c){if(c==="${DEFAULT_LOCALE}")return true;var d=D[c];if(!d)return false;location.replace(d+location.hash);return true}
function save(c){try{localStorage.setItem("daili.lang",c)}catch(e){}}
function res(t){t=String(t).toLowerCase();var ps=t.split("-"),b=ps[0],sc=null,rg=null,i;
for(i=1;i<ps.length;i++){if(ps[i].length===4)sc=ps[i];else if(ps[i].length===2)rg=ps[i]}
if(b==="zh"){var z=(sc==="hant"||rg==="tw"||rg==="hk"||rg==="mo")?"zh-hant":"zh-hans";return S.indexOf(z)<0?null:z}
if(b==="nb"||b==="no"||b==="nn")b="nb";
if(b==="in")b="id";
return S.indexOf(b)<0?null:b}
var q=new URLSearchParams(location.search).get("hl");
if(q){var c=res(q);if(c){save(c);go(c);return}}
var sv=null;try{sv=localStorage.getItem("daili.lang")}catch(e){}
if(sv&&S.indexOf(sv)>=0){go(sv);return}
var tags=(navigator.languages&&navigator.languages.length)?navigator.languages:[navigator.language||"en"];
for(var i=0;i<tags.length;i++){var m=res(tags[i]);
/* Deliberately no save() here: storing an auto-detected value would turn a
   strictly-necessary preference into unsolicited storage. Write on click only. */
if(m){go(m);return}}
})();
</script>`;
}

// ---------------------------------------------------------------------------
// build
// ---------------------------------------------------------------------------

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dest, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

const sha8 = (buf) => crypto.createHash('sha256').update(buf).digest('hex').slice(0, 8);

function build() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  // static assets, verbatim (dotfiles included — .htaccess lives here)
  copyDir(p('static'), DIST);

  // content-hash CSS and JS so they can be cached for a year and still change
  // the instant their bytes do
  const css = fs.readFileSync(p('static/assets/style.css'));
  const js = fs.readFileSync(p('static/assets/script.js'));
  const cssName = `style.${sha8(css)}.css`, jsName = `script.${sha8(js)}.js`;
  fs.renameSync(path.join(DIST, 'assets/style.css'), path.join(DIST, 'assets', cssName));
  fs.renameSync(path.join(DIST, 'assets/script.js'), path.join(DIST, 'assets', jsName));
  const cssHref = `/assets/${cssName}`, jsHref = `/assets/${jsName}`;

  const detector = buildDetector();
  const cspHash = `'sha256-${crypto.createHash('sha256')
    .update(detector.replace(/^<script>/, '').replace(/<\/script>$/, ''))
    .digest('base64')}'`;

  // .htaccess gets the detector's hash so the CSP can drop 'unsafe-inline'
  const htaccessPath = path.join(DIST, '.htaccess');
  if (fs.existsSync(htaccessPath)) {
    fs.writeFileSync(htaccessPath,
      fs.readFileSync(htaccessPath, 'utf8').replace(/__CSP_SCRIPT_HASHES__/g, cspHash));
  }

  const written = [];

  for (const pg of allPages) {
    for (const loc of localesFor(pg)) {
      const c = content[loc];
      const where = `content/${loc}.json`;
      const isRootLanding = pg.id === 'landing' && loc === DEFAULT_LOCALE;

      const titleKey = pg.id === 'support' ? 'supportTitle'
        : pg.id === 'notfound' ? 'notfoundTitle' : 'title';
      const descKey = pg.id === 'support' ? 'supportDescription' : 'description';

      const pgMeta = metaFor(pg, loc);

      // Body paths are relative to legal/ unless they name their own folder.
      // The legal bodies are bare filenames and resolve exactly as before; the
      // release notes live in changelog/ because a release prompt prepends to
      // them and they are not legal text.
      let legalBody = '';
      if (pg.body) legalBody = read(pg.body[loc].includes('/') ? pg.body[loc] : `legal/${pg.body[loc]}`);

      let postBody = '';
      if (pg.post) postBody = read(`blog/${pg.post.body}`);

      const data = {
        ...c,
        // The index gets the post list and its own literals; every other page
        // gets neither, so a stray {{ posts }} throws rather than rendering
        // nothing.
        ...(pg.id === 'blogindex' ? { posts: blogList, blog: BLOG_INDEX } : {}),
        ...(pg.id === 'whats-new' ? { whatsNew: WHATS_NEW[loc] } : {}),
        // Only blog pages have a post. Anywhere else `post` is absent, so a
        // stray {{ post.x }} throws rather than rendering an empty string.
        ...(pg.post ? {
          post: {
            ...pg.post,
            author: BLOG_AUTHOR.name,
            publishedLabel: formatDate(pg.post.published),
          },
        } : {}),
        // A page may carry its own literal meta (blog posts do). Without this
        // every new blog post would be another arm on the titleKey ternary,
        // and its title would have to be written into 23 content files that
        // will never render it.
        meta: {
          ...c.meta,
          title: pgMeta ? pgMeta.title : pg.id === 'landing' ? c.meta.title : c.meta[titleKey],
          description: pgMeta ? pgMeta.description : c.meta[descKey],
        },
        // iosUrl is only in the view object when the listing is actually
        // available. Not merely unused when it is not — absent, so a stray
        // {{ site.iosUrl }} would throw rather than quietly write a dead link.
        site: {
          ...(stores.ios.available ? { iosUrl: stores.ios.url } : {}),
          androidUrl: stores.android.url,
          iosAvailable: stores.ios.available,
          iosSoon: !stores.ios.available,
        },
        page: {
          htmlLang: loc,
          dir: RTL.has(loc) ? 'rtl' : 'ltr',
          cssHref, jsHref,
          homeHref: dirFor(loc),
          featuresHref: pg.id === 'landing' ? '#features' : `${dirFor(loc)}#features`,
          supportHref: pageExistsIn(pageById.support, loc) ? urlFor(pageById.support, loc) : '/support.html',
          langNav: renderLangNav(pg, loc),
          footerLinks: renderFooterLinks(loc),
          legalBody,
          postBody,
          trustPills: pg.id === 'landing' ? renderTrustPills(loc) : '',
          features: pg.id === 'landing' ? renderFeatures(loc) : '',
          gallery: pg.id === 'landing' ? renderGallery(loc) : '',
          compareTable: pg.id === 'landing' ? renderCompareTable(loc) : '',
          testimonials: '',
          pricingHref: pg.id === 'landing' ? '#pricing' : `${dirFor(loc)}#pricing`,
          headExtra: '',
        },
      };
      data.page.headExtra = renderHead(pg, loc, cssHref, isRootLanding ? detector : null, postBody);

      const body = render(templates[pg.template], data, includes, where);
      data.page.body = body;
      const html = render(templates['layout.html'], data, includes, where);

      const outPath = path.join(DIST, pg.out(loc));
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, html);
      written.push({ pg, loc, out: pg.out(loc), url: absUrl(pg, loc) });
    }
  }

  // ---- sitemap ------------------------------------------------------------
  const NS = 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml"';
  const urls = written.filter((w) => !w.pg.noindex).map((w) => {
    const alts = w.pg.cluster
      ? localesFor(w.pg).map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${absUrl(w.pg, l)}"/>`)
        .concat([`    <xhtml:link rel="alternate" hreflang="x-default" href="${absUrl(w.pg, DEFAULT_LOCALE)}"/>`])
        .join('\n') + '\n'
      : '';
    const prio = w.pg.priority ? `    <priority>${w.pg.priority(w.loc)}</priority>\n` : '';
    return `  <url>\n    <loc>${w.url}</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n${prio}${alts}  </url>`;
  });
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset ${NS}>\n${urls.join('\n')}\n</urlset>\n`);

  // ---- RSS ---------------------------------------------------------------
  // Deliberately not a page: it is not in `written`, so it cannot reach the
  // sitemap. Every value goes through escapeHtml — its five entities are all
  // valid XML, and a single unescaped & in a post title produces a feed no
  // reader will open, which nothing else in this build would notice.
  const feedItems = blogList.map((post) => `  <item>
    <title>${escapeHtml(post.title)}</title>
    <link>${escapeHtml(post.absUrl)}</link>
    <description>${escapeHtml(post.description)}</description>
    <pubDate>${post.pubDate}</pubDate>
    <guid isPermaLink="true">${escapeHtml(post.absUrl)}</guid>
  </item>`).join('\n');
  // The newest post's date, not the build date: a feed whose lastBuildDate
  // moves every time the site is rebuilt tells a reader nothing.
  const lastBuild = blogList.length ? rfc822(blogList[0].updated) : rfc822(BUILD_DATE);
  fs.writeFileSync(path.join(DIST, 'blog/feed.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeHtml(BLOG_INDEX.h1)}</title>
  <link>${BASE_URL}/blog/</link>
  <description>${escapeHtml(BLOG_INDEX.description)}</description>
  <language>en</language>
  <lastBuildDate>${lastBuild}</lastBuildDate>
  <atom:link href="${BASE_URL}/blog/feed.xml" rel="self" type="application/rss+xml"/>
${feedItems}
</channel>
</rss>
`);

  fs.writeFileSync(path.join(DIST, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml\n`);

  console.log(`built ${written.length} pages · ${LOCALES.length} locale(s) · ${urls.length} sitemap entries`);
  console.log(`assets: ${cssName}  ${jsName}`);
  console.log(`blog: ${blogList.length} post(s) · /blog/ index · feed.xml`);
  for (const [name, st] of Object.entries(stores)) {
    if (!st.available) {
      console.log(`INFO  stores.${name}.available is false — the badge renders as a non-link "coming soon" chip and ${name === 'ios' ? 'the App Store URL' : 'the store URL'} is not written into dist/.`);
    } else if (!st.verified) {
      console.warn(`WARN  stores.${name}.url is marked unverified in site.config.mjs — the listing was not public when this was last checked.`);
    }
  }
}

build();
