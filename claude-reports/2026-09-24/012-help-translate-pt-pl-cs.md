# 012 — Help center in Portuguese, Polish, Czech

Status: done · all 3 languages · `HELP_LOCALES = [..., 'es', 'pt', 'pl', 'cs']` · `npm run build` green (1122 pages; pt/pl/cs.json each 64 articles, 9 tips, 6 checklist) · pushed, not deployed

## Per language
| | pt | pl | cs |
|---|---|---|---|
| Done | yes | yes | yes |
| Build | green after 1 fix (tip missing in habits-what, caught by check-help) | green first try | green first try |
| Register | você, "Toque em…" (Brazilian, as the ARB: Configurações, Salvar, Excluir, celular, Cardápio) | ty, "Dotknij…" | ty, "Klepni na…" |
| Plural forms in `_ui.json` | one / many / other | one / few / many / other | one / few / many / other |

Labels come from the ARB at the live tag `v1.6.0+11`. For pt/pl/cs the working tree only adds keys (widgets, help UI), so no article label differs. In pl and cs I put a noun before a bold label ("pole **Nazwa**", "na obrazovce **Kalendář**") so the label can stay in the ARB's own form, not declined. I kept the text gender-neutral: no "zapomniałeś" or "abys mohl".

**Spot check (all three):** account-password, calendar-reminders, habits-streaks, lists-due-reminders and start-join, each re-read against the ARB. A script also checked **every** bold label in the 192 files against that language's ARB. The only labels not in the ARB are the ones below, plus the bold lead-ins in notifications-help and vault-where, which are sentences, not labels.

## Labels the ARB didn't have (and what I wrote)
- **Hold to leave** (wall board): stays in English, as in the other languages.
- Labels with a placeholder: I used the ARB text without the variable part.
  - pt: **Entrar em**, **Marca por**, **Adicionar 6 itens**, **Me lembrar no próprio dia**, **Energia da família**
  - pl: **Dołącz do**, **Odhaczasz za**, **Dodaj 6 artykułów**, **Przypomnij mi tego dnia**, **Energia rodziny**
  - cs: **Připojit se k rodině**, **Odškrtáváš za:**, **Přidat 6 položek**, **Připomenout mi v ten den**, **Rodinná energie**
- The phone's own menus (widgets): iPhone **Editar → Adicionar Widget** / **Edycja → Dodaj widżet** / **Upravit → Přidat widget**. Android **Widgets** / **Widżety** / **Widgety**. Focus / Do Not Disturb: Foco + Não perturbe / Skupienie + Nie przeszkadzać / Soustředění + Nerušit.
- Both Done labels (`todoReminderActionDone`, `dashboardEditDone`) are Concluído / Gotowe / Hotovo.

## ARB notes (not English issues; worth a look in the app)
- **pt mixes in European Portuguese.** The app is Brazilian (você, Configurações, celular), but habits and the newsletter use tu/PT-PT: "Queres novidades do daili?", "Sim, inscreve-me", "Marca por", "Criar o seu", "Postais", "Tenta de novo", "Podes…". Also `providerConnectCta` = "Ligar" (Brazil: Conectar), `calendarSettingsPhoneOpenSettings` = "Abrir ajustes" next to "Abrir as configurações" elsewhere, and a few "guardar"/"eliminar" next to "salvar"/"excluir". The articles are Brazilian and quote those labels exactly.
- **The cat's gender:** "o gato" / "kot" are masculine in pt/pl, so the articles say "he". Czech "kočka" is feminine, like the English "she".
- pt `celebrationTypeAnniversary` = "Data especial", because "Aniversário" already means birthday.
- `loginGoRegister` and `registerSubmit` are the same in pt ("Criar conta") and pl ("Załóż konto"). cs has "Zaregistrovat se" / "Vytvořit účet".
- `activityTitle` = "Novidades" / "Nowości" / "Aktivita". The articles call it "a lista de novidades" / "lista nowości" / "seznam aktivit".
- `calendarViewAgenda` = "Lista" in pt and pl, so the article titles say lista. cs says "Agenda".
- `settingsSectionPreferences` = Geral / Ogólne / Předvolby.
- cs `listDetailGroupCompleted` = "Hotovo", the same word as Done. cs `habitsFormMoreTitle` = "Další", but `habitsDetailMore` = "Více".
- The pl ARB sometimes capitalises Ty/Ciebie ("Widzisz je tylko Ty", "dla Ciebie") and sometimes doesn't ("Wysłaliśmy Ci"). The articles use lower case in running text and quote labels as they are.
- cs admin = "Správce", so the articles say správce, not admin.

## English issues
None new. The two from 009 still apply: `lists-categories` (the note is about deleting a category, but no step says how) and `anywhere-wall` (the board is in English only for these readers).

## SHAs
- `9cb9b72` docs(plan): prompt
- `ba1962b` feat(help): Portuguese (pt)
- `56c1ec7` feat(help): Polish (pl)
- `0eaac70` feat(help): Czech (cs)

Help impact: none
