# 001 — Terms + Privacy: Daili Plus and RevenueCat

Commits: `a98f36c` (step 0: this prompt + report 2026-09-30/001), `360c46f` (the work). Pushed to `main`. `./deploy.sh` **not** run.

## Files changed (57, all in `360c46f`)
- `legal/terms.*.html` ×27 + `legal/nutzungsbedingungen.de.html`: intro, new `<h2 id="plus">6. Daili Plus …` (7 paragraphs), old 6–11 → 7–12, availability / liability / ending edits, dated 2026-10-01.
- `legal/privacy.*.html` ×27 + `legal/datenschutz.de.html`: `<p id="plus">` Daili Plus purchases after the AI paragraph in §4, RevenueCat sentence in §7, retention sentence in §8, dated 2026-10-01. §5 unchanged.
- `tools/check-legal.mjs`: `PLUS_MUST_CONTAIN`. Every terms body must contain `id="plus"`. Every privacy body must contain `id="plus"` and `RevenueCat`.

EN and DE use the prompt's text word for word, with these exceptions:
- **German privacy register.** The prompt calls `datenschutz.de.html` "Sie", but the file is "du" throughout (34 du-forms; its 7 "Sie" are all "it/they"). I kept the prompt's wording and changed only the pronouns to du/dein/dir, so the binding German document doesn't mix registers. Please confirm or revert.
- **Founder word.** `settingsFounderChip` is "Founder" in every ARB, German included. So German uses "Founder." / "Founder-Programm" instead of "Gründer", and all translations keep "Founder" in Latin letters (ru/hi/ar, which have no ARB, too).

Translations were made from English by sub-agents, then verified on disk by me:
- every terms body has headings 1–12 with no gap and exactly 7 paragraphs in §6;
- every privacy body has `<p id="plus">` directly after the Gemini paragraph and `<code>user_123</code>`;
- every body carries 2026-10-01;
- the diff shape is identical in all locales (terms +20/−11, privacy +4/−3).

Each file keeps its own register, its own privacy-link href (several locales link `/<loc>/privacy.html`), its own GDPR citation form and its `class="translated"` note. No native-speaker review was done.

## Guard + proof it fails
`node tools/check-legal.mjs` → `legal OK · 2 document(s) × 28 locale(s)`. I removed `id="plus"` from the `<p>` in `legal/privacy.fr.html` (a case the existing h2-id check can't see) and ran it again. Output: `1 legal error(s): legal/privacy.fr.html does not contain id="plus" — Daili Plus is sold in every locale`, exit 1. I then restored the file and it was OK again.

## Build
`npm run build` passed the whole chain: `build OK · 2259 pages`, `detector OK · 32 cases · 28 locale(s) built`. I read these built pages:
- `dist/terms.html`, `dist/nutzungsbedingungen.html` and `dist/fr/terms.html`: terms run 1–12 and `#plus` is present.
- `dist/privacy.html`, `dist/datenschutz.html` and `dist/ja/privacy.html`: `#plus` and the RevenueCat text render, and §1–12 are unchanged.

None of the three terms pages contains the "free service" clause any more.

## Section-number links fixed
None. A grep of `legal/ help/ blog/ templates/ content/` found no link or text pointing at a terms section by number or anchor. Privacy numbering is unchanged.

## Not mine, left uncommitted
`static/assets/img/blog/what-to-look-for-family-app.webp` and `static/assets/img/photos/`. Note that `./deploy.sh` builds from the working tree, so they would be copied into `dist/`.

`claude-reports/2026-09-30/001-help-sync-1-8-0.md` was committed in the step-0 docs commit, as the run instructions say to commit everything under `claude-reports/`.

## Help impact
None.
