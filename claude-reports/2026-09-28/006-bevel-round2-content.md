# Report: 006 Bevel home round 2, strings

Prompt: `claude-prompts/2026-09-28/006-bevel-round2-content.md`
Commit: `ef229197790007f23735bc053c45de3945e2e72c`, `content: Bevel home round 2 strings (28 locales)`. **Pushed** (`1997b9f..ef22919 main -> main`; the push also carried the docs commit `6a07083` for prompts 006/007).

## Done

- All 28 `content/*.json` got `home.nav.downloadApp` / `openWebApp`, `home.hero.rating` / `ratingAlt` / `scenes` (7 × 3, `id` kept English), `home.day.cards6` (6 cards), `home.calendars.apple`, `home.screens.tablet`, `home.screens.widgets2`, `home.final.web`, and the new `home.members.cards[3].s` ("Today · party at 3 pm"). Nothing was removed, and `cards6` / `widgets2` are the temporary names the prompt asks for. Only `content/` changed.
- `en.json` has an `@`-description for each new block (`@rating`, `@scenes`, `@cards6`, `@apple`, `@tablet`, `@widgets2`, `@web` with the prompt's wording) and an extended `@nav`.
- The strings were inserted as text into the hand-formatted files, so the diff contains only the new lines. Each file was then re-parsed and deep-compared against the expected tree.
- **Leaf count per locale (`home`):** 285 in all 28 (en de fr es it nl pt sv da nb pl cs fi tr id ja ko zh-Hans zh-Hant th ru hi ar el uk bg ro sk). That is the old 189 plus 96 new.

## Where the wording comes from

- **Scene and card texts:** these come from the store-shot fixtures (`test_driver/store_shots/fixtures/<lang>.dart`): dishes, items, "2 l", list name, to-dos, events and recipe. The habit titles come from `help_shots/help_demo_strings.dart`.
- **Names:** ja, ko, zh-Hans, zh-Hant, th and id use their screenshot family, mapped Lena → mother, Marco → father, Emma → older daughter, Noah → son, Mia → younger daughter (ja 美咲/健太/陽菜/蒼/結衣, id Sari/Andi/Putri/Bayu/Dinda). All other locales keep the Latin names.
- **Habits card (`cards6[1]`):** t is the app's `habitsEnergyTitle` with 34 / 40, and s is `habitsEnergyToGo` (other, 6) with "tonight" dropped, as the English does.
- **`widgets2`:** the labels come from the app's ARB: `widgetNextUpComingUp`, `widgetShoppingToBuy`, `widgetHabitsEnergy`, `habitsTitle`, `widgetNextUpStartsIn`, `widgetCountdownDays` (other), `celebrationTypeBirthday` and `widgetQuickAdd*`. The iOS `.lproj` files exist only for en and de and hold only the widget-gallery names, so the labels had to come from the ARB. ru, hi and ar have no app strings and were translated fresh.

## Build (tail)

```
build OK · 2034 pages · 2014 in hreflang clusters
detector OK · 32 cases · 28 locale(s) built
```
`check-content`: `content OK · 28 locale(s) · 377 keys each`. The only new warning is a length ratio on tr `home.screens.tablet.alt`.

## de: `home.hero.scenes`

- calendar: Schwimmkurs / Heute · 16:30 · Noah | Zahnarzt / Di. · 08:15 · Mia | Elternabend / Do. · 18:30
- todos: Müll rausbringen / Noah · heute Abend | Wäsche waschen / Lena · heute | Hausaufgaben prüfen / Mia · 17:00
- shopping: Milch · 2 l / Marco ist im Supermarkt | Brot / Von Lena hinzugefügt | Äpfel · 1 kg / Einkaufen · 3 von 7
- habits: Dehnen · 5 Min. / 4 Tage in Folge | 20 Minuten lesen / Mia · jeden Tag | Blumen gießen / Familienenergie +1
- notes: Essensgeld / Angeheftet für Freitag | WLAN-Passwort / Mit der Familie geteilt | Oma kommt Samstag / Wer holt sie ab?
- birthdays: Emma wird 12 / In 3 Tagen | Geschenk für Emma / Aufgabe · Marco | Noah wird 8 / In 11 Tagen
- meals: Porridge / Frühstück · Montag | Hähnchensalat / Mittagessen · Montag | Gemüsecurry / Heute zum Abendessen

## de: `home.day.cards6`

1. **Listen**: Milch in der Küche eintragen, im Laden abhaken. Alle sehen es sofort. Widget: Brot / Von Marco abgehakt · gerade
2. **Gewohnheiten**: Kleine Routinen, gemeinsam erledigt. Jeder Haken gibt Minzi, eurer Familienkatze, mehr Energie. Widget: Familienenergie · 34 / 40 / Noch 6 und Minzi fährt auf Reisen
3. **Notizen**: Schnelle Gedanken, das WLAN-Passwort, wer Oma abholt. Behaltet eine Notiz für euch oder teilt sie mit der Familie. Widget: Oma kommt Samstag um 15 Uhr / Mit der Familie geteilt
4. **Rezepte**: Bewahrt eure Lieblingsrezepte auf oder importiert eines aus einem Video oder Foto. Die Zutaten landen mit einem Tipp auf eurer Liste. Widget: Süß-saurer Knuspertofu / 13 Zutaten · Zu Einkaufen hinzufügen
5. **Essensplan**: Plant Frühstück, Mittag- und Abendessen für die ganze Woche, damit um sechs keiner fragt, was es heute gibt. Widget: Gemüsecurry / Abendessen · Montag
6. **Geburtstage**: Countdowns für jeden Geburtstag in der Familie und eine Erinnerung, rechtzeitig das Geschenk zu besorgen. Widget: Emma wird 12 / In 3 Tagen, 12 Stunden

## Over a limit or adapted

- **Over the length limits, kept on purpose:**
  - it "Portare fuori i rifiuti" is 23/22 characters. It is the screenshot's to-do word for word.
  - ro `cards6[3].s` is 38/36 and th is 39/36. Both reuse existing button text, and the Thai combining marks take no width of their own.
  - pl and cs `downloadApp` are 17 characters.
- **Changed from existing site copy to match the screenshots/app:**
  - de "Blumen gießen" and "Süß-saurer Knuspertofu".
  - ja/ko/zh use 家族のエネルギー / 가족 에너지 / 家庭能量.
  - zh-Hant 奶奶.
  - da "Svømmehold".
  - pt Minzi feminine ("a Minzi"), as the app has it.
  - es "Añadir a la Compra": the list is "Compra" in the screenshot.
- **Existing "Add to Groceries" wording differs from the screenshot list name** in sv, nb, cs and fi (e.g. sv "Inköp" vs "Handla"). This is left as it was on the site.
- **`widgets2.days`:** pl "dni" and uk "днів" instead of the app's `other` form, which is the fractional form in those languages.

## Please decide

- **English `widgets2`** follows the prompt: "Upcoming" and "Task". The real English widget says "Coming up" (`widgetNextUpComingUp`) and "To-do" (`widgetQuickAddTodo`). Every other locale copies its app's actual word (de "Demnächst", "Aufgabe").
- **The "Habits" s line** drops "tonight" everywhere, matching the English brief. The screenshot's own line keeps it, so if 007 lays the card exactly over the widget, the widget will show the longer text.

## Process note

Five parallel sub-agents drafted the strings into `/tmp/r2/out/`. Every file was on disk when its agent reported. Each one passed my validator (tree, ids, placeholders, "Daili"/"Minzi", screenshot names, lengths) before the splice. One agent imported `tools/glossary.mjs`, which rewrites `content/glossary.md`; it restored the file, and it is not in the commit.
