// The help center's parser and rules. Shared by build.mjs (which renders the
// pages and help/<locale>.json from what this returns) and tools/check-help.mjs
// (the guard). Node standard library only, like everything else in this repo.
//
// An article is a small Markdown file with flat `key: value` front matter:
//
//   help/en/<topic>/<slug>.md
//
// English is the source. A translation, help/<code>/<topic>/<slug>.md, is a
// text-only copy of one: its front matter may carry only TRANSLATION_KEYS, and
// its body has the same blocks in the same order (the parity guard). Everything
// else — routes, since, media, tip priority, checklist — is taken from the
// English article, so a translation cannot drift from what the app does.
// help/<code>/_ui.json holds the page's own words (and the topic names).
//
// The body is a deliberately tiny subset of Markdown — paragraphs, one
// numbered list, one or two images, notes and **bold** — because the app draws
// the same blocks with its own renderer, and every construct allowed here is
// one more thing that renderer has to get right. Anything else is an error
// with file:line, never a silent pass-through.

import fs from 'node:fs';
import path from 'node:path';

/** Every front-matter key an article may carry. Anything else is a typo. */
const KEYS = new Set([
  'id', 'topic', 'title', 'summary', 'keywords', 'routes', 'tryIt', 'since',
  'updated', 'order', 'media', 'mediaPending', 'related',
  'tipTitle', 'tipBody', 'tipSkipIf', 'tipPriority',
  'checklist', 'checklistDoneIf',
]);
const REQUIRED = ['id', 'topic', 'title', 'summary', 'keywords', 'routes', 'since', 'updated'];
const TIP_KEYS = ['tipTitle', 'tipBody', 'tipSkipIf', 'tipPriority'];
/** A tip needs these; `tipSkipIf` is optional — no key means "always show"
 *  (the app treats a missing skipIf that way), for a feature with no
 *  "already done it" signal yet. */
const TIP_REQUIRED = ['tipTitle', 'tipBody', 'tipPriority'];
const CHECKLIST_KEYS = ['checklist', 'checklistDoneIf'];

export const LIMITS = {
  title: 70, summary: 140, keywordsMin: 1, keywordsMax: 12,
  steps: 7, images: 2, words: 150,
  tipTitle: 60, tipBody: 120, topicSummary: 90, mediaPending: 80,
};

/** The only front-matter keys a translation may carry. */
const TRANSLATION_KEYS = new Set(['id', 'title', 'summary', 'keywords', 'tipTitle', 'tipBody', 'translatedFrom']);

/** A translation may be this much longer than the English limits allow
 *  (title, summary, tip texts, topic summary, and the body's word count). */
export const TRANSLATION_FACTOR = 1.4;

/**
 * Scripts written without spaces between words have no word count; their body
 * is measured in characters (graphemes, whitespace and ** not counted) with
 * these caps. English's 150 words are ~800 characters; Chinese says the same in
 * roughly half of that, Japanese and Korean in a bit more, and Thai spells its
 * vowels and tones as separate marks inside one grapheme-heavy line.
 * help-search.js matches these locales by substring for the same reason.
 */
export const CHAR_LOCALES = { ja: 600, ko: 600, 'zh-Hans': 450, 'zh-Hant': 450, th: 900 };

const SEGMENTER = new Intl.Segmenter('en', { granularity: 'grapheme' });
/** Characters as a reader counts them: a Thai syllable or an emoji is one. */
export const graphemes = (s) => { let n = 0; for (const _ of SEGMENTER.segment(s)) n++; return n; };
/** A translated text limit: the English one × TRANSLATION_FACTOR. */
const trLimit = (n) => Math.floor(n * TRANSLATION_FACTOR);

const list = (v) => v.split(',').map((s) => s.trim()).filter(Boolean);
const isInt = (v) => /^-?\d+$/.test(v);
const SEMVER = /^\d+\.\d+\.\d+$/;

/** Compare two x.y.z versions: negative, zero or positive, like a sort. */
export function compareVersions(a, b) {
  const pa = a.split('.').map(Number), pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pa[i] - pb[i];
  return 0;
}

/** Words the reader has to read: the text of every p, step and note. */
const countWords = (s) => s.replace(/\*\*/g, '').split(/\s+/).filter(Boolean).length;

/**
 * The inline rules, applied to every run of text (paragraph, step, note).
 * **bold** is the only inline markup there is; everything that looks like any
 * other Markdown is reported rather than rendered as literal punctuation.
 */
function inlineProblems(text) {
  const out = [];
  if (/`/.test(text)) out.push('backticks are not allowed (no code in help articles)');
  if (/!\[[^\]]*\]\([^)]*\)/.test(text)) out.push('an image must sit on its own line');
  else if (/\[[^\]]*\]\([^)]*\)/.test(text)) out.push('links are not allowed — name the screen instead, or use `related`');
  if (/<\/?[A-Za-z!][^>]*>/.test(text)) out.push('raw HTML is not allowed');
  if (/(^|[^\w])_[^_\s][^_]*_(?=[^\w]|$)/.test(text)) out.push('_emphasis_ is not allowed — only **bold**');
  const bolds = (text.match(/\*\*/g) || []).length;
  if (bolds % 2) out.push('unbalanced ** — bold must open and close on the same line');
  else if (/\*/.test(text.replace(/\*\*[^*]+?\*\*/g, ''))) out.push('a single * is not allowed — only **bold**');
  return out;
}

/**
 * Parse one article file into { meta, blocks } plus its problems. `rel` is the
 * path used in messages (help/en/family/invite.md), so every error is
 * clickable. `translation` is the locale code when the file is a translation:
 * then only TRANSLATION_KEYS are allowed and the body limit is the
 * translated one.
 */
export function parseArticle(src, rel, translation = null) {
  const errors = [];
  const at = (line, msg) => errors.push(`${rel}:${line}  ${msg}`);
  const lines = src.replace(/\r\n?/g, '\n').split('\n');

  const meta = {};
  const metaLine = {};
  if (lines[0] !== '---') {
    at(1, 'must start with a --- line (front matter)');
    return { meta, metaLine, blocks: [], errors };
  }
  let i = 1;
  for (; i < lines.length && lines[i] !== '---'; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const m = line.match(/^([A-Za-z]+):\s*(.*)$/);
    if (!m) { at(i + 1, `front matter must be flat "key: value" lines, got "${line}"`); continue; }
    const [, key, value] = m;
    if (translation && !TRANSLATION_KEYS.has(key)) {
      at(i + 1, KEYS.has(key)
        ? `"${key}" is not allowed in a translation — it comes from the English article`
        : `unknown front-matter key "${key}"`);
      continue;
    }
    if (!translation && !KEYS.has(key)) { at(i + 1, `unknown front-matter key "${key}"`); continue; }
    if (key in meta) { at(i + 1, `"${key}" is set twice`); continue; }
    meta[key] = value.trim();
    metaLine[key] = i + 1;
  }
  if (i >= lines.length) {
    at(1, 'front matter is never closed with a --- line');
    return { meta, metaLine, blocks: [], errors };
  }

  // ---- body -------------------------------------------------------------
  const blocks = [];
  let para = null;          // { text, line } while a paragraph is open
  let steps = null;         // the open steps block, if the list is running
  let listsSeen = 0;
  let images = 0;
  const closePara = () => {
    if (para) blocks.push({ type: 'p', text: para.text, line: para.line });
    para = null;
  };

  for (let n = i + 1; n < lines.length; n++) {
    const line = lines[n].trimEnd();
    const ln = n + 1;

    if (!line.trim()) { closePara(); steps = null; continue; }

    if (/^#/.test(line)) { at(ln, 'headings (#) are not allowed — the title is the only heading'); continue; }
    if (/^\s*[-*+]\s/.test(line)) { at(ln, 'bullet lists are not allowed — use the one numbered list'); continue; }

    const step = line.match(/^(\d+)\.\s+(.*)$/);
    if (step) {
      closePara();
      if (!steps) {
        listsSeen++;
        if (listsSeen > 1) { at(ln, 'only one numbered list per article'); continue; }
        steps = { type: 'steps', items: [], line: ln };
        blocks.push(steps);
      }
      const want = steps.items.length + 1;
      if (Number(step[1]) !== want) at(ln, `step is numbered ${step[1]}, expected ${want}`);
      for (const p of inlineProblems(step[2])) at(ln, p);
      steps.items.push(step[2].trim());
      if (steps.items.length === LIMITS.steps + 1) at(ln, `more than ${LIMITS.steps} steps`);
      continue;
    }
    if (steps) { at(ln, 'a step must fit on one line (or leave a blank line after the list)'); continue; }

    const img = line.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
    if (img) {
      closePara();
      images++;
      if (images > LIMITS.images) at(ln, `more than ${LIMITS.images} images`);
      if (!img[1].trim()) at(ln, 'an image needs alt text: ![what it shows](media-id)');
      if (/[*`<]/.test(img[1])) at(ln, 'image alt text is plain text');
      blocks.push({ type: 'image', media: img[2], alt: img[1].trim(), line: ln });
      continue;
    }

    if (line.startsWith('>')) {
      closePara();
      const note = line.match(/^> Note: (.+)$/);
      if (!note) { at(ln, 'the only quote allowed is a note: "> Note: …"'); continue; }
      for (const p of inlineProblems(note[1])) at(ln, p);
      blocks.push({ type: 'note', text: note[1].trim(), line: ln });
      continue;
    }

    for (const p of inlineProblems(line)) at(ln, p);
    if (para) para.text += ' ' + line.trim();
    else para = { text: line.trim(), line: ln };
  }
  closePara();

  const texts = blocks.flatMap((b) => (b.type === 'steps' ? b.items : b.type === 'image' ? [] : [b.text]));
  if (translation && translation in CHAR_LOCALES) {
    const chars = texts.reduce((sum, s) => sum + graphemes(s.replace(/\*\*/g, '').replace(/\s+/g, '')), 0);
    const cap = CHAR_LOCALES[translation];
    if (chars > cap) at(i + 2, `body is ${chars} characters, the limit for ${translation} is ${cap}`);
  } else {
    const words = texts.reduce((sum, s) => sum + countWords(s), 0);
    const cap = translation ? trLimit(LIMITS.words) : LIMITS.words;
    if (words > cap) at(i + 2, `body is ${words} words, the limit is ${cap}`);
  }
  if (!blocks.length) at(i + 2, 'body is empty');

  // Keep `line` for the guard's messages; loadHelp drops it from what is rendered.
  return { meta, metaLine, blocks, errors, lastLine: lines.length };
}

/** Every help/<locale>/<topic>/<slug>.md, plus an error for anything else in
 *  there (other than _ui.json). */
function articleFiles(root, locale, errors) {
  const localeDir = path.join(root, 'help', locale);
  const relTo = (f) => path.relative(root, f).split(path.sep).join('/');
  const files = [];
  if (!fs.existsSync(localeDir)) return files;
  for (const t of fs.readdirSync(localeDir, { withFileTypes: true })) {
    const tdir = path.join(localeDir, t.name);
    if (t.name === '_ui.json' && t.isFile()) continue;
    if (!t.isDirectory()) { errors.push(`${relTo(tdir)}:1  only topic folders and _ui.json belong in help/${locale}/`); continue; }
    for (const f of fs.readdirSync(tdir)) {
      if (!f.endsWith('.md')) { errors.push(`${relTo(path.join(tdir, f))}:1  not a .md article`); continue; }
      files.push({ topicDir: t.name, slug: f.slice(0, -3), file: path.join(tdir, f) });
    }
  }
  return files;
}

function readJson(file, rel, errors, fallback) {
  if (!fs.existsSync(file)) { errors.push(`${rel}:1  missing`); return fallback; }
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) {
    errors.push(`${rel}:1  invalid JSON: ${e.message}`);
    return fallback;
  }
}

const placeholders = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/**
 * Check one help/<locale>/_ui.json. English (`en` null) is the shape every
 * other locale must match: the same keys, each a non-empty string with the
 * same {placeholders}. Two exceptions to "the same keys":
 *   - articleCount holds one string per plural category OF THAT LANGUAGE
 *     (Intl.PluralRules): en has one/other, pl one/few/many/other, ja other;
 *   - topics must have exactly the HELP_TOPICS keys, each with title+summary.
 * A missing key is an error only when `listed` (the locale is being built); an
 * unknown key or a broken value always is.
 */
function checkUi({ ui, en, locale, rel, listed, topicIds, errors }) {
  const at = (msg) => errors.push(`${rel}:1  ${msg}`);
  if (!isObj(ui)) { at('must be a JSON object'); return; }
  const summaryCap = en ? trLimit(LIMITS.topicSummary) : LIMITS.topicSummary;
  const len = (s) => (en ? graphemes(s) : s.length);

  const str = (key, v, want) => {
    if (typeof v !== 'string' || !v.trim()) { at(`"${key}" must be a non-empty string`); return; }
    if (want !== undefined && placeholders(v) !== placeholders(want)) {
      at(`"${key}" has placeholders {${placeholders(v)}}, English has {${placeholders(want)}}`);
    }
  };

  const shape = en || ui;
  for (const key of Object.keys(ui)) {
    if (!(key in shape)) at(`unknown key "${key}" (not in help/en/_ui.json)`);
  }
  for (const [key, want] of Object.entries(shape)) {
    if (!(key in ui)) { if (listed) at(`missing "${key}"`); continue; }
    const v = ui[key];
    if (key === 'topics') {
      if (!isObj(v)) { at('"topics" must be an object'); continue; }
      for (const id of Object.keys(v)) if (!topicIds.includes(id)) at(`topics.${id} is not a key of HELP_TOPICS (${topicIds.join(', ')})`);
      for (const id of topicIds) {
        const t = v[id];
        if (!isObj(t)) { if (listed || !en) at(`topics.${id} is missing`); continue; }
        for (const k of Object.keys(t)) if (k !== 'title' && k !== 'summary') at(`unknown key "topics.${id}.${k}"`);
        for (const k of ['title', 'summary']) {
          if (!(k in t)) { if (listed || !en) at(`missing "topics.${id}.${k}"`); continue; }
          str(`topics.${id}.${k}`, t[k]);
        }
        if (typeof t.summary === 'string' && len(t.summary) > summaryCap) {
          at(`topics.${id}.summary is ${len(t.summary)} chars, the limit is ${summaryCap}`);
        }
      }
    } else if (key === 'articleCount') {
      if (!isObj(v)) { at('"articleCount" must be an object of plural forms'); continue; }
      const cats = new Intl.PluralRules(locale).resolvedOptions().pluralCategories;
      const other = en ? en.articleCount.other : v.other;
      for (const k of Object.keys(v)) if (!cats.includes(k)) at(`articleCount.${k} is not a plural form of ${locale} (${cats.join(', ')})`);
      for (const k of cats) {
        if (!(k in v)) { if (listed || !en) at(`missing "articleCount.${k}"`); continue; }
        str(`articleCount.${k}`, v[k], other);
      }
    } else if (isObj(want)) {
      at(`"${key}" is an object — only topics and articleCount are`);
    } else {
      str(key, v, en ? want : undefined);
    }
  }
}

/** Read and check help/<locale>/_ui.json. Returns the object (or null). */
function loadUi({ root, locale, en, listed, topicIds, errors }) {
  const rel = `help/${locale}/_ui.json`;
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    if (!en || listed) errors.push(`${rel}:1  missing — every help locale needs its page words${en ? ` while "${locale}" is in HELP_LOCALES` : ''}`);
    return null;
  }
  const ui = readJson(file, rel, errors, null);
  if (ui !== null) checkUi({ ui, en, locale, rel, listed, topicIds, errors });
  return ui;
}

/**
 * Load and check every English article (the source).
 *
 * Returns { locale, topics, ui, articles, media, errors, warnings }.
 * `articles` is sorted by topic order, then `order`, then title — the order
 * every page and every help/<locale>.json use. `errors` holds EVERY problem
 * found, not the first, each as "file:line  message". Checks that need the app
 * (routes) are not here; see checkHelp().
 *
 * `topics` (HELP_TOPICS: id → { icon }) and `icons` are parameters so the
 * guard's test can run this against a fixture. The topic names are words, so
 * they live in help/en/_ui.json.
 */
export function loadHelp({ root, locale = 'en', topics, icons }) {
  const errors = [], warnings = [];
  const helpDir = path.join(root, 'help');
  const relTo = (f) => path.relative(root, f).split(path.sep).join('/');

  // topics
  const topicIds = Object.keys(topics);
  for (const [id, t] of Object.entries(topics)) {
    if (!icons.includes(t?.icon)) errors.push(`site.config.mjs:1  HELP_TOPICS.${id} has icon "${t?.icon}", which is not in HELP_ICONS (${icons.join(', ')})`);
  }
  const ui = loadUi({ root, locale, en: null, listed: true, topicIds, errors }) || {};

  const media = readJson(path.join(helpDir, 'media.json'), 'help/media.json', errors, {});
  const skipKeys = new Set(readJson(path.join(helpDir, 'skip-keys.json'), 'help/skip-keys.json', errors, []));

  // media.json entries, and their files
  const mediaDir = path.join(root, 'static', 'help', 'media', locale);
  for (const [id, m] of Object.entries(media)) {
    const where = `help/media.json:1  "${id}"`;
    if (!m || typeof m.file !== 'string') { errors.push(`${where} has no "file"`); continue; }
    if (!Number.isInteger(m.w) || !Number.isInteger(m.h) || m.w <= 0 || m.h <= 0) errors.push(`${where} needs integer "w" and "h"`);
    if (!['image', 'clip'].includes(m.kind)) errors.push(`${where} has kind "${m.kind}", expected "image" or "clip"`);
    if (!fs.existsSync(path.join(mediaDir, m.file))) errors.push(`${where} names ${m.file}, which is not in static/help/media/${locale}/`);
    if (m.kind === 'clip' && (typeof m.poster !== 'string' || !fs.existsSync(path.join(mediaDir, m.poster)))) {
      errors.push(`${where} is a clip and needs a "poster" file that exists`);
    }
  }

  // articles
  const files = articleFiles(root, locale, errors);

  const articles = [];
  for (const { topicDir, slug, file } of files) {
    const rel = relTo(file);
    const parsed = parseArticle(fs.readFileSync(file, 'utf8'), rel);
    errors.push(...parsed.errors);
    const { meta, metaLine, blocks } = parsed;
    const at = (key, msg) => errors.push(`${rel}:${metaLine[key] || 1}  ${msg}`);

    for (const k of REQUIRED) if (!(k in meta) || meta[k] === '') at(k, `"${k}" is required`);

    if (!topicIds.includes(topicDir)) at('topic', `folder "${topicDir}" is not a key of HELP_TOPICS (${topicIds.join(', ')})`);
    if (meta.topic && meta.topic !== topicDir) at('topic', `topic is "${meta.topic}" but the file is in help/${locale}/${topicDir}/`);
    const wantId = `${topicDir}-${slug}`;
    if (meta.id && meta.id !== wantId) at('id', `id is "${meta.id}", expected "${wantId}" (<topic>-<slug> from the path)`);

    if (meta.title && meta.title.length > LIMITS.title) at('title', `title is ${meta.title.length} chars, the limit is ${LIMITS.title}`);
    if (meta.summary && meta.summary.length > LIMITS.summary) at('summary', `summary is ${meta.summary.length} chars, the limit is ${LIMITS.summary}`);

    const keywords = meta.keywords ? list(meta.keywords) : [];
    if (meta.keywords !== undefined) {
      if (keywords.length < LIMITS.keywordsMin || keywords.length > LIMITS.keywordsMax) at('keywords', `has ${keywords.length} keywords, expected ${LIMITS.keywordsMin}–${LIMITS.keywordsMax}`);
      for (const k of keywords) if (k !== k.toLowerCase()) at('keywords', `keyword "${k}" must be lower case`);
    }

    const routes = meta.routes ? list(meta.routes) : [];
    if (meta.routes !== undefined && !routes.length) at('routes', 'needs at least one app route');
    for (const r of routes) if (!r.startsWith('/')) at('routes', `route "${r}" must start with /`);

    const tryIt = meta.tryIt || null;
    if (tryIt !== null) {
      if (!tryIt.startsWith('/') || /[\s,]/.test(tryIt)) at('tryIt', `tryIt must be one app route, got "${tryIt}"`);
      if (tryIt.includes(':')) at('tryIt', `tryIt "${tryIt}" has a ":" — "Try it" must open without an id`);
    }

    if (meta.since && !SEMVER.test(meta.since)) at('since', `since "${meta.since}" is not x.y.z`);
    if (meta.updated && (!/^\d{4}-\d{2}-\d{2}$/.test(meta.updated)
      || new Date(`${meta.updated}T00:00:00Z`).toISOString().slice(0, 10) !== meta.updated)) {
      at('updated', `updated "${meta.updated}" is not a real YYYY-MM-DD date`);
    }
    let order = null;
    if (meta.order !== undefined) {
      if (!isInt(meta.order)) at('order', `order "${meta.order}" is not an integer`);
      else order = Number(meta.order);
    }

    // media: the front-matter picture and every image in the body
    // Every article has a picture. `mediaPending: <reason>` is the one way to
    // go without, for a picture the help-shots tool can't take (the phone's
    // home screen, a browser); the build lists those so they aren't forgotten.
    const mediaId = meta.media || null;
    const mediaPending = meta.mediaPending || null;
    if (mediaId !== null && mediaPending !== null) {
      at('mediaPending', 'has both "media" and "mediaPending" — drop mediaPending once the picture exists');
    } else if (mediaId === null && mediaPending === null) {
      at('media', 'has no "media" — every article needs a picture (or "mediaPending: <reason>" until a hand-made one exists)');
    } else if (mediaId !== null && !(mediaId in media)) at('media', `media "${mediaId}" is not in help/media.json`);
    if (mediaPending !== null && mediaPending.length > LIMITS.mediaPending) {
      at('mediaPending', `mediaPending is ${mediaPending.length} chars, the limit is ${LIMITS.mediaPending}`);
    }
    for (const b of blocks) {
      if (b.type === 'image' && !(b.media in media)) errors.push(`${rel}:${b.line}  image "${b.media}" is not in help/media.json`);
    }

    // tip: all or nothing
    const tipSet = TIP_KEYS.filter((k) => k in meta);
    let tip = null;
    const tipMissing = TIP_REQUIRED.filter((k) => !(k in meta));
    if (tipSet.length && tipMissing.length) {
      at(tipSet[0], `tip fields are all-or-nothing: has ${tipSet.join(', ')}, missing ${tipMissing.join(', ')}`);
    } else if (tipSet.length) {
      if (meta.tipTitle.length > LIMITS.tipTitle) at('tipTitle', `tipTitle is ${meta.tipTitle.length} chars, the limit is ${LIMITS.tipTitle}`);
      if (meta.tipBody.length > LIMITS.tipBody) at('tipBody', `tipBody is ${meta.tipBody.length} chars, the limit is ${LIMITS.tipBody}`);
      if ('tipSkipIf' in meta && !skipKeys.has(meta.tipSkipIf)) at('tipSkipIf', `tipSkipIf "${meta.tipSkipIf}" is not in help/skip-keys.json`);
      const pr = Number(meta.tipPriority);
      if (!isInt(meta.tipPriority) || pr < 1 || pr > 100) at('tipPriority', `tipPriority "${meta.tipPriority}" must be an integer 1–100`);
      tip = { title: meta.tipTitle, body: meta.tipBody, skipIf: meta.tipSkipIf || null, priority: pr };
    }

    // checklist: both or neither
    const clSet = CHECKLIST_KEYS.filter((k) => k in meta);
    let checklist = null;
    if (clSet.length === 1) {
      at(clSet[0], `checklist fields are both-or-neither: missing ${CHECKLIST_KEYS.find((k) => !(k in meta))}`);
    } else if (clSet.length === 2) {
      if (!isInt(meta.checklist) || Number(meta.checklist) < 1) at('checklist', `checklist "${meta.checklist}" must be a positive integer`);
      if (!skipKeys.has(meta.checklistDoneIf)) at('checklistDoneIf', `checklistDoneIf "${meta.checklistDoneIf}" is not in help/skip-keys.json`);
      checklist = { order: Number(meta.checklist), doneIf: meta.checklistDoneIf };
    }

    articles.push({
      rel, metaLine,
      id: meta.id || wantId,
      topic: topicDir,
      slug,
      title: meta.title || '',
      summary: meta.summary || '',
      keywords,
      routes,
      tryIt,
      since: meta.since || '0.0.0',
      updated: meta.updated || '',
      order,
      media: mediaId,
      mediaPending,
      related: meta.related ? list(meta.related) : [],
      tip,
      checklist,
      blocks: blocks.map(({ line, ...b }) => b),
    });
  }

  // cross-article rules
  const byId = new Map();
  for (const a of articles) {
    if (byId.has(a.id)) errors.push(`${a.rel}:${a.metaLine.id || 1}  id "${a.id}" is also used by ${byId.get(a.id).rel}`);
    else byId.set(a.id, a);
  }
  for (const a of articles) {
    for (const r of a.related) {
      if (r === a.id) errors.push(`${a.rel}:${a.metaLine.related}  related lists the article itself`);
      else if (!byId.has(r)) errors.push(`${a.rel}:${a.metaLine.related}  related "${r}" is not an article id`);
    }
  }
  const checklistAt = new Map();
  for (const a of articles) {
    if (!a.checklist) continue;
    const o = a.checklist.order;
    if (checklistAt.has(o)) errors.push(`${a.rel}:${a.metaLine.checklist}  checklist order ${o} is also used by ${checklistAt.get(o).rel}`);
    else checklistAt.set(o, a);
  }
  const used = new Set();
  for (const a of articles) {
    if (a.media) used.add(a.media);
    for (const b of a.blocks) if (b.type === 'image') used.add(b.media);
  }
  for (const id of Object.keys(media)) {
    if (!used.has(id)) errors.push(`help/media.json:1  "${id}" is used by no article (orphan) — delete it or use it`);
  }

  const topicRank = Object.fromEntries(topicIds.map((t, n) => [t, n]));
  articles.sort((a, b) => (topicRank[a.topic] ?? 99) - (topicRank[b.topic] ?? 99)
    || (a.order ?? Infinity) - (b.order ?? Infinity)
    || a.title.localeCompare(b.title, 'en'));

  return { locale, topics, ui, articles, media, skipKeys, errors, warnings };
}

/**
 * Load and check one translation, help/<locale>/, against the English help
 * `en` (from loadHelp). `listed` = the locale is in HELP_LOCALES and gets
 * built: then a missing article, _ui.json key or own picture is an error. An
 * unlisted folder is checked all the same (a half-done language is caught
 * early), it just may be incomplete.
 *
 * `gaps` is this locale's part of help/media-gaps.json — { mediaId: reason } —
 * the only pictures a listed locale may still show in English. A gap the
 * locale has its own picture for is stale, and an error either way.
 *
 * Returns the same shape as loadHelp — { locale, topics, ui, articles, media,
 * errors, warnings, notes } — with each article the English one plus the
 * translated text, in English order. `media` is help/media.<locale>.json: the
 * pictures this locale has of its own. mediaFor() picks between the two.
 */
export function loadTranslation({ root, locale, en, listed, gaps = {} }) {
  const errors = [], warnings = [], notes = [];
  const helpDir = path.join(root, 'help');
  const relTo = (f) => path.relative(root, f).split(path.sep).join('/');
  const topicIds = Object.keys(en.topics);
  const cased = (s) => s !== s.toLocaleLowerCase(locale);

  const ui = loadUi({ root, locale, en: en.ui, listed, topicIds, errors }) || {};

  // media.<locale>.json: a subset of the English ids, each with its own file
  const mediaRel = `help/media.${locale}.json`;
  const mediaFile = path.join(helpDir, `media.${locale}.json`);
  const media = fs.existsSync(mediaFile) ? readJson(mediaFile, mediaRel, errors, {}) : {};
  const mediaDir = path.join(root, 'static', 'help', 'media', locale);
  for (const [id, m] of Object.entries(media)) {
    const where = `${mediaRel}:1  "${id}"`;
    const enM = en.media[id];
    if (!enM) { errors.push(`${where} is not in help/media.json — a locale picture replaces an English one, it never adds one`); continue; }
    if (!m || typeof m.file !== 'string') { errors.push(`${where} has no "file"`); continue; }
    if (!Number.isInteger(m.w) || !Number.isInteger(m.h) || m.w <= 0 || m.h <= 0) errors.push(`${where} needs integer "w" and "h"`);
    if (m.kind !== enM.kind) errors.push(`${where} has kind "${m.kind}", the English one is "${enM.kind}"`);
    if (!fs.existsSync(path.join(mediaDir, m.file))) errors.push(`${where} names ${m.file}, which is not in static/help/media/${locale}/`);
    if (m.kind === 'clip' && (typeof m.poster !== 'string' || !fs.existsSync(path.join(mediaDir, m.poster)))) {
      errors.push(`${where} is a clip and needs a "poster" file that exists`);
    }
  }

  const enById = new Map(en.articles.map((a) => [a.id, a]));
  const byId = new Map();
  const stale = [];
  for (const { topicDir, slug, file } of articleFiles(root, locale, errors)) {
    const rel = relTo(file);
    const parsed = parseArticle(fs.readFileSync(file, 'utf8'), rel, locale);
    errors.push(...parsed.errors);
    const { meta, metaLine, blocks, lastLine } = parsed;
    const at = (key, msg) => errors.push(`${rel}:${metaLine[key] || 1}  ${msg}`);

    const wantId = `${topicDir}-${slug}`;
    const enA = enById.get(wantId);
    if (!enA) { at('id', `"${wantId}" is not an English article (no help/en/${topicDir}/${slug}.md) — a translation needs its English original`); continue; }
    if (!meta.id) at('id', '"id" is required');
    else if (meta.id !== wantId) at('id', `id is "${meta.id}", expected "${wantId}" (<topic>-<slug> from the path)`);

    for (const k of ['title', 'summary', 'keywords', 'translatedFrom']) if (!meta[k]) at(k, `"${k}" is required`);
    for (const [k, cap] of [['title', LIMITS.title], ['summary', LIMITS.summary], ['tipTitle', LIMITS.tipTitle], ['tipBody', LIMITS.tipBody]]) {
      const n = meta[k] ? graphemes(meta[k]) : 0;
      if (n > trLimit(cap)) at(k, `${k} is ${n} characters, the limit for a translation is ${trLimit(cap)}`);
    }

    const keywords = meta.keywords ? list(meta.keywords) : [];
    if (meta.keywords) {
      if (keywords.length < LIMITS.keywordsMin || keywords.length > LIMITS.keywordsMax) at('keywords', `has ${keywords.length} keywords, expected ${LIMITS.keywordsMin}–${LIMITS.keywordsMax}`);
      for (const k of keywords) if (cased(k)) at('keywords', `keyword "${k}" must be lower case`);
    }

    // the tip's words: exactly when English has a tip
    if (enA.tip) {
      for (const k of ['tipTitle', 'tipBody']) if (!meta[k]) at(k, `"${k}" is required — the English article has a tip`);
    } else {
      for (const k of ['tipTitle', 'tipBody']) if (k in meta) at(k, `"${k}" is not allowed — the English article has no tip`);
    }

    if (meta.translatedFrom) {
      const d = meta.translatedFrom;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || new Date(`${d}T00:00:00Z`).toISOString().slice(0, 10) !== d) {
        at('translatedFrom', `translatedFrom "${d}" is not a real YYYY-MM-DD date`);
      } else if (d > enA.updated) {
        at('translatedFrom', `translatedFrom ${d} is newer than the English "updated" (${enA.updated}) — it names the English version it was translated from`);
      } else if (d < enA.updated) stale.push(enA.id);
    }

    // body parity: the same blocks, in the same order, as English
    const what = (b) => (!b ? 'nothing'
      : b.type === 'steps' ? `${b.items.length} step(s)`
        : b.type === 'image' ? `image "${b.media}"`
          : b.type === 'note' ? 'a note' : 'a paragraph');
    const n = Math.max(blocks.length, enA.blocks.length);
    for (let k = 0; k < n; k++) {
      if (what(blocks[k]) !== what(enA.blocks[k])) {
        errors.push(`${rel}:${blocks[k]?.line || lastLine}  block ${k + 1} is ${what(blocks[k])}, but ${enA.rel} has ${what(enA.blocks[k])} there — a translation keeps the English blocks in the same order`);
        break;
      }
    }

    byId.set(enA.id, {
      ...enA,
      rel, metaLine,
      title: meta.title || '',
      summary: meta.summary || '',
      keywords,
      tip: enA.tip ? { ...enA.tip, title: meta.tipTitle || '', body: meta.tipBody || '' } : null,
      translatedFrom: meta.translatedFrom || '',
      blocks: blocks.map(({ line, ...b }) => b),
    });
  }

  const missing = en.articles.filter((a) => !byId.has(a.id));
  if (listed) {
    for (const a of missing) {
      errors.push(`help/${locale}/${a.topic}/${a.slug}.md:1  missing — every English article needs a translation while "${locale}" is in HELP_LOCALES`);
    }
  }
  if (stale.length) warnings.push(`help ${locale}: ${stale.length} article(s) older than English: ${stale.join(', ')}`);

  const articles = en.articles.map((a) => byId.get(a.id)).filter(Boolean);
  const help = { locale, topics: en.topics, ui, articles, media, enMedia: en.media, skipKeys: en.skipKeys, errors, warnings, notes, missing };
  const english = usedMedia(articles).filter((id) => mediaFor(help, id).locale === 'en');
  help.englishPictures = english.length;
  if (listed) {
    for (const id of english) {
      if (!(id in gaps)) errors.push(`help/media.${locale}.json:1  "${id}" missing — every picture of a HELP_LOCALES locale is its own; shoot it, or list it in help/media-gaps.json with a reason`);
    }
  }
  for (const id of Object.keys(gaps)) {
    if (media[id]) errors.push(`help/media-gaps.json:1  ${locale} "${id}" has its own picture now (help/media.${locale}.json) — delete the stale gap`);
  }
  if (english.length) notes.push(`help ${locale}: ${english.length} picture(s) in English ${listed ? '(listed gaps)' : 'for now'}`);
  if (!listed) notes.push(`help ${locale}: not in HELP_LOCALES — checked, not built (${articles.length} of ${en.articles.length} article(s))`);
  return help;
}

/** Every media id the articles use: the front-matter picture and body images. */
function usedMedia(articles) {
  const used = new Set();
  for (const a of articles) {
    if (a.media) used.add(a.media);
    for (const b of a.blocks) if (b.type === 'image') used.add(b.media);
  }
  return [...used];
}

/**
 * Which picture a locale shows for a media id: its own (help/media.<locale>.json
 * and static/help/media/<locale>/) when it has one, the English one otherwise.
 * Returns { m, locale } — the entry (file, w, h, kind, poster) and the folder.
 */
export function mediaFor(help, id) {
  if (help.locale !== 'en' && help.media[id]) return { m: help.media[id], locale: help.locale };
  return { m: (help.enMedia || help.media)[id], locale: 'en' };
}

/**
 * English plus every translation: help/en/ always, then every locale in
 * `helpLocales` and every help/<code>/ folder there is. Returns
 * { en, byLocale, built, errors, warnings, notes } where `built` is the help of
 * each HELP_LOCALES locale, in list order, English first.
 */
export function loadAllHelp({ root, topics, icons, helpLocales = ['en'], locales }) {
  const en = loadHelp({ root, topics, icons });
  const errors = [...en.errors], warnings = [...en.warnings], notes = [];
  if (helpLocales[0] !== 'en') errors.push('site.config.mjs:1  HELP_LOCALES must start with "en" — English is the source every translation is checked against');
  for (const code of helpLocales) {
    if (!locales.includes(code)) errors.push(`site.config.mjs:1  HELP_LOCALES has "${code}", which is not in LOCALES`);
  }
  const helpDir = path.join(root, 'help');
  const folders = fs.existsSync(helpDir)
    ? fs.readdirSync(helpDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
    : [];
  // help/media-gaps.json: { locale: { mediaId: reason } }, the pictures a built
  // locale may still show in English. Optional; no file = no gaps.
  const gapsFile = path.join(helpDir, 'media-gaps.json');
  const gaps = fs.existsSync(gapsFile) ? readJson(gapsFile, 'help/media-gaps.json', errors, {}) : {};
  for (const [code, ids] of Object.entries(gaps)) {
    const where = `help/media-gaps.json:1  "${code}"`;
    if (code === 'en' || !helpLocales.includes(code)) { errors.push(`${where} is not a translated HELP_LOCALES locale — only a built translation has gaps`); continue; }
    if (!ids || typeof ids !== 'object' || Array.isArray(ids)) { errors.push(`${where} must be an object { mediaId: reason }`); continue; }
    for (const [id, why] of Object.entries(ids)) {
      if (!(id in en.media)) errors.push(`${where} "${id}" is not in help/media.json`);
      if (typeof why !== 'string' || !why.trim()) errors.push(`${where} "${id}" needs a reason`);
    }
  }
  const byLocale = new Map([['en', en]]);
  for (const code of [...new Set([...helpLocales, ...folders])]) {
    if (code === 'en') continue;
    if (!locales.includes(code)) {
      if (folders.includes(code)) errors.push(`help/${code}/:1  "${code}" is not a site locale (LOCALES) — translations use the site's codes (de, zh-Hans, …)`);
      continue;
    }
    const own = gaps[code] && typeof gaps[code] === 'object' && !Array.isArray(gaps[code]) ? gaps[code] : {};
    const t = loadTranslation({ root, locale: code, en, listed: helpLocales.includes(code), gaps: own });
    errors.push(...t.errors);
    warnings.push(...t.warnings);
    notes.push(...t.notes);
    byLocale.set(code, t);
  }
  const built = helpLocales.filter((c) => byLocale.has(c)).map((c) => byLocale.get(c));
  return { en, byLocale, built, errors, warnings, notes };
}

/**
 * What the PAGES show: articles whose `since` is not newer than the live app,
 * and the topics that still have at least one of them. en.json does not use
 * this — it carries everything and the app filters by its own version.
 * build.mjs and check-build.mjs both call it, so the pages built and the pages
 * expected cannot disagree.
 */
export function visibleHelp(help, liveVersion) {
  const articles = help.articles.filter((a) => compareVersions(a.since, liveVersion) <= 0);
  const topics = Object.keys(help.topics).filter((t) => articles.some((a) => a.topic === t));
  return { articles, topics };
}

/**
 * The app's routes, read out of its source: every `static const x = '/…';`
 * inside `class RoutePaths` in lib/core/routing/route_names.dart. The app is
 * the source of truth for which screens exist, so the guard reads it rather
 * than keeping a copy that could drift.
 */
export function readAppRoutes(appRepoPath) {
  const file = path.join(appRepoPath, 'lib', 'core', 'routing', 'route_names.dart');
  if (!fs.existsSync(file)) {
    throw new Error(`cannot find ${file} — set DAILI_APP_REPO to the app repo (default ../familyplanner-app), or HELP_SKIP_ROUTE_CHECK=1 to skip the route checks`);
  }
  const src = fs.readFileSync(file, 'utf8');
  const start = src.search(/class RoutePaths\b/);
  if (start < 0) throw new Error(`${file} has no "class RoutePaths" block`);
  // The class body ends at the first `}` in column 0 after it.
  const end = src.indexOf('\n}', start);
  const body = src.slice(start, end < 0 ? undefined : end);
  const routes = new Set();
  for (const m of body.matchAll(/static const \w+\s*=\s*'(\/[^']*)';/g)) routes.add(m[1]);
  if (!routes.size) throw new Error(`${file}: found no routes in class RoutePaths`);
  return routes;
}

/**
 * The whole guard: loadAllHelp() plus everything that needs the app's routes
 * and the allowlist. Returns { errors, warnings, notes, help, all } — `help` is
 * English, `all` what loadAllHelp returned. `appRoutes` is a Set, or null to
 * skip the route checks (HELP_SKIP_ROUTE_CHECK=1). Routes are English-only data,
 * so they are checked once, on English.
 */
export function checkHelp({ root, topics, icons, appRoutes, helpLocales = ['en'], locales = ['en'] }) {
  const all = loadAllHelp({ root, topics, icons, helpLocales, locales });
  const help = all.en;
  const errors = [...all.errors];
  const warnings = [...all.warnings];
  const notes = all.notes;
  if (!appRoutes) return { errors, warnings, notes, help, all };

  const allow = readJson(path.join(root, 'help', 'routes-allowlist.json'), 'help/routes-allowlist.json', errors, {});
  const never = allow.never || {};
  const pending = allow.pending || {};
  for (const [name, group] of [['never', never], ['pending', pending]]) {
    for (const [route, why] of Object.entries(group)) {
      if (typeof why !== 'string' || !why.trim()) errors.push(`help/routes-allowlist.json:1  ${name} "${route}" needs a reason`);
    }
  }

  const covered = new Map(); // route -> first article covering it
  for (const a of help.articles) {
    for (const r of a.routes) {
      if (!appRoutes.has(r)) errors.push(`${a.rel}:${a.metaLine.routes}  route "${r}" is not an app route (renamed or removed screen?)`);
      if (!covered.has(r)) covered.set(r, a);
    }
    if (a.tryIt && !appRoutes.has(a.tryIt)) {
      errors.push(`${a.rel}:${a.metaLine.tryIt}  tryIt "${a.tryIt}" is not an app route (renamed or removed screen?)`);
    }
  }

  for (const r of appRoutes) {
    if (!covered.has(r) && !(r in never) && !(r in pending)) {
      errors.push(`help/routes-allowlist.json:1  app route "${r}" has no article — write one, or add it to "pending" (or "never")`);
    }
  }
  for (const [name, group] of [['never', never], ['pending', pending]]) {
    for (const r of Object.keys(group)) {
      if (!appRoutes.has(r)) errors.push(`help/routes-allowlist.json:1  ${name} "${r}" is not an app route any more — remove the stale entry`);
      else if (covered.has(r)) errors.push(`help/routes-allowlist.json:1  ${name} "${r}" is covered by ${covered.get(r).rel} — remove the stale entry`);
    }
  }
  for (const r of Object.keys(never)) {
    if (r in pending) errors.push(`help/routes-allowlist.json:1  "${r}" is in both never and pending`);
  }

  return { errors, warnings, notes, help, all };
}
