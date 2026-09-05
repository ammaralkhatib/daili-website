# Post 9 — Where Does Your Family App Store Your Children's Data? (PILLAR D)

Live at `/blog/family-app-children-data/`. Commit `fab34a8`. Two files as the
recipe describes, **plus one deliberate edit to post 8** (its ⏳ link to here),
which the prompt asked for. First post in the `privacy` cluster and its pillar,
so the slug is now fixed.

**This report leads with what I found wrong in the draft, because on this post
that is the report.**

## 🔴 The CTA said daili is a paid app. It is not.

The draft's funding line read:

> **Funding:** paid app, no ads, no advertising networks, no analytics on this
> website — no cookies either.

**Daili is free and has no paid tier.** Two places in your own repo say so:

- `content/en.json` → `pricing.h2` is *"Free — and free for you, forever"*,
  `pricing.lead` is *"Daili costs nothing today."*
- The landing FAQ answer: *"Nothing. Daili 1.0 is free — no ads, no data
  selling. If we ever add paid extras, everything that is free today stays
  free."*

It also is not checkable against `/privacy.html` in either direction — the
policy says nothing about price. That alone breaks the prompt's 🔴 rule.

**Why this was worth stopping for rather than shipping with a footnote.** This
post's question 2 says *"If an app is free and has no paid tier, something else
is paying"* and *"An app with no way to pay has only one business model left."*
Daili is, today, exactly that app. The false line was the only thing making
daili pass its own test — a post that sets a standard and then quietly exempts
itself is worse than not writing it.

Ammar chose the version that answers question 2 head-on, and that is what
shipped:

> **Funding:** free today, with no ads, no advertising networks, no data sold,
> and no analytics on this website — no cookies either. By our own question 2
> that should make you suspicious, so: daili is free because it is new and
> small, and if we ever add paid extras, everything free today stays free for
> the people already here.

Every clause traces to something written down: *no ads / no data sold* to the
policy's opening line and §3, *no analytics on this website — no cookies* to §2,
*free today* and the paid-extras promise to `content/en.json`'s pricing points.

## Every other CTA line, checked against `/privacy.html`

| CTA claim | Source | Verdict |
|---|---|---|
| Server: Germany, with Host Europe GmbH | §4 *"hosted by Host Europe GmbH in the European Union (Germany)"* | ✅ exact |
| Firebase processes device tokens outside the EU under SCCs | §4 *"Google may process limited technical data (such as device tokens) on servers outside the EU under the EU standard contractual clauses"* | ✅ exact |
| Deletion: 30-day grace, then hard delete | §5 *"deactivated immediately, kept for a 30-day grace period … then permanently deleted"* | ✅ exact |
| Vault stored on your device only, never uploaded, not in any backup | §3 *"stored only on your device. They are never uploaded to our servers and are not part of any backup we hold."* | ✅ exact |
| Export exists | §5 *"You can export your data as a file in the app at any time (Settings → Data export)"* | ✅ claim true, **wording note below** |

**The Firebase sentence sits immediately beside "Germany", in the same
paragraph, as the prompt required.** Screenshot: `shots/008-post9-360-cta.png`.
Nothing in that box reads "EU-hosted" on its own.

**Two wording changes, both approved before shipping:**

1. *"Firebase (Google) handles sign-in"* → *"handles **Google and Apple**
   sign-in"*. §3 ties Firebase Authentication only to social sign-in
   (*"If you choose social sign-in, authentication runs through Firebase
   Authentication"*); the policy never says Firebase handles password sign-in.
   The draft overstated Google's role in daili's own favour-neutral direction,
   but on this post an unverifiable line is an unverifiable line.
2. *"Six searches"* → *"**Seven** searches"* in the ten-minute checklist. The
   list is *server, hosted, advertis, third party, delete, export, child* —
   seven terms. Arithmetic slip in the draft.

**One I did not change and you may want to.** *"**Export:** there is a data
export endpoint."* The claim is true, but "endpoint" is developer language and
the policy describes something more useful to a reader: an export button at
**Settings → Data export**. Naming the path would make it checkable by the
reader in the app, which is the standard the rest of the box holds to. Your
call; it is one line.

## The Google account-age facts

**Not extended, not touched.** Only the three the draft cites appear: default
13, Austria 14, Germany 16, in one sentence in question 5. No fourth country was
added and nothing was inferred from memory.

## The external link — European Commission, and it actually supports the claim

One external link, `rel="noopener"`:

> **How to find it:** … <a>Under EU law a response is due within one month</a>.

→ `https://commission.europa.eu/law/law-topic/data-protection/information-individuals_en`

I fetched the page rather than assuming. It returns **200 with no redirect**,
and it states, in those words: *"The company or organisation must respond to
your requests without undue delay and at the latest within 1 month."* So the
anchor is a citation that a reader can check in one click, not decoration.

**gdpr-info.eu is not linked anywhere.** `grep -c 'href="http'` on the body
fragment → 1, and that one is the Commission.

## The edit to post 8 — deliberate

`blog/documents-to-keep-on-your-phone.en.html:79`, the camera-roll section's
fourth bullet. No words changed; existing text wrapped in an anchor:

> **They are mixed in with everything else.** Handing your phone to a nurse so
> she can read a number should not mean <ins>a swipe away from your private
> life</ins>.

That clause is the bridge to this post — post 9 is about who else can see the
family's private information — so the anchor describes the destination rather
than saying "read more". `shots/008-post8-360-post9-link.png`.

Post 8 now carries four internal links plus its CTA, and its ⏳ list is empty.

## Prose fidelity — measured

Same method as posts 7 and 8. **Four differences, three of them punctuation
splitting off a word at a tag boundary** (`goes` + `.`, `month` + `.`,
`device"` + `.`, `child` + `.`), **plus the one approved word change**
`Six` → `Seven`. Body: 833 draft words against 837 in the fragment, and the +4
is exactly those four splits.

Tone was left alone. The FAQ's calibration sentence — *"Most are, in the
ordinary sense that they are not doing anything sinister"* — is intact and
first in the FAQ, so the post does not open its Q&A by frightening anyone.

## Word count

| | words |
|---|---|
| Body fragment vs draft body | 837 vs 833 — **word-for-word identical** |
| Draft CTA | 129 |
| Shipped CTA | 180 |
| Rendered article total | 1,192 |

**The usual ~2% rule does not apply to this post and should not be read as a
failure.** The article came out +3.1% against the draft, and all of it is the
CTA you approved rewriting (+51 words) plus the byline. The prose the reader
came for is unchanged.

## Guards

`npm run build` clean: **64 pages, 9 posts, 62 sitemap entries**, detector 32
cases. Only the ten pre-existing translation length-ratio warnings.

| Check | Result |
|---|---|
| `<h1>` count | 1 |
| canonical | `https://daili.app/blog/family-app-children-data/` |
| hreflang **in `<head>`** | 0 |
| og:image | the post's own hero |
| FAQ parity | 3 questions, visible **and** in FAQPage JSON-LD, byte-identical |
| JSON-LD | Article + FAQPage, both parse |
| internal links resolve | `/privacy.html` exists in `dist` (English is `/privacy.html`, German is `/datenschutz.html` — the English post correctly uses the former) |
| hero file | present, 1200×800 measured |
| sitemap | 1 entry |
| `/blog/` index and `feed.xml` | card and `<item>` present, `Thu, 10 Sep 2026` |

## Browser — 360px, light and dark

Chrome 152 headless over CDP, 360 CSS px at DPR 2, `prefers-color-scheme`
forced. Both schemes applied — `rgb(252,250,244)` light, `rgb(14,21,18)` dark.
**`scrollWidth` 360 against `clientWidth` 360 in both.** The CTA is the tallest
box on the blog now (935 CSS px at 360) and it still does not overflow.

`shots/008-post9-360.png`, `-dark.png`, `-cta.png`, `-dark-cta.png`,
`-ec-link.png`, and `008-post8-360-post9-link.png`.

## Hero — and an alt-text fix

Opened the `.webp`. Landscape 1200×800, and it is a **crop**: an adult in a
white long-sleeved top and grey leggings sits beside a smiling boy in a white
t-shirt and dark jeans who is holding a dark tablet and a white stylus. Warm
beige wall behind, woven cushion at the right edge. **The adult's head is above
the frame** — you never see a face.

The draft's alt text was *"A mother sitting beside her young son on a sofa
while he uses a tablet."* **I changed it to "A woman sitting beside her young
son while he uses a tablet"** — the recipe says to fix alt text after looking,
and there is no sofa in the picture. What they are sitting on has a wooden rail
along the bottom edge and reads as a bench or window seat; rather than swap one
guess for another I dropped the clause. "Woman" and "son" are kept because the
Pexels page itself titles the photo *unrecognizable woman with son*.

Against its neighbours: post 7 is a wide frame of a weary mother at a laptop,
post 8 a tight portrait of a woman on the phone. This is a headless
mid-body crop of two people with a tablet. Three parent-and-screen photos in
three days is a theme, but the framings are genuinely different — wide, tight
portrait, cropped torso — and no face repeats. It reads fine on the index.

## Still open from earlier posts

- Post 4's FAQ link to post 7 still needs your decision on the `{{ .a }}`
  escaping (report 006, section 1).
- Post 4 still owes its rule-5 ✅ link to post 6.
