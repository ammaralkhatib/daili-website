// The help center's parser and rules. Shared by build.mjs (which renders the
// pages and help/en.json from what this returns) and tools/check-help.mjs (the
// guard). Node standard library only, like everything else in this repo.
//
// An article is a small Markdown file with flat `key: value` front matter:
//
//   help/<locale>/<topic>/<slug>.md
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
const CHECKLIST_KEYS = ['checklist', 'checklistDoneIf'];

export const LIMITS = {
  title: 70, summary: 140, keywordsMin: 1, keywordsMax: 12,
  steps: 7, images: 2, words: 150,
  tipTitle: 60, tipBody: 120, topicSummary: 90, mediaPending: 80,
};

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
 * clickable.
 */
export function parseArticle(src, rel) {
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
    if (!KEYS.has(key)) { at(i + 1, `unknown front-matter key "${key}"`); continue; }
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
    if (para) blocks.push({ type: 'p', text: para.text });
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
      blocks.push({ type: 'note', text: note[1].trim() });
      continue;
    }

    for (const p of inlineProblems(line)) at(ln, p);
    if (para) para.text += ' ' + line.trim();
    else para = { text: line.trim(), line: ln };
  }
  closePara();

  const words = blocks.reduce((sum, b) => sum
    + (b.type === 'p' || b.type === 'note' ? countWords(b.text) : 0)
    + (b.type === 'steps' ? b.items.reduce((s, it) => s + countWords(it), 0) : 0), 0);
  if (words > LIMITS.words) at(i + 2, `body is ${words} words, the limit is ${LIMITS.words}`);
  if (!blocks.length) at(i + 2, 'body is empty');

  // Keep `line` for the guard's messages, drop it from what is rendered.
  return { meta, metaLine, blocks, errors };
}

function readJson(file, rel, errors, fallback) {
  if (!fs.existsSync(file)) { errors.push(`${rel}:1  missing`); return fallback; }
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) {
    errors.push(`${rel}:1  invalid JSON: ${e.message}`);
    return fallback;
  }
}

/**
 * Load and check every article of one locale.
 *
 * Returns { topics, articles, media, errors, warnings }. `articles` is sorted
 * by topic order, then `order`, then title — the order every page and en.json
 * use. `errors` holds EVERY problem found, not the first, each as
 * "file:line  message". Checks that need the app (routes) are not here; see
 * checkHelp().
 *
 * `topics` and `icons` default to the site's, and are parameters so the guard's
 * test can run this against a fixture.
 */
export function loadHelp({ root, locale = 'en', topics, icons }) {
  const errors = [], warnings = [];
  const helpDir = path.join(root, 'help');
  const relTo = (f) => path.relative(root, f).split(path.sep).join('/');

  // topics
  const topicIds = Object.keys(topics);
  for (const [id, t] of Object.entries(topics)) {
    if (!t || typeof t.title !== 'string' || !t.title) errors.push(`site.config.mjs:1  HELP_TOPICS.${id} has no title`);
    if (!t || typeof t.summary !== 'string' || !t.summary) errors.push(`site.config.mjs:1  HELP_TOPICS.${id} has no summary`);
    else if (t.summary.length > LIMITS.topicSummary) errors.push(`site.config.mjs:1  HELP_TOPICS.${id}.summary is ${t.summary.length} chars, the limit is ${LIMITS.topicSummary}`);
    if (!icons.includes(t?.icon)) errors.push(`site.config.mjs:1  HELP_TOPICS.${id} has icon "${t?.icon}", which is not in HELP_ICONS (${icons.join(', ')})`);
  }

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
  const localeDir = path.join(helpDir, locale);
  const files = [];
  if (fs.existsSync(localeDir)) {
    for (const t of fs.readdirSync(localeDir, { withFileTypes: true })) {
      const tdir = path.join(localeDir, t.name);
      if (!t.isDirectory()) { errors.push(`${relTo(tdir)}:1  only topic folders belong in help/${locale}/`); continue; }
      for (const f of fs.readdirSync(tdir)) {
        if (!f.endsWith('.md')) { errors.push(`${relTo(path.join(tdir, f))}:1  not a .md article`); continue; }
        files.push({ topicDir: t.name, slug: f.slice(0, -3), file: path.join(tdir, f) });
      }
    }
  }

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
    if (tipSet.length && tipSet.length !== TIP_KEYS.length) {
      at(tipSet[0], `tip fields are all-or-nothing: has ${tipSet.join(', ')}, missing ${TIP_KEYS.filter((k) => !(k in meta)).join(', ')}`);
    } else if (tipSet.length) {
      if (meta.tipTitle.length > LIMITS.tipTitle) at('tipTitle', `tipTitle is ${meta.tipTitle.length} chars, the limit is ${LIMITS.tipTitle}`);
      if (meta.tipBody.length > LIMITS.tipBody) at('tipBody', `tipBody is ${meta.tipBody.length} chars, the limit is ${LIMITS.tipBody}`);
      if (!skipKeys.has(meta.tipSkipIf)) at('tipSkipIf', `tipSkipIf "${meta.tipSkipIf}" is not in help/skip-keys.json`);
      const pr = Number(meta.tipPriority);
      if (!isInt(meta.tipPriority) || pr < 1 || pr > 100) at('tipPriority', `tipPriority "${meta.tipPriority}" must be an integer 1–100`);
      tip = { title: meta.tipTitle, body: meta.tipBody, skipIf: meta.tipSkipIf, priority: pr };
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

  return { topics, articles, media, skipKeys, errors, warnings };
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
 * The whole guard: loadHelp() plus everything that needs the app's routes and
 * the allowlist. Returns { errors, warnings, help }. `appRoutes` is a Set, or
 * null to skip the route checks (HELP_SKIP_ROUTE_CHECK=1).
 */
export function checkHelp({ root, locale = 'en', topics, icons, appRoutes }) {
  const help = loadHelp({ root, locale, topics, icons });
  const errors = [...help.errors];
  const warnings = [...help.warnings];
  if (!appRoutes) return { errors, warnings, help };

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

  return { errors, warnings, help };
}
