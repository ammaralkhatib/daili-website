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
