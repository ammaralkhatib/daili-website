# 005 — Home: real Apple Watch screens + six new FAQ answers

**Status: DONE** · commit `e7852a2` on main, pushed (this report is the commit after it). `./deploy.sh` not run.
No planning docs were pending at the start: this prompt was already in `ba187a9`. `claude-prompts/2026-10-22/006-help-search-pricing.md` appeared during the run. It is not mine, so I left it uncommitted.

## Files added
**125 webp** (5 screens × 25 locales), 320 × 382, **593 KB total**, largest 7.0 KB. They are in `static/assets/img/shots/<loc>/shot-watch-{upnext,shopping,todos,habits,note}.webp`.
- They are made by the shot tool: `python3 tools/make-site-shots.py --watch`. It reads `../store-listings/watch-shots/<store-locale>/` through `SHOT_LOCALE`.
- The new map `WATCH_SHOT_SOURCES` in `site.config.mjs` says which raw file becomes which site picture, so a re-run makes them again. `IMAGE_SIZES['shot-watch-']` holds their size.
- ru, hi and ar fall back to English. check-build's "screenshots are the page's language" rule now covers the watch screens too.

## The watch
- **Face ratio.** The old case (`.83` with 6.5 % padding) gave a face of `.81`, but the screenshots are `.839`. With "cover" the date at the top would have been cut off. So the face now has the screenshot's exact ratio (416/496) and the case grows round it (about `.86`). Measured: the picture is exactly the face size at every width (158.9 × 181.4 hero, 130.6 × 155.7 bento). There is no stretch and no black bars. One corner radius rounds the face.
- **Hero watch:** Up next, still. It is loaded with the page.
- **Bento watch:** Up next → Shopping → To-dos → Habits → Quick note, 2.5 s each. The next screen slides up into the face while the old one slides out at the top (0.45 s, ease-out), like turning the crown.
  - It only runs while the card is on screen and the tab is visible. It stops when you scroll away (checked at every width).
  - A screen that has not loaded yet is waited for; one that failed to load is skipped.
  - Screens 2–5 are `data-src` only. They load when the card is 3 screens away. At the top of the page only `shot-watch-upnext` is requested (checked).
  - With reduced motion or no JS, Up next stays still (checked).
- **Bento card text** is the new sentence. It is longer, so the watch moved down 40 px (`top: 270px`). Before that, the band covered the last line in de and id at 1440. Now there are at least 16 px of clear space in all 28 locales at 1440, 1100, 900, 768 and 390 (measured).
- The drawn-face strings `home.watch.*` (upNext, ev, evs, list) and their CSS are removed in all locales. Nothing else used them.

## FAQ: sentences I changed so they are true
I checked each answer against the help article.
- **Invite:** "tap Invite members" → **Invite member** (the button name in `family/invite`). "whoever gets it joins" → "each code lets one person join" (the help says: "Each code works for one person"). "child profile" → "add them with **Add child**" (the real button, `family/children`).
- **Private:** "make an event private, or set a list or a to-do to Only me" → the real switch names: **Private event** (event), **Only me** (list), **Private task** (to-do), from `calendar/private`, `lists/edit-list` and `lists/assign`. I linked `calendar-private`.
- **Budget/Cycle:** "it stays on your phone" → "on your phone **and its backup**" (`cycle/privacy`: "stays on this phone and its backup"). I linked `budget-start`.
- **Delete account:** "open Profile" → "open **Settings**, tap your name, then **Delete account**". "just sign in again" → "sign in and tap **Restore my account**". "download a copy" → "Tap **Download my data**" (`account/delete`, `account/download-data`).
- Watch, groups and the phones line were already true as written.

**Links:** every new answer ends with `<a {help:<article id>}>More in Help</a>`. `{aiHelp}` became the general `{help:anywhere-ai-apps}`. `build.mjs` fills any `{help:id}`, and an unknown or not-yet-live id stops the build. `check-content` placeholder parity now understands `{help:…}`. Checked: en, de and ja link to their own help article; ru links to the English one with `hreflang="en"`. The FAQ has **15 items** and the FAQPage JSON-LD has **15**.

## Translations
**28 locales × 8 strings**: `home.screens.watch.p`, the changed phones answer, and 6 new q+a. UI names come from each locale's help articles and the ARB files; ru, hi and ar use their own natural words. Things to know:
- zh-Hans and th now write "QR 码" / "QR โค้ด", because the prompt says to keep "QR". The app says 二维码 / คิวอาร์โค้ด. This is a one-word change if you prefer the app's word.
- fr and cs follow the site's "vous"/"vy", not the help's "tu"/"ty".

## Build
```
content OK · 28 locale(s) · 519 keys each
legal OK · 2 document(s) × 28 locale(s)
build OK · 3233 pages · 3203 in hreflang clusters
detector OK · 32 cases · 28 locale(s) built
```
There are 5 new length-ratio warnings (short questions in pl, cs, fi and sk, such as "Jak usunąć konto?"). They are warnings, not errors.
I looked at en, de, ja, ru and ar at 1440, 768 and 390. The browser check ran as one foreground script in `/tmp`; no server or Chrome is left running.

## Help impact
none
