# Feature vocabulary — inherited from the app, not invented here

Generated from `familyplanner-app/lib/l10n/app_*.arb` by `node tools/glossary.mjs`.
**These are the words the app itself shows on its tabs and tiles**, and the
website must use the same ones — see the note in tools/glossary.mjs for why.

Locales missing below (ja, ko, zh-Hans, zh-Hant, tr, ar, cs, fi, th, ru, id, hi)
have no app translation yet. Their terms are decided on the website first; hand
this table back to the app when it adds them, so the vocabulary is chosen once
for both products.

Two to watch, because they are not the obvious cognate:
- **fr**: the calendar is *Agenda*, shopping is *Courses*.
- **nl**: the family is *Gezin*, not *Familie*.
- **pt** is Brazilian (*Cardápio*, not *Ementa*), matching the app's decision.

| locale | Calendar   | Shopping     | To-dos    | Lists   | Meal plan   | Recipes     | Birthdays     | Documents  | Photos   | Family   |
|--------|------------|--------------|-----------|---------|-------------|-------------|---------------|------------|----------|----------|
| da     | Kalender   | Indkøb       | Opgaver   | Lister  | Madplan     | Opskrifter  | Fødselsdage   | Dokumenter | Billeder | Familie  |
| de     | Kalender   | Einkaufen    | Aufgaben  | Listen  | Essensplan  | Rezepte     | Geburtstage   | Dokumente  | Fotos    | Familie  |
| en     | Calendar   | Shopping     | To-dos    | Lists   | Meal plan   | Recipes     | Birthdays     | Documents  | Photos   | Family   |
| es     | Calendario | Compras      | Tareas    | Listas  | Menú        | Recetas     | Cumpleaños    | Documentos | Fotos    | Familia  |
| fr     | Agenda     | Courses      | Tâches    | Listes  | Menus       | Recettes    | Anniversaires | Documents  | Photos   | Famille  |
| it     | Calendario | Spesa        | Attività  | Liste   | Menu        | Ricette     | Compleanni    | Documenti  | Foto     | Famiglia |
| nb     | Kalender   | Innkjøp      | Oppgaver  | Lister  | Matplan     | Oppskrifter | Bursdager     | Dokumenter | Bilder   | Familie  |
| nl     | Agenda     | Boodschappen | Taken     | Lijsten | Menuplanner | Recepten    | Verjaardagen  | Documenten | Foto's   | Gezin    |
| pl     | Kalendarz  | Zakupy       | Zadania   | Listy   | Jadłospis   | Przepisy    | Urodziny      | Dokumenty  | Zdjęcia  | Rodzina  |
| pt     | Calendário | Compras      | Tarefas   | Listas  | Cardápio    | Receitas    | Aniversários  | Documentos | Fotos    | Família  |
| sv     | Kalender   | Inköp        | Uppgifter | Listor  | Matsedel    | Recept      | Födelsedagar  | Dokument   | Foton    | Familj   |

## Decided on the website first

The app has no label for these yet, because the feature does not exist in the
app. The website picks the word; hand it back when the app grows one. The other
twelve locales' wording lives in `nav.webApp` / `web.eyebrow` in `content/*.json`.

| term    | da     | de      | en      | es      | fr              | it      | nb      | nl     | pl            | pt      | sv      |
|---------|--------|---------|---------|---------|-----------------|---------|---------|--------|---------------|---------|---------|
| Web app | Webapp | Web-App | Web app | App web | Application web | App web | Nettapp | Webapp | Aplikacja web | App web | Webbapp |

## Habits and Notes (added 2026-09-27)

The `features.habits.eyebrow` and `features.notes.eyebrow` of every locale.
Read from the app's `dashboardTileHabits` / `dashboardTileNotes` (the Home
tiles; `habitsTitle` / `notesTitle` say the same). Every app locale has them,
so only **ar, hi, ru** (no ARB) are decided on the website; zh-Hans is the
app's `app_zh.arb`.

| locale  | Habits        | Notes         |
|---------|---------------|---------------|
| ar      | العادات       | الملاحظات     |
| bg      | Навици        | Бележки       |
| cs      | Návyky        | Poznámky      |
| da      | Vaner         | Noter         |
| de      | Gewohnheiten  | Notizen       |
| el      | Συνήθειες     | Σημειώσεις    |
| en      | Habits        | Notes         |
| es      | Hábitos       | Notas         |
| fi      | Tavat         | Muistiinpanot |
| fr      | Habitudes     | Notes         |
| hi      | आदतें         | नोट्स         |
| id      | Kebiasaan     | Catatan       |
| it      | Abitudini     | Note          |
| ja      | 習慣          | メモ          |
| ko      | 습관          | 메모          |
| nb      | Vaner         | Notater       |
| nl      | Gewoontes     | Notities      |
| pl      | Nawyki        | Notatki       |
| pt      | Hábitos       | Notas         |
| ro      | Obiceiuri     | Notițe        |
| ru      | Привычки      | Заметки       |
| sk      | Návyky        | Poznámky      |
| sv      | Vanor         | Anteckningar  |
| th      | นิสัย         | โน้ต          |
| tr      | Alışkanlıklar | Notlar        |
| uk      | Звички        | Нотатки       |
| zh-Hans | 习惯          | 笔记          |
| zh-Hant | 習慣          | 筆記          |
