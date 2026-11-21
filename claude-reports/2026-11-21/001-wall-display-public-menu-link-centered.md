# 001 — Wall display guide goes public: menu link in the header, menu in the middle

**Result:** done · **Commit:** `de29a6cb` feat(wall): public wall display guide + header menu link, centred menu — pushed to origin/main together with this report. `./deploy.sh` was NOT run (Ammar's step).
**Step 0:** `9caf4d16` docs(plan): sync planning docs (this prompt file), pushed. No commits were held. `static/assets/img/photos/` stayed untouched and unstaged, as in earlier runs.
No sub-agents were used. No `CHANGELOG.md` exists in this repo, so there is no changelog line.

## What changed, in plain words
1. **Public.** `site.config.mjs`: `WALL_GUIDE_PUBLIC = true`, doc comment rewritten (public since 2026-11-21, Ammar; English only; linked from the header menu; `false` hides it again). In `dist/`: `wall-display/index.html` has no `noindex` (no robots tag at all), and `sitemap.xml` lists `https://daili.app/wall-display/` with priority 0.6.
2. **Menu link.** `templates/layout.html`: a new `<a class="nl">` after "Watch & widgets", before "Blog". Its attributes come from a new page value `wallLinkAttrs` in `build.mjs` (same pattern as the Blog link's `blogLinkAttrs`): `href="/wall-display/"` on English pages, `href="/wall-display/" hreflang="en"` on every other language. No `lang=` (the link text is in the page's language). The value is empty while `WALL_GUIDE_PUBLIC` is false, which drops the link, so flipping the flag back still hides the guide. **No `aria-current`:** the other menu links don't use it (the Blog link has none on the blog pages), so I skipped it as the prompt said.
3. **Words.** `home.nav.wall` in all 28 `content/<loc>.json` (there are 28, not 30), right after `screens`. The `@nav` description in `en.json` now names the wall link and its rules.
4. **Menu in the middle.** `static/assets/style.css`, desktop block (≥ 861 px): `.links{margin-inline-start:auto}` → `.links{margin-inline:auto}`. Comment updated.
5. **861–1080 px tightening.** With six links, Ukrainian at 861–871 px fitted only because the brand ("daili") and the language chip got squeezed by up to ~9 px (no link was cut, but the pill was too tight). Link padding in that range went from 7 px to 6 px per side. After that, nothing is squeezed anywhere (see below). Comment updated.
6. **Build check.** `tools/check-build.mjs` section 24: while `WALL_GUIDE_PUBLIC` is true, every page with `<nav class="links">` (the guide's own page too) must have `<a class="nl" href="/wall-display/"` in it, or one `fail`. All older checks are unchanged (the hidden case, no hreflang in the guide's `<head>`, no inline script, etc.).

## Centring: which way I picked
`margin-inline:auto` on `.links`, the simplest way. The free space is split equally on both sides, so the links are centred **between the brand and the language chip**. They are not in the exact middle of the pill: the right group (chip + Download pill) is wider than the brand, so the row sits **65 px left of the pill's middle at ≥ 1081 px** (51 px at 861–1080, in English). In the shots it looks centred. Getting the exact middle would need a different layout of the pill (the chip and Download pill are two separate flex items). I did not do that, because the prompt said to keep it simple and not risk the 861–1080 range or the burger. If Ammar wants the exact middle, that is a small follow-up prompt.
When the links need all the room (Ukrainian, 861 px), both margins are 0 and the row is the same as the old end-aligned one.

## How I checked the widths
Headless Chrome (Chrome on the Mac, driven over CDP from a one-off script in `/tmp`, foreground; no Playwright here), `dist/` served locally, fonts loaded, transitions off. I checked **all 28 languages** on the home page at 861, 862, 866, 872, 880, 900, 960, 1000, 1040, 1080, 1081, 1085, 1200 and 1440 px (392 checks). For each check: six links, the wall link is there, all links on one row, no link text wraps or is cut, no overflow in the pill or in the links row, no link overlaps the language chip, the Download pill is inside the pill, and the brand, chip and Download pill are as wide as at 1000 / 1440 px (so nothing is squeezed).
- Result: **0 problems, 0 squeezed items.**
- Least spare room: 861 px → uk 2 px, sk 10 px, cs 12 px · 1000 px → uk 71 px · 1081 px → uk 52 px · 1440 px → uk 156 px. (ro, de, el and fi have more room than these.)
- Arabic is right-to-left (`RTL = {ar}`). `margin-inline` works the same way there, and it passed every check.
- 390 px, burger opened: the panel shows six links, and the wall link is visible ("Wall display" / "Настінний екран").
- `/wall-display/` at 1440 px: the menu has the link and the same layout.

Shots (small PNGs) in `claude-reports/2026-11-21/001-shots/`: `en-1440.png`, `en-1000.png`, `uk-1440.png`, `uk-1000.png` (header strip), `en-390-menu.png`, `uk-390-menu.png` (burger open).

## Word per language (`home.nav.wall`)
From the title of `help/<loc>/anywhere/wall.md`, shortened. ar, hi and ru have no help folder, so they got a normal short translation. All are ≤ 16 characters.

| loc | word | loc | word |
|---|---|---|---|
| en | Wall display | fi | Seinänäyttö |
| de | Wandbildschirm | tr | Duvar ekranı |
| fr | Écran mural | id | Layar dinding |
| es | Pantalla mural | ja | 壁の画面 |
| it | Display a parete | ko | 벽 화면 |
| nl | Wandscherm | zh-Hans | 挂墙屏幕 |
| pt | Tela de parede | zh-Hant | 掛牆螢幕 |
| sv | Väggskärm | th | จอติดผนัง |
| da | Vægskærm | ru | Настенный экран (no help folder) |
| nb | Veggskjerm | hi | वॉल डिस्प्ले (no help folder) |
| pl | Ekran ścienny | ar | شاشة الحائط (no help folder) |
| cs | Nástěnný displej | el | Οθόνη τοίχου |
| uk | Настінний екран | bg | Стенен екран |
| ro | Ecran de perete | sk | Nástenný displej |

es and it: the help wording ("pantalla de pared", "schermo a parete") is 17 characters, so I used "Pantalla mural" and "Display a parete".

## Build + tests (foreground)
- `npm run build`: all steps passed. `content OK · 28 locale(s) · 526 keys each`, `wall: /wall-display/ · 8 device guide(s) · en · PUBLIC`, `build OK · 3759 pages · 3728 in hreflang clusters`, detector OK, help search OK. It ran green before and after the padding change.
- `npm test`: detector OK (32 cases), test-check-help OK (99 cases), help search OK (26 cases), test-blog-i18n OK (48 cases).
- `dist/` checks: `wall-display/index.html` has no noindex; the guide's `<head>` has 0 `hreflang=`; `sitemap.xml` has `/wall-display/` at 0.6; `index.html` → `<a class="nl" href="/wall-display/">Wall display</a>`; `de/index.html` → `<a class="nl" href="/wall-display/" hreflang="en">Wandbildschirm</a>`.

## Owner steps for Ammar
1. Run `./deploy.sh` in `daili-website`.
2. On a laptop, open daili.app. The menu should be in the middle and have "Wall display", and it should open the guide.
3. On a phone, open the burger. The link should be there.
4. Later: test the guide's steps on a real tablet. The page is public now.

## Help impact
none (the help article is not changed).

DONE
