# 013 — Help center in Slovak, Romanian, Turkish

Status: done · all 3 languages · `HELP_LOCALES = [..., 'cs', 'sk', 'ro', 'tr']` · `npm run build` green (1350 pages; sk/ro/tr.json each 64 articles, 9 tips, 6 checklist) · pushed, not deployed

## Per language
| | sk | ro | tr |
|---|---|---|---|
| Done | yes | yes | yes |
| Build | green first try | green after 1 fix (account-feedback had 13 keywords, caught by check-help) | green first try |
| Register | ty, "Ťukni na…" (as the ARB) | tu, "Apasă pe…" | sen, "**X** düğmesine / seçeneğine dokun" |
| Plural forms in `_ui.json` | one / few / many / other | one / few / other | one / other |

Labels come from the ARB at the live tag `v1.6.0+11`. A script checked **every** bold label in the 192 files against that language's ARB. The only labels not in the ARB are listed below, plus the bold lead-ins in notifications-help and vault-where, which are sentences, not labels.
- **sk:** the text is gender-neutral. I avoided past-tense "-l/-la" forms like "zabudol si" or "aby si mohol".
- **ro:** I put a noun before a bold label where the grammar needs it ("Scrie numele la **Nume**") so the label keeps its ARB form.
- **tr:** labels are followed by "düğmesine / seçeneğine / alanına / kutucuğuna", so no suffix is glued onto a bold label.

**Spot check (all three):** account-password, calendar-reminders, habits-streaks, lists-due-reminders and start-join. I wrote every article from a table of English label → ARB key → sk/ro/tr value, built from `app_en.arb` at the tag. For these five, I checked each bold label against that table and the ARB. They had no mismatches apart from the placeholder labels below.

## Labels the ARB didn't have (and what I wrote)
- **Hold to leave** (wall board): left in English, as in the other languages.
- Labels with a placeholder: I used the ARB text without the variable part.
  - sk: **Pripojiť sa k rodine**, **Odškrtávaš za:**, **Pridať 6 položiek**, **Pripomenúť mi v ten deň**, **Rodinná energia**
  - ro: **Alătură-te familiei**, **Bifezi pentru**, **Adaugă 6 articole**, **Amintește-mi în ziua respectivă**, **Energia familiei**
  - tr: **ailesine katıl** (the button starts with the family name, so the text says so), **Şu kişi için sen işaretliyorsun:**, **6 öğe ekle**, **O gün bana hatırlat**, **Aile enerjisi**
- The phone's own menus (widgets): iPhone **Upraviť → Pridať widget** / **Editează → Adaugă un widget** / **Düzenle → Widget Ekle**. Android **Miniaplikácie** / **Widgeturi** / **Widget'lar**. Focus / Do Not Disturb: režim sústredenia + Nerušiť / Concentrare + Nu deranja / Odaklanma + Rahatsız Etmeyin.
- The habit reminder's Done button uses `todoReminderActionDone` (I checked `habit_reminder_actions.dart`): Hotovo / Gata / **Tamamlandı**. Edit-home Done (`dashboardEditDone`) is Hotovo / Gata / **Bitti**.

## ARB notes (not English issues; worth a look in the app)
- **sk mixes vy and ty:** "Klepnutím na Upraviť to zmeníte." (`calendarEmptyHintTapEdit`) and "Tip: skúste jedno slovo…" (`recipeSearchOnlineEmptyHint`). It also uses both "klepni" and "ťukni", and three words for delete: Vymazať, Odstrániť (`shoppingCategoryDeleteConfirm`) and Zmazať (`habitsDelete`). The articles quote each label as it is.
- sk `listDetailGroupCompleted` = "Hotovo", the same word as Done. sk `habitsFormMoreTitle` = "Ďalšie", but `habitsDetailMore` = "Viac".
- **ro Celebration:** `celebrationTypeCelebration` = "Sărbătoare", but `calendarOverlayCelebrationLabel` and `celebrationDetailLoadingTitle` = "Aniversare", which is also the Anniversary type. ro `listsTodosBannerSubtitle` uses the plural "Țineți".
- ro `mealPlanTitle` = "Meniu", `photosTitle` = "Poze", admin = "Admin". The articles use those words.
- **tr mixes siz into sen:** "Tip… deneyin" (`recipeSearchOnlineEmptyHint`). tr has three words for Done: Bitti, Tamamlandı, Tamam. The Completed group is also "Tamamlandı". The habit form says "Hatırlatma", but the calendar says "Hatırlatıcı".
- tr Admin = "Yönetici", so the articles say yönetici.

## English issues
None new. The two from 009 still apply:
- `lists-categories`: the note is about deleting a category, but no step says how.
- `anywhere-wall`: the board is in English only for these readers.

## SHAs
- `fa6d7b1` docs(plan): prompt
- `34a7a07` feat(help): Slovak (sk)
- `ce1cdd6` feat(help): Romanian (ro)
- `cc8122d` feat(help): Turkish (tr)

Help impact: none
