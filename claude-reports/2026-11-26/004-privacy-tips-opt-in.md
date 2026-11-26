# Privacy: "Tips & suggestions" — a yes first, adults only, no hold-out group, legal basis consent

**Prompt:** `claude-prompts/2026-11-26/004-privacy-tips-opt-in.md`
**Completed:** 2026-11-26 · **Status:** done

## Summary

The privacy paragraph about tip notifications (`<p id="tips">`) is rewritten in all 28 privacy pages
(27 `legal/privacy.<lang>.html` + `legal/datenschutz.de.html`). It now says: a tip comes only after a yes,
only adults see the question and the switch, what we store as proof of the yes, how to take the yes back,
and the legal basis is consent. The hold-out sentence ("one account in ten"), "legitimate interest" and
"the switch is your objection" are gone in every language. Every page's "Last updated" date is now
26 November 2026. Nothing else on the pages changed.

## Files touched

- `legal/privacy.en.html` and `legal/datenschutz.de.html` — the approved English and German text, word for word.
- `legal/privacy.<lang>.html` for ar bg cs da el es fi fr hi id it ja ko nb nl pl pt ro ru sk sv th tr uk
  zh-Hans zh-Hant — the same paragraph in each language; the unchanged middle sentences kept as the file had them.
- All 28 — the date line (`<time datetime="2026-11-26">`).
- `tools/check-legal.mjs` — not changed (it already requires `id="tips"` in every language; no new rule was needed).

Prompt 003 (contacts, another privacy paragraph) has not run yet, so nothing of it was in these files.

## The English and German paragraphs as they stand now

English (`privacy.en.html`): exactly the approved text of the prompt, Requirement 1, with `&amp;` for "&"
and straight quotes as in the rest of the file. It begins "**Tips & suggestions (optional, adults only).**
Only if you say yes — in a one-time question in the app, or by switching on "Tips & suggestions" yourself —
does Daili send you …" and ends "Legal basis: your consent (Art. 6(1)(a) GDPR, § 174 TKG 2021)."

German (`datenschutz.de.html`): exactly the approved text of Requirement 2 (with „…“ quotes and `&amp;`).
It begins "**Tipps & Vorschläge (freiwillig, nur für Erwachsene).** Nur wenn du Ja sagst …" and ends
"Rechtsgrundlage: deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 174 TKG 2021)." Note: the approved text
says "höchstens einen Tipp am Tag" — that replaces the old "höchstens eine am Tag".

## How the other 26 were done

Seven helper agents (all on model claude-opus-5-5), each with a few languages. Each changed only the
`id="tips"` line of its own files. I waited for all seven, then checked on disk myself (see Verification).
App words come from the app's translation files (`../familyplanner-app/lib/l10n/app_<arb>.arb`):
switch = `settingsNotifyTips`, iPhone button = `tipTurnOffAction`, Settings / Notifications =
`settingsTitle` / `settingsSectionNotifications`. The Settings → Notifications path in every old paragraph
already matched these. The web app's "Profile & settings" stays as each file had it.
ar, hi, ru (no app translation there): the switch words of the old paragraph are kept; the button is
translated plainly (ar «إيقاف النصائح», hi “टिप्स बंद करें”, ru «Выключить советы»).
The consent article is written the way each file already writes it in its "Help improve Daili" and
"Newsletter" paragraphs (e.g. RGPD in fr/es/pt, RODO in pl, AVG in nl, ΓΚΠΔ in el, ОРЗД in bg);
"§ 174 TKG 2021" is the same in every language.

## Read against the English (5 languages)

I read **ru, zh-Hans, fr, pl, ko** sentence by sentence against the English. All five have every fact, in
the same order, and nothing extra: the yes first, "without your yes no tips", adults only (18+ or the parent
who manages the family), the unchanged how-often and which-facts sentences, the proof-of-consent sentence,
taking the yes back (switch path, web app, iPhone button, Android category on that phone only), "after that
no more tips", the export sentence, and consent as the legal basis.

## Places where a language did not follow the English word for word

Only wording; no fact added or dropped.

- **"your yes"** reads badly in some languages, so it says "your agreement/consent": fr "votre accord",
  ro "acordul tău", tr "rızanız", ar (sentence built as "does not send … unless you agree"), nb "ja-svaret ditt",
  fi "kyllä-vastaus" ("your yes answer").
- **Sentence splits:** ja and ko split sentences that English joins with a semicolon (ja and ko files already do
  that). ko keeps its old separate "for example, how to invite your partner" sentence; ja does the same.
- **tr:** the new first sentence already uses dashes, so the old "— örneğin …" became "; örneğin …".
- **"on a tip":** ru "in the tip notification", pl "przy wskazówce" — same fact, natural wording.
- **ru, cs:** the old tips paragraph uses the formal "you" (вы / vy), while their Newsletter paragraph uses the
  informal one. That mix was already there; the agents kept the tips paragraph's own form.
- **nl, da, nb, sv, fi:** "a parent who manages the family" is translated plainly; their "Help improve Daili"
  paragraph says "parent with the admin role". Same meaning, slightly different words.
- **id:** the file already uses "tombol" for the switch, so the same word now also names the iPhone button.
- **nl, da, fi:** the article citation already contains commas, so ", § 174 TKG 2021" reads a bit crowded.
  Left as the English has it.

## Facts I could not confirm

None. I did not re-check the api code; the facts come from the prompt ("checked against the code 2026-11-26").
The app words were taken from the app's working tree translation files.

## Verification

```
$ node tools/check-legal.mjs
legal OK · 2 document(s) × 28 locale(s)

$ npm run build
build OK · 3759 pages · 3728 in hreflang clusters
detector OK · 32 cases · 28 locale(s) built
help search OK · 38 cases · 2 built page(s)

$ grep -c 'id="tips"' legal/privacy.*.html legal/datenschutz.de.html
1 in each of the 28 files

$ grep -il "one account in ten\|legitimate interest in helping families get started\|jedes zehnte Konto" legal/
(nothing)
```

Also checked: `git diff` changed exactly one `<p id="tips">` line + the date line in each of the 28 files;
every tips line contains "§ 174 TKG 2021"; no double-escaped `&amp;amp;`; all 28 dates are 2026-11-26.
Self-correction: none needed.

## Commit & push

- **Step 0:** `b350e40b` — `docs(plan): sync planning docs` (prompts 004 and 005), pushed.
  `static/assets/img/photos/` stays untracked and untouched, as in earlier runs.
- **Commit:** `988c8798` — `docs(legal): privacy — tips need a yes first, adults only, no hold-out group, legal basis consent (#409)`
- **Push:** `origin/main` — together with this report (see the report commit). Not deployed.

## Help impact

none (the help line rides list #47).

## Open items for the owner

- Deploy the website: `cd ~/development/flutter_projects/familyplanner/daili-website && ./deploy.sh`.
  It may go live right away (the text is already true: tips are off and need a yes), and it MUST be live
  before tips are turned on again (#408).

## Deviations from prompt

None.
