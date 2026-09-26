# 010 — Help center in Danish, Norwegian (Bokmål), Finnish

Status: done · all 3 languages · `HELP_LOCALES = ['en', 'de', 'nl', 'sv', 'da', 'nb', 'fi']` · `npm run build` green (666 pages; da/nb/fi.json each 64 articles, 9 tips, 6 checklist) · pushed, not deployed

## Per language
| | da | nb | fi |
|---|---|---|---|
| Done | yes | yes | yes |
| Build | green first try | green first try | green after 1 fix (13 keywords in account-feedback) |
| Register | du (as the ARB) | du | sinä, imperative "Napauta" (as the ARB) |

**Spot check (all three):** family-roles, calendar-reminders, lists-shopping, habits-streaks, account-password, each re-read against the ARB. A script also checked **every** bold label in the 192 files against that language's ARB. The only labels not in the ARB are the ones listed below. One fix came out of this: Danish now uses the ARB's word for the energy bar, "energilinje" (I had written "energibjælke"). That fix is part of the da commit.

Finnish needs case endings, so each bold label is kept exactly as in the ARB, and the sentence is built around it ("Napauta **Tallenna**", "kohdassa **Lapset**").

## Labels the ARB didn't have (and what I wrote)
- **Hold to leave** (wall board): daili-web has no da/nb/fi, so all three keep the English words, the same as nl/sv.
- Labels with a placeholder: I used the ARB text and replaced the variable part with "…" or dropped it. That covers **Deltag i …** / **Bli med i …** / **Liity perheeseen …**, **Du sætter flueben for** / **Du haker av for** / **Merkitset puolesta:**, **Tilføj 6 varer** / **Legg til 6 varer** / **Lisää 6 kohdetta**, **Mind mig om det på dagen** / **Minn meg på det på selve dagen** / **Muistuta minua sinä päivänä**, and **Familiens energi** / **Familiens energi** / **Perheen energia**.
- The phone's own menus (widgets): iPhone **Rediger → Tilføj widget** / **Rediger → Legg til widget** / **Muokkaa → Lisää widget**. Android **Widgets** / **Moduler** / **Widgetit**. For nb Android I'm not sure: Pixel and Samsung say "Moduler", but some launchers say "Widgeter". Focus / Do Not Disturb: Fokus + Forstyr ikke / Fokus + Ikke forstyrr / Keskittyminen + Älä häiritse.
- The notification's Done uses `todoReminderActionDone`: Færdig / Ferdig / Valmis.

## ARB notes (not English issues; worth a look in the app)
- fi `settingsSectionPreferences` = "Asetukset", the same word as Settings (`settingsTitle`). The preferences article says "open **Asetukset** … under the card **Asetukset**". da/nb use "Generelt". I followed the ARB.
- fi `calendarRepeatEvery` = "Toistuu" ("repeats"), not "every". I wrote "Muuta kohtaa **Toistuu**…".
- da/nb `loginGoRegister` and `registerSubmit` are both "Opret konto" / "Opprett konto" (same as sv). The sign-in article says "… tryk så på **Opret konto** igen".
- da `habitsMenuRestFooter` says "streak", while the labels say "stime" (`habitsStreakCurrent`). I used "stime".
- da `settingsSectionAbout` = "Om Daili" (capital D, the same for nb). I followed the ARB.
- da/nb `calendarViewAgenda` = "Liste". The article titles say "liste" to match.

## English issues
None new. The two from 009 still apply: `lists-categories` (the note is about deleting a category, but no step says how) and `anywhere-wall` (the board is English-only for these readers).

## SHAs
- `0a94c51` docs(plan): prompt
- `e156aed` feat(help): Danish (da)
- `51ad763` feat(help): Norwegian (nb)
- `ea9891d` feat(help): Finnish (fi)

Help impact: none
