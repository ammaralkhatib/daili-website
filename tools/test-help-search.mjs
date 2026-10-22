#!/usr/bin/env node
// Tests the help search (static/assets/help-search.js), above all the second
// try: when nothing is found, words of 5+ characters are cut to their first
// max(4, length − 3) and searched once more — the same rule as the app.
//
// It runs the real file against a tiny fake DOM (no copy of the matching to
// drift), types into the fake field and reads the result rows back. A cut word
// is pinned by two searches: an article whose text is exactly the cut word is
// found, one whose text is the cut word minus its last letter is not.
//
// When the site is built, the real search index of dist/help/ and
// dist/de/help/ is checked too: "pricing", "kosten" … find Daili Plus.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SRC = fs.readFileSync(path.join(ROOT, 'static/assets/help-search.js'), 'utf8');

function el(extra = {}) {
  const e = {
    children: [], hidden: false, listeners: {},
    appendChild(c) { this.children.push(c); return c; },
    insertAdjacentHTML() {},
    addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); },
    getAttribute() { return null; },
    ...extra,
  };
  let text = '';
  Object.defineProperty(e, 'textContent', {
    get: () => text,
    set: (v) => { text = String(v); e.children = []; },
  });
  return e;
}

/** Load help-search.js on a fake /help/ page. Returns type(query) → titles, and the misses sent. */
function page(articles, lang = 'en') {
  const sent = [];
  const timers = [];
  const ids = {
    'help-q': el({ value: '' }),
    'help-index': el(),
    'help-results': el(),
    'help-results-list': el(),
    'help-none': el(),
  };
  ids['help-index'].textContent = JSON.stringify(articles.map((a) => ({
    url: '/help/x/', title: a.title, summary: a.summary || '', keywords: a.keywords || '', topic: a.topic || '', text: a.text || '',
  })));
  const document = {
    documentElement: { getAttribute: (k) => (k === 'lang' ? lang : null) },
    getElementById: (id) => ids[id] || null,
    createElement: () => el(),
  };
  const fetch = (url, opts) => { sent.push(JSON.parse(opts.body).events[0]); return Promise.resolve(); };
  const setTimeout = (fn) => timers.push(fn);
  const clearTimeout = () => {};
  // eslint-disable-next-line no-new-func
  new Function('document', 'fetch', 'setTimeout', 'clearTimeout', 'localStorage', SRC)
    (document, fetch, setTimeout, clearTimeout, null);
  const input = ids['help-q'];
  return {
    sent,
    none: () => !ids['help-none'].hidden,
    type(q) {
      input.value = q;
      input.listeners.input.forEach((fn) => fn());
      return ids['help-results-list'].children.map((li) => li.children[0].children[0].children[0].textContent);
    },
    leave() { input.listeners.blur.forEach((fn) => fn()); },
  };
}

let pass = 0;
const failures = [];
function check(label, got, want) {
  const g = JSON.stringify(got);
  const w = JSON.stringify(want);
  if (g === w) { pass++; return; }
  failures.push(`${label.padEnd(44)} got ${g}  want ${w}`);
}

// ---- the cut words, each pinned by "found" and "one letter less: not found" -
const CUTS = [
  ['pricing', 'pric'], ['invites', 'invi'], ['rezepten', 'rezep'], ['reminders', 'remind'],
  ['costs', 'cost'], ['kosten', 'kost'], ['add events', 'add even'], ['shop', 'shop'], ['café', 'cafe'],
];
for (const [typed, cut] of CUTS) {
  const shorter = cut.split(' ').map((w, i, a) => (i === a.length - 1 ? w.slice(0, -1) : w)).join(' ');
  const p = page([{ title: 'Exact', text: cut }, { title: 'Shorter', text: shorter }]);
  check(`cut ${typed} → ${cut}`, p.type(typed), ['Exact']);
}

// ---- "pricing" finds an article that only says "price" ----------------------
{
  const p = page([{ title: 'Daili Plus', text: 'One yearly price for the family.' }, { title: 'Lists', text: 'Shopping' }]);
  check('pricing finds price', p.type('pricing'), ['Daili Plus']);
  p.leave();
  check('no miss when the second try finds it', p.sent, []);
}

// ---- a query the first try answers: first-try result, no second try ---------
{
  // A second try ("cost") would also find "Price"; the first try must not.
  const p = page([{ title: 'Price', text: 'what it cost' }, { title: 'Budget', text: 'shared costs' }]);
  check('first try answers: unchanged', p.type('costs'), ['Budget']);
}

// ---- results look the same; title hits first --------------------------------
{
  const p = page([{ title: 'Calendar', text: 'Add an invite' }, { title: 'Invite your family', text: 'Code' }]);
  check('second try: title first', p.type('invites'), ['Invite your family', 'Calendar']);
}

// ---- a miss is sent only when both tries find nothing, as typed --------------
{
  const p = page([{ title: 'Daili Plus', text: 'price' }]);
  check('xyzzyq: no result', p.type('xyzzyq'), []);
  check('xyzzyq: "no result" shows', p.none(), true);
  p.leave();
  check('miss sent as typed', p.sent.map((e) => [e.kind, e.subject]), [['search_miss', 'xyzzyq']]);
}

// ---- ja: no second try -------------------------------------------------------
{
  const p = page([{ title: 'プラス', text: 'pric' }], 'ja');
  check('ja: no second try', p.type('pricing'), []);
  p.leave();
  check('ja: miss sent', p.sent.map((e) => e.subject), ['pricing']);
}

// ---- the built pages: Daili Plus is found ------------------------------------
const built = [
  ['dist/help/index.html', ['pricing', 'costs', 'how much', 'cost']],
  ['dist/de/help/index.html', ['kosten', 'wie viel', 'preise', 'gebühr']],
];
let builtChecked = 0;
for (const [rel, queries] of built) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  const m = html.match(/<script type="application\/json" id="help-index">([\s\S]*?)<\/script>/);
  if (!m) { failures.push(`${rel}: no help-index`); continue; }
  const lang = html.match(/<html[^>]* lang="([^"]+)"/)[1];
  const index = JSON.parse(m[1]);
  const plus = index.find((a) => a.url.endsWith('/account/plus/'));
  if (!plus) { failures.push(`${rel}: no account/plus article in the index`); continue; }
  const p = page(index, lang);
  for (const q of queries) check(`${rel}: ${q}`, p.type(q).includes(plus.title), true);
  builtChecked++;
}

if (failures.length) {
  console.error(`\nhelp search: ${failures.length} failure(s), ${pass} passed:\n`);
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`help search OK · ${pass} cases · ${builtChecked} built page(s)`);
