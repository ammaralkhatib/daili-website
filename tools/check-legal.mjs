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

/**
 * Every `<h2` tag, with or without attributes. `/<h2>/g` alone would skip
 * `<h2 id="…">` — and a section with an anchor is still a section.
 */
const H2 = /<h2[\s>]/g;

/** The ids on the `<h2>` tags of a body, in order. */
const h2Ids = (s) => [...s.matchAll(/<h2\s[^>]*\bid="([^"]+)"/g)].map((m) => m[1]);

/**
 * Google's OAuth verification of the Calendar scopes was granted on the strength
 * of the privacy policy's "Google user data" section: the reviewer is sent to
 * privacy.html#google-user-data and reads the sharing, protection and Limited Use
 * statements there. Losing any of these in the binding bodies re-opens the
 * verification, so their presence is asserted rather than trusted.
 */
const GOOGLE_OAUTH_MUST_CONTAIN = ['id="google-user-data"', 'id="data-protection"', 'api-services-user-data-policy', 'Limited Use'];
const GOOGLE_OAUTH_WHY = 'the Google OAuth verification depends on this section — see claude-prompts/2026-09-28/001';

/**
 * Daili Plus is sold in every locale, so every reader must find what they are
 * buying (terms) and who processes the purchase (privacy). The terms anchor is
 * an <h2> and is also caught by the id comparison below; the privacy anchor is
 * a <p> and is not, which is why both are asserted here by name.
 */
const PLUS_MUST_CONTAIN = { terms: ['id="plus"'], privacy: ['id="plus"', 'RevenueCat'] };
const PLUS_WHY = 'Daili Plus is sold in every locale — see claude-prompts/2026-10-01/001';

/**
 * Notes keep pictures, drawings and recordings — on the phone, or in Daili
 * cloud at Hetzner — and can be spoken, summarised and given link previews.
 * Every reader must find where those files go and who stores them. All three
 * anchors are on <p> tags, so the <h2> id comparison below cannot see them.
 */
const NOTES_MUST_CONTAIN = { terms: [], privacy: ['id="notes-files"', 'id="voice"', 'id="link-previews"', 'Hetzner'] };
const NOTES_WHY = 'note files, voice and link previews are in every locale — see claude-prompts/2026-10-05/001';

/**
 * App 1.10.0 sends a rounded place to Apple Weather (MET Norway as fallback),
 * can keep a rough place for the daily summary, stores Budget on our server and
 * keeps Cycle on the phone — and Cycle is not a medical device. A reader in any
 * language must find all of it. Every anchor is on a <p>, invisible to the <h2>
 * id comparison below.
 */
const V110_MUST_CONTAIN = {
  terms: ['id="cycle"'],
  privacy: ['id="weather"', 'id="weather-summary"', 'id="budget"', 'id="cycle"', 'MET Norway', 'Apple'],
};
const V110_WHY = 'weather, Budget and Cycle (app 1.10.0) are in every locale — see claude-prompts/2026-10-12/002';

/**
 * App 1.11.0: the server counts active days per person and source, and the web
 * app looks up weather places with Apple Maps through our server. Both anchors
 * are on <p> tags, invisible to the <h2> id comparison below.
 */
const V111_MUST_CONTAIN = { terms: [], privacy: ['id="activity"', 'id="web-places"', 'Apple Maps'] };
const V111_WHY = 'the daily activity count and web place search (app 1.11.0) are in every locale — see claude-prompts/2026-10-16/001';

/**
 * AI apps connected over MCP (api.daili.app/mcp): what they can read and add,
 * what never reaches them, what we store — and, for Google's reviewer, that
 * Google Calendar data never reaches them. Both anchors are on <p> tags,
 * invisible to the <h2> id comparison below.
 */
const MCP_MUST_CONTAIN = { terms: [], privacy: ['id="ai-apps"', 'id="google-ai-apps"'] };
const MCP_WHY = 'AI apps you connect (MCP) are in every locale — see claude-prompts/2026-10-22/002';

/**
 * App 1.12.0: the AI avatar sends a selfie or picked looks to Gemini, and a
 * budget can have guests and an opt-in read-only link for them. Both anchors
 * are on <p> tags, invisible to the <h2> id comparison below.
 */
const V112_MUST_CONTAIN = { terms: [], privacy: ['id="avatar-ai"', 'id="budget-guests"'] };
const V112_WHY = 'the AI avatar and budget guests + guest link (app 1.12.0) are in every locale — see claude-prompts/2026-10-23/001';

/**
 * App 1.13.0: "Copy to Daili" turns a phone-calendar or linked-calendar event
 * into a normal Daili event (on our server, seen by the family and by connected
 * AI apps), and the app strips location data from every photo before upload.
 * Both anchors are on <p> tags, invisible to the <h2> id comparison below.
 */
const V113_MUST_CONTAIN = { terms: [], privacy: ['id="copy-to-daili"', 'id="photo-location"'] };
const V113_WHY = 'Copy to Daili and photo location data (app 1.13.0) are in every locale — see claude-prompts/2026-10-27/001';

/**
 * App 1.14.0: a tablet can become a family wall screen (app.daili.app/board).
 * What it stores, what it never shows and how it ends must be readable in
 * every language. The anchor is on a <p>, invisible to the <h2> id comparison
 * below.
 */
const V114_MUST_CONTAIN = { terms: [], privacy: ['id="wall-screens"'] };
const V114_WHY = 'family wall screens (app 1.14.0) are in every locale — see claude-prompts/2026-10-29/003';

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
  const wantH2 = count(enSrc, H2);
  const wantIds = h2Ids(enSrc);
  const wantStamp = stamp(enSrc);
  if (!wantStamp) fail(enFile, 'the .updated line has no <time datetime="…"> — nothing to compare the translations against');

  for (const loc of LOCALES) {
    const rel = `legal/${pg.body[loc]}`;
    if (!fs.existsSync(path.join(ROOT, rel))) { fail(rel, `body for locale '${loc}' does not exist`); continue; }
    const src = read(rel);

    const h2 = count(src, H2);
    if (h2 !== wantH2) fail(rel, `has ${h2} <h2> sections, English has ${wantH2} — the translation is not the same document`);

    // An anchor that works in English but 404s to the top of the page in
    // Japanese is a broken link the English reviewer will never see.
    const ids = new Set(h2Ids(src));
    for (const want of wantIds) {
      if (!ids.has(want)) fail(rel, `has no <h2 id="${want}"> — English does, and ${BINDING_URL[id]}#${want} must work in every language`);
    }

    if (id === 'privacy' && AUTHORITATIVE.has(loc)) {
      for (const must of GOOGLE_OAUTH_MUST_CONTAIN) {
        if (!src.includes(must)) fail(rel, `does not contain ${must} — ${GOOGLE_OAUTH_WHY}`);
      }
    }

    for (const must of PLUS_MUST_CONTAIN[id]) {
      if (!src.includes(must)) fail(rel, `does not contain ${must} — ${PLUS_WHY}`);
    }

    for (const must of NOTES_MUST_CONTAIN[id]) {
      if (!src.includes(must)) fail(rel, `does not contain ${must} — ${NOTES_WHY}`);
    }

    for (const must of V110_MUST_CONTAIN[id]) {
      if (!src.includes(must)) fail(rel, `does not contain ${must} — ${V110_WHY}`);
    }

    for (const must of V111_MUST_CONTAIN[id]) {
      if (!src.includes(must)) fail(rel, `does not contain ${must} — ${V111_WHY}`);
    }

    for (const must of MCP_MUST_CONTAIN[id]) {
      if (!src.includes(must)) fail(rel, `does not contain ${must} — ${MCP_WHY}`);
    }

    for (const must of V112_MUST_CONTAIN[id]) {
      if (!src.includes(must)) fail(rel, `does not contain ${must} — ${V112_WHY}`);
    }

    for (const must of V113_MUST_CONTAIN[id]) {
      if (!src.includes(must)) fail(rel, `does not contain ${must} — ${V113_WHY}`);
    }

    for (const must of V114_MUST_CONTAIN[id]) {
      if (!src.includes(must)) fail(rel, `does not contain ${must} — ${V114_WHY}`);
    }

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
