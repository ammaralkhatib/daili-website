# 003 — reviews in every page language, original one tap away — done

- **Data:** each `REVIEWS` entry has a stable `id` (`valentino-2026-10-31`, `willoo98-2026-10-02`, `kathii19866-2026-10-26`, `cordis23-2026-10-01`, `google-play-user-2026-10-30`, `agranger3722-2026-09-16`, `marc-a-2026-10-19`). The doc comment says ids never change and that adding a review means adding its translation to every `content/reviews/<loc>.json`. There are 28 new files with 189 translations: en and de by me, the other 26 by four Opus 5.5 sub-agents. I checked the files on disk with the new guard. `home.reviews.{translated,original,anonymous}` is in all 28 `content/<loc>.json` (en has `@`-descriptions). Where the language name would need declining, the label uses a "…: {language}" form (e.g. de "Übersetzt aus: Italienisch", pl/cs/sk/ru/uk/fi/fr/it/tr), because `Intl.DisplayNames` gives only the nominative.
- **Card** (`build.mjs`, `home.css`): a translated card shows the translated title and text (lang = page) and, at its foot, one line "Translated from Italian · Show original". That line is the `<summary>` of a `<details>`, `--ink3` 12.5 px, the link in `--forest`, 3 px focus ring, 24 px tall. Open, it shows the original title and text (lang = review, `dir="auto"`, so the Italian reads LTR on `/ar/`) behind a thin inline-start rule. Original cards are unchanged. The row pauses while a `<details>` is open or anything in it has focus (`:has(details[open])`, `:focus-within`); hover pause and reduced motion are unchanged. No JS.
- **Decision — copy set:** I used `tabindex="-1"` on its summaries rather than `inert`. With `inert`, "Show original" on half the visible cards (the loop's copy) would do nothing when clicked or tapped. Tab never reaches the copy (tested below).
- **Note:** a sub-agent pointed out that Google Play's own anonymous label is "A Google user", not "Google Play user". I kept the prompt's wording; say if you want it changed.

## Translations (en / de pages)

| review | en page | de page |
|---|---|---|
| Valentino (it) | Really great, full of excellent features. I've used loads of calendars, mostly to share them, paid ones too. This app beats them all, there's no feature it's missing. Real compliments to whoever made it | Wirklich super, voller ausgezeichneter Funktionen. Ich habe schon sehr viele Kalender benutzt, vor allem um sie zu teilen, auch kostenpflichtige. Diese App übertrifft sie alle, es fehlt keine einzige Funktion. Wirklich ein Kompliment an alle, die sie gemacht haben |
| willoo98 (en) | *original* | **Vollständige und durchdachte App** — Google Calendar wurde etwas zu kompliziert, vor allem für meine älter werdenden Eltern. Diese App ist perfekt für unsere Terminplanung. Sie hat eine einfache und intuitive Oberfläche, deshalb haben sich meine Eltern leicht daran gewöhnt. Weil man mehrere Familien verwalten kann, kann ich auch mit meinen Freundesgruppen Termine planen! Ein Lob an die Entwickler, ich werde die App ab jetzt nutzen. |
| Kathii19866 (de) | **Surprisingly good!** — I came across this app while looking for one that would let me juggle our family's organising with my husband and three kids. After downloading three other well-known apps and not finding what I was looking for, I was all the more surprised that the features here are really good. … Really well thought out! | *original* |
| Cordis23 (cs) | **Great app** — A great app for the family: sharing to-dos and shopping, assigning who does what, a shared calendar. We're still getting used to it, but I'm already very happy. I recommend downloading it | **Tolle App** — Tolle App für die Familie: Aufgaben und Einkäufe teilen, festlegen, wer was macht, gemeinsamer Kalender. Wir gewöhnen uns noch daran, aber ich bin schon jetzt sehr zufrieden. Ich empfehle, sie herunterzuladen |
| Google Play user (de) | Exactly what I was looking for! Everything you need to keep track of things as a family and make everyday life easier. On top of that, fantastic support that answers questions very quickly and acts on requests! | *original* (name shown as "Google Play-Nutzer") |
| agranger3722 (en) | *original* | **Tolle App** — Diese App hat alles, was ich brauche, um Aufgaben, Essenspläne für die Familie und mehr zu erstellen. Ich liebe die Funktionen. Kein Schnickschnack. |
| Marc A. (de) | Very happy so far. Everything runs smoothly and it's intuitive to use. The shopping list in particular is great. | *original* |

## Guards (planted → red, restored → green; `git diff` clean after)

- a (`tools/check-reviews.mjs`, new, in `npm run build` after check-content): deleting `cordis23` from `ja` → `ja cordis23-2026-10-01 MISSING`; a stale id in `sv` → `unknown or stale id`; a dropped title in `pl` → fields error.
- b: Marc's German original copied into `fr` → `byte-identical to the original — untranslated`.
- c: an empty `valentino` text in `ko` → `empty or not a string`.
- d (`check-build` §15): one original word edited in built `de/index.html` (main text) and in `ja/index.html` (inside `<details>`) → `do not carry exactly REVIEWS' 7 reviews' original words`.
- e: label dropped on one card in `index.html` → `shows a translation but has no "Translated from" label`; a label plus `<details>` added to an original card on `de` → `shows the original but has … label`.
- f: translated `<p lang="ar">` changed to `lang="it"` → `translated words have lang="it", expected the page's "ar"`.
- extra: a focusable `<summary>` in the `aria-hidden` copy (`fr`) → `can take keyboard focus`.

## Verify

- Cards: en 2 originals + 5 translated · de 3 + 4 · ja 0 + 7 · ar 0 + 7 (RTL; label and link on the reading side).
- Tallest card at 1440: **319 → 379 px (de, +19 %)**; ja 344, en 335, ar 292. Equal heights in the row, the same at 390. With one card open: de 432, ja 414 (the whole row grows with it, since all cards stretch). Nothing overflows and the page has no horizontal scroll (de, ja, ar at 1440 and 390).
- Paused while open (de, ja at 1440): moving before → same transform for 1.5 s while open → moving again after close. Focus pauses it too.
- Keyboard (CDP Tab from `#reviews`): ja → the 7 visible cards' summaries in order, then the store badges; de → its 4 translated cards, then the badges. The copy set never takes focus.
- Shots: `claude-reports/2026-11-03/003-shots/` (de-1440-open, de-390, ja-1440, ja-390-open, ar-1440-open). Minor: on ja the anonymous who-line ("Google Play ユーザー · Google Play · 2026年10月30日") wraps its last character at 340 px.
- Build: plain `npm run build` exit 0, `reviews OK · 7 review(s) · 189 translation(s) in 28 locale(s)` … `build OK · 3308 pages · 3278 in hreflang clusters` … `help search OK · 26 cases · 2 built page(s)`.
- Commit `193b51b` `feat(home): reviews translated into every page language, original one tap away`, pushed (`92f5bba..193b51b`). Step 0: `92f5bba` (report 002). `./deploy.sh` not run. This report and `003-shots/` stay untracked for the next step 0; `static/assets/img/photos/` untouched.

## Help impact

None.
