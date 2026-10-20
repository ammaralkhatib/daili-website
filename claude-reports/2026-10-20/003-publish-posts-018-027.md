# 003 — Publish blog posts 18–27

**Status:** done. Ten commits, one per post, pushed to `origin/main`. Not deployed.
I ran the 2026-09-11 prompts 001–010 in order, with this prompt's overrides. 002 had
already run (`82a263f`). Step 0 committed the pending planning docs first (`93a5317`).
All ten posts have `published` and `updated` set to **2026-10-20**.

| Post | Slug (= draft front-matter) | features | Words draft → page | Hero | SHA |
|---|---|---|---|---|---|
| 18 | how-to-export-cozi-calendar | calendar | 1018 → 1064 | 1200×800 | `3a94d4a` |
| 19 | cozi-30-day-calendar-limit | calendar | 922 → 969 | 1200×800 | `783a247` |
| 20 | what-to-look-for-family-app | family | 1068 → 1113 | **1200×900** | `ec436b5` |
| 21 | free-vs-paid-family-apps | family | 1032 → 1076 | 1200×800 | `dba3ffa` |
| 22 | move-family-recipes-to-new-app | recipes, meal-plan | 961 → 1007 | 1200×800 | `3da4cf7` |
| 23 | family-app-shutting-down | documents, family | 960 → 1004 | 1200×800 | `33d4ff5` |
| 24 | try-new-family-app-without-annoying-family | lists | 977 → 1031 | 1200×800 | `3664b2b` |
| 25 | family-app-data-when-acquired | family, documents | 1168 → 1216 | 1200×801 | `04c8bf6` |
| 26 | school-term-dates-family-calendar | calendar | 1091 → 1139 | 1200×801 | `992a7ef` |
| 27 | shared-calendar-wrong-time | calendar, birthdays | 1116 → 1160 | 1200×800 | `642d265` |

**Word counts.** Each page has about 44 words more than its draft. That is the fixed
template chrome (the newsletter box and the feature-CTA line from 002). Live posts
16 and 17 show the same gap (+50 and +44). With that taken off, every post is within
±4 words of its draft. Post 24 is +9 more, which is the longer sentence from the fix
below.

**Heroes.** All ten were measured with `sips`. Post 20's hero is **1200×900**, not
800/801 as this prompt said. Its draft front-matter already says 900, and that value
was used. I used the three corrected alt texts (21, 25, 26). The hero `.webp` is
committed in the same commit as its post.

## Post 24 fix
In the CTA, I replaced "notifications are off by default and set per person, so the
week-one mute problem does not start;" with "every kind of notification has its own
switch, set per person, so whoever hates pings can turn theirs down in week one
without muting anyone else;". The rest of the prose is unchanged.

## Holds and checks
- **18 + 19:** the HOLD stays, and both went out on the "If no" path. The text still
  says we could not confirm whether the feed passes 30 days or how recurring events
  come through.
- **19:** the Google Play listing was re-read today (updated 25 Sep 2026). It still
  says "access to add, edit and view events more than 30 days ahead". The draft
  paraphrases this without quotation marks, so nothing changed.
- **25:** all quotes were re-checked today against the original pages, and all are
  verbatim:
  - the Cozi (11 Jun 2026), OurFamilyWizard (7 Apr 2026), TimeTree (15 Jun 2026) and
    Google privacy-policy clauses
  - Recital 47 and Art. 6(1)(f) on EUR-Lex
  - the WP260 rev.01 fragments: "a change to the identity of the controller" is in
    para 29; "well in advance…" and "explicit and effective" are in para 30

  Nothing was cut. Note: the TimeTree URL from the notes is a country-chooser page,
  and the text itself is at `?country=other`. The link uses the URL from the notes.

## Links (only the prose that was turned into links changed)
- **External** (`rel="noopener"`): the sources from each draft's notes went on 18, 19,
  25 and 26. For 26 that is the KMK *page*, with no raw .ics link. 20–24 and 27 have
  no external links, as their drafts say.
- **Internal:** every ✅ link is in. Several anchor phrases in the notes appear only in
  the FAQ, which is plain text, or not at all. In those cases I linked the nearest
  phrase in the body to the same target. For example, in 18 "a family reverting on
  day three" became "leave it alive while the new app beds in".
- **⏳ made live:** post 20, question 12 → post 25, and post 23 "a bigger one buys a
  competitor and folds it in" → post 25. Both are in post 25's commit. No ⏳ to a
  published post is left in the ten drafts. Older drafts still have ⏳ marks, but none
  of them point at posts 18–27.
- **Table in 26:** it is in `table-wrap`. The empty corner cell is a `<td>`, and the
  draft's bold on the country names was dropped because a row `<th>` is already bold.

## Verify
- Build: `build OK · 3208 pages` (3198 + 10), and the detector is OK.
- `/blog/` lists 27 posts, and the feed has 27 `<item>`s. The sitemap has 28 `/blog/`
  URLs. There is no `hreflang` in the `<head>` of the new posts.
- `/features/calendar/` "From the blog" shows 19, 18 and 26. All ten posts share a
  date, so this is the build's tie-break. The "Keep reading" blocks pick up the new
  posts; for example, 24 shows 17 and 13.
- Posts 19, 24 and 27 at 360 px, light and dark, checked with CDP: `scrollWidth` is
  360 and nothing overflows. The hero loads, the body background follows the scheme,
  and the stills look right.
- Clusters after 18–27: cozi 8, adoption 6, documents 6, privacy 3, devices 4
  (27 posts).

## Push
Ran `git push origin main` once at the end, after this report was committed.
`./deploy.sh` was not run; Ammar deploys.

## Help impact
none
