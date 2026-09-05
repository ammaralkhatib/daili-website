#!/usr/bin/env node
// Guards the legal bodies BEFORE they are built.
//
// Privacy and Terms exist in 23 languages. Exactly one of those — English — is
// binding; the other 22 are conveniences that a reader will nonetheless treat
// as the document. That asymmetry is the whole reason this file exists: a
// translation that has quietly lost a section, or still carries last month's
// date, does not look broken. It looks like a different policy.
//
// So this checks the one thing a human review cannot do reliably across 23
// languages at once — that every translation is STRUCTURALLY the English one —
// and leaves the prose to a native reader.
//
// Runs as the first link of `npm run build`, beside check-content.mjs, because
// it reads sources rather than dist/ and there is no point building 46 pages
// that are already wrong.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOCALES, PAGES, BRAND_TRANSLITERATIONS, FORBIDDEN_STRINGS } from '../site.config.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const errors = [];
const fail = (file, msg) => errors.push(`${file.padEnd(34)} ${msg}`);

/** The two pages this file is about. Anything else in PAGES is not its business. */
const LEGAL_IDS = ['privacy', 'terms'];

/**
 * The authoritative languages. They are written, not translated, so they carry
 * no "this is a translation" note — and asserting that is as much the point as
 * asserting the other 21 do carry one.
 */
const AUTHORITATIVE = new Set(['en', 'de']);

/** The English page a translation must link to, per legal id. */
const BINDING_URL = { privacy: '/privacy.html', terms: '/terms.html' };

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const count = (s, re) => (s.match(re) || []).length;

/**
 * The date, as a machine can read it.
 *
 * The visible date is localised — "5 September 2026", "5. September 2026",
 * "2026年9月5日" — so comparing the printed strings across 23 languages is not
 * possible and building a month-name table for 23 languages would have to be
 * rewritten on every update. `<time datetime="2026-09-05">` inside the
 * `.updated` line is the one value that is identical everywhere, and it is
 * standard HTML rather than a convention invented here.
 */
const stamp = (s) => (s.match(/<p class="updated">[^]*?<time datetime="([^"]+)"/) || [])[1];

for (const id of LEGAL_IDS) {
  const pg = PAGES.find((p) => p.id === id);
  if (!pg) { fail('site.config.mjs', `no PAGES entry with id '${id}'`); continue; }
  if (pg.locales !== 'all') {
    fail('site.config.mjs', `PAGES '${id}' is not locales:'all' — the legal pages ship in every locale`);
  }

  // English first: it is the yardstick every other locale is measured against,
  // so if it is missing there is nothing to measure and the loop below would
  // report 22 meaningless failures instead of the one real one.
  const enFile = `legal/${pg.body.en}`;
  if (!fs.existsSync(path.join(ROOT, enFile))) { fail(enFile, 'the binding English body does not exist'); continue; }
  const enSrc = read(enFile);
  const wantH2 = count(enSrc, /<h2>/g);
  const wantStamp = stamp(enSrc);
  if (!wantStamp) fail(enFile, 'the .updated line has no <time datetime="…"> — nothing to compare the translations against');

  for (const loc of LOCALES) {
    const rel = `legal/${pg.body[loc]}`;
    if (!fs.existsSync(path.join(ROOT, rel))) { fail(rel, `body for locale '${loc}' does not exist`); continue; }
    const src = read(rel);

    const h2 = count(src, /<h2>/g);
    if (h2 !== wantH2) fail(rel, `has ${h2} <h2> sections, English has ${wantH2} — the translation is not the same document`);

    if (!src.includes('support@daili.app')) fail(rel, 'does not contain support@daili.app — the one address a reader needs');

    const got = stamp(src);
    if (!got) fail(rel, 'the .updated line has no <time datetime="…">');
    else if (wantStamp && got !== wantStamp) fail(rel, `is dated ${got} but English is dated ${wantStamp} — a stale translation reads as a different policy`);

    if (AUTHORITATIVE.has(loc)) {
      if (src.includes('class="translated"')) fail(rel, `locale '${loc}' is an authoritative version and must not carry a translation note`);
    } else {
      if (!src.includes('class="translated"')) fail(rel, 'has no <p class="translated"> note — a translation must say the English version binds');
      if (!src.includes(`href="${BINDING_URL[id]}"`)) fail(rel, `does not link to ${BINDING_URL[id]} — the note has to reach the binding version`);
    }

    for (const bad of FORBIDDEN_STRINGS) {
      if (src.includes(bad)) fail(rel, `contains forbidden string "${bad}"`);
    }
    for (const tl of BRAND_TRANSLITERATIONS) {
      if (src.includes(tl)) fail(rel, `contains transliterated brand "${tl}" — write "Daili" in Latin letters`);
    }
  }
}

if (errors.length) {
  console.error(`\n${errors.length} legal error(s):`);
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`legal OK · ${LEGAL_IDS.length} document(s) × ${LOCALES.length} locale(s)`);
