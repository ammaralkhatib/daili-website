#!/usr/bin/env node
// Regenerates content/glossary.md from the app's ARB files.
//
// The point: the website must use the words the APP shows on its tabs and
// tiles. If the German page says "Einkaufsliste" while the app's tab says
// "Einkaufen", someone who downloads from that page finds a different product
// than the one they read about. This table is the contract between the two.
//
// Reads the app repo. Never writes to it.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ARB = path.resolve(ROOT, '..', 'familyplanner-app', 'lib', 'l10n');

const TERMS = [
  ['Calendar',   'dashboardTileCalendar'],
  ['Shopping',   'dashboardTileShopping'],
  ['To-dos',     'dashboardTileTodos'],
  ['Lists',      'navLists'],
  ['Meal plan',  'dashboardTileMealPlan'],
  ['Recipes',    'recipesTitle'],
  ['Birthdays',  'dashboardTileCelebrations'],
  ['Documents',  'documentsTitle'],
  ['Photos',     'photosTitle'],
  ['Family',     'familyTitle'],
];

const HEADER = `# Feature vocabulary — inherited from the app, not invented here

Generated from \`familyplanner-app/lib/l10n/app_*.arb\` by \`node tools/glossary.mjs\`.
**These are the words the app itself shows on its tabs and tiles**, and the
website must use the same ones — see the note in tools/glossary.mjs for why.

Locales missing below (ja, ko, zh-Hans, zh-Hant, tr, ar, cs, fi, th, ru, id, hi)
have no app translation yet. Their terms are decided on the website first; hand
this table back to the app when it adds them, so the vocabulary is chosen once
for both products.

Two to watch, because they are not the obvious cognate:
- **fr**: the calendar is *Agenda*, shopping is *Courses*.
- **nl**: the family is *Gezin*, not *Familie*.
- **pt** is Brazilian (*Cardápio*, not *Ementa*), matching the app's decision.

`;

if (!fs.existsSync(ARB)) {
  console.error(`app ARB directory not found at ${ARB} — is the app repo a sibling of this one?`);
  process.exit(1);
}

const files = fs.readdirSync(ARB).filter((f) => /^app_.+\.arb$/.test(f)).sort();
const rows = files.map((f) => {
  const d = JSON.parse(fs.readFileSync(path.join(ARB, f), 'utf8'));
  return [f.replace(/^app_|\.arb$/g, ''), ...TERMS.map(([, k]) => d[k] ?? '—')];
});

const head = ['locale', ...TERMS.map(([label]) => label)];
const width = head.map((h, i) => Math.max(h.length, ...rows.map((r) => String(r[i]).length)));
const line = (cells) => `| ${cells.map((c, i) => String(c).padEnd(width[i])).join(' | ')} |`;

const table = [
  line(head),
  `|${width.map((w) => '-'.repeat(w + 2)).join('|')}|`,
  ...rows.map(line),
].join('\n');

fs.writeFileSync(path.join(ROOT, 'content', 'glossary.md'), `${HEADER}${table}\n`);
console.log(`glossary.md written · ${rows.length} locales · ${TERMS.length} terms`);
