# Publish blog posts 18–27 (the ten waiting since 2026-09-11)

## Goal
Ten posts are written and have publish prompts, but were never run. Run them
now, in one sitting, with the overrides below. Run **after** prompt
`2026-10-20/002-blog-feature-links.md` (this prompt uses its `features`
field). If 002 has not run, stop and report `blocked`.

## How
Run `claude-prompts/2026-09-11/001` … `010` **in order** (order matters:
008 edits posts 20 and 23, 002 links to 018, 010 links to 026). Each one
follows `BLOG-POST-TEMPLATE.md` and its own "Specific" notes — **except where
this file says otherwise. This file wins.**

## Overrides
1. **Dates.** Every post's `published` and `updated` = **the day you run
   this** (all ten the same date). The September dates in the drafts and
   prompts are stale. Never backdate a post.
2. **Heroes — already in place** (converted and checked by eye by Planning
   Claude 2026-10-20): `static/assets/img/blog/<slug>.webp`, all 1200 × 800
   or 1200 × 801, landscape. Measure `imageWidth`/`imageHeight` from the real
   file. They are untracked on purpose (they do NOT block step 0): commit
   each hero together with its post. Any missing → stop at that post,
   report `blocked`. Three alt texts
   in the drafts do not match the real photo — use these instead:
   - 21: `A child sitting on a wooden floor with a glass jar and coins scattered around`
   - 25: `A couple shaking hands with a man in a suit across a desk with papers on it`
   - 26: `Children at desks in a bright primary classroom, a teacher bending over to help one of them`
3. **Posts 18 + 19 (HOLD).** The free-Cozi-account check was **not** done.
   Take the "If no" path in 001/002: publish as written with the honest
   "we could not confirm this". Do not invent either answer. (Cozi's plans
   were re-checked 2026-10-20: Free / Gold $39/yr / Max $79/yr, and the
   compare page still names no 30-day cap — the drafts' facts hold.)
4. **Post 24 — one false claim, fix it.** In "What daili does with this" the
   draft says notifications are "off by default". They are not: every
   activity push defaults ON (api migration
   `2026_08_12_110000_add_activity_notification_toggles_to_users_table.php`).
   Replace exactly
   `notifications are off by default and set per person, so the week-one mute problem does not start;`
   with
   `every kind of notification has its own switch, set per person, so whoever hates pings can turn theirs down in week one without muting anyone else;`
   Nothing else in the prose changes. Name this change in the report.
5. **`features` field** (from prompt 002; first = primary):

   | Post | Slug | features |
   |---|---|---|
   | 18 | how-to-export-cozi-calendar | calendar |
   | 19 | cozi-30-day-calendar-limit | calendar |
   | 20 | what-to-look-for-family-app | family |
   | 21 | free-vs-paid-family-apps | family |
   | 22 | move-family-recipes-to-new-app | recipes, meal-plan |
   | 23 | family-app-shutting-down | documents, family |
   | 24 | try-new-family-app-without-annoying-family | lists |
   | 25 | family-app-data-when-acquired | family, documents |
   | 26 | school-term-dates-family-calendar | calendar |
   | 27 | shared-calendar-wrong-time | calendar, birthdays |

   Use the slug from each draft's front-matter if it differs from this
   table, and say so.
6. **⏳ internal links.** Every ⏳ link whose target is now published becomes
   live (that is the point of running them together). After all ten, grep
   the ten drafts' publishing notes: no ⏳ link to a published post may stay
   missing.
7. **Report.** ONE report for all ten (below), not ten.

## Verify
After all ten: `npm run build` green; `/blog/` lists **27** posts; the feed
has 27 items; `/usr/bin/grep -c "/blog/" dist/sitemap.xml` counts 28 blog
URLs (27 posts + index); word count per post within ~2 % of its draft;
spot-check posts 19, 24 and 27 at 360 px, light + dark; the new
"Keep reading" and feature-page blocks from 002 pick up the new posts
(`/features/calendar/` shows 3 of posts 18/19/26/27).

## Commit & push
One commit per post: `feat(blog): post NN — <short title>`; body
`Prompt: claude-prompts/2026-10-20/003-publish-posts-018-027.md` (+ the
2026-09-11 prompt it ran). **Push once at the end. Do NOT run
`./deploy.sh`** — Ammar deploys.

## Report
`claude-reports/2026-10-20/003-publish-posts-018-027.md`, half a page: a
10-row table (post, slug, words draft→page, hero size, SHA), the post-24
fix, ⏳ links made live, build + sitemap counts, push result.
`## Help impact`: none.
