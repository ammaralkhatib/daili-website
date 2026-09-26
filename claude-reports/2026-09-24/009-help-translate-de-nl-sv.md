# 009 — Help center in German, Dutch, Swedish

Status: done · all 3 languages · `HELP_LOCALES = ['en', 'de', 'nl', 'sv']` · `npm run build` green (438 pages; de/nl/sv.json each 64 articles, 9 tips, 6 checklist) · pushed, not deployed

## Per language
| | de | nl | sv |
|---|---|---|---|
| Done | yes | yes | yes |
| Build | green (1 fix: 13 keywords in account-feedback) | green first try | green first try |
| Register | du (as the ARB) | je/jij | du |

**Spot check (all three languages):** family-invite, calendar-repeating, lists-due-reminders, habits-tick, account-preferences, each re-read against the ARB. On top of that, a script checked **every** bold label in the 192 files against that language's ARB. That found German declined forms (**Namen**, **Anzeigenamen**, **Ordnernamen**, **Albumnamen**, **Neue Passwort**). I reworded them to the exact labels in a separate commit (`76f21e8`).

## Labels the ARB didn't have (and what I wrote)
- **Hold to leave** (wall board): this is in daili-web, not the ARB. For de I used daili-web's own `de.ts`: **Zum Verlassen gedrückt halten**. daili-web has no nl or sv, so nl and sv keep **Hold to leave** in English, because that is what those readers see on the board.
- Labels with a placeholder: I used the ARB text and replaced the variable part with "…" or dropped it. That covers **… beitreten** / **Deelnemen aan …** / **Gå med i …**, **Du hakst für … ab** / **Jij vinkt af voor** / **Du bockar av åt**, **6 Artikel hinzufügen** / **6 items toevoegen** / **Lägg till 6 varor**, **Am Tag erinnern** / **Herinner me op de dag zelf** / **Påminn mig på dagen**, and **Familienenergie** / **Gezinsenergie** / **Familjens energi**.
- The phone's own menus (widgets): iPhone **Bearbeiten → Widget hinzufügen** / **Wijzig → Voeg widget toe** / **Redigera → Lägg till widget**; Android **Widgets** / **Widgets** / **Widgetar**.
- The habit notification's "Done" uses `todoReminderActionDone`, which is what the app's code uses: Erledigt / Klaar / Klar.

## ARB notes (not English issues; worth a look in the app)
- de `calendarViewAgenda` = "Tagebuch" (diary) looks wrong for an agenda/list view. I followed the ARB and titled the article after it.
- de `settingsSectionPreferences` = "Präferenzen" and sv = "Allmänt" (general). I followed both.
- sv: `loginGoRegister` and `registerSubmit` are both "Skapa konto". The sign-in article says "tryck sedan på **Skapa konto** igen".

## English issues
- `lists-categories`: the note is about deleting a category, but no step says how to delete one (step 4 only covers rename, emoji and hide).
- `anywhere-wall`: fine as written, but the board is only translated into en and de on the web, so non-German readers get English there.

## SHAs
- `403b8e2` docs(plan): prompt
- `e149efd` feat(help): German (de)
- `9ee9577` feat(help): Dutch (nl)
- `346b8de` feat(help): Swedish (sv)
- `76f21e8` fix(help): German labels use the app's exact words (an extra commit on top of the one per language)

Help impact: none
