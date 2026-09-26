# 011 — Help center in French, Italian, Spanish

Status: done · all 3 languages · `HELP_LOCALES = ['en', 'de', 'nl', 'sv', 'da', 'nb', 'fi', 'fr', 'it', 'es']` · `npm run build` green (894 pages; fr/it/es.json each 64 articles, 9 tips, 6 checklist) · pushed, not deployed

## Per language
| | fr | it | es |
|---|---|---|---|
| Done | yes | yes | yes |
| Build | green after 1 fix (`articleCount.many` missing) | green first try | green after 1 fix (13 keywords in account-feedback) |
| Register | tu, "Touche…" | tu, "Tocca…" | tú, "Toca…" (Spain Spanish, as the ARB: Ajustes, Añadir, Guardar) |

The engine wants every CLDR plural form, and fr/it/es have a `many` form. I added it to all three `_ui.json` files ("{n} d’articles" / "{n} di articoli" / "{n} de artículos").

**Spot check (all three):** habits-tick, lists-due-reminders, calendar-repeating, meals-to-shopping and family-invite, each re-read against the ARB. A script also checked **every** bold label in the 192 files against that language's ARB. The only labels not in the ARB are the ones listed below.

## Labels the ARB didn't have (and what I wrote)
- **Hold to leave** (wall board): daili-web only has en/de, so all three keep the English words, the same as nl/sv/da/nb/fi.
- Labels with a placeholder: I used the ARB text without the variable part. **Rejoindre** / **Entra in** / **Unirse a**, each "followed by the family's name". **Vous validez pour** / **Spunti tu per** / **Tú marcas por**, **Ajouter 6 articles** / **Aggiungi 6 articoli** / **Añadir 6 artículos**, **Me le rappeler le jour même** / **Ricordamelo il giorno stesso** / **Recordármelo el mismo día**, and **Énergie de la famille** / **Energia della famiglia** / **Energía de la familia**.
- The phone's own menus (widgets): iPhone **Modifier → Ajouter un widget** / **Modifica → Aggiungi widget** / **Editar → Añadir widget**. Android **Widgets** / **Widget** / **Widgets**. Focus / Do Not Disturb: Concentration + Ne pas déranger / Full immersion + Non disturbare / Concentración + No molestar.
- The notification's Done uses `todoReminderActionDone`: Terminé / Fatto / Hecho. The Home edit Done uses `dashboardEditDone`: Terminé / Fatto / Listo.

## ARB notes (not English issues; worth a look in the app)
- **fr habits use "vous"** ("Créer la vôtre", "Vous validez pour", "Cochez vos habitudes", "Réessayez"), while the rest of the French app uses "tu". The articles use tu, and quote those labels exactly as they are.
- **The cat is "he" in fr/it/es.** The app says "le chat" / "il gatto" / "el gato", and the French postcard says "m'a emmené". English says "she". I followed the app and kept pronouns to a minimum (French repeats "Minzi").
- fr `celebrationTypeAnniversary` = "Date importante", because "Anniversaire" already means birthday. The article follows the ARB.
- `settingsSectionPreferences` = Général / Generali / General. `calendarViewAgenda` = Liste / Elenco / Lista, and the article titles match.
- it `activityTitle` = "Novità", es = "Novedades". The articles call the activity list "l'elenco delle novità" / "la lista de novedades".
- fr and es `loginGoRegister` and `registerSubmit` are the same ("Créer un compte" / "Crear cuenta"), as in sv/da/nb.
- es `celebrationTypeBirthday` and the Birthdays tile are both "Cumpleaños".
- fr `listDetailGroupCompleted` = "Terminé" (singular, masculine) as a section title over several items. It looks odd.

## English issues
None new. The two from 009 still apply: `lists-categories` (the note is about deleting a category, but no step says how) and `anywhere-wall` (the board is in English only for these readers).

## SHAs
- `dcc888f` docs(plan): prompt
- `b831f35` feat(help): French (fr)
- `1258295` feat(help): Italian (it)
- `23fbf28` feat(help): Spanish (es)

Help impact: none
