# Report 003 — Norwegian help says "KI", refreshed calendar-photo picture

**Commit:** `0b0fcb7` docs(help): Norwegian uses KI; refreshed calendar-photo picture — pushed to `origin/main`.
(Step 0: `9374e7f` committed the prompt file.)

## Files changed
- `help/nb/calendar/photo.md` — "Googles AI" → "Googles KI" (1 spot)
- `help/nb/meals/photo.md` — "Googles AI" → "Googles KI" (1 spot)
- `help/nb/meals/suggest.md` — "Googles AI" → "Googles KI", "AI-lesingene" → "KI-lesingene" (2 spots)
- `static/help/media/en/calendar-photo.webp` — the re-shot picture (18118 → 17992 bytes)

`grep -rnw AI help/nb` found nothing else, and it's clean now. "Google Gemini" is unchanged.
`translatedFrom` wasn't touched. Under HELP-TRANSLATION-RULES it equals the English `updated`, and English didn't change.

## Build
- `npm run build`: green. `build OK · 2034 pages · 2014 in hreflang clusters`, `detector OK · 32 cases · 28 locale(s) built`, every help locale `0 picture(s) in English`.
- `node tools/check-help.mjs`: exit 0. `help OK · 71 article(s) · 25 locales · 62 app routes checked`. The same 5 articles are still waiting for a picture (anywhere-widgets, anywhere-widgets-settings, anywhere-web, anywhere-wall, account-tips).

I didn't touch the untracked blog/photo images.
