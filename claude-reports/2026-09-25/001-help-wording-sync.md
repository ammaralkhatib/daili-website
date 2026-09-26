# Help texts follow the app's wording fixes + 2 English fixes

**Prompt:** `claude-prompts/2026-09-25/001-help-wording-sync.md`
**Completed:** 2026-09-25 · **Status:** done

## Replaced labels per locale (from `001-label-changes.json`)
- **id 12**: "Tambah barang" → **Tambah item** (todos, shopping step + alt), "Ubah barang" → **Ubah item** (4 alt texts), lists-move-items title/summary/steps → "item" ("barang" kept as keyword), **Kamu mencentang untuk** → **Anda mencentang untuk**.
- **pt 8**: Postais/postal → **Cartões-postais**/cartão-postal (habits-minzi ×4, habits-what), **Marca por** → **Você marca por**, **Quer novidades do daili?** / **Sim, quero me inscrever**.
- **bg 6**: section **Профил** → **Акаунт** (delete, password, download-data: step + alt). The screen title stays "Профил".
- **de 3**: Tagebuch → **Liste** (calendar-views title, summary, step). "tagebuch" kept as a keyword.
- **th 3**: note field บันทึก → **โน้ต** (todos, shopping), **จำนวนที่** → **จำนวนที่เสิร์ฟ** (add-recipe). **บันทึก** as the Save button stays.
- **pl 3**: **Przypomnienia (dla ciebie)** (step + alt), **Widzisz je tylko ty**.
- **fi 2**: card **Asetukset** → **Yleiset** (account-preferences text + alt).
- **uk 2**: album **Родина** (alt), **Так, підписатися**.
- **fr 2**: **Tu valides pour**, **Créer la tienne**.
- **ro, da, sk, tr: 0**. The help already had Sărbătoare/Aniversare right, "stime", and none of the changed sk/tr strings are quoted.
- **Register leftovers fixed (req 2):** anywhere-wall fr "votre" → "ton", sk "vaša" → "tvoja", uk "вашої" → "твоєї" ×2. Plural "you" addressed to the whole family (fr/sk/tr/uk habits-what, fr/tr family-invite tip) is kept, as the app keeps it too.
- **id register:** the app moved id to **Anda**, and the help already used Anda everywhere except the one label above. Note: `HELP-TRANSLATION-RULES.md` still says "Indonesian kamu", and the prompt calls id "informal". Both are out of date. The help now follows the app (Anda).

## Delete a category (answer from the app at v1.6.0+11, `shopping_category_sheet.dart`)
Only **custom** categories can be deleted: tap the category in **Categories**, then **Delete category** in the Edit category sheet, then confirm **Delete**. Built-in ones only have **Hidden** and **Reset to default**. I put this in the note so the article keeps 5 steps.

## The two English texts (`updated: 2026-09-25`)
- **lists-categories** note: "You can delete only the categories you added: tap one, then tap **Delete category**. Its items stay on your lists, just without a category."
- **anywhere-wall**: the paragraph after the steps now starts with "For now, the board is in English and German only."
- I translated both into all 24 languages, using the ARB label for **Delete category** in each one, and set `translatedFrom: 2026-09-25`.

## Pictures
- I committed 67 re-shot `.webp` files, all from today's 08:50–09:01 run. **No `help/media.<code>.json` changed**, so there was no manifest to commit.
- I opened 3 by eye: bg account-delete shows **АКАУНТ**, fi account-preferences shows **YLEISET**, and uk vault-photos shows **Родина**.

## Verification
- `npm run build`: **build OK**, all 28 help locales have 64 articles, 9 tips and 6 checklist rows. There is no "older than English" warning. The 17 warnings are older site-copy length ratios and are not help warnings.
- A final grep for every old label from the table finds none in `help/` (only the "tagebuch"/"barang" keywords that were kept on purpose).

## SHAs
- `9525950` docs(plan): add help wording sync prompt
- `2be819e` chore(help): re-shot pictures after the app wording fixes
- `53a040a` fix(help): texts follow the app's wording fixes; lists-categories and anywhere-wall clarified in all languages
- Pushed to `origin/main`.

## Open items for Ammar
- Run `./deploy.sh`.
- Optionally update `HELP-TRANSLATION-RULES.md`: Indonesian should be "Anda", not "kamu".
