#!/usr/bin/env node
/**
 * The share cards: one 1200×630 picture per site language, the one WhatsApp,
 * Messenger, iMessage, Slack and the rest show when someone pastes a daili.app
 * link (og:image in build.mjs renderHead).
 *
 *     node tools/make-og-images.mjs          # every locale in LOCALES
 *     node tools/make-og-images.mjs de fr    # just these
 *
 * Writes static/assets/img/og/og-<loc>.jpg. JPEG at quality 90, not PNG: the
 * screenshot and the gradient made every PNG ~380 KB, the JPEG is a third of
 * that and looks the same at preview size. The output is **committed**, like
 * the screenshots: run this by hand when the headline (content/<loc>.json
 * hero.h1a/h1b), the home screenshot or the logo changes — never as part of
 * `npm run build`, which only checks that the file is there.
 *
 * Drawn as an HTML page and photographed by headless Chrome over the DevTools
 * protocol, because this repo has no npm dependencies and Node has no image
 * library — and because a browser is the one renderer that already sets
 * Japanese, Thai, Hindi and Arabic properly. The card uses the site's own
 * fonts and the home page's phone frame, served from static/ by a throwaway
 * local server so @font-face and the images load exactly as on the site.
 *
 * The headline shrinks until it fits its box, so a long translation never
 * runs under the phone. Every card must stay under MAX_BYTES; a heavier one
 * fails the run rather than slowing every preview down.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { LOCALES, RTL } from '../site.config.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STATIC = path.join(ROOT, 'static');
const OUT = path.join(STATIC, 'assets/img/og');
const W = 1200;
const H = 630;
const MAX_BYTES = 300 * 1024;
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const wanted = process.argv.slice(2);
for (const l of wanted) if (!LOCALES.includes(l)) throw new Error(`'${l}' is not in LOCALES`);
const locales = wanted.length ? wanted : LOCALES;

const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]);

/** shots/<loc>/shot-home.webp when that locale has its own capture, else English — as build.mjs imgSrc. */
function homeShot(loc) {
  const own = `/assets/img/shots/${loc}/shot-home.webp`;
  return fs.existsSync(path.join(STATIC, own)) ? own : '/assets/img/shots/en/shot-home.webp';
}

function card(loc) {
  const c = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', `${loc}.json`), 'utf8'));
  const dir = RTL.has(loc) ? 'rtl' : 'ltr';
  return `<!DOCTYPE html>
<html lang="${loc}" dir="${dir}"><head><meta charset="utf-8">
<link rel="stylesheet" href="/assets/style.css">
<style>
*{box-sizing:border-box;margin:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:none}
.card{position:relative;width:${W}px;height:${H}px;overflow:hidden;display:flex;align-items:center;
  background:linear-gradient(135deg,#BFE6D2 0%,#DDF1E6 45%,#F6FBF8 100%);color:#15271F;font-family:var(--sans)}
.glow{position:absolute;inset-inline-end:110px;top:40px;width:520px;height:520px;border-radius:50%;
  background:radial-gradient(closest-side,rgba(255,255,255,.85),rgba(255,255,255,0))}
.tx{position:relative;flex:1;height:100%;padding-block:64px;padding-inline:80px 0;display:flex;flex-direction:column;justify-content:space-between}
.brand{display:flex;align-items:center;gap:14px;font-size:40px;font-weight:700;letter-spacing:-.02em}
.brand img{width:60px;height:60px;border-radius:15px}
.hl{display:flex;align-items:center;height:330px;width:600px}
h1{font-family:var(--sans);font-weight:700;letter-spacing:-.04em;line-height:1.02;font-size:84px}
/* The two halves of the headline are the two lines, as on the home page; a
   half never wraps (a lone "る。" on a third line), the size gives way instead. */
h1 span{display:block;white-space:nowrap;width:max-content}
:is([lang="ar"],[lang="th"],[lang="hi"]) h1{line-height:1.3;letter-spacing:0}
:is([lang="ja"],[lang="ko"],[lang^="zh"]) h1{letter-spacing:0;line-height:1.2}
.url{font-size:26px;font-weight:600;color:#04613C}
.ph{position:relative;flex:none;width:470px;height:100%}
.phone{position:absolute;inset-inline-start:70px;top:58px;width:330px;aspect-ratio:640/1390;container-type:inline-size;border-radius:16%/7.367%;
  background:linear-gradient(145deg,#f4f5f7,#c9ccd2 40%,#eef0f2 60%,#aeb2b9);
  box-shadow:0 0 0 1px rgba(62,66,72,.55),0 50px 90px -30px rgba(21,39,31,.45),0 24px 40px -24px rgba(21,39,31,.3)}
.scr{position:absolute;inset:3.667cqw;border-radius:12.33cqw;overflow:hidden;background:#fff;box-shadow:0 0 0 2.2cqw #0c0e0d}
.scr img{display:block;width:100%;height:100%;object-fit:cover}
</style></head>
<body><div class="card">
  <div class="glow"></div>
  <div class="tx">
    <div class="brand"><img src="/assets/img/logo.webp" alt="">daili</div>
    <div class="hl"><h1><span>${esc(c.hero.h1a.trim())}</span><span>${esc(c.hero.h1b.trim())}</span></h1></div>
    <div class="url">daili.app</div>
  </div>
  <div class="ph"><div class="phone"><div class="scr"><img src="${homeShot(loc)}" alt=""></div></div></div>
</div>
<script>
// Shrink the headline until it fits its box, then say so.
window.fit = async () => {
  await document.fonts.ready;
  await Promise.all([...document.images].map((i) => i.decode()));
  const h1 = document.querySelector('h1');
  const box = document.querySelector('.hl');
  const wide = () => Math.max(...[...h1.children].map((s) => s.offsetWidth));
  let size = 84;
  while (size > 36 && (wide() > box.clientWidth || h1.offsetHeight > box.clientHeight)) {
    size -= 2;
    h1.style.fontSize = size + 'px';
  }
  return { size, fits: wide() <= box.clientWidth && h1.offsetHeight <= box.clientHeight };
};
</script>
</body></html>`;
}

// ---- a static server for static/ plus /__og/<loc> ----
const TYPES = { '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const og = url.match(/^\/__og\/([\w-]+)$/);
  if (og) {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    return res.end(card(og[1]));
  }
  const file = path.join(STATIC, url);
  if (!file.startsWith(STATIC) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

// ---- Chrome over the DevTools protocol ----
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'daili-og-'));
const chrome = spawn(CHROME, [
  '--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=0',
  `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });
const wsUrl = await new Promise((resolve, reject) => {
  let err = '';
  chrome.stderr.on('data', (d) => {
    err += d;
    const m = err.match(/DevTools listening on (ws:\/\/\S+)/);
    if (m) resolve(m[1]);
  });
  chrome.on('exit', (code) => reject(new Error(`Chrome exited (${code}) before DevTools came up:\n${err}`)));
});

const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let seq = 0;
const pending = new Map();
const waiters = [];
ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(JSON.stringify(msg.error)));
    else resolve(msg.result);
  } else if (msg.method) {
    for (const w of waiters.splice(0)) w(msg);
  }
});
const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
  const id = ++seq;
  pending.set(id, { resolve, reject });
  ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
});
const nextEvent = (name) => new Promise((resolve) => {
  const check = (msg) => (msg.method === name ? resolve(msg) : waiters.push(check));
  waiters.push(check);
});

let failed = 0;
try {
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  await send('Page.enable', {}, sessionId);
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false }, sessionId);
  fs.mkdirSync(OUT, { recursive: true });

  for (const loc of locales) {
    const loaded = nextEvent('Page.loadEventFired');
    await send('Page.navigate', { url: `${base}/__og/${loc}` }, sessionId);
    await loaded;
    const { result } = await send('Runtime.evaluate', { expression: 'window.fit()', awaitPromise: true, returnByValue: true }, sessionId);
    const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90, clip: { x: 0, y: 0, width: W, height: H, scale: 1 } }, sessionId);
    const buf = Buffer.from(shot.data, 'base64');
    const file = path.join(OUT, `og-${loc}.jpg`);
    fs.writeFileSync(file, buf, { mode: 0o644 });
    const kb = Math.round(buf.length / 1024);
    const { size, fits } = result.value;
    const problem = buf.length > MAX_BYTES ? 'TOO BIG' : !fits ? 'NO FIT ' : '';
    if (problem) failed++;
    console.log(`${problem || 'ok     '} og-${loc}.jpg  ${kb} KB  headline ${size}px`);
  }
} finally {
  ws.close();
  // Chrome keeps writing its profile for a moment after the signal; removing
  // the directory before it has exited fails with ENOTEMPTY.
  const exited = new Promise((r) => chrome.once('exit', r));
  chrome.kill();
  await exited;
  server.close();
  fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
if (failed) {
  console.error(`${failed} card(s) over ${MAX_BYTES / 1024} KB or with a headline that does not fit at 36px`);
  process.exit(1);
}
