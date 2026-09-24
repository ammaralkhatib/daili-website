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

const REPO = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'daili-help-test-'));
process.on('exit', () => fs.rmSync(TMP, { recursive: true, force: true }));

const TOPICS = {
  start: { title: 'Getting started', icon: 'start', summary: 'The basics.' },
  family: { title: 'Family', icon: 'people', summary: 'People.' },
};
const ICONS = ['start', 'people'];
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
function run(mutate = () => {}) {
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
    noAppRepo: false,
  };
  mutate(state);

  w('help/en/family/invite.md', article(state.fm.invite, state.body.invite));
  w('help/en/start/home.md', article(state.fm.home, state.body.home));
  for (const [rel, s] of state.extra) w(rel, s);
  w('help/media.json', JSON.stringify(state.media));
  w('help/skip-keys.json', JSON.stringify(state.skipKeys));
  w('help/routes-allowlist.json', JSON.stringify(state.allow));
  for (const f of state.mediaFiles) w(`static/help/media/en/${f}`, 'RIFF');
  if (!state.noAppRepo) w('app/lib/core/routing/route_names.dart', dart(state.routes));

  const appRoutes = readAppRoutes(path.join(root, 'app'));
  return checkHelp({ root, topics: state.topics, icons: ICONS, appRoutes }).errors;
}

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
      delete st.media['start-home']; st.mediaFiles = st.mediaFiles.filter((f) => f !== 'start-home.webp');
    });
  } catch (e) { errors = [`(threw) ${e.message}`]; }
  if (errors.length) failures.push(`mediaPending instead of media: expected no errors, got:\n    ${errors.join('\n    ')}`);
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
