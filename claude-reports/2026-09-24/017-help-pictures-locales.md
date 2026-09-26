# 017 — Help pictures in every language: check, commit, make them required

Status: done · 1,464 pictures in 24 languages committed · own-language pictures now required per `HELP_LOCALES` locale (gap list `help/media-gaps.json`, empty) · 63 alt texts fixed · `npm run build` green on the first try · pushed, not deployed

## Per-locale counts
App report 019 lists **no gaps**: every language has all 61 pictures. I checked this again on disk. Every `help/media.<code>.json` has 61 entries, every entry's file exists, no file is left over, and every `kind` matches English. The build line for every locale is now `help <code>: 0 picture(s) in English`.

| Locale | Pictures | Size | Largest |
|---|---|---|---|
| bg | 61 | 2,043 KB | 64 KB |
| cs | 61 | 1,944 KB | 60 KB |
| da | 61 | 1,961 KB | 65 KB |
| de | 61 | 2,041 KB | 68 KB |
| el | 61 | 2,157 KB | 69 KB |
| es | 61 | 2,039 KB | 68 KB |
| fi | 61 | 1,966 KB | 61 KB |
| fr | 61 | 2,067 KB | 69 KB |
| id | 61 | 2,037 KB | 71 KB |
| it | 61 | 2,010 KB | 67 KB |
| ja | 61 | 1,868 KB | 57 KB |
| ko | 61 | 1,661 KB | 54 KB |
| nb | 61 | 1,938 KB | 65 KB |
| nl | 61 | 2,031 KB | 68 KB |
| pl | 61 | 2,031 KB | 68 KB |
| pt | 61 | 2,022 KB | 68 KB |
| ro | 61 | 1,998 KB | 66 KB |
| sk | 61 | 1,975 KB | 61 KB |
| sv | 61 | 1,955 KB | 67 KB |
| th | 61 | 1,868 KB | 59 KB |
| tr | 61 | 1,935 KB | 66 KB |
| uk | 61 | 2,022 KB | 62 KB |
| zh-Hans | 61 | 1,789 KB | 56 KB |
| zh-Hant | 61 | 1,823 KB | 58 KB |
| en (already committed) | 61 | 1,896 KB | 60 KB |

**Sizes:** the 24 new languages total **46.07 MB** (1,464 files). All of `static/help/media/` is **47.92 MB**, counting English and `minzi-look-right.webp`. **No picture is over 250 KB.** The largest is 71 KB (id).

## Gaps
None. `help/media-gaps.json` is `{}`.

## The rule (commit 2)
- `help/media-gaps.json` = `{ "<locale>": { "<media id>": "<reason>" } }`. A listed gap keeps the English picture.
- In a `HELP_LOCALES` locale, an English picture that isn't a listed gap is an **error**: `help/media.de.json:1  "start-home" missing — every picture of a HELP_LOCALES locale is its own; shoot it, or list it in help/media-gaps.json with a reason`.
- A listed gap that now has its own picture is an **error** (stale). So are: a gap without a reason, a gap for an id not in `help/media.json`, a gap for a locale that isn't a built translation, and gaps written as a list.
- A help folder that isn't in `HELP_LOCALES` may still fall back to English (it's checked, not built).
- `build.mjs` prints `help <code>: N picture(s) in English` for every locale. When N > 0 it adds `(listed gaps, help/media-gaps.json)`.
- `tools/test-check-help.mjs` grew from 90 to 98 cases: each new rule is planted and caught, plus two clean cases. The fixture's listed German now lists its English pictures as gaps, and the build case checks the "1 picture(s) in English (listed gaps" line. README updated.

## The check (3+ pictures per locale, opened myself)
In every picture the ring is on the right control and the app text is in the right language. That covers 73 pictures: 3 per locale, plus a 4th in th to confirm a source. Checked:
de lists-assign, habits-tick, vault-where · nl family-roles, lists-move-items, calendar-categories · sv lists-todos, habits-what, vault-photos · da lists-assign, lists-shopping, birthdays-comments · nb family-roles, habits-streaks, meals-plan-week · fi lists-assign, calendar-edit-delete, family-children · fr family-roles, habits-tick, vault-documents · it lists-move-items, account-preferences, vault-where · es family-roles, vault-where, calendar-categories · pt lists-todos, habits-tick, notifications-choose · pl lists-assign, meals-to-shopping, birthdays-add · cs family-roles, habits-tick, lists-categories · sk lists-assign, vault-where, start-join · ro family-roles, lists-move-items, meals-search-online · tr lists-assign, calendar-categories, habits-create · el family-roles, habits-what, lists-todos · uk lists-assign, vault-photos, habits-streaks · bg family-roles, habits-tick, meals-copy-week · ja lists-assign, family-roles, habits-tick · ko lists-assign, family-roles, vault-where · zh-Hans lists-assign, family-roles, lists-move-items · zh-Hant lists-assign, family-roles, calendar-categories · th lists-assign, family-roles, vault-where, lists-todos · id lists-assign, family-roles, habits-what.

The alt texts were the problem, not the pictures. They had been translated from the English alt text before these pictures existed, so the demo data they name was translated ("Groceries" → "Dagligvarer"), not taken from the app. I found the first mismatches by eye (ja 美咲, de vault folders, sv album, da list). Then I checked every alt text that names demo data against the harness sources: `store_shots/fixtures/*.dart`, `help_shots/help_demo_strings.dart` and the ARB presets `vaultFolderPreset*` / `albumPresetFamily`. After spot-checking that these sources match the pictures, I fixed every mismatch.

## Alt texts fixed (text only, 63 in 62 files)
**People's names (12):** ja/ko/zh-Hans/zh-Hant/th/id use their own names in the pictures. `lists-assign` Lena → 美咲 / 수진(으로) / 晓燕 / 淑芬 / “หน่อย” / Sari. `family-roles` Marco → 健太 / 준호 / 志强 / 建宏 / “เอก” / Andi. The other 18 languages show Lena/Marco, so their alt texts were right.

**Demo content (51):**
- `vault-where` folders: de Wichtige Papiere, Versicherung → Wichtige Unterlagen, Versicherungen · nl Verzekering → Verzekeringen · sv Försäkring → Försäkringar · da/nb Forsikring → Forsikringer · fr Assurance → Assurances · it Assicurazione, Ricevute → Assicurazioni, Scontrini · es Papeles importantes → Documentos importantes · th รถ → รถยนต์
- `vault-documents`: de Wichtige Papiere → Wichtige Unterlagen · es Papeles importantes → Documentos importantes
- `vault-photos` album: nl Gezin → Familie · sv Familj → Familjen · da/nb Familie → Familien
- `lists-shopping` + `lists-categories` list name: de Lebensmittel → Einkaufen · sv Matvaror → Handla · da Dagligvarer → Indkøb · nb Dagligvarer → Handleliste · cs/sk Potraviny → Nákup · ro Alimente → Cumpărături · uk Продукти → Покупки · bg Хранителни стоки → Покупки · ja 食料品 → 買い物 · zh-Hans 买菜 → 购物 · th ของใช้ในครัว → ซื้อของ
- `lists-todos` list name: nb Husholdning → Husarbeid · fi Kotitalous → Kotityöt · tr Ev → Ev işleri · uk Дім → Домашні справи · bg Вкъщи → Домакинство · ja 家のこと → 家事 · zh-Hant 家務 → 家事
- `habits-tick` habit: da Udstrækning → Stræk ud · nb Tøying → Tøy ut · pt Alongar → Alongamentos · th ยืดเหยียด → ยืดเส้น

Left as they are: pl "Mleka" and cs "Mléka" (`lists-move-items`). These are the right grammatical case of the item name. In Slavic sentences the list names stay in the nominative, like the other UI labels in the same alt texts.

## Verification
- `npm run build`: check-help OK (25 locales, 57 app routes) · test-check-help OK, 98 cases · built 2034 pages · build OK · detector OK. Every locale line: `0 picture(s) in English`.
- `dist/ja/help/lists/assign/` uses `/help/media/ja/…` with the 美咲 alt text. `dist/help/zh-Hant.json` has 0 `/help/media/en/` URLs.

## Commits (pushed to origin/main)
- `4d23ea1` docs(plan): add help pictures locales prompt
- `527a3a7` chore(help): help pictures in 24 languages (1,488 files: 1,464 pictures + 24 `media.<code>.json`; one commit was fine)
- `d8db2a4` feat(help): own-language pictures required per help locale (listed gaps only)

## Notes
- Not touched: the uncommitted `changelog/whats-new.*.html`, `claude-prompts/BLOG-POST-TEMPLATE.md`, `claude/blog-seo-plan-2026-09.md` and the other untracked drafts.
- For the app (not the website): the pt `notifications-choose` picture mixes Brazilian "Lembretes (para você)" with European "Atribuídas a ti" / "que definiu num hábito". That comes from `app_pt.arb`.
- App report 019's optional items still apply: own names for bg/el/uk, and re-shooting 8 de/ja pictures from the night run. If bg/el/uk get their own names, their `lists-assign` / `family-roles` alt texts must change the same way as ja's did.

## Open item for Ammar
- Run `./deploy.sh`, then check `curl -sI https://daili.app/help/de.json` → 200, and open https://daili.app/de/help/ (the pictures should be German).
