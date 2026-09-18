# Post 18 — How to Export Your Cozi Calendar — `blocked`

**Not published. No files changed.** The hero image the recipe requires does not
exist, and the recipe says to stop rather than substitute anything. Ammar chose
`stop and report blocked` when asked.

## The blocker

`static/assets/img/blog/how-to-export-cozi-calendar.webp` — missing.

The draft's front-matter points at
`https://www.pexels.com/photo/a-person-using-a-laptop-in-an-office-8473781/`,
which nobody has downloaded yet. Per `BLOG-POST-TEMPLATE.md`: never substitute a
placeholder, never weaken the guard in section 11 that requires the file. So
`blog/how-to-export-cozi-calendar.en.html` was not written and `BLOG_POSTS` was
not touched.

**Open the Pexels page before converting**, per the hard-won note at the bottom
of the template: confirm the shot is landscape and that it actually shows a
person at a laptop. Two thumbnails in a contact sheet against its neighbours is
cheap insurance — the two posts either side of it are
`family-app-month-three-cleanup` (post 17) and whatever post 19 lands on, and
the alt text in the draft ("hands typing on a laptop at a white desk with
archive file boxes behind it") promises boxes that the photo may not contain.
**If the photo has no boxes, the alt text is wrong and I will fix it after
looking, not before.**

## The HOLD — postponed, not resolved

The prompt asked me to check with Ammar whether the free-Cozi-account test had
been run. **It has not.** Ammar's answer: *"i forgot to do that, lets postpone
it."*

So the two facts stay unverified:

1. Whether the free 30-day calendar limit also applies to the outbound iCal feed.
2. Whether recurring events come through the feed — as repeats, as individual
   dated copies, or not at all.

Nothing was invented and nothing was filled in. When this post does go out, the
FAQ answer stands exactly as drafted — *"Cozi's documentation does not say either
way, and we have not been able to confirm it"* — which the draft's own notes
call publishable, and which is better sourced than the nine competitor posts
that assert things nobody tested.

The check is still worth doing, on a throwaway free account: add an event two
months out and a weekly repeating event, copy the Cozi URL by the path in the
article, subscribe from Google Calendar on the web, and look.

## What is already verified, so it does not get re-checked later

- **All three internal links are live** in `site.config.mjs`:
  `switch-family-app-without-losing-lists`, `cozi-free-plan-what-you-get`,
  `nobody-uses-the-family-calendar-app`. All ✅ in the draft, none ⏳. Section 2
  of check-build will pass.
- **Slug is free.** `how-to-export-cozi-calendar` appears nowhere in
  `site.config.mjs`; no duplicate-slug guard to trip. Seventeen posts are
  currently published.
- **Outbound links** are the four cozi.com pages in the draft's notes.
  `mycozi.zendesk.com` is a 404 and is cited nowhere; no rival listicle is cited.
- Draft word count is ~1,490, so the rendered article should land within ~2% of
  that.

## To unblock

Drop the converted WebP at ~1200px wide into
`static/assets/img/blog/how-to-export-cozi-calendar.webp` and say so. The publish
is then a single pass: the body fragment, the `BLOG_POSTS` entry with `faq` and
`cta` from the draft, `npm run build`, the feed and index check, the 360px
light/dark look, and the real `imageWidth`/`imageHeight` measured off the file.

Nothing was committed and nothing was pushed.
