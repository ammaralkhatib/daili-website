# Help 1.7.0 part 2: Notes touchpoints, backup wording, relabels — 25 languages

**Prompt:** `claude-prompts/2026-09-26/003-help-updates-1-7-0.md`
**Completed:** 2026-09-26 · **Status:** done (small deviations below)

## What changed (English + 24 translations, `updated`/`translatedFrom: 2026-09-26`)
1. **start-home**: step 1 now says the card shows the family's **next** event (tap it for the whole week). Step 2 names **Notes** in place of Family. There is a new paragraph about the **Get started with daili** card (`helpChecklistTitle`) and **Hide this list**. I left out the tile's "N shared with you" text so the body stays short.
2. **start-edit-home**: one sentence: every tile can move or hide, **Notes** too.
3. **family-activity**: **Note shared** shows in the list, with no notification.
4. **anywhere-widgets**: **Quick note** (opens a new note, counts this week's notes). On iPhone, a **New note** button on the lock screen. `notes-notes` added to `related` (links in the body are not allowed).
5. **meals-search-online**: the note now says: if the email isn't verified, the screen says so and has a **Resend** button.
6. **vault-where**: the backup step is replaced with the iPhone/Android facts from the prompt.
7. **calendar-add-event**: "Have the dates on paper? See **Fill an event from a photo**." `calendar-photo` added to `related`.

Labels come from each language's ARB (`helpChecklistTitle`, `helpChecklistHide`, `activityNoteShared`, `settingsEmailResendButton`, `widgetNotesQuickNote`). The iPhone lock-screen widget has a name only in en/de (`widget_notes_lock_name`), so the other languages describe it in plain words, without bold.

## Deviations (please check)
- **vault-where summary** ("…and it doesn't back them up") would now be false, so I rewrote it in every language. The English body had to fit 150 words, so I also shortened two sentences: "Sign in again on this phone…" and "Keep the original … somewhere else too." The translations keep their old step 3 and last paragraph, which are still true.
- **anywhere-widgets** said "daili has **three** widgets". Adding Quick note would make that wrong, so it now says "several widgets. For example …". **Open item:** widgets v2 (Habits, Next up, Birthday, Tonight's dinner, Quick add, lock screen) is not in this article yet. It needs its own help prompt.
- `start-home` summary ("Your family's week at the top…") I left as it is. It is still roughly true: tap the card and the week opens.

## Relabel table (`../familyplanner-app/claude-reports/2026-09-25/001-label-changes.json`, 235 rows)
**0 replacements in all 13 locales of the table** (bg da de fi fr id pl pt ro sk th tr uk: 0 each). For 227 rows, the old label is not in help at all. The 8 rows that did match, and why I left them:
| locale | key | old → new | why not replaced |
|---|---|---|---|
| th | recipeServingsLabel | จำนวนที่ → จำนวนที่เสิร์ฟ | only found inside **จำนวนที่เสิร์ฟ** (already new) |
| th | listDetailItemNoteLabel, mealPlanEntryNoteLabel | บันทึก → โน้ต | all 40 hits are **Save** (`commonSave` is still บันทึก) or the verb "saved" |
| fi | settingsSectionPreferences | Asetukset → Yleiset | all hits are the Settings screen (`settingsTitle` is still Asetukset). preferences.md already says **Yleiset** |
| bg | settingsSectionAccount | Профил → Акаунт | hits are the Profile screen (`profileTitle`) or plain prose. The alt texts already say Акаунт |
| ro | calendarOverlayCelebrationLabel, celebrationDetailLoadingTitle | Aniversare → Sărbătoare | the hit is the Anniversary type (`celebrationTypeAnniversary` is still Aniversare), listed next to **Sărbătoare** |
| id | listDetailAddItemHint | Tambah barang → Tambah item | only in a summary sentence ("Add items…"), not the field label |

German **calendar-views** already said **Liste** (spot-check OK).

## Verification
- `node tools/check-help.mjs`: help OK, 68 articles, 25 locales, 60 app routes.
- `npm run build`: build OK, 2034 pages. The 17 warnings are the old site-copy length ratios (same as report 001). No "older than English" warning.
- Spot-checks: `de` calendar-views shows "Liste". `en` start-home mentions **Notes**. I checked the step-2 swap (Family → Notes) in de/fr/tr/ja/th/pl.

## SHAs
- 002: `71875fd` feat(help): Notes topic, Fill from a photo, Tips on/off (pushed)
- 003: see `git log` (this report is part of it)

## Help impact
start-home, start-edit-home, family-activity, anywhere-widgets, meals-search-online, vault-where, calendar-add-event: updated for 1.7.0 (text only, no new pictures).

## Open items for Ammar
- Help for widgets v2 (see above).
- After the release bump of `LIVE_APP_VERSION`: `./deploy.sh`.
