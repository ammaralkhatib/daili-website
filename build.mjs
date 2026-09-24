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
  PAGES, FEATURES, COMPARE_ROWS, COMPARE_MARKS, imageSize,
  SHOT_LOCALE, STORY_CARDS, STORY_ICONS, WEB_APP_URL,
  BLOG_POSTS, BLOG_AUTHOR, BLOG_CLUSTERS, BLOG_INDEX, WHATS_NEW,
  HELP_PUBLIC, LIVE_APP_VERSION, HELP_TOPICS, HELP_ICONS,
} from './site.config.mjs';
import { loadHelp, visibleHelp } from './tools/help-lib.mjs';

/** Where the help pages send their anonymous counts (api commit a19d079).
 *  static/.htaccess allows exactly this origin in connect-src. */
const HELP_EVENTS_URL = 'https://api.daili.app/v1/help/events';

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

/**
 * The help center: help/en/<topic>/<slug>.md, parsed by tools/help-lib.mjs.
 * tools/check-help.mjs has already run by the time this does, so an error here
 * means someone ran build.mjs on its own — it still refuses to render a broken
 * article rather than half of one.
 *
 * Pages follow the blog's rules (English only, `cluster: null`, no hreflang)
 * and add one of their own: while HELP_PUBLIC is false every help page is
 * noindex, which also keeps it out of the sitemap. They show only what the
 * live app has (`since` <= LIVE_APP_VERSION); help/en.json carries everything.
 */
const help = loadHelp({ root: ROOT, topics: HELP_TOPICS, icons: HELP_ICONS });
if (help.errors.length) {
  throw new Error(`help/ has ${help.errors.length} error(s) — run node tools/check-help.mjs:\n${help.errors.join('\n')}`);
}
const helpShown = visibleHelp(help, LIVE_APP_VERSION);
const helpArticleUrl = (a) => `/help/${a.topic}/${a.slug}/`;

const helpBase = { locales: ['en'], cluster: null, noindex: !HELP_PUBLIC, priority: () => '0.5' };
const helpPages = [
  {
    ...helpBase,
    id: 'helpindex',
    template: 'helpindex.html',
    out: () => 'help/index.html',
    meta: { title: 'Help — daili', description: 'Short guides for everything in daili: the calendar, lists, meals, birthdays, your family and your account.' },
    help: { kind: 'index' },
  },
  ...helpShown.topics.map((t) => ({
    ...helpBase,
    id: `help:${t}`,
    template: 'helptopic.html',
    out: () => `help/${t}/index.html`,
    meta: { title: `${HELP_TOPICS[t].title} — daili Help`, description: HELP_TOPICS[t].summary },
    help: { kind: 'topic', topic: t },
  })),
  ...helpShown.articles.map((a) => ({
    ...helpBase,
    id: `help:${a.id}`,
    template: 'helparticle.html',
    out: () => `help/${a.topic}/${a.slug}/index.html`,
    meta: { title: `${a.title} — daili Help`, description: a.summary },
    help: { kind: 'article', article: a },
  })),
];

/** Everything the build loops over: the manifest, the index, one page per post,
 *  and the help center. */
const allPages = [...PAGES, blogIndexPage, ...blogPages, ...helpPages];

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
    // The help center is English-only like the blog, and linked from nowhere
    // until HELP_PUBLIC flips: before that its pages are a noindex preview.
    ...(HELP_PUBLIC ? [`<a href="/help/" hreflang="en" lang="en">${escapeHtml(c.nav.help)}</a>`] : []),
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

/** One consistent footer everywhere. On the landing page it is rendered inside
 *  the last slide instead of after <main>: with mandatory scroll-snap a footer
 *  that sits outside the last snap target can never be scrolled to. Same markup
 *  either way, built here so the two placements cannot drift. */
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
 * The web app's browser window, the one image on the page that is NOT localized:
 * web-calendar.webp is a capture of app.daili.app, and the web app speaks
 * English and German only, so there is no 28-locale set to point at. It is the
 * first thing the web slide shows, full width, so it keeps its intrinsic size.
 */
function renderWebShot(loc) {
  const { width, height } = imageSize('web-');
  return { src: imgSrc('web-calendar', loc), width, height };
}

/**
 * One floating card: the drawing from STORY_CARDS around the two strings from
 * story.cards.<chapter>[i]. `t` is the bold line, `s` the small one under it —
 * every card has exactly those two, and a card that does not names its locale
 * and its chapter on the way out rather than rendering half a card.
 */
function storyCard(spec, card, chapter, i, where) {
  for (const k of ['t', 's']) {
    if (!card || typeof card !== 'object' || !(k in card) || !String(card[k]).trim()) {
      throw new Error(`story.cards.${chapter}[${i}] has no non-empty '${k}' in ${where}`);
    }
  }
  const av = (color, initial) => `<span class="av" style="background:var(--${color})">${escapeHtml(initial)}</span>`;
  const cls = ['fc'];
  let lead = '', trail = '';

  if (spec.kind === 'pill') {
    cls.push('pill');
    lead = '<span class="dot"></span>';
  } else if (spec.kind === 'av') {
    // `box` is the to-do row: an empty checkbox in front, the assignee behind.
    lead = spec.box ? '<span class="box"></span>' : av(spec.color, spec.initial);
    if (spec.box) trail = av(spec.color, spec.initial);
  } else if (spec.kind === 'avs') {
    lead = `<span class="avs">${spec.group.map((c, j) => av(c, spec.initials[j])).join('')}</span>`;
  } else if (spec.kind === 'tick') {
    cls.push('chk');
    lead = '<span class="tick"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></span>';
  } else if (spec.kind === 'badge') {
    cls.push('badge-s');
    lead = '<i></i>';
  } else if (spec.kind.startsWith('ico:')) {
    const glyph = spec.kind.slice(4);
    if (!(glyph in STORY_ICONS)) {
      throw new Error(`STORY_CARDS.${chapter}[${i}] wants icon '${glyph}', which is not a key in STORY_ICONS (${Object.keys(STORY_ICONS).join(', ')})`);
    }
    lead = `<span class="ico${spec.tone === 'amber' ? ' amber' : ''}"><svg viewBox="0 0 24 24">${STORY_ICONS[glyph]}</svg></span>`;
  } else {
    throw new Error(`STORY_CARDS.${chapter}[${i}] has kind '${spec.kind}', which nothing renders`);
  }

  const dur = spec.dur ? `;--dur:${spec.dur}` : '';
  return `        <div class="${cls.join(' ')}" style="${spec.pos}${dur}">${lead}<span><b>${escapeHtml(card.t)}</b><small>${escapeHtml(card.s)}</small></span>${trail}</div>`;
}

/**
 * The scroll story: eight chapters (the hero, then one per FEATURES entry), one
 * sticky phone holding eight stacked screenshots, and eight groups of three
 * floating cards.
 *
 * Returns the pieces rather than one blob, because they land in three different
 * places in landing.html — the text column, the phone, and the card layer over
 * it — and every piece has to stay in the same order as the other two. Chapter 0
 * is the hero and stays written out in the template: it is the only chapter with
 * store badges, and those come from the `storebadges` partial, which the engine
 * resolves in the template and not inside a string this file hands it.
 *
 * `--a` / `--w` on each element are the mock's build-up numbers: where in the
 * chapter's 0..1 scroll progress it starts appearing and how long it takes.
 */
function renderStory(loc) {
  const where = `content/${loc}.json`;
  const c = content[loc];
  const chapterKeys = ['hero', ...FEATURES.map((f) => f.key)];
  const cards = lookup(c, 'story.cards', where);

  for (const key of chapterKeys) {
    if (!(key in cards)) throw new Error(`missing key 'story.cards.${key}' in ${where}`);
    if (!Array.isArray(cards[key]) || cards[key].length !== STORY_CARDS[key].length) {
      throw new Error(`story.cards.${key} in ${where} has ${cards[key].length} cards, STORY_CARDS has ${STORY_CARDS[key].length}`);
    }
  }

  // The store the family chapter's button sends people to: the first one the app
  // can actually be installed from, which is the same rule the sticky CTA uses.
  // With no store live at all it points at the web app rather than at nothing.
  const store = [stores.ios, stores.android].find((st) => st.available);
  const ctaHref = store ? store.url : WEB_APP_URL;

  const shot = (name, alt, k) => {
    const { width, height } = imageSize(name);
    const load = k === 0
      ? 'fetchpriority="high"'      // chapter 0's screen is the LCP
      : 'loading="lazy"';
    return `<img src="${imgSrc(name, loc)}" alt="${escapeHtml(alt)}" width="${width}" height="${height}" style="--k:${k}" ${load} decoding="async">`;
  };
  // The same screenshot again, for the plain page a phone gets. Chapter 0's
  // copy is the mobile LCP, so it is the one image here that is not lazy.
  const mshot = (name, alt, eager) => {
    const { width, height } = imageSize(name);
    return `<div class="mshot"><img src="${imgSrc(name, loc)}" alt="${escapeHtml(alt)}" width="${width}" height="${height}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></div>`;
  };

  const screens = [`          ${shot('shot-home', c.hero.altHome, 0)}`];
  const floats = [];
  const chapters = [];

  chapterKeys.forEach((key, k) => {
    floats.push(`      <div class="floats" data-floats="${k}" aria-hidden="true">
${cards[key].map((card, i) => storyCard(STORY_CARDS[key][i], card, key, i, where)).join('\n')}
      </div>`);
  });

  FEATURES.forEach((f, n) => {
    const k = n + 1;
    const fc = lookup(c, `features.${f.key}`, where);
    for (const key of ['eyebrow', 'h2', 'p', 'bullets', 'alt']) {
      if (!(key in fc)) throw new Error(`missing key 'features.${f.key}.${key}' in ${where}`);
    }
    screens.push(`          ${shot(f.shot, fc.alt, k)}`);

    const bullets = fc.bullets.length
      ? `\n          <ul>\n${fc.bullets.map((b, i) =>
        `            <li class="by" style="--a:${(0.7 + i * 0.06).toFixed(2)};--w:.08">${escapeHtml(b)}</li>`).join('\n')}\n          </ul>`
      : '';
    // Only the last chapter ends with a button: it is the end of the story, and
    // a call to action on every chapter is a page that keeps interrupting itself.
    const cta = f.key === 'family'
      ? `\n          <div class="ctas by" style="--a:.8;--w:.1"><a class="btn btn-primary" href="${ctaHref}" rel="noopener">${escapeHtml(c.cta.sticky)}</a></div>`
      : '';

    // The header's "Features" link lands on the first feature chapter, not on
    // the hero above it: #features is where the old grid was, and a link that
    // scrolls to the top of the page does nothing visible.
    //
    // <bdi> around "1 / 7" because /ar/ is an RTL paragraph: digits are a weak
    // LTR run and the slash is neutral, so the bare string renders as "7 / 1"
    // — the counter counting backwards. Same reason the language picker wraps
    // its endonyms.
    chapters.push(`      <div class="chapter" data-chapter="${k}"${k === 1 ? ' id="features"' : ''}>
        ${mshot(f.shot, fc.alt)}
        <div class="txt">
          <span class="num by" style="--a:.42;--w:.12"><bdi>${k} / ${FEATURES.length}</bdi></span>
          <span class="eyebrow by" style="--a:.42;--w:.12">${escapeHtml(fc.eyebrow)}</span>
          <h2 class="by" style="--a:.45;--w:.14">${escapeHtml(fc.h2)}</h2>
          <p class="p by" style="--a:.6;--w:.12">${escapeHtml(fc.p)}</p>${bullets}${cta}
        </div>
      </div>`);
  });

  return {
    chapters: chapters.join('\n\n'),
    screens: screens.join('\n'),
    floats: floats.join('\n'),
    dots: chapterKeys.map((_, k) => `<i${k === 0 ? ' class="on"' : ''}></i>`).join(''),
    heroMshot: mshot('shot-home', c.hero.altHome, true),
  };
}

function renderCompareTable(loc) {
  const where = `content/${loc}.json`;
  const cmp = lookup(content[loc], 'compare', where);
  if (cmp.rows.length !== COMPARE_ROWS.length) {
    throw new Error(`${where}: compare.rows has ${cmp.rows.length} labels, COMPARE_ROWS has ${COMPARE_ROWS.length} mark sets`);
  }
  // `d` marks every cell of the Daili column. The mock tints that column with
  // `tr:has(td) td:nth-child(2)`, which Firefox ESR 115 — still shipping in
  // Debian and on managed desktops — does not support, and an untinted column
  // is a comparison table with no answer in it. So the class is on the cell as
  // well, and the :has() rule in style.css is the progressive half.
  // The table builds column by column as the slide settles: .by is the reveal
  // primitive, .col1/.col2/.col3 are the three start times. The span is INSIDE
  // the cell and the cell itself never moves, so the table's geometry — column
  // widths, row heights, the tinted Daili column — is identical at --p 0 and 1.
  const cell = (mark, col) => {
    const glyph = COMPARE_MARKS[mark];
    return `<td class="${col === 1 ? 'd ' : ''}${mark}"><span class="by col${col}" aria-hidden="true">${glyph}</span></td>`;
  };
  const th = (label, col) => `<th scope="col"${col === 1 ? ' class="d"' : ''}><span class="by col${col}">${escapeHtml(label)}</span></th>`;
  const head = `        <tr><th scope="col">${escapeHtml(cmp.cols.feature)}</th>${th(cmp.cols.daili, 1)}${th(cmp.cols.gcal, 2)}${th(cmp.cols.paper, 3)}</tr>`;
  const body = COMPARE_ROWS.map((r, i) =>
    `        <tr><th scope="row">${escapeHtml(cmp.rows[i])}</th>${cell(r.daili, 1)}${cell(r.gcal, 2)}${cell(r.paper, 3)}</tr>`).join('\n');
  return `      <table class="cmp">\n        <thead>\n${head}\n        </thead>\n        <tbody>\n${body}\n        </tbody>\n      </table>`;
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
};
for (const name of HELP_ICONS) {
  if (!(name in HELP_GLYPHS)) throw new Error(`HELP_ICONS has '${name}' but build.mjs HELP_GLYPHS has no drawing for it`);
}
const helpIcon = (name) => `<span class="help-ico" aria-hidden="true"><svg viewBox="0 0 24 24">${HELP_GLYPHS[name]}</svg></span>`;
const CHEVRON = '<svg class="help-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';

/** A file's cache-buster. Help pictures are re-shot under the same name and
 *  images are cached for 30 days, so the URL has to change when the bytes do. */
const fileSha8 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 8);

/** Site-absolute URL of a help media file, with its ?v= cache-buster. */
function helpMediaUrl(file, locale = 'en') {
  return `/help/media/${locale}/${file}?v=${fileSha8(p('static/help/media', locale, file))}`;
}

/** Article text: escaped, then **bold** — the only inline markup there is. */
const helpInline = (s) => escapeHtml(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

/** Plain text of an article's body, for the search index. */
const helpPlain = (a) => a.blocks.map((b) => (b.type === 'steps' ? b.items.join(' ') : b.text || ''))
  .join(' ').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();

const helpRow = (a) => `      <li><a class="help-row" href="${helpArticleUrl(a)}"><span><b>${escapeHtml(a.title)}</b><small>${escapeHtml(a.summary)}</small></span>${CHEVRON}</a></li>`;

/**
 * Everything a help page's template needs, pre-rendered. The template engine
 * has one level of loops and no conditionals inside them, and a help page is
 * nested lists all the way down — the same reason the story and the FAQ are
 * rendered here rather than in their templates.
 */
function renderHelp(spec) {
  const shown = helpShown.articles;

  if (spec.kind === 'index') {
    const newOnes = shown.filter((a) => a.since === LIVE_APP_VERSION);
    const newSection = newOnes.length ? `  <section class="help-new" aria-labelledby="help-new-h">
    <h2 id="help-new-h">New in version ${escapeHtml(LIVE_APP_VERSION)}</h2>
    <ul class="help-list">
${newOnes.map(helpRow).join('\n')}
    </ul>
  </section>` : '';

    const cards = helpShown.topics.map((t) => {
      const count = shown.filter((a) => a.topic === t).length;
      return `      <li><a class="help-card" href="/help/${t}/">${helpIcon(HELP_TOPICS[t].icon)}<b>${escapeHtml(HELP_TOPICS[t].title)}</b><small>${count} article${count === 1 ? '' : 's'}</small></a></li>`;
    }).join('\n');

    // The search index, as data. type="application/json" is never executed,
    // so the CSP (script-src 'self' + one hash) does not have to change and
    // nothing is fetched. `<` is escaped so no string in it can close the tag.
    const index = shown.map((a) => ({
      url: helpArticleUrl(a),
      title: a.title,
      summary: a.summary,
      topic: HELP_TOPICS[a.topic].title,
      keywords: a.keywords.join(' '),
      text: helpPlain(a),
    }));
    return {
      newSection,
      cards,
      indexJson: JSON.stringify(index).replace(/</g, '\\u003c'),
      minziSrc: `/help/media/minzi-look-right.webp?v=${fileSha8(p('static/help/media/minzi-look-right.webp'))}`,
    };
  }

  if (spec.kind === 'topic') {
    const t = HELP_TOPICS[spec.topic];
    return {
      title: t.title,
      summary: t.summary,
      icon: helpIcon(t.icon),
      rows: shown.filter((a) => a.topic === spec.topic).map(helpRow).join('\n'),
    };
  }

  const a = spec.article;
  const body = a.blocks.map((b) => {
    if (b.type === 'p') return `  <p>${helpInline(b.text)}</p>`;
    if (b.type === 'note') return `  <p class="help-note"><b>Note:</b> ${helpInline(b.text)}</p>`;
    if (b.type === 'steps') {
      return `  <ol class="help-steps">\n${b.items.map((it) => `    <li>${helpInline(it)}</li>`).join('\n')}\n  </ol>`;
    }
    const m = help.media[b.media];
    return `  <figure class="help-fig">
    <img src="${helpMediaUrl(m.file)}" alt="${escapeHtml(b.alt)}" width="${m.w}" height="${m.h}" decoding="async">
    <figcaption>${escapeHtml(b.alt)}</figcaption>
  </figure>`;
  }).join('\n');

  // Related articles the reader can open today — one the live app does not
  // have yet has no page to link to.
  const related = a.related.map((id) => shown.find((x) => x.id === id)).filter(Boolean);
  return {
    id: a.id,
    topicHref: `/help/${a.topic}/`,
    topicTitle: HELP_TOPICS[a.topic].title,
    title: a.title,
    summary: a.summary,
    body,
    related: related.length ? `  <section class="help-related" aria-labelledby="help-related-h">
    <h2 id="help-related-h">Related</h2>
    <ul class="help-list">
${related.map(helpRow).join('\n')}
    </ul>
  </section>` : '',
    updated: a.updated,
    updatedLabel: formatDate(a.updated),
  };
}

/**
 * help/en.json — the app's copy of the help center. Every article, whatever
 * its `since`: the app hides what is newer than itself. Image blocks become
 * absolute URLs with their size, so the app can lay a picture out before it
 * has loaded.
 */
function buildHelpJson() {
  const mediaSrc = (id) => {
    const m = help.media[id];
    return `${BASE_URL}${helpMediaUrl(m.file)}`;
  };
  const block = (b) => {
    if (b.type !== 'image') return b;
    const m = help.media[b.media];
    return m.kind === 'clip'
      ? { type: 'clip', src: mediaSrc(b.media), poster: `${BASE_URL}${helpMediaUrl(m.poster)}`, alt: b.alt, w: m.w, h: m.h }
      : { type: 'image', src: mediaSrc(b.media), alt: b.alt, w: m.w, h: m.h };
  };
  const arts = help.articles;
  return {
    schema: 1,
    locale: 'en',
    generated: new Date().toISOString(),
    liveAppVersion: LIVE_APP_VERSION,
    topics: Object.entries(HELP_TOPICS)
      .filter(([t]) => arts.some((a) => a.topic === t))
      .map(([id, t]) => ({ id, title: t.title, icon: t.icon, summary: t.summary, articles: arts.filter((a) => a.topic === id).map((a) => a.id) })),
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
        ...(pg.help ? { help: renderHelp(pg.help) } : {}),
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
          // The class on <html> the scroll-snap rules hang off. Snap has to be
          // set on the scroll container, which is <html>, and only the landing
          // page snaps — `html:has(.story)` would have done it without a class
          // and is not an option: Firefox ESR 115 ships no :has().
          htmlClass: pg.id === 'landing' ? 'landing' : '',
          cssHref, jsHref, helpSearchHref,
          homeHref: dirFor(loc),
          // The grid became the story; #features is now its first feature
          // chapter, so the header link and any old bookmark still land right.
          featuresHref: pg.id === 'landing' ? '#features' : `${dirFor(loc)}#features`,
          supportHref: pageExistsIn(pageById.support, loc) ? urlFor(pageById.support, loc) : '/support.html',
          langNav: renderLangNav(pg, loc),
          footerLinks: renderFooterLinks(loc),
          footerHtml: renderFooter(loc),
          // Every page but the landing one closes with the footer after <main>.
          // The landing page renders the same markup inside its last slide.
          siteFooter: pg.id !== 'landing',
          legalBody,
          postBody,
          webAppUrl: WEB_APP_URL,
          story: pg.id === 'landing' ? renderStory(loc) : '',
          webShot: pg.id === 'landing' ? renderWebShot(loc) : '',
          compareTable: pg.id === 'landing' ? renderCompareTable(loc) : '',
          faq: pg.id === 'landing' ? renderFaq(loc) : '',
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

  // ---- help/en.json (the app's data file) ----------------------------------
  // Not a page either: never in `written`, never in the sitemap.
  const helpJson = buildHelpJson();
  fs.writeFileSync(path.join(DIST, 'help/en.json'), JSON.stringify(helpJson));

  fs.writeFileSync(path.join(DIST, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml\n`);

  console.log(`built ${written.length} pages · ${LOCALES.length} locale(s) · ${urls.length} sitemap entries`);
  console.log(`assets: ${cssName}  ${jsName}`);
  console.log(`blog: ${blogList.length} post(s) · /blog/ index · feed.xml`);
  console.log(`help: ${helpShown.articles.length} of ${help.articles.length} article(s) on pages (live ${LIVE_APP_VERSION}) · ${helpShown.topics.length} topic(s) · en.json ${helpJson.articles.length} articles, ${helpJson.tips.length} tips, ${helpJson.checklist.length} checklist · ${HELP_PUBLIC ? 'PUBLIC' : 'noindex preview'}`);
  for (const w of help.warnings) console.warn(`WARN  ${w}`);
  for (const [name, st] of Object.entries(stores)) {
    if (!st.available) {
      console.log(`INFO  stores.${name}.available is false — the badge renders as a non-link "coming soon" chip and ${name === 'ios' ? 'the App Store URL' : 'the store URL'} is not written into dist/.`);
    } else if (!st.verified) {
      console.warn(`WARN  stores.${name}.url is marked unverified in site.config.mjs — the listing was not public when this was last checked.`);
    }
  }
}

build();
