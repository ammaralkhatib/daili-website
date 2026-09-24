#!/usr/bin/env node
// Guards the help center. Runs in `npm run build` BEFORE build.mjs, so a help
// article that explains a screen the app no longer has — or an app screen that
// has no article — stops the build instead of reaching a reader.
//
// It reads the app's own route list from the sibling repo
// (DAILI_APP_REPO, default ../familyplanner-app). That is the point: renaming
// or removing a screen in the app turns this red on the next website build.
// HELP_SKIP_ROUTE_CHECK=1 skips the route checks, loudly, for a machine that
// has no app checkout.
//
// All the rules live in tools/help-lib.mjs; tools/test-check-help.mjs proves
// each of them can actually fail.

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HELP_TOPICS, HELP_ICONS } from '../site.config.mjs';
import { checkHelp, readAppRoutes } from './help-lib.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const appRepo = path.resolve(ROOT, process.env.DAILI_APP_REPO || '../familyplanner-app');

let appRoutes = null;
if (process.env.HELP_SKIP_ROUTE_CHECK === '1') {
  console.warn('\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  console.warn('!! HELP_SKIP_ROUTE_CHECK=1 — the help route checks are OFF.');
  console.warn('!! Nothing checks that articles match the app\'s screens in this build.');
  console.warn('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n');
} else {
  try {
    appRoutes = readAppRoutes(appRepo);
  } catch (e) {
    console.error(`check-help: ${e.message}`);
    process.exit(1);
  }
}

const { errors, warnings, help } = checkHelp({ root: ROOT, topics: HELP_TOPICS, icons: HELP_ICONS, appRoutes });

for (const w of warnings) console.warn(`WARN  ${w}`);
if (errors.length) {
  console.error(`\n${errors.length} help error(s):`);
  console.error(errors.join('\n'));
  process.exit(1);
}
// Articles allowed to go without a picture for now, so they stay visible.
const pending = help.articles.filter((a) => a.mediaPending);
if (pending.length) {
  console.log(`help: ${pending.length} article(s) waiting for a picture:`);
  for (const a of pending) console.log(`  ${a.id} — ${a.mediaPending}`);
}
console.log(`help OK · ${help.articles.length} article(s)${appRoutes ? ` · ${appRoutes.size} app routes checked` : ' · route checks SKIPPED'}`);
