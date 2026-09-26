#!/usr/bin/env node
// Proves the help guard can fail. A guard that has never been seen going red
// is a guard nobody knows works, so for every rule in tools/check-help.mjs this
// plants one bad case in a throwaway fixture — its own articles, media, topics
// and a fake app route_names.dart — and asserts the rule reports it. It also
// asserts the clean fixture passes, so a rule that fires on everything cannot
// pass as "working".
//
// Runs in `npm run build` right after check-help.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { checkHelp, readAppRoutes } from './help-lib.mjs';
import { HELP_TOPICS, HELP_ICONS } from '../site.config.mjs';

const REPO = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'daili-help-test-'));
process.on('exit', () => fs.rmSync(TMP, { recursive: true, force: true }));

const TOPICS = { start: { icon: 'start' }, family: { icon: 'people' } };
const ICONS = ['start', 'people'];

// The page words: the real help/en/_ui.json, so the build case renders the
// real templates. Its topics are cut down to the fixture's.
const REAL_UI = JSON.parse(fs.readFileSync(path.join(REPO, 'help/en/_ui.json'), 'utf8'));
const uiFor = (topicIds) => ({ ...REAL_UI, topics: Object.fromEntries(topicIds.map((t) => [t, REAL_UI.topics[t]])) });
/** A stand-in translation of the page words: every string marked, {placeholders} kept. */
const markUi = (v, mark) => (typeof v === 'string' ? `${mark} ${v}`
  : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, markUi(x, mark)])));

// The tiny German translation of the two fixture articles.
const FIXTURE_DE = path.join(REPO, 'tools/fixtures/help-i18n/de');
const TR_DE = {
  'family/invite.md': fs.readFileSync(path.join(FIXTURE_DE, 'family/invite.md'), 'utf8'),
  'start/home.md': fs.readFileSync(path.join(FIXTURE_DE, 'start/home.md'), 'utf8'),
};
const APP_ROUTES = ['/', '/family', '/family/invite', '/lists/:id', '/maintenance'];

const dart = (routes) => `class RouteNames {
  static const home = 'home';
  static const notARoute = '/should-not-count';
}

class RoutePaths {
  const RoutePaths._();
${routes.map((r, i) => `  static const r${i} = '${r}';`).join('\n')}
}
`;

const article = (fm, body) => `---\n${Object.entries(fm).map(([k, v]) => `${k}: ${v}`).join('\n')}\n---\n${body}\n`;

const BASE_FM = {
  invite: {
    id: 'family-invite', topic: 'family', title: 'Invite someone', summary: 'Share a code.',
    keywords: 'invite, code', routes: '/family/invite', tryIt: '/family/invite',
    since: '1.3.0', updated: '2026-09-24', media: 'family-invite', related: 'start-home',
    tipTitle: 'Plan it together', tipBody: 'Invite your partner.', tipSkipIf: 'hasOtherLoginMember', tipPriority: '90',
    checklist: '1', checklistDoneIf: 'hasOtherLoginMember',
  },
  home: {
    id: 'start-home', topic: 'start', title: 'Home', summary: 'The Home screen.',
    keywords: 'home', routes: '/', tryIt: '/', since: '1.0.0', updated: '2026-09-24', media: 'start-home',
  },
};
const BASE_BODY = {
  invite: 'Everyone sees the same calendar.\n\n1. Tap **Family**.\n2. Tap **Invite member**.\n\n![The invite screen](family-invite)\n\n> Note: A code works for 7 days.',
  home: 'Home is where daili opens.\n\n![Home](start-home)',
};

/**
 * Write a clean fixture into a fresh folder, let `mutate` break one thing, and
 * return what the guard says. `mutate` gets a small toolkit rather than raw
 * paths so each case below reads as the one thing it plants.
 */
let n = 0;
function write(mutate = () => {}) {
  const root = path.join(TMP, `f${n++}`);
  const w = (rel, s) => { fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true }); fs.writeFileSync(path.join(root, rel), s); };
  const state = {
    fm: structuredClone(BASE_FM),
    body: { ...BASE_BODY },
    extra: [],                    // [rel path, contents] of additional files
    media: {
      'family-invite': { file: 'family-invite.webp', w: 720, h: 688, kind: 'image' },
      'start-home': { file: 'start-home.webp', w: 720, h: 1564, kind: 'image' },
    },
    mediaFiles: ['family-invite.webp', 'start-home.webp'],
    skipKeys: ['hasOtherLoginMember', 'hasPhoneCalendars'],
    allow: { never: { '/maintenance': 'automatic' }, pending: { '/family': 'article not written yet', '/lists/:id': 'article not written yet' } },
    routes: [...APP_ROUTES],
    topics: structuredClone(TOPICS),
    icons: ICONS,
    noAppRepo: false,
    // translations: locale -> { '<topic>/<slug>.md': source }, and their _ui.json
    tr: { de: { ...TR_DE } },
    ui: null,                     // filled below from the topics, unless a case sets it
    helpLocales: ['en'],
    locales: ['en', 'de', 'ja', 'pl'],
    localeMedia: {},              // locale -> media.<locale>.json object
    localeMediaFiles: {},         // locale -> [file names in static/help/media/<locale>/]
    gaps: null,                   // help/media-gaps.json, when a case sets it
  };
  state.ui = { en: uiFor(Object.keys(state.topics)) };
  state.ui.de = markUi(state.ui.en, 'DE');
  mutate(state);

  w('help/en/family/invite.md', article(state.fm.invite, state.body.invite));
  w('help/en/start/home.md', article(state.fm.home, state.body.home));
  for (const [rel, s] of state.extra) w(rel, s);
  for (const [loc, files] of Object.entries(state.tr)) for (const [rel, s] of Object.entries(files)) w(`help/${loc}/${rel}`, s);
  for (const [loc, ui] of Object.entries(state.ui)) if (ui) w(`help/${loc}/_ui.json`, JSON.stringify(ui));
  for (const [loc, m] of Object.entries(state.localeMedia)) w(`help/media.${loc}.json`, JSON.stringify(m));
  for (const [loc, fs_] of Object.entries(state.localeMediaFiles)) for (const f of fs_) w(`static/help/media/${loc}/${f}`, 'RIFF');
  if (state.gaps) w('help/media-gaps.json', JSON.stringify(state.gaps));
  w('help/media.json', JSON.stringify(state.media));
  w('help/skip-keys.json', JSON.stringify(state.skipKeys));
  w('help/routes-allowlist.json', JSON.stringify(state.allow));
  for (const f of state.mediaFiles) w(`static/help/media/en/${f}`, 'RIFF');
  if (!state.noAppRepo) w('app/lib/core/routing/route_names.dart', dart(state.routes));
  return { root, state };
}

function check({ root, state }) {
  const appRoutes = readAppRoutes(path.join(root, 'app'));
  return checkHelp({ root, topics: state.topics, icons: state.icons, appRoutes, helpLocales: state.helpLocales, locales: state.locales });
}
const run = (mutate) => check(write(mutate)).errors;

const failures = [];
let passed = 0;
function expectFail(name, re, mutate) {
  let errors;
  try { errors = run(mutate); } catch (e) { errors = [`(threw) ${e.message}`]; }
  if (errors.some((e) => re.test(e))) passed++;
  else failures.push(`${name}: expected an error matching ${re}, got:\n    ${errors.join('\n    ') || '(no errors — the guard let it through)'}`);
}

// ---- the clean fixture passes --------------------------------------------
{
  const errors = run();
  if (errors.length) failures.push(`clean fixture: expected no errors, got:\n    ${errors.join('\n    ')}`);
  else passed++;
}

// ---- parse errors (Req. 2) -------------------------------------------------
const body = (s) => (st) => { st.body.invite = s; };
expectFail('# heading', /invite\.md:\d+ +headings/, body('# Invite\n\nText.'));
expectFail('- bullet', /invite\.md:\d+ +bullet lists/, body('Text.\n\n- one\n- two'));
expectFail('* bullet', /bullet lists/, body('Text.\n\n* one'));
expectFail('[link](…)', /links are not allowed/, body('See [this](https://x.y).'));
expectFail('backticks', /backticks/, body('Tap `Family`.'));
expectFail('_emphasis_', /_emphasis_/, body('Tap _Family_ now.'));
expectFail('raw HTML', /raw HTML/, body('Tap <b>Family</b>.'));
expectFail('single *', /single \*/, body('Tap *Family* now.'));
expectFail('second numbered list', /only one numbered list/, body('1. One\n2. Two\n\nText.\n\n1. Again'));
expectFail('8 steps', /more than 7 steps/, body([1, 2, 3, 4, 5, 6, 7, 8].map((i) => `${i}. Step ${i}`).join('\n')));
expectFail('step numbering', /numbered 3, expected 2/, body('1. One\n3. Two'));
expectFail('3 images', /more than 2 images/, (st) => { st.body.invite = '![a](family-invite)\n\n![b](family-invite)\n\n![c](family-invite)'; });
expectFail('image not on its own line', /own line/, body('Look ![a](family-invite) here.'));
expectFail('quote that is not a note', /only quote allowed/, body('> Tip: this.'));
expectFail('151 words', /words, the limit is 150/, body(Array(151).fill('word').join(' ')));
expectFail('unknown key', /unknown front-matter key "colour"/, (st) => { st.fm.invite.colour = 'green'; });
expectFail('missing required key', /"summary" is required/, (st) => { delete st.fm.invite.summary; });
expectFail('title too long', /title is 71 chars/, (st) => { st.fm.invite.title = 'x'.repeat(71); });
expectFail('summary too long', /summary is 141 chars/, (st) => { st.fm.invite.summary = 'x'.repeat(141); });
expectFail('13 keywords', /13 keywords/, (st) => { st.fm.invite.keywords = Array.from({ length: 13 }, (_, i) => `k${i}`).join(', '); });
expectFail('upper-case keyword', /must be lower case/, (st) => { st.fm.invite.keywords = 'Invite'; });
expectFail('since not x.y.z', /is not x\.y\.z/, (st) => { st.fm.invite.since = '1.3'; });
expectFail('updated not a date', /not a real YYYY-MM-DD/, (st) => { st.fm.invite.updated = '2026-02-30'; });
expectFail('order not an integer', /order "first"/, (st) => { st.fm.invite.order = 'first'; });
expectFail('front matter never closed', /never closed/, (st) => { st.extra.push(['help/en/family/broken.md', '---\nid: family-broken\n\nBody.\n']); });

// ---- ids -------------------------------------------------------------------
expectFail('id does not match path', /expected "family-invite"/, (st) => { st.fm.invite.id = 'family-invites'; });
expectFail('duplicate id', /id "family-invite" is also used by/, (st) => {
  st.extra.push(['help/en/family/invite2.md', article({ ...BASE_FM.invite, id: 'family-invite', checklist: '2' }, BASE_BODY.invite)]);
});
expectFail('topic folder not in HELP_TOPICS', /folder "cooking" is not a key of HELP_TOPICS/, (st) => {
  st.extra.push(['help/en/cooking/pie.md', article({ ...BASE_FM.home, id: 'cooking-pie', topic: 'cooking' }, BASE_BODY.home)]);
});
expectFail('topic field disagrees with folder', /topic is "start" but the file is in help\/en\/family/, (st) => { st.fm.invite.topic = 'start'; });

// ---- routes (the reason this guard exists) ----------------------------------
expectFail('renamed app route', /route "\/family\/invite" is not an app route/, (st) => {
  st.routes = st.routes.map((r) => (r === '/family/invite' ? '/family/invite-members' : r));
  st.allow.pending['/family/invite-members'] = 'article not written yet';
});
expectFail('removed app route (tryIt)', /tryIt "\/family\/invite" is not an app route/, (st) => {
  st.routes = st.routes.filter((r) => r !== '/family/invite');
});
expectFail('tryIt with :', /has a ":"/, (st) => { st.fm.invite.tryIt = '/lists/:id'; });
expectFail('app route with no article', /app route "\/habits" has no article/, (st) => { st.routes.push('/habits'); });
expectFail('stale pending entry (now covered)', /pending "\/family" is covered by/, (st) => { st.fm.invite.routes = '/family/invite, /family'; });
expectFail('stale pending entry (route gone)', /pending "\/lists\/:id" is not an app route any more/, (st) => {
  st.routes = st.routes.filter((r) => r !== '/lists/:id');
});
expectFail('stale never entry (route gone)', /never "\/maintenance" is not an app route any more/, (st) => {
  st.routes = st.routes.filter((r) => r !== '/maintenance');
});
expectFail('allowlist entry without a reason', /needs a reason/, (st) => { st.allow.pending['/family'] = ''; });
expectFail('route_names.dart missing', /DAILI_APP_REPO/, (st) => { st.noAppRepo = true; });

// ---- references --------------------------------------------------------------
expectFail('unknown related', /related "start-nope" is not an article id/, (st) => { st.fm.invite.related = 'start-nope'; });
expectFail('unknown tip skip key', /tipSkipIf "hasDragons"/, (st) => { st.fm.invite.tipSkipIf = 'hasDragons'; });
expectFail('unknown checklist skip key', /checklistDoneIf "hasDragons"/, (st) => { st.fm.invite.checklistDoneIf = 'hasDragons'; });
expectFail('unknown icon', /icon "rocket", which is not in HELP_ICONS/, (st) => { st.topics.start.icon = 'rocket'; });
expectFail('tip half-filled', /tip fields are all-or-nothing/, (st) => { delete st.fm.invite.tipBody; });
expectFail('tip with only a skip key', /tip fields are all-or-nothing/, (st) => { delete st.fm.invite.tipTitle; delete st.fm.invite.tipBody; delete st.fm.invite.tipPriority; });
expectFail('tip priority out of range', /tipPriority "101"/, (st) => { st.fm.invite.tipPriority = '101'; });
expectFail('tip title too long', /tipTitle is 61 chars/, (st) => { st.fm.invite.tipTitle = 'x'.repeat(61); });
expectFail('checklist half-filled', /both-or-neither/, (st) => { delete st.fm.invite.checklistDoneIf; });
expectFail('checklist order repeats', /checklist order 1 is also used by/, (st) => {
  Object.assign(st.fm.home, { checklist: '1', checklistDoneIf: 'hasPhoneCalendars' });
});

// ---- media -------------------------------------------------------------------
expectFail('media id not in media.json', /media "family-nope" is not in help\/media\.json/, (st) => { st.fm.invite.media = 'family-nope'; });
expectFail('body image not in media.json', /image "family-nope" is not in help\/media\.json/, (st) => { st.body.invite = '![a](family-nope)'; });
expectFail('media file missing on disk', /names start-home\.webp, which is not in static\/help\/media\/en/, (st) => {
  st.mediaFiles = st.mediaFiles.filter((f) => f !== 'start-home.webp');
});
expectFail('orphan media entry', /"spare" is used by no article/, (st) => {
  st.media.spare = { file: 'start-home.webp', w: 1, h: 1, kind: 'image' };
});
expectFail('missing media', /invite\.md:\d+ +has no "media"/, (st) => { delete st.fm.invite.media; });
expectFail('media and mediaPending', /has both "media" and "mediaPending"/, (st) => { st.fm.invite.mediaPending = 'hand-made screenshot'; });
expectFail('mediaPending too long', /mediaPending is 81 chars/, (st) => { delete st.fm.invite.media; st.fm.invite.mediaPending = 'x'.repeat(81); });
expectFail('media without w/h', /needs integer "w" and "h"/, (st) => { delete st.media['start-home'].h; });

{
  // mediaPending is the one allowed way to go without a picture
  let errors;
  try {
    errors = run((st) => {
      delete st.fm.home.media; st.fm.home.mediaPending = 'hand-made screenshot of the phone home screen';
      st.body.home = 'Home is where daili opens.';
      st.tr.de['start/home.md'] = st.tr.de['start/home.md'].replace('\n\n![Die Startseite](start-home)', '');
      delete st.media['start-home']; st.mediaFiles = st.mediaFiles.filter((f) => f !== 'start-home.webp');
    });
  } catch (e) { errors = [`(threw) ${e.message}`]; }
  if (errors.length) failures.push(`mediaPending instead of media: expected no errors, got:\n    ${errors.join('\n    ')}`);
  else passed++;
}

// ---- translations (help/<code>/) ---------------------------------------------
// Listed German with no pictures of its own: both are listed gaps.
const DE_GAPS = { 'family-invite': 'not shot yet', 'start-home': 'not shot yet' };
const listDe = (st) => { st.helpLocales = ['en', 'de']; st.gaps = { de: { ...DE_GAPS } }; };
const DE_OWN = {
  'family-invite': { file: 'family-invite.webp', w: 720, h: 688, kind: 'image' },
  'start-home': { file: 'start-home.webp', w: 720, h: 1564, kind: 'image' },
};
const deOwnPictures = (st) => { st.localeMedia.de = structuredClone(DE_OWN); st.localeMediaFiles.de = ['family-invite.webp', 'start-home.webp']; };
const deEdit = (file, fn) => (st) => { listDe(st); st.tr.de[file] = fn(st.tr.de[file]); };
function expectClean(name, mutate) {
  let errors;
  try { errors = run(mutate); } catch (e) { errors = [`(threw) ${e.message}`]; }
  if (errors.length) failures.push(`${name}: expected no errors, got:\n    ${errors.join('\n    ')}`);
  else passed++;
}
expectClean('German translation, listed in HELP_LOCALES', listDe);
expectClean('half-done German, not listed: missing article and _ui key are fine', (st) => {
  delete st.tr.de['start/home.md']; delete st.ui.de.results;
});
expectFail('translation with an unknown id', /help\/de\/family\/ghost\.md:\d+ +"family-ghost" is not an English article/, (st) => {
  st.tr.de['family/ghost.md'] = TR_DE['family/invite.md'].replace('id: family-invite', 'id: family-ghost');
});
expectFail('translation with a forbidden key (routes)', /de\/family\/invite\.md:\d+ +"routes" is not allowed in a translation/,
  deEdit('family/invite.md', (s) => s.replace('translatedFrom:', 'routes: /family\ntranslatedFrom:')));
expectFail('translation with one step fewer', /de\/family\/invite\.md:\d+ +block 2 is 1 step\(s\), but help\/en\/family\/invite\.md has 2 step\(s\)/,
  deEdit('family/invite.md', (s) => s.replace('2. Tippe auf **Mitglied einladen**.\n', '')));
expectFail('translation with a different image id', /block 3 is image "start-home", but .* has image "family-invite"/,
  deEdit('family/invite.md', (s) => s.replace('(family-invite)', '(start-home)')));
expectFail('translation with a block too many', /block 4 is a paragraph, but .* has a note/,
  deEdit('family/invite.md', (s) => s.replace('> Note:', 'Noch ein Absatz.\n\n> Note:')));
expectFail('translation without the English tip', /"tipBody" is required — the English article has a tip/,
  deEdit('family/invite.md', (s) => s.replace(/tipBody: .*\n/, '')));
expectFail('translation with a tip English lacks', /"tipTitle" is not allowed — the English article has no tip/,
  deEdit('start/home.md', (s) => s.replace('translatedFrom:', 'tipTitle: Hallo\ntranslatedFrom:')));
expectFail('translatedFrom newer than English', /translatedFrom 2026-09-25 is newer/,
  deEdit('start/home.md', (s) => s.replace('translatedFrom: 2026-09-24', 'translatedFrom: 2026-09-25')));
expectFail('translated title over 1.4 × the limit', /title is 99 characters, the limit for a translation is 98/,
  deEdit('start/home.md', (s) => s.replace('title: Startseite', `title: ${'x'.repeat(99)}`)));
expectFail('upper-case translated keyword', /keyword "Übersicht" must be lower case/,
  deEdit('start/home.md', (s) => s.replace('übersicht', 'Übersicht')));
expectFail('German body over 210 words', /body is 211 words, the limit is 210/,
  deEdit('start/home.md', (s) => s.replace('Mit der Startseite öffnet sich daili.', Array(211).fill('Wort').join(' '))));
expectFail('missing _ui.json key (listed)', /help\/de\/_ui\.json:1 +missing "results"/, (st) => { listDe(st); delete st.ui.de.results; });
expectFail('missing _ui.json topic (listed)', /help\/de\/_ui\.json:1 +missing "topics\.family\.summary"/, (st) => { listDe(st); delete st.ui.de.topics.family.summary; });
expectFail('_ui.json placeholder dropped', /"noResult" has placeholders \{\}, English has \{email\}/, (st) => { st.ui.de.noResult = 'Nichts gefunden.'; });
expectFail('_ui.json unknown key', /unknown key "colour"/, (st) => { st.ui.de.colour = 'grün'; });
expectFail('_ui.json missing file (listed)', /help\/de\/_ui\.json:1 +missing — every help locale/, (st) => { listDe(st); st.ui.de = null; });
expectFail('plural forms per language', /missing "articleCount\.few"/, (st) => {
  st.helpLocales = ['en', 'pl']; st.tr.pl = { ...TR_DE }; st.ui.pl = markUi(st.ui.en, 'PL');
});
expectFail('listed locale missing an article', /help\/de\/start\/home\.md:1 +missing — every English article needs a translation while "de" is in HELP_LOCALES/, (st) => {
  listDe(st); delete st.tr.de['start/home.md'];
});
expectFail('HELP_LOCALES code not in LOCALES', /HELP_LOCALES has "xx", which is not in LOCALES/, (st) => { st.helpLocales = ['en', 'xx']; });
expectFail('help folder not a site locale', /help\/de-at\/:1 +"de-at" is not a site locale/, (st) => { st.tr['de-at'] = { ...TR_DE }; });
expectFail('locale picture for an unknown id', /help\/media\.de\.json:1 +"spare" is not in help\/media\.json/, (st) => {
  st.localeMedia.de = { spare: { file: 'spare.webp', w: 1, h: 1, kind: 'image' } }; st.localeMediaFiles.de = ['spare.webp'];
});
expectFail('locale picture file missing', /"family-invite" names family-invite\.webp, which is not in static\/help\/media\/de\//, (st) => {
  st.localeMedia.de = { 'family-invite': { file: 'family-invite.webp', w: 720, h: 688, kind: 'image' } };
});

// ---- own-language pictures: required per listed locale, listed gaps only ------
expectClean('listed German with all its own pictures and no gaps', (st) => { listDe(st); st.gaps = null; deOwnPictures(st); });
expectClean('unlisted German with no pictures of its own and no gaps', () => {});
expectFail('listed locale showing an English picture that is not a listed gap', /help\/media\.de\.json:1 +"start-home" missing — every picture of a HELP_LOCALES locale is its own/, (st) => {
  listDe(st); deOwnPictures(st); delete st.localeMedia.de['start-home']; st.gaps = null;
});
expectFail('stale gap: the locale has its own picture now', /help\/media-gaps\.json:1 +de "family-invite" has its own picture now/, (st) => {
  listDe(st); deOwnPictures(st); st.gaps = { de: { 'family-invite': 'not shot yet' } };
});
expectFail('gap without a reason', /help\/media-gaps\.json:1 +"de" "start-home" needs a reason/, (st) => { listDe(st); st.gaps.de['start-home'] = ' '; });
expectFail('gap for an unknown media id', /help\/media-gaps\.json:1 +"de" "family-nope" is not in help\/media\.json/, (st) => { listDe(st); st.gaps.de['family-nope'] = 'why'; });
expectFail('gap for a locale that is not built', /help\/media-gaps\.json:1 +"ja" is not a translated HELP_LOCALES locale/, (st) => { st.gaps = { ja: { 'start-home': 'why' } }; });
expectFail('gaps as a list, not { id: reason }', /help\/media-gaps\.json:1 +"de" must be an object/, (st) => { listDe(st); st.gaps.de = ['start-home']; });
{
  // stale: English moved on after the translation — a warning, not an error
  const r = check(write((st) => { listDe(st); st.fm.home.updated = '2026-10-01'; }));
  if (!r.errors.length && r.warnings.some((w) => w === 'help de: 1 article(s) older than English: start-home')) passed++;
  else failures.push(`stale translation: expected no errors and a "help de: 1 article(s) older than English" warning, got:\n    ${[...r.errors, ...r.warnings].join('\n    ')}`);
}

// ---- CJK: characters, not words ------------------------------------------------
const jaTitle = (title) => (st) => { st.tr.ja = { ...TR_DE, 'start/home.md': TR_DE['start/home.md'].replace('title: Startseite', `title: ${title}`) }; };
const jaBody = (body) => (st) => { st.tr.ja = { ...TR_DE, 'start/home.md': TR_DE['start/home.md'].replace('Mit der Startseite öffnet sich daili.', body) }; };
expectClean('ja title of 98 characters', jaTitle('家'.repeat(98)));
expectFail('ja title of 99 characters', /help\/ja\/start\/home\.md:\d+ +title is 99 characters/, jaTitle('家'.repeat(99)));
expectFail('ja body over its character cap, though it is one "word"', /body is 601 characters, the limit for ja is 600/, jaBody('あ'.repeat(601)));
expectClean('ja body of 211 space-separated "words" (no word count in ja)', jaBody(Array(211).fill('あ').join(' ')));
expectClean('th title of 98 graphemes (more UTF-16 units)', (st) => {
  st.tr.th = { ...TR_DE, 'start/home.md': TR_DE['start/home.md'].replace('title: Startseite', `title: ${'กี่'.repeat(98)}`) };
  st.locales.push('th');
});

// ---- the build: a translated locale renders pages and its json -----------------
{
  const topicIds = Object.keys(HELP_TOPICS);
  const fx = write((st) => {
    st.topics = HELP_TOPICS; st.icons = HELP_ICONS;
    st.ui.en = uiFor(topicIds); st.ui.de = markUi(st.ui.en, 'DE');
    st.localeMedia.de = { 'family-invite': { file: 'family-invite.webp', w: 720, h: 688, kind: 'image' } };
    st.localeMediaFiles.de = ['family-invite.webp'];
    st.gaps = { de: { 'start-home': 'not shot yet' } };
  });
  const dist = path.join(TMP, 'dist');
  const b = spawnSync(process.execPath, [path.join(REPO, 'build.mjs')], {
    env: { ...process.env, HELP_TEST_ROOT: fx.root, HELP_TEST_LOCALES: 'en,de', HELP_TEST_DIST: dist }, encoding: 'utf8',
  });
  const problems = [];
  if (b.status !== 0) problems.push(`build exited ${b.status}: ${b.stderr.trim().split('\n').slice(-3).join(' | ')}`);
  else {
    const page = (rel) => (fs.existsSync(path.join(dist, rel)) ? fs.readFileSync(path.join(dist, rel), 'utf8') : '');
    const art = page('de/help/family/invite/index.html');
    if (!art) problems.push('no de/help/family/invite/index.html');
    else {
      if (!art.includes('<html lang="de"')) problems.push('German article is not <html lang="de">');
      if (!art.includes('<h1>Jemanden einladen</h1>')) problems.push('German article has no German title');
      if (!art.includes('<b>DE Note:</b> Ein Code gilt 7 Tage.')) problems.push('German note has no German label/text');
      if (!art.includes('src="/help/media/de/family-invite.webp?v=')) problems.push('German article does not use its own picture');
      if (!art.includes('<link rel="alternate" hreflang="en" href="https://daili.app/help/family/invite/">')
        || !art.includes('<link rel="alternate" hreflang="x-default" href="https://daili.app/help/family/invite/">')) problems.push('German article has no hreflang cluster with x-default English');
    }
    if (!b.stdout.includes('help de: 1 picture(s) in English (listed gaps')) problems.push('build does not say "help de: 1 picture(s) in English (listed gaps…)"');
    const home = page('de/help/start/home/index.html');
    if (!home.includes('src="/help/media/en/start-home.webp?v=')) problems.push('German article without its own picture does not fall back to English');
    if (!page('de/help/index.html').includes('DE How can we help?')) problems.push('German help home is not in German');
    if (!page('de/index.html').includes('<a href="/de/help/">')) problems.push('German footer does not link to /de/help/');
    let j = null;
    try { j = JSON.parse(page('help/de.json')); } catch { problems.push('help/de.json missing or not JSON'); }
    if (j) {
      if (j.schema !== 1 || j.locale !== 'de') problems.push(`de.json schema/locale ${j.schema}/${j.locale}`);
      const inv = j.articles.find((a) => a.id === 'family-invite');
      if (inv?.title !== 'Jemanden einladen' || inv?.routes.join() !== '/family/invite') problems.push('de.json article is not German text over English data');
      if (j.tips[0]?.title !== 'Gemeinsam planen' || j.tips[0]?.priority !== 90) problems.push('de.json tip is not German text over English data');
      if (j.checklist[0]?.title !== 'Jemanden einladen') problems.push('de.json checklist title is not German');
      if (j.topics.find((t) => t.id === 'family')?.title !== `DE ${REAL_UI.topics.family.title}`) problems.push('de.json topic title is not from de/_ui.json');
    }
  }
  if (problems.length) failures.push(`build of a German fixture:\n    ${problems.join('\n    ')}`);
  else passed++;
}

// ---- the CLI itself: exit codes and the skip switch ---------------------------
{
  const cli = (env) => spawnSync(process.execPath, [path.join(REPO, 'tools/check-help.mjs')], {
    env: { ...process.env, HELP_SKIP_ROUTE_CHECK: '', ...env }, encoding: 'utf8',
  });
  const missing = cli({ DAILI_APP_REPO: path.join(TMP, 'no-such-app') });
  if (missing.status === 1 && /DAILI_APP_REPO/.test(missing.stderr)) passed++;
  else failures.push(`CLI with no app repo: expected exit 1 naming DAILI_APP_REPO, got exit ${missing.status}:\n    ${missing.stderr.trim()}`);

  const skipped = cli({ DAILI_APP_REPO: path.join(TMP, 'no-such-app'), HELP_SKIP_ROUTE_CHECK: '1' });
  if (skipped.status === 0 && /HELP_SKIP_ROUTE_CHECK=1/.test(skipped.stderr)) passed++;
  else failures.push(`CLI with HELP_SKIP_ROUTE_CHECK=1: expected exit 0 and a loud warning, got exit ${skipped.status}`);
}

if (failures.length) {
  console.error(`\ntest-check-help: ${failures.length} failure(s), ${passed} passed:\n`);
  console.error(failures.join('\n\n'));
  process.exit(1);
}
console.log(`test-check-help OK · ${passed} cases (1 clean fixture + every guard rule planted and caught)`);
