# Report: 004 Bevel home 1/2, content keys

Prompt: `claude-prompts/2026-09-28/004-bevel-content-keys.md`
Commit: `6e907882b0e00c129d1341a086e856c8d1354cbc`, `content: Bevel home page strings (28 locales)`. **Pushed** (`3a634bd..6e90788 main -> main`).

## Done

- There is a new top-level `home` object, placed between `hero` and `showcase` in all 28 files. It has the exact shape from the prompt: 189 strings per locale. No other key was touched or removed, and only `content/*.json` changed.
- `en.json` has an `@home` note, plus an `@`-description on every object and array. Each one says where the string sits and its length limit, and the prompt's translator notes are included.
- **Leaf count per locale:** 189 in all 28 (en de fr es it nl pt sv da nb pl cs fi tr id ja ko zh-Hans zh-Hant th ru hi ar el uk bg ro sk). The key tree is also identical to `en` in every locale.
- `{count}` appears exactly once in every `members.h2a`, and "Daili" survives in every string that has it. No string of 25+ characters is identical to English.

## Build (tail)

```
help id: 0 picture(s) in English
build OK · 2034 pages · 2014 in hreflang clusters
detector OK · 32 cases · 28 locale(s) built
```
`check-content`: `content OK · 28 locale(s) · 471 keys each`, 0 errors. There are 14 new warnings, all length ratios on strings that are legitimately short or long. Most of them are `members.h2a`, where "Over {count} members" is shorter than the English, in nl, da, el and tr.

## de: hero + member cards

- hero: Schwimmkurs / Heute · 16:30 · Noah | Milch · 2 l / Marco ist im Supermarkt | Essensgeld / Angeheftet für Freitag | Dehnen · 5 Min. / 4 Tage in Folge | Müll rausbringen / Noah · heute Abend | Gemüsecurry / Heute zum Abendessen | Geschenk für Emma / Geburtstag in 2 Tagen
- members: Freitagsessen? Erledigt. — Essensgeld für Freitag / Angeheftet · Familie | Samstags auf den Markt — Blumen für Oma / Einkaufen · 5 von 7 | Tag 12. Minzi ist stolz. — 20 Minuten lesen / 12 Tage in Folge | Heute wird sie 12! — Emma wird 12 / Heute · 3 Wünsche notiert | Kein Training verpasst — Fußballtraining / 17:00 · Noah · dienstags | Einkaufen mit Verstärkung — Heidelbeeren / Von Lena · gerade eben | Erst die Hausaufgaben — Hausaufgaben prüfen / Mia · heute | Unser kleiner Dschungel — Pflanzen gießen / Täglich · mit Papa

## ar / ja / tr member cards (spot check)

- **ar:** غداء الجمعة؟ جاهز — مصروف يوم الجمعة | مشوار سوق السبت — ورد لتيتا | اليوم 12. Minzi فخورة | صارت 12 سنة اليوم — Emma تُتمّ 12 سنة | ولا تمرين يفوتنا | تسوّق بفريق كامل — أضافته Lena | الواجبات أولًا — Mia · اليوم | غابتنا الصغيرة — مع بابا
- **ja:** 金曜のお昼、準備OK — 金曜の給食費 | 土曜の朝市へ — おばあちゃんに花を | 12日目。Minziもごきげん | 今日で12歳！おめでとう — Emma が12歳に | 練習、もう忘れない | 買い物は連携プレーで — Lena が追加 | まずは宿題から | うちの小さなジャングル — パパと
- **tr:** Cuma yemeği halloldu. — Cuma yemek parası | Cumartesi pazar turu — Babaanneye çiçek | 12. gün. Minzi gururlu. | Bugün 12 yaşında! — Emma 12 yaşına giriyor | Antrenman asla kaçmaz — 17.00 · Noah · her salı | Yedek kuvvetle alışveriş | Önce ödevler | Bizim küçük ormanımız — babayla

## Shortened / adapted, and why

- **Lunch money** was adapted to school reality: ja 給食費 (the school lunch fee), fr "Cantine", sv/fi trip money (school lunch is free there), nl "Overblijfgeld", id "Uang jajan".
- **`flow.pill`:** the "≤ 12" in my notes was my own reading of "as short as the English". de ("Schwimmen") and ru ("Бассейн") drop the time because the word plus the time was too long. Other locales use a shorter word for swimming, e.g. es "Nadar", fr "Nage", el "Πισίνα".
- **`qr.t` limit of 20 characters:** cs "Stáhněte si daili" and sk "Stiahni si daili" drop "free", which moved into `qr.s`. es uses "Baja daili gratis" and fi "Lataa daili maksutta".
- **"Made in Tirol" (limit 16):** de "Aus Tirol", fr "Conçu au Tyrol", sk "Z Tirolska", el "Από το Τιρόλο", bg "С любов от Тирол".
- **Widgets that had to fit:** "Family energy · 34 / 40" became just "Energy" in fr, el, hi and id. The pt/pl recipe titles drop "crispy".
- **`screens.phones.p`:** the example languages were changed so that both are languages the app actually ships. For tr, grandma speaks Deutsch and the kids speak Türkçe, as the prompt asks. The app has no Russian, Arabic or Hindi, so ru, ar and hi use two other app languages (ru Deutsch/English, ar Français/Deutsch, hi Deutsch/English). ja/ko/zh use their own language plus English.
- **`members.h2a`:** several locales write "over {count}" instead of "{count}+" where the "+" reads badly, for example ro "Peste {count} de membri", th, ja and pl.
- **"€0" tile:** each locale uses its own form, so the files mix "€0", "0 €" and "€ 0" (existing `pricing.big` is "€0" everywhere). 005 should settle on one form.
- **Time format:** the prompt asks for 24-hour time, so ko and hi use 16:30, while their older `story.cards` use 오후 4:30 / शाम 4:30. da, sv, fi, tr and id use 16.30, as their files already do.

## Please decide

- **Names:** Lena, Marco, Emma, Noah and Mia stay Latin in every locale, as this prompt says. That contradicts the 09-18 decision that names follow each locale's `shot-family.webp` (ja 美咲, id Andi/Putri and so on). If the hero phone in 005 shows the locale's own screenshot, the floating cards won't match it in ja, ko, zh-Hans, zh-Hant, th and id.
- **tr/ko/ja brand names:** "Google Calendar" is kept as the brief says, although `tr.json` elsewhere writes "Google Takvim".

## Process note

The strings were drafted by five parallel sub-agents writing to `/tmp/home/`. Their "done" reports arrived well before their files did, and some claimed files that never landed. I wrote nb, sv and fi myself and fixed fi `qr.t` and ru `phones.p`. Every file was re-checked on disk before the splice, with a validator for tree, placeholders, names and length limits.
