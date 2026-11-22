# Help + support page: you can now delete your account on the web too

## Why
List item #245 (Ammar 2026-11-22: "Yes, write it"). Since today's web deploy (daili-web `2026-11-22/001`,
commit `cb314cf`), app.daili.app has its own **Delete account** button: click your name in the menu, then
**Delete account** under **Account**. Three texts on daili.app now say or suggest that deleting only works in
the phone app or by email:

1. `help/<lang>/anywhere/web.md` ("Use daili in your browser"), English line 22:
   `Documents, Photos, recording voice and the notes' AI helpers stay in the phone app. So does deleting your account.`
   → **wrong** since today.
2. `content/<lang>.json` support page: `deleteIntro` ("…at any time, in two ways:") + `deleteWays` (In the
   app · By email) → incomplete: the web way is missing.
3. `content/<lang>.json` FAQ "How do I delete my account?" (en `content/en.json` ~:435–436) → names only
   the app.

Planning Claude checked these by grep on 2026-11-22. Nothing else on the site says it (grep for
"So does deleting" and "delete" in `help/en` and `content/en.json`); check once more with your own grep and
name anything new in the report — but change only the three places above.

## Requirements
1. **`help/<lang>/anywhere/web.md`, all 25 help languages:** remove ONLY the last sentence of that paragraph
   (en `So does deleting your account.`, de `Genauso das Löschen deines Kontos.`, and the same sentence in
   every other language — in some languages it is part of the sentence before, e.g. ja
   `アカウントの削除もアプリで行います。`; keep the rest of the paragraph intact and natural). Then add ONE
   short sentence at the end of step 3's paragraph or as its own line after the Notes paragraph:
   en `You can also delete your account here: click your name in the menu, then **Delete account** under **Account**.`
   de `Auch dein Konto kannst du hier löschen: Klick im Menü auf deinen Namen und dann unter **Konto** auf **Konto löschen**.`
   Use the exact web button and card names of each language from `../daili-web/src/i18n/<lang>.ts`
   (`accountDelete.button`, `profile.accountTitle`; zh-Hans on the website = `zh` on the web). English
   `updated: 2026-11-22`; every translation `translatedFrom: 2026-11-22`. Do not change `since`,
   `mediaPending` or anything else in the front matter. The word limits of `tools/check-help.mjs` must
   stay green.
2. **Support page, all 28 `content/*.json`:** `deleteIntro` "two ways" → "three ways" (in each language's
   own words); add a third item to `deleteWays`, between "In the app" and "By email":
   en `<strong>On the web:</strong> on app.daili.app, click your name &rarr; Account &rarr; Delete account.`
   de `<strong>Im Web:</strong> auf app.daili.app auf deinen Namen klicken &rarr; Konto &rarr; Konto löschen.`
   Same HTML style as the two existing items. Button / card names from the web i18n as in point 1. For ar,
   hi, ru (no web i18n file): translate from the English and say so in the report.
3. **FAQ "How do I delete my account?", all 28 `content/*.json`:** add ONE short sentence after the first
   sentence: en `On the web, click your name, then Delete account under Account.` · de
   `Im Web klickst du auf deinen Namen und dann unter Konto auf Konto löschen.` Keep the rest of the answer
   and its `<a {help:account-delete}>` link unchanged.
4. Other locales: you may use sub-agents for the translations; each MUST use model claude-opus-5-5, and
   you wait for all of them before the commit. Check every changed file on disk afterwards (the sentence is
   gone, the new sentence is there, valid JSON, front matter kept byte-for-byte except the date line).
5. Only `help/*/anywhere/web.md` and `content/*.json` change. No legal page, no template, no CHANGELOG.
   🔴 Do NOT stage `static/assets/img/photos/` (not ours).
6. 🔴 Report trap: the run script stops when any line of the report contains the word "status" and the
   word "blocked" together. Use the word "blocked" ONLY if you really are blocked.

## Build
`npm run build` in the FOREGROUND passes (`content OK`, `help OK`, `build OK`). The usual length-ratio
warnings are fine; name any NEW warning for the keys you changed.

## Commit & push
`docs(help): you can delete your account on the web too`; body
`Prompt: claude-prompts/2026-11-22/003-help-web-delete-account.md`. **Push now. Do NOT run `./deploy.sh`** —
Ammar deploys.

## Report
`claude-reports/2026-11-22/003-help-web-delete-account.md` (file-write tool; `wc -c` > 0), short: the new
EN + DE lines in full (help, support, FAQ), per language one line "removed / added" for the help article,
anything new your grep found, build result, SHA + push.
`## Help impact`: `anywhere-web: deleting the account now also works on the web`.
