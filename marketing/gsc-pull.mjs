#!/usr/bin/env node
/**
 * The Search Console half of the Monday report (marketing/weekly.sh).
 *
 *     node marketing/gsc-pull.mjs
 *
 * Signs a service-account JWT with node:crypto (RS256), swaps it for an access
 * token, and asks searchanalytics.query for sc-domain:daili.app over the last
 * 28 days ending 3 days ago (Search Console data lags). Two calls:
 * [query, page] → queries.json, [page] → pages.json, in
 * ~/Claude/Projects/Family Planner/marketing/gsc/<YYYY-MM-DD>/.
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

async function query(token, dimensions) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ startDate: START, endDate: END, dimensions, rowLimit: 1000 }),
  });
  if (!res.ok) throw new Error(`searchanalytics.query [${dimensions}]: HTTP ${res.status} ${(await res.text()).slice(0, 300)}`);
  return { site: SITE, startDate: START, endDate: END, dimensions, ...(await res.json()) };
}

fs.mkdirSync(OUT, { recursive: true });
const errFile = path.join(OUT, 'ERROR.txt');
try {
  const token = await accessToken();
  const queries = await query(token, ['query', 'page']);
  const pages = await query(token, ['page']);
  fs.writeFileSync(path.join(OUT, 'queries.json'), JSON.stringify(queries, null, 2));
  fs.writeFileSync(path.join(OUT, 'pages.json'), JSON.stringify(pages, null, 2));
  fs.rmSync(errFile, { force: true });
  console.log(`gsc: ${START}..${END} → ${OUT} (${queries.rows?.length ?? 0} query rows, ${pages.rows?.length ?? 0} page rows)`);
} catch (e) {
  fs.writeFileSync(errFile, `${new Date().toISOString()}\n${e.message}\n`);
  console.log(`gsc: failed, wrote ${errFile}: ${e.message}`);
}
