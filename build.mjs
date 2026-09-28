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
  PAGES, imageSize, SHOT_LOCALE, WEB_APP_URL,
  MEMBERS_COUNT, REVIEWS, HOME_ICONS, HERO_SCENES, RATING, WORKS_ICONS, MEMBER_BADGES, MEMBER_CARDS,
  MEMBER_TILES_AFTER, HOME_FAMILY, DAY_CARDS, HABITS_ENERGY, HOME_WIDGETS, ORBIT_RINGS, ORBIT_TILES,
  FLOW_STEPS, FLOW_VIDEO_SIZE, PRIVACY_ICONS, MOSAIC, FLAT_OBJECTS,
  BLOG_POSTS, BLOG_AUTHOR, BLOG_CLUSTERS, BLOG_INDEX, WHATS_NEW,
  HELP_PUBLIC, LIVE_APP_VERSION, HELP_TOPICS, HELP_ICONS, HELP_LOCALES,
} from './site.config.mjs';
import { loadAllHelp, visibleHelp, mediaFor } from './tools/help-lib.mjs';

/** Where the help pages send their anonymous counts (api commit a19d079).
 *  static/.htaccess allows exactly this origin in connect-src. */
const HELP_EVENTS_URL = 'https://api.daili.app/v1/help/events';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
let DIST = path.join(ROOT, 'dist'); // a help test build moves it (see HELP_TEST_ROOT)
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

/**
 * The help center: help/<locale>/<topic>/<slug>.md, parsed by
 * tools/help-lib.mjs. English is the source; a translation is its text only.
 * tools/check-help.mjs has already run by the time this does, so an error here
 * means someone ran build.mjs on its own — it still refuses to render a broken
 * article rather than half of one.
 *
 * Every HELP_LOCALES locale gets the same pages under dirFor(loc) + 'help/'
 * (English at /help/), in that locale's layout. With more than one of them the
 * pages form their own hreflang cluster ('help'), x-default English; with
 * English alone there is no cluster and no hreflang, as before. While
 * HELP_PUBLIC is false every help page is noindex, which also keeps it out of
 * the sitemap. Pages show only what the live app has (`since` <=
 * LIVE_APP_VERSION); help/<locale>.json carries everything.
 *
 * HELP_TEST_ROOT / HELP_TEST_LOCALES / HELP_TEST_DIST exist for
 * tools/test-check-help.mjs alone: they build a fixture's help (and the rest of
 * the site) into a scratch folder, to prove a translated locale renders. Such a
 * build never passes check-build, and says so loudly.
 */
const HELP_TEST = Boolean(process.env.HELP_TEST_ROOT);
if (HELP_TEST && !(process.env.HELP_TEST_LOCALES && process.env.HELP_TEST_DIST)) {
  throw new Error('HELP_TEST_ROOT needs HELP_TEST_LOCALES and HELP_TEST_DIST too');
}
if (HELP_TEST) console.warn(`!! HELP_TEST_ROOT=${process.env.HELP_TEST_ROOT} — a help test build into ${process.env.HELP_TEST_DIST}, never deploy it`);
const HELP_ROOT = HELP_TEST ? path.resolve(process.env.HELP_TEST_ROOT) : ROOT;
const helpLocales = HELP_TEST ? process.env.HELP_TEST_LOCALES.split(',') : HELP_LOCALES;
if (HELP_TEST) DIST = path.resolve(process.env.HELP_TEST_DIST);

const helpAll = loadAllHelp({ root: HELP_ROOT, topics: HELP_TOPICS, icons: HELP_ICONS, helpLocales, locales: LOCALES });
if (helpAll.errors.length) {
  throw new Error(`help/ has ${helpAll.errors.length} error(s) — run node tools/check-help.mjs:\n${helpAll.errors.join('\n')}`);
}
const help = helpAll.en;
/** locale → its help (loadHelp/loadTranslation shape), for every built locale. */
const helpByLocale = Object.fromEntries(helpAll.built.map((h) => [h.locale, h]));
/** locale → what its pages show. Every built locale has every article, so the
 *  set is the same everywhere; only the words differ. */
const helpShownByLocale = Object.fromEntries(helpAll.built.map((h) => [h.locale, visibleHelp(h, LIVE_APP_VERSION)]));
const helpShown = helpShownByLocale.en;
/** '/help/' for English, '/de/help/', '/zh-hant/help/', … */
const helpHome = (loc) => `${dirFor(loc)}help/`;
const helpOut = (loc, rest) => `${helpHome(loc).slice(1)}${rest}`;
const helpArticleUrl = (a, loc) => `${helpHome(loc)}${a.topic}/${a.slug}/`;
/** A _ui.json string, escaped, with its {placeholders} filled by ready HTML. */
const uiHtml = (s, vars = {}) => escapeHtml(s).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
const uiText = (s, vars = {}) => s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));

const helpBase = {
  locales: helpLocales,
  cluster: helpLocales.length > 1 ? 'help' : null,
  noindex: !HELP_PUBLIC,
  priority: () => '0.5',
};
const helpArticleIn = (id, loc) => helpByLocale[loc].articles.find((a) => a.id === id);
const helpPages = [
  {
    ...helpBase,
    id: 'helpindex',
    template: 'helpindex.html',
    out: (loc) => helpOut(loc, 'index.html'),
    meta: (loc) => ({ title: helpByLocale[loc].ui.metaTitle, description: helpByLocale[loc].ui.metaDescription }),
    help: { kind: 'index' },
  },
  ...helpShown.topics.map((t) => ({
    ...helpBase,
    id: `help:${t}`,
    template: 'helptopic.html',
    out: (loc) => helpOut(loc, `${t}/index.html`),
    meta: (loc) => {
      const { ui } = helpByLocale[loc];
      return { title: uiText(ui.pageTitle, { title: ui.topics[t].title }), description: ui.topics[t].summary };
    },
    help: { kind: 'topic', topic: t },
  })),
  ...helpShown.articles.map((en) => ({
    ...helpBase,
    id: `help:${en.id}`,
    template: 'helparticle.html',
    out: (loc) => helpOut(loc, `${en.topic}/${en.slug}/index.html`),
    meta: (loc) => {
      const a = helpArticleIn(en.id, loc);
      return { title: uiText(helpByLocale[loc].ui.pageTitle, { title: a.title }), description: a.summary };
    },
    help: { kind: 'article', id: en.id },
  })),
];

/** Everything the build loops over: the manifest, the index, one page per post,
 *  and the help center. */
const allPages = [...PAGES, blogIndexPage, ...blogPages, ...helpPages];

/** "2 September 2026" — the byline's readable half. The machine-readable half
 *  is the raw ISO string in <time datetime>. */
const formatDate = (iso, loc = 'en') => new Intl.DateTimeFormat(loc === 'en' ? 'en-GB' : loc, {
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
  // Privacy and Terms exist in all 23 locales now, so the footer resolves them
  // through the page objects rather than the old two-arm ternary — a Japanese
  // footer that linked to the English policy was correct while only en+de
  // existed and is simply wrong now that /ja/privacy.html is a real page.
  const legalHref = (id) => (pageExistsIn(pageById[id], loc)
    ? urlFor(pageById[id], loc)
    : urlFor(pageById[id], DEFAULT_LOCALE));
  const privacy = legalHref('privacy');
  const terms = legalHref('terms');
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
    // The help center, linked from nowhere until HELP_PUBLIC flips: before that
    // its pages are a noindex preview. A locale with its own help links there;
    // every other one to the English help, and says so like the blog link.
    ...(HELP_PUBLIC ? [helpLocales.includes(loc) && loc !== DEFAULT_LOCALE
      ? `<a href="${helpHome(loc)}">${escapeHtml(c.nav.help)}</a>`
      : `<a href="/help/" hreflang="en" lang="en">${escapeHtml(c.nav.help)}</a>`] : []),
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

/** One consistent footer everywhere, after </main> on every page. */
function renderFooter(loc) {
  return `<footer>
  <div class="wrap cols">
    <div>${content[loc].footer.copyright}</div>
    <div class="flinks">${renderFooterLinks(loc)}</div>
  </div>
</footer>`;
}

/**
 * Where a screenshot lives for a given locale.
 *
 * Screenshots are the one asset that is translated: `shots/<loc>/<name>.webp`
 * when the file exists, `shots/en/` when it does not. Two locales fall back for
 * two different reasons and both end up here — a locale with no capture set at
 * all (ja, ar, …: absent from SHOT_LOCALE) and a single screen no locale has
 * yet (shot-recipes, shot-photos, shot-documents: in shots/en/ only). Missing
 * in both places throws, because a broken <img> is not something to discover in
 * production.
 *
 * Illustrations (`ill-*`) and the logo are not localized and keep their paths.
 * The existence check reads static/, not dist/, because this runs while dist/
 * is still being written.
 */
function imgSrc(name, loc) {
  if (!name.startsWith('shot-')) return `/assets/img/${name}.webp`;
  const dir = loc in SHOT_LOCALE ? loc : DEFAULT_LOCALE;
  for (const d of dir === DEFAULT_LOCALE ? [dir] : [dir, DEFAULT_LOCALE]) {
    const url = `/assets/img/shots/${d}/${name}.webp`;
    if (fs.existsSync(p('static', url.slice(1)))) return url;
  }
  throw new Error(`no screenshot '${name}' in static/assets/img/shots/${dir}/ or shots/${DEFAULT_LOCALE}/ — run tools/make-site-shots.py`);
}

/**
 * The home page's lists (claude-prompts/2026-09-28/bevel-mock/index.html). The
 * words come from content/<loc>.json (home.*, hero.*), the drawing around them
 * — glyphs, tones, positions, photos — from site.config.mjs. Built here rather
 * than looped in landing.html because almost every item carries per-item data
 * the template engine has no index for. A list whose length does not match its
 * data throws, naming the locale: a card rendered half-empty is not something
 * to find in production.
 */
function homeIcon(name, width = 2) {
  if (!(name in HOME_ICONS)) throw new Error(`HOME_ICONS has no '${name}' (${Object.keys(HOME_ICONS).join(', ')})`);
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${HOME_ICONS[name]}</svg>`;
}

function renderHome(loc) {
  const where = `content/${loc}.json`;
  const c = content[loc];
  const h = (key) => lookup(c, key, where);
  const e = escapeHtml;
  const list = (key, n) => {
    const v = h(key);
    if (!Array.isArray(v) || v.length !== n) throw new Error(`${key} in ${where} must have exactly ${n} entries, has ${Array.isArray(v) ? v.length : 'none'}`);
    return v;
  };
  const homeImg = (name) => `/assets/img/home/${name}.webp`;
  const photo = (name, extra = '') => {
    const { width, height } = imageSize(name);
    return `<img src="${homeImg(name)}" alt="" width="${width}" height="${height}" loading="lazy" decoding="async"${extra}>`;
  };
  const ico = (name, tone, style = '') => `<span class="ico c-${tone}"${style ? ` style="${style}"` : ''}>${homeIcon(name)}</span>`;
  const ck = `<span class="ck">${homeIcon('check', 3)}</span>`;
  const fcIn = (icon, tone, t, s, tick) => `<div class="fc-in">${ico(icon, tone)}<span class="fc-tx"><b>${e(t)}</b><span>${e(s)}</span></span>${tick ? ck : ''}</div>`;
  const phone = (shot, { cls = '', style = '', alt = '', eager = false } = {}) => {
    const { width, height } = imageSize(shot);
    return `<div class="phone${cls ? ` ${cls}` : ''}"${style ? ` style="${style}"` : ''}><div class="scr"><img src="${imgSrc(shot, loc)}" alt="${e(alt)}" width="${width}" height="${height}"${eager ? '' : ' loading="lazy"'} decoding="async"></div></div>`;
  };
  // Headline words, one span each, for the intro. A line with no spaces (CJK,
  // Thai) is one word, which is exactly right for those scripts.
  const words = (s) => e(s).split(/\s+/).filter(Boolean).map((w) => `<span class="w">${w}</span>`).join(' ');
  const watch = (cls) => `<div class="watch${cls ? ` ${cls}` : ''}" aria-hidden="true"><div class="band t"></div><div class="band b"></div><div class="case"><span class="crown"></span><div class="face">
        <div class="t1"><span>${e(h('home.watch.upNext'))}</span><span>09:41</span></div>
        <div class="ev"><b>${e(h('home.watch.ev'))}</b><span>${e(h('home.watch.evs'))}</span></div>
        <div class="ev2"><i></i>${e(h('home.watch.list'))}</div>
      </div></div></div>`;
  const num = (n, digits = 0) => new Intl.NumberFormat(loc, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);
  const fill = (key, vars) => {
    const s = h(key);
    for (const k of Object.keys(vars)) {
      if (s.split(`{${k}}`).length !== 2) throw new Error(`${key} in ${where} must contain {${k}} exactly once`);
    }
    return s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  };

  // ---- hero ----
  // The phone plays the seven scenes (home.js). Every screenshot is in the
  // markup, the first on top; the cards of scene 1 are the only ones shown
  // without JavaScript or with reduced motion, unticked.
  const scenes = list('home.hero.scenes', HERO_SCENES.length);
  const heroShots = HERO_SCENES.map((sc, i) => {
    if (scenes[i].id !== sc.id) throw new Error(`home.hero.scenes[${i}].id in ${where} is '${scenes[i].id}', HERO_SCENES says '${sc.id}' — the id is data, never translated`);
    const { width, height } = imageSize(sc.shot);
    return `<img class="hs" data-scene="${i}" src="${imgSrc(sc.shot, loc)}" alt="" width="${width}" height="${height}"${i ? ' loading="lazy"' : ''} decoding="async">`;
  }).join('');
  const heroPhone = `<div class="phone hphone" aria-hidden="true"><div class="scr">${heroShots}</div></div>`;
  const heroCards = HERO_SCENES.map((sc, i) => {
    if (!Array.isArray(scenes[i].cards) || scenes[i].cards.length !== 3) throw new Error(`home.hero.scenes[${i}].cards in ${where} must have exactly 3 entries`);
    return scenes[i].cards.map((card, k) => `      <div class="fc hcard" data-scene="${i}" data-k="${k}" aria-hidden="true">${fcIn(sc.cards[k][0], sc.cards[k][1], card.t, card.s, true)}</div>`).join('\n');
  }).join('\n');
  const works = list('home.works.items', WORKS_ICONS.length)
    .map((t, i) => `      <span class="wk">${homeIcon(WORKS_ICONS[i])}${e(t)}</span>`).join('\n');
  // The rating row: RATING's number as the store shows it, in this page's
  // number format. The last star is filled by the fraction (4.7 -> 70 %).
  let rating = '';
  if (RATING) {
    const r = num(RATING.value, 1);
    const stars = [0, 1, 2, 3, 4].map((i) => {
      const f = Math.max(0, Math.min(1, RATING.value - i));
      return `<span class="star">${homeIcon('star')}<span class="sf" style="width:${Math.round(f * 100)}%">${homeIcon('star')}</span></span>`;
    }).join('');
    rating = `      <a class="rating" href="${e(RATING.url)}" target="_blank" rel="noopener" data-hi data-rating="${RATING.value}"><span class="stars" role="img" aria-label="${e(fill('home.hero.ratingAlt', { rating: r }))}">${stars}</span><span class="rt">${e(fill('home.hero.rating', { rating: r }))}</span></a>`;
  }

  // ---- members ----
  const badges = list('home.members.badges', MEMBER_BADGES.length).map((b, i) =>
    `        <div class="badge">${ico(MEMBER_BADGES[i].icon, MEMBER_BADGES[i].tone)}<div><b>${e(b.t)}</b><span>${e(b.s)}</span></div></div>`).join('\n');
  const h2a = h('home.members.h2a');
  if (h2a.split('{count}').length !== 2) throw new Error(`home.members.h2a in ${where} must contain {count} exactly once`);
  const count = new Intl.NumberFormat(loc).format(MEMBERS_COUNT);
  const membersH2 = `${e(h2a).replace('{count}', `<span data-count="${MEMBERS_COUNT}">${count}</span>`)}<br>${e(h('home.members.h2b'))}`;
  const cards = list('home.members.cards', MEMBER_CARDS.length);
  const tiles = list('home.members.tiles', MEMBER_TILES_AFTER.length);
  const tileHtml = [
    `<div class="mcard tile g-lake">${ico('cal', 'lake')}<div><div class="big">${e(tiles[0].big)}</div><b>${e(tiles[0].t)}</b></div></div>`,
    `<div class="mcard tile g-honey"><img src="${homeImg('minzi_sit')}" alt="" width="120" height="120" loading="lazy" decoding="async"><div><b>${e(tiles[1].t)}</b></div></div>`,
  ];
  const row = [];
  cards.forEach((card, i) => {
    const d = MEMBER_CARDS[i];
    row.push(`<div class="mcard">${photo(d.photo, ' class="ph"')}<div class="cap">${e(card.cap)}</div><div class="ov"><div class="fc${d.done ? ' done' : ''}">${fcIn(d.icon, d.tone, card.t, card.s, true)}</div></div></div>`);
    const k = MEMBER_TILES_AFTER.indexOf(i);
    if (k !== -1) row.push(tileHtml[k]);
  });
  // Twice, for the endless loop: the CSS moves the track by exactly one set.
  // The copy is hidden from screen readers, so the row is read once.
  const marquee = `      <div class="marq-set">${row.join('')}</div>\n      <div class="marq-set" aria-hidden="true">${row.join('')}</div>`;

  // ---- start the day ----
  // Six cards. Each widget is wider than its phone (home.css .dv .fc) and
  // moves with its own parallax — except the habits one, which sits exactly on
  // the screenshot's own Family-energy card, so phone and widget move as one.
  const day = list('home.day.cards', DAY_CARDS.length);
  // The energy card's centre, in % of the phone's height: the frame is 3.667 %
  // of the phone's width on each side (home.css), the screen is the rest.
  const frameY = 3.667 * (640 / 1390);
  const energyAt = (frameY + (HABITS_ENERGY.top + HABITS_ENERGY.height / 2) * (100 - 2 * frameY) / 100).toFixed(2);
  const dayCards = DAY_CARDS.map((d, i) => {
    const c = day[i];
    const widget = d.energy
      ? `<div class="fc energy-w" style="top:${energyAt}%" aria-hidden="true"><div class="fc-in energy"><div class="en-top"><img src="${homeImg('minzi_jump')}" alt="" width="40" height="40"><span class="fc-tx"><b>${e(c.t)}</b><span>${e(c.s)}</span></span></div><div class="en-bar"><div class="bar"></div></div></div></div>`
      : `<div class="fc fly${d.done ? ' done' : ''}" aria-hidden="true">${fcIn(d.icon, d.tone, c.t, c.s, Boolean(d.done))}</div>`;
    return `        <article class="fcard g-${d.tint}" data-r><h3>${e(c.h3)}</h3><p>${e(c.p)}</p>
          <div class="dv${d.energy ? ' par' : ''}">${phone(d.shot, { cls: d.energy ? '' : 'par' })}${widget}</div></article>`;
  }).join('\n');
  // The orbit: three rings at equal steps, the tiles on them. Its box is the
  // outer ring's diameter; a tile's place is a % of that box.
  const box = ORBIT_RINGS[ORBIT_RINGS.length - 1] * 2;
  const orbit = ORBIT_TILES.map((t) => {
    const rad = (t.a * Math.PI) / 180;
    const R = ORBIT_RINGS[t.ring];
    const x = (50 + (Math.sin(rad) * R * 100) / box).toFixed(2);
    const y = (50 - (Math.cos(rad) * R * 100) / box).toFixed(2);
    return `<div class="tile" style="left:${x}%;top:${y}%"><div class="tile-in" style="--r:${t.r}deg;color:${t.color}">${homeIcon(t.icon)}</div></div>`;
  }).join('');
  const rings = ORBIT_RINGS.map((R) => `<div class="ring" style="width:${R * 2}px;height:${R * 2}px;margin:-${R}px 0 0 -${R}px"></div>`).join('');
  // Apple's calendar icon, drawn: a white tile with a red top and a date. Not
  // Apple's logo.
  const appleCal = '<span class="ico ico-acal"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="4.5" fill="#fff" stroke="#E3E3E3"/><path d="M2.5 7a4.5 4.5 0 0 1 4.5-4.5h10A4.5 4.5 0 0 1 21.5 7v1.5h-19z" fill="#E8453C"/><rect x="7" y="11" width="10" height="1.8" rx=".9" fill="#1C1C1E"/><rect x="7" y="14.6" width="10" height="1.8" rx=".9" fill="#1C1C1E"/><rect x="7" y="18.2" width="6" height="1.8" rx=".9" fill="#1C1C1E"/></svg></span>';
  const calendarsVis = `<div class="orbit" aria-hidden="true" style="width:${box}px;height:${box}px;margin:-${box / 2}px 0 0 -${box / 2}px">${rings}${orbit}</div>${phone('shot-calendar', { cls: 'cal-phone' })}<div class="cal-cards" aria-hidden="true"><div class="fc">${fcIn('cal', 'lake', h('home.calendars.t'), h('home.calendars.s'), false)}</div><div class="fc"><div class="fc-in">${appleCal}<span class="fc-tx"><b>${e(h('home.calendars.apple.t'))}</b><span>${e(h('home.calendars.apple.s'))}</span></span></div></div></div>`;

  // ---- Daili Plus ----
  const avatars = [0, 1, 2].map(() => HOME_FAMILY.map((m) =>
    `<div class="av"><div class="ring-av"><img src="${homeImg(`av-${m.av}`)}" alt="" width="200" height="200" loading="lazy" decoding="async"></div><span class="nm">${e(m.name)}</span></div>`).join('')).join('');
  const aiHead = (s) => `<div class="hd">${homeIcon('spark')}${e(s)}</div>`;
  const aiRow = (icon, tone, t, s) => `<div class="row">${ico(icon, tone, 'width:30px;height:30px')}<div><b>${e(t)}</b><span>${e(s)}</span></div></div>`;
  const rows = list('home.plus.letter.rows', 3);
  // The phone and its card sit in .ifix: in the card on a phone, with reduced
  // motion or without JavaScript; fixed in the middle of the screen, clipped
  // by each passing card, once home.js turns the section to .fx.
  const icard = (tone, key, shot, pos, inner) => `      <article class="icard i-${tone}"><div class="tx"><h3>${e(h(`home.plus.${key}.h3`))}</h3><p>${e(h(`home.plus.${key}.p`))}</p></div>
        <div class="vis"><div class="ifix">${phone(shot)}<div class="ai-card" style="${pos}" aria-hidden="true">${inner}</div></div></div></article>`;
  const icards = [
    icard('berry', 'video', 'shot-recipes', 'top:180px',
      `${aiHead(h('home.plus.video.hd'))}<div class="vid"><span>${homeIcon('play')}</span></div><div class="ttl">${e(h('home.plus.video.title'))}</div>${aiRow('meal', 'clay', h('home.plus.video.t'), h('home.plus.video.s'))}`),
    icard('clay', 'letter', 'shot-calendar', 'top:160px',
      `${aiHead(h('home.plus.letter.hd'))}${aiRow('cal', 'lake', rows[0].t, rows[0].s)}${aiRow('people', 'berry', rows[1].t, rows[1].s)}${aiRow('photo', 'honey', rows[2].t, rows[2].s)}<span class="add">${e(h('home.plus.letter.add'))}</span>`),
    icard('leaf', 'ideas', 'shot-mealplan', 'top:190px',
      `${aiHead(h('home.plus.ideas.hd'))}<div class="ttl">${e(h('home.plus.ideas.title'))}</div>${aiRow('meal', 'leaf', h('home.plus.ideas.t'), h('home.plus.ideas.s'))}<span class="add">${e(h('home.plus.ideas.add'))}</span>`),
  ].join('\n');

  // ---- workflows ----
  const items = list('home.flow.items', FLOW_STEPS.length);
  const toasts = list('home.flow.toasts', FLOW_STEPS.length);
  const prog = '<svg class="prog" viewBox="0 0 26 26" aria-hidden="true"><circle class="bg" cx="13" cy="13" r="11"/><circle class="fg" cx="13" cy="13" r="11"/></svg>';
  const flowList = items.map((it, i) => `          <button class="fl${i === 0 ? ' on' : ''}" type="button" data-fl="${i}" data-tint="${FLOW_STEPS[i].tint}"><span class="tp">${ico(FLOW_STEPS[i].icon, FLOW_STEPS[i].tone)}<b>${e(it.t)}</b>${prog}</span><span class="desc"><span>${e(it.d)}</span></span></button>`).join('\n');
  // The overlays sit on the screenshot at the mock's measured places (% of the
  // screen), physical left on purpose: the screenshot does not mirror in /ar/.
  // Step 1's overlays carry .go in the markup, so a reader without JavaScript
  // sees step 1 finished; home.js restarts them per step.
  // A step with a clip shows it instead of the screenshot and loses its drawn
  // overlay (round 3). preload="none" and no autoplay: home.js plays it only
  // on screen, tab visible, no reduced motion, no Save-Data; else the poster.
  const shots = FLOW_STEPS.map((s, i) => {
    if (s.video) {
      for (const ext of ['mp4', 'webp']) {
        if (!fs.existsSync(p(`static/assets/video/${s.video}.${ext}`))) throw new Error(`FLOW_STEPS[${i}].video: static/assets/video/${s.video}.${ext} does not exist`);
      }
      const { width, height } = FLOW_VIDEO_SIZE;
      return `<video class="sx${i === 0 ? ' on' : ''}" data-sx="${i}" data-flow-video src="/assets/video/${s.video}.mp4" poster="/assets/video/${s.video}.webp" width="${width}" height="${height}" muted playsinline preload="none"></video>`;
    }
    const { width, height } = imageSize(s.shot);
    return `<img class="sx${i === 0 ? ' on' : ''}" data-sx="${i}" src="${imgSrc(s.shot, loc)}" alt="" width="${width}" height="${height}" loading="lazy" decoding="async">`;
  }).join('');
  const tap = (i, style) => (FLOW_STEPS[i].video ? '' : `<span class="tap" data-ov="${i}" style="${style}">${homeIcon('check', 3)}</span>`);
  const pill = FLOW_STEPS[0].video ? '' : `<span class="pillev go" data-ov="0" style="left:20%;top:75.5%;width:24%">${e(h('home.flow.pill'))}</span>`;
  const flowVis = `        <div class="bgc" data-bgc style="background:${FLOW_STEPS[0].tint}"></div>
        <div class="phone" aria-hidden="true"><div class="scr">${shots}${pill}${tap(1, 'left:11.5%;top:23.2%')}${tap(2, 'left:11.5%;top:28.5%')}${tap(3, 'left:87%;top:75%')}</div></div>
${toasts.map((t, i) => `        <div class="fc toast${i === 0 ? ' go' : ''}" data-to="${i}" aria-hidden="true">${fcIn(FLOW_STEPS[i].toast, FLOW_STEPS[i].toastTone, t.t, t.s, false)}</div>`).join('\n')}
        <img class="jump" data-jump src="${homeImg('minzi_jump')}" alt="" width="120" height="120" loading="lazy" decoding="async">`;

  // ---- every screen ----
  // The widgets, drawn after the light variants of the app's own
  // (ios/FamCanvasWidgets: CalendarWidget small, ShoppingWidget small,
  // HabitsWidget medium). The date is the build date in this page's language.
  const wgItems = list('home.screens.widgets.items', 3);
  const cal = scenes[0].cards;
  const habitCards = scenes[3].cards;
  const today = new Date(`${BUILD_DATE}T12:00:00Z`);
  const weekday = new Intl.DateTimeFormat(loc, { weekday: 'long', timeZone: 'UTC' }).format(today);
  const dayNum = new Intl.DateTimeFormat(loc, { day: 'numeric', timeZone: 'UTC' }).formatToParts(today).find((pt) => pt.type === 'day').value;
  const W = HOME_WIDGETS;
  const wNext = `<div class="wgt wgt-s wgt-next"><div class="wn-top"><div><span class="wn-day">${e(weekday)}</span><span class="wn-num">${e(dayNum)}</span></div><span class="wn-add">${homeIcon('plus', 2.6)}</span></div>
            ${[cal[0].t, cal[2].t].map((t, i) => `<div class="wn-ev"><i style="background:${W.next[i].color}"></i><div><b>${e(t)}</b><span>${W.next[i].time}</span></div></div>`).join('')}</div>`;
  const wShop = `<div class="wgt wgt-s wgt-shop"><span class="ws-chip">${homeIcon('cart', 2.2)}${e(h('home.screens.widgets.groceries'))}</span><b class="ws-n">${e(fill('home.screens.widgets.toBuy', { count: num(W.toBuy) }))}</b>
            ${wgItems.slice(0, 2).map((t) => `<div class="ws-row"><i></i><span>${e(t)}</span></div>`).join('')}</div>`;
  const doneCount = W.habits.filter((r) => !r.ring).length;
  const wHabits = `<div class="wgt wgt-m wgt-habits"><div class="wh-minzi"><img src="${homeImg('minzi_sit')}" alt="" width="120" height="120" loading="lazy" decoding="async"><span class="wh-bar"><i style="width:${Math.round((W.energy[0] / W.energy[1]) * 100)}%"></i></span><span class="wh-en">${e(fill('home.screens.widgets.energy', { n: num(W.energy[0]), max: num(W.energy[1]) }))}</span></div>
            <div class="wh-list"><div class="wh-head"><b>${e(h('home.screens.widgets.habits'))}</b><span>${num(doneCount)}/${num(W.habits.length)}</span></div>
            ${W.habits.map((r, i) => `<div class="wh-row"><span class="wh-ring${r.ring ? '' : ' done'}">${r.ring ? e(r.ring) : homeIcon('check', 3)}</span><span class="wh-name">${e(habitCards[i].t)}</span><span class="wh-av" style="background:${r.color}">${e(HOME_FAMILY[r.who].name.slice(0, 1))}</span></div>`).join('')}</div></div>`;
  const { width: ww, height: wh } = imageSize('web-');
  const bento = [
    `        <article class="bx g-leaf" data-r><h3>${e(h('home.screens.watch.h3'))}</h3><p>${e(h('home.screens.watch.p'))}</p>${watch('bx-watch')}</article>`,
    `        <article class="bx g-berry" data-r><h3>${e(h('home.screens.widgets.h3'))}</h3><p>${e(h('home.screens.widgets.p'))}</p>
          <div class="wgrid" aria-hidden="true">${wNext}${wShop}${wHabits}</div></article>`,
    `        <article class="bx span2 g-honey" data-r><h3>${e(h('home.screens.web.h3'))}</h3><p>${e(h('home.screens.web.p'))}</p>
          <div class="browser"><div class="bar" aria-hidden="true"><i></i><i></i><i></i><span>app.daili.app</span></div><img src="${imgSrc('web-calendar', loc)}" alt="${e(h('home.screens.web.alt'))}" width="${ww}" height="${wh}" loading="lazy" decoding="async"></div></article>`,
    `        <article class="bx span2 g-lake bx-low bx-tab" data-r><h3>${e(h('home.screens.tablet.h3'))}</h3><p>${e(h('home.screens.tablet.p'))}</p>
          <div class="tablet"><div class="tab-scr"><img src="${imgSrc('web-calendar', loc)}" alt="${e(h('home.screens.tablet.alt'))}" width="${ww}" height="${wh}" loading="lazy" decoding="async"></div></div></article>`,
    `        <article class="bx span2 g-clay bx-low" data-r><h3>${e(h('home.screens.phones.h3'))}</h3><p>${e(h('home.screens.phones.p'))}</p>
          <div class="phones" aria-hidden="true">${phone('shot-birthdays', { cls: 'tilt-a' })}${phone('shot-notes', { cls: 'tilt-b' })}</div></article>`,
  ].join('\n');

  // ---- privacy, care ----
  const glass = list('home.privacy.chips', PRIVACY_ICONS.length)
    .map((t, i) => `        <span>${homeIcon(PRIVACY_ICONS[i])}${e(t)}</span>`).join('\n');
  const mosaic = MOSAIC.map((col) => `      <div class="mcol" data-speed="${col.speed}" style="margin-top:${col.top}px">${col.photos.map(([p, ht]) => `<div style="height:${ht}px">${photo(p)}</div>`).join('')}</div>`).join('\n');

  // ---- reviews: real ones only, and only from three up ----
  // A moving row of cards: five stars (the first `stars` filled), the title
  // and text in the review's own language, first name · source · date (in
  // this page's date format). §15 matches every card back to REVIEWS.
  let reviews = '';
  if (REVIEWS.length >= 3) {
    const date = new Intl.DateTimeFormat(loc, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
    const rv = REVIEWS.map((r) => {
      for (const k of ['title', 'text', 'name', 'source', 'stars', 'lang', 'date']) {
        if (!(k in r)) throw new Error(`REVIEWS entry ${JSON.stringify(r).slice(0, 60)} has no '${k}'`);
      }
      if (!Number.isInteger(r.stars) || r.stars < 1 || r.stars > 5) throw new Error(`REVIEWS entry '${r.title}': stars must be 1..5, is ${r.stars}`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(r.date)) throw new Error(`REVIEWS entry '${r.title}': date must be YYYY-MM-DD, is ${r.date}`);
      const stars = [0, 1, 2, 3, 4].map((i) => `<span class="${i < r.stars ? 'on' : 'off'}">${homeIcon('star')}</span>`).join('');
      const when = date.format(new Date(`${r.date}T12:00:00Z`));
      return `<article class="rv" data-review="${e(r.title)}"><div class="st" role="img" aria-label="${num(r.stars)}/${num(5)}">${stars}</div><b lang="${e(r.lang)}">${e(r.title)}</b><div class="who"><span lang="${e(r.lang)}">${e(r.name)}</span> · ${e(r.source)} · <time datetime="${r.date}">${e(when)}</time></div><p lang="${e(r.lang)}">${e(r.text)}</p></article>`;
    }).join('');
    reviews = `  <section class="revs" id="reviews"><div class="marq"><div class="marq-track marq-slow"><div class="marq-set">${rv}</div><div class="marq-set" aria-hidden="true">${rv}</div></div></div></section>\n`;
  }

  // ---- the flat-lay ----
  const flat = `${FLAT_OBJECTS.map((o) => `        <div class="obj" data-obj data-fx="${o.fx}" data-fy="${o.fy}" data-rot="${o.rot}" style="inset-inline-start:${o.start}%;top:${o.top}px;width:${o.w}px;transform:rotate(${o.rot}deg)">${photo(o.obj)}</div>`).join('\n')}
        ${phone('shot-home', { cls: 'fphone' })}`;

  return {
    h1: `${words(h('hero.h1a'))}<br>${words(h('hero.h1b'))}`,
    checkIcon: homeIcon('check'),
    sparkIcon: homeIcon('spark'),
    globeIcon: homeIcon('globe'),
    heroPhone,
    heroWatch: watch('hwatch'),
    heroCards, rating, works, badges, membersH2, marquee,
    dayCards, calendarsVis,
    avatars, icards, flowList, flowVis, bento, glass, mosaic, reviews, flat,
  };
}

/**
 * The FAQ. Rendered here rather than looped in the template for one reason: the
 * first question is open on load, as in the mock, and the template engine's
 * `{{# }}` has no index. A page whose FAQ is eight identical closed rows reads
 * as a wall of chrome; one open answer shows the reader what they are.
 */
function renderFaq(loc) {
  const where = `content/${loc}.json`;
  const items = lookup(content[loc], 'faq.items', where);
  return items.map((item, i) => {
    for (const k of ['q', 'a']) {
      if (!(k in item)) throw new Error(`missing field '${k}' in faq.items[${i}] in ${where}`);
    }
    // .a carries inline <a> markup in every locale, so it is written raw — the
    // tag parity between locales is what check-content.mjs guards.
    return `      <details${i === 0 ? ' open' : ''}><summary>${escapeHtml(item.q)}</summary><p>${item.a}</p></details>`;
  }).join('\n');
}

// ---------------------------------------------------------------------------
// help center
// ---------------------------------------------------------------------------

/**
 * The topic glyphs, keyed by the HELP_ICONS vocabulary. The app maps the same
 * names to its own icons; these are the site's drawings of them. A name in
 * HELP_ICONS with no glyph here throws, so the vocabulary cannot grow on one
 * side only.
 */
const HELP_GLYPHS = {
  start: '<path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z"/>',
  people: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.2a6.5 6.5 0 0 1 3.5 5.8"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  list: '<path d="M10 6h10M10 12h10M10 18h10M4 6l1.2 1.2L7.5 5M4 12l1.2 1.2L7.5 11M4 18l1.2 1.2L7.5 17"/>',
  meal: '<path d="M6 3v7a2 2 0 0 0 2 2v9M10 3v7a2 2 0 0 1-2 2M8 3v5M18 21V3c-2 1-3.5 3.5-3.5 7v4H18"/>',
  cake: '<path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8M4 16h16M12 11V7M12 7a2 2 0 1 0 0-4"/>',
  paw: '<circle cx="5.5" cy="10" r="1.8"/><circle cx="9.5" cy="5.5" r="1.8"/><circle cx="14.5" cy="5.5" r="1.8"/><circle cx="18.5" cy="10" r="1.8"/><path d="M12 11c-3 0-5.5 3.5-5.5 6a3 3 0 0 0 3 3c1 0 1.6-.5 2.5-.5s1.5.5 2.5.5a3 3 0 0 0 3-3c0-2.5-2.5-6-5.5-6z"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  widget: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  note: '<path d="M5 3h10l4 4v14H5z"/><path d="M15 3v4h4M8.5 12h7M8.5 16h5"/>',
};
for (const name of HELP_ICONS) {
  if (!(name in HELP_GLYPHS)) throw new Error(`HELP_ICONS has '${name}' but build.mjs HELP_GLYPHS has no drawing for it`);
}
const helpIcon = (name) => `<span class="help-ico" aria-hidden="true"><svg viewBox="0 0 24 24">${HELP_GLYPHS[name]}</svg></span>`;
const CHEVRON = '<svg class="help-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';

/** A file's cache-buster. Help pictures are re-shot under the same name and
 *  images are cached for 30 days, so the URL has to change when the bytes do. */
const fileSha8 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 8);

/**
 * Every unhashed file a page names that can change in place — the home page's
 * pictures, the screenshots, the vendor scripts, the flow clips and their
 * posters — gets `?v=<sha8 of the file>` (009 C). The 30-day image and
 * one-week script caches stay; a changed file simply has a new URL. Run over
 * the finished HTML so no template or renderer can forget one.
 */
const assetVersions = new Map();
function versionAssets(html) {
  return html.replace(/((?:src|href|poster)=")(\/assets\/(?:img|vendor|video)\/[^"?#]+)"/g, (m, attr, url) => {
    if (!assetVersions.has(url)) {
      const file = p('static', url.slice(1));
      if (!fs.existsSync(file)) throw new Error(`a page names ${url}, which is not in static/`);
      assetVersions.set(url, fileSha8(file));
    }
    return `${attr}${url}?v=${assetVersions.get(url)}"`;
  });
}

/** Site-absolute URL of a help media file, with its ?v= cache-buster. */
function helpMediaUrl(file, locale = 'en') {
  return `/help/media/${locale}/${file}?v=${fileSha8(path.join(HELP_ROOT, 'static/help/media', locale, file))}`;
}

/** Article text: escaped, then **bold** — the only inline markup there is. */
const helpInline = (s) => escapeHtml(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

/** Plain text of an article's body, for the search index. */
const helpPlain = (a) => a.blocks.map((b) => (b.type === 'steps' ? b.items.join(' ') : b.text || ''))
  .join(' ').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();

const helpRow = (a, loc) => `      <li><a class="help-row" href="${helpArticleUrl(a, loc)}"><span><b>${escapeHtml(a.title)}</b><small>${escapeHtml(a.summary)}</small></span>${CHEVRON}</a></li>`;

/** support@daili.app as a link, for the _ui.json strings that name it. */
const SUPPORT_MAIL = '<a href="mailto:support@daili.app">support@daili.app</a>';

/**
 * Everything a help page's template needs, pre-rendered, in the page's locale.
 * The template engine has one level of loops and no conditionals inside them,
 * and a help page is nested lists all the way down — the same reason the story
 * and the FAQ are rendered here rather than in their templates. `ui` is the
 * locale's _ui.json, for the template's plain strings.
 */
function renderHelp(spec, loc) {
  const h = helpByLocale[loc];
  const { ui } = h;
  const shownLoc = helpShownByLocale[loc];
  const shown = shownLoc.articles;
  const row = (a) => helpRow(a, loc);
  const common = {
    ui,
    home: helpHome(loc),
    stuckBody: uiHtml(ui.stuckBody, { writeToUs: `<a href="mailto:support@daili.app">${escapeHtml(ui.writeToUs)}</a>` }),
  };

  if (spec.kind === 'index') {
    const newOnes = shown.filter((a) => a.since === LIVE_APP_VERSION);
    const newSection = newOnes.length ? `  <section class="help-new" aria-labelledby="help-new-h">
    <h2 id="help-new-h">${uiHtml(ui.newInVersion, { version: escapeHtml(LIVE_APP_VERSION) })}</h2>
    <ul class="help-list">
${newOnes.map(row).join('\n')}
    </ul>
  </section>` : '';

    const plural = new Intl.PluralRules(loc);
    const cards = shownLoc.topics.map((t) => {
      const count = shown.filter((a) => a.topic === t).length;
      const countLabel = uiHtml(ui.articleCount[plural.select(count)], { n: String(count) });
      return `      <li><a class="help-card" href="${helpHome(loc)}${t}/">${helpIcon(HELP_TOPICS[t].icon)}<b>${escapeHtml(ui.topics[t].title)}</b><small>${countLabel}</small></a></li>`;
    }).join('\n');

    // The search index, as data. type="application/json" is never executed,
    // so the CSP (script-src 'self' + one hash) does not have to change and
    // nothing is fetched. `<` is escaped so no string in it can close the tag.
    const index = shown.map((a) => ({
      url: helpArticleUrl(a, loc),
      title: a.title,
      summary: a.summary,
      topic: ui.topics[a.topic].title,
      keywords: a.keywords.join(' '),
      text: helpPlain(a),
    }));
    return {
      ...common,
      newSection,
      cards,
      noResult: uiHtml(ui.noResult, { email: SUPPORT_MAIL }),
      indexJson: JSON.stringify(index).replace(/</g, '\\u003c'),
      minziSrc: `/help/media/minzi-look-right.webp?v=${fileSha8(p('static/help/media/minzi-look-right.webp'))}`,
    };
  }

  if (spec.kind === 'topic') {
    const t = ui.topics[spec.topic];
    return {
      ...common,
      title: t.title,
      summary: t.summary,
      icon: helpIcon(HELP_TOPICS[spec.topic].icon),
      rows: shown.filter((a) => a.topic === spec.topic).map(row).join('\n'),
    };
  }

  const a = helpArticleIn(spec.id, loc);
  const body = a.blocks.map((b) => {
    if (b.type === 'p') return `  <p>${helpInline(b.text)}</p>`;
    if (b.type === 'note') return `  <p class="help-note"><b>${escapeHtml(ui.note)}</b> ${helpInline(b.text)}</p>`;
    if (b.type === 'steps') {
      return `  <ol class="help-steps">\n${b.items.map((it) => `    <li>${helpInline(it)}</li>`).join('\n')}\n  </ol>`;
    }
    const { m, locale } = mediaFor(h, b.media);
    return `  <figure class="help-fig">
    <img src="${helpMediaUrl(m.file, locale)}" alt="${escapeHtml(b.alt)}" width="${m.w}" height="${m.h}" decoding="async">
    <figcaption>${escapeHtml(b.alt)}</figcaption>
  </figure>`;
  }).join('\n');

  // Related articles the reader can open today — one the live app does not
  // have yet has no page to link to.
  const related = a.related.map((id) => shown.find((x) => x.id === id)).filter(Boolean);
  return {
    ...common,
    id: a.id,
    topicHref: `${helpHome(loc)}${a.topic}/`,
    topicTitle: ui.topics[a.topic].title,
    title: a.title,
    summary: a.summary,
    body,
    related: related.length ? `  <section class="help-related" aria-labelledby="help-related-h">
    <h2 id="help-related-h">${escapeHtml(ui.related)}</h2>
    <ul class="help-list">
${related.map(row).join('\n')}
    </ul>
  </section>` : '',
    updated: a.updated,
    updatedLabel: formatDate(a.updated, loc),
  };
}

/**
 * help/<locale>.json — the app's copy of the help center, one per built
 * locale, all in schema 1. Every article, whatever its `since`: the app hides
 * what is newer than itself. Image blocks become absolute URLs with their size
 * (the locale's own picture if it has one, else the English one), so the app
 * can lay a picture out before it has loaded. Tip and checklist titles are the
 * locale's words; everything else comes from English.
 */
function buildHelpJson(h) {
  const src = (id, key = 'file') => {
    const { m, locale } = mediaFor(h, id);
    return `${BASE_URL}${helpMediaUrl(m[key], locale)}`;
  };
  const block = (b) => {
    if (b.type !== 'image') return b;
    const { m } = mediaFor(h, b.media);
    return m.kind === 'clip'
      ? { type: 'clip', src: src(b.media), poster: src(b.media, 'poster'), alt: b.alt, w: m.w, h: m.h }
      : { type: 'image', src: src(b.media), alt: b.alt, w: m.w, h: m.h };
  };
  const arts = h.articles;
  const mediaSrc = (id) => src(id);
  return {
    schema: 1,
    locale: h.locale,
    generated: new Date().toISOString(),
    liveAppVersion: LIVE_APP_VERSION,
    topics: Object.entries(HELP_TOPICS)
      .filter(([t]) => arts.some((a) => a.topic === t))
      .map(([id, t]) => ({ id, title: h.ui.topics[id].title, icon: t.icon, summary: h.ui.topics[id].summary, articles: arts.filter((a) => a.topic === id).map((a) => a.id) })),
    articles: arts.map((a) => ({
      id: a.id, topic: a.topic, title: a.title, summary: a.summary, keywords: a.keywords,
      routes: a.routes, tryIt: a.tryIt, since: a.since, updated: a.updated,
      blocks: a.blocks.map(block), related: a.related,
    })),
    tips: arts.filter((a) => a.tip).map((a) => ({
      id: a.id, article: a.id, title: a.tip.title, body: a.tip.body, skipIf: a.tip.skipIf,
      priority: a.tip.priority, since: a.since, media: a.media ? mediaSrc(a.media) : null,
    })),
    checklist: arts.filter((a) => a.checklist).sort((x, y) => x.checklist.order - y.checklist.order)
      .map((a) => ({ order: a.checklist.order, article: a.id, title: a.title, doneIf: a.checklist.doneIf, tryIt: a.tryIt })),
  };
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

// Every copy is world-readable (dirs 755, files 644), whatever the working
// tree's mode: deploy.sh's rsync keeps the source mode, and a file saved 600
// here was a 403 on the server (assets/img/home/qr.svg, found in 009).
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  fs.chmodSync(dest, 0o755);
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dest, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else { fs.copyFileSync(s, d); fs.chmodSync(d, 0o644); }
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
  // The home page's own stylesheet and motion script, hashed the same way.
  // Only the landing page loads them, after the three vendor scripts
  // (static/assets/vendor/, unhashed: their names carry no version, and they
  // change only with a deliberate upgrade).
  const hashed = (name, ext) => {
    const buf = fs.readFileSync(p(`static/assets/${name}.${ext}`));
    const out = `${name}.${sha8(buf)}.${ext}`;
    fs.renameSync(path.join(DIST, `assets/${name}.${ext}`), path.join(DIST, 'assets', out));
    return `/assets/${out}`;
  };
  const homeCssHref = hashed('home', 'css'), homeJsHref = hashed('home', 'js');
  const homeScripts = ['/assets/vendor/gsap.min.js', '/assets/vendor/ScrollTrigger.min.js', '/assets/vendor/lenis.min.js', homeJsHref]
    .map((src) => `<script src="${src}" defer></script>`).join('\n');
  // The help search and the "Was this helpful?" counts, hashed the same way.
  // Loaded by /help/ and the articles. The endpoint goes in before hashing;
  // HELP_EVENTS_URL points it at a local mock for a test build only, and
  // check-build fails any build that doesn't carry the real one.
  const helpEventsUrl = process.env.HELP_EVENTS_URL || HELP_EVENTS_URL;
  if (helpEventsUrl !== HELP_EVENTS_URL) console.warn(`!! HELP_EVENTS_URL=${helpEventsUrl} — a test build, never deploy it`);
  const helpJs = Buffer.from(fs.readFileSync(p('static/assets/help-search.js'), 'utf8')
    .replace('__HELP_EVENTS_URL__', helpEventsUrl));
  const helpJsName = `help-search.${sha8(helpJs)}.js`;
  fs.rmSync(path.join(DIST, 'assets/help-search.js'));
  fs.writeFileSync(path.join(DIST, 'assets', helpJsName), helpJs);
  const helpSearchHref = `/assets/${helpJsName}`;

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
        // Only help pages have `help`, pre-rendered for their kind.
        ...(pg.help ? { help: renderHelp(pg.help, loc) } : {}),
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
          // The class on <html> for the landing page: light only, smooth scroll
          // (Lenis) and no native smooth scroll-behavior. `html:has(.home)`
          // would do it without a class and is not an option: Firefox ESR 115
          // ships no :has().
          htmlClass: pg.id === 'landing' ? 'landing' : '',
          cssHref, jsHref, helpSearchHref,
          homeHref: dirFor(loc),
          // The header's section links (#features, #plus, …) point into the
          // home page: bare anchors on it, <home>#… everywhere else.
          anchorBase: pg.id === 'landing' ? '' : dirFor(loc),
          homeCss: pg.id === 'landing' ? `<link rel="stylesheet" href="${homeCssHref}">` : '',
          supportHref: pageExistsIn(pageById.support, loc) ? urlFor(pageById.support, loc) : '/support.html',
          langNav: renderLangNav(pg, loc),
          footerLinks: renderFooterLinks(loc),
          footerHtml: renderFooter(loc),
          // Every page closes with the footer after <main>.
          siteFooter: true,
          legalBody,
          postBody,
          webAppUrl: WEB_APP_URL,
          home: pg.id === 'landing' ? renderHome(loc) : {},
          faq: pg.id === 'landing' ? renderFaq(loc) : '',
          headExtra: '',
        },
      };
      data.page.headExtra = renderHead(pg, loc, cssHref, isRootLanding ? detector : null, postBody)
        + (pg.id === 'landing' ? `\n${homeScripts}` : '');

      const body = render(templates[pg.template], data, includes, where);
      data.page.body = body;
      const html = versionAssets(render(templates['layout.html'], data, includes, where));

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

  // ---- help/<locale>.json (the app's data files) ---------------------------
  // Not pages either: never in `written`, never in the sitemap.
  const helpJsons = helpAll.built.map((h) => {
    const j = buildHelpJson(h);
    fs.writeFileSync(path.join(DIST, `help/${h.locale}.json`), JSON.stringify(j));
    return j;
  });
  const helpJson = helpJsons[0];

  fs.writeFileSync(path.join(DIST, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml\n`);

  console.log(`built ${written.length} pages · ${LOCALES.length} locale(s) · ${urls.length} sitemap entries`);
  console.log(`assets: ${cssName}  ${jsName}`);
  console.log(`blog: ${blogList.length} post(s) · /blog/ index · feed.xml`);
  console.log(`help: ${helpShown.articles.length} of ${help.articles.length} article(s) on pages (live ${LIVE_APP_VERSION}) · ${helpShown.topics.length} topic(s) · en.json ${helpJson.articles.length} articles, ${helpJson.tips.length} tips, ${helpJson.checklist.length} checklist · ${HELP_PUBLIC ? 'PUBLIC' : 'noindex preview'}`);
  for (const [k, j] of helpJsons.entries()) {
    if (!k) continue;
    console.log(`help ${j.locale}: pages + ${j.locale}.json ${j.articles.length} articles, ${j.tips.length} tips, ${j.checklist.length} checklist`);
    const english = helpAll.built[k].englishPictures;
    console.log(`help ${j.locale}: ${english} picture(s) in English${english ? ' (listed gaps, help/media-gaps.json)' : ''}`);
  }
  for (const w of helpAll.warnings) console.warn(`WARN  ${w}`);
  for (const [name, st] of Object.entries(stores)) {
    if (!st.available) {
      console.log(`INFO  stores.${name}.available is false — the badge renders as a non-link "coming soon" chip and ${name === 'ios' ? 'the App Store URL' : 'the store URL'} is not written into dist/.`);
    } else if (!st.verified) {
      console.warn(`WARN  stores.${name}.url is marked unverified in site.config.mjs — the listing was not public when this was last checked.`);
    }
  }
}

build();
