# 001 — real app screenshots for id, th, ja, ko, zh-Hans, zh-Hant

Prompt: `claude-prompts/2026-09-08/001-site-shots-six-languages.md`
Status: **blocked** — the prompt's own precondition is not met.
Commit: `<pending>`

## The gate

The prompt opens with:

> ⚠ Requires the app-repo run `claude-prompts/2026-09-07/016-capture-and-render-six-languages.md`
> to have landed — check `../store-shots/raw/{id,th,ja,ko,zh-Hans,zh-Hant}/`
> each hold 7 PNGs before starting; if not, `blocked`.

None of the six folders exists.

```
$ ls ../store-shots/raw/
_diagnostics  bg  cs  da  de  el  en-GB  en-US  es-ES  es-MX  fi  fr-FR
it  nb  nl  pl  pt-BR  pt-PT  ro  sk  sv  tr  uk
```

| expected folder | state |
|---|---|
| `../store-shots/raw/id/` | missing |
| `../store-shots/raw/th/` | missing |
| `../store-shots/raw/ja/` | missing |
| `../store-shots/raw/ko/` | missing |
| `../store-shots/raw/zh-Hans/` | missing |
| `../store-shots/raw/zh-Hant/` | missing |

22 raw locale folders are present, all last written **18 Aug**. `../store-shots/out/`
holds the same 22 and no more. Nothing in that sibling folder has been touched by a
capture run since August.

## Why: the upstream run has not happened

The blocking prompt exists in the app repo but has never been executed.

```
$ ls familyplanner-app/claude-prompts/2026-09-07/ | tail -4
013-screenshot-fixtures-six-languages.md
014-store-folder-refresh-25.md
015-holidays-new-countries.md
016-capture-and-render-six-languages.md

$ ls familyplanner-app/claude-reports/2026-09-07/ | tail -3
013-screenshot-fixtures-six-languages.md
014-store-folder-refresh-25.md
015-holidays-new-countries.md          ← no 016
```

`git log --grep="016-capture"` in `familyplanner-app` returns nothing; the tip is
`8fb5d96 docs(plan): sync planning docs`, and the newest screenshot-related commit
is `3faf308 feat(store-shots): add screenshot fixtures for the six new languages`
— that is prompt **013**, the fixtures, not the capture.

So the chain is: 013 landed (fixtures exist, capture was proved in a scratch folder)
→ **016 has not run** (no real captures, no Simplified Chinese headline font)
→ this prompt has no input.

## What was and was not done

**Nothing was changed.** `site.config.mjs` is untouched, `tools/make-site-shots.py`
was not run, and no directory was created under `static/assets/img/shots/`. The
working tree carries only the blog-draft and changelog files that were already
uncommitted when this run started, plus this report.

Baseline build, run to confirm the tree is where it was:

```
content OK · 28 locale(s) · 176 keys each
legal OK · 2 document(s) × 28 locale(s)
built 128 pages · 28 locale(s) · 126 sitemap entries
assets: style.f9c5d5c4.css  script.eb854aaf.js
blog: 11 post(s) · /blog/ index · feed.xml
build OK · 128 pages · 114 in hreflang clusters
detector OK · 32 cases · 28 locale(s) built
```

Green, with the same 8 pre-existing length-ratio warnings (de×2, pl×1, th×2, ru×2,
ar×1). Section 14 passes today because the six locales are absent from `SHOT_LOCALE`
and are therefore *required* to show English — adding the six lines without the
captures in place would have turned that check from a pass into six failures, which
is exactly the guard working.

Current state: 19 of 28 locales have their own shots
(`bg cs da de el en es fi fr it nb nl pl pt ro sk sv tr uk`); nine fall back to
`shots/en/` — `id ja ko zh-Hans zh-Hant th ru hi ar`, as the `SHOT_LOCALE` comment
says.

## Requirement 2's directory-name question, answered from the code

The prompt asks to check that the Chinese output folders are **lowercase**, and to
"follow whatever the tool already does for the existing locales and say which".
Reading the code, the answer is that they will **not** be lowercase — and should
not be. Three places agree, all keying on the *site-locale* string verbatim:

| where | line | what it uses |
|---|---|---|
| `tools/make-site-shots.py` | `dest_dir = OUT / loc` | the `SHOT_LOCALE` key as written |
| `build.mjs` `imgSrc()` | `` const dir = loc in SHOT_LOCALE ? loc : DEFAULT_LOCALE `` → `/assets/img/shots/${d}/` | the `LOCALES` entry as written |
| `tools/check-build.mjs` §14 | `if (own && !dirs.has(loc))` | the `LOCALES` entry as written |

`LOCALES` spells them `'zh-Hans'` and `'zh-Hant'` (`site.config.mjs:18`), so the
folders will be `static/assets/img/shots/zh-Hans/` and `shots/zh-Hant/`, mixed case,
and the built pages will reference `/assets/img/shots/zh-Hans/shot-home.webp`.

The README's lowercase rule is about **page directories** — `dirFor()` lowercases
only the URL path, which is why the page is `/zh-hans/` while its `hreflang` stays
`zh-Hans` (`build.mjs:637` is the only `toLowerCase()` in the chain, and it is the
detector's locale map, not an asset path). Asset directories were never in scope of
that rule; it has simply never come up, because all 19 locales that own a shot set
today are single-word lowercase codes where the two conventions are identical.

Forcing `shots/zh-hans/` by hand would break the build: `imgSrc()` would look for
`shots/zh-Hans/`, not find it, fall back to English, and §14 would then fail with
*"SHOT_LOCALE maps zh-Hans to 'zh-Hans' but the page uses no shots/zh-Hans/ file"*.
So: **mixed case, matching the locale key** — and the source folder under
`../store-shots/raw/` is likewise `zh-Hans`/`zh-Hant`, which is what prompt 016
itself specifies.

Worth noting for whoever picks this up: this is a case-insensitive macOS filesystem
writing to a case-sensitive Linux server, so the commit must be checked for the
casing git actually recorded (`git ls-files static/assets/img/shots/`), not for what
the local `ls` shows.

## What has to happen first

1. Run `claude-prompts/2026-09-07/016-capture-and-render-six-languages.md` in
   `familyplanner-app`. It builds the missing Noto Sans SC Bold subset, captures
   `tool/store-shots.sh id th ja ko zh zh_Hant` into `../store-shots/raw/`, and
   renders `out/` and `out-feature/`.
2. Re-check `../store-shots/raw/{id,th,ja,ko,zh-Hans,zh-Hant}/` for 7 PNGs each.
3. Re-run this prompt. It is then three steps: six `SHOT_LOCALE` lines, one
   `python3 tools/make-site-shots.py`, one `npm run build`.

## For Ammar

**No `./deploy.sh` needed** — nothing about the site changed, so there is nothing to
deploy from this run. The six pages still show English screenshots, exactly as they
did this morning.

The one decision this run surfaces: prompt 016 in the app repo is the real piece of
work sitting in front of this one, and it is not a small one — it includes building
a Simplified Chinese headline font subset that does not exist yet.
