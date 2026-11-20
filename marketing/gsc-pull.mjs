#!/usr/bin/env node
/**
 * The Search Console half of the Monday report (marketing/weekly.sh).
 *
 *     node marketing/gsc-pull.mjs
 *
 * Signs a service-account JWT with node:crypto (RS256), swaps it for an access
 * token, and asks searchanalytics.query for sc-domain:daili.app over the last
 * 28 days ending 3 days ago (Search Console data lags). Two dimension sets:
 * [query, page] → queries.json, [page] → pages.json, in
 * ~/Claude/Projects/Family Planner/marketing/gsc/<YYYY-MM-DD>/. Each set reads
 * ALL rows (pages of 25,000, at most 20 calls); both files carry `rowCount`
 * and `"complete": true` (false only when the 20-call stop was hit) —
 * daili-seo.sh treats a file without `"complete": true` and 1,000 rows as cut.
 *
 * Zero npm dependencies, like the rest of the repo. Any failure — no key file,
 * a bad key, an HTTP error — writes ERROR.txt in that folder and exits 0, so
 * the Astro half of the report still runs. The key is never printed or logged:
 * errors name the file, not its contents.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';

const KEY_FILE = path.join(os.homedir(), '.config/daili/gsc-service-account.json');
const SITE = 'sc-domain:daili.app';
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

/** Local date as YYYY-MM-DD, matching `date +%F` in weekly.sh and the report. */
const ymd = (d) => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d; };

const TODAY = ymd(new Date());
const OUT = path.join(os.homedir(), 'Claude/Projects/Family Planner/marketing/gsc', TODAY);
const END = ymd(daysAgo(3));
const START = ymd(daysAgo(3 + 27)); // 28 days, both ends included

const b64url = (buf) => Buffer.from(buf).toString('base64url');

async function accessToken() {
  if (!fs.existsSync(KEY_FILE)) throw new Error(`no key file at ${KEY_FILE}`);
  let key;
  try {
    key = JSON.parse(fs.readFileSync(KEY_FILE, 'utf8'));
  } catch {
    throw new Error(`${KEY_FILE} is not valid JSON`);
  }
  if (!key.client_email || !key.private_key) throw new Error(`${KEY_FILE} has no client_email or private_key`);

  const now = Math.floor(Date.now() / 1000);
  const head = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = b64url(JSON.stringify({ iss: key.client_email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 }));
  const sig = crypto.createSign('RSA-SHA256').update(`${head}.${claims}`).sign(key.private_key);
  const jwt = `${head}.${claims}.${b64url(sig)}`;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  });
  if (!res.ok) throw new Error(`token exchange: HTTP ${res.status} ${(await res.text()).slice(0, 300)}`);
  return (await res.json()).access_token;
}

/**
 * All rows for one dimension set: pages of ROW_LIMIT (Google's maximum per
 * call) at startRow 0, ROW_LIMIT, 2 × ROW_LIMIT … until a call returns fewer
 * rows than the limit. At most MAX_CALLS calls; if the last one is still full,
 * the rows so far are kept and the file says "complete": false.
 */
const ROW_LIMIT = 25000;
const MAX_CALLS = 20;

async function query(token, dimensions) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`;
  const rows = [];
  let aggregation;
  let calls = 0;
  let complete = false;
  while (calls < MAX_CALLS) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ startDate: START, endDate: END, dimensions, rowLimit: ROW_LIMIT, startRow: calls * ROW_LIMIT }),
    });
    calls += 1;
    if (!res.ok) throw new Error(`searchanalytics.query [${dimensions}]: HTTP ${res.status} ${(await res.text()).slice(0, 300)}`);
    const body = await res.json();
    if (body.responseAggregationType !== undefined && aggregation === undefined) aggregation = body.responseAggregationType;
    const got = Array.isArray(body.rows) ? body.rows : [];
    rows.push(...got);
    if (got.length < ROW_LIMIT) {
      complete = true;
      break;
    }
  }
  const out = { site: SITE, startDate: START, endDate: END, dimensions, rowCount: rows.length, complete, rows };
  if (aggregation !== undefined) out.responseAggregationType = aggregation;
  return { data: out, calls };
}

const callWord = (n) => (n === 1 ? 'call' : 'calls');

fs.mkdirSync(OUT, { recursive: true });
const errFile = path.join(OUT, 'ERROR.txt');
try {
  const token = await accessToken();
  const queries = await query(token, ['query', 'page']);
  const pages = await query(token, ['page']);
  fs.writeFileSync(path.join(OUT, 'queries.json'), JSON.stringify(queries.data, null, 2));
  fs.writeFileSync(path.join(OUT, 'pages.json'), JSON.stringify(pages.data, null, 2));
  fs.rmSync(errFile, { force: true });
  const part = (q, what) =>
    `${q.data.rowCount} ${what} rows in ${q.calls} ${callWord(q.calls)}${q.data.complete ? '' : `, NOT complete (stopped after ${MAX_CALLS} calls)`}`;
  console.log(`gsc: ${START}..${END} → ${OUT} (${part(queries, 'query')}, ${part(pages, 'page')})`);
} catch (e) {
  fs.writeFileSync(errFile, `${new Date().toISOString()}\n${e.message}\n`);
  console.log(`gsc: failed, wrote ${errFile}: ${e.message}`);
}
