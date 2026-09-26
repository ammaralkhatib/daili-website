# 014 — Help center in Greek, Ukrainian, Bulgarian

Status: done · all 3 languages · `HELP_LOCALES = [..., 'tr', 'el', 'uk', 'bg']` · `npm run build` green (1578 pages; el/uk/bg.json each have 64 articles, 9 tips, 6 checklist rows) · pushed, not deployed

## Per language
| | el | uk | bg |
|---|---|---|---|
| Done | yes | yes | yes |
| Build | green on the first try | green on the first try | green on the first try |
| Register | εσύ, "Πάτησε…" | ти, "Натисни…" | ти, "Натисни…" |
| Plural forms in `_ui.json` | one / other | one / few / many / other | one / other |

Labels come from the ARB at the live tag `v1.6.0+11`. I first mapped every English bold label to its ARB key and the el/uk/bg values. Where one English label has several keys, I used the key for that screen: for example, the Home tile vs the screen title for Meal plan, `recipeImportPaste` vs `recipePasteButton`, and `todoReminderActionDone` vs `dashboardEditDone`. After that, a script checked **every** bold label in the 192 files against that language's ARB. The only labels it didn't find are listed below. There's also the usual set of bold sentence lead-ins in notifications-help and vault-where, which are sentences, not labels.
- Past-tense verbs are gendered in uk and bg, so I rewrote those sentences to be gender-neutral (for example uk "Реєстрація була через Google…" and bg "ако списъкът е грешен").
- el/uk/bg: "family planner" doesn't appear anywhere. I grepped for planner, планер, планувальник and προγραμματιστ: no matches.

**Spot check (all three):** account-password, calendar-reminders, habits-streaks, lists-due-reminders, start-join. I re-read each one against the label → key table and the ARB. They have no mismatches, apart from the placeholder labels below.

## Labels the ARB didn't have (and what I wrote)
- **Hold to leave** (wall board): left in English, as in the other languages.
- For labels with a placeholder, I used the ARB text without the variable part:
  - el: **Μπες στην οικογένεια**, **Τσεκάρεις για:**, **Προσθήκη 6 ειδών**, **Θύμισέ μου την ημέρα**, **Ενέργεια οικογένειας**
  - uk: **Приєднатися до родини**, **Ти позначаєш за:**, **Додати 6 товарів**, **Нагадати того дня**, **Енергія родини**
  - bg: **Присъедини се към**, **Ти отмяташ за:**, **Добави 6 продукта**, **Напомни ми в самия ден**, **Семейна енергия**
- For the phone's own widget menus I wrote the words below from memory, so they're **not verified** on a device:
  - iPhone: el **Επεξεργασία → Προσθήκη γραφικού στοιχείου**, uk **Редагувати → Додати віджет**, bg **Редактиране → Добави уиджет**.
  - Android: el **Γραφικά στοιχεία**, uk **Віджети**, bg **Приспособления**.
  - Focus / Do Not Disturb: Εστίαση + Μην ενοχλείτε, Зосередження + «Не турбувати», Фокусиране + Не безпокойте.
  - Worth a native check.

## ARB notes (not English issues; worth a look in the app)
- **uk uses ви in a ти app:** `newsletterAskYes` = "Так, запишіть мене" and `calendarEmptyHintTapEdit` = "Торкніться Редагувати…". The articles quote the labels as they are.
- uk `calendarEditEvent` = "Редагування події", a title-style noun on a button.
- Meal plan has two names in the app: Home tile vs screen title.
  - el: Γεύματα vs Πρόγραμμα γευμάτων
  - uk: Меню vs Меню на тиждень
  - bg: Меню vs Меню за седмицата
  - The articles use the tile name for "on Home, tap" and the title name for the screen itself.
- **bg Account = Profile:** `settingsSectionAccount` = "Профил", the same word as the Profile screen, so "Under Account" reads "В раздел Профил" on the Профил screen.
- el has three words for Done: Τέλος (edit Home), Έτοιμο and Έγινε (reminders, habits). el `newsletterSettingsGroup` = "E-mail", but `fieldEmail` = "Email".
- uk `albumPresetFamily` = "Сім'я" (with an ASCII apostrophe), but everywhere else the app says "Родина".

## English issues
None new. The two from 009 still apply:
- `lists-categories`: the note is about deleting a category, but no step says how.
- `anywhere-wall`: the board is in English only for these readers.

## SHAs
- `654c55b` docs(plan): prompt
- `6c4d298` feat(help): Greek (el)
- `dbdc004` feat(help): Ukrainian (uk)
- `ab7f91f` feat(help): Bulgarian (bg)

Help impact: none
