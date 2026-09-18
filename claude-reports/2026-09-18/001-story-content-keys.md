# Report — 001 scroll story 1/2, content keys for the floating cards

Prompt: `claude-prompts/2026-09-18/001-story-content-keys.md`
Commit: `2ff3c40f93344345e0cc16554efbe8a2858aba42`
`feat(content): scroll-story card strings, nav.menu, family alt — 28 locales`

## Done

- `story.cards` with the eight groups (`hero` + the seven `FEATURES[].key`),
  three `{t, s}` cards each, in all 28 files — 672 new strings, all translated.
- `@cards` description on `story.cards` in `en.json` (reworded, see below).
- `nav.menu` in all 28 (`@menu` description in `en.json`).
- `features.family.alt` rewritten and translated ×28.
- `pricing.lead` removed from all 28.
- `node tools/check-content.mjs` → `content OK · 28 locale(s) · 232 keys each`,
  0 errors. `npm run build` → `build OK · 134 pages`.

## The two longest strings (002 sizes the cards from these)

| | chars | locale | key | string |
|---|---|---|---|---|
| longest `t` | 28 | it | `story.cards.meals[2].t` | `La settimana pronta domenica` |
| longest `s` | 35 | de | `story.cards.shopping[0].s` | `Lena hat sie eingetragen — zu Hause` |

Three more `t` also hit exactly 28 (`pl birthdays[1]`, `el family[2]`,
`sk shopping[2]`), and `el shopping[0].s` is 33. The caps held: nothing is over
t ≤ 28 / s ≤ 36, counted in code points (so the 🎉 and the Thai combining marks
count the way a renderer counts them).

## Decision you were asked about mid-run: the names

The prompt said the demo names "stay as they are" in every locale. That is not
what the screenshots do: `shots/ja/shot-family.webp` is 佐藤家 with 美咲 / 健太 /
陽菜 / 蒼 / 結衣, not the Bergers. Since the story's sticky phone shows the
locale's own screenshot with the cards floating beside it, you chose to match
the screenshot. I read all 25 `shot-family.webp` files and used what each one
actually shows:

| pattern | locales | names |
|---|---|---|
| fully localized | ja | 佐藤家 · 美咲, 健太, 陽菜, 蒼, 結衣 |
| | ko | 김가네 · 수진, 준호, 서연, 지훈, 하윤 |
| | zh-Hans | 李家 · 晓燕, 志强, 子涵, 浩然, 一诺 |
| | zh-Hant | 陳家 · 淑芬, 建宏, 子晴, 承翰, 詩涵 |
| | th | ครอบครัวศรีสุข · หน่อย, เอก, น้ำ, ต้น, ฟ้า |
| | id | Keluarga Wijaya · Sari, Andi, Putri, Bayu, Dinda |
| family label translated, first names Latin | de/nl `Familie Berger`, fr `Famille Berger`, es `Familia Berger`, it `Famiglia Berger`, pt `Família Berger`, ro `Familia Berger`, pl `Rodzina Berger`, sv `Familjen Berger`, da/nb `Familien Berger`, fi `Bergerin perhe`, tr `Berger Ailesi`, cs `Bergerovi`, sk `Bergerovci`, el `Οικογένεια Μπέργκερ`, uk `Родина Берґер`, bg `Семейство Бергер` | Lena, Marco, Emma, Noah |

Role mapping is positional, from the screenshots: owner = Lena, admin = Marco
(the 41-year-old), member = Emma (the 12-year-old), first child = Noah (the
managed profile).

**ar, hi and ru have no screenshots at all** (`static/assets/img/shots/` has 25
locales, not 28). I followed the el/uk/bg pattern for them — family label in the
locale's script (`عائلة بيرغر`, `बर्गर परिवार`, `Семья Бергер`), first names
left Latin. If those three ever get screenshots, the cards may need a second
pass; nothing else depends on the choice.

Because of this I also reworded the `@cards` description: it now points a
translator at `shots/<loc>/shot-family.webp` instead of telling them the names
never change.

## Kept, against requirement 4

- **`hero.kicker` stays in all 28 files.** Requirement 4 said to remove it but
  to keep it if something still renders it — `templates/landing.html:13` does:
  `<span class="kicker">…{{ hero.kicker }}</span>`, with live CSS at
  `static/assets/style.css:251-257`. Removing it today would have broken the
  page before 002 replaces it. 002 should delete the key together with the
  markup, or say so and I will.
- `pricing.lead` had no renderer (`grep` over `build.mjs` and `templates/`
  found nothing) and is gone from all 28.
- `trust.*` and `featuresSection.*` left alone, as instructed.

## Translations I was less sure about

- **`meals[1].t` "6 ingredients → Groceries"** — the list name follows
  `content/glossary.md` (fr `Courses`, sv `Inköp`, pt `Compras`…). Dutch is the
  exception: `6 ingrediënten → Boodschappen` is 29 characters, one over the cap,
  so nl reads `6 ingrediënten → lijst`. Say the word if you would rather lose
  "ingrediënten" than "Boodschappen".
- **ar `meals[1].t`** uses `←`, not `→`, so the arrow points the way the
  sentence runs in RTL. Every other locale keeps `→`.
- **Clock and date formats**: 12-hour where the locale actually uses it (ko
  `오후 4:30`, hi `शाम 4:30`), `16h30` for fr and pt-BR, `16.30` for sv, da, fi,
  tr, id, `16:30` elsewhere. Dates follow the locale (`29. August`, `29 août`,
  `8月29日`, `29 สิงหาคม`).
- **"Insurance card.pdf"** became the document a family in that country would
  actually have: de `Versicherungskarte.pdf`, nl `Verzekeringspas.pdf`, cs
  `Karta pojištěnce.pdf`, sk `Kartička poistenca.pdf`, bg `Здравна карта.pdf`,
  pt-BR `Carteirinha do plano.pdf`, ja `保険証.pdf`, zh-Hans `医保卡.pdf`,
  zh-Hant `健保卡.pdf`. Not a literal translation in any of them.
- **de `hero[2]` / `todos[1]`**: `Müll rausbringen`, matching the app's own
  household vocabulary; ja uses `ごみを出す`, which is what the ja to-do
  screenshot already shows.

## Warnings

`check-content` ends with 17 warnings, 9 of them new and all the same shape: a
card line that is legitimately shorter than the English one, e.g.
`cs story.cards.meals[1].t 0.72` (`6 surovin → Nákupy`, 18 vs 25) and
`el story.cards.meals[1].t 0.60` (`6 υλικά → Ψώνια`). The cards have a hard
character budget, so the ratio band is the wrong instrument here — padding them
to please the checker would push them toward wrapping. The other 8 warnings were
there before this run (de ×2, pl, th ×2, ru ×2, ar).
