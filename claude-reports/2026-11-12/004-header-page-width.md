# 004 — The header bar takes the page width

Prompt: `claude-prompts/2026-11-12/004-header-page-width.md`
Commits: `ee7dd6b8` (docs: report 003, this prompt) and `864132ad` style(site): header bar spans the page width.
Both pushed to `main`. `./deploy.sh` was not run. `static/assets/img/photos/` was not staged.

## The rule
Two tokens decide the page width: `--page-max` (content width) and `--page-gutter` (the gap at each side on a
narrow window).
- `style.css`: `:root{--page-max:1076px;--page-gutter:22px}`. `.wrap` reads them
  (`max-width:calc(var(--page-max) + 2*var(--page-gutter));padding-inline:var(--page-gutter)`), so other pages
  look the same as before.
- `home.css`: `html.landing{--page-max:1240px;--page-gutter:24px}`. `.home .wrap` reads them
  (`width:min(var(--page-max),calc(100% - 2*var(--page-gutter)))`), so the home and feature pages look the same as before.
- `.nav`: `width:min(var(--page-max),calc(100% - 2*var(--page-gutter)))` instead of `max-content`. From 861px up,
  `.links{margin-inline-start:auto}` puts the logo at the start and pushes the links, the language picker and
  "Download app" together to the end. The pill look and the order of the items are unchanged.
- From 860px down, nothing changed: the phone rule still sets `width:auto;max-width:none;margin-inline:12px`.

## One change on the home and feature pages (asked first)
The prompt asked for three things that could not all be true there. Their content was 1240px wide, but the
footer used style.css's `.wrap` and was only 1076px (at 1440px: content 100–1340, footer 182–1258). So the
header could not line up with both the content and the footer, and the footer also had to stay as it was.
I asked, and you chose to widen the home footer. Because the tokens are set on `html.landing`, the footer on
those pages now has the same 1240px / 24px edges as their content and the header. The footer looks the same
otherwise. On every other page the footer did not change at all.

## Measured edges (header left–right / footer content left–right, px)
The footer content is the footer `.wrap` minus its padding. The same numbers held for the page's `main .wrap`
where a page has one (home, wall display, ar).

| page | 1440 | 1280 | 1100 | 900 | 390 (phone) |
|---|---|---|---|---|---|
| `/` | 100–1340 / 100–1340 | 24–1256 / 24–1256 | 24–1076 / 24–1076 | 24–876 / 24–876 | 12–378 / 24–366 |
| `/features/habits/` | 100–1340 / 100–1340 | 24–1256 / 24–1256 | 24–1076 / 24–1076 | 24–876 / 24–876 | 12–378 / 24–366 |
| `/help/` | 182–1258 / 182–1258 | 102–1178 / 102–1178 | 22–1078 / 22–1078 | 22–878 / 22–878 | 12–378 / 22–368 |
| `/wall-display/` | 182–1258 / 182–1258 | 102–1178 / 102–1178 | 22–1078 / 22–1078 | 22–878 / 22–878 | 12–378 / 22–368 |
| `/blog/` | 182–1258 / 182–1258 | 102–1178 / 102–1178 | 22–1078 / 22–1078 | 22–878 / 22–878 | 12–378 / 22–368 |
| `/privacy.html` | 182–1258 / 182–1258 | 102–1178 / 102–1178 | 22–1078 / 22–1078 | 22–878 / 22–878 | 12–378 / 22–368 |
| `/ar/` | 100–1340 / 100–1340 | 24–1256 / 24–1256 | 24–1076 / 24–1076 | 24–876 / 24–876 | 12–378 / 24–366 |

The edges differ by 0px at every width from 900 up. At 390 the phone header is the same as before
(12–378, burger layout). The page never scrolls sideways (`scrollWidth` = window width in every row).
`/ar/`: the logo is at the right (1173–1241 at 1280) and "Download app" at the left (32–144). The edges still
line up.

## 861–1080px
I didn't have to change this rule. I checked all 28 home pages, plus the Ukrainian and Romanian privacy pages,
German support/help/Datenschutz and the Ukrainian habits page, at 861, 1080 and 1081px. The header and footer
edges were equal everywhere, nothing wrapped, nothing overlapped, all items stayed inside the pill on one line,
and nothing scrolled sideways. The tightest case is Ukrainian at 861px, with about 128px of space left between
the logo and the first link.

## Menus
Both menus open under their own button and inside the window (left–right, px):
- **Language list:** ends at the button's end edge. `/` at 1440: 619–1179, button 1114–1179. `/privacy.html` at
  1100: 357–917. `/help/` at 900: 187–747. In `/ar/` at 1280 it starts at the button: 150–710, button 150–215.
- **Download menu:** ends at the "Download app" end edge. `/` at 1440: 1082–1332, button 1185–1332. In `/ar/` at
  1280: 32–282, button 32–144.

## What I looked at
Headless Chrome over CDP, serving `dist/`, reading `getBoundingClientRect()`. I looked at screenshots of: home
light 1440, privacy dark 1280, `/ar/` 1280 (the home pages have no dark mode, so it is light), privacy 1100
with the download menu open, and home at 390.

## Build
`npm run build` passes (`build OK · 3634 pages`, detector OK, help search OK).

## Help impact
None.
