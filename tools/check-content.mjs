#!/usr/bin/env node
// Parity guard across content/*.json. Runs BEFORE the build, and the build is
// chained on `&&`, so broken content can never produce output.
//
// This exists because the alternative — silently falling back to English for a
// missing key — is how translations rot without anyone noticing. It is the same
// guard, for the same reason, as the app's test/l10n/arb_parity_test.dart.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOCALES, DEFAULT_LOCALE, FEATURES, BRAND_TRANSLITERATIONS, FORBIDDEN_STRINGS } from '../site.config.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const errors = [];
const warnings = [];
const err = (loc, key, msg) => errors.push(`${loc.padEnd(8)} ${key.padEnd(44)} ${msg}`);
const warn = (loc, key, msg) => warnings.push(`${loc.padEnd(8)} ${key.padEnd(44)} ${msg}`);

// Expected length band vs English. Outside it is a warning, not an error:
// legitimate translations do vary, and a checker that cries wolf gets ignored.
// Chinese in particular runs far shorter than English — a 55-character English
// bullet is routinely 14 characters of Hanzi. The lower bound was 0.30 at first
// and fired on a dozen perfectly good strings, which is worse than not checking
// at all: a warning list nobody reads is a warning list that hides real ones.
const RATIO = {
  'zh-Hans': [0.18, 1.20], 'zh-Hant': [0.18, 1.20],
  ja: [0.25, 1.30], ko: [0.25, 1.30], th: [0.30, 1.40],
  // Arabic and Hindi both run consistently shorter than English prose.
  ar: [0.50, 1.60], hi: [0.50, 1.80],
  de: [0.80, 2.40], fi: [0.80, 2.40], pl: [0.80, 2.40], cs: [0.80, 2.40], tr: [0.80, 2.40], ru: [0.80, 2.40],
};
const bandFor = (loc) => RATIO[loc] || [0.70, 2.00];

/** Flatten to dotted paths so error messages read features.calendar.bullets[2]. */
function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('@')) continue; // metadata is English-only by design
    const key = prefix ? `${prefix}.${k}` : k;
    if (Array.isArray(v)) {
      out[key] = { type: 'array', length: v.length };
      v.forEach((item, i) => {
        if (item !== null && typeof item === 'object') flatten(item, `${key}[${i}]`, out);
        else out[`${key}[${i}]`] = { type: 'string', value: String(item) };
      });
    } else if (v !== null && typeof v === 'object') {
      flatten(v, key, out);
    } else {
      out[key] = { type: typeof v, value: String(v) };
    }
  }
  return out;
}

const tagsOf = (s) => (String(s).match(/<\s*([a-z][a-z0-9]*)/gi) || []).map((t) => t.replace(/[<\s]/g, '').toLowerCase()).sort();
const placeholdersOf = (s) => [...new Set(String(s).match(/\{[a-zA-Z_][a-zA-Z0-9_]*\}/g) || [])].sort();

const load = (loc) => {
  const f = path.join(ROOT, 'content', `${loc}.json`);
  if (!fs.existsSync(f)) { err(loc, '(file)', `content/${loc}.json does not exist but ${loc} is in LOCALES`); return null; }
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); }
  catch (e) { err(loc, '(file)', `invalid JSON: ${e.message}`); return null; }
};

const base = load(DEFAULT_LOCALE);
if (!base) { console.error(errors.join('\n')); process.exit(1); }
const flatBase = flatten(base);
const identicalOk = new Set(base['@@identicalOk'] || []);

for (const loc of LOCALES) {
  const data = load(loc);
  if (!data) continue;

  // @@locale must match the filename, or a file gets edited believing it is another language
  if (data['@@locale'] !== loc) err(loc, '@@locale', `is "${data['@@locale']}", expected "${loc}"`);
  if (!['ltr', 'rtl'].includes(data['@@dir'])) err(loc, '@@dir', `must be "ltr" or "rtl", got "${data['@@dir']}"`);

  // every feature in FEATURES needs content, and no orphans
  for (const f of FEATURES) {
    if (!data.features || !(f.key in data.features)) err(loc, `features.${f.key}`, 'missing — required by FEATURES in site.config.mjs');
  }
  for (const k of Object.keys(data.features || {})) {
    if (!FEATURES.some((f) => f.key === k)) err(loc, `features.${k}`, 'orphan — not in FEATURES in site.config.mjs');
  }

  if (loc === DEFAULT_LOCALE) continue;
  const flat = flatten(data);

  // 1+2+3. key set equality, type match, array length match
  for (const [key, b] of Object.entries(flatBase)) {
    const t = flat[key];
    if (!t) { err(loc, key, 'MISSING'); continue; }
    if (t.type !== b.type) err(loc, key, `type is ${t.type}, English has ${b.type}`);
    else if (b.type === 'array' && t.length !== b.length) {
      err(loc, key, `has ${t.length} items, English has ${b.length} — a merged or dropped item silently changes what the page promises`);
    }
  }
  for (const key of Object.keys(flat)) {
    if (!(key in flatBase)) err(loc, key, 'EXTRA — not in English (stale key after a rename?)');
  }

  // 4+5+6+7. per-string checks
  for (const [key, b] of Object.entries(flatBase)) {
    const t = flat[key];
    if (!t || b.type !== 'string' || t.type !== 'string') continue;

    const bp = placeholdersOf(b.value), tp = placeholdersOf(t.value);
    if (bp.join() !== tp.join()) err(loc, key, `placeholders ${JSON.stringify(tp)} != English ${JSON.stringify(bp)}`);

    const bt = tagsOf(b.value), tt = tagsOf(t.value);
    if (bt.join() !== tt.join()) err(loc, key, `inline tags ${JSON.stringify(tt)} != English ${JSON.stringify(bt)} — a dropped <a> loses a link`);

    // at-least-once, not exact-count: restructuring a sentence legitimately
    // merges a repetition, and a false failure trains people to ignore the checker
    if (b.value.includes('Daili') && !t.value.includes('Daili')) {
      err(loc, key, 'English contains "Daili" but the translation does not — the brand name is never translated');
    }
    for (const tl of BRAND_TRANSLITERATIONS) {
      if (t.value.includes(tl)) err(loc, key, `contains transliterated brand "${tl}" — write "Daili" in Latin letters`);
    }

    if (b.value.length >= 25) {
      if (t.value === b.value) {
        // A handful of strings are legitimately identical everywhere — a brand
        // name, an email address. They are listed explicitly in en.json rather
        // than the check being softened, so the exemption stays visible.
        if (!identicalOk.has(key.replace(/\[\d+\]$/, ''))) {
          err(loc, key, 'byte-identical to English — untranslated (add to @@identicalOk in en.json if that is correct)');
        }
      } else {
        const [lo, hi] = bandFor(loc);
        const r = t.value.length / b.value.length;
        if (r < lo || r > hi) warn(loc, key, `length ratio ${r.toFixed(2)} outside ${lo}–${hi} (${t.value.length} vs ${b.value.length} chars)`);
      }
    }
  }
}

// forbidden strings anywhere in the sources
for (const dir of ['content', 'templates', 'legal', 'static']) {
  const walk = (d) => {
    if (!fs.existsSync(d)) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) { walk(f); continue; }
      if (!/\.(json|html|css|js|md|tpl)$/.test(e.name) && e.name !== '.htaccess') continue;
      const s = fs.readFileSync(f, 'utf8');
      for (const bad of FORBIDDEN_STRINGS) {
        if (s.includes(bad)) err('(repo)', path.relative(ROOT, f), `contains forbidden string "${bad}"`);
      }
    }
  };
  walk(path.join(ROOT, dir));
}

if (warnings.length) {
  console.warn(`\n${warnings.length} warning(s):`);
  console.warn(warnings.join('\n'));
}
if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`content OK · ${LOCALES.length} locale(s) · ${Object.keys(flatBase).length} keys each`);
