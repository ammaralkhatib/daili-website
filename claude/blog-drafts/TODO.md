# Blog — everything Ammar has to open, copy or run

Updated 2026-09-11. **17 posts live** at https://daili.app/blog/.
Posts 18–27 are written and waiting.

---

## 0. 🔴 FIRST — the live sitemap has no blog in it

Your local build is correct (17 posts, 18 blog entries in the sitemap). The
**server** copy of `sitemap.xml` and `/blog/index.html` is stale — the post pages
are live but the index and the sitemap are not. Google discovers pages through
the sitemap, so six days of posts are currently invisible to it.

Run in the **daili-website repo**:

```
./deploy.sh
```

Then prove it landed — deploy success does not prove fresh files:

```
curl -s https://daili.app/sitemap.xml | grep -c "blog/"
```

Must print **18**. If it prints 0, deploy.sh is not uploading those two files and
that needs looking at before anything else.

Then submit `https://daili.app/sitemap.xml` in Search Console.

---

## 1. Nine images to download

Open → **Free Download** → **Large** → save into `static/assets/img/blog/` with
the number as the filename. Then tell me; I convert, check each by eye, and clear
the sources out.

**Post 20 needs no download** — its hero is already in place (reused from the
photo rejected for post 12).

| Save as | Post | Photo |
|---|---|---|
| `18.jpg` | 18 · export your Cozi calendar | https://www.pexels.com/photo/a-person-using-a-laptop-in-an-office-8473781/ |
| `19.jpg` | 19 · the 30-day limit | https://www.pexels.com/photo/close-up-photo-of-red-pins-on-a-calendar-9810172/ |
| `21.jpg` | 21 · free vs paid | https://www.pexels.com/photo/child-putting-coins-into-glass-jar-7118209/ |
| `22.jpg` | 22 · moving recipes | https://www.pexels.com/photo/woman-wearing-a-apron-writing-on-a-notebook-8715602/ |
| `23.jpg` | 23 · app shutting down | https://www.pexels.com/photo/wooden-sign-closed-hanging-in-shop-6931444/ |
| `24.jpg` | 24 · trying a new app | https://www.pexels.com/photo/woman-and-her-kids-looking-at-the-screen-of-a-cellphone-4908516/ |
| `25.jpg` | 25 · when an app is sold | https://www.pexels.com/photo/man-and-woman-shaking-hands-8112160/ |
| `26.jpg` | 26 · school term dates | https://www.pexels.com/photo/children-sitting-on-brown-chairs-inside-the-classroom-4019754/ |
| `27.jpg` | 27 · wrong time | https://www.pexels.com/photo/row-of-clocks-5158027/ |

All nine were verified landscape by opening each photo page and measuring the
real image, not by trusting the search text.

---

## 2. Ten prompts to run, in order

```
claude-prompts/2026-09-11/001-blog-post-018.md   export your Cozi calendar   🔴 HOLD
claude-prompts/2026-09-11/002-blog-post-019.md   the 30-day limit            🔴 HOLD
claude-prompts/2026-09-11/003-blog-post-020.md   what to look for
claude-prompts/2026-09-11/004-blog-post-021.md   free vs paid
claude-prompts/2026-09-11/005-blog-post-022.md   moving recipes
claude-prompts/2026-09-11/006-blog-post-023.md   app shutting down
claude-prompts/2026-09-11/007-blog-post-024.md   trying a new app
claude-prompts/2026-09-11/008-blog-post-025.md   when an app is sold
claude-prompts/2026-09-11/009-blog-post-026.md   school term dates
claude-prompts/2026-09-11/010-blog-post-027.md   wrong time
```

Order matters: 008 goes back and edits posts 20 and 23; 002 links to 018; 010
links to 026.

Then `./deploy.sh` once at the end, and re-run the curl check.

---

## 3. The Cozi check — 15 minutes, unblocks posts 18 and 19

Both are written and publishable without it, with an honest "we could not
confirm this". With it they are the best-sourced posts on the subject anywhere.

On a **free** Cozi account:
1. Add an event **two months** in the future, and a **weekly repeating** event.
2. **Settings → Shared Cozi Calendars →** set a member to Shared →
   **VIEW OR SEND COZI URL → COPY COZI URL**
3. Google Calendar on the web: **Other calendars → + → From URL**, paste.
4. Tell me: does that menu still look like that; does the two-month-out event
   appear; do the repeating events come through?

I cannot do this myself — creating an account and entering a password is
something I am not able to do. If you log in on your own machine I can drive the
clicks from there and read the screens.

---

## 4. Still open from earlier

- `claude-prompts/2026-09-05/016-redesign-fixups.md` — from the website redesign
  lane, never run. Not mine; worth a look, since a half-finished redesign on a
  live site is worse than either state.
- `claude-prompts/2026-09-10/001-site-shots-refresh-and-whats-new-1.4.0.md`
