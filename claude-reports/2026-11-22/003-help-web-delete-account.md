# 003 — Help + support page: you can delete your account on the web too

**Result:** done · **Commit:** `1f391e93` docs(help): you can delete your account on the web too — pushed to origin/main (53 files: 25 `help/*/anywhere/web.md`, 28 `content/*.json`). `./deploy.sh` was NOT run: Ammar deploys.
**Step 0:** `f38be71b` docs(plan): sync planning docs (this prompt file), pushed. No commits were held. `static/assets/img/photos/` stayed unstaged.
**Sub-agents:** none. The prompt allowed them; I wrote the translations myself in one apply script (exact-match replacements, every match checked), so there was nothing to wait for.

## One change from the prompt (word cap)
English `anywhere-web` was at 147 of 150 words. Removing "So does deleting your account." (5) and adding the prompt's sentence (18) gives 160 — red. So in English only:
- step 1 `On your computer, open app.daili.app in your browser.` → `Open app.daili.app.` (the intro sentence just above already says "On a computer … in your browser");
- the new line drops "in the menu" (step 3 just above says "Use the menu on the left").
English body now 148 words. The translations have room (cap 210 words, or the character caps), so they keep their step 1 as it was and use the prompt's full sentence, "in the menu" included. Same facts in every language.

## New lines — English
- Help (`help/en/anywhere/web.md`, own paragraph after the Notes paragraph, before the Documents line):
  `To delete your account, click your name, then **Delete account** under **Account**.`
  Documents line now ends: `… stay in the phone app.` · `updated: 2026-11-22`
- Support `deleteIntro`: `You can delete your Daili account and its data at any time, in three ways:`
- Support `deleteWays[1]` (new, between app and email): `<strong>On the web:</strong> on app.daili.app, click your name &rarr; Account &rarr; Delete account.`
- FAQ (after the first sentence): `On the web, click your name, then Delete account under Account.`

## New lines — German
- Help: `Auch dein Konto kannst du hier löschen: Klick im Menü auf deinen Namen und dann unter **Konto** auf **Konto löschen**.` · `translatedFrom: 2026-11-22`
- `deleteIntro`: `Du kannst dein Daili-Konto und die zugehörigen Daten jederzeit löschen, auf drei Wegen:`
- `deleteWays[1]`: `<strong>Im Web:</strong> auf app.daili.app auf deinen Namen klicken &rarr; Konto &rarr; Konto löschen.`
- FAQ: `Im Web klickst du auf deinen Namen und dann unter Konto auf Konto löschen.`

Button and card names come from `../daili-web/src/i18n/<lang>.ts` (`accountDelete.button`, `profile.accountTitle`; website zh-Hans = web `zh`). ar, hi, ru have no web i18n file: translated from the English (ar «حذف الحساب» / «الحساب», hi “अकाउंट डिलीट करें” / अकाउंट हटाएँ / अकाउंट, ru «Удалить аккаунт» / «Аккаунт»). Each FAQ sentence uses that file's own form of "you" and quote marks (fr/cs/tr/ru/hi formal, ja 「」, ko '', zh “” / 「」, ar/ru «»).

## Help article, per language (removed / added)
| lang | removed | added (own paragraph) |
|---|---|---|
| en | So does deleting your account. | To delete your account, click your name, then **Delete account** under **Account**. (+ step 1 shortened) |
| bg | Същото важи за изтриването на профила. | Тук можеш да изтриеш и профила си: щракни името си в менюто, после **Изтрий профила** в раздел **Акаунт**. |
| cs | Stejně tak smazání účtu. | Tady můžeš smazat i svůj účet: klikni v nabídce na své jméno a pak v sekci **Účet** na **Smazat účet**. |
| da | Det gør sletning af din konto også. | Du kan også slette din konto her: klik på dit navn i menuen og derefter på **Slet konto** under **Konto**. |
| de | Genauso das Löschen deines Kontos. | (see above) |
| el | Το ίδιο και η διαγραφή του λογαριασμού σου. | Εδώ μπορείς να διαγράψεις και τον λογαριασμό σου: … **Διαγραφή λογαριασμού** στην ενότητα **Λογαριασμός**. |
| es | Igual que eliminar tu cuenta. | También puedes eliminar tu cuenta aquí: … en **Cuenta**, en **Eliminar la cuenta**. |
| fi | Samoin tilin poistaminen. | Voit myös poistaa tilisi täällä: … **Poista tili** kohdassa **Tili**. |
| fr | Tout comme la suppression de ton compte. | Tu peux aussi supprimer ton compte ici : … **Supprimer le compte** sous **Compte**. |
| id | Begitu juga menghapus akun. | Anda juga bisa menghapus akun di sini: … **Hapus akun** di bawah **Akun**. |
| it | Così come l'eliminazione del tuo account. | Qui puoi anche eliminare il tuo account: … **Elimina l'account** sotto **Account**. |
| ja | アカウントの削除もアプリで行います。 | アカウントの削除はここでもできます（メニューで自分の名前をクリックし、**アカウント**の下にある**アカウントを削除**をクリック）。 |
| ko | 계정 삭제도 앱에서 해요. | 메뉴에서 내 이름을 클릭한 다음 **계정** 아래의 **계정 삭제**를 클릭하면 여기서 계정도 삭제할 수 있어요. |
| nb | Det gjør også sletting av kontoen. | Du kan også slette kontoen din her: … **Slett konto** under **Konto**. |
| nl | Net als je account verwijderen. | Je kunt hier ook je account verwijderen: … onder **Account** op **Account verwijderen**. |
| pl | Tak samo usunięcie konta. | Tutaj możesz też usunąć konto: … **Usuń konto** w sekcji **Konto**. |
| pt | Excluir sua conta também. | Você também pode excluir sua conta aqui: … em **Conta**, em **Excluir a conta**. |
| ro | La fel și ștergerea contului. | Tot aici îți poți șterge și contul: … la **Cont**, pe **Șterge contul**. |
| sk | Rovnako aj vymazanie účtu. | Tu môžeš vymazať aj svoj účet: … v časti **Účet** na **Vymazať účet**. |
| sv | Att radera ditt konto gör du också där. | Du kan också radera ditt konto här: … **Radera konto** under **Konto**. |
| th | การลบบัญชีก็เช่นกัน | คุณลบบัญชีที่นี่ได้ด้วย: คลิกชื่อของคุณในเมนู แล้วใต้ **บัญชี** คลิก **ลบบัญชี** |
| tr | Hesabı silmek de öyle. | Hesabını burada da silebilirsin: … **Hesap** altında **Hesabı sil** seçeneğine tıkla. |
| uk | Так само як видалення акаунта. | Тут можна видалити й акаунт: … **Видалити акаунт** у розділі **Акаунт**. |
| zh-Hans | 删除账户也一样。 | 你也可以在这里删除账户：点击菜单里你的名字，然后在**账户**下面点击**删除账户**。 |
| zh-Hant | 刪除帳號也一樣。 | 你也可以在這裡刪除帳號：按一下選單裡你的名字，再在**帳號**下面按一下**刪除帳號**。 |

## Checks on disk (script against git HEAD)
- 25 help files: front matter identical except the one date line (`updated` en, `translatedFrom` others); `since`, `mediaPending` untouched; body +2 lines (new paragraph + blank); old sentence gone; no trailing spaces.
- 28 content files: valid JSON; `deleteWays` has 3 items with the old two unchanged at positions 1 and 3; `deleteIntro` changed; FAQ ends with the same `<a {help:account-delete}>…</a>` link; every other key byte-equal to HEAD.

## Grep (`help/en`, `content/en.json`, English legal pages) — new finds, not changed
- `legal/terms.en.html` (and its translations): "You can stop using Daili and delete your account at any time in the app (Settings → Profile → Delete account)". Names only the app. Legal page, so out of scope here.
- `help/en/cycle/privacy.md:26` "Deleting your account erases the data on this phone." and `help/en/vault/where.md:22` "Deleting your account removes them from this phone straight away." Both are true for a delete made in the app. For a delete made on the web it is not clear when the phone's own data goes. Worth a check by Planning Claude.
- `privacy.en.html` Cycle line says "deleting your account in the app also deletes it on that phone": correct as written.
- Nothing else in `help/en` or `content/en.json` says deleting is app-only.

## Build
`npm run build` (foreground): exit 0 — `content OK · 28 locale(s) · 527 keys each`, `reviews OK`, `legal OK`, `help OK · 117 article(s) · 25 locales · 92 app routes checked`, `test-check-help OK`, `test-blog-i18n OK`, `build OK · 3759 pages`, `detector OK`, `help search OK`. 54 length-ratio warnings, the same 54 as at HEAD (checked with my content changes stashed). None is for `deleteIntro`, `deleteWays` or the FAQ answer; the `faq.items[14].q` warnings (pl, cs, fi) are about the unchanged question.

## Open items for Ammar
- Deploy (`./deploy.sh`) when you're happy.
- Decide whether the Terms line and the two "from this phone" help lines need a follow-up prompt.

## Help impact
anywhere-web: deleting the account now also works on the web
