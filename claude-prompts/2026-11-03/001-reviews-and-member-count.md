# Home page — real store reviews + "Joined by 2,000+"

## Goal

Two small home-page changes on daili.app (all 23 locales). Done = both parts below, `npm run build` green, the one
guard change proven to fail. **Do not deploy** — Ammar runs `./deploy.sh` after Planning Claude checks the result.

## 1. Member count

`site.config.mjs`: `MEMBERS_COUNT = 1500` → `2000` (Ammar, 2026-11-03: Daili has 2,000+ users). The headline
becomes "Joined by 2,000+ members" (each locale formats the number itself). Nothing else changes.

## 2. Turn on the reviews section

The reviews row already exists (`build.mjs` ~915, `templates/landing.html` right after the "Made with care" section,
`home.css` `.rv`, check-build §15). It renders only from 3 real entries in `REVIEWS`. Fill it.

### 2a. Google Play reviews have no title — make `title` optional

Play reviews have no title; App Store reviews do. Never invent a title for a real review.

- `build.mjs`: `title` is no longer a required key. A review with no title (key missing or empty string) renders
  **no `<b>` line** — the card goes stars → who-line → text. The `aria-label` / layout stays otherwise the same.
- `data-review` today carries the title. Change it to a stable key that works without a title: `${name}|${date}`.
- `tools/check-build.mjs` §15: match each card back to `REVIEWS` by `[title || '', text]` (the shown `<b>` text, or
  empty when the card has none), in order, as today. Keep "only real reviews, never invented ones" in the message.
- Update the `REVIEWS` doc comment in `site.config.mjs`: title is optional ("Google Play reviews have none — leave it
  out"); text may be a shortened excerpt only when the cut is marked with "…".
- Prove it can fail: change one `text` character in the built HTML's card (or drop one card from `REVIEWS` only in a
  scratch copy of the built page), run check-build, see §15 go red, restore. One line in the report.

### 2b. The entries — copy EXACTLY, in this order

Texts are the reviewers' own words in their own language (Play Console "original review" / App Store listing,
checked 2026-11-03). Names are as the store shows them (Play full names shortened to first name + initial). Do not
fix spelling or capitals — these are quotes.

```js
export const REVIEWS = [
  { text: "VERAMENTE OTTIMA PIENA DI FUNZIONI ECCELLENTI. Ne ho usate tantissime di calendari sopratutto per condividerli anche a pagamento. Questa App lì supera tutti, non c'è funzione che manchi. Veramente complimenti a chi l'ha realizzata",
    name: "Valentino R.", source: "Google Play", stars: 5, lang: "it", date: "2026-10-31" },
  { title: "Complete and in-depth app",
    text: "Google Calendar got a bit too hard to manage, mostly for my aging parents. This app is perfect for our scheduling. It has a simple and intuitive UI, so my parents got used to it easily. Being able to manage multiple families also allows me to set scheduling with my friend groups! Kudos to the developers and will be using this app from now on.",
    name: "willoo98", source: "App Store", stars: 5, lang: "en", date: "2026-10-02" },
  { title: "Erstaunlich gut!",
    text: "Auf der Suche nach einer App, mit der ich unsere Familien-Orga mit Mann und drei Kindern unter einen Hut bekomme, bin ich auf diese App gestoßen. Nachdem ich mir drei andere bekannte Apps runtergeladen habe, aber nicht fand, was ich suchte, war ich umso überraschter, dass die Funktionen hier echt gut sind. … Echt durchdacht!",
    name: "Kathii19866", source: "App Store", stars: 5, lang: "de", date: "2026-10-26" },
  { title: "Skvělá app",
    text: "Skvělá aplikace pro rodinu, sdílení úkolů, nákupů, přiřazování kdo/co, sdílený kalendář. Teprve si zvykáme, ale už teď jsem moc spokojený. Doporučuji stáhnout",
    name: "Cordis23", source: "App Store", stars: 5, lang: "cs", date: "2026-10-01" },
  { text: "Genau das, was ich gesucht habe! Alles was man braucht, um als Familie den Überblick zu behalten und sich den Alltag zu erleichtern. Außerdem ein fantastischer Support, der Fragen sehr zügig beantwortet und Wünsche umsetzt!",
    name: "Google Play user", source: "Google Play", stars: 5, lang: "de", date: "2026-10-30" },
  { title: "Great app",
    text: "This app has everything I need to create to-do’s, family meal plans and more. Love the features. No fluff.",
    name: "agranger3722", source: "App Store", stars: 5, lang: "en", date: "2026-09-16" },
  { text: "Bisher sehr zufrieden. Es läuft alles rund und lässt sich intuitiv bedienen. Vorallem die Einkaufsliste ist Klasse.",
    name: "Marc A.", source: "Google Play", stars: 5, lang: "de", date: "2026-10-19" },
];
```

(The Kathii19866 text is a marked excerpt of a longer review — that "…" is intended. "Google Play user" is how Play
shows an anonymous reviewer.)

## Scope

- In: `site.config.mjs` (count, REVIEWS, its comment), `build.mjs` (optional title, `data-review`),
  `tools/check-build.mjs` §15, `static/assets/home.css` only if a title-less card needs a spacing fix (the stars →
  who-line gap), `README.md` only if it documents the review shape, this prompt file.
- Out: every `content/*.json` (no new strings), other sections, the RATING block, blog, help, legal, `deploy.sh`.
  The untracked `static/assets/img/photos/` is not yours — leave it alone and do not let it block step 0.

## Verify

`npm run build` green. In `dist/`: `index.html` and `de/index.html` show "2,000" / "2.000" in the members headline;
the `#reviews` section sits right after the "Made with care" section and holds 7 cards in the order above (×2 for the
loop, second set `aria-hidden`); the three Google Play cards have no `<b>`; each card's `<p>` carries its own `lang`.
Screenshot the reviews row at 1440 px and 390 px wide and look at it: cards line up, no card is much taller than the
rest, nothing overflows.

## Commit & push

`feat(home): real store reviews + 2,000+ members` — body `Prompt: claude-prompts/2026-11-03/001-reviews-and-member-count.md`.
Commit this prompt file with it. CHANGELOG: none (website, not the app). **Push. Do NOT run `./deploy.sh`.**

## Report

`claude-reports/2026-11-03/001-reviews-and-member-count.md` (file-write tool; `wc -c` > 0), a few lines: what changed,
the guard proof (red → green), the card heights you saw at 1440/390, the build line, SHA + push. `## Help impact`: none.
