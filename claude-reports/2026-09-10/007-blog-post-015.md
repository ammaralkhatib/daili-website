# Post 15 — Family Organiser Apps and GDPR

Live at `/blog/family-organiser-apps-gdpr/`, published `2026-09-16`. Commit `c8e97d4`. Two files as
the recipe describes. Fourth post in the `privacy` cluster and post 9's spoke.

## 🔴 1. The article numbers, checked at the canonical text

Not against the draft's note, and not from memory. I pulled the full consolidated
text from `https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32016R0679`
(809 KB, the same instrument the ELI link in the post resolves to) and read the
headings out of it:

| Post says | EUR-Lex heading | |
|---|---|---|
| Access (Article 15) | Right of access by the data subject | ✅ |
| Rectification (Article 16) | Right to rectification | ✅ |
| Erasure (Article 17) | Right to erasure ('right to be forgotten') | ✅ |
| Restriction (Article 18) | Right to restriction of processing | ✅ |
| Portability (Article 20) | Right to data portability | ✅ |
| Objection (Article 21) | Right to object | ✅ |
| Article 8 = children's consent | Conditions applicable to child's consent in relation to information society services | ✅ |

**Article 8(1) verbatim**, which is the one the post makes claims about:

> Where point (a) of Article 6(1) applies, in relation to the offer of
> information society services directly to a child, the processing of the
> personal data of a child shall be lawful where the child is at least 16 years
> old. […] Member States may provide by law for a lower age for those purposes
> provided that such lower age is not below 13 years.

So all three of the post's precision points hold: **16 default**, **never below
13**, and the two caveats — that Article 8 bites only where *consent* is the
legal basis (it opens on point (a) of Article 6(1), which is consent), and that
it is about services offered *directly to a child*.

I also checked the one factual deadline in "The test", since it is the sentence a
reader will act on. Article 12(3): *"without undue delay and in any event within
one month of receipt of the request. That period may be extended by two further
months …"* — the post's "within one month, extendable in complex cases if they
tell you" is right, including the "if they tell you", which is Article 12(3)'s
requirement to inform within the first month.

Article 20's "structured, commonly used and machine-readable format" matches too.

**Nothing needed correcting.** Every number in the draft was already right.

## 🔴 2. Disclaimer above the fold

Third paragraph of the article, immediately under the two-paragraph intro,
italicised, before the first `<h2>`. At 360×780 it starts inside the first
viewport — visible without scrolling on a phone, not merely "early in the page".

## 🔴 3. gdpr-info.eu does not appear

0 occurrences anywhere in the built page. The two external links are both
official, both `rel="noopener"`, and both return 200:

- `https://commission.europa.eu/law/law-topic/data-protection/information-individuals_en`
  on "a set of rights over data held about them"
- `https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng` on "Article 8"

## 🔴 4. The "EU-hosted" section and the Firebase caveat

Both intact. The section is in the body in full, and the CTA still reads
"**Firebase** (Google) handles sign-in and push notifications and processes
limited technical data, such as device tokens, outside the EU under standard
contractual clauses" — in the same paragraph as "Germany, with Host Europe
GmbH", not relegated below it.

I added a comment above the `cta` in `site.config.mjs` saying why it must not be
trimmed, because the next person editing that file will see a long CTA and no
reason not to shorten it.

## Links

Three internal, all live:

| Anchor | Target |
|---|---|
| That is a category of data worth being deliberate about | `/blog/family-app-children-data/` |
| leaving an app does not have to mean starting from nothing | `/blog/switch-family-app-without-losing-lists/` |
| children's schedule | `/blog/teenagers-private-events-family-calendar/` |

The draft's note puts the post-9 link "in the intro". I moved it one paragraph
later, into "Why this matters more for a family app", onto the sentence that
follows the list of what a family app knows about a child — because that is the
sentence post 9 answers, and the intro's own sentences are all about *this*
post. Say if you want it higher.

No ⏳ links left on this post. Post 9's ⏳ pointing *here* is added in the next
commit.

## Prose and hero

Prose unchanged. Rendered article **1,149** words against the draft's **1,150** —
**−0.09%**.

Hero: 1200×895, 38 KB, landscape, a woman reading printed papers with a laptop
open in front of her. Real papers and a real laptop on an article about reading
policies and making a written request — it fits. Cool blue-grey kitchen, which
separates it cleanly from post 14's warm interior the day before.

**Alt text adjusted**, as on post 14: the draft said "at a desk", and the photo
is a wooden table in a kitchen, with cabinets and a microwave behind her.
Shipped as *"A woman reading printed papers beside an open laptop at a kitchen
table"*. Everything else in the front matter is verbatim.

## Guards

`npm run build` clean — `built 132 pages · 130 sitemap entries` ·
`blog: 15 post(s)` · `build OK` · `detector OK`.

On the new post: one `<h1>`; own canonical and description; **0 hreflang in the
`<head>`**; `og:type article` with its own hero; three FAQ questions visible and
in the FAQPage JSON-LD; hero exists and is referenced; in the sitemap with no
`xhtml:link`; no duplicate slug. JSON-LD: Article 1 · FAQPage 1 · WebPage 1 ·
Organization 1 · Person 1 · ImageObject 1 · Question 3 · Answer 3 — Article +
FAQPage, as the draft specifies.

On `/blog/`, one `<item>` in the feed, one `<loc>` in the sitemap.

## Browser — 360px, light and dark

`rgb(251,249,242)` light, `rgb(14,23,18)` dark. `scrollWidth` 360 against
`clientWidth` 360 in both, nothing inside `#main` past 360px, page height 6,465
CSS px identical in both schemes. The two `<ul>`s and the numbered `<ol>` in
"The test" all sit inside the gutter; the `<ol>` uses the plain house style, not
`doc-checklist`, because this post declares no `itemList`.

`shots/007-post15-360-top.png`, `-top-dark.png`, `-mid.png`, `-mid-dark.png`,
`-faq.png`, `-faq-dark.png`.
