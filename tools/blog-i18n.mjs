// The blog in several languages (2026-11-17/001): everything that reads or
// judges a translation, in one place. build.mjs loads the fixed words and the
// translation files through it (and throws on what loadBlogTranslations
// reports), tools/check-build.mjs judges the translations with it, and
// tools/test-blog-i18n.mjs proves every rule can fail — without a site build.
//
// A translation of post <slug> into <loc> is exactly two files:
//   blog/<slug>.<loc>.html  the body, same rules as the English body
//   blog/<slug>.<loc>.json  the words BLOG_POSTS holds for English
// Everything else (slug, cluster, features, dates, image, sizes) comes from
// the English entry. No fallback: a post exists in a language only when both
// files exist. The fixed words of a blog page live in blog/ui/<loc>.json, one
// file per BLOG_LOCALES language, the same keys as blog/ui/en.json.
//
// Node standard library only, like the rest of the build.

import fs from 'node:fs';
import path from 'node:path';

/** The keys a translation json carries. itemList only when the English post has one. */
export const TRANSLATION_KEYS = ['title', 'description', 'h1', 'imageAlt', 'faq', 'cta'];
const OPTIONAL_KEYS = ['itemList'];

/** The elements whose number must match the English body, one by one. */
export const SHAPE_TAGS = ['h2', 'h3', 'p', 'li', 'table', 'tr', 'img', 'blockquote', 'a'];

/**
 * Words that must never appear in a blog translation or in the fixed words:
 * each is "family planning", which means contraception. Searched without
 * regard to upper/lower case, and with every apostrophe counted as '. The
 * Ukrainian list also holds "сімейний планувальник" ("family planner"): the
 * site calls the app "сімейний органайзер". `en` is checked on the English
 * posts and the English fixed words too — no English post holds the phrase
 * (checked 2026-11-17).
 */
export const FORBIDDEN_BLOG_WORDS = {
  en: ['family planning'],
  de: ['Familienplanung'],
  nb: ['familieplanlegging'],
  uk: ["планування сім'ї", 'сімейний планувальник'],
  sv: ['familjeplanering'],
  nl: ['gezinsplanning'],
};

const isStr = (v) => typeof v === 'string' && v.trim() !== '';
const readJson = (file, errors) => {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { errors.push(`${file}: is not valid JSON — ${e.message}`); return null; }
};
const rel = (root, f) => path.relative(root, f) || f;

/** Every leaf of a nested object of strings as [dotted key, value]. */
export function leaves(obj, prefix = '') {
  return Object.entries(obj).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v)
    ? leaves(v, `${prefix}${k}.`) : [[`${prefix}${k}`, v]]));
}

/**
 * blog/ui/<loc>.json for every BLOG_LOCALES language. English is the shape:
 * every other file has exactly its keys, every value a non-empty string, and
 * `seeHowFeature` holds {feature} exactly once. A ui file for a language that
 * is not in BLOG_LOCALES is an error too (it would never be used).
 * Returns { ui: { loc: object }, errors: [] }.
 */
export function loadBlogUi({ root, blogLocales }) {
  const errors = [];
  const dir = path.join(root, 'blog/ui');
  const file = (loc) => path.join(dir, `${loc}.json`);
  const ui = {};
  for (const loc of blogLocales) {
    if (!fs.existsSync(file(loc))) { errors.push(`${rel(root, file(loc))}: missing — '${loc}' is in BLOG_LOCALES, so its blog words must exist`); continue; }
    const j = readJson(file(loc), errors);
    if (j) ui[loc] = j;
  }
  if (fs.existsSync(dir)) {
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
      const loc = f.slice(0, -'.json'.length);
      if (!blogLocales.includes(loc)) errors.push(`blog/ui/${f}: '${loc}' is not in BLOG_LOCALES`);
    }
  }
  if (!ui.en) return { ui, errors };
  const shape = leaves(ui.en).map(([k]) => k);
  for (const loc of Object.keys(ui)) {
    const at = `blog/ui/${loc}.json`;
    const got = new Map(leaves(ui[loc]));
    for (const k of shape) {
      if (!got.has(k)) errors.push(`${at}: missing string '${k}'`);
      else if (!isStr(got.get(k))) errors.push(`${at}: '${k}' must be a non-empty string`);
    }
    for (const k of got.keys()) if (!shape.includes(k)) errors.push(`${at}: unknown key '${k}' (not in blog/ui/en.json)`);
    const see = got.get('seeHowFeature');
    if (isStr(see) && see.split('{feature}').length !== 2) errors.push(`${at}: 'seeHowFeature' must contain {feature} exactly once`);
  }
  return { ui, errors };
}

/** `<slug>.<loc>.<html|json>` → { slug, loc, ext }, or null. */
const FILE_RE = /^([a-z0-9][a-z0-9-]*)\.([A-Za-z]{2,3}(?:-[A-Za-z]{2,4})?)\.(html|json)$/;

/**
 * Every translation file in <root>/blog/, checked against requirement 1.
 * Returns { byPost: { slug: { loc: { meta, body, html, json } } }, errors: [] }
 * where html/json are the two files' paths relative to root.
 */
export function loadBlogTranslations({ root, posts, blogLocales }) {
  const errors = [];
  const byPost = {};
  const dir = path.join(root, 'blog');
  const pairs = new Map(); // `${slug}.${loc}` -> { slug, loc, html?, json? }
  for (const f of fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isFile()).map((e) => e.name).sort()) {
    if (!/\.(html|json)$/.test(f)) continue;
    const m = f.match(FILE_RE);
    if (!m) { errors.push(`blog/${f}: not a post file — a body is <slug>.<loc>.html, a translation's words <slug>.<loc>.json`); continue; }
    const [, slug, loc, ext] = m;
    if (loc === 'en' && ext === 'html') continue; // an English body, named by BLOG_POSTS
    const key = `${slug}.${loc}`;
    if (!pairs.has(key)) pairs.set(key, { slug, loc });
    pairs.get(key)[ext] = `blog/${f}`;
  }
  for (const { slug, loc, html, json } of pairs.values()) {
    const name = `blog/${slug}.${loc}`;
    if (loc === 'en') { errors.push(`${json}: 'en' is the source — English words live in BLOG_POSTS, not in a translation file`); continue; }
    if (!blogLocales.includes(loc)) { errors.push(`${html || json}: '${loc}' is not in BLOG_LOCALES (${blogLocales.join(', ')})`); continue; }
    const en = posts.find((p) => p.slug === slug);
    if (!en) { errors.push(`${html || json}: there is no post '${slug}' in BLOG_POSTS`); continue; }
    if (!html) { errors.push(`${name}.html is missing — ${json} needs its body`); continue; }
    if (!json) { errors.push(`${name}.json is missing — ${html} needs its words (title, description, h1, imageAlt, faq, cta)`); continue; }
    const before = errors.length;
    const meta = readJson(path.join(root, json), errors);
    if (!meta) continue;
    const bad = (msg) => errors.push(`${json}: ${msg}`);
    if (typeof meta !== 'object' || Array.isArray(meta)) { bad('must be a JSON object'); continue; }
    const needed = [...TRANSLATION_KEYS, ...(en.itemList ? ['itemList'] : [])];
    for (const k of Object.keys(meta)) {
      if (!needed.includes(k)) bad(OPTIONAL_KEYS.includes(k) ? `has '${k}', but the English post has none` : `unknown key '${k}' (allowed: ${needed.join(', ')})`);
    }
    for (const k of needed) {
      if (!(k in meta)) { bad(`missing key '${k}'`); continue; }
      if (k === 'faq' || k === 'cta') continue;
      if (!isStr(meta[k])) bad(`'${k}' must be a non-empty string`);
    }
    if ('faq' in meta) {
      if (!Array.isArray(meta.faq)) bad("'faq' must be a list of { q, a }");
      else {
        if (meta.faq.length !== en.faq.length) bad(`'faq' has ${meta.faq.length} question(s), the English post has ${en.faq.length}`);
        meta.faq.forEach((it, i) => {
          if (!it || typeof it !== 'object' || Object.keys(it).sort().join() !== 'a,q') bad(`faq[${i}] must be exactly { q, a }`);
          else if (!isStr(it.q) || !isStr(it.a)) bad(`faq[${i}] q and a must be non-empty strings`);
        });
      }
    }
    if ('cta' in meta) {
      const c = meta.cta;
      if (!c || typeof c !== 'object' || Object.keys(c).sort().join() !== 'h2,html') bad("'cta' must be exactly { h2, html }");
      else if (!isStr(c.h2) || !isStr(c.html)) bad('cta.h2 and cta.html must be non-empty strings');
    }
    const body = fs.readFileSync(path.join(root, html), 'utf8');
    if (!body.trim()) errors.push(`${html}: is empty`);
    if (/<h1[\s>]/i.test(body)) errors.push(`${html}: has an <h1> — the template renders it from h1`);
    if (/class="post-(?:faq|cta)"/.test(body)) errors.push(`${html}: holds an FAQ or CTA section — the template renders both`);
    if (errors.length !== before) continue;
    (byPost[slug] ||= {})[loc] = { meta, body, html, json };
  }
  return { byPost, errors };
}

/** Body tags counted by name, comments dropped. */
export function tagCounts(html) {
  const s = html.replace(/<!--[\s\S]*?-->/g, '');
  return Object.fromEntries(SHAPE_TAGS.map((t) => [t, (s.match(new RegExp(`<${t}(?=[\\s>/])`, 'gi')) || []).length]));
}

/** Every <a href> in order. */
export const hrefsOf = (html) => [...html.replace(/<!--[\s\S]*?-->/g, '').matchAll(/<a\b[^>]*?\shref="([^"]*)"/gi)].map((m) => m[1]);

const squash = (s) => s.replace(/\s+/g, ' ').trim();

/**
 * Same shape as the English (8a): the same number of each SHAPE_TAGS element,
 * the same external links in the same order, and every internal link to the
 * same page as in English — `localize(enHref)` says where that is in this
 * language (the page's own language when it exists there, else the English
 * page). `what` names the part ('body', 'cta.html') in each message.
 */
export function shapeProblems({ file, what, en, tr, localize }) {
  const out = [];
  const a = tagCounts(en), b = tagCounts(tr);
  for (const t of SHAPE_TAGS) {
    if (a[t] !== b[t]) out.push(`${file}: ${what} has ${b[t]} <${t}>, the English has ${a[t]}`);
  }
  const ea = hrefsOf(en), ta = hrefsOf(tr);
  ea.forEach((href, i) => {
    if (i >= ta.length) return; // the <a> count above already said so
    const got = ta[i];
    if (href.startsWith('/')) {
      const want = localize(href);
      if (got !== want) out.push(`${file}: ${what} link ${i + 1} goes to ${got}, expected ${want} (the English ${href}${want === href ? '' : ' in this language'})`);
    } else if (got !== href) {
      out.push(`${file}: ${what} link ${i + 1} is ${got}, the English links ${href} — an external or in-page link stays the same`);
    }
  });
  return out;
}

/** Not a copy (8b): the body, title and h1 differ from the English ones. */
export function copyProblems({ json, html, enPost, enBody, meta, body }) {
  const out = [];
  if (squash(body) === squash(enBody)) out.push(`${html}: the body is the English body — not a translation`);
  if (squash(meta.title) === squash(enPost.title)) out.push(`${json}: 'title' is the English title — not a translation`);
  if (squash(meta.h1) === squash(enPost.h1)) out.push(`${json}: 'h1' is the English h1 — not a translation`);
  return out;
}

const decode = (s) => s
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (_, n) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", nbsp: ' ' })[n]);

/**
 * What a reader sees of a built page: the <body>'s text, with <script> and
 * comments dropped, plus the placeholder, alt, title and aria-label values.
 */
export function visibleText(html) {
  const bodyAt = html.search(/<body[\s>]/);
  const s = (bodyAt < 0 ? html : html.slice(bodyAt))
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
  const attrs = [...s.matchAll(/\s(?:placeholder|alt|title|aria-label)="([^"]*)"/g)].map((m) => m[1]);
  return squash(decode(`${s.replace(/<[^>]*>/g, ' ')} ${attrs.join(' ')}`));
}

/**
 * No English left over (8c): the English fixed words (blog/ui/en.json) that
 * appear on a page of language `loc`, without regard to case. A string that is
 * the same in both languages ("Blog — Daili") is the translation, so it is not
 * counted. {feature} splits a string into the parts searched for.
 */
export function englishLeftovers({ html, loc, ui }) {
  const text = visibleText(html).toLowerCase();
  const own = new Map(leaves(ui[loc]));
  const hits = [];
  for (const [k, s] of leaves(ui.en)) {
    if (own.get(k) === s) continue;
    for (const part of s.split('{feature}').map((x) => x.trim()).filter((x) => x.length >= 4)) {
      if (text.includes(part.toLowerCase())) hits.push(`"${part}" (${k})`);
    }
  }
  return hits;
}

const normApos = (s) => s.replace(/[’ʼ‘`´]/g, "'");

/** The FORBIDDEN_BLOG_WORDS of the given languages found in `text` (8d). */
export function forbiddenHits(text, langs, words = FORBIDDEN_BLOG_WORDS) {
  const t = normApos(text).toLocaleLowerCase();
  const hits = [];
  for (const l of langs) for (const w of words[l] || []) {
    if (t.includes(normApos(w).toLocaleLowerCase())) hits.push(w);
  }
  return [...new Set(hits)];
}

/**
 * The rules of 8a, 8b and 8d for every loaded translation, and 8d for the
 * fixed words and the English posts. `enBodyOf(post)` reads an English body;
 * `localizeFor(loc)` returns the localize function shapeProblems needs.
 * Returns a list of messages, each naming the file.
 */
export function judgeTranslations({ root, posts, byPost, ui, enBodyOf, localizeFor }) {
  const out = [];
  for (const [slug, locs] of Object.entries(byPost)) {
    const enPost = posts.find((p) => p.slug === slug);
    const enBody = enBodyOf(enPost);
    for (const [loc, t] of Object.entries(locs)) {
      const localize = localizeFor(loc);
      out.push(...shapeProblems({ file: t.html, what: 'body', en: enBody, tr: t.body, localize }));
      out.push(...shapeProblems({ file: t.json, what: 'cta.html', en: enPost.cta.html, tr: t.meta.cta.html, localize }));
      out.push(...copyProblems({ json: t.json, html: t.html, enPost, enBody, meta: t.meta, body: t.body }));
      for (const f of [t.html, t.json]) {
        const hits = forbiddenHits(fs.readFileSync(path.join(root, f), 'utf8'), [loc, 'en']);
        for (const w of hits) out.push(`${f}: holds the forbidden word "${w}" — it means contraception`);
      }
    }
  }
  for (const loc of Object.keys(ui)) {
    const hits = forbiddenHits(JSON.stringify(ui[loc]), [...new Set([loc, 'en'])]);
    for (const w of hits) out.push(`blog/ui/${loc}.json: holds the forbidden word "${w}" — it means contraception`);
  }
  for (const p of posts) {
    const words = [p.title, p.description, p.h1, p.imageAlt, ...p.faq.flatMap((f) => [f.q, f.a]), p.cta.h2, p.cta.html, enBodyOf(p)].join('\n');
    for (const w of forbiddenHits(words, ['en'])) out.push(`${p.slug} (English): holds the forbidden word "${w}" — it means contraception`);
  }
  return out;
}
