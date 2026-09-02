# Post 4 — 7 Rules for a Shared Family Calendar (pillar C)

Live at `/blog/shared-family-calendar-rules/`. Commit `TBD`. Two files, exactly
as the recipe describes: the body fragment and one `BLOG_POSTS` entry. Nothing
in `build.mjs`, `style.css` or the guards needed touching — the first post in
this batch that the engine took without a change.

## The `BLOG_POSTS` entry

Appended after post 3, values verbatim from the draft's front-matter:

```js
slug:        'shared-family-calendar-rules'   // pillar — never change it
cluster:     'adoption'
title:       '7 Rules for a Shared Family Calendar That Everyone Follows'
h1:          '7 Rules for a Shared Family Calendar Everyone Actually Follows'
description: 'Most shared calendars fail on habits, not features. Seven house
              rules — who adds what, how far ahead, what a colour means — that
              keep a family calendar trusted.'
published:   '2026-09-05'   updated: '2026-09-05'
body:        'shared-family-calendar-rules.en.html'
image:       '/assets/img/blog/shared-family-calendar-rules.webp'
imageAlt:    'A large family gathered around a laid dinner table at home, one
              man talking to the group'
imageWidth:  1200   imageHeight: 801   // sips, not copied
faq:         [3 questions, verbatim from the draft]
cta:         { h2: 'What daili does with this', html: <2 paragraphs + the link> }
```

First post in the `adoption` cluster. `itemList` is **not** set — the seven
rules are norms, not a list of named things, and the draft says so.

Hero checked before shipping: landscape 1200×801, a family standing round a laid
dinner table with one man mid-sentence, and the alt text describes that rather
than the post. It does not resemble post 1's passports, post 2's ring binder or
post 3's notebook — and it is neither another grandparent shot nor another white
kitchen breakfast, which is what the template warns about for this slot.

## The seven rules are H2s

Ten `<h2>` in `.post`: `Rule 1:` … `Rule 7:`, "Put the rules where the family can
see them", "Frequently asked questions" and "What daili does with this". No
`<ol>` wrapping the rules, as the prompt requires — the numbering lives in the
heading text. The only list in the post is the three review questions under rule
7, which the draft has as a bullet list.

## Links — none, deliberately

**Zero `href` in the body fragment.** The only link on the rendered article is
the CTA's `/`. All four internal targets in the draft's publishing notes are
still ⏳:

| Where | Target | Status |
|---|---|---|
| Rule 3 | `/blog/get-partner-to-use-family-calendar` | not written |
| Rule 2 + FAQ | `/blog/nobody-uses-the-family-calendar-app` | post 7, this batch |
| Rule 7 | `/blog/family-app-month-three-cleanup` | not written |
| Rule 5 | `/blog/what-to-leave-with-a-babysitter/` | post 6, not live yet |

The draft marks rule 5's babysitter link ✅ *only once post 6 is live*; it is
not, so it is not here. No external links either — this post is experience, not
facts, and the draft is explicit that inventing a citation would be worse than
having none.

Rule 6's "some free plans limit how far ahead you can see" is left as a general
statement. It is the bridge to cluster B and it is true of Cozi's free tier, but
naming a competitor inside a rules post reads as an attack; the Cozi posts do
that job.

## Schema

Two JSON-LD blocks, in order: `Article` and `FAQPage`. No `HowTo` — a set of
household norms is not a sequence of steps — and no `ItemList`. FAQ parity holds
exactly: the three visible `<h3>` strings and the three `mainEntity[].name`
strings compare equal, which is the whole reason `faq` lives only in
`BLOG_POSTS`.

## Guards

`npm run build` clean: `built 59 pages · blog: 4 post(s) · build OK · 59 pages ·
52 in hreflang clusters · detector OK · 32 cases`. The 10 content warnings are
the pre-existing translation length ratios, untouched.

On the new post: one `<h1>`; canonical
`https://daili.app/blog/shared-family-calendar-rules/`; **0 `hreflang` in the
`<head>`**; its own description and `og` hero; FAQ parity; hero file present; no
duplicate slug; in the sitemap (57 entries) with no `xhtml:link` alternates.

Index and feed both sorted newest-first off `published`, new post at the top:
`shared-family-calendar-rules` (5 Sep) → `family-document-checklist` (4 Sep) →
`digital-family-emergency-binder` (3 Sep) →
`where-to-store-important-family-documents` (2 Sep).

## Word count

Draft article (front-matter and publishing notes excluded; H1, FAQ and CTA
included, markdown emphasis and link syntax stripped) 1,355 words · rendered
`<article>` 1,347 · **−8 (−0.6%)**. A punctuation-insensitive word-level diff of
the draft against the rendered text finds **one** difference in the whole
article: the front-matter's `published` line versus the rendered byline
"Ammar Khatib · 5 September 2026". Every other word matches, in order.

## Prose changes

**None.** Mechanical conversion only: `**` → `<strong>`, `*app*` and `*should*`
→ `<em>`, paragraphs unwrapped from the draft's 79-column lines, the three
review questions → `<ul>`/`<li>`. Straight quotes, the en dash in
"4–5.30pm" and the em dashes are the draft's own characters, copied through.

## Browser

360px, light and dark, via `Emulation.setDeviceMetricsOverride` over CDP — the
plain `--window-size=360` screenshot is a crop of a wider layout on macOS, the
same trap posts 2 and 3 recorded, and post 1 crops identically under it, so it
is the harness and not the page.

Measured on the post: `innerWidth` 360, `documentElement.scrollWidth` 360, and
**no element inside `.post`** extends past the viewport. Dark: `--paper`
resolves to `#0E1512` and the prose to `rgb(201,214,206)`; light is `#FCFAF4`
and `rgb(42,56,48)`. The post carries no colour rule of its own — it inherits
the tokens, as posts 1–3 do. The long rule headings wrap to two lines at 360
("Rule 4: Colours mean people, / not categories") with no clipping.

`shots/003-post4-360.png`, `shots/003-post4-360-dark.png`,
`shots/003-post4-360-dark-cta.png`.

## Follow-up

- **Post 7 is this one's pair.** When
  `/blog/nobody-uses-the-family-calendar-app/` publishes, come back and add the
  two links the draft marks for it (rule 2 and the "refuses to use it" FAQ).
- Rule 5's babysitter link goes in when post 6 is live.
- `./deploy.sh` — Ammar deploys.
