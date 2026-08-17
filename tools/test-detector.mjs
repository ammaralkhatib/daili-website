#!/usr/bin/env node
// Tests the language detector that ships in dist/index.html.
//
// It extracts the actual inline script from the built page and runs it against
// a stubbed browser, so this tests what visitors execute rather than a copy of
// it that can drift.
//
// Worth having as a real test because the tricky cases are not obvious and are
// invisible when they go wrong: nobody reports "I got the wrong language", they
// just leave. Browsers cannot be used to check this by hand either — Chrome's
// --lang flag does not change navigator.languages, it only changes the UI
// language and Accept-Language, so a browser "test" silently checks nothing.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOCALES } from '../site.config.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const idx = path.join(ROOT, 'dist', 'index.html');
if (!fs.existsSync(idx)) { console.error('dist/index.html missing — run the build first'); process.exit(1); }

const m = fs.readFileSync(idx, 'utf8').match(/<script>(\/\* DAILI-LANG-DETECTOR \*\/[\s\S]*?)<\/script>/);
if (!m) { console.error('no detector script found in dist/index.html'); process.exit(1); }
const SRC = m[1];

/** Run the shipped detector against a fake browser; return where it navigated. */
function run({ languages = [], saved = null, search = '', hash = '' } = {}) {
  let replacedWith = null;
  let stored = saved;
  const location = {
    pathname: '/', search, hash,
    replace: (u) => { replacedWith = u; },
  };
  const navigator = { languages, language: languages[0] || 'en' };
  const localStorage = {
    getItem: (k) => (k === 'daili.lang' ? stored : null),
    setItem: (k, v) => { if (k === 'daili.lang') stored = v; },
  };
  // eslint-disable-next-line no-new-func
  new Function('location', 'navigator', 'localStorage', 'URLSearchParams', SRC)
    (location, navigator, localStorage, URLSearchParams);
  return { to: replacedWith, stored };
}

let pass = 0;
const failures = [];
const dirOf = (loc) => (loc === 'en' ? null : `/${loc.toLowerCase()}/`);

/** expect: a locale code, or null meaning "stay on English, do not redirect". */
function check(label, opts, expected) {
  const { to } = run(opts);
  const want = expected === null ? null : dirOf(expected);
  const got = to === null ? null : to.replace(/#.*$/, '');
  if (got === want) { pass++; return; }
  failures.push(`${label.padEnd(46)} got ${String(got)}  want ${String(want)}`);
}

// Only locales that are actually built can be expected; the rest must fall
// through to English. This keeps the table honest as LOCALES grows.
const built = (loc) => LOCALES.map((l) => l.toLowerCase()).includes(loc.toLowerCase());
const or = (loc) => (built(loc) ? loc : null);

// ---- regional variants must fold to their base language ---------------------
check('de-AT (Austria)',            { languages: ['de-AT', 'de', 'en'] }, or('de'));
check('de-CH (Switzerland)',        { languages: ['de-CH'] },             or('de'));
check('en-GB stays English',        { languages: ['en-GB', 'en'] },       null);
check('en-US stays English',        { languages: ['en-US'] },             null);
check('pt-BR -> neutral pt',        { languages: ['pt-BR'] },             or('pt'));
check('pt-PT -> neutral pt',        { languages: ['pt-PT'] },             or('pt'));
check('es-MX -> neutral es',        { languages: ['es-MX'] },             or('es'));
check('fr-CA -> fr',                { languages: ['fr-CA'] },             or('fr'));

// ---- Chinese: script and region both decide --------------------------------
check('zh-Hans explicit',           { languages: ['zh-Hans'] },           or('zh-Hans'));
check('zh-Hant explicit',           { languages: ['zh-Hant'] },           or('zh-Hant'));
check('zh-TW -> Traditional',       { languages: ['zh-TW'] },             or('zh-Hant'));
check('zh-HK -> Traditional',       { languages: ['zh-HK'] },             or('zh-Hant'));
check('zh-MO -> Traditional',       { languages: ['zh-MO'] },             or('zh-Hant'));
check('zh-CN -> Simplified',        { languages: ['zh-CN'] },             or('zh-Hans'));
check('zh-SG -> Simplified',        { languages: ['zh-SG'] },             or('zh-Hans'));
check('bare zh -> Simplified',      { languages: ['zh'] },                or('zh-Hans'));
check('zh-Hant-TW full tag',        { languages: ['zh-Hant-TW'] },        or('zh-Hant'));
check('zh-Hans-CN full tag',        { languages: ['zh-Hans-CN'] },        or('zh-Hans'));

// ---- Norwegian: browsers still send the "no" macrolanguage -----------------
check('nb -> nb',                   { languages: ['nb-NO'] },             or('nb'));
check('no  -> nb',                  { languages: ['no'] },                or('nb'));
check('nn  -> nb',                  { languages: ['nn-NO'] },             or('nb'));

// ---- deprecated ISO codes some browsers still emit -------------------------
check('in (old code for id)',       { languages: ['in'] },                or('id'));

// ---- ordering: first supported tag in the list wins -------------------------
check('unsupported first, de second', { languages: ['ga-IE', 'de-DE', 'en'] }, or('de'));
check('all unsupported -> English',   { languages: ['ga-IE', 'cy-GB'] },       null);
check('empty languages -> English',   { languages: [] },                        null);

// ---- an explicit choice always beats the browser ---------------------------
check('saved de beats English browser', { languages: ['en-US'], saved: 'de' }, or('de'));
check('saved en beats German browser',  { languages: ['de-DE'], saved: 'en' }, null);
check('?hl=de overrides',               { languages: ['en-US'], search: '?hl=de' }, or('de'));
check('?hl=en overrides German',        { languages: ['de-DE'], search: '?hl=en' }, null);

// ---- the storage rule that keeps this site consent-banner-free -------------
// Auto-detection must never write. Only an explicit choice may.
{
  const auto = run({ languages: ['de-DE'] });
  if (auto.stored !== null) {
    failures.push('auto-detection wrote localStorage — it must only be written on an explicit choice');
  } else pass++;

  const explicit = run({ languages: ['en-US'], search: '?hl=de' });
  if (explicit.stored !== 'de') {
    failures.push(`?hl= did not persist the choice (stored=${explicit.stored})`);
  } else pass++;
}

// ---- the hash must survive the redirect ------------------------------------
{
  const r = run({ languages: ['de-DE'], hash: '#pricing' });
  const want = LOCALES.includes('de') ? '/de/#pricing' : null;
  if (LOCALES.includes('de') && r.to !== want) {
    failures.push(`hash not preserved: got ${r.to} want ${want}`);
  } else pass++;
}

if (failures.length) {
  console.error(`\ndetector: ${failures.length} failure(s), ${pass} passed:\n`);
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`detector OK · ${pass} cases · ${LOCALES.length} locale(s) built`);
