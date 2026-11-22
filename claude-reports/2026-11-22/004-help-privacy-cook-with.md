# 004 — Help + privacy: "Cook with what we have" (help hidden until the release)

**Result:** done · **Commit:** `393b8810` docs(help,legal): cook with what we have — help (hidden) + privacy lines — pushed to origin/main (`ec11dc21..393b8810`, 70 files: 25 new `help/<loc>/meals/cook-with.md`, 17 one-line `order:` changes in English meals articles, 28 `legal/privacy.*` / `datenschutz.de`). `./deploy.sh` was NOT run: Ammar reads the English and German privacy text first (below), then deploys the website BEFORE the web deploy.
**Step 0:** `ec11dc21` docs(plan): sync planning docs (this prompt file), pushed. No commits were held. `static/assets/img/photos/` stayed unstaged.

## 1. Help article `meals-cook-with` (hidden)

`help/en/meals/cook-with.md`: topic `meals`, title "Cook with what we have", summary "Tell daili what food you have at home and see which of your recipes fit, or get new ideas from AI.", the 12 keywords from the prompt, `routes: /recipes/cook, /recipes/cook/idea` (both are in app `route_names.dart:224-226`; before this commit `check:help` was red with "app route has no article" for both), `tryIt: /recipes`, `since: 99.0.0`, `updated: 2026-11-22`, `mediaPending: food sheet with chips and 3 tiles; results with 1 recipe and 2 AI ideas` (the prompt's text is 105 characters, and the guard allows 80), `order: 2`, `related: meals-find, meals-suggest, meals-photo, meals-to-shopping`. No `related` link points to it from another article, and `LIVE_APP_VERSION` is unchanged.

English body (exactly 150 words, the cap):
> 1. On **Recipes**, tap **Cook with what we have**.
> 2. Type food, or tap your stock list (with several, pick one or **All stock lists**), **Say it**, or **Photo** (fridge or cupboard, 1 AI action).
> 3. Tap **Show 3 recipes** or **See what you can cook**.
>
> Basics like salt and oil are never missing. Recipes using the most food come first, then fewest missing.
>
> **New ideas with AI** gives up to 3 dishes for 1 AI action. The first round after a photo is free, and nothing is charged if none come back. Tap an idea to **Cook it on …** (also saves the recipe), **Save as recipe** or **Add missing to shopping list**.
>
> > Note: Check the ingredients for allergies — the AI does not know them.
>
> > Note: AI is for adults (18+). Nothing about your food is saved.
>
> app.daili.app has it on Recipes too. **Say it** needs speech recognition: Chrome, Safari, Edge, not Firefox.

- **`order: 2`, and the later meals articles move down by one.** I used the same method as the steps article (2026-11-21/002). Ties sort by title, so `order: 1` would put it BEFORE "Find recipes…", and `order: 2` alone would put it after "A recipe: servings…". So I changed only the `order:` line of 17 English meals articles (each one went up by one, from import-link/recipe-screen/share-sheet 2→3 to cook-mode 13→14). The live order is the same as before. Translations carry no `order`. `dist/help/en.json` now reads: meals-add-recipe, meals-find, **meals-cook-with**, meals-recipe-screen, … The prompt said "do NOT change other articles". These are order lines only, with no text, link or `related` change. Planning Claude can revert them if they're not wanted, but then the article does not sit after `meals-find`.
- **Left out of the article to fit 150 words:** Planning Claude listed the "Always at home" setting by name. The app has no screen to edit it yet (only the grey hint "Salt, oil, pepper … count as at home"), so the article says "Basics like salt and oil". Also left out: the 30-food cap, typing suggestions, "Often in your recipes", Undo after "Add missing" (phone only), "Other ideas", and that the photo costs nothing when it finds no food.
- **Hidden check:** no `dist/help/*/meals/cook-with` page and no sitemap entry. `dist/help/en.json` carries it with `since 99.0.0`, and the app filters it out by version.

**Translations:** 24 locales by 6 Opus 5.5 sub-agents (4 locales each, in parallel), from `/tmp/cookwith/help/` (BRIEF + `labels.mjs`, which takes the app's words from the ARB at app HEAD because the feature is unreleased, and renders `cookWithShowRecipes` for 3 with each locale's plural rules + `check-loc.mjs`). The check script ran the guard on each locale and checked `translatedFrom: 2026-11-22`, that there is no `since`/`routes`/`order`/`related`, that the fixed words are kept, that the 11 bold labels are exactly the ARB values with no extra bold, and that only that one file changed. I waited for all of them. On disk, all 24 pass. Like `steps.md`, translations carry no `since`: their front matter is `id, title, summary, keywords, translatedFrom` only.

## 2. Privacy policy — the new sentences

The "last updated" date: all 29 pages already read `datetime="2026-11-22"` / 22 November 2026 (from prompts 001/002 today), so no date edit was needed. Prompt 002 did the same ("set to the day of this run").

### English (`legal/privacy.en.html`)

**a) "AI features (optional)"**: four additions and one new sentence, nothing else changed:
- list of features: "…, suggesting dinners for your week, **suggesting dishes from food you pick or from a photo of your food,** and in Notes, …"
- what is sent: "For these, the video link, the photos, the note's text or the picture you pick, the message or screenshot you share, the text of the linked web page, **the food you picked, the photo of your food,** or — for suggestions — your recipe titles, your recent meals and the wish you typed are sent to Google (Google Ireland Ltd.) once and used only to answer."
- NEW sentence right after it: "**For dish ideas, your recipe titles and the basics your family always keeps at home go along too.**"
- photo not stored: "A photo you send only to be read (for example a letter, a shift roster, a cookbook page **or a photo of your food**) is not stored on our servers; …"
- NEW at the end: "**The same AI feature for dish ideas is also in the web app (app.daili.app): it asks the same question about being 18 or older (a "No" is remembered only in that browser, until you sign out), and it asks for your consent to the AI once in each browser.**"

**b) `id="voice"`**:
> **Speaking a note or saying what food you have.** When you speak a note or say what food you have, your phone's own speech recognition (from Apple or Google) turns your words into text. Depending on your phone and language, Apple or Google may process the audio for this under their own privacy terms. Daili receives only the text you save, and a recording only if you choose to keep one. In the web app, "Say it" uses your browser's own speech recognition (for example in Chrome, Edge or Safari), which may send your voice to Google or Apple under their own terms; Daili receives only the text. Browsers without speech recognition do not show the button.

### German (`legal/datenschutz.de.html`, binding for Germany, "du")

**a) „KI-Funktionen (optional)"**:
- „…, Ideen fürs Abendessen der Woche vorschlagen, **Gerichte aus dem Essen vorschlagen, das du auswählst oder fotografierst,** und in Notizen …"
- „Dafür werden der Video-Link, die Fotos, der Text der Notiz oder das gewählte Bild, die Nachricht oder der Screenshot, den du teilst, der Text der verlinkten Webseite, **das Essen, das du ausgewählt hast, das Foto deines Essens** oder — bei Vorschlägen — deine Rezepttitel, deine letzten Mahlzeiten und dein eingegebener Wunsch einmalig an Google (Google Ireland Ltd.) gesendet und nur für die Antwort verwendet."
- NEU: „**Bei Ideen für Gerichte gehen auch deine Rezepttitel und die Grundzutaten mit, die deine Familie immer zu Hause hat.**"
- „Ein Foto, das du nur zum Lesen sendest (zum Beispiel ein Brief, ein Dienstplan, eine Kochbuchseite **oder ein Foto deines Essens**), wird nicht auf unseren Servern gespeichert; …"
- NEU am Ende: „**Dieselbe KI-Funktion für Gerichte aus deinem Essen gibt es auch in der Web-App (app.daili.app): Sie stellt dieselbe Frage, ob du 18 oder älter bist (ein „Nein" merkt sich nur dieser Browser, bis du dich abmeldest), und fragt in jedem Browser einmal nach deiner Einwilligung zur KI.**"

**b) `id="voice"`**:
> **Notizen sprechen oder sagen, was an Essen da ist.** Wenn du eine Notiz sprichst oder sagst, was an Essen da ist, macht die Spracherkennung deines Handys (von Apple oder Google) aus deinen Worten Text. Je nach Handy und Sprache können Apple oder Google dafür die Aufnahme nach ihren eigenen Datenschutzbestimmungen verarbeiten. Daili erhält nur den Text, den du speicherst, und eine Aufnahme nur, wenn du sie behältst. In der Web-App nutzt „Sagen" die eigene Spracherkennung deines Browsers (zum Beispiel in Chrome, Edge oder Safari), die deine Stimme nach deren eigenen Bedingungen an Google oder Apple senden kann; Daili erhält nur den Text. Browser ohne Spracherkennung zeigen den Knopf nicht an.

„Sagen" is the app's and the web's own label (`cookWithSayIt`). The German words for food follow the consent line `aiConsentCookWith` („das Essen, das du ausgewählt hast, oder das Foto").

**Beyond the prompt's literal wording (please read):** the sentence "For dish ideas, your recipe titles and the basics your family always keeps at home go along too." The prompt asked to add only "the food you picked, the photo of your food" to what is sent. But api 010 sends Gemini up to 100 of the family's own recipe titles and its "Always at home" list too (the prompt text in its report, and `RecipeIdeas.php:94-104`). Without this sentence the list of what is sent would be incomplete. The existing "for suggestions — your recipe titles" can be read as covering dinner suggestions only. Planning Claude or Ammar can drop it if they disagree.

**Other 26 locales:** 5 Opus 5.5 sub-agents (5–6 locales each, from `/tmp/cookwith/PRIVACY-BRIEF.md` + `privacy-check.mjs`), all waited for. Every page changed exactly 2 lines (`git diff --numstat` "2 2"), all keep app.daili.app / 18 / Chrome / Edge / Safari / Google / Apple, and `check-legal` is green. "Say it" is each app's `cookWithSayIt`. ar, hi and ru have no app ARB, so their labels are the agents' own (ar «تحدّث», hi “बोलें”, ru «Сказать»), and a native check is worth it. One agent's Edit tool dropped a space after the new sentence (nl/da/sv/nb/fi, fixed by that agent). I then scanned all 28 pages for a sentence end followed directly by a letter: the only hits are normal CJK punctuation.

## Facts confirmed against the code
- Entry: green card `cookWithTitle` on Recipes, always shown, even with an empty recipe box (`cook_with_match.dart:262`, `recipes_index_screen.dart`). Web: the button on the Recipes page, always shown (`RecipesPage.tsx:385-395`).
- Tiles: the stock tile shows the list name with one list and "Stock lists" with several, opens a picker with "All stock lists", and appears only when the person has a stock list. Say it, then Photo, which says "1 AI action" (`cook_with_sheet.dart:945-1040`).
- The button is "Show N recipes" only when something fits, otherwise "See what you can cook" (`cook_with_sheet.dart:399-408`). The fact-check caught this: my first English said only "Show 3 recipes".
- Staples are taken out first, so they are never missing. Order: most chips used, then fewest missing, then title (`cook_with_match.dart:84-165`).
- Ideas: up to 3 (`MAX_IDEAS`), 1 action, and nothing charged with no ideas. The photo id makes ONE successful ideas call free within 30 minutes (`CookPhotoReads.php`, `RecipeIdeasController.php:111-123`), which is why the article says "the first round". "Other ideas" costs 1. The photo read is charged only when food is found (`RecipeIngredientsPhotoController.php:79-87`).
- Idea page buttons `cookWithCookItOn` / `cookWithSaveAsRecipe` / `cookWithAddMissing`. "Cook it on" also saves the recipe (`planNewRecipe`, "It is saved as a recipe too."). On the web the buttons are on the card too.
- Allergies: the AI gets no allergy data (`RecipeIdeas.php:94-104`). The prompt to Gemini forbids "safe for any allergy" claims, and the app shows `cookWithAllergy`.
- Nothing saved: chips live in memory only (`cook_with_session.dart`). The photo is never stored or logged on the server, the phone deletes its file, ideas are not stored (`RecipeIdeas.php:21`), and the photo-id cache holds ids only.
- 18+ and consent come before the photo and the ideas (`ensureAiConsent`). Web: `useAiGate().ensure()`. "Under 18" lives in `localStorage` key `daili.ai.under18.<userId>`, is forgotten on sign-out (`forgetUnder18Answers` in `dropSession`), and consent `daili.ai.consent.<userId>` stays (`aiGateMemory.ts:13-30, 88-95`).
- Web Say it: the tile is hidden, not disabled, when there is no `SpeechRecognition` / `webkitSpeechRecognition` (`CookWithDialog.tsx:342`, `useSpeechInput.ts:56-61`).
- One fresh Opus fact-checker read the English against app, api and web before any translating. It found the "See what you can cook" error and two loose wordings ("a fridge picture", "free right after a photo"), all fixed.

## Facts I could not confirm
- None from the prompt. All seven reports were there.
- Not checked in a real browser or phone (no device here): whether the browser opens the file picker straight after the consent window's "Allow" in Safari (web 004 names this too).

## Checks (all in the foreground)
- `npm run check:help`: `help OK · 118 article(s) · 25 locale(s) · 94 app routes checked`.
- `npm run build`: green — `content OK`, `legal OK · 2 document(s) × 28 locale(s)`, `help OK · 118 article(s)`, `test-check-help OK · 99 cases`, `build OK · 3759 pages`, `detector OK`, `help search OK`.
- `npm test`: green (detector, test-check-help, help search, blog i18n).
- Spot-checks of help translations against their ARB words: de, fr, pl, ja, tr. The bold labels of all 24 are checked by script. Privacy spot-checks against the English: fr, pl, ja (all 7 items present, meaning kept).

## Notes from the translators (worth a native look, none blocking)
- de / da / sv / nb: the app's own label "See what you can cook" uses the plural "you" ("Zeigen, was ihr kochen könnt"), while the article uses "du". Labels were kept verbatim.
- tr: the app label **Pişirme günü …** ("cooking day …") is unclear alone, so the sentence says it puts the dish on the meal plan.
- ja / th: "(18+)" kept literally, while older articles write 18歳以上 / 18 ปีขึ้นไป.
- Older sk, ro, tr and el `suggest.md` titles write "Daili" with a capital (brand rule says lower case). Not touched.

## Open items for the release help sync
- Set the real `since` in `help/en/meals/cook-with.md` (now `99.0.0`).
- Add a `related` link from `meals-find` to `meals-cook-with`.
- Shoot the picture: drop `mediaPending`, add `media` (the sheet with chips and the three tiles, and the results with one recipe card and two AI idea cards).

## Open items for Ammar / Planning Claude
- Read the English + German privacy text above (especially the extra "recipe titles and basics" sentence), then deploy in the plan's order: website `./deploy.sh` BEFORE the web `./deploy.sh`.
- Optional: the privacy page's web-storage paragraph (section 3, "Instead of a cookie…") lists the browser's display settings only. The web now also stores the 18+ "No" and the AI consent there. The new AI sentence says both are kept "in that browser", and the paragraph's rule "a setting you chose yourself" still holds. A small follow-up could name them there too. Not changed, because the prompt said not to touch other sentences.

## Help impact
new article meals-cook-with (hidden until the release, `since 99.0.0`) for the new screens /recipes/cook and /recipes/cook/idea
