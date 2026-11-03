#!/usr/bin/env node
// The review translations (2026-11-03/003). Runs in `npm run build` before
// build.mjs, like check-content.
//
// Every home page shows each REVIEWS entry in the page's language: the
// reviewer's own words when the languages match, else a translation from
// content/reviews/<loc>.json, labelled and with the original one tap away.
// A missing translation must fail here, never fall back to the original
// silently, and a stale one (a review that left REVIEWS) must not linger.
//   a. every LOCALES file exists and has exactly the ids it should — every
//      review whose language differs from the locale's, none other — and
//      `title` exactly when the original has one;
//   b. a translated string of 25+ chars is never byte-identical to the
//      original (an untranslated copy);
//   c. no empty string;
//   + every REVIEWS entry has a unique kebab-case id, and every locale's
//     home.reviews.translated has {language} exactly once.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOCALES, REVIEWS } from '../site.config.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const errors = [];
const err = (loc, key, msg) => errors.push(`${loc.padEnd(8)} ${key.padEnd(34)} ${msg}`);

const ids = new Set();
for (const r of REVIEWS) {
  if (typeof r.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(r.id)) err('(config)', String(r.id), `REVIEWS entry '${r.name}|${r.date}' needs a kebab-case id`);
  else if (ids.has(r.id)) err('(config)', r.id, 'duplicate REVIEWS id');
  ids.add(r.id);
}

const langOf = (loc) => new Intl.Locale(loc).language;
let total = 0;
for (const loc of LOCALES) {
  const want = REVIEWS.filter((r) => r.lang !== langOf(loc));
  const f = path.join(ROOT, 'content', 'reviews', `${loc}.json`);
  if (!fs.existsSync(f)) { err(loc, '(file)', `content/reviews/${loc}.json does not exist but ${loc} is in LOCALES`); continue; }
  let data;
  try { data = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { err(loc, '(file)', `invalid JSON: ${e.message}`); continue; }
  if (!data || typeof data !== 'object' || Array.isArray(data)) { err(loc, '(file)', 'must be an object keyed by review id'); continue; }

  const wantIds = new Set(want.map((r) => r.id));
  for (const id of Object.keys(data)) {
    if (!wantIds.has(id)) {
      const r = REVIEWS.find((x) => x.id === id);
      err(loc, id, r ? `is in ${loc}'s own language (${r.lang}) — that page shows the original, no translation` : 'unknown or stale id — not in REVIEWS');
    }
  }
  for (const r of want) {
    const t = data[r.id];
    if (!t || typeof t !== 'object') { err(loc, r.id, `MISSING — the ${r.lang} review needs a ${loc} translation`); continue; }
    const fields = Object.keys(t);
    const wantFields = r.title ? ['text', 'title'] : ['text'];
    if (fields.slice().sort().join() !== wantFields.join()) {
      err(loc, r.id, `has fields [${fields.join(', ')}], expected [${wantFields.join(', ')}] — title exactly when the original has one`);
    }
    for (const k of wantFields) {
      const v = t[k];
      if (typeof v !== 'string' || !v.trim()) { err(loc, `${r.id}.${k}`, 'empty or not a string'); continue; }
      if (v.length >= 25 && v === r[k]) err(loc, `${r.id}.${k}`, 'byte-identical to the original — untranslated');
      if (/[<>\n]/.test(v)) err(loc, `${r.id}.${k}`, 'plain text only — no markup, no line breaks');
    }
    total++;
  }

  const c = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', `${loc}.json`), 'utf8'));
  const tr = c?.home?.reviews?.translated;
  if (typeof tr !== 'string' || tr.split('{language}').length !== 2) err(loc, 'home.reviews.translated', 'must contain {language} exactly once');
}

if (errors.length) {
  console.error(`\n${errors.length} review translation error(s):`);
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`reviews OK · ${REVIEWS.length} review(s) · ${total} translation(s) in ${LOCALES.length} locale(s)`);
