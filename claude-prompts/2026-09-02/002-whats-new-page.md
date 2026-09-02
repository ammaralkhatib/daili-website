# "What's new" page — EN + DE, fed by the app's CHANGELOG

## Goal

daili.app gets a release-notes page so users (and store reviewers) can see what
changed in each version: `https://daili.app/whats-new.html` in English and
`https://daili.app/neuigkeiten.html` in German. **Two languages only, on
purpose** — the 24-locale content pipeline would cost 24 translations per
release forever; the legal pages already show the site can carry EN+DE-only
pages. More languages can come later if anyone reads it.

The page is **not** hand-written each release: every future release prompt in
the app repo (`claude-prompts/RELEASE-TEMPLATE.md`, requirement 5) *prepends one
`<section>` block* to two body files. This prompt creates the machinery plus the
first block (1.2.0), and makes the block format so simple that prepending never
needs a human.

Done = both URLs build as real pages with the 1.2.0 block, `npm run build` is
clean (all four steps), the pages link to each other as hreflang alternates,
appear in the sitemap, and the footer of every locale links to the page in
English (German locale links to the German one).

**Reuse the legal-page design, do not invent.** `legal/privacy.en.html` +
`templates/legal.html` + `PAGES.privacy` is the exact pattern.

## Scope

- **In:** `site.config.mjs` (one `PAGES` entry), `changelog/` (new folder with
  `whats-new.en.html`, `whats-new.de.html`), `templates/whats-new.html` (new;
  copy `legal.html` and adjust the heading/intro only), `templates/layout.html`
  (footer link only), `content/*.json` **only if** the footer label must be a
  translated key — see requirement 4 for the cheaper option first,
  `static/assets/style.css` (a few rules for the version blocks),
  `tools/check-build.mjs` (one guard, requirement 6).
- **Out:** `build.mjs` logic (a `body: {en, de}` page already works — if it
  does not for this page, stop and report why), the blog, the landing page,
  `.htaccess`, the detector, deploy. **Do not run `./deploy.sh`.**

## Requirements

1. **PAGES entry** modelled on `privacy`: `id: 'whats-new'`,
   `template: 'whats-new.html'`, `locales: ['en','de']`, `cluster: 'whats-new'`,
   `body: { en: 'changelog/whats-new.en.html', de: 'changelog/whats-new.de.html' }`
   (adjust the path convention to how `legal/` bodies are resolved in
   `build.mjs` — if bodies are read relative to `legal/`, put the folder where
   the resolver expects or extend the resolver minimally and say so),
   `out: (loc) => loc === 'en' ? 'whats-new.html' : 'neuigkeiten.html'`,
   `priority: () => '0.4'`.

2. **Body file format — the contract every release prompt relies on.** Each
   file is a list of `<section class="release" id="v1-2-0">` blocks, **newest
   first**, each exactly:
   ```html
   <section class="release" id="v1-2-0">
     <h2>Daili 1.2.0 <small>· 1 September 2026</small></h2>
     <ul>
       <li>…one bullet per user-visible change…</li>
     </ul>
   </section>
   ```
   Nothing else in the file — no wrapper, no heading above the first block
   (the template prints the page title and intro). Put a 3-line HTML comment at
   the top of each file stating this contract and "prepend new versions above
   this line" marker: `<!-- releases: newest first; prepend the next version
   directly below this comment -->`.

3. **First block, 1.2.0**, from the app repo's `CHANGELOG.md`
   (`~/development/flutter_projects/familyplanner/familyplanner-app/CHANGELOG.md`,
   section `[1.2.0 (7)]`, **Added + Fixed only — skip "In this build, not
   announced yet"**). English bullets as written there; German bullets in the
   register the German legal/landing copy uses (`du`), using the app's own
   German words for features (check `lib/l10n/app_de.arb` in the app repo:
   `Kacheln` for tiles, etc.). Date: 1 September 2026 / 1. September 2026.

4. **Footer link** in `templates/layout.html` next to the legal links: label
   "What's new" / German "Neuigkeiten". Cheapest correct option first: if the
   footer already renders per-locale labels from `content/<loc>.json`, add the
   key **to all 24 files** (English text in every non-German file is acceptable
   for now — say so in the report; `check-content.mjs` demands the key exist
   everywhere). If the footer can carry a literal per-page string without a
   content key, prefer that and touch no JSON. Every locale's footer links to
   the **English** page except `de`, which links to the German one.

5. **Template** `templates/whats-new.html`: copy of `legal.html` with the H1
   "What's new in Daili" / "Neu in Daili" and a one-sentence intro ("Every
   update, in plain words." / "Jedes Update, in einfachen Worten."), then the
   body. Title/description meta for both locales; canonical + hreflang come
   from the cluster like the legal pages. Minimal CSS: `.release + .release`
   top margin/border, `h2 small` muted.

6. **Guard** in `tools/check-build.mjs`: the built `whats-new.html` and
   `neuigkeiten.html` each contain ≥ 1 `<section class="release"` and the first
   one's `id` matches the first in the source body file (proves the "newest
   first" contract survives the build). **Prove it can fail** (temporarily
   break it, run, restore) and paste the failing line in the report — a guard
   that has never failed proves nothing.

## Constraints

- No inverted sections in the template engine (project memory: the engine has
  no `{{^ }}`); use `{{? }}` conditionals only.
- English-only pages carry `cluster: null`; this page has TWO locales, so it
  gets a real cluster and MUST emit exactly one hreflang pair (en↔de) and
  nothing else — `check-build` should already enforce pair symmetry.
- Do not touch the 24 landing/support translations beyond the optional footer
  key.
- `npm run build` fully clean. Self-correct up to 2 attempts (CLAUDE.md §2).

## Verify

- `npm run build` (all four steps green); `npm run serve` and open
  `/whats-new.html` and `/neuigkeiten.html`; the guard's proven failure output.

## Commit & push

- Conventional Commit `feat(site): what's-new page (en+de) fed by the app changelog`;
  body includes `Prompt: claude-prompts/2026-09-02/002-whats-new-page.md`.
- **Push now.** Pushing does NOT deploy this site (deploy is `./deploy.sh` on
  the Mac — never run it from a prompt).

## Report

- `claude-reports/2026-09-02/002-whats-new-page.md` from TEMPLATE.md.
- Open items for Ammar: run `./deploy.sh` when he wants the page live; the
  page's existence is what turns on requirement 5 of the app repo's
  `RELEASE-TEMPLATE.md` (until deployed it is simply built, not visible).
