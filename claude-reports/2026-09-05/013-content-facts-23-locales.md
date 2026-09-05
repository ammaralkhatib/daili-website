# 013 — Redesign 3/5: new copy + fact corrections, all 23 locales

Prompt: `claude-prompts/2026-09-05/013-content-facts-23-locales.md`
Date: 2026-09-05
Commit: ba5d6ef

## Result

`npm run build` clean. `content OK · 23 locale(s) · 189 keys each` (was 160 —
29 new keys per file). 8 length-ratio warnings remain, all of them pre-existing
from before this prompt; the one new warning this prompt introduced
(`de compare.rows[7]`, ratio 0.78) was fixed by widening the German label, and
one pre-existing warning (`ar faq.items[1].a`) went away because the English
source string it is measured against got longer.

Nothing was removed. `pricing.earlyBirdTitle` / `earlyBird` and `hero.note`
are still there for 014 to delete together with the markup that uses them.

## One deviation from the prompt — read this before writing 014

**The prompt asked for `features.sectionEyebrow` / `sectionH2` / `sectionLead`.
Those keys cannot live under `features`.** `tools/check-content.mjs:83` walks
`Object.keys(data.features)` and errors on any key that is not a feature in
`FEATURES` (site.config.mjs) — so `features.sectionEyebrow` fails the build in
all 23 locales, and both `check-content.mjs` and `FEATURES` are out of this
prompt's scope.

They are therefore a **sibling top-level object**, shaped like the other
section headers this prompt adds:

```
"featuresSection": { "eyebrow", "h2", "lead" }
```

014 should read `featuresSection.eyebrow`, `featuresSection.h2`,
`featuresSection.lead`. If you would rather have the original names, that is a
one-line change to the orphan check in `tools/check-content.mjs` (skip keys
that are not objects), and then this object can be folded back into `features`.

## Keys changed (existing keys, all 23 locales)

| key | change |
|---|---|
| `meta.description` | now mentions the web version; ≤ 162 chars in every locale (en 145, the `@description` maxLength is 155) |
| `meta.ogDescription` | now mentions phone + browser |
| `hero.lead` | new lead — "On every phone — and on the computer, too." replaces the parents/kids/little-ones sentence |
| `howItWorks.steps[0].p` | adds "or open app.daili.app on your computer" |
| `features.calendar.bullets[3]` | **36 → 35 countries** (`Family::HOLIDAY_COUNTRIES` has 35) |
| `faq.items[0].a` | drops "1.0" — "Daili is free", not "Daili 1.0 is free" |
| `faq.items[1].a` (languages) | **11 → 19 languages**, with the full list; see below |
| `faq.items[2].a` (phones) | adds "— and with the web app" |
| `faq.items[5].a` (existing calendar) | **Outlook/Google connect is no longer claimed as live**: phone calendar shown next to the family calendar, connecting Google or Outlook "is coming soon" (Ammar's decision 2026-09-05) |
| `compare.rows` | new label inserted at index 7, before "No ads, nothing sold" |

`support.deleteWays[0]` needed **no change**: every one of the 23 files already
said Settings → Profile → Delete account. Verified string by string.

## Keys added (all 23 locales)

`hero.kicker`, `hero.webLink`, `hero.notes[3]`,
`howItWorks.eyebrow`,
`featuresSection.eyebrow`, `featuresSection.h2`, `featuresSection.lead`,
`web.eyebrow`, `web.h2`, `web.p`, `web.points[3]`, `web.cta`, `web.note`,
`compare.eyebrow`,
`pricing.eyebrow`, `pricing.big`, `pricing.bigNote`, `pricing.promiseTitle`, `pricing.promise`,
`faq.eyebrow`, and a new `faq.items[1]` (q + a) — "Is there a web version?".

Inserting the FAQ item shifts every later index by one. **In 014, the FAQ
indices are now:** 0 cost · 1 web version · 2 languages · 3 phones · 4 kids ·
5 offline · 6 existing calendar · 7 data location.

### en-only metadata

- `@@doNotTranslate` gained `app.daili.app`.
- `@@identicalOk` gained `pricing.big` (`€0` is identical in every locale).
- `@`-descriptions added for `hero.kicker`, `hero.notes`, `pricing.big`,
  `pricing.bigNote`, `web.cta`.

## site.config.mjs

`COMPARE_ROWS` gained `{ daili: 'y', gcal: 'y', paper: 'n' }` at index 7, so it
still zips 1:1 with `compare.rows`. Google Calendar gets a `y`: it does have a
real web app. Paper gets `n`.

## content/glossary.md

Added a **"Decided on the website first"** section with a single `Web app` row
across the 11 locales the main table covers, plus a note that the term for the
other twelve lives in `nav.webApp` / `web.eyebrow`. It is a separate section
rather than a column on the main table because the main table is explicitly
generated from the app's ARB files, and the app has no web-app label — this
term was chosen here.

## The languages FAQ, de and ja

**de** (`faq.items[2].a` after the insert):

> Die App spricht 19 Sprachen, vollständig — auch die Erinnerungen, die sie
> schickt: Deutsch, Englisch, Französisch, Spanisch, Italienisch,
> Niederländisch, Portugiesisch, Polnisch, Tschechisch, Slowakisch, Schwedisch,
> Dänisch, Norwegisch, Finnisch, Türkisch, Rumänisch, Bulgarisch, Griechisch
> und Ukrainisch.

**ja** (a locale whose language the app does *not* speak — the honest sentence
is appended):

> 19言語に完全対応しています。送られる通知も含めて、英語・ドイツ語・フランス語・スペイン語・イタリア語・オランダ語・ポルトガル語・ポーランド語・チェコ語・スロバキア語・スウェーデン語・デンマーク語・ノルウェー語・フィンランド語・トルコ語・ルーマニア語・ブルガリア語・ギリシャ語・ウクライナ語です。日本語はまだです — それまではアプリは英語で動きます。

The "not yet in your language" sentence is present in exactly the 9 locales the
prompt names: id, ja, ko, zh-Hans, zh-Hant, th, ru, hi, ar. It was **removed**
from cs, fi and tr, which had it before — the app now speaks Czech, Finnish and
Turkish, so keeping it would have been wrong.

In each locale the list leads with that locale's own language where the app
speaks it (de starts "Deutsch, Englisch…", fr "français, anglais…"), matching
the convention the files already used.

## Verification

- `npm run build` — clean (output above).
- `grep -l "36" content/*.json` → nothing. All 23 now read 35 (ar spells it:
  "خمس وثلاثين دولة").
- `grep -l '1\.0' content/*.json` → nothing.
- `grep -l "1000" content/*.json` → 21 files, **every occurrence is inside
  `pricing.earlyBird`**, which this prompt deliberately leaves in place for 014
  to remove (checked programmatically: 0 occurrences outside that key in every
  file; ru and ar spell the number out, so they do not match the grep at all).
- Currency: `pricing.big` is `€0` in all 23.

## Terms a native speaker should sanity-check

Nothing here is a guess at a *product* term — feature names came from
`content/glossary.md` or the locale's own existing strings. These are the
free-prose choices I would want a second pair of eyes on:

- **hi** — `web.p` uses "बड़े स्क्रीन" (should arguably be "बड़ी स्क्रीन");
  gender of स्क्रीन varies in practice. Also `pr_bignote` "कोई शर्त नहीं" is a
  softer rendering of "no catch" than the English.
- **th** — `pricing.bigNote` "ไม่มีเงื่อนไขแอบแฝง" (no hidden conditions) is a
  deliberate reading of "no catch"; a Thai speaker may prefer something shorter.
- **ar** — `feat_h2` "كل ما تُوازنه عائلتك" renders "juggles" as "balances".
  The juggling metaphor does not carry; worth a check that "تُوازنه" reads as
  intended and not as accounting.
- **id** — "peramban" for browser is correct but formal; many Indonesian users
  say "browser". Consistent across the file either way.
- **fi** — `feat_h2` "jongleeraa" is a loan verb; a Finnish speaker may prefer
  "pyörittää".
- **da** — `pricing.bigNote` "pr. familie · uden hage ved" is a little clumsy;
  "uden en hage ved" or simply "helt uden hage" may read better.
- **pl** — `web.eyebrow` follows the existing `nav.webApp` ("Aplikacja web").
  If that was itself a placeholder, both should change together.
