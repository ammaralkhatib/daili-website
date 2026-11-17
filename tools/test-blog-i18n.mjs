#!/usr/bin/env node
// Proves the blog translation guards can fail (2026-11-17/001). A guard that
// has never been seen going red is a guard nobody knows works, so for every
// rule in tools/blog-i18n.mjs — the two files of a translation (requirement 1
// of the prompt), the fixed words, and the judges of 8a–8d — this plants one
// bad case in a throwaway copy of a made-up fixture post and asserts the rule
// reports it, naming the file. It also asserts the clean fixture passes, so a
// rule that fires on everything cannot pass as "working".
//
// No site build: the fixture is tools/fixtures/blog-i18n/ (two made-up posts,
// one with a German translation) plus a copy of the real blog/ui/. Nothing
// here reaches dist/. Runs in `npm test` and in `npm run build` before
// build.mjs.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadBlogUi, loadBlogTranslations, judgeTranslations, englishLeftovers, forbiddenHits,
} from './blog-i18n.mjs';
import { BLOG_LOCALES } from '../site.config.mjs';

const REPO = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const FIXTURE = path.join(REPO, 'tools/fixtures/blog-i18n');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'daili-blog-i18n-test-'));
process.on('exit', () => fs.rmSync(TMP, { recursive: true, force: true }));

const POSTS = JSON.parse(fs.readFileSync(path.join(FIXTURE, 'posts.json'), 'utf8'));
const SLUG = 'rainy-day-picnic-plan';
const DE_HTML = `blog/${SLUG}.de.html`;
const DE_JSON = `blog/${SLUG}.de.json`;

/** Where the fixture's English links go in German: the pages that exist there. */
const LOCALIZED = { de: { '/': '/de/', '/features/calendar/': '/de/features/calendar/' } };
const localizeFor = (loc) => (href) => {
  const [, p, rest] = href.match(/^([^#?]*)(.*)$/);
  return LOCALIZED[loc]?.[p] ? LOCALIZED[loc][p] + rest : href;
};

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dest, e.name);
    if (e.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
}

/**
 * A fresh copy of the fixture (with the real blog/ui/), broken by `mutate`,
 * and everything the guards say about it. `mutate` gets a small toolkit so
 * each case below reads as the one thing it plants.
 */
let n = 0;
function run(mutate = () => {}) {
  const root = path.join(TMP, `f${n++}`);
  copyDir(path.join(FIXTURE, 'blog'), path.join(root, 'blog'));
  copyDir(path.join(REPO, 'blog/ui'), path.join(root, 'blog/ui'));
  const posts = structuredClone(POSTS);
  const f = (rel) => path.join(root, rel);
  const kit = {
    posts,
    read: (rel) => fs.readFileSync(f(rel), 'utf8'),
    write: (rel, s) => fs.writeFileSync(f(rel), s),
    remove: (rel) => fs.rmSync(f(rel)),
    edit: (rel, fn) => fs.writeFileSync(f(rel), fn(fs.readFileSync(f(rel), 'utf8'))),
    json: (rel, fn) => { const j = JSON.parse(fs.readFileSync(f(rel), 'utf8')); fn(j); fs.writeFileSync(f(rel), JSON.stringify(j, null, 2)); },
  };
  mutate(kit);
  const ui = loadBlogUi({ root, blogLocales: BLOG_LOCALES });
  const tr = loadBlogTranslations({ root, posts, blogLocales: BLOG_LOCALES });
  const judged = ui.ui.en ? judgeTranslations({
    root, posts, byPost: tr.byPost, ui: ui.ui, localizeFor,
    enBodyOf: (p) => fs.readFileSync(f(`blog/${p.body}`), 'utf8'),
  }) : [];
  return { errors: [...ui.errors, ...tr.errors, ...judged], byPost: tr.byPost };
}

let passed = 0;
const failures = [];
/** The case must report a message matching `re`. */
function expectFail(name, re, mutate) {
  const { errors } = run(mutate);
  if (errors.some((e) => re.test(e))) passed++;
  else failures.push(`${name}: expected a message matching ${re}, got:\n    ${errors.join('\n    ') || '(no messages)'}`);
}

// ---- the clean fixture passes, and loads as a German translation ------------
{
  const { errors, byPost } = run();
  if (errors.length) failures.push(`clean fixture: expected no messages, got:\n    ${errors.join('\n    ')}`);
  else if (byPost[SLUG]?.de?.meta.h1 !== 'Der Picknick-Plan für Regentage') failures.push('clean fixture: the German translation did not load');
  else passed++;
}

// ---- requirement 1: the two files ------------------------------------------
expectFail('only the body', /rainy-day-picnic-plan\.de\.json is missing/, (k) => k.remove(DE_JSON));
expectFail('only the words', /rainy-day-picnic-plan\.de\.html is missing/, (k) => k.remove(DE_HTML));
expectFail('en is the source', /'en' is the source/, (k) => k.write(`blog/${SLUG}.en.json`, k.read(DE_JSON)));
expectFail('a language not in BLOG_LOCALES', /'fr' is not in BLOG_LOCALES/, (k) => {
  k.write(`blog/${SLUG}.fr.html`, k.read(DE_HTML)); k.write(`blog/${SLUG}.fr.json`, k.read(DE_JSON));
});
expectFail('a slug not in BLOG_POSTS', /there is no post 'no-such-post'/, (k) => {
  k.write('blog/no-such-post.de.html', k.read(DE_HTML)); k.write('blog/no-such-post.de.json', k.read(DE_JSON));
});
expectFail('a file name that is no post file', /blog\/Notes\.html: not a post file/, (k) => k.write('blog/Notes.html', '<p>x</p>'));
expectFail('a missing key', /\.de\.json: missing key 'h1'/, (k) => k.json(DE_JSON, (j) => { delete j.h1; }));
expectFail('an empty key', /\.de\.json: 'description' must be a non-empty string/, (k) => k.json(DE_JSON, (j) => { j.description = ' '; }));
expectFail('an empty cta', /\.de\.json: cta\.h2 and cta\.html must be non-empty/, (k) => k.json(DE_JSON, (j) => { j.cta.html = ''; }));
expectFail('another number of questions', /'faq' has 1 question\(s\), the English post has 2/, (k) => k.json(DE_JSON, (j) => { j.faq.pop(); }));
expectFail('a broken question', /faq\[1\] must be exactly \{ q, a \}/, (k) => k.json(DE_JSON, (j) => { j.faq[1] = { q: 'Wer?', answer: 'Alle.' }; }));
expectFail('an unknown key', /unknown key 'slug'/, (k) => k.json(DE_JSON, (j) => { j.slug = 'anders'; }));
expectFail('itemList the English has none of', /has 'itemList', but the English post has none/, (k) => k.json(DE_JSON, (j) => { j.itemList = 'Liste'; }));
expectFail('itemList the English has', /picnic-packing-list\.de\.json: missing key 'itemList'/, (k) => {
  k.write('blog/picnic-packing-list.de.html', '<p>Eine erfundene Liste.</p>\n\n<ol class="doc-checklist">\n<li><strong>Decke</strong> — die große.</li>\n<li><strong>Wasser</strong> — eine Flasche pro Person.</li>\n</ol>\n');
  k.write('blog/picnic-packing-list.de.json', JSON.stringify({ title: 'Die Picknick-Packliste', description: 'Eine erfundene Liste.', h1: 'Die Packliste', imageAlt: 'Ein Korb', faq: [{ q: 'Wie viel Wasser?', a: 'Eine Flasche pro Person.' }], cta: { h2: 'Was daili damit macht', html: '<p>Führ die Liste in daili.</p>' } }));
});
expectFail('an <h1> in the body', /\.de\.html: has an <h1>/, (k) => k.edit(DE_HTML, (s) => `<h1>Titel</h1>\n${s}`));

// ---- the fixed words (blog/ui/<loc>.json) ----------------------------------
expectFail('a missing string', /blog\/ui\/sv\.json: missing string 'newsletter\.button'/, (k) => k.json('blog/ui/sv.json', (j) => { delete j.newsletter.button; }));
expectFail('a missing language file', /blog\/ui\/nb\.json: missing — 'nb' is in BLOG_LOCALES/, (k) => k.remove('blog/ui/nb.json'));
expectFail('an extra key', /blog\/ui\/nl\.json: unknown key 'extra'/, (k) => k.json('blog/ui/nl.json', (j) => { j.extra = 'x'; }));
expectFail('{feature} missing', /blog\/ui\/de\.json: 'seeHowFeature' must contain \{feature\} exactly once/, (k) => k.json('blog/ui/de.json', (j) => { j.seeHowFeature = 'In daili ansehen →'; }));
expectFail('a ui file for a language without a blog', /blog\/ui\/fr\.json: 'fr' is not in BLOG_LOCALES/, (k) => k.write('blog/ui/fr.json', k.read('blog/ui/en.json')));

// ---- 8a. the same shape as the English -------------------------------------
expectFail('one <p> fewer', /\.de\.html: body has 4 <p>, the English has 5/, (k) => k.edit(DE_HTML, (s) => s.replace(/<p>Breite[\s\S]*?<\/p>\n\n/, '')));
expectFail('one <li> more', /\.de\.html: body has 4 <li>, the English has 3/, (k) => k.edit(DE_HTML, (s) => s.replace('<li>Die Uhrzeit</li>', '<li>Die Uhrzeit</li>\n<li>Der Schirm</li>')));
expectFail('a <tr> fewer', /\.de\.html: body has 1 <tr>, the English has 2/, (k) => k.edit(DE_HTML, (s) => s.replace(/<tr><td>Regen[\s\S]*?<\/tr>\n/, '')));
expectFail('a <blockquote> lost', /\.de\.html: body has 0 <blockquote>/, (k) => k.edit(DE_HTML, (s) => s.replace(/<blockquote>([\s\S]*?)<\/blockquote>/, '$1')));
expectFail('another external link', /\.de\.html: body link 1 is https:\/\/example\.org\/wetter, the English links https:\/\/example\.org\/weather/, (k) => k.edit(DE_HTML, (s) => s.replace('https://example.org/weather', 'https://example.org/wetter')));
expectFail('an internal link not in the page\'s language', /\.de\.html: body link 3 goes to \/features\/calendar\/, expected \/de\/features\/calendar\//, (k) => k.edit(DE_HTML, (s) => s.replace('/de/features/calendar/', '/features/calendar/')));
expectFail('an internal link to a page that is not there in German', /\.de\.html: body link 2 goes to \/de\/blog\/picnic-packing-list\/, expected \/blog\/picnic-packing-list\//, (k) => k.edit(DE_HTML, (s) => s.replace('/blog/picnic-packing-list/', '/de/blog/picnic-packing-list/')));
expectFail('an in-page link changed', /\.de\.html: body link 4 is #packen/, (k) => k.edit(DE_HTML, (s) => s.replace('href="#pack"', 'href="#packen"')));
expectFail('the CTA link not in the page\'s language', /\.de\.json: cta\.html link 1 goes to \/, expected \/de\//, (k) => k.json(DE_JSON, (j) => { j.cta.html = j.cta.html.replace('href="/de/"', 'href="/"'); }));

// ---- 8b. not a copy ---------------------------------------------------------
expectFail('the English body', /\.de\.html: the body is the English body/, (k) => k.write(DE_HTML, k.read(`blog/${SLUG}.en.html`)));
expectFail('the English title', /\.de\.json: 'title' is the English title/, (k) => k.json(DE_JSON, (j) => { j.title = POSTS[0].title; }));
expectFail('the English h1', /\.de\.json: 'h1' is the English h1/, (k) => k.json(DE_JSON, (j) => { j.h1 = POSTS[0].h1; }));

// ---- 8c. no English left over (on a built page) ------------------------------
{
  const ui = loadBlogUi({ root: REPO, blogLocales: BLOG_LOCALES }).ui;
  const page = (inner) => `<!doctype html><html lang="de"><head><title>${ui.en.faqHeading}</title></head><body>${inner}<script>var s = "Keep reading";</script></body></html>`;
  const clean = englishLeftovers({ html: page(`<h2>${ui.de.faqHeading}</h2><h2>${ui.de.keepReading}</h2>`), loc: 'de', ui });
  if (clean.length) failures.push(`8c clean page: expected no English, got ${clean.join(', ')}`);
  else passed++;
  const cases = [
    ['a heading', `<h2>Keep reading</h2>`, /"Keep reading" \(keepReading\)/],
    ['a placeholder', `<input placeholder="you@example.com">`, /"you@example\.com" \(newsletter\.placeholder\)/],
    ['half of the feature line', `<a href="/de/features/calendar/">See how Kalender works in daili →</a>`, /"See how" \(seeHowFeature\)/],
    ['another case', `<p>FREQUENTLY ASKED QUESTIONS</p>`, /"Frequently asked questions" \(faqHeading\)/],
  ];
  for (const [name, inner, re] of cases) {
    const hits = englishLeftovers({ html: page(inner), loc: 'de', ui });
    if (hits.some((h) => re.test(h))) passed++;
    else failures.push(`8c ${name}: expected a hit matching ${re}, got ${hits.join(', ') || '(none)'}`);
  }
}

// ---- 8d. forbidden words ------------------------------------------------------
expectFail('a forbidden word in a body', /\.de\.html: holds the forbidden word "Familienplanung"/, (k) => k.edit(DE_HTML, (s) => s.replace('Familienchat', 'Familienplanung')));
expectFail('a forbidden word in the words, any case', /\.de\.json: holds the forbidden word "Familienplanung"/, (k) => k.json(DE_JSON, (j) => { j.faq[1].a = 'Das klärt die FAMILIENPLANUNG.'; }));
expectFail('a forbidden English word in a translation', /\.de\.html: holds the forbidden word "family planning"/, (k) => k.edit(DE_HTML, (s) => s.replace('Familienchat', 'Family Planning')));
expectFail('a forbidden word in the fixed words', /blog\/ui\/nl\.json: holds the forbidden word "gezinsplanning"/, (k) => k.json('blog/ui/nl.json', (j) => { j.index.intro = 'Over gezinsplanning.'; }));
expectFail('a forbidden word in an English post', /rainy-day-picnic-plan \(English\): holds the forbidden word "family planning"/, (k) => { k.posts[0].faq[0].a = 'Family planning, again.'; });
{
  const words = [
    ['uk', 'Про планування сім’ї.', "планування сім'ї"],
    ['uk', 'Наш сімейний планувальник', 'сімейний планувальник'],
    ['nb', 'Om Familieplanlegging', 'familieplanlegging'],
    ['sv', 'om familjeplanering', 'familjeplanering'],
  ];
  for (const [loc, text, word] of words) {
    if (forbiddenHits(text, [loc]).includes(word)) passed++;
    else failures.push(`8d ${loc}: "${text}" should hit "${word}"`);
  }
  if (forbiddenHits('Ein Familienkalender für alle', ['de', 'en']).length) failures.push('8d: a harmless German sentence hit a forbidden word');
  else passed++;
}

if (failures.length) {
  console.error(`\ntest-blog-i18n: ${failures.length} failure(s), ${passed} passed:\n`);
  console.error(failures.join('\n\n'));
  process.exit(1);
}
console.log(`test-blog-i18n OK · ${passed} cases (1 clean fixture + every translation rule planted and caught)`);
