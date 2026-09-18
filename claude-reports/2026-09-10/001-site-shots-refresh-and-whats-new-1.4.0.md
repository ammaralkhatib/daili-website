# 001 — refresh every site screenshot, add six languages, commit the What's-New

Prompt: `claude-prompts/2026-09-10/001-site-shots-refresh-and-whats-new-1.4.0.md`
Status: **done** — not deployed; `./deploy.sh` is Ammar's.
Commits: `<shots>` (shots), `<changelog>` (What's-New)

## The six new locales

`../store-shots/raw/` now holds all six folders, named exactly as the site
locale is spelled, so the map is one-to-one:

```
id: 'id', th: 'th', ja: 'ja', ko: 'ko',
'zh-Hans': 'zh-Hans', 'zh-Hant': 'zh-Hant',
```

The comment above them now lists only `ru, hi, ar` as uncaptured. `SHOT_LOCALE`
is 25 entries; `LOCALES` is 28.

The two Chinese keys keep their BCP-47 casing, because `shots/<dir>/` is keyed
on the locale key itself (`build.mjs` `imgSrc`), not on `dirFor`'s lower-cased
page path. The built pages agree — `/zh-hans/index.html` references
`/assets/img/shots/zh-Hans/` — so nothing 404s on a case-sensitive filesystem.

## The regeneration

`--check` first, writing nothing:

```
175 files · 3551K total · largest 35.6K · budget 45K each

Intrinsic size produced: 640x1391
```

175 = 25 locales × 7 screens, one aspect ratio, nothing over budget, no missing
raw file. (The 3551K undercounts: `--check` measures the _destination_ file, and
the 42 files for the six new locales did not exist yet, so they scored 0.0K.)

Then the real run, all of `SHOT_LOCALE`:

```
175 files · 4640K total · largest 36.1K · budget 45K each

Intrinsic size produced: 640x1391
```

|                       |                                                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| written               | 175                                                                                                               |
| **changed**           | **175** — 133 modified, 42 new                                                                                    |
| byte-identical        | 0                                                                                                                 |
| untouched             | 3 (`en/shot-recipes`, `en/shot-photos`, `en/shot-documents` — no capture exists, so the script never writes them) |
| files in `shots/` now | 178                                                                                                               |
| `shots/` on disk      | 5.1 MB                                                                                                            |

Every one of the 133 files that already existed came back different, which is
what the 7 September captures being pre-polish predicts. Nothing came back
identical.

`IMAGE_SIZES['shot-']` already says `640x1391` and still matches; no change
needed there.

## The three eyeballed images

All three are the 9 September captures — the week strip reads **Mo 7 … Su 13**
with **9** circled, i.e. the date of the recapture, not the 7th.

- **`en/shot-home.webp`** — the new week card: a seven-day strip with per-day
  event dots, today filled green, and below it the next event (`Dentist · Today,
16:30`) with a `2 today` pill. **No chevron in the card's corner.** The eight
  tiles below it still carry their own chevrons, which is the tile affordance,
  not the week card's.
- **`de/shot-home.webp`** — German (`Guten Tag, Lena` / `Familie: Familie
Berger`), same new week card. The longest strings, `Dateien auf diesem
Handy…` and `Fotos auf diesem Handy b…`, ellipsize cleanly inside their tiles;
  no overflow anywhere on the screen.
- **`ja/shot-home.webp`** — fully Japanese (`美咲さん、こんにちは` / `家族：佐藤家`,
  `買い物`, `やること`, `献立`), where this locale used to render the English set.
  Same new week card, no chevron. The demo family is the Japanese one the store
  pipeline uses, not a relabelled Berger family.

## What's-New

Committed as they stood on disk — not rewritten, not re-dated. Both files carry
three new `<section class="release">` blocks, newest first:

|          | en                | de                 |
| -------- | ----------------- | ------------------ |
| `v1-5-0` | 17 September 2026 | 17. September 2026 |
| `v1-4-0` | 9 September 2026  | 9. September 2026  |
| `v1-3-0` | 4 September 2026  | 4. September 2026  |

`v1-2-0` stays below them. The German file is German throughout, including the
`D. Monat YYYY` date form its own header comment asks for.

## Build

```
content OK · 28 locale(s) · 176 keys each
legal OK · 2 document(s) × 28 locale(s)
built 134 pages · 28 locale(s) · 132 sitemap entries
build OK · 134 pages · 114 in hreflang clusters
detector OK · 32 cases · 28 locale(s) built
```

Green. `check-content.mjs` printed its usual 8 length-ratio **warnings** (de, pl,
th, ru, ar) — pre-existing, not errors, untouched by this run.

`check-build.mjs` section 14 is the one that matters here: it asserts a locale
in `SHOT_LOCALE` actually uses `shots/<loc>/` and that a locale outside it shows
only English. It passes, so the six new sets are genuinely being served to their
own pages rather than falling back.

## Left alone

Not touched and not committed, as the prompt requires — the blog lane's
uncommitted work stays uncommitted:

```
 M claude-prompts/BLOG-POST-TEMPLATE.md
 M claude/blog-seo-plan-2026-09.md
?? claude/blog-drafts/018-…027-*.md, TODO.md
?? claude-prompts/2026-09-11/
?? claude-prompts/2026-09-05/016-redesign-fixups.md
?? claude-prompts/2026-09-08/scroll-story-mock.html
?? static/assets/img/blog/what-to-look-for-family-app.webp
?? _to_delete/
```

`tools/make-site-shots.py` is still not wired into `npm run build`, and no
dependency was added.

Not deployed. `./deploy.sh` is Ammar's to run.
